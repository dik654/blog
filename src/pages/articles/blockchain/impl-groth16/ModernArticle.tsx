import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import Groth16ImplementationViz, {
  Groth16VerifierViz,
  Groth16VisibilityViz,
} from "./Groth16ImplementationViz";
import ZkFromScratchLocator, {
  ZkFromScratchMapReturn,
} from "../impl-field-arithmetic/ZkFromScratchLocator";
import { groth16Tree } from "./fileTrees";
import { officialGroth16CodeRefs } from "./officialCodeRefs";

const GROTH16_PAPER = "https://eprint.iacr.org/2016/260";
const ARK_SOURCE =
  "https://github.com/arkworks-rs/groth16/tree/8f0904a7d7a2c8945bf770bdd3c2081e0be1941a";

export default function ModernGroth16ImplementationArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <ZkFromScratchLocator
          currentSlug="impl-groth16"
          region="Circuit·witness·proof·verifier 경계"
          question="비공개 x=3, y=5는 어떻게 proof 세 점이 되고, verifier는 공개 z=15만으로 무엇을 확인합니까?"
        />

        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 max-w-4xl break-keep text-3xl font-bold">
            3과 5를 보내지 않고도 곱이 15라는 주장을 어떻게 검증합니까
          </h2>
          <p className="mt-3 max-w-3xl break-keep text-base leading-7 text-muted-foreground">
            설명용 회로는 <code>x·y=z</code> 한 줄입니다. Prover는 비공개 witness <code>x=3</code>,
            <code>y=5</code>를 사용하고, verifier는 공개 입력 <code>z=15</code>와 proof의 세 점만 받습니다.
            이 한 건을 circuit 합성부터 pairing 판정까지 따라갑니다.
          </p>
        </div>

        <Groth16ImplementationViz />

        <p className="text-lg leading-8">
          <strong>Groth16의 입력은 proof 하나가 아닙니다.</strong> 같은 circuit에서 만든 proving key와
          verifying key, 공개 입력의 순서, 비공개 witness, proof의 세 group point가 서로 맞아야 합니다.
        </p>
        <p>
          R1CS·QAP와 Groth16의 수학적 구성은{" "}
          <Link to="/cs/crypto/groth16" className="font-bold text-primary hover:underline">
            Groth16 정본
          </Link>
          이 설명합니다. 이 글은 그 수학적 객체가 arkworks의 circuit, assignment, proving key, proof struct와
          verifier 함수에서 어떤 값으로 나타나는지만 추적합니다.
        </p>
        <ContentBoundary article="impl-groth16" />
      </section>

      <section id="circuit-witness" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          Circuit은 값 3과 5가 아니라 x·y=z라는 관계를 고정합니다
        </h2>
        <Groth16VisibilityViz />
        <p>
          Setup 때는 같은 circuit의 변수와 제약식 모양만 필요하므로 witness 값을 비워 둘 수 있습니다. Proof를
          만들 때는 같은 모양의 circuit에 실제 값 <code>x=3</code>, <code>y=5</code>, <code>z=15</code>를
          넣습니다. 따라서 key는 특정 숫자 3과 5가 아니라 <strong>관계의 모양</strong>에 묶입니다.
        </p>

        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
          {[
            ["Circuit", "x·y=z", "변수의 공개 여부와 제약식"],
            ["Witness", "x=3 · y=5", "prover만 사용하는 비공개 할당"],
            ["Instance", "z=15", "verifier도 알고 있는 공개 할당"],
          ].map(([title, value, role]) => (
            <div key={title} className="bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">{title}</span>
              <strong className="mt-2 block font-mono text-sm">{value}</strong>
              <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">{role}</p>
            </div>
          ))}
        </div>

        <p>
          arkworks의 공개 입력 할당에는 상수항을 위한 <code>1</code>이 맨 앞에 자동으로 들어갑니다. 이 사례의
          전체 변수 벡터를 설명용으로 쓰면 <code>w=[1,15,3,5]</code>이고, API는 이를 instance
          <code>[1,15]</code>와 witness <code>[3,5]</code>로 나누어 보관합니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton
            label="공개·비공개 변수 할당"
            onClick={() => sidebar.open("ark-groth16-circuit", officialGroth16CodeRefs["ark-groth16-circuit"])}
          />
        </div>
        <aside className="border-l-2 border-destructive/70 pl-4 text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">실패 동작:</strong> <code>z=14</code>를 공개 입력으로 두고
          <code>x=3</code>, <code>y=5</code>를 넣으면 circuit이 만족되지 않습니다. Witness 누락도 proof 생성에
          필요한 assignment가 없다는 오류로 끝나야 합니다.
        </aside>
      </section>

      <section id="r1cs-qap" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          한 제약식은 세 선형결합의 곱으로 바뀌고, QAP는 여러 행을 polynomial로 묶습니다
        </h2>
        <ExplainedFormula
          question="w=[1,15,3,5]에서 x·y=z 한 행은 어떻게 3×5=15가 됩니까?"
          idea={<>A는 x만, B는 y만, C는 z만 고르는 coefficient vector를 사용합니다.</>}
          formula={String.raw`\langle A,w\rangle\cdot\langle B,w\rangle=\langle C,w\rangle`}
          annotatedFormula={String.raw`\underbrace{\langle(0,0,1,0),w\rangle}_{x=3}\cdot\underbrace{\langle(0,0,0,1),w\rangle}_{y=5}=\underbrace{\langle(0,1,0,0),w\rangle}_{z=15}`}
          operations={[
            {
              expression: String.raw`\langle(0,0,1,0),[1,15,3,5]\rangle=3`,
              annotation: ["A row는 x 위치만 선택합니다."],
            },
            {
              expression: String.raw`\langle(0,0,0,1),[1,15,3,5]\rangle=5`,
              annotation: ["B row는 y 위치만 선택합니다."],
            },
            {
              expression: String.raw`3\cdot5=15`,
              annotation: ["C row가 선택한 public z와 같으므로 이 행은 만족합니다."],
            },
          ]}
          terms={[
            { symbol: "w", name: "전체 할당", description: "상수 1, 공개 입력, 비공개 witness를 정해진 순서로 둔 vector입니다." },
            { symbol: "A,B,C", name: "R1CS 행", description: "각 변수의 선형결합을 만드는 coefficient vectors입니다." },
            { symbol: String.raw`\langle\cdot,\cdot\rangle`, name: "내적", description: "Coefficient와 변수 값을 곱해 더한 선형결합입니다." },
          ]}
          assumptions={[
            "모든 계산은 선택한 pairing curve의 scalar field 안에서 이루어집니다.",
            "Public input과 witness의 순서는 setup과 prove에서 같은 circuit synthesis를 따라야 합니다.",
            "이 한 행은 설명용이며 실제 circuit은 많은 행과 중간 변수를 가질 수 있습니다.",
          ]}
          interpretation="R1CS는 3과 5를 특별 취급하지 않습니다. 같은 circuit에 다른 만족하는 witness를 넣어도 같은 행 구조를 사용합니다."
        />

        <ExplainedFormula
          question="여러 R1CS 행이 만족됐다는 사실을 QAP에서는 어떻게 한 식으로 나타냅니까?"
          idea={<>각 행의 값을 polynomial로 보간하고, 위반량 A(X)B(X)−C(X)가 domain의 모든 점에서 0인지 봅니다.</>}
          formula={String.raw`A(X)B(X)-C(X)=H(X)Z(X)`}
          annotatedFormula={String.raw`\underbrace{A(X)B(X)-C(X)}_{\text{제약 위반량}}=\underbrace{H(X)}_{\text{몫}}\underbrace{Z(X)}_{\text{domain에서 0}}`}
          operations={[
            {
              expression: String.raw`Z(X)=\prod_{i=1}^{n}(X-r_i)`,
              annotation: ["각 R1CS 행에 대응하는 domain point rᵢ에서 0입니다."],
            },
            {
              expression: String.raw`A(r_i)B(r_i)-C(r_i)=0`,
              annotation: ["모든 행이 만족되면 위반량은 모든 domain point에서 0입니다."],
            },
            {
              expression: String.raw`H(X)=(A(X)B(X)-C(X))/Z(X)`,
              annotation: ["나머지 없이 나누어진 quotient coefficients를 prover가 사용합니다."],
            },
          ]}
          terms={[
            { symbol: "A(X),B(X),C(X)", name: "QAP polynomials", description: "R1CS의 여러 행을 같은 domain 위에서 보간한 polynomial입니다." },
            { symbol: "Z(X)", name: "소거 polynomial", description: "선택한 evaluation domain의 모든 점에서 0입니다." },
            { symbol: "H(X)", name: "몫 polynomial", description: "제약식이 모두 만족됐을 때 나머지 없이 얻는 quotient입니다." },
          ]}
          assumptions={[
            "R1CS와 QAP가 같은 변수 순서와 evaluation domain을 사용합니다.",
            "여기서 A(X), B(X), C(X)는 다음 절 proof.a, proof.b, proof.c의 group point와 다른 객체입니다.",
          ]}
          interpretation="arkworks의 witness_map은 이 quotient의 계수를 만들고, prover는 h_query와 함께 MSM에 사용합니다."
        />
        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton
            label="R1CS→QAP→proof 경로"
            onClick={() => sidebar.open("ark-groth16-prover", officialGroth16CodeRefs["ark-groth16-prover"])}
          />
        </div>
      </section>

      <section id="proof-structure" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          Prover는 witness와 key query를 결합해 G1·G2·G1의 세 점을 만듭니다
        </h2>
        <p>
          arkworks prover는 새 randomness <code>r</code>과 <code>s</code>를 뽑고, proving key의 query points에
          public·private assignment와 QAP quotient coefficients를 다중 스칼라 곱(MSM)으로 결합합니다. 결과는
          <code>proof.a∈G1</code>, <code>proof.b∈G2</code>, <code>proof.c∈G1</code>입니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-stretch">
          {[
            ["proof.a", "G1", "assignment + α + rδ"],
            ["proof.b", "G2", "assignment + β + sδ"],
            ["proof.c", "G1", "private + H + r·s 보정"],
          ].map(([name, group, role], index) => (
            <div key={name} className="contents">
              <div className="bg-background p-4 text-center">
                <span className="font-mono text-[9px] font-black text-primary">{name}</span>
                <strong className="mt-2 block font-mono text-sm">{group}</strong>
                <p className="mt-2 break-keep text-[10px] leading-5 text-muted-foreground">{role}</p>
              </div>
              {index < 2 ? <span aria-hidden className="hidden items-center bg-background px-3 text-primary sm:flex">+</span> : null}
            </div>
          ))}
        </div>
        <p>
          세 점만 전송한다는 사실만으로 zero knowledge가 자동 증명되는 것은 아닙니다. 올바른 setup, randomness,
          group과 protocol 가정 아래에서 Groth16의 zero-knowledge 성질을 사용합니다. 구현이 randomness를 0으로 둔
          별도 API를 제공한다면 그 경로는 이름 그대로 zero-knowledge proof 생성 경로가 아닙니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton
            label="Proof 세 점 구조"
            onClick={() => sidebar.open("ark-groth16-proof", officialGroth16CodeRefs["ark-groth16-proof"])}
          />
          <CodeViewButton
            label="Prover 내부 경로"
            onClick={() => sidebar.open("ark-groth16-prover", officialGroth16CodeRefs["ark-groth16-prover"])}
          />
        </div>
      </section>

      <section id="verification" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          Verifier는 공개값 15를 key point와 결합한 뒤 proof의 pairing 식을 검사합니다
        </h2>
        <Groth16VerifierViz />

        <ExplainedFormula
          question="Public input z=15는 verifier 계산에서 어디에 들어갑니까?"
          idea={<>Verifying key의 첫 point에 각 public input과 대응 point의 스칼라 곱을 더합니다.</>}
          formula={String.raw`g_{ic}=\gamma_{abc,0}+z\,\gamma_{abc,1}`}
          annotatedFormula={String.raw`\underbrace{g_{ic}}_{\text{prepared public input}}=\underbrace{\gamma_{abc,0}}_{\text{constant}}+\underbrace{15\,\gamma_{abc,1}}_{\text{public }z}`}
          operations={[
            {
              expression: String.raw`z=15`,
              annotation: ["Verifier가 API로 받은 한 개의 public input입니다."],
            },
            {
              expression: String.raw`g_{ic}=\gamma_{abc,0}+15\gamma_{abc,1}`,
              annotation: ["Circuit-specific verifying key와 공개 주장 15를 한 G1 point로 결합합니다."],
            },
            {
              expression: String.raw`z=14\Rightarrow g_{ic}'\ne g_{ic}`,
              annotation: ["같은 proof를 다른 공개 주장에 재사용하면 pairing 식이 달라집니다."],
            },
          ]}
          terms={[
            { symbol: String.raw`\gamma_{abc,0}`, name: "상수 point", description: "Verifying key의 gamma_abc_g1 첫 원소입니다." },
            { symbol: String.raw`\gamma_{abc,1}`, name: "첫 public-input point", description: "Public z와 곱해지는 circuit-specific G1 point입니다." },
            { symbol: String.raw`g_{ic}`, name: "공개 입력 결합", description: "Pairing 검증에 넣는 prepared G1 point입니다." },
          ]}
          assumptions={[
            "Verifier가 기대한 public input 개수와 순서를 사용합니다.",
            "Proof와 verifying key가 같은 circuit-specific setup에서 나왔습니다.",
            "모든 point는 선택한 curve의 올바른 group element로 decode됐습니다.",
          ]}
          interpretation="Verifier는 x=3과 y=5를 복원하지 않습니다. 공개 z와 proof가 같은 relation을 만족한다는 pairing 식만 확인합니다."
        />

        <ExplainedFormula
          question="arkworks verifier의 세 pairing 항은 어떤 등식을 확인합니까?"
          idea={<>Proof A·B·C와 public-input point를 prepared verifying key의 α·β 기준값과 비교합니다.</>}
          formula={String.raw`e(A,B)\,e(g_{ic},-\gamma)\,e(C,-\delta)=e(\alpha,\beta)`}
          annotatedFormula={String.raw`\underbrace{e(A,B)}_{\text{proof A·B}}\underbrace{e(g_{ic},-\gamma)}_{\text{public input}}\underbrace{e(C,-\delta)}_{\text{proof C}}=\underbrace{e(\alpha,\beta)}_{\text{prepared VK}}`}
          operations={[
            {
              expression: String.raw`\operatorname{multi\_miller\_loop}((A,B),(g_{ic},-\gamma),(C,-\delta))`,
              annotation: ["세 pair를 한 번에 Miller loop로 누적합니다."],
            },
            {
              expression: String.raw`\operatorname{final\_exp}(\cdot)`,
              annotation: ["누적값을 target group의 최종 pairing 값으로 보냅니다."],
            },
            {
              expression: String.raw`\text{result}=e(\alpha,\beta)`,
              annotation: ["Prepared verifying key의 기준값과 같을 때 true입니다."],
            },
          ]}
          terms={[
            { symbol: "A,B,C", name: "Proof points", description: "각각 G1, G2, G1에 속하는 proof의 세 점입니다." },
            { symbol: String.raw`\gamma,\delta`, name: "Verifying-key points", description: "Prepared key가 음수 G2 형태로 보관하는 setup points입니다." },
            { symbol: "e", name: "Pairing", description: "G1×G2를 target group으로 보내는 bilinear map입니다." },
          ]}
          assumptions={[
            "Pairing-friendly curve와 subgroup 검증, canonical decoding이 올바르게 적용됩니다.",
            "논문의 soundness와 setup 가정을 충족한다고 전제합니다.",
          ]}
          interpretation="Proof bytes 하나, public input 하나 또는 verifying key 하나만 바뀌어도 같은 식이 성립하지 않아야 합니다."
        />

        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton
            label="Verifier의 public input·pairing 코드"
            onClick={() => sidebar.open("ark-groth16-verifier", officialGroth16CodeRefs["ark-groth16-verifier"])}
          />
        </div>

        <aside className="border-l-2 border-destructive/70 pl-4 text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">실패 동작:</strong> Wrong public input, 다른 circuit의 verifying key,
          손상된 A·B·C 또는 잘못된 group encoding은 false나 decode 오류로 끝나야 합니다. Verifier가 true를
          돌려줬다고 setup ceremony의 정직성이나 circuit이 의도한 업무 규칙까지 자동으로 증명되는 것은 아닙니다.
        </aside>
      </section>

      <section id="evidence" className="space-y-4 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">공식 구현에서 확인한 경계</h2>
        <div id="paper-groth16">
          <CitationBlock
            type="paper"
            citeKey={1}
            source="Jens Groth · On the Size of Pairing-based Non-interactive Arguments · 2016/260"
            href={GROTH16_PAPER}
          >
            <p><strong>확인한 범위:</strong> Relation-specific setup, 세 group element proof와 pairing verification construction을 제시합니다.</p>
            <p><strong>한계:</strong> 특정 Rust API, serialization과 production 운영 안전성을 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-arkworks-groth16">
          <CitationBlock
            type="code"
            citeKey={2}
            source="arkworks groth16 · commit 8f0904a"
            href={ARK_SOURCE}
          >
            <p><strong>확인한 범위:</strong> Circuit synthesis, R1CS→QAP witness map, proof A·B·C struct와 public-input pairing verifier의 실제 Rust 경로입니다.</p>
            <p><strong>한계:</strong> 저장소 README는 이 구현을 academic proof-of-concept이며 production ready가 아니라고 명시합니다. 이 글은 API 경계를 배우는 근거로만 사용합니다.</p>
          </CitationBlock>
        </div>
        <ol className="space-y-3 text-sm leading-6">
          <li><strong>1.</strong> Circuit은 관계를, witness와 instance는 그 관계에 넣을 비공개·공개 값을 소유합니다.</li>
          <li><strong>2.</strong> R1CS 만족 여부는 QAP의 나눗셈 가능성과 proof MSM 입력으로 이어집니다.</li>
          <li><strong>3.</strong> Proof는 A∈G1, B∈G2, C∈G1 세 점이며 verifier는 private witness를 입력받지 않습니다.</li>
          <li><strong>4.</strong> Public input은 verifying key point와 결합되어 pairing equation에 직접 묶입니다.</li>
        </ol>
        <p className="text-sm text-muted-foreground">
          Crate 선택, trusted setup ceremony 운영, 성능·메모리 측정, key 보관과 배포·rollback은 실제 환경의 요구가
          필요한 실무 판단이므로 이 개념 글에 섞지 않습니다.
        </p>
      </section>

      <ZkFromScratchMapReturn
        currentSlug="impl-groth16"
        closure="Groth16 구현에서 circuit은 관계를, witness와 instance는 비공개·공개 값을, proving key는 proof 생성을, verifying key와 public input은 pairing 판정을 맡습니다. Verifier는 witness를 받지 않고 proof의 A·B·C와 공개 입력이 같은 circuit-specific relation에 맞는지 확인합니다."
      />

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={officialGroth16CodeRefs}
        fileTrees={{ arkworks: groth16Tree }}
        projectMetas={{
          arkworks: {
            id: "arkworks",
            label: "arkworks · groth16 8f0904a",
            badgeClass: "border-violet-500 bg-violet-500/10 text-violet-700",
          },
        }}
      />
    </article>
  );
}
