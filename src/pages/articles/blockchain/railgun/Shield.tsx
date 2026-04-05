import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import ShieldViz from './viz/ShieldViz';

export default function Shield({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="shield" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Shield — ERC-20 입금</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>shield()</code>는 ERC-20 토큰을 RAILGUN 컨트랙트에 입금하는 함수다.
          <br />
          입금 후 토큰은 shielded 상태가 된다. 외부에서 잔액을 볼 수 없다.
        </p>
        <p className="leading-7">
          내부 동작은 4단계다. transferFrom → hashCommitment → insertLeaf → emit Shield.
          <br />
          각 단계에서 실제 변수값과 상태 변화를 추적한다.
          <CodeViewButton onClick={() => onCodeRef('rg-shield', codeRefs['rg-shield'])} />
        </p>
      </div>
      <div className="not-prose"><ShieldViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Shield 과정 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Shield 단계별 내부 동작

// Step 1: transferFrom
// ERC-20 표준 호출
// user → RAILGUN contract
IERC20(token).transferFrom(msg.sender, address(this), amount);

// Step 2: Note 생성
// 사용자 측 (off-chain)
note = {
    npk: owner_public_key,       // 수신자 PK (Poseidon)
    token: token_address,
    amount: uint128,
    random: bytes31              // unique randomness
};

// Step 3: Commitment 계산
commitment = Poseidon(npk, token, amount, random)

// Step 4: Merkle tree insert
merkle_tree.insert(commitment);
// tree depth: 16 → 65,536 leaves per tree
// tree overflow 시 새 tree 생성

// Step 5: Event emission
emit Shield(token, amount, npk, commitment);
// Encrypted memo 포함 (수신자만 복호화)

// 이후 note 소유자만
// 1) Random 값 알고 있음 (private)
// 2) Merkle path 계산 가능
// 3) ZK proof 생성 가능 (소비 시)`}</pre>

      </div>
    </section>
  );
}
