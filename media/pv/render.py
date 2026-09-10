#!/usr/bin/env python3
"""Render a caption-free desktop product film from actual local UI captures.

Screenshots are captured through CUA, never recreated or translated here.
The X edition uses only captured UI, including the English ending. FFmpeg edits video.
"""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import argparse
import json
import math
import subprocess
import unicodedata
import wave

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
FPS, W, H = 30, 1920, 1080
FADE = 0.35
# filename, duration, zoom from/to, optical center from/to (normalized)
SHOTS = [
    ('01-overview.png', 4.4, 1.72, 1.00, (.29, .49), (.50, .50)),
    ('02-control-wide.png', 1.8, 1.00, 1.13, (.50, .50), (.52, .51)),
    ('03-control-close.png', 3.4, 1.10, 1.30, (.60, .56), (.64, .57)),
    ('04-detail.png', 2.4, 1.09, 1.14, (.50, .50), (.50, .48)),
    ('05-evidence.png', 3.6, 1.14, 1.20, (.50, .48), (.50, .48)),
    ('06-glossary.png', 2.0, 1.17, 1.20, (.50, .50), (.50, .50)),
    ('08-work-futures.png', 4.4, 1.05, 1.12, (.52, .56), (.55, .58)),
    ('09-money.png', 3.2, 1.02, 1.12, (.50, .50), (.56, .53)),
    ('10-tour.png', 2.6, 1.00, 1.00, (.50, .50), (.50, .50)),
    ('11-tour-step.png', 2.2, 1.00, 1.00, (.50, .50), (.50, .50)),
    ('12-tour-next.png', 2.2, 1.00, 1.00, (.50, .50), (.50, .50)),
    ('01-overview.png', 2.2, 1.06, 1.00, (.50, .50), (.50, .50)),
]
X_SHOTS = [
    ('01-overview-ja.png', 4.0, 1.45, 1.00, (.32, .50), (.50, .50)),
    ('02-control-map.png', 2.0, 1.00, 1.10, (.50, .50), (.52, .48)),
    ('03-tour-progress.png', 3.6, 1.00, 1.02, (.50, .50), (.50, .50)),
    ('04-tour-research.png', 3.0, 1.00, 1.00, (.50, .50), (.50, .50)),
    ('05-detail.png', 2.6, 1.05, 1.10, (.50, .46), (.50, .46)),
    ('06-evidence.png', 3.4, 1.08, 1.12, (.50, .48), (.50, .48)),
    ('07-glossary.png', 2.2, 1.08, 1.13, (.50, .50), (.50, .50)),
    ('04-tour-research.png', 1.8, 1.00, 1.00, (.50, .50), (.50, .50)),
    ('14-harm-conditions.png', 3.2, 1.00, 1.00, (.50, .50), (.50, .50)),
    ('08-work.png', 3.2, 1.00, 1.08, (.50, .50), (.54, .52)),
    ('09-money.png', 3.2, 1.00, 1.08, (.50, .50), (.54, .50)),
    ('10-all-elements.png', 2.6, 1.00, 1.06, (.50, .50), (.50, .50)),
    ('13-current.png', 3.2, 1.00, 1.03, (.50, .50), (.50, .50)),
    ('01-overview-ja.png', 2.0, 1.00, 1.00, (.50, .50), (.50, .50)),
    ('11-overview-en.png', 3.4, 1.00, 1.00, (.50, .50), (.50, .50)),
    ('12-tour-en.png', 3.6, 1.00, 1.00, (.50, .50), (.50, .50)),
]
END_SECONDS = 4.8
DURATION = sum(s[1] for s in SHOTS) + END_SECONDS - FADE * len(SHOTS)


def run(args, log):
    with open(log, 'w') as stream:
        subprocess.run(args, stdout=stream, stderr=subprocess.STDOUT, check=True)


def font(name, size):
    fonts = list(Path('/System/Library/Fonts').glob('*.ttc'))
    match = next(p for p in fonts if unicodedata.normalize('NFC', p.stem) == name)
    return ImageFont.truetype(str(match), size)


