import { motion } from 'framer-motion';

const C = { warn: '#ef4444', hi: '#6366f1', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 4 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: d },
});

export default function Step0Limit() {
  return (
    <svg viewBox="0 0 460 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={230} y={24} textAnchor="middle" fontSize={14} fontWeight={700}
        fill={C.warn} {...fade(0)}>
        통계 기반 방법의 근본 한계
      </motion.text>

      {[
        { icon: '1', text: '전체 코퍼스를 한 번에 처리', sub: '코퍼스가 커지면 행렬이 폭발', y: 44 },
        { icon: '2', text: '새 단어 추가 시 전체 재계산', sub: 'SVD를 처음부터 다시 수행', y: 96 },
        { icon: '3', text: '선형 관계만 포착', sub: '비선형 의미 구조 학습 불가', y: 148 },
      ].map((r, i) => (
        <motion.g key={i} {...fade(0.3 + i * 0.3)}>
          <rect x={20} y={r.y} width={420} height={36} rx={6}
            fill={`${C.warn}08`} stroke={`${C.warn}20`} strokeWidth={0.5} />
          <circle cx={44} cy={r.y + 18} r={12} fill={`${C.warn}20`} stroke={`${C.warn}50`} strokeWidth={0.6} />
          <text x={44} y={r.y + 22} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.warn}>{r.icon}</text>
          <text x={66} y={r.y + 22} fontSize={12} fontWeight={600} fill={C.warn}>{r.text}</text>
          <text x={310} y={r.y + 22} fontSize={11} fill={C.m}>{r.sub}</text>
        </motion.g>
      ))}

      <motion.text x={230} y={198} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.hi}
        {...fade(1.2)}>
        → 새로운 접근: 추론 기반(prediction-based) 방법
      </motion.text>
    </svg>
  );
}
