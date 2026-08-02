import { useState } from 'react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { CapabilityCheck, ConceptPrimer, InternalLink, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import { FlowRow, MetricGrid, NlpSection, SegmentedControl, Takeaway } from '../nlp-shared';

function PositionExplorer() {
  const [position, setPosition] = useState(3);
  const dModel = 8;
  const values = Array.from({ length: dModel }, (_, dimension) => {
    const band = Math.floor(dimension / 2);
    const denominator = 10_000 ** ((2 * band) / dModel);
    return dimension % 2 === 0 ? Math.sin(position / denominator) : Math.cos(position / denominator);
  });
  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="border-b border-border bg-muted/20 p-4 sm:p-6"><label htmlFor="position-index" className="block text-xs font-semibold text-muted-foreground">Position index · {position}<input id="position-index" type="range" min="0" max="24" value={position} onChange={(event) => setPosition(Number(event.target.value))} className="mt-3 block w-full accent-teal-600" /></label></div>
      <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-center">
        <div className="min-w-0"><p className="text-xs font-bold text-muted-foreground">PE({position})의 8개 주파수 채널</p><div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-8">{values.map((value, index) => <div key={index} className={`min-w-0 rounded-md border p-2 text-center ${index % 2 === 0 ? 'border-teal-500/35 bg-teal-500/5' : 'border-blue-500/35 bg-blue-500/5'}`}><p className="font-mono text-[10px] text-muted-foreground">d{index}</p><p className="mt-1 break-words font-mono text-xs font-bold">{value.toFixed(2)}</p></div>)}</div></div>
        <div className="rounded-md border border-border p-4 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">빠른 채널</strong>은 가까운 위치 차이를 세밀하게 바꾸고, <strong className="text-foreground">느린 채널</strong>은 긴 구간에서 완만하게 변한다. 여러 주기의 조합이 위치별 signature를 만든다.</div>
      </div>
    </div>
  );
}

function PositionOrderExplorer() {
  const [signal, setSignal] = useState<'off' | 'on'>('off');
  const sequences = [['개가', '사람을', '문다'], ['사람을', '개가', '문다']];
  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="flex flex-col gap-3 border-b border-border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div><p className="text-sm font-bold">같은 token multiset, 다른 순서</p><p className="mt-1 text-xs text-muted-foreground">Position이 없을 때와 있을 때 input signature를 비교한다.</p></div>
        <SegmentedControl label="Position signal" options={[{ value: 'off', label: 'Position 없음' }, { value: 'on', label: 'Position 더함' }]} value={signal} onChange={setSignal} />
      </div>
      <div className="p-4 sm:p-6">
        <div className="space-y-3">{sequences.map((sequence, row) => <div key={sequence.join('-')} className="grid grid-cols-3 gap-2">{sequence.map((token, position) => <div key={`${row}-${token}`} className={`min-w-0 rounded-md border p-3 ${signal === 'on' ? 'border-blue-500/35 bg-blue-500/[0.045]' : 'border-border bg-muted/15'}`}><p className="truncate text-sm font-bold">{token}</p><p className="mt-1 break-words font-mono text-[10px] text-muted-foreground">{signal === 'on' ? `E(${token}) + P${position}` : `E(${token})`}</p></div>)}</div>)}</div>
        <div className="mt-5"><MetricGrid items={[
          { label: '개가 token의 두 signature', value: signal === 'on' ? 'E(개가)+P0 ≠ E(개가)+P1' : 'E(개가) = E(개가)', note: '두 문장에서 위치만 다르다.' },
          { label: 'Self-attention 성질', value: signal === 'on' ? '순서를 구분할 단서가 생김' : '순열 등변 · permutation equivariant', note: signal === 'on' ? '학습된 projection이 위치 차이를 활용할 수 있다.' : '입력을 바꾸어 놓으면 output 위치도 같은 방식으로 바뀐다.', accent: signal === 'on' },
        ]} /></div>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Position이 없다고 각 token output이 즉시 같은 값이 되는 것은 아니다. 정확한 성질은 순열 등변성이다. Token 순서를 바꾸면 output도 그 순서대로 바뀌며, 순서를 지운 pooling은 두 문장을 같게 만들 수 있다.</p>
      </div>
    </div>
  );
}

