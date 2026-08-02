import { useMemo, useState } from 'react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { CapabilityCheck, ConceptPrimer, InternalLink, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import { FlowRow, MetricGrid, NlpSection, ProbabilityBars, SegmentedControl, Takeaway } from '../nlp-shared';

function EncoderDecoderExplorer() {
  const [sourceLength, setSourceLength] = useState(6);
  const [hiddenSize, setHiddenSize] = useState(4);
  const [layers, setLayers] = useState(2);
  const tokens = ['나는', '오늘', '도서관에서', '긴', '논문을', '천천히', '읽고', '핵심을', '정리했다', '</s>'].slice(0, sourceLength);
  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid gap-4 border-b border-border bg-muted/20 p-4 sm:grid-cols-3 sm:p-6">
        <label htmlFor="seq-source-length" className="block text-xs font-semibold text-muted-foreground">Source length m · {sourceLength}<input id="seq-source-length" type="range" min="3" max="10" step="1" value={sourceLength} onChange={(event) => setSourceLength(Number(event.target.value))} className="mt-3 block w-full accent-foreground" /></label>
        <label htmlFor="seq-hidden-size" className="block text-xs font-semibold text-muted-foreground">Illustrative hidden size h · {hiddenSize}<input id="seq-hidden-size" type="range" min="2" max="8" step="2" value={hiddenSize} onChange={(event) => setHiddenSize(Number(event.target.value))} className="mt-3 block w-full accent-foreground" /></label>
        <label htmlFor="seq-layers" className="block text-xs font-semibold text-muted-foreground">LSTM layer L · {layers}<input id="seq-layers" type="range" min="1" max="4" step="1" value={layers} onChange={(event) => setLayers(Number(event.target.value))} className="mt-3 block w-full accent-foreground" /></label>
      </div>
      <div className="p-4 sm:p-6">
        <div className="flex flex-wrap gap-1.5">{tokens.map((token, index) => <span key={`${token}-${index}`} className="rounded border border-border bg-muted/20 px-2 py-1 font-mono text-xs">x{index + 1} · {token}</span>)}</div>
        <div className="mt-5"><FlowRow items={[{ label: 'Source embeddings', value: `[m=${sourceLength}, e]`, note: '길이에 따라 행이 늘어난다.' }, { label: 'Encoder LSTM', value: `${sourceLength} recurrent steps`, note: '모든 h₁…hₘ을 계산' }, { label: 'Final state bridge', value: `hₘ,cₘ · [${layers}, B, ${hiddenSize}]`, note: 'source 길이 축이 없다.' }, { label: 'Decoder LSTM', value: 'BOS → y₁ … EOS', note: 'bridge로 초기화' }]} activeIndex={2} /></div>
        <div className="mt-5"><MetricGrid items={[
          { label: 'encoder state 위치', value: `${sourceLength}개`, note: '각 source step에 hidden state가 있다.' },
          { label: 'bridge tensor', value: `2 × [${layers}, B, ${hiddenSize}]`, note: 'hidden과 cell을 decoder 초기값으로 전달' },
          { label: 'sample당 전달값', value: `${2 * layers * hiddenSize} scalars`, note: 'm이 늘어도 변하지 않는다.' },
          { label: '직접 다시 읽는 source 위치', value: '0개', note: 'Attention 이전에는 final state만 사용', accent: true },
        ]} /></div>
      </div>
    </div>
  );
}

