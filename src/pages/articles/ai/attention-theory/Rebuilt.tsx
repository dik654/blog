import { useMemo, useState } from 'react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { CapabilityCheck, ConceptPrimer, InternalLink, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import { FlowRow, MetricGrid, NlpSection, ProbabilityBars, SegmentedControl, Takeaway } from '../nlp-shared';

const keyVectors = [
  { label: '오래된', vector: [0.9, 0.1], value: [0.8, 0.2] },
  { label: '은행', vector: [0.45, 0.75], value: [0.2, 0.9] },
  { label: '건물', vector: [-0.15, 0.95], value: [-0.4, 0.7] },
];

function softmax(values: number[]) {
  const finiteValues = values.filter(Number.isFinite);
  if (finiteValues.length === 0) return values.map(() => 0);

  const max = Math.max(...finiteValues);
  const exps = values.map((value) => Number.isFinite(value) ? Math.exp(value - max) : 0);
  const total = exps.reduce((sum, value) => sum + value, 0);
  return exps.map((value) => value / total);
}

function AttentionScoreExplorer() {
  const [angle, setAngle] = useState(38);
  const [temperature, setTemperature] = useState(1);
  const [mask, setMask] = useState<'none' | 'causal' | 'padding' | 'all'>('none');
  const radians = (angle * Math.PI) / 180;
  const query = [Math.cos(radians), Math.sin(radians)];
  const rawScores = keyVectors.map(({ vector }) => (query[0] * vector[0] + query[1] * vector[1]) / temperature);
  const maskedScores = rawScores.map((score, index) => {
    if (mask === 'all') return Number.NEGATIVE_INFINITY;
    if (mask === 'causal' && index === 2) return Number.NEGATIVE_INFINITY;
    if (mask === 'padding' && index === 0) return Number.NEGATIVE_INFINITY;
    return score;
  });
  const finiteScores = maskedScores.filter(Number.isFinite);
  const rowValid = finiteScores.length > 0;
  const finiteMax = rowValid ? Math.max(...finiteScores) : null;
  const shiftedScores = maskedScores.map((score) => Number.isFinite(score) && finiteMax !== null ? score - finiteMax : Number.NEGATIVE_INFINITY);
  const weights = softmax(maskedScores);
  const output = [0, 1].map((dimension) => keyVectors.reduce((sum, item, index) => sum + weights[index] * item.value[dimension], 0));
  const weightSum = weights.reduce((sum, value) => sum + value, 0);
  const selectedKeyIndex = rowValid ? weights.indexOf(Math.max(...weights)) : -1;

  return (
    <div
      className="not-prose my-8 overflow-hidden rounded-md border border-border"
      data-attention-score-explorer
      data-mask-mode={mask}
      data-row-valid={rowValid ? 'true' : 'false'}
    >
      <div className="grid gap-5 border-b border-border bg-muted/20 p-4 sm:grid-cols-2 sm:p-6">
        <label htmlFor="attention-angle" className="block text-xs font-semibold text-muted-foreground">Query 방향 · {angle}°<input id="attention-angle" type="range" min="0" max="100" value={angle} onChange={(event) => setAngle(Number(event.target.value))} className="mt-3 block w-full accent-blue-600" /></label>
        <label htmlFor="attention-temperature" className="block text-xs font-semibold text-muted-foreground">Temperature τ · {temperature.toFixed(1)}<input id="attention-temperature" type="range" min="0.4" max="2" step="0.1" value={temperature} onChange={(event) => setTemperature(Number(event.target.value))} className="mt-3 block w-full accent-blue-600" /></label>
        <div className="sm:col-span-2"><SegmentedControl label="Attention mask" options={[{ value: 'none', label: 'mask 없음' }, { value: 'causal', label: '미래 token 차단' }, { value: 'padding', label: 'padding 차단' }, { value: 'all', label: '전체 row 차단' }]} value={mask} onChange={setMask} /></div>
      </div>
      <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(15rem,0.85fr)]">
        <div className="min-w-0">
          <p className="text-xs font-bold text-muted-foreground">한 query가 세 memory slot을 조회한다</p>
          <div className="mt-4 space-y-2">
            {keyVectors.map((item, index) => {
              const masked = !Number.isFinite(maskedScores[index]);
              return <div key={item.label} className={`grid min-w-0 gap-2 rounded-md border p-3 sm:grid-cols-[minmax(5rem,0.65fr)_minmax(0,1fr)_7rem_4.5rem] sm:items-center ${masked ? 'border-dashed border-border bg-muted/15 text-muted-foreground' : index === selectedKeyIndex ? 'border-blue-500/45 bg-blue-500/5' : 'border-border'}`}>
                <span className="font-mono text-xs font-bold">k{index + 1} · {item.label}</span>
                <span className="h-2 overflow-hidden rounded-sm bg-muted"><span className="block h-full bg-blue-600 transition-[width] duration-300" style={{ width: `${weights[index] * 100}%` }} /></span>
                <span className="font-mono text-[10px] text-muted-foreground">s {masked ? '−∞' : rawScores[index].toFixed(2)} · Δ {masked ? '−∞' : shiftedScores[index].toFixed(2)}</span>
                <span data-attention-weight className="text-right font-mono text-xs font-bold">α {weights[index].toFixed(3)}</span>
              </div>;
            })}
          </div>
          <div className="mt-5"><ProbabilityBars label="softmax attention weights" items={keyVectors.map((item, index) => ({ label: item.label, value: weights[index], color: ['#0d9488', '#2563eb', '#7c3aed'][index] }))} /></div>
        </div>
        <div className={`min-w-0 rounded-md border p-4 ${rowValid ? 'border-blue-500/35 bg-blue-500/[0.045]' : 'border-amber-500/45 bg-amber-500/[0.055]'}`}>
          <p className="text-xs font-bold text-muted-foreground">계산 결과</p>
          <dl className="mt-4 space-y-3 text-xs">
            <div><dt className="text-muted-foreground">query q</dt><dd className="mt-1 break-words font-mono font-bold">[{query.map((value) => value.toFixed(2)).join(', ')}]</dd></div>
            <div><dt className="text-muted-foreground">가장 많이 조회한 key</dt><dd data-attention-selected-key className="mt-1 font-bold">{rowValid ? keyVectors[selectedKeyIndex].label : '없음 · invalid row'}</dd></div>
            <div><dt className="text-muted-foreground">output o = Σ αᵢvᵢ</dt><dd data-attention-output className="mt-1 break-words font-mono font-bold">[{output.map((value) => value.toFixed(3)).join(', ')}]</dd></div>
            <div><dt className="text-muted-foreground">weight sum</dt><dd data-attention-weight-sum className="mt-1 font-mono font-bold">{weightSum.toFixed(3)}</dd></div>
          </dl>
          <div
            className={`mt-4 rounded border p-3 ${rowValid ? 'border-teal-500/30 bg-teal-500/[0.045]' : 'border-amber-500/40 bg-background/65'}`}
            aria-live="polite"
            data-attention-softmax-status
          >
            <p className="text-xs font-bold">{rowValid ? '정상 row · 허용 key 안에서 합 1' : 'safe softmax guard · 전체 차단 감지'}</p>
            <p className="mt-1 font-mono text-xs font-bold">{rowValid ? `α = [${weights.map((value) => value.toFixed(3)).join(', ')}]` : 'all masked → α = [0.000, 0.000, 0.000]'}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{rowValid ? 'Δ는 허용 score의 최댓값을 뺀 값이다. 같은 상수를 빼므로 weight는 변하지 않고 overflow를 막는다.' : '합 0.000인 이 결과는 유효한 확률분포가 아니다. 0 벡터는 NaN 전파만 막는 방어값이며, 실제 원인은 upstream mask 또는 빈 sequence에서 찾아야 한다.'}</p>
          </div>
          <p className="mt-4 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">Mask는 exponentiation 전에 금지 위치를 −∞로 바꾼다. 유효한 row에서는 max-shift 뒤 가장 큰 exp가 1이 되고, 전체 차단 row에서는 별도 guard가 계산을 중단해 오류 상태를 드러낸다.</p>
        </div>
      </div>
    </div>
  );
}

