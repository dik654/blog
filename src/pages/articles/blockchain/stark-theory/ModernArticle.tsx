import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import STARKPipelineViz from "./STARKPipelineViz";

export default function ModernSTARKTheoryArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3"><p className="text-sm font-semibold text-primary">한 줄 실행을 검증 가능한 trace로 바꾸는 STARK</p><h2 className="text-3xl font-bold tracking-tight">계산의 매 step을 기록하고 그 규칙을 low-degree claim으로 낮춘다</h2></header>
        <p className="text-lg leading-8 text-foreground/90">F₁₇에서 f(X)=X²+2X+3을 x=4에 계산하는 Horner 방법을 써 봅시다. v₀=1, v₁=v₀·4+2=6, v₂=v₁·4+3=27≡10입니다. STARK의 execution trace는 이 중간 상태를 표로 기록하고, AIR(algebraic intermediate representation)는 인접 행이 같은 전이 규칙을 따르는지 검사합니다.</p>
        <p>그다음 여러 제약을 composition polynomial 하나로 결합하고 더 큰 domain에 low-degree extension(LDE)한 뒤 Merkle root로 commit합니다. 마지막 low-degree proximity 검사는 FRI가 담당합니다. 즉 STARK는 특정 polynomial commitment 한 식이 아니라 trace·AIR·composition·LDE·oracle transcript의 파이프라인입니다.</p>
        <aside className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm leading-6"><strong>핵심 아이디어:</strong> “프로그램을 실행했다”는 의미를 trace와 AIR가 소유하고, “그 제약 polynomial이 낮은 차수다”는 검사를 FRI가 소유합니다. Hash 기반 transparent setup은 trusted ceremony를 없애지만 보안 가정 자체를 없애지는 않습니다.</aside>
        <ContentBoundary article="stark-theory" />
        <STARKPipelineViz />
      </section>

      <section id="trace-air" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">01 · Execution trace와 AIR</p><h2 className="mt-2 text-2xl font-bold">행 사이의 전이와 첫·마지막 행의 경계를 분리한다</h2></header>
        <ExplainedFormula
          question="Horner trace가 x=4에서 f(4)=10을 계산했다는 것을 어떤 제약으로 확인하는가?"
          idea={<>각 행의 상태 vᵢ와 다음 행 vᵢ₊₁ 사이에 곱셈·덧셈 규칙을 둡니다. 첫 coefficient와 마지막 공개 output은 boundary constraint로 고정합니다.</>}
          formula={String.raw`v_0=1,\quad v_{i+1}=xv_i+a_{i+1},\quad (a_1,a_2)=(2,3),\quad v_2=y=10\quad\text{in }\mathbb F_{17}`}
          annotatedFormula={String.raw`v_0=\underbrace{1,\quad v_{i+1}=xv_i+a_{i+1},\quad (a_1,a_2)=(2,3),\quad v_2=y=10\quad\text{in }\mathbb F_{17}}_{\text{Trace state 계산}}`}
          operations={[
            { expression: String.raw`1,\quad v_{i+1}=xv_i+a_{i+1},\quad (a_1,a_2)=(2,3),\quad v_2=y=10\quad\text{in }\mathbb F_{17}`, annotation: ["Trace state이(가) 식의 결과에 기여하는 방식을","계산합니다.","각 행의 상태 vᵢ와 다음 행 vᵢ₊₁ 사이에 곱셈·덧셈","규칙을 둡니다."] },
          ]}
          terms={[
            { symbol: "v_i", name: "Trace state", description: "i번째 step까지 Horner 계산이 누적한 field 값입니다." },
            { symbol: "x", name: "Public evaluation point", description: "예에서는 4이며 statement에 binding되어야 합니다." },
            { symbol: "a_i", name: "Coefficient schedule", description: "각 step에서 더할 coefficient입니다." },
            { symbol: "y", name: "Public output", description: "마지막 trace row가 일치해야 하는 값 10입니다." },
          ]}
          assumptions={["Trace row ordering과 coefficient schedule이 AIR에 고정되고 같은 field F₁₇을 사용합니다.", "Transition constraint는 적용해야 할 모든 row에 selector로 활성화됩니다.", "첫 row와 마지막 output은 별도 boundary constraint로 public statement에 binding됩니다."]}
          interpretation="v₀=1에서 v₁=1·4+2=6, v₂=6·4+3=27≡10이므로 honest trace는 통과합니다. 전이 제약만 두고 마지막 y=10 경계를 빼면 y=11이라는 거짓 public claim과 무관한 올바른 내부 trace도 통과할 수 있습니다."
        />
        <p><strong>증명 아이디어:</strong> Trace columns를 domain H 위 polynomial로 보간하면 현재 행과 다음 행은 X와 generator·X evaluation 관계로 표현됩니다. 각 transition numerator가 적용 row에서 0이면 해당 selector/vanishing factor로 나누어떨어집니다. 모든 제약을 random coefficient로 섞어 composition polynomial 하나로 만들면 prover가 challenge를 보기 전에 특정 제약의 오차를 다른 제약으로 상쇄하기 어렵습니다.</p>
        <ExplainedFormula
          question="여러 AIR 제약을 verifier가 검사할 하나의 low-degree claim으로 어떻게 묶는가?"
          idea={<>각 constraint numerator Nⱼ가 적용 domain의 zero polynomial Zⱼ로 나누어떨어져야 합니다. Quotient들을 commitment 뒤 random αⱼ로 합쳐 composition polynomial을 만듭니다.</>}
          formula={String.raw`Q_j(X)=\frac{N_j(X)}{Z_j(X)},\qquad C(X)=\sum_{j=1}^{m}\alpha_j Q_j(X)`}
          annotatedFormula={String.raw`Q_j(X)=\underbrace{\frac{N_j(X)}{Z_j(X)},\qquad C(X)=\sum_{j=1}^{m}\alpha_j Q_j(X)}_{\text{기준량당 비율}}`}
          operations={[
            { expression: String.raw`\frac{N_j(X)}{Z_j(X)},\qquad C(X)=\sum_{j=1}^{m}\alpha_j Q_j(X)`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","각 constraint numerator Nⱼ가 적용","domain의 zero polynomial Zⱼ로","나누어떨어져야 합니다."] },
          ]}
          terms={[
            { symbol: "N_j", name: "Constraint numerator", description: "j번째 전이 또는 경계 식을 polynomial로 표현한 오차입니다." },
            { symbol: "Z_j", name: "Constraint zero polynomial", description: "그 제약이 적용되는 row set에서 0입니다." },
            { symbol: "Q_j", name: "Constraint quotient", description: "AIR가 만족될 때 polynomial로 존재합니다." },
            { symbol: "\\alpha_j", name: "Composition challenge", description: "Committed trace 뒤 transcript에서 뽑는 random mixing coefficient입니다." },
            { symbol: "C(X)", name: "Composition polynomial", description: "FRI에 넘길 combined low-degree object입니다." },
          ]}
          assumptions={["각 Nⱼ의 degree와 적용 domain·Zⱼ가 정확히 산정됩니다.", "αⱼ는 trace commitment 뒤 생성되고 statement·AIR profile에 binding됩니다.", "Division 결과와 claimed degree bound를 consistency openings와 함께 검사합니다."]}
          interpretation="Valid trace에서는 각 remainder가 0이라 Qⱼ가 존재합니다. AIR가 누락된 경우에는 composition이 완벽히 low degree여도 원래 프로그램 의미를 증명하지 못합니다. 따라서 constraint coverage test가 cryptographic test보다 먼저입니다."
        />
      </section>

      <section id="lde-fri" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">02 · LDE, Merkle, FRI</p><h2 className="mt-2 text-2xl font-bold">Trace domain 밖으로 평가해 distance를 만든 뒤 일부만 연다</h2></header>
        <p>Trace가 n개 row에만 있으면 그 n개 값에는 degree&lt;n polynomial이 항상 하나 존재하므로 “낮은 차수” 검사가 약합니다. STARK는 NTT-friendly larger coset domain으로 polynomial을 다시 평가해 LDE oracle를 만듭니다. Blowup factor가 커지면 code distance와 sampling 여유가 늘 수 있지만 prover의 FFT·hash·memory와 proof query path도 늘어납니다.</p>
        <p>Prover는 trace LDE와 composition evaluations를 Merkle root로 고정하고, transcript challenge를 받은 다음 필요한 consistency openings와 FRI queries를 제공합니다. FRI는 oracle proximity만 검사하므로 trace root, public statement, AIR identifier, domain, round roots와 challenges의 순서가 모두 transcript에 binding되어야 합니다.</p>
        <div className="overflow-x-auto rounded-lg border border-border"><table className="min-w-[720px] w-full text-sm"><thead className="bg-muted/50 text-left"><tr><th className="p-3">비용 축</th><th className="p-3">주요 원인</th><th className="p-3">같이 기록할 경계</th></tr></thead><tbody className="divide-y divide-border text-muted-foreground"><tr><td className="p-3 font-medium text-foreground">Prover time</td><td className="p-3">trace 생성, NTT/LDE, composition, hash, FRI</td><td className="p-3">같은 trace 길이·blowup·query 수</td></tr><tr><td className="p-3 font-medium text-foreground">Peak memory</td><td className="p-3">여러 LDE columns와 Merkle layers</td><td className="p-3">Streaming 여부와 materialized buffers</td></tr><tr><td className="p-3 font-medium text-foreground">Proof bytes</td><td className="p-3">roots, field openings, authentication paths</td><td className="p-3">Batch path dedup·hash width</td></tr><tr><td className="p-3 font-medium text-foreground">Verifier</td><td className="p-3">hash paths, field checks, FRI rounds</td><td className="p-3">Security target와 failure parity</td></tr></tbody></table></div>
      </section>

      <section id="security-cost" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">03 · 보안·ZK·release gate</p><h2 className="mt-2 text-2xl font-bold">Transparent는 ceremony가 없다는 뜻이지 assumption-free라는 뜻이 아니다</h2></header>
        <p>STARK의 soundness는 AIR reduction, polynomial degree bounds, field size, code distance, sampling, Fiat–Shamir modeling과 collision-resistant hash에 걸쳐 있습니다. Post-quantum 방향이라는 표현도 선택 hash와 security model에 귀속해야 하며, 모든 parameter와 구현이 자동으로 양자 공격에 안전하다는 뜻은 아닙니다.</p>
        <p>또한 STARK라는 이름만으로 zero knowledge가 생기지 않습니다. Raw trace LDE를 그대로 commit하면 private witness가 query openings나 algebraic relation을 통해 새어 나갈 수 있습니다. ZK가 필요하면 trace/composition blinding, randomized padding, query distribution과 simulator argument가 protocol profile에 명시되어야 합니다.</p>
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-5 text-sm leading-6"><strong>Release gate:</strong> 잘못된 첫·마지막 row, 누락 transition, wrong public input, composition remainder, LDE domain, Merkle path, FRI fold, transcript reorder를 각각 주입합니다. False accept 0과 stable reason code를 확인한 다음 prover phase time·peak RSS·proof bytes·verify hash/field time을 측정합니다.</div>
        <div id="paper-stark"><CitationBlock source="Ben-Sasson et al. · Scalable, transparent, and post-quantum secure computational integrity (2018)" citeKey={1} href="https://eprint.iacr.org/2018/046.pdf"><p><strong>문제:</strong> Trusted setup 없이 큰 계산의 integrity를 scalable prover와 succinct verifier로 증명해야 합니다.</p><p><strong>기여:</strong> Algebraic execution trace, constraint composition, oracle commitment와 FRI 계열을 잇는 STARK construction·evaluation을 제시합니다.</p><p><strong>전제:</strong> 논문의 RAM/AIR encoding, field·hash·random-oracle, proximity와 parameter model을 사용합니다.</p><p><strong>근거 범위:</strong> 논문 construction과 보고된 implementation experiment 범위입니다.</p><p><strong>말하지 않는 것:</strong> 모든 STARK library의 동일 보안·성능이나 자동 zero knowledge를 보장하지 않습니다.</p></CitationBlock></div>
        <div id="paper-fri-in-stark"><CitationBlock source="Ben-Sasson et al. · FRI (ICALP 2018)" citeKey={2} href="https://drops.dagstuhl.de/entities/document/10.4230/LIPIcs.ICALP.2018.14"><p><strong>문제:</strong> Committed evaluation oracle의 Reed–Solomon proximity를 적은 query로 검사해야 합니다.</p><p><strong>기여:</strong> Recursive even/odd folding과 IOPP soundness 분석을 제시합니다.</p><p><strong>전제:</strong> 논문의 code, distance, domain, randomness와 oracle model을 사용합니다.</p><p><strong>근거 범위:</strong> STARK pipeline 중 low-degree testing 구성요소에 한정합니다.</p><p><strong>말하지 않는 것:</strong> Trace/AIR semantic correctness나 STARK 전체 ZK를 맡지 않습니다.</p></CitationBlock></div>
        <p>이 글의 10문항은 Horner trace, 전이·경계, AIR→composition, LDE, Merkle/FRI 역할, transparency, 누락 경계 반례, degree 계산, ZK leakage, release benchmark를 묻습니다. 본문의 수치 trace·식·전제·negative corpus로 모두 답할 수 있습니다.</p>
      </section>
    </article>
  );
}
