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
        <div className="not-prose space-y-4 my-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-blue-400 mb-2">Account Model (일반 EVM)</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>각 주소가 잔액 보유 &mdash; <code>alice.balance = 100 DAI</code></li>
                <li><code>transfer(bob, 30)</code> &rarr; alice -30, bob +30</li>
                <li>결과: &quot;alice에서 bob으로 30 DAI&quot; 완전 공개</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-green-400 mb-2">UTXO Model (RAILGUN on EVM)</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>잔액 없음 &mdash; <strong>Note</strong>만 존재</li>
                <li>Note = <code>{'{token, amount, owner_pubkey, random}'}</code></li>
                <li>Note 해시 = <strong>Commitment</strong> (온체인 공개)</li>
                <li>Owner는 private key로만 소비 가능</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-violet-400 mb-2">Transaction 예시 (Alice → Bob 30 DAI)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground/80 mb-1">Input notes (소비)</p>
                <ul className="space-y-0.5">
                  <li><code>note_1</code>: DAI, 50, <code>alice_pk</code>, r1</li>
                  <li><code>note_2</code>: DAI, 30, <code>alice_pk</code>, r2</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-foreground/80 mb-1">Output notes (생성)</p>
                <ul className="space-y-0.5">
                  <li><code>note_3</code>: DAI, 30, <code>bob_pk</code>, r3</li>
                  <li><code>note_4</code>: DAI, 50, <code>alice_pk</code>, r4 (거스름돈)</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-green-500/30 p-4">
              <p className="font-semibold text-sm text-green-400 mb-2">외부 관찰자가 알 수 있는 것</p>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li>Transaction 발생 여부</li>
                <li>Nullifier 2개 공개 (이중 사용 방지)</li>
                <li>Commitment 2개 추가</li>
              </ul>
            </div>
            <div className="rounded-lg border border-red-500/30 p-4">
              <p className="font-semibold text-sm text-red-400 mb-2">외부 관찰자가 알 수 없는 것</p>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li>누가 sender인가</li>
                <li>누가 receiver인가</li>
                <li>얼마인가</li>
                <li>어떤 note와 연결되는가</li>
              </ul>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Shield/Unshield — Entry/Exit</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-blue-500/30 p-4">
              <p className="font-semibold text-sm text-blue-400 mb-2">1. Shield (Entry)</p>
              <p className="text-sm text-muted-foreground mb-2">Public DAI &rarr; Private Note</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li><code>transferFrom(msg.sender, this, amount)</code> &mdash; ERC-20 입금</li>
                <li><code>merkle_tree.insert(note_commitment)</code> &mdash; tree에 추가</li>
                <li><code>emit Shielded(token, amount)</code></li>
              </ul>
              <p className="text-xs text-muted-foreground mt-2">이후 alice의 잔액은 &quot;private&quot;</p>
            </div>
            <div className="rounded-lg border border-green-500/30 p-4">
              <p className="font-semibold text-sm text-green-400 mb-2">2. Private Transfer</p>
              <p className="text-sm text-muted-foreground mb-2">Note_A &rarr; Note_B (공개 잔액 변동 없음)</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>Groth16 proof 필수:</li>
                <li>&bull; Merkle proof &mdash; &quot;I own a note in the tree&quot;</li>
                <li>&bull; <code>nullifier = hash(note_secret)</code></li>
                <li>&bull; <code>output commitment = hash(new_note)</code></li>
                <li>&bull; <code>input amount == output amount + fee</code></li>
              </ul>
            </div>
            <div className="rounded-lg border border-amber-500/30 p-4">
              <p className="font-semibold text-sm text-amber-400 mb-2">3. Unshield (Exit)</p>
              <p className="text-sm text-muted-foreground mb-2">Private Note &rarr; Public address</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li><code>verifier.verify(proof)</code> &mdash; ZK 증명 검증</li>
                <li><code>nullifiers[nullifier] = true</code> &mdash; replay 방어</li>
                <li><code>IERC20(token).transfer(recipient, amount)</code> &mdash; 공개 전송</li>
              </ul>
            </div>
          </div>
        </div>

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
