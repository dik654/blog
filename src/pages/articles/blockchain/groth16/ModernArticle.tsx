import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import Groth16FlowViz from "./viz/Groth16FlowViz";

export default function ModernGroth16Article() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3"><p className="text-sm font-semibold text-primary">x·w=y에서 세 group element까지</p><h2 className="text-3xl font-bold tracking-tight">Groth16은 회로별 QAP를 pairing 검증식 하나로 컴파일한다</h2></header>
        <p className="text-lg leading-8 text-foreground/90">공개값 x=3, y=12와 witness w=4가 x·w=y를 만족한다는 관계를 먼저 R1CS와 QAP로 바꿉니다. Groth16은 이 QAP의 coefficient와 secret evaluation point를 elliptic-curve group element에 미리 encode한 <strong>circuit-specific CRS</strong>를 만들고, prover가 witness를 사용해 proof π=(A,B,C)를 생성하게 합니다.</p>
        <p>Verifier는 witness나 전체 constraint를 다시 계산하지 않습니다. Public input에 해당하는 verifying-key elements를 선형 결합하고 세 pairing 항을 확인합니다. Proof가 작은 이유는 계산 자체를 세 점에 “압축 저장”해서가 아니라, QAP 만족 관계를 bilinear group에서 검증할 수 있게 CRS와 knowledge-sound construction을 설계했기 때문입니다.</p>
        <aside className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm leading-6"><strong>핵심 아이디어:</strong> QAP quotient h가 존재한다는 사실, public input과 witness가 같은 assignment에서 왔다는 사실, prover가 CRS 요소를 허용된 선형 결합으로 사용했다는 사실을 α·β·γ·δ로 분리해 묶고 pairing equation에서 한꺼번에 검사합니다.</aside>
        <ContentBoundary article="groth16" />
        <Groth16FlowViz />
      </section>

      <section id="qap-setup" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">01 · QAP와 setup</p><h2 className="mt-2 text-2xl font-bold">Setup은 witness가 아니라 relation을 보고 key를 만든다</h2></header>
        <p>QAP에서 assignment coefficient aᵢ를 public part와 private part로 나눕니다. Setup은 circuit와 보안 파라미터를 받지만 실제 w=4를 알아서는 안 됩니다. Secret trapdoor τ·α·β·γ·δ로 필요한 polynomial evaluation을 G₁/G₂ elements에 encode한 proving key와 verifying key를 만든 뒤 trapdoor를 지워야 합니다.</p>
        <ExplainedFormula
          question="QAP를 만족하는 witness에서 prover가 반드시 계산해야 하는 quotient는 무엇인가?"
          idea={<>Assignment로 만든 A·B−C가 target polynomial t로 정확히 나누어지는 몫 h를 구합니다. 나머지가 있으면 어느 constraint point에서는 R1CS가 깨졌다는 뜻입니다.</>}
          formula={String.raw`h(X)=\frac{A(X)B(X)-C(X)}{t(X)},\qquad t(X)=\prod_{i=1}^{m}(X-r_i)`}
          annotatedFormula={String.raw`h(X)=\underbrace{\frac{A(X)B(X)-C(X)}{t(X)},\qquad t(X)=\prod_{i=1}^{m}(X-r_i)}_{\text{기준량당 비율}}`}
          operations={[
            { expression: String.raw`\frac{A(X)B(X)-C(X)}{t(X)},\qquad t(X)=\prod_{i=1}^{m}(X-r_i)`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Assignment로 만든 A·B−C가 target","polynomial t로 정확히 나누어지는 몫 h를 구합니다."] },
          ]}
          terms={[
            { symbol: "A,B,C", name: "Assignment polynomials", description: "Public input과 witness coefficient로 QAP column polynomials를 합칩니다." },
            { symbol: "t", name: "Target polynomial", description: "모든 R1CS row point에서 0입니다." },
            { symbol: "h", name: "Quotient witness", description: "모든 row가 만족될 때만 polynomial로 exact하게 존재합니다." },
            { symbol: "m", name: "Constraint count", description: "Target polynomial의 root 수와 prover polynomial 규모를 좌우합니다." },
          ]}
          assumptions={["R1CS→QAP mapping, field, degree bound와 public-input ordering이 setup과 proving에서 같습니다.", "CRS group elements는 올바른 subgroup·encoding에 있고 trapdoor contribution의 보안 조건을 만족합니다.", "Exact division failure를 무시하거나 remainder를 버리는 구현은 fail closed해야 합니다."]}
          interpretation="한 행 xw=y에서 w=4면 numerator가 0이고 h=0입니다. w=5면 numerator가 3이어서 t=X−1로 나누어떨어지지 않습니다. 이 algebraic failure가 proof 생성 실패 또는 verifier reject로 이어져야 합니다."
        />
        <h3 className="text-xl font-semibold">왜 α·β·γ·δ를 나누어 쓰는가</h3>
        <p>
            α와 β는 A·B pairing의 기준 항을 만들고 γ는 public input linear combination을, δ는 private witness·quotient와
            proof randomization을 서로 다른 denominator domain에 묶습니다. 정확한 reduction은 generic-group/knowledge
            assumptions와 construction variant에 의존합니다. “임의의 group element 세 개가 식만 맞으면 witness를 안다”는 직관만으로
            soundness를 증명할 수는 없습니다.
          </p>
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-5 text-sm leading-6"><strong>Toxic-waste 반례:</strong> τ·α·β·γ·δ를 공격자가 복원할 수 있으면 polynomial relation을 만족하지 않는 encoded element를 조합해 위조할 수 있습니다. Ceremony transcript가 유효하고 최소 한 contribution이 정직하게 폐기됐다는 전제, final key hash와 회로 hash가 일치한다는 운영 검사가 필요합니다.</div>
      </section>

      <section id="prove-verify" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">02 · Prove와 Verify</p><h2 className="mt-2 text-2xl font-bold">A·B·C와 public-input linear combination을 같은 statement에 묶는다</h2></header>
        <p>
            Prover는 QAP assignment, quotient h와 fresh randomness r,s를 proving-key elements의 MSM으로 조합해 A∈G₁,
            B∈G₂, C∈G₁을 만듭니다. Randomness는 proof를 다시 만들 때 같은 witness에서도 다른 A·B·C가 나오게 해 zero knowledge를 돕지만 약한
            RNG·reuse·로그 유출은 별도 위협입니다.
          </p>
        <ExplainedFormula
          question="Verifier가 public input과 proof 세 요소를 어떤 pairing 관계로 검사하는가?"
          idea={<>Public inputs xᵢ로 verifying-key basis를 합친 vkₓ를 만들고, proof pairing이 setup 기준항과 public/private contribution의 pairing 곱으로 분해되는지 확인합니다.</>}
          formula={String.raw`vk_x=IC_0+\sum_{i=1}^{\ell}x_iIC_i,\qquad e(A,B)=e(\alpha_1,\beta_2)\,e(vk_x,\gamma_2)\,e(C,\delta_2)`}
          annotatedFormula={String.raw`vk_x=\underbrace{IC_0+\sum_{i=1}^{\ell}x_iIC_i,\qquad e(A,B)=e(\alpha_1,\beta_2)\,e(vk_x,\gamma_2)\,e(C,\delta_2)}_{\text{Input coefficients 계산}}`}
          operations={[
            { expression: String.raw`IC_0+\sum_{i=1}^{\ell}x_iIC_i,\qquad e(A,B)=e(\alpha_1,\beta_2)\,e(vk_x,\gamma_2)\,e(C,\delta_2)`, annotation: ["Input coefficients이(가) 식의 결과에 기여하는","방식을 계산합니다.","Public inputs xᵢ로 verifying-key","basis를 합친 vkₓ를 만들고, proof pairing이"] },
          ]}
          terms={[
            { symbol: "IC_i", name: "Input coefficients", description: "i번째 public input을 G₁ linear combination에 결속하는 verifying-key 요소입니다." },
            { symbol: String.raw`\ell`, name: "Public-input count", description: "Verifier cost에는 적어도 이 linear combination이 포함됩니다." },
            { symbol: "A,B,C", name: "Proof elements", description: "각각 G₁, G₂, G₁에 속하며 canonical decode와 subgroup 검사가 필요합니다." },
            { symbol: "e", name: "Bilinear pairing", description: "Source-group scalar relation을 target-group product equation으로 옮깁니다." },
            { symbol: String.raw`\alpha_1,\beta_2,\gamma_2,\delta_2`, name: "Verification key anchors", description: "Setup trapdoor와 relation을 결속한 고정 group elements입니다." },
          ]}
          assumptions={["Proof와 key points는 identity policy·curve equation·subgroup·canonical encoding 검사를 통과합니다.", "Public input 수·순서·field encoding과 verifying key/circuit identifier가 정확히 일치합니다.", "Pairing library와 final exponentiation이 target curve parameter에서 검증됐습니다."]}
          interpretation="Arkworks 구현은 e(A,B)·e(vkₓ,−γ)·e(C,−δ)=e(α,β)를 multi-Miller loop와 한 final exponentiation으로 계산합니다. 부호가 다른 표현은 같은 식의 이항 결과일 수 있지만 G₁/G₂ 타입과 ordering은 바꿀 수 없습니다."
        />
        <p><strong>수치 statement 예:</strong> verifier input이 (3,12)일 때 proof가 accept해도 (3,15)에 재사용하면 vkₓ가 달라져 reject해야 합니다. Public input을 하나 빼거나 순서를 뒤집은 verifier가 accept한다면 proof system의 문제가 아니라 integration binding bug일 가능성이 큽니다.</p>
        <div id="code-arkworks-groth16"><CitationBlock type="code" source="arkworks ark-groth16 · verifier.rs" citeKey={2} href="https://docs.rs/ark-groth16/latest/src/ark_groth16/verifier.rs.html">
          <p><strong>문제:</strong> Groth16 proof와 public inputs를 pairing backend에서 검증해야 합니다.</p>
          <p><strong>기여:</strong> Prepared VK, public-input MSM, multi-Miller loop와 final exponentiation의 실제 Rust 경로를 제공합니다.</p>
          <p><strong>전제:</strong> 선택한 crate version·curve·serialization·upstream dependency를 함께 pin하고 untrusted input decode를 검증합니다.</p>
          <p><strong>근거 범위:</strong> 링크한 source의 API와 equation 구현 경로에만 사용합니다.</p>
          <p><strong>말하지 않는 것:</strong> Repository도 production-ready audit를 주장하지 않으며 application circuit·ceremony·deployment 안전을 보장하지 않습니다.</p>
        </CitationBlock></div>
      </section>

      <section id="boundaries" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">03 · 보안·비용 release gate</p><h2 className="mt-2 text-2xl font-bold">세 점이라는 크기와 end-to-end 비용을 구분한다</h2></header>
        <div className="overflow-x-auto rounded-lg border border-border"><table className="min-w-[780px] w-full text-sm"><thead className="bg-muted/50 text-left"><tr><th className="p-3">측정</th><th className="p-3">고정할 조건</th><th className="p-3">보고할 값</th></tr></thead><tbody className="divide-y divide-border text-muted-foreground"><tr><td className="p-3 font-medium text-foreground">Setup</td><td className="p-3">Circuit hash·constraints·curve·ceremony/key format</td><td className="p-3">Wall time·peak RSS·pk/vk bytes·transcript result</td></tr><tr><td className="p-3 font-medium text-foreground">Prove</td><td className="p-3">같은 witness corpus·threads·backend·warmup</td><td className="p-3">Witness/FFT/MSM breakdown·p50/p95·memory</td></tr><tr><td className="p-3 font-medium text-foreground">Verify</td><td className="p-3">Public-input count·batch·decode/subgroup policy</td><td className="p-3">Input MSM·pairing·end-to-end latency·reject reason</td></tr></tbody></table></div>
        <p>Groth16은 일반적으로 proof가 G₁ 두 개와 G₂ 한 개로 일정하지만 serialized bytes는 curve와 compressed encoding에 따라 달라집니다. Verify도 “상수 시간”이 아니라 public-input MSM O(ℓ)와 거의 고정된 pairing work를 합친 값입니다. Setup·proving key는 회로 크기에 따라 커집니다.</p>
        <div id="paper-groth16"><CitationBlock source="Jens Groth · On the Size of Pairing-based Non-interactive Arguments (EUROCRYPT 2016)" citeKey={1} href="https://eprint.iacr.org/2016/260.pdf">
          <p><strong>문제:</strong> Pairing 기반 preprocessing SNARK의 proof와 verifier를 더 작게 만들고 싶습니다.</p>
          <p><strong>기여:</strong> 세 group element proof와 세 pairing 중심 검증을 갖는 QAP 기반 construction을 제시합니다.</p>
          <p><strong>전제:</strong> Relation-specific CRS, bilinear groups, 논문의 generic-group/knowledge-soundness 모델과 zero-knowledge randomization을 사용합니다.</p>
          <p><strong>근거 범위:</strong> 논문 construction·proof·reported asymptotic/concrete comparison 범위에 한정합니다.</p>
          <p><strong>말하지 않는 것:</strong> Toxic waste 노출 안전, post-quantum security, 모든 curve/library의 고정 byte·latency를 보장하지 않습니다.</p>
        </CitationBlock></div>
        <p>이 글의 10문항은 QAP quotient, setup 입력, toxic waste, αβγδ 역할, proof 구성, pairing equation, public input 재결속, invalid point, 비용 분해, 회로 변경 시 재설정을 묻습니다. 모든 답은 위 수식·예·반례·측정 표 안에서 복원할 수 있습니다.</p>
      </section>
    </article>
  );
}
