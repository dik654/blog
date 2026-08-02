import { useState } from 'react';
import {
  ArrowRight,
  AudioLines,
  BookOpenCheck,
  Braces,
  Calculator,
  Check,
  CircleHelp,
  FileImage,
  FileText,
  Film,
  Gauge,
  GitBranch,
  Image as ImageIcon,
  Layers3,
  LockKeyhole,
  OctagonX,
  ScanSearch,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { InternalLink } from '@/components/learning/ArticleLearning';
import { handleTabKey } from './tabKeyboard';

type Modality = 'text' | 'image' | 'video' | 'audio';

type ModelContract = {
  id: string;
  name: string;
  date: string;
  evidence: string;
  evidenceTone: 'open' | 'paper' | 'preview';
  inputs: Modality[];
  outputs: Modality[];
  entry: string;
  representation: string;
  objective: string;
  boundary: string;
};

const contracts: ModelContract[] = [
  {
    id: 'gemma4',
    name: 'Gemma 4 · 12B Unified',
    date: '2026-07',
    evidence: '기술 보고서 · 모델 카드 · 공개 weight',
    evidenceTone: 'open',
    inputs: ['text', 'image', 'audio'],
    outputs: ['text'],
    entry: 'Image patch와 audio waveform을 가벼운 linear layer로 model embedding에 직접 projection',
    representation: '별도 vision·audio encoder가 없는 입력 경로. 그렇다고 image token이나 계산이 사라지는 것은 아니다.',
    objective: '여러 modality를 조건으로 text를 생성한다.',
    boundary: 'Unified는 “한 decoder가 입력을 함께 처리한다”는 뜻이다. Image output을 증명하지 않는다.',
  },
  {
    id: 'llama4',
    name: 'Llama 4',
    date: '2025-04',
    evidence: '공식 release · 모델 카드 · 공개 weight',
    evidenceTone: 'open',
    inputs: ['text', 'image'],
    outputs: ['text'],
    entry: 'MetaCLIP 기반 vision encoder 뒤의 visual token을 text token과 early fusion',
    representation: 'Vision encoder는 frozen Llama와 별도로 적응 학습됐다. 이후 backbone joint pretraining에서 text·vision token을 early fusion했다.',
    objective: '공개 product interface에서는 text·image를 조건으로 text를 생성한다. Video data 공동 학습을 video generation으로 확대하지 않는다.',
    boundary: 'Early fusion은 encoder-free 또는 image generation과 같은 말이 아니다.',
  },
  {
    id: 'qwen3vl',
    name: 'Qwen3-VL',
    date: '2025-11',
    evidence: '논문 · 공식 repository · 공개 weight',
    evidenceTone: 'open',
    inputs: ['text', 'image', 'video'],
    outputs: ['text'],
    entry: 'ViT multi-level feature를 DeepStack으로 결합하고 text sequence에 배치',
    representation: 'Interleaved-MRoPE가 시간·너비·높이 위치를 나누어 긴 video와 여러 image의 위치를 보존한다.',
    objective: '시각 입력을 조건으로 text·구조화된 응답을 생성한다.',
    boundary: 'Qwen3-VL의 공개 이해 구조를 Qwen VLo의 image generation 구조로 추정하면 안 된다.',
  },
  {
    id: 'qwenvlo',
    name: 'Qwen VLo · Preview',
    date: '2025-06',
    evidence: '공식 product preview',
    evidenceTone: 'preview',
    inputs: ['text', 'image'],
    outputs: ['text', 'image'],
    entry: 'Prompt와 reference image로 생성·편집을 수행하는 공개 product interface',
    representation: '공식 글은 progressive generation 동작과 capability를 보여 주지만 내부 tensor 계약은 충분히 공개하지 않는다.',
    objective: '공개 근거만으로 training objective를 확정하지 않는다.',
    boundary: '보이는 product capability는 강한 사용 증거지만 재현 가능한 architecture 증거와 다르다.',
  },
  {
    id: 'janus',
    name: 'Janus-Pro',
    date: '2025-01',
    evidence: '논문 · 공식 repository · 공개 weight',
    evidenceTone: 'open',
    inputs: ['text', 'image'],
    outputs: ['text', 'image'],
    entry: '이해용 vision encoder와 생성용 visual tokenizer를 분리하고 transformer는 공유',
    representation: '의미를 읽는 feature와 다시 image로 decode할 수 있는 discrete code가 서로 다른 책임을 가진다.',
    objective: 'Text와 visual code를 autoregressive하게 예측한다.',
    boundary: 'Unified transformer라도 visual encoding과 output decoder까지 하나라는 뜻은 아니다.',
  },
  {
    id: 'emu3',
    name: 'Emu3 framework · artifact 분리',
    date: '2024-09',
    evidence: '논문 · 공식 repository · 공개 weight',
    evidenceTone: 'open',
    inputs: ['text', 'image', 'video'],
    outputs: ['text', 'image', 'video'],
    entry: 'Text·image·video를 모두 discrete token sequence로 바꿔 decoder-only transformer에 입력',
    representation: 'Visual tokenizer가 image와 video를 복원 가능한 code ID로 압축한다.',
    objective: '공통 next-token objective로 이해와 생성을 학습한다. 공개 post-trained artifact는 Emu3-Chat과 Emu3-Gen으로 나뉜다.',
    boundary: 'Framework는 video generation까지 포괄하지만 공개 post-trained artifact는 Emu3-Chat과 Emu3-Gen으로 나뉜다. 하나의 checkpoint가 모든 입출력을 수행한다고 합치지 않는다.',
  },
  {
    id: 'transfusion',
    name: 'Transfusion',
    date: '2024-09',
    evidence: '논문 · 연구 결과',
    evidenceTone: 'paper',
    inputs: ['text', 'image'],
    outputs: ['text', 'image'],
    entry: 'Text token과 continuous image patch를 같은 mixed sequence에 배치',
    representation: 'Text는 discrete ID, image는 연속 patch representation으로 남는다.',
    objective: 'Text token별 next-token loss와 image span 전체의 image-level diffusion loss를 결합한다.',
    boundary: '한 transformer가 두 loss를 받는다. 모든 위치를 같은 tokenizer나 같은 loss로 처리하지 않는다.',
  },
];

const modalityMeta: Record<Modality, { label: string; icon: typeof FileText; tone: string }> = {
  text: { label: 'Text', icon: FileText, tone: 'border-teal-600/35 bg-teal-500/[0.07] text-teal-900 dark:text-teal-100' },
  image: { label: 'Image', icon: ImageIcon, tone: 'border-blue-600/35 bg-blue-500/[0.07] text-blue-900 dark:text-blue-100' },
  video: { label: 'Video', icon: Film, tone: 'border-indigo-600/35 bg-indigo-500/[0.07] text-indigo-900 dark:text-indigo-100' },
  audio: { label: 'Audio', icon: AudioLines, tone: 'border-amber-600/35 bg-amber-500/[0.08] text-amber-950 dark:text-amber-100' },
};

function ModalityList({ items }: { items: Modality[] }) {
  return (
    <div className="flex min-w-0 flex-wrap gap-2">
      {items.map((item) => {
        const meta = modalityMeta[item];
        const Icon = meta.icon;
        return (
          <span key={item} className={`inline-flex min-h-9 items-center gap-2 rounded-sm border px-3 text-xs font-bold ${meta.tone}`}>
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {meta.label}
          </span>
        );
      })}
    </div>
  );
}

function EvidenceBadge({ contract }: { contract: ModelContract }) {
  const tone = contract.evidenceTone === 'open'
    ? 'border-emerald-600/35 bg-emerald-500/[0.08] text-emerald-900 dark:text-emerald-100'
    : contract.evidenceTone === 'paper'
      ? 'border-sky-600/35 bg-sky-500/[0.08] text-sky-900 dark:text-sky-100'
      : 'border-amber-600/35 bg-amber-500/[0.08] text-amber-950 dark:text-amber-100';
  return <span className={`inline-flex min-h-8 items-center rounded-sm border px-2.5 text-[12px] font-bold ${tone}`}>{contract.evidence}</span>;
}

export function ModalityContractLab() {
  const [selected, setSelected] = useState(0);
  const reduceMotion = useReducedMotion();
  const current = contracts[selected];

  return (
    <figure className="not-prose my-9 overflow-hidden rounded-md border border-border bg-background" data-modality-contract-lab data-viz-canvas>
      <figcaption className="border-b border-border px-4 py-5 sm:px-6">
        <p className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">CONTRACT LAB · 순위가 아닌 입출력 경로</p>
        <h3 className="mt-2 text-lg font-bold leading-snug">같은 “멀티모달”을 일곱 개의 다른 계약으로 펼친다</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">모델을 선택하면 무엇을 받고 무엇을 내보내는지, modality가 어디서 합쳐지는지, 공개 근거가 어디까지인지 한 경로로 읽는다.</p>
      </figcaption>

      <div className="grid lg:grid-cols-[15rem_minmax(0,1fr)]">
        <div className="grid grid-cols-2 gap-px border-b border-border bg-border lg:grid-cols-1 lg:border-b-0 lg:border-r" role="tablist" aria-label="멀티모달 모델 계약 선택">
          {contracts.map((contract, index) => (
            <button
              key={contract.id}
              type="button"
              role="tab"
              id={`model-contract-tab-${contract.id}`}
              aria-controls={`model-contract-panel-${contract.id}`}
              aria-selected={selected === index}
              tabIndex={selected === index ? 0 : -1}
              onClick={() => setSelected(index)}
              onKeyDown={(event) => handleTabKey(event, index, contracts.length, setSelected)}
              className={`min-h-16 min-w-0 bg-background px-3 py-3 text-left transition-colors sm:px-4 ${selected === index ? 'shadow-[inset_3px_0_0_0_hsl(var(--foreground))]' : 'text-muted-foreground hover:bg-muted/30'}`}
            >
              <span className="block text-[12px] font-bold">{contract.date}</span>
              <span className="mt-1 block break-words text-sm font-bold leading-snug text-foreground">{contract.name}</span>
            </button>
          ))}
        </div>

        <motion.div
          key={current.id}
          id={`model-contract-panel-${current.id}`}
          role="tabpanel"
          aria-labelledby={`model-contract-tab-${current.id}`}
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.22 }}
          className="min-w-0"
        >
          <div className="grid gap-px border-b border-border bg-border sm:grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)]">
            <div className="min-w-0 bg-background p-4 sm:p-5">
              <p className="text-[12px] font-bold text-muted-foreground">INPUT</p>
              <div className="mt-3"><ModalityList items={current.inputs} /></div>
            </div>
            <div className="hidden items-center justify-center bg-background sm:flex"><ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" /></div>
            <div className="min-w-0 bg-background p-4 sm:p-5">
              <p className="text-[12px] font-bold text-muted-foreground">OUTPUT</p>
              <div className="mt-3"><ModalityList items={current.outputs} /></div>
            </div>
          </div>

          <div className="divide-y divide-border">
            {[
              { icon: ScanSearch, label: '입력 경계', value: current.entry },
              { icon: Layers3, label: '내부 표현', value: current.representation },
              { icon: Braces, label: '학습·출력 목표', value: current.objective },
            ].map((row) => {
              const Icon = row.icon;
              return (
                <div key={row.label} className="grid min-w-0 gap-3 px-4 py-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:px-5">
                  <div className="flex items-center gap-2 text-xs font-bold"><Icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />{row.label}</div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{row.value}</p>
                </div>
              );
            })}
          </div>

          <div className="border-t border-border bg-muted/20 px-4 py-5 sm:px-5">
            <div className="flex flex-wrap items-center gap-2">
              <BookOpenCheck className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <EvidenceBadge contract={current} />
            </div>
            <p className="mt-3 border-l-2 border-amber-600/50 pl-3 text-sm font-semibold leading-relaxed">{current.boundary}</p>
          </div>
        </motion.div>
      </div>
    </figure>
  );
}

