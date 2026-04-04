import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const VALS = ['V1', 'V2', 'V3'];
const ROUNDS = 4;
const RX = (r: number) => 70 + r * 80;
const VY = [25, 55, 85];
const COLORS = ['#6366f1', '#10b981', '#f59e0b'];

const STEPS = [
  { label: 'Narwhal: vertex 제안', body: '모든 검증자가 동시에 TX 배치 포함 vertex 생성' },
  { label: 'DAG 구축: Certificate 교환', body: '이전 라운드 2f+1 Cert를 부모로 참조 → DAG 구축' },
  { label: 'Bullshark: 앵커 선출', body: '짝수 라운드에서 앵커 선출. 2f+1 참조 시 커밋' },
  { label: '인과적 히스토리 정렬', body: '앵커의 인과적 히스토리를 BFS → 전체 순서 결정' },
];
const REFS = ['sui-narwhal-header', 'sui-narwhal-header', 'sui-bullshark-commit', 'sui-bullshark-commit'];

export default function SuiConsensusViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
          <svg viewBox="0 0 560 110" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
            {VALS.map((v, i) => (
              <text key={i} x={20} y={VY[i] + 4} textAnchor="middle" fontSize={9}
                fill={COLORS[i]} fontWeight={600}>{v}</text>
            ))}
            {Array.from({ length: ROUNDS }).map((_, r) => (
              <text key={r} x={RX(r)} y={12} textAnchor="middle" fontSize={9}
                fontWeight={600} fill={r <= step ? '#888' : '#444'}>R{r + 1}</text>
            ))}
            {Array.from({ length: ROUNDS }).map((_, r) =>
              VALS.map((_, vi) => {
                const cx = RX(r), cy = VY[vi], visible = r <= step;
                const isAnchor = step >= 2 && r === 1 && vi === 0;
                const committed = step === 3 && r <= 1;
                return (
                  <motion.g key={`${r}-${vi}`} animate={{ opacity: visible ? 1 : 0.08 }} transition={sp}>
                    {r > 0 && visible && VALS.map((_, pi) => (
                      <motion.line key={pi} x1={cx - 10} y1={cy} x2={RX(r - 1) + 10} y2={VY[pi]}
                        stroke="var(--border)" strokeWidth={0.5}
                        animate={{ opacity: visible ? 0.25 : 0 }} transition={sp} />
                    ))}
                    <motion.circle cx={cx} cy={cy} r={8}
                      animate={{ fill: committed ? '#10b98130' : isAnchor ? '#6366f130' : `${COLORS[vi]}10`,
                        stroke: committed ? '#10b981' : isAnchor ? '#6366f1' : COLORS[vi],
                        strokeWidth: isAnchor ? 2.5 : 1 }} transition={sp} />
                    {isAnchor && (
                      <text x={cx} y={cy + 3} textAnchor="middle" fontSize={9}
                        fill="#6366f1" fontWeight={600}>A</text>
                    )}
                  </motion.g>
                );
              })
            )}
          </svg>
          {onOpenCode && (
            <div className="flex items-center gap-2 mt-3 justify-end">
              <CodeViewButton onClick={() => onOpenCode(REFS[step])} />
              <span className="text-[10px] text-muted-foreground">소스 보기</span>
            </div>
          )}
        </div>
      )}
    </StepViz>
  );
}
