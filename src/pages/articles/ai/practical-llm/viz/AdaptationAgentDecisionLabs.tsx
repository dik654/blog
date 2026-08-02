import { useMemo, useState, type ReactNode } from 'react';
import {
  ArrowDown,
  Check,
  CircleAlert,
  GitBranch,
  Layers3,
  LockKeyhole,
  Merge,
  Network,
  Pause,
  Play,
  RefreshCw,
  Route,
  ShieldCheck,
  Split,
  TimerReset,
} from 'lucide-react';
import { motion } from 'framer-motion';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { SegmentedControl } from '../../nlp-shared';

function LabShell({
  lab,
  eyebrow,
  title,
  children,
  footer,
}: {
  lab: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <section
      data-lab={lab}
      className="not-prose my-8 min-w-0 scroll-mt-24 overflow-hidden rounded-md border border-border bg-background shadow-sm"
    >
      <header className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-[11px] font-semibold uppercase text-muted-foreground">{eyebrow}</p>
        <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg">{title}</h3>
      </header>
      <div className="min-w-0 space-y-5 p-4 sm:p-5">{children}</div>
      <footer className="border-t border-border bg-muted/15 px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:px-5">
        {footer}
      </footer>
    </section>
  );
}

function Verdict({
  good,
  title,
  description,
}: {
  good: boolean;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      key={`${good}-${title}`}
      aria-live="polite"
      role="status"
      initial={{ opacity: 0, y: 3 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex min-w-0 items-start gap-3 border-y py-4 ${
        good ? 'border-emerald-600/30' : 'border-amber-600/30'
      }`}
    >
      {good
        ? <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700 dark:text-emerald-300" />
        : <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300" />}
      <div className="min-w-0">
        <p className="text-sm font-bold">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
}

type AdaptationFailure = 'freshness' | 'format' | 'vocabulary' | 'latency';
type LabelAccess = 'none' | 'paired';

export function AdaptationGateLab() {
  const [failure, setFailure] = useState<AdaptationFailure>('format');
  const [labels, setLabels] = useState<LabelAccess>('paired');

  const decision = {
    freshness: {
      title: 'Retrieval·tool baseline을 먼저 고친다',
      description: '새 사실은 weight에 다시 새기는 것보다 출처와 시각을 가진 context로 주입하는 편이 갱신·검증에 유리하다.',
      adapter: false,
    },
    format: labels === 'paired'
      ? {
          title: 'Supervised adapter 후보',
          description: '원하는 입력·출력 pair와 독립 평가가 있으므로 작은 LoRA부터 full fine-tuning과 비교한다.',
          adapter: true,
        }
      : {
          title: '평가 pair부터 만든다',
          description: '정답 계약이 없으면 adapter가 좋아졌는지, 문체만 달라졌는지 판별할 수 없다.',
          adapter: false,
        },
    vocabulary: labels === 'paired'
      ? {
          title: 'Continued pretraining과 adapter를 분리 비교한다',
          description: '용어 노출 부족과 task 행동 부족은 서로 다른 objective다. 한 run에 섞지 않는다.',
          adapter: true,
        }
      : {
          title: 'Unlabeled corpus 진단부터 시작한다',
          description: 'Tokenizer fragmentation·truncation과 frozen baseline을 측정한 뒤 continued pretraining 필요성을 판단한다.',
          adapter: false,
        },
    latency: {
      title: 'Serving·compression 경로로 보낸다',
      description: 'LoRA는 기본적으로 행동 적응 수단이다. 병목이 KV cache·memory bandwidth·batching이면 runtime을 고친다.',
      adapter: false,
    },
  }[failure];

  return (
    <LabShell
      lab="adaptation-gate"
      eyebrow="Intervention gate"
      title="Fine-tuning을 시작하기 전에 실패의 책임 층을 고른다"
      footer="같은 dataset과 같은 evaluator에서 prompt·retrieval baseline, 작은 adapter와 더 큰 update를 비교해야 intervention 비용이 의미를 갖는다."
    >
      <div className="flex min-w-0 flex-wrap gap-3">
        <SegmentedControl
          label="관측된 실패"
          value={failure}
          onChange={setFailure}
          options={[
            { value: 'freshness', label: '최신 사실' },
            { value: 'format', label: '출력 행동' },
            { value: 'vocabulary', label: '전문 용어' },
            { value: 'latency', label: '지연·메모리' },
          ]}
        />
        <SegmentedControl
          label="정답 pair"
          value={labels}
          onChange={setLabels}
          options={[
            { value: 'none', label: '없음' },
            { value: 'paired', label: '있음' },
          ]}
        />
      </div>

      <div className="grid gap-2 sm:grid-cols-4">
        {[
          ['Prompt', '지시·예시'],
          ['Retrieval', '최신 근거'],
          ['Adapter', '행동 update'],
          ['Runtime', '지연·메모리'],
        ].map(([label, note], index) => {
          const active = (
            (failure === 'format' && index === 2)
            || (failure === 'freshness' && index === 1)
            || (failure === 'vocabulary' && index === 2)
            || (failure === 'latency' && index === 3)
          );
          return (
            <div key={label} className={`min-w-0 border-y py-3 sm:border-y-0 sm:border-l sm:pl-3 ${active ? 'border-blue-600' : 'border-border'}`}>
              <p className={`text-xs font-bold ${active ? 'text-blue-700 dark:text-blue-300' : ''}`}>{label}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{note}</p>
            </div>
          );
        })}
      </div>

      <Verdict good={decision.adapter} title={decision.title} description={decision.description} />
    </LabShell>
  );
}

const ranks = [4, 8, 16, 32, 64] as const;
const alphas = [8, 16, 32, 64, 128] as const;

export function LoraGeometryLab() {
  const [rankIndex, setRankIndex] = useState(2);
  const [alphaIndex, setAlphaIndex] = useState(2);
  const rank = ranks[rankIndex];
  const alpha = alphas[alphaIndex];
  const scale = alpha / rank;
  const dimension = 4096;
  const fullParameters = dimension * dimension;
  const adapterParameters = rank * (dimension + dimension);
  const rawUpdate = 0.12;
  const scaledUpdate = rawUpdate * scale;

  return (
    <LabShell
      lab="lora-geometry"
      eyebrow="Low-rank update lab"
      title="Rank와 alpha가 행렬 모양·파라미터 수·업데이트 크기를 다르게 바꾼다"
      footer="Rank, alpha, target modules, optimizer와 data를 동시에 바꾸면 원인을 분리할 수 없다. 첫 실험은 한 축씩 바꾼다."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="min-w-0">
          <span className="flex items-center justify-between gap-3 text-xs font-semibold">
            Rank <span className="font-mono text-sm">{rank}</span>
          </span>
          <input
            aria-label="LoRA rank"
            className="mt-3 w-full accent-blue-600"
            type="range"
            min={0}
            max={ranks.length - 1}
            step={1}
            value={rankIndex}
            onChange={(event) => setRankIndex(Number(event.target.value))}
          />
        </label>
        <label className="min-w-0">
          <span className="flex items-center justify-between gap-3 text-xs font-semibold">
            Alpha <span className="font-mono text-sm">{alpha}</span>
          </span>
          <input
            aria-label="LoRA alpha"
            className="mt-3 w-full accent-violet-600"
            type="range"
            min={0}
            max={alphas.length - 1}
            step={1}
            value={alphaIndex}
            onChange={(event) => setAlphaIndex(Number(event.target.value))}
          />
        </label>
      </div>

      <div className="grid min-w-0 gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
        {[
          { label: 'A: 입력을 rank로', value: `${rank} x ${dimension}`, tone: 'bg-blue-500/[0.07] text-blue-700 dark:text-blue-300' },
          { label: 'B: rank를 출력으로', value: `${dimension} x ${rank}`, tone: 'bg-violet-500/[0.07] text-violet-700 dark:text-violet-300' },
          { label: 'Delta W: 원래 모양', value: `${dimension} x ${dimension}`, tone: 'bg-emerald-500/[0.07] text-emerald-700 dark:text-emerald-300' },
        ].map((item, index) => (
          <div key={item.label} className="contents">
            <div className={`min-w-0 rounded-md border border-border p-3 ${item.tone}`}>
              <p className="text-[11px] font-semibold">{item.label}</p>
              <p className="mt-1 break-words font-mono text-sm font-bold">{item.value}</p>
            </div>
            {index < 2 && (
              <ArrowDown className="mx-auto h-4 w-4 text-muted-foreground sm:rotate-[-90deg]" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>

      <dl className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
        <div className="min-w-0 bg-background p-3">
          <dt className="text-[11px] font-semibold text-muted-foreground">Full matrix</dt>
          <dd className="mt-1 font-mono text-sm font-bold">{fullParameters.toLocaleString('ko-KR')}</dd>
        </div>
        <div className="min-w-0 bg-background p-3">
          <dt className="text-[11px] font-semibold text-muted-foreground">A + B trainable</dt>
          <dd className="mt-1 font-mono text-sm font-bold">{adapterParameters.toLocaleString('ko-KR')}</dd>
        </div>
        <div className="min-w-0 bg-background p-3">
          <dt className="text-[11px] font-semibold text-muted-foreground">Scale alpha / rank</dt>
          <dd className="mt-1 font-mono text-sm font-bold">{scale.toFixed(2)}</dd>
        </div>
      </dl>

      <motion.div
        key={`${rank}-${alpha}`}
        aria-live="polite"
        data-formula-pair
        className="min-w-0 border-y border-border py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-xs font-semibold text-muted-foreground">한 원소의 계산 예</p>
        <div className="mt-2 max-w-full overflow-hidden text-center text-sm sm:text-base">
          <MathFormula display>
            {String.raw`\underbrace{\Delta W_{ij}}_{\text{실제 업데이트}}=
            \underbrace{\frac{${alpha}}{${rank}}}_{\text{스케일 }${scale.toFixed(2)}}\cdot
            \underbrace{(BA)_{ij}}_{\text{저랭크 곱 }${rawUpdate.toFixed(2)}}=
            \underbrace{${scaledUpdate.toFixed(2)}}_{\text{원래 가중치에 더할 값}}`}
          </MathFormula>
        </div>
        <FormulaNote
          meaning="A와 B의 곱은 full weight와 같은 크기의 업데이트 방향을 만들지만, 학습하는 자유도는 rank r로 제한된다. alpha/r은 rank를 바꾸지 않고 그 업데이트의 크기만 조절한다. 이 실험실의 숫자는 한 원소를 설명하기 위한 예시이며 보편적인 권장 rank나 alpha가 아니다."
          symbols={[
            [String.raw`\Delta W_{ij}`, '원래 weight의 i행 j열에 더할 변화량'],
            [String.raw`(BA)_{ij}`, '두 저랭크 행렬을 곱해 얻은 해당 원소의 원시 업데이트'],
            [String.raw`\alpha`, 'adapter 업데이트 크기를 조절하는 scale 분자'],
            [String.raw`r`, '저랭크 병목의 폭이자 scale 분모'],
          ]}
        />
      </motion.div>
    </LabShell>
  );
}

type PrecisionPhase = 'storage' | 'compute' | 'gradient';

export function QloraPrecisionLab() {
  const [phase, setPhase] = useState<PrecisionPhase>('storage');
  const phases = [
    {
      id: 'storage' as const,
      label: '저장',
      value: 'Frozen base · NF4 4-bit',
      note: 'Base weight를 작게 보관한다. Optimizer가 이 weight를 직접 갱신하지 않는다.',
      icon: <LockKeyhole className="h-5 w-5" />,
    },
    {
      id: 'compute' as const,
      label: '연산',
      value: 'Block dequantize · BF16 compute',
      note: '필요한 block을 더 높은 연산 dtype으로 복원해 matmul하고 임시 값은 버린다.',
      icon: <Play className="h-5 w-5" />,
    },
    {
      id: 'gradient' as const,
      label: '기울기',
      value: 'LoRA A/B만 trainable',
      note: 'Backward는 base 경로를 통과하지만 gradient와 optimizer state는 adapter에 축적한다.',
      icon: <RefreshCw className="h-5 w-5" />,
    },
  ];

  return (
    <LabShell
      lab="qlora-precision"
      eyebrow="Precision path lab"
      title="4-bit는 저장 형식이지 모든 연산과 기울기의 dtype이 아니다"
      footer="실제 지원 dtype과 merge 가능성은 backend·hardware·PEFT·Transformers 버전에 묶인다. Artifact manifest에 버전을 고정한다."
    >
      <SegmentedControl
        label="QLoRA 정밀도 단계"
        value={phase}
        onChange={setPhase}
        options={phases.map((item) => ({ value: item.id, label: item.label }))}
      />

      <div className="grid gap-2 sm:grid-cols-3">
        {phases.map((item) => {
          const active = item.id === phase;
          return (
            <motion.div
              key={item.id}
              animate={{ opacity: active ? 1 : 0.55 }}
              className={`min-w-0 rounded-md border p-4 ${active ? 'border-blue-600/50 bg-blue-500/[0.04]' : 'border-border'}`}
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-md ${active ? 'bg-blue-600 text-white' : 'bg-muted text-muted-foreground'}`}>
                {item.icon}
              </div>
              <p className="mt-3 text-xs font-bold">{item.value}</p>
              <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{item.note}</p>
            </motion.div>
          );
        })}
      </div>

      <Verdict
        good={phase === 'gradient'}
        title={phase === 'gradient' ? 'Frozen과 no-gradient는 같은 말이 아니다' : `${phases.find((item) => item.id === phase)?.label} 역할을 보고 있다`}
        description={phase === 'gradient'
          ? 'Base를 갱신하지 않아도 adapter gradient를 계산하려면 activation과 backward 경로가 필요하다.'
          : '저장·연산·기울기 역할을 하나의 “4-bit model”이라는 말로 합치지 않는다.'}
      />
    </LabShell>
  );
}