type EvidenceLevel = 'confirmed' | 'limited' | 'missing';

type BudgetScenario = {
  id: 'gemma4' | 'emu3' | 'qwenvlo';
  shortLabel: string;
  date: string;
  task: string;
  contract: string;
  limit: number | null;
  limitLabel: string;
  textTokens: number;
  visualTokens: { compact: number | null; detail: number | null };
  visualCount: number;
  outputReserve: number;
  visualLabel: string;
  tokenSource: string;
  evidence: Array<{
    label: string;
    level: EvidenceLevel;
    note: string;
  }>;
};

const budgetScenarios: BudgetScenario[] = [
  {
    id: 'gemma4',
    shortLabel: 'Gemma 4 · 문서 Q&A',
    date: '2026-07',
    task: 'Image 220장의 검사 보고서를 읽고 text 답변 6K를 남긴다.',
    contract: 'Image input → text output',
    limit: 256_000,
    limitLabel: '12B · 공식 256K context',
    textTokens: 18_000,
    visualTokens: { compact: 280, detail: 1_120 },
    visualCount: 220,
    outputReserve: 6_000,
    visualLabel: 'image input',
    tokenSource: '기술 보고서의 image당 280·1,120 visual token 예시를 같은 fixture에 적용',
    evidence: [
      { label: '입출력 계약', level: 'confirmed', note: 'Model card · image input, text output' },
      { label: 'Token 근거', level: 'confirmed', note: '기술 보고서 · 280/1,120 visual token budget' },
      { label: '실행 artifact', level: 'confirmed', note: '공개 weight와 공식 사용 경로' },
      { label: '독립 runtime trace', level: 'missing', note: 'Latency·memory·업로드 제한은 별도 실측 필요' },
    ],
  },
  {
    id: 'emu3',
    shortLabel: 'Emu3 · Image 생성',
    date: '2026-01',
    task: 'Text prompt에서 512×512 image 한 장을 생성하는 pilot을 준비한다.',
    contract: 'Text input → discrete image output',
    limit: 8_192,
    limitLabel: '학습용 실행 상한 8K · 공식 context 주장 아님',
    textTokens: 1_600,
    visualTokens: { compact: 0, detail: 0 },
    visualCount: 0,
    outputReserve: 4_096,
    visualLabel: 'generated image code (output)',
    tokenSource: 'Nature 논문의 512×512 image → 4,096 discrete visual code를 output reserve로 계산',
    evidence: [
      { label: '입출력 계약', level: 'confirmed', note: 'Peer-reviewed paper · text·image·video 통합' },
      { label: 'Token 근거', level: 'confirmed', note: '512×512 image는 4,096 discrete code' },
      { label: '실행 artifact', level: 'confirmed', note: '공식 repository · Emu3-Gen branch를 지정' },
      { label: '독립 runtime trace', level: 'missing', note: '선택 hardware의 latency·memory 실측 필요' },
    ],
  },
  {
    id: 'qwenvlo',
    shortLabel: 'Qwen VLo · 구조 재현',
    date: '2025-06',
    task: '공식 preview와 같은 image 편집 architecture를 자체 runtime에 재현한다.',
    contract: 'Text·image input → image output',
    limit: null,
    limitLabel: '공개 preview만으로 계산 불가',
    textTokens: 1_600,
    visualTokens: { compact: null, detail: null },
    visualCount: 1,
    outputReserve: 0,
    visualLabel: 'image generation span',
    tokenSource: 'Progressive output은 관찰되지만 representation과 token budget은 공개되지 않음',
    evidence: [
      { label: '제품 capability', level: 'confirmed', note: '공식 preview · image 생성과 편집 관찰' },
      { label: 'Architecture 근거', level: 'limited', note: 'Training objective와 tensor path 미공개' },
      { label: '실행 artifact', level: 'missing', note: '공개 weight·재현 code를 확인할 수 없음' },
      { label: '독립 runtime trace', level: 'missing', note: '자체 구조 재현을 검증할 trace가 없음' },
    ],
  },
];

