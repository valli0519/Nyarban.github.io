#!/usr/bin/env python
r"""Generate manifest-driven MiniMax H3 scene videos for both replay campaigns.

The H3 inference stays at the proven 0.4 MP profile. Finished clips are joined,
upscaled to 1280x720 with Lanczos, stripped of audio, and copied to both the
Git repository and the ``F:\code`` site mirror. One GPU worker runs at a time.
"""

from __future__ import annotations

import argparse
import copy
from fractions import Fraction
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.request


H3_ROOT = Path(r"F:\AI\MiniMax-H3")
WORKFLOW = H3_ROOT / "optimization" / "workflows" / "H3_I2V_RECOMMENDED.json"
CONVERTER = H3_ROOT / "scripts" / "workflow_to_api.py"
H3_VIDEO_DIR = H3_ROOT / "output" / "video"
H3_INPUT_DIR = H3_ROOT / "input"
STATE_DIR = H3_ROOT / "temp" / "cinematic-batch"
PARTS_DIR = STATE_DIR / "parts"
REPO_ROOT = Path(__file__).resolve().parents[1]
MIRROR_ROOT = Path(r"F:\code")
DEFAULT_MANIFEST = Path(__file__).with_name("cinematic_video_jobs.json")
MIN_FREE_GIB = 20
WARN_FREE_GIB = 25


def request_json(url: str, payload: dict | None = None, timeout: int = 180) -> dict:
    data = None if payload is None else json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"} if data else {},
    )
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        body = error.read().decode("utf-8", "replace")
        raise RuntimeError(f"HTTP {error.code} from {url}: {body[:4000]}") from error


def hash_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def inside(path: Path, root: Path) -> Path:
    resolved = path.resolve()
    resolved.relative_to(root.resolve())
    return resolved


def relative_path(root: Path, value: str) -> Path:
    return inside(root / Path(value), root)


def copy_atomic(source: Path, destination: Path) -> None:
    source = source.resolve()
    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.is_file() and hash_file(source) == hash_file(destination):
        return
    temporary = destination.with_name(f"{destination.name}.copying")
    shutil.copy2(source, temporary)
    if hash_file(source) != hash_file(temporary):
        raise RuntimeError(f"Copy verification failed: {destination}")
    os.replace(temporary, destination)


def free_gib() -> float:
    return shutil.disk_usage(H3_ROOT.anchor).free / 1024**3


def check_disk() -> float:
    available = free_gib()
    if available < MIN_FREE_GIB:
        raise RuntimeError(f"F: free space is {available:.1f} GiB; hard stop is {MIN_FREE_GIB} GiB")
    if available < WARN_FREE_GIB:
        print(f"WARNING: F: free space is {available:.1f} GiB", flush=True)
    return available


def one_node(graph: dict, class_type: str) -> tuple[str, dict]:
    matches = [(node_id, node) for node_id, node in graph.items() if node["class_type"] == class_type]
    if len(matches) != 1:
        raise RuntimeError(f"Expected one {class_type} node, found {len(matches)}")
    return matches[0]


def convert_workflow(server: str) -> dict:
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    output = STATE_DIR / "h3-base-api.json"
    subprocess.run(
        [sys.executable, str(CONVERTER), str(WORKFLOW), str(output), "--server", server],
        check=True,
    )
    return json.loads(output.read_text(encoding="utf-8"))