type LossMode = 'all' | 'assistant';

export function SftLossMaskLab() {
  const [mode, setMode] = useState<LossMode>('assistant');
  const tokens = [
    { role: 'system', text: '정책을 지켜라' },
    { role: 'user', text: '보고서를 요약해줘' },
    { role: 'assistant', text: '핵심 위험은 세 가지입니다' },
  ] as const;

  return (
    <LabShell
      lab="sft-loss-mask"
      eyebrow="Supervised loss lab"
      title="같은 대화라도 어느 token을 정답으로 삼는지에 따라 학습 문제가 달라진다"
      footer="현재 TRL에서 assistant-only loss는 chat template의 generation marker 지원이 필요하다. Prompt-completion dataset은 completion mask 계약을 별도로 확인한다."
    >
      <SegmentedControl
        label="Loss 범위"
        value={mode}
        onChange={setMode}
        options={[
          { value: 'all', label: '전체 sequence' },
          { value: 'assistant', label: 'Assistant만' },
        ]}
      />

      <div className="space-y-2">
        {tokens.map((token) => {
          const trained = mode === 'all' || token.role === 'assistant';
          return (
            <motion.div
              key={`${mode}-${token.role}`}
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 1 }}
              className="grid min-w-0 grid-cols-[5.5rem_minmax(0,1fr)_4.25rem] items-center gap-2 border-y border-border py-3"
            >
              <span className="font-mono text-[11px] font-bold text-muted-foreground">{token.role}</span>
              <span className="min-w-0 break-words text-xs font-medium">{token.text}</span>
              <span className={`text-right text-[11px] font-bold ${trained ? 'text-emerald-700 dark:text-emerald-300' : 'text-muted-foreground'}`}>
                {trained ? 'loss 계산' : '-100 mask'}
              </span>
            </motion.div>
          );
        })}
      </div>

      <Verdict
        good={mode === 'assistant'}
        title={mode === 'assistant' ? '응답 행동에만 gradient를 준다' : 'Prompt token도 예측 목표가 된다'}
        description={mode === 'assistant'
          ? 'System·user token은 context로 읽되 label에서는 제외한다. Template marker와 실제 labels tensor를 샘플로 검사한다.'
          : '일반 language modeling에는 맞을 수 있지만 assistant behavior tuning의 의도와 같은지 명시해야 한다.'}
      />
    </LabShell>
  );
}

