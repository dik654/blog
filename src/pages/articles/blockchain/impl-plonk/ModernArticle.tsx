import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import PlonkImplementationViz, {
  PlonkCircuitRowsViz,
  PlonkTranscriptViz,
} from "./PlonkImplementationViz";
import ZkFromScratchLocator, {
  ZkFromScratchMapReturn,
} from "../impl-field-arithmetic/ZkFromScratchLocator";
import { plonkTree } from "./fileTrees";
import { officialPlonkCodeRefs } from "./officialCodeRefs";

const PLONK_PAPER = "https://eprint.iacr.org/2019/953";
const DUSK_SOURCE =
  "https://github.com/dusk-network/plonk/tree/b83aba4fb8a1a86fdff3f5f9e1b71e072260a4bf";
const DUSK_RELEASE = "https://github.com/dusk-network/plonk/releases/tag/v0.22.1";

export default function ModernPlonkImplementationArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <ZkFromScratchLocator
          currentSlug="impl-plonk"
          region="Circuit·Composer·transcript·KZG verifier"
          question="비공개 x=3, y=4와 공개 z=12는 Rust 코드에서 어떤 행과 polynomial이 되고, verifier는 무엇을 다시 계산합니까?"
        />

        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 max-w-4xl break-keep text-3xl font-bold">
            x·y=z 한 줄은 어떻게 PLONK proof와 pairing 판정으로 바뀝니까
          </h2>
          <p className="mt-3 max-w-3xl break-keep text-base leading-7 text-muted-foreground">
            설명용 circuit은 비공개 <code>x=3</code>, <code>y=4</code>의 곱이 공개 <code>z=12</code>와
            같다는 관계입니다. 이 값들이 Dusk의 Rust API에서 Composer 행, selector와 permutation,
            Fiat–Shamir transcript, KZG opening으로 바뀌는 과정을 한 번 끝까지 따라갑니다.
          </p>
        </div>

        <PlonkImplementationViz />

        <p className="text-lg leading-8">
          <strong>PLONK 구현의 입력은 proof bytes 하나가 아닙니다.</strong> Public parameters, 같은 회로에서
          전처리한 prover·verifier, 실제 witness, 공개 입력, transcript version이 서로 맞아야 합니다.
        </p>
        <p>
          Selector gate, permutation argument와 KZG의 수학은{" "}
          <Link to="/cs/crypto/plonk" className="font-bold text-primary hover:underline">
            PLONK 정본
          </Link>
          이 설명합니다. 이 글은 그 객체들이 <code>dusk-plonk v0.22.1</code>의 실제 struct와 함수 호출에서
          어떻게 나타나는지를 추적합니다. 이 구현은 width-4 custom gates를 포함하므로 원 논문의 모든
          표기를 그대로 복제한 코드는 아닙니다.
        </p>
        <ContentBoundary article="impl-plonk" />
      </section>

      <section id="circuit-composer" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          Circuit은 값 세 개를 넣는 그릇이 아니라 관계를 Composer 행으로 만드는 함수입니다
        </h2>
        <PlonkCircuitRowsViz />
        <p>
          <code>gate_mul</code>은 <code>x</code>와 <code>y</code>를 곱해 새 결과 witness를 만들고 곱셈
          constraint를 추가합니다. <code>append_public</code>은 <code>z</code>를 공개 입력으로 묶는 행을,
          <code>assert_equal</code>은 계산 결과와 공개 <code>z</code>가 같다는 행을 추가합니다. 따라서 소스의
          한 문장 <code>x·y=z</code>가 실제로는 하나의 행이라고 가정하면 구현을 잘못 읽게 됩니다.
        </p>

        <ExplainedFormula
          question="Dusk의 width-4 산술 행은 어떤 식을 0으로 만듭니까?"
          idea={<>네 wire와 selector를 곱해 더하고, arithmetic selector와 sparse public input을 함께 적용합니다.</>}
          formula={String.raw`q_{arith}(q_Mab+q_La+q_Rb+q_Oc+q_Fd+q_C)+PI=0`}
          annotatedFormula={String.raw`\underbrace{q_{arith}}_{\text{산술 행 켜기}}(\underbrace{q_Mab}_{\text{곱}}+\underbrace{q_La+q_Rb+q_Oc+q_Fd}_{\text{선형 wire}}+\underbrace{q_C}_{\text{상수}})+\underbrace{PI}_{\text{공개 입력}}=0`}
          operations={[
            {
              expression: String.raw`1\cdot(1\cdot3\cdot4-1\cdot12)=0`,
              annotation: ["gate_mul 행은 qM=1, qO=−1로 3×4−12를 0으로 만듭니다."],
            },
            {
              expression: String.raw`-1\cdot12+PI(12)=0`,
              annotation: ["append_public 행은 witness z와 공개 입력 12를 같은 statement에 넣습니다."],
            },
            {
              expression: String.raw`1\cdot12-1\cdot12=0`,
              annotation: ["assert_equal 행은 곱셈 결과 witness와 공개 z witness가 같음을 강제합니다."],
            },
          ]}
          terms={[
            { symbol: "a,b,c,d", name: "네 wire", description: "한 row에서 참조하는 witness positions입니다." },
            { symbol: String.raw`q_M,q_L,q_R,q_O,q_F,q_C`, name: "Selectors", description: "곱·선형·상수 항의 계수입니다." },
            { symbol: String.raw`q_{arith}`, name: "산술 widget selector", description: "이 row에서 산술 identity를 켭니다." },
            { symbol: "PI", name: "Public input polynomial", description: "공개값을 sparse row 위치에 놓은 polynomial입니다." },
          ]}
          assumptions={[
            "모든 값은 dusk-plonk가 사용하는 BLS12-381 scalar field 안에 있습니다.",
            "Composer::initialized가 넣는 상수·dummy rows는 축소 계산에서 생략했습니다.",
            "이 식은 v0.22.1의 arithmetic widget이며 다른 PLONKish DSL의 행 모양은 다를 수 있습니다.",
          ]}
          interpretation="x·y=z라는 업무 관계와 Composer가 실제로 생성한 행 수를 구분해야 public-input 위치와 permutation wiring을 정확히 따라갈 수 있습니다."
        />

        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton
            label="3×4=12 재현 circuit"
            onClick={() => sidebar.open("plonk-mul-fixture", officialPlonkCodeRefs["plonk-mul-fixture"])}
          />
        </div>
        <aside className="border-l-2 border-destructive/70 pl-4 text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">실패 동작:</strong> 같은 fixture에서 공개 <code>z=11</code>을
          넣으면 세 번째 행이 <code>12−11=1</code>을 남깁니다. v0.22.1 재현 실행에서는 prove가
          <code>PolynomialDegreeTooLarge</code>를 반환했고, 정상 proof에 공개 입력 11을 넣은 verifier는
          <code>ProofVerificationError</code>를 반환했습니다. 첫 오류 이름을 일반적인 “회로 불만족” 오류로
          해석해서는 안 됩니다.
        </aside>
      </section>

      <section id="preprocess" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          Compile은 기본 circuit의 행 모양을 selector·sigma polynomials와 key로 고정합니다
        </h2>
        <div className="not-prose overflow-x-auto">
          <div
            className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-stretch gap-px bg-border p-px"
            style={{ width: "max(100%, 760px)" }}
          >
            {[
              ["C::default()", "같은 행 모양"],
              ["Composer", "selectors · copy map"],
              ["IFFT · σ", "polynomials"],
              ["KZG commit", "Prover · Verifier"],
            ].map(([title, role], index) => (
              <div key={title} className="contents">
                <div className="min-w-0 bg-background p-4 text-center">
                  <strong className="font-mono text-xs text-primary">{title}</strong>
                  <p className="mt-2 break-keep text-[10px] leading-5 text-muted-foreground">{role}</p>
                </div>
                {index < 3 ? <span aria-hidden className="flex items-center bg-background px-3 text-primary">→</span> : null}
              </div>
            ))}
          </div>
        </div>
        <p>
          <code>Compiler::compile</code>은 <code>C::default()</code>로 circuit을 합성합니다. 이때 필요한 것은
          실제 3과 4가 아니라 같은 순서의 rows, public-input positions와 copy wiring입니다. 행 수를 2의
          거듭제곱 domain에 맞추고 selector vectors를 IFFT해 polynomials로 바꾸며, permutation map에서는 네
          sigma polynomials를 만듭니다. 이 polynomials의 KZG commitments가 verifier key에 들어갑니다.
        </p>
        <p>
          Prove 때 circuit이 행을 하나 더 만들거나 순서를 바꾸면 compile 때의 constraint 수와 맞지 않아
          <code>InvalidCircuitSize</code>가 납니다. 같은 Rust struct 이름보다 <strong>동일한 synthesis 경로</strong>가
          더 중요한 이유입니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton
            label="Compiler와 전처리"
            onClick={() => sidebar.open("dusk-plonk-compiler", officialPlonkCodeRefs["dusk-plonk-compiler"])}
          />
        </div>
      </section>

      <section id="prover-rounds" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          Prover는 먼저 약정하고, 그 약정에서 나온 도전값으로 다음 polynomial을 만듭니다
        </h2>
        <PlonkTranscriptViz />
        <p>
          Public input 12를 transcript에 넣은 뒤 실제 witness rows에서 <code>a·b·c·d</code> vectors를 만들고
          blinding합니다. 네 wire commitments가 정해져야 β·γ를 얻을 수 있고, 그 뒤에야 permutation
          grand product <code>Z(X)</code>를 만들 수 있습니다. <code>z_comm</code> 뒤에는 α, quotient commitments
          뒤에는 ζ가 이어집니다.
        </p>

        <ExplainedFormula
          question="Copy constraint가 모두 맞으면 permutation 누적곱은 왜 1로 돌아옵니까?"
          idea={<>Identity 위치표와 실제 copy 위치표가 같은 witness multiset을 가리키면 행별 비율이 전체에서 상쇄됩니다.</>}
          formula={String.raw`Z(\omega^{i+1})=Z(\omega^i)\prod_{j=1}^{4}\frac{w_j(\omega^i)+\beta k_j\omega^i+\gamma}{w_j(\omega^i)+\beta\sigma_j(\omega^i)+\gamma}`}
          annotatedFormula={String.raw`\underbrace{Z(\omega^{i+1})}_{\text{다음 누적값}}=\underbrace{Z(\omega^i)}_{\text{현재 누적값}}\prod_{j=1}^{4}\frac{\underbrace{w_j+\beta k_j\omega^i+\gamma}_{\text{원래 위치}}}{\underbrace{w_j+\beta\sigma_j(\omega^i)+\gamma}_{\text{copy 위치}}}`}
          operations={[
            { expression: String.raw`Z(1)=1`, annotation: ["첫 행 전의 누적값을 1로 둡니다."] },
            { expression: String.raw`\beta,\gamma\leftarrow transcript([a],[b],[c],[d])`, annotation: ["Wire commitments가 정해진 뒤 위치표를 무작위로 섞습니다."] },
            { expression: String.raw`Z(\omega^n)=1`, annotation: ["두 위치 multiset이 같으면 모든 비율이 telescope되어 마지막에 1로 돌아옵니다."] },
          ]}
          terms={[
            { symbol: String.raw`w_j`, name: "Wire polynomial", description: "a·b·c·d 네 column의 witness values입니다." },
            { symbol: String.raw`k_j\omega^i`, name: "Identity label", description: "Column과 row를 구분하는 원래 위치표입니다." },
            { symbol: String.raw`\sigma_j`, name: "Permutation label", description: "Copy constraint가 연결한 위치표입니다." },
            { symbol: String.raw`\beta,\gamma`, name: "Permutation challenges", description: "Wire commitments 뒤 transcript에서 얻습니다." },
          ]}
          assumptions={[
            "네 wire와 sigma polynomials는 compile 때와 같은 domain·순서를 사용합니다.",
            "분모가 0이 되는 희박한 challenge 사건은 protocol soundness 분석의 일부입니다.",
            "Copy argument는 gate equation 자체를 대신하지 않습니다.",
          ]}
          interpretation="값이 같은지만 확인하는 것이 아니라, 어느 row의 어느 wire가 같은 변수인지까지 permutation argument가 묶습니다."
        />

        <ExplainedFormula
          question="Gate·copy·public-input 관계는 어떻게 하나의 quotient가 됩니까?"
          idea={<>각 관계를 transcript challenge로 결합한 뒤 domain에서 0이어야 하는 식을 vanishing polynomial로 나눕니다.</>}
          formula={String.raw`T(X)=\frac{G(X)+\alpha P(X)+PI(X)+\cdots}{Z_H(X)}`}
          annotatedFormula={String.raw`\underbrace{T(X)}_{\text{몫}}=\frac{\underbrace{G(X)}_{\text{gate}}+\underbrace{\alpha P(X)}_{\text{permutation}}+\underbrace{PI(X)}_{\text{공개 입력}}+\underbrace{\cdots}_{\text{custom widgets}}}{\underbrace{Z_H(X)}_{\text{domain에서 0}}}`}
          operations={[
            { expression: String.raw`N(\omega^i)=0`, annotation: ["모든 행이 만족되면 결합한 분자 N은 domain 각 점에서 0입니다."] },
            { expression: String.raw`N(X)=T(X)Z_H(X)`, annotation: ["따라서 vanishing polynomial로 나누어떨어져야 합니다."] },
            { expression: String.raw`T=T_0+X^nT_1+X^{2n}T_2+X^{3n}T_3`, annotation: ["v0.22.1은 quotient를 degree-n 네 조각으로 나눠 약정합니다."] },
          ]}
          terms={[
            { symbol: "G(X)", name: "Gate identity", description: "Arithmetic·range·logic·curve widgets가 만든 행 관계입니다." },
            { symbol: "P(X)", name: "Permutation identity", description: "Copy wiring과 grand product의 전이·경계 관계입니다." },
            { symbol: "PI(X)", name: "Public input polynomial", description: "공개값 12가 놓인 sparse row polynomial입니다." },
            { symbol: String.raw`Z_H(X)`, name: "Vanishing polynomial", description: "Evaluation domain의 모든 점에서 0입니다." },
          ]}
          assumptions={[
            "표시한 식은 여러 widget terms를 생략한 구조도이며 실제 compute 함수의 모든 항을 적은 식이 아닙니다.",
            "α와 separation challenges는 앞선 commitments가 transcript에 들어간 뒤 생성됩니다.",
          ]}
          interpretation="Verifier는 전체 T polynomial을 받지 않습니다. 네 quotient commitments와 ζ에서의 evaluations·openings로 이 identity가 맞는지 압축해서 검사합니다."
        />

        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton
            label="Prover의 실제 라운드"
            onClick={() => sidebar.open("dusk-plonk-prover", officialPlonkCodeRefs["dusk-plonk-prover"])}
          />
          <CodeViewButton
            label="Proof 구조"
            onClick={() => sidebar.open("dusk-plonk-proof", officialPlonkCodeRefs["dusk-plonk-proof"])}
          />
        </div>
      </section>

      <section id="verification" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          Verifier는 공개 입력과 proof로 transcript를 재생한 뒤 두 KZG opening을 pairing으로 검사합니다
        </h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4">
          {[
            ["입력", "Verifier · public 12 · Proof"],
            ["재생", "β · γ · α · ζ · v · u"],
            ["재구성", "PI(ζ) · D · F · E"],
            ["판정", "pairing = identity"],
          ].map(([title, role], index) => (
            <div key={title} className={`bg-background p-4 ${index === 3 ? "ring-2 ring-inset ring-primary" : ""}`}>
              <span className="font-mono text-[9px] font-black text-primary">0{index + 1}</span>
              <strong className="mt-2 block text-sm">{title}</strong>
              <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">{role}</p>
            </div>
          ))}
        </div>

        <ExplainedFormula
          question="ζ와 ζω의 batched openings는 마지막 pairing에서 어떻게 하나로 묶입니까?"
          idea={<>두 opening commitment를 u로 결합하고, 약정과 평가값으로 만든 F−E를 같은 pairing product에 넣습니다.</>}
          formula={String.raw`e(-(W_\zeta+uW_{\zeta\omega}),[\tau]_2)\;e(\zeta W_\zeta+u\zeta\omega W_{\zeta\omega}+F-E,[1]_2)=1`}
          annotatedFormula={String.raw`e(\underbrace{-(W_\zeta+uW_{\zeta\omega})}_{\text{두 opening 결합}},\underbrace{[\tau]_2}_{\text{KZG key}})\;e(\underbrace{\zeta W_\zeta+u\zeta\omega W_{\zeta\omega}+F-E}_{\text{약정−평가 일치}},\underbrace{[1]_2}_{\text{generator}})=\underbrace{1}_{\text{승인}}`}
          operations={[
            { expression: String.raw`PI(\zeta)`, annotation: ["공개 입력 12를 sparse Lagrange polynomial로 ζ에서 평가합니다."] },
            { expression: String.raw`F=D+v[a]+v^2[b]+\cdots`, annotation: ["Verifier key와 proof commitments를 같은 batch 계수로 결합합니다."] },
            { expression: String.raw`E=r_0+v\,a(\zeta)+v^2b(\zeta)+\cdots`, annotation: ["Proof가 제공한 evaluations를 같은 순서로 결합합니다."] },
            { expression: String.raw`pairing=1_{GT}`, annotation: ["두 KZG openings가 같은 committed polynomials의 값일 때 Ok(())를 반환합니다."] },
          ]}
          terms={[
            { symbol: String.raw`W_\zeta,W_{\zeta\omega}`, name: "Opening commitments", description: "ζ와 shifted point ζω에서의 batched witness commitments입니다." },
            { symbol: "F", name: "Commitment combination", description: "Linearization과 여러 polynomial commitments의 MSM 결과입니다." },
            { symbol: "E", name: "Evaluation combination", description: "같은 polynomial들의 claimed values를 generator와 결합한 점입니다." },
            { symbol: String.raw`[\tau]_2`, name: "KZG opening key", description: "Public parameters에서 준비한 G2 점입니다." },
          ]}
          assumptions={[
            "Proof points는 역직렬화 단계에서 올바른 curve subgroup을 통과했습니다.",
            "Verifier와 prover가 같은 V3 transcript labels, verifier key와 public-input 순서를 사용합니다.",
            "이 식은 dusk-plonk의 KZG profile이며 IPA 기반 PLONKish verifier에는 그대로 적용되지 않습니다.",
          ]}
          interpretation="Verifier는 x=3과 y=4를 복원하지 않습니다. Public z=12와 proof가 이 verifier key의 polynomial identities를 함께 만족하는지만 검사합니다."
        />

        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton
            label="Verifier의 transcript와 pairing"
            onClick={() => sidebar.open("dusk-plonk-verifier", officialPlonkCodeRefs["dusk-plonk-verifier"])}
          />
        </div>

        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
          {[
            ["3·4=12", "prove Ok · verify Ok", "proof 1008 bytes"],
            ["3·4≠11", "prove Err", "PolynomialDegreeTooLarge"],
            ["정상 proof + public 11", "verify Err", "ProofVerificationError"],
          ].map(([fixture, result, detail]) => (
            <div key={fixture} className="bg-background p-4">
              <strong className="font-mono text-xs text-primary">{fixture}</strong>
              <p className="mt-2 text-sm font-bold">{result}</p>
              <p className="mt-1 break-all font-mono text-[10px] leading-5 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">[M] 재현 범위:</strong> dusk-plonk v0.22.1 commit b83aba4,
          Rust 1.93.0, arm64 macOS에서 위 MulCircuit을 release build로 한 번 실행했습니다. 이 결과는 프로토콜
          전체 보안 감사나 다른 회로의 고정 proof 크기·오류 유형·성능을 뜻하지 않습니다.
        </p>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          원 논문의 프로토콜과 v0.22.1 구현 사실을 분리해서 읽습니다
        </h2>
        <div id="paper-plonk">
          <CitationBlock
            type="paper"
            citeKey={1}
            source="Gabizon·Williamson·Ciobotaru · PLONK · ePrint 2019/953"
            href={PLONK_PAPER}
          >
            <p><strong>문제:</strong> 범용·갱신 가능한 setup으로 여러 산술 circuit을 짧게 증명해야 합니다.</p>
            <p><strong>핵심 기여:</strong> Lagrange-basis gate, permutation argument와 polynomial commitments를 결합합니다.</p>
            <p><strong>중요 가정:</strong> 논문의 field·PCS·Fiat–Shamir와 knowledge assumptions를 사용합니다.</p>
            <p><strong>근거 범위:</strong> PLONK 프로토콜과 보안 분석입니다.</p>
            <p><strong>일반화 금지:</strong> Dusk의 4-wire widgets, V3 transcript labels, proof 1008 bytes를 규정하지 않습니다.</p>
          </CitationBlock>
        </div>
        <div id="source-dusk-plonk">
          <CitationBlock
            type="code"
            citeKey={2}
            source="dusk-network/plonk v0.22.1 · commit b83aba4"
            href={DUSK_SOURCE}
          >
            <p><strong>문제:</strong> Circuit API를 실제 BLS12-381 PLONK prover와 verifier로 연결해야 합니다.</p>
            <p><strong>핵심 기여:</strong> Composer, 전처리, KZG, V3 transcript, proof와 verifier의 고정 Rust 구현을 제공합니다.</p>
            <p><strong>중요 가정:</strong> v0.22.1의 source, features와 protocol version을 고정합니다.</p>
            <p><strong>근거 범위:</strong> 이 글에서 연 파일과 재현 fixture의 동작입니다.</p>
            <p><strong>일반화 금지:</strong> 저장소 README는 library를 unstable로 표시합니다. 보안 감사 이력도 모든 사용 환경의 production 승인을 뜻하지 않습니다.</p>
          </CitationBlock>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          v0.22.1은 2026-06-12 공개된 릴리스이며 verifier hot path와 malformed length parsing 수정 사항을
          포함합니다. 이후 main의 변경은 이 글의 구현 사실로 사용하지 않았습니다.{" "}
          <a href={DUSK_RELEASE} className="font-bold text-primary hover:underline">릴리스 기록 보기</a>
        </p>
      </section>

      <ZkFromScratchMapReturn
        currentSlug="impl-plonk"
        closure="PLONK 구현에서는 관계가 Composer의 여러 행으로 내려가고, compile이 selector·permutation key를 고정하며, prove와 verify가 같은 public input·commitment·challenge 순서를 재생해야 한 증명이 성립합니다."
      />

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={officialPlonkCodeRefs}
        fileTrees={{ duskPlonk: plonkTree }}
        projectMetas={{
          duskPlonk: {
            id: "duskPlonk",
            label: "dusk-network · plonk v0.22.1",
            badgeClass: "border-violet-500 bg-violet-500/10 text-violet-700",
          },
        }}
      />
    </article>
  );
}
