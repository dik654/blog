import { useState } from 'react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { CapabilityCheck, ConceptPrimer, InternalLink, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import { FlowRow, MetricGrid, NlpSection, ProbabilityBars, SegmentedControl, Takeaway } from '../nlp-shared';

function GateSlider({ id, label, value, onChange, min = 0, max = 1, step = 0.05 }: { id: string; label: string; value: number; onChange: (value: number) => void; min?: number; max?: number; step?: number }) {
  return <label htmlFor={id} className="block text-xs font-semibold text-muted-foreground">{label} · {step >= 1 ? value : value.toFixed(2)}<input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-2 block w-full accent-foreground" /></label>;
}

function GateExplorer() {
  const [forget, setForget] = useState(0.75);
  const [input, setInput] = useState(0.35);
  const [candidate, setCandidate] = useState(0.5);
  const [output, setOutput] = useState(0.65);
  const [previousCell, setPreviousCell] = useState(0.8);
  const kept = forget * previousCell;
  const written = input * candidate;
  const cell = kept + written;
  const hidden = output * Math.tanh(cell);

  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid gap-4 border-b border-border bg-muted/20 p-4 sm:grid-cols-2 lg:grid-cols-5 sm:p-6">
        <GateSlider id="lstm-forget" label="forget fₜ" value={forget} onChange={setForget} />
        <GateSlider id="lstm-input" label="input iₜ" value={input} onChange={setInput} />
        <GateSlider id="lstm-candidate" label="candidate gₜ" value={candidate} onChange={setCandidate} min={-1} max={1} />
        <GateSlider id="lstm-output" label="output oₜ" value={output} onChange={setOutput} />
        <GateSlider id="lstm-cell-prev" label="previous cₜ₋₁" value={previousCell} onChange={setPreviousCell} min={-2} max={2} />
      </div>
      <div className="p-4 sm:p-6">
        <FlowRow items={[{ label: 'Keep old memory', value: `${forget.toFixed(2)} × ${previousCell.toFixed(2)} = ${kept.toFixed(3)}`, note: 'fₜ ⊙ cₜ₋₁' }, { label: 'Write candidate', value: `${input.toFixed(2)} × ${candidate.toFixed(2)} = ${written.toFixed(3)}`, note: 'iₜ ⊙ gₜ' }, { label: 'Cell update', value: `${kept.toFixed(3)} + ${written.toFixed(3)} = ${cell.toFixed(3)}`, note: '두 경로를 더한다.' }, { label: 'Visible state', value: `${output.toFixed(2)} × tanh(${cell.toFixed(3)}) = ${hidden.toFixed(3)}`, note: 'oₜ ⊙ tanh(cₜ)' }]} activeIndex={2} />
        <div className="mt-5"><MetricGrid items={[
          { label: 'kept memory', value: kept.toFixed(3), note: '이전 cell에서 남은 양' },
          { label: 'new write', value: written.toFixed(3), note: '현재 입력이 추가한 양' },
          { label: 'cell state cₜ', value: cell.toFixed(3), note: '내부 장기 memory', accent: true },
          { label: 'hidden state hₜ', value: hidden.toFixed(3), note: '외부로 노출된 state' },
        ]} /></div>
      </div>
    </div>
  );
}