type ReleaseTraffic = 'single' | 'many';
type BasePrecision = 'high' | 'quantized';

export function AdapterReleaseLab() {
  const [traffic, setTraffic] = useState<ReleaseTraffic>('many');
  const [precision, setPrecision] = useState<BasePrecision>('quantized');
  const merged = traffic === 'single' && precision === 'high';

  return (
    <LabShell
      lab="adapter-release"
      eyebrow="Release decision lab"
      title="학습이 끝난 adapter와 실제 서빙 artifact는 같은 것이 아니다"
      footer="어느 경로든 base revision, tokenizer, chat template, adapter checksum, dtype, quantization config와 evaluator version을 한 manifest로 묶는다."
    >
      <div className="flex min-w-0 flex-wrap gap-3">
        <SegmentedControl
          label="서빙할 행동 수"
          value={traffic}
          onChange={setTraffic}
          options={[
            { value: 'single', label: '하나' },
            { value: 'many', label: '여러 adapter' },
          ]}
        />
        <SegmentedControl
          label="Merge 대상 base"
          value={precision}
          onChange={setPrecision}
          options={[
            { value: 'high', label: 'FP16/BF16' },
            { value: 'quantized', label: '4/8-bit' },
          ]}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className={`rounded-md border p-4 ${!merged ? 'border-blue-600/45 bg-blue-500/[0.035]' : 'border-border'}`}>
          <Layers3 className="h-5 w-5 text-blue-700 dark:text-blue-300" />
          <p className="mt-3 text-sm font-bold">Base + adapter serving</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            한 base에 여러 adapter를 선택·교체할 수 있다. Runtime 지원, adapter routing과 동시성 비용을 측정한다.
          </p>
        </div>
        <div className={`rounded-md border p-4 ${merged ? 'border-emerald-600/45 bg-emerald-500/[0.035]' : 'border-border'}`}>
          <Merge className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
          <p className="mt-3 text-sm font-bold">Merged artifact</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            단일 dense artifact로 단순화한다. 높은 정밀도의 호환 base에 합친 뒤 필요하면 별도 inference quantization을 검증한다.
          </p>
        </div>
      </div>

      <Verdict
        good={traffic === 'many' ? precision === 'high' : merged}
        title={traffic === 'many' ? 'Adapter serving 후보' : merged ? 'Merged artifact 후보' : '먼저 호환되는 높은 정밀도 base를 확인한다'}
        description={traffic === 'many'
          ? `여러 행동을 동시에 제공하므로 merge하지 않는다. Adapter별 동시성, cold load, routing 오류와 ${precision === 'quantized' ? '양자화 base 호환성' : 'base revision 호환성'}을 release gate에 넣는다.`
          : precision === 'quantized'
            ? '단일 artifact가 목표여도 양자화 backend마다 merge 지원과 오차가 다르다. 높은 정밀도 base에 먼저 합친 뒤 별도 inference quantization을 검증한다.'
            : 'Merge 전후 logit·task·slice 회귀와 실제 serving engine load를 통과시킨다.'}
      />
    </LabShell>
  );
}

