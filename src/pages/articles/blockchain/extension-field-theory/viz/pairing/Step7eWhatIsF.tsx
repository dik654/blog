import { motion } from 'framer-motion';

const C = { gt: '#f59e0b', ml: '#ec4899', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d },
});

/** What is f concretely? Show its evolution step by step */
export default function Step7eWhatIsF() {
  const steps = [
    { label: '시작', f: 'f = 1', note: 'Fp¹² 항등원 (곱셈의 1)', d: 0.4 },
    { label: 'i = 253', f: 'f = 1² · ℓ(P) = ℓ(P)', note: '첫 접선 평가값', d: 0.8 },
    { label: 'i = 252', f: 'f = ℓ(P)² · ℓ\'(P)', note: '이전 값 제곱 × 새 평가값', d: 1.3 },
    { label: 'i = 251', f: 'f = (…)² · ℓ\'\'(P)', note: '계속 누적', d: 1.8 },
  ];

  return (
    <svg viewBox="0 0 540 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={270} y={24} textAnchor="middle" fontSize={14} fontWeight={600}
        fill={C.gt} {...fade(0)}>f는 구체적으로 어떻게 생겼는가</motion.text>
      <motion.text x={270} y={46} textAnchor="middle" fontSize={12} fill={C.m} {...fade(0.15)}>
        매 iteration마다 ℓ(P)가 다른 값 — T 위치가 매번 바뀌므로
      </motion.text>

      {steps.map((s, i) => (
        <motion.g key={i} {...fade(s.d)}>
          <rect x={20} y={54 + i * 46} width={500} height={38} rx={5}
            fill={`${C.gt}${i === 0 ? '06' : '10'}`}
            stroke={`${C.gt}${i === 0 ? '15' : '25'}`} strokeWidth={0.5} />
          <text x={36} y={74 + i * 46} fontSize={11} fontWeight={600} fill={C.gt}>{s.label}</text>
          <text x={130} y={74 + i * 46} fontSize={12} fill={C.ml}>{s.f}</text>
          <text x={36} y={88 + i * 46} fontSize={11} fill={C.m}>{s.note}</text>
        </motion.g>
      ))}

      <motion.text x={270} y={248} textAnchor="middle" fontSize={14} fill={C.m} {...fade(2.2)}>
        ⋮
      </motion.text>

      <motion.g {...fade(2.5)}>
        <rect x={20} y={256} width={500} height={22} rx={5}
          fill={`${C.gt}15`} stroke={C.gt} strokeWidth={0.7} />
        <text x={270} y={272} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.gt}>
          254번 후: f = 매 step의 ℓ(P)가 가중 곱으로 합쳐진 Fp¹² 값
        </text>
      </motion.g>
    </svg>
  );
}
