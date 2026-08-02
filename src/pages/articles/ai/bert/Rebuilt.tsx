import { useMemo, useState } from 'react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { CapabilityCheck, ConceptPrimer, InternalLink, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import { FlowRow, MetricGrid, NlpSection, ProbabilityBars, SegmentedControl, Takeaway } from '../nlp-shared';
import BertPretrainingContractViz from './viz/BertPretrainingContractViz';

const sentence = ['나는', '은행', '앞에서', '친구를', '기다렸다'];

function ContextExplorer() {
  const [target, setTarget] = useState(1);
  const [mode, setMode] = useState<'causal' | 'bidirectional'>('bidirectional');
  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="flex flex-col gap-3 border-b border-border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6"><SegmentedControl label="Context direction" options={[{ value: 'causal', label: 'Causal LM' }, { value: 'bidirectional', label: 'BERT encoder' }]} value={mode} onChange={setMode} /><label htmlFor="bert-target" className="text-xs font-semibold text-muted-foreground">Target position · {target}<input id="bert-target" type="range" min="0" max={sentence.length - 1} value={target} onChange={(event) => setTarget(Number(event.target.value))} className="ml-3 w-32 accent-teal-600" /></label></div>
      <div className="p-4 sm:p-6">
        <div className="flex flex-wrap gap-2">{sentence.map((token, index) => { const visible = mode === 'bidirectional' ? index !== target : index <= target; const isTarget = index === target; return <div key={token} className={`min-w-[4.5rem] rounded-md border p-3 text-center ${isTarget ? 'border-violet-500/45 bg-violet-500/10' : visible ? 'border-teal-500/30 bg-teal-500/[0.04]' : 'border-dashed border-border opacity-35'}`}><p className="font-mono text-[10px] text-muted-foreground">x{index}</p><p className="mt-1 text-sm font-bold">{isTarget && mode === 'bidirectional' ? '[MASK]' : token}</p><p className="mt-1 text-[10px] text-muted-foreground">{isTarget ? 'predict' : visible ? 'visible' : 'future'}</p></div>; })}</div>
        <p className="mt-5 text-xs leading-relaxed text-muted-foreground">{mode === 'bidirectional' ? `위치 ${target}의 원래 token “${sentence[target]}”을 가리고 왼쪽과 오른쪽 문맥을 모두 사용해 복원한다. 여기서 양방향은 왼쪽·오른쪽 RNN의 hidden state를 이어 붙인다는 뜻이 아니라, 한 Transformer layer의 attention이 양쪽 위치에 함께 접근한다는 규칙이다.` : `위치 ${target}의 representation은 오른쪽 token을 읽지 못한다. 다음-token 생성에는 맞지만 문장 전체를 이해하는 표현에는 제약이 있다.`}</p>
      </div>
    </div>
  );
}

function InputContractExplorer() {
  const [pair, setPair] = useState(true);
  const tokens = pair ? ['[CLS]', '고양이가', '잔다', '[SEP]', 'It', 'sleeps', '[SEP]'] : ['[CLS]', '고양이가', '잔다', '[SEP]'];
  const segments = pair ? ['A', 'A', 'A', 'A', 'B', 'B', 'B'] : ['A', 'A', 'A', 'A'];
  return (
    <div className="not-prose my-8 rounded-md border border-border p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-bold">BERT input sequence</p><p className="mt-1 text-xs text-muted-foreground">각 칸은 세 embedding의 합이다.</p></div><label className="flex min-h-11 cursor-pointer items-center gap-2 text-xs font-semibold text-muted-foreground"><input type="checkbox" checked={pair} onChange={(event) => setPair(event.target.checked)} className="h-4 w-4 accent-blue-600" />sentence pair</label></div>
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">{tokens.map((token, index) => <div key={`${token}-${index}`} className="min-w-0 overflow-hidden rounded-md border border-border"><div className="truncate border-b border-teal-500/25 bg-teal-500/[0.06] p-2 text-center font-mono text-xs font-bold">{token}</div><div className="border-b border-blue-500/25 bg-blue-500/[0.05] p-2 text-center text-[10px]">segment {segments[index]}</div><div className="bg-violet-500/[0.05] p-2 text-center font-mono text-[10px]">position {index}</div></div>)}</div>
      <div className="mt-4"><FlowRow items={[{ label: 'Token embedding', value: 'wordpiece ID', note: 'content', tone: 'teal' }, { label: 'Segment embedding', value: 'A or B', note: '문장 쌍 소속', tone: 'blue' }, { label: 'Position embedding', value: `0…${tokens.length - 1}`, note: 'absolute order', tone: 'violet' }, { label: 'Encoder input', value: `[1, ${tokens.length}, d]`, note: 'elementwise sum', tone: 'green' }]} activeIndex={3} /></div>
    </div>
  );
}