type TaskTopology = 'serial' | 'parallel';
type ContextBoundary = 'shared' | 'isolated';
type MeasuredGain = 'unknown' | 'positive';

export function AgentSplitGateLab() {
  const [topology, setTopology] = useState<TaskTopology>('serial');
  const [boundary, setBoundary] = useState<ContextBoundary>('shared');
  const [gain, setGain] = useState<MeasuredGain>('unknown');
  const shouldSplit = topology === 'parallel' && boundary === 'isolated' && gain === 'positive';

  return (
    <LabShell
      lab="agent-split-gate"
      eyebrow="Decomposition gate"
      title="역할 이름이 많아서가 아니라 병렬성·격리·측정 이득이 있을 때만 분리한다"
      footer="최소 비교군은 한 agent, deterministic workflow, multi-agent다. 같은 tool·model·budget에서 비교하지 않으면 orchestration 효과를 알 수 없다."
    >
      <div className="flex min-w-0 flex-wrap gap-3">
        <SegmentedControl
          label="작업 의존성"
          value={topology}
          onChange={setTopology}
          options={[
            { value: 'serial', label: '순차 의존' },
            { value: 'parallel', label: '독립 병렬' },
          ]}
        />
        <SegmentedControl
          label="Context 경계"
          value={boundary}
          onChange={setBoundary}
          options={[
            { value: 'shared', label: '강한 공유' },
            { value: 'isolated', label: '분리 가능' },
          ]}
        />
        <SegmentedControl
          label="Baseline 대비"
          value={gain}
          onChange={setGain}
          options={[
            { value: 'unknown', label: '미측정' },
            { value: 'positive', label: '이득 확인' },
          ]}
        />
      </div>

      <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
        {[
          { icon: <Route className="h-5 w-5" />, label: '작업 그래프', note: topology === 'parallel' ? '동시에 탐색 가능' : '앞 결과가 뒤 입력' },
          { icon: <Split className="h-5 w-5" />, label: 'Context', note: boundary === 'isolated' ? 'worker별 최소 입력' : '같은 맥락 공유' },
          { icon: <Check className="h-5 w-5" />, label: 'Evidence', note: gain === 'positive' ? '품질·비용 이득' : '아직 비교 없음' },
        ].map((item, index) => (
          <div key={item.label} className="contents">
            <div className="min-w-0 rounded-md border border-border p-3">
              <span className="text-muted-foreground">{item.icon}</span>
              <p className="mt-2 text-xs font-bold">{item.label}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{item.note}</p>
            </div>
            {index < 2 && <ArrowDown className="mx-auto h-4 w-4 text-muted-foreground sm:rotate-[-90deg]" aria-hidden="true" />}
          </div>
        ))}
      </div>

      <Verdict
        good={shouldSplit}
        title={shouldSplit ? 'Bounded multi-agent 후보' : 'Single-agent·deterministic baseline 유지'}
        description={shouldSplit
          ? '독립 worker의 fan-out과 typed result fan-in을 먼저 구현하고 manager는 필요할 때만 추가한다.'
          : '분리할수록 handoff, 중복 context, merge conflict, latency와 failure surface가 늘어난다.'}
      />
    </LabShell>
  );
}

