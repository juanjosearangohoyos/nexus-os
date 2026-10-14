"""
NEXUS OS · Generador del video V01 «Introducción» (motion graphics, 32 s, 1280×720).

Tipografía cinética, diagramas y monogramas dibujados por código (Pillow) y codificados con ffmpeg.
No contiene imágenes de los integrantes ni material de terceros. Tipografías: Space Grotesk e Inter (SIL OFL 1.1).
Uso (desde la raíz del proyecto, después de make_audio.py):
    python tools/media/make_video.py
Salida: public/media/video/nexus-os-introduccion.{mp4,webm,es.vtt} y póster JPG.
"""
import math
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public" / "media" / "video"
TMP = ROOT / "tools" / "media" / "out"
FONTS = ROOT / "node_modules"
W, H = 1280, 720
S = 1.5  # supermuestreo para bordes suaves
SW, SH = int(W * S), int(H * S)
FPS = 30
DUR = 32.0
STEM = "nexus-os-introduccion"

NIGHT = (12, 20, 42)
WHITE = (243, 247, 255)
TURQ = (46, 230, 201)
CYAN = (92, 200, 255)
VIOLET = (155, 92, 255)
CORAL = (255, 122, 107)
AMBER = (255, 176, 32)
BLUE = (59, 139, 255)


def font(kind, size, weight=None):
    path = {
        "display": FONTS / "@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2",
        "ui": FONTS / "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
        "mono": FONTS / "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2",
    }[kind]
    f = ImageFont.truetype(str(path), int(size * S))
    if weight and kind != "mono":
        try:
            f.set_variation_by_axes([weight])
        except Exception:
            pass
    return f


F_TITLE = font("display", 76, 700)
F_H1 = font("display", 54, 680)
F_H2 = font("display", 38, 620)
F_BODY = font("ui", 26, 500)
F_SMALL = font("ui", 19, 500)
F_MONO = font("mono", 17)
F_MONO_BIG = font("mono", 22)


def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def ease(x):
    x = clamp(x)
    return 1 - (1 - x) ** 3


def fade(t, start, end, fin=0.6, fout=0.6):
    if t < start or t > end:
        return 0.0
    return min(ease((t - start) / fin), ease((end - t) / fout))


def mix(c, a):
    return tuple(int(v) for v in c) + (int(255 * clamp(a)),)


def background():
    img = Image.new("RGB", (SW, SH), NIGHT)
    px = img.load()
    cx, cy = SW / 2, SH * 0.45
    maxd = math.hypot(SW, SH) / 1.6
    for y in range(0, SH, 2):
        for x in range(0, SW, 2):
            d = math.hypot(x - cx, y - cy) / maxd
            k = clamp(1 - d)
            col = (int(12 + 14 * k), int(20 + 18 * k), int(42 + 38 * k))
            px[x, y] = col
            if x + 1 < SW:
                px[x + 1, y] = col
            if y + 1 < SH:
                px[x, y + 1] = col
                if x + 1 < SW:
                    px[x + 1, y + 1] = col
    d = ImageDraw.Draw(img)
    for x in range(int(SW * 0.6), SW, int(64 * S)):
        d.line([(x, 0), (x, SH)], fill=(30, 34, 74), width=1)
    for y in range(0, SH, int(64 * S)):
        d.line([(int(SW * 0.6), y), (SW, y)], fill=(30, 34, 74), width=1)
    return img


BG = None
NODES = []


def init_nodes():
    import random

    rnd = random.Random(7)
    for c in range(5):
        cx, cy = SW * (0.08 + rnd.random() * 0.3), SH * (0.15 + rnd.random() * 0.7)
        for _ in range(9):
            a = rnd.random() * math.tau
            r = rnd.random() * 120 * S
            NODES.append((cx + math.cos(a) * r, cy + math.sin(a) * r * 0.8, rnd.random() * math.tau))


def glow_circle(layer, x, y, r, color, alpha):
    g = Image.new("RGBA", (int(r * 4), int(r * 4)), (0, 0, 0, 0))
    gd = ImageDraw.Draw(g)
    gd.ellipse([r, r, r * 3, r * 3], fill=mix(color, alpha))
    g = g.filter(ImageFilter.GaussianBlur(r * 0.6))
    layer.alpha_composite(g, (int(x - r * 2), int(y - r * 2)))


