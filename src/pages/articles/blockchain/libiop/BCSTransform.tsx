import CodePanel from '@/components/ui/code-panel';
import BCSFlowViz from './viz/BCSFlowViz';
import { BCS_CODE, HASH_CODE } from './BCSTransformData';

export default function BCSTransform() {
  return (
    <section id="bcs" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BCS 변환</h2>
      <div className="not-prose mb-8">
        <BCSFlowViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>BCS(Ben-Sasson, Chiesa, Spooner) 변환</strong>은
          공개 코인 IOP를 비상호작용 zkSNARK로 변환합니다.<br />
          Fiat-Shamir 변환의 확장으로,
          해시 함수와 머클 트리를 결합하여
          상호작용 없이 검증 가능한 증명을 생성합니다.
        </p>
        <h3>BCS 변환 과정</h3>
        <CodePanel title="BCS 변환 3단계" code={BCS_CODE}
          annotations={[
            { lines: [4, 8], color: 'sky', note: '머클 트리로 오라클 커밋' },
            { lines: [11, 13], color: 'emerald', note: '해시 체인으로 챌린지 생성' },
            { lines: [16, 18], color: 'amber', note: '쿼리 응답과 머클 증명' },
          ]} />
        <h3>해시 함수 & 머클 트리</h3>
        <CodePanel title="해시 및 머클 구현" code={HASH_CODE}
          annotations={[
            { lines: [2, 6], color: 'sky', note: 'Blake2b / SHA-3 / Poseidon' },
            { lines: [10, 12], color: 'emerald', note: '머클 트리 구조' },
            { lines: [15, 17], color: 'amber', note: '배치 해싱 & 증명 생성' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">BCS Transform 수학적 배경</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BCS (Ben-Sasson, Chiesa, Spooner) Transform
//
// 목적:
//   Public-coin IOP → Non-interactive argument
//
// vs Fiat-Shamir:
//   Fiat-Shamir: Sigma protocol → NIZK
//   BCS: IOP → SNARK (더 복잡)
//
// 3가지 핵심 요소:
//
// 1. Vector Commitment (oracle 대체)
//    Oracle의 모든 positions를 한꺼번에 commit
//    → Merkle tree 사용
//
//    Commit:
//      tree = MerkleTree(oracle_values)
//      commit = tree.root
//
//    Open at position i:
//      path = tree.path(i)
//      → verifier가 path 검증
//
// 2. Fiat-Shamir (challenge 생성)
//    Interactive challenges → deterministic
//
//    challenge_i = H(
//      transcript_so_far ||
//      round_index ||
//      context
//    )
//
// 3. Proof Bundle
//    모든 oracle commits
//    모든 query answers
//    모든 Merkle paths
//    → 단일 proof로 묶음

// Security Analysis:
//
// Random Oracle Model (ROM):
//   H를 random oracle로 가정
//   Computational soundness 보장
//
// Soundness error:
//   IOP soundness × Merkle collision probability
//   negligible 수준
//
// Zero-knowledge:
//   Simulator가 transcript 위조 가능
//   (실제 witness 없이)

// 예시 (Aurora + BCS):
//
// Prover:
//   1. 증인 → polynomials
//   2. Commit polynomials (Merkle trees)
//   3. Send Merkle roots
//   4. FS challenges 자체 생성
//   5. Compute responses
//   6. Merkle proofs for queries
//
// Verifier:
//   1. Recompute FS challenges
//   2. Verify Merkle paths
//   3. Check polynomial consistency
//   4. Accept/Reject

// 효율성:
//   Proof size: O(log² n) × hash_size
//   예: n=2^20, SHA-256
//     400 × 32 bytes ≈ 12 KB
//
// 비교:
//   Groth16: ~200 bytes (pairing 필수)
//   BCS-Aurora: ~12 KB (hash only)
//   BCS는 크지만 transparent + post-quantum`}
        </pre>
      </div>
    </section>
  );
}
