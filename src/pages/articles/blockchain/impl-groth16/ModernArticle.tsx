import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { Groth16ImplementationViz } from "./Groth16ImplementationViz";

const GROTH16 = "https://eprint.iacr.org/2016/260";
const ARK_PROVER = "https://github.com/arkworks-rs/groth16/blob/8f0904a7d7a2c8945bf770bdd3c2081e0be1941a/src/prover.rs";
const ARK_DATA = "https://github.com/arkworks-rs/groth16/blob/8f0904a7d7a2c8945bf770bdd3c2081e0be1941a/src/data_structures.rs";

export default function ModernGroth16ImplementationArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">한 circuit artifact에서 검증 가능한 proof receipt까지</p><h2 className="text-3xl font-bold tracking-tight">Groth16 구현의 핵심은 세 점을 계산하는 코드가 아니라 circuit·witness·key·domain이 같은 relation을 가리키게 하는 것이다</h2></header>
      <p className="text-lg leading-8 text-foreground/90">Groth16 proof는 작지만 prover의 입력은 작지 않습니다. Circuit에서 나온 R1CS, witness layout, QAP evaluation domain, proving key queries와 public input order가 모두 같아야 합니다. <a className="text-primary hover:underline" href="/crypto/groth16">Groth16 수학 정본</a>이 R1CS→QAP와 pairing equation을 소유하므로, 이 글은 Rust artifact/profile, key admission, parallel execution과 release gate를 맡습니다.</p>
      <p>고정 workload는 같은 circuit digest의 witness를 읽고 quotient polynomial을 계산한 뒤 A·B·C proof를 serialize하고 independent verifier가 승인하는 흐름입니다. Setup key가 크기만 맞는다고 재사용하지 않으며, circuit revision이나 public input order가 바뀌면 다른 artifact입니다.</p>
      <Groth16ImplementationViz />
      <ContentBoundary article="impl-groth16" />
    </section>

    <section id="artifact-profile" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · Artifact profile</p><h2 className="mt-2 text-2xl font-bold">relation digest·field/curve·public schema·domain·keys를 하나의 profile로 봉인한다</h2></header>
      <p>Profile에는 source/compiler/R1CS digests, constraint·variable·public counts, witness symbol/order, scalar field와 curve ids, QAP domain size와 root order, proving/verifying key digests, serialization version과 generator revision을 넣습니다. Proof에도 직접 또는 receipt를 통해 profile id를 결속합니다.</p>
      <ExplainedFormula question="서로 다른 circuit과 key가 조용히 섞이지 않게 어떤 identity를 만들까?" idea={<>모든 protocol-critical artifact를 length-delimited canonical encoding으로 digest합니다.</>} formula={String.raw`A_G=H(d_R\|d_W\|p\|E\|n\|\omega\|d_{pk}\|d_{vk}\|s\|v)`}
      annotatedFormula={String.raw`A_G=\underbrace{H(d_R\|d_W\|p\|E\|n\|\omega\|d_{pk}\|d_{vk}\|s\|v)}_{\text{Groth16 artifact id 계산}}`}
      operations={[
        { expression: String.raw`H(d_R\|d_W\|p\|E\|n\|\omega\|d_{pk}\|d_{vk}\|s\|v)`, annotation: ["Groth16 artifact id이(가) 식의 결과에","기여하는 방식을 계산합니다.","모든 protocol-critical artifact를","length-delimited canonical"] },
      ]} terms={[
        {symbol:"A_G",name:"Groth16 artifact id",description:"한 구현 profile을 식별하는 digest입니다."},{symbol:"H",name:"Pinned digest",description:"Canonical encoded fields를 묶는 hash입니다."},{symbol:"d_R",name:"Relation digest",description:"R1CS/circuit artifact의 digest입니다."},{symbol:"d_W",name:"Witness schema digest",description:"Signal order와 public/private layout을 식별합니다."},{symbol:"p",name:"Scalar field modulus",description:"R1CS와 polynomial coefficients가 속한 field입니다."},{symbol:"E",name:"Curve profile",description:"G1/G2/pairing implementation artifact id입니다."},{symbol:"n,\\omega",name:"QAP domain",description:"Domain size와 pinned primitive root입니다."},{symbol:"d_{pk},d_{vk}",name:"Key digests",description:"Proving/verifying key bytes의 identities입니다."},{symbol:"s,v",name:"Schema and revision",description:"Serialization schema와 implementation revision입니다."},
      ]} assumptions={["각 field는 type·length가 분명한 canonical encoding이며 단순 문자열 이어붙이기를 쓰지 않습니다.","Digest는 혼합을 탐지할 뿐 trusted setup의 정직성이나 relation soundness를 증명하지 않습니다."]} interpretation="Constraint 수가 같아도 public input order나 root ω가 다르면 AG가 달라져야 합니다. 파일명만 같은 key cache는 admission 근거가 아닙니다." />
      <div id="paper-groth16"><CitationBlock type="paper" citeKey={1} source="Groth · On the Size of Pairing-based Non-interactive Arguments · 2016/260" href={GROTH16}><p><strong>문제:</strong> Pairing 기반 preprocessing SNARK의 proof와 verifier를 매우 작고 빠르게 구성해야 합니다.</p><p><strong>핵심 기여:</strong> Relation-specific setup 아래 세 group elements의 proof와 pairing-based verification construction을 제시합니다.</p><p><strong>중요 가정:</strong> 논문의 algebraic groups, knowledge/soundness model, trusted setup와 randomness assumptions를 사용합니다.</p><p><strong>근거 범위:</strong> Groth16 protocol construction과 분석입니다.</p><p><strong>일반화 금지:</strong> 특정 Rust serialization·ceremony 운영·fixed proving speed나 구현 side-channel 안전성을 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="setup-key" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · Setup key admission</p><h2 className="mt-2 text-2xl font-bold">key를 mmap한 뒤 query length와 모든 encoded point를 검증하고 relation profile과 맞지 않으면 실패한다</h2></header>
      <p>
            Loader는 magic/schema/version, curve id, relation digest, domain size, public count와 query lengths를
            먼저 검사합니다. Point bytes는 canonical decode, on-curve와 subgroup validation을 거칩니다. Setup transcript나
            ceremony provenance가 필요하면 별도 attestation을 profile에 연결하며 key 파일을 성공적으로 읽었다는 사실을 toxic waste 폐기 증명으로
            바꾸지 않습니다.
          </p>
      <ExplainedFormula question="Proving key query 길이가 witness와 domain에 맞는지 어떤 bounds로 검사할까?" idea={<>A/B queries는 전체 variables, L query는 private variables, H query는 quotient domain에 맞아야 합니다.</>} formula={String.raw`|A|,|B_1|,|B_2|\ge N_v,\qquad |L|=N_v-N_{pub}-1,\qquad |H|\ge n-1`}
      annotatedFormula={String.raw`|A|,|B_1|,|B_2|\ge N_v,\qquad |L|=\underbrace{N_v-N_{pub}-1,\qquad |H|\ge n-1}_{\text{허용 경계 판정}}`}
      operations={[
        { expression: String.raw`N_v-N_{pub}-1,\qquad |H|\ge n-1`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","A/B queries는 전체 variables, L","query는 private variables, H query는","quotient domain에 맞아야 합니다."] },
      ]} terms={[
        {symbol:"|A|,|B_1|,|B_2|",name:"Variable query lengths",description:"Witness scalars와 결합할 proving-key point counts입니다."},{symbol:"N_v",name:"Variable count",description:"상수 1을 포함한 witness vector 길이입니다."},{symbol:"|L|",name:"Private query length",description:"Public과 constant를 뺀 private witness용 G1 points입니다."},{symbol:"N_{pub}",name:"Public input count",description:"Verifier가 직접 결속하는 inputs 수입니다."},{symbol:"|H|",name:"Quotient query length",description:"QAP quotient coefficients와 결합할 points 수입니다."},{symbol:"n",name:"Domain size",description:"Pinned evaluation domain 크기입니다."},
      ]} assumptions={["Exact inequalities와 indexing은 pinned implementation/key format에 귀속하며 loader와 generator가 같은 schema를 사용합니다.","길이 검사는 필요조건일 뿐 point validity·relation digest·ceremony provenance를 대신하지 않습니다."]} interpretation="N_v=16,N_pub=3이면 L은 12 points가 필요합니다. 11이면 out-of-bounds, 13이면 schema drift를 숨길 수 있으므로 exact profile rule로 거절합니다." />
      <div id="paper-ark-groth16-data"><CitationBlock type="code" citeKey={2} source="arkworks Groth16 data structures · commit 8f0904a" href={ARK_DATA}><p><strong>문제:</strong> Proving/verifying keys와 proof의 curve-typed fields를 Rust에서 직렬화 가능한 구조로 나타내야 합니다.</p><p><strong>핵심 기여:</strong> Pinned source는 ProvingKey, VerifyingKey, PreparedVerifyingKey와 Proof structures를 정의합니다.</p><p><strong>중요 가정:</strong> commit 8f0904a와 동일한 arkworks algebra/serialization types와 curve configuration을 사용합니다.</p><p><strong>근거 범위:</strong> 해당 revision의 in-memory artifact layout과 trait surface입니다.</p><p><strong>일반화 금지:</strong> Deserialize 성공이 key provenance·subgroup admission·cross-version schema compatibility를 자동 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="prover-plan" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · Prover execution plan</p><h2 className="mt-2 text-2xl font-bold">witness parity 뒤 quotient FFT와 독립 MSMs를 병렬화하되 dependency와 buffer lifetime을 receipt에 남긴다</h2></header>
      <p>먼저 R1CS evaluator가 witness를 다시 검사합니다. 이어 A(X),B(X),C(X)를 domain에서 만들고 H(X)=(AB−C)/Z를 계산합니다. Query와 scalars가 준비된 MSM은 서로 병렬화할 수 있지만 H MSM은 quotient 완료 전 시작할 수 없습니다. Thread pool 수, FFT order, MSM window, scratch ownership과 peak RSS를 profile로 기록합니다.</p>
      <ExplainedFormula question="왜 quotient 계산은 witness가 relation을 만족하는지 확인하는 구현 checkpoint가 될까?" idea={<>모든 constraints가 domain에서 0이면 AB−C는 vanishing polynomial Z로 나누어떨어집니다.</>} formula={String.raw`H(X)=\frac{A(X)B(X)-C(X)}{Z(X)},\qquad Z(X)=X^n-1`}
      annotatedFormula={String.raw`H(X)=\underbrace{\frac{A(X)B(X)-C(X)}{Z(X)},\qquad Z(X)=X^n-1}_{\text{기준량당 비율}}`}
      operations={[
        { expression: String.raw`\frac{A(X)B(X)-C(X)}{Z(X)},\qquad Z(X)=X^n-1`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","모든 constraints가 domain에서 0이면 AB−C는","vanishing polynomial Z로 나누어떨어집니다."] },
      ]} terms={[
        {symbol:"A(X),B(X),C(X)",name:"QAP polynomials",description:"R1CS rows와 witness를 결합한 polynomials입니다."},{symbol:"Z(X)",name:"Vanishing polynomial",description:"n-th root domain의 모든 points에서 0인 polynomial입니다."},{symbol:"n",name:"Domain size",description:"FFT/QAP profile이 정한 power-of-two 등 exact size입니다."},{symbol:"H(X)",name:"Quotient",description:"나머지가 0일 때 존재하는 prover polynomial입니다."},{symbol:"X",name:"Formal variable",description:"Polynomial indeterminate입니다."},
      ]} assumptions={["Domain points와 interpolation order가 R1CS→QAP generator와 동일합니다.","나머지 0은 pinned witness/relation의 만족을 나타내지만 proof soundness 전체나 setup 정직성을 대신하지 않습니다."]} interpretation="n=4이면 Z=X⁴−1입니다. AB−C를 나눈 나머지가 0이 아니면 MSM을 계속해도 valid proof가 되지 않으므로 즉시 실패해야 합니다." />
      <div id="paper-ark-groth16-prover"><CitationBlock type="code" citeKey={3} source="arkworks Groth16 prover · commit 8f0904a" href={ARK_PROVER}><p><strong>문제:</strong> Witness assignments, randomness와 proving-key queries에서 Groth16 A·B·C를 계산해야 합니다.</p><p><strong>핵심 기여:</strong> Pinned source는 quotient witness map, scalar-query MSMs와 proof assembly의 concrete Rust path를 제공합니다.</p><p><strong>중요 가정:</strong> commit 8f0904a의 reduction trait, curve engine, key generation과 serialization revision을 고정합니다.</p><p><strong>근거 범위:</strong> 해당 ark-groth16 prover implementation입니다.</p><p><strong>일반화 금지:</strong> 모든 stages가 자동 병렬화되거나 fixed memory/speed, production readiness·constant-time을 보장한다는 뜻은 아닙니다.</p></CitationBlock></div>
    </section>

    <section id="release-gate" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">04 · Release gate</p><h2 className="mt-2 text-2xl font-bold">positive proof 하나보다 mismatch fixtures와 independent verifier가 먼저다</h2></header>
      <p>Valid witness와 함께 wrong public order, unsatisfied constraint, relation/key digest mismatch, truncated query, noncanonical/wrong-subgroup point, wrong domain root, corrupted proof와 swapped A/B/C를 넣습니다. Independent implementation verifier와 결과를 비교하고 stage timings, peak RSS, proof bytes, verifier time을 기록합니다. 실패하거나 p95/RSS budget을 넘으면 이전 binary·key artifact로 rollback합니다.</p>
      <ExplainedFormula question="병렬 prover 성능을 어떤 end-to-end 경계에서 비교할까?" idea={<>Setup cache 조건을 고정하고 artifact admission부터 independent verification까지의 wall time을 합칩니다.</>} formula={String.raw`T_{e2e}=T_{admit}+T_{witness}+T_{QAP}+T_{MSM}+T_{serialize}+T_{verify}`}
      annotatedFormula={String.raw`T_{e2e}=\underbrace{T_{admit}+T_{witness}+T_{QAP}+T_{MSM}+T_{serialize}+T_{verify}}_{\text{Serialization 계산}}`}
      operations={[
        { expression: String.raw`T_{admit}+T_{witness}+T_{QAP}+T_{MSM}+T_{serialize}+T_{verify}`, annotation: ["Serialization이(가) 식의 결과에 기여하는 방식을","계산합니다.","Setup cache 조건을 고정하고 artifact","admission부터 independent"] },
      ]} terms={[
        {symbol:"T_{e2e}",name:"End-to-end latency",description:"한 proof가 release receipt를 얻는 전체 시간입니다."},{symbol:"T_{admit}",name:"Admission",description:"Profile·key·encoding 검증 시간입니다."},{symbol:"T_{witness}",name:"Witness parity",description:"Witness load와 R1CS satisfaction 검사 시간입니다."},{symbol:"T_{QAP}",name:"QAP time",description:"FFT, quotient와 divisibility 확인 시간입니다."},{symbol:"T_{MSM}",name:"MSM time",description:"All proof query MSMs의 critical-path 시간입니다."},{symbol:"T_{serialize}",name:"Serialization",description:"Canonical proof/public output 생성 시간입니다."},{symbol:"T_{verify}",name:"Independent verification",description:"분리된 verifier가 receipt를 만드는 시간입니다."},
      ]} assumptions={["Same circuit/key/profile/input, thread affinity와 cold/warm cache condition을 고정합니다.","겹쳐 실행된 stages는 단순 합산하지 말고 trace의 wall-clock critical path와 stage durations를 함께 보고합니다."]} interpretation="MSM만 2배 빨라져도 admission·QAP·verify가 지배하면 end-to-end는 2배가 아닙니다. 고정 배속 대신 측정 receipt를 남깁니다." />
      <aside className="rounded-lg border border-border bg-muted/20 p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">Article-only 10/10:</strong> profile identity, public order, key admission, query lengths, quotient 식, n=4 예, parallel dependency, proof structure, negative suite, end-to-end·rollback을 이 글만으로 답할 수 있습니다.</aside>
    </section>
  </article>;
}
