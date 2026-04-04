import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { C, STEPS, STEP_REFS, STEP_LABELS } from './DeterministicVizData';

interface Props {
  onOpenCode?: (key: string) => void;
}

const B = ({ x, y, w, h, c, t, s }: {
  x: number; y: number; w: number; h: number;
  c: string; t: string; s: string;
}) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={5} fill="var(--card)" />
    <rect x={x} y={y} width={w} height={h} rx={5}
      fill={`${c}10`} stroke={c} strokeWidth={1} />
    <text x={x + w / 2} y={y + 17} textAnchor="middle"
      fontSize={10} fontWeight={600} fill={c}>{t}</text>
    <text x={x + w / 2} y={y + 32} textAnchor="middle"
      fontSize={10} fill="var(--muted-foreground)">{s}</text>
  </g>
);

export default function DeterministicViz({ onOpenCode }: Props) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
          <svg viewBox="0 0 470 100" className="w-full max-w-2xl"
            style={{ height: 'auto' }}>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {step === 0 && <>
                <B x={15} y={10} w={140} h={42} c={C.config}
                  t="Link" s="latency + jitter + rate" />
                <line x1={155} y1={31} x2={175} y2={31}
                  stroke="var(--border)" strokeWidth={0.6} />
                <B x={175} y={10} w={140} h={42} c={C.config}
                  t="Config" s="max_size + disconnect" />
                <line x1={315} y1={31} x2={335} y2={31}
                  stroke="var(--border)" strokeWidth={0.6} />
                <B x={335} y={10} w={120} h={42} c={C.config}
                  t="oracle" s="동적 링크 생성" />
                <text x={235} y={76} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)">
                  progressive filling — max-min 공정 대역폭 할당
                </text>
              </>}
              {step === 1 && <>
                {[
                  { t: '파티션', s: '통신 차단', c: C.fault },
                  { t: '비잔틴', s: '악성 메시지', c: C.fault },
                  { t: '링크 손실', s: '확률적 드롭', c: C.seed },
                  { t: '크래시', s: '복구 시나리오', c: C.result },
                ].map((f, i) => (
                  <B key={i} x={10 + i * 110} y={10} w={100} h={42}
                    c={f.c} t={f.t} s={f.s} />
                ))}
                <text x={235} y={76} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)">
                  모든 커밋마다 CI에서 자동 실행
                </text>
              </>}
              {step === 2 && <>
                <B x={25} y={10} w={120} h={42} c={C.seed}
                  t="seed: u64" s="랜덤 시드 입력" />
                <line x1={145} y1={31} x2={175} y2={31}
                  stroke="var(--border)" strokeWidth={0.6} />
                <B x={175} y={10} w={130} h={42} c={C.seed}
                  t="Runner::seeded()" s="결정론적 스케줄러" />
                <line x1={305} y1={31} x2={325} y2={31}
                  stroke="var(--border)" strokeWidth={0.6} />
                <B x={325} y={10} w={120} h={42} c={C.result}
                  t="동일 결과" s="100% 재현" />
                <text x={235} y={76} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)">
                  시드 기록 → 장애 시나리오 정확 재현
                </text>
              </>}
            </motion.g>
          </svg>
          {onOpenCode && (
            <div className="flex items-center gap-2 mt-3 justify-end">
              <CodeViewButton
                onClick={() => onOpenCode(STEP_REFS[step])} />
              <span className="text-[10px] text-muted-foreground">
                {STEP_LABELS[step]}
              </span>
            </div>
          )}
        </div>
      )}
    </StepViz>
  );
}