def end_card(out):
    """New drawing, using the map's existing light glass palette."""
    y, x = np.mgrid[0:H, 0:W].astype(np.float32)
    lavender = np.exp(-(((x - 1600) / 800) ** 2 + ((y - 170) / 650) ** 2))
    mint = np.exp(-(((x - 220) / 840) ** 2 + ((y - 970) / 620) ** 2))
    pixels = np.zeros((H, W, 3), np.float32) + [243, 246, 250]
    pixels += lavender[..., None] * np.array([-13, -18, 0])
    pixels += mint[..., None] * np.array([-15, -4, -4])
    canvas = Image.fromarray(np.uint8(np.clip(pixels, 0, 255)), 'RGB')
    draw = ImageDraw.Draw(canvas)
    # Quiet branch motif echoes the product without inventing a causal map.
    for side in [-1, 1]:
        edge = 960 + side * 820
        branch = 960 + side * 660
        tail = 960 + side * 540
        draw.line([(edge, 540), (branch, 540)], fill='#cbd6e5', width=2)
        draw.line([(branch, 320), (branch, 760)], fill='#cbd6e5', width=2)
        for yy in [320, 540, 760]:
            draw.line([(branch, yy), (tail, yy)], fill='#cbd6e5', width=2)
            draw.ellipse((branch - 5, yy - 5, branch + 5, yy + 5), fill='#edf2f8', outline='#b7c7da', width=2)
            draw.rounded_rectangle((min(tail, tail + side * 54), yy - 16, max(tail, tail + side * 54), yy + 16), radius=13, fill='#f6f8fc', outline='#fff', width=2)
    # Branch emblem, drawn with the same rounded lines as the map.
    glyph = [(925, 350), (960, 314), (995, 350), (960, 386)]
    draw.line([glyph[0], glyph[1], glyph[2], glyph[3], glyph[0]], fill='#667bac', width=4, joint='curve')
    draw.line([glyph[1], glyph[3]], fill='#667bac', width=4)
    for gx, gy in glyph:
        draw.ellipse((gx-9, gy-9, gx+9, gy+9), fill='#f5f7fc', outline='#667bac', width=4)
    draw.text((W/2, 475), 'AI SAFETY MAP', font=font('Avenir Next', 72), fill='#293a55', anchor='mm')
    draw.text((W/2, 590), '未来の分岐を、たどる。', font=font('ヒラギノ角ゴシック W3', 36), fill='#526580', anchor='mm')
    canvas.save(out / 'ending-ja.png')
    english = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(english).text((W/2, 660), 'Explore the paths ahead.', font=font('Avenir Next', 28), fill='#7386a3', anchor='mm')
    english.save(out / 'ending-en.png')


