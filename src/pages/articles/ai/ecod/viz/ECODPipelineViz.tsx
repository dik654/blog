import { motion, useReducedMotion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const VALUES = [5, 12, 18, 30, 37, 43, 48, 54, 61, 68, 75, 84, 94];
const N = VALUES.length;
const SELECTED = VALUES.length - 1;
const LEFT_P = (SELECTED + 1) / N;
const RIGHT_P = (N - SELECTED) / N;
const LEFT_SCORE = -Math.log(LEFT_P);
const RIGHT_SCORE = -Math.log(RIGHT_P);
const SCORE = Math.max(LEFT_SCORE, RIGHT_SCORE);
const BUSINESS_THRESHOLD = 2.3;

const X0 = 56;
const X1 = 604;
const Y0 = 190;
const Y1 = 38;
const xScale = (value: number) => X0 + (value / 100) * (X1 - X0);
const yScale = (probability: number) => Y0 - probability * (Y0 - Y1);

const ecdfPath = VALUES.reduce((path, value, index) => {
  const x = xScale(value);
  const y = yScale((index + 1) / N);
  return `${path} H ${x} V ${y}`;
}, `M ${X0} ${Y0}`) + ` H ${X1}`;

const STEPS = [
  {
    label: '관측값을 크기순으로 놓는다',
    body: '분포 모양을 정규분포로 가정하지 않는다. 한 피처의 실제 값 13개를 정렬하는 것부터 시작한다.',
  },
  {
    label: '한 점을 지날 때마다 ECDF가 1/n씩 오른다',
    body: 'ECDF는 매끈한 S자 곡선이 아니라 데이터 순위가 만든 계단이다. 여기서는 점 하나마다 1/13이 누적된다.',
  },
  {
    label: '선택한 값의 양쪽 꼬리 순위를 센다',
    body: 'x*=94 이하는 13/13, x*=94 이상은 1/13이다. 큰 값 쪽에서 희귀하다는 사실은 오른쪽 꼬리가 말해 준다.',
  },
  {
    label: '작은 꼬리확률을 -log 점수로 바꾼다',
    body: '-log는 1에 가까운 흔한 사건을 0 근처로, 0에 가까운 희귀 사건을 큰 양수로 바꿔 피처별 증거를 더할 수 있게 한다.',
  },
  {
    label: 'ECOD 점수와 이진 판정 규칙을 분리한다',
    body: 'ECOD의 raw score는 순위를 만든다. 정상/이상 라벨이 필요하면 contamination이나 업무 임계값을 별도로 정해야 한다.',
  },
];

function Metric({ label, value, detail, active }: { label: string; value: string; detail: string; active: boolean }) {
  return (
    <div className={`min-w-0 border-l-2 pl-2.5 transition-opacity ${active ? 'border-blue-600 opacity-100' : 'border-border opacity-35'}`}>
      <div className="text-xs font-bold uppercase text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-mono text-sm font-bold tabular-nums text-foreground">{value}</div>
      <div className="mt-0.5 text-xs leading-snug text-muted-foreground">{detail}</div>
    </div>
  );
}

export default function ECODPipelineViz() {
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0 : 0.65;

  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full max-w-3xl">
          <div className="sm:hidden" role="img" aria-label="관측값의 순위에서 ECDF 꼬리확률과 이상치 점수를 계산하는 과정">
            <div className="rounded-md border border-border bg-background p-4">
              <div className="flex items-baseline justify-between gap-3">
                <strong className="text-xs">정렬된 관측값</strong>
                <span className="font-mono text-xs text-muted-foreground">n = 13</span>
              </div>
              <div className="mt-4 grid h-32 grid-cols-5 items-end gap-2">
                {[
                  { value: 5, rank: '1/13', height: 20 },
                  { value: 30, rank: '4/13', height: 42 },
                  { value: 54, rank: '8/13', height: 68 },
                  { value: 75, rank: '11/13', height: 92 },
                  { value: 94, rank: '13/13', height: 116 },
                ].map((point) => {
                  const selected = point.value === 94;
                  return (
                    <div key={point.value} className="flex min-w-0 flex-col items-center justify-end">
                      <span className="mb-1 font-mono text-xs text-muted-foreground">
                        {step >= 1 ? point.rank : '·'}
                      </span>
                      <span
                        className={`w-full rounded-t-sm border transition-[height,background-color] duration-200 ${
                          selected && step >= 2
                            ? 'border-rose-700/40 bg-rose-600/65 dark:bg-rose-400/60'
                            : 'border-blue-700/35 bg-blue-600/55 dark:bg-blue-400/50'
                        }`}
                        style={{ height: `${step >= 1 ? point.height : 12}px` }}
                        aria-hidden="true"
                      />
                      <strong className={`mt-2 font-mono text-xs ${selected && step >= 2 ? 'text-rose-700 dark:text-rose-300' : ''}`}>
                        {point.value}
                      </strong>
                    </div>
                  );
                })}
              </div>
              {step >= 2 && (
                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-4 text-xs">
                  <div className="rounded-md border border-teal-700/30 bg-teal-500/[0.06] p-3">
                    <strong className="block">낮은 값 꼬리</strong>
                    <span className="mt-1 block text-muted-foreground">94 이하는 13/13</span>
                  </div>
                  <div className="rounded-md border border-amber-700/30 bg-amber-500/[0.06] p-3">
                    <strong className="block">높은 값 꼬리</strong>
                    <span className="mt-1 block text-muted-foreground">94 이상은 1/13</span>
                  </div>
                </div>
              )}
              {step >= 3 && (
                <p className="mt-3 border-l-2 border-rose-600/45 pl-3 text-xs leading-relaxed text-muted-foreground">
                  작은 오른쪽 꼬리확률 1/13에 -log를 적용하면 {RIGHT_SCORE.toFixed(2)}가 된다.
                </p>
              )}
            </div>
          </div>

          <svg viewBox="0 0 660 230" className="hidden h-auto w-full sm:block" role="img" aria-label="관측값의 순위에서 ECDF 꼬리확률과 이상치 점수를 계산하는 과정">
            <rect x="34" y="18" width="592" height="190" rx="6" fill="var(--card)" stroke="var(--border)" />

            {step >= 2 && (
              <>
                <motion.rect initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration }}
                  x="42" y="28" width="140" height="166" rx="4" fill="#14b8a6" fillOpacity="0.1" />
                <motion.rect initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration }}
                  x="480" y="28" width="134" height="166" rx="4" fill="#f59e0b" fillOpacity="0.12" />
                <text x="125" y="54" textAnchor="middle" fontSize="18" fontWeight="700" fill="#0f766e">낮은 값 꼬리</text>
                <text x="515" y="95" textAnchor="middle" fontSize="18" fontWeight="700" fill="#b45309">높은 값 꼬리</text>
              </>
            )}

            <line x1={X0} y1={Y0} x2={X1} y2={Y0} stroke="var(--muted-foreground)" strokeOpacity="0.55" strokeWidth="1.5" />
            <line x1={X0} y1={Y1} x2={X0} y2={Y0} stroke="var(--muted-foreground)" strokeOpacity="0.45" strokeWidth="1.5" />
            <text x="44" y="45" textAnchor="end" fontSize="18" fontWeight="700" fill="var(--muted-foreground)">1</text>
            <text x="44" y="195" textAnchor="end" fontSize="18" fontWeight="700" fill="var(--muted-foreground)">0</text>
            <text x="326" y="224" textAnchor="middle" fontSize="18" fontWeight="700" fill="var(--muted-foreground)">피처 값 x</text>
            <text x="18" y="116" textAnchor="middle" fontSize="18" fontWeight="700" fill="var(--muted-foreground)" transform="rotate(-90 18 116)">누적 비율</text>

            {VALUES.map((value, index) => {
              const selected = index === SELECTED;
              return (
                <g key={value}>
                  <line x1={xScale(value)} y1={Y0 - 7} x2={xScale(value)} y2={Y0 + 7}
                    stroke={selected && step >= 2 ? '#dc2626' : '#2563eb'} strokeWidth={selected && step >= 2 ? 4 : 2.2} strokeLinecap="round" />
                  {selected && step >= 2 && (
                    <motion.text initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration }}
                      x={xScale(value)} y={Y0 - 14} textAnchor="middle" fontSize="19" fontWeight="800" fill="#dc2626">x*=94</motion.text>
                  )}
                </g>
              );
            })}

            {step >= 1 && (
              <motion.path d={ecdfPath} fill="none" stroke="#2563eb" strokeWidth="4" strokeLinejoin="round"
                initial={reduceMotion ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration }} />
            )}

            {step >= 2 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration }}>
                <line x1={xScale(94)} y1={Y1} x2={xScale(94)} y2={Y0} stroke="#dc2626" strokeWidth="2" strokeDasharray="6 5" />
                <circle cx={xScale(94)} cy={yScale(1)} r="6" fill="#dc2626" stroke="var(--card)" strokeWidth="3" />
              </motion.g>
            )}
          </svg>

          <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-3 sm:grid-cols-4 sm:gap-x-5">
            <Metric label="선택한 값" value="x*=94" detail="13개 중 가장 큼" active={step >= 0} />
            <Metric label="양쪽 꼬리" value={step >= 2 ? '13/13 · 1/13' : '—'} detail="왼쪽 · 오른쪽" active={step >= 2} />
            <Metric label="-log 점수" value={step >= 3 ? `${LEFT_SCORE.toFixed(2)} · ${RIGHT_SCORE.toFixed(2)}` : '—'} detail={`채택 점수 ${SCORE.toFixed(2)}`} active={step >= 3} />
            <Metric label="업무 판정" value={step >= 4 ? `${SCORE.toFixed(2)} > ${BUSINESS_THRESHOLD}` : '—'} detail="임계값은 외부 규칙" active={step >= 4} />
          </div>
        </div>
      )}
    </StepViz>
  );
}
