export default function MerkleCommitment() {
  return (
    <section id="merkle-commitment" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Sparse Merkle Tree &amp; Commitment</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">Sparse Merkle Tree</h3>
        <p>
          대량의 데이터를 하나의 해시값(root)으로 요약하고, 특정 데이터의 포함 여부를
          효율적으로 증명하는 자료구조입니다. Sparse Merkle Tree는 2&#x00B2;&#x2075;&#x2076;개의 고정된 리프 공간을 가지며,
          대부분은 기본값(0)이고 소수의 리프만 실제 값을 가집니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`        root = H(H₁₂, H₃₄)
       /                    \\
  H₁₂ = H(H₁, H₂)      H₃₄ = H(H₃, H₄)
    /        \\              /        \\
  H(A)     H(B)         H(C)      H(D)

증명 크기: depth개의 Fr = 256 × 32B = 8KB
검증: O(log N) 해시 연산`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">기본 해시 최적화</h3>
        <p>
          빈 서브트리는 미리 계산된 기본 해시로 대체합니다. default[0] = 0, default[i] = H(default[i-1], default[i-1]).
          실제 값이 있는 경로만 저장하므로 O(N x depth) 공간만 필요합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">머클 증명 검증</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`// 증명 검증: 리프부터 root를 재구성
current = H(key, value)

for i in 0..depth:
  bit = key의 i번째 비트
  if bit == 0:
    current = H(current, siblings[i])
  else:
    current = H(siblings[i], current)

assert current == root  // collision resistance에 의존`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Commitment Scheme</h3>
        <p>
          Commitment은 값을 숨기되 나중에 열 수 있는 암호학적 봉투입니다.
          두 가지 성질을 만족해야 합니다.
        </p>
        <ul>
          <li><strong>Hiding</strong> — commitment을 보고 원래 값을 알 수 없음</li>
          <li><strong>Binding</strong> — commit한 값과 다른 값으로 열 수 없음</li>
        </ul>

        <h4 className="text-lg font-semibold mt-4 mb-2">Hash Commitment</h4>
        <p>
          commit(v, r) = H(v, r)로 구현합니다. 랜덤 블라인딩 팩터 r이 hiding을, Poseidon의
          collision resistance가 binding을 보장합니다.
        </p>

        <h4 className="text-lg font-semibold mt-4 mb-2">Pedersen Commitment</h4>
        <p>
          commit(v, r) = v*G + r*H (타원곡선 점). 이산로그 문제(DLP)에 기반하여 정보이론적
          hiding과 계산적 binding을 제공합니다. 동형성(homomorphic) 성질도 가지고 있어
          commit(a) + commit(b) = commit(a+b)가 성립합니다.
        </p>
      </div>
    </section>
  );
}