function ScoreFamilyExplorer() {
  const [mode, setMode] = useState<'additive' | 'dot' | 'scaled'>('scaled');
  const details = {
    additive: { formula: String.raw`e_{ti}=v_a^\top\tanh(W_q q_t+W_k k_i)`, projection: '별도 hidden space', cost: 'projection + tanh + dot', strength: 'q와 k 차원이 달라도 직접 맞출 수 있다.' },
    dot: { formula: String.raw`e_{ti}=q_t^\top k_i`, projection: '같은 dimension 필요', cost: 'batched matrix multiply', strength: '행렬 연산으로 매우 효율적이다.' },
    scaled: { formula: String.raw`e_{ti}=\frac{q_t^\top k_i}{\sqrt{d_k}}`, projection: '같은 head dimension', cost: 'matmul + scalar scale', strength: '큰 dₖ에서 softmax 포화를 줄인다.' },
  }[mode];
  const noteSymbols: Array<[string, string]> = mode === 'additive'
    ? [[String.raw`q_t`, '현재 decoder query'], [String.raw`k_i`, 'i번째 memory key'], [String.raw`W_q,W_k,v_a`, '두 입력을 같은 learned score space로 옮기고 scalar로 줄이는 parameter']]
    : mode === 'dot'
      ? [[String.raw`q_t^\top k_i`, 'query와 key의 방향·크기가 만드는 dot-product score']]
      : [[String.raw`q_t^\top k_i`, 'query와 key의 방향·크기가 만드는 dot-product score'], [String.raw`d_k`, 'scaled mode에서 score 분산을 정규화하는 head dimension']];
  return (
    <div className="not-prose my-8 rounded-md border border-border p-4 sm:p-6">
      <SegmentedControl label="Attention score family" options={[{ value: 'additive', label: 'Additive' }, { value: 'dot', label: 'Dot product' }, { value: 'scaled', label: 'Scaled dot product' }]} value={mode} onChange={setMode} />
      <div className="mt-5 grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(14rem,0.9fr)] lg:items-center">
        <div className="min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{details.formula}</MathFormula></div>
        <dl className="grid gap-3 text-xs sm:grid-cols-3 lg:grid-cols-1">
          <div><dt className="font-semibold text-muted-foreground">표현 공간</dt><dd className="mt-1 font-bold">{details.projection}</dd></div>
          <div><dt className="font-semibold text-muted-foreground">주 연산</dt><dd className="mt-1 font-bold">{details.cost}</dd></div>
          <div><dt className="font-semibold text-muted-foreground">핵심 이유</dt><dd className="mt-1 leading-relaxed">{details.strength}</dd></div>
        </dl>
      </div>
      <FormulaNote meaning={mode === 'additive' ? 'Query와 key를 별도 projection한 뒤 더하고 tanh를 통과시켜 learned compatibility를 만든다. 마지막 vₐ 내적은 비교 결과를 한 개 scalar score로 줄인다.' : mode === 'dot' ? '같은 dimension의 query와 key를 직접 내적한다. 모든 query-key pair를 하나의 matrix multiplication으로 계산할 수 있어 병렬 하드웨어에 적합하다.' : 'Dot product를 √dₖ로 나누어 head dimension이 커져도 score의 전형적 크기를 안정시킨다. 이는 softmax가 한 key에 너무 일찍 포화되는 것을 줄인다.'} symbols={noteSymbols} />
    </div>
  );
}

