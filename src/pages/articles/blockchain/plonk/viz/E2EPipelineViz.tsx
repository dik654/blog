import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const PHASES = [
  { label: '회로', sub: '게이트 정의', color: '#6366f1' },
  { label: '컴파일', sub: '다항식 생성', color: '#10b981' },
  { label: 'SRS+키', sub: 'pk, vk', color: '#f59e0b' },
  { label: '증명', sub: '5-Round', color: '#8b5cf6' },
  { label: '검증', sub: 'O(1)', color: '#ef4444' },
];
const BW = 52, BH = 30, GAP = 6, OX = 8, OY = 15;

const STEPS = [
  { label: '① 회로 작성 — 게이트 + 와이어', body: '개발자가 Composer API로 산술 회로를 구성한다.' },
  { label: '② 컴파일 — 다항식 전처리', body: '선택자/순열을 Lagrange 보간 후 KZG 커밋.' },
  { label: '③ SRS + 키생성', body: 'MPC 세레모니 SRS로 prover key와 verifier key 산출.' },
  { label: '④ 증명 — 5-Round 프로토콜', body: 'witness 대입 → 커밋 → 몫 → 평가 → 오프닝. O(n log n).' },
  { label: '⑤ 검증 — 페어링 2회', body: '검증자는 π + public inputs만으로 O(1) 검증. 768B 증명.' },
];

export default function E2EPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 450 80" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {PHASES.map((p, i) => {
            const x = OX + i * (BW + GAP);
            const active = step >= i;
            const glow = step === i;
            return (
              <g key={p.label}>
                <motion.rect x={x} y={OY} width={BW} height={BH} rx={4}
                  animate={{ fill: active ? `${p.color}20` : `${p.color}06`,
                    stroke: p.color, strokeWidth: glow ? 2 : 0.5, opacity: active ? 1 : 0.15 }}
                  transition={sp} />
                <text x={x + BW / 2} y={OY + 13} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill={p.color} opacity={active ? 1 : 0.2}>{p.label}</text>
                <text x={x + BW / 2} y={OY + 23} textAnchor="middle" fontSize={9}
                  fill={p.color} opacity={active ? 0.5 : 0.1}>{p.sub}</text>
                {i > 0 && (
                  <motion.line x1={x - GAP + 2} y1={OY + BH / 2} x2={x - 2} y2={OY + BH / 2}
                    stroke={p.color} strokeWidth={0.7}
                    animate={{ opacity: active ? 0.5 : 0.08 }} transition={sp} />
                )}
              </g>
            );
          })}
          <motion.g animate={{ opacity: step >= 4 ? 0.7 : 0.15 }} transition={sp}>
            <text x={OX} y={65} fontSize={9} fill="var(--muted-foreground)">
              증명: O(n log n) | 검증: O(1) | 크기: 768B 고정
            </text>
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
