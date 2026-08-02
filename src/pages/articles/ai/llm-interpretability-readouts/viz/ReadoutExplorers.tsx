import { useState } from 'react';
import {
  ArrowRight,
  Ban,
  CheckCircle2,
  CircleDot,
  FlaskConical,
  Route,
} from 'lucide-react';
import { InternalLink } from '@/components/learning/ArticleLearning';

type LensKind = 'logit' | 'tuned' | 'jacobian';
type EvidenceKind = 'readout' | 'no-effect' | 'single-effect' | 'controlled';
type AttentionCase = 'same-output-a' | 'same-output-b' | 'same-weight-new-value';

const LENS_DATA: Record<LensKind, {
  label: string;
  map: string;
  builtFrom: string;
  asks: string;
  output: string;
  allowed: string;
  boundary: string;
}> = {
  logit: {
    label: 'Logit Lens',
    map: 'Tℓ(r) = r',
    builtFrom: '추가 학습 없음 · final norm과 Wᵁ 재사용',
    asks: '중간 state를 final vocabulary 좌표에 바로 놓으면 무엇이 읽히는가?',
    output: '직접 vocabulary readout',
    allowed: 'final output 좌표에서 token 방향이 직접 읽힌다.',
    boundary: '초기 layer의 좌표 차이와 bias를 보정하지 않는다.',
  },
  tuned: {
    label: 'Tuned Lens',
    map: 'Tℓ(r) = Aℓr + bℓ',
    builtFrom: 'final distribution을 맞추는 layer별 distillation',
    asks: '이 layer에서 final prediction을 가장 잘 예측하는 affine map은 무엇인가?',
    output: '학습된 예측 probe',
    allowed: 'affine probe가 final distribution 구조를 예측할 수 있다.',
    boundary: 'probe가 잘 읽어도 원 모델이 같은 translator를 쓴다는 뜻은 아니다.',
  },
  jacobian: {
    label: 'Jacobian Lens',
    map: 'Tℓ(r) = Jℓr',
    builtFrom: 'prompt·source·future position에 걸친 downstream Jacobian 평균',
    asks: '어떤 방향이 여러 문맥에서 present/future output에 영향을 줄 성향이 있는가?',
    output: '평균 downstream sensitivity readout',
    allowed: '이 corpus에서 token 방향이 verbalizable output에 영향을 줄 성향이 있다.',
    boundary: '평균 map은 이 prompt의 실제 비선형 attribution graph가 아니다.',
  },
};

const EVIDENCE_LABELS: Record<EvidenceKind, string> = {
  readout: '읽기만',
  'no-effect': '개입 · 변화 없음',
  'single-effect': '개입 · 변화 있음',
  controlled: '대조군 · holdout 통과',
};

const ATTENTION_CASES: Record<AttentionCase, {
  label: string;
  description: string;
  weights: [number, number];
  values: [number, number];
  allowed: string;
}> = {
  'same-output-a': {
    label: 'A · 첫 key를 많이 봄',
    description: '큰 weight와 작은 value가 결합한다.',
    weights: [0.8, 0.2],
    values: [1, 0],
    allowed: '첫 key의 projected contribution이 0.8이다.',
  },
  'same-output-b': {
    label: 'B · 둘째 key를 많이 봄',
    description: 'attention map은 반대지만 첫 value의 크기가 네 배다.',
    weights: [0.2, 0.8],
    values: [4, 0],
    allowed: '다른 routing으로도 같은 projected contribution 0.8을 만든다.',
  },
  'same-weight-new-value': {
    label: 'C · weight 같고 내용이 바뀜',
    description: 'Case A의 weight를 유지하고 value content만 바꾼다.',
    weights: [0.8, 0.2],
    values: [0, 2],
    allowed: '같은 attention map에서도 projected contribution이 0.4로 바뀐다.',
  },
};