function SourceOrderExplorer() {
  const [order, setOrder] = useState<'normal' | 'reversed'>('normal');
  const normal = ['I', 'read', 'a', 'book'];
  const tokens = order === 'normal' ? normal : [...normal].reverse();
  const alignedIndex = tokens.indexOf('I');
  const recurrentEdges = tokens.length - alignedIndex;
  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="flex flex-col gap-3 border-b border-border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div><p className="text-sm font-bold">첫 target과 대응하는 source까지의 recurrent path</p><p className="mt-1 text-xs text-muted-foreground">원 논문의 source reversal은 표현력을 늘리기보다 최적화 경로를 짧게 했다.</p></div>
        <SegmentedControl label="Source token order" options={[{ value: 'normal', label: '원래 순서' }, { value: 'reversed', label: '역순' }]} value={order} onChange={setOrder} />
      </div>
      <div className="p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-2" aria-label={`${order} source order`}>
          {tokens.map((token, index) => <div key={`${token}-${index}`} className={`flex h-12 min-w-12 items-center justify-center rounded-md border px-3 font-mono text-xs font-bold ${token === 'I' ? 'border-teal-500/50 bg-teal-500/10' : 'border-border bg-muted/20'}`}>{token}</div>)}
          <span className="px-1 text-muted-foreground">→</span>
          <div className="flex h-12 items-center rounded-md border border-blue-500/40 bg-blue-500/5 px-3 font-mono text-xs font-bold">context</div>
          <span className="px-1 text-muted-foreground">→</span>
          <div className="flex h-12 items-center rounded-md border border-violet-500/40 bg-violet-500/5 px-3 font-mono text-xs font-bold">I</div>
        </div>
        <div className="mt-5"><MetricGrid items={[
          { label: 'aligned source', value: `x${alignedIndex + 1} · I`, note: '첫 target I와 직접 대응하는 설명용 token' },
          { label: 'context까지 recurrent edge', value: `${recurrentEdges}`, note: '뒤에 남은 source step과 context 진입' },
          { label: '최적화 효과', value: order === 'reversed' ? '짧은 의존성' : '긴 의존성', note: '같은 모델, 다른 계산 graph 거리', accent: order === 'reversed' },
        ]} /></div>
      </div>
    </div>
  );
}

function TrainingGapExplorer() {
  const [length, setLength] = useState(12);
  const [teacherForcing, setTeacherForcing] = useState(1);
  const singleStepAccuracy = 0.92;
  const freeRunPerfect = singleStepAccuracy ** length;
  const feedbackSlots = Math.max(0, length - 1);
  const expectedSelfInputs = (1 - teacherForcing) * feedbackSlots;
  const expectedGoldInputs = teacherForcing * feedbackSlots;
  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid gap-4 border-b border-border bg-muted/20 p-4 sm:grid-cols-2 sm:p-6">
        <label htmlFor="teacher-forcing" className="block text-xs font-semibold text-muted-foreground">학습 시 teacher forcing 비율 · {(teacherForcing * 100).toFixed(0)}%<input id="teacher-forcing" type="range" min="0" max="1" step="0.05" value={teacherForcing} onChange={(event) => setTeacherForcing(Number(event.target.value))} className="mt-3 block w-full accent-foreground" /></label>
        <label htmlFor="decode-length" className="block text-xs font-semibold text-muted-foreground">생성 길이 · {length} token<input id="decode-length" type="range" min="2" max="30" step="1" value={length} onChange={(event) => setLength(Number(event.target.value))} className="mt-3 block w-full accent-foreground" /></label>
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-border p-4"><p className="text-xs font-bold text-muted-foreground">학습 feedback</p><p className="mt-2 text-sm font-bold">gold 평균 {expectedGoldInputs.toFixed(1)} / {feedbackSlots} slot</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">BOS는 고정 입력이다. 그 뒤의 이전-token 자리만 ratio를 적용한다.</p></div>
          <div className="rounded-md border border-amber-600/40 bg-amber-500/5 p-4"><p className="text-xs font-bold text-muted-foreground">model feedback</p><p className="mt-2 text-sm font-bold">학습 {expectedSelfInputs.toFixed(1)} · 추론 {feedbackSlots} slot</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">추론에서는 한 번의 오류가 다음 입력 prefix를 바꾼다.</p></div>
        </div>
        <div className="mt-5"><MetricGrid items={[
          { label: '한 step 정답률 예시', value: `${(singleStepAccuracy * 100).toFixed(0)}%`, note: '독립 가정의 설명용 값' },
          { label: `${length} step 모두 정답`, value: `${(freeRunPerfect * 100).toFixed(1)}%`, note: `0.92^${length}` },
          { label: 'distribution gap', value: teacherForcing === 1 ? '최대' : teacherForcing === 0 ? '작음' : '부분', note: '정답 prefix와 model prefix의 차이', accent: teacherForcing < 0.5 },
        ]} /></div>
      </div>
    </div>
  );
}

type BeamNode = { text: string; conditional: number; probability: number; ended: boolean };

const nextTokens: Record<string, Array<{ token: string; probability: number }>> = {
  '<BOS>': [{ token: 'I', probability: 0.58 }, { token: 'We', probability: 0.42 }],
  'I': [{ token: 'am', probability: 0.51 }, { token: 'stay', probability: 0.49 }],
  'We': [{ token: 'stay', probability: 0.92 }, { token: 'are', probability: 0.08 }],
  'I am': [{ token: '<EOS>', probability: 0.58 }],
  'I stay': [{ token: '<EOS>', probability: 0.86 }],
  'We stay': [{ token: '<EOS>', probability: 0.95 }],
  'We are': [{ token: '<EOS>', probability: 0.70 }],
};

