import { useState } from 'react';
import { motion } from 'framer-motion';

const steps = [
  { id: 1, label: '초기화', desc: 'scalar_chip 생성, 곡선 위수 n 할당' },
  { id: 2, label: 'r,s 검증', desc: 'is_soft_nonzero(r), is_soft_nonzero(s)' },
  { id: 3, label: 'u1 계산', desc: 'u1 = msghash / s mod n' },
  { id: 4, label: 'u2 계산', desc: 'u2 = r / s mod n' },
  { id: 5, label: 'u1*G', desc: '고정 기저 스칼라 곱셈 (테이블 조회)' },
  { id: 6, label: 'u2*pk', desc: '가변 기저 스칼라 곱셈' },
  { id: 7, label: '음수 검사', desc: '두 점이 서로 음수 관계가 아닌지 확인' },
  { id: 8, label: '점 덧셈', desc: 'sum = u1*G + u2*pk, x1 == r mod n' },
  { id: 9, label: '범위 검사', desc: 'u1, u2 < n 확인' },
  { id: 10, label: 'AND 결합', desc: '모든 조건 AND → 최종 결과' },
];

export default function ECDSAVerifyViz() {
  const [active, setActive] = useState(0);

  return (
    <div className="rounded-xl border bg-card p-5">
      <p className="text-sm font-semibold mb-3 text-foreground/80">ECDSA 검증 10단계 파이프라인</p>
      <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-10">
        {steps.map((s, i) => (
          <button key={s.id} onClick={() => setActive(i)}
            className={`rounded-lg border px-1.5 py-2 cursor-pointer transition-colors
              ${active === i
                ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700'
                : 'bg-card hover:bg-accent border-border'}`}>
            <p className="text-[10px] font-medium text-center">{s.id}</p>
          </button>
        ))}
      </div>
      <motion.div key={active} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        className="mt-3 px-3 py-2 rounded-lg border border-border/60">
        <p className="text-xs font-medium">{steps[active].label}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{steps[active].desc}</p>
      </motion.div>
      <div className="mt-3 flex gap-3 text-[10px] text-muted-foreground flex-wrap">
        <span>k=12, advice=60</span>
        <span>M2 Max: ~45ms</span>
        <span>r6a.8xl: ~70ms</span>
      </div>
    </div>
  );
}
