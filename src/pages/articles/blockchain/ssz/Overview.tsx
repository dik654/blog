import SSZViz from './viz/SSZViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SSZ (Simple Serialize) 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          SSZ(Simple Serialize)는 <strong>Ethereum Consensus Layer(Beacon Chain)</strong>의
          공식 직렬화 표준입니다. 기존 Execution Layer에서 사용하던 RLP(Recursive Length Prefix)의
          한계를 극복하기 위해 설계되었으며, <strong>결정론적 직렬화</strong>와
          <strong> Merkleization</strong>을 동시에 지원하는 것이 핵심 특징입니다.
        </p>

        <p>
          Lighthouse(Rust), Prysm(Go), Lodestar(TypeScript), Teku(Java), Nimbus(Nim) 등
          모든 Consensus Layer 클라이언트가 SSZ를 사용하며, 클라이언트 간 상태 교환과
          네트워크 메시지 전송의 기반이 됩니다.
        </p>

        <SSZViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">SSZ가 필요한 이유</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`RLP의 한계                          SSZ의 해결
┌────────────────────────────┐    ┌────────────────────────────┐
│ Schema-less                │ →  │ Schema-aware (타입 명시)    │
│ → 디코딩 시 스키마 필요 없음  │    │ → 고정 크기 타입 직접 접근   │
├────────────────────────────┤    ├────────────────────────────┤
│ Big-endian 바이트 순서      │ →  │ Little-endian 바이트 순서   │
│ → 대부분 CPU와 불일치       │    │ → x86/ARM 네이티브 순서     │
├────────────────────────────┤    ├────────────────────────────┤
│ Merkleization 미지원       │ →  │ 내장 Merkleization         │
│ → 부분 증명 불가            │    │ → Light client 증명 지원    │
├────────────────────────────┤    ├────────────────────────────┤
│ Keccak-256 해시            │ →  │ SHA-256 해시               │
│ → 하드웨어 가속 제한적       │    │ → 범용 하드웨어 가속 지원    │
└────────────────────────────┘    └────────────────────────────┘`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">SSZ의 두 축: 직렬화 + Merkleization</h3>
        <p>
          SSZ는 단순한 직렬화 포맷이 아닙니다. 데이터를 바이트로 직렬화하는 것에 더해,
          직렬화된 데이터를 <strong>32-byte 청크</strong>로 분할하고 <strong>바이너리 머클 트리</strong>를
          구성하는 Merkleization까지 포함합니다.
          이를 통해 Beacon Chain의 상태(BeaconState)에서 특정 필드만 효율적으로 증명할 수 있어,
          <strong>Light client</strong> 지원의 핵심 기반이 됩니다.
        </p>
      </div>
    </section>
  );
}