def music(out):
    """Original gentle harmonic bed; no samples, speech, or third-party music."""
    rate = 48000
    total = round(DURATION * rate)
    audio = np.zeros((total, 2), np.float64)
    beat = .625
    chords = [(48, 55, 59, 62, 64), (45, 52, 55, 59, 60),
              (41, 48, 52, 55, 57), (43, 50, 53, 57, 60)]

    def add(start, signal, pan=0):
        first = round(start * rate)
        end = min(total, first + len(signal))
        if end <= first:
            return
        signal = signal[:end-first]
        audio[first:end, 0] += signal * math.sqrt((1-pan)/2)
        audio[first:end, 1] += signal * math.sqrt((1+pan)/2)

    def freq(note):
        return 440 * 2 ** ((note - 69) / 12)

    for bar in range(math.ceil(DURATION / (beat * 4))):
        start = bar * beat * 4
        chord = chords[bar % 4] if start < 30 else chords[0]
        t = np.arange(round((beat*4+.8) * rate)) / rate
        env = np.minimum(1, t/.7) * np.minimum(1, np.maximum(0, (beat*4+.8-t)/1.0))
        for voice, note in enumerate(chord):
            f = freq(note + 12)
            pad = (.72*np.sin(2*np.pi*f*t) + .20*np.sin(2*np.pi*f*1.0015*t) + .08*np.sin(2*np.pi*2*f*t))
            add(start, .021 * pad * env, (voice-2)*.24)
        # Light plucked motif, deliberately below the UI soundtrack's pad.
        for step in [0, 2, 3, 5, 6]:
            ts = np.arange(round(1.8*rate)) / rate
            f = freq(chord[[0,2,3,1,4][[0,2,3,5,6].index(step)]] + 24)
            envp = (1-np.exp(-ts*110)) * np.exp(-ts*3.2)
            pluck = np.sin(2*np.pi*f*ts + .75*np.exp(-ts*7)*np.sin(2*np.pi*2*f*ts))
            add(start + step*beat/2, .013 * pluck * envp, .3 if step % 2 else -.3)
        # Soft, low pulse rather than a pronounced drum track.
        for step in [0, 2]:
            ts = np.arange(round(.3*rate))/rate
            pulse = np.sin(2*np.pi*(54*ts + 5*(1-np.exp(-ts*25)))) * np.exp(-ts*18)
            add(start + step*beat, .016*pulse)
    # Short stereo space, leaving the center clear.
    delay = int(.1875*rate)
    audio[delay:, 0] += audio[:-delay, 1].copy() * .13
    audio[delay:, 1] += audio[:-delay, 0].copy() * .10
    timeline = np.arange(total)/rate
    envelope = np.minimum(1, timeline/1.2) * np.minimum(1, (DURATION-timeline)/2.8)
    audio *= np.clip(envelope, 0, 1)[:, None]
    with wave.open(str(out/'music-original.wav'), 'wb') as dest:
        dest.setnchannels(2)
        dest.setsampwidth(2)
        dest.setframerate(rate)
        dest.writeframes((np.clip(audio, -1, 1)*32767).astype('<i2').tobytes())


def render_shot(index, shot, out):
    filename, duration, z0, z1, c0, c1 = shot
    frames = round(duration * FPS)
    p = f'(on/{frames-1})'
    ease = f'({p}*{p}*(3-2*{p}))'
    z = f'{z0}+({z1-z0})*{ease}'
    cx = f'{c0[0]}+({c1[0]-c0[0]})*{ease}'
    cy = f'{c0[1]}+({c1[1]-c0[1]})*{ease}'
    # Captures contain the full desktop viewport at 16:9, with no UI overlays.
    vf = (f"scale=3840:2160:flags=lanczos,"
          f"zoompan=z='{z}':x='max(0,min(iw-iw/zoom,iw*({cx})-iw/(2*zoom)))':"
          f"y='max(0,min(ih-ih/zoom,ih*({cy})-ih/(2*zoom)))':d={frames}:s={W}x{H}:fps={FPS},format=yuv420p")
    if index == 0:
        vf += ',fade=t=in:st=0:d=0.45:color=0xf1f4fa'
    dest = out/f'segment-{index:02}.mp4'
    run(['ffmpeg', '-y', '-hide_banner', '-filter_threads', '2', '-i', str(out/'captures'/filename),
         '-vf', vf, '-frames:v', str(frames), '-c:v', 'libx264', '-preset', 'veryfast',
         '-crf', '16', '-threads', '2', '-an', str(dest)], out/f'segment-{index:02}.log')
    print(f'Rendered {index+1}/{len(SHOTS)}: {filename}', flush=True)
    return dest


