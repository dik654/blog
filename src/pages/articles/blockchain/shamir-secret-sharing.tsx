import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import ContentBoundary from "@/components/articles/content-boundary";

const SHARES = [
  ["f(0)", "5", "secret · 배포 금지"],
  ["f(1)", "8", "P1 share"],
  ["f(2)", "11", "P2 share"],
  ["f(3)", "14", "P3 share"],
] as const;

export default function ShamirSecretSharingArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5">
        <h2 className="text-3xl font-bold">Secret을 값 조각이 아니라 polynomial points로 나눈다</h2>
        <p className="text-lg leading-8">
          Shamir Secret Sharing은 secret을 degree-t polynomial의 상수항으로 숨기고 서로 다른 nonzero x에서 평가한 points를 parties에
          나눕니다. t+1개 points는 polynomial을 유일하게 정하지만 t개 이하는 secret 후보를 하나로 결정하지 못합니다. 이 글은 그
          correctness·privacy와 plain sharing이 보장하지 않는 active security를 분리합니다.
        </p>
        <ContentBoundary article="shamir-secret-sharing" />
      </section>

      <section id="share-generation" className="space-y-5">
        <h2 className="text-2xl font-bold">Share generation: random coefficients가 privacy를 만든다</h2>
        <p>
          F₁₇에서 secret s=5와 threshold degree t=1을 선택하고 uniform random coefficient a₁=3을 뽑으면 f(x)=5+3x입니다.
          Index 0은 f(0)=s이므로 share로 배포하지 않고 parties에는 distinct nonzero field elements를 배정합니다.
        </p>
        <figure data-viz="shamir-share-points" className="not-prose rounded-xl border border-border bg-card p-5">
          <figcaption className="text-sm font-semibold">F₁₇에서 f(x)=5+3x의 points</figcaption>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            {SHARES.map(([point, value, role]) => (
              <div key={point} className="rounded-lg border border-border bg-background p-4">
                <p className="font-mono text-sm text-primary">{point} = {value}</p>
                <p className="mt-2 text-xs text-muted-foreground">{role}</p>
              </div>
            ))}
          </div>
        </figure>
      </section>

      <section id="reconstruction" className="space-y-5">
        <h2 className="text-2xl font-bold">Reconstruction: Lagrange basis를 x=0에서 평가한다</h2>
        <ExplainedFormula
          question="t+1 shares는 어떻게 secret f(0)를 복원할까요?"
          idea={<>Degree t polynomial은 t+1 points로 유일하게 정해집니다. Lagrange basis를 x=0에서 평가해 share values의 field-linear combination을 만듭니다.</>}
          formula={String.raw`s=f(0)=\sum_{i\in S}y_i\prod_{j\in S,j\ne i}\frac{-x_j}{x_i-x_j},\qquad |S|=t+1`}
          annotatedFormula={String.raw`s=f(0)=\underbrace{\sum_{i\in S}y_i\underbrace{\prod_{j\in S,j\ne i}\frac{-x_j}{x_i-x_j}}_{\text{x=0에서 i번째 Lagrange basis 계산}}}_{\text{share별 기여를 field에서 합산}},\qquad |S|=t+1`}
          operations={[
            {
              expression: String.raw`\prod_{j\in S,j\ne i}\frac{-x_j}{x_i-x_j}`,
              annotation: ["다른 share indices와의 field inverse를 곱해", "i번째 share의 x=0 기여 weight 계산"],
            },
            {
              expression: String.raw`\sum_{i\in S}y_i\ell_i(0)`,
              annotation: ["각 share value에 자기 basis weight를 곱하고", "field 안에서 모두 더해 f(0)를 복원"],
            },
          ]}
          terms={[
            { symbol: "s", name: "secret", description: "Polynomial의 constant term f(0)입니다." },
            { symbol: "(x_i,y_i)", name: "share", description: "Distinct nonzero x_i에서 계산한 y_i=f(x_i)입니다." },
            { symbol: "t", name: "privacy threshold degree", description: "t개 이하는 숨기고 t+1개로 복원하는 polynomial degree입니다." },
          ]}
          assumptions={[
            "모든 산술은 같은 finite field에서 수행하고 denominator는 0이 아니어야 합니다.",
            "Share indices는 distinct·nonzero이고 nonconstant coefficients는 uniform random입니다.",
          ]}
          interpretation="(1,8),(2,11)의 basis는 x=0에서 2와 −1이므로 8·2−11=5 mod 17입니다. Integer division이 아니라 field inverse를 사용합니다."
        />
      </section>

      <section id="privacy-boundary" className="space-y-5">
        <h2 className="text-2xl font-bold">t-share privacy는 정보 부족이 아니라 분포의 동일성입니다</h2>
        <p>
          한 point (1,8)만 본 공격자에게는 secret 후보 s마다 그 point를 지나는 slope가
          정확히 하나씩 존재합니다. a₁이 uniform이면 관찰한 share의 분포는 어느 s에도
          같으므로 information-theoretic privacy를 얻습니다. Coefficient RNG가
          편향되거나 재사용되면 이 argument가 깨집니다.
        </p>
        <p>
          Threshold 표기는 문헌과 API마다 다릅니다. 이 글은 degree t라서 t개 이하가
          private하고 t+1개가 복원한다고 씁니다. 어떤 library가 “threshold k”를 복원에
          필요한 최소 share 수로 정의하면 k=t+1입니다.
        </p>
      </section>

      <section id="active-boundary" className="space-y-5">
        <h2 className="text-2xl font-bold">Plain Shamir은 bad share를 탐지하거나 dealer를 검증하지 않습니다</h2>
        <p>
          Malicious dealer가 parties마다 서로 다른 polynomial의 값을 주거나 party가
          reconstruction에서 거짓 y를 제출해도 plain interpolation은 어느 입력이
          잘못됐는지 알려 주지 않습니다. Verifiable Secret Sharing, commitments,
          complaint protocol과 authenticated identity가 필요한 이유입니다.
        </p>
        <p>
          Proactive refresh도 “새 share를 다시 나눔”이 아닙니다. Constant term이 0인 random polynomial을 기존 shares에 더해
          secret은 유지하면서 share 분포를 바꾸고 refresh round 자체를 검증해야 합니다.
        </p>
      </section>

      <section id="release" className="space-y-5">
        <h2 className="text-2xl font-bold">Field·index·RNG·malformed share를 release contract로 고정한다</h2>
        <p>
          Field modulus, threshold convention, party-index mapping, coefficient RNG와
          encoding을 artifact에 고정합니다. Duplicate/zero index, insufficient shares,
          out-of-field value, one corrupted share, reordered identities와 RNG replay를
          negative fixtures로 두고 exact secret·typed rejection·wire bytes·latency를
          함께 측정합니다.
        </p>
        <div id="paper-shamir">
          <CitationBlock source="Shamir · How to Share a Secret" citeKey={1} href="https://doi.org/10.1145/359168.359176">
            <p><b>문제:</b> Secret을 threshold shares로 나누고 적은 shares에서 정보를 숨깁니다.</p>
            <p><b>기여:</b> Random polynomial evaluations과 interpolation을 이용한 perfect sharing을 제시합니다.</p>
            <p><b>전제:</b> Finite field, distinct points, uniform coefficients입니다.</p>
            <p><b>근거 범위:</b> Sharing의 correctness와 privacy 구조입니다.</p>
            <p><b>말하지 않는 것:</b> VSS·malicious DKG·fairness를 자동 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>
    </article>
  );
}