function MaskOrderCheck() {
  const full = softmax([2, 1, 0]);
  const postZero = [full[0], full[1], 0];
  const preMask = softmax([2, 1, Number.NEGATIVE_INFINITY]);
  return (
    <div className="not-prose my-8 grid gap-3 sm:grid-cols-2">
      <div className="rounded-md border border-rose-500/35 bg-rose-500/[0.045] p-4">
        <p className="text-xs font-bold text-muted-foreground">softmax 뒤에 세 번째 weight만 0</p>
        <p className="mt-2 font-mono text-sm font-bold">[{postZero.map((value) => value.toFixed(3)).join(', ')}]</p>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">합 {postZero.reduce((sum, value) => sum + value, 0).toFixed(3)}. 금지 key가 이미 분모에 들어갔기 때문에 확률 질량이 사라진다.</p>
      </div>
      <div className="rounded-md border border-teal-500/40 bg-teal-500/[0.055] p-4">
        <p className="text-xs font-bold text-muted-foreground">score를 −∞로 바꾼 뒤 softmax</p>
        <p className="mt-2 font-mono text-sm font-bold">[{preMask.map((value) => value.toFixed(3)).join(', ')}]</p>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">합 {preMask.reduce((sum, value) => sum + value, 0).toFixed(3)}. 허용된 두 key 안에서 다시 합 1이 된다.</p>
      </div>
    </div>
  );
}