def text_center(d, y, txt, f, color, alpha):
    if alpha <= 0:
        return
    w = d.textlength(txt, font=f)
    d.text(((SW - w) / 2, y), txt, font=f, fill=mix(color, alpha))


def network(layer, t, alpha):
    d = ImageDraw.Draw(layer)
    pts = [(x + math.sin(t * 0.6 + p) * 8 * S, y + math.cos(t * 0.5 + p) * 6 * S) for x, y, p in NODES]
    for i, a in enumerate(pts):
        for b in pts[i + 1 :]:
            dist = math.hypot(a[0] - b[0], a[1] - b[1])
            if dist < 130 * S:
                d.line([a, b], fill=mix(TURQ, alpha * 0.35 * (1 - dist / (130 * S))), width=int(1.2 * S))
    for x, y in pts:
        d.ellipse([x - 3 * S, y - 3 * S, x + 3 * S, y + 3 * S], fill=mix(TURQ, alpha * 0.9))


def frame(t):
    img = BG.copy().convert("RGBA")
    layer = Image.new("RGBA", (SW, SH), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)

    # Red colectiva siempre presente, más tenue tras la apertura
    network(layer, t, 0.9 if t < 5 else 0.35)

    # Escena 1 · 0–5 s: convergencia y logo
    a1 = fade(t, 0.0, 5.2, 1.0, 0.6)
    if a1 > 0:
        cx, cy = SW / 2, SH * 0.42
        conv = ease(t / 2.5)
        for k in range(10):
            y0 = SH * (0.1 + 0.08 * k)
            x0 = SW * 0.95
            xm = SW - (SW * 0.95 - cx) * conv
            d.line([(x0, y0), (xm, y0 + (cy - y0) * conv)], fill=mix(VIOLET, a1 * 0.45), width=int(1.5 * S))
        glow_circle(layer, cx, cy, 70 * S * (0.6 + 0.4 * conv), CORAL, a1 * 0.55)
        la = ease((t - 1.6) / 1.0) * a1
        if la > 0:
            s = 60 * S
            pts = [(cx - s, cy + s), (cx - s, cy - s), (cx + s, cy + s), (cx + s, cy - s)]
            d.line([pts[0], pts[1]], fill=mix(TURQ, la), width=int(12 * S))
            d.line([pts[1], pts[2]], fill=mix(CORAL, la), width=int(12 * S))
            d.line([pts[2], pts[3]], fill=mix(VIOLET, la), width=int(12 * S))
            for p, c in zip(pts, [TURQ, CYAN, VIOLET, (123, 92, 255)]):
                d.ellipse([p[0] - 11 * S, p[1] - 11 * S, p[0] + 11 * S, p[1] + 11 * S], fill=mix(NIGHT, la), outline=mix(c, la), width=int(5 * S))
            text_center(d, cy + s + 40 * S, "NEXUS OS", F_TITLE, WHITE, la)
            text_center(d, cy + s + 135 * S, "1.0", F_MONO_BIG, CYAN, la * 0.8)

    # Escena 2 · 5–10 s: eslogan
    a2a = fade(t, 5.0, 10.0, 0.7, 0.6)
    a2b = fade(t, 6.4, 10.0, 0.7, 0.6)
    if a2a > 0:
        off = (1 - ease((t - 5.0) / 0.8)) * 30 * S
        text_center(d, SH * 0.36 + off, "Diferentes formas de pensar.", F_H1, WHITE, a2a)
    if a2b > 0:
        off = (1 - ease((t - 6.4) / 0.8)) * 30 * S
        text_center(d, SH * 0.36 + 80 * S + off, "Una nueva forma de crear.", F_H1, CORAL, a2b)
    if a2a > 0:
        text_center(d, SH * 0.72, "Un manifiesto interactivo sobre inteligencias en la cibercultura", F_SMALL, (200, 210, 235), a2a * 0.9)

    # Escena 3 · 10–18 s: tres inteligencias
    a3 = fade(t, 10.0, 18.0, 0.6, 0.6)
    if a3 > 0:
        cx, cy = SW / 2, SH * 0.43
        r = 118 * S
        items = [
            (cx - 78 * S, cy - 40 * S, TURQ, "Colectiva", "saberes que se coordinan", 10.0, (-1, -0.2)),
            (cx + 78 * S, cy - 40 * S, VIOLET, "Artificial", "sistemas que infieren", 11.2, (1, -0.2)),
            (cx, cy + 92 * S, BLUE, "Híbrida", "colaboración con responsabilidades", 12.4, (1, 0.5)),
        ]
        circ = Image.new("RGBA", (SW, SH), (0, 0, 0, 0))
        cd = ImageDraw.Draw(circ)
        for x, y, c, _n, _d, st, _p in items:
            k = ease((t - st) / 0.8) * a3
            if k > 0:
                rr = r * (0.7 + 0.3 * k)
                cd.ellipse([x - rr, y - rr, x + rr, y + rr], fill=mix(c, 0.16 * k), outline=mix(c, 0.95 * k), width=int(3 * S))
        layer.alpha_composite(circ)
        for x, y, c, name, desc, st, (sx, sy) in items:
            k = ease((t - st - 0.3) / 0.8) * a3
            if k <= 0:
                continue
            w1 = d.textlength(name, font=F_H2)
            w2 = d.textlength(desc, font=F_SMALL)
            ty = y + sy * r
            if sx < 0:
                tx = x - r - 30 * S
                d.text((tx - w1, ty - 30 * S), name, font=F_H2, fill=mix(c, k))
                d.text((tx - w2, ty + 20 * S), desc, font=F_SMALL, fill=mix(WHITE, k * 0.85))
            else:
                tx = x + r + 30 * S
                d.text((tx, ty - 30 * S), name, font=F_H2, fill=mix(c, k))
                d.text((tx, ty + 20 * S), desc, font=F_SMALL, fill=mix(WHITE, k * 0.85))
        kc = ease((t - 14.0) / 1.0) * a3
        if kc > 0:
            glow_circle(layer, cx, cy + 8 * S, 30 * S, CORAL, kc * 0.9)
            text_center(d, SH * 0.9, "Se cruzan, pero ninguna es idéntica a otra.", F_BODY, WHITE, kc)

    # Escena 4 · 18–24 s: evidencia
    a4 = fade(t, 18.0, 24.0, 0.6, 0.6)
    if a4 > 0:
        text_center(d, SH * 0.2, "106 experimentos.", F_TITLE, CYAN, a4)
        bars = [("Personas solas", 0.42, (91, 106, 143)), ("Combinación humano-IA", 0.58, BLUE), ("Mejor alternativa por separado", 0.74, TURQ)]
        for i, (label, wfrac, c) in enumerate(bars):
            k = ease((t - 18.6 - i * 0.35) / 0.8) * a4
            if k <= 0:
                continue
            x0 = SW * 0.18
            y0 = SH * (0.42 + i * 0.1)
            d.rounded_rectangle([x0, y0, x0 + SW * wfrac * k, y0 + 46 * S], radius=int(12 * S), fill=mix(c, 0.95 * a4))
            d.text((x0 + 16 * S, y0 + 10 * S), label, font=F_SMALL, fill=mix(WHITE, k))
        k = ease((t - 20.2) / 0.8) * a4
        text_center(d, SH * 0.76, "Sumar humano + IA no garantiza superar al mejor por separado.", F_BODY, WHITE, k)
        text_center(d, SH * 0.84, "Representación ordinal, sin magnitudes · (Vaccaro et al., 2024)", F_MONO, (170, 185, 215), k)

    # Escena 5 · 24–29 s: equipo (monogramas, sin imágenes de personas)
    a5 = fade(t, 24.0, 29.2, 0.6, 0.6)
    if a5 > 0:
        team = [("VG", "Redes colectivas", TURQ), ("JR", "Sistemas artificiales", VIOLET), ("SC", "Interacción híbrida", BLUE), ("JJ", "Narrativa y ética", AMBER)]
        for i, (ini, role, c) in enumerate(team):
            k = ease((t - 24.2 - i * 0.3) / 0.7) * a5
            if k <= 0:
                continue
            x = SW * (0.2 + i * 0.2)
            y = SH * 0.36
            s = 70 * S
            d.rounded_rectangle([x - s, y - s, x + s, y + s], radius=int(34 * S), fill=mix((15, 24, 48), k), outline=mix(c, k), width=int(3 * S))
            w = d.textlength(ini, font=F_H1)
            d.text((x - w / 2, y - 36 * S), ini, font=F_H1, fill=mix(WHITE, k))
            w2 = d.textlength(role, font=F_SMALL)
            d.text((x - w2 / 2, y + s + 18 * S), role, font=F_SMALL, fill=mix(c, k))
        k = ease((t - 25.6) / 0.8) * a5
        text_center(d, SH * 0.74, "Creamos herramientas. Elegimos principios.", F_H2, WHITE, k)
        text_center(d, SH * 0.74 + 56 * S, "Respondemos por nuestras decisiones.", F_H2, CORAL, k)

    # Escena 6 · 29–32 s: llamado
    a6 = fade(t, 29.0, 32.0, 0.6, 0.8)
    if a6 > 0:
        text_center(d, SH * 0.3, "Lee nuestras fuentes.", F_H1, WHITE, a6)
        text_center(d, SH * 0.3 + 78 * S, "Cuestiona nuestros principios.", F_H1, WHITE, ease((t - 29.4) / 0.6) * a6)
        text_center(d, SH * 0.3 + 156 * S, "Crea con responsabilidad.", F_H1, TURQ, ease((t - 29.8) / 0.6) * a6)
        text_center(d, SH * 0.88, "NEXUS OS · Ciberculturas · Pontificia Universidad Javeriana Cali · 2026", F_MONO, (170, 185, 215), a6)

    img.alpha_composite(layer)
    return img.convert("RGB").resize((W, H), Image.LANCZOS)


