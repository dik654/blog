import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Binary,
  Boxes,
  BrainCircuit,
  CircleGauge,
  Clock3,
  Database,
  GitCompareArrows,
  ListOrdered,
  Network,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Table2,
} from 'lucide-react';
import { SegmentedControl } from '../../nlp-shared';

function LabFrame({
  eyebrow,
  title,
  children,
  footer,
  dataAttribute,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  footer: ReactNode;
  dataAttribute: string;
}) {
  return (
    <figure
      {...{ [dataAttribute]: '' }}
      className="not-prose my-8 min-w-0 scroll-mt-24 overflow-hidden rounded-md border border-border bg-background"
    >
      <figcaption className="border-b border-border px-4 py-4 sm:px-6">
        <p className="text-[11px] font-bold uppercase text-muted-foreground">{eyebrow}</p>
        <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg">{title}</h3>
      </figcaption>
      <div className="min-w-0 p-4 sm:p-6">{children}</div>
      <div className="border-t border-border bg-muted/15 px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:px-6">
        {footer}
      </div>
    </figure>
  );
}

const boostingRounds = [
  {
    prediction: [6.5, 6.5, 6.5, 6.5],
    residual: [-3.5, -1.5, 1.5, 3.5],
    mse: 7.25,
    rule: '상수 예측: 전체 평균 6.5',
  },
  {
    prediction: [5.25, 5.25, 7.75, 7.75],
    residual: [-2.25, -0.25, 0.25, 2.25],
    mse: 2.56,
    rule: '첫 stump가 왼쪽은 낮추고 오른쪽은 높인다.',
  },
  {
    prediction: [4.13, 5.63, 8.13, 8.13],
    residual: [-1.13, -0.63, -0.13, 1.88],
    mse: 1.30,
    rule: '두 번째 stump가 가장 큰 음의 잔차를 따로 보정한다.',
  },
  {
    prediction: [3.81, 5.31, 7.81, 9.06],
    residual: [-0.81, -0.31, 0.19, 0.94],
    mse: 0.42,
    rule: '세 번째 stump가 오른쪽 끝의 남은 오차를 줄인다.',
  },
] as const;

export function BoostingResidualLab() {
  const [round, setRound] = useState(1);
  const selected = boostingRounds[round];
  const targets = [3, 5, 8, 10];

  return (
    <LabFrame
      eyebrow="Residual correction lab"
      title="트리를 더할 때 어떤 오차가 다음 학습 신호가 되는가"
      dataAttribute="data-boosting-residual-lab"
      footer="이 수치는 원리를 보이기 위한 네 표본 예제다. 실제 학습에서는 매 round의 weak tree가 현재 손실의 음의 기울기를 근사한다."
    >
      <label className="block">
        <span className="flex items-center justify-between gap-3 text-xs font-semibold">
          <span>추가한 weak tree</span>
          <span className="font-mono">{round} round</span>
        </span>
        <input
          aria-label="부스팅 라운드"
          className="mt-3 w-full accent-foreground"
          type="range"
          min={0}
          max={3}
          step={1}
          value={round}
          onChange={(event) => setRound(Number(event.target.value))}
        />
      </label>
      <div className="mt-5 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {targets.map((target, index) => (
          <div key={target} className="min-w-0 bg-background p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>표본 {index + 1}</span>
              <span className="font-mono">y={target}</span>
            </div>
            <p className="mt-3 text-2xl font-bold tabular-nums">{selected.prediction[index].toFixed(2)}</p>
            <p className="mt-1 text-xs text-muted-foreground">현재 예측</p>
            <p className={`mt-3 text-sm font-semibold tabular-nums ${Math.abs(selected.residual[index]) > 1 ? 'text-amber-700 dark:text-amber-300' : 'text-emerald-700 dark:text-emerald-300'}`}>
              잔차 {selected.residual[index] > 0 ? '+' : ''}{selected.residual[index].toFixed(2)}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 border-y border-border py-4 sm:grid-cols-[minmax(0,1fr)_10rem]">
        <div>
          <p className="text-xs font-bold">이번 상태</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{selected.rule}</p>
        </div>
        <div className="sm:text-right">
          <p className="text-xs font-bold">평균 제곱 오차</p>
          <p className="mt-1 font-mono text-xl font-bold">{selected.mse.toFixed(2)}</p>
        </div>
      </div>
    </LabFrame>
  );
}

