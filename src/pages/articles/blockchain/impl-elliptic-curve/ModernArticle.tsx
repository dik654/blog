import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import {
  CurveImplementationViz,
  CurveProfileViz,
  PairingBoundaryViz,
} from "./CurveImplementationViz";
import ZkFromScratchLocator, {
  ZkFromScratchMapReturn,
} from "../impl-field-arithmetic/ZkFromScratchLocator";
import { zkCurveTree } from "./fileTrees";
import { officialCurveCodeRefs } from "./officialCodeRefs";

const ARK_SW = "https://github.com/arkworks-rs/algebra/tree/6a28df57ddf1f0cb9735ec22d6e9e7f8785980b5/ec/src/models/short_weierstrass";
const ARK_BN = "https://github.com/arkworks-rs/curves/tree/e2d16a27e2cfa9f972ae9772df827a22730011b4/bn254";

export default function ModernCurveImplementationArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <ZkFromScratchLocator
          currentSlug="impl-elliptic-curve"
          region="점 입력·그룹 연산·pairing 경계"
          question="압축된 두 byte는 어떤 검사를 거쳐 타원곡선 점이 되고, 두 배 연산 뒤 어떤 byte로 돌아옵니까?"
        />

        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 max-w-4xl break-keep text-3xl font-bold">
            bytes를 언제부터 안전한 곡선점으로 다룰 수 있습니까
          </h2>
          <p className="mt-3 max-w-3xl break-keep text-base leading-7 text-muted-foreground">
            설명용 곡선 <code>y²=x³+2x+2 mod17</code>에서 입력 <code>0x03 0x05</code>를 추적합니다.
            이 bytes는 <code>P=(5,1)</code>로 승인되고, 두 배 연산을 거쳐 <code>2P=(6,3)</code>,
            다시 <code>0x03 0x06</code>이 됩니다.
          </p>
        </div>

        <CurveImplementationViz />

        <p className="text-lg leading-8">
          <strong>역직렬화에 성공했다는 말과 안전한 점이라는 말은 다릅니다.</strong>{" "}
          표식과 좌표를 읽은 뒤 제곱근을 복원하고, 곡선식과 부분군을 모두 확인해야 연산에 넣을 수 있습니다.
          이 순서가 끝나기 전의 값은 점이 아니라 점 후보입니다.
        </p>
        <p>
          타원곡선군과 Jacobian 좌표, pairing의 수학은{" "}
          <Link to="/cs/crypto/elliptic-curves" className="font-bold text-primary hover:underline">
            타원곡선 정본
          </Link>
          이 설명합니다. 이 글은 그 수학이 Rust의 입력 승인, 점 타입, 그룹 연산과 BN254 pairing config에
          어떻게 이어지는지만 다룹니다.
        </p>
        <ContentBoundary article="impl-elliptic-curve" />
      </section>

      <section id="curve-profile" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          BN254 하나에도 서로 다른 field와 group 타입이 있습니다
        </h2>
        <CurveProfileViz />
        <p>
          좌표 <code>x,y</code>는 base field <code>Fq</code>에서 계산하고, 점에 곱하는 scalar는{" "}
          <code>Fr</code>에서 계산합니다. G1과 G2는 서로 다른 곡선 위의 점이고, pairing 결과 GT는 또 다른
          부분군입니다. 같은 크기의 limb를 쓴다는 이유로 이 타입들을 바꾸어 쓰면 안 됩니다.
        </p>
        <ExplainedFormula
          question="Curve profile이 generator와 부분군을 연결하는 최소 조건은 무엇입니까?"
          idea={<>Generator는 곡선식 위에 있어야 하고, 부분군 차수 r을 곱하면 무한원점으로 돌아가야 합니다.</>}
          formula={String.raw`y_G^2=x_G^3+ax_G+b\pmod p,\qquad [r]G=\mathcal O`}
          annotatedFormula={String.raw`\underbrace{y_G^2=x_G^3+ax_G+b\pmod p}_{\text{곡선식}},\qquad \underbrace{[r]G=\mathcal O}_{\text{부분군}}`}
          operations={[
            { expression: String.raw`G=(x_G,y_G)`, annotation: ["profile에 고정된 generator 좌표입니다."] },
            { expression: String.raw`[r]G=\mathcal O`, annotation: ["r은 scalar field의 크기이자 원하는 부분군의 차수입니다."] },
          ]}
          terms={[
            { symbol: "p", name: "base modulus", description: "좌표가 속한 field의 범위입니다." },
            { symbol: "a,b", name: "curve coefficients", description: "short-Weierstrass 곡선식을 정합니다." },
            { symbol: "G", name: "generator", description: "원하는 부분군을 생성하는 점입니다." },
            { symbol: "r", name: "subgroup order", description: "scalar field의 크기입니다." },
            { symbol: String.raw`\mathcal O`, name: "무한원점", description: "점 덧셈의 항등원입니다." },
          ]}
          assumptions={[
            "G1과 G2는 각각 자신의 field와 곡선식을 사용합니다.",
            "이 검사는 parameter 연결을 확인하지만 곡선 선택 자체의 보안 증명을 대신하지 않습니다.",
          ]}
          interpretation="곡선식만 맞는 점과 원하는 prime-order 부분군의 점은 같은 조건이 아닙니다."
        />
        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton label="BN254 pairing config" onClick={() => sidebar.open("ark-bn254-config", officialCurveCodeRefs["ark-bn254-config"])} />
        </div>
        <div id="paper-arkworks-bn254">
          <CitationBlock type="code" citeKey={1} source="arkworks curves · BN254 · commit e2d16a2" href={ARK_BN}>
            <p><strong>확인한 범위:</strong> G1/G2 config, extension fields, twist와 Ate loop 상수를 generic BN pairing engine에 연결합니다.</p>
            <p><strong>한계:</strong> 이 pinned 구현은 다른 curve나 별도 encoding profile의 안전성을 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="point-encoding" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          x에서 y를 복원한 뒤에도 두 검사가 남습니다
        </h2>
        <p>
          설명용 입력의 <code>x=5</code>를 곡선식에 넣으면 우변은 <code>1</code>입니다. F₁₇에서 제곱근은
          <code>1</code>과 <code>16</code> 두 개이고, 홀수 표식이 <code>y=1</code>을 선택합니다. 그 뒤
          곡선식과 <code>[19]P=O</code>를 각각 확인합니다.
        </p>
        <ExplainedFormula
          question="0x03 0x05에서 P=(5,1)을 어떻게 얻습니까?"
          idea={<>x로 두 y 후보를 만든 뒤 표식이 하나를 고르고, 곡선식과 부분군을 차례로 확인합니다.</>}
          formula={String.raw`5^3+2\cdot5+2\equiv1,\quad y\in\{1,16\},\quad [19](5,1)=\mathcal O`}
          annotatedFormula={String.raw`\underbrace{5^3+2\cdot5+2\equiv1}_{\text{y²의 값}},\quad \underbrace{y\in\{1,16\}}_{\text{두 제곱근}},\quad \underbrace{[19](5,1)=\mathcal O}_{\text{부분군 검사}}`}
          operations={[
            { expression: String.raw`5^3+2\cdot5+2=137\equiv1\pmod{17}`, annotation: ["x=5를 곡선식의 우변에 넣습니다.", "137=17×8+1입니다."] },
            { expression: String.raw`1^2\equiv16^2\equiv1\pmod{17}`, annotation: ["0x03의 홀수 표식이 y=1을 고릅니다."] },
            { expression: String.raw`[19]P=\mathcal O`, annotation: ["이 곡선의 19개 점 전체가 하나의 prime-order group입니다."] },
          ]}
          terms={[
            { symbol: "0x03", name: "설명용 표식", description: "홀수 y를 선택한다는 이 글의 축소 encoding입니다." },
            { symbol: "x=5", name: "공개 x", description: "F₁₇의 canonical 범위를 통과한 좌표입니다." },
            { symbol: "y=1,16", name: "제곱근 후보", description: "같은 x에 대응하는 서로 반대인 두 점입니다." },
            { symbol: "19", name: "group order", description: "무한원점을 포함한 설명용 곡선의 점 개수입니다." },
          ]}
          assumptions={[
            "0x03/0x02 표식은 손계산을 위한 축소 형식이며 arkworks의 실제 SWFlags byte layout이 아닙니다.",
            "실제 protocol은 infinity와 canonical coordinate 규칙까지 고정해야 합니다.",
          ]}
          interpretation="표식, 좌표 복원, 곡선식, 부분군이 모두 맞아야 bytes가 typed point가 됩니다."
        />
        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton label="압축 점 decode 코드" onClick={() => sidebar.open("ark-point-admission", officialCurveCodeRefs["ark-point-admission"])} />
          <CodeViewButton label="곡선·부분군 검사 코드" onClick={() => sidebar.open("ark-point-validity", officialCurveCodeRefs["ark-point-validity"])} />
        </div>
        <aside className="border-l-2 border-destructive/70 pl-4 text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">실패 동작:</strong> 길이가 다르거나, x가 field 범위를 벗어나거나,
          제곱근이 없거나, 곡선식·부분군 중 하나라도 실패하면 점으로 보정하지 않고 입력 오류로 끝냅니다.
        </aside>
      </section>

      <section id="coordinate-ops" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          P를 두 배로 만들면 (5,1)이 (6,3)이 됩니다
        </h2>
        <p>
          작은 곡선에서는 affine 기울기로 결과를 손으로 확인할 수 있습니다. 실제 반복 연산에서는 매 덧셈마다
          field inverse를 구하지 않도록 Jacobian <code>(X:Y:Z)</code>를 사용하고, 출력 경계에서 affine으로 돌아옵니다.
        </p>
        <ExplainedFormula
          question="P=(5,1)의 두 배 2P를 어떻게 계산합니까?"
          idea={<>접선의 기울기를 field에서 구한 뒤 새 x와 y를 계산합니다.</>}
          formula={String.raw`\lambda=\frac{3x^2+a}{2y}=13,\quad x_2=\lambda^2-2x=6,\quad y_2=\lambda(x-x_2)-y=3`}
          annotatedFormula={String.raw`\lambda=\underbrace{(3\cdot5^2+2)}_{77\equiv9}\underbrace{(2\cdot1)^{-1}}_{2^{-1}=9}=13,\quad x_2=6,\quad y_2=3`}
          operations={[
            { expression: String.raw`77\bmod17=9,\quad2^{-1}\bmod17=9`, annotation: ["9×9=81≡13이므로 λ=13입니다."] },
            { expression: String.raw`13^2-10=159\equiv6`, annotation: ["새 x 좌표입니다."] },
            { expression: String.raw`13(5-6)-1=-14\equiv3`, annotation: ["새 y 좌표입니다."] },
          ]}
          terms={[
            { symbol: String.raw`\lambda`, name: "접선 기울기", description: "P=P인 double에서 사용하는 field 값입니다." },
            { symbol: "a=2", name: "곡선 계수", description: "설명용 곡선의 x 항 계수입니다." },
            { symbol: "2P", name: "점 두 배", description: "P와 P의 group addition 결과입니다." },
          ]}
          assumptions={["분모 2y가 0이면 별도 identity 경로가 필요합니다.", "모든 나눗셈은 F₁₇의 역원을 곱하는 연산입니다."]}
          interpretation="연산 결과 2P=(6,3)은 다시 곡선식을 만족하며 홀수 y 표식으로 0x03 0x06이 됩니다."
        />
        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton label="Jacobian double 코드" onClick={() => sidebar.open("ark-projective-double", officialCurveCodeRefs["ark-projective-double"])} />
        </div>
        <div id="paper-arkworks-sw">
          <CitationBlock type="code" citeKey={2} source="arkworks algebra · short-Weierstrass · commit 6a28df5" href={ARK_SW}>
            <p><strong>확인한 범위:</strong> Affine 입력 검사, 압축 좌표 복원, Jacobian group operation을 generic curve config 위에 구현합니다.</p>
            <p><strong>한계:</strong> 모든 곡선의 공식이 같은 branch와 비용을 가진다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="pairing-boundary" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          Pairing은 점 두 배와 같은 연산이 아니라 G1·G2를 GT로 보내는 다음 계층입니다
        </h2>
        <PairingBoundaryViz />
        <p>
          G1 점과 G2 점의 입력 승인이 끝나면 pairing engine이 Miller loop 중간값을 만들고 final exponentiation으로
          GT 부분군에 보냅니다. 그래서 pairing이 틀렸을 때 점 decode, Miller loop, final exponentiation을 한 덩어리로
          보지 않고 경계별 값으로 좁혀야 합니다.
        </p>
        <ExplainedFormula
          question="Pairing의 입력군과 출력군이 올바르게 연결됐는지 어떤 등식으로 확인합니까?"
          idea={<>Scalar multiplication을 pairing 앞에서 하든 GT에서 거듭제곱하든 같은 결과가 나와야 합니다.</>}
          formula={String.raw`e([a]P,[b]Q)=e(P,Q)^{ab},\qquad e(P,Q)\ne1`}
          annotatedFormula={String.raw`\underbrace{e([a]P,[b]Q)}_{\text{G1·G2에서 scalar 곱}}=\underbrace{e(P,Q)^{ab}}_{\text{GT에서 거듭제곱}},\qquad \underbrace{e(P,Q)\ne1}_{\text{비자명 입력}}`}
          operations={[
            { expression: String.raw`P\in G_1,\ Q\in G_2`, annotation: ["두 입력은 각자의 곡선식과 부분군을 통과해야 합니다."] },
            { expression: String.raw`e(P,Q)\in G_T`, annotation: ["Miller loop 중간값과 final exponent 결과를 구분합니다."] },
          ]}
          terms={[
            { symbol: "e", name: "pairing", description: "G1×G2에서 GT로 가는 bilinear map입니다." },
            { symbol: "a,b", name: "scalars", description: "Fr의 값입니다." },
            { symbol: "GT", name: "target group", description: "final exponentiation 결과가 속하는 부분군입니다." },
          ]}
          assumptions={["P와 Q가 올바른 prime-order 부분군에 있습니다.", "loop와 final exponent 상수가 같은 BN254 profile에 속합니다."]}
          interpretation="등식이 깨지면 입력 타입, loop 상수, line 함수, final exponent 순서로 경계를 나누어 확인합니다."
        />
        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton label="BN254 pairing config 다시 보기" onClick={() => sidebar.open("ark-bn254-config", officialCurveCodeRefs["ark-bn254-config"])} />
        </div>
      </section>

      <section id="evidence" className="space-y-4 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">이 글에서 확인한 사실</h2>
        <ol className="space-y-3 text-sm leading-6">
          <li><strong>1.</strong> 압축 x는 두 y 후보를 만들며 표식이 한 점을 고릅니다.</li>
          <li><strong>2.</strong> on-curve와 subgroup은 서로 다른 승인 조건입니다.</li>
          <li><strong>3.</strong> affine 손계산과 Jacobian 구현은 같은 group result를 나타냅니다.</li>
          <li><strong>4.</strong> G1·G2 점 연산 다음에 Miller loop와 final exponentiation이라는 pairing 경계가 있습니다.</li>
        </ol>
        <p className="text-sm text-muted-foreground">
          성능 측정, constant-time 검증, 배포와 rollback은 대상 환경이 필요한 실무 판단이므로 이 개념 글에 섞지 않습니다.
        </p>
      </section>

      <ZkFromScratchMapReturn
        currentSlug="impl-elliptic-curve"
        closure="Rust 타원곡선 구현에서 bytes는 좌표 복원·곡선식·부분군을 통과해야 typed point가 되며, 점 연산과 G1×G2→GT pairing은 서로 다른 타입과 실행 경계를 가집니다."
      />

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={officialCurveCodeRefs}
        fileTrees={{ arkworks: zkCurveTree }}
        projectMetas={{
          arkworks: {
            id: "arkworks",
            label: "arkworks · algebra 6a28df5 · curves e2d16a2",
            badgeClass: "border-violet-500 bg-violet-500/10 text-violet-700",
          },
        }}
      />
    </article>
  );
}
