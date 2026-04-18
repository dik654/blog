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
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-3">5단계 내부 동작</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-foreground/80">Step 1: transferFrom</p>
                  <p><code>IERC20(token).transferFrom(msg.sender, address(this), amount)</code></p>
                  <p className="text-xs">ERC-20 표준 호출 &mdash; user &rarr; RAILGUN contract</p>
                </div>
                <div>
                  <p className="font-medium text-foreground/80">Step 2: Note 생성 (off-chain)</p>
                  <ul className="space-y-0.5">
                    <li><code>npk</code>: 수신자 public key (Poseidon)</li>
                    <li><code>token</code>: ERC-20 주소</li>
                    <li><code>amount</code>: <code>uint128</code></li>
                    <li><code>random</code>: <code>bytes31</code> (unique randomness)</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-foreground/80">Step 3: Commitment 계산</p>
                  <p><code>commitment = Poseidon(npk, token, amount, random)</code></p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-foreground/80">Step 4: Merkle Tree Insert</p>
                  <p><code>merkle_tree.insert(commitment)</code></p>
                  <p className="text-xs">depth 16 &rarr; 65,536 leaves per tree. overflow 시 새 tree 생성.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground/80">Step 5: Event Emission</p>
                  <p><code>emit Shield(token, amount, npk, commitment)</code></p>
                  <p className="text-xs">Encrypted memo 포함 &mdash; 수신자만 복호화 가능</p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-green-500/30 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">이후 note 소유자만 가능한 작업</p>
            <div className="grid grid-cols-3 gap-3 text-sm text-center text-muted-foreground">
              <div className="bg-muted/50 rounded p-2"><code>random</code> 값 보유 (private)</div>
              <div className="bg-muted/50 rounded p-2">Merkle path 계산</div>
              <div className="bg-muted/50 rounded p-2">ZK proof 생성 (소비 시)</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
