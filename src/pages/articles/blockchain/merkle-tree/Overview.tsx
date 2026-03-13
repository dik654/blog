import { CitationBlock } from '../../../../components/ui/citation';
import MerkleTreeViz from './viz/MerkleTreeViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">머클 트리 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          머클 트리(Merkle Tree)는 1979년 Ralph Merkle가 특허 출원한 해시 기반 자료구조로,
          대량의 데이터에 대한 무결성 검증을 효율적으로 수행할 수 있게 합니다.
          바이너리 해시 트리(Binary Hash Tree)라고도 불리며, 리프 노드에는 데이터의 해시가,
          내부 노드에는 자식 노드들의 해시를 결합한 값이 저장됩니다.
        </p>

        <p>
          블록체인에서 머클 트리는 블록에 포함된 트랜잭션들의 요약(digest) 역할을 합니다.
          블록 헤더에는 머클 루트(Merkle Root)만 저장하면 되므로, 전체 트랜잭션 목록 없이도
          특정 트랜잭션이 블록에 포함되어 있는지 효율적으로 증명할 수 있습니다.
          이것이 바로 SPV(Simplified Payment Verification)의 핵심 원리입니다.
        </p>

        <CitationBlock source="Ralph Merkle, 'Method of providing digital signatures', US Patent 4,309,569 (1979)" citeKey={1} type="paper"
          href="https://patents.google.com/patent/US4309569A">
          <p className="italic text-foreground/80">
            "A method of providing a digital signature for purposes of authentication of a message,
            using a tree structure of hash values where the root serves as the signature."
          </p>
          <p className="mt-2 text-xs">
            Ralph Merkle는 스탠퍼드 대학원 재학 중 이 구조를 제안했습니다.
            원래 디지털 서명 체계의 효율성을 개선하기 위한 것이었지만,
            이후 P2P 네트워크, 파일 시스템, 블록체인 등 다양한 분야에서 핵심 자료구조로 활용됩니다.
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">머클 트리 구조와 증명 경로</h3>

        <MerkleTreeViz />

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`머클 트리 핵심 속성:

1. 데이터 무결성: 어떤 리프 데이터가 변경되면 루트까지 모든 해시가 변경
2. 효율적 검증: O(log n) 해시 연산으로 멤버십 증명 가능
3. 공간 효율성: 블록 헤더에 32바이트 루트 해시만 저장
4. 병렬 처리: 리프 해시 계산을 병렬로 수행 가능

블록체인에서의 역할:
┌─────────────────────────────────────┐
│          Block Header               │
│  ┌──────────┐  ┌──────────────────┐ │
│  │ prev_hash│  │  merkle_root     │ │
│  └──────────┘  └──────────────────┘ │
│  ┌──────────┐  ┌──────────────────┐ │
│  │ timestamp│  │  nonce / misc    │ │
│  └──────────┘  └──────────────────┘ │
└─────────────────────────────────────┘
         │
         ▼  merkle_root는 아래 트리의 루트
    ┌──────────┐
    │  Root    │
    └─┬──────┬─┘
      ▼      ▼
   H(AB)   H(CD)  ...  전체 트랜잭션 트리`}</code>
        </pre>
      </div>
    </section>
  );
}
