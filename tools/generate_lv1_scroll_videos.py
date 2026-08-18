#!/usr/bin/env python
r"""Generate the Lv1 2nd scroll-transition clips with local MiniMax H3.

Start ``F:\AI\MiniMax-H3\optimization\scripts\run_h3_recommended.bat``,
then run this file. It copies the ten web source frames into the H3 input
directory automatically. Use ``--clip 4`` to regenerate one transition and
``--force`` to replace its web-ready copy.
"""

from __future__ import annotations

import argparse
import copy
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
TEMP_DIR = H3_ROOT / "temp"
REPO_ROOT = Path(__file__).resolve().parents[1]
WEB_IMAGE_DIR = REPO_ROOT / "img" / "scroll-lv1-2nd"
WEB_VIDEO_DIR = REPO_ROOT / "video" / "scroll-lv1-2nd"

SOURCE_IMAGES = [
    "01-mountain.webp",
    "02-crystal-tree.webp",
    "03-tavern.webp",
    "04-pirate-battle.webp",
    "05-harbor.webp",
    "06-kraken.webp",
    "07-guild.webp",
    "08-descent.webp",
    "09-island-road.webp",
    "10-gate.webp",
]


CLIPS = [
    {
        "slug": "01-mountain-to-crystal-tree",
        "first": "lv1-scroll-01.webp",
        "last": "lv1-scroll-02.webp",
        "seed": 812401,
        "prompt": (
            "One continuous cinematic shot, no cuts. The scene begins exactly on Picture 1: "
            "a fantasy party facing each other in a bright alpine meadow beneath a snowy mountain. "
            "Wind moves grass, hair, capes, and clouds while the camera glides low between the heroes, "
            "then accelerates forward past them. Purple magical sparks gather around the red-tipped staff "
            "and streak past the lens, transforming the meadow into the luminous crystal-tree battlefield "
            "shown exactly in Picture 2. Preserve every character's face, clothing, weapons, proportions, "
            "and polished 2D fantasy illustration style. End exactly on Picture 2. Epic wind and magical "
            "energy, no dialogue. No text, subtitles, logos, or watermarks."
        ),
    },
    {
        "slug": "02-tavern-to-deck-battle",
        "first": "lv1-scroll-03.webp",
        "last": "lv1-scroll-04.webp",
        "seed": 812402,
        "prompt": (
            "One continuous cinematic shot, no cuts. Begin exactly on Picture 1 with the four adventurers "
            "sharing a warm meal inside the wooden tavern. Firelight flickers, steam rises from the dishes, "
            "and hair and clothing move subtly. The camera pushes across the table into a dark round window; "
            "a sudden gust, sea spray, and whipping ropes carry the lens through the opening onto a stormy "
            "ship deck. The same heroes resolve into the dynamic pirate battle composition shown exactly in "
            "Picture 2. Preserve faces, costumes, weapons, anatomy, and the detailed 2D fantasy illustration "
            "style. End exactly on Picture 2. Wind, creaking wood, and distant surf, no dialogue. No text, "
            "subtitles, logos, or watermarks."
        ),
    },
    {
        "slug": "03-harbor-to-kraken",
        "first": "lv1-scroll-05.webp",
        "last": "lv1-scroll-06.webp",
        "seed": 812403,
        "prompt": (
            "One continuous cinematic shot, no cuts. Start exactly on Picture 1: the adventuring party stands "
            "at a grand sunlit fantasy harbor. Flags and coats stir in the salt wind as the camera circles the "
            "group and rushes past them toward the blue water. A towering wave fills the lens; the camera dives "
            "through foam into deep storm-dark water where huge kraken tentacles coil into view around the same "
            "heroes, arriving exactly at Picture 2. Preserve all character faces, clothing, weapons, anatomy, "
            "and the painterly 2D fantasy illustration style. End exactly on Picture 2. Roaring surf and deep "
            "underwater rumble, no dialogue. No text, subtitles, logos, or watermarks."
        ),
    },
    {
        "slug": "04-guild-to-descent",
        "first": "lv1-scroll-07.webp",
        "last": "lv1-scroll-08.webp",
        "seed": 812404,
        "prompt": (
            "One continuous cinematic shot, no cuts. Begin exactly on Picture 1 inside the timber guild hall, "
            "where the adventurers study a wall map. The camera tracks behind the blond swordsman toward the "
            "map while warm window light flickers across the group. Blue runes awaken on the parchment and "
            "become a spinning tunnel; the camera plunges through it, rotating gently as stone, ropes, dust, and "
            "blue magic sweep past. The party appears descending through the vast ruined cavern exactly as in "
            "Picture 2. Preserve faces, costumes, weapons, body shapes, and the detailed 2D fantasy illustration "
            "style. End exactly on Picture 2. Rushing air and cavern echoes, no dialogue. No text, subtitles, "
            "logos, or watermarks."
        ),
    },
    {
        "slug": "05-island-road-to-gate",
        "first": "lv1-scroll-09.webp",
        "last": "lv1-scroll-10.webp",
        "seed": 812405,
        "prompt": (
            "One continuous cinematic shot, no cuts. Begin exactly on Picture 1 behind the adventuring party "
            "walking along a bright stone road above a tropical blue sea. Hair, capes, banners, and distant "
            "clouds move in the ocean wind. The camera follows, slips between the heroes, and races toward the "
            "island city; arcs of blue light form a circular portal around the lens. The camera passes through "
            "the glowing vortex and emerges before the monumental ancient gate, with the party assembled exactly "
            "as in Picture 2. Preserve every face, costume, weapon, anatomy, and the polished 2D fantasy "
            "illustration style. End exactly on Picture 2. Ocean wind and resonant portal energy, no dialogue. "
            "No text, subtitles, logos, or watermarks."
        ),
    },
]


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