function RetentionExplorer() {
  const [forget, setForget] = useState(0.92);
  const [distance, setDistance] = useState(30);
  const retained = forget ** distance;
  const halfLife = forget === 1 ? Infinity : Math.log(0.5) / Math.log(forget);
  const points = Array.from({ length: 41 }, (_, index) => `${30 + index * 7.5},${24 + (1 - forget ** index) * 120}`).join(' ');
  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid gap-4 border-b border-border bg-muted/20 p-4 sm:grid-cols-2 sm:p-6">
        <label htmlFor="forget-retention" className="block text-xs font-semibold text-muted-foreground">일정한 forget gate · {forget.toFixed(2)}<input id="forget-retention" type="range" min="0.5" max="1" step="0.01" value={forget} onChange={(event) => setForget(Number(event.target.value))} className="mt-3 block w-full accent-foreground" /></label>
        <label htmlFor="retention-distance" className="block text-xs font-semibold text-muted-foreground">기억 거리 · {distance} step<input id="retention-distance" type="range" min="1" max="40" step="1" value={distance} onChange={(event) => setDistance(Number(event.target.value))} className="mt-3 block w-full accent-foreground" /></label>
      </div>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-center">
        <svg viewBox="0 0 350 175" className="block aspect-[350/175] w-full" role="img" aria-label={`forget gate ${forget.toFixed(2)}일 때 기억 감소`}>
          <line x1="30" y1="144" x2="330" y2="144" stroke="currentColor" opacity="0.2" /><line x1="30" y1="24" x2="30" y2="144" stroke="currentColor" opacity="0.2" />
          <polyline points={points} fill="none" stroke="#2563eb" strokeWidth="3" />
          <circle cx={30 + distance * 7.5} cy={24 + (1 - retained) * 120} r="4" fill="#d97706" />
          <text x="330" y="164" textAnchor="end" fontSize="10" fill="currentColor" opacity="0.55">기억 거리</text><text x="36" y="20" fontSize="10" fill="currentColor" opacity="0.55">남은 직접 신호</text>
        </svg>
        <MetricGrid items={[
          { label: `${distance} step 후`, value: `${(retained * 100).toFixed(2)}%`, note: `${forget.toFixed(2)}^${distance}` },
          { label: 'half-life', value: Number.isFinite(halfLife) ? `${halfLife.toFixed(1)} step` : '∞', note: '기억이 절반으로 줄어드는 거리', accent: retained >= 0.5 },
        ]} />
      </div>
    </div>
  );
}

function FusedGateWorkbench() {
  const [batch, setBatch] = useState(16);
  const [sequence, setSequence] = useState(24);
  const [inputSize, setInputSize] = useState(96);
  const [hiddenSize, setHiddenSize] = useState(192);
  const fusedSize = 4 * hiddenSize;
  const conceptualInput = inputSize + hiddenSize;

  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid gap-4 border-b border-border bg-muted/20 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
        <GateSlider id="lstm-shape-batch" label="batch B" value={batch} onChange={setBatch} min={1} max={64} step={1} />
        <GateSlider id="lstm-shape-sequence" label="sequence T" value={sequence} onChange={setSequence} min={4} max={64} step={1} />
        <GateSlider id="lstm-shape-input" label="input e" value={inputSize} onChange={setInputSize} min={32} max={256} step={16} />
        <GateSlider id="lstm-shape-hidden" label="hidden h" value={hiddenSize} onChange={setHiddenSize} min={32} max={512} step={32} />
      </div>
      <div className="p-4 sm:p-6">
        <FlowRow items={[
          { label: 'Input sequence', value: `x [${batch}, ${sequence}, ${inputSize}]`, note: '각 token의 input vector' },
          { label: 'Input projection', value: `Wₓx [${batch}, ${sequence}, ${fusedSize}]`, note: 'T축을 한 번에 계산 가능' },
          { label: 'Recurrent add', value: `qₜ [${batch}, ${fusedSize}]`, note: 'Wₕhₜ₋₁ 때문에 t는 순차 실행' },
          { label: 'Stack and split', value: `[${batch}, ${sequence}, 4, ${hiddenSize}]`, note: '계산된 qₜ를 T축에 쌓아 네 gate로 분리' },
        ]} activeIndex={2} />
        <div className="mt-5"><MetricGrid items={[
          { label: 'conceptual weight', value: `[${fusedSize}, ${conceptualInput}]`, note: `${conceptualInput} = input ${inputSize} + hidden ${hiddenSize}` },
          { label: 'PyTorch weight_ih', value: `[${fusedSize}, ${inputSize}]`, note: 'input 전용 matrix' },
          { label: 'PyTorch weight_hh', value: `[${fusedSize}, ${hiddenSize}]`, note: 'hidden 전용 matrix' },
          { label: 'gate tensor', value: `[${batch}, ${sequence}, 4×${hiddenSize}]`, note: '마지막 축을 네 gate로 split', accent: true },
        ]} /></div>
      </div>
    </div>
  );
}

