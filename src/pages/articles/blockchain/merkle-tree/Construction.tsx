import { CitationBlock } from '../../../../components/ui/citation';

export default function Construction() {
  return (
    <section id="construction" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">머클 트리 구성</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          머클 트리는 리프 노드부터 루트까지 상향식(bottom-up)으로 구성됩니다.
          각 단계에서 인접한 두 노드의 해시를 연결(concatenate)한 후 다시 해시하여
          부모 노드를 생성합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">리프 노드: 데이터 해싱</h3>
        <p>
          각 데이터 블록(트랜잭션)에 해시 함수를 적용하여 리프 노드를 생성합니다.
          Bitcoin에서는 SHA-256을 두 번 적용(double SHA-256)합니다.
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`# 리프 노드 생성
leaf_hash = SHA256(SHA256(transaction_data))

# 예시: 4개의 트랜잭션
H(A) = SHA256d(TxA)   # = dsha256(serialize(TxA))
H(B) = SHA256d(TxB)
H(C) = SHA256d(TxC)
H(D) = SHA256d(TxD)`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">내부 노드: H(left || right)</h3>
        <p>
          두 자식 노드의 해시를 연결(||는 concatenation)한 후 해시하여 부모 노드를 만듭니다.
          이 과정을 반복하면 최종적으로 하나의 머클 루트가 생성됩니다.
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`# 내부 노드 계산
H(AB) = SHA256d(H(A) || H(B))    # 32bytes + 32bytes = 64bytes → hash
H(CD) = SHA256d(H(C) || H(D))

# 머클 루트
Root  = SHA256d(H(AB) || H(CD))

# 이진 트리 높이 = ⌈log₂(n)⌉
# 4개 리프 → 높이 2 → 루트까지 2번 해싱`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">홀수 개 리프 처리</h3>
        <p>
          리프 노드가 홀수 개일 때, Bitcoin에서는 마지막 해시를 복제(duplicate)하여
          짝수 개로 만듭니다. 예를 들어 리프가 5개이면, 5번째 해시를 복사하여 6개로 만든 후
          정상적으로 쌍을 이루어 해싱합니다.
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`# 홀수 개 리프 처리 (Bitcoin 방식)
리프: [H(A), H(B), H(C), H(D), H(E)]
           ↓ 마지막 노드 복제
리프: [H(A), H(B), H(C), H(D), H(E), H(E)]

Level 1: H(AB), H(CD), H(EE)
           ↓ 다시 홀수 → 복제
Level 1: H(AB), H(CD), H(EE), H(EE)

Level 2: H(AB|CD), H(EE|EE)

Root:    H(AB|CD | EE|EE)

⚠️ 주의: 이 복제 방식은 CVE-2012-2459 취약점의 원인이 됨
   같은 머클 루트를 가진 다른 블록을 만들 수 있었음`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Bitcoin에서의 구현</h3>
        <p>
          Bitcoin Core에서 머클 루트는 블록의 모든 트랜잭션 ID(txid) 리스트로부터 계산됩니다.
          coinbase 트랜잭션이 항상 첫 번째 리프이며, 이 과정은 블록 검증 시 반드시 수행됩니다.
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`// Bitcoin Core — merkle.cpp (ComputeMerkleRoot 핵심 로직)
uint256 ComputeMerkleRoot(std::vector<uint256> hashes) {
    while (hashes.size() > 1) {
        // 홀수면 마지막 요소 복제
        if (hashes.size() % 2 != 0)
            hashes.push_back(hashes.back());

        std::vector<uint256> new_hashes;
        for (size_t i = 0; i < hashes.size(); i += 2) {
            // 두 해시를 연결 후 double SHA-256
            new_hashes.push_back(
                Hash(hashes[i], hashes[i + 1])
            );
        }
        hashes = std::move(new_hashes);
    }
    return hashes.empty() ? uint256() : hashes[0];
}`}</code>
        </pre>

        <CitationBlock source="Ralph Merkle, US Patent 4,309,569 — 'Signatures via Tree Authentication'" citeKey={1} type="paper"
          href="https://patents.google.com/patent/US4309569A">
          <p className="italic text-foreground/80">
            "The invention provides a method for verifying a large file by storing only a single
            hash value (the root), and presenting a logarithmic number of hash values as proof."
          </p>
          <p className="mt-2 text-xs">
            1979년 특허에서 이미 로그 크기의 증명이라는 핵심 아이디어가 제시되었습니다.
            이 아이디어는 40년 후 블록체인의 라이트 클라이언트 설계에 그대로 적용됩니다.
          </p>
        </CitationBlock>

        <CitationBlock source="Bitcoin Core — src/consensus/merkle.cpp" citeKey={2} type="code"
          href="https://github.com/bitcoin/bitcoin/blob/master/src/consensus/merkle.cpp">
          <p className="italic text-foreground/80">
            "ComputeMerkleRoot computes the merkle root from a vector of leaf hashes,
            duplicating the last element when the count is odd."
          </p>
          <p className="mt-2 text-xs">
            Bitcoin Core의 실제 구현에서는 mutated 여부도 함께 추적합니다.
            동일한 트랜잭션이 중복되면 mutation이 감지되어 블록이 거부될 수 있습니다.
            이는 CVE-2012-2459 패치의 일부입니다.
          </p>
        </CitationBlock>

        <div className="grid gap-3 sm:grid-cols-2 mt-4">
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="font-semibold text-sm mb-1">시간 복잡도</p>
            <p className="text-sm text-muted-foreground">
              트리 구성: O(n) 해시 연산. n개 리프에 대해 약 2n-1개 해시 계산.
            </p>
          </div>
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="font-semibold text-sm mb-1">공간 복잡도</p>
            <p className="text-sm text-muted-foreground">
              전체 트리: O(n) 노드. 그러나 블록 헤더에는 루트 해시 32바이트만 저장.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
