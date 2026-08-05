import { useMemo, useState } from 'react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { CapabilityCheck, ConceptPrimer, InternalLink, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import { FlowRow, MetricGrid, NlpSection, ProbabilityBars, SegmentedControl, Takeaway } from '../nlp-shared';

const corpus = [
  'the bank approved the loan',
  'the bank raised the rate',
  'money moved through the bank',
  'the boat reached the river bank',
  'trees covered the river bank',
];

function CooccurrenceExplorer() {
  const [windowSize, setWindowSize] = useState(2);
  const [target, setTarget] = useState<'bank' | 'river'>('bank');
  const counts = useMemo(() => {
    const result = new Map<string, number>();
    for (const sentence of corpus) {
      const tokens = sentence.split(' ');
      tokens.forEach((token, index) => {
        if (token !== target) return;
        const left = Math.max(0, index - windowSize);
        const right = Math.min(tokens.length - 1, index + windowSize);
        for (let cursor = left; cursor <= right; cursor += 1) {
          if (cursor === index) continue;
          result.set(tokens[cursor], (result.get(tokens[cursor]) ?? 0) + 1);
        }
      });
    }
    return [...result.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [target, windowSize]);

  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid gap-4 border-b border-border bg-muted/20 p-4 sm:grid-cols-[1fr_auto] sm:items-end sm:p-6">
        <label htmlFor="context-window" className="block text-xs font-semibold text-muted-foreground">양쪽 context window · ±{windowSize} token
          <input id="context-window" type="range" min="1" max="4" step="1" value={windowSize} onChange={(event) => setWindowSize(Number(event.target.value))} className="mt-3 block w-full accent-foreground" />
        </label>
        <SegmentedControl label="Target word" options={[{ value: 'bank', label: 'bank' }, { value: 'river', label: 'river' }]} value={target} onChange={setTarget} />
      </div>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,0.8fr)]">
        <div className="min-w-0 space-y-2">
          {corpus.map((sentence, index) => {
            const tokens = sentence.split(' ');
            return <p key={`${sentence}-${index}`} className="flex flex-wrap gap-1 font-mono text-xs leading-relaxed">{tokens.map((token, tokenIndex) => <span key={`${token}-${tokenIndex}`} className={`rounded px-1.5 py-0.5 ${token === target ? 'bg-blue-600 font-bold text-white' : 'bg-muted/40'}`}>{token}</span>)}</p>;
          })}
        </div>
        <ProbabilityBars label={`${target} 주변 context 빈도`} items={counts.map(([label, value]) => ({ label, value }))} />
      </div>
      <p className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:px-6">Window가 작으면 국소 결합을, 크면 주제 관련성을 더 많이 센다. 같은 corpus도 context 정의가 바뀌면 다른 의미 공간을 만든다.</p>
    </div>
  );
}

const ppmiPairs = {
  'bank · loan': { joint: 20, left: 50, right: 40, total: 1000 },
  'bank · the': { joint: 25, left: 50, right: 400, total: 1000 },
  'bank · quasar': { joint: 1, left: 50, right: 1, total: 1000 },
  'bank · volcano': { joint: 0, left: 50, right: 5, total: 1000 },
};