function ShapeLedger() {
  const [batch, setBatch] = useState(2);
  const [tokens, setTokens] = useState(6);
  const [heads, setHeads] = useState<2 | 4 | 8>(4);
  const dModel = 64;
  const headDim = dModel / heads;
  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid gap-5 border-b border-border bg-muted/20 p-4 sm:grid-cols-3 sm:p-6">
        <label htmlFor="shape-batch" className="text-xs font-semibold text-muted-foreground">Batch B · {batch}<input id="shape-batch" type="range" min="1" max="8" value={batch} onChange={(event) => setBatch(Number(event.target.value))} className="mt-3 block w-full accent-blue-600" /></label>
        <label htmlFor="shape-token" className="text-xs font-semibold text-muted-foreground">Tokens N · {tokens}<input id="shape-token" type="range" min="2" max="16" value={tokens} onChange={(event) => setTokens(Number(event.target.value))} className="mt-3 block w-full accent-blue-600" /></label>
        <label htmlFor="shape-head" className="text-xs font-semibold text-muted-foreground">Heads H · {heads}<select id="shape-head" value={heads} onChange={(event) => setHeads(Number(event.target.value) as 2 | 4 | 8)} className="mt-2 block min-h-9 w-full rounded-md border border-border bg-background px-2 text-xs text-foreground"><option value="2">2</option><option value="4">4</option><option value="8">8</option></select></label>
      </div>
      <div className="p-4 sm:p-6">
        <FlowRow items={[
          { label: 'Residual stream X', value: `[${batch}, ${tokens}, ${dModel}]`, note: 'B × N × d_model', tone: 'teal' },
          { label: 'Split Q/K/V', value: `3 × [${batch}, ${heads}, ${tokens}, ${headDim}]`, note: 'head 축을 드러낸다.', tone: 'blue' },
          { label: 'Attention scores', value: `[${batch}, ${heads}, ${tokens}, ${tokens}]`, note: `${batch * heads * tokens * tokens} score cells`, tone: 'violet' },
          { label: 'Concat + Wᴼ', value: `[${batch}, ${tokens}, ${dModel}]`, note: 'residual shape로 복귀', tone: 'green' },
        ]} activeIndex={2} />
        <div className="mt-5"><MetricGrid items={[
          { label: 'head dimension', value: `${headDim}`, note: `${dModel} / ${heads}` },
          { label: 'score elements', value: `${(batch * heads * tokens * tokens).toLocaleString()}`, note: 'B·H·N²' },
          { label: 'attention scaling', value: `1 / √${headDim}`, note: (1 / Math.sqrt(headDim)).toFixed(3) },
          { label: 'QK + AV 주 MAC', value: `${(2 * batch * tokens * tokens * dModel).toLocaleString()}`, note: '약 2·B·N²·d_model', accent: true },
        ]} /></div>
      </div>
    </div>
  );
}

function CausalMaskExplorer() {
  const [queryPosition, setQueryPosition] = useState(3);
  const size = 6;
  return (
    <div className="not-prose my-8 rounded-md border border-border p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-bold">Causal score matrix</p><p className="mt-1 text-xs text-muted-foreground">행은 query, 열은 key 위치다.</p></div><label htmlFor="mask-row" className="w-full text-xs font-semibold text-muted-foreground sm:w-56">살펴볼 query · t={queryPosition}<input id="mask-row" type="range" min="0" max={size - 1} value={queryPosition} onChange={(event) => setQueryPosition(Number(event.target.value))} className="mt-2 block w-full accent-violet-600" /></label></div>
      <div className="mx-auto mt-5 grid w-full max-w-xs grid-cols-6 gap-1" role="img" aria-label={`6 by 6 causal attention mask, query row ${queryPosition} highlighted`}>{Array.from({ length: size * size }, (_, cell) => { const row = Math.floor(cell / size); const column = cell % size; const allowed = column <= row; return <div key={cell} className={`flex aspect-square min-w-0 items-center justify-center rounded-sm border font-mono text-[9px] sm:text-[10px] ${row === queryPosition ? allowed ? 'border-violet-500/50 bg-violet-500/15 font-bold' : 'border-rose-500/30 bg-rose-500/[0.06] text-rose-700 dark:text-rose-300' : allowed ? 'border-border bg-muted/20 text-muted-foreground' : 'border-dashed border-border text-muted-foreground/40'}`}>{allowed ? `${row},${column}` : '−∞'}</div>; })}</div>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">t={queryPosition}인 token은 0…{queryPosition}의 {queryPosition + 1}개 key만 읽는다. 정보 접근은 삼각형으로 제한되지만 dense implementation은 여전히 6×6 score cell을 만들 수 있다.</p>
    </div>
  );
}

