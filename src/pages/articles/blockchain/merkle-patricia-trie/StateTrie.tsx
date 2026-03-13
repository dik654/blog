import { CitationBlock } from '../../../../components/ui/citation';

export default function StateTrie() {
  return (
    <section id="state-trie" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">State / Transaction / Receipt Trie</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          Ethereum은 3개의 MPT를 사용하여 블록의 모든 데이터를 구조화합니다.
          각 트라이의 루트 해시는 블록 헤더에 포함되어 전체 블록의 무결성을 보장합니다.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3">State Trie (World State)</h3>
        <p>
          전체 Ethereum 네트워크의 글로벌 상태를 저장하는 트라이입니다.
          모든 외부 소유 계정(EOA)과 컨트랙트 계정의 상태가 여기에 포함됩니다.
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`State Trie 구조:
  key   = keccak256(address)      // 20-byte 주소의 해시
  value = RLP([nonce, balance, storageRoot, codeHash])

각 필드:
  nonce       — 계정에서 전송한 트랜잭션 수 (EOA) 또는 생성한 컨트랙트 수
  balance     — 계정의 Wei 잔액
  storageRoot — Storage Trie의 루트 해시 (컨트랙트 전용)
  codeHash    — 컨트랙트 바이트코드의 keccak256 해시
              — EOA의 경우 keccak256("")

예시:
  keccak256(0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045)
  → RLP([
      42,                        // nonce
      1500000000000000000,       // balance: 1.5 ETH
      0x56e81f17...c7d1ab97,     // storageRoot
      0xc5d24601...e6f43161      // codeHash
    ])`}</code></pre>

        <h3 className="text-lg font-semibold mt-6 mb-3">Storage Trie</h3>
        <p>
          각 컨트랙트 계정은 자신만의 독립적인 Storage Trie를 가집니다.
          컨트랙트의 영구 저장소(storage slot)를 관리하며, State Trie의 <code>storageRoot</code>가
          이 트라이의 루트 해시를 참조합니다.
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`Storage Trie 구조:
  key   = keccak256(storage_slot)   // 32-byte 슬롯 번호의 해시
  value = RLP(storage_value)        // 슬롯에 저장된 값

Solidity 매핑 예시:
  mapping(address => uint256) balances;

  // balances[addr]의 스토리지 슬롯:
  slot = keccak256(abi.encode(addr, slot_number))

  // Storage Trie에서의 키:
  key = keccak256(slot)`}</code></pre>

        <h3 className="text-lg font-semibold mt-6 mb-3">Transaction Trie</h3>
        <p>
          블록에 포함된 트랜잭션들을 저장하는 트라이입니다.
          블록이 확정되면 변경되지 않는 정적 구조입니다.
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`Transaction Trie 구조:
  key   = RLP(tx_index)     // 블록 내 트랜잭션 인덱스
  value = RLP(transaction)  // 전체 트랜잭션 데이터

Transaction RLP:
  RLP([nonce, gasPrice, gasLimit, to, value, data, v, r, s])`}</code></pre>

        <h3 className="text-lg font-semibold mt-6 mb-3">Receipt Trie</h3>
        <p>
          각 트랜잭션의 실행 결과(영수증)를 저장합니다.
          이벤트 로그, 가스 사용량, 실행 상태 등이 포함됩니다.
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`Receipt Trie 구조:
  key   = RLP(tx_index)   // 트랜잭션 인덱스 (Transaction Trie와 동일)
  value = RLP(receipt)     // 트랜잭션 실행 영수증

Receipt RLP:
  RLP([
    postStateOrStatus,     // 1 (success) 또는 0 (failure)
    cumulativeGasUsed,     // 블록 내 누적 가스 사용량
    logsBloom,             // 256-byte 블룸 필터
    logs                   // 이벤트 로그 배열
  ])`}</code></pre>

        <h3 className="text-lg font-semibold mt-6 mb-3">Block Header의 3개 루트</h3>
        <p>
          블록 헤더는 세 트라이의 루트 해시를 포함하여 블록의 전체 데이터 무결성을 보장합니다.
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`Block Header (관련 필드):
┌─────────────────────────────────────────────┐
│ parentHash     — 이전 블록 헤더의 해시        │
│ ...                                         │
│ stateRoot      — State Trie의 루트 해시       │
│ transactionsRoot — Transaction Trie 루트 해시 │
│ receiptsRoot   — Receipt Trie의 루트 해시     │
│ ...                                         │
└─────────────────────────────────────────────┘

검증 과정:
  1. 블록 수신 → 트랜잭션 실행 → 로컬 State Trie 갱신
  2. 로컬 stateRoot 계산
  3. 블록 헤더의 stateRoot와 비교
  4. 불일치 → 블록 거부`}</code></pre>

        <h3 className="text-lg font-semibold mt-6 mb-3">상태 크기 문제: State Bloat</h3>
        <p>
          Ethereum의 State Trie는 지속적으로 성장합니다. 한 번 생성된 계정은 영구적으로 상태에 남으며,
          이로 인한 &quot;상태 팽창(state bloat)&quot;은 풀 노드의 디스크 요구량을 증가시킵니다.
        </p>

        <div className="not-prose space-y-3 mb-6">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">상태 팽창의 영향</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>- 풀 노드 동기화 시간 증가 (초기 동기화에 수일 소요)</li>
              <li>- 디스크 I/O 병목: 상태 읽기/쓰기가 블록 처리 시간의 상당 부분 차지</li>
              <li>- 메모리 요구량 증가: trie 캐시가 수 GB의 RAM 필요</li>
              <li>- 탈중앙화 위협: 노드 운영 비용 증가로 참여자 감소</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">해결 방안</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>- <strong>State Expiry</strong>: 일정 기간 접근되지 않은 상태를 만료 처리</li>
              <li>- <strong>Verkle Tree</strong>: MPT를 대체하여 증명 크기를 대폭 감소 (EIP-6800)</li>
              <li>- <strong>Snap Sync</strong>: 전체 trie 순회 대신 플랫 스냅샷 기반 동기화</li>
              <li>- <strong>Pruning</strong>: 오래된 상태 버전을 제거하여 디스크 사용량 절감</li>
            </ul>
          </div>
        </div>

        <CitationBlock source="ethereum.org — Merkle Patricia Trie documentation" citeKey={3} type="paper" href="https://ethereum.org/en/developers/docs/data-structures-and-encoding/patricia-merkle-trie/">
          <p className="italic text-foreground/80">
            &quot;A Merkle Patricia Trie is deterministic — meaning that a trie with the same key-value
            bindings is guaranteed to be identical down to the last byte, and therefore has the same root hash.&quot;
          </p>
          <p className="mt-2 text-xs">
            ethereum.org의 공식 문서는 MPT의 구조, HP 인코딩, 그리고 각 트라이(State, Storage, Transaction, Receipt)의
            역할을 상세히 설명합니다. 실제 키-값 예시와 함께 노드 타입별 동작을 보여줍니다.
          </p>
        </CitationBlock>

        <CitationBlock source="State Trie performance analysis" citeKey={4} type="paper" href="https://blog.ethereum.org/2023/08/17/state-growth">
          <p className="italic text-foreground/80">
            &quot;Ethereum's state has grown to over 200 million accounts and storage slots.
            This growth puts increasing pressure on node operators and threatens the network's decentralization.&quot;
          </p>
          <p className="mt-2 text-xs">
            상태 성장(state growth) 분석에서는 Ethereum mainnet의 상태 크기가 지속적으로 증가하고 있으며,
            이에 대한 장기적 해결책으로 Verkle Tree와 State Expiry가 연구되고 있음을 보여줍니다.
          </p>
        </CitationBlock>

      </div>
    </section>
  );
}
