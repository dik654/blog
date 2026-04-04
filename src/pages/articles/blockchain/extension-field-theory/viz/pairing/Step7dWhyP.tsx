import { motion } from 'framer-motion';

const C = { g1: '#6366f1', g2: '#10b981', ml: '#ec4899', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d },
});
const draw = (d: number) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { pathLength: { duration: 0.3, delay: d }, opacity: { duration: 0.2, delay: d } },
});

// T visits Q → 2Q → 4Q → 8Q (abstract positions, not spatial)
const nodes = [
  { label: 'Q', x: 60, y: 100, d: 0.5 },
  { label: '2Q', x: 170, y: 80, d: 1.0 },
  { label: '4Q', x: 280, y: 110, d: 1.5 },
  { label: '8Q', x: 390, y: 86, d: 2.0 },
];

/** T visits Q, 2Q, 4Q, ... — abstract diagram, not curve positions */
export default function Step7dWhyP() {
  return (
    <svg viewBox="0 0 540 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={270} y={24} textAnchor="middle" fontSize={14} fontWeight={600}
        fill={C.g2} {...fade(0)}>T가 방문하는 점들: Q → 2Q → 4Q → …</motion.text>
      <motion.text x={270} y={46} textAnchor="middle" fontSize={12} fill={C.m} {...fade(0.2)}>
        목표: e(P, Q) 계산. T가 Q의 배수를 순회하며 매번 P와의 관계를 측정
      </motion.text>

      {/* Abstract nodes with doubling arrows */}
      {nodes.map((n, i) => (
        <motion.g key={i} {...fade(n.d)}>
          <circle cx={n.x} cy={n.y} r={18} fill={`${C.g2}15`} stroke={C.g2} strokeWidth={0.8} />
          <text x={n.x} y={n.y + 5} textAnchor="middle"
            fontSize={12} fontWeight={600} fill={C.g2}>{n.label}</text>
          {/* Doubling arrow to next */}
          {i < nodes.length - 1 && (
            <>
              <motion.line x1={n.x + 20} y1={n.y}
                x2={nodes[i + 1].x - 20} y2={nodes[i + 1].y}
                stroke={`${C.g2}50`} strokeWidth={0.8} {...draw(n.d + 0.3)} />
              <text x={(n.x + nodes[i + 1].x) / 2}
                y={Math.min(n.y, nodes[i + 1].y) - 10}
                textAnchor="middle" fontSize={10} fill={C.g2}>×2</text>
            </>
          )}
        </motion.g>
      ))}
      <motion.text x={440} y={90} fontSize={14} fill={C.m} {...fade(2.3)}>…</motion.text>

      {/* Note: these are abstract, not spatial */}
      <motion.text x={270} y={146} textAnchor="middle" fontSize={11} fill={C.m} {...fade(2.4)}>
        (Fp 위에서 이 점들은 격자에 흩어져 있음 — 위치는 개념적 표현)
      </motion.text>

      {/* P fixed below */}
      <motion.g {...fade(2.6)}>
        <line x1={20} y1={162} x2={480} y2={162} stroke={`${C.m}12`} strokeWidth={0.5} />
        <circle cx={230} cy={200} r={10} fill={`${C.g1}20`} stroke={C.g1} strokeWidth={0.8} />
        <text x={230} y={204} textAnchor="middle" fontSize={12}
          fontWeight={600} fill={C.g1}>P</text>
        <text x={230} y={222} textAnchor="middle" fontSize={11} fill={C.g1}>
          G1 점 — 고정. 움직이지 않는다
        </text>
      </motion.g>

      {/* Key message */}
      <motion.g {...fade(2.9)}>
        <rect x={20} y={240} width={500} height={30} rx={5}
          fill={`${C.ml}10`} stroke={`${C.ml}25`} strokeWidth={0.5} />
        <text x={270} y={260} textAnchor="middle" fontSize={12} fill={C.ml}>
          T가 Q→2Q→4Q로 이동할 때마다, 고정된 P와의 관계를 접선으로 측정
        </text>
      </motion.g>
    </svg>
  );
}
