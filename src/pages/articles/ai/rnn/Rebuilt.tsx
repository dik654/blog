import { useMemo, useState } from 'react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { CapabilityCheck, ConceptPrimer, InternalLink, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import { FlowRow, MetricGrid, NlpSection, ProbabilityBars, SegmentedControl, Takeaway } from '../nlp-shared';

const sequence = [1, -0.5, 0.8, 0.2, -0.7];

function RecurrenceExplorer() {
  const [recurrentWeight, setRecurrentWeight] = useState(0.6);
  const [step, setStep] = useState(3);
  const states = useMemo(() => {
    const result: number[] = [];
    sequence.forEach((input, index) => {
      const previous = index === 0 ? 0 : result[index - 1];
      result.push(Math.tanh(0.8 * input + recurrentWeight * previous));
    });
    return result;
  }, [recurrentWeight]);
  const currentIndex = step - 1;
  const previous = currentIndex === 0 ? 0 : states[currentIndex - 1];
  const preactivation = 0.8 * sequence[currentIndex] + recurrentWeight * previous;

  return (
    <div data-rnn-recurrence-lab className="foundation-viz-explorer not-prose my-8 scroll-mt-28 overflow-hidden rounded-md border border-border">
      <div className="grid gap-4 border-b border-border bg-muted/20 p-4 sm:grid-cols-2 sm:p-6">
        <label htmlFor="rnn-weight" className="block text-xs font-semibold text-muted-foreground">Recurrent weight wₕ · {recurrentWeight.toFixed(2)}
          <input id="rnn-weight" type="range" min="-1.4" max="1.4" step="0.05" value={recurrentWeight} onChange={(event) => setRecurrentWeight(Number(event.target.value))} className="mt-3 block w-full accent-foreground" />
        </label>
        <label htmlFor="rnn-step" className="block text-xs font-semibold text-muted-foreground">관찰할 timestep · t={step}
          <input id="rnn-step" type="range" min="1" max={sequence.length} step="1" value={step} onChange={(event) => setStep(Number(event.target.value))} className="mt-3 block w-full accent-foreground" />
        </label>
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-5 gap-1 sm:gap-2">
          {sequence.map((input, index) => <div key={index} className={`min-w-0 rounded-md border px-1 py-3 text-center ${index === currentIndex ? 'border-blue-500/45 bg-blue-500/5' : 'border-border'}`}><p className="text-[11px] font-semibold text-muted-foreground sm:text-xs">t={index + 1}</p><p className="mt-1 font-mono text-xs sm:text-sm">x {input.toFixed(1)}</p><p className="mt-1 break-words font-mono text-xs font-bold sm:text-sm">h {states[index].toFixed(3)}</p></div>)}
        </div>
        <div className="mt-5"><MetricGrid items={[
          { label: 'input contribution', value: (0.8 * sequence[currentIndex]).toFixed(3), note: '0.8 × xₜ' },
          { label: 'memory contribution', value: (recurrentWeight * previous).toFixed(3), note: 'wₕ × hₜ₋₁' },
          { label: 'preactivation', value: preactivation.toFixed(3), note: '두 경로의 합 · 이 scalar 예제는 b=0' },
          { label: 'new state', value: states[currentIndex].toFixed(3), note: 'tanh를 통과한 hₜ', accent: true },
        ]} /></div>
      </div>
    </div>
  );
}

function softmax(logits: number[], temperature: number) {
  const scaled = logits.map((value) => value / temperature);
  const max = Math.max(...scaled);
  const exps = scaled.map((value) => Math.exp(value - max));
  const sum = exps.reduce((total, value) => total + value, 0);
  return exps.map((value) => value / sum);
}

