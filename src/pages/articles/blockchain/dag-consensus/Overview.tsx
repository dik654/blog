import DAGViz from './viz/DAGViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">DAG 기반 합의 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          전통적 블록체인(이더리움 포함)은 <strong>선형 체인</strong> 구조입니다 —
          각 블록이 이전 블록 하나를 가리킵니다.
          DAG(Directed Acyclic Graph) 기반 합의는 이 제약을 벗어나
          <strong>여러 블록이 동시에 존재</strong>할 수 있는 구조로,
          처리량을 극대화합니다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">선형 체인 vs DAG</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`이더리움 (선형 체인):
  B₁ → B₂ → B₃ → B₄ → B₅
  한 번에 하나의 블록만 제안/처리

DAG 기반 (Narwhal + Bullshark):
  Round 1    Round 2    Round 3    Round 4
  ┌───┐      ┌───┐      ┌───┐      ┌───┐
  │V₁ │─────→│V₁ │─────→│V₁*│─────→│V₁ │  (* = 리더)
  └───┘╲    ╱└───┘╲    ╱└───┘╲    ╱└───┘
        ╲  ╱       ╲  ╱       ╲  ╱
  ┌───┐  ╲╱  ┌───┐  ╲╱  ┌───┐  ╲╱  ┌───┐
  │V₂ │──╳──→│V₂ │──╳──→│V₂ │──╳──→│V₂ │
  └───┘ ╱╲   └───┘ ╱╲   └───┘ ╱╲   └───┘
       ╱  ╲       ╱  ╲       ╱  ╲
  ┌───┐    ╲ ┌───┐    ╲ ┌───┐    ╲ ┌───┐
  │V₃ │─────→│V₃ │─────→│V₃ │─────→│V₃ │
  └───┘      └───┘      └───┘      └───┘

  모든 검증자가 매 라운드 동시에 "vertex" 제출
  → 처리량 = n × (단일 노드 처리량)`}</code>
        </pre>
        <DAGViz />
        <p>
          Narwhal은 <strong>DAG 구축(데이터 가용성)</strong>을 담당하고,
          Bullshark는 <strong>DAG 위에서 전체 순서(total order)</strong>를 결정합니다.
          이 분리는 이더리움의 EL(데이터) + CL(순서) 분리와 유사한 철학입니다.
        </p>
      </div>
    </section>
  );
}