type TreeScenario = 'category' | 'sparse' | 'scale';

const treeScenarios: Record<TreeScenario, {
  label: string;
  signal: string;
  benchmark: string[];
  mechanism: string;
  caveat: string;
}> = {
  category: {
    label: '범주가 많음',
    signal: '고유값이 많은 범주와 unseen category가 핵심 위험이다.',
    benchmark: ['CatBoost', 'XGBoost + fold encoder'],
    mechanism: 'Ordered target statistics 또는 fold-safe encoder를 비교한다.',
    caveat: 'CatBoost도 cutoff와 validation 경계를 자동으로 대신 정해 주지는 않는다.',
  },
  sparse: {
    label: '희소 입력',
    signal: '0·결측이 많고 feature별 관측 밀도가 크게 다르다.',
    benchmark: ['XGBoost', 'LightGBM'],
    mechanism: 'Sparse-aware split, histogram binning과 메모리 사용량을 함께 측정한다.',
    caveat: '희소성이 “0은 없음”이라는 의미를 보장하지 않는다. 0과 missing을 먼저 구분한다.',
  },
  scale: {
    label: '행이 매우 많음',
    signal: '반복 실험 시간과 메모리 대역폭이 탐색 횟수를 제한한다.',
    benchmark: ['LightGBM', 'XGBoost hist'],
    mechanism: '동일한 wall-clock·메모리 예산에서 histogram 구현을 비교한다.',
    caveat: '행 수만으로 승자를 고르지 않는다. feature 수, sparsity, hardware가 결과를 바꾼다.',
  },
};

export function TreeSystemChoiceLab() {
  const [scenario, setScenario] = useState<TreeScenario>('category');
  const selected = treeScenarios[scenario];

  return (
    <LabFrame
      eyebrow="System choice lab"
      title="라이브러리 이름보다 데이터 병목을 먼저 고른다"
      dataAttribute="data-tree-system-choice-lab"
      footer="추천은 자동 승자 판정이 아니라 먼저 비교할 후보 집합이다. 같은 split, metric, tuning budget과 release constraint로 OOF evidence를 만든다."
    >
      <SegmentedControl
        label="주된 데이터 병목"
        options={(Object.entries(treeScenarios) as Array<[TreeScenario, (typeof treeScenarios)[TreeScenario]]>).map(([value, item]) => ({
          value,
          label: item.label,
        }))}
        value={scenario}
        onChange={setScenario}
      />
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(18rem,1.15fr)]">
        <div className="border-y border-border py-4">
          <ScanSearch className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <p className="mt-3 text-xs font-bold">먼저 관측할 신호</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{selected.signal}</p>
        </div>
        <div className="divide-y divide-border border-y border-border">
          <div className="grid gap-2 py-3 sm:grid-cols-[8rem_minmax(0,1fr)]">
            <strong className="text-xs">비교 후보</strong>
            <div className="flex flex-wrap gap-2">
              {selected.benchmark.map((model) => (
                <span key={model} className="rounded-sm border border-border px-2 py-1 text-xs font-semibold">{model}</span>
              ))}
            </div>
          </div>
          <div className="grid gap-1 py-3 sm:grid-cols-[8rem_minmax(0,1fr)]">
            <strong className="text-xs">비교 이유</strong>
            <p className="text-sm leading-relaxed text-muted-foreground">{selected.mechanism}</p>
          </div>
          <div className="grid gap-1 py-3 sm:grid-cols-[8rem_minmax(0,1fr)]">
            <strong className="text-xs">중단 경고</strong>
            <p className="text-sm leading-relaxed text-muted-foreground">{selected.caveat}</p>
          </div>
        </div>
      </div>
    </LabFrame>
  );
}

