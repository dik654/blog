import { useState } from 'react';

// Concrete 2D embedding coordinates (after t-SNE projection)
const WORDS = [
  { w: '고양이', x: 70, y: 50,  vx: -0.72, vy: 0.85, color: '#6366f1', group: '동물' },
  { w: '강아지', x: 110, y: 65, vx: -0.51, vy: 0.71, color: '#6366f1', group: '동물' },
  { w: '토끼',   x: 85, y: 85,  vx: -0.65, vy: 0.52, color: '#6366f1', group: '동물' },
  { w: '새',     x: 55, y: 80,  vx: -0.80, vy: 0.56, color: '#6366f1', group: '동물' },
  { w: '왕',     x: 270, y: 55, vx: 0.68, vy: 0.82, color: '#f59e0b', group: '왕족' },
  { w: '왕비',   x: 320, y: 55, vx: 0.94, vy: 0.80, color: '#f59e0b', group: '왕족' },
  { w: '왕자',   x: 270, y: 90, vx: 0.65, vy: 0.48, color: '#f59e0b', group: '왕족' },
  { w: '공주',   x: 320, y: 90, vx: 0.91, vy: 0.46, color: '#f59e0b', group: '왕족' },
  { w: '사과',   x: 60,  y: 190, vx: -0.78, vy: -0.45, color: '#10b981', group: '음식' },
  { w: '바나나', x: 110, y: 180, vx: -0.52, vy: -0.38, color: '#10b981', group: '음식' },
  { w: '오렌지', x: 80,  y: 215, vx: -0.67, vy: -0.68, color: '#10b981', group: '음식' },
  { w: '서울',   x: 270, y: 195, vx: 0.62, vy: -0.42, color: '#ec4899', group: '도시' },
  { w: '도쿄',   x: 320, y: 185, vx: 0.88, vy: -0.32, color: '#ec4899', group: '도시' },
  { w: '베이징', x: 290, y: 220, vx: 0.72, vy: -0.65, color: '#ec4899', group: '도시' },
];

type V = { vx: number; vy: number };
const cosSim = (a: V, b: V) => {
  const dot = a.vx * b.vx + a.vy * b.vy;
  return dot / (Math.hypot(a.vx, a.vy) * Math.hypot(b.vx, b.vy));
};
const eucDist = (a: V, b: V) => Math.hypot(a.vx - b.vx, a.vy - b.vy);

export default function EmbeddingViz() {
  const [hovered, setHovered] = useState<string | null>(null);
  const hw = WORDS.find(w => w.w === hovered);

  // Find nearest word to hovered
  const nearest = hw ? WORDS.filter(w => w.w !== hw.w)
    .map(w => ({ ...w, dist: eucDist(hw, w), cos: cosSim(hw, w) }))
    .sort((a, b) => a.dist - b.dist)[0] : null;

  return (
    <div className="not-prose rounded-xl border p-5 mb-6">
      <p className="text-xs text-foreground/50 mb-2 text-center">
        단어 임베딩 공간 (2D 투영) — 같은 색 = 같은 의미 클러스터
      </p>
      <svg viewBox="0 0 400 275" className="w-full max-w-2xl" style={{ height: 'auto' }}>
        {/* Axis lines */}
        <line x1={15} y1={260} x2={385} y2={260} stroke="currentColor" strokeOpacity={0.1} strokeWidth={0.5} />
        <line x1={15} y1={260} x2={15} y2={10} stroke="currentColor" strokeOpacity={0.1} strokeWidth={0.5} />
        <text x={200} y={273} textAnchor="middle" fontSize={8} fill="currentColor" fillOpacity={0.3}>dim 1</text>
        <text x={8} y={140} textAnchor="middle" fontSize={8} fill="currentColor" fillOpacity={0.3}
          transform="rotate(-90, 8, 140)">dim 2</text>

        <ellipse cx={85} cy={70} rx={55} ry={35} fill="#6366f1" fillOpacity={0.06} stroke="#6366f1" strokeOpacity={0.2} />
        <ellipse cx={295} cy={72} rx={50} ry={32} fill="#f59e0b" fillOpacity={0.06} stroke="#f59e0b" strokeOpacity={0.2} />
        <ellipse cx={85} cy={195} rx={50} ry={30} fill="#10b981" fillOpacity={0.06} stroke="#10b981" strokeOpacity={0.2} />
        <ellipse cx={295} cy={200} rx={48} ry={30} fill="#ec4899" fillOpacity={0.06} stroke="#ec4899" strokeOpacity={0.2} />

        <text x={85} y={115} textAnchor="middle" fontSize={9} fill="#6366f1" fillOpacity={0.6}>동물</text>
        <text x={295} y={132} textAnchor="middle" fontSize={9} fill="#f59e0b" fillOpacity={0.6}>왕족</text>
        <text x={85} y={250} textAnchor="middle" fontSize={9} fill="#10b981" fillOpacity={0.6}>음식</text>
        <text x={295} y={253} textAnchor="middle" fontSize={9} fill="#ec4899" fillOpacity={0.6}>도시</text>

        {WORDS.map(w => (
          <g key={w.w} onMouseEnter={() => setHovered(w.w)} onMouseLeave={() => setHovered(null)}
            className="cursor-pointer">
            <circle cx={w.x} cy={w.y} r={hovered === w.w ? 8 : 5}
              fill={w.color} fillOpacity={hovered === w.w ? 0.9 : 0.6} />
            <text x={w.x} y={w.y + 18} textAnchor="middle" fontSize={9} fill={w.color}
              fillOpacity={hovered === w.w ? 1 : 0.7} fontWeight={hovered === w.w ? 600 : 400}>
              {w.w}
            </text>
          </g>
        ))}

        {/* Distance line when hovering: connect to nearest word */}
        {hw && nearest && (
          <g>
            <line x1={hw.x} y1={hw.y} x2={nearest.x} y2={nearest.y}
              stroke={hw.color} strokeWidth={1} strokeOpacity={0.5} strokeDasharray="3 2" />
            <rect x={(hw.x + nearest.x) / 2 - 32} y={(hw.y + nearest.y) / 2 - 8}
              width={64} height={14} rx={3} fill="var(--card)" stroke={hw.color} strokeWidth={0.5} />
            <text x={(hw.x + nearest.x) / 2} y={(hw.y + nearest.y) / 2 + 3}
              textAnchor="middle" fontSize={7} fill={hw.color} fontWeight={600}>
              cos={nearest.cos.toFixed(2)}
            </text>
          </g>
        )}
      </svg>
      <p className="text-xs text-center mt-1" style={{ color: hw?.color ?? 'var(--muted-foreground)', opacity: hw ? 1 : 0.4 }}>
        {hw
          ? `${hw.w} (${hw.vx.toFixed(2)}, ${hw.vy.toFixed(2)}) — ${hw.group} 클러스터${nearest ? ` | 최근접: ${nearest.w} (cos=${nearest.cos.toFixed(2)}, d=${nearest.dist.toFixed(2)})` : ''}`
          : '단어에 마우스를 올려보세요 — 좌표와 최근접 단어 거리를 표시합니다'}
      </p>
    </div>
  );
}
