import type { CodeRef } from '@/components/code/types';
import ContextViz from './viz/ContextViz';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">아키텍처 & UTXO 모델</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Ethereum 트랜잭션은 from, to, amount가 전부 공개된다.
          <br />
          Etherscan에서 누구나 지갑 잔액과 자금 흐름을 추적할 수 있다.
        </p>
        <p className="leading-7">
          RAILGUN은 <strong>UTXO 모델</strong>을 EVM 위에 구현해서 이 문제를 해결한다.
          <br />
          계정 잔액 대신 <strong>Note(미사용 출력)</strong>를 소비하는 구조다.
        </p>
        <p className="leading-7">
          Note는 Poseidon 해시로 <strong>commitment</strong>가 되어 Merkle tree에 저장된다.
          <br />
          소비할 때는 <strong>Groth16 ZK 증명</strong>으로 소유권을 입증한다. 비밀키를 공개하지 않는다.
        </p>
      </div>
      <div className="not-prose"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">RAILGUN의 Account → UTXO 변환</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 일반 EVM (Account model)
// 각 주소가 잔액 보유
// alice.balance = 100 DAI
// transfer(bob, 30) → alice.balance -= 30, bob.balance += 30
// → "alice에서 bob으로 30 DAI" 공개

// RAILGUN UTXO model on EVM
// 잔액 없음. Note만 존재.
// Note = {token, amount, owner_pubkey, random}
// Note 해시 = Commitment (공개)
// Owner는 private key로만 소비 가능

// Transaction 예
// Input notes (소비):
//   note_1: {DAI, 50, alice_pk, r1}
//   note_2: {DAI, 30, alice_pk, r2}
// Output notes (생성):
//   note_3: {DAI, 30, bob_pk, r3}
//   note_4: {DAI, 50, alice_pk, r4} (change)

// 외부 관찰자가 알 수 있는 것
// ✓ Transaction 발생
// ✓ Nullifier 2개 공개 (prevent double-spend)
// ✓ Commitment 2개 추가

// 외부 관찰자가 알 수 없는 것
// ✗ 누가 sender인가
// ✗ 누가 receiver인가
// ✗ 얼마인가
// ✗ 어떤 note와 연결되는가`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Shield/Unshield — Entry/Exit</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// RAILGUN 이용 3단계

// 1. Shield (Entry)
// Public DAI → Private Note
function shield(
    token: address,
    amount: uint256,
    note_commitment: bytes32,
    // ... encrypted memo
) external {
    // ERC20 transferFrom
    IERC20(token).transferFrom(msg.sender, this, amount);

    // Commitment tree에 추가
    merkle_tree.insert(note_commitment);

    emit Shielded(token, amount);
}
// → 이후 alice의 잔액은 "private"

// 2. Private Transfer
// Note_A → Note_B (unchanged public chain balance)
// Groth16 proof 필수:
// - "I own a note in the tree" (Merkle proof)
// - "nullifier = hash(note_secret)"
// - "output commitment = hash(new_note)"
// - "input amount == output amount + fee"

// 3. Unshield (Exit)
// Private Note → Public address
function unshield(
    nullifier: bytes32,
    public_recipient: address,
    amount: uint256,
    proof: Groth16Proof
) external {
    // Proof verification
    verifier.verify(proof);

    // Nullifier 기록 (replay 방어)
    nullifiers[nullifier] = true;

    // Public transfer
    IERC20(token).transfer(public_recipient, amount);
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Tornado Cash와의 차이</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">특성</th>
                <th className="border border-border px-3 py-2 text-left">Tornado Cash</th>
                <th className="border border-border px-3 py-2 text-left">RAILGUN</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">모델</td>
                <td className="border border-border px-3 py-2">Fixed denomination mixer</td>
                <td className="border border-border px-3 py-2">UTXO with any amount</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Private balance</td>
                <td className="border border-border px-3 py-2">No (deposit → withdraw)</td>
                <td className="border border-border px-3 py-2">Yes (continuous)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Private transfer</td>
                <td className="border border-border px-3 py-2">No</td>
                <td className="border border-border px-3 py-2">Yes</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">DeFi integration</td>
                <td className="border border-border px-3 py-2">Limited</td>
                <td className="border border-border px-3 py-2">Via Railway Recipes</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Regulatory</td>
                <td className="border border-border px-3 py-2">OFAC sanctioned (2022)</td>
                <td className="border border-border px-3 py-2">Private POI (proof of innocence)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: RAILGUN의 포지셔닝</p>
          <p>
            <strong>Aztec과의 차이</strong>: Aztec은 zkRollup L2 / RAILGUN은 L1 smart contract<br />
            <strong>장점</strong>: Immediate finality, L1 직접 실행<br />
            <strong>단점</strong>: L1 gas cost (Groth16 verify ~250K gas)
          </p>
          <p className="mt-2">
            <strong>Proof of Innocence</strong>:<br />
            - 2022 Tornado 제재 이후 개발<br />
            - 사용자가 "내 자금이 clean하다"고 증명 가능<br />
            - OFAC-sanctioned 주소에서 오지 않았음을 증명<br />
            - Privacy + compliance 균형
          </p>
        </div>

      </div>
    </section>
  );
}