function PpmiExplorer() {
  const [pair, setPair] = useState<keyof typeof ppmiPairs>('bank · loan');
  const counts = ppmiPairs[pair];
  const pJoint = counts.joint / counts.total;
  const pLeft = counts.left / counts.total;
  const pRight = counts.right / counts.total;
  const expected = pLeft * pRight;
  const pmi = counts.joint === 0 ? Number.NEGATIVE_INFINITY : Math.log2(pJoint / expected);
  const ppmi = Math.max(0, pmi);

  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="border-b border-border bg-muted/20 p-4 sm:p-6">
        <SegmentedControl label="PMI를 계산할 pair" options={(Object.keys(ppmiPairs) as Array<keyof typeof ppmiPairs>).map((value) => ({ value, label: value }))} value={pair} onChange={setPair} />
      </div>
      <div className="p-4 sm:p-6">
        <MetricGrid items={[
          { label: '공동 등장', value: String(counts.joint), note: `P(w,c) = ${pJoint.toFixed(3)}` },
          { label: 'target 행 합계', value: String(counts.left), note: `P(w) = ${pLeft.toFixed(3)}` },
          { label: 'context 열 합계', value: String(counts.right), note: `P(c) = ${pRight.toFixed(3)}` },
          { label: 'PPMI', value: Number.isFinite(ppmi) ? ppmi.toFixed(3) : '0.000', note: Number.isFinite(pmi) ? `PMI ${pmi.toFixed(3)}을 0 아래에서 자른 값` : '관측되지 않아 0으로 둔다.', accent: ppmi > 0 },
        ]} />
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-md border border-border p-3"><p className="text-xs font-bold text-muted-foreground">실제 공동 확률</p><p className="mt-1 font-mono text-sm font-bold">{pJoint.toFixed(3)}</p></div>
          <div className="rounded-md border border-border p-3"><p className="text-xs font-bold text-muted-foreground">독립일 때 기대 확률</p><p className="mt-1 font-mono text-sm font-bold">{expected < 0.001 ? expected.toFixed(6) : expected.toFixed(4)}</p></div>
          <div className="rounded-md border border-blue-500/40 bg-blue-500/5 p-3"><p className="text-xs font-bold text-muted-foreground">비율</p><p className="mt-1 font-mono text-sm font-bold">{expected > 0 ? (pJoint / expected).toFixed(2) : '0.00'}x</p></div>
        </div>
        {counts.joint === 1 && (
          <p className="mt-4 border-l-2 border-amber-500 bg-amber-500/5 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
            한 번의 공동 등장만으로 PPMI가 크게 나왔다. PMI는 기대 대비 비율이지 표본 신뢰도가 아니다. 최소 count, context smoothing, 다른 corpus split에서의 재현성을 함께 확인해야 한다.
          </p>
        )}
      </div>
    </div>
  );
}

function SvdExplorer() {
  const [rank, setRank] = useState(2);
  const singularValues = [6, 3, 1];
  const retained = singularValues.slice(0, rank).reduce((sum, value) => sum + value ** 2, 0);
  const total = singularValues.reduce((sum, value) => sum + value ** 2, 0);
  const error = Math.sqrt(total - retained);
  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="border-b border-border bg-muted/20 p-4 sm:p-6">
        <label htmlFor="svd-rank" className="block text-xs font-semibold text-muted-foreground">남길 latent dimension k · {rank}/3
          <input id="svd-rank" type="range" min="1" max="3" step="1" value={rank} onChange={(event) => setRank(Number(event.target.value))} className="mt-3 block w-full accent-foreground" />
        </label>
      </div>
      <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-center">
        <div className="space-y-3">
          {singularValues.map((value, index) => <div key={value} className="grid grid-cols-[2.5rem_minmax(0,1fr)_3rem] items-center gap-2 text-xs"><span className="font-mono">σ{index + 1}</span><span className="h-4 overflow-hidden rounded-sm bg-muted"><span className={`block h-full transition-all ${index < rank ? 'bg-blue-600' : 'bg-muted-foreground/30'}`} style={{ width: `${(value / singularValues[0]) * 100}%` }} /></span><span className="text-right font-mono">{value}</span></div>)}
          <p className="text-xs leading-relaxed text-muted-foreground">큰 singular direction은 여러 context column에 반복되는 구조를 많이 설명한다. 작은 direction을 버리면 noise도 줄지만 희귀한 의미 차이도 함께 잃을 수 있다.</p>
        </div>
        <MetricGrid items={[
          { label: 'retained energy', value: `${((retained / total) * 100).toFixed(1)}%`, note: '제곱 singular value 비율' },
          { label: 'reconstruction error', value: error.toFixed(2), note: '버린 direction의 Frobenius norm', accent: rank === 3 },
        ]} />
      </div>
    </div>
  );
}

const vectorPairs = {
  'doctor · nurse': { a: [1, 0.1], b: [0.9, 0.2] },
  'doctor · banana': { a: [1, 0.1], b: [0.05, 1] },
  'bank · money': { a: [0.85, 0.2], b: [0.9, 0.15] },
  'bank · river': { a: [0.85, 0.2], b: [0.05, 0.95] },
};

function cosine(a: number[], b: number[]) {
  const dot = a.reduce((sum, value, index) => sum + value * b[index], 0);
  const normA = Math.sqrt(a.reduce((sum, value) => sum + value ** 2, 0));
  const normB = Math.sqrt(b.reduce((sum, value) => sum + value ** 2, 0));
  return { dot, normA, normB, value: dot / (normA * normB) };
}