def load_manifest(path: Path) -> tuple[Path, list[dict]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    source_root = Path(data["source_root"])
    jobs = data.get("jobs") or []
    seen: set[str] = set()
    for job in jobs:
        job_id = job["id"]
        if job_id in seen:
            raise RuntimeError(f"Duplicate job id: {job_id}")
        seen.add(job_id)
        frames = job.get("source_frames") or []
        web_frames = job.get("web_frames") or []
        transitions = job.get("transitions") or []
        if len(frames) < 2 or len(web_frames) != len(frames) or len(transitions) != len(frames) - 1:
            raise RuntimeError(f"Invalid frame/transition counts for {job_id}")
        relative_path(REPO_ROOT, job["output"])
        for source in frames:
            if not relative_path(source_root, source).is_file():
                raise FileNotFoundError(relative_path(source_root, source))
        for web_frame in web_frames:
            relative_path(REPO_ROOT, web_frame)
    return source_root, jobs


def ffmpeg_path() -> str:
    executable = shutil.which("ffmpeg")
    if not executable:
        raise RuntimeError("ffmpeg was not found in PATH")
    return executable


def make_web_frame(source: Path, destination: Path, force: bool) -> None:
    if destination.is_file() and not force:
        return
    destination.parent.mkdir(parents=True, exist_ok=True)
    temporary = destination.with_name(f"{destination.stem}.encoding.webp")
    subprocess.run(
        [
            ffmpeg_path(),
            "-y",
            "-loglevel",
            "error",
            "-i",
            str(source),
            "-vf",
            "scale=1600:900:force_original_aspect_ratio=increase,crop=1600:900",
            "-frames:v",
            "1",
            "-c:v",
            "libwebp",
            "-quality",
            "82",
            str(temporary),
        ],
        check=True,
    )
    os.replace(temporary, destination)


def stage_job_frames(job: dict, source_root: Path, force: bool) -> tuple[list[str], list[Path]]:
    h3_names: list[str] = []
    staged_inputs: list[Path] = []
    for index, (source_value, web_value) in enumerate(
        zip(job["source_frames"], job["web_frames"], strict=True), start=1
    ):
        source = relative_path(source_root, source_value)
        h3_name = f"cinematic-{job['id']}-{index:02d}{source.suffix.lower()}"
        h3_destination = inside(H3_INPUT_DIR / h3_name, H3_INPUT_DIR)
        H3_INPUT_DIR.mkdir(parents=True, exist_ok=True)
        copy_atomic(source, h3_destination)
        h3_names.append(h3_name)
        staged_inputs.append(h3_destination)

        repo_frame = relative_path(REPO_ROOT, web_value)
        make_web_frame(source, repo_frame, force)
        mirror_frame = relative_path(MIRROR_ROOT, web_value)
        copy_atomic(repo_frame, mirror_frame)
    return h3_names, staged_inputs


def prepare_graph(base: dict, job: dict, transition_index: int, first: str, last: str) -> tuple[dict, str]:
    transition = job["transitions"][transition_index]
    graph = copy.deepcopy(base)
    load_id, load = one_node(graph, "LoadImage")
    _, h3 = one_node(graph, "MiniMaxH3ImageToVideo")
    _, noise = one_node(graph, "RandomNoise")
    _, resolution = one_node(graph, "ResolutionSelector")
    _, duration = one_node(graph, "PrimitiveFloat")
    _, save = one_node(graph, "SaveVideo")

    last_id = f"cinematic:last:{transition_index + 1}"
    graph[last_id] = {
        "class_type": "LoadImage",
        "inputs": {"image": last},
        "_meta": {"title": "Last frame"},
    }
    load["inputs"]["image"] = first
    h3["inputs"].update(
        first_frame=[load_id, 0],
        last_frame=[last_id, 0],
        prompt=transition["prompt"],
    )
    noise["inputs"]["noise_seed"] = transition["seed"]
    resolution["inputs"].update(
        aspect_ratio="16:9 (Widescreen)",
        megapixels=0.4,
        multiple=32,
    )
    duration["inputs"]["value"] = 5
    prefix = f"cinematic-{job['id']}-p{transition_index + 1:02d}"
    save["inputs"]["filename_prefix"] = f"video/{prefix}"
    return graph, prefix


def wait_for_prompt(server: str, prompt_id: str, timeout: int) -> dict:
    started = time.monotonic()
    next_report = 30
    while True:
        elapsed = time.monotonic() - started
        if elapsed > timeout:
            raise TimeoutError(f"Timed out after {timeout} seconds")
        history = request_json(f"{server}/history/{prompt_id}", timeout=120)
        if prompt_id in history:
            result = history[prompt_id]
            status = result.get("status") or {}
            state = status.get("status_str")
            if status.get("completed") or state in {"success", "error"}:
                if state == "error":
                    raise RuntimeError(json.dumps(status.get("messages") or [], ensure_ascii=False)[:5000])
                return result
        if elapsed >= next_report:
            print(f"      generating... {elapsed / 60:.1f} min", flush=True)
            next_report += 30
        time.sleep(5)


def newest_output(prefix: str, before: set[Path]) -> Path:
    candidates = [path for path in H3_VIDEO_DIR.glob(f"{prefix}*.mp4") if path not in before]
    if not candidates:
        raise RuntimeError(f"No new H3 output found for {prefix}")
    return max(candidates, key=lambda path: path.stat().st_mtime_ns)


def validate_video(path: Path, *, final: bool) -> dict:
    result = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "stream=codec_type,codec_name,width,height,avg_frame_rate:format=duration,size",
            "-of",
            "json",
            str(path),
        ],
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    probe = json.loads(result.stdout)
    streams = probe.get("streams") or []
    video_streams = [stream for stream in streams if stream.get("codec_type") == "video"]
    audio_streams = [stream for stream in streams if stream.get("codec_type") == "audio"]
    if len(video_streams) != 1:
        raise RuntimeError(f"Expected one video stream: {path}")
    if final:
        video = video_streams[0]
        frame_rate = float(Fraction(video.get("avg_frame_rate") or "0/1"))
        duration = float((probe.get("format") or {}).get("duration") or 0)
        if (
            video.get("codec_name") != "h264"
            or video.get("width") != 1280
            or video.get("height") != 720
            or abs(frame_rate - 24) > 0.01
            or duration <= 0
            or audio_streams
        ):
            raise RuntimeError(f"Final video validation failed: {path}")
    return probe