function MlmExplorer() {
  const [selected, setSelected] = useState(600);
  const [policy, setPolicy] = useState<'original' | 'always-mask'>('original');
  const predicted = selected * 0.15;
  const masked = policy === 'original' ? predicted * 0.8 : predicted;
  const random = policy === 'original' ? predicted * 0.1 : 0;
  const unchanged = policy === 'original' ? predicted * 0.1 : 0;
  const formatCount = (value: number) => value.toLocaleString('ko-KR', { maximumFractionDigits: 1 });
  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid gap-5 border-b border-border bg-muted/20 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:p-6"><label htmlFor="mlm-tokens" className="text-xs font-semibold text-muted-foreground">Training tokens · {selected.toLocaleString()}<input id="mlm-tokens" type="range" min="100" max="1000" step="100" value={selected} onChange={(event) => setSelected(Number(event.target.value))} className="mt-3 block w-full accent-violet-600" /></label><SegmentedControl label="MLM corruption policy" options={[{ value: 'original', label: 'BERT 80/10/10' }, { value: 'always-mask', label: '항상 [MASK]' }]} value={policy} onChange={setPolicy} /></div>
      <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div><ProbabilityBars label="MLM token outcomes" formatValue={formatCount} items={[{ label: '[MASK] 교체', value: masked, color: '#7c3aed' }, { label: 'random token', value: random, color: '#d97706' }, { label: '그대로 유지', value: unchanged, color: '#059669' }, { label: 'loss 없음', value: selected - predicted, color: '#94a3b8' }]} /></div>
        <div className="rounded-md border border-violet-500/30 bg-violet-500/[0.045] p-4"><p className="text-xs font-bold text-muted-foreground">확률적 선택의 기대 개수</p><p className="mt-2 font-mono text-2xl font-black">{formatCount(predicted)} / {selected.toLocaleString()}</p><div className="mt-3 grid grid-cols-3 gap-2 text-center"><div><p className="font-mono text-sm font-black">{formatCount(masked)}</p><p className="text-[10px] text-muted-foreground">[MASK]</p></div><div><p className="font-mono text-sm font-black">{formatCount(random)}</p><p className="text-[10px] text-muted-foreground">무작위</p></div><div><p className="font-mono text-sm font-black">{formatCount(unchanged)}</p><p className="text-[10px] text-muted-foreground">그대로</p></div></div><p className="mt-3 text-xs leading-relaxed text-muted-foreground">실제 batch의 개수는 무작위 표본이라 흔들리지만 기대값은 반올림하지 않는다. 공개 기본값 600개에서는 90개가 loss 대상이고 72·9·9개로 나뉜다.</p></div>
      </div>
    </div>
  );
}

function NspExplorer() {
  const [relation, setRelation] = useState<'actual' | 'random'>('actual');
  const second = relation === 'actual' ? '비가 와서 우산을 폈다.' : '고래는 포유류에 속한다.';
  const label = relation === 'actual' ? 'IsNext' : 'NotNext';
  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="border-b border-border bg-muted/20 p-4 sm:p-6"><SegmentedControl label="NSP sentence B source" options={[{ value: 'actual', label: '실제 다음 문장' }, { value: 'random', label: '무작위 문장' }]} value={relation} onChange={setRelation} /></div>
      <div className="p-4 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-md border border-blue-500/30 bg-blue-500/[0.04] p-4"><p className="text-[10px] font-bold uppercase text-muted-foreground">Sentence A</p><p className="mt-2 text-sm font-semibold">하늘에 먹구름이 모였다.</p></div><div className={`rounded-md border p-4 ${relation === 'actual' ? 'border-emerald-500/35 bg-emerald-500/[0.04]' : 'border-amber-500/35 bg-amber-500/[0.04]'}`}><p className="text-[10px] font-bold uppercase text-muted-foreground">Sentence B</p><p className="mt-2 text-sm font-semibold">{second}</p></div></div>
        <div className="mt-5"><FlowRow items={[{ label: 'Pair input', value: '[CLS] A [SEP] B [SEP]', note: 'segment A/B 포함', tone: 'blue' }, { label: 'BERT encoder', value: '양방향 문장쌍 읽기', note: '모든 token이 상호작용', tone: 'violet' }, { label: '[CLS] head', value: '2-class logits', note: '문장쌍 수준 분류', tone: 'amber' }, { label: 'NSP label', value: label, note: '원 논문은 50/50 sampling', tone: relation === 'actual' ? 'green' : 'amber' }]} activeIndex={3} /></div>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">NSP는 다음 token을 맞히는 loss가 아니다. 두 문장이 원 corpus에서 실제로 이어졌는지를 <code>[CLS]</code>의 이진 분류 head로 맞히는 별도 pretraining task다.</p>
      </div>
    </div>
  );
}