def one_node(graph: dict, class_type: str) -> tuple[str, dict]:
    matches = [(node_id, node) for node_id, node in graph.items() if node["class_type"] == class_type]
    if len(matches) != 1:
        raise RuntimeError(f"Expected one {class_type} node, found {len(matches)}")
    return matches[0]


def convert_workflow(server: str) -> dict:
    TEMP_DIR.mkdir(parents=True, exist_ok=True)
    output = TEMP_DIR / "lv1-scroll-base-api.json"
    subprocess.run(
        [sys.executable, str(CONVERTER), str(WORKFLOW), str(output), "--server", server],
        check=True,
    )
    return json.loads(output.read_text(encoding="utf-8"))


def sync_input_frames() -> None:
    H3_INPUT_DIR.mkdir(parents=True, exist_ok=True)
    for number, filename in enumerate(SOURCE_IMAGES, start=1):
        source = WEB_IMAGE_DIR / filename
        destination = H3_INPUT_DIR / f"lv1-scroll-{number:02d}.webp"
        if not source.is_file():
            raise FileNotFoundError(source)
        if destination.is_file() and destination.read_bytes() == source.read_bytes():
            continue
        shutil.copy2(source, destination)


def prepare_graph(base: dict, clip: dict) -> dict:
    graph = copy.deepcopy(base)
    load_id, load = one_node(graph, "LoadImage")
    _, h3 = one_node(graph, "MiniMaxH3ImageToVideo")
    _, noise = one_node(graph, "RandomNoise")
    _, resolution = one_node(graph, "ResolutionSelector")
    _, duration = one_node(graph, "PrimitiveFloat")
    _, save = one_node(graph, "SaveVideo")

    last_id = "lv1:last-frame"
    graph[last_id] = {
        "class_type": "LoadImage",
        "inputs": {"image": clip["last"]},
        "_meta": {"title": "Last frame"},
    }
    load["inputs"]["image"] = clip["first"]
    h3["inputs"].update(
        first_frame=[load_id, 0],
        last_frame=[last_id, 0],
        prompt=clip["prompt"],
    )
    noise["inputs"]["noise_seed"] = clip["seed"]
    resolution["inputs"].update(
        aspect_ratio="16:9 (Widescreen)",
        megapixels=0.4,
        multiple=32,
    )
    duration["inputs"]["value"] = 5
    save["inputs"]["filename_prefix"] = f"video/lv1-scroll-{clip['slug']}"
    return graph


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
                    messages = status.get("messages") or []
                    raise RuntimeError(json.dumps(messages, ensure_ascii=False)[:5000])
                return result
        if elapsed >= next_report:
            print(f"    generating... {elapsed / 60:.1f} min", flush=True)
            next_report += 30
        time.sleep(5)


