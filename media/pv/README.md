# AI Safety Map product film

Two desktop product films made from actual browser screenshots. Both export a
quiet original synthesized soundtrack and a silent version, with no narration or
explanatory captions. The movies stay local until separately published.

## Japanese and English edition for X

The X edition moves through the Japanese overview, detailed map, tour, element
details, research evidence, glossary, harm conditions, work and money branches,
all elements, and current evidence. It finishes by showing the same overview and
tour in English. Every frame shows the service itself; there is no added closing
card or promotional text.

- `outputs/pv-x-2026-09-10/ai-safety-map-x-ja-en.mp4` — 1920 × 1080, 30 fps, H.264/AAC.
- `outputs/pv-x-2026-09-10/ai-safety-map-x-ja-en-silent.mp4` — the same picture without audio.
- `outputs/pv-x-2026-09-10/index.html` — local video player.
- `outputs/pv-x-2026-09-10/edit.json` — timing, framing, and source provenance.

Capture the complete 1248 × 702 desktop viewport through CUA, using the filenames
in `X_SHOTS`. Wait for each camera transition to finish. The renderer scales these
16:9 screenshots to Full HD and adds camera moves and dissolves; this is an edited
sequence of UI stills, not a continuous real-time screen recording.

```sh
python3 media/pv/render.py --edition x \
  --out outputs/pv-x-2026-09-10 \
  --source-commit '<commit used for the captures>'
```

If the captured UI has uncommitted changes, identify it as a working tree in the
manifest instead of attributing it to a published commit. Keep the capture and
source-state hashes beside the film. The X edition needs FFmpeg with libx264,
Python, NumPy, and Pillow; it does not draw text or require local fonts.

## Original edition

The original 35-second film uses the Japanese UI at commit `77ac4b9`. Its closing
card adds an English line after the Japanese copy. There are no stock footage,
music samples, or external fonts. This earlier edition is kept unchanged.

### Files

- `outputs/pv/ai-safety-map-pv-ja.mp4` — 1920 × 1080, 30 fps, H.264/AAC.
- `outputs/pv/ai-safety-map-pv-ja-silent.mp4` — the same picture without audio.
- `outputs/pv/index.html` — local video player.
- `outputs/pv/captures/` — original browser screenshots, kept locally.
- `outputs/pv/edit.json` — edit durations, framing, and source provenance.
- `outputs/pv/review/` — sampled frames for visual verification.

The film is an edited sequence of actual UI stills, with camera moves and
dissolves. It is not a continuous real-time screen recording. Every screenshot
contains the full 1904 × 1071 desktop viewport, scaled to Full HD for export.
The UI content and scientific explanations are not rewritten or replaced.

### Re-render

Keep the captures in `outputs/pv/captures`, then run:

```sh
python3 media/pv/render.py
```

The renderer needs FFmpeg with libx264, Python with NumPy and Pillow, and the
macOS Hiragino Kaku Gothic W3 / Avenir Next fonts. The generated movie and all
intermediate material stay under the existing ignored `outputs/` directory.
Nothing is added to the site's initial download or published automatically.

To recapture, use CUA at a 1904 × 1071 desktop viewport. The filename and order expected by
the renderer are listed in `SHOTS`. Capture the overview, control pathway,
alignment details and evidence, glossary, work outcomes, money pathway, and
the first three control-tour steps. Wait for the UI's camera transition to
finish before each capture. Do not replace the real site with a simulated UI.

The final copy is “未来の分岐を、たどる。” / “Explore the paths ahead.”

When using newer captures, pass their Git commit with `--source-commit` so the
edit manifest continues to identify the UI that is actually shown.
