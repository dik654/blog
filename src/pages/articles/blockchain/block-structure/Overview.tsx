import BlockStructureViz from './viz/BlockStructureViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          블록체인은 이름 그대로 <strong>블록(block)</strong>이 <strong>체인(chain)</strong> 형태로
          연결된 분산 데이터 구조입니다. 각 블록은 크게 두 부분으로 나뉩니다.
        </p>
        <ul>
          <li><strong>블록 헤더(Block Header)</strong> — 블록의 메타데이터를 담은 고정 크기 구조체. 이전 블록 해시, 머클 루트, 타임스탬프, 난이도, 난스 등이 포함됩니다.</li>
          <li><strong>트랜잭션 목록(Transaction List)</strong> — 해당 블록에 포함된 실제 트랜잭션 데이터. 가변 크기이며, Bitcoin의 경우 평균 약 2,000개, Ethereum은 블록당 가스 한도에 의해 제한됩니다.</li>
        </ul>

        <p>
          블록 헤더의 해시가 곧 블록의 고유 식별자이며, 이전 블록의 해시를 포함함으로써
          블록들이 단방향 연결 리스트처럼 이어집니다. 이 구조가 블록체인의 불변성(immutability)을
          보장하는 핵심 메커니즘입니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Bitcoin vs Ethereum 블록 구조 비교</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`Bitcoin Block                         Ethereum Block
─────────────────────────────────     ─────────────────────────────────
Block Header (80 bytes)               Block Header (~508 bytes)
├─ Version                            ├─ parentHash
├─ Previous Block Hash                ├─ ommersHash (uncles)
├─ Merkle Root                        ├─ beneficiary (coinbase)
├─ Timestamp                          ├─ stateRoot          ← 상태 트라이 루트
├─ Difficulty Target (nBits)          ├─ transactionsRoot
└─ Nonce                              ├─ receiptsRoot       ← 영수증 트라이 루트
                                      ├─ logsBloom
Transaction List                      ├─ difficulty / prevRandao
├─ Coinbase Tx                        ├─ number
├─ Tx 1                               ├─ gasLimit / gasUsed
├─ Tx 2                               ├─ timestamp
└─ ...                                ├─ extraData
                                      ├─ mixHash / nonce
                                      └─ baseFeePerGas (EIP-1559)

                                      Transaction List
                                      ├─ Tx 1 (Type 0/1/2)
                                      └─ ...`}</code></pre>
        <p>
          Bitcoin은 UTXO 모델을 사용하므로 헤더가 간결하지만, Ethereum은 계정 기반 상태 모델을 사용하며
          <code>stateRoot</code>, <code>receiptsRoot</code> 등 추가 트라이 루트를 헤더에 포함합니다.
          이를 통해 라이트 클라이언트가 전체 상태를 다운로드하지 않고도 특정 계정의 잔액이나
          컨트랙트 스토리지를 검증할 수 있습니다.
        </p>
      </div>

      <div className="mt-8">
        <BlockStructureViz />
      </div>
    </section>
  );
}
