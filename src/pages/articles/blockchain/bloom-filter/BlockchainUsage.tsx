import { CitationBlock } from '../../../../components/ui/citation';

export default function BlockchainUsage() {
  return (
    <section id="blockchain-usage" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">블록체인에서의 Bloom Filter 활용</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">Bitcoin: BIP-37 SPV 필터링</h3>
        <p>
          Bitcoin의 SPV(Simplified Payment Verification) 노드는 전체 블록체인을 저장하지 않고도
          트랜잭션을 검증할 수 있습니다. BIP-37은 SPV 노드가 풀 노드에게 Bloom Filter를 전송하여,
          자신과 관련된 트랜잭션만 필터링하여 수신하는 프로토콜을 정의합니다.
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`SPV 노드의 BIP-37 워크플로우:

1. SPV 노드가 관심 주소/공개키를 Bloom Filter에 등록
   bloom.insert(my_address)
   bloom.insert(my_pubkey)

2. filterload 메시지로 풀 노드에 필터 전송
   msg_filterload {
     filter: bloom.bit_array,   // 필터 데이터
     nHashFuncs: k,             // 해시 함수 수
     nTweak: random_nonce,      // 프라이버시를 위한 난스
     nFlags: BLOOM_UPDATE_ALL   // 업데이트 플래그
   }

3. 풀 노드는 각 트랜잭션을 필터에 대조
   for tx in block.transactions:
     if bloom.query(tx.outputs[].address):
       send(merkleblock + tx)   // 매칭되는 TX만 전송

4. False positive은 프라이버시에 도움
   → 관련 없는 TX도 일부 수신되므로 정확한 관심사를 숨김`}</code></pre>

        <CitationBlock source="BIP-37: Connection Bloom Filtering" citeKey={2} type="paper" href="https://github.com/bitcoin/bips/blob/master/bip-0037.mediawiki">
          <p className="italic text-foreground/80">
            "Bloom filters are a space-efficient probabilistic data structure used to test
            membership of elements. This BIP adds new support for Bloom filters to the
            peer-to-peer protocol to allow peers to reduce the amount of transaction data
            they are sent."
          </p>
          <p className="mt-2 text-xs">
            Mike Hearn과 Matt Corallo가 제안한 BIP-37은 SPV 노드의 대역폭 효율성을
            크게 개선하여 모바일 지갑의 실용화에 기여했습니다.
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">Ethereum: logsBloom 필터</h3>
        <p>
          Ethereum은 각 블록과 트랜잭션 Receipt에 <strong>2048-bit (256-byte) Bloom Filter</strong>를
          포함합니다. 이 logsBloom 필드는 해당 블록/트랜잭션에서 발생한 모든 로그 이벤트의
          주소(address)와 토픽(topic)을 기록합니다.
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`Ethereum logsBloom 구조:

블록 헤더:
  logsBloom: 2048-bit (256 bytes)
  = 블록 내 모든 로그 엔트리의 bloom 필터 OR 합산

트랜잭션 Receipt:
  logsBloom: 2048-bit
  = 해당 트랜잭션의 로그 엔트리만의 bloom

각 로그 엔트리 (Log):
  address: 컨트랙트 주소 (20 bytes)
  topics: [topic0, topic1, ...] (각 32 bytes)
  data: 비인덱싱 데이터`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Ethereum Bloom Filter 생성 알고리즘</h3>
        <p>
          Ethereum에서 각 로그 엔트리는 3개의 해시 함수 쌍을 사용하여 2048-bit Bloom Filter에
          매핑됩니다. 구체적인 알고리즘은 다음과 같습니다:
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`// Ethereum Bloom Filter 생성 (Yellow Paper 기준)
fn bloom9(value: bytes) → Bloom2048:
  bloom = [0; 2048]

  hash = keccak256(value)

  // 3개의 비트 위치 선정 (각 2바이트씩 사용)
  for i in [0, 2, 4]:
    bit_pos = (hash[i] << 8 | hash[i+1]) & 0x7FF  // 11-bit = 0~2047
    bloom[bit_pos] = 1

  return bloom

// 블록 전체 logsBloom 생성
fn block_bloom(logs: Log[]) → Bloom2048:
  result = [0; 2048]
  for log in logs:
    result |= bloom9(log.address)
    for topic in log.topics:
      result |= bloom9(topic)
  return result`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">eth_getLogs 빠른 필터링</h3>
        <p>
          DApp이나 인덱서가 <code>eth_getLogs</code> RPC를 호출하면, 노드는 먼저 각 블록의
          logsBloom을 확인하여 해당 블록에 관련 로그가 있을 가능성이 있는지 빠르게 판별합니다.
          Bloom Filter에 매칭되지 않는 블록은 즉시 건너뛰므로 검색 속도가 크게 향상됩니다.
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`eth_getLogs 필터링 과정:

요청: eth_getLogs({
  fromBlock: 18000000,
  toBlock: 18001000,
  address: "0xA0b8...3cc7",    // USDT 컨트랙트
  topics: ["0xddf2..."]        // Transfer 이벤트
})

1단계: Bloom 사전 필터링 (O(1) per block)
  for block in 18000000..18001000:
    query_bloom = bloom9(address) | bloom9(topic)
    if (block.logsBloom & query_bloom) != query_bloom:
      skip(block)              // 확실히 관련 로그 없음 → 건너뜀
    else:
      candidates.add(block)    // 매칭 → 상세 검사 대상

2단계: 후보 블록만 상세 검사
  for block in candidates:
    for receipt in block.receipts:
      for log in receipt.logs:
        if matches(log, filter):
          results.add(log)

→ 1000개 블록 중 실제 검사는 수십 개만 수행`}</code></pre>

        <CitationBlock source="Ethereum Yellow Paper — logsBloom specification" citeKey={3} type="paper" href="https://ethereum.github.io/yellowpaper/paper.pdf">
          <p className="italic text-foreground/80">
            "The Bloom filter is composed from the address of the logger and each of the
            log's topics. We define the Bloom filter function, M, to reduce a log entry
            into a single 256-byte hash."
          </p>
          <p className="mt-2 text-xs">
            Ethereum Yellow Paper(Gavin Wood 저)의 Section 4.3.1에서 logsBloom의 정확한
            명세를 정의합니다. 각 로그 엔트리가 bloom9 함수를 통해 2048-bit 필터로 변환되는
            과정을 수학적으로 기술합니다.
          </p>
        </CitationBlock>
      </div>
    </section>
  );
}