function PredictiveHandoff() {
  return (
    <div className="not-prose my-8 space-y-5 overflow-hidden rounded-md border border-border p-4 sm:p-6">
      <div>
        <p className="mb-3 text-xs font-bold text-violet-700 dark:text-violet-300">명시적 count 경로</p>
        <FlowRow items={[
          { label: '관측', value: '모든 pair count', note: 'X[w,c]를 저장한다.' },
          { label: '가중', value: 'PPMI matrix', note: '독립 기대값을 뺀다.' },
          { label: '압축', value: 'SVD rank k', note: '행렬 전체를 분해한다.' },
        ]} activeIndex={1} />
      </div>
      <div className="border-t border-border pt-5">
        <p className="mb-3 text-xs font-bold text-emerald-700 dark:text-emerald-300">Word2Vec의 sampled prediction 경로</p>
        <FlowRow items={[
          { label: '관측', value: 'positive pair', note: '실제 window에서 뽑는다.' },
          { label: '대조', value: 'k noise pairs', note: '전체 열 대신 일부만 본다.' },
          { label: '학습', value: 'u_cᵀv_w', note: 'Dot score를 직접 조정한다.' },
        ]} activeIndex={2} />
      </div>
    </div>
  );
}

function GeometryExplorer() {
  const [pair, setPair] = useState<keyof typeof vectorPairs>('doctor · nurse');
  const vectors = vectorPairs[pair];
  const result = cosine(vectors.a, vectors.b);
  const [left, right] = pair.split(' · ');
  const originX = 48;
  const originY = 190;
  const scale = 160;
  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="border-b border-border bg-muted/20 p-4 sm:p-6"><SegmentedControl label="Cosine pair" options={(Object.keys(vectorPairs) as Array<keyof typeof vectorPairs>).map((value) => ({ value, label: value }))} value={pair} onChange={setPair} /></div>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-center">
        <svg viewBox="0 0 360 230" className="block aspect-[360/230] w-full" role="img" aria-label={`${left}와 ${right} vector 방향 비교`}>
          <defs><marker id="vector-a" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#2563eb" /></marker><marker id="vector-b" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#d97706" /></marker></defs>
          <line x1={originX} y1={originY} x2="330" y2={originY} stroke="currentColor" opacity="0.22" /><line x1={originX} y1={originY} x2={originX} y2="25" stroke="currentColor" opacity="0.22" />
          <line x1={originX} y1={originY} x2={originX + vectors.a[0] * scale} y2={originY - vectors.a[1] * scale} stroke="#2563eb" strokeWidth="3" markerEnd="url(#vector-a)" />
          <line x1={originX} y1={originY} x2={originX + vectors.b[0] * scale} y2={originY - vectors.b[1] * scale} stroke="#d97706" strokeWidth="3" markerEnd="url(#vector-b)" />
          <text x={Math.min(320, originX + 8 + vectors.a[0] * scale)} y={Math.max(24, originY - 8 - vectors.a[1] * scale)} fill="#2563eb" fontSize="11" fontWeight="700">{left}</text>
          <text x={Math.min(320, originX + 8 + vectors.b[0] * scale)} y={Math.min(214, originY + 16 - vectors.b[1] * scale)} fill="#d97706" fontSize="11" fontWeight="700">{right}</text>
          <text x="302" y="212" fontSize="10" fill="currentColor" opacity="0.55">context 1</text><text x="8" y="30" fontSize="10" fill="currentColor" opacity="0.55">context 2</text>
        </svg>
        <MetricGrid items={[
          { label: 'dot product', value: result.dot.toFixed(3), note: '방향과 길이가 모두 섞인다.' },
          { label: 'norm product', value: (result.normA * result.normB).toFixed(3), note: '두 vector 길이의 곱' },
          { label: 'cosine', value: result.value.toFixed(3), note: result.value > 0.8 ? '1에 가까워 비슷한 방향' : '0에 가까워 서로 다른 방향', accent: result.value > 0.8 },
        ]} />
      </div>
    </div>
  );
}

