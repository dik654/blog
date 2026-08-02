import { useMemo, useState, type ReactNode } from 'react';
import {
  ArrowDown,
  Check,
  CircleAlert,
  Database,
  Filter,
  Layers3,
  Radar,
  RefreshCw,
  Route,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Tags,
} from 'lucide-react';
import { motion } from 'framer-motion';
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
      className="not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border bg-background shadow-sm"
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
    <div
      aria-live="polite"
      role="status"
      className={`flex min-w-0 items-start gap-3 border-y py-4 ${good ? 'border-emerald-600/30' : 'border-amber-600/30'}`}
    >
      {good
        ? <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700 dark:text-emerald-300" />
        : <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300" />}
      <div className="min-w-0">
        <p className="text-sm font-bold">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

type RelevanceGoal = 'appearance' | 'defect' | 'cause' | 'action';
type SplitUnit = 'file' | 'product' | 'lot';

const relevanceCandidates = [
  {
    id: 'A',
    appearance: true,
    defect: true,
    cause: false,
    action: false,
    product: 'P-17',
    lot: 'L-03',
    note: '같은 scratch처럼 보이지만 원인은 fixture 접촉',
  },
  {
    id: 'B',
    appearance: false,
    defect: true,
    cause: true,
    action: true,
    product: 'P-44',
    lot: 'L-21',
    note: '모양은 다르지만 같은 coolant 오염 원인',
  },
  {
    id: 'C',
    appearance: true,
    defect: true,
    cause: true,
    action: true,
    product: 'P-17',
    lot: 'L-03',
    note: '같은 제품·lot의 다른 촬영이라 누수 위험',
  },
] as const;

export function RelevanceContractLab() {
  const [goal, setGoal] = useState<RelevanceGoal>('cause');
  const [split, setSplit] = useState<SplitUnit>('file');

  const goalLabel = {
    appearance: '외관이 같은 사례',
    defect: '결함 유형이 같은 사례',
    cause: '원인이 같은 사례',
    action: '조치가 같은 사례',
  }[goal];
  const leaked = split !== 'lot';

  return (
    <LabShell
      lab="relevance-contract"
      eyebrow="Relevance contract lab"
      title="같은 사진도 질문이 바뀌면 positive와 hard negative가 달라진다"
      footer="실제 manifest에는 query_id, independent_group, relevance_grade, adjudicator와 label-finalization time을 남긴다."
    >
      <div className="flex min-w-0 flex-wrap gap-3">
        <SegmentedControl
          label="검색 목적"
          value={goal}
          onChange={setGoal}
          options={[
            { value: 'appearance', label: '외관' },
            { value: 'defect', label: '결함' },
            { value: 'cause', label: '원인' },
            { value: 'action', label: '조치' },
          ]}
        />
        <SegmentedControl
          label="평가 분할 단위"
          value={split}
          onChange={setSplit}
          options={[
            { value: 'file', label: '파일' },
            { value: 'product', label: '제품' },
            { value: 'lot', label: 'Lot' },
          ]}
        />
      </div>

      <div className="border-y border-border">
        <div className="grid grid-cols-[3rem_minmax(0,1fr)_5.5rem] gap-3 py-3 text-[11px] font-semibold text-muted-foreground">
          <span>후보</span>
          <span>관측된 관계</span>
          <span className="text-right">학습 역할</span>
        </div>
        {relevanceCandidates.map((candidate) => {
          const isPositive = candidate[goal];
          const isLeak = candidate.lot === 'L-03' && split !== 'lot';
          const isHardNegative = candidate.appearance && !isPositive;
          const role = isLeak ? '누수 후보' : isPositive ? 'Positive' : isHardNegative ? 'Hard negative' : 'Negative';
          return (
            <motion.div
              key={`${candidate.id}-${goal}-${split}`}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid min-w-0 grid-cols-[3rem_minmax(0,1fr)_5.5rem] gap-3 border-t border-border py-3"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500/[0.08] font-mono text-sm font-bold text-blue-700 dark:text-blue-300">
                {candidate.id}
              </span>
              <div className="min-w-0">
                <p className="break-words text-xs font-semibold">{candidate.note}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  product {candidate.product} · lot {candidate.lot}
                </p>
              </div>
              <span className={`self-center text-right text-[11px] font-bold ${
                isLeak
                  ? 'text-amber-700 dark:text-amber-300'
                  : isPositive
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : 'text-violet-700 dark:text-violet-300'
              }`}>
                {role}
              </span>
            </motion.div>
          );
        })}
      </div>

      <Verdict
        good={!leaked}
        title={leaked ? '평가가 같은 생산 계보를 다시 볼 수 있다' : `${goalLabel} 일반화를 시험한다`}
        description={leaked
          ? '파일이나 제품 단위만 나누면 같은 lot의 거의 같은 촬영이 query와 corpus 양쪽에 남는다.'
          : 'Lot 전체를 한쪽에 묶어 새 생산 계보에서 relevant neighbor를 찾는지 확인한다.'}
      />
    </LabShell>
  );
}

type CorpusScale = 'small' | 'large';
type RetrievalFailure = 'quality' | 'ann' | 'context' | 'ranking';

export function RetrievalStackLab() {
  const [scale, setScale] = useState<CorpusScale>('small');
  const [failure, setFailure] = useState<RetrievalFailure>('quality');

  const decision = {
    quality: {
      stage: 'Encoder·relevance',
      action: 'Exact search에서 false neighbor를 먼저 고친다',
      reason: '근사 index를 바꿔도 잘못된 embedding geometry는 그대로다.',
      icon: <Radar className="h-5 w-5" />,
    },
    ann: {
      stage: 'ANN index',
      action: 'Exact Top-K 대비 ANN recall을 측정한다',
      reason: 'Embedding과 corpus를 고정한 채 index parameter만 비교한다.',
      icon: <Database className="h-5 w-5" />,
    },
    context: {
      stage: 'Metadata filter',
      action: '공정·장비·시점 조건을 후보 생성 전후로 비교한다',
      reason: '가까운 이미지라도 운영 조건이 다르면 조치 근거가 아닐 수 있다.',
      icon: <Filter className="h-5 w-5" />,
    },
    ranking: {
      stage: 'Reranker',
      action: 'High-recall 후보를 pairwise model로 재정렬한다',
      reason: 'Top-K 안에 정답이 있는데 위쪽 순서가 나쁠 때만 reranking이 답한다.',
      icon: <SlidersHorizontal className="h-5 w-5" />,
    },
  }[failure];

  const stages = [
    { label: '좌표계', note: 'encoder·crop·정규화', active: failure === 'quality' },
    { label: scale === 'small' ? 'Exact search' : 'ANN 후보', note: scale === 'small' ? '모든 vector 비교' : '근사 후보 탐색', active: failure === 'ann' },
    { label: 'Metadata', note: '공정·장비·시점', active: failure === 'context' },
    { label: 'Rerank', note: '후보 pair 재평가', active: failure === 'ranking' },
    { label: 'Evidence', note: 'source·원인·조치', active: false },
  ];

  return (
    <LabShell
      lab="retrieval-stack"
      eyebrow="Retrieval stack lab"
      title="검색 실패가 생긴 층과 고쳐야 할 층을 맞춘다"
      footer="ANN latency와 recall은 corpus 크기, vector dimension, hardware, concurrency와 index parameter를 포함한 같은 workload에서 측정한다."
    >
      <div className="flex min-w-0 flex-wrap gap-3">
        <SegmentedControl
          label="Corpus 규모"
          value={scale}
          onChange={setScale}
          options={[
            { value: 'small', label: '작음' },
            { value: 'large', label: '큼' },
          ]}
        />
        <SegmentedControl
          label="관측된 실패"
          value={failure}
          onChange={setFailure}
          options={[
            { value: 'quality', label: '오검색' },
            { value: 'ann', label: 'ANN 누락' },
            { value: 'context', label: '조건 불일치' },
            { value: 'ranking', label: '순서' },
          ]}
        />
      </div>

      <div className="grid min-w-0 gap-2 sm:grid-cols-5">
        {stages.map((stage, index) => (
          <div key={stage.label} className="contents">
            <div className={`min-w-0 border-y py-3 sm:border-y-0 sm:border-l sm:pl-3 ${stage.active ? 'border-blue-600' : 'border-border'}`}>
              <p className={`text-xs font-bold ${stage.active ? 'text-blue-700 dark:text-blue-300' : ''}`}>{stage.label}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{stage.note}</p>
            </div>
            {index < stages.length - 1 && (
              <ArrowDown className="mx-auto h-3.5 w-3.5 text-muted-foreground sm:hidden" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>

      <motion.div
        key={`${scale}-${failure}`}
        aria-live="polite"
        role="status"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid min-w-0 grid-cols-[2.5rem_minmax(0,1fr)] gap-3 border-y border-border py-4"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-violet-500/[0.08] text-violet-700 dark:text-violet-300">
          {decision.icon}
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-muted-foreground">{decision.stage}</p>
          <p className="mt-1 text-sm font-bold">{decision.action}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{decision.reason}</p>
        </div>
      </motion.div>
    </LabShell>
  );
}

const evidenceStages = [
  {
    tab: '01 입력',
    title: '새 결함과 예측 시점의 metadata를 묶는다',
    detail: 'Query image, ROI, product·lot·camera와 아직 확정되지 않은 label을 분리한다.',
  },
  {
    tab: '02 좌표',
    title: '같은 manifest로 query와 corpus를 변환한다',
    detail: 'Encoder, checkpoint, crop, normalization과 embedding version이 모두 같아야 한다.',
  },
  {
    tab: '03 후보',
    title: 'Exact 기준선에서 relevant 후보를 먼저 회수한다',
    detail: 'ANN과 reranker를 넣기 전에 embedding 자체의 false neighbor를 확인한다.',
  },
  {
    tab: '04 검증',
    title: '원본 source와 생산 계보를 다시 연다',
    detail: '점수만 믿지 않고 원인 label, 판정 시점과 조치 기록이 query와 맞는지 검증한다.',
  },
  {
    tab: '05 근거',
    title: '검증된 source만 근거로 채택한다',
    detail: '근거 확정 뒤에도 source id와 version을 남겨 사람이 같은 판정을 다시 확인하게 한다.',
  },
] as const;

export function DefectEvidenceLab() {
  const [active, setActive] = useState(0);

  const move = (next: number) => {
    setActive((next + evidenceStages.length) % evidenceStages.length);
  };

  return (
    <div data-defect-evidence-lab>
      <LabShell
        lab="defect-evidence"
        eyebrow="Evidence flow lab"
        title="높은 similarity를 다시 확인 가능한 근거로 바꾼다"
        footer="근거 채택은 검색 종료가 아니다. Query·corpus·encoder·index·label version을 함께 저장해야 같은 판정을 재현할 수 있다."
      >
        <div
          role="tablist"
          aria-label="결함 검색 근거 확정 단계"
          className="grid min-w-0 grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-5"
        >
          {evidenceStages.map((stage, index) => (
            <button
              key={stage.tab}
              id={`defect-evidence-tab-${index}`}
              type="button"
              role="tab"
              aria-selected={active === index}
              aria-controls="defect-evidence-panel"
              tabIndex={active === index ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => {
                if (event.key === 'Home') {
                  event.preventDefault();
                  setActive(0);
                } else if (event.key === 'End') {
                  event.preventDefault();
                  setActive(evidenceStages.length - 1);
                } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                  event.preventDefault();
                  move(active + 1);
                } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                  event.preventDefault();
                  move(active - 1);
                }
              }}
              className={`min-h-11 min-w-0 bg-background px-2 py-2 text-xs font-semibold transition-colors ${
                active === index
                  ? 'text-blue-700 shadow-[inset_0_-2px_0_0_currentColor] dark:text-blue-300'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {stage.tab}
            </button>
          ))}
        </div>

        <motion.div
          id="defect-evidence-panel"
          role="tabpanel"
          aria-labelledby={`defect-evidence-tab-${active}`}
          key={active}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid min-w-0 gap-4 border-y border-border py-5 sm:grid-cols-[3rem_minmax(0,1fr)_7rem] sm:items-center"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-500/[0.08] font-mono text-sm font-bold text-blue-700 dark:text-blue-300">
            {String(active + 1).padStart(2, '0')}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold">{evidenceStages[active].title}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {evidenceStages[active].detail}
            </p>
          </div>
          <div className="min-w-0 border-t border-border pt-3 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
            <p className="text-[11px] font-semibold text-muted-foreground">현재 상태</p>
            <p className={`mt-1 text-xs font-bold ${active === evidenceStages.length - 1 ? 'text-emerald-700 dark:text-emerald-300' : ''}`}>
              {active === evidenceStages.length - 1 ? '근거 확정' : '검증 중'}
            </p>
          </div>
        </motion.div>
      </LabShell>
    </div>
  );
}

const retrievalSignals = [
  { id: 'appearance', label: '전체 외관 유사', note: '표면 색과 배경이 비슷함' },
  { id: 'roi', label: '결함 ROI', note: '결함 위치와 국소 패턴이 일치함' },
  { id: 'context', label: '공정 맥락 확인', note: '장비·제품·시점이 행동 조건과 맞음' },
] as const;

export function RetrievalPolicyLab() {
  const [selected, setSelected] = useState<Set<string>>(new Set(['appearance']));
  const score = selected.size / retrievalSignals.length;
  const falseNeighbors = retrievalSignals.length - selected.size;

  const toggle = (id: string) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div data-retrieval-policy-lab>
      <LabShell
        lab="retrieval-policy"
        eyebrow="Retrieval policy lab"
        title="겉모습에서 ROI와 공정 맥락으로 relevance를 좁힌다"
        footer="여기 수치는 관계를 보여 주는 교육용 예시다. 실제 threshold는 blind holdout과 판정자 review에서 고정한다."
      >
        <div className="grid min-w-0 gap-2 sm:grid-cols-3">
          {retrievalSignals.map((signal) => {
            const active = selected.has(signal.id);
            return (
              <button
                key={signal.id}
                type="button"
                aria-pressed={active}
                onClick={() => toggle(signal.id)}
                className={`min-h-[5.5rem] min-w-0 border-y px-1 py-3 text-left transition-colors sm:border-l sm:border-y-0 sm:px-3 ${
                  active ? 'border-blue-600 bg-blue-500/[0.04]' : 'border-border bg-background'
                }`}
              >
                <span className={`text-xs font-bold ${active ? 'text-blue-700 dark:text-blue-300' : ''}`}>
                  {signal.label}
                </span>
                <span className="mt-2 block text-[11px] leading-relaxed text-muted-foreground">
                  {signal.note}
                </span>
              </button>
            );
          })}
        </div>

        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border">
          <div className="min-w-0 bg-background p-4">
            <dt className="text-[11px] font-semibold text-muted-foreground">근거 충족률</dt>
            <dd className="mt-1 font-mono text-xl font-bold">{score.toFixed(2)}</dd>
          </div>
          <div className="min-w-0 bg-background p-4">
            <dt className="text-[11px] font-semibold text-muted-foreground">False neighbor</dt>
            <dd className={`mt-1 font-mono text-xl font-bold ${falseNeighbors === 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'}`}>
              {falseNeighbors}
            </dd>
          </div>
        </dl>
      </LabShell>
    </div>
  );
}

type PairTarget = 'instance' | 'defect' | 'cause';
type BatchPolicy = 'random' | 'grouped';

export function PairMiningLab() {
  const [target, setTarget] = useState<PairTarget>('cause');
  const [batch, setBatch] = useState<BatchPolicy>('random');

  const roles = useMemo(() => {
    const candidates = [
      { id: 'B', sameInstance: false, sameDefect: true, sameCause: true, sameLot: false },
      { id: 'C', sameInstance: true, sameDefect: true, sameCause: true, sameLot: true },
      { id: 'D', sameInstance: false, sameDefect: true, sameCause: false, sameLot: false },
      { id: 'E', sameInstance: false, sameDefect: false, sameCause: false, sameLot: false },
    ];
    return candidates.map((candidate) => {
      const positive = target === 'instance'
        ? candidate.sameInstance
        : target === 'defect'
          ? candidate.sameDefect
          : candidate.sameCause;
      const excluded = batch === 'grouped' && candidate.sameLot;
      return {
        ...candidate,
        role: excluded ? '같은 계보 제외' : positive ? 'Positive' : candidate.sameDefect ? 'Hard negative' : 'Negative',
        falseNegative: batch === 'random' && target === 'cause' && candidate.sameCause && !candidate.sameInstance,
      };
    });
  }, [batch, target]);

  const falseNegatives = roles.filter((item) => item.falseNegative).length;

  return (
    <LabShell
      lab="pair-mining"
      eyebrow="Pair mining lab"
      title="Batch가 만든 negative가 실제 task의 negative인지 검사한다"
      footer="대규모 batch나 queue는 negative 수를 늘린다. Relevance label과 entity lineage가 틀리면 더 많은 잘못된 gradient를 빠르게 만든다."
    >
      <div className="flex min-w-0 flex-wrap gap-3">
        <SegmentedControl
          label="가까움의 목표"
          value={target}
          onChange={setTarget}
          options={[
            { value: 'instance', label: '같은 개체' },
            { value: 'defect', label: '같은 결함' },
            { value: 'cause', label: '같은 원인' },
          ]}
        />
        <SegmentedControl
          label="Batch 구성"
          value={batch}
          onChange={setBatch}
          options={[
            { value: 'random', label: 'Random' },
            { value: 'grouped', label: '계보 분리' },
          ]}
        />
      </div>

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-4">
        {roles.map((item) => (
          <motion.div
            key={`${item.id}-${item.role}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-w-0 bg-background p-3"
          >
            <p className="font-mono text-lg font-black">{item.id}</p>
            <p className={`mt-1 break-words text-xs font-bold ${
              item.falseNegative
                ? 'text-amber-700 dark:text-amber-300'
                : item.role === 'Positive'
                  ? 'text-emerald-700 dark:text-emerald-300'
                  : 'text-violet-700 dark:text-violet-300'
            }`}>
              {item.falseNegative ? 'False negative' : item.role}
            </p>
          </motion.div>
        ))}
      </div>

      <Verdict
        good={falseNegatives === 0}
        title={falseNegatives === 0 ? '현재 batch label은 목표와 일치한다' : `${falseNegatives}개의 false negative가 있다`}
        description={falseNegatives === 0
          ? 'Positive와 negative가 독립 계보 안에서 정의되어 loss가 목표 geometry를 학습할 수 있다.'
          : '같은 원인의 B를 negative로 밀면 실제 검색에서 만나야 할 사례의 거리가 멀어진다.'}
      />
    </LabShell>
  );
}

type ShiftKind = 'none' | 'capture' | 'vocabulary' | 'relevance';
type LabelAccess = 'none' | 'pairs';

export function DomainShiftGateLab() {
  const [shift, setShift] = useState<ShiftKind>('capture');
  const [labels, setLabels] = useState<LabelAccess>('none');

  const decision = {
    none: {
      title: 'Frozen baseline을 유지한다',
      reason: 'Target slice에서 검증된 실패가 없으면 adaptation 비용과 regression risk를 추가하지 않는다.',
      icon: <ShieldCheck className="h-5 w-5" />,
    },
    capture: labels === 'none'
      ? {
          title: '전처리·unlabeled continued pretraining을 비교한다',
          reason: 'Camera·조명 분포가 바뀌었지만 relevance label이 없으므로 먼저 acquisition repair와 같은 pretraining objective를 시험한다.',
          icon: <RefreshCw className="h-5 w-5" />,
        }
      : {
          title: '전처리 repair 뒤 supervised pair tuning을 비교한다',
          reason: '촬영 shift와 relevance 오류를 한 run에서 섞지 않고, frozen baseline 대비 pair gain을 확인한다.',
          icon: <SlidersHorizontal className="h-5 w-5" />,
        },
    vocabulary: {
      title: labels === 'none' ? 'Domain-adaptive pretraining 후보' : 'Text pair tuning + vocabulary slice',
      reason: labels === 'none'
        ? '전문 용어가 representation에 없다는 evidence가 있을 때 domain corpus로 원 objective를 계속 학습한다.'
        : 'Query/document relevance pair가 있으므로 vocabulary coverage와 retrieval objective를 함께 검증한다.',
      icon: <Tags className="h-5 w-5" />,
    },
    relevance: labels === 'none'
      ? {
          title: '먼저 relevance label을 수집한다',
          reason: '무엇을 가깝게 해야 하는지 모르면 unsupervised adaptation은 운영 목표를 직접 가르치지 못한다.',
          icon: <CircleAlert className="h-5 w-5" />,
        }
      : {
          title: 'Supervised contrastive·ranking tuning 후보',
          reason: 'Positive와 hard negative가 있으므로 목표 neighborhood를 직접 바꾸고 fixed corpus에서 평가한다.',
          icon: <Route className="h-5 w-5" />,
        },
  }[shift];

  return (
    <LabShell
      lab="domain-shift-gate"
      eyebrow="Adaptation gate"
      title="Shift의 종류와 사용할 수 있는 신호가 첫 개입을 바꾼다"
      footer="각 후보는 target-domain metric뿐 아니라 original-domain anchor set, calibration, latency, memory와 reindex 비용을 함께 통과해야 한다."
    >
      <div className="flex min-w-0 flex-wrap gap-3">
        <SegmentedControl
          label="관측된 이동"
          value={shift}
          onChange={setShift}
          options={[
            { value: 'none', label: '없음' },
            { value: 'capture', label: '촬영' },
            { value: 'vocabulary', label: '전문 용어' },
            { value: 'relevance', label: '가까움 정의' },
          ]}
        />
        <SegmentedControl
          label="정답 pair"
          value={labels}
          onChange={setLabels}
          options={[
            { value: 'none', label: '없음' },
            { value: 'pairs', label: '있음' },
          ]}
        />
      </div>

      <motion.div
        key={`${shift}-${labels}`}
        aria-live="polite"
        role="status"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid min-w-0 grid-cols-[2.5rem_minmax(0,1fr)] gap-3 border-y border-border py-4"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-500/[0.08] text-blue-700 dark:text-blue-300">
          {decision.icon}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold">{decision.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{decision.reason}</p>
        </div>
      </motion.div>
    </LabShell>
  );
}

type PaddingPolicy = 'masked' | 'included';
type PoolingLength = 'short' | 'long';

export function PoolingMaskLab() {
  const [padding, setPadding] = useState<PaddingPolicy>('included');
  const [length, setLength] = useState<PoolingLength>('short');

  const realTokens = length === 'short' ? 3 : 6;
  const totalTokens = 8;
  const denominator = padding === 'masked' ? realTokens : totalTokens;
  const signal = realTokens / denominator;
  const tokens = Array.from({ length: totalTokens }, (_, index) => ({
    label: index < realTokens ? ['query', 'bearing', 'noise', 'root', 'cause', 'manual'][index] : '[PAD]',
    real: index < realTokens,
  }));

  return (
    <LabShell
      lab="pooling-mask"
      eyebrow="Pooling mask lab"
      title="Padding을 평균에 넣으면 짧은 문장의 벡터가 길이 때문에 약해진다"
      footer="수치는 개념을 위한 scalar 예시다. 실제 hidden state는 vector이며, attention mask와 pooling implementation을 model manifest에 고정한다."
    >
      <div className="flex min-w-0 flex-wrap gap-3">
        <SegmentedControl
          label="실제 token 길이"
          value={length}
          onChange={setLength}
          options={[
            { value: 'short', label: '3 token' },
            { value: 'long', label: '6 token' },
          ]}
        />
        <SegmentedControl
          label="Padding 처리"
          value={padding}
          onChange={setPadding}
          options={[
            { value: 'included', label: '포함' },
            { value: 'masked', label: '제외' },
          ]}
        />
      </div>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-8" aria-label="문장 token과 padding">
        {tokens.map((token, index) => {
          const active = token.real || padding === 'included';
          return (
            <motion.div
              key={`${index}-${token.label}-${active}`}
              initial={false}
              animate={{ opacity: active ? 1 : 0.35 }}
              className={`min-w-0 rounded-md border px-1 py-3 text-center text-[10px] font-semibold ${
                token.real
                  ? 'border-blue-600/25 bg-blue-500/[0.06]'
                  : active
                    ? 'border-amber-600/30 bg-amber-500/[0.06]'
                    : 'border-border bg-muted/20'
              }`}
            >
              <span className="block truncate" title={token.label}>{token.label}</span>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-px overflow-hidden rounded-md border border-border bg-border">
        {[
          ['실제 token', String(realTokens)],
          ['평균 분모', String(denominator)],
          ['보존 신호', `${Math.round(signal * 100)}%`],
        ].map(([label, value]) => (
          <div key={label} className="min-w-0 bg-background px-2 py-3 text-center">
            <p className="text-[11px] font-semibold text-muted-foreground">{label}</p>
            <p className="mt-1 font-mono text-sm font-bold sm:text-base">{value}</p>
          </div>
        ))}
      </div>

      <Verdict
        good={padding === 'masked'}
        title={padding === 'masked' ? 'Attention mask로 실제 token만 평균한다' : 'Padding이 문장 표현을 희석한다'}
        description={padding === 'masked'
          ? '문장 길이가 달라도 padding 개수는 embedding의 의미를 바꾸지 않는다.'
          : '짧은 문장이 더 많은 padding을 포함해 같은 의미라도 vector 크기와 방향이 달라질 수 있다.'}
      />
    </LabShell>
  );
}

type InstructionMode = 'correct' | 'missing' | 'swapped';
type RerankMode = 'off' | 'on';

export function TextRetrievalContractLab() {
  const [instruction, setInstruction] = useState<InstructionMode>('missing');
  const [rerank, setRerank] = useState<RerankMode>('off');

  const valid = instruction === 'correct';
  const result = valid
    ? rerank === 'on'
      ? {
          title: 'Bi-encoder 후보 + reranker 순서 검증',
          reason: 'Instruction 계약을 지킨 candidate recall과 pairwise reranking의 NDCG·latency를 따로 측정한다.',
        }
      : {
          title: 'Bi-encoder retrieval baseline',
          reason: '먼저 exact search에서 Recall@K와 slice를 닫은 뒤 ANN과 reranking 필요성을 판단한다.',
        }
    : {
        title: '모델 비교 전에 input contract를 고친다',
        reason: instruction === 'missing'
          ? 'Instruction-aware model에 query 역할을 주지 않아 paper·model-card protocol과 다른 입력이다.'
          : 'Query와 document 역할을 바꾸면 학습한 asymmetric coordinate contract를 거꾸로 사용한다.',
      };

  return (
    <LabShell
      lab="text-retrieval-contract"
      eyebrow="Text retrieval release lab"
      title="같은 문장이라도 query와 document 역할이 입력 계약을 바꾼다"
      footer="Prefix·instruction 문자열은 모델 family와 version마다 다르다. 임의로 번역하거나 공통 문자열로 통일하지 않고 공식 model card와 artifact manifest에 고정한다."
    >
      <div className="flex min-w-0 flex-wrap gap-3">
        <SegmentedControl
          label="Instruction"
          value={instruction}
          onChange={setInstruction}
          options={[
            { value: 'correct', label: '정확함' },
            { value: 'missing', label: '누락' },
            { value: 'swapped', label: '역할 반전' },
          ]}
        />
        <SegmentedControl
          label="Reranker"
          value={rerank}
          onChange={setRerank}
          options={[
            { value: 'off', label: '없음' },
            { value: 'on', label: '사용' },
          ]}
        />
      </div>

      <div className="grid min-w-0 gap-2 sm:grid-cols-3">
        {[
          { label: 'Query encode', note: valid ? '학습된 query instruction' : '계약 불일치', icon: <Search className="h-4 w-4" /> },
          { label: 'Candidate retrieve', note: '고정 corpus에서 Recall@K', icon: <Database className="h-4 w-4" /> },
          { label: 'Order / evidence', note: rerank === 'on' ? 'Rerank + source trace' : 'Dense score + source trace', icon: <Layers3 className="h-4 w-4" /> },
        ].map((stage) => (
          <div key={stage.label} className="min-w-0 border-y border-border py-3 sm:border-y-0 sm:border-l sm:pl-3">
            <span className="text-blue-700 dark:text-blue-300">{stage.icon}</span>
            <p className="mt-2 text-xs font-bold">{stage.label}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{stage.note}</p>
          </div>
        ))}
      </div>

      <Verdict good={valid} title={result.title} description={result.reason} />
    </LabShell>
  );
}