type ReducerMode = 'overwrite' | 'append';

export function ReducerTraceLab() {
  const [mode, setMode] = useState<ReducerMode>('overwrite');
  const state = mode === 'overwrite'
    ? ['B: 온도 상승 근거']
    : ['A: 진동 증가 근거', 'B: 온도 상승 근거'];

  return (
    <LabShell
      lab="reducer-trace"
      eyebrow="State reducer lab"
      title="같은 state key에 두 worker가 쓰면 reducer가 결과의 의미를 결정한다"
      footer="Append도 만능이 아니다. 중복 제거, 정렬, message ID 갱신처럼 domain에 맞는 reducer와 단일 writer 원칙을 함께 설계한다."
    >
      <SegmentedControl
        label="evidence reducer"
        value={mode}
        onChange={setMode}
        options={[
          { value: 'overwrite', label: '기본 덮어쓰기' },
          { value: 'append', label: '명시적 append' },
        ]}
      />

      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_1.2fr]">
        {[
          { label: 'Worker A update', value: '["진동 증가 근거"]', tone: 'border-blue-600/30' },
          { label: 'Worker B update', value: '["온도 상승 근거"]', tone: 'border-violet-600/30' },
          { label: 'Committed state', value: JSON.stringify(state), tone: mode === 'append' ? 'border-emerald-600/40' : 'border-amber-600/40' },
        ].map((item) => (
          <motion.div key={`${mode}-${item.label}`} className={`min-w-0 rounded-md border p-3 ${item.tone}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-[11px] font-semibold text-muted-foreground">{item.label}</p>
            <p className="mt-2 break-words font-mono text-xs font-bold leading-relaxed">{item.value}</p>
          </motion.div>
        ))}
      </div>

      <Verdict
        good={mode === 'append'}
        title={mode === 'append' ? '두 update를 reducer가 누적했다' : '나중 update가 앞의 evidence를 대체했다'}
        description={mode === 'append'
          ? 'State schema에 reducer를 명시했을 때만 누적 의미가 생긴다.'
          : 'LangGraph의 reducer 없는 key는 update마다 overwrite된다. “state는 자동 누적”이라고 가정하지 않는다.'}
      />
    </LabShell>
  );
}

type ApprovalPoint = 'before' | 'after';
type Idempotency = 'missing' | 'stable';

export function ExecutionSafetyLab() {
  const [approval, setApproval] = useState<ApprovalPoint>('before');
  const [idempotency, setIdempotency] = useState<Idempotency>('missing');
  const safe = approval === 'before' && idempotency === 'stable';

  const stages = useMemo(() => [
    { label: '계획', icon: <GitBranch className="h-4 w-4" />, safe: true },
    { label: approval === 'before' ? '승인 대기' : '외부 동작', icon: approval === 'before' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />, safe: approval === 'before' },
    { label: approval === 'before' ? '외부 동작' : '승인 대기', icon: approval === 'before' ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />, safe },
    { label: '확인·commit', icon: <ShieldCheck className="h-4 w-4" />, safe },
  ], [approval, safe]);

  return (
    <LabShell
      lab="execution-safety"
      eyebrow="Side-effect safety lab"
      title="Pause·resume와 retry가 같은 외부 동작을 두 번 만들지 않게 한다"
      footer="Interrupt 뒤 resume 시 node는 처음부터 다시 실행될 수 있다. 외부 API 호출은 승인 뒤 별도 node로 분리하고 stable idempotency key로 재시도를 식별한다."
    >
      <div className="flex min-w-0 flex-wrap gap-3">
        <SegmentedControl
          label="승인 위치"
          value={approval}
          onChange={setApproval}
          options={[
            { value: 'before', label: '동작 전' },
            { value: 'after', label: '동작 후' },
          ]}
        />
        <SegmentedControl
          label="Idempotency key"
          value={idempotency}
          onChange={setIdempotency}
          options={[
            { value: 'missing', label: '없음' },
            { value: 'stable', label: 'Run+action 고정' },
          ]}
        />
      </div>

      <div className="grid gap-2 sm:grid-cols-4">
        {stages.map((stage, index) => (
          <div key={`${approval}-${stage.label}`} className="contents">
            <div className={`min-w-0 rounded-md border p-3 ${stage.safe ? 'border-border' : 'border-amber-600/45 bg-amber-500/[0.035]'}`}>
              <span className={stage.safe ? 'text-muted-foreground' : 'text-amber-700 dark:text-amber-300'}>{stage.icon}</span>
              <p className="mt-2 text-xs font-bold">{stage.label}</p>
            </div>
            {index < stages.length - 1 && <ArrowDown className="mx-auto h-4 w-4 text-muted-foreground sm:hidden" aria-hidden="true" />}
          </div>
        ))}
      </div>

      <Verdict
        good={safe}
        title={safe ? '재실행 가능한 action boundary' : '중복 side effect 위험'}
        description={approval === 'after'
          ? '승인 전에 이미 설비·DB·ticket을 바꿨다. 거절해도 원복 계약이 없고 resume 때 다시 실행될 수 있다.'
          : idempotency === 'missing'
            ? 'Timeout 뒤 성공 여부를 모르면 retry가 두 번째 action을 만들 수 있다.'
            : '같은 run_id와 action_id가 같은 외부 요청으로 수렴하며 결과를 reconcile할 수 있다.'}
      />
    </LabShell>
  );
}

type TraceFailure = 'route' | 'tool' | 'state' | 'quality';

export function AgentTraceEvalLab() {
  const [failure, setFailure] = useState<TraceFailure>('state');
  const result = {
    route: {
      label: 'Router decision',
      metric: '잘못된 worker 선택률',
      fix: 'Router input·candidate·decision reason을 저장하고 deterministic rule baseline과 비교한다.',
    },
    tool: {
      label: 'Tool execution',
      metric: 'Timeout·retry·side-effect 중복',
      fix: 'Provider latency, attempt, error class, idempotency key와 external receipt를 한 span에 묶는다.',
    },
    state: {
      label: 'State commit',
      metric: '누락·충돌·stale read',
      fix: 'Before/update/after, writer, reducer와 checkpoint ID를 기록해 사라진 field를 찾는다.',
    },
    quality: {
      label: 'Final synthesis',
      metric: 'Outcome·coverage·groundedness',
      fix: '같은 evidence와 budget의 single-agent 결과를 함께 평가해 orchestration 이득을 분리한다.',
    },
  }[failure];

  return (
    <LabShell
      lab="agent-trace-eval"
      eyebrow="Trace and evaluation lab"
      title="최종 답 하나가 아니라 실패가 생긴 span까지 평가 단위를 내린다"
      footer="Release bundle에는 outcome quality, safety violation, task success, cost, latency, tool attempts, handoff 수, no-progress 종료와 human override를 함께 둔다."
    >
      <SegmentedControl
        label="관측된 실패 위치"
        value={failure}
        onChange={setFailure}
        options={[
          { value: 'route', label: 'Routing' },
          { value: 'tool', label: 'Tool' },
          { value: 'state', label: 'State' },
          { value: 'quality', label: '최종 품질' },
        ]}
      />

      <div className="grid gap-2 sm:grid-cols-4">
        {[
          { id: 'route', label: 'Route', icon: <Route className="h-4 w-4" /> },
          { id: 'tool', label: 'Tool', icon: <TimerReset className="h-4 w-4" /> },
          { id: 'state', label: 'Commit', icon: <Network className="h-4 w-4" /> },
          { id: 'quality', label: 'Synthesis', icon: <Check className="h-4 w-4" /> },
        ].map((stage) => (
          <div key={stage.id} className={`min-w-0 border-y py-3 sm:border-y-0 sm:border-l sm:pl-3 ${failure === stage.id ? 'border-blue-600 text-blue-700 dark:text-blue-300' : 'border-border'}`}>
            {stage.icon}
            <p className="mt-2 text-xs font-bold">{stage.label}</p>
          </div>
        ))}
      </div>

      <motion.div
        key={failure}
        aria-live="polite"
        role="status"
        initial={{ opacity: 0, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid min-w-0 gap-3 border-y border-border py-4 sm:grid-cols-[10rem_minmax(0,1fr)]"
      >
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground">{result.label}</p>
          <p className="mt-1 text-sm font-bold">{result.metric}</p>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">{result.fix}</p>
      </motion.div>
    </LabShell>
  );
}
