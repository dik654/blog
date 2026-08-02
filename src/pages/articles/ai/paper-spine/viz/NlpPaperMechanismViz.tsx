import type { CSSProperties } from 'react';
import {
  ArrowDown,
  ArrowRight,
  Binary,
  BookOpenCheck,
  BrainCircuit,
  CheckCircle2,
  CircleDot,
  Combine,
  Database,
  Eye,
  FileCheck2,
  Gauge,
  GitBranch,
  Layers3,
  LockKeyhole,
  Network,
  Route,
  ScanSearch,
  Sigma,
  Split,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Math from '@/components/ui/math';
import StepViz, { type StepDef } from '@/components/ui/step-viz';

type Tone = 'gold' | 'cyan' | 'violet' | 'green' | 'red' | 'muted';
type Layout = 'flow' | 'compare' | 'tokens' | 'bars' | 'matrix' | 'boundary';
type PaperKind = 'word2vec' | 'long-term' | 'lstm' | 'seq2seq' | 'bahdanau' | 'bert';

interface Item {
  label: string;
  value: string;
  detail: string;
  tone?: Tone;
  metric?: string;
}

interface MatrixSpec {
  columns: string[];
  rows: Array<{ label: string; values: number[] }>;
}

interface Scene {
  eyebrow: string;
  title: string;
  body: string;
  icon: LucideIcon;
  layout: Layout;
  items: Item[];
  callout: string;
  owner: string;
  output: string;
  invariant: string;
  formula?: string;
  formulaNote?: string;
  matrix?: MatrixSpec;
}

const colors: Record<Tone, string> = {
  gold: '#d6a84b',
  cyan: '#38b8c8',
  violet: '#9b87f5',
  green: '#45b982',
  red: '#e06f75',
  muted: '#87909d',
};

function SceneTitle({
  icon: Icon,
  eyebrow,
  title,
  body,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <header className="grid min-w-0 grid-cols-[2.5rem_minmax(0,1fr)] gap-3 border-b border-border pb-4">
      <span className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background">
        <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="font-mono text-[11px] font-black uppercase text-muted-foreground">{eyebrow}</p>
        <h4 className="mt-1 text-base font-black leading-snug sm:text-lg">{title}</h4>
        <p className="mt-2 max-w-3xl text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">{body}</p>
      </div>
    </header>
  );
}

function Receipt({
  owner,
  output,
  invariant,
}: Pick<Scene, 'owner' | 'output' | 'invariant'>) {
  const values = [
    ['현재 책임', owner],
    ['남긴 출력', output],
    ['다음 불변식', invariant],
  ] as const;

  return (
    <dl className="mt-5 grid min-w-0 grid-cols-3 divide-x divide-border border-y border-border">
      {values.map(([term, value]) => (
        <div className="min-w-0 px-2 py-3 sm:px-3" key={term}>
          <dt className="text-[11px] font-bold text-muted-foreground">{term}</dt>
          <dd className="mt-1 break-words font-mono text-[11px] font-semibold leading-5 [overflow-wrap:anywhere]">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function FlowArrow() {
  return (
    <div className="flex min-h-7 items-center justify-center text-muted-foreground" aria-hidden="true">
      <ArrowDown className="h-4 w-4 md:hidden" />
      <ArrowRight className="hidden h-4 w-4 md:block" />
    </div>
  );
}

function ItemCard({ item, index = 0 }: { item: Item; index?: number }) {
  const tone = item.tone ?? 'muted';
  return (
    <motion.div
      initial={{ opacity: 0, y: 7 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="relative min-w-0 overflow-hidden rounded-md border border-border bg-background p-3 sm:p-4"
    >
      <div className="min-w-0">
        <span className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 font-mono text-[11px] font-black text-muted-foreground">
            {String(index + 1).padStart(2, '0')}
          </span>
          <CircleDot className="h-3.5 w-3.5 shrink-0" style={{ color: colors[tone] }} aria-hidden="true" />
          <span className="min-w-0 break-words font-mono text-[11px] font-black uppercase text-muted-foreground [overflow-wrap:anywhere]">
            {item.label}
          </span>
        </span>
        {item.metric ? (
          <span
            className="mt-2 block min-w-0 break-words font-mono text-[11px] font-black leading-4 [overflow-wrap:anywhere]"
            style={{ color: colors[tone] }}
          >
            {item.metric}
          </span>
        ) : null}
      </div>
      <p className="mt-3 break-words text-sm font-black leading-5 [overflow-wrap:anywhere]">{item.value}</p>
      <p className="mt-2 break-words text-[11px] leading-5 text-muted-foreground [overflow-wrap:anywhere]">
        {item.detail}
      </p>
    </motion.div>
  );
}

function FlowLayout({ items }: { items: Item[] }) {
  return (
    <div className="grid min-w-0 grid-cols-2 gap-2 md:flex md:items-stretch md:gap-0">
      {items.map((item, index) => (
        <div className="contents" key={`${item.label}-${item.value}`}>
          <div className="min-w-0 flex-1">
            <ItemCard item={item} index={index} />
          </div>
          {index < items.length - 1 ? (
            <div className="hidden flex-none md:block md:w-7">
              <FlowArrow />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function CompareLayout({ items }: { items: Item[] }) {
  return (
    <div className={`grid min-w-0 grid-cols-2 gap-2 sm:gap-3 ${items.length >= 3 ? 'md:grid-cols-3' : ''}`}>
      {items.map((item, index) => (
        <div
          className={items.length % 2 === 1 && index === items.length - 1 ? 'col-span-2 md:col-span-1' : 'min-w-0'}
          key={`${item.label}-${item.value}`}
        >
          <ItemCard item={item} index={index} />
        </div>
      ))}
    </div>
  );
}

function TokenLayout({ items }: { items: Item[] }) {
  return (
    <div className="min-w-0">
      <div className="flex min-w-0 flex-wrap items-stretch justify-center gap-2">
        {items.map((item, index) => {
          const tone = item.tone ?? 'muted';
          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="min-w-[4.6rem] max-w-full flex-1 basis-[4.6rem] rounded-md border border-border bg-background px-2 py-3 text-center sm:min-w-[5.6rem]"
              key={`${item.label}-${item.value}`}
            >
              <span className="block font-mono text-[11px] font-black uppercase" style={{ color: colors[tone] }}>
                {item.label}
              </span>
              <strong className="mt-2 block break-words text-xs leading-5 sm:text-sm">{item.value}</strong>
              <span className="mt-1 block break-words text-[11px] leading-4 text-muted-foreground">{item.detail}</span>
            </motion.div>
          );
        })}
      </div>
      <div className="mx-auto mt-4 flex max-w-xl items-center gap-3 border-y border-border px-2 py-3">
        <Route className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <p className="text-[11px] font-semibold leading-5 text-muted-foreground">
          강조된 위치가 이 장면에서 실제로 값이 바뀌거나 loss를 받는 경계다.
        </p>
      </div>
    </div>
  );
}

function BarsLayout({ items }: { items: Item[] }) {
  return (
    <div className="min-w-0 space-y-3">
      {items.map((item, index) => {
        const tone = item.tone ?? 'muted';
        const raw = Number.parseFloat(item.metric ?? '0');
        const width = Number.isFinite(raw) ? globalThis.Math.max(8, globalThis.Math.min(100, raw)) : 40;
        return (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.07 }}
            className="grid min-w-0 grid-cols-[4rem_minmax(0,1fr)_4.5rem] items-center gap-2 sm:grid-cols-[7rem_minmax(0,1fr)_5rem]"
            key={`${item.label}-${item.value}`}
          >
            <span className="font-mono text-[11px] font-black text-muted-foreground">{item.label}</span>
            <div className="min-w-0">
              <div className="h-2 overflow-hidden rounded-full bg-border/70">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${width}%` }}
                  transition={{ duration: 0.42, delay: 0.08 + index * 0.07 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: colors[tone] }}
                />
              </div>
              <p className="mt-1 break-words text-[11px] leading-5 text-muted-foreground">{item.detail}</p>
            </div>
            <strong className="break-words font-mono text-[11px] sm:text-right sm:text-xs" style={{ color: colors[tone] }}>
              {item.value}
            </strong>
          </motion.div>
        );
      })}
    </div>
  );
}

function MatrixLayout({ matrix }: { matrix: MatrixSpec }) {
  const columns = matrix.columns.length;
  return (
    <div className="min-w-0">
      <div
        className="grid min-w-0 gap-1"
        style={{ gridTemplateColumns: `minmax(3.75rem,0.9fr) repeat(${columns}, minmax(0,1fr))` }}
      >
        <span className="min-w-0" />
        {matrix.columns.map((column) => (
          <span
            className="min-w-0 truncate px-0.5 text-center font-mono text-[11px] font-black text-muted-foreground"
            key={column}
            title={column}
          >
            {column}
          </span>
        ))}
        {matrix.rows.flatMap((row, rowIndex) => [
          <span
            className="flex min-w-0 items-center font-mono text-[11px] font-black text-muted-foreground"
            key={`${row.label}-label`}
          >
            {row.label}
          </span>,
          ...row.values.map((value, columnIndex) => (
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (rowIndex * columns + columnIndex) * 0.025 }}
              className="flex h-10 min-w-0 items-center justify-center rounded-sm border border-border font-mono text-[11px] font-black"
              style={{
                backgroundColor: `color-mix(in srgb, ${colors.cyan} ${globalThis.Math.max(5, value * 88)}%, transparent)`,
                color: value > 0.58 ? '#071014' : undefined,
              }}
              key={`${row.label}-${columnIndex}`}
              title={`${row.label} → ${matrix.columns[columnIndex]}: ${value.toFixed(2)}`}
            >
              {value.toFixed(1)}
            </motion.span>
          )),
        ])}
      </div>
      <p className="mt-3 text-[11px] leading-5 text-muted-foreground">
        행은 질문하거나 예측하는 위치, 열은 읽는 위치다. 진한 칸은 상대적으로 큰 weight를 뜻한다.
      </p>
    </div>
  );
}

function BoundaryLayout({ items }: { items: Item[] }) {
  return (
    <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3">
      {items.map((item, index) => {
        const supported = item.tone !== 'red';
        const Icon = supported ? CheckCircle2 : XCircle;
        const tone: Tone = supported ? 'green' : 'red';
        return (
          <motion.div
            initial={{ opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07 }}
            className="min-w-0 rounded-md border border-border bg-background p-4"
            key={`${item.label}-${item.value}`}
          >
            <div className="flex min-w-0 items-center gap-2">
              <Icon className="h-4 w-4 shrink-0" style={{ color: colors[tone] }} aria-hidden="true" />
              <span className="font-mono text-[11px] font-black uppercase text-muted-foreground">{item.label}</span>
            </div>
            <p className="mt-3 break-words text-sm font-black leading-5">{item.value}</p>
            <p className="mt-2 text-[11px] leading-5 text-muted-foreground">{item.detail}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

function SceneView({ scene }: { scene: Scene }) {
  let visual;
  if (scene.layout === 'flow') visual = <FlowLayout items={scene.items} />;
  else if (scene.layout === 'compare') visual = <CompareLayout items={scene.items} />;
  else if (scene.layout === 'tokens') visual = <TokenLayout items={scene.items} />;
  else if (scene.layout === 'bars') visual = <BarsLayout items={scene.items} />;
  else if (scene.layout === 'matrix' && scene.matrix) visual = <MatrixLayout matrix={scene.matrix} />;
  else visual = <BoundaryLayout items={scene.items} />;

  return (
    <div className="min-w-0">
      <SceneTitle icon={scene.icon} eyebrow={scene.eyebrow} title={scene.title} body={scene.body} />
      <div className="mt-5 min-w-0">{visual}</div>
      {scene.formula ? (
        <div className="mt-5 min-w-0 rounded-md border border-border bg-background px-3 py-2 sm:px-4">
          <Math display minScale={0.82}>{scene.formula}</Math>
          {scene.formulaNote ? (
            <p className="border-t border-border pt-3 text-[11px] leading-5 text-muted-foreground">
              {scene.formulaNote}
            </p>
          ) : null}
        </div>
      ) : null}
      <div className="mt-5 flex min-w-0 items-start gap-3 border-l-2 border-foreground/60 pl-3">
        <BookOpenCheck className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <p className="text-xs font-semibold leading-5">{scene.callout}</p>
      </div>
      <Receipt owner={scene.owner} output={scene.output} invariant={scene.invariant} />
    </div>
  );
}

const word2vecScenes: Scene[] = [
  {
    eyebrow: '01 · Training data boundary',
    title: '문장은 그대로 학습되지 않고 center–context pair로 잘린다',
    body: 'Window 반경이 “어떤 관계를 같은 문맥으로 볼 것인가”를 먼저 정의한다. 모델보다 앞선 데이터 계약이다.',
    icon: Route,
    layout: 'tokens',
    items: [
      { label: 'context', value: '고양이가', detail: '−2', tone: 'cyan' },
      { label: 'context', value: '작은', detail: '−1', tone: 'cyan' },
      { label: 'center', value: '매트', detail: 'wₜ', tone: 'gold' },
      { label: 'context', value: '위에', detail: '+1', tone: 'cyan' },
      { label: 'outside', value: '앉았다', detail: '+2 밖', tone: 'muted' },
    ],
    formula: String.raw`\bigl(w_t,w_{t-2}\bigr),\ \bigl(w_t,w_{t-1}\bigr),\ \bigl(w_t,w_{t+1}\bigr)`,
    formulaNote: '괄호 하나가 학습 example 하나다. Window를 넓히면 positive pair와 계산량이 함께 늘어난다.',
    callout: '첫 변화 경계는 embedding이 아니라 pair generator다. 같은 corpus라도 window와 tokenization이 바뀌면 다른 문제를 학습한다.',
    owner: 'Corpus window sampler',
    output: '(center, context) positive pairs',
    invariant: 'pair span = declared window c',
  },
  {
    eyebrow: '02 · Direction of prediction',
    title: 'CBOW와 Skip-gram은 같은 단어를 쓰지만 화살표 방향이 반대다',
    body: '둘 다 얕은 prediction architecture지만 input 집합과 target이 뒤집힌다. 이 차이가 희귀 단어와 계산량의 성질을 바꾼다.',
    icon: Split,
    layout: 'compare',
    items: [
      { label: 'CBOW · many → one', value: '주변 단어 평균 → center', detail: '여러 context representation을 모아 “매트”를 예측한다.', tone: 'violet', metric: 'context → center' },
      { label: 'Skip-gram · one → many', value: 'center → 주변 단어들', detail: '“매트” 하나에서 window 안의 여러 context target을 예측한다.', tone: 'cyan', metric: 'center → context' },
    ],
    callout: '“Word2Vec”은 단일 식 이름이 아니다. CBOW와 Skip-gram의 input/target 방향을 먼저 고정해야 loss와 batch shape를 복원할 수 있다.',
    owner: 'Architecture contract',
    output: 'input IDs · target IDs',
    invariant: 'prediction direction never implicit',
  },
  {
    eyebrow: '03 · Lookup to prediction',
    title: 'One-hot 전체를 곱하는 대신 선택된 embedding row만 읽는다',
    body: 'Center ID가 input embedding table의 한 행을 고르고, 그 vector가 output vocabulary score를 만든다.',
    icon: Database,
    layout: 'flow',
    items: [
      { label: 'Token ID', value: 'id(매트)=417', detail: 'Sparse categorical input', tone: 'gold' },
      { label: 'Lookup', value: 'E[417] ∈ ℝᵈ', detail: '선택된 input row만 dense vector가 된다.', tone: 'cyan' },
      { label: 'Prediction', value: 'score = O · E[417]', detail: 'Output table과 비교해 context 분포를 만든다.', tone: 'violet' },
      { label: 'Loss', value: '−log p(위에|매트)', detail: '관측 context가 높아지도록 error를 만든다.', tone: 'red' },
    ],
    callout: 'Embedding은 미리 정해진 의미 좌표가 아니다. Context prediction error를 줄이는 과정에서 lookup row가 얻은 상태다.',
    owner: 'Embedding lookup + predictor',
    output: 'context logits · scalar loss',
    invariant: 'row shape [d], logits shape [|V|]',
  },
  {
    eyebrow: '04 · First changed parameter',
    title: 'Loss의 신호는 선택된 row와 비교에 참여한 output row로 돌아간다',
    body: 'Update의 소유자를 추적하면 비슷한 문맥에 반복해서 등장한 단어가 왜 비슷한 방향으로 이동하는지 보인다.',
    icon: GitBranch,
    layout: 'flow',
    items: [
      { label: 'Error', value: 'p(context) − one_hot', detail: '정답 context와 예측 분포의 차이', tone: 'red' },
      { label: 'Output rows', value: 'O의 비교 방향 수정', detail: 'Context를 가르는 decision geometry가 바뀐다.', tone: 'violet' },
      { label: 'Selected input row', value: 'E[매트] ← E[매트] − ηg', detail: '현재 center row에 gradient가 모인다.', tone: 'gold' },
    ],
    callout: '“비슷한 단어를 가까이 놓아라”라는 직접 label은 없다. 비슷한 prediction constraints가 누적되어 geometry가 간접적으로 생긴다.',
    owner: 'Optimizer',
    output: 'updated E row · updated O rows',
    invariant: 'only participating parameters receive this example',
  },
  {
    eyebrow: '05 · Evidence and historical boundary',
    title: 'Vector geometry는 결과 증거이지 단어 의미의 완전한 정의가 아니다',
    body: '원 논문은 대규모 학습 효율과 syntactic·semantic test를 주장한다. 후속 negative sampling이나 문맥별 다의성 해결까지 소급하지 않는다.',
    icon: FileCheck2,
    layout: 'boundary',
    items: [
      { label: '원 논문이 지지', value: '단순 prediction으로 큰 corpus를 빠르게 학습', detail: 'Similarity와 analogy에서 당시 강한 static word vector를 보고했다.', tone: 'green' },
      { label: '원 논문이 지지하지 않음', value: '1301.3781이 negative sampling까지 제안했다', detail: 'Negative sampling은 후속 논문의 기여이므로 최초 architecture와 분리한다.', tone: 'red' },
      { label: '관찰 가능한 결과', value: '같은 context를 공유한 단어의 가까운 이웃', detail: 'Cosine과 offset은 학습된 table의 geometry를 검사하는 probe다.', tone: 'green' },
      { label: '남는 한계', value: '한 단어당 한 vector로 모든 문맥을 표현', detail: 'Bank 같은 다의어와 corpus bias는 contextual representation으로 넘겨야 한다.', tone: 'red' },
    ],
    callout: '재현 성공 기준은 예쁜 analogy 하나가 아니라 학습 비용, 전체 test, 빈도별 error와 실패 이웃을 함께 기록하는 것이다.',
    owner: 'Evaluation harness',
    output: 'similarity · analogy · failure neighbors',
    invariant: 'architecture claim ≠ later training trick',
  },
];

const longTermScenes: Scene[] = [
  {
    eyebrow: '01 · Unrolled recurrence',
    title: '같은 recurrent transition이 시간만 바꾸어 반복된다',
    body: '현재 loss가 먼 과거 state에 책임을 돌리려면 중간의 모든 transition을 역순으로 통과해야 한다.',
    icon: Network,
    layout: 'flow',
    items: [
      { label: 'Past cause', value: 'xₖ → hₖ', detail: '정답에 필요한 사건', tone: 'gold' },
      { label: 'Shared step', value: 'hₖ₊₁=f(Whₖ+Uxₖ₊₁)', detail: '같은 W가 매 timestep 반복', tone: 'cyan' },
      { label: 'Long delay', value: 'hₖ₊₂ … hₜ', detail: '무관한 입력 사이를 건너야 한다.', tone: 'muted' },
      { label: 'Current loss', value: 'Lₜ', detail: '현재에서야 과거의 책임을 계산', tone: 'red' },
    ],
    callout: 'RNN이 과거를 표현할 수 있다는 사실과 gradient descent가 그 표현을 찾을 수 있다는 사실은 서로 다른 질문이다.',
    owner: 'Unrolled recurrent graph',
    output: 'time-indexed states hₖ…hₜ',
    invariant: 'same transition parameters at every step',
  },
  {
    eyebrow: '02 · Local Jacobian',
    title: '역전파는 한 번의 큰 점프가 아니라 local Jacobian의 연쇄다',
    body: '각 transition이 error의 크기와 방향을 조금씩 바꾼다. 긴 의존성일수록 같은 종류의 변환이 더 많이 곱해진다.',
    icon: Sigma,
    layout: 'flow',
    items: [
      { label: 'Step t', value: 'Jₜ = ∂hₜ/∂hₜ₋₁', detail: '현재 transition의 local sensitivity', tone: 'violet' },
      { label: 'Step t−1', value: 'Jₜ₋₁', detail: '이전 transition의 sensitivity', tone: 'violet' },
      { label: 'Repeat', value: '⋯ × Jₖ₊₁', detail: 'Delay만큼 factor 수 증가', tone: 'muted' },
      { label: 'Credit', value: '∂hₜ/∂hₖ', detail: '과거 state에 도착한 누적 영향', tone: 'gold' },
    ],
    formula: String.raw`\underbrace{G_{k\to t}}_{\text{먼 과거 영향}}=\underbrace{J_tJ_{t-1}\cdots J_{k+1}}_{\text{local 미분의 반복 곱}}`,
    formulaNote: '곱을 쓰는 이유는 chain rule 때문이다. 각 factor가 1에서 조금만 벗어나도 timestep 수가 그 차이를 지수적으로 증폭한다.',
    callout: '문제의 첫 수학 경계는 activation 이름이 아니라 반복 곱의 spectral 크기다.',
    owner: 'Backpropagation through time',
    output: 'ordered Jacobian product',
    invariant: 'credit path includes every intermediate step',
  },
  {
    eyebrow: '03 · Repeated multiplication',
    title: '조금 작은 factor도 반복되면 신호를 거의 0으로 만든다',
    body: '아래 막대는 방향을 단순화한 scalar 예다. 실제 network에서는 singular direction마다 서로 다른 속도로 줄거나 커진다.',
    icon: Gauge,
    layout: 'bars',
    items: [
      { label: '0.8¹', value: '0.800', detail: '한 step에서는 큰 문제처럼 보이지 않는다.', tone: 'cyan', metric: '80' },
      { label: '0.8⁵', value: '0.328', detail: '다섯 번 뒤에는 약 1/3만 남는다.', tone: 'violet', metric: '33' },
      { label: '0.8¹⁰', value: '0.107', detail: '열 번 뒤에는 약 1/10이다.', tone: 'gold', metric: '11' },
      { label: '0.8²⁰', value: '0.012', detail: '스무 번 뒤에는 학습 신호가 거의 보이지 않는다.', tone: 'red', metric: '1.2' },
    ],
    callout: 'Gradient clipping은 너무 큰 값만 자른다. 이미 0에 가까워진 task-relevant 방향을 다시 만들어 주지는 못한다.',
    owner: 'Gradient probe',
    output: 'norm by temporal distance',
    invariant: 'distance is an explicit evaluation axis',
  },
  {
    eyebrow: '04 · Three regimes',
    title: 'Vanishing, 보존, exploding은 같은 곱의 서로 다른 영역이다',
    body: '평균 norm만 보면 일부 방향의 폭발이 다른 방향의 소실을 가릴 수 있으므로 regime을 분리해서 본다.',
    icon: Split,
    layout: 'compare',
    items: [
      { label: '|σ| < 1', value: 'Vanishing', detail: '먼 과거의 credit이 줄어 최근 신호 shortcut을 먼저 학습한다.', tone: 'red', metric: 'decay' },
      { label: '|σ| ≈ 1', value: '보존 경로', detail: '크기는 유지되어도 task-relevant 방향이 보존되는지 추가 검사가 필요하다.', tone: 'green', metric: 'stable' },
      { label: '|σ| > 1', value: 'Exploding', detail: 'Update가 불안정해지고 clipping이 필요한 큰 gradient가 생긴다.', tone: 'gold', metric: 'growth' },
    ],
    callout: '안정적인 norm 하나만으로 장기 기억을 입증할 수 없다. 어느 방향의 정보가 보존됐는지도 확인해야 한다.',
    owner: 'Spectral analysis',
    output: 'decay · stable · growth regimes',
    invariant: 'magnitude and direction reported separately',
  },
  {
    eyebrow: '05 · What the experiment proves',
    title: 'Delay만 늘린 통제 실험이 capacity와 optimization을 분리한다',
    body: 'Hidden size와 data를 고정하고 원인–정답 간격만 늘리면 실패가 temporal credit assignment와 함께 움직이는지 볼 수 있다.',
    icon: FileCheck2,
    layout: 'boundary',
    items: [
      { label: '지지되는 결론', value: '긴 delay가 gradient 학습을 어렵게 만든다', detail: 'Short-term component는 맞추면서 long-term component가 정체되는 패턴이 핵심이다.', tone: 'green' },
      { label: '지지되지 않는 결론', value: '모든 현대 RNN은 장기 의존성을 절대 못 푼다', detail: 'Initialization, normalization, optimizer와 unit 설계가 다른 경우까지 직접 시험하지 않았다.', tone: 'red' },
      { label: '필수 probe', value: 'timestep별 ∥∂L/∂hₖ∥와 성공률', detail: 'Loss 하나만 보면 최근 단서로 푼 shortcut을 장기 기억으로 오해할 수 있다.', tone: 'green' },
      { label: '다음 설계 질문', value: '반복 곱을 additive path로 바꿀 수 있는가', detail: '이 질문이 LSTM의 constant error carousel로 이어진다.', tone: 'red' },
    ],
    callout: '논문의 유산은 “RNN이 나쁘다”가 아니라 forward memory와 backward learnability를 따로 측정하는 습관이다.',
    owner: 'Controlled delay benchmark',
    output: 'success curve · gradient trace',
    invariant: 'only dependency span changes',
  },
];

const lstmScenes: Scene[] = [
  {
    eyebrow: '01 · Candidate signal',
    title: '먼저 쓸 내용을 만들되 아직 memory에는 넣지 않는다',
    body: 'Candidate는 현재 input과 주변 network state가 제안한 내용이다. 저장 여부는 별도 input gate가 결정한다.',
    icon: BrainCircuit,
    layout: 'flow',
    items: [
      { label: 'External input', value: 'x(t)', detail: '현재 관측', tone: 'cyan' },
      { label: 'Candidate', value: 'g(net_c(t))', detail: 'memory에 쓸 수 있는 새 내용', tone: 'violet' },
      { label: 'Write request', value: 'candidate only', detail: '아직 cell state를 바꾸지 않았다.', tone: 'muted' },
    ],
    callout: 'Candidate와 memory state를 같은 값으로 그리면 gate의 존재 이유가 사라진다. 제안과 commit을 분리해 읽어야 한다.',
    owner: 'Cell input transform',
    output: 'candidate value g(net_c)',
    invariant: 'candidate ≠ committed memory',
  },
  {
    eyebrow: '02 · Input gate',
    title: 'Input gate는 무엇을 기억할지보다 언제 쓰기를 허용할지 제어한다',
    body: '같은 candidate라도 gate가 닫히면 기존 memory를 건드리지 않고, 열리면 additive path에 합쳐진다.',
    icon: LockKeyhole,
    layout: 'compare',
    items: [
      { label: 'Gate closed', value: 'yⁱⁿ(t) ≈ 0', detail: 'Candidate를 0에 가깝게 만들어 memory write를 차단한다.', tone: 'red', metric: 'hold' },
      { label: 'Gate open', value: 'yⁱⁿ(t) ≈ 1', detail: 'Candidate가 additive cell update에 거의 그대로 들어간다.', tone: 'green', metric: 'write' },
    ],
    callout: 'Multiplicative gate는 discrete switch가 아니라 differentiable control이다. Training loss가 write timing까지 학습한다.',
    owner: 'Input gate',
    output: 'gated candidate yⁱⁿ·g(net_c)',
    invariant: 'write magnitude is gate-controlled',
  },
  {
    eyebrow: '03 · Constant error carousel',
    title: '기존 state에 새 내용을 더해 error가 지나갈 직선 경로를 만든다',
    body: 'Write가 없을 때 self-loop derivative가 1이 되도록 설계한 것이 1997 LSTM의 핵심이다.',
    icon: Combine,
    layout: 'flow',
    items: [
      { label: 'Previous state', value: 's_c(t−1)', detail: '보존할 memory', tone: 'gold' },
      { label: 'Add write', value: '+ yⁱⁿ(t)g(net_c(t))', detail: '허용된 새 내용만 더한다.', tone: 'cyan' },
      { label: 'New state', value: 's_c(t)', detail: '다음 timestep으로 전달', tone: 'green' },
      { label: 'Backward path', value: '∂s_c(t)/∂s_c(t−1)=1', detail: 'Write가 없을 때 error 크기 보존', tone: 'violet' },
    ],
    formula: String.raw`\underbrace{s_c(t)}_{\text{새 memory}}=\underbrace{s_c(t-1)}_{\text{보존}}+\underbrace{y^{\mathrm{in}}(t)g_t}_{\text{허용된 write}}`,
    formulaNote: '더하기를 쓰는 이유는 이전 state에 대한 미분을 1로 남기기 위해서다. 현대식 fₜsₜ₋₁가 아니라 원 1997 구조의 식이다.',
    callout: 'LSTM의 핵심은 “gate가 많다”가 아니라 반복 곱의 지름길을 additive memory path로 바꾼 설계다.',
    owner: 'CEC memory cell',
    output: 'state s_c(t) · constant error path',
    invariant: 'self-loop derivative = 1 when no write',
  },
  {
    eyebrow: '04 · Output gate',
    title: '저장한 정보와 외부로 읽어 내는 시점을 분리한다',
    body: 'Memory는 유지하되 현재 output에는 숨길 수 있다. Output gate가 cell state의 노출 시점을 학습한다.',
    icon: Eye,
    layout: 'flow',
    items: [
      { label: 'Stored state', value: 's_c(t)', detail: '내부 memory는 계속 보존', tone: 'gold' },
      { label: 'Squash', value: 'h(s_c(t))', detail: '출력 가능한 범위로 변환', tone: 'violet' },
      { label: 'Output gate', value: 'yᵒᵘᵗ(t)', detail: '현재 읽기 허용량', tone: 'cyan' },
      { label: 'Cell output', value: 'y_c(t)', detail: '다른 unit과 loss가 보는 값', tone: 'green' },
    ],
    callout: 'Write와 read를 분리하면 irrelevant input이 memory를 망치는 것과 memory가 너무 일찍 output을 흔드는 것을 따로 제어할 수 있다.',
    owner: 'Output gate',
    output: 'exposed cell output y_c(t)',
    invariant: 'stored state may outlive visible output',
  },
  {
    eyebrow: '05 · Historical boundary',
    title: '1997 LSTM과 오늘날의 3-gate LSTM을 같은 그림으로 덮지 않는다',
    body: '원 논문의 CEC·input/output gate를 먼저 이해한 뒤, continuous stream의 reset 문제를 해결한 후속 forget gate를 붙인다.',
    icon: FileCheck2,
    layout: 'boundary',
    items: [
      { label: '1997 원 기여', value: 'CEC + input gate + output gate', detail: '긴 time lag에서 error를 보존하고 write/read를 제어했다.', tone: 'green' },
      { label: '후속 기여', value: 'Forget gate와 modern update', detail: 'fₜsₜ₋₁는 이후 Gers 계열에서 들어왔으며 원 논문 식에 소급하지 않는다.', tone: 'red' },
      { label: '검증해야 할 것', value: 'delay별 성공률과 ∂L/∂s_c', detail: 'Gate heatmap만 보지 말고 실제 memory 사용과 gradient 보존을 함께 측정한다.', tone: 'green' },
      { label: '남는 한계', value: 'Gate가 있어도 모든 장기 기억이 자동 학습되지는 않음', detail: 'Gate saturation, optimization, capacity와 task alignment는 여전히 실패할 수 있다.', tone: 'red' },
    ],
    callout: '후속 구조를 함께 구현해도 결과표와 설명에서 “original”과 “modern”을 별도 lane으로 유지해야 한다.',
    owner: 'Historical reproduction harness',
    output: 'original-vs-modern comparison',
    invariant: 'forget gate never attributed to 1997 paper',
  },
];

const seq2seqScenes: Scene[] = [
  {
    eyebrow: '01 · Optimization recipe',
    title: 'Source reversal은 번역 규칙이 아니라 dependency path를 줄이는 조작이다',
    body: 'Target의 첫 단어와 대응하는 source 앞부분을 encoder 끝에 가깝게 옮겨 recurrent time lag를 줄인다.',
    icon: Route,
    layout: 'compare',
    items: [
      { label: 'Normal source', value: 'A B C D → c → a b c d', detail: 'Source A와 target a 사이에 encoder 전체와 decoder 시작이 놓인다.', tone: 'red', metric: 'long path' },
      { label: 'Reversed source', value: 'D C B A → c → a b c d', detail: 'A가 final encoder state에 가까워져 초반 대응의 optimization path가 짧다.', tone: 'green', metric: 'short path' },
    ],
    callout: '문장을 뒤집는 것은 언어학적 alignment model이 아니다. Architecture를 바꾸지 않고 계산 graph의 minimal time lag를 줄인 실험 recipe다.',
    owner: 'Source preprocessor',
    output: 'reversed source token IDs',
    invariant: 'target order and labels unchanged',
  },
  {
    eyebrow: '02 · Encoder bottleneck',
    title: '가변 길이 source를 final LSTM state 하나로 압축한다',
    body: 'Encoder는 token을 차례로 읽지만 decoder에 직접 넘기는 것은 마지막 hidden/cell state 묶음뿐이다.',
    icon: Layers3,
    layout: 'flow',
    items: [
      { label: 'Source tokens', value: 'x₁ … x_T', detail: '길이가 매 example마다 다르다.', tone: 'cyan' },
      { label: 'Deep encoder', value: 'LSTM × 4 layers', detail: '순서대로 state를 갱신', tone: 'violet' },
      { label: 'Final state', value: 'c = state_T', detail: '고정 폭 representation', tone: 'gold' },
    ],
    callout: '“고정 vector”는 문장 길이가 고정이라는 뜻이 아니라, 입력 길이와 무관하게 decoder로 넘어가는 interface 폭이 고정이라는 뜻이다.',
    owner: 'Encoder LSTM',
    output: 'layer-wise final hidden/cell states',
    invariant: 'decoder receives fixed-width state packet',
  },
  {
    eyebrow: '03 · Conditional decoder',
    title: 'Decoder는 encoder state와 이전 target prefix로 다음 token을 만든다',
    body: 'BOS에서 시작해 한 token씩 생성하며 EOS가 나오면 가변 길이 output이 끝난다.',
    icon: GitBranch,
    layout: 'flow',
    items: [
      { label: 'Initialize', value: 'decoder state ← c', detail: 'Encoder가 만든 source 조건', tone: 'gold' },
      { label: 'Start', value: '<BOS>', detail: '첫 decoder input', tone: 'cyan' },
      { label: 'Autoregressive step', value: 'p(y_t|y_<t,c)', detail: 'Prefix마다 vocabulary 분포 생성', tone: 'violet' },
      { label: 'Stop', value: '<EOS>', detail: 'Output length를 model이 결정', tone: 'green' },
    ],
    callout: 'Encoder–decoder는 두 모델을 나란히 둔 이름이 아니라 final state가 source condition의 유일한 handoff인 실행 계약이다.',
    owner: 'Decoder LSTM',
    output: 'next-token distributions until EOS',
    invariant: 'every step conditions on c and target prefix',
  },
  {
    eyebrow: '04 · Training objective',
    title: 'Teacher forcing은 정답 prefix로 각 위치의 likelihood를 학습한다',
    body: 'Training에서는 이미 아는 target token을 다음 input으로 넣는다. Inference에서는 model의 이전 예측을 다시 넣는 차이가 생긴다.',
    icon: Sigma,
    layout: 'tokens',
    items: [
      { label: 'input', value: '<BOS>', detail: 't=1', tone: 'cyan' },
      { label: 'target/input', value: 'Je', detail: '정답 y₁', tone: 'gold' },
      { label: 'target/input', value: 'suis', detail: '정답 y₂', tone: 'gold' },
      { label: 'target', value: 'ici', detail: '정답 y₃', tone: 'gold' },
      { label: 'target', value: '<EOS>', detail: '종료', tone: 'green' },
    ],
    formula: String.raw`\underbrace{p(y\mid x)}_{\text{문장 확률}}=\underbrace{\prod_{t=1}^{T'}p(y_t\mid y_{<t},c)}_{\text{위치별 정답 확률의 곱}}`,
    formulaNote: '곱은 chain rule에서 온다. 실제 loss에서는 underflow를 피하고 합으로 최적화하려고 각 확률의 negative log를 더한다.',
    callout: 'Teacher forcing loss가 좋아도 inference에서 잘못 생성한 prefix를 회복하는 능력이 자동 보장되지는 않는다.',
    owner: 'Teacher-forced trainer',
    output: 'token NLL · validation perplexity',
    invariant: 'train prefix source is recorded explicitly',
  },
  {
    eyebrow: '05 · Search and bottleneck boundary',
    title: 'Beam search 개선과 model 개선을 같은 것으로 계산하지 않는다',
    body: '같은 next-token probability에서도 decoding search가 output을 바꾼다. 동시에 긴 source를 final state 하나에 넣는 병목은 그대로 남는다.',
    icon: FileCheck2,
    layout: 'boundary',
    items: [
      { label: '모델이 정의', value: 'prefix별 next-token probability', detail: 'Training objective와 parameter가 만든 conditional distribution이다.', tone: 'green' },
      { label: 'Search가 선택', value: 'greedy 또는 top-k beam prefix', detail: 'Beam width 증가는 더 많은 후보를 찾는 계산이며 model 자체가 바뀐 것은 아니다.', tone: 'red' },
      { label: '논문이 지지', value: 'Source reversal과 deep LSTM의 강한 WMT14 결과', detail: 'Fixed representation이 실제 대규모 translation에서 작동할 수 있음을 보였다.', tone: 'green' },
      { label: '다음 병목', value: '모든 source detail이 c 하나를 통과', detail: 'Bahdanau attention은 h₁…h_T 전체를 남겨 decoder가 매 step 다시 읽게 한다.', tone: 'red' },
    ],
    callout: '재현 표에는 architecture, training probability, decoding algorithm을 세 열로 분리해야 원인을 바르게 비교할 수 있다.',
    owner: 'Decoder search + evaluation',
    output: 'beam hypotheses · BLEU by length',
    invariant: 'search gain ≠ parameter gain',
  },
];

const bahdanauScenes: Scene[] = [
  {
    eyebrow: '01 · Source memory',
    title: 'Final state 하나 대신 source 위치마다 annotation을 남긴다',
    body: 'Bidirectional encoder가 각 위치의 앞·뒤 문맥을 합쳐 hᵢ를 만들고, decoder가 읽을 external memory로 보존한다.',
    icon: Database,
    layout: 'tokens',
    items: [
      { label: 'h₁', value: 'The', detail: '← · → 문맥', tone: 'cyan' },
      { label: 'h₂', value: 'black', detail: '← · → 문맥', tone: 'violet' },
      { label: 'h₃', value: 'cat', detail: '← · → 문맥', tone: 'gold' },
      { label: 'h₄', value: 'sat', detail: '← · → 문맥', tone: 'cyan' },
      { label: 'h₅', value: 'down', detail: '← · → 문맥', tone: 'muted' },
    ],
    callout: '병목 제거의 첫 변화 경계는 score 함수가 아니라 encoder output interface가 c 하나에서 h₁…h_T 배열로 바뀐 것이다.',
    owner: 'Bidirectional encoder',
    output: 'source annotations [B,Tₓ,2h]',
    invariant: 'every non-padding source position remains addressable',
  },
  {
    eyebrow: '02 · Query meets memory',
    title: '이전 decoder state가 지금 필요한 source 위치를 질문한다',
    body: 'Query sₜ₋₁와 각 annotation hᵢ를 같은 alignment space로 투영해 위치별 scalar compatibility를 만든다.',
    icon: ScanSearch,
    layout: 'flow',
    items: [
      { label: 'Current query', value: 'sₜ₋₁', detail: '지금까지 만든 target prefix의 상태', tone: 'gold' },
      { label: 'Source candidate', value: 'hᵢ', detail: 'source 위치 i의 양방향 annotation', tone: 'cyan' },
      { label: 'Additive match', value: 'vₐᵀ tanh(Wₛs+Wₕhᵢ)', detail: '같은 hidden space에서 compatibility 계산', tone: 'violet' },
      { label: 'Scalar score', value: 'eₜᵢ', detail: '아직 위치 간 정규화 전', tone: 'muted' },
    ],
    formula: String.raw`\underbrace{e_{ti}}_{\text{위치 }i\text{의 점수}}=v_a^\top\tanh(\underbrace{W_ss_{t-1}}_{\text{현재 질문}}+\underbrace{W_hh_i}_{\text{source 후보}})`,
    formulaNote: '더한 뒤 tanh와 vₐ로 줄이는 이유는 query와 memory의 상호작용을 학습 가능한 scalar 비교 함수로 만들기 위해서다.',
    callout: 'Score가 크다는 것은 이 target step에서 상대적으로 잘 맞는다는 뜻이지, 해당 source token이 결과의 유일한 원인이라는 뜻은 아니다.',
    owner: 'Alignment network',
    output: 'unnormalized source scores eₜ₁…eₜTₓ',
    invariant: 'one comparable scalar per valid source position',
  },
  {
    eyebrow: '03 · Source-axis softmax',
    title: 'Score를 source 위치 축에서 정규화해 읽기 예산을 배분한다',
    body: 'Padding을 먼저 막고 softmax를 적용해야 실제 source 위치에만 합계 1의 alignment weight가 분배된다.',
    icon: Gauge,
    layout: 'bars',
    items: [
      { label: 'The', value: 'α=0.04', detail: '낮은 compatibility', tone: 'muted', metric: '4' },
      { label: 'black', value: 'α=0.17', detail: '수식어 후보', tone: 'violet', metric: '17' },
      { label: 'cat', value: 'α=0.66', detail: '현재 target과 가장 강한 대응', tone: 'gold', metric: '66' },
      { label: 'sat', value: 'α=0.11', detail: '남은 보조 문맥', tone: 'cyan', metric: '11' },
      { label: '<PAD>', value: 'α=0.00', detail: 'softmax 전에 −∞ mask', tone: 'red', metric: '0' },
    ],
    formula: String.raw`\underbrace{\alpha_{ti}}_{\text{읽기 비율}}=\underbrace{\frac{\exp(e_{ti})}{\sum_j\exp(e_{tj})}}_{\text{source 위치 softmax}}`,
    formulaNote: 'Softmax를 쓰면 모든 weight가 양수이고 합이 1인 differentiable read distribution이 된다. Mask는 분모를 계산하기 전에 적용한다.',
    callout: 'Attention은 한 칸을 hard select하지 않는다. 여러 annotation을 서로 다른 비율로 읽는 soft search다.',
    owner: 'Masked source softmax',
    output: 'alignment weights αₜ· with sum 1',
    invariant: 'padding weight = 0 and valid weights sum to 1',
  },
  {
    eyebrow: '04 · Dynamic context',
    title: 'Target step마다 다른 weighted source context를 만든다',
    body: '같은 source sentence라도 target word가 바뀌면 query, alignment row와 context cₜ가 함께 바뀐다.',
    icon: Combine,
    layout: 'matrix',
    items: [],
    matrix: {
      columns: ['The', 'black', 'cat', 'sat', 'down'],
      rows: [
        { label: 'Le', values: [0.72, 0.11, 0.07, 0.06, 0.04] },
        { label: 'chat', values: [0.03, 0.17, 0.68, 0.08, 0.04] },
        { label: 'noir', values: [0.02, 0.69, 0.17, 0.08, 0.04] },
        { label: 'assis', values: [0.02, 0.05, 0.08, 0.7, 0.15] },
      ],
    },
    formula: String.raw`\underbrace{c_t}_{\text{현재 source 읽기}}=\underbrace{\sum_{i=1}^{T_x}\alpha_{ti}h_i}_{\text{annotation 가중합}}`,
    formulaNote: '가중합은 source memory의 폭을 유지하면서 현재 query에 필요한 내용을 하나의 decoder input으로 모은다.',
    callout: '행이 달라지는 것이 fixed c와의 결정적 차이다. Alignment matrix는 실행 중 생성된 read trace다.',
    owner: 'Attention read',
    output: 'dynamic context cₜ for each decoder step',
    invariant: 'context changes when query changes',
  },
  {
    eyebrow: '05 · Evidence boundary',
    title: 'Alignment heatmap은 유용한 증거지만 완전한 인과 설명은 아니다',
    body: 'Length bucket 성능과 alignment plot은 서로 다른 주장을 검증한다. 둘을 함께 봐야 병목 완화와 해석 가능성을 분리할 수 있다.',
    icon: FileCheck2,
    layout: 'boundary',
    items: [
      { label: '정량 증거', value: '긴 문장에서 성능 저하가 덜 가파름', detail: 'Fixed-vector baseline과 sentence length별 결과를 비교한다.', tone: 'green' },
      { label: '정량 한계', value: '모든 long-context 문제가 해결된 것은 아님', detail: '계산 비용과 더 긴 memory, decoder error는 별도 문제로 남는다.', tone: 'red' },
      { label: '정성 증거', value: '번역 순서와 대응하는 soft alignment', detail: 'Target×source heatmap에서 재배열과 구문 단위 패턴을 본다.', tone: 'green' },
      { label: '정성 한계', value: 'Weight가 결정의 완전한 원인이라는 보장 없음', detail: 'Value, decoder state와 후속 nonlinear layer의 영향도 함께 존재한다.', tone: 'red' },
    ],
    callout: '좋아 보이는 heatmap 한 장 대신 전체 sample, padding mask, length bucket과 translation error를 같은 run에서 보존한다.',
    owner: 'Translation evaluation harness',
    output: 'BLEU by length · full alignment traces',
    invariant: 'alignment evidence ≠ causal completeness',
  },
];

const bertScenes: Scene[] = [
  {
    eyebrow: '01 · Corruption and input packet',
    title: 'Clean 문장을 그대로 복사하지 못하도록 선택 위치만 손상한다',
    body: 'WordPiece token, segment ID와 position ID를 더하고, 선택된 15%만 MLM label을 갖는다.',
    icon: Binary,
    layout: 'tokens',
    items: [
      { label: 'special', value: '[CLS]', detail: 'sentence readout', tone: 'violet' },
      { label: 'clean', value: '고양이는', detail: 'label 없음', tone: 'muted' },
      { label: '80% branch', value: '[MASK]', detail: '원 token=매트', tone: 'gold' },
      { label: 'clean', value: '위에', detail: 'label 없음', tone: 'muted' },
      { label: 'special', value: '[SEP]', detail: 'segment boundary', tone: 'cyan' },
    ],
    callout: '15% selection과 80/10/10 replacement는 다른 확률이다. Label mask는 선택 여부를, input ID는 실제 replacement 결과를 기록한다.',
    owner: 'BERT pretraining collator',
    output: 'input IDs · segment/position IDs · MLM labels',
    invariant: 'loss only on selected 15% positions',
  },
  {
    eyebrow: '02 · Deep bidirectional encoder',
    title: '가려진 위치가 모든 layer에서 왼쪽과 오른쪽 문맥을 함께 읽는다',
    body: 'Causal mask를 쓰지 않는 Transformer encoder이므로 [MASK] query의 score 행은 양쪽의 유효 token을 모두 볼 수 있다.',
    icon: Network,
    layout: 'matrix',
    items: [],
    matrix: {
      columns: ['CLS', '고양이', 'MASK', '위에', 'SEP'],
      rows: [
        { label: 'CLS', values: [0.28, 0.2, 0.17, 0.19, 0.16] },
        { label: '고양이', values: [0.08, 0.35, 0.22, 0.27, 0.08] },
        { label: 'MASK', values: [0.05, 0.38, 0.08, 0.41, 0.08] },
        { label: '위에', values: [0.06, 0.28, 0.28, 0.31, 0.07] },
        { label: 'SEP', values: [0.2, 0.17, 0.18, 0.2, 0.25] },
      ],
    },
    callout: '“Bidirectional”은 forward RNN과 backward RNN을 합친다는 뜻이 아니다. 같은 encoder layer의 self-attention이 양쪽 위치를 동시에 조건으로 쓴다는 뜻이다.',
    owner: 'Transformer encoder stack',
    output: 'contextual states [B,N,H]',
    invariant: 'padding blocked · future tokens visible',
  },
  {
    eyebrow: '03 · Original pretraining objectives',
    title: '원 BERT는 token 복원과 sentence-pair 판정을 함께 학습한다',
    body: 'MLM은 선택 위치의 vocabulary를, NSP는 [CLS]에서 B가 A의 실제 다음 문장인지 판정한다.',
    icon: Split,
    layout: 'compare',
    items: [
      { label: 'Masked LM', value: '매트 vocabulary 복원', detail: '선택된 token 위치에만 cross entropy를 계산한다.', tone: 'gold', metric: 'token loss' },
      { label: 'Next sentence prediction', value: 'IsNext / NotNext', detail: '[CLS] state로 sentence-pair binary label을 예측한다.', tone: 'cyan', metric: 'pair loss' },
    ],
    formula: String.raw`\underbrace{\mathcal L}_{\text{원 BERT loss}}=\underbrace{\mathcal L_{\mathrm{MLM}}}_{\text{token 복원}}+\underbrace{\mathcal L_{\mathrm{NSP}}}_{\text{문장쌍 판정}}`,
    formulaNote: '두 loss를 더해 같은 encoder를 공동 update한다. 후속 모델이 NSP를 제거했으므로 이 합은 BERT 계열 전체의 필수 조건이 아니다.',
    callout: '원 논문의 objective를 재현하는 것과 “현대 encoder pretraining의 최선”을 주장하는 것은 다른 일이다.',
    owner: 'MLM head + NSP head',
    output: 'two losses · shared encoder gradients',
    invariant: 'objective contributions logged separately',
  },
  {
    eyebrow: '04 · Fine-tuning interface',
    title: '같은 pretrained encoder에서 task가 읽는 위치와 head만 바꾼다',
    body: 'Backbone을 얼리는 feature extraction이 아니라 작은 output head와 encoder 전체를 함께 update하는 것이 원 fine-tuning recipe다.',
    icon: Layers3,
    layout: 'flow',
    items: [
      { label: 'Pretrained encoder', value: 'BERT parameters', detail: 'MLM+NSP로 얻은 초기값', tone: 'gold' },
      { label: 'Sentence task', value: '[CLS] → classifier', detail: 'GLUE·SWAG', tone: 'violet' },
      { label: 'Token task', value: 'h₁…h_N → labels', detail: 'NER 같은 위치별 예측', tone: 'cyan' },
      { label: 'Span task', value: 'start/end heads', detail: 'SQuAD answer boundary', tone: 'green' },
    ],
    callout: '“Head 하나만 붙인다”는 architecture가 작다는 뜻이다. Training 때 encoder parameter까지 함께 움직인다는 계약을 빼면 BERT fine-tuning을 다르게 구현하게 된다.',
    owner: 'Downstream fine-tuner',
    output: 'task logits · updated backbone',
    invariant: 'head input position and shape declared',
  },
  {
    eyebrow: '05 · Transfer evidence boundary',
    title: '여러 task의 강한 결과는 범용 전이를 지지하지만 각 recipe의 필수성까지 증명하지 않는다',
    body: 'GLUE, SQuAD, SWAG의 서로 다른 output 구조에서 같은 backbone이 작동한 것이 핵심 증거다.',
    icon: FileCheck2,
    layout: 'boundary',
    items: [
      { label: '지지되는 결론', value: 'Deep bidirectional pretraining은 여러 NLP task에 전이된다', detail: 'Task-specific architecture 변경을 줄이면서 당시 강한 결과를 냈다.', tone: 'green' },
      { label: '지지되지 않는 결론', value: 'NSP가 모든 후속 encoder에 반드시 필요하다', detail: '원 ablation만으로 필수성을 확정하지 못했고 후속 RoBERTa가 recipe를 바꿨다.', tone: 'red' },
      { label: '재현 증거', value: 'MLM/NSP curve + task별 multi-seed 결과', detail: '작은 dataset의 learning-rate·seed 민감도를 함께 기록한다.', tone: 'green' },
      { label: '남는 한계', value: '[CLS]가 바로 좋은 sentence similarity vector는 아님', detail: 'Pretraining objective와 pooling 목적이 cosine retrieval에 직접 맞춰진 것은 아니다.', tone: 'red' },
    ],
    callout: 'BERT 이후 논문은 data, objective, parameter sharing, pooling 중 무엇을 바꿨는지 이 경계표에 한 축씩 추가해 읽는다.',
    owner: 'Transfer evaluation harness',
    output: 'task metrics · ablations · seed spread',
    invariant: 'transfer success ≠ every recipe choice is necessary',
  },
];

const scenesByPaper: Record<PaperKind, Scene[]> = {
  word2vec: word2vecScenes,
  'long-term': longTermScenes,
  lstm: lstmScenes,
  seq2seq: seq2seqScenes,
  bahdanau: bahdanauScenes,
  bert: bertScenes,
};

const accentByPaper: Record<PaperKind, string> = {
  word2vec: colors.gold,
  'long-term': colors.red,
  lstm: colors.green,
  seq2seq: colors.violet,
  bahdanau: colors.cyan,
  bert: colors.gold,
};

function NlpPaperMechanismViz({ paper }: { paper: PaperKind }) {
  const scenes = scenesByPaper[paper];
  const steps: StepDef[] = scenes.map((scene) => ({ label: scene.title, body: scene.body }));
  return (
    <div
      data-nlp-paper-viz={paper}
      className="not-prose min-w-0 [&_.step-viz]:my-8 [&_.step-viz__stage]:min-h-[300px] sm:[&_.step-viz__stage]:min-h-[390px]"
      style={{ '--viz-accent': accentByPaper[paper] } as CSSProperties}
    >
      <StepViz steps={steps} stageClassName="items-stretch">
        {(step) => <SceneView scene={scenes[step]} />}
      </StepViz>
    </div>
  );
}

export function Word2VecMechanismViz() {
  return <NlpPaperMechanismViz paper="word2vec" />;
}

export function LongTermGradientMechanismViz() {
  return <NlpPaperMechanismViz paper="long-term" />;
}

export function LstmMechanismViz() {
  return <NlpPaperMechanismViz paper="lstm" />;
}

export function Seq2SeqMechanismViz() {
  return <NlpPaperMechanismViz paper="seq2seq" />;
}

export function BahdanauMechanismViz() {
  return <NlpPaperMechanismViz paper="bahdanau" />;
}

export function BertMechanismViz() {
  return <NlpPaperMechanismViz paper="bert" />;
}