function ScalingExplorer() {
  const [dimension, setDimension] = useState<'8' | '64' | '512'>('64');
  const d = Number(dimension);
  const unscaledStd = Math.sqrt(d);
  const unscaled = softmax([unscaledStd, 0, -unscaledStd]);
  const scaled = softmax([1, 0, -1]);
  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="flex flex-col gap-3 border-b border-border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div><p className="text-sm font-bold">Unit-variance component를 dₖ개 더한 dot product</p><p className="mt-1 text-xs text-muted-foreground">독립·평균 0이라는 설명용 초기화 가정이다.</p></div>
        <SegmentedControl label="Key dimension" options={[{ value: '8', label: 'dₖ 8' }, { value: '64', label: 'dₖ 64' }, { value: '512', label: 'dₖ 512' }]} value={dimension} onChange={setDimension} />
      </div>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-2">
        <div className="rounded-md border border-amber-500/35 bg-amber-500/[0.045] p-4">
          <p className="text-xs font-bold text-muted-foreground">Scaling 전 · score 표준편차</p><p className="mt-2 font-mono text-2xl font-bold">√{d} = {unscaledStd.toFixed(2)}</p>
          <div className="mt-4"><ProbabilityBars label={`softmax([+${unscaledStd.toFixed(2)}, 0, −${unscaledStd.toFixed(2)}])`} items={['높음', '중간', '낮음'].map((label, index) => ({ label, value: unscaled[index] }))} /></div>
        </div>
        <div className="rounded-md border border-teal-500/40 bg-teal-500/[0.055] p-4">
          <p className="text-xs font-bold text-muted-foreground">√dₖ로 나눈 뒤 · score 표준편차</p><p className="mt-2 font-mono text-2xl font-bold">1.00</p>
          <div className="mt-4"><ProbabilityBars label="softmax([+1, 0, −1])" items={['높음', '중간', '낮음'].map((label, index) => ({ label, value: scaled[index] }))} /></div>
        </div>
      </div>
    </div>
  );
}