def remove_owned_file(path: Path, root: Path, prefix: str) -> None:
    resolved = inside(path, root)
    if not resolved.name.startswith(prefix) or not resolved.is_file():
        raise RuntimeError(f"Refusing to remove unexpected file: {resolved}")
    resolved.unlink()


def generate_transition(
    server: str,
    base: dict,
    job: dict,
    transition_index: int,
    first: str,
    last: str,
    timeout: int,
    force: bool,
) -> Path:
    PARTS_DIR.mkdir(parents=True, exist_ok=True)
    part = inside(PARTS_DIR / f"{job['id']}-p{transition_index + 1:02d}.mp4", PARTS_DIR)
    if part.is_file() and not force:
        validate_video(part, final=False)
        print(f"    [{transition_index + 1}/{len(job['transitions'])}] reuse {part.name}")
        return part

    check_disk()
    graph, prefix = prepare_graph(base, job, transition_index, first, last)
    graph_path = STATE_DIR / f"{prefix}-api.json"
    graph_path.write_text(json.dumps(graph, ensure_ascii=False, indent=2), encoding="utf-8")
    H3_VIDEO_DIR.mkdir(parents=True, exist_ok=True)
    before = set(H3_VIDEO_DIR.glob("*.mp4"))
    print(f"    [{transition_index + 1}/{len(job['transitions'])}] generate {prefix}", flush=True)
    response = request_json(
        f"{server}/prompt",
        {"prompt": graph, "client_id": f"cinematic-batch-{job['id']}"},
        timeout=180,
    )
    if response.get("node_errors"):
        raise RuntimeError(json.dumps(response["node_errors"], ensure_ascii=False)[:5000])
    prompt_id = response.get("prompt_id")
    if not prompt_id:
        raise RuntimeError(f"ComfyUI did not return a prompt_id: {response}")
    wait_for_prompt(server, prompt_id, timeout)
    generated = newest_output(prefix, before)
    validate_video(generated, final=False)
    copy_atomic(generated, part)
    remove_owned_file(generated, H3_VIDEO_DIR, prefix)
    return part


def encode_final(parts: list[Path], destination: Path, force: bool) -> None:
    if destination.is_file() and not force:
        validate_video(destination, final=True)
        return
    destination.parent.mkdir(parents=True, exist_ok=True)
    temporary = destination.with_name(f"{destination.stem}.encoding.mp4")
    command = [ffmpeg_path(), "-y", "-loglevel", "error"]
    for part in parts:
        command.extend(["-i", str(part)])
    inputs = "".join(f"[{index}:v:0]" for index in range(len(parts)))
    filter_graph = (
        f"{inputs}concat=n={len(parts)}:v=1:a=0[joined];"
        "[joined]scale=1280:720:force_original_aspect_ratio=increase:flags=lanczos,"
        "crop=1280:720,setsar=1[outv]"
    )
    command.extend(
        [
            "-filter_complex",
            filter_graph,
            "-map",
            "[outv]",
            "-an",
            "-r",
            "24",
            "-c:v",
            "libx264",
            "-preset",
            "medium",
            "-crf",
            "23",
            "-pix_fmt",
            "yuv420p",
            "-profile:v",
            "high",
            "-level",
            "4.0",
            "-g",
            "12",
            "-keyint_min",
            "12",
            "-sc_threshold",
            "0",
            "-movflags",
            "+faststart",
            str(temporary),
        ]
    )
    subprocess.run(command, check=True)
    validate_video(temporary, final=True)
    os.replace(temporary, destination)