def main():
    global SHOTS, END_SECONDS, DURATION
    parser = argparse.ArgumentParser()
    parser.add_argument('--edition', choices=['original', 'x'], default='original')
    parser.add_argument('--out', type=Path, default=ROOT/'outputs/pv')
    parser.add_argument('--source-commit', default='77ac4b9bcd9fd13c7603625d73809265e27b0185')
    args = parser.parse_args()
    if args.edition == 'x':
        SHOTS, END_SECONDS = X_SHOTS, 0
        DURATION = sum(s[1] for s in SHOTS) - FADE * (len(SHOTS) - 1)
    out = args.out.resolve()
    out.mkdir(parents=True, exist_ok=True)
    capture_size = (1248, 702) if args.edition == 'x' else (1904, 1071)
    for name, *_ in SHOTS:
        if not (out/'captures'/name).is_file():
            raise FileNotFoundError(out/'captures'/name)
        with Image.open(out/'captures'/name) as capture:
            if capture.size != capture_size:
                raise ValueError(f'{name}: expected the complete {capture_size} viewport, got {capture.size}')
    if END_SECONDS:
        end_card(out)
    music(out)
    with ThreadPoolExecutor(max_workers=2) as pool:
        segments = list(pool.map(lambda item: render_shot(*item, out), enumerate(SHOTS)))
    if END_SECONDS:
        ending = out/'segment-ending.mp4'
        run(['ffmpeg', '-y', '-hide_banner', '-filter_complex_threads', '2',
             '-loop', '1', '-framerate', str(FPS), '-i', str(out/'ending-ja.png'),
             '-loop', '1', '-framerate', str(FPS), '-i', str(out/'ending-en.png'),
             '-filter_complex', '[1:v]format=rgba,fade=t=in:st=1.3:d=0.7:alpha=1[en];[0:v][en]overlay=shortest=1,format=yuv420p[v]',
             '-map', '[v]', '-t', str(END_SECONDS), '-c:v', 'libx264', '-preset', 'veryfast',
             '-crf', '16', '-threads', '2', '-an', str(ending)], out/'ending.log')
        segments.append(ending)
    durations = [s[1] for s in SHOTS] + ([END_SECONDS] if END_SECONDS else [])
    command = ['ffmpeg', '-y', '-hide_banner', '-filter_complex_threads', '2']
    for segment in segments:
        command += ['-i', str(segment)]
    command += ['-i', str(out/'music-original.wav')]
    filters = []
    timeline = durations[0]
    previous = '0:v'
    cuts = []
    for i in range(1, len(segments)):
        offset = timeline - FADE
        cuts.append(round(offset, 3))
        filters.append(f'[{previous}][{i}:v]xfade=transition=fade:duration={FADE}:offset={offset:.6f}[v{i}]')
        previous = f'v{i}'
        timeline += durations[i] - FADE
    filters.append(f'[{len(segments)}:a]loudnorm=I=-23:TP=-2:LRA=7[a]')
    filters.append(f'[{previous}]scale=out_range=tv:out_color_matrix=bt709,format=yuv420p,setsar=1[video]')
    basename = 'ai-safety-map-x-ja-en' if args.edition == 'x' else 'ai-safety-map-pv-ja'
    target = out/(basename + '.mp4')
    command += ['-filter_complex', ';'.join(filters), '-map', '[video]', '-map', '[a]',
                '-t', f'{DURATION:.3f}', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-threads', '4',
                '-color_range', 'tv', '-colorspace', 'bt709', '-color_trc', 'bt709', '-color_primaries', 'bt709',
                '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart',
                '-metadata', 'title=AI Safety Map', str(target)]
    print(f'Compositing {DURATION:.1f}s film', flush=True)
    run(command, out/'render.log')
    run(['ffmpeg','-y','-hide_banner','-i',str(target),'-map','0:v:0','-c:v','copy','-an',
         '-movflags','+faststart',str(out/(basename + '-silent.mp4'))],out/'silent.log')
    run(['ffmpeg','-y','-hide_banner','-ss',str(DURATION-1),'-i',str(target),'-frames:v','1',
         '-update','1',str(out/'poster.jpg')],out/'poster.log')
    (out/'edit.json').write_text(json.dumps({'fps':FPS, 'size':[W,H], 'duration':DURATION,
        'crossfade':FADE, 'cuts':cuts, 'shots':SHOTS, 'edition':args.edition, 'languages':['ja','en'], 'endcard':({'duration':END_SECONDS,
        'japanese':'未来の分岐を、たどる。', 'english':'Explore the paths ahead.', 'englishDelay':1.3} if END_SECONDS else None),
        'sourceCommit':args.source_commit, 'captureViewport':list(capture_size), 'captureDate':'2026-09-10', 'narration':False,
        'explanatoryCaptions':False, 'music':'Original procedural composition, no third-party samples'},
        ensure_ascii=False,indent=2)+'\n')
    print(f'Created {target}', flush=True)


if __name__ == '__main__':
    main()
