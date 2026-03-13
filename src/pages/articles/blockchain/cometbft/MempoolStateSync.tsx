export default function MempoolStateSync() {
  return (
    <section id="mempool-statesync" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">멤풀 & 상태 동기화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">멤풀 (Mempool)</h3>
        <p>
          CometBFT의 멤풀은 이더리움의 txpool과 유사하지만,
          ABCI의 <code>CheckTx</code> 콜백을 통해 애플리케이션 레벨의
          트랜잭션 검증을 수행합니다. 이더리움의 txpool이 nonce/balance를
          직접 검증하는 것과 달리, CometBFT는 애플리케이션에 위임합니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`멤풀 트랜잭션 흐름:

트랜잭션 수신 → CheckTx(tx) → 유효? → 멤풀에 추가 → Gossip 전파
                   │                      │
                   │ (앱이 검증)           │ ClistMempool: 연결 리스트
                   │                      │ 또는
                   ▼                      │ CAT Mempool: Content-Addressable Tx
              무효 → 거부                  └→ PrepareProposal에서 선택

Commit 시 멤풀 동기화:
  1. 멤풀 Lock (새 TX 수신 차단)
  2. ABCI 연결 Flush (4개 연결 상태 동기화)
  3. 커밋된 TX 제거
  4. 남은 TX를 새 상태에 대해 Re-CheckTx
  5. 멤풀 Unlock
  → 이더리움은 블록 import 시 txpool에서 포함된 TX 제거`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">상태 동기화 (State Sync)</h3>
        <p>
          이더리움의 snap sync가 상태 트라이를 청크 단위로 다운로드하는 것처럼,
          CometBFT의 State Sync는 애플리케이션 상태 스냅샷을 사용합니다.
          전체 블록을 리플레이하지 않고 최신 상태로 빠르게 동기화합니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`State Sync 흐름:

이더리움 snap sync              CometBFT State Sync
─────────────────────          ─────────────────────
1. 피벗 블록 선택               1. 신뢰할 수 있는 높이 선택
2. 헤더 체인 다운로드            2. Light Client 검증
3. 상태 트라이 청크 다운로드      3. 스냅샷 청크 다운로드
4. 상태 치유(healing)           4. ABCI OfferSnapshot/ApplySnapshotChunk
5. 나머지 블록 실행              5. 나머지 블록부터 정상 합의

핵심: 두 방식 모두 "전체 히스토리 리플레이" 없이
      최신 상태에서 시작할 수 있게 해줌

State Sync 설정 요구사항:
  - 신뢰할 수 있는 RPC 서버 (2개 이상 권장)
  - 신뢰할 수 있는 height + block hash
  - Trust Period (~unbonding 기간의 2/3)
  → Light Client로 app hash를 체인에 대해 검증 후 합의 전환

주의: State Sync는 과거 블록을 백필하지 않음
  → 잘린 히스토리(truncated history)로 시작
  → 전체 히스토리가 필요하면 Block Sync 사용`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">코드 구조 (cometbft 레포)</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`cometbft/
├── abci/          # ABCI 인터페이스 정의
├── consensus/     # Tendermint BFT 상태 머신
├── mempool/       # ClistMempool, CAT Mempool
├── p2p/           # MConnection, PEX, 피어 관리
├── state/         # 블록 실행 & 상태 저장
├── statesync/     # 상태 스냅샷 동기화
├── blockchain/    # 블록 저장소 & Blockchain Reactor
├── evidence/      # 이중 서명 증거 관리
├── light/         # Light Client 검증
├── proxy/         # ABCI 프록시 (앱 연결)
└── rpc/           # JSON-RPC & WebSocket API`}</code>
        </pre>
      </div>
    </section>
  );
}
