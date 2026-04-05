import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import TransactViz from './viz/TransactViz';

export default function Transact({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="transact" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Transact — 내부 전송</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>transact()</code>는 shielded 잔액끼리 전송하는 핵심 함수다.
          <br />
          Alice의 Note를 소비하고, Bob의 새 Note를 생성한다. 전 과정이 ZK 증명으로 보호된다.
          <CodeViewButton onClick={() => onCodeRef('rg-transact', codeRefs['rg-transact'])} />
        </p>
        <p className="leading-7">
          내부 흐름: verifyProof → nullifier 기록 → commitment 삽입 → 이벤트 발행.
          <br />
          온체인에는 해시값만 기록된다. 금액, 수신자, 토큰 종류는 비공개다.
        </p>
      </div>
      <div className="not-prose"><TransactViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Transact의 전체 흐름</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Off-chain 준비 (사용자/지갑 측)
// 1) 소비할 notes 선택 (alice의 note_A, note_B)
// 2) 새 notes 구성 (bob_note, alice_change_note)
// 3) Merkle path 계산 (각 input note)
// 4) Circuit witness 생성
//    - spendingKeys
//    - paths, indices
//    - input/output note values
// 5) Groth16 prover로 증명 생성 (1-2s)

// On-chain submit
function transact(
    bytes32 merkleRoot,
    bytes32[] calldata nullifiers,
    bytes32[] calldata commitments,
    EncryptedMemo[] calldata memos,
    Groth16Proof calldata proof
) external {
    // 1) Merkle root 유효성 (과거 값 허용)
    require(isKnownRoot(merkleRoot), "Invalid root");

    // 2) Nullifier 중복 체크
    for (uint i = 0; i < nullifiers.length; i++) {
        require(!nullifierUsed[nullifiers[i]], "Already spent");
    }

    // 3) ZK proof 검증 (가장 비싼 step, ~250K gas)
    require(verifier.verify(proof, [merkleRoot, ...]), "Bad proof");

    // 4) Nullifier 기록
    for (uint i = 0; i < nullifiers.length; i++) {
        nullifierUsed[nullifiers[i]] = true;
    }

    // 5) Commitment tree에 추가
    for (uint j = 0; j < commitments.length; j++) {
        merkleTree.insert(commitments[j]);
    }

    // 6) Event emission (encrypted memo)
    emit Transact(merkleRoot, nullifiers, commitments, memos);
}

// Cost 분석
// - Merkle root check: ~5K gas
// - Nullifier check (per input): ~3K gas each
// - Groth16 verify: ~250K gas (고정)
// - Nullifier write: ~20K gas each (new slot)
// - Commitment insert: ~30K gas each
// - Event log: ~10K gas
// Total (2 in, 2 out): ~400K gas`}</pre>

      </div>
    </section>
  );
}
