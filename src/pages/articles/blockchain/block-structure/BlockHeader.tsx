import { CitationBlock } from '../../../../components/ui/citation';

export default function BlockHeader() {
  return (
    <section id="block-header" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">블록 헤더 필드 상세</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          블록 헤더는 블록 전체를 대표하는 요약 정보입니다. 헤더만 해싱하면 블록의 고유 식별자가 되며,
          라이트 노드는 헤더만으로도 체인의 유효성을 검증할 수 있습니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Previous Block Hash</h3>
        <p>
          직전 블록 헤더의 SHA-256(Bitcoin) 또는 Keccak-256(Ethereum) 해시값입니다.
          이 필드가 블록들을 체인으로 연결하는 핵심 링크 역할을 합니다.
          제네시스 블록(Genesis Block)에서는 이 값이 <code>0x0000...0000</code>으로 설정됩니다.
        </p>

        <CitationBlock source="Bitcoin: A Peer-to-Peer Electronic Cash System (Satoshi Nakamoto, 2008)" citeKey={1} type="paper" href="https://bitcoin.org/bitcoin.pdf">
          <p className="italic text-foreground/80">
            "Each timestamp server works by taking a hash of a block of items to be timestamped
            and widely publishing the hash. Each timestamp includes the previous timestamp in its hash,
            forming a chain, with each additional timestamp reinforcing the ones before it."
          </p>
          <p className="mt-2 text-xs">
            각 블록이 이전 블록의 해시를 포함함으로써 체인을 형성하고,
            추가되는 블록마다 이전 블록들의 무결성을 강화합니다.
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">Merkle Root</h3>
        <p>
          블록에 포함된 모든 트랜잭션을 머클 트리로 해싱한 최종 루트 해시입니다.
          개별 트랜잭션의 포함 증명(Merkle Proof)을 O(log N) 크기로 제공할 수 있어,
          SPV(Simplified Payment Verification) 노드가 전체 블록을 다운로드하지 않고도
          특정 트랜잭션의 존재를 검증할 수 있습니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`Merkle Root 계산 과정:

  Tx1    Tx2    Tx3    Tx4
   |      |      |      |
 H(Tx1) H(Tx2) H(Tx3) H(Tx4)
    \\    /         \\    /
   H(1,2)         H(3,4)
       \\           /
        Merkle Root

트랜잭션 수가 홀수이면 마지막 해시를 복제하여 짝을 맞춤
Bitcoin: SHA-256d (이중 해싱)
Ethereum: Keccak-256 + Modified Merkle Patricia Trie`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Timestamp</h3>
        <p>
          블록이 생성된 시각을 Unix epoch 초 단위로 기록합니다.
          Bitcoin에서는 정확한 시간이 아닌 근사치이며, 네트워크 시간(Network-Adjusted Time)
          기준으로 <strong>과거 11개 블록의 중앙값(Median Time Past, MTP)</strong>보다 커야 하고,
          네트워크 시간 + 2시간을 초과할 수 없습니다.
          난이도 재조정 시 블록 간 평균 시간을 계산하는 데 사용됩니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Nonce</h3>
        <p>
          Proof of Work에서 채굴자가 목표 난이도 이하의 해시를 찾기 위해 반복 변경하는
          32비트 정수(Bitcoin 기준)입니다. 난스를 변경하면 블록 헤더의 해시가 완전히 달라지는
          해시 함수의 눈사태 효과(avalanche effect)를 이용합니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`채굴 과정 (Bitcoin):
for nonce in 0..2^32:
    header.nonce = nonce
    hash = SHA256(SHA256(header))
    if hash < target:
        # 유효한 블록 발견!
        broadcast(block)
        break

# nonce 공간 소진 시 → extraNonce (coinbase tx) 변경 후 재시도
# → Merkle Root가 바뀌므로 새로운 nonce 공간 확보`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Difficulty / Target</h3>
        <p>
          블록 해시가 만족해야 하는 목표값입니다. Bitcoin은 <code>nBits</code> 필드에 compact format으로
          저장하며, 2,016 블록(약 2주)마다 재조정됩니다.
          목표 블록 생성 시간(Bitcoin: 10분)을 유지하기 위해, 실제 소요 시간이 목표보다 짧으면
          난이도가 올라가고 길면 내려갑니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Ethereum 추가 헤더 필드</h3>
        <p>
          Ethereum은 계정 기반 상태 모델과 스마트 컨트랙트를 지원하기 위해
          Bitcoin보다 훨씬 많은 헤더 필드를 포함합니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`Ethereum 전용 헤더 필드:

stateRoot       전체 계정 상태의 Merkle Patricia Trie 루트
                (잔액, nonce, 코드 해시, 스토리지 루트)
transactionsRoot 트랜잭션 트라이 루트
receiptsRoot    트랜잭션 실행 결과(receipt)의 트라이 루트
                (status, gasUsed, logs)
logsBloom       2048비트 블룸 필터 — 이벤트 로그 빠른 검색
gasLimit        블록의 최대 가스 사용량
gasUsed         실제 사용된 가스 총합
baseFeePerGas   EIP-1559 이후 추가된 동적 기본 수수료
withdrawalsRoot Shanghai 업그레이드 이후 검증자 출금 트라이`}</code></pre>

        <CitationBlock source="Ethereum Yellow Paper (Dr. Gavin Wood)" citeKey={2} type="paper" href="https://ethereum.github.io/yellowpaper/paper.pdf">
          <p className="italic text-foreground/80">
            "The block header contains several pieces of information: the parent hash,
            the ommers hash, the beneficiary address, the state root, the transactions root,
            the receipts root, the logs bloom, the difficulty, the block number, the gas limit,
            the gas used, the timestamp, the extra data, the mix hash and the nonce."
          </p>
          <p className="mt-2 text-xs">
            Ethereum 블록 헤더는 상태 트라이 루트(stateRoot)와 영수증 트라이 루트(receiptsRoot)를 포함하여,
            전체 월드 스테이트에 대한 암호학적 커밋먼트를 제공합니다.
          </p>
        </CitationBlock>
      </div>
    </section>
  );
}