function BlockExplorer() {
  const [norm, setNorm] = useState<'post' | 'pre'>('post');
  const [stage, setStage] = useState<'attention' | 'ffn'>('attention');
  const flow = norm === 'post'
    ? [{ label: 'x', value: 'residual input' }, { label: stage === 'attention' ? 'MHA(x)' : 'FFN(x)', value: 'sublayer' }, { label: 'x + Sublayer(x)', value: 'skip connection' }, { label: 'LayerNorm', value: 'normalized output' }]
    : [{ label: 'x', value: 'residual input' }, { label: 'LayerNorm(x)', value: 'normalize first' }, { label: stage === 'attention' ? 'MHA(LN(x))' : 'FFN(LN(x))', value: 'sublayer' }, { label: 'x + Sublayer', value: 'residual output' }];
  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="flex flex-col gap-3 border-b border-border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6"><SegmentedControl label="Transformer sublayer" options={[{ value: 'attention', label: 'Attention' }, { value: 'ffn', label: 'FFN' }]} value={stage} onChange={setStage} /><SegmentedControl label="Normalization placement" options={[{ value: 'post', label: 'Post-LN · original' }, { value: 'pre', label: 'Pre-LN · modern' }]} value={norm} onChange={setNorm} /></div>
      <div className="p-4 sm:p-6">
        <FlowRow items={flow.map((item, index) => ({ ...item, note: index === (norm === 'post' ? 2 : 3) ? 'gradient 우회 경로' : undefined }))} activeIndex={norm === 'post' ? 2 : 3} />
        <div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-md border border-blue-500/30 bg-blue-500/[0.04] p-4"><p className="text-xs font-bold text-muted-foreground">Token mixing</p><p className="mt-2 text-sm font-bold">Attention은 위치 사이 정보를 섞는다</p></div><div className="rounded-md border border-amber-500/30 bg-amber-500/[0.04] p-4"><p className="text-xs font-bold text-muted-foreground">Channel mixing</p><p className="mt-2 text-sm font-bold">FFN은 각 위치의 feature를 변환한다</p></div></div>
      </div>
    </div>
  );
}

function FamilyExplorer() {
  const [family, setFamily] = useState<'encoder' | 'encdec' | 'decoder'>('decoder');
  const data = {
    encoder: { context: '양방향 self-attention', output: 'input 위치별 representation', objective: 'MLM·contrastive·task loss', use: 'BERT, embedding, 분류' },
    encdec: { context: 'encoder 양방향 + decoder causal + cross', output: 'source 조건부 target sequence', objective: 'conditional next-token loss', use: 'T5, 번역, 요약' },
    decoder: { context: 'causal self-attention', output: 'prefix 다음-token distribution', objective: 'next-token prediction', use: 'GPT, Llama, 생성' },
  }[family];
  return <div className="not-prose my-8 rounded-md border border-border p-4 sm:p-6"><SegmentedControl label="Transformer family" options={[{ value: 'encoder', label: 'Encoder-only' }, { value: 'encdec', label: 'Encoder–decoder' }, { value: 'decoder', label: 'Decoder-only' }]} value={family} onChange={setFamily} /><div className="mt-5"><MetricGrid items={[{ label: 'context rule', value: data.context }, { label: 'model output', value: data.output }, { label: 'training objective', value: data.objective }, { label: '대표 용도', value: data.use, accent: true }]} /></div></div>;
}