const METHOD_EVIDENCE: Record<'attention' | LensKind, {
  label: string;
  observed: string;
  readoutAllowed: string;
  readoutForbidden: string;
  readoutNext: string;
  readoutRoute: { slug: string; label: string };
  interventionTarget: string;
  nullRisk: string;
  controlPlan: string;
  closureNext: string;
}> = {
  attention: {
    label: 'Attention',
    observed: 'query가 key의 value를 섞는 routing coefficient',
    readoutAllowed: '이 head가 어느 position에서 정보를 가져올 후보인지 말한다.',
    readoutForbidden: '가장 큰 attention weight가 답의 원인이라고 단정한다.',
    readoutNext: 'value·output projection과 target-vs-contrast logit contribution을 계산한다.',
    readoutRoute: { slug: 'paper-transformer-circuits-2021', label: 'QK·OV 경로' },
    interventionTarget: '선택한 head의 value·output write 또는 source token을 patch한 결과',
    nullRisk: 'weight만 바꾸고 실제 value·output write를 보존했거나 다른 head가 같은 정보를 옮겼을 수 있다.',
    controlPlan: '같은 source를 쓰는 head, OV 방향과 동일 norm의 대조 head를 분리한다.',
    closureNext: 'QK가 고른 source와 OV가 쓴 방향을 downstream consumer까지 연결한다.',
  },
  logit: {
    label: 'Logit Lens',
    observed: 'final norm·unembedding으로 직접 읽은 중간 residual의 token ranking',
    readoutAllowed: 'final vocabulary 좌표에서 이 token 방향이 읽힌다고 말한다.',
    readoutForbidden: '표시된 q를 원 모델의 실제 다음-token 확률이나 숨은 문장으로 부른다.',
    readoutNext: '다른 layer·position과 prompt에서 trajectory를 재현하고 matched patch 후보를 정한다.',
    readoutRoute: { slug: 'llm-interpretability-frontier', label: '현재 증거 사다리' },
    interventionTarget: '직접 unembedding에서 읽힌 residual token 방향을 patch한 결과',
    nullRisk: '초기 layer의 basis·normalization 불일치 때문에 읽은 방향이 실제 feature와 어긋났을 수 있다.',
    controlPlan: '같은 norm의 random residual 방향과 layer·position 대조군을 함께 비교한다.',
    closureNext: '읽힌 residual 방향의 upstream 작성자와 downstream 소비자를 찾는다.',
  },
  tuned: {
    label: 'Tuned Lens',
    observed: 'final output distribution을 예측하도록 학습한 affine probe의 ranking',
    readoutAllowed: '이 layer가 final prediction을 affine하게 예측할 정보를 담는다고 말한다.',
    readoutForbidden: '원 모델이 probe의 Aℓ와 bℓ를 내부 알고리즘으로 사용한다고 말한다.',
    readoutNext: 'probe direction의 원 모델 영향과 intermediate recovery를 별도 측정한다.',
    readoutRoute: { slug: 'llm-interpretability-frontier', label: 'Lens 비교 원문' },
    interventionTarget: '학습한 affine probe가 중요하다고 고른 basis를 ablate한 결과',
    nullRisk: 'probe가 final prediction의 shortcut을 배웠거나 원 모델과 다른 basis를 사용했을 수 있다.',
    controlPlan: 'probe 영향 순위와 원 모델 영향 순위, random basis와 held-out input을 대조한다.',
    closureNext: 'probe의 예측력과 원 모델에서 확인한 causal fidelity를 별도 지표로 보고한다.',
  },
  jacobian: {
    label: 'J-lens',
    observed: 'corpus 평균 downstream Jacobian으로 읽은 vocabulary-disposed direction',
    readoutAllowed: '평균한 문맥 범위에서 이 방향이 output에 영향을 줄 성향이 있다고 말한다.',
    readoutForbidden: '현재 prompt가 그 방향을 실제로 사용했거나 완전한 생각을 드러냈다고 말한다.',
    readoutNext: 'source concept를 matched target으로 바꾸고 layer·position별 output effect를 측정한다.',
    readoutRoute: { slug: 'llm-interpretability-frontier', label: 'J-space 실험' },
    interventionTarget: '평균 Jacobian이 고른 source direction을 swap·clamp한 결과',
    nullRisk: 'corpus 평균 방향이 현재 prompt의 비선형 경로와 다르거나 효과가 여러 position에 분산됐을 수 있다.',
    controlPlan: 'matched concept, random direction, reverse swap과 holdout prompt를 함께 비교한다.',
    closureNext: '평균 방향이 실제로 쓰이는 prompt 범위와 layer regime, downstream consumer를 제한해 적는다.',
  },
};

