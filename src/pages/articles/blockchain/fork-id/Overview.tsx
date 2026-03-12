export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Fork ID 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Fork ID는 <strong>EIP-2124</strong>에서 제안된 체인 호환성 검증 메커니즘입니다.
          P2P 네트워크에서 노드들이 서로 호환되는지 TCP 연결 전에 빠르게 확인할 수 있도록 합니다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">EIP-2124 이전의 문제</h3>
        <p>
          기존에는 피어 연결 시 TCP/IP 연결, RLPx 암호화, eth 핸드셰이크까지 완료해야
          체인 호환성을 확인할 수 있었습니다. NetworkID만으로는 같은 제네시스를 공유하는
          포크(예: Ethereum vs Ethereum Classic)를 구분할 수 없었습니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`EIP-2124 이전 프로세스:
1. TCP/IP 연결 수립
2. RLPx 암호화 래핑
3. eth 핸드셰이크 (Status 메시지 교환)
4. 호환 불가 감지 → 연결 종료
→ 비호환 피어마다 전체 과정 반복!`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">Fork ID의 구조</h3>
        <p>
          Fork ID는 <code>fork_hash</code> (4바이트 CRC32 체크섬)와{' '}
          <code>fork_next</code> (8바이트, 다음 예정 포크 블록)로 구성됩니다.
          ENR에 포함되어 TCP 연결 없이도 피어 호환성을 판단할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