type EscalationScenario = 'ordinary' | 'small' | 'multimodal' | 'reuse';

const escalationScenarios: Record<EscalationScenario, {
  label: string;
  evidence: string;
  candidates: string[];
  cost: string;
  verdict: string;
}> = {
  ordinary: {
    label: '일반 정적 표',
    evidence: '수만 행, 숫자·범주 중심, 단일 task',
    candidates: ['CatBoost/XGBoost', '정규화한 MLP'],
    cost: 'Tree baseline을 충분히 튜닝한 뒤 같은 OOF로 비교',
    verdict: '복잡한 neural architecture가 기본값은 아니다.',
  },
  small: {
    label: '작은 표',
    evidence: '행 수가 적고 여러 task에서 빠른 강한 prior가 필요',
    candidates: ['TabPFN-3', 'CatBoost'],
    cost: 'License, GPU memory, calibration과 inference batch를 측정',
    verdict: 'Tabular foundation model을 강한 후보로 추가하되 baseline을 지우지 않는다.',
  },
  multimodal: {
    label: '표 + 텍스트',
    evidence: '상품 설명이나 image embedding과 end-to-end 표현 결합이 필요',
    candidates: ['Feature-token model', 'Late fusion + GBDT'],
    cost: 'Encoder drift, serving latency와 missing modality fallback 필요',
    verdict: 'Neural representation reuse가 추가 비용을 정당화할 가능성이 있다.',
  },
  reuse: {
    label: '여러 task 재사용',
    evidence: '같은 entity·feature schema에서 다수 target과 반복 배포',
    candidates: ['공유 encoder + heads', 'Tabular foundation model', 'task별 GBDT'],
    cost: 'Pretraining amortization과 task별 negative transfer를 함께 측정',
    verdict: '한 task 점수보다 표현 재사용의 총비용이 승격 근거다.',
  },
};

export function TabularEscalationLab() {
  const [scenario, setScenario] = useState<EscalationScenario>('ordinary');
  const selected = escalationScenarios[scenario];

  return (
    <LabFrame
      eyebrow="Escalation lab"
      title="강한 tree baseline 다음에 무엇을 비교할 것인가"
      dataAttribute="data-tabular-escalation-lab"
      footer="모델 계열은 데이터 크기 하나로 결정되지 않는다. OOF 성능, worst slice, calibration, latency, memory와 유지 비용을 같은 release gate에 넣는다."
    >
      <SegmentedControl
        label="문제 조건"
        options={(Object.entries(escalationScenarios) as Array<[EscalationScenario, (typeof escalationScenarios)[EscalationScenario]]>).map(([value, item]) => ({
          value,
          label: item.label,
        }))}
        value={scenario}
        onChange={setScenario}
      />
      <div className="mt-5 grid gap-px overflow-hidden rounded-md border border-border bg-border lg:grid-cols-4">
        {[
          { label: '관측', value: selected.evidence, icon: Table2 },
          { label: '후보 집합', value: selected.candidates.join(' · '), icon: GitCompareArrows },
          { label: '추가 비용', value: selected.cost, icon: CircleGauge },
          { label: '판정', value: selected.verdict, icon: ShieldCheck },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="min-w-0 bg-background p-4">
              <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <p className="mt-3 text-xs font-bold">{item.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.value}</p>
            </div>
          );
        })}
      </div>
    </LabFrame>
  );
}

type RawFeature = 'numeric' | 'category';