function KvCacheExplorer() {
  const [batch, setBatch] = useState(1);
  const [layers, setLayers] = useState(32);
  const [context, setContext] = useState(2048);
  const [kvHeads, setKvHeads] = useState<1 | 2 | 4 | 8 | 16 | 32>(32);
  const queryHeads = 32;
  const headDim = 128;
  const bytesPerElement = 2;
  const gib = (2 * batch * layers * context * kvHeads * headDim * bytesPerElement) / 1024 ** 3;
  const groupSize = queryHeads / kvHeads;
  const family = kvHeads === queryHeads ? 'MHA' : kvHeads === 1 ? 'MQA' : 'GQA';
  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid gap-5 border-b border-border bg-muted/20 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-4"><label htmlFor="kv-batch" className="text-xs font-semibold text-muted-foreground">Batch · {batch}<input id="kv-batch" type="range" min="1" max="8" value={batch} onChange={(event) => setBatch(Number(event.target.value))} className="mt-3 block w-full accent-emerald-600" /></label><label htmlFor="kv-layers" className="text-xs font-semibold text-muted-foreground">Layers · {layers}<input id="kv-layers" type="range" min="8" max="80" step="8" value={layers} onChange={(event) => setLayers(Number(event.target.value))} className="mt-3 block w-full accent-emerald-600" /></label><label htmlFor="kv-context" className="text-xs font-semibold text-muted-foreground">Cached tokens · {context.toLocaleString()}<input id="kv-context" type="range" min="256" max="8192" step="256" value={context} onChange={(event) => setContext(Number(event.target.value))} className="mt-3 block w-full accent-emerald-600" /></label><label htmlFor="kv-heads" className="text-xs font-semibold text-muted-foreground">KV heads · {kvHeads}<select id="kv-heads" value={kvHeads} onChange={(event) => setKvHeads(Number(event.target.value) as 1 | 2 | 4 | 8 | 16 | 32)} className="mt-2 block min-h-9 w-full rounded-md border border-border bg-background px-2 text-xs text-foreground">{[32, 16, 8, 4, 2, 1].map((value) => <option key={value} value={value}>{value}</option>)}</select></label></div>
      <div className="p-4 sm:p-6">
        <FlowRow items={[{ label: 'Prefill', value: `Q/K/V for ${context.toLocaleString()} tokens`, note: '모든 prompt 위치를 병렬 계산' }, { label: 'Layer cache', value: `K,V [${batch}, ${kvHeads}, ${context}, ${headDim}]`, note: '각 layer에 저장' }, { label: 'Decode append', value: `new K,V [${batch}, ${kvHeads}, 1, ${headDim}]`, note: '과거 projection 재계산 없음' }, { label: 'Decode read', value: `Q [${batch}, ${queryHeads}, 1, ${headDim}]`, note: '과거 N개 K/V는 계속 읽는다.' }]} activeIndex={2} />
        <div className="mt-5"><MetricGrid items={[{ label: 'KV cache', value: `${gib.toFixed(2)} GiB`, note: `bf16 · batch ${batch} · K와 V 포함` }, { label: 'attention family', value: family, note: `${queryHeads} query heads / ${kvHeads} KV heads` }, { label: 'query per KV group', value: `${groupSize}`, note: family === 'MHA' ? 'query마다 K/V head 하나' : '여러 query head가 K/V를 공유' }, { label: 'cache vs MHA', value: `${((kvHeads / queryHeads) * 100).toFixed(0)}%`, note: '같은 B·L·N·d 기준', accent: true }]} /></div>
      </div>
    </div>
  );
}