type CellType = 'lstm' | 'gru';
type Direction = 'causal' | 'bidirectional';
const cells: Record<CellType, { state: string; gates: string; compute: string; limit: string }> = {
  lstm: { state: 'hₙ와 cₙ 두 state', gates: 'forget · input · candidate · output', compute: '4h channel', limit: 'Cell과 visible state를 분리하지만 parameter가 더 많다.' },
  gru: { state: 'hₙ 한 state', gates: 'reset · update · candidate', compute: '3h channel', limit: '더 작지만 cell과 visible state를 따로 제어하지 않는다.' },
};

function VariantWorkbench() {
  const [cellType, setCellType] = useState<CellType>('lstm');
  const [direction, setDirection] = useState<Direction>('causal');
  const cell = cells[cellType];
  const directions = direction === 'bidirectional' ? 2 : 1;
  const stateNames = cellType === 'lstm' ? 'hₙ, cₙ 각각' : 'hₙ';
  return (
    <div className="not-prose my-8 rounded-md border border-border p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><p className="mb-2 text-xs font-bold text-muted-foreground">Cell 계산</p><SegmentedControl label="Recurrent cell 종류" options={[{ value: 'lstm', label: 'LSTM' }, { value: 'gru', label: 'GRU' }]} value={cellType} onChange={setCellType} /></div>
        <div><p className="mb-2 text-xs font-bold text-muted-foreground">문맥 방향</p><SegmentedControl label="Recurrent 문맥 방향" options={[{ value: 'causal', label: 'Causal' }, { value: 'bidirectional', label: 'Bidirectional' }]} value={direction} onChange={setDirection} /></div>
      </div>
      <dl className="mt-5 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
        {[
          ['상태 계약', cell.state],
          ['Gate와 계산', `${cell.gates} · ${cell.compute}`],
          ['Sequence output', `[32, 50, ${directions * 256}]`],
          ['Final state', `${stateNames} [${directions}×layers, 32, 256]`],
          ['Streaming', direction === 'causal' ? '가능 · 미래 입력을 읽지 않는다.' : '불가 · 역방향 state가 미래 입력을 요구한다.'],
          ['남는 제약', cell.limit],
        ].map(([term, detail]) => <div key={term} className="min-w-0 bg-background p-4"><dt className="text-xs font-bold text-muted-foreground">{term}</dt><dd className="mt-1 break-words text-sm leading-relaxed">{detail}</dd></div>)}
      </dl>
    </div>
  );
}

type Diagnostic = 'healthy' | 'forget-closed' | 'input-open' | 'output-closed';
const diagnostics: Record<Diagnostic, { gates: Array<{ label: string; value: number }>; symptom: string; cause: string; check: string }> = {
  healthy: { gates: [{ label: 'forget', value: 0.88 }, { label: 'input', value: 0.35 }, { label: 'output', value: 0.62 }], symptom: '기억과 새 입력이 모두 gradient를 받는다.', cause: 'Gate가 열린 구간과 닫힌 구간을 데이터에 따라 나눈다.', check: 'Sequence 길이별 loss와 gate histogram을 함께 본다.' },
  'forget-closed': { gates: [{ label: 'forget', value: 0.08 }, { label: 'input', value: 0.42 }, { label: 'output', value: 0.61 }], symptom: '긴 문맥 성능만 급격히 떨어진다.', cause: 'cₜ₋₁ 경로가 매 step 거의 지워진다.', check: 'Forget bias 초기값, saturation과 실제 retention product를 본다.' },
  'input-open': { gates: [{ label: 'forget', value: 0.93 }, { label: 'input', value: 0.96 }, { label: 'output', value: 0.67 }], symptom: 'Cell norm이 커지고 최근 입력이 기억을 계속 덮는다.', cause: 'Candidate가 거의 매 step 제한 없이 더해진다.', check: 'Cell-state norm, input gate와 candidate 상관을 본다.' },
  'output-closed': { gates: [{ label: 'forget', value: 0.91 }, { label: 'input', value: 0.31 }, { label: 'output', value: 0.04 }], symptom: 'Cell에는 정보가 있지만 downstream output이 거의 변하지 않는다.', cause: 'Output gate가 visible hidden state를 차단한다.', check: 'cₜ와 hₜ norm을 따로 로깅한다.' },
};