function ContextualHandoff() {
  const [context, setContext] = useState<'finance' | 'river'>('finance');
  const data = context === 'finance'
    ? { sentence: 'the bank approved my loan', weights: [{ label: 'loan', value: 0.52 }, { label: 'approved', value: 0.29 }, { label: 'my', value: 0.11 }, { label: 'the', value: 0.08 }], meaning: '금융 기관 방향' }
    : { sentence: 'we sat on the river bank', weights: [{ label: 'river', value: 0.57 }, { label: 'sat', value: 0.21 }, { label: 'on', value: 0.13 }, { label: 'the', value: 0.09 }], meaning: '강둑 방향' };
  return (
    <div className="not-prose my-8 rounded-md border border-border p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="font-mono text-sm font-bold">{data.sentence}</p><SegmentedControl label="bank의 문맥" options={[{ value: 'finance', label: '금융 문맥' }, { value: 'river', label: '강 문맥' }]} value={context} onChange={setContext} /></div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-center">
        <ProbabilityBars label="bank 표현에 반영되는 문맥 신호 예시" items={data.weights} />
        <div className="rounded-md border border-blue-500/40 bg-blue-500/5 p-4"><p className="text-xs font-bold text-muted-foreground">이 문장의 bank</p><p className="mt-2 text-base font-bold">{data.meaning}</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">표시 값은 원리를 설명하기 위한 예시다. 실제 contextual embedding은 단일 attention 분포가 아니라 여러 layer와 head의 변환 결과다.</p></div>
      </div>
    </div>
  );
}