export default function RebuiltTransformerArchitecture() {
  return (
    <>
      <NlpSection id="overview" marker="01" tone="teal" question="순차 state 대신 모든 token pair의 정보 경로를 한 layer에서 연다" title="Transformer는 attention과 MLP를 residual stream 위에 쌓는다">
        <QuestionLead question="Recurrence를 없애도 token 순서와 장거리 의존성을 어떻게 학습할까?" answer="Token 순서는 position signal로 주고, 관계는 self-attention으로 직접 조회한다. Attention이 위치 사이 정보를 섞고, FFN이 각 위치의 feature를 변환하며, residual과 normalization이 이 갱신을 깊게 쌓게 한다." />
        <ConceptPrimer items={[
          { term: 'residual stream', meaning: '모든 block이 읽고 갱신하는 [B,N,d_model] 표현이다.', why: 'Sublayer가 원래 정보를 보존한 채 변화량을 더한다.' },
          { term: 'attention sublayer', meaning: 'Token 위치 사이에서 정보를 가져온다.', why: '한 layer에서 먼 위치도 직접 연결된다.' },
          { term: 'feed-forward network', meaning: '각 위치에 같은 nonlinear MLP를 적용한다.', why: '읽어온 정보를 feature 차원에서 변환한다.' },
          { term: 'position signal', meaning: '순서가 없는 attention 입력에 위치 차이를 준다.', why: '같은 token 구성도 배열 순서에 따라 구분한다.' },
        ]} />
        <FlowRow items={[{ label: 'Token IDs', value: '[B, N]', note: 'discrete input', tone: 'teal' }, { label: 'Embedding + position', value: '[B, N, d_model]', note: 'residual stream 시작', tone: 'blue' }, { label: 'L × Transformer block', value: 'Attention → FFN', note: '관계와 feature 갱신', tone: 'violet' }, { label: 'Output head', value: 'logits', note: 'task 또는 vocabulary', tone: 'green' }]} activeIndex={2} />
        <p><InternalLink slug="attention-theory">Attention</InternalLink> 글의 조회 연산은 Transformer block의 절반이다. Transformer가 새로 더한 핵심은 모든 위치에 그 조회를 병렬 적용하고, position·residual·normalization·FFN으로 깊게 반복 가능한 backbone을 만든 것이다.</p>
      </NlpSection>

      <NlpSection id="input" marker="02" tone="blue" question="Token 의미만으로는 같은 단어가 몇 번째에 있는지 알 수 없다" title="Embedding과 position을 같은 residual 좌표계에서 합친다">
        <p>Tokenizer가 만든 ID는 embedding table의 행을 고른다. 이 content vector에 position vector를 더하면 model width는 유지하면서 위치 정보를 각 token 표현에 주입할 수 있다. 원 논문은 고정 sinusoidal encoding을 사용했지만 현대 모델은 learned absolute position, relative bias, RoPE 등 서로 다른 방법을 쓴다.</p>
        <PositionExplorer />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-[11px] sm:text-base">{String.raw`\mathrm{PE}_{(p,2i)}=\sin\!\left(p/10000^{2i/d}\right),\quad \mathrm{PE}_{(p,2i+1)}=\cos\!\left(p/10000^{2i/d}\right)`}</MathFormula></div>
        <FormulaNote meaning="짝수·홀수 feature에 같은 주파수의 sine과 cosine을 배치하고, feature index가 커질수록 파장을 길게 만든다. 여러 주파수의 위상 조합이 위치 p를 표현하며 content embedding과 더할 수 있도록 차원 d를 유지한다." symbols={[[String.raw`p`, 'token의 sequence 위치'], [String.raw`i`, '주파수 band index'], [String.raw`d`, 'model embedding dimension']]} />
        <PositionOrderExplorer />
      </NlpSection>

      <NlpSection id="attention" marker="03" tone="violet" question="QKV 계산을 block 안의 실제 tensor shape로 연결한다" title="Self-attention은 [B,N,d]를 [B,H,N,dₖ] 조회로 펼친다">
        <p>세 linear projection은 residual stream에서 Q, K, V를 만든다. Head 축으로 reshape한 뒤 QKᵀ를 계산하면 batch·head마다 N×N score matrix가 생긴다. V 가중합 이후 head를 이어 붙여 d_model 폭으로 돌아와야 residual input과 더할 수 있다.</p>
        <ShapeLedger />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-[11px] sm:text-base">{String.raw`X\in\mathbb R^{B\times N\times d}\to Q,K,V\in\mathbb R^{B\times H\times N\times d_k}\to A\in\mathbb R^{B\times H\times N\times N}`}</MathFormula></div>
        <FormulaNote meaning="Batch와 head는 독립 축으로 유지되고, 마지막 두 축 N×dₖ와 dₖ×N이 곱해져 query 위치 × key 위치의 square score matrix가 된다. Sequence length가 두 축에 나타나므로 표준 dense attention의 score memory와 연산량이 N²에 비례한다." symbols={[[String.raw`B`, 'batch size'], [String.raw`N`, 'sequence length'], [String.raw`H`, 'head count'], [String.raw`d_k`, 'head dimension'], [String.raw`A`, 'attention score 또는 weight tensor']]} />
      </NlpSection>

      <NlpSection id="heads-mask" marker="04" tone="amber" question="병렬 학습과 autoregressive 정보 제약을 mask 하나로 동시에 만족한다" title="Causal mask는 미래를 막지만 모든 위치를 한 번에 계산한다">
        <p>Decoder training에서는 완성된 문장을 tensor로 넣어도 위치 t가 이후 token을 읽으면 정답이 누출된다. Score matrix의 위쪽 삼각형에 −∞를 더하면 softmax 이후 미래 weight가 0이 된다. Padding mask도 실제 token이 아닌 batch padding 열을 같은 원리로 차단한다.</p>
        <CausalMaskExplorer />
        <Misconception>Causal mask가 있다고 계산량이 절반으로 자동 감소하는 것은 아니다. 일반 dense kernel은 여전히 square tensor를 다루며 mask는 정보 흐름을 제한한다. 실제 절약은 sparse·windowed attention이나 특화 kernel이 별도로 필요하다.</Misconception>
      </NlpSection>

      <NlpSection id="block" marker="05" tone="green" question="Attention만으로는 깊은 network가 되지 않는다" title="Residual, normalization, FFN이 학습 가능한 block을 완성한다">
        <p>Attention output은 input과 같은 shape로 투영되어 residual로 더해진다. FFN은 model width를 더 큰 hidden width로 확장하고 activation 뒤 다시 줄인다. 원 논문은 sublayer 뒤 LayerNorm을 두는 Post-LN이지만 많은 현대 LLM은 깊은 학습 안정성을 위해 normalization을 먼저 적용하는 Pre-LN 계열을 쓴다.</p>
        <BlockExplorer />
        <div className="not-prose my-6 grid min-w-0 gap-2 sm:grid-cols-2"><div className="min-w-0 rounded-md border border-blue-500/30 p-3"><MathFormula display className="my-0 text-xs sm:text-sm">{String.raw`y=x+\operatorname{Sublayer}(\operatorname{LN}(x))`}</MathFormula></div><div className="min-w-0 rounded-md border border-amber-500/30 p-3"><MathFormula display className="my-0 text-xs sm:text-sm">{String.raw`\operatorname{FFN}(x)=W_2\,\sigma(W_1x+b_1)+b_2`}</MathFormula></div></div>
        <FormulaNote meaning="왼쪽은 Pre-LN residual update다. Sublayer는 정규화된 표현을 읽지만 identity path x는 직접 다음 block으로 이어진다. 오른쪽 FFN은 각 token에 독립적으로 같은 affine transform과 비선형성을 적용해 feature를 재조합한다." symbols={[[String.raw`x`, '현재 residual stream'], [String.raw`\operatorname{LN}`, 'feature 축 normalization'], [String.raw`W_1`, 'hidden width로 확장'], [String.raw`W_2`, 'model width로 축소'], [String.raw`\sigma`, 'activation 또는 gated activation']]} />
      </NlpSection>

      <NlpSection id="families" marker="06" tone="teal" question="같은 block도 mask와 memory 연결 방식이 달라지면 역할이 달라진다" title="Encoder-only, encoder–decoder, decoder-only는 정보 접근 계약이 다르다">
        <p>세 계열은 attention 수식보다 “어떤 token을 볼 수 있는가”와 “무엇을 예측하도록 학습하는가”에서 갈라진다. Encoder는 양방향 표현에, decoder는 prefix-conditioned 생성에, encoder–decoder는 source를 읽고 target을 만드는 조건부 변환에 적합하다.</p>
        <FamilyExplorer />
        <Takeaway>Architecture 이름을 외우기보다 각 attention layer의 query source, key/value source, mask를 표시하면 대부분의 Transformer 변형을 같은 언어로 해부할 수 있다.</Takeaway>
      </NlpSection>

      <NlpSection id="training-inference" marker="07" tone="blue" question="학습은 target 위치를 병렬 계산하지만 생성은 한 token씩 이어진다" title="KV cache는 과거 token의 key와 value를 저장해 반복 투영을 없앤다">
        <p>Causal language model 학습은 정답 sequence를 한 번에 넣고 shifted next-token loss를 모든 위치에서 계산한다. 추론은 새 token을 낼 때마다 prefix가 늘어난다. 과거 token의 K와 V는 같은 layer에서 다시 계산할 필요가 없으므로 cache하고 새 token의 Q·K·V만 계산한다.</p>
        <KvCacheExplorer />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-[11px] sm:text-base">{String.raw`\operatorname{KVBytes}=\underbrace{2}_{\text{K와 V}}\,\underbrace{B L N H_{kv} d_k}_{\text{저장할 원소 수}}\,\underbrace{s}_{\text{원소당 byte}}`}</MathFormula></div>
        <FormulaNote meaning="각 batch, layer, cached token, KV head마다 key와 value vector를 보관한다. 앞의 2는 K와 V 두 tensor다. GQA와 MQA는 query head 수를 유지한 채 Hₖᵥ를 줄여 cache memory와 decode 시 읽을 K/V 양을 줄인다. Cache는 과거 K/V projection을 재사용하지만 새 query가 길이 N의 cache를 읽는 attention 자체는 남는다." symbols={[[String.raw`B`, '동시에 decode하는 sequence 수'], [String.raw`L`, 'Transformer layer 수'], [String.raw`N`, 'cache된 token 수'], [String.raw`H_{kv}`, 'key/value head 수'], [String.raw`d_k`, 'KV head dimension'], [String.raw`s`, 'bf16·fp16이면 보통 2 byte']]} />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\mathcal L_{\mathrm{CLM}}=-\sum_{t=1}^{N-1}\log p_\theta(x_{t+1}\mid x_{\le t})`}</MathFormula></div>
        <FormulaNote meaning="각 위치 t의 representation으로 다음 token xₜ₊₁의 확률을 높인다. Causal mask가 미래를 숨기므로 모든 t의 loss를 병렬 계산해도 각 prediction은 prefix x≤t에만 조건화된다." symbols={[[String.raw`N`, 'training sequence length'], [String.raw`x_{\le t}`, '현재까지 허용된 prefix'], [String.raw`\theta`, 'model의 학습 parameter']]} />
        <CapabilityCheck items={['입력 ID부터 logits까지 residual stream과 주요 tensor shape를 이어서 추적할 수 있다.', 'Position이 없을 때 self-attention의 permutation equivariance를 설명할 수 있다.', 'Attention과 FFN의 token mixing·channel mixing 역할을 구분할 수 있다.', 'Causal mask가 정보 누출은 막지만 dense N² score allocation을 자동으로 줄이지 않는 이유를 설명할 수 있다.', 'Post-LN과 Pre-LN의 normalization·identity path 위치를 그릴 수 있다.', '세 Transformer 계열을 Q/K/V source와 mask로 구분할 수 있다.', 'MHA·GQA·MQA의 query/KV head 수와 KV cache bytes를 계산할 수 있다.', 'Cache가 없애는 K/V projection과 여전히 남는 cache read를 구분할 수 있다.']} />
        <SourceNotes sources={[
          { label: 'Vaswani et al. — Attention Is All You Need', href: 'https://research.google/pubs/attention-is-all-you-need/', note: 'Encoder–decoder block, multi-head attention, sinusoidal position, residual·normalization의 원 설계를 제시한다.' },
          { label: 'Ba et al. — Layer Normalization', href: 'https://arxiv.org/abs/1607.06450', note: 'Sample 내부 feature 통계로 sequence model을 정규화하는 방법을 제안한다.' },
          { label: 'Xiong et al. — On Layer Normalization in the Transformer Architecture', href: 'https://proceedings.mlr.press/v119/xiong20b.html', note: '원 Post-LN과 Pre-LN의 초기 gradient와 warmup 차이를 분석한다.' },
          { label: 'Ainslie et al. — Grouped-Query Attention', href: 'https://aclanthology.org/2023.emnlp-main.298/', note: 'Query head와 KV head 수를 분리해 MHA와 MQA 사이의 quality·decode trade-off를 제시한다.' },
          { label: 'Stanford CS224N — Transformer Assignment', href: 'https://cs224n.stanford.edu/assignments_w25/a4.pdf', note: 'Attention shape, causal masking, Transformer language model을 구현 단위로 검증한다.' },
          { label: 'Hugging Face — Cache strategies', href: 'https://huggingface.co/docs/transformers/main/kv_cache', note: 'Autoregressive inference에서 layer별 K/V를 재사용하는 runtime 계약과 cache 변형을 정리한다.' },
        ]} />
      </NlpSection>
    </>
  );
}