const evidenceMeta = {
  confirmed: {
    icon: Check,
    label: '확인',
    tone: 'border-emerald-600/30 bg-emerald-500/[0.08] text-emerald-900 dark:text-emerald-100',
  },
  limited: {
    icon: CircleHelp,
    label: '제한',
    tone: 'border-amber-600/30 bg-amber-500/[0.08] text-amber-950 dark:text-amber-100',
  },
  missing: {
    icon: LockKeyhole,
    label: '미확보',
    tone: 'border-border bg-muted/35 text-muted-foreground',
  },
} as const;

function formatTokens(value: number) {
  return new Intl.NumberFormat('ko-KR').format(value);
}

export function MultimodalBudgetEvidenceLab() {
  const [selected, setSelected] = useState(0);
  const [detailMode, setDetailMode] = useState<'compact' | 'detail'>('compact');
  const reduceMotion = useReducedMotion();
  const scenario = budgetScenarios[selected];
  const visualPerItem = scenario.visualTokens[detailMode];
  const visualTotal = visualPerItem === null ? null : visualPerItem * scenario.visualCount;
  const total = visualTotal === null
    ? null
    : scenario.textTokens + visualTotal + scenario.outputReserve;
  const margin = total === null || scenario.limit === null ? null : scenario.limit - total;
  const overflow = margin !== null && margin < 0;
  const traceMissing = scenario.evidence.some((item) => (
    item.label === '독립 runtime trace' && item.level === 'missing'
  ));

  const verdict = total === null || scenario.limit === null
    ? {
        title: '구조 재현 보류',
        detail: 'Capability는 관찰했지만 token 장부와 공개 artifact가 닫히지 않았다.',
        tone: 'border-amber-600/35 bg-amber-500/[0.07]',
        icon: CircleHelp,
      }
    : overflow
      ? {
          title: '예산 초과 · 요청 분할',
          detail: `Context를 ${formatTokens(Math.abs(margin))} token 넘는다. Detail을 낮추거나 image 묶음을 나눈다.`,
          tone: 'border-red-600/35 bg-red-500/[0.06]',
          icon: OctagonX,
        }
      : {
          title: traceMissing ? '예산 통과 · 실측 필요' : '배포 후보',
          detail: traceMissing
            ? '입출력과 token 장부는 통과했다. Production 결론 전 latency·memory·품질 trace를 확보한다.'
            : '요청 예산과 필요한 근거가 모두 닫혔다.',
          tone: 'border-emerald-600/35 bg-emerald-500/[0.06]',
          icon: Gauge,
        };

  const VerdictIcon = verdict.icon;
  const budgetSegments = total !== null && scenario.limit !== null
    ? [
        { label: 'Text', value: scenario.textTokens, tone: 'bg-slate-500 dark:bg-slate-400' },
        { label: 'Visual', value: visualTotal ?? 0, tone: 'bg-sky-600 dark:bg-sky-500' },
        { label: 'Output', value: scenario.outputReserve, tone: 'bg-amber-500 dark:bg-amber-400' },
      ]
    : [];

  return (
    <figure
      className="not-prose my-9 overflow-hidden rounded-md border border-border bg-background"
      data-multimodal-budget-evidence-lab
      data-viz-canvas
    >
      <figcaption className="border-b border-border px-4 py-5 sm:px-6">
        <p className="font-mono text-xs font-bold text-sky-700 dark:text-sky-300">RELEASE LEDGER · 지원 → 예산 → 근거</p>
        <h3 className="mt-2 text-lg font-bold leading-snug">같은 capability를 계산 가능한 배포 판정으로 좁힌다</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          사례를 바꾸면 공식적으로 아는 값, 계산할 수 있는 요청 길이와 공개 가능한 결론이 함께 바뀐다.
        </p>
      </figcaption>

      <div
        className="grid gap-px bg-border sm:grid-cols-3"
        role="tablist"
        aria-label="멀티모달 배포 사례 선택"
      >
        {budgetScenarios.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`budget-scenario-tab-${item.id}`}
            aria-controls={`budget-scenario-panel-${item.id}`}
            aria-selected={selected === index}
            tabIndex={selected === index ? 0 : -1}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => handleTabKey(event, index, budgetScenarios.length, setSelected)}
            className={`min-h-16 min-w-0 bg-background px-4 py-3 text-left transition-colors ${
              selected === index
                ? 'shadow-[inset_0_-3px_0_0_hsl(var(--foreground))]'
                : 'text-muted-foreground hover:bg-muted/30'
            }`}
          >
            <span className="block font-mono text-[12px] font-bold">{item.date}</span>
            <span className="mt-1 block break-words text-sm font-bold leading-snug text-foreground">{item.shortLabel}</span>
          </button>
        ))}
      </div>

      <motion.div
        key={scenario.id}
        id={`budget-scenario-panel-${scenario.id}`}
        role="tabpanel"
        aria-labelledby={`budget-scenario-tab-${scenario.id}`}
        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.22 }}
        className="min-w-0"
      >
        <div className="grid min-w-0 lg:grid-cols-[minmax(0,1.08fr)_minmax(18rem,0.92fr)]">
          <div className="min-w-0 p-4 sm:p-6 lg:border-r lg:border-border">
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_11rem]">
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-muted-foreground">검증할 요청</p>
                <p className="mt-2 text-base font-bold leading-snug">{scenario.task}</p>
                <p className="mt-2 text-sm text-muted-foreground">{scenario.contract}</p>
              </div>
              <div className="min-w-0 border-t border-border pt-3 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
                <p className="text-[12px] font-bold text-muted-foreground">계산 한도</p>
                <p className="mt-2 text-sm font-bold leading-snug">{scenario.limitLabel}</p>
              </div>
            </div>

            <div className="mt-6 border-y border-border py-5">
              <div className="flex min-w-0 flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 text-[12px] font-bold text-muted-foreground">
                    <Calculator className="h-4 w-4" aria-hidden="true" />
                    REQUEST TOTAL
                  </p>
                  <p className="mt-2 font-mono text-2xl font-black tabular-nums" data-budget-total>
                    {total === null ? '계산 보류' : `${formatTokens(total)} token`}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-[12px] font-bold text-muted-foreground">CONTEXT MARGIN</p>
                  <p
                    className={`mt-2 font-mono text-base font-black tabular-nums ${
                      overflow ? 'text-red-700 dark:text-red-300' : margin === null ? 'text-muted-foreground' : 'text-emerald-700 dark:text-emerald-300'
                    }`}
                    data-budget-margin
                  >
                    {margin === null
                      ? '미확정'
                      : `${margin >= 0 ? '+' : '−'}${formatTokens(Math.abs(margin))}`}
                  </p>
                </div>
              </div>

              {scenario.id === 'gemma4' ? (
                <div className="mt-5 grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2" role="group" aria-label="Gemma 4 visual token budget">
                  {([
                    ['compact', '문서 탐색 · 280'],
                    ['detail', '최대 detail · 1,120'],
                  ] as const).map(([mode, label]) => (
                    <button
                      key={mode}
                      type="button"
                      aria-pressed={detailMode === mode}
                      onClick={() => setDetailMode(mode)}
                      className={`min-h-12 bg-background px-3 text-sm font-bold transition-colors ${
                        detailMode === mode ? 'shadow-[inset_0_-2px_0_0_hsl(var(--foreground))]' : 'text-muted-foreground hover:bg-muted/30'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-5 min-h-12 border-y border-border py-3 text-sm font-semibold text-muted-foreground">
                  {scenario.tokenSource}
                </div>
              )}

              {budgetSegments.length > 0 ? (
                <>
                  <div
                    className="mt-5 flex h-3 w-full overflow-hidden rounded-sm bg-muted"
                    aria-label="Context token 구성"
                  >
                    {budgetSegments.map((segment) => (
                      segment.value > 0 ? (
                        <motion.span
                          key={segment.label}
                          initial={reduceMotion ? false : { width: 0 }}
                          animate={{ width: `${Math.min(100, (segment.value / (scenario.limit ?? 1)) * 100)}%` }}
                          transition={{ duration: reduceMotion ? 0 : 0.35 }}
                          className={segment.tone}
                          title={`${segment.label}: ${formatTokens(segment.value)}`}
                        />
                      ) : null
                    ))}
                  </div>
                  <div className="mt-4 divide-y divide-border">
                    {budgetSegments.map((segment) => (
                      <div key={segment.label} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 py-2 text-sm">
                        <span className="text-muted-foreground">{segment.label}</span>
                        <span className="font-mono font-bold tabular-nums">{formatTokens(segment.value)}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="mt-5 border border-dashed border-border px-4 py-5">
                  <p className="text-sm font-bold">Visual span이 미공개라 합계를 닫을 수 없다.</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">알려진 prompt fixture {formatTokens(scenario.textTokens)} token만으로 generation 비용을 추정하지 않는다.</p>
                </div>
              )}
              {scenario.id === 'gemma4' ? (
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{scenario.tokenSource}</p>
              ) : null}
            </div>
          </div>

          <div className="min-w-0 border-t border-border p-4 sm:p-6 lg:border-t-0">
            <p className="text-[12px] font-bold text-muted-foreground">EVIDENCE LADDER</p>
            <div className="mt-3 divide-y divide-border">
              {scenario.evidence.map((item) => {
                const meta = evidenceMeta[item.level];
                const Icon = meta.icon;
                return (
                  <div key={item.label} className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-3 py-3">
                    <span className={`inline-flex h-8 min-w-8 items-center justify-center rounded-sm border px-2 ${meta.tone}`}>
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">{meta.label}</span>
                    </span>
                    <div className="min-w-0">
                      <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                        <p className="text-sm font-bold">{item.label}</p>
                        <span className="text-[12px] font-bold text-muted-foreground">{meta.label}</span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.note}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className={`grid min-w-0 gap-3 border-t px-4 py-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:px-6 ${verdict.tone}`} data-release-verdict>
          <span className="flex h-10 w-10 items-center justify-center rounded-sm border border-current/20">
            <VerdictIcon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-base font-black">{verdict.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{verdict.detail}</p>
          </div>
        </div>
      </motion.div>
    </figure>
  );
}

const routeChoices = [
  {
    id: 'fusion',
    icon: GitBranch,
    symptom: 'Image가 text 사이 어디에 놓이고 context를 얼마나 쓰는지 모르겠다',
    target: 'multimodal-fusion-interleaved-context',
    label: '결합 · Interleaved Context',
    answer: 'Encoder·projector·resampler와 visual token 장부를 계산한다.',
  },
  {
    id: 'token',
    icon: FileImage,
    symptom: '왜 이해용 image feature로는 이미지를 다시 만들 수 없는지 모르겠다',
    target: 'multimodal-visual-tokenization',
    label: '시각 Tokenization',
    answer: 'Semantic feature와 reconstructable code·latent를 분리한다.',
  },
  {
    id: 'video-memory',
    icon: Film,
    symptom: '긴 video·audio가 context를 넘을 때 무엇을 남기고 압축해야 하는지 모르겠다',
    target: 'video-long-context-memory',
    label: '긴 Video · Memory',
    answer: 'Frame·audio token 예산, temporal compression과 외부 memory 경계를 계산한다.',
  },
  {
    id: 'objective',
    icon: Braces,
    symptom: 'Next-token과 diffusion을 한 transformer에서 어떻게 함께 학습하는지 모르겠다',
    target: 'multimodal-unified-generation-objectives',
    label: '통합 생성 Objective',
    answer: 'AR·diffusion·flow loss가 어느 위치와 decoder를 맡는지 따라간다.',
  },
  {
    id: 'paper',
    icon: BookOpenCheck,
    symptom: 'Janus가 왜 두 visual encoder를 택했고 실험이 무엇을 증명했는지 원문에서 확인하고 싶다',
    target: 'paper-janus-2024',
    label: 'Janus 원문 재구성',
    answer: '문제 설정, architecture, 세 단계 학습과 ablation의 일반화 경계를 복원한다.',
  },
  {
    id: 'runtime',
    icon: ScanSearch,
    symptom: '논문 그림이 아니라 공식 코드에서 이해와 생성을 따라가고 싶다',
    target: 'janus-pro-multimodal-runtime',
    label: 'Janus-Pro Runtime',
    answer: 'Processor, embedding, generation loop와 decoder tensor를 추적한다.',
  },
  {
    id: 'diffusion',
    icon: ImageIcon,
    symptom: '하나의 multimodal backbone보다 별도 image diffusion pipeline이 궁금하다',
    target: 'diffusion-models',
    label: '기존 Diffusion 경로',
    answer: 'Noise schedule, denoiser와 sampling 과정으로 이동한다.',
  },
] as const;

export function MultimodalRouteChooser() {
  const [selected, setSelected] = useState(0);
  const current = routeChoices[selected];
  const CurrentIcon = current.icon;

  return (
    <div className="not-prose my-9 overflow-hidden rounded-md border border-border" data-multimodal-route-lab data-viz-canvas>
      <div className="grid gap-px bg-border sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7" role="tablist" aria-label="멀티모달 학습 질문 선택">
        {routeChoices.map((route, index) => {
          const Icon = route.icon;
          return (
            <button
              key={route.id}
              type="button"
              role="tab"
              id={`multimodal-route-tab-${route.id}`}
              aria-controls={`multimodal-route-panel-${route.id}`}
              aria-selected={selected === index}
              tabIndex={selected === index ? 0 : -1}
              onClick={() => setSelected(index)}
              onKeyDown={(event) => handleTabKey(event, index, routeChoices.length, setSelected)}
              className={`min-h-16 min-w-0 bg-background px-3 py-3 text-left transition-colors ${selected === index ? 'shadow-[inset_0_-3px_0_0_hsl(var(--foreground))]' : 'text-muted-foreground hover:bg-muted/30'}`}
            >
              <span className="flex items-center gap-2"><Icon className="h-4 w-4 shrink-0" aria-hidden="true" /><span className="font-mono text-[12px] font-bold">{String(index + 1).padStart(2, '0')}</span></span>
              <span className="mt-2 block text-xs font-bold leading-snug text-foreground">{route.label}</span>
            </button>
          );
        })}
      </div>
      <div
        id={`multimodal-route-panel-${current.id}`}
        role="tabpanel"
        aria-labelledby={`multimodal-route-tab-${current.id}`}
        className="grid min-w-0 gap-5 border-t border-border p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_15rem]"
      >
        <div className="min-w-0">
          <p className="text-[12px] font-bold text-muted-foreground">지금 막힌 질문</p>
          <p className="mt-2 text-lg font-bold leading-snug">{current.symptom}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{current.answer}</p>
        </div>
        <div className="min-w-0 border-t border-border pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <CurrentIcon className="h-5 w-5" aria-hidden="true" />
          <p className="mt-3 text-[12px] font-bold text-muted-foreground">권장 다음 글</p>
          <div className="mt-2 text-sm"><InternalLink slug={current.target}>{current.label}</InternalLink></div>
        </div>
      </div>
    </div>
  );
}