function TaskHeadExplorer() {
  const [task, setTask] = useState<'classification' | 'token' | 'qa' | 'embedding'>('classification');
  const data = {
    classification: { read: '[CLS] final vector', shape: '[B,d] → [B,C]', head: 'Linear classifier', loss: 'class cross entropy', example: '감성·의도·문장 관계' },
    token: { read: '모든 token vector', shape: '[B,N,d] → [B,N,C]', head: 'shared token classifier', loss: 'token별 cross entropy', example: 'NER·품사 태깅' },
    qa: { read: 'context token vectors', shape: '[B,N,d] → start/end [B,N]', head: 'two span projections', loss: 'start + end CE', example: 'Extractive QA' },
    embedding: { read: 'pooled token vectors', shape: '[B,N,d] → [B,d]', head: 'pooling + projection', loss: 'contrastive objective', example: '검색·유사도' },
  }[task];
  return <div className="not-prose my-8 rounded-md border border-border p-4 sm:p-6"><SegmentedControl label="BERT downstream task" options={[{ value: 'classification', label: 'Sequence 분류' }, { value: 'token', label: 'Token 분류' }, { value: 'qa', label: 'Span QA' }, { value: 'embedding', label: 'Embedding' }]} value={task} onChange={setTask} /><div className="mt-5"><MetricGrid items={[{ label: '읽는 representation', value: data.read }, { label: 'tensor contract', value: data.shape }, { label: 'task head', value: data.head }, { label: '대표 사용', value: data.example, note: data.loss, accent: true }]} /></div></div>;
}

function LimitLedger() {
  const [axis, setAxis] = useState<'objective' | 'length' | 'efficiency' | 'generation'>('objective');
  const detail = useMemo(() => ({
    objective: { symptom: 'MLM은 token의 15%에서만 직접 loss를 받는다.', consequence: '모든 token을 예측하는 autoregressive LM보다 sample efficiency 기준이 다르다.', response: 'Dynamic masking, larger data·batch, replaced-token detection 등 목적함수 변형이 등장했다.' },
    length: { symptom: '원 BERT는 learned absolute position과 최대 512 token을 사용한다.', consequence: '긴 문서를 자르면 멀리 떨어진 근거가 끊기고 attention N² 비용도 커진다.', response: 'Longformer·BigBird류 sparse attention, chunking, retrieval이 필요해진다.' },
    efficiency: { symptom: '모든 layer가 bidirectional dense attention을 계산한다.', consequence: '큰 encoder를 매 query·document마다 반복하면 검색 serving 비용이 커진다.', response: 'Distillation, smaller encoders, bi-encoder 사전 계산으로 배치한다.' },
    generation: { symptom: '양방향 encoder는 다음 token을 순차 생성하도록 학습되지 않았다.', consequence: '자연스러운 open-ended generation에 바로 쓸 수 없다.', response: 'Encoder–decoder 또는 causal decoder를 사용하고 BERT는 이해·retrieval 역할에 둔다.' },
  })[axis], [axis]);
  return <div className="not-prose my-8 rounded-md border border-border p-4 sm:p-6"><SegmentedControl label="BERT limitation axis" options={[{ value: 'objective', label: '학습 신호' }, { value: 'length', label: '긴 문맥' }, { value: 'efficiency', label: '서빙 비용' }, { value: 'generation', label: '생성' }]} value={axis} onChange={setAxis} /><div className="mt-5 grid gap-3 lg:grid-cols-3"><div className="rounded-md border border-amber-500/35 bg-amber-500/[0.045] p-4"><p className="text-xs font-bold text-muted-foreground">관찰</p><p className="mt-2 text-sm leading-relaxed">{detail.symptom}</p></div><div className="rounded-md border border-rose-500/30 bg-rose-500/[0.035] p-4"><p className="text-xs font-bold text-muted-foreground">결과</p><p className="mt-2 text-sm leading-relaxed">{detail.consequence}</p></div><div className="rounded-md border border-emerald-500/30 bg-emerald-500/[0.04] p-4"><p className="text-xs font-bold text-muted-foreground">후속 방향</p><p className="mt-2 text-sm leading-relaxed">{detail.response}</p></div></div></div>;
}