function LanguageModelExplorer() {
  const [temperature, setTemperature] = useState(1);
  const [mode, setMode] = useState<'train' | 'infer'>('train');
  const vocabulary = ['공부한다', '만든다', '좋아한다', '잊는다'];
  const probabilities = softmax([2.4, 1.3, 0.7, -0.2], temperature);
  return (
    <div data-rnn-language-model-lab className="foundation-viz-explorer not-prose my-8 scroll-mt-28 overflow-hidden rounded-md border border-border">
      <div className="grid gap-4 border-b border-border bg-muted/20 p-4 sm:grid-cols-[1fr_auto] sm:items-end sm:p-6">
        <label htmlFor="rnn-temperature" className="block text-xs font-semibold text-muted-foreground">Softmax temperature · {temperature.toFixed(1)}
          <input id="rnn-temperature" type="range" min="0.3" max="2" step="0.1" value={temperature} onChange={(event) => setTemperature(Number(event.target.value))} className="mt-3 block w-full accent-foreground" />
        </label>
        <SegmentedControl label="RNN language model 실행 모드" options={[{ value: 'train', label: '학습' }, { value: 'infer', label: '생성' }]} value={mode} onChange={setMode} />
      </div>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div>
          <p className="text-xs font-bold text-muted-foreground">입력과 target을 한 칸 이동한다</p>
          <div className="mt-3"><FlowRow items={mode === 'train' ? [
            { label: 'input', value: '<BOS> 나는 AI를', note: '정답 prefix를 입력한다.' },
            { label: 'RNN state', value: 'h₃', note: 'prefix를 순서대로 압축한다.' },
            { label: 'target', value: '공부한다', note: '다음 token loss를 계산한다.' },
          ] : [
            { label: 'input', value: '<BOS> 나는 AI를', note: '이전 생성 token을 입력한다.' },
            { label: 'RNN state', value: 'h₃', note: '자기 출력을 다시 상태에 넣는다.' },
            { label: 'greedy pick', value: vocabulary[probabilities.indexOf(Math.max(...probabilities))], note: '가장 높은 확률의 token을 고른다.' },
          ]} activeIndex={1} /></div>
        </div>
        <ProbabilityBars label="다음 token 확률" items={vocabulary.map((label, index) => ({ label, value: probabilities[index] }))} />
      </div>
      <p className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:px-6">학습에서는 실제 이전 token을 알고 있지만 생성에서는 모델이 방금 낸 token만 안다. 이 예제는 가장 큰 확률만 고르는 greedy decoding이므로 temperature는 분포의 뾰족함만 바꾸고 선택 token은 바꾸지 않는다. 실제 sampling은 이 분포를 가중치로 무작위 추출하므로 temperature에 따라 결과도 달라진다.</p>
    </div>
  );
}

function GradientExplorer() {
  const [distance, setDistance] = useState(12);
  const [jacobian, setJacobian] = useState(0.75);
  const gradient = jacobian ** distance;
  const points = Array.from({ length: distance + 1 }, (_, index) => ({ distance: index, value: jacobian ** index }));
  const maxAbsoluteLog = Math.max(1, ...points.map((point) => Math.abs(Math.log10(Math.max(point.value, 1e-16)))));
  const minLog = -maxAbsoluteLog;
  const maxLog = maxAbsoluteLog;
  const plotTop = 20;
  const plotBottom = 150;
  const mapLogToY = (value: number) => plotTop + ((maxLog - Math.log10(Math.max(value, 1e-16))) / (maxLog - minLog)) * (plotBottom - plotTop);
  const baselineY = mapLogToY(1);
  const endpointY = mapLogToY(gradient);
  const polyline = points.map((point, index) => `${32 + (index / Math.max(1, distance)) * 300},${mapLogToY(point.value)}`).join(' ');
  return (
    <div data-rnn-gradient-lab className="foundation-viz-explorer not-prose my-8 scroll-mt-28 overflow-hidden rounded-md border border-border">
      <div className="grid gap-4 border-b border-border bg-muted/20 p-4 sm:grid-cols-2 sm:p-6">
        <label htmlFor="gradient-distance" className="block text-xs font-semibold text-muted-foreground">의존 거리 · {distance} step
          <input id="gradient-distance" type="range" min="1" max="40" step="1" value={distance} onChange={(event) => setDistance(Number(event.target.value))} className="mt-3 block w-full accent-foreground" />
        </label>
        <label htmlFor="local-jacobian" className="block text-xs font-semibold text-muted-foreground">한 step의 local Jacobian 크기 · {jacobian.toFixed(2)}
          <input id="local-jacobian" type="range" min="0.4" max="1.35" step="0.05" value={jacobian} onChange={(event) => setJacobian(Number(event.target.value))} className="mt-3 block w-full accent-foreground" />
        </label>
      </div>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-center">
        <svg viewBox="0 0 365 180" className="block aspect-[365/180] w-full" role="img" aria-label={`${distance} step 동안 gradient 크기 변화`}>
          <line x1="32" y1="150" x2="332" y2="150" stroke="currentColor" opacity="0.2" /><line x1="32" y1="20" x2="32" y2="150" stroke="currentColor" opacity="0.2" />
          <line data-rnn-gradient-baseline-y={baselineY} x1="32" y1={baselineY} x2="332" y2={baselineY} stroke="currentColor" strokeDasharray="4 4" opacity="0.35" />
          <text x="36" y={baselineY - 6} fontSize="13" fill="currentColor" opacity="0.65">1× 기준</text>
          <polyline points={polyline} fill="none" stroke={jacobian > 1 ? '#dc2626' : '#2563eb'} strokeWidth="3" />
          <circle data-rnn-gradient-point-y={endpointY} cx="332" cy={endpointY} r="4" fill={jacobian > 1 ? '#dc2626' : '#2563eb'} />
          <text x="332" y="171" textAnchor="end" fontSize="13" fill="currentColor" opacity="0.62">의존 거리</text><text x="36" y="15" fontSize="13" fill="currentColor" opacity="0.62">log₁₀ |gradient|</text>
        </svg>
        <MetricGrid items={[
          { label: 'gradient multiplier', value: gradient < 0.001 ? gradient.toExponential(2) : gradient.toFixed(4), note: `${jacobian.toFixed(2)}^${distance}` },
          { label: 'regime', value: jacobian < 0.95 ? 'vanishing' : jacobian > 1.05 ? 'exploding' : 'near stable', note: '실제 값은 매 step마다 달라진다.', accent: jacobian >= 0.95 && jacobian <= 1.05 },
        ]} />
      </div>
    </div>
  );
}

