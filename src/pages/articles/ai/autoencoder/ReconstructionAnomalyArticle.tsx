import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { ReconstructionAnomalyViz } from "./viz/ModernAutoencoderViz";

export default function ReconstructionAnomalyArticle() {
  return <div className="space-y-16">
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Reconstruction error는 anomaly label이 아니라 sample별 score입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="text-lg leading-8">
            가정은 이렇습니다. 정상 data로 학습한 autoencoder라면 정상 패턴은 잘 복원하고 낯선 패턴은 크게 틀립니다. 먼저 input과 reconstruction의 거리를
            한 sample의 score로 만들고 판정은 다음 단계에서 별도로 calibration합니다.
          </p></div>
      <TermBreakdown title="점수에서 alarm까지 필요한 대상" items={[
        { term: "Reconstruction · x̂", description: "고정 checkpoint와 preprocessing으로 만든 input-shaped output입니다.", example: "센서 12개 값을 다시 예측합니다.", boundary: "강한 decoder는 anomaly도 잘 복원할 수 있습니다." },
        { term: "Score · s(x)", description: "Sample 하나의 feature residual을 하나의 숫자로 줄인 값입니다.", example: "12개 squared error의 평균입니다.", boundary: "Feature scale이 다르면 큰 단위 feature가 score를 지배합니다." },
        { term: "Threshold · τ", description: "Score를 alert로 바꾸는 운영 경계입니다.", example: "Validation normal의 99th percentile을 후보로 둡니다.", boundary: "Training loss가 threshold를 자동으로 주지 않습니다." },
        { term: "Drift monitor", description: "배포 뒤 정상 score 분포와 delayed label 성능의 변화를 추적합니다.", example: "주별 p95 score와 false alarms/day를 기록합니다.", boundary: "Threshold를 고정한 채 data drift를 무시하지 않습니다." },
      ]} />
      <ReconstructionAnomalyViz />
      <ContentBoundary article="reconstruction-anomaly-detection" />
    </section>

    <section id="threshold" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Threshold는 labeled validation과 비용으로 선택합니다</h2>
      <ExplainedFormula question="Sample score를 어떻게 anomaly decision으로 바꿀까요?" idea={<p>
            Coordinate residual을 평균해 score를 만들고 validation에서 선택한 τ보다 클 때만 alert합니다. 두 줄은 model score와 운영
            decision이 다른 소유자임을 보여 줍니다.
          </p>} formula={String.raw`s(x)=\frac1n\lVert x-g_\phi(f_\theta(x))\rVert_2^2,\quad \hat y=\mathbf1[s(x)>\tau]`} annotatedFormula={String.raw`\begin{aligned}s(x)&=\underbrace{\frac1n\sum_{j=1}^{n}(x_j-\hat x_j)^2}_{\text{sample의 복원 오차를 평균}}\\a(x)&=\underbrace{[s(x)>\tau]}_{\text{validation threshold 초과 여부}}\\\hat y(x)&=\underbrace{\mathbf1[a(x)]}_{\text{참일 때 anomaly alert 생성}}\end{aligned}`} operations={[
        { expression: String.raw`x_j-\hat x_j`, annotation: ["같은 feature 위치의", "복원 residual 계산"] },
        { expression: String.raw`\sum_j(x_j-\hat x_j)^2`, annotation: ["부호를 없앤 feature 오차를", "sample score 후보로 누적"] },
        { expression: String.raw`\frac1n`, annotation: ["feature 수가 다른 fixture도", "coordinate당 scale로 비교"] },
        { expression: String.raw`\mathbf1[s(x)>\tau]`, annotation: ["연속 score를 운영 threshold와 비교해", "binary alert로 변환"] },
      ]} terms={[
        { symbol: "s(x)", name: "Anomaly score", description: "Sample 하나의 reconstruction distance입니다." },
        { symbol: "τ", name: "Decision threshold", description: "Validation data와 cost로 고른 운영 값입니다." },
        { symbol: "ŷ", name: "Alert decision", description: "Threshold comparison 뒤의 binary output입니다." },
      ]} assumptions={["Normal training data가 운영 normal modes를 충분히 포함합니다.", "Feature scaling과 preprocessing이 train·validation·serve에서 같습니다.", "Validation labels 또는 false-positive budget이 있습니다."]} interpretation="Score가 크다는 사실은 ‘모델이 잘 복원하지 못했다’는 뜻입니다. 원인·위험·조치까지 자동으로 식별하지는 않습니다." />
    </section>

    <section id="failure" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">정상 score와 anomaly score가 겹치는 반례부터 봅니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><ul>
        <li><strong>Identity-like decoder</strong><br />Capacity가 커 anomaly도 잘 복원해 false negative가 늘어납니다.</li>
        <li><strong>Missing normal mode</strong><br />Training에 없던 정상 계절 패턴이 false positive가 됩니다.</li>
        <li><strong>Feature-scale domination</strong><br />큰 단위 센서 하나가 중요한 작은 변화들을 덮습니다.</li>
        <li><strong>Threshold leakage</strong><br />Test anomaly를 보며 τ를 조정하면 최종 성능이 낙관적으로 보입니다.</li>
      </ul></div>
    </section>

    <section id="release" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">배포 receipt에는 model보다 calibration provenance를 더 많이 남깁니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            Checkpoint와 feature schema, scaler와 missing policy, score reduction과 validation window, threshold,
            precision/recall·false alarms/day·drift trigger를 서로 다른 줄로 기록합니다. Threshold를 바꾸면 model weight가 같아도
            새 decision version입니다.
          </p></div>
      <div id="paper-reconstruction-anomaly" className="not-prose mt-8 scroll-mt-24"><CitationBlock source="Sakurada & Yairi — Anomaly Detection Using Autoencoders with Nonlinear Dimensionality Reduction" citeKey={1} type="paper" href="https://doi.org/10.1145/2689746.2689747">Autoencoder reconstruction error를 anomaly detection에 적용한 사례입니다. 논문의 dataset·feature·threshold 조건을 넘어 reconstruction score가 모든 anomaly를 분리한다고 일반화하지 않습니다.</CitationBlock></div>
    </section>
  </div>;
}