function DiagnosticWorkbench() {
  const [diagnostic, setDiagnostic] = useState<Diagnostic>('healthy');
  const data = diagnostics[diagnostic];
  return (
    <div className="not-prose my-8 rounded-md border border-border p-4 sm:p-6">
      <SegmentedControl label="LSTM 진단 시나리오" options={[{ value: 'healthy', label: '균형' }, { value: 'forget-closed', label: '기억 소실' }, { value: 'input-open', label: '계속 덮어씀' }, { value: 'output-closed', label: '출력 차단' }]} value={diagnostic} onChange={setDiagnostic} />
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,0.8fr)]">
        <ProbabilityBars label="Gate activation 평균 예시 · 0에서 1 절대 척도" items={data.gates} scaleMax={1} />
        <dl className="space-y-3 text-sm"><div><dt className="text-xs font-bold text-muted-foreground">관찰 증상</dt><dd className="mt-1 leading-relaxed">{data.symptom}</dd></div><div><dt className="text-xs font-bold text-muted-foreground">가능한 원인</dt><dd className="mt-1 leading-relaxed">{data.cause}</dd></div><div><dt className="text-xs font-bold text-muted-foreground">검사</dt><dd className="mt-1 leading-relaxed">{data.check}</dd></div></dl>
      </div>
    </div>
  );
}

