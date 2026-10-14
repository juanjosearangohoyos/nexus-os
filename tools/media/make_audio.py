"""
NEXUS OS · Generador de audio original (A01 y banda del video V01).

Síntesis instrumental propia con NumPy: no usa muestras, canciones ni voces de terceros.
Uso (desde la raíz del proyecto):
    python tools/media/make_audio.py
Requiere: numpy y ffmpeg en el PATH.
Salida:
    public/media/audio/nexus-arranque.mp3 / .ogg  (≈3,5 s)
    tools/media/out/banda-video.wav               (32 s, la usa make_video.py)
"""
import subprocess
import wave
from pathlib import Path

import numpy as np

SR = 44100
ROOT = Path(__file__).resolve().parents[2]
OUT_AUDIO = ROOT / "public" / "media" / "audio"
OUT_TMP = ROOT / "tools" / "media" / "out"


def env(n, a=0.01, r=0.5):
    t = np.arange(n) / SR
    e = np.minimum(1, t / a)
    tail = np.exp(-np.maximum(0, t - a) / r)
    return e * tail


def bell(freq, dur, amp=0.3, decay=1.2):
    n = int(dur * SR)
    t = np.arange(n) / SR
    partials = [(1, 1.0), (2.01, 0.42), (3.0, 0.2), (4.2, 0.08)]
    sig = sum(a * np.sin(2 * np.pi * freq * k * t) for k, a in partials)
    return amp * sig * env(n, 0.004, decay)


def pad(freq, dur, amp=0.12):
    n = int(dur * SR)
    t = np.arange(n) / SR
    det = [0.997, 1.0, 1.003]
    sig = sum(np.sin(2 * np.pi * freq * d * t + d) for d in det) / len(det)
    sig += 0.35 * np.sin(2 * np.pi * freq * 2 * t)
    attack = np.minimum(1, t / 1.2)
    release = np.minimum(1, (dur - t) / 1.5)
    return amp * sig * attack * np.clip(release, 0, 1)


def place(buf, sig, start):
    i = int(start * SR)
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i]


def reverb(x, mix=0.28):
    out = x.copy()
    for d, g in [(0.031, 0.5), (0.047, 0.42), (0.071, 0.36), (0.113, 0.28), (0.167, 0.2)]:
        k = int(d * SR)
        delayed = np.zeros_like(x)
        delayed[k:] = x[:-k] * g
        out += delayed * mix
    return out


def stereo(mono, width=0.0015):
    k = int(width * SR)
    left = mono
    right = np.concatenate([np.zeros(k), mono[:-k]])
    return np.stack([left, right], axis=1)


def normalize(x, peak=0.89):
    m = np.max(np.abs(x))
    return x * (peak / m) if m > 0 else x


def write_wav(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    pcm = (np.clip(data, -1, 1) * 32767).astype(np.int16)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def boot_chime():
    dur = 3.6
    buf = np.zeros(int(dur * SR))
    # Pulso grave
    n = int(1.4 * SR)
    t = np.arange(n) / SR
    place(buf, 0.5 * np.sin(2 * np.pi * 55 * t) * env(n, 0.02, 0.45), 0.0)
    place(buf, 0.25 * np.sin(2 * np.pi * 110 * t) * env(n, 0.02, 0.3), 0.0)
    # Acorde limpio ascendente (Do mayor 9)
    for i, f in enumerate([261.63, 329.63, 392.0, 493.88, 587.33]):
        place(buf, bell(f, 2.6, 0.22, 1.1), 0.35 + i * 0.12)
    place(buf, pad(130.81, 3.2, 0.08), 0.2)
    return normalize(stereo(reverb(buf)))


def soundtrack(total=32.0):
    buf = np.zeros(int(total * SR))
    chords = [
        (0, [130.81, 196.0, 261.63, 329.63]),
        (8, [110.0, 164.81, 220.0, 261.63]),
        (16, [87.31, 130.81, 174.61, 220.0]),
        (24, [98.0, 146.83, 196.0, 246.94]),
    ]
    for start, notes in chords:
        for f in notes:
            place(buf, pad(f, 9.0, 0.06), start)
    # Acentos en los cambios de escena
    for s, f in [(0.2, 523.25), (5.0, 659.25), (10.0, 587.33), (18.0, 493.88), (24.0, 659.25), (29.0, 783.99)]:
        place(buf, bell(f, 2.4, 0.12, 1.4), s)
    # Pulso suave
    for beat in np.arange(0.0, total - 1, 1.0):
        n = int(0.3 * SR)
        t = np.arange(n) / SR
        place(buf, 0.05 * np.sin(2 * np.pi * 65.41 * t) * env(n, 0.005, 0.12), beat)
    fade = np.ones_like(buf)
    k = int(2.5 * SR)
    fade[-k:] = np.linspace(1, 0, k)
    fade[: int(0.8 * SR)] = np.linspace(0, 1, int(0.8 * SR))
    return normalize(stereo(reverb(buf * fade, 0.35)), 0.7)


def encode(wav, stem):
    for ext, args in [("mp3", ["-codec:a", "libmp3lame", "-q:a", "3"]), ("ogg", ["-codec:a", "libvorbis", "-q:a", "5"])]:
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), *args, str(OUT_AUDIO / f"{stem}.{ext}")], check=True)


if __name__ == "__main__":
    chime_wav = OUT_TMP / "nexus-arranque.wav"
    write_wav(chime_wav, boot_chime())
    OUT_AUDIO.mkdir(parents=True, exist_ok=True)
    encode(chime_wav, "nexus-arranque")
    write_wav(OUT_TMP / "banda-video.wav", soundtrack())
    print("Audio generado en", OUT_AUDIO, "y", OUT_TMP)
