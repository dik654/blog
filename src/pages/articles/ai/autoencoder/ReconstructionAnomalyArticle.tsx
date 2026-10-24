import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import AutoencoderSeriesLocator, {
  AutoencoderMapReturn,
} from "./shared/AutoencoderSeriesLocator";
import { ReconstructionAnomalyViz } from "./viz/ModernAutoencoderViz";

const OWNERSHIP = [
  {
    state: "복원 점수",
    owner: "모델 담당자",
    writes: "checkpoint · feature schema · scaler · score 식",
    mustNotWrite: "경보 비용과 최종 threshold",
  },
  {
    state: "검증 자료",
    owner: "데이터 품질 담당자",
    writes: "정상 범위 · 확인된 이상 · split · label provenance",
    mustNotWrite: "test 결과를 본 뒤 threshold 재조정",
  },
  {
    state: "판정 버전",
    owner: "서비스 정책 담당자",
    writes: "threshold · 경보 비용 · 적용 범위",
    mustNotWrite: "model checkpoint와 scaler",
  },
  {
    state: "배포 상태",
    owner: "운영 담당자",
    writes: "그림자 배포 · 단계적 적용 · rollback target",
    mustNotWrite: "검증 fixture의 정답 label",
  },
] as const;

function OwnershipMap() {
  return (
    <figure className="not-prose my-8 border-y border-border py-6">
      <figcaption className="mb-5">
        <p className="text-[10px] font-bold text-primary">상태 소유권</p>
        <p className="mt-1 text-lg font-bold leading-7">
          점수·검증 자료·판정·배포는 서로 다른 상태입니다
        </p>
      </figcaption>
      <div className="grid grid-cols-2 gap-0 lg:grid-cols-4">
        {OWNERSHIP.map((item, index) => (
          <div
            key={item.state}
            className="relative -ml-px -mt-px border border-border p-3 lg:border-y-0 lg:border-r-0 lg:px-4 lg:py-0 first:lg:border-l-0"
          >
            <span className="font-mono text-[10px] font-bold text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-1 text-base font-bold">{item.state}</h3>
            <p className="mt-1 text-xs font-semibold text-primary">{item.owner}</p>
            <p className="mt-3 text-[11px] leading-5 text-foreground sm:text-xs sm:leading-6">기록: {item.writes}</p>
            <p className="mt-1 text-[11px] leading-5 text-muted-foreground sm:text-xs sm:leading-6">
              바꾸지 않음: {item.mustNotWrite}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs leading-6 text-muted-foreground">
        [A] 팀 이름은 환경에 맞게 바꿀 수 있습니다. 중요한 것은 같은 상태를 두 주체가 동시에
        고치지 않는 것입니다.
      </p>
    </figure>
  );
}

function ValidationPlan() {
  const rows = [
    ["가설", "복원 점수가 높은 sample일수록 확인된 이상일 가능성이 높습니다."],
    ["고정", "checkpoint v12 · scaler v4 · feature schema v3 · seed · split"],
    ["fixture", "정상 100건 · 원인이 확인된 이상 20건 (설명용 가정)"],
    ["측정", "precision · recall · false alarms/day · score p95 · 처리 지연"],
    ["반증", "후보 threshold 어디에서도 합의한 경보 부담과 recall을 함께 만족하지 못합니다."],
  ] as const;

  return (
    <figure className="not-prose my-8 border-y border-border py-6">
      <figcaption>
        <p className="text-[10px] font-bold text-primary">검증 계약</p>
        <p className="mt-1 text-lg font-bold leading-7">
          결과를 쓰기 전에 무엇을 고정하고 무엇을 측정할지 적습니다
        </p>
      </figcaption>
      <dl className="mt-5 divide-y divide-border border-y border-border">
        {rows.map(([term, value]) => (
          <div key={term} className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-2 py-2 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-4 sm:py-3">
            <dt className="text-xs font-bold text-muted-foreground">{term}</dt>
            <dd className="text-xs leading-5 sm:text-sm sm:leading-6">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-5 sm:gap-3">
        {[
          ["[M] PRECISION", "미측정"],
          ["[M] RECALL", "미측정"],
          ["[M] FALSE ALARMS / DAY", "미측정"],
        ].map(([label, value]) => (
          <div key={label} className="min-w-0 border border-border p-2 sm:p-4">
            <p className="break-words text-[8px] font-bold leading-4 text-muted-foreground sm:text-[10px]">{label}</p>
            <p className="mt-2 text-sm font-black sm:mt-3 sm:text-2xl">{value}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}

function ReleaseFlow() {
  const steps = [
    ["그림자", "판정은 기록하되 실제 조치는 하지 않습니다."],
    ["일부 적용", "낮은 위험의 대상부터 threshold v7을 사용합니다."],
    ["전면 적용", "합의한 경보 부담과 놓침 한계를 통과한 뒤 넓힙니다."],
    ["되돌리기", "한계를 넘으면 threshold v6 또는 기존 규칙으로 전환합니다."],
  ] as const;

  return (
    <figure className="not-prose my-8 border-y border-border py-6">
      <figcaption>
        <p className="text-[10px] font-bold text-primary">배포와 복구</p>
        <p className="mt-1 text-lg font-bold leading-7">
          같은 model이어도 판정 버전은 독립적으로 되돌립니다
        </p>
      </figcaption>
      <ol className="mt-5 grid gap-0 lg:grid-cols-4">
        {steps.map(([title, body], index) => (
          <li
            key={title}
            className="relative border-t border-border py-4 lg:border-l lg:border-t-0 lg:px-4 lg:py-0 first:lg:border-l-0"
          >
            <span className="font-mono text-[10px] font-bold text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="mt-1 text-sm font-bold">{title}</p>
            <p className="mt-2 text-xs leading-6 text-muted-foreground">{body}</p>
          </li>
        ))}
      </ol>
    </figure>
  );
}

export default function ReconstructionAnomalyArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <AutoencoderSeriesLocator current="anomaly-decision" />
        <h2 className="mb-4 text-2xl font-bold">점수에서 경보까지</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>[A] 출발점:</strong> 고정한 autoencoder가 sample마다 복원 오차를 냅니다.
            이 숫자는 모델이 얼마나 틀렸는지를 나타낼 뿐, 아직 이상 여부나 대응 방법을
            결정하지 않습니다.
          </p>
        </div>
        <ReconstructionAnomalyViz />
        <TermBreakdown
          title="점수에서 경보까지 필요한 대상"
          items={[
            {
              term: "복원 · x̂",
              description: "고정 checkpoint와 preprocessing으로 만든 input 형태의 결과입니다.",
              example: "센서 12개 값을 같은 12개 좌표로 복원합니다.",
              boundary: "강한 decoder는 이상 sample도 잘 복원할 수 있습니다.",
            },
            {
              term: "점수 · s(x)",
              description: "Sample 하나의 feature residual을 하나의 숫자로 줄인 값입니다.",
              example: "12개 제곱 오차의 평균입니다.",
              boundary: "Feature scale이 다르면 큰 단위의 feature가 점수를 지배합니다.",
            },
            {
              term: "판정값 · τ",
              description: "점수를 경보로 바꾸는 버전이 있는 운영 상태입니다.",
              example: "독립 검증 자료에서 여러 후보를 비교합니다.",
              boundary: "Training loss가 판정값을 자동으로 주지 않습니다.",
            },
            {
              term: "분포 변화 감시",
              description: "배포 뒤 정상 점수와 뒤늦게 확인된 정답의 변화를 추적합니다.",
              example: "주별 p95 점수와 하루 잘못된 경보 수를 기록합니다.",
              boundary: "판정값을 고정한 채 입력 분포 변화를 무시하지 않습니다.",
            },
          ]}
        />
        <ContentBoundary article="reconstruction-anomaly-detection" />
      </section>

      <section id="threshold" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">검증하고 정하기</h2>
        <ExplainedFormula
          question="Sample의 점수를 어떻게 경보로 바꿀까요?"
          idea={
            <p>
              Coordinate residual을 평균해 점수를 만들고, 검증 자료와 운영 비용으로 정한
              τ보다 클 때만 경보 후보로 표시합니다. 두 줄을 나누면 model score와 운영
              판정이 서로 다른 상태라는 점이 드러납니다.
            </p>
          }
          formula={String.raw`s(x)=\frac1n\lVert x-g_\phi(f_\theta(x))\rVert_2^2,\quad \hat y=\mathbf1[s(x)>\tau]`}
          annotatedFormula={String.raw`\begin{aligned}s(x)&=\underbrace{\frac1n\sum_{j=1}^{n}(x_j-\hat x_j)^2}_{\text{sample의 복원 오차를 평균}}\\a(x)&=\underbrace{[s(x)>\tau]}_{\text{검증한 판정값을 넘는지 비교}}\\\hat y(x)&=\underbrace{\mathbf1[a(x)]}_{\text{참일 때 경보 후보 생성}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`x_j-\hat x_j`,
              annotation: ["같은 feature 위치의", "복원 residual을 계산합니다"],
            },
            {
              expression: String.raw`\sum_j(x_j-\hat x_j)^2`,
              annotation: ["부호를 없앤 feature 오차를", "sample별로 누적합니다"],
            },
            {
              expression: String.raw`\frac1n`,
              annotation: ["feature 수가 다른 fixture도", "coordinate당 scale로 비교합니다"],
            },
            {
              expression: String.raw`\mathbf1[s(x)>\tau]`,
              annotation: ["연속 점수를 판정값과 비교해", "경보 후보로 바꿉니다"],
            },
          ]}
          terms={[
            {
              symbol: "s(x)",
              name: "복원 점수",
              description: "Sample 하나의 reconstruction distance입니다.",
            },
            {
              symbol: "τ",
              name: "판정값",
              description: "검증 자료와 경보 비용으로 고른 운영 값입니다.",
            },
            {
              symbol: "ŷ",
              name: "경보 후보",
              description: "판정값 비교 뒤의 이진 출력입니다.",
            },
          ]}
          assumptions={[
            "정상 학습 자료가 운영에서 나타나는 정상 양상을 충분히 포함합니다.",
            "Feature scaling과 preprocessing이 train·validation·serve에서 같습니다.",
            "검증용 정답 또는 허용 가능한 잘못된 경보 예산이 있습니다.",
          ]}
          interpretation="점수가 크다는 사실은 ‘모델이 잘 복원하지 못했다’는 뜻입니다. 원인·위험·조치까지 자동으로 식별하지는 않습니다."
        />
        <OwnershipMap />
        <ValidationPlan />
      </section>

      <section id="failure" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">겹침부터 확인</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            [A] 가장 작은 기준선은 <strong>고정 checkpoint + 고정 전처리 + 한 가지 점수식 +
            버전이 있는 판정값</strong>입니다. 이 기준선이 검증 자료에서 분리되지 않으면 더
            복잡한 배포보다 가설을 먼저 기각합니다.
          </p>
          <ul>
            <li><strong>Decoder가 너무 강함</strong><br />이상 sample도 잘 복원해 놓침이 늘어납니다. Bottleneck과 capacity를 줄인 후보를 같은 fixture에서 비교합니다.</li>
            <li><strong>정상 양상이 빠짐</strong><br />학습에 없던 정상 계절 패턴이 큰 점수를 받아 잘못된 경보가 됩니다. 정상 coverage를 먼저 고칩니다.</li>
            <li><strong>Feature 단위가 다름</strong><br />큰 단위 센서가 작은 변화들을 덮습니다. Train에서 맞춘 scaler를 검증과 serving에 그대로 적용합니다.</li>
            <li><strong>Test를 보며 판정값을 고침</strong><br />최종 성능이 낙관적으로 보입니다. Model 학습, 판정값 선택, 최종 보고의 split을 잠급니다.</li>
          </ul>
          <p>
            대안은 같은 책임끼리 비교합니다. 정답 label이 충분하면 supervised classifier,
            명확한 물리 한계가 있으면 규칙 기반 경보, label이 부족하고 정상 복원이 안정적일
            때 reconstruction score를 기준선으로 둡니다. 세 방법을 동시에 최종 판정 주체로
            두지 않습니다.
          </p>
          <p>
            <strong>[M] 현재 결과:</strong> 미측정입니다. 정상 100건과 확인된 이상 20건은
            절차를 설명하는 fixture일 뿐이며, 실제 데이터로 precision·recall·하루 경보 수를
            채우기 전에는 채택 결론을 내리지 않습니다.
          </p>
        </div>
      </section>

      <section id="release" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">배포하고 되돌리기</h2>
        <ReleaseFlow />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            배포 기록에는 checkpoint, feature schema, scaler, missing policy, score 식,
            validation window, threshold, 적용 범위, 이전 판정 버전을 각각 남깁니다. 판정값만
            바뀌어도 새 decision version이며, model을 다시 배포하지 않고 판정만 되돌릴 수
            있어야 합니다.
          </p>
          <h3>장애를 발견한 뒤의 순서</h3>
          <ol>
            <li>경보 수·score 분포·입력 schema가 언제부터 바뀌었는지 확인합니다.</li>
            <li>자동 조치를 중지하고 영향 대상을 격리합니다.</li>
            <li>직전 threshold 또는 기존 규칙 기반 경보로 우회합니다.</li>
            <li>같은 fixture와 새 정상 자료로 원인을 재현합니다.</li>
            <li>그림자 배포부터 다시 시작해 재진입합니다.</li>
          </ol>
          <h3>현재 결정</h3>
          <p>
            <strong>Status: proposed · [A]</strong> reconstruction score는 단독 최종 판정기가
            아니라 검증 가능한 후보 점수로 시작합니다. [M] 같은 fixture에서 합의한 recall과
            경보 부담을 함께 만족하고, 그림자 배포에서 분포 변화와 rollback이 추적될 때만
            단계적으로 적용합니다.
          </p>
          <p>
            결정을 뒤집는 조건은 명확합니다. Supervised 또는 규칙 기반 기준선이 같은 비용으로
            더 안정적이거나, 정상과 이상 점수가 계속 겹치거나, feature·threshold의 소유자를
            정할 수 없다면 reconstruction 기반 판정을 채택하지 않습니다. 이 조건과 실험 자료
            경로를 ADR에 남깁니다.
          </p>
        </div>
        <div id="paper-reconstruction-anomaly" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            source="Sakurada & Yairi — Anomaly Detection Using Autoencoders with Nonlinear Dimensionality Reduction"
            citeKey={1}
            type="paper"
            href="https://doi.org/10.1145/2689746.2689747"
          >
            Autoencoder reconstruction error를 anomaly detection에 적용한 사례입니다. 논문의
            dataset·feature·threshold 조건을 넘어 reconstruction score가 모든 anomaly를
            분리한다고 일반화하지 않습니다.
          </CitationBlock>
        </div>
        <AutoencoderMapReturn current="anomaly-decision" />
      </section>
    </div>
  );
}
