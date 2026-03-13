import { CitationBlock } from '../../../../components/ui/citation';

export default function BlockchainUsage() {
  return (
    <section id="blockchain-usage" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">블록체인 활용</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">FlyClient: 경량 클라이언트를 위한 MMR 증명</h3>
        <p>
          FlyClient는 경량 클라이언트(light client)가 전체 블록체인을 다운로드하지 않고도
          체인의 유효성을 검증할 수 있도록 하는 프로토콜입니다. 핵심 아이디어는 블록 헤더를
          MMR에 저장하여, 임의의 과거 블록에 대한 효율적인 포함 증명을 제공하는 것입니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`FlyClient 프로토콜 개요:

1. 전체 노드: 각 블록 헤더를 MMR에 순차적으로 추가
   block_headers_mmr.append(block_hash_i)

2. 최신 블록 헤더에 MMR 루트를 포함
   header.mmr_root = mmr.root()

3. 경량 클라이언트: 확률적 샘플링으로 블록 검증
   - 최신 헤더의 mmr_root를 신뢰 앵커로 사용
   - 무작위로 과거 블록을 샘플링
   - 각 샘플에 대한 MMR 포함 증명 검증

4. 보안 보장: O(log n)개의 샘플로 높은 확률의 검증
   - 전체 헤더 다운로드 불필요 (SPV보다 효율적)
   - 난이도 조작 공격에 강건`}</code></pre>
        <p>
          FlyClient는 기존 SPV(Simplified Payment Verification) 방식의 한계를 극복합니다.
          SPV는 모든 블록 헤더를 다운로드해야 하지만, FlyClient는 O(log n)개의 샘플과 MMR 증명만으로
          체인의 유효성을 높은 확률로 검증할 수 있습니다.
        </p>

        <CitationBlock source="FlyClient: Super-Light Clients for Cryptocurrencies (S&P 2020)" citeKey={3} type="paper"
          href="https://ieeexplore.ieee.org/document/9152680">
          <p className="italic text-foreground/80">
            "FlyClient is a novel transaction verification light client for blockchains...
            It requires downloading only a logarithmic number of block headers while
            achieving the same security guarantees."
          </p>
          <p className="mt-2 text-xs">
            Benedikt Bunz, Lucianna Kiffer, Loi Luu, Mahdi Zamani의 논문으로,
            IEEE S&P 2020에서 발표되었습니다. MMR을 활용하여 경량 클라이언트의 통신 복잡도를
            O(n)에서 O(log n)으로 줄인 획기적인 연구입니다.
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">Grin: UTXO Set을 MMR로 관리</h3>
        <p>
          Grin은 Mimblewimble 프로토콜을 구현한 프라이버시 중심 블록체인으로, 세 가지 핵심
          데이터 집합을 MMR로 관리합니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`Grin의 MMR 활용 구조:

┌─────────────────────────────────────────────┐
│                  Grin Node                  │
├─────────────────────────────────────────────┤
│  Output MMR    — UTXO 집합 (생성/소비 추적)  │
│  RangeProof MMR — 각 output의 범위 증명      │
│  Kernel MMR    — 트랜잭션 커널 (서명)        │
└─────────────────────────────────────────────┘

Pruning 메커니즘:
- 소비된(spent) output → MMR에서 리프를 "제거 표시"
- 해시 경로는 유지, 실제 데이터만 삭제
- 새 노드가 과거 데이터 없이도 검증 가능

장점:
- append-only → 블록 순서와 자연스럽게 대응
- pruning으로 디스크 사용량 최소화
- 포함 증명 & 비포함 증명 모두 지원`}</code></pre>
        <p>
          Grin의 MMR 활용은 특히 pruning 측면에서 두드러집니다. Mimblewimble의 cut-through 특성과
          결합하여, 소비된 UTXO의 데이터를 안전하게 제거하면서도 머클 증명의 유효성을 유지할 수 있습니다.
          이는 전체 블록체인 데이터의 크기를 크게 줄여 새 노드의 동기화 시간을 단축합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Polkadot BEEFY: 크로스체인 Light Client 증명</h3>
        <p>
          Polkadot의 BEEFY(Bridge Efficiency Enabling Finality Yielder) 프로토콜은 크로스체인
          브릿지의 효율성을 높이기 위해 MMR을 사용합니다. 파라체인 간, 또는 외부 체인과의 통신에서
          경량 증명을 제공합니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`Polkadot BEEFY + MMR:

1. 릴레이 체인: 각 블록의 파라체인 헤더를 MMR에 추가
   relay_mmr.append(parachain_headers_root)

2. BEEFY 검증자 서명
   - 검증자 집합이 MMR 루트에 서명
   - 외부 체인에서 소수의 서명만으로 검증 가능

3. 크로스체인 증명 구조
   ┌──────────────┐     ┌──────────────┐
   │  Polkadot    │ MMR │   Ethereum   │
   │  Relay Chain │────▶│   Bridge     │
   │  (BEEFY)     │     │   Contract   │
   └──────────────┘     └──────────────┘

   - MMR 증명으로 특정 블록의 포함을 검증
   - BEEFY 서명으로 최종성(finality) 보장
   - 증명 크기: O(log n) 해시`}</code></pre>
        <p>
          BEEFY는 Polkadot 생태계 외부의 체인(예: Ethereum)에서도 Polkadot의 상태를 효율적으로
          검증할 수 있게 합니다. MMR은 이 과정에서 블록 히스토리에 대한 간결한 증명을 제공하는 핵심
          자료구조로 기능합니다.
        </p>
      </div>
    </section>
  );
}