def write_result(job: dict, source_root: Path, destination: Path, probe: dict, before_free: float) -> None:
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    result = {
        "job_id": job["id"],
        "campaign": job["campaign"],
        "chapter": job["chapter"],
        "title": job["title"],
        "source_frames": [
            {
                "path": value,
                "sha256": hash_file(relative_path(source_root, value)),
            }
            for value in job["source_frames"]
        ],
        "output": job["output"],
        "output_sha256": hash_file(destination),
        "ffprobe": probe,
        "free_gib_before": round(before_free, 2),
        "free_gib_after": round(free_gib(), 2),
        "completed_at": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
    }
    (STATE_DIR / f"{job['id']}-result.json").write_text(
        json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8"
    )


def cleanup_job(job_id: str, parts: list[Path], staged_inputs: list[Path], keep_parts: bool) -> None:
    if not keep_parts:
        for part in parts:
            if part.is_file():
                remove_owned_file(part, PARTS_DIR, f"{job_id}-p")
    for staged in staged_inputs:
        if staged.is_file():
            remove_owned_file(staged, H3_INPUT_DIR, "cinematic-")


def run_job(
    server: str,
    base: dict,
    job: dict,
    source_root: Path,
    timeout: int,
    force: bool,
    keep_parts: bool,
) -> None:
    available = check_disk()
    print(f"[{job['campaign']} ch{job['chapter']}] {job['title']} (free {available:.1f} GiB)", flush=True)
    h3_frames, staged_inputs = stage_job_frames(job, source_root, force)
    destination = relative_path(REPO_ROOT, job["output"])
    if destination.is_file() and not force:
        probe = validate_video(destination, final=True)
        mirror_destination = relative_path(MIRROR_ROOT, job["output"])
        copy_atomic(destination, mirror_destination)
        write_result(job, source_root, destination, probe, available)
        cleanup_job(job["id"], [], staged_inputs, keep_parts)
        print(f"    skip verified {destination.name}")
        return
    parts: list[Path] = []
    try:
        for index in range(len(job["transitions"])):
            parts.append(
                generate_transition(
                    server,
                    base,
                    job,
                    index,
                    h3_frames[index],
                    h3_frames[index + 1],
                    timeout,
                    force,
                )
            )
        encode_final(parts, destination, force)
        mirror_destination = relative_path(MIRROR_ROOT, job["output"])
        copy_atomic(destination, mirror_destination)
        if hash_file(destination) != hash_file(mirror_destination):
            raise RuntimeError(f"Mirror verification failed: {mirror_destination}")
        probe = validate_video(destination, final=True)
        write_result(job, source_root, destination, probe, available)
        size_mib = destination.stat().st_size / 1024**2
        duration = float(probe["format"]["duration"])
        print(f"    wrote {destination.name} ({size_mib:.2f} MiB, {duration:.2f}s, 1280x720, silent)")
        cleanup_job(job["id"], parts, staged_inputs, keep_parts)
    except Exception:
        print(f"    kept resumable parts for {job['id']}", flush=True)
        raise


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--server", default="http://127.0.0.1:8188")
    parser.add_argument("--job", action="append")
    parser.add_argument("--campaign", action="append", choices=["lv1_2nd", "haikara"])
    parser.add_argument("--timeout", type=int, default=5400)
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--keep-parts", action="store_true")
    parser.add_argument("--prepare-only", action="store_true")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    source_root, jobs = load_manifest(args.manifest.resolve())
    selected_ids = set(args.job or [])
    selected_campaigns = set(args.campaign or [])
    selected = [
        job
        for job in jobs
        if (not selected_ids or job["id"] in selected_ids)
        and (not selected_campaigns or job["campaign"] in selected_campaigns)
    ]
    unknown = selected_ids - {job["id"] for job in jobs}
    if unknown:
        raise RuntimeError(f"Unknown job ids: {', '.join(sorted(unknown))}")
    if not selected:
        raise RuntimeError("No jobs selected")

    if args.prepare_only:
        for job in selected:
            _, staged_inputs = stage_job_frames(job, source_root, args.force)
            cleanup_job(job["id"], [], staged_inputs, args.keep_parts)
        print(f"Prepared {len(selected)} job(s) without GPU generation")
        return 0

    server = args.server.rstrip("/")
    request_json(f"{server}/system_stats", timeout=30)
    base = convert_workflow(server)
    for job in selected:
        run_job(server, base, job, source_root, args.timeout, args.force, args.keep_parts)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