def newest_output(prefix: str, before: set[Path]) -> Path:
    candidates = [path for path in H3_VIDEO_DIR.glob(f"{prefix}*.mp4") if path not in before]
    if not candidates:
        raise RuntimeError(f"No new H3 output found for {prefix}")
    return max(candidates, key=lambda path: path.stat().st_mtime_ns)


def transcode(source: Path, destination: Path) -> None:
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        raise RuntimeError("ffmpeg was not found in PATH")
    destination.parent.mkdir(parents=True, exist_ok=True)
    temporary = destination.with_suffix(".encoding.mp4")
    subprocess.run(
        [
            ffmpeg,
            "-y",
            "-loglevel",
            "error",
            "-i",
            str(source),
            "-map",
            "0:v:0",
            "-an",
            "-vf",
            "scale=864:480:force_original_aspect_ratio=increase,crop=864:480",
            "-c:v",
            "libx264",
            "-preset",
            "medium",
            "-crf",
            "24",
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
        ],
        check=True,
    )
    os.replace(temporary, destination)


def run_clip(server: str, base: dict, number: int, clip: dict, timeout: int, force: bool) -> None:
    total = len(CLIPS)
    destination = WEB_VIDEO_DIR / f"{clip['slug']}.mp4"
    if destination.exists() and not force:
        print(f"[{number}/{total}] skip existing {destination.name}")
        return

    graph = prepare_graph(base, clip)
    used_graph = TEMP_DIR / f"lv1-scroll-{number:02d}-used-api.json"
    used_graph.write_text(json.dumps(graph, ensure_ascii=False, indent=2), encoding="utf-8")

    H3_VIDEO_DIR.mkdir(parents=True, exist_ok=True)
    before = set(H3_VIDEO_DIR.glob("*.mp4"))
    print(f"[{number}/{total}] generate {clip['slug']}", flush=True)
    response = request_json(
        f"{server}/prompt",
        {"prompt": graph, "client_id": "lv1-scroll-generator"},
        timeout=180,
    )
    if response.get("node_errors"):
        raise RuntimeError(json.dumps(response["node_errors"], ensure_ascii=False)[:5000])
    prompt_id = response.get("prompt_id")
    if not prompt_id:
        raise RuntimeError(f"ComfyUI did not return a prompt_id: {response}")
    wait_for_prompt(server, prompt_id, timeout)

    prefix = f"lv1-scroll-{clip['slug']}"
    generated = newest_output(prefix, before)
    transcode(generated, destination)
    size_mib = destination.stat().st_size / 1024 / 1024
    print(f"    wrote {destination.name} ({size_mib:.2f} MiB)", flush=True)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--server", default="http://127.0.0.1:8188")
    parser.add_argument("--clip", type=int, action="append", choices=range(1, len(CLIPS) + 1))
    parser.add_argument("--timeout", type=int, default=5400)
    parser.add_argument("--force", action="store_true")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    server = args.server.rstrip("/")
    sync_input_frames()
    request_json(f"{server}/system_stats", timeout=30)
    base = convert_workflow(server)
    selected = set(args.clip or range(1, len(CLIPS) + 1))
    for number, clip in enumerate(CLIPS, start=1):
        if number in selected:
            run_clip(server, base, number, clip, args.timeout, args.force)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