const featureTokens: Record<RawFeature, {
  label: string;
  raw: string;
  operation: string;
  token: string[];
  responsibility: string;
}> = {
  numeric: {
    label: '수치형',
    raw: '온도 = 73.4',
    operation: '값 × feature별 방향 + feature 정체성',
    token: ['+0.18', '-0.41', '+0.72', '+0.06'],
    responsibility: '단위, missing policy와 train-only normalization을 고정한다.',
  },
  category: {
    label: '범주형',
    raw: '장치 = B-17',
    operation: '장치 vocabulary에서 embedding row 조회',
    token: ['-0.32', '+0.51', '+0.09', '+0.63'],
    responsibility: 'Unknown category와 vocabulary version을 release한다.',
  },
};

export function FeatureTokenLab() {
  const [kind, setKind] = useState<RawFeature>('numeric');
  const selected = featureTokens[kind];

  return (
    <LabFrame
      eyebrow="Feature token lab"
      title="서로 다른 셀을 같은 d차원 언어로 바꾼다"
      dataAttribute="data-feature-token-lab"
      footer="토큰화는 의미를 자동 생성하지 않는다. 숫자의 단위와 범주의 vocabulary가 잘못되면 Transformer는 잘못된 입력을 더 정교하게 섞을 뿐이다."
    >
      <SegmentedControl
        label="원시 피처 종류"
        options={(Object.entries(featureTokens) as Array<[RawFeature, (typeof featureTokens)[RawFeature]]>).map(([value, item]) => ({
          value,
          label: item.label,
        }))}
        value={kind}
        onChange={setKind}
      />
      <div className="mt-5 grid items-stretch gap-3 md:grid-cols-[minmax(0,0.8fr)_2.25rem_minmax(0,1.2fr)_2.25rem_minmax(0,1fr)]">
        <div className="border-y border-border p-4">
          <Database className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <p className="mt-3 text-xs font-bold">원시 셀</p>
          <p className="mt-1 font-mono text-sm">{selected.raw}</p>
        </div>
        <div className="hidden items-center justify-center md:flex">
          <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        </div>
        <div className="border-y border-border p-4">
          <Binary className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <p className="mt-3 text-xs font-bold">변환</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{selected.operation}</p>
        </div>
        <div className="hidden items-center justify-center md:flex">
          <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        </div>
        <div className="border-y border-border p-4">
          <Network className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <p className="mt-3 text-xs font-bold">d=4 token</p>
          <div className="mt-2 grid grid-cols-2 gap-1 font-mono text-xs">
            {selected.token.map((value) => <span key={value} className="bg-muted/50 px-2 py-1 text-center">{value}</span>)}
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        <strong className="text-foreground">입력 계약:</strong> {selected.responsibility}
      </p>
    </LabFrame>
  );
}

type PriorStage = 'pretrain' | 'adapt';