function claimFor(method: keyof typeof METHOD_EVIDENCE, evidence: EvidenceKind) {
  const base = METHOD_EVIDENCE[method];
  if (evidence === 'readout') {
    return {
      allowed: base.readoutAllowed,
      forbidden: base.readoutForbidden,
      interpretation: '후보를 만든 단계다. 아직 원 모델의 counterfactual output을 측정하지 않았다.',
      next: base.readoutNext,
      route: base.readoutRoute,
    };
  }
  if (evidence === 'no-effect') {
    return {
      allowed: `${base.label}로 고른 후보는 이 prompt·layer·position의 개입에서 필요성을 확인하지 못했다고 말한다.`,
      forbidden: `${base.label}의 null result만으로 표현이 없거나 모델이 이 정보를 전혀 사용하지 않는다고 결론낸다.`,
      interpretation: base.nullRisk,
      next: `${base.interventionTarget}의 fidelity를 확인하고 여러 layer·position 및 backup path를 넓혀 본다.`,
      route: { slug: 'llm-circuit-analysis', label: `${base.label} null result 검증` },
    };
  }
  if (evidence === 'single-effect') {
    return {
      allowed: `${base.label}로 고른 후보가 이 한 intervention 조건에서 output에 causal relevance를 가졌다고 말한다.`,
      forbidden: `${base.label} 후보가 충분하거나 유일하며 전체 mechanism을 설명한다고 말한다.`,
      interpretation: `${base.interventionTarget}가 output을 바꿨지만 아직 다음 대체 설명이 남는다. ${base.nullRisk}`,
      next: base.controlPlan,
      route: { slug: 'llm-circuit-analysis', label: `${base.label} patch 대조군` },
    };
  }
  return {
    allowed: `${base.label}로 고른 후보를 통과한 prompt family와 intervention 범위의 검증된 mechanism component라고 제한해 말한다.`,
    forbidden: `${base.label} 결과를 모든 문맥의 유일한 회로, 모델의 전체 생각 또는 완전한 설명으로 일반화한다.`,
    interpretation: `${base.controlPlan} matched control과 holdout이 대체 설명을 줄였지만 distribution shift와 누락 경로는 남는다.`,
    next: base.closureNext,
    route: { slug: 'llm-circuit-analysis', label: `${base.label} circuit closure` },
  };
}

