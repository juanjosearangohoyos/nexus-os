import { useEffect, useRef } from 'react';

/**
 * Fondo narrativo original (G03): a la izquierda, una red distribuida de personas (nodos orgánicos);
 * a la derecha, una arquitectura computacional (rejilla y trazos ortogonales); en el centro, la zona
 * de intersección donde ambas se conectan. Animación sutil; versión estática si se reduce el movimiento.
 */
interface Node {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  side: 'human' | 'machine';
  phase: number;
}

interface Pulse {
  path: [number, number][];
  t: number;
  speed: number;
  color: string;
}

export function Wallpaper({ animated, intensity = 1 }: { animated: boolean; intensity?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let nodes: Node[] = [];
    let traces: [number, number][][] = [];
    let pulses: Pulse[] = [];
    let raf = 0;
    let last = performance.now();
    let seed = 7;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    const build = () => {
      seed = 7;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes = [];
      const density = Math.min(1, (w * h) / (1440 * 900));
      // Red humana: grupos orgánicos en la mitad izquierda.
      const clusters = 6;
      for (let c = 0; c < clusters; c++) {
        const cx = w * (0.06 + rand() * 0.34);
        const cy = h * (0.12 + rand() * 0.72);
        const count = Math.round((7 + rand() * 6) * density) + 3;
        for (let i = 0; i < count; i++) {
          const a = rand() * Math.PI * 2;
          const d = rand() * 90 + 10;
          nodes.push({ x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d * 0.8, r: 1.4 + rand() * 2.6, vx: (rand() - 0.5) * 6, vy: (rand() - 0.5) * 6, side: 'human', phase: rand() * 6.28 });
        }
      }
      // Arquitectura computacional: nodos en rejilla a la derecha.
      const gx = 64;
      for (let x = w * 0.6; x < w + gx; x += gx) {
        for (let y = gx * 0.5; y < h; y += gx) {
          if (rand() < 0.32) nodes.push({ x: Math.round(x / gx) * gx, y: Math.round(y / gx) * gx, r: 1.6 + rand() * 1.4, vx: 0, vy: 0, side: 'machine', phase: rand() * 6.28 });
        }
      }
      // Trazos ortogonales desde la arquitectura hacia el centro.
      traces = [];
      for (let i = 0; i < 14; i++) {
        const y0 = Math.round((h * (0.1 + rand() * 0.8)) / 16) * 16;
        const x0 = w * (0.78 + rand() * 0.2);
        const xm = w * (0.56 + rand() * 0.1);
        const y1 = h * 0.5 + (rand() - 0.5) * h * 0.18;
        traces.push([
          [x0, y0],
          [xm, y0],
          [xm - Math.abs(y1 - y0) * 0.35, y1],
          [w * 0.5, h * 0.5 + (rand() - 0.5) * 30],
        ]);
      }
      pulses = [];
    };

    const humanToCenter = (n: Node): [number, number][] => [
      [n.x, n.y],
      [(n.x + w * 0.5) / 2, (n.y + h * 0.5) / 2 + (n.y < h / 2 ? -40 : 40)],
      [w * 0.5, h * 0.5],
    ];

    const draw = (time: number, dt: number) => {
      const px = (mouse.current.x - 0.5) * 14 * intensity;
      const py = (mouse.current.y - 0.5) * 10 * intensity;
      ctx.clearRect(0, 0, w, h);

      // Zona de intersección.
      const cx = w * 0.5 + px * 0.5;
      const cy = h * 0.5 + py * 0.5;
      const breathe = animated ? 1 + Math.sin(time / 2400) * 0.06 : 1;
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.36 * breathe);
      glow.addColorStop(0, 'rgba(255,140,120,0.20)');
      glow.addColorStop(0.35, 'rgba(120,110,255,0.10)');
      glow.addColorStop(1, 'rgba(12,20,42,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // Rejilla técnica (derecha).
      ctx.save();
      ctx.translate(px * 0.6, py * 0.6);
      const grid = ctx.createLinearGradient(w * 0.5, 0, w, 0);
      grid.addColorStop(0, 'rgba(140,120,255,0)');
      grid.addColorStop(1, 'rgba(140,120,255,0.10)');
      ctx.strokeStyle = grid;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = Math.floor((w * 0.55) / 64) * 64; x < w + 64; x += 64) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = 0; y < h + 64; y += 64) {
        ctx.moveTo(w * 0.55, y);
        ctx.lineTo(w + 64, y);
      }
      ctx.stroke();

      for (const tr of traces) {
        ctx.beginPath();
        ctx.moveTo(tr[0][0], tr[0][1]);
        for (let i = 1; i < tr.length; i++) ctx.lineTo(tr[i][0], tr[i][1]);
        ctx.strokeStyle = 'rgba(150,130,255,0.16)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      ctx.restore();

      // Nodos y conexiones humanas (izquierda).
      ctx.save();
      ctx.translate(px, py);
      const human = nodes.filter((n) => n.side === 'human');
      ctx.lineWidth = 0.8;
      for (let i = 0; i < human.length; i++) {
        const a = human[i];
        for (let j = i + 1; j < human.length; j++) {
          const b = human[j];
          const d2 = (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
          if (d2 < 120 * 120) {
            const alpha = (1 - Math.sqrt(d2) / 120) * 0.28;
            ctx.strokeStyle = `rgba(80,230,200,${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.quadraticCurveTo((a.x + b.x) / 2, (a.y + b.y) / 2 - 8, b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const n of human) {
        const tw = animated ? 0.6 + Math.sin(time / 900 + n.phase) * 0.4 : 0.8;
        ctx.fillStyle = `rgba(110,240,200,${0.45 + tw * 0.45})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
        if (animated) {
          n.x += n.vx * dt;
          n.y += n.vy * dt;
          if (n.x < 0 || n.x > w * 0.46) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
        }
      }
      ctx.restore();

      ctx.save();
      ctx.translate(px * 0.6, py * 0.6);
      for (const n of nodes) {
        if (n.side !== 'machine') continue;
        const tw = animated ? 0.5 + Math.sin(time / 700 + n.phase) * 0.5 : 0.7;
        ctx.fillStyle = `rgba(170,150,255,${0.3 + tw * 0.5})`;
        ctx.fillRect(n.x - n.r, n.y - n.r, n.r * 2, n.r * 2);
      }
      ctx.restore();

      // Pulsos que viajan hacia la intersección.
      if (animated) {
        if (pulses.length < 18 && Math.random() < 0.06) {
          if (Math.random() < 0.5 && traces.length) {
            pulses.push({ path: traces[Math.floor(Math.random() * traces.length)], t: 0, speed: 0.18 + Math.random() * 0.12, color: '170,150,255' });
          } else if (human.length) {
            pulses.push({ path: humanToCenter(human[Math.floor(Math.random() * human.length)]), t: 0, speed: 0.2 + Math.random() * 0.12, color: '110,240,200' });
          }
        }
        for (const p of pulses) {
          p.t += p.speed * dt;
          const pos = along(p.path, Math.min(1, p.t));
          const off = p.color.startsWith('110') ? [px, py] : [px * 0.6, py * 0.6];
          const g = ctx.createRadialGradient(pos[0] + off[0], pos[1] + off[1], 0, pos[0] + off[0], pos[1] + off[1], 10);
          g.addColorStop(0, `rgba(${p.color},0.9)`);
          g.addColorStop(1, `rgba(${p.color},0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(pos[0] + off[0], pos[1] + off[1], 10, 0, Math.PI * 2);
          ctx.fill();
        }
        pulses = pulses.filter((p) => p.t < 1);
      }

      // Núcleo de la intersección.
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, 46);
      core.addColorStop(0, 'rgba(255,230,220,0.55)');
      core.addColorStop(0.4, 'rgba(255,122,107,0.18)');
      core.addColorStop(1, 'rgba(255,122,107,0)');
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, 46, 0, Math.PI * 2);
      ctx.fill();
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      draw(now, dt);
      raf = requestAnimationFrame(loop);
    };

    build();
    if (animated) raf = requestAnimationFrame(loop);
    else draw(0, 0);

    const onResize = () => {
      build();
      if (!animated) draw(0, 0);
    };
    const onMove = (e: PointerEvent) => {
      mouse.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    window.addEventListener('resize', onResize);
    if (animated) window.addEventListener('pointermove', onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onMove);
    };
  }, [animated, intensity]);

  return (
    <div className="wallpaper" aria-hidden="true">
      <canvas ref={ref} className="wallpaper__canvas" />
      <div className="wallpaper__labels">
        <span className="wp-label wp-label--human">Red colectiva</span>
        <span className="wp-label wp-label--hybrid">Zona de encuentro</span>
        <span className="wp-label wp-label--machine">Arquitectura computacional</span>
      </div>
    </div>
  );
}

function along(path: [number, number][], t: number): [number, number] {
  const segs = path.length - 1;
  const f = t * segs;
  const i = Math.min(segs - 1, Math.floor(f));
  const k = f - i;
  const a = path[i];
  const b = path[i + 1];
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
}