export default function RebuiltLstm() {
  return (
    <>
      <NlpSection id="overview" marker="01" tone="teal" question="과거 상태를 매번 tanh로 다시 쓰지 않고 보존 경로를 분리한다" title="LSTM은 cell state와 visible hidden state를 따로 관리한다">
        <QuestionLead question="RNN의 장기 gradient 곱을 어떻게 더 안정적인 경로로 바꿀까?" answer="Cell state에 이전 값을 곱하고 새 값을 더하는 거의 선형인 경로를 만든다. Forget·input·output gate가 보존, 기록, 노출을 각각 제어하므로 정보와 gradient가 같은 hidden state 하나에서 경쟁하지 않는다." />
        <p>오늘도 streaming sequence나 작은 recurrent baseline을 설계할 때는 미래 입력을 기다리지 않고 state를 갱신하는 계약이 필요하다. LSTM을 배우면 이 계약과 현대의 gated memory가 왜 필요한지를 가장 작은 계산으로 분해할 수 있다.</p>
        <p><InternalLink slug="rnn">RNN</InternalLink>에서 본 <MathFormula>{String.raw`J_tJ_{t-1}\cdots J_{k+1}`}</MathFormula>은 매 step recurrent matrix와 tanh derivative를 통과했다. LSTM은 이 경로와 별도로 이전 cell을 곱하고 새 내용을 더하는 memory 경로를 만든다.</p>
        <ConceptPrimer items={[
          { term: 'cell state cₜ', meaning: '시간을 따라 더 직접적으로 전달되는 내부 memory다.', why: '장기 정보와 gradient의 보존 경로를 hidden output에서 분리한다.' },
          { term: 'gate', meaning: 'Sigmoid가 0~1로 만든 좌표별 통과 비율이다.', why: '어떤 memory를 지우고 쓰고 보여줄지 입력에 따라 제어한다.' },
          { term: 'candidate gₜ', meaning: '현재 입력과 이전 hidden state에서 만든 새 memory 후보다.', why: 'Input gate와 곱해 실제 기록량을 분리한다.' },
          { term: 'modern LSTM', meaning: 'Forget gate를 포함해 오늘날 흔히 쓰는 변형을 뜻한다.', why: '1997 원 논문의 구조와 이후 추가된 forget gate를 구분해야 계보가 정확하다.' },
        ]} />
        <FlowRow items={[{ label: 'Old cell', value: 'cₜ₋₁', note: '장기 memory' }, { label: 'Forget', value: 'fₜ ⊙ cₜ₋₁', note: '남길 양' }, { label: 'Write', value: 'iₜ ⊙ gₜ', note: '새로 더할 양' }, { label: 'New cell', value: 'cₜ', note: '두 경로의 합' }, { label: 'Visible state', value: 'hₜ', note: 'output gate로 노출' }]} activeIndex={3} />
      </NlpSection>

      <NlpSection id="gates" marker="02" tone="blue" question="Gate 이름을 외우기보다 각 곱셈이 막는 경로를 본다" title="보존·기록·노출을 서로 다른 sigmoid로 제어한다">
        <p>모든 gate와 candidate는 현재 입력 xₜ와 이전 hidden state hₜ₋₁에서 함께 계산한다. 구현에서는 네 affine 연산을 하나의 큰 matrix multiplication으로 묶은 뒤 channel을 네 조각으로 나눈다. 아래에서는 각 gate 결과를 직접 움직여 cell update의 산술을 분리한다.</p>
        <FusedGateWorkbench />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\underbrace{q_t}_{4h}=\underbrace{W_xx_t}_{\text{현재 입력}}+\underbrace{W_hh_{t-1}}_{\text{직전 visible state}}+b,\qquad [q_f;q_i;q_g;q_o]\in\mathbb R^{4h}`}</MathFormula></div>
        <FormulaNote meaning="네 gate를 따로 계산해도 수학은 같지만, 4h channel로 묶으면 작은 matrix multiplication 네 번을 큰 연산으로 합쳐 GPU를 더 효율적으로 사용한다. Input projection Wₓx는 모든 T를 묶어 미리 계산할 수 있지만, Wₕhₜ₋₁은 직전 state가 필요해 timestep 순서대로 계산한다. 따라서 [B,T,4h]는 recurrent 계산 한 번의 입력 shape가 아니라 T개의 qₜ를 쌓은 결과 shape다. PyTorch는 weight를 weight_ih와 weight_hh로 나눠 저장한다." symbols={[[String.raw`q_t`, 't번째 네 gate preactivation을 이어 붙인 4h vector'], [String.raw`W_x`, 'shape 4h×e인 input weight, T축 병렬 계산 가능'], [String.raw`W_h`, 'shape 4h×h인 recurrent weight, timestep 순차 계산']]} />
        <GateExplorer />
        <div className="not-prose my-6 grid min-w-0 gap-2 sm:grid-cols-2">
          <div className="rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-sm">{String.raw`f_t=\sigma(W_f[x_t;h_{t-1}]+b_f)`}</MathFormula></div>
          <div className="rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-sm">{String.raw`i_t=\sigma(W_i[x_t;h_{t-1}]+b_i)`}</MathFormula></div>
          <div className="rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-sm">{String.raw`g_t=\tanh(W_g[x_t;h_{t-1}]+b_g)`}</MathFormula></div>
          <div className="rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-sm">{String.raw`o_t=\sigma(W_o[x_t;h_{t-1}]+b_o)`}</MathFormula></div>
        </div>
        <FormulaNote meaning="Sigmoid gate는 각 좌표를 0에서 1 사이의 통과 비율로 만들고, tanh candidate는 새 내용의 부호와 크기를 만든다. Concatenation을 쓰는 이유는 현재 입력과 이전 출력이 같은 gate 결정을 함께 조건화하도록 하기 위해서다." symbols={[[String.raw`f_t`, '이전 cell의 좌표별 보존 비율'], [String.raw`i_t`, 'candidate의 좌표별 기록 비율'], [String.raw`g_t`, '기록할 새 내용 후보'], [String.raw`o_t`, 'cell을 hidden으로 노출할 비율']]} />
      </NlpSection>

      <NlpSection id="cell-state" marker="03" tone="violet" question="LSTM도 무한히 기억하는 것은 아니다" title="Cell gradient는 forget gate의 누적으로 보존 길이를 결정한다">
        <p>Cell update는 이전 cell과 새 candidate를 더하는 두 경로로 분리된다. 이전 cell에 대한 local derivative는 forget gate다. Gate가 1에 가까우면 gradient가 오래 남지만 0.9를 수십 번 곱하면 결국 줄어든다. LSTM의 장점은 이 비율을 입력에 따라 학습할 수 있다는 점이지 자동 영구 기억이 아니다.</p>
        <div className="not-prose my-6 grid min-w-0 gap-2 sm:grid-cols-2">
          <div className="rounded-md border border-blue-500/40 bg-blue-500/5 p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`c_t=f_t\odot c_{t-1}+i_t\odot g_t`}</MathFormula></div>
          <div className="rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`h_t=o_t\odot\tanh(c_t)`}</MathFormula></div>
        </div>
        <FormulaNote meaning="Cell update는 이전 memory를 곱해 남기는 경로와 새 candidate를 곱해 쓰는 경로를 더한다. 덧셈 경로를 쓰는 이유는 이전 cell이 매 step 새 tanh 변환을 강제로 통과하지 않게 하기 위해서다. Hidden state는 output gate를 통해 필요한 부분만 외부 연산에 노출한다." symbols={[[String.raw`\odot`, '좌표별 곱'], [String.raw`c_t`, '내부 cell memory'], [String.raw`h_t`, '다음 layer와 output에 보이는 hidden state']]} />
        <div className="not-prose my-6 grid min-w-0 gap-2 sm:grid-cols-2">
          <div className="rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-sm">{String.raw`\left.\frac{\partial c_t}{\partial c_{t-1}}\right|_{\text{gate 출력 고정}}=\underbrace{\mathrm{diag}(f_t)}_{\text{직접 cell 경로}}`}</MathFormula></div>
          <div className="rounded-md border border-blue-500/40 bg-blue-500/5 p-3"><MathFormula display className="my-0 text-xs sm:text-sm">{String.raw`r_{k\to t}^{\mathrm{direct}}=\underbrace{\prod_{j=k+1}^{t}f_j}_{\text{forget gate 누적}}`}</MathFormula></div>
        </div>
        <FormulaNote meaning="이 식은 gate 출력과 candidate를 고정하고 cₜ₋₁에서 cₜ로 곧장 가는 경로만 미분한 것이다. 전체 derivative에는 cₜ₋₁→hₜ₋₁→다음 gate로 돌아가는 경로도 더해진다. 그래도 직접 경로는 recurrent matrix와 tanh를 매번 통과하지 않으므로 RNN보다 보존율을 명시적으로 제어할 수 있다." symbols={[[String.raw`\mathrm{diag}(f_t)`, 'forget gate를 대각선에 둔 좌표별 직접 derivative'], [String.raw`r_{k\to t}^{\mathrm{direct}}`, 'k에서 t까지 직접 cell 경로에 남은 비율'], [String.raw`\prod f_j`, '각 timestep의 보존 결정을 연속 적용한 값']]} />
        <RetentionExplorer />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`T_{1/2}=\frac{\ln(0.5)}{\ln(f)},\qquad 0.92^{30}\approx\underbrace{0.0820}_{\text{직접 신호 8.20\%}}`}</MathFormula></div>
        <FormulaNote meaning="일정한 forget 값 f를 몇 번 곱해야 절반이 되는지 지수식 fᴺ=0.5를 log로 풀면 half-life가 된다. f=0.92의 half-life는 약 8.31 step이므로 0.92가 1에 가까워 보여도 30 step 뒤 직접 신호는 8.20%뿐이다." symbols={[[String.raw`T_{1/2}`, '직접 cell 신호가 절반이 되는 step 수'], [String.raw`\ln`, '지수의 step 수를 앞으로 꺼내기 위한 자연로그'], [String.raw`f`, '단순화한 일정한 scalar forget gate']]} />
        <Misconception>1997 LSTM 원형과 현대 교과서 식은 완전히 같지 않다. Forget gate는 이후 continual sequence에서 memory를 reset하는 문제를 해결하기 위해 추가됐다. <InternalLink slug="paper-lstm-1997">LSTM 기반 논문 글</InternalLink>에서 이 역사적 구조와 현대 구현을 분리해 읽는다.</Misconception>
      </NlpSection>

      <NlpSection id="variants" marker="04" tone="amber" question="Gate 수보다 미래 문맥과 state 계약이 더 중요한 선택 기준이다" title="LSTM·GRU·bidirectional recurrence를 제약으로 비교한다">
        <p>GRU는 cell과 hidden을 하나로 합쳐 계산을 줄인다. Bidirectional 모델은 정방향과 역방향 state를 합쳐 현재 위치가 양쪽 문맥을 보게 한다. 하지만 미래 token을 읽는 구조는 streaming이나 autoregressive generation에서 사용할 수 없다.</p>
        <VariantWorkbench />
        <Takeaway>Bidirectional은 LSTM과 대체 관계가 아니다. 방향 수와 cell 종류는 별도 축이다. BiLSTM도 가능하고, causal LSTM도 가능하다. 먼저 서비스가 미래 입력을 볼 수 있는지 결정해야 한다.</Takeaway>
      </NlpSection>

      <NlpSection id="practice" marker="05" tone="green" question="최종 loss만 보면 어느 gate가 실패했는지 알 수 없다" title="Gate 분포와 cell·hidden norm을 분리해 진단한다">
        <p>같은 낮은 정확도도 forget gate가 닫힌 경우, input gate가 계속 열린 경우, output gate가 cell을 숨긴 경우의 원인이 다르다. Sequence 길이별 metric, gate activation histogram, cell·hidden norm과 gradient norm을 함께 기록해야 한다.</p>
        <DiagnosticWorkbench />
        <Misconception>Gate 평균과 norm은 원인 후보를 좁히는 관찰값이지 causal proof가 아니다. 특정 timestep의 candidate write를 막거나 forget gate를 고정하는 intervention, 같은 입력에 대한 ablation, 실제 <MathFormula>{String.raw`\prod_j f_j`}</MathFormula> 분포를 함께 비교해야 원인 주장이 강해진다.</Misconception>
        <Takeaway>LSTM은 RNN의 장기 gradient 경로를 개선하지만 모든 timestep이 이전 state에 의존하는 직렬성은 그대로다. 다음 <InternalLink slug="seq2seq">Seq2Seq</InternalLink>에서는 이 cell을 encoder와 decoder로 나누고, 그 다음 attention에서 고정 길이 압축 자체를 제거한다.</Takeaway>
        <CapabilityCheck items={['B=16, T=24, e=96, h=192에서 fused gate와 weight shape를 계산할 수 있다.', 'f=.75, i=.35, g=.5, o=.65, cₜ₋₁=.8에서 cₜ와 hₜ를 직접 복원할 수 있다.', 'Direct cell derivative와 gate 의존성을 포함한 total derivative를 구분할 수 있다.', '0.92³⁰의 retention과 half-life를 직접 계산할 수 있다.', 'LSTM·GRU와 causal·bidirectional을 독립 선택하고 output·state shape를 결정할 수 있다.', 'Gate histogram을 원인 증명으로 과해석하지 않고 intervention을 설계할 수 있다.']} />
        <SourceNotes sources={[
          { label: 'Long Short-Term Memory', href: 'https://direct.mit.edu/neco/article/9/8/1735/6109/Long-Short-Term-Memory', note: 'Decaying error backflow를 해결하기 위한 원 LSTM 구조와 실험을 제시한다.' },
          { label: 'Learning to Forget: Continual Prediction with LSTM', href: 'https://direct.mit.edu/neco/article/12/10/2451/6415/Learning-to-Forget-Continual-Prediction-with-LSTM', note: '현대 LSTM의 forget gate가 해결한 continual sequence 문제를 다룬다.' },
          { label: 'LSTM: A Search Space Odyssey', href: 'https://arxiv.org/abs/1503.04069', note: '여러 LSTM 변형을 대규모로 비교해 필수 구성과 차이를 점검한다.' },
          { label: 'PyTorch LSTM reference', href: 'https://docs.pytorch.org/docs/stable/generated/torch.nn.LSTM.html', note: 'weight_ih·weight_hh와 batch·direction·layer별 output, hidden, cell shape의 구현 계약을 확인한다.' },
        ]} />
      </NlpSection>
    </>
  );
}