export default function RebuiltDistributionalSemantics() {
  return (
    <>
      <NlpSection id="overview" marker="01" tone="teal" question="단어의 뜻을 사전 정의 없이 좌표로 만들 수 있을까?" title="같은 문맥에 등장하는 단어는 비슷한 역할을 공유한다">
        <QuestionLead question="문자열 ID만 얻은 뒤, 단어 사이의 의미 관계는 어디서 생길까?" answer="Corpus에서 어떤 단어들이 주변에 나타나는지 세면 각 단어를 context count vector로 만들 수 있다. 빈도 편향을 PPMI로 보정하고 차원을 압축하면, 비슷한 문맥을 공유하는 단어가 가까운 방향을 갖는다." />
        <ConceptPrimer items={[
          { term: 'distributional hypothesis', meaning: '비슷한 문맥에서 쓰이는 표현은 비슷한 의미나 기능을 가질 가능성이 높다는 가정이다.', why: '사전 라벨 없이 corpus만으로 의미 좌표를 만드는 출발점이다.' },
          { term: 'co-occurrence', meaning: '정한 context 안에서 target과 context 항목이 함께 관측된 사건이다.', why: '의미를 계산 가능한 count로 바꾼다.' },
          { term: 'PPMI', meaning: '우연한 독립 빈도보다 얼마나 자주 함께 나타나는지의 양수 부분이다.', why: 'the 같은 고빈도 단어가 raw count를 지배하는 현상을 줄인다.' },
          { term: 'cosine similarity', meaning: 'Vector 길이를 나누어 방향만 비교하는 유사도다.', why: '단어 빈도보다 context 비율이 비슷한지 보기 쉽다.' },
        ]} />
        <FlowRow items={[{ label: 'Corpus', value: 'token sequence', note: '관측 자료' }, { label: 'Count matrix', value: 'X[w,c]', note: '문맥 사건을 센다.' }, { label: 'Weight', value: 'PPMI', note: '독립 기대값과 비교한다.' }, { label: 'Geometry', value: 'UₖΣₖ', note: '낮은 차원의 방향을 얻는다.' }]} activeIndex={1} />
      </NlpSection>

      <NlpSection id="cooccurrence" marker="02" tone="blue" question="Context를 무엇으로 정의하느냐가 곧 의미의 정의다" title="Window를 움직여 word-context matrix의 한 행을 만든다">
        <p><InternalLink slug="tokenizer">Tokenizer</InternalLink>가 만든 vocabulary ID가 matrix의 행 target과 열 context의 축을 결정한다. 아래 영어 단어 예시는 읽기 쉽게 공백 경계를 사용하지만, 실제 subword 모델에서는 같은 표면 단어가 여러 ID pair 사건으로 나뉜다. 각 target 위치에서 좌우 일정 범위의 token을 context로 센다. 작은 window는 수식 관계와 국소 결합을 강조하고, 큰 window는 같은 주제를 공유하는 단어를 더 많이 모은다. 문장·문서·dependency edge를 context로 쓸 수도 있으므로 co-occurrence vector는 중립적인 사실이 아니라 설계 결과다.</p>
        <CooccurrenceExplorer />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-sm sm:text-base">{String.raw`X_{w,c}=\sum_{t}\mathbf 1[w_t=w]\,\mathbf 1[c\in\mathcal C_t]`}</MathFormula></div>
        <FormulaNote meaning="Corpus의 각 위치 t를 돌며 현재 단어가 target w이고 context 집합에 c가 있으면 1을 더한다. Indicator를 쓰는 이유는 문자열 문맥을 행렬의 정수 count로 바꾸기 위해서다. 거리 가중치를 쓰면 가까운 항목에 더 큰 값을 줄 수도 있다." symbols={[[String.raw`X_{w,c}`, 'word w와 context c의 공동 등장 count'], [String.raw`\mathcal C_t`, '위치 t에서 정의한 context 집합'], [String.raw`\mathbf 1`, '조건이 참이면 1인 indicator']]} />
      </NlpSection>

      <NlpSection id="ppmi-svd" marker="03" tone="violet" question="많이 나온 것과 기대보다 많이 나온 것을 구분한다" title="PPMI로 빈도 기준선을 빼고 SVD로 반복 구조를 압축한다">
        <p>Raw count는 의미 관련성뿐 아니라 단어 자체의 빈도를 담는다. PMI는 두 항목이 독립이라고 가정했을 때의 기대 공동 확률과 실제 공동 확률의 비율을 로그로 측정한다. PPMI는 음수 값을 0으로 잘라 관측되지 않거나 기대보다 덜 만난 pair를 sparse한 0으로 둔다.</p>
        <PpmiExplorer />
        <div className="not-prose my-6 grid min-w-0 gap-2 sm:grid-cols-3">
          <div className="min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-sm">{String.raw`\underbrace{N}_{\text{전체 사건}}=\sum_{u,v}X_{u,v}`}</MathFormula></div>
          <div className="min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-sm">{String.raw`\underbrace{P(w,c)}_{\text{공동 확률}}=\frac{X_{w,c}}{N}`}</MathFormula></div>
          <div className="min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-sm">{String.raw`\underbrace{P(w)}_{\text{target 주변 확률}}=\frac{\sum_vX_{w,v}}{N}`}</MathFormula></div>
        </div>
        <FormulaNote meaning="확률의 분모를 문장 수나 원문 token 수가 아니라 같은 방식으로 센 전체 word-context event N으로 통일한다. 한 칸을 N으로 나누면 공동 확률이 되고, 한 행을 합해 N으로 나누면 target marginal이 된다. Context marginal도 같은 방식으로 column을 합한다." symbols={[[String.raw`X_{w,c}`, 'Target w와 context c의 count'], [String.raw`N`, 'Matrix의 모든 count를 더한 사건 수'], [String.raw`\sum_vX_{w,v}`, 'Target w 행의 전체 count']]} />
        <div className="not-prose my-6 grid min-w-0 gap-2 sm:grid-cols-2">
          <div className="rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-sm">{String.raw`\mathrm{PMI}(w,c)=\log_2\frac{P(w,c)}{P(w)P(c)}`}</MathFormula></div>
          <div className="rounded-md border border-blue-500/40 bg-blue-500/5 p-3"><MathFormula display className="my-0 text-xs sm:text-sm">{String.raw`\mathrm{PPMI}(w,c)=\max(0,\mathrm{PMI}(w,c))`}</MathFormula></div>
        </div>
        <FormulaNote meaning="분모는 w와 c가 서로 무관할 때 기대되는 공동 확률이다. 실제 확률을 이 값으로 나누면 corpus 빈도 기준선을 제거할 수 있고, log는 곱셈 비율을 더 다루기 쉬운 덧셈 척도로 바꾼다. 이 글의 log₂는 bit 단위이며 자연로그를 써도 값의 scale만 달라진다. Max는 음의 association을 0으로 만들어 sparse 표현을 유지하지만 음의 증거는 버린다." symbols={[[String.raw`P(w,c)`, '관측된 공동 확률'], [String.raw`P(w)P(c)`, '독립일 때 기대 공동 확률'], [String.raw`\max(0,\cdot)`, '음수 association을 0으로 자르는 연산']]} />
        <Misconception>PMI가 크다고 곧 강한 증거인 것은 아니다. 한 번 나온 희귀 context는 marginal이 매우 작아 ratio가 과도하게 커질 수 있다. 위 explorer에서 <em>bank · quasar</em>가 <em>bank · loan</em>보다 높은 점수를 받아도 더 안정적인 관계는 아니다.</Misconception>
        <p>PPMI matrix는 vocabulary 크기만큼 넓고 sparse하다. Truncated SVD는 행렬의 큰 반복 direction만 남겨 dense한 저차원 vector로 바꾼다. 이것은 공짜 압축이 아니다. 작은 singular direction에 있던 희귀 정보도 함께 버릴 수 있다.</p>
        <SvdExplorer />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`M\approx U_k\Sigma_kV_k^\top,\qquad E=U_k\Sigma_k`}</MathFormula></div>
        <FormulaNote meaning="SVD는 word-context matrix를 서로 직교하는 latent direction으로 분해한다. 큰 singular value k개만 남기는 이유는 corpus에서 반복되는 구조를 보존하면서 차원과 noise를 줄이기 위해서다. Word embedding E는 각 word가 그 latent direction을 얼마나 갖는지 나타낸다." symbols={[[String.raw`M`, 'PPMI word-context matrix'], [String.raw`U_k`, 'word 쪽 상위 k개 direction'], [String.raw`\Sigma_k`, '각 direction의 설명 크기'], [String.raw`V_k`, 'context 쪽 상위 direction']]} />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\underbrace{\lVert M-M_k\rVert_F^2}_{\text{rank-k 복원의 제곱 오차}}=\underbrace{\sum_{i>k}\sigma_i^2}_{\text{버린 singular direction의 energy}}`}</MathFormula></div>
        <FormulaNote meaning="가장 좋은 rank-k 근사는 큰 singular value부터 남긴다. 직교 direction의 오차는 서로 섞이지 않으므로 버린 singular value의 제곱을 더하면 전체 Frobenius 제곱 오차가 된다. Explorer의 [6,3,1]에서는 k=1이면 오차가 √10≈3.16, k=2이면 1이다." symbols={[[String.raw`M_k`, '상위 k개 direction만 남긴 matrix'], [String.raw`\lVert\cdot\rVert_F`, '모든 matrix cell 오차 제곱합의 제곱근'], [String.raw`\sigma_i`, 'i번째 singular value']]} />
        <p>Rank와 reconstruction error의 선형대수적 근거가 막히면 <InternalLink slug="linear-algebra-decompositions">부분공간과 행렬 분해</InternalLink>에서 내려가 계산한다.</p>
      </NlpSection>

      <NlpSection id="geometry" marker="04" tone="amber" question="두 단어가 얼마나 가까운지는 무엇을 비교한 값일까?" title="Cosine은 vector 길이를 지우고 context 비율의 방향을 비교한다">
        <p>Dot product는 같은 direction을 향할수록 커지지만 vector 길이도 함께 반영한다. 고빈도 단어는 더 큰 norm을 가질 수 있으므로, 의미 유사도를 볼 때는 두 norm의 곱으로 나누어 각도만 비교하는 cosine을 자주 쓴다.</p>
        <GeometryExplorer />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-sm sm:text-base">{String.raw`\cos(u,v)=\frac{u^\top v}{\lVert u\rVert_2\lVert v\rVert_2}`}</MathFormula></div>
        <FormulaNote meaning="분자의 dot product는 두 vector가 같은 dimension에서 함께 큰 정도를 합한다. 두 norm으로 나누는 이유는 vector 길이, 즉 빈도나 확신 크기의 영향을 제거하고 방향만 비교하기 위해서다. 따라서 cosine은 유사도를 주지만 두 vector의 신뢰도나 corpus 빈도는 알려주지 않는다." symbols={[[String.raw`u^\top v`, '같은 dimension끼리 곱해 더한 dot product'], [String.raw`\lVert u\rVert_2`, 'u의 Euclidean 길이'], [String.raw`\cos(u,v)`, '-1에서 1 사이의 방향 유사도']]} />
        <Misconception>Embedding의 개별 axis가 자동으로 사람이 이름 붙일 수 있는 의미 특성인 것은 아니다. 공간 전체의 상대적 방향이 유용한 것이며, 회전해도 pairwise dot product가 같을 수 있다.</Misconception>
      </NlpSection>

      <NlpSection id="predictive-handoff" marker="05" tone="violet" question="거대한 PPMI 표를 먼저 만들지 않아도 같은 통계를 배울 수 있을까?" title="Word2Vec은 sampled pair 예측으로 word-context score를 직접 학습한다">
        <p>Count route는 모든 matrix cell을 센 뒤 SVD한다. Word2Vec의 Skip-gram with Negative Sampling은 실제 window pair와 일부 noise pair만 뽑아 dot product를 올리거나 내린다. 계산 경로는 다르지만 corpus 전체에서 반복하면 score가 word-context association을 근사한다.</p>
        <PredictiveHandoff />
        <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3"><MathFormula display className="my-0 text-xs sm:text-base">{String.raw`\underbrace{s^*_{w,c}}_{\text{학습이 수렴한 dot score}}=\underbrace{\operatorname{PMI}_{\ln}(w,c)}_{\text{자연로그 문맥 정보}}-\underbrace{\ln k}_{\text{negative 수만큼 기준 이동}}`}</MathFormula></div>
        <FormulaNote meaning="Noise context를 empirical unigram에서 k개씩 뽑고 각 pair score를 독립적으로 맞출 만큼 embedding 차원이 충분한 단순 조건에서는 positive와 negative의 기대 gradient가 상쇄되는 dot score가 자연로그 PMI에서 ln k를 뺀 값이 된다. 실제 유한 차원은 모든 pair를 동시에 맞추는 low-rank 절충이며, 3/4 noise distribution에서는 context marginal 대신 그 noise 확률이 들어간다." symbols={[[String.raw`s^*_{w,c}`, 'Word와 context embedding의 수렴 dot product'], [String.raw`\operatorname{PMI}_{\ln}`, '자연로그로 계산한 pointwise mutual information'], [String.raw`k`, 'Positive pair 하나당 뽑는 negative 수']]} />
        <p>다음 <InternalLink slug="word2vec">Word2Vec</InternalLink> 글에서 <MathFormula>{String.raw`\sigma(s)-y`}</MathFormula> 한 번의 update부터 이 수렴식까지 직접 유도한다.</p>
      </NlpSection>

      <NlpSection id="contextual" marker="06" tone="green" question="한 단어에 하나의 vector만 있으면 다의어를 어디에 둘까?" title="Static embedding의 평균 의미에서 문장별 표현으로 넘어간다">
        <p>Count, SVD, Word2Vec, GloVe는 학습 방식은 달라도 보통 vocabulary 항목마다 하나의 static vector를 저장한다. <em>bank</em>가 금융 기관과 강둑 문맥에 모두 등장하면 두 용법이 하나의 좌표에 섞인다. Contextual model은 현재 문장의 다른 token을 사용해 위치마다 다른 표현을 계산한다.</p>
        <ContextualHandoff />
        <Takeaway>분포 의미는 Transformer가 버린 옛 아이디어가 아니다. Transformer도 주변 token으로 표현을 갱신한다. 달라진 점은 corpus 전체를 하나의 고정 vector로 압축하지 않고, 입력 문장마다 각 위치의 context를 다시 계산한다는 것이다.</Takeaway>
        <CapabilityCheck items={['Window 정의로 co-occurrence 행을 직접 만들 수 있다.', 'Joint·marginal count에서 PPMI를 계산하고 희귀 pair 과대값을 진단할 수 있다.', 'SVD rank가 보존 정보와 reconstruction error를 바꾸는 이유를 계산할 수 있다.', 'Explicit PPMI+SVD와 sampled Word2Vec의 계산 경로를 연결할 수 있다.', 'Cosine의 장점과 static embedding의 다의어 한계를 구분할 수 있다.']} />
        <SourceNotes sources={[
          { label: 'Improving Distributional Similarity with Lessons Learned from Word Embeddings', href: 'https://aclanthology.org/Q15-1016/', note: 'PPMI·SVD·SGNS·GloVe를 같은 word-context 관점에서 비교한다.' },
          { label: 'Neural Word Embedding as Implicit Matrix Factorization', href: 'https://proceedings.neurips.cc/paper/2014/hash/feab05aa91085b7a8012516bc3533958-Abstract.html', note: 'SGNS의 dot score와 shifted PMI matrix의 관계를 유도한다.' },
          { label: 'GloVe: Global Vectors for Word Representation', href: 'https://aclanthology.org/D14-1162/', note: 'Global co-occurrence 통계와 learned vector objective를 연결한다.' },
          { label: 'CS224N Word2Vec Assignment', href: 'https://cs224n.stanford.edu/assignments_w25/a2.pdf', note: '분포 가정에서 objective·gradient·shape까지 구현 수준으로 확인한다.' },
        ]} />
      </NlpSection>
    </>
  );
}