function SequenceBatchExplorer() {
  const [chunk, setChunk] = useState(4);
  const lengths = [7, 5, 3];
  return (
    <div data-rnn-batch-ownership-lab className="foundation-viz-explorer not-prose my-8 scroll-mt-28 rounded-md border border-border p-4 sm:p-6">
      <label htmlFor="tbptt-chunk" className="block text-xs font-semibold text-muted-foreground">Truncated BPTT chunk · {chunk} step
        <input id="tbptt-chunk" type="range" min="2" max="7" step="1" value={chunk} onChange={(event) => setChunk(Number(event.target.value))} className="mt-3 block w-full accent-foreground" />
      </label>
      <div className="mt-5 space-y-2">
        {lengths.map((length, row) => <div key={length} className="grid grid-cols-7 gap-1" aria-label={`batch ${row + 1}, 실제 길이 ${length}`}>
          {Array.from({ length: 7 }, (_, index) => {
            const isDetachBoundary = index < length && (index + 1) % chunk === 0 && index + 1 < length;
            return <span key={index} data-detach-boundary={isDetachBoundary || undefined} title={isDetachBoundary ? `t${index + 1} 뒤에서 graph detach` : undefined} className={`relative flex h-9 items-center justify-center rounded border text-[11px] font-mono ${index >= length ? 'border-dashed border-border text-muted-foreground/45' : isDetachBoundary ? 'border-amber-600/60 bg-amber-500/10 font-bold text-amber-800 dark:text-amber-300' : 'border-border bg-muted/20'}`}>{index >= length ? 'PAD' : `t${index + 1}`}{isDetachBoundary && <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rotate-45 bg-amber-600" aria-hidden="true" />}</span>;
          })}
        </div>)}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="border-t border-border pt-3"><p className="text-sm font-bold">Padding mask</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">생략하면 짧은 문장이 PAD를 예측하도록 학습된다. PAD 위치의 loss와 state update를 제외한다.</p></div>
        <div className="border-t border-border pt-3"><p className="text-sm font-bold">Hidden reset</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">생략하면 이전 sample 정보가 다음 sample로 새어 batch 순서가 예측을 바꾼다. Sequence 경계에서 state를 초기화한다.</p></div>
        <div className="border-t border-border pt-3"><p className="text-sm font-bold">Detach boundary</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">생략하면 graph가 chunk를 넘어 계속 자라 memory와 backward 시간이 늘어난다. State 값만 넘기고 이전 graph를 끊는다.</p></div>
      </div>
    </div>
  );
}

export default function RebuiltRnn() {
  return (
    <>
      <NlpSection id="overview" marker="01" tone="teal" question="같은 단어 vector라도 순서가 다르면 문장 의미가 달라진다" title="RNN은 하나의 cell을 시간축으로 재사용해 상태를 갱신한다">
        <QuestionLead question="고정 embedding에 과거 순서를 어떻게 넣을까?" answer="현재 입력 xₜ와 직전 hidden state hₜ₋₁을 같은 recurrent cell에 넣는다. Cell의 weight는 모든 timestep에서 공유되고, 새 state는 지금까지 읽은 prefix의 압축 표현이 된다." />
        <p><InternalLink slug="word2vec">Word2Vec</InternalLink>은 같은 단어에 하나의 고정 vector를 주었다. RNN은 그 vector를 시간 순서대로 읽고, 같은 transition을 반복 적용해 현재 문맥에 따른 state를 만든다.</p>
        <ConceptPrimer items={[
          { term: 'hidden state', meaning: '현재 위치까지 읽은 정보의 고정 크기 vector다.', why: '다음 위치로 과거 정보를 전달하는 유일한 recurrent 경로다.' },
          { term: 'weight sharing', meaning: '모든 timestep에 같은 input·recurrent matrix를 사용한다.', why: '길이가 달라도 같은 transition rule을 적용하고 parameter 수를 고정한다.' },
          { term: 'unrolling', meaning: '하나의 recurrent cell을 시간별 복사본처럼 펼쳐 계산 graph로 보는 방식이다.', why: 'BPTT에서 어느 경로로 gradient가 이동하는지 드러낸다.' },
          { term: 'teacher forcing', meaning: '학습 시 직전 정답 token을 다음 recurrent input으로 주는 방식이다.', why: '정답 prefix의 next-token likelihood를 학습하지만, 생성 시에는 자기 예측을 다시 입력하므로 별도의 rollout error가 생긴다.' },
        ]} />
        <FlowRow items={[{ label: 'Previous memory', value: 'hₜ₋₁ ∈ Rʰ', note: 'prefix 정보' }, { label: 'Current input', value: 'xₜ ∈ Rᵉ', note: '현재 token embedding' }, { label: 'Shared cell', value: 'tanh(Wₓxₜ + Wₕhₜ₋₁)', note: '모든 t에 같은 weight' }, { label: 'New memory', value: 'hₜ ∈ Rʰ', note: '다음 step과 output으로 전달' }]} activeIndex={2} />
      </NlpSection>

      <NlpSection id="state" marker="02" tone="blue" question="State는 과거를 복사하지 않고 매번 다시 쓴다" title="현재 입력과 직전 상태의 합을 비선형 변환한다">
        <p>아래 scalar RNN은 matrix 연산의 한 좌표만 떼어 본 것이다. Input contribution과 memory contribution이 먼저 더해지고 tanh가 값을 -1과 1 사이로 압축한다. Recurrent weight를 바꾸면 같은 입력 sequence도 과거를 유지하거나 반전하는 방식이 달라진다.</p>
        <RecurrenceExplorer />
        <div className="not-prose my-6 min-w-0 rounded-md border border-blue-500/40 bg-blue-500/5 p-3">
          <MathFormula display className="my-0 text-xs sm:text-sm">{String.raw`\begin{aligned}
\underbrace{a_t=W_xx_t+W_hh_{t-1}+b_h}_{\text{현재 입력과 이전 상태를 같은 공간에서 합침}}\\
\underbrace{h_t=\tanh(a_t)}_{\text{합친 정보를 새 hidden state로 압축}}
\end{aligned}`}</MathFormula>
        </div>
        <FormulaNote meaning="두 matrix는 현재 입력과 과거 상태를 같은 hidden dimension으로 투영한 뒤 더한다. Tanh를 쓰면 state가 무한히 커지는 것을 제한하고 양수·음수 신호를 모두 남긴다. 하지만 큰 preactivation에서는 derivative가 거의 0이 되어 장기 gradient를 약하게 만든다." symbols={[[String.raw`x_t`, 't번째 token embedding, 차원 e'], [String.raw`h_{t-1}`, '직전 hidden state, 차원 h'], [String.raw`W_x`, 'input을 hidden 차원으로 바꾸는 h×e matrix'], [String.raw`W_h`, 'hidden state를 다시 변환하는 h×h matrix']]} />
      </NlpSection>

      <NlpSection id="language-model" marker="03" tone="violet" question="각 prefix에서 다음 token 분포를 예측한다" title="RNN language model은 state를 vocabulary logits로 투영한다">
        <p>각 hidden state를 vocabulary 크기의 logits로 바꾸고 softmax로 다음 token 확률을 만든다. 학습 target은 입력 sequence를 한 칸 왼쪽으로 이동한 값이다. Teacher forcing에서는 정답 prefix를 읽은 state로 다음 token likelihood를 계산한다. 생성에서는 직전 예측 token이 다음 state update에 들어가므로 학습 loss와 free-running rollout 품질은 같은 측정값이 아니다.</p>
        <LanguageModelExplorer />
        <div className="not-prose my-6 min-w-0 rounded-md border border-blue-500/40 bg-blue-500/5 p-3">
          <MathFormula display className="my-0 text-xs sm:text-sm">{String.raw`\begin{aligned}
\underbrace{z_t=W_oh_t+b_o}_{\text{hidden state를 vocabulary 점수로 투영}}\\
\underbrace{p_\theta(y_{t+1}\mid y_{\le t})=\operatorname{softmax}(z_t)}_{\text{정답 prefix에서 다음 token 확률을 계산}}
\end{aligned}`}</MathFormula>
        </div>
        <FormulaNote meaning="Output matrix는 h차원 state를 vocabulary마다 하나의 logit으로 바꾼다. Softmax는 경쟁하는 다음-token 점수를 합이 1인 조건부 확률로 정규화한다. Prefix를 조건으로 쓰는 이유는 생성 시 미래 token을 볼 수 없기 때문이다." symbols={[[String.raw`W_o`, 'vocabulary 크기 V × hidden 크기 h'], [String.raw`z_t`, 'V개 다음-token logit'], [String.raw`y_{<t}`, 't 이전의 token prefix']]} />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\underbrace{\ell_{b,t}=-m_{b,t}\log p_\theta(y_{b,t+1}\mid y_{b,\le t})}_{\text{정답 다음 token의 masked negative log likelihood}},\qquad \mathcal L=\frac{\sum_{b,t}\ell_{b,t}}{\underbrace{\sum_{b,t}m_{b,t}}_{\text{batch의 유효 target 수}}}`}</MathFormula></div>
        <FormulaNote meaning="Mask mᵦ,ₜ가 0인 PAD target은 loss에서 제외한다. 확률에 log를 씌우면 정답 확률을 키우는 곱셈 목표가 더하기 쉬운 손실이 되고, batch 전체의 유효 target 수로 나누면 sequence 길이와 padding 양이 달라도 같은 척도로 비교할 수 있다." symbols={[[String.raw`b,t`, 'batch sample과 그 안의 timestep index'], [String.raw`m_{b,t}`, 't+1 target이 실제 token이면 1, PAD면 0'], [String.raw`y_{b,\le t}`, 'b번째 sample에서 현재 token까지의 관측 prefix']]} />
      </NlpSection>

      <NlpSection id="bptt" marker="04" tone="amber" question="마지막 loss가 처음 state까지 어떤 크기로 도착할까?" title="BPTT의 gradient는 recurrent Jacobian을 시간만큼 곱한다">
        <p>Unrolled RNN은 weight를 공유하는 깊은 network처럼 보인다. 먼 과거 state의 영향은 각 timestep의 local Jacobian을 연속으로 통과한다. 평균 크기가 1보다 작으면 지수적으로 사라지고, 1보다 크면 폭발한다. Tanh derivative도 1 이하이므로 saturation은 소실을 더 강하게 만든다.</p>
        <GradientExplorer />
        <div className="not-prose my-6 min-w-0 rounded-md border border-blue-500/40 bg-blue-500/5 p-3">
          <MathFormula display className="my-0 text-xs sm:text-sm">{String.raw`\begin{aligned}
\underbrace{J_j=\operatorname{diag}(1-h_j^2)W_h}_{\text{한 recurrent step의 국소 Jacobian}}\\
\underbrace{\frac{\partial h_t}{\partial h_k}=J_tJ_{t-1}\cdots J_{k+1}}_{\text{먼 과거까지 시간 역순으로 Jacobian을 곱함}}
\end{aligned}`}</MathFormula>
        </div>
        <FormulaNote meaning="Chain rule은 local Jacobian을 미래 timestep부터 과거 방향 순서로 곱한다. Matrix는 일반적으로 교환되지 않으므로 순서를 바꿀 수 없다. 각 Jacobian의 주된 크기가 계속 1보다 작거나 크면 거리만큼 곱해져 gradient가 소실하거나 폭발한다. Scalar 근사에서는 0.8⁴⁰≈1.33×10⁻⁴이고 1.1⁴⁰≈45.26이다." symbols={[[String.raw`J_j`, 'h_{j-1}에서 h_j로 가는 local Jacobian'], [String.raw`\mathrm{diag}(1-h_j^2)`, 'j번째 tanh의 좌표별 derivative'], [String.raw`W_h`, '모든 timestep이 공유하는 recurrent linear map']]} />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\underbrace{\frac{\partial \mathcal L}{\partial W_h}=\sum_{t=1}^{T}\frac{\partial \mathcal L}{\partial a_t}h_{t-1}^{\top}}_{\text{공유 recurrent weight의 모든 사용 시점에서 gradient를 합산}}`}</MathFormula></div>
        <FormulaNote meaning="Unrolling 그림에는 cell이 여러 개처럼 보이지만 Wₕ는 하나다. 따라서 각 timestep에서 같은 parameter가 받은 gradient를 모두 더한다. Outer product를 쓰는 이유는 hidden 입력의 각 좌표가 preactivation의 각 좌표에 준 영향을 h×h matrix 모양으로 복원하기 위해서다." symbols={[[String.raw`a_t`, 't번째 tanh 직전 preactivation'], [String.raw`\partial\mathcal L/\partial a_t`, '미래 loss까지 합쳐져 t에 도착한 adjoint'], [String.raw`h_{t-1}^{\top}`, '해당 transition에 실제로 들어간 이전 state']]} />
        <Misconception>Gradient clipping은 폭발한 norm을 제한하지만 사라진 장기 신호를 되살리지는 않는다. LSTM gate, residual path, normalization, initialization과 더 짧은 credit-assignment 경로가 별도로 필요하다.</Misconception>
      </NlpSection>

      <NlpSection id="limits" marker="05" tone="green" question="수식이 맞아도 batching과 state 경계가 틀리면 다른 모델이 된다" title="Padding·state reset·truncated BPTT를 실행 계약으로 관리한다">
        <p>실제 batch는 sequence 길이가 다르므로 PAD를 채운다. PAD 위치에서 loss를 계산하거나 state를 계속 갱신하면 가짜 시간 정보가 섞인다. 긴 stream을 chunk로 나눌 때는 hidden value를 다음 chunk로 넘기면서 이전 computation graph를 detach해 memory 사용을 제한한다.</p>
        <SequenceBatchExplorer />
        <Takeaway>RNN은 순서를 state transition으로 모델링하지만 모든 과거를 고정 크기 state 하나에 압축하고 timestep을 직렬로 실행한다. <InternalLink slug="lstm">LSTM 구조</InternalLink>는 이 gradient 경로를 gated cell state로 바꾼다. 같은 memory를 실제 예측 문제에 쓰려면 <InternalLink slug="lstm-timeseries">LSTM 시계열</InternalLink>에서 window target, state reset, rolling origin과 recursive rollout을 추가로 고정해야 한다.</Takeaway>
        <CapabilityCheck items={[
          '전이 문제: 서로 독립인 두 문장을 한 batch에서 순서대로 처리할 때 hidden state를 어디서 reset해야 정보 누출이 없는지 판정할 수 있다.',
          '전이 문제: Teacher-forced next-token NLL은 낮지만 free-running 생성이 무너질 때 정답 prefix와 자기 예측 prefix의 차이를 추적할 수 있다.',
          '전이 문제: 공유 Wₕ의 gradient가 timestep별 outer product의 합인 이유와 ordered Jacobian product의 방향을 함께 설명할 수 있다.',
          '전이 문제: 0.8⁴⁰과 1.1⁴⁰을 계산해 vanishing·exploding을 나누고 clipping이 어느 쪽만 제한하는지 판정할 수 있다.',
          '전이 문제: Padding mask, sequence-boundary reset과 truncated BPTT detach가 각각 loss, state value, computation graph 중 무엇을 소유하는지 구분할 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Learning long-term dependencies with gradient descent is difficult', href: 'https://doi.org/10.1109/72.279181', note: '장기 의존성이 gradient 학습에 만드는 근본적 난점을 분석한다.' },
          { label: 'On the difficulty of training recurrent neural networks', href: 'https://proceedings.mlr.press/v28/pascanu13.html', note: '소실·폭발 gradient를 해석하고 gradient norm clipping을 제안한다.' },
          { label: 'CS224N Language Models and RNNs', href: 'https://web.stanford.edu/class/cs224n/', note: 'RNN language modeling, BPTT와 구현 선수 지식의 학습 순서를 제공한다.' },
        ]} />
      </NlpSection>
    </>
  );
}
