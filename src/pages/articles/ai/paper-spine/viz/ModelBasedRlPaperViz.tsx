import type { CSSProperties, ReactNode } from 'react';
import {
  Activity,
  ArrowDown,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  CircleDot,
  CloudCog,
  Database,
  Eye,
  FileCheck2,
  Gauge,
  GitBranch,
  Layers3,
  Network,
  RefreshCw,
  Search,
  ShieldAlert,
  Sparkles,
  TreePine,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import FormulaNote from '@/components/ui/formula-note';
import Math from '@/components/ui/math';
import StepViz from '@/components/ui/step-viz';

type Tone = 'gold' | 'cyan' | 'violet' | 'green' | 'red' | 'muted';
type Layout = 'flow' | 'compare' | 'bars' | 'tree' | 'timeline' | 'boundary';
type PaperKind = 'dyna' | 'world-models' | 'muzero' | 'dreamerv3';

export interface PaperMechanismItem {
  label: string;
  value: string;
  detail: string;
  tone?: Tone;
  metric?: string;
}

export interface PaperMechanismScene {
  eyebrow: string;
  title: string;
  body: string;
  icon: LucideIcon;
  layout: Layout;
  items: PaperMechanismItem[];
  visual?: ReactNode;
  callout: string;
  owner: string;
  output: string;
  invariant: string;
  formula?: string;
  formulaCompact?: string;
  formulaNote?: string;
  formulaSymbols?: [string, string][];
}

type Item = PaperMechanismItem;
type Scene = PaperMechanismScene;

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
        <h4 className="mt-1 break-words text-base font-black leading-snug [overflow-wrap:anywhere] sm:text-lg">
          {title}
        </h4>
        <p className="mt-2 max-w-3xl break-words text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere] sm:text-sm sm:leading-6">
          {body}
        </p>
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

function ItemBlock({
  item,
  index,
  compact = false,
}: {
  item: Item;
  index: number;
  compact?: boolean;
}) {
  const tone = item.tone ?? 'muted';
  return (
    <motion.div
      initial={{ opacity: 0, y: 7 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className={`min-w-0 rounded-md border border-border bg-background ${compact ? 'p-3' : 'p-3 sm:p-4'}`}
    >
      <div className="flex min-w-0 items-start gap-2">
        <span className="shrink-0 font-mono text-[11px] font-black text-muted-foreground">
          {String(index + 1).padStart(2, '0')}
        </span>
        <CircleDot className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: colors[tone] }} aria-hidden="true" />
        <span className="min-w-0 break-words font-mono text-[11px] font-black uppercase leading-4 text-muted-foreground [overflow-wrap:anywhere]">
          {item.label}
        </span>
      </div>
      {item.metric ? (
        <span
          className="mt-2 block break-words font-mono text-[11px] font-black leading-4 [overflow-wrap:anywhere]"
          style={{ color: colors[tone] }}
        >
          {item.metric}
        </span>
      ) : null}
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
            <ItemBlock item={item} index={index} />
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
          <ItemBlock item={item} index={index} />
        </div>
      ))}
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
            className="grid min-w-0 grid-cols-[4.25rem_minmax(0,1fr)_4.75rem] items-start gap-2 sm:grid-cols-[8rem_minmax(0,1fr)_6rem]"
            key={`${item.label}-${item.value}`}
          >
            <span className="break-words font-mono text-[11px] font-black leading-5 text-muted-foreground [overflow-wrap:anywhere]">
              {item.label}
            </span>
            <div className="min-w-0 pt-1.5">
              <div className="h-2 overflow-hidden rounded-full bg-border/70">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${width}%` }}
                  transition={{ duration: 0.42, delay: 0.08 + index * 0.07 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: colors[tone] }}
                />
              </div>
              <p className="mt-2 break-words text-[11px] leading-5 text-muted-foreground [overflow-wrap:anywhere]">
                {item.detail}
              </p>
            </div>
            <strong
              className="break-words pt-0.5 font-mono text-[11px] leading-5 sm:text-right sm:text-xs [overflow-wrap:anywhere]"
              style={{ color: colors[tone] }}
            >
              {item.value}
            </strong>
          </motion.div>
        );
      })}
    </div>
  );
}

function TimelineLayout({ items }: { items: Item[] }) {
  return (
    <ol className="grid min-w-0 grid-cols-2 items-stretch gap-2 sm:grid-cols-4 sm:gap-3">
      {items.map((item, index) => {
        const tone = item.tone ?? 'muted';
        return (
          <motion.li
            initial={{ opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07 }}
            className="relative flex min-w-0 flex-col"
            key={`${item.label}-${item.value}`}
          >
            <span
              className="relative z-10 ml-3 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card font-mono text-[11px] font-black"
              style={{ color: colors[tone] }}
            >
              {index + 1}
            </span>
            <div className="-mt-2 min-w-0 flex-1 rounded-md border border-border bg-background p-3 pt-5">
              <p className="break-words font-mono text-[11px] font-black uppercase leading-4 text-muted-foreground [overflow-wrap:anywhere]">
                {item.label}
              </p>
              <p className="mt-2 break-words text-sm font-black leading-5 [overflow-wrap:anywhere]">{item.value}</p>
              <p className="mt-2 break-words text-[11px] leading-5 text-muted-foreground [overflow-wrap:anywhere]">
                {item.detail}
              </p>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}

function TreeLayout({ items }: { items: Item[] }) {
  const [root, ...branches] = items;
  return (
    <div className="min-w-0">
      <div className="mx-auto max-w-sm">
        <ItemBlock item={root} index={0} compact />
      </div>
      <div className="mx-auto h-5 w-px bg-border" aria-hidden="true" />
      <div className="mx-auto h-px w-2/3 bg-border" aria-hidden="true" />
      <div className="grid min-w-0 grid-cols-3 gap-2 pt-3 sm:gap-3">
        {branches.map((item, index) => (
          <div className="relative min-w-0 before:absolute before:-top-3 before:left-1/2 before:h-3 before:w-px before:bg-border" key={`${item.label}-${item.value}`}>
            <ItemBlock item={item} index={index + 1} compact />
          </div>
        ))}
      </div>
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
            className="min-w-0 rounded-md border border-border bg-background p-3 sm:p-4"
            key={`${item.label}-${item.value}`}
          >
            <div className="flex min-w-0 items-center gap-2">
              <Icon className="h-4 w-4 shrink-0" style={{ color: colors[tone] }} aria-hidden="true" />
              <span className="break-words font-mono text-[11px] font-black uppercase leading-4 text-muted-foreground [overflow-wrap:anywhere]">
                {item.label}
              </span>
            </div>
            <p className="mt-3 break-words text-sm font-black leading-5 [overflow-wrap:anywhere]">{item.value}</p>
            <p className="mt-2 break-words text-[11px] leading-5 text-muted-foreground [overflow-wrap:anywhere]">
              {item.detail}
            </p>
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
  else if (scene.layout === 'bars') visual = <BarsLayout items={scene.items} />;
  else if (scene.layout === 'tree') visual = <TreeLayout items={scene.items} />;
  else if (scene.layout === 'timeline') visual = <TimelineLayout items={scene.items} />;
  else visual = <BoundaryLayout items={scene.items} />;
  const sceneVisual = scene.visual ?? visual;

  return (
    <div className="min-w-0">
      <SceneTitle icon={scene.icon} eyebrow={scene.eyebrow} title={scene.title} body={scene.body} />
      <div className="mt-5 min-w-0">{sceneVisual}</div>
      {scene.formula ? (
        scene.formulaSymbols ? (
          <div className="mt-5 min-w-0">
            <div className="rounded-md border border-border bg-background px-3 py-2 sm:px-4">
              {scene.formulaCompact ? (
                <>
                  <Math display minScale={0.82} className="lg:hidden">{scene.formulaCompact}</Math>
                  <Math display minScale={0.82} className="hidden lg:block">{scene.formula}</Math>
                </>
              ) : (
                <Math display minScale={0.82}>{scene.formula}</Math>
              )}
            </div>
            {scene.formulaNote ? (
              <FormulaNote meaning={scene.formulaNote} symbols={scene.formulaSymbols} />
            ) : null}
          </div>
        ) : (
          <div className="mt-5 min-w-0 rounded-md border border-border bg-background px-3 py-2 sm:px-4">
            {scene.formulaCompact ? (
              <>
                <Math display minScale={0.82} className="lg:hidden">{scene.formulaCompact}</Math>
                <Math display minScale={0.82} className="hidden lg:block">{scene.formula}</Math>
              </>
            ) : (
              <Math display minScale={0.82}>{scene.formula}</Math>
            )}
            {scene.formulaNote ? <FormulaNote meaning={scene.formulaNote} /> : null}
          </div>
        )
      ) : null}
      <div className="mt-5 flex min-w-0 items-start gap-3 border-l-2 border-foreground/60 pl-3">
        <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <p className="break-words text-xs font-semibold leading-5 [overflow-wrap:anywhere]">{scene.callout}</p>
      </div>
      <Receipt owner={scene.owner} output={scene.output} invariant={scene.invariant} />
    </div>
  );
}

const dynaScenes: Scene[] = [
  {
    eyebrow: '01 · Real interaction',
    title: '환경은 한 번만 움직이고, 그 한 번이 모든 update의 기준점이 된다',
    body: '현재 Q로 action을 고른 뒤 실제 reward와 next state를 관측한다. 이 전이만이 model의 예측이 아니라 바깥 세계에서 온 사실이다.',
    icon: Activity,
    layout: 'flow',
    items: [
      { label: '현재 상태', value: 'state s', detail: 'Agent가 지금 관측한 위치', tone: 'cyan' },
      { label: '반응 정책', value: 'action a ← Q(s,·)', detail: 'Planning을 기다리지 않고 즉시 선택', tone: 'gold' },
      { label: '실제 환경', value: 'env.step(a)', detail: '비용이 드는 real interaction', tone: 'violet' },
      { label: '관측 사실', value: 'reward r · next s′', detail: '직접 update와 model fit이 공유', tone: 'green' },
    ],
    callout: 'Dyna에서 “reacting”은 매 행동 전에 긴 plan을 완성한다는 뜻이 아니다. 현재 Q가 바로 action을 내고 planning은 그 Q를 사이사이 개선한다.',
    owner: 'Environment interaction',
    output: 'real tuple (s,a,r,s′)',
    invariant: 'real and predicted tuples stay distinguishable',
  },
  {
    eyebrow: '02 · Direct learning',
    title: '실제 전이는 기다리지 않고 Q에 한 번 직접 반영한다',
    body: '현재 estimate와 한 단계 뒤의 bootstrap target 차이가 TD error다. 이 시점에는 learned model이 아직 개입하지 않는다.',
    icon: GitBranch,
    layout: 'flow',
    items: [
      { label: '현재 추정', value: 'Q(s,a)', detail: 'Action 전의 value', tone: 'muted' },
      { label: '실제 표적', value: 'r + γ max Q(s′,a′)', detail: '실제 r와 s′로 계산', tone: 'green' },
      { label: '오차', value: 'δreal = target − Q', detail: '이번 경험이 준 수정 방향', tone: 'red' },
      { label: '갱신', value: 'Q ← Q + αδreal', detail: '다음 반응 정책에 즉시 사용', tone: 'gold' },
    ],
    formula: String.raw`\underbrace{Q(s,a)}_{\text{현재 값}}\leftarrow Q(s,a)+\alpha\underbrace{\left[r+\gamma\max_{a'}Q(s',a')-Q(s,a)\right]}_{\text{실제 전이의 오차}}`,
    formulaNote: '오차 안의 r과 s′는 환경에서 직접 왔다. 뒤의 planning 식과 모양은 같지만 전이의 출처가 다르다.',
    callout: 'Direct learning을 model learning과 합치지 않는다. Q는 “어떤 action이 좋은가”를, model은 “action 뒤에 무엇이 일어나는가”를 배운다.',
    owner: 'Value learner',
    output: 'updated reactive Q',
    invariant: 'target uses observed r and s′',
  },
  {
    eyebrow: '03 · Model acquisition',
    title: '같은 실제 전이로 별도의 world model을 고친다',
    body: 'Model은 state–action을 넣었을 때 reward와 next state를 돌려주는 내부 환경이다. Tabular 예에서는 관측 결과를 저장하지만 일반화된 model은 분포를 학습해야 한다.',
    icon: Database,
    layout: 'compare',
    items: [
      { label: 'Value memory', value: 'Q(s,a)', detail: '행동 선택을 위한 장기 return estimate', tone: 'gold', metric: '무엇을 할까?' },
      { label: 'World model', value: 'M(s,a) → (r̂,ŝ′)', detail: '한 action 뒤의 local consequence estimate', tone: 'cyan', metric: '무슨 일이 날까?' },
      { label: '새 증거', value: '(r,s′)로 M 수정', detail: '환경 변화가 생기면 model부터 새 관측을 받아야 한다.', tone: 'green', metric: '사실로 교정' },
    ],
    formula: String.raw`\underbrace{(\widehat r,\widehat s')=M_\psi(s,a)}_{\text{내부 예측}}\qquad \underbrace{M_\psi\leftarrow\operatorname{fit}(s,a,r,s')}_{\text{실제 관측으로 교정}}`,
    formulaNote: '왼쪽은 model을 사용하는 방향이고 오른쪽은 model을 배우는 방향이다. 예측값과 실제 target을 변수 이름부터 분리한다.',
    callout: 'Model이 있다는 말은 model이 맞다는 말이 아니다. Planning 양을 늘리기 전에 real prediction error와 마지막 갱신 시점을 함께 기록해야 한다.',
    owner: 'Transition/reward model',
    output: 'queryable M(s,a)',
    invariant: 'model target comes only from real tuples',
  },
  {
    eyebrow: '04 · Incremental planning',
    title: 'Model이 만든 가상 전이를 같은 Q updater에 n번 통과시킨다',
    body: 'Planning은 별도의 symbolic route solver가 아니다. 이미 본 state–action을 꺼내 내부 model에 물어보고, 나온 가상 전이로 같은 TD backup을 반복한다.',
    icon: RefreshCw,
    layout: 'timeline',
    items: [
      { label: '표본 선택', value: '과거 (s,a) sample', detail: 'Model에 기록된 state–action 중 하나', tone: 'muted' },
      { label: '내부 상상', value: 'M(s,a) → (r̂,ŝ′)', detail: '환경을 움직이지 않는 simulated tuple', tone: 'cyan' },
      { label: '같은 backup', value: 'δmodel 계산', detail: 'Direct update와 같은 Q-learning rule', tone: 'violet' },
      { label: 'n회 반복', value: 'Q를 더 멀리 전파', detail: 'Real sample 하나당 추가 compute 사용', tone: 'gold' },
    ],
    formula: String.raw`\underbrace{Q(s,a)}_{\text{같은 Q}}\leftarrow Q(s,a)+\alpha\underbrace{\left[\widehat r+\gamma\max_{a'}Q(\widehat s',a')-Q(s,a)\right]}_{\text{model이 만든 오차}}`,
    formulaNote: '장면 2와 update 함수는 같다. 모자 표시가 붙은 reward·next state만 learned model에서 왔다는 뜻이다.',
    callout: 'Dyna의 재사용 단위는 저장된 return이 아니라 model이 다시 생성한 transition이다. 그래서 model이 오래되면 같은 updater가 틀린 사실을 빠르게 퍼뜨릴 수 있다.',
    owner: 'Planning scheduler + shared updater',
    output: 'n simulated TD backups',
    invariant: 'imagined source remains explicit',
  },
  {
    eyebrow: '05 · Compute–bias boundary',
    title: 'Planning을 늘리면 sample efficiency와 model bias가 함께 커진다',
    body: '정확한 model에서는 더 많은 backup이 실제 interaction을 아끼지만, 환경이 바뀌거나 model이 틀리면 오래된 경로를 더 확신하게 만들 수 있다.',
    icon: ShieldAlert,
    layout: 'boundary',
    items: [
      { label: '원 논문이 지지', value: 'Learning·planning·reacting의 incremental 통합', detail: 'Model을 완성할 때까지 멈추지 않고 실제와 가상 update를 교차할 수 있다.', tone: 'green' },
      { label: '원 논문이 지지하지 않음', value: 'Planning n을 키우면 언제나 더 안전하고 빠르다', detail: 'Model error와 stale transition은 같은 횟수만큼 증폭될 수 있다.', tone: 'red' },
      { label: '필수 측정', value: 'Real steps와 total backups를 따로 기록', detail: 'Interaction 절감과 계산량 증가를 한 성능 숫자로 숨기지 않는다.', tone: 'green' },
      { label: '변화 감지', value: 'Model age · prediction error · route recovery', detail: '환경 변경 뒤 model과 Q가 각각 언제 교정되는지 본다.', tone: 'red' },
    ],
    callout: '핵심 transfer 문제는 “n=50이 n=0보다 빠른가”가 아니라, 같은 compute와 model error 조건에서 실제 interaction을 얼마나 줄였는가다.',
    owner: 'Evaluation harness',
    output: 'sample-efficiency · compute · bias traces',
    invariant: 'more planning is not assumed better',
  },
];

const worldModelsScenes: Scene[] = [
  {
    eyebrow: '01 · Vision model V',
    title: 'Pixel frame 전체를 제어기에 주기 전에 작은 latent z로 압축한다',
    body: 'VAE는 task reward가 아니라 frame reconstruction으로 배운다. 따라서 보기 좋은 복원이 control에 필요한 작은 단서까지 보존한다는 보장은 별도 검증 대상이다.',
    icon: Eye,
    layout: 'flow',
    items: [
      { label: '관측', value: 'frame xₜ · 64×64×3', detail: '환경에서 수집한 고차원 image', tone: 'cyan' },
      { label: 'Encoder', value: 'qφ(zₜ|xₜ)', detail: '평균·분산에서 stochastic code sample', tone: 'violet' },
      { label: '압축 상태', value: 'zₜ ∈ ℝ³²', detail: 'Controller와 memory가 읽는 좌표', tone: 'gold' },
      { label: 'Decoder check', value: 'x̂ₜ ← pφ(x|zₜ)', detail: 'Spatial information 보존 여부 검사', tone: 'green' },
    ],
    formula: String.raw`\underbrace{x_t}_{\text{실제 화면}}\xrightarrow{\ q_\phi\ }\underbrace{z_t}_{\text{압축 상태}}\xrightarrow{\ p_\phi\ }\underbrace{\widehat x_t}_{\text{복원 화면}}`,
    formulaNote: 'V는 한 시점의 공간 정보를 압축한다. 다음 시점 예측과 reward 최적화는 아직 이 장면의 책임이 아니다.',
    callout: '첫 loss 경계는 reconstruction이다. z가 control state처럼 보이더라도 이 단계에서 reward label은 들어오지 않는다.',
    owner: 'VAE vision model V',
    output: 'latent zₜ · reconstruction x̂ₜ',
    invariant: 'V loss and controller reward stay separate',
  },
  {
    eyebrow: '02 · Memory model M',
    title: 'MDN-RNN은 action과 history를 보고 다음 latent의 하나가 아닌 분포를 낸다',
    body: '같은 장면과 action에서도 여러 미래가 가능하므로 deterministic 평균 frame 대신 Gaussian mixture parameter를 예측한다.',
    icon: Network,
    layout: 'flow',
    items: [
      { label: '현재 표현', value: 'zₜ', detail: 'V가 압축한 현재 frame', tone: 'gold' },
      { label: '행동·기억', value: 'aₜ · hₜ', detail: '어떤 조작을 했고 무엇을 기억하는지', tone: 'cyan' },
      { label: 'Mixture head', value: 'π, μ, σ', detail: '가능한 다음 latent들의 확률 모수', tone: 'violet' },
      { label: '다음 표본', value: 'zₜ₊₁ ~ pψ', detail: 'Dream rollout에서 실제로 sample', tone: 'green' },
    ],
    formula: String.raw`\begin{aligned}\underbrace{p_\psi(z_{t+1}\mid z_t,a_t,h_t)}_{\text{다음 latent 분포}}\\[0.35em]=\sum_k\underbrace{\pi_k}_{\text{경로 확률}}\mathcal N\!\left(z_{t+1};\mu_k,\sigma_k^2\right)\end{aligned}`,
    formulaNote: 'Mixture를 쓰는 이유는 가능한 미래를 평균 하나로 뭉개지 않기 위해서다. Temperature는 이 분포에서 얼마나 다양하게 sample할지 바꾼다.',
    callout: 'M의 hidden state h는 예측에 필요한 시간 정보를 요약한다. Predicted zₜ₊₁ 자체를 controller에 직접 넣는 구조와 혼동하지 않는다.',
    owner: 'MDN-RNN memory model M',
    output: 'hₜ₊₁ · next-latent mixture',
    invariant: 'M models latent dynamics, not task return',
  },
  {
    eyebrow: '03 · Compact controller C',
    title: '행동은 현재 z와 predictive memory h를 읽는 작은 선형 제어기가 낸다',
    body: '거대한 표현 학습은 V와 M에 두고, task reward를 직접 최적화하는 parameter는 의도적으로 작게 만든다.',
    icon: BrainCircuit,
    layout: 'compare',
    items: [
      { label: '현재 감각', value: 'zₜ', detail: '지금 무엇이 보이는가', tone: 'gold', metric: 'spatial' },
      { label: '예측 기억', value: 'hₜ', detail: '과거와 가능한 미래가 무엇인가', tone: 'cyan', metric: 'temporal' },
      { label: '작은 policy', value: 'aₜ=Wc[zₜ;hₜ]+bc', detail: '논문 CarRacing controller는 867 parameters', tone: 'green', metric: 'task-specific' },
    ],
    formula: String.raw`\underbrace{a_t}_{\text{실행 행동}}=\underbrace{W_c[z_t;h_t]+b_c}_{\text{작은 선형 제어기}}`,
    formulaNote: 'C는 next latent prediction을 직접 읽지 않는다. 현재 z와 그 예측 정보를 품은 recurrent hidden h를 결합한다.',
    callout: 'V와 M은 backpropagation으로, C는 CMA-ES로 학습된다. “한 world model”이라는 표현 아래 optimizer와 target을 합쳐 쓰면 재구현이 틀어진다.',
    owner: 'Controller C · CMA-ES',
    output: 'environment action aₜ',
    invariant: 'C parameters are separate from V and M',
  },
  {
    eyebrow: '04 · Dream training',
    title: '실제 frame 없이 M을 반복 sample해 controller의 가상 episode를 만든다',
    body: 'Dream 안에서는 z와 h가 다음 z와 h를 낳고 C가 다시 action을 낸다. Controller는 이 generated environment의 cumulative reward로 진화한다.',
    icon: CloudCog,
    layout: 'timeline',
    items: [
      { label: '초기 상태', value: 'z₀ · h₀', detail: '실제 sequence에서 seed하거나 초기화', tone: 'gold' },
      { label: '행동', value: 'aₜ ← C(zₜ,hₜ)', detail: '작은 controller가 결정', tone: 'cyan' },
      { label: '가상 전이', value: 'zₜ₊₁ ~ Mτ', detail: 'Temperature τ로 불확실성 조절', tone: 'violet' },
      { label: '진화 선택', value: 'CMA-ES ← dream return', detail: '높은 가상 return의 parameter를 남김', tone: 'green' },
    ],
    callout: 'Dream rollout은 학습 data를 공짜로 늘리지만, real dynamics를 새로 관측하지 않는다. Model artifact를 반복 방문해 얻은 보상도 dream에서는 성공으로 보일 수 있다.',
    owner: 'Generated environment + CMA-ES',
    output: 'dream-optimized controller',
    invariant: 'dream return never relabeled as real return',
  },
  {
    eyebrow: '05 · Transfer evidence',
    title: '최종 판정은 dream 점수가 아니라 real environment로 옮겼을 때의 성능이다',
    body: 'Temperature가 너무 낮으면 controller가 model의 빈틈을 암기하고, 더 noisy한 dream은 일부 exploitation을 줄일 수 있다. 그러나 uncertainty calibration의 일반 해법은 아니다.',
    icon: FileCheck2,
    layout: 'boundary',
    items: [
      { label: '원 논문이 지지', value: 'Compressed stochastic world 안에서 policy를 학습해 transfer 가능', detail: 'VizDoom에서 generated environment only training의 가능성을 보였다.', tone: 'green' },
      { label: '원 논문이 지지하지 않음', value: '높은 dream return이면 실제 환경에서도 안전하다', detail: 'Model flaw exploitation이 직접 관찰되어 real rollout 검증이 필수다.', tone: 'red' },
      { label: '비교할 값', value: 'Dream return ↔ real return gap', detail: 'Temperature·seed·rollout depth별로 두 축을 함께 그린다.', tone: 'green' },
      { label: '남는 위험', value: 'Task signal loss · compounding latent error', detail: '좋은 한-step reconstruction이 closed-loop fidelity를 보장하지 않는다.', tone: 'red' },
    ],
    callout: '이 논문의 핵심은 “꿈만으로 언제나 학습된다”가 아니라, model의 표현·기억·제어 책임을 분리하고 transfer gap을 실험 대상으로 만든 데 있다.',
    owner: 'Real-environment evaluation',
    output: 'dream/real return gap · failure frames',
    invariant: 'transfer closes the claim',
  },
];

const muZeroScenes: Scene[] = [
  {
    eyebrow: '01 · Root representation',
    title: '실제 관측 history는 탐색을 시작할 root latent 하나로 바뀐다',
    body: 'Representation h는 board나 pixel의 복사본을 만들라는 target을 받지 않는다. 이후 reward·policy·value를 맞추는 데 유용한 hidden state를 만든다.',
    icon: Layers3,
    layout: 'flow',
    items: [
      { label: '실제 history', value: 'o₁ … oₜ', detail: 'Atari에서는 최근 관측 묶음', tone: 'cyan' },
      { label: 'Representation h', value: 's⁰=hθ(o₁:ₜ)', detail: 'Search 시작점으로 encode', tone: 'gold' },
      { label: 'Root prediction', value: 'p⁰ · v⁰', detail: '초기 prior와 value', tone: 'violet' },
      { label: '탐색 준비', value: 'root node', detail: '여기부터 실제 환경 없이 action을 펼침', tone: 'green' },
    ],
    formula: String.raw`\underbrace{o_{1:t}}_{\text{실제 관측}}\xrightarrow{\ h_\theta\ }\underbrace{s^0}_{\text{탐색 root latent}}`,
    formulaNote: 'h가 바꾸는 것은 observation history의 표현이다. 원래 화면을 decoder로 복원하는 loss는 없다.',
    callout: 'MuZero에서 real observation을 읽는 곳은 root representation이다. Tree 아래의 hidden state는 실제 다음 frame을 다시 encode한 값이 아니다.',
    owner: 'Representation network h',
    output: 'root latent state s⁰',
    invariant: 'only root sees real observation history',
  },
  {
    eyebrow: '02 · Learned search dynamics',
    title: 'Tree의 edge마다 g가 action 뒤 reward와 다음 latent를 예측한다',
    body: 'MCTS가 candidate action을 고르면 learned dynamics가 hypothetical child를 만든다. True game simulator나 pixel prediction은 사용하지 않는다.',
    icon: TreePine,
    layout: 'tree',
    items: [
      { label: 'Root', value: 's⁰', detail: '실제 history에서 만든 시작 node', tone: 'gold' },
      { label: 'Branch a¹', value: 'r¹ · s¹', detail: 'g(s⁰,a¹)의 예측 child', tone: 'cyan' },
      { label: 'Branch a²', value: 'r² · s²', detail: '다른 hypothetical branch', tone: 'violet' },
      { label: 'Branch a³', value: 'r³ · s³', detail: 'Visit count가 적은 branch', tone: 'muted' },
    ],
    formula: String.raw`\underbrace{(r^k,s^k)}_{\text{edge 보상·child latent}}=\underbrace{g_\theta(s^{k-1},a^k)}_{\text{학습된 dynamics}}`,
    formulaNote: 'g는 action 하나를 tree edge 하나로 바꾼다. rᵏ와 sᵏ는 실제 환경에서 방금 관측한 값이 아니라 search 내부 예측이다.',
    callout: 'MuZero의 model은 “다음 화면”이 아니라 “이 action branch를 평가하는 데 필요한 latent와 reward”를 만든다.',
    owner: 'Dynamics network g',
    output: 'predicted edge reward rᵏ · child sᵏ',
    invariant: 'search nodes are hypothetical',
  },
  {
    eyebrow: '03 · Prediction and MCTS',
    title: '각 latent의 prior와 value가 search를 안내하고 visit count가 더 나은 정책이 된다',
    body: 'Prediction f는 branch 확장 순서와 leaf 평가를 제공한다. 여러 simulation의 결과가 root visit distribution으로 모여 raw policy head보다 개선된 action 선택을 만든다.',
    icon: Search,
    layout: 'flow',
    items: [
      { label: 'Latent node', value: 'sᵏ', detail: 'g가 만든 hypothetical state', tone: 'gold' },
      { label: 'Prediction f', value: '(pᵏ,vᵏ)=f(sᵏ)', detail: 'Prior와 leaf value', tone: 'violet' },
      { label: 'Tree backup', value: 'r + γv를 위로', detail: 'Visit와 value statistics 누적', tone: 'cyan' },
      { label: 'Improved policy', value: 'πMCTS ∝ visit count', detail: '실제 action과 training target에 사용', tone: 'green' },
    ],
    formula: String.raw`\underbrace{(p^k,v^k)=f_\theta(s^k)}_{\text{탐색 안내}}\qquad \underbrace{\pi_t(a)\propto N_t(a)^{1/T}}_{\text{visit 정책}}`,
    formulaNote: 'p는 network가 처음 제안한 prior이고 π는 여러 simulation 뒤의 visit distribution이다. 두 값을 같은 “policy”로 저장하면 training target의 출처를 잃는다.',
    callout: 'Search는 network output을 그대로 실행하지 않는다. Model과 value를 반복 질의해 만든 visit count가 root action을 결정한다.',
    owner: 'Prediction f + MCTS',
    output: 'search policy π · backed-up root value',
    invariant: 'raw prior p ≠ improved visit policy π',
  },
  {
    eyebrow: '04 · Replay unroll',
    title: '실제 trajectory의 action을 K단계 펼쳐 reward·value·policy 세 target에 맞춘다',
    body: 'Training은 replay의 real root에서 시작하지만 recurrent unroll의 hidden state는 g가 만든다. 각 깊이의 prediction을 그 시점에 저장한 실제 reward와 search target에 정렬한다.',
    icon: Database,
    layout: 'timeline',
    items: [
      { label: 'Replay 시작', value: 'history at t', detail: '실제 관측으로 s⁰ 재계산', tone: 'cyan' },
      { label: 'Action unroll', value: 'aₜ … aₜ₊K₋₁', detail: 'Played trajectory의 action을 g에 입력', tone: 'gold' },
      { label: '세 target', value: 'u · z · π', detail: '실제 reward, value target, MCTS visit policy', tone: 'green' },
      { label: 'Joint loss', value: 'ℓr + ℓv + ℓp', detail: 'h·g·f를 end-to-end 갱신', tone: 'violet' },
    ],
    formula: String.raw`\begin{aligned}\underbrace{\ell_t}_{\text{unroll 손실}}=\sum_{k=0}^{K}\!\bigl[&\underbrace{\ell_r(u_{t+k},r_t^k)}_{\text{보상}}+\underbrace{\ell_v(z_{t+k},v_t^k)}_{\text{가치}}\\[-0.1em]&+\underbrace{\ell_p(\pi_{t+k},p_t^k)}_{\text{탐색 정책}}\bigr]\end{aligned}`,
    formulaNote: '세 loss는 각각 다른 target owner를 가진다. Observation reconstruction 항이 없다는 점이 World Models의 VAE 경로와 다르다.',
    callout: 'Target index가 한 칸만 어긋나도 model은 reward와 policy를 잘못된 action depth에 연결한다. K-step ledger가 구현 검증의 중심이다.',
    owner: 'Replay trainer',
    output: 'aligned reward/value/policy gradients',
    invariant: 'depth k targets refer to time t+k',
  },
  {
    eyebrow: '05 · Planning evidence',
    title: 'Search simulation을 늘리는 이득은 domain과 model 깊이에 따라 포화될 수 있다',
    body: 'Go에서는 더 긴 search가 잘 확장되지만 Atari에서는 논문 설정에서 약 100 simulation 부근의 plateau가 관찰된다. 더 많은 compute가 자동으로 더 정확한 world model을 만들지는 않는다.',
    icon: Gauge,
    layout: 'boundary',
    items: [
      { label: '원 논문이 지지', value: 'Observation 복원 없이 planning-relevant model 학습', detail: 'Reward·policy·value target만으로 board game과 Atari에서 강한 search를 만들었다.', tone: 'green' },
      { label: '원 논문이 지지하지 않음', value: 'Learned latent가 실제 세계의 완전한 상태다', detail: 'Target이 요구하지 않은 안전·물리 정보는 표현되지 않을 수 있다.', tone: 'red' },
      { label: '필수 곡선', value: 'Simulation 수 ↔ return · latency', detail: 'Domain마다 search budget의 이득과 비용을 함께 측정한다.', tone: 'green' },
      { label: '남는 위험', value: '깊은 branch의 reward/value error 누적', detail: '더 긴 search가 잘못된 latent branch를 더 자세히 탐색할 수 있다.', tone: 'red' },
    ],
    callout: 'MuZero의 성공 기준은 화면을 닮은 hidden state가 아니라, 제한된 search budget에서 실제 action return을 개선하는가다.',
    owner: 'Search-scaling evaluation',
    output: 'return/latency/error by simulation depth',
    invariant: 'planning value is measured, not presumed',
  },
];

const dreamerScenes: Scene[] = [
  {
    eyebrow: '01 · Posterior state inference',
    title: 'Replay의 실제 관측을 볼 때만 posterior가 stochastic state z를 추론한다',
    body: 'Deterministic h는 과거 latent와 action을 누적하고, posterior q는 현재 observation까지 읽어 실제 sequence와 latent state를 다시 맞춘다.',
    icon: Layers3,
    layout: 'flow',
    items: [
      { label: '과거 상태', value: 'hₜ₋₁ · zₜ₋₁', detail: '이전 RSSM state', tone: 'muted' },
      { label: '실제 action', value: 'aₜ₋₁', detail: 'Replay에 기록된 행동', tone: 'cyan' },
      { label: 'Deterministic path', value: 'hₜ=f(hₜ₋₁,zₜ₋₁,aₜ₋₁)', detail: 'History를 recurrently 누적', tone: 'gold' },
      { label: 'Posterior', value: 'zₜ~q(z|hₜ,xₜ)', detail: '현재 실제 observation으로 교정', tone: 'green' },
    ],
    formula: String.raw`\begin{aligned}\underbrace{h_t=f_\phi(h_{t-1},z_{t-1},a_{t-1})}_{\text{행동 history}}\\[0.4em]\underbrace{z_t\sim q_\phi(z_t\mid h_t,x_t)}_{\text{실제 관측으로 교정}}\end{aligned}`,
    formulaNote: 'h는 observation 없이 먼저 진행되고, q가 xₜ를 보고 z를 보정한다. 이 posterior 경로는 replay model learning에만 존재한다.',
    callout: 'RSSM state는 h 또는 z 하나가 아니라 둘의 결합이다. 현재 observation을 본 z와 history만 누적한 h의 역할을 분리한다.',
    owner: 'Encoder posterior + recurrent core',
    output: 'posterior RSSM state (hₜ,zₜ)',
    invariant: 'posterior may read real xₜ',
  },
  {
    eyebrow: '02 · World-model learning',
    title: 'Prior를 posterior에 맞추고 observation·reward·continue를 각 head로 복원한다',
    body: 'Dynamics prior는 observation 없이 다음 z를 예측해야 한다. Decoder 계열 head는 latent가 control과 환경 신호를 잃지 않도록 실제 replay target을 제공한다.',
    icon: Network,
    layout: 'compare',
    items: [
      { label: 'Dynamics prior', value: 'p(zₜ|hₜ)', detail: 'Imagination에서 사용할 observation-free 예측', tone: 'violet', metric: '미래 생성' },
      { label: 'Posterior target', value: 'q(zₜ|hₜ,xₜ)', detail: '실제 관측을 본 더 informed한 state', tone: 'green', metric: '현재 교정' },
      { label: 'Prediction heads', value: 'x̂ₜ · r̂ₜ · ĉₜ', detail: 'Observation, reward, continue signal 복원', tone: 'cyan', metric: '표현 유지' },
    ],
    formula: String.raw`\underbrace{\mathcal L_{\mathrm{dyn}}}_{\text{prior 학습}}=\max\!\left(1,\operatorname{KL}\!\left[\operatorname{sg}(q)\,\|\,p\right]\right)\quad \underbrace{\mathcal L_{\mathrm{rep}}}_{\text{posterior 학습}}=\max\!\left(1,\operatorname{KL}\!\left[q\,\|\,\operatorname{sg}(p)\right]\right)`,
    formulaNote: 'sg는 stop-gradient다. 두 KL은 같은 숫자처럼 보여도 한쪽은 prior를, 다른 쪽은 posterior를 움직여 update 책임을 분리한다. 1 nat free bits가 작은 KL을 억지로 0까지 줄이지 않게 한다.',
    callout: 'DreamerV3는 reconstruction을 버린 MuZero와 다르다. Ablation에서 prediction signal을 제거하면 큰 성능 저하가 보고된다.',
    owner: 'World-model optimizer',
    output: 'trained prior · posterior · x/r/continue heads',
    invariant: 'stop-gradient direction is explicit',
  },
  {
    eyebrow: '03 · Prior-only imagination',
    title: '상상 rollout이 시작되면 실제 observation과 posterior를 끊는다',
    body: 'Replay에서 얻은 시작 state 이후에는 actor action과 dynamics prior만으로 미래를 생성한다. 이 경계가 지켜져야 imagined data가 real frame을 몰래 본 것이 아니다.',
    icon: Sparkles,
    layout: 'timeline',
    items: [
      { label: 'Seed state', value: '(h₀,z₀) from replay', detail: '실제 sequence에 anchoring된 시작점', tone: 'green' },
      { label: 'Actor action', value: 'aₜ~π(a|hₜ,zₜ)', detail: '현재 policy가 고른 행동', tone: 'gold' },
      { label: 'Prior transition', value: 'ẑₜ₊₁~p(z|hₜ₊₁)', detail: 'xₜ₊₁ 없이 다음 state 생성', tone: 'violet' },
      { label: 'Imagined signals', value: 'r̂ₜ · ĉₜ · v̂ₜ', detail: 'Head와 critic이 rollout을 평가', tone: 'cyan' },
    ],
    formula: String.raw`\underbrace{a_t\sim\pi_\theta(\cdot\mid h_t,z_t)}_{\text{actor 행동}}\quad\Longrightarrow\quad \underbrace{\widehat z_{t+1}\sim p_\phi(\cdot\mid h_{t+1})}_{\text{관측 없는 미래}}`,
    formulaNote: 'Imagination의 z에는 hat을 붙여 posterior z와 구분한다. 실제 x가 다음 step에 들어오면 model-based rollout이 아니라 replay reconstruction 경로가 된다.',
    callout: 'Posterior quality가 좋아도 prior가 긴 rollout에서 drift할 수 있다. 그래서 one-step reconstruction과 imagined return error를 별도 측정한다.',
    owner: 'Actor + RSSM dynamics prior',
    output: 'fixed-horizon imagined trajectory',
    invariant: 'no real observation after imagination seed',
  },
  {
    eyebrow: '04 · Actor–critic learning',
    title: 'Imagined reward와 continue를 λ-return으로 접어 critic과 actor를 고친다',
    body: 'Critic은 horizon 안의 predicted reward와 horizon 밖의 own value를 결합한다. Actor는 이 return이 커지는 action을 배우되 scale normalization과 entropy로 update를 안정화한다.',
    icon: BrainCircuit,
    layout: 'flow',
    items: [
      { label: 'Imagined sequence', value: 'r̂ₜ · ĉₜ · stateₜ', detail: 'World model이 생성한 data', tone: 'cyan' },
      { label: 'λ-return', value: 'Rₜλ', detail: '짧은 bootstrap과 긴 rollout 혼합', tone: 'gold' },
      { label: 'Critic', value: 'vψ ← Rλ', detail: 'Return distribution을 twohot으로 학습', tone: 'violet' },
      { label: 'Actor', value: 'πθ ← advantage + entropy', detail: '더 나은 imagined action 쪽으로 갱신', tone: 'green' },
    ],
    formula: String.raw`\underbrace{R_t^\lambda}_{\text{critic 표적}}=\underbrace{\widehat r_t}_{\text{상상 보상}}+\gamma\underbrace{\widehat c_t}_{\text{계속 여부}}\left[(1-\lambda)\underbrace{v_t}_{\text{짧은 예측}}+\lambda\underbrace{R_{t+1}^\lambda}_{\text{긴 미래}}\right]`,
    formulaNote: 'Continue가 0이면 terminal 뒤의 가짜 미래를 끊는다. λ는 one-step critic과 더 긴 imagined return 사이의 bias–variance·model-error trade-off를 정한다.',
    callout: 'Actor와 critic은 real reward를 직접 읽는 것이 아니라 world model이 상상한 signal에서 배운다. Model blind spot은 policy improvement 신호로 증폭될 수 있다.',
    owner: 'Imagined actor–critic optimizer',
    output: 'updated actor π · critic v',
    invariant: 'return target provenance remains imagined',
  },
  {
    eyebrow: '05 · Robustness and limits',
    title: '한 recipe의 폭넓은 성공과 모든 환경에서의 무조정 보장은 다르다',
    body: 'Symlog, twohot, return normalization, KL balancing, free bits와 unimix가 signal scale과 collapse를 완화한다. 논문은 150개 이상 task의 폭을 보이지만 현실 안전성과 unseen hardware까지 닫지는 않는다.',
    icon: Gauge,
    layout: 'boundary',
    items: [
      { label: '원 논문이 지지', value: 'Fixed configuration으로 매우 다양한 benchmark 학습', detail: 'Discrete·continuous·visual domain에서 specialized baseline과 폭넓게 비교했다.', tone: 'green' },
      { label: '원 논문이 지지하지 않음', value: '새 로봇에서도 tuning·safety 검증이 필요 없다', detail: 'Reward interface, rare hazard, real latency와 hardware shift는 별도 문제다.', tone: 'red' },
      { label: '필수 ablation', value: 'Symlog · twohot · KL · normalization', detail: 'Scale robustness가 어느 장치와 task family에서 깨지는지 기록한다.', tone: 'green' },
      { label: '남는 위험', value: 'Prior drift와 actor의 model exploitation', detail: 'Sparse 위험 사건이 replay에 없으면 imagined policy가 blind spot을 선호할 수 있다.', tone: 'red' },
    ],
    callout: 'DreamerV3의 transfer question은 평균 score 하나가 아니라 posterior–prior gap, rollout depth, rare-event coverage와 real return이 함께 닫히는가다.',
    owner: 'Cross-domain evaluation',
    output: 'task return · ablation · prior-drift traces',
    invariant: 'benchmark robustness ≠ universal safety',
  },
];

const scenesByPaper: Record<PaperKind, Scene[]> = {
  dyna: dynaScenes,
  'world-models': worldModelsScenes,
  muzero: muZeroScenes,
  dreamerv3: dreamerScenes,
};

export function PaperSceneViz({
  scenes,
  ariaLabel,
}: {
  scenes: PaperMechanismScene[];
  ariaLabel: string;
}) {
  const style = {
    '--step-viz-accent': colors.gold,
  } as CSSProperties;
  const steps = scenes.map((scene) => ({ label: scene.title, body: scene.body }));

  return (
    <section
      className="not-prose min-w-0"
      data-paper-scene-viz
      style={style}
      aria-label={ariaLabel}
    >
      <StepViz
        steps={steps}
        stageClassName="!items-start"
      >
        {(step) => <SceneView scene={scenes[step]} />}
      </StepViz>
    </section>
  );
}

function PaperMechanismViz({ paper }: { paper: PaperKind }) {
  return (
    <div data-model-based-rl-viz={paper}>
      <PaperSceneViz
        scenes={scenesByPaper[paper]}
        ariaLabel={`${paper} 핵심 메커니즘 장면`}
      />
    </div>
  );
}

export function DynaMechanismViz() {
  return <PaperMechanismViz paper="dyna" />;
}

export function WorldModelsMechanismViz() {
  return <PaperMechanismViz paper="world-models" />;
}

export function MuZeroMechanismViz() {
  return <PaperMechanismViz paper="muzero" />;
}

export function DreamerV3MechanismViz() {
  return <PaperMechanismViz paper="dreamerv3" />;
}
