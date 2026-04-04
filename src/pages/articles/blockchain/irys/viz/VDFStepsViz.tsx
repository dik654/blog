import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const NUM = 6;
const XS = Array.from({ length: NUM }, (_, i) => 30 + i * 48);
const BY = 45;

const STEPS = [
  { label: 'VDF 입력 — 시드 값', body: '초기 시드를 입력으로 첫 번째 순차 SHA256 해시를 시작합니다.' },
  { label: '순차 체크포인트 1-2', body: '이전 결과가 다음 입력 → GPU/ASIC으로 가속 불가 (병렬화 불가).' },
  { label: '순차 체크포인트 3-4', body: '각 체크포인트마다 중간 해시를 기록. 검증 시 샘플링 가능.' },
  { label: '최종 출력 — 검증 가능', body: '체크포인트 샘플링만으로 전체 VDF 정당성을 효율적으로 확인.' },
];

export default function VDFStepsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 470 95" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="vd" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
          {XS.map((x, i) => {
            const done = i <= step * 2 + 1;
            const cur = i === step * 2 || i === step * 2 + 1;
            const last = i === NUM - 1 && step === 3;
            const c = last ? '#8b5cf6' : done ? '#10b981' : '#374151';
            return (
              <g key={i}>
                <motion.rect x={x - 16} y={BY - 12} width={32} height={24} rx={5}
                  animate={{ fill: cur ? `${c}25` : done ? `${c}15` : `${c}08`,
                    stroke: c, strokeWidth: cur ? 2 : done ? 1.2 : 0.5 }}
                  transition={sp} />
                <text x={x} y={BY + 2} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={c} opacity={done ? 1 : 0.3}>
                  {done ? 'H' + (i + 1) : '?'}
                </text>
                {i < NUM - 1 && (
                  <motion.line x1={x + 17} y1={BY} x2={XS[i + 1] - 17} y2={BY}
                    stroke={c} strokeWidth={0.8} markerEnd="url(#vd)"
                    animate={{ opacity: done && i < step * 2 + 1 ? 0.5 : 0.12 }} transition={sp} />
                )}
              </g>
            );
          })}
          <text x={165} y={14} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)" opacity={0.6}>
            순차 SHA256 체인 (병렬화 불가)
          </text>
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={210} y={74} width={110} height={16} rx={4} fill="#8b5cf618" stroke="#8b5cf6" strokeWidth={1} />
              <text x={265} y={85} textAnchor="middle" fontSize={10} fontWeight={600} fill="#8b5cf6">
                체크포인트 샘플 검증
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
