import { useState } from 'react';
import { ArrowRight, Braces, FlaskConical, ScanSearch, Waypoints } from 'lucide-react';
import StepViz from '@/components/ui/step-viz';

type MethodId = 'behavior' | 'attention' | 'lens' | 'sae' | 'attribution' | 'patching';

const METHODS: Array<{
  id: MethodId;
  label: string;
  kind: string;
  claim: string;
  missing: string;
}> = [
  { id: 'behavior', label: '출력 비교', kind: '행동', claim: '이 prompt에서 출력이 달랐다.', missing: '어떤 내부 계산이 차이를 만들었는지는 모른다.' },
  { id: 'attention', label: 'Attention map', kind: '관찰', claim: '특정 query가 어느 position의 value를 섞었는지 본다.', missing: 'weight만으로 value 내용과 downstream 사용을 증명할 수 없다.' },
  { id: 'lens', label: 'Vocabulary lens', kind: 'Readout', claim: '중간 activation에서 어떤 token 방향을 읽을 수 있는지 본다.', missing: '읽을 수 있는 정보가 실제 계산에 사용됐는지는 별도 문제다.' },
  { id: 'sae', label: 'SAE feature', kind: '분해', claim: 'activation을 적은 수의 learned direction으로 근사한다.', missing: 'feature label, 완전성, 원 모델의 사용 여부는 자동 보장되지 않는다.' },
  { id: 'attribution', label: 'Attribution graph', kind: '가설', claim: '이 prompt에서 output으로 이어질 가능성이 큰 경로를 좁힌다.', missing: '근사 graph와 원 모델 mechanism의 일치는 개입으로 확인해야 한다.' },
  { id: 'patching', label: 'Activation patch', kind: '개입', claim: '선택한 내부 상태를 바꾸자 target behavior가 변했다.', missing: '다른 prompt와 control에서도 재현돼야 일반 mechanism을 주장할 수 있다.' },
];

export function EvidenceLadderExplorer() {
  const [selected, setSelected] = useState<MethodId>('lens');
  const method = METHODS.find((item) => item.id === selected) ?? METHODS[0];

  return (
    <div
      data-evidence-ladder
      data-selected-method={selected}
      className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border"
    >
      <div className="border-b border-border bg-muted/20 p-4 sm:p-6">
        <p className="text-[10px] font-black uppercase text-muted-foreground">Evidence ladder</p>
        <p className="mt-2 text-base font-bold">도구 이름이 아니라 허용되는 주장 강도를 고른다</p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">내부 신호가 읽힌다는 사실과 그 신호가 결과의 원인이라는 사실을 분리한다.</p>
      </div>
      <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.75fr)]">
        <div
          className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-3"
          role="group"
          aria-label="해석 증거 단계 선택"
        >
          {METHODS.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={selected === item.id}
              onClick={() => setSelected(item.id)}
              className={`min-h-20 rounded-md border p-3 text-left transition-colors ${selected === item.id ? 'border-foreground bg-foreground text-background' : 'border-border hover:bg-muted/35'}`}
            >
              <span className="font-mono text-[10px] font-black opacity-65">0{index + 1} · {item.kind}</span>
              <span className="mt-2 block text-xs font-bold leading-snug">{item.label}</span>
            </button>
          ))}
        </div>
        <div className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <p className="text-[10px] font-black uppercase text-muted-foreground">이 단계에서 말할 수 있음</p>
          <p className="mt-2 text-sm font-bold leading-relaxed">{method.claim}</p>
          <p className="mt-5 text-[10px] font-black uppercase text-muted-foreground">아직 말할 수 없음</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{method.missing}</p>
        </div>
      </div>
    </div>
  );
}

const JACOBIAN_STEPS = [
  {
    label: '중간 residual 상태를 기준점으로 잡는다',
    body: '읽고 싶은 layer와 position의 hℓ,t를 고정하고, 이 상태가 이후 계산에 주는 영향을 추적할 출발점으로 삼는다.',
  },
  {
    label: 'Prompt마다 남은 계산의 국소 Jacobian을 잰다',
    body: 'hℓ,t가 이후 attention·MLP를 거쳐 hL,t′에 도달하는 동안, 입력을 조금 움직였을 때 최종 상태가 어느 방향으로 얼마나 변하는지 미분한다.',
  },
  {
    label: 'Position과 prompt에 걸쳐 평균한다',
    body: '한 문맥의 우연한 사용을 줄이고, layer ℓ의 방향이 보통 downstream에서 어떻게 전달되는지 하나의 map Jℓ로 만든다.',
  },
  {
    label: '평균 map 뒤에 원 모델의 출력을 붙인다',
    body: 'Jℓhℓ를 final 좌표로 옮긴 뒤 normalization과 unembedding을 적용해 vocabulary ranking을 읽는다.',
  },
];