export function LayerReadoutExplorer() {
  const [lens, setLens] = useState<LensKind>('logit');
  const data = LENS_DATA[lens];

  return (
    <div
      className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border bg-background"
      data-layer-readout-explorer
      data-selected-lens={lens}
    >
      <div className="grid gap-5 border-b border-border bg-muted/20 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
        <div>
          <p className="text-xs font-bold text-muted-foreground">LENS MAP</p>
          <p className="mt-2 text-lg font-bold">같은 activation에 어떤 map을 붙였는지 먼저 본다</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            아래에는 실측 confidence가 없다. 각 도구의 입력, 변환, 출력과 주장 경계만 비교한다.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-1 rounded-md border border-border bg-background p-1">
          {(Object.keys(LENS_DATA) as LensKind[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setLens(key)}
              aria-pressed={lens === key}
              className={`min-h-11 rounded-sm px-2 text-xs font-bold transition-colors ${
                lens === key ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {key === 'jacobian' ? 'J-lens' : LENS_DATA[key].label.replace(' Lens', '')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-px bg-border lg:grid-cols-[minmax(0,1fr)_minmax(15rem,0.72fr)]">
        <div className="min-w-0 bg-background p-4 sm:p-6">
          <div className="grid items-center gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)]">
            <div className="min-w-0 rounded-md border border-border bg-muted/15 p-3">
              <p className="text-xs font-bold text-muted-foreground">관찰</p>
              <p className="mt-2 break-words font-mono text-sm font-bold">rℓ,t</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">layer와 position이 고정된 residual state</p>
            </div>
            <ArrowRight className="mx-auto h-4 w-4 rotate-90 text-muted-foreground sm:rotate-0" aria-hidden="true" />
            <div className="min-w-0 rounded-md border border-border bg-sky-500/[0.05] p-3">
              <p className="text-xs font-bold text-sky-800 dark:text-sky-200">추가 map</p>
              <p className="mt-2 break-words font-mono text-sm font-bold">{data.map}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{data.builtFrom}</p>
            </div>
            <ArrowRight className="mx-auto h-4 w-4 rotate-90 text-muted-foreground sm:rotate-0" aria-hidden="true" />
            <div className="min-w-0 rounded-md border border-border bg-emerald-500/[0.05] p-3">
              <p className="text-xs font-bold text-emerald-800 dark:text-emerald-200">표시</p>
              <p className="mt-2 text-sm font-bold">norm → Wᵁ → softmax</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{data.output}</p>
            </div>
          </div>
          <p className="mt-5 text-sm font-semibold leading-relaxed">{data.asks}</p>
        </div>

        <div className="min-w-0 bg-background">
          <div className="border-b border-border p-4 sm:p-5">
            <p className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-200">
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              여기까지 말할 수 있다
            </p>
            <p className="mt-2 text-sm leading-relaxed">{data.allowed}</p>
          </div>
          <div className="p-4 sm:p-5">
            <p className="flex items-center gap-2 text-xs font-bold text-rose-800 dark:text-rose-200">
              <Ban className="h-4 w-4 shrink-0" aria-hidden="true" />
              아직 말할 수 없다
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{data.boundary}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AttentionCounterexampleExplorer() {
  const [scenario, setScenario] = useState<AttentionCase>('same-output-a');
  const current = ATTENTION_CASES[scenario];
  const contributions = current.weights.map((weight, index) => weight * current.values[index]);
  const projected = contributions.reduce((total, value) => total + value, 0);

  return (
    <div
      className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border bg-background"
      data-attention-contribution-lab
      data-attention-case={scenario}
    >
      <div className="border-b border-border bg-muted/20 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-muted-foreground">ATTENTION CONTRIBUTION</p>
            <p className="mt-2 text-lg font-bold">weight와 value를 따로 바꾸면 원인이 갈라진다</p>
          </div>
          <span className="rounded-sm border border-border bg-background px-2 py-1 text-xs font-semibold text-muted-foreground">
            1D teaching fixture
          </span>
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          실제 head의 vector·output projection을 한 축으로 줄인 계산 예시다. 모델 측정값이 아니다.
        </p>
      </div>

      <div className="grid gap-1 border-b border-border p-4 sm:grid-cols-3 sm:p-6">
        {(Object.keys(ATTENTION_CASES) as AttentionCase[]).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setScenario(id)}
            aria-pressed={scenario === id}
            className={`min-h-11 rounded-md border px-3 py-2 text-left text-xs font-bold leading-snug transition-colors ${
              scenario === id
                ? 'border-foreground bg-foreground text-background'
                : 'border-border bg-background hover:bg-muted'
            }`}
          >
            {ATTENTION_CASES[id].label}
          </button>
        ))}
      </div>

      <div className="grid gap-px bg-border lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="min-w-0 bg-background p-4 sm:p-6">
          <p className="text-sm font-semibold">{current.description}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {current.weights.map((weight, index) => (
              <div key={index} className="min-w-0 border-y border-border py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold">key {index + 1}</span>
                  <code className="text-xs">a={weight.toFixed(1)} · v={current.values[index].toFixed(1)}</code>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-sm bg-muted">
                  <span
                    className="block h-full bg-sky-600 transition-[width] duration-300"
                    style={{ width: `${weight * 100}%` }}
                  />
                </div>
                <p className="mt-3 font-mono text-xs font-bold">
                  projected contribution = {weight.toFixed(1)} × {current.values[index].toFixed(1)} = {contributions[index].toFixed(1)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="min-w-0 bg-background p-4 sm:p-6">
          <p className="text-xs font-bold text-muted-foreground">합쳐진 head output의 1D slice</p>
          <p className="mt-3 font-mono text-3xl font-black tabular-nums">{projected.toFixed(1)}</p>
          <p className="mt-4 text-sm font-semibold leading-relaxed" data-attention-allowed>{current.allowed}</p>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            이 값도 residual과 downstream layer를 통과해야 최종 logit 효과가 된다.
          </p>
        </div>
      </div>
    </div>
  );
}

export function ReadoutClaimLab() {
  const [method, setMethod] = useState<keyof typeof METHOD_EVIDENCE>('attention');
  const [evidence, setEvidence] = useState<EvidenceKind>('readout');
  const methodData = METHOD_EVIDENCE[method];
  const claim = claimFor(method, evidence);

  return (
    <div
      className="foundation-viz-explorer not-prose my-8 scroll-mt-20 overflow-hidden rounded-md border border-border bg-background"
      data-readout-claim-lab
      data-readout-method={method}
      data-readout-evidence={evidence}
    >
      <div className="border-b border-border bg-muted/20 p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-2xl">
            <p className="text-xs font-bold text-muted-foreground">EVIDENCE ESCALATION LAB</p>
            <p className="mt-2 text-lg font-bold">도구 이름보다 증거 수준이 허용 문장을 바꾼다</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              아래 결과는 판단 문법을 연습하는 교육용 상태다. 논문 수치나 model benchmark가 아니다.
            </p>
          </div>
          <span className="rounded-sm border border-border bg-background px-2 py-1 text-xs font-semibold text-muted-foreground">
            teaching fixture
          </span>
        </div>
      </div>

      <div className="grid gap-px border-b border-border bg-border lg:grid-cols-2">
        <fieldset className="min-w-0 bg-background p-4 sm:p-6">
          <legend className="text-sm font-bold">1. 후보를 만든 방법</legend>
          <div className="mt-3 grid grid-cols-2 gap-1">
            {(Object.keys(METHOD_EVIDENCE) as Array<keyof typeof METHOD_EVIDENCE>).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setMethod(key)}
                aria-pressed={method === key}
                className={`min-h-11 rounded-md border px-3 py-2 text-xs font-bold transition-colors ${
                  method === key
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border bg-background hover:bg-muted'
                }`}
              >
                {METHOD_EVIDENCE[key].label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{methodData.observed}</p>
        </fieldset>

        <fieldset className="min-w-0 bg-background p-4 sm:p-6">
          <legend className="text-sm font-bold">2. 원 모델에서 확보한 증거</legend>
          <div className="mt-3 grid grid-cols-2 gap-1">
            {(Object.keys(EVIDENCE_LABELS) as EvidenceKind[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setEvidence(key)}
                aria-pressed={evidence === key}
                className={`min-h-11 rounded-md border px-2 py-2 text-xs font-bold leading-snug transition-colors ${
                  evidence === key
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border bg-background hover:bg-muted'
                }`}
              >
                {EVIDENCE_LABELS[key]}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            같은 readout 후보라도 no-effect, single effect와 controlled replication은 다른 문장을 허용한다.
          </p>
        </fieldset>
      </div>

      <div className="divide-y divide-border">
        <div className="grid gap-3 p-4 sm:grid-cols-[2rem_minmax(0,1fr)] sm:p-6">
          <span className="font-mono text-sm font-bold text-muted-foreground">01</span>
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-bold">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
              허용되는 주장
            </p>
            <p className="mt-2 text-sm leading-relaxed" data-readout-allowed>{claim.allowed}</p>
          </div>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-[2rem_minmax(0,1fr)] sm:p-6">
          <span className="font-mono text-sm font-bold text-muted-foreground">02</span>
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-bold">
              <Ban className="h-4 w-4 shrink-0 text-rose-700 dark:text-rose-300" aria-hidden="true" />
              금지되는 주장
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground" data-readout-forbidden>{claim.forbidden}</p>
          </div>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-[2rem_minmax(0,1fr)] sm:p-6">
          <span className="font-mono text-sm font-bold text-muted-foreground">03</span>
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-bold">
              <CircleDot className="h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true" />
              지금 증거의 뜻
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground" data-readout-interpretation>{claim.interpretation}</p>
          </div>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-[2rem_minmax(0,1fr)] sm:p-6">
          <span className="font-mono text-sm font-bold text-muted-foreground">04</span>
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-bold">
              <FlaskConical className="h-4 w-4 shrink-0 text-sky-700 dark:text-sky-300" aria-hidden="true" />
              다음 측정
            </p>
            <p className="mt-2 text-sm leading-relaxed" data-readout-next>{claim.next}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-border bg-muted/15 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <p className="flex items-center gap-2 text-sm font-bold">
          <Route className="h-4 w-4 shrink-0" aria-hidden="true" />
          다음 경로
        </p>
        <div data-readout-next-route>
          <InternalLink slug={claim.route.slug}>{claim.route.label}</InternalLink>
        </div>
      </div>
    </div>
  );
}