function expandBeam(nodes: BeamNode[]) {
  return nodes.flatMap((node) => (nextTokens[node.text] ?? []).map(({ token, probability }) => ({
    text: node.text === '<BOS>' ? token : `${node.text} ${token}`,
    conditional: probability,
    probability: node.probability * probability,
    ended: token === '<EOS>',
  }))).sort((a, b) => b.probability - a.probability);
}

function buildBeamHistory(beamWidth: number) {
  let live: BeamNode[] = [{ text: '<BOS>', conditional: 1, probability: 1, ended: false }];
  const history: Array<{ expanded: BeamNode[]; kept: Set<string> }> = [];
  for (let stage = 0; stage < 3; stage += 1) {
    const expanded = expandBeam(live);
    live = expanded.slice(0, beamWidth);
    history.push({ expanded, kept: new Set(live.map((item) => item.text)) });
  }
  return history;
}

function BeamExplorer() {
  const [beamWidth, setBeamWidth] = useState(2);
  const [stage, setStage] = useState(2);
  const history = useMemo(() => buildBeamHistory(beamWidth), [beamWidth]);
  const current = history[stage - 1];
  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid gap-4 border-b border-border bg-muted/20 p-4 sm:grid-cols-2 sm:p-6">
        <label htmlFor="beam-width" className="block text-xs font-semibold text-muted-foreground">유지할 hypothesis · beam width {beamWidth}<input id="beam-width" type="range" min="1" max="4" step="1" value={beamWidth} onChange={(event) => setBeamWidth(Number(event.target.value))} className="mt-3 block w-full accent-foreground" /></label>
        <label htmlFor="beam-stage" className="block text-xs font-semibold text-muted-foreground">Prefix expansion · stage {stage}<input id="beam-stage" type="range" min="1" max="3" step="1" value={stage} onChange={(event) => setStage(Number(event.target.value))} className="mt-3 block w-full accent-foreground" /></label>
      </div>
      <div className="p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3"><p className="text-xs font-bold text-muted-foreground">현재 beam을 모두 확장한 뒤 joint probability로 정렬</p><span className="rounded border border-border px-2 py-1 font-mono text-[10px]">top {beamWidth} 유지</span></div>
        <div className="space-y-2">{current.expanded.map((item, index) => { const kept = current.kept.has(item.text); return <div key={item.text} data-beam-kept={kept} className={`grid min-w-0 gap-2 rounded-md border p-3 sm:grid-cols-[2rem_minmax(0,1fr)_5rem_6rem_4rem] sm:items-center ${kept ? index === 0 ? 'border-blue-500/45 bg-blue-500/5' : 'border-border' : 'border-dashed border-border opacity-45'}`}><span className="font-mono text-xs font-bold">#{index + 1}</span><span className="break-words font-mono text-xs font-bold">{item.text}</span><span className="text-xs text-muted-foreground">조건부 {item.conditional.toFixed(2)}</span><span className="text-xs text-muted-foreground">joint {item.probability.toFixed(4)}</span><span className="text-xs font-bold">{kept ? item.ended ? '완료' : '유지' : '제거'}</span></div>; })}</div>
        <div className="mt-5"><MetricGrid items={[
          { label: 'Greedy · beam 1', value: 'I am <EOS>', note: `0.58×0.51×0.58 = ${(0.58 * 0.51 * 0.58).toFixed(4)}` },
          { label: 'Beam 2 best', value: 'We stay <EOS>', note: `0.42×0.92×0.95 = ${(0.42 * 0.92 * 0.95).toFixed(4)}`, accent: beamWidth >= 2 },
        ]} /></div>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Beam 1은 첫 단계의 0.58만 보고 <strong>I</strong>를 남긴다. Beam 2는 0.42인 <strong>We</strong>도 보존해 이후의 0.92·0.95와 결합할 기회를 남긴다. 이는 search가 더 나은 joint sequence를 찾은 것이지 model probability를 바꾼 것이 아니다.</p>
      </div>
    </div>
  );
}

function AttentionBridgeExplorer() {
  const [decoderStep, setDecoderStep] = useState<'1' | '2' | '3'>('2');
  const weights = {
    '1': [0.62, 0.23, 0.1, 0.05],
    '2': [0.08, 0.22, 0.54, 0.16],
    '3': [0.04, 0.09, 0.25, 0.62],
  }[decoderStep];
  const words = ['I', 'read', 'the paper', 'today'];
  return (
    <div className="not-prose my-8 rounded-md border border-border p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-bold">Decoder가 source memory를 다시 조회</p><p className="mt-1 text-xs text-muted-foreground">각 출력 step마다 다른 context vector를 만든다.</p></div><SegmentedControl label="Decoder timestep" options={[{ value: '1', label: 'y₁' }, { value: '2', label: 'y₂' }, { value: '3', label: 'y₃' }]} value={decoderStep} onChange={setDecoderStep} /></div>
        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-center">
          <ProbabilityBars label={`decoder y${decoderStep}의 source attention`} items={words.map((label, index) => ({ label, value: weights[index] }))} />
          <div className="min-w-0 rounded-md border border-blue-500/40 bg-blue-500/5 p-4">
            <p className="text-xs font-bold text-muted-foreground">점수에서 동적 context까지</p>
            <MathFormula display className="my-3 text-xs sm:text-sm">{String.raw`\alpha_t=\operatorname{softmax}(e_t)`}</MathFormula>
            <MathFormula display className="my-3 text-xs sm:text-sm">{String.raw`c_t=\sum_i\alpha_{t,i}h_i`}</MathFormula>
            <p className="text-xs leading-relaxed text-muted-foreground">하나의 마지막 state 대신 {words.length}개 encoder state의 가중합을 출력 위치마다 새로 만든다.</p>
          </div>
        </div>
    </div>
  );
}

export default function RebuiltSeq2Seq() {
  return (
    <>
      <NlpSection id="overview" marker="01" tone="teal" question="입력과 출력의 길이가 달라도 하나의 조건부 확률로 묶는다" title="Seq2Seq는 encoder가 읽고 decoder가 생성하는 두 단계 모델이다">
        <QuestionLead question="분류처럼 출력 하나가 아니라 새로운 token sequence 전체를 만들려면?" answer="Encoder가 source sequence를 state로 바꾸고 decoder가 그 state를 조건으로 BOS부터 한 token씩 생성한다. 목표 sequence의 확률은 각 위치의 다음-token 조건부 확률을 곱한 값이다." />
        <ConceptPrimer items={[
          { term: 'encoder', meaning: '입력 sequence를 읽어 decoder가 사용할 표현을 만든다.', why: '입력 길이와 출력 길이를 직접 맞추지 않아도 된다.' },
          { term: 'decoder', meaning: 'Encoder 표현과 이전 target token을 조건으로 다음 token을 생성한다.', why: 'EOS까지 가변 길이 출력을 만들 수 있다.' },
          { term: 'teacher forcing', meaning: '학습 중 이전 정답 target을 decoder 입력으로 준다.', why: '각 위치의 다음-token loss를 안정적으로 학습한다.' },
          { term: 'beam search', meaning: '점수가 높은 여러 prefix를 동시에 유지하는 근사 decoding이다.', why: '한 step의 greedy 선택이 전체 sequence 확률을 망치는 경우를 줄인다.' },
        ]} />
        <FlowRow items={[{ label: 'Source', value: 'x₁ … xₘ', note: '입력 길이 m' }, { label: 'Encoder', value: 'h₁ … hₘ', note: 'source state' }, { label: 'Condition', value: 'context', note: 'decoder로 전달' }, { label: 'Decoder', value: 'y₁ … yₙ', note: 'BOS부터 EOS까지' }]} activeIndex={2} />
        <p><InternalLink slug="lstm">LSTM</InternalLink> 글에서 계산한 hidden·cell state를 이제 두 network 사이의 interface로 사용한다. Encoder와 decoder가 같은 cell 종류여도 parameter는 별개이며, source를 읽는 목적과 target prefix를 생성하는 목적이 다르다.</p>
      </NlpSection>

      <NlpSection id="encoder-decoder" marker="02" tone="blue" question="Attention 이전에는 입력 전체를 마지막 state 하나로 전달했다" title="고정 길이 context vector가 encoder와 decoder를 잇는다">
        <p>기본 Seq2Seq는 encoder의 마지막 hidden·cell state로 decoder를 초기화한다. 입력 길이가 늘어도 전달 vector의 크기는 변하지 않는다. 이 고정 계약 덕분에 서로 다른 길이를 연결할 수 있지만, 긴 source의 모든 세부를 마지막 state 하나가 보존해야 하는 병목이 생긴다.</p>
        <EncoderDecoderExplorer />
        <div className="not-prose my-6 grid min-w-0 gap-2 sm:grid-cols-2">
          <div className="rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-sm">{String.raw`c=\mathrm{Encoder}(x_{1:m})`}</MathFormula></div>
          <div className="rounded-md border border-blue-500/40 bg-blue-500/5 p-3"><MathFormula display className="my-0 text-xs sm:text-sm">{String.raw`p(y_{1:n}\mid x)=\prod_{t=1}^{n}p(y_t\mid y_{<t},c)`}</MathFormula></div>
        </div>
        <FormulaNote meaning="Encoder는 길이 m의 source를 context c로 바꾸고 decoder는 이전 target prefix와 c를 조건으로 각 token 확률을 만든다. Product를 쓰는 이유는 chain rule로 전체 sequence 확률을 위치별 조건부 확률로 분해하기 위해서다." symbols={[[String.raw`x_{1:m}`, 'm개 source token'], [String.raw`y_{1:n}`, 'n개 target token'], [String.raw`c`, 'encoder가 decoder에 전달하는 조건 표현'], [String.raw`y_{<t}`, 't 이전 target prefix']]} />
        <Takeaway>Source reversal은 “영어를 거꾸로 읽는 것이 더 자연스럽다”는 주장이 아니다. 첫 target과 대응하는 source token을 encoder 끝에 가깝게 옮겨, 초기 decoder loss까지의 recurrent 경로를 짧게 만든 당시의 최적화 장치다.</Takeaway>
        <SourceOrderExplorer />
      </NlpSection>

      <NlpSection id="training" marker="03" tone="violet" question="정답 prefix로 학습한 모델이 자기 오류가 섞인 prefix에서도 동작할까?" title="Teacher forcing은 학습을 쉽게 하지만 exposure bias를 만든다">
        <p>학습에서는 모든 target 위치를 알고 있으므로 직전 정답 token을 입력할 수 있다. 추론에서는 모델이 직전에 생성한 token만 사용할 수 있다. 한 번 잘못 생성하면 이후 state가 학습에서 거의 보지 못한 prefix로 이동한다.</p>
        <FlowRow items={[{ label: 'Decoder input', value: '[BOS, y₁, …, yₙ₋₁]', note: '한 칸 오른쪽으로 이동' }, { label: 'Decoder logits', value: '[z₁, z₂, …, zₙ]', note: '각 target 위치의 분포' }, { label: 'Training target', value: '[y₁, y₂, …, EOS]', note: '같은 위치에서 비교' }]} activeIndex={1} />
        <TrainingGapExplorer />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\mathcal L=-\sum_{t=1}^{n}\log p_\theta(y_t^*\mid y_{<t}^*,x)`}</MathFormula></div>
        <FormulaNote meaning="각 위치에서 정답 token의 조건부 확률에 negative log를 취해 더한다. Log를 쓰면 sequence 확률의 곱이 안정적인 합으로 바뀌고, negative를 붙이면 높은 정답 확률을 loss 최소화 문제로 만들 수 있다. 별표 prefix는 학습에서 실제 정답을 조건으로 쓴다는 뜻이다." symbols={[[String.raw`y_t^*`, 't번째 정답 target token'], [String.raw`y_{<t}^*`, '정답 target prefix'], [String.raw`\theta`, 'encoder와 decoder의 모든 학습 파라미터']]} />
        <Misconception>Scheduled sampling은 이 불일치를 줄이려 제안된 역사적 방법이지만, model sample을 섞는 것만으로 train·test objective가 자동으로 같아지는 것은 아니다. 현대 sequence model도 teacher-forced likelihood, sequence-level objective, data augmentation, decoding policy를 별도 선택한다.</Misconception>
      </NlpSection>

      <NlpSection id="decoding" marker="04" tone="amber" question="각 step의 최고 확률이 전체 sequence의 최고 확률은 아니다" title="Beam search는 여러 prefix를 유지하고 길이 편향을 보정한다">
        <p>Greedy decoding은 지금 가장 높은 token 하나만 고른다. Beam search는 살아 있는 prefix마다 다음 token을 확장하고 누적 log probability 상위 k개를 남긴다. Log probability는 음수라서 token을 더 붙일수록 합이 작아지는 경향이 있으므로 길이 정규화나 task별 stopping rule이 필요하다.</p>
        <BeamExplorer />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`s(y)=\frac{\sum_t\log p(y_t\mid y_{<t},x)}{|y|^\alpha}`}</MathFormula></div>
        <FormulaNote meaning="분자는 sequence의 누적 log probability다. 길이의 α승으로 나누는 이유는 token을 추가할 때마다 음의 log probability가 더해져 짧은 출력이 유리해지는 편향을 완화하기 위해서다. α는 task와 model calibration에 따라 검증해야 한다." symbols={[[String.raw`s(y)`, '완성 또는 진행 중 hypothesis 점수'], [String.raw`|y|`, '현재 output 길이'], [String.raw`\alpha`, '길이 정규화 강도']]} />
        <Misconception>Beam width를 늘리면 model 자체가 좋아지는 것은 아니다. 같은 model distribution에서 더 많은 prefix를 탐색할 뿐이며, 점수의 길이 편향이나 잘못된 확률 calibration을 더 정확히 최적화해 오히려 품질이 낮아질 수도 있다.</Misconception>
      </NlpSection>

      <NlpSection id="attention-bridge" marker="05" tone="green" question="필요한 source 정보를 마지막 state에서 복원하지 말고 직접 다시 찾는다" title="Attention은 encoder state 전체를 decoder의 외부 memory로 만든다">
        <p>Encoder는 이미 각 source 위치의 hidden state를 계산했다. Attention은 이를 버리지 않고 보관한다. Decoder step t가 현재 state와 잘 맞는 source 위치의 score를 계산하고, softmax weight로 encoder state를 합쳐 위치별 context cₜ를 만든다.</p>
        <AttentionBridgeExplorer />
        <FormulaNote meaning="Decoder step t마다 alignment score eₜ에 softmax를 적용해 음수가 없고 합이 1인 αₜ,ᵢ로 바꾼다. Softmax를 쓰는 이유는 score의 상대적 차이는 보존하면서 모든 source 위치를 미분 가능한 읽기 비율로 정규화하기 위해서다. 그 비율로 hᵢ를 합하면 여러 위치의 정보를 하나의 context cₜ로 결합할 수 있고, 이 context는 다음 target step에서 다시 계산된다." symbols={[[String.raw`e_t`, 't번째 decoder query와 모든 source key의 alignment score'], [String.raw`c_t`, 't번째 decoder step의 source context'], [String.raw`\alpha_{t,i}`, 't번째 query가 i번째 source state에 준 정규화 weight'], [String.raw`h_i`, 'i번째 encoder hidden state']]} />
        <Takeaway>Seq2Seq가 해결한 것은 가변 길이 입력·출력의 조건부 생성이다. <InternalLink slug="attention-theory">Attention</InternalLink>이 해결한 것은 그 사이의 고정 길이 병목이다. 다음 글에서는 이 조회 연산을 score, mask, stable softmax, value 합으로 완전히 분해한다.</Takeaway>
        <CapabilityCheck items={['Source length가 바뀌어도 hₙ·cₙ bridge가 [L,B,h]인 이유를 설명할 수 있다.', 'Source reversal이 첫 target까지의 recurrent path를 줄인 이유를 설명할 수 있다.', 'BOS와 shifted target을 포함한 teacher-forced decoder input을 구성할 수 있다.', 'Feedback slot 수를 n이 아니라 n−1로 계산할 수 있다.', 'Beam 1과 beam 2의 prefix expansion을 joint probability로 재현할 수 있다.', 'Model probability와 length-normalized search score를 구분할 수 있다.', '고정 context와 step별 attention context의 차이를 설명할 수 있다.']} />
        <SourceNotes sources={[
          { label: 'Sequence to Sequence Learning with Neural Networks', href: 'https://research.google/pubs/sequence-to-sequence-learning-with-neural-networks/', note: '고정 길이 vector로 sequence를 연결하고 source reversal의 최적화 효과를 보고한다.' },
          { label: 'Neural Machine Translation by Jointly Learning to Align and Translate', href: 'https://arxiv.org/abs/1409.0473', note: '고정 길이 vector 병목을 지적하고 source 위치의 soft search를 제안한다.' },
          { label: 'CS224N NMT Assignment', href: 'https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1194/assignments/a4.pdf', note: 'Bidirectional encoder부터 decoder projection과 loss까지 tensor shape를 구현한다.' },
        ]} />
      </NlpSection>
    </>
  );
}
