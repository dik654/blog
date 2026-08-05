import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  {
    label: 'ARIMA는 원래 수준이 아니라 변환한 변화량을 예측한다',
    body: '계산 순서는 차분 → AR 관성 → MA 오차 보정 → 역차분이다. 아래 계수를 움직이면 각 항의 책임과 최종 수준이 함께 바뀐다.',
  },
  {
    label: 'I(d): 인접한 수준을 빼서 변화량을 만든다',
    body: '103→107→112→118을 1차 차분하면 +4→+5→+6이다. d는 정상적인 표현을 얻는 최소 차분 횟수다.',
  },
  {
    label: 'AR(p): 이전 변화량의 관성을 수치로 합친다',
    body: 'p=2이면 직전 변화량 6과 5에 서로 다른 계수를 곱한다. 계수는 원인 효과가 아니라 다른 lag를 조건으로 둔 예측 계수다.',
  },
  {
    label: 'MA(q): 이전 예측 실패가 남긴 방향을 보정한다',
    body: 'MA는 관측값 평균이 아니다. 직전 innovation에 θ를 곱해 이번 변화량 예측을 위나 아래로 보정한다.',
  },
  {
    label: '예측 변화량을 마지막 수준에 더해 원래 단위로 복원한다',
    body: '사용자가 받는 예측과 평가 오차는 차분 공간이 아니라 매출·수요 같은 원래 단위에서 계산한다.',
  },
];

function NumberStrip({ values, tone }: { values: number[]; tone: 'level' | 'difference' }) {
  const style = tone === 'level'
    ? 'border-blue-600/35 bg-blue-500/[0.06] text-blue-800 dark:text-blue-200'
    : 'border-amber-600/35 bg-amber-500/[0.06] text-amber-800 dark:text-amber-200';
  return (
    <div className="grid min-w-0 grid-cols-4 gap-1.5">
      {values.map((value, index) => (
        <span
          key={`${tone}-${index}`}
          className={`flex h-11 min-w-0 items-center justify-center rounded-md border px-1 font-mono text-sm font-black tabular-nums ${style}`}
        >
          {tone === 'difference' && value > 0 ? '+' : ''}{Number.isInteger(value) ? value : value.toFixed(2)}
        </span>
      ))}
    </div>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid min-w-0 gap-2 text-sm font-semibold text-foreground">
      <span className="flex min-w-0 items-center justify-between gap-3">
        <span className="min-w-0 break-words">{label}</span>
        <output className="shrink-0 font-mono font-black tabular-nums">{value.toFixed(1)}</output>
      </span>
      <input
        aria-label={label}
        className="h-11 w-full accent-blue-600"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function Contribution({
  label,
  expression,
  value,
  tone,
  active,
}: {
  label: string;
  expression: string;
  value: number;
  tone: 'blue' | 'teal' | 'amber';
  active: boolean;
}) {
  const tones = {
    blue: 'border-blue-600 text-blue-700 dark:text-blue-300',
    teal: 'border-teal-600 text-teal-700 dark:text-teal-300',
    amber: 'border-amber-600 text-amber-700 dark:text-amber-300',
  };
  return (
    <div className={`min-w-0 border-l-2 pl-3 transition-opacity ${tones[tone]} ${active ? 'opacity-100' : 'opacity-35'}`}>
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <p className="mt-1 break-words font-mono text-sm font-semibold text-foreground">{expression}</p>
      <p className="mt-2 font-mono text-2xl font-black tabular-nums">{value >= 0 ? '+' : ''}{value.toFixed(2)}</p>
    </div>
  );
}

export default function ARIMAComponentsViz() {
  const reduceMotion = useReducedMotion();
  const [phi1, setPhi1] = useState(0.6);
  const [phi2, setPhi2] = useState(0.2);
  const [theta1, setTheta1] = useState(-0.4);
  const [innovation, setInnovation] = useState(-0.5);

  const levels = [103, 107, 112, 118];
  const drift = 0.6;
  const ar = phi1 * 6 + phi2 * 5;
  const ma = theta1 * innovation;
  const nextDifference = drift + ar + ma;
  const nextLevel = 118 + nextDifference;

  return (
    <div data-arima-components-lab>
      <StepViz steps={STEPS}>
        {(step) => (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25 }}
            className="grid w-full min-w-0 gap-6"
          >
            <div className="grid min-w-0 gap-3 border-b border-border pb-5 sm:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] sm:items-center">
              <div className={step === 0 || step === 1 ? 'opacity-100' : 'opacity-45'}>
                <p className="mb-2 text-xs font-bold text-muted-foreground">원래 수준</p>
                <NumberStrip values={levels} tone="level" />
              </div>
              <div className="text-center text-xl font-black text-muted-foreground" aria-hidden="true">→</div>
              <div className={step === 0 || step === 1 ? 'opacity-100' : 'opacity-45'}>
                <p className="mb-2 text-xs font-bold text-muted-foreground">1차 차분</p>
                <NumberStrip values={[4, 5, 6, nextDifference]} tone="difference" />
              </div>
            </div>

            <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
              <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                <SliderField label="AR 계수 φ₁" value={phi1} min={-0.9} max={0.9} step={0.1} onChange={setPhi1} />
                <SliderField label="AR 계수 φ₂" value={phi2} min={-0.9} max={0.9} step={0.1} onChange={setPhi2} />
                <SliderField label="MA 계수 θ₁" value={theta1} min={-0.9} max={0.9} step={0.1} onChange={setTheta1} />
                <SliderField label="직전 innovation εₜ₋₁" value={innovation} min={-2} max={2} step={0.1} onChange={setInnovation} />
              </div>

              <div className="grid min-w-0 grid-cols-2 gap-4 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                <Contribution label="기준 변화량" expression="c = 0.60" value={drift} tone="amber" active={step === 0 || step === 4} />
                <Contribution label="AR 관성" expression={`φ₁×6 + φ₂×5`} value={ar} tone="blue" active={step === 0 || step === 2} />
                <Contribution label="MA 보정" expression="θ₁×εₜ₋₁" value={ma} tone="teal" active={step === 0 || step === 3} />
                <Contribution label="다음 변화량" expression="c + AR + MA" value={nextDifference} tone="amber" active={step === 0 || step === 4} />
              </div>
            </div>

            <div className={`grid min-w-0 gap-2 border-y border-border py-4 transition-opacity sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center ${step === 0 || step === 4 ? 'opacity-100' : 'opacity-45'}`}>
              <div>
                <p className="text-xs font-bold text-muted-foreground">역차분</p>
                <p className="mt-1 text-sm leading-relaxed text-foreground">마지막 수준 118에 예측 변화량을 더한다.</p>
              </div>
              <output
                data-arima-next-level
                className="break-words font-mono text-xl font-black tabular-nums text-blue-700 dark:text-blue-300 sm:text-2xl"
              >
                118 + {nextDifference.toFixed(2)} = {nextLevel.toFixed(2)}
              </output>
            </div>
          </motion.div>
        )}
      </StepViz>
    </div>
  );
}