export default function RebuiltBert() {
  return (
    <>
      <NlpSection id="overview" marker="01" tone="teal" question="다음 token 생성이 아니라 문장 전체를 읽는 representation을 사전학습한다" title="BERT는 양방향 Transformer encoder다">
        <QuestionLead question="Label이 적은 NLP task마다 큰 model을 처음부터 학습하지 않고 문맥 이해를 재사용할 수 있을까?" answer="대규모 unlabeled text에서 일부 token을 가리고 양쪽 문맥으로 복원하도록 encoder를 사전학습한다. 이후 작은 task head를 붙여 model 전체를 fine-tune하면 문장·token·span task에 같은 backbone을 전이할 수 있다." />
        <p>생성형 LLM이 기본 도구가 된 지금도 검색 문서를 미리 embedding하거나, 짧은 입력을 낮은 지연으로 분류·NER·span 추출해야 하는 시스템에서는 encoder의 출력 shape와 비용 계약이 중요하다. BERT는 그 선택을 이해하는 최소 기준선이다.</p>
        <ConceptPrimer items={[
          { term: 'bidirectional context', meaning: '각 token이 왼쪽과 오른쪽 token을 모두 읽는다.', why: '문장 전체의 의미를 반영한 representation을 만든다.' },
          { term: 'masked language modeling', meaning: '선택한 token을 손상시키고 원래 ID를 복원한다.', why: '정답 문장을 그대로 보면서도 prediction loss를 만든다.' },
          { term: 'pretrain → fine-tune', meaning: '공통 encoder를 대규모 text에서 학습한 뒤 task data로 조정한다.', why: '적은 label에서도 언어 지식을 재사용한다.' },
          { term: 'task head', meaning: 'Encoder representation을 label·span·token score로 바꾸는 작은 layer다.', why: '같은 backbone을 서로 다른 output contract에 연결한다.' },
        ]} />
        <ContextExplorer />
        <p><InternalLink slug="transformer-architecture">Transformer 구조</InternalLink>에서 encoder의 attention·residual·FFN 계약을 먼저 확인했다면, 이 글에서는 그 backbone에 어떤 입력과 학습 신호를 주어 범용 언어 표현을 만드는지에 집중한다.</p>
      </NlpSection>

      <NlpSection id="input-mask" marker="02" tone="blue" question="Special token, segment, position, padding mask가 encoder의 입력 계약을 만든다" title="BERT 입력은 token·segment·position embedding의 합이다">
        <p><code>[CLS]</code>는 sequence-level head가 읽을 대표 위치이고 <code>[SEP]</code>는 문장 경계를 표시한다. Segment A/B embedding은 문장 쌍의 소속을 구분한다. Attention mask는 padding을 읽지 못하게 하지만 causal mask처럼 오른쪽 문맥을 막지는 않는다.</p>
        <p>WordPiece는 단어를 vocabulary에 있는 더 작은 subword 조각과 ID로 나누는 tokenizer 방식이다. 예를 들어 낯선 단어 하나가 여러 ID가 될 수 있다. 문자열에서 ID가 만들어지는 규칙 자체는 <InternalLink slug="tokenizer">Tokenizer</InternalLink>에서 먼저 확인할 수 있다.</p>
        <InputContractExplorer />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`h_i^{(0)}=E_{\mathrm{token}(i)}+E_{\mathrm{segment}(i)}+E_{\mathrm{position}(i)}`}</MathFormula></div>
        <FormulaNote meaning="위치 i의 초기 hidden vector는 WordPiece token ID, 문장 A/B 소속, absolute position의 embedding을 elementwise로 더한 값이다. 세 table의 vector width가 모두 hidden size로 같기 때문에 sequence length를 늘리지 않고 정보를 합친다." symbols={[[String.raw`h_i^{(0)}`, 'encoder 첫 layer에 들어가는 위치 i 표현'], [String.raw`E`, '각 discrete ID를 vector로 바꾸는 학습 embedding table']]} />
      </NlpSection>

      <NlpSection id="pretraining" marker="03" tone="violet" question="원문을 그대로 보여주면 정답을 복사하므로 입력을 의도적으로 손상시킨다" title="MLM은 선택한 15% token에서 원래 vocabulary ID를 복원한다">
        <p>원 논문은 training token의 15%를 prediction 대상으로 고르고, 그중 80%는 <code>[MASK]</code>, 10%는 random token, 10%는 그대로 둔다. Loss는 선택된 원래 token에 대해 계산한다. 이 비율은 batch마다 정확히 맞추는 고정 개수가 아니라 sampling의 기대값이다.</p>
        <BertPretrainingContractViz />
        <MlmExplorer />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\mathcal L_{\mathrm{MLM}}=-\sum_{i\in\mathcal M}\log p_\theta(x_i\mid \widetilde{x}_{1:N})`}</MathFormula></div>
        <FormulaNote meaning="원문 x에서 선택 집합 M의 위치를 손상시켜 x̃를 만들고, encoder가 양쪽 문맥을 읽어 각 원래 token xᵢ의 확률을 높인다. 선택되지 않은 위치는 입력 context로 쓰이지만 직접 MLM loss 항은 없다." symbols={[[String.raw`\mathcal M`, 'prediction 대상으로 선택된 약 15% 위치 집합'], [String.raw`\widetilde{x}`, 'mask·random·unchanged 정책을 거친 손상 입력'], [String.raw`x_i`, '복원해야 하는 원래 token ID']]} />
        <Misconception>MLM의 80/10/10은 attention weight가 아니라 선택된 15% token의 입력 corruption 비율이다. 전체 token 기준으로는 원 BERT 설정에서 약 12%가 [MASK], 1.5%가 random, 1.5%가 unchanged prediction target이다.</Misconception>
        <p>원 BERT는 여기에 문장쌍 관계를 판별하는 Next Sentence Prediction(NSP)을 더했다. Positive pair 절반은 실제 다음 문장, negative pair 절반은 corpus에서 무작위로 뽑은 문장이다. 이후 RoBERTa는 더 많은 data, 더 긴 학습, dynamic masking을 함께 적용하며 NSP를 제거한 recipe가 더 낫다는 결과를 보였다. 따라서 “NSP가 항상 필요 없다”가 아니라 원 BERT의 해당 sampling objective가 필수 구성은 아니었다고 읽어야 한다.</p>
        <NspExplorer />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\mathcal L_{\mathrm{pretrain}}=\underbrace{\mathcal L_{\mathrm{MLM}}}_{\text{가린 토큰 복원}}+\underbrace{\mathcal L_{\mathrm{NSP}}}_{\text{문장 순서 판별}}`}</MathFormula></div>
        <FormulaNote meaning="원 BERT의 한 pretraining example은 token 위치 수준의 MLM loss와 문장쌍 수준의 NSP loss를 함께 만든다. 둘은 같은 encoder를 update하지만 정답 단위와 head가 다르다. RoBERTa는 이 합에서 NSP 항을 제거한 별도 recipe다." symbols={[[String.raw`\mathcal L_{\mathrm{MLM}}`, '선택된 token의 vocabulary 복원 손실'], [String.raw`\mathcal L_{\mathrm{NSP}}`, '[CLS]에서 IsNext/NotNext를 맞히는 이진 분류 손실']]} />
      </NlpSection>

      <NlpSection id="finetuning" marker="04" tone="amber" question="같은 encoder output에서 task가 요구하는 위치와 shape만 골라 읽는다" title="Fine-tuning은 representation contract 위에 task head를 붙인다">
        <p>Sequence classification은 보통 마지막 <code>[CLS]</code> vector를 읽고, token classification은 모든 token vector를 읽는다. Extractive QA는 context의 각 위치에 시작·끝 score를 만든다. Original BERT는 backbone까지 함께 update하는 fine-tuning을 강조했지만, 실전에서는 frozen feature, parameter-efficient tuning, task-specific pooling도 비용과 data에 따라 선택한다.</p>
        <TaskHeadExplorer />
        <Misconception>WordPiece가 한 단어를 여러 subword로 나누면 token label의 길이도 원래 단어 수와 달라진다. NER처럼 단어 단위 정답을 쓰는 task는 첫 subword에만 label을 주거나 모든 subword에 펼치는 정렬 규칙과, loss에서 무시할 위치를 명시해야 한다.</Misconception>
        <p>또한 원 BERT의 <code>[CLS]</code> vector는 NSP·분류 head가 읽도록 학습된 위치이지, 두 문장을 cosine distance로 바로 비교하도록 보장된 범용 의미 벡터가 아니다. 대규모 검색은 문장별 vector를 한 번 계산하고 비교할 수 있도록 pooling과 contrastive objective를 가진 <InternalLink slug="sentence-embeddings">문장 임베딩</InternalLink> 계열로 연결해야 한다.</p>
        <div className="not-prose my-6"><FlowRow items={[{ label: 'Raw BERT pair', value: '[CLS] A [SEP] B', note: '두 문장을 함께 encode', tone: 'blue' }, { label: 'Pair classifier', value: 'joint interaction', note: '정확하지만 후보마다 재계산', tone: 'violet' }, { label: 'Sentence encoder', value: 'e(A), e(B)', note: '각 문장을 독립 encode', tone: 'teal' }, { label: 'Similarity', value: 'cos(e(A), e(B))', note: '검색 index에서 빠르게 비교', tone: 'green' }]} activeIndex={3} /></div>
        <Takeaway>Fine-tuning의 핵심은 “head를 하나 붙인다”보다 encoder의 어느 representation을 어떤 output shape로 읽고, 그 loss gradient가 backbone 어디까지 흐르는지를 명시하는 데 있다.</Takeaway>
      </NlpSection>

      <NlpSection id="limits" marker="05" tone="green" question="BERT가 세운 기준과 이후 모델이 바꾼 선택을 분리해서 본다" title="강한 encoder이지만 목적함수·길이·생성 계약에는 분명한 한계가 있다">
        <LimitLedger />
        <p>BERT 이후 연구는 “BERT를 그대로 크게 만들기”보다 data recipe, masking, objective, attention pattern, distillation, contrastive representation을 각각 바꿨다. 따라서 현대 encoder를 평가할 때는 BERT 이름보다 tokenizer, maximum length, pretraining objective, pooling, retrieval index contract를 확인해야 한다. 생성이 목표라면 causal decoder·encoder–decoder 경로로, 검색·분류가 목표라면 encoder와 문장 임베딩 경로로 갈라진다.</p>
        <CapabilityCheck items={['Causal context와 BERT 양방향 context에서 target 위치가 볼 수 있는 token을 표시할 수 있다.', 'Token·segment·position embedding과 padding attention mask의 역할을 구분할 수 있다.', '600 token에서 MLM 선택·80/10/10 corruption·비대상 기대 개수를 직접 계산할 수 있다.', 'NSP의 [CLS] A [SEP] B [SEP] 입력과 IsNext/NotNext label, MLM과 다른 loss 단위를 설명할 수 있다.', 'Sequence·token·span task마다 읽는 representation과 output shape를 설계할 수 있다.', 'Subword tokenization 뒤 단어 label을 어떤 규칙으로 정렬할지 명시할 수 있다.', 'Raw [CLS]와 contrastive sentence embedding을 같은 것으로 취급하면 안 되는 이유를 설명할 수 있다.', '원 BERT의 NSP와 이후 RoBERTa recipe의 차이를 과장 없이 설명할 수 있다.']} />
        <SourceNotes sources={[
          { label: 'Devlin et al. — BERT: Pre-training of Deep Bidirectional Transformers', href: 'https://arxiv.org/abs/1810.04805', note: 'Bidirectional encoder, MLM 15%와 80/10/10, NSP, task별 fine-tuning 계약의 원 출처다.' },
          { label: 'Liu et al. — RoBERTa: A Robustly Optimized BERT Pretraining Approach', href: 'https://arxiv.org/abs/1907.11692', note: '더 긴 학습·큰 batch·많은 data·dynamic masking과 NSP 제거로 BERT recipe의 undertraining을 분석한다.' },
          { label: 'Reimers & Gurevych — Sentence-BERT', href: 'https://aclanthology.org/D19-1410/', note: 'Raw BERT pair encoding 대신 siamese encoder와 pooling·metric learning으로 비교 가능한 문장 embedding을 만든다.' },
          { label: 'Hugging Face — Tokenizer summary', href: 'https://huggingface.co/docs/transformers/main/tokenizer_summary', note: 'WordPiece를 포함한 subword tokenizer 계열과 special token 전처리의 구현 맥락을 정리한다.' },
        ]} />
      </NlpSection>
    </>
  );
}