function SelfCrossExplorer() {
  const [kind, setKind] = useState<'self' | 'cross'>('self');
  const [causal, setCausal] = useState(false);
  const sourceLength = kind === 'self' ? 5 : 7;
  const targetLength = 5;
  const effectiveCausal = kind === 'self' && causal;
  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="flex flex-col gap-3 border-b border-border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <SegmentedControl label="Attention source" options={[{ value: 'self', label: 'Self-attention' }, { value: 'cross', label: 'Cross-attention' }]} value={kind} onChange={setKind} />
        <label className={`flex min-h-11 cursor-pointer items-center gap-2 text-xs font-semibold ${kind === 'cross' ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}><input type="checkbox" checked={effectiveCausal} disabled={kind === 'cross'} onChange={(event) => setCausal(event.target.checked)} className="h-4 w-4 accent-violet-600 disabled:cursor-not-allowed" />target causal mask</label>
      </div>
      <div className="p-4 sm:p-6">
        <FlowRow items={kind === 'self' ? [
          { label: '같은 sequence X', value: `[B=1, N=${targetLength}, d_model]`, note: 'Q, K, V의 공통 출발점', tone: 'teal' },
          { label: 'Linear projections', value: 'Q = XWQ · K = XWK · V = XWV', note: '서로 다른 조회 역할 학습', tone: 'blue' },
          { label: 'score matrix', value: `[B=1, Nq=${targetLength}, Nk=${sourceLength}]`, note: effectiveCausal ? '위쪽 삼각형 차단' : '모든 위치 조회', tone: 'violet' },
          { label: 'context', value: `[B=1, Nq=${targetLength}, d_v]`, note: '각 위치의 새 표현', tone: 'green' },
        ] : [
          { label: 'Decoder state Y', value: `[B=1, Nq=${targetLength}, d_model]`, note: 'query를 만든다.', tone: 'teal' },
          { label: 'Encoder memory X', value: `[B=1, Nk=${sourceLength}, d_model]`, note: 'key와 value를 만든다.', tone: 'blue' },
          { label: 'score matrix', value: `[B=1, Nq=${targetLength}, Nk=${sourceLength}]`, note: 'target × source 관계', tone: 'violet' },
          { label: 'decoder context', value: `[B=1, Nq=${targetLength}, d_v]`, note: 'source 정보를 합친다.', tone: 'green' },
        ]} activeIndex={2} />
        <div className="mt-5"><MetricGrid items={[
          { label: 'query length', value: `${targetLength}`, note: '출력 행 수' },
          { label: 'key/value length', value: `${sourceLength}`, note: kind === 'self' ? '같은 sequence 길이' : 'encoder memory 길이' },
          { label: 'score cells', value: `${targetLength * sourceLength}`, note: 'QKᵀ 원소 수' },
          { label: '접근 범위', value: effectiveCausal ? '현재까지' : '전체', note: kind === 'cross' ? 'source padding만 별도 차단' : effectiveCausal ? 'autoregressive target용' : '양방향 문맥', accent: true },
        ]} /></div>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">B는 batch 축</strong>이다. 화면은 B=1인 한 sample을 보여 주지만, 실제 tensor에서는 각 batch sample에 같은 attention 연산을 독립 적용하며 서로 다른 sample의 token을 섞지 않는다.</p>
        {kind === 'cross' && <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Decoder의 causal triangle은 target self-attention에 적용한다. Cross-attention의 열은 source 위치이므로 보통 미래 target이라는 개념이 없고, source PAD 위치만 mask한다.</p>}
      </div>
    </div>
  );
}

function MultiHeadExplorer() {
  const [headCount, setHeadCount] = useState<'1' | '2' | '4' | '8'>('4');
  const dModel = 16;
  const heads = Number(headCount);
  const headDim = dModel / heads;
  const sequenceLength = 6;
  const views = useMemo(() => [
    { name: '구문 연결', focus: '주어 ↔ 동사', tone: 'border-teal-500/40 bg-teal-500/5' },
    { name: '근거리 문맥', focus: '인접 token', tone: 'border-blue-500/40 bg-blue-500/5' },
    { name: '장거리 지시', focus: '대명사 ↔ 명사', tone: 'border-violet-500/40 bg-violet-500/5' },
    { name: '위치 패턴', focus: '구두점·경계', tone: 'border-amber-500/40 bg-amber-500/5' },
    { name: '의미 유사성', focus: '동의 표현', tone: 'border-emerald-500/40 bg-emerald-500/5' },
    { name: '형태 단서', focus: '접사·어미', tone: 'border-cyan-500/40 bg-cyan-500/5' },
    { name: '복사 단서', focus: '고유명사 반복', tone: 'border-rose-500/40 bg-rose-500/5' },
    { name: '잔여 관점', focus: '학습으로 결정', tone: 'border-border bg-muted/20' },
  ], []);
  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="flex flex-col gap-3 border-b border-border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div><p className="text-sm font-bold">d_model = {dModel}를 여러 조회 공간으로 분할</p><p className="mt-1 text-xs text-muted-foreground">총 투영 폭을 고정한 설명용 예시다.</p></div>
        <SegmentedControl label="Number of attention heads" options={[{ value: '1', label: '1 head' }, { value: '2', label: '2 heads' }, { value: '4', label: '4 heads' }, { value: '8', label: '8 heads' }]} value={headCount} onChange={setHeadCount} />
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{views.slice(0, heads).map((view, index) => <div key={view.name} className={`min-w-0 rounded-md border p-3 ${view.tone}`}><p className="font-mono text-[11px] font-bold text-muted-foreground">HEAD {String(index + 1).padStart(2, '0')} · dₖ={headDim}</p><p className="mt-2 text-sm font-bold">{view.name}</p><p className="mt-1 text-xs text-muted-foreground">{view.focus}</p></div>)}</div>
        <div className="mt-5"><FlowRow items={[{ label: 'Parallel heads', value: `[B=1, H=${heads}, N=${sequenceLength}, d=${headDim}]`, note: '서로 다른 WQ, WK, WV' }, { label: 'Concatenate', value: `[B=1, N=${sequenceLength}, Hd=${dModel}]`, note: 'head 결과를 feature 축으로 연결' }, { label: 'Output projection', value: `Wᴼ ∈ R${dModel}×${dModel}`, note: 'head 정보를 다시 섞는다.' }]} activeIndex={1} /></div>
        <div className="mt-5"><MetricGrid items={[
          { label: '총 projected width', value: `${heads}×${headDim} = ${dModel}`, note: 'head 수가 바뀌어도 d_model 유지' },
          { label: 'score tensor', value: `[B=1, H=${heads}, N=${sequenceLength}, N=${sequenceLength}]`, note: `${heads * sequenceLength * sequenceLength} attention weights` },
          { label: 'score dot-product MAC', value: `${sequenceLength * sequenceLength * dModel}`, note: `H·n²·dₖ = n²·d_model`, accent: true },
        ]} /></div>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">MAC</strong>은 한 번의 곱셈과 그 결과를 합계에 더하는 multiply-accumulate 연산이다. B를 늘리면 같은 head·sequence 계산을 sample 수만큼 반복하며 score shape의 맨 앞 축만 늘어난다.</p>
      </div>
    </div>
  );
}

export default function RebuiltAttentionTheory() {
  return (
    <>
      <NlpSection id="overview" marker="01" tone="teal" question="하나의 고정 context 대신 지금 필요한 memory 위치를 찾아 읽는다" title="Attention은 content-addressable memory 조회다">
        <QuestionLead question="Decoder가 긴 source의 어느 위치를 지금 사용해야 하는지 어떻게 찾을까?" answer="현재 필요한 정보의 표현인 query와 각 memory 위치의 key를 비교해 score를 만들고, softmax weight로 value를 섞는다. 위치 번호가 아니라 내용의 유사성으로 조회한다." />
        <p><InternalLink slug="seq2seq">Seq2Seq</InternalLink>의 encoder가 이미 만든 `h₁…hₘ`을 마지막 state 하나로 압축하지 않고 memory slot으로 보관한다고 생각하자. 현재 decoder state는 “이번 target에 어느 source 정보가 필요한가?”라는 query가 된다. 이 구체적인 번역 문제를 검색 역할 세 가지로 일반화한 것이 query, key, value다.</p>
        <ConceptPrimer items={[
          { term: 'query', meaning: '현재 위치가 찾고 있는 정보의 표현이다.', why: '같은 memory도 query가 달라지면 다른 위치를 읽는다.' },
          { term: 'key', meaning: '각 memory slot이 어떤 정보를 담았는지 검색용으로 표현한다.', why: 'Query와 비교해 관련도 score를 만든다.' },
          { term: 'value', meaning: '선택된 뒤 실제로 가져와 합칠 내용이다.', why: '검색 기준과 전달할 내용을 분리해 학습할 수 있다.' },
          { term: 'attention weight', meaning: 'Score를 softmax로 정규화한 비음수 가중치다.', why: '여러 value의 differentiable weighted sum을 만든다.' },
        ]} />
        <FlowRow items={[{ label: '질문', value: 'Q', note: '무엇을 찾는가', tone: 'teal' }, { label: '주소 비교', value: 'QKᵀ', note: '각 key와 관련도', tone: 'blue' }, { label: '선택 분포', value: 'softmax + mask', note: '허용된 위치에서 합 1', tone: 'violet' }, { label: '내용 읽기', value: 'AV', note: 'value의 가중합', tone: 'green' }]} activeIndex={2} />
      </NlpSection>

      <NlpSection id="score-softmax" marker="02" tone="blue" question="Score의 상대적 차이를 확률 질량으로 바꾸고 value를 합친다" title="score, mask, stable softmax, weighted sum을 한 번에 추적한다">
        <p>아래 예제에서 query 방향을 key 쪽으로 돌리면 해당 weight가 커진다. <strong>Causal mask</strong>는 autoregressive target의 미래 위치를 가리고, <strong>padding mask</strong>는 길이를 맞추려고 붙인 PAD 위치를 가린다. 둘 다 softmax 전에 금지 score를 −∞로 바꾸지만, 각 query 행에는 최소 한 개의 유한한 score가 남아야 한다. <strong>전체 row 차단</strong>을 선택하면 순진한 max-shift가 NaN을 만드는 경로와, NaN 전파를 막기 위해 0 벡터를 반환하면서 invalid row를 따로 보고하는 안전 가드를 직접 비교할 수 있다. Temperature는 분포 민감도를 눈으로 확인하는 교육용 control이고, Transformer의 <code>1/√dₖ</code>는 다음 섹션에서 유도할 고정 scale이다.</p>
        <AttentionScoreExplorer />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-[11px] sm:text-base">{String.raw`\operatorname{Attention}(Q,K,V)=\operatorname{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}+M\right)V`}</MathFormula></div>
        <FormulaNote meaning="QKᵀ의 각 행은 한 query가 모든 key에 부여한 score다. dₖ의 제곱근으로 나누어 차원이 커질 때 dot product 분산이 커지는 것을 억제한다. Mask M은 금지 위치에 −∞를 더하고, 행별 softmax가 합 1의 weight를 만든 뒤 V를 가중합한다. 단, 각 행에 허용 key가 적어도 하나 있어야 수학적인 softmax 분포가 정의된다. 구현의 0 벡터 fallback은 NaN 전파 방지용 sentinel이지 정상 attention 분포가 아니다." symbols={[[String.raw`Q`, '조회할 위치들의 query matrix'], [String.raw`K`, 'memory 위치들의 key matrix'], [String.raw`V`, '실제로 읽을 value matrix'], [String.raw`d_k`, '각 key/query의 feature dimension'], [String.raw`M`, '허용 위치는 0, 금지 위치는 −∞인 mask. 각 행에 0이 적어도 하나 필요하다.']]} />
        <MaskOrderCheck />
        <Misconception>Attention weight는 설명 가능한 원인 그 자체가 아니다. Weight는 특정 layer와 head에서 value를 섞은 비율이며, output projection·residual·다음 layer를 거친 최종 예측의 인과적 중요도와 항상 같지 않다.</Misconception>
      </NlpSection>

      <NlpSection id="additive-dot" marker="03" tone="violet" question="같은 조회라도 score 함수를 어떻게 계산하느냐에 따라 비용과 안정성이 달라진다" title="Additive attention에서 scaled dot-product attention으로">
        <p>Bahdanau attention은 decoder state와 encoder state를 작은 신경망으로 함께 투영해 정렬 score를 학습했다. Luong은 dot-product 계열을 체계화했고, Transformer는 모든 위치의 score를 큰 matrix multiplication으로 병렬 계산한다. 큰 feature dimension에서 dot product의 크기가 커지면 softmax가 포화되므로 √dₖ로 나눈다.</p>
        <ScoreFamilyExplorer />
        <ScalingExplorer />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\operatorname{Var}(q^\top k)=d_k,\qquad \operatorname{Var}\!\left(\frac{q^\top k}{\sqrt{d_k}}\right)=1`}</MathFormula></div>
        <FormulaNote meaning="각 component 곱이 서로 독립이고 평균 0·분산 1이라는 초기화 근사에서 dₖ개를 더한 dot product의 분산은 dₖ다. √dₖ로 나누면 분산은 dₖ/dₖ=1이 된다. Scaling은 query·key 방향을 바꾸지 않고 softmax에 들어가는 전형적 score 크기만 안정시킨다." symbols={[[String.raw`q^\top k`, 'dₖ개 component 곱을 더한 compatibility score'], [String.raw`d_k`, '한 head의 query·key feature 수'], [String.raw`\operatorname{Var}`, '초기화 분포에서 score가 퍼지는 정도']]} />
        <Takeaway>세 방식의 차이는 “attention인가 아닌가”가 아니라 compatibility function의 선택이다. 모두 score를 만들고, 정규화하고, value를 합친다는 동일한 조회 계약을 따른다.</Takeaway>
      </NlpSection>

      <NlpSection id="self-attention" marker="04" tone="amber" question="Q·K·V가 어느 sequence에서 왔는지를 보면 self와 cross를 구분할 수 있다" title="Self-attention은 sequence 자체를 memory로 다시 읽는다">
        <p>Self-attention에서는 같은 입력 X에서 Q, K, V를 각각 투영한다. 각 token은 한 번의 layer에서 다른 모든 token을 직접 참조할 수 있다. Cross-attention에서는 decoder가 query를 만들고 encoder output이 key와 value를 만든다. 두 연산의 수식은 같지만 tensor의 출처와 score matrix shape가 다르다.</p>
        <SelfCrossExplorer />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`Q=XW^Q,\qquad K=XW^K,\qquad V=XW^V`}</MathFormula></div>
        <FormulaNote meaning="같은 token representation X를 서로 다른 학습 projection에 통과시켜 조회 질문, 검색 주소, 전달 내용을 분리한다. 같은 X에서 출발해도 세 matrix는 역할이 다르며, W가 학습되면서 task에 유용한 비교 공간과 전달 공간을 만든다." symbols={[[String.raw`X`, 'n개 token의 현재 layer representation'], [String.raw`W^Q,W^K,W^V`, 'query·key·value용 학습 projection']]} />
      </NlpSection>

      <NlpSection id="multi-head" marker="05" tone="green" question="하나의 유사도 공간에 모든 관계를 압축하지 않고 여러 작은 조회를 병렬 수행한다" title="Multi-head attention은 관계를 보는 좌표계를 나눈다">
        <p>Head마다 독립적인 projection을 가지므로 같은 token pair도 다른 기준으로 비교할 수 있다. 아래 이름은 head가 반드시 그 문법 기능을 맡는다는 뜻이 아니라, 서로 다른 관점을 가질 수 있음을 보여주는 설계 예시다. 실제 역할은 데이터와 목적함수에서 emergent하게 정해지며 중복되거나 해석하기 어려울 수 있다.</p>
        <MultiHeadExplorer />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-[11px] sm:text-base">{String.raw`\mathrm{MHA}(Q,K,V)=\mathrm{Concat}(\mathrm{head}_1,\ldots,\mathrm{head}_h)W^O`}</MathFormula></div>
        <FormulaNote meaning="각 head는 축소된 feature 공간에서 attention을 독립적으로 계산한다. 결과를 feature 축으로 이어 붙이면 원래 model width가 되고, Wᴼ가 head 사이 정보를 다시 혼합해 residual stream으로 돌려보낸다." symbols={[[String.raw`h`, 'attention head 수'], [String.raw`\mathrm{head}_i`, 'i번째 projection 공간의 attention output'], [String.raw`W^O`, 'concatenated heads의 output projection']]} />
        <Takeaway>Attention의 본질은 Q·K·V라는 역할 분리와 differentiable retrieval이다. 다음 <InternalLink slug="transformer-architecture">Transformer</InternalLink>는 이 연산을 recurrence 없이 모든 위치에 병렬 적용하고, residual·normalization·MLP·position signal과 결합해 깊은 sequence backbone으로 만든다.</Takeaway>
        <CapabilityCheck items={['Query·key·value의 역할을 주소와 payload로 구분할 수 있다.', 'Max-shift stable softmax가 weight를 바꾸지 않는 이유를 설명할 수 있다.', 'Score [2,1,0]의 마지막 key를 softmax 뒤 0으로 만들 때 합이 1이 아닌 것을 계산할 수 있다.', '한 query 행을 전부 mask하면 순진한 stable softmax가 NaN이 되는 이유와, 안전 가드의 합 0 벡터가 유효한 확률분포가 아닌 이유를 설명할 수 있다.', 'dₖ=64에서 unscaled score 표준편차 8과 scaled 표준편차 1을 복원할 수 있다.', 'Self-attention과 cross-attention의 Q·K·V 출처 및 score shape를 추적할 수 있다.', 'Target causal mask와 source padding mask의 적용 위치를 구분할 수 있다.', 'Head 수가 바뀔 때 split·concat shape와 score MAC의 주항을 계산할 수 있다.', 'Attention weight를 최종 causal explanation으로 과해석하지 않는다.']} />
        <SourceNotes sources={[
          { label: 'Bahdanau et al. — Neural Machine Translation by Jointly Learning to Align and Translate', href: 'https://arxiv.org/abs/1409.0473', note: '고정 길이 encoder vector의 병목을 지적하고 additive alignment model을 제안한다.' },
          { label: 'Luong et al. — Effective Approaches to Attention-based Neural Machine Translation', href: 'https://aclanthology.org/D15-1166/', note: 'Global/local attention과 dot·general·concat score 함수를 비교한다.' },
          { label: 'Vaswani et al. — Attention Is All You Need', href: 'https://research.google/pubs/attention-is-all-you-need/', note: 'Scaled dot-product, multi-head, masking을 recurrence 없는 architecture의 핵심 연산으로 정의한다.' },
          { label: 'Stanford CS224N — Attention Exploration', href: 'https://cs224n.stanford.edu/assignments_w25/a4.pdf', note: 'Key norm, multiplicative attention, multi-head가 output에 미치는 영향을 수치로 검증하는 문제를 제공한다.' },
          { label: 'Jain & Wallace — Attention is not Explanation', href: 'https://arxiv.org/abs/1902.10186', note: 'Attention weight와 gradient importance가 다르고, 다른 weight 분포가 비슷한 prediction을 만들 수 있음을 보여준다.' },
        ]} />
      </NlpSection>
    </>
  );
}
