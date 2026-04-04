import { motion } from 'framer-motion';

const C = { g1: '#6366f1', ml: '#ec4899', gt: '#f59e0b', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d },
});

/** f ← f² · ℓ(P): what each piece does */
export default function Step5cWhyLine() {
  const rows = [
    { op: 'f ← f²', what: '누적값 제곱 (비트 이동)', from: '스칼라 곱 더블링과 동일', c: C.g1, d: 0.4 },
    { op: 'T ← 2T', what: '접선 기울기 λ로 점 더블링', from: '스칼라 곱과 같은 연산', c: C.g1, d: 0.8 },
    { op: 'ℓ(P) 계산', what: '접선을 P에서 평가 → 숫자 1개', from: 'Miller Loop 추가분 ①', c: C.ml, d: 1.2 },
    { op: 'f ← f · ℓ(P)', what: 'T-P 관계를 f에 곱해서 반영', from: 'Miller Loop 추가분 ②', c: C.gt, d: 1.6 },
  ];

  return (
    <svg viewBox="0 0 620 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={310} y={24} textAnchor="middle" fontSize={14} fontWeight={600}
        fill={C.ml} {...fade(0)}>한 iteration: f ← f² · ℓ(P)</motion.text>

      {/* Header */}
      <motion.g {...fade(0.2)}>
        <text x={30} y={52} fontSize={11} fontWeight={600} fill={C.ml}>연산</text>
        <text x={180} y={52} fontSize={11} fontWeight={600} fill={C.m}>하는 일</text>
        <text x={460} y={52} fontSize={11} fontWeight={600} fill={C.m}>비고</text>
        <line x1={20} y1={58} x2={600} y2={58} stroke={`${C.m}15`} strokeWidth={0.5} />
      </motion.g>

      {rows.map((r, i) => (
        <motion.g key={i} {...fade(r.d)}>
          <rect x={20} y={64 + i * 44} width={580} height={38} rx={5}
            fill={`${r.c}06`} stroke={`${r.c}15`} strokeWidth={0.4} />
          <text x={30} y={88 + i * 44} fontSize={12} fontWeight={600} fill={r.c}>{r.op}</text>
          <text x={180} y={88 + i * 44} fontSize={11} fill={C.m}>{r.what}</text>
          <text x={460} y={88 + i * 44} fontSize={11} fill={r.c}>{r.from}</text>
        </motion.g>
      ))}

      {/* Bottom */}
      <motion.g {...fade(2.0)}>
        <rect x={20} y={242} width={580} height={28} rx={5}
          fill={`${C.gt}10`} stroke={`${C.gt}25`} strokeWidth={0.5} />
        <text x={310} y={261} textAnchor="middle" fontSize={11} fill={C.gt}>
          254번 반복 → f에 P-Q의 전체 관계가 인코딩 → Final Exp로 GT 원소 완성
        </text>
      </motion.g>
    </svg>
  );
}
