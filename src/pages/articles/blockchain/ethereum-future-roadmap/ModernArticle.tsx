import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import EthereumRoadmapViz from "./viz/EthereumRoadmapViz";

export default function ModernEthereumFutureRoadmapArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">Ethereum future roadmap · maturity first</p><h2 className="text-3xl font-bold tracking-tight">Roadmap은 확정된 release list가 아니라 여러 연구 방향의 의도와 의존성을 읽는 지도다</h2></header>
      <p className="text-lg leading-8">Post-Quantum, privacy, verifiability, L1 scaling과 specification simplification은 서로 독립된 유행어가 아닙니다. Signature·commitment·proof·execution spec이 함께 바뀌기 때문에 한 component의 prototype을 “Ethereum이 최종 채택했다”고 읽으면 안 됩니다.</p>
      <ContentBoundary article="ethereum-future-roadmap" />
      <EthereumRoadmapViz />
    </section>
    <section id="pq-surfaces" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · Post-Quantum surfaces</p><h2 className="mt-2 text-2xl font-bold">서명 하나가 아니라 BLS consensus·KZG DA·account ECDSA·application ZK를 따로 옮겨야 한다</h2></header>
      <div className="space-y-3">{[["Consensus signatures","Validator BLS key와 aggregation·slashing·rotation"],["Data availability","KZG commitment와 pairing verification"],["Accounts","ECDSA key에서 signature-agile smart account로 migration"],["Application proofs","Curve/pairing commitments와 verifier dependencies"]].map(([term,desc]) => <div key={term} className="grid gap-1 rounded-lg border border-border p-4 md:grid-cols-[11rem_1fr]"><p className="font-semibold">{term}</p><p className="text-sm leading-6 text-muted-foreground">{desc}</p></div>)}</div>
      <p><strong>Shor</strong>는 RSA·discrete-log·ECC 계열의 구조를 직접 위협합니다. <strong>Grover</strong>는 ideal hash search의 지수를 대략 절반으로 줄이는 일반 속도 향상입니다. 따라서 “hash도 양자에 깨진다”가 아니라 output length와 security target을 다시 잡아야 합니다.</p>
      <p>Account migration의 구체적인 ML-DSA·ERC-4337 경계는 <Link className="text-primary underline" to="/blockchain/pq-account">Post-Quantum Account</Link> 글을 재사용합니다. SPHINCS+/SLH-DSA 같은 hash-based signature와 lean 계열 프로젝트 명칭은 후보·연구 방향으로 표시하고, roadmap 문구만으로 최종 protocol 채택을 확정하지 않습니다.</p>
    </section>
    <section id="proving-execution" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · Proving과 execution</p><h2 className="mt-2 text-2xl font-bold">Native rollup·binary-field proof·leanISA는 서로 다른 층의 선택이다</h2></header>
      <p><strong>Native rollup</strong> 방향은 L1이 rollup state transition 검증에 더 직접적인 primitive를 제공하려는 설계 공간입니다. <strong>Binary-field proving</strong>은 Boolean workload와 proof representation의 간극을 줄이는 방향입니다. <strong>leanISA/RISC-V·zkVM</strong>은 execution semantics를 더 작고 증명 가능한 instruction contract로 만들려는 방향입니다. 하나의 제품명처럼 묶지 않습니다.</p>
      <p>Poseidon처럼 workload를 field-friendly하게 바꾸는 선택과 SHA/BLAKE를 유지한 채 prover를 바꾸는 선택은 <Link to="/crypto/binary-field-proving#overview" className="text-primary underline">Binary-field proving</Link>에서 비교합니다. PBT는 문맥에 따라 proposal-based builder/proposer separation 또는 tree/state commitment 문맥이 다를 수 있으므로 약어만으로 새 canonical component를 만들지 않습니다.</p>
    </section>
    <section id="formal-simplification" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · Formal specification</p><h2 className="mt-2 text-2xl font-bold">LLM은 candidate를 만들고, deterministic verifier가 correctness를 결정한다</h2></header>
      <p>자연어 spec은 읽기 쉽지만 모호합니다. Formal spec은 state·transition·invariant를 machine-checkable term으로 만들고, theorem prover가 proof를 확인합니다. AI는 invariant 제안, proof candidate, counterexample 탐색과 source-to-formal translation을 도울 수 있지만 최종 판정은 작은 trusted kernel이 수행해야 합니다.</p>
      <ExplainedFormula question="AI-assisted formal verification의 권한 경계는 어떻게 쓰나요?" idea="AI가 만든 proof candidate를 채택하지 않고, formal kernel이 type-check한 결과만 검증된 theorem으로 인정합니다." formula={String.raw`\begin{aligned}c&=\underbrace{G_{AI}(s,i)}_{\text{proof candidate 생성}}\\v&=\underbrace{K(s,i,c)}_{\text{deterministic kernel 검사}}\\accepted&=\underbrace{[v=1]}_{\text{최종 Boolean 판정}}\end{aligned}`} terms={[{symbol:"s",name:"Formal specification",description:"정확한 state와 transition semantics입니다."},{symbol:"i",name:"Invariant",description:"모든 허용 transition에서 보존해야 할 명제입니다."},{symbol:"c",name:"Candidate proof",description:"AI나 사람이 제안한 proof term 또는 tactics 결과입니다."},{symbol:"K",name:"Trusted kernel",description:"Candidate가 formal rules를 만족하는지 결정적으로 검사합니다."}]} assumptions={["Specification 자체가 의도한 system과 맞는지는 별도 review 대상입니다.","Kernel·compiler·dependency version을 고정합니다.","Accepted proof는 성능·liveness·implementation side channel을 자동 보장하지 않습니다.","AI confidence를 verification 결과로 사용하지 않습니다."]} interpretation="AI가 그럴듯한 proof를 만들어도 K=0이면 폐기합니다. K=1이어도 빠진 assumption이나 잘못 formalized된 spec이 없는지 traceability review가 필요합니다." />
      <p>Specification simplification은 단지 문서를 짧게 만드는 일이 아닙니다. State transition surface, fork rules와 dependency를 줄여 구현·test·formal proof가 다루는 경우의 수를 줄이는 작업입니다. Roadmap release gate는 proposal/EIP 상태, prototype artifact, formalized 범위, client interoperability와 rollback을 따로 기록합니다.</p>
      <div id="paper-ethereum-security-roadmap"><CitationBlock source="ethereum.org · Security and quantum-resistance roadmap" citeKey={1} href="https://ethereum.org/roadmap/security/quantum-resistance/"><p><strong>문제:</strong> Ethereum의 여러 cryptographic surfaces를 양자 위협에 맞춰 이관해야 합니다.</p><p><strong>기여:</strong> Consensus BLS, KZG, account ECDSA와 application ZK의 별도 migration surface를 설명합니다.</p><p><strong>전제:</strong> Roadmap은 현재 intent와 연구 방향이며 일정·설계가 바뀔 수 있습니다.</p><p><strong>근거 범위:</strong> 공식 roadmap이 제시한 문제 분해입니다.</p><p><strong>말하지 않는 것:</strong> 특정 signature·proof system의 최종 채택이나 날짜를 확정하지 않습니다.</p></CitationBlock></div>
      <div id="paper-lean-roadmap"><CitationBlock source="Lean Ethereum roadmap" citeKey={2} href="https://leanroadmap.org/"><p><strong>문제:</strong> Cryptographic protocols와 specs를 machine-checkable proofs로 옮깁니다.</p><p><strong>기여:</strong> FRI·STIR·WHIR 등 formalization milestones와 작업 방향을 공개합니다.</p><p><strong>전제:</strong> 각 milestone의 실제 repository·proof coverage를 별도 확인합니다.</p><p><strong>근거 범위:</strong> 공개 formalization roadmap입니다.</p><p><strong>말하지 않는 것:</strong> Ethereum 전체 구현이 이미 formally verified됐다는 뜻은 아닙니다.</p></CitationBlock></div>
    </section>
  </article>;
}