export function PriorDatasetLab() {
  const [stage, setStage] = useState<PriorStage>('pretrain');
  const pretraining = stage === 'pretrain';

  return (
    <LabFrame
      eyebrow="Prior-data fitted network lab"
      title="한 표에서 weight를 처음부터 맞추는 것과 학습 알고리즘을 미리 배우는 것은 다르다"
      dataAttribute="data-prior-dataset-lab"
      footer="TabPFN 계열의 핵심은 새 표의 train rows와 test rows를 context로 읽어 예측하는 pretrained learner다. 새 표의 validation과 release contract는 여전히 별도로 필요하다."
    >
      <SegmentedControl
        label="관찰할 단계"
        options={[
          { value: 'pretrain', label: '사전학습' },
          { value: 'adapt', label: '새 표 추론' },
        ]}
        value={stage}
        onChange={setStage}
      />
      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,0.75fr)]">
        <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
          {(pretraining
            ? [
                ['합성 표 A', '선형 관계 · 결측'],
                ['합성 표 B', '비선형 · 범주'],
                ['합성 표 C', '상호작용 · 잡음'],
              ]
            : [
                ['새 표 train', 'X와 관측 label'],
                ['새 표 query', 'X와 가려진 label'],
                ['Context', '행·피처 관계를 함께 읽음'],
              ]).map(([label, detail]) => (
            <div key={label} className="min-w-0 bg-background p-4">
              <Table2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <p className="mt-3 text-xs font-bold">{label}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <div className="border-y border-border py-4">
          {pretraining ? <Sparkles className="h-5 w-5 text-blue-700 dark:text-blue-300" aria-hidden="true" /> : <BrainCircuit className="h-5 w-5 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />}
          <p className="mt-3 text-xs font-bold">{pretraining ? '미리 배우는 것' : '새 표에서 하는 것'}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {pretraining
              ? '여러 데이터 생성 prior에서 “표를 보고 예측 규칙을 추론하는 방법”을 weight에 압축한다.'
              : 'Pretrained weight를 context에 적용한다. 일반적인 GBDT처럼 매 task에서 optimizer로 처음부터 긴 tuning을 반복하는 것과 다르다.'}
          </p>
        </div>
      </div>
    </LabFrame>
  );
}

const temporalEvents = [
  { eventAt: 1, availableAt: 1, value: 18, label: '센서 A' },
  { eventAt: 2, availableAt: 4, value: 24, label: '지연 업로드' },
  { eventAt: 4, availableAt: 4, value: 30, label: '센서 B' },
  { eventAt: 5, availableAt: 9, value: 41, label: '배치 집계' },
  { eventAt: 7, availableAt: 7, value: 46, label: '센서 C' },
] as const;

export function TemporalCutoffLab() {
  const [cutoff, setCutoff] = useState(5);
  const rows = temporalEvents.map((event) => ({
    ...event,
    legal: event.eventAt < cutoff && event.availableAt <= cutoff,
  }));

  return (
    <LabFrame
      eyebrow="Availability-time lab"
      title="발생했지만 아직 도착하지 않은 event는 과거가 아니다"
      dataAttribute="data-temporal-cutoff-lab"
      footer="Event time은 t보다 먼저 일어난 사건만 허용해 예측 순간의 사건을 제외한다. Availability time은 t까지 이미 도착한 record를 포함한다. Historical row는 두 조건을 모두 만족해야 한다."
    >
      <label className="block">
        <span className="flex items-center justify-between gap-3 text-xs font-semibold">
          <span>예측 cutoff</span>
          <span className="font-mono">t={cutoff}</span>
        </span>
        <input
          aria-label="예측 cutoff"
          className="mt-3 w-full accent-foreground"
          type="range"
          min={2}
          max={8}
          step={1}
          value={cutoff}
          onChange={(event) => setCutoff(Number(event.target.value))}
        />
      </label>
      <div className="mt-5 divide-y divide-border border-y border-border">
        {rows.map((event) => (
          <div key={`${event.label}-${event.eventAt}`} className="grid min-w-0 gap-2 py-3 sm:grid-cols-[minmax(0,1fr)_8rem_8rem_6rem] sm:items-center">
            <span className="text-sm font-semibold">{event.label}</span>
            <span className="text-xs text-muted-foreground">발생 t={event.eventAt}</span>
            <span className="text-xs text-muted-foreground">도착 t={event.availableAt}</span>
            <span className={`inline-flex w-fit items-center gap-1 text-xs font-bold ${event.legal ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'}`}>
              {event.legal ? <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> : <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />}
              {event.legal ? '사용 가능' : '제외'}
            </span>
          </div>
        ))}
      </div>
    </LabFrame>
  );
}

export function RollingWindowLab() {
  const [windowSize, setWindowSize] = useState(4);
  const cutoff = 8;
  const included = temporalEvents.filter((event) => (
    event.eventAt >= cutoff - windowSize
    && event.eventAt < cutoff
    && event.availableAt <= cutoff
  ));
  const mean = included.reduce((sum, event) => sum + event.value, 0) / Math.max(1, included.length);

  return (
    <LabFrame
      eyebrow="Half-open window lab"
      title="Rolling window의 양 끝을 쓰면 포함되는 사실이 보인다"
      dataAttribute="data-rolling-window-lab"
      footer="표기 [t-w, t)는 왼쪽 경계를 포함하고 prediction cutoff t는 제외한다. 범위 안이어도 t 뒤에 도착한 값은 취소선으로 남기고 평균에서는 제외한다."
    >
      <SegmentedControl
        label="과거 window 길이"
        options={[
          { value: '2', label: '2칸' },
          { value: '4', label: '4칸' },
          { value: '6', label: '6칸' },
        ]}
        value={String(windowSize)}
        onChange={(value) => setWindowSize(Number(value))}
      />
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_12rem]">
        <div className="grid grid-cols-8 gap-1">
          {Array.from({ length: 8 }, (_, index) => {
            const time = index + 1;
            const active = time >= cutoff - windowSize && time < cutoff;
            const events = temporalEvents.filter((event) => event.eventAt === time);
            return (
              <div key={time} className={`min-w-0 overflow-hidden border-t-2 px-1 py-3 text-center ${active ? 'border-blue-600 bg-blue-500/[0.06]' : 'border-border bg-muted/20'}`}>
                <p className="font-mono text-[11px] text-muted-foreground">{time}</p>
                <div className="mt-2 flex min-h-5 flex-col items-center text-xs font-bold">
                  {events.length === 0 ? <span>·</span> : events.map((event) => {
                    const arrived = event.availableAt <= cutoff;
                    return (
                      <span
                        key={`${event.label}-${event.value}`}
                        title={arrived ? `${event.label}: cutoff까지 도착` : `${event.label}: t=${event.availableAt} 도착 예정`}
                        className={arrived ? '' : 'text-amber-700 line-through decoration-2 dark:text-amber-300'}
                      >
                        {event.value}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="border-y border-border py-3">
          <p className="text-xs font-bold">포함한 값</p>
          <p className="mt-1 font-mono text-sm">{included.map((event) => event.value).join(' + ') || '없음'}</p>
          <p className="mt-3 text-xs font-bold">평균</p>
          <p className="mt-1 font-mono text-2xl font-bold">{mean.toFixed(1)}</p>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">취소선 = window 안이지만 cutoff 뒤 도착</p>
        </div>
      </div>
    </LabFrame>
  );
}

type OrderView = 'aggregate' | 'sequence';

const orderHistories = [
  { name: 'A', events: ['검색', '상품', '결제'], next: '재구매 신호' },
  { name: 'B', events: ['결제', '상품', '검색'], next: '이탈·오류 신호' },
] as const;

export function OrderLossLab() {
  const [view, setView] = useState<OrderView>('aggregate');
  const aggregate = view === 'aggregate';

  return (
    <LabFrame
      eyebrow="Order-loss lab"
      title="같은 count가 다른 여정을 숨길 수 있다"
      dataAttribute="data-order-loss-lab"
      footer="Sequence model의 정당성은 “Transformer가 최신이라서”가 아니다. 동일한 flat feature를 가진 표본에서 순서가 target을 바꾸는 OOF evidence가 있어야 한다."
    >
      <SegmentedControl
        label="표현 방식"
        options={[
          { value: 'aggregate', label: '집계 행' },
          { value: 'sequence', label: '순서 보존' },
        ]}
        value={view}
        onChange={setView}
      />
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {orderHistories.map((history) => (
          <div key={history.name} className="border-y border-border py-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-bold">History {history.name}</p>
              {aggregate ? <Boxes className="h-4 w-4 text-muted-foreground" aria-hidden="true" /> : <ListOrdered className="h-4 w-4 text-blue-700 dark:text-blue-300" aria-hidden="true" />}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {(aggregate ? ['검색 1회', '상품 1회', '결제 1회'] : history.events).map((event, index) => (
                <span key={`${event}-${index}`} className="inline-flex items-center gap-2 text-xs font-semibold">
                  <span className="rounded-sm border border-border px-2 py-1">{event}</span>
                  {!aggregate && index < history.events.length - 1 ? <ArrowRight className="h-3 w-3 text-muted-foreground" aria-hidden="true" /> : null}
                </span>
              ))}
            </div>
            <p className={`mt-4 text-sm font-semibold ${aggregate ? 'text-muted-foreground' : 'text-foreground'}`}>
              {aggregate ? '두 history를 구분하지 못함' : history.next}
            </p>
          </div>
        ))}
      </div>
    </LabFrame>
  );
}

const rawSequence = ['로그인', '검색', '상품', '장바구니', '결제'] as const;
type TruncationPolicy = 'recent' | 'early';

export function SequenceInputLab() {
  const [maxLength, setMaxLength] = useState(5);
  const [policy, setPolicy] = useState<TruncationPolicy>('recent');
  const sequence = useMemo(() => {
    if (rawSequence.length <= maxLength) return rawSequence;
    return policy === 'recent'
      ? rawSequence.slice(-maxLength)
      : rawSequence.slice(0, maxLength);
  }, [maxLength, policy]);
  const padded = [...sequence, ...Array.from({ length: Math.max(0, maxLength - sequence.length) }, () => '[PAD]')];
  const truncated = rawSequence.length - sequence.length;

  return (
    <LabFrame
      eyebrow="Sequence tensor lab"
      title="길이를 맞추는 순간 어떤 history를 버렸는지 기록한다"
      dataAttribute="data-sequence-input-lab"
      footer="Padding token은 mask=0으로 계산에서 가린다. 최근 우선과 초기 우선을 바꾸며 같은 max length에서도 어떤 history를 잃는지 확인한다."
    >
      <SegmentedControl
        label="최대 sequence 길이"
        options={[
          { value: '3', label: '3 event' },
          { value: '5', label: '5 event' },
          { value: '7', label: '7 event' },
        ]}
        value={String(maxLength)}
        onChange={(value) => setMaxLength(Number(value))}
      />
      <div className="mt-3">
        <SegmentedControl
          label="Truncation 정책"
          options={[
            { value: 'recent', label: '최근 우선' },
            { value: 'early', label: '초기 우선' },
          ]}
          value={policy}
          onChange={setPolicy}
        />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_14rem]">
        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(4.5rem, 1fr))' }}>
          {padded.map((event, index) => {
            const masked = event === '[PAD]';
            return (
              <div key={`${event}-${index}`} className={`min-w-0 border-t-2 px-1 py-3 text-center ${masked ? 'border-border bg-muted/20 text-muted-foreground' : 'border-blue-600 bg-blue-500/[0.06]'}`}>
                <p className="font-mono text-[10px] text-muted-foreground">{index}</p>
                <p className="mt-2 break-words text-[11px] font-bold [overflow-wrap:anywhere] sm:text-xs">{event}</p>
                <p className="mt-1 text-[10px] font-semibold">{masked ? '차단' : '유효'}</p>
                <p className="font-mono text-[9px]">{masked ? 'm=0' : 'm=1'}</p>
              </div>
            );
          })}
        </div>
        <div className="divide-y divide-border border-y border-border">
          <div className="py-3">
            <p className="text-xs font-bold">잘린 과거</p>
            <p className="mt-1 font-mono text-lg font-bold">{truncated} event</p>
          </div>
          <div className="py-3">
            <p className="text-xs font-bold">Padding</p>
            <p className="mt-1 font-mono text-lg font-bold">{Math.max(0, maxLength - sequence.length)} token</p>
          </div>
          <div className="py-3">
            <p className="text-xs font-bold">Truncation 정책</p>
            <p className="mt-1 text-sm font-semibold">{policy === 'recent' ? '최근 event 보존' : '초기 event 보존'}</p>
          </div>
        </div>
      </div>
    </LabFrame>
  );
}