VTT = """WEBVTT

00:00.000 --> 00:04.900
[Música instrumental original. Una red de puntos y una rejilla convergen en el centro.]
NEXUS OS 1.0

00:05.000 --> 00:09.900
Diferentes formas de pensar.
Una nueva forma de crear.

00:10.000 --> 00:13.900
Inteligencia colectiva: saberes que se coordinan.
Inteligencia artificial: sistemas que infieren.

00:14.000 --> 00:17.900
Inteligencia híbrida: colaboración con responsabilidades.
Se cruzan, pero ninguna es idéntica a otra.

00:18.000 --> 00:23.900
106 experimentos. Sumar humano + IA no garantiza
superar al mejor por separado (Vaccaro et al., 2024).

00:24.000 --> 00:28.900
[Monogramas VG, JR, SC y JJ]
Creamos herramientas. Elegimos principios. Respondemos por nuestras decisiones.

00:29.000 --> 00:32.000
Lee nuestras fuentes. Cuestiona nuestros principios.
Crea con responsabilidad.
"""


def main():
    global BG
    OUT.mkdir(parents=True, exist_ok=True)
    TMP.mkdir(parents=True, exist_ok=True)
    BG = background()
    init_nodes()
    raw = TMP / "video-sin-audio.mp4"
    total = int(DUR * FPS)
    proc = subprocess.Popen(
        ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
         "-c:v", "libx264", "-preset", "medium", "-crf", "16", "-pix_fmt", "yuv420p", str(raw)],
        stdin=subprocess.PIPE,
    )
    for i in range(total):
        t = i / FPS
        im = frame(t)
        if i == int(2.6 * FPS):
            im.save(OUT / f"{STEM}-poster.jpg", quality=88)
        proc.stdin.write(im.tobytes())
        if i % 60 == 0:
            print(f"  fotograma {i}/{total}")
    proc.stdin.close()
    proc.wait()
    audio = TMP / "banda-video.wav"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw), "-i", str(audio), "-c:v", "libx264", "-crf", "22", "-preset", "slow",
                    "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k", "-shortest", "-movflags", "+faststart", str(OUT / f"{STEM}.mp4")], check=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw), "-i", str(audio), "-c:v", "libvpx-vp9", "-crf", "34", "-b:v", "0",
                    "-row-mt", "1", "-c:a", "libopus", "-b:a", "96k", "-shortest", str(OUT / f"{STEM}.webm")], check=True)
    (OUT / f"{STEM}.es.vtt").write_text(VTT, encoding="utf-8")
    print("Video generado en", OUT)


if __name__ == "__main__":
    main()
