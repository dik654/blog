import UserOpViz from './viz/UserOpViz';

export default function UserOpStruct() {
  return (
    <section id="userop-struct" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">UserOperation 구조체</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          ERC-4337의 <code>UserOperation</code>은 사용자의 의도를 담은 데이터 구조입니다.
          기존 트랜잭션과 달리, EOA의 서명 대신 스마트 계정이 자체적으로 서명을 검증합니다.
        </p>
        <h3>핵심 필드</h3>
        <ul>
          <li><code>sender</code> — 스마트 계정 주소 (EOA가 아님)</li>
          <li><code>nonce</code> — EntryPoint가 관리하는 재사용 방지 카운터</li>
          <li><code>callData</code> — 실행할 함수 호출 (ABI 인코딩)</li>
          <li><code>signature</code> — 하이브리드: ECDSA(65B) + Dilithium(2420B)</li>
        </ul>
        <p className="text-sm border-l-2 border-blue-400 pl-3 bg-blue-50/50 dark:bg-blue-950/20 py-2 rounded-r">
          <strong>Insight</strong> — Dilithium 서명은 ECDSA보다 37배 크지만(2420B vs 65B),
          calldata 비용은 EIP-4844 이후 크게 줄었습니다. L2에서는 부담이 더 작습니다.
        </p>
      </div>
      <div className="mt-8"><UserOpViz /></div>
    </section>
  );
}
