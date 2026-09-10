# AI Safety Map product film

35-second desktop product film, made from the Japanese UI at commit `77ac4b9`.
No explanatory captions or narration. The closing card adds an English line after
the Japanese copy. A quiet original synthesized soundtrack and a silent version
are both exported. There are no stock footage, music samples, or external fonts.

## Files

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

## Re-render

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
