import { useRef, useState } from 'react';
import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';

type StageId = 'input' | 'forward' | 'loss' | 'backward' | 'update' | 'verify';

type StageView = {
  id: StageId;
  number: string;
  label: string;
  question: string;
  input: string;
  operation: string;
  output: string;
  formula: string;
  meaning: string;
  symbols: [string, string][];
};

const stageIds: StageId[] = ['input', 'forward', 'loss', 'backward', 'update', 'verify'];

const sigmoid = (value: number) => 1 / (1 + globalThis.Math.exp(-value));
const fixed = (value: number, digits = 6) => value.toFixed(digits);

export default function TrainingLedgerExplorer() {
  const [stageId, setStageId] = useState<StageId>('input');
  const [learningRate, setLearningRate] = useState(0.1);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const x = [1, 2] as const;
  const y = 1;
  const w = [0.2, -0.1] as const;
  const b = 0.1;
  const z = w[0] * x[0] + w[1] * x[1] + b;
  const p = sigmoid(z);
  const loss = -globalThis.Math.log(p);
  const delta = p - y;
  const gradW = [delta * x[0], delta * x[1]] as const;
  const gradB = delta;
  const nextW = [w[0] - learningRate * gradW[0], w[1] - learningRate * gradW[1]] as const;
  const nextB = b - learningRate * gradB;
  const nextZ = nextW[0] * x[0] + nextW[1] * x[1] + nextB;
  const nextP = sigmoid(nextZ);
  const nextLoss = -globalThis.Math.log(nextP);
  const lossDrop = loss - nextLoss;

  const stages: StageView[] = [
    {
      id: 'input',
      number: '01',
      label: '입력 고정',
      question: '이번 gradient는 어느 상태의 책임인가?',
      input: '관측 x=[1,2], target y=1',
      operation: 'parameter snapshot을 읽기 전용으로 고정',
      output: 'θ₀={w=[0.2,-0.1], b=0.1}',
      formula: String.raw`\begin{aligned}\underbrace{x=[1,2],\ y=1}_{\text{관측값}}\\[6pt]\underbrace{\theta_0=\{w=[0.2,-0.1],b=0.1\}}_{\text{현재 모델 상태}}\end{aligned}`,
      meaning: '관측값과 현재 모델 상태를 분리한다. Forward와 backward는 모두 θ₀를 기준으로 계산하고, update 단계 전에는 값을 덮어쓰지 않는다.',
      symbols: [
        [String.raw`x,y`, '이번 step이 읽을 sample과 target'],
        [String.raw`\theta_0`, 'update 전 weight와 bias를 묶은 snapshot'],
      ],
    },
    {
      id: 'forward',
      number: '02',
      label: '순전파',
      question: '현재 parameter는 어떤 확률을 내는가?',
      input: 'x와 θ₀',
      operation: '가중합으로 logit을 만들고 sigmoid로 범위 변환',
      output: `z=${fixed(z, 1)}, p=${fixed(p)}`,
      formula: String.raw`\begin{aligned}\underbrace{z=w^\top x+b=${fixed(z, 1)}}_{\text{feature 기여를 합친 logit}}\\[6pt]\underbrace{p=\sigma(z)=${fixed(p)}}_{\text{양성 class 확률}}\end{aligned}`,
      meaning: '내적은 feature별 weight 기여를 하나의 score로 합친다. Sigmoid는 score의 순서를 보존하면서 binary probability로 해석할 수 있는 0과 1 사이 값으로 옮긴다.',
      symbols: [
        [String.raw`z`, '확률 변환 전 logit'],
        [String.raw`\sigma`, '실수 score를 (0,1)로 옮기는 sigmoid'],
        [String.raw`p`, '모델이 class 1에 준 확률'],
      ],
    },
    {
      id: 'loss',
      number: '03',
      label: '손실',
      question: '정답 확률을 왜 log 비용으로 바꾸는가?',
      input: `p=${fixed(p)}, y=1`,
      operation: 'binary cross-entropy로 한 scalar objective 생성',
      output: `L=${fixed(loss)}`,
      formula: String.raw`\begin{aligned}\underbrace{\mathcal L=-\log p}_{\text{y=1인 BCE}}\\[6pt]-\log(${fixed(p)})=\underbrace{${fixed(loss)}}_{\text{이번 sample의 비용}}\end{aligned}`,
      meaning: 'Log는 독립 관측의 확률 곱을 더할 수 있는 비용으로 바꾸며, 정답에 매우 작은 확률을 준 확신한 오답을 크게 벌한다. Scalar loss 하나가 reverse-mode의 출발점이 된다.',
      symbols: [
        [String.raw`\mathcal L`, '현재 sample의 scalar loss'],
        [String.raw`-\log p`, '정답 확률이 작을수록 급격히 커지는 비용'],
      ],
    },
    {
      id: 'backward',
      number: '04',
      label: '역전파',
      question: '오차를 weight와 bias의 책임으로 어떻게 나누는가?',
      input: `p-y=${fixed(delta)}`,
      operation: 'local derivative를 입력 경로에 곱해 책임 배분',
      output: `∇w=[${fixed(gradW[0])}, ${fixed(gradW[1])}], ∇b=${fixed(gradB)}`,
      formula: String.raw`\begin{aligned}\underbrace{\delta=\frac{\partial\mathcal L}{\partial z}=p-y=${fixed(delta)}}_{\text{logit 오차}}\\[6pt]\underbrace{\nabla_w\mathcal L=\delta x=[${fixed(gradW[0])},${fixed(gradW[1])}]}_{\text{weight별 책임}}\\[6pt]\underbrace{\nabla_b\mathcal L=\delta=${fixed(gradB)}}_{\text{bias 책임}}\end{aligned}`,
      meaning: 'Sigmoid와 BCE의 derivative를 연결하면 logit signal이 p-y로 단순해진다. 각 weight gradient에는 그 연결이 실제로 본 input을 곱하고, bias는 input을 곱하지 않으므로 delta를 그대로 받는다.',
      symbols: [
        [String.raw`\delta`, 'logit z가 받은 upstream gradient'],
        [String.raw`\nabla_w\mathcal L`, '각 weight를 바꿀 때 loss가 변하는 비율'],
        [String.raw`\nabla_b\mathcal L`, 'bias를 바꿀 때 loss가 변하는 비율'],
      ],
    },
    {
      id: 'update',
      number: '05',
      label: '업데이트',
      question: 'Gradient와 실제 이동량은 어떻게 다른가?',
      input: `θ₀, ∇θ, η=${learningRate.toFixed(2)}`,
      operation: 'SGD가 gradient 반대 방향으로 η만큼 이동',
      output: `w′=[${fixed(nextW[0])}, ${fixed(nextW[1])}], b′=${fixed(nextB)}`,
      formula: String.raw`\begin{aligned}\underbrace{\theta_1}_{\text{새 snapshot}}&=\underbrace{\theta_0}_{\text{현재값}}-\underbrace{${learningRate.toFixed(2)}}_{\text{학습률 }\eta}\underbrace{\nabla_\theta\mathcal L}_{\text{loss가 커지는 방향}}\\[6pt]&=\underbrace{[w',b']}_{\text{다음 forward가 읽을 상태}}\end{aligned}`,
      meaning: 'Gradient는 현재 위치의 slope이고 learning rate는 그 slope를 실제 이동량으로 바꾸는 scale이다. Loss를 줄이려면 gradient가 가리키는 증가 방향을 빼야 한다.',
      symbols: [
        [String.raw`\eta`, 'gradient를 실제 이동으로 바꾸는 learning rate'],
        [String.raw`\theta_1`, 'SGD update 뒤의 새 parameter snapshot'],
      ],
    },
    {
      id: 'verify',
      number: '06',
      label: '재검산',
      question: '새 parameter가 실제로 더 나은 예측을 만들었는가?',
      input: '같은 x,y와 새 θ₁',
      operation: '새 snapshot으로 forward와 loss를 처음부터 다시 실행',
      output: `z′=${fixed(nextZ)}, p′=${fixed(nextP)}, L′=${fixed(nextLoss)}`,
      formula: String.raw`\begin{aligned}\underbrace{z'=${fixed(nextZ)},\ p'=${fixed(nextP)}}_{\text{새 parameter의 forward}}\\[6pt]\underbrace{\mathcal L'=${fixed(nextLoss)}}_{\text{새 loss}}\\[6pt]\underbrace{\mathcal L-\mathcal L'=${fixed(lossDrop)}}_{\text{이 step의 감소량}}\end{aligned}`,
      meaning: 'Update 효과는 이전 logit을 재사용하지 않고 새 parameter로 forward를 다시 실행해 확인한다. 여기서 loss 감소는 한 sample과 한 local step의 결과이며 validation 성능 향상을 보장하지 않는다.',
      symbols: [
        [String.raw`z',p'`, '새 snapshot으로 다시 계산한 logit과 확률'],
        [String.raw`\mathcal L'`, '같은 sample에서 다시 계산한 BCE'],
        [String.raw`\mathcal L-\mathcal L'`, '이번 local update의 loss 감소량'],
      ],
    },
  ];

  const activeIndex = stages.findIndex((stage) => stage.id === stageId);
  const activeStage = stages[activeIndex];
  const beforeWidth = `${globalThis.Math.min(100, (loss / 0.75) * 100)}%`;
  const afterWidth = `${globalThis.Math.min(100, (nextLoss / 0.75) * 100)}%`;

  const moveStage = (direction: -1 | 1) => {
    const nextIndex = (activeIndex + direction + stageIds.length) % stageIds.length;
    setStageId(stageIds[nextIndex]);
    tabRefs.current[nextIndex]?.focus();
  };

  const moveToStage = (nextIndex: number) => {
    setStageId(stageIds[nextIndex]);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <section id="ledger" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">값 하나를 선택해 계산 경로를 따라가 보자</h2>
      <p className="max-w-3xl text-base leading-7 text-muted-foreground">
        단계 버튼을 누르면 들어온 값, 수행한 연산, 다음 단계로 넘긴 값이 함께 바뀐다. 학습률 slider는 backward가 만든
        gradient는 그대로 두고 optimizer의 이동량과 update 후 loss만 바꾼다.
      </p>

      <figure
        data-foundation-viz="true"
        data-viz-kind="interactive"
        data-viz-has-caption="true"
        data-viz-sequence="01"
        data-viz-title="같은 숫자의 Training Step Explorer"
        data-foundation-training-ledger="true"
        data-training-stage={stageId}
        data-training-loss-before={fixed(loss)}
        data-training-loss-after={fixed(nextLoss)}
        className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border"
      >
        <figcaption className="flex min-w-0 flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
          <span className="text-sm font-bold">Training Step 원장</span>
          <span className="font-mono text-[10px] font-bold text-blue-700 dark:text-blue-300">θ₀ → θ₁</span>
        </figcaption>

        <div role="tablist" aria-label="Training step 단계" className="grid grid-cols-2 border-b border-border sm:grid-cols-3 lg:grid-cols-6">
          {stages.map((stage, index) => {
            const selected = stage.id === stageId;
            return (
              <button
                key={stage.id}
                ref={(node) => { tabRefs.current[index] = node; }}
                id={`training-tab-${stage.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="training-ledger-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setStageId(stage.id)}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowRight') { event.preventDefault(); moveStage(1); }
                  if (event.key === 'ArrowLeft') { event.preventDefault(); moveStage(-1); }
                  if (event.key === 'Home') { event.preventDefault(); moveToStage(0); }
                  if (event.key === 'End') { event.preventDefault(); moveToStage(stageIds.length - 1); }
                }}
                className="min-h-[78px] min-w-0 border-b border-r border-border px-3 py-3 text-left transition-colors last:border-r-0 sm:[&:nth-child(3n)]:border-r-0 lg:border-b-0 lg:[&:nth-child(3n)]:border-r lg:[&:nth-child(6n)]:border-r-0"
              >
                <span className={`font-mono text-[10px] font-bold ${selected ? 'text-blue-700 dark:text-blue-300' : 'text-muted-foreground'}`}>{stage.number}</span>
                <span className="mt-1 block text-sm font-bold leading-snug">{stage.label}</span>
                <span className="mt-1 block text-[11px] leading-snug text-muted-foreground">{index + 1}/{stages.length}</span>
              </button>
            );
          })}
        </div>

        <div
          id="training-ledger-panel"
          role="tabpanel"
          aria-labelledby={`training-tab-${stageId}`}
          className="min-w-0"
        >
          <div className="grid min-w-0 border-b border-border lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)_minmax(0,0.9fr)]">
            <div className="min-w-0 border-b border-border p-4 lg:border-b-0 lg:border-r">
              <p className="text-[10px] font-bold text-muted-foreground">들어온 값</p>
              <p className="mt-2 break-words font-mono text-xs font-semibold leading-relaxed">{activeStage.input}</p>
            </div>
            <div className="min-w-0 border-b border-border bg-muted/[0.13] p-4 lg:border-b-0 lg:border-r">
              <p className="text-[10px] font-bold text-blue-700 dark:text-blue-300">현재 연산</p>
              <p className="mt-2 text-sm font-bold leading-relaxed">{activeStage.operation}</p>
            </div>
            <div className="min-w-0 p-4">
              <p className="text-[10px] font-bold text-muted-foreground">다음으로 넘길 값</p>
              <p className="mt-2 break-words font-mono text-xs font-semibold leading-relaxed">{activeStage.output}</p>
            </div>
          </div>

          <div className="min-w-0 px-3 py-5 sm:px-5">
            <p className="text-sm font-bold leading-relaxed">{activeStage.question}</p>
            <Math display className="my-4 text-[11px] sm:text-sm lg:text-base">{activeStage.formula}</Math>
            <FormulaNote meaning={activeStage.meaning} symbols={activeStage.symbols} />
          </div>
        </div>

        <div className="grid min-w-0 gap-5 border-t border-border bg-muted/[0.10] p-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:p-5">
          <label className="min-w-0">
            <span className="flex items-center justify-between gap-3 text-xs font-bold">
              <span>학습률 η</span>
              <span className="font-mono text-blue-700 dark:text-blue-300">{learningRate.toFixed(2)}</span>
            </span>
            <input
              type="range"
              min="0.02"
              max="0.30"
              step="0.01"
              value={learningRate}
              aria-valuetext={`학습률 ${learningRate.toFixed(2)}`}
              onChange={(event) => setLearningRate(Number(event.target.value))}
              className="mt-3 w-full"
            />
            <span className="mt-2 flex justify-between font-mono text-[10px] text-muted-foreground"><span>0.02</span><span>0.30</span></span>
          </label>

          <div className="min-w-0" aria-label="업데이트 전후 loss 비교">
            <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_4.8rem] items-center gap-2">
              <span className="text-xs font-semibold">update 전</span>
              <span className="h-2 overflow-hidden rounded-sm bg-muted"><span className="block h-full bg-rose-500 transition-[width] duration-300" style={{ width: beforeWidth }} /></span>
              <span className="text-right font-mono text-xs">{fixed(loss)}</span>
            </div>
            <div className="mt-3 grid grid-cols-[4.5rem_minmax(0,1fr)_4.8rem] items-center gap-2">
              <span className="text-xs font-semibold">update 후</span>
              <span className="h-2 overflow-hidden rounded-sm bg-muted"><span className="block h-full bg-emerald-500 transition-[width] duration-300" style={{ width: afterWidth }} /></span>
              <span className="text-right font-mono text-xs">{fixed(nextLoss)}</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              같은 sample의 local 확인: loss가 <strong className="text-foreground">{fixed(lossDrop)}</strong> 감소했다.
            </p>
          </div>
        </div>
      </figure>
    </section>
  );
}
