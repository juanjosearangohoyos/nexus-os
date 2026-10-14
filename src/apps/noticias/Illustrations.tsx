/** Ilustraciones originales de NEXUS OS para los expedientes (SVG, sin imágenes de terceros). */
export function NewsIllustration({ name }: { name: 'process' | 'labels' | 'meta' | 'culture' | 'archive' }) {
  switch (name) {
    case 'process':
      return (
        <svg viewBox="0 0 640 300" aria-hidden="true">
          <rect width="640" height="300" fill="#1b1430" />
          <path d="M40 70 h180 l20 20 h360 v170 H40z" fill="#f5a524" opacity="0.9" />
          <path d="M40 100 h560 v160 H40z" fill="#ffc23d" />
          {['Idea', 'Borradores', 'Selección', 'Edición', 'Créditos'].map((s, i) => (
            <g key={s} transform={`translate(${70 + i * 104} 128)`}>
              <rect width="88" height="104" rx="8" fill="#fff" />
              <rect x="10" y="12" width="68" height="8" rx="4" fill={i === 1 ? '#9b5cff' : '#2ee6c9'} />
              <rect x="10" y="28" width="52" height="5" rx="2.5" fill="#c9cfdb" />
              <rect x="10" y="38" width="60" height="5" rx="2.5" fill="#c9cfdb" />
              <text x="44" y="86" textAnchor="middle" fontSize="12" fontWeight="700" fill="#141a2c">
                {s}
              </text>
              {i !== 1 && <circle cx="72" cy="64" r="9" fill="#2ee6c9" />}
              {i !== 1 && <path d="M68 64 l3 3 5-6" stroke="#fff" strokeWidth="2" fill="none" />}
            </g>
          ))}
          <text x="320" y="285" textAnchor="middle" fontSize="13" fill="#ffe7a8">
            Verde: decisión humana documentada · Violeta: material generado
          </text>
        </svg>
      );
    case 'labels':
      return (
        <svg viewBox="0 0 640 300" aria-hidden="true">
          <rect width="640" height="300" fill="#0f1a33" />
          {[0, 1].map((k) => (
            <g key={k} transform={`translate(${60 + k * 290} 50)`}>
              <rect width="230" height="200" rx="16" fill="#fff" />
              <rect x="18" y="20" width="120" height="10" rx="5" fill="#8a93a8" />
              <rect x="18" y="48" width="194" height="70" rx="8" fill={k === 0 ? '#e6efff' : '#eceef3'} />
              <rect x="18" y="132" width="180" height="8" rx="4" fill="#c9cfdb" />
              <rect x="18" y="148" width="150" height="8" rx="4" fill="#c9cfdb" />
              {k === 0 ? (
                <g>
                  <rect x="18" y="166" width="150" height="22" rx="11" fill="#efe6ff" />
                  <text x="93" y="181" textAnchor="middle" fontSize="11" fontWeight="700" fill="#5b22d6">
                    ✦ Generado con IA
                  </text>
                </g>
              ) : (
                <g>
                  <rect x="18" y="166" width="150" height="22" rx="11" fill="#ffe8e6" />
                  <text x="93" y="181" textAnchor="middle" fontSize="11" fontWeight="700" fill="#b0122b">
                    Origen: sin información
                  </text>
                </g>
              )}
            </g>
          ))}
        </svg>
      );
    case 'meta':
      return (
        <svg viewBox="0 0 640 300" aria-hidden="true">
          <rect width="640" height="300" fill="#0d1630" />
          {[
            ['Personas solas', 200, '#5b6a8f'],
            ['Combinación humano-IA', 300, '#3b8bff'],
            ['Mejor alternativa por separado', 400, '#2ee6c9'],
          ].map(([l, w, c], i) => (
            <g key={l as string} transform={`translate(60 ${60 + i * 62})`}>
              <rect width={w as number} height="40" rx="10" fill={c as string} />
              <text x="14" y="26" fontSize="14" fontWeight="700" fill="#fff">
                {l}
              </text>
            </g>
          ))}
          <text x="60" y="270" fontSize="12" fill="#9ecbff">
            Orden de los promedios, sin magnitudes · Decisión: pérdidas · Creación: ganancias mayores
          </text>
        </svg>
      );
    case 'culture':
      return (
        <svg viewBox="0 0 640 300" aria-hidden="true">
          <rect width="640" height="300" fill="#140f24" />
          {Array.from({ length: 12 }).map((_, i) => {
            const colors = ['#ff7a6b', '#2ee6c9', '#ffb020', '#9b5cff', '#5cc8ff', '#28c76f'];
            const y = 30 + (i % 6) * 42;
            const x = 40 + Math.floor(i / 6) * 90;
            return <rect key={i} x={x} y={y} width="70" height="30" rx={i % 3 === 0 ? 15 : 4} fill={colors[i % 6]} transform={`rotate(${(i % 4) * 8 - 12} ${x + 35} ${y + 15})`} />;
          })}
          <path d="M250 150 h120" stroke="#fff" strokeWidth="2" strokeDasharray="6 6" />
          <rect x="300" y="60" width="40" height="180" rx="10" fill="rgba(255,255,255,0.12)" stroke="#fff" strokeOpacity="0.4" />
          <text x="320" y="258" textAnchor="middle" fontSize="11" fill="#c9cfdb">
            filtro
          </text>
          {Array.from({ length: 10 }).map((_, i) => (
            <rect key={i} x={400 + (i % 2) * 90} y={36 + Math.floor(i / 2) * 46} width="70" height="30" rx="8" fill="#8a7bd6" opacity={0.6 + (i % 3) * 0.12} />
          ))}
          <text x="320" y="288" textAnchor="middle" fontSize="12" fill="#ffd4cc">
            Riesgo de homogeneización: muchas formas distintas que tienden a parecerse
          </text>
        </svg>
      );
    case 'archive':
      return (
        <svg viewBox="0 0 640 300" aria-hidden="true">
          <rect width="640" height="300" fill="#101a30" />
          <path d="M60 160 H580" stroke="#5cc8ff" strokeWidth="2" />
          {[
            ['1999', 'Cluetrain', 110],
            ['2015', 'New Clues', 320],
            ['2026', 'NEXUS OS', 530],
          ].map(([y, l, x]) => (
            <g key={y as string}>
              <circle cx={x as number} cy="160" r="12" fill="#0f1830" stroke="#5cc8ff" strokeWidth="3" />
              <text x={x as number} y="205" textAnchor="middle" fontSize="20" fontWeight="700" fill="#fff">
                {y}
              </text>
              <text x={x as number} y="228" textAnchor="middle" fontSize="13" fill="#9ecbff">
                {l}
              </text>
            </g>
          ))}
          <path d="M80 110 q30 -40 60 0 h-40 l-10 12z" fill="#ffffff" opacity="0.85" />
          <path d="M290 100 q30 -40 60 0 h-40 l-10 12z" fill="#ffffff" opacity="0.85" />
          <g stroke="#ff7a6b" strokeWidth="2">
            <path d="M505 95 L555 95 M530 70 L530 120 M512 78 L548 112 M548 78 L512 112" />
          </g>
          <circle cx="530" cy="95" r="8" fill="#ff7a6b" />
        </svg>
      );
  }
}