const PIPELINE_NODES = [
  { label: '중간 상태', detail: 'hℓ,t', icon: ScanSearch, tone: 'border-sky-500/40 bg-sky-500/[0.05]' },
  { label: '남은 계산', detail: 'layer ℓ+1 … L', icon: Waypoints, tone: 'border-border bg-muted/20' },
  { label: '평균 전달 map', detail: 'Jℓ', icon: Braces, tone: 'border-amber-500/40 bg-amber-500/[0.05]' },
  { label: 'Token readout', detail: 'norm → WU → softmax', icon: FlaskConical, tone: 'border-violet-500/40 bg-violet-500/[0.05]' },
];

export function JacobianLensPipelineViz() {
  return (
    <div data-jacobian-pipeline className="foundation-viz-explorer not-prose my-8">
      <StepViz steps={JACOBIAN_STEPS}>
        {(step) => (
          <div className="w-full px-1 py-2 sm:px-3">
            <div className="grid min-w-0 gap-2 md:grid-cols-[minmax(0,1fr)_1.75rem_minmax(0,1fr)_1.75rem_minmax(0,1fr)_1.75rem_minmax(0,1fr)] md:items-stretch">
              {PIPELINE_NODES.map((node, index) => {
                const Icon = node.icon;
                const active = index === step;
                const complete = index <= step;
                return (
                  <div key={node.label} className="contents">
                    <div className={`min-w-0 rounded-md border p-4 transition-colors ${active ? `${node.tone} ring-1 ring-foreground/15` : complete ? node.tone : 'border-border bg-background'}`}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                        <p className="text-[10px] font-black uppercase text-muted-foreground">0{index + 1}</p>
                      </div>
                      <p className="mt-4 text-sm font-bold leading-snug">{node.label}</p>
                      <p className="mt-2 break-words font-mono text-[11px] leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">{node.detail}</p>
                    </div>
                    {index < PIPELINE_NODES.length - 1 && (
                      <div className="hidden items-center justify-center text-muted-foreground md:flex">
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-5 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
              {[
                ['학습 대상 아님', 'Jℓ는 원 모델 weight가 아니라 분석용 평균 map이다.'],
                ['읽는 대상', '한 activation이 미래 출력에 제공하는 평균적인 token 방향이다.'],
                ['보존하지 못함', '현재 prompt의 정확한 비선형 downstream path와 관계 구조.'],
              ].map(([label, detail]) => (
                <div key={label} className="min-w-0 bg-background p-3">
                  <p className="text-[10px] font-black text-muted-foreground">{label}</p>
                  <p className="mt-2 text-xs leading-relaxed">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </StepViz>
    </div>
  );
}

type ToyDirection = {
  id: string;
  label: string;
  vector: number[];
};

const TOY_ACTIVATION = [0.68, 0.5, 0.31, 0.22];
const TOY_DIRECTIONS: ToyDirection[] = [
  { id: 'animal', label: '동물', vector: [1, 0, 0, 0] },
  { id: 'structure', label: '구조', vector: [0, 1, 0, 0] },
  { id: 'count', label: '수량', vector: [0, 0, 1, 0] },
  { id: 'motion', label: '행동', vector: [0, 0, 0, 1] },
  { id: 'animal-structure', label: '동물+구조', vector: [Math.SQRT1_2, Math.SQRT1_2, 0, 0] },
  {
    id: 'structure-count-motion',
    label: '구조+수량+행동',
    vector: [0, 1 / Math.sqrt(3), 1 / Math.sqrt(3), 1 / Math.sqrt(3)],
  },
];

function dot(left: number[], right: number[]) {
  return left.reduce((sum, value, index) => sum + value * right[index], 0);
}

function combinationsOf(indices: number[], size: number): number[][] {
  if (size === 0) return [[]];
  if (indices.length < size) return [];

  return indices.flatMap((value, index) =>
    combinationsOf(indices.slice(index + 1), size - 1).map((tail) => [value, ...tail]),
  );
}

function solveNonnegativeSubset(indices: number[]) {
  const coefficients = indices.map(() => 0);

  // Small coordinate-descent NNLS solver for the fixed teaching example.
  for (let iteration = 0; iteration < 48; iteration += 1) {
    indices.forEach((directionIndex, localIndex) => {
      const withoutCurrent = TOY_ACTIVATION.map((value, dimension) => {
        const explainedByOthers = indices.reduce((sum, candidateIndex, candidateLocalIndex) => {
          if (candidateLocalIndex === localIndex) return sum;
          return sum + coefficients[candidateLocalIndex] * TOY_DIRECTIONS[candidateIndex].vector[dimension];
        }, 0);
        return value - explainedByOthers;
      });
      const direction = TOY_DIRECTIONS[directionIndex].vector;
      coefficients[localIndex] = Math.max(0, dot(direction, withoutCurrent) / dot(direction, direction));
    });
  }

  const reconstruction = TOY_ACTIVATION.map((_, dimension) =>
    indices.reduce(
      (sum, directionIndex, localIndex) =>
        sum + coefficients[localIndex] * TOY_DIRECTIONS[directionIndex].vector[dimension],
      0,
    ),
  );
  const remainder = TOY_ACTIVATION.map((value, index) => value - reconstruction[index]);
  const totalSquaredNorm = dot(TOY_ACTIVATION, TOY_ACTIVATION);
  const remainderSquaredNorm = dot(remainder, remainder);

  return {
    indices,
    coefficients,
    remainderNorm: Math.sqrt(remainderSquaredNorm),
    coverage: Math.max(0, Math.min(100, 100 * (1 - remainderSquaredNorm / totalSquaredNorm))),
  };
}

function bestSparseApproximation(k: number) {
  const directionIndices = TOY_DIRECTIONS.map((_, index) => index);
  const candidates = Array.from({ length: k }, (_, index) => index + 1)
    .flatMap((size) => combinationsOf(directionIndices, size))
    .map(solveNonnegativeSubset);

  return candidates.reduce((best, candidate) =>
    candidate.remainderNorm < best.remainderNorm ? candidate : best,
  );
}

export function JSpaceDecompositionLab() {
  const [k, setK] = useState(2);
  const result = bestSparseApproximation(k);
  const coverage = Math.round(result.coverage);
  const subsetCount = Array.from({ length: k }, (_, index) =>
    combinationsOf(TOY_DIRECTIONS.map((_, directionIndex) => directionIndex), index + 1).length,
  ).reduce((sum, count) => sum + count, 0);
  const selected = result.indices.map((directionIndex, index) => ({
    ...TOY_DIRECTIONS[directionIndex],
    coefficient: result.coefficients[index],
  }));

  return (
    <div
      data-jspace-decomposition
      className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border"
    >
      <div className="grid gap-5 border-b border-border bg-muted/20 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-end">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[10px] font-black uppercase text-muted-foreground">Sparse decomposition lab</p>
            <span className="rounded-sm border border-border bg-background px-1.5 py-0.5 text-[9px] font-black text-muted-foreground">
              개념 계산 예시 · 논문 측정값 아님
            </span>
          </div>
          <p className="mt-2 text-base font-bold">허용 방향 수를 늘리면 설명량과 해석 모호성이 함께 바뀐다</p>
        </div>
        <label
          htmlFor="jspace-sparsity-limit"
          className="grid grid-cols-[1fr_auto] gap-2 text-xs font-bold text-muted-foreground"
        >
          <span>최대 direction 수 k</span>
          <code className="text-foreground">{k}</code>
          <input
            id="jspace-sparsity-limit"
            type="range"
            min="1"
            max="4"
            step="1"
            value={k}
            onChange={(event) => setK(Number(event.target.value))}
            className="col-span-2 block w-full accent-emerald-600"
          />
        </label>
      </div>

      <div className="grid gap-6 p-4 sm:p-6">
        <div className="min-w-0">
          <div
            className="flex h-9 w-full overflow-hidden rounded-sm border border-border bg-muted/25"
            role="progressbar"
            aria-label="희소 J-space 설명량"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={coverage}
          >
            <div
              aria-hidden="true"
              className="grid min-w-0 place-items-center bg-emerald-500/65 px-2 text-[10px] font-black text-emerald-950 transition-[width] dark:text-emerald-950"
              style={{ width: `${coverage}%` }}
            >
              {coverage >= 24 ? `${coverage}%` : ''}
            </div>
            <div
              aria-hidden="true"
              className="grid min-w-0 place-items-center bg-foreground/8 px-2 text-[10px] font-black text-muted-foreground transition-[width]"
              style={{ width: `${100 - coverage}%` }}
            >
              {100 - coverage >= 24 ? `${100 - coverage}%` : ''}
            </div>
          </div>
          <div className="mt-2 flex justify-between gap-4 text-[10px] font-bold text-muted-foreground">
            <span>희소 J-space 설명량</span>
            <span>남은 remainder</span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-3">
            {TOY_DIRECTIONS.map((direction) => {
              const activeDirection = selected.find((item) => item.id === direction.id);
              return (
                <div
                  key={direction.id}
                  className={`min-w-0 border-l-2 pl-3 transition-colors ${
                    activeDirection
                      ? 'border-emerald-500/55'
                      : 'border-border text-muted-foreground'
                  }`}
                >
                  <p className="text-xs font-bold">{direction.label}</p>
                  <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                    {activeDirection
                      ? `양수 계수 ${activeDirection.coefficient.toFixed(2)}`
                      : '이번 근사에서는 미선택'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid min-w-0 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
          <div className="min-w-0 bg-background p-3">
            <p className="text-[10px] font-black text-muted-foreground">설명량</p>
            <output data-jspace-coverage className="mt-1 block text-xl font-black">{coverage}%</output>
            <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">원 vector의 제곱 norm 중 근사가 설명한 비율</p>
          </div>
          <div className="min-w-0 bg-background p-3">
            <p className="text-[10px] font-black text-muted-foreground">남은 크기</p>
            <output data-jspace-remainder className="mt-1 block text-xl font-black">{result.remainderNorm.toFixed(2)}</output>
            <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">근사 뒤 남은 vector의 norm</p>
          </div>
          <div className="min-w-0 bg-background p-3">
            <p className="text-[10px] font-black text-muted-foreground">검토할 조합</p>
            <output data-jspace-ambiguity className="mt-1 block text-xl font-black">{subsetCount}</output>
            <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">6개 후보 중 최대 k개를 고르는 부분집합 수</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 border-t border-border bg-muted/10 p-4 sm:grid-cols-2 sm:p-6">
        <p className="text-xs leading-relaxed text-muted-foreground">
          <strong className="text-foreground">계산 규칙.</strong> 모든 부분집합에 작은 nonnegative least-squares 근사를 적용하고 remainder norm이 가장 작은 조합을 고른다. 실제 연구는 훨씬 큰 overcomplete token direction 집합을 쓴다.
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          <strong className="text-foreground">인과 대조군.</strong> 설명량이 커도 원인이라는 뜻은 아니다. 선택된 component와 같은 norm으로 맞춘 remainder를 각각 개입해 behavior 변화가 어느 쪽에 집중되는지 비교해야 한다.
        </p>
      </div>
    </div>
  );
}

type ExperimentId = 'report' | 'reasoning' | 'broadcast' | 'selectivity';

const EXPERIMENTS: Array<{
  id: ExperimentId;
  label: string;
  setup: string;
  intervention: string;
  changed: string;
  control: string;
  claim: string;
}> = [
  {
    id: 'report',
    label: '말로 보고',
    setup: '“한 sport를 생각한 뒤 말하라”',
    intervention: 'Soccer coordinate를 빼고 Rugby를 넣는다.',
    changed: '보고할 sport가 Rugby 방향으로 이동한다.',
    control: '보고 시점이 아닌 position에서는 즉시 Rugby를 출력하지 않는다.',
    claim: '이 direction은 조건이 맞을 때 말로 꺼낼 수 있는 내용을 운반한다.',
  },
  {
    id: 'reasoning',
    label: '중간 추론',
    setup: 'Entity A의 속성을 두 단계로 묻는다.',
    intervention: '중간 workspace의 Entity A를 같은 범주의 Entity B로 바꾼다.',
    changed: '최종 출력이 Entity B에 맞는 answer 방향으로 이동한다.',
    control: '최종 answer direction swap보다 더 이른 layer에서 intermediate swap 효과가 나타나는지 본다.',
    claim: 'Answer가 아니라 unspoken intermediate가 downstream 계산을 매개했다는 증거가 강해진다.',
  },
  {
    id: 'broadcast',
    label: '여러 계산에 재사용',
    setup: 'France에 capital·language·continent 함수를 각각 적용한다.',
    intervention: '같은 France→China coordinate swap을 모든 함수에 쓴다.',
    changed: 'Beijing·Chinese·Asia처럼 함수별 결과가 함께 이동한다.',
    control: 'Source concept loading이 약한 category와 held-out function에서 실패율을 함께 본다.',
    claim: '같은 representation을 서로 다른 downstream circuit이 공통 argument로 읽는다.',
  },
  {
    id: 'selectivity',
    label: '선택적 사용',
    setup: 'Spanish passage를 보고·추론·이어쓰기·이상 탐지에 각각 사용한다.',
    intervention: '질문 구간의 Spanish coordinate를 French로 바꾼다.',
    changed: '언어 보고와 flexible inference는 French 기준으로 바뀐다.',
    control: 'Spanish 이어쓰기와 language-switch 탐지는 그대로 되는지 본다.',
    claim: 'J-space는 모든 언어 처리가 아니라 보고와 유연한 계산에 선택적으로 필요하다.',
  },
];

export function JSpaceEvidenceLab() {
  const [selected, setSelected] = useState<ExperimentId>('reasoning');
  const experiment = EXPERIMENTS.find((item) => item.id === selected) ?? EXPERIMENTS[0];

  return (
    <div
      data-jspace-evidence
      data-selected-experiment={selected}
      className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border"
    >
      <div className="border-b border-border bg-muted/20 p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[10px] font-black uppercase text-muted-foreground">Causal evidence lab</p>
          <span className="rounded-sm border border-border bg-background px-1.5 py-0.5 text-[9px] font-black text-muted-foreground">
            개념 실험 예시 · 논문 측정값 아님
          </span>
        </div>
        <p className="mt-2 text-base font-bold">같은 direction을 읽고, 바꾸고, 대조군과 비교한다</p>
        <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4" role="group" aria-label="J-space 실험 선택">
          {EXPERIMENTS.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={selected === item.id}
              onClick={() => setSelected(item.id)}
              className={`min-h-11 rounded-md border px-3 py-2 text-left text-xs font-bold transition-colors ${selected === item.id ? 'border-foreground bg-foreground text-background' : 'border-border bg-background hover:bg-muted/35'}`}
            >
              <span className="mr-2 font-mono text-[10px] opacity-60">0{index + 1}</span>{item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid min-w-0 gap-px bg-border lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div className="min-w-0 bg-background p-4 sm:p-5">
          <p className="text-[10px] font-black uppercase text-muted-foreground">원래 질문</p>
          <p className="mt-3 text-sm font-bold leading-relaxed">{experiment.setup}</p>
        </div>
        <div className="min-w-0 bg-background p-4 sm:p-5">
          <p className="text-[10px] font-black uppercase text-muted-foreground">내부 개입</p>
          <p className="mt-3 text-sm font-bold leading-relaxed text-sky-700 dark:text-sky-300">{experiment.intervention}</p>
        </div>
        <div className="min-w-0 bg-background p-4 sm:p-5">
          <p className="text-[10px] font-black uppercase text-muted-foreground">관측된 변화</p>
          <p className="mt-3 text-sm font-bold leading-relaxed text-violet-700 dark:text-violet-300">{experiment.changed}</p>
        </div>
      </div>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-2">
        <div className="min-w-0 border-l-2 border-amber-500/55 pl-4">
          <p className="text-[10px] font-black uppercase text-muted-foreground">반드시 붙일 control</p>
          <p className="mt-2 text-sm leading-relaxed">{experiment.control}</p>
        </div>
        <div className="min-w-0 border-l-2 border-emerald-500/55 pl-4">
          <p className="text-[10px] font-black uppercase text-muted-foreground">여기까지 허용되는 claim</p>
          <p className="mt-2 text-sm leading-relaxed">{experiment.claim}</p>
        </div>
      </div>
    </div>
  );
}

const REGIMES = [
  {
    id: 'early',
    from: 0,
    to: 33,
    label: 'Early · sensory',
    signal: 'Token-local signal이 우세하고 J-lens readout은 대체로 noisy하다.',
    test: 'Readout 실패를 정보 부재로 단정하지 않는다.',
    tone: 'border-sky-500/45 bg-sky-500/[0.05]',
  },
  {
    id: 'workspace',
    from: 33,
    to: 89,
    label: 'Middle · workspace',
    signal: '지속되는 추상 concept와 flexible intervention 효과가 나타난다.',
    test: 'Swap·ablation과 unrelated direction control로 causal use를 확인한다.',
    tone: 'border-emerald-500/45 bg-emerald-500/[0.05]',
  },
  {
    id: 'late',
    from: 89,
    to: 100,
    label: 'Late · motor',
    signal: 'Readout이 imminent next-token output과 빠르게 정렬된다.',
    test: '중간 reasoning과 최종 출력 준비를 같은 representation으로 부르지 않는다.',
    tone: 'border-violet-500/45 bg-violet-500/[0.05]',
  },
];

export function LayerRegimeExplorer() {
  const [depth, setDepth] = useState(60);
  const regime = REGIMES.find((item, index) =>
    depth >= item.from && (index === REGIMES.length - 1 ? depth <= item.to : depth < item.to),
  ) ?? REGIMES[1];
  const regimeColumns = REGIMES.map((item) => `${item.to - item.from}fr`).join(' ');

  return (
    <div
      data-layer-regime
      data-current-regime={regime.id}
      className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border"
    >
      <div className="grid gap-5 border-b border-border bg-muted/20 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
        <div>
          <p className="text-[10px] font-black uppercase text-muted-foreground">Relative depth explorer</p>
          <p className="mt-2 text-base font-bold">같은 token readout도 layer 위치에 따라 의미가 달라진다</p>
        </div>
        <label htmlFor="relative-layer-depth" className="grid grid-cols-[1fr_auto] gap-2 text-xs font-bold text-muted-foreground">
          <span>상대 layer 깊이</span>
          <code className="text-foreground">{depth}%</code>
          <input
            id="relative-layer-depth"
            type="range"
            min="0"
            max="100"
            step="1"
            value={depth}
            onChange={(event) => setDepth(Number(event.target.value))}
            className="col-span-2 block w-full accent-emerald-600"
          />
        </label>
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid gap-1" style={{ gridTemplateColumns: regimeColumns }} aria-hidden="true">
          {REGIMES.map((item) => (
            <div key={item.id} className={`h-2 rounded-sm ${item.id === 'early' ? 'bg-sky-500/60' : item.id === 'workspace' ? 'bg-emerald-500/60' : 'bg-violet-500/60'}`} />
          ))}
        </div>
        <div className="relative mt-1 h-5" aria-hidden="true">
          <span className="absolute top-0 h-4 w-px bg-foreground" style={{ left: `calc(${depth}% - 0.5px)` }} />
        </div>
        <div className={`grid min-w-0 gap-5 rounded-md border p-4 sm:grid-cols-[11rem_minmax(0,1fr)] sm:p-5 ${regime.tone}`}>
          <div>
            <p className="font-mono text-[10px] font-black text-muted-foreground">현재 구간</p>
            <p className="mt-2 text-sm font-black">{regime.label}</p>
          </div>
          <div className="grid min-w-0 gap-4 sm:grid-cols-2">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase text-muted-foreground">보이는 신호</p>
              <p className="mt-2 text-sm leading-relaxed">{regime.signal}</p>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase text-muted-foreground">해석 규칙</p>
              <p className="mt-2 text-sm leading-relaxed">{regime.test}</p>
            </div>
          </div>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          이 비율은 원문의 특정 모델에서 관찰한 구간을 설명하기 위한 상대 모형이다. 모든 Transformer가 정확히 같은 경계에서 바뀐다는 뜻은 아니다.
        </p>
      </div>
    </div>
  );
}
