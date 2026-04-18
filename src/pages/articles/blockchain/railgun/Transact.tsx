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
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-blue-500/30 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">Off-chain 준비 (사용자/지갑 측)</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm text-center text-muted-foreground">
              <div className="bg-muted/50 rounded p-2">1. 소비할 notes 선택</div>
              <div className="bg-muted/50 rounded p-2">2. 새 notes 구성</div>
              <div className="bg-muted/50 rounded p-2">3. Merkle path 계산</div>
              <div className="bg-muted/50 rounded p-2">4. Circuit witness 생성</div>
              <div className="bg-muted/50 rounded p-2">5. Groth16 prove (1-2s)</div>
            </div>
          </div>
          <div className="rounded-lg border border-green-500/30 p-4">
            <p className="font-semibold text-sm text-green-400 mb-3">On-chain <code>transact()</code> 실행 순서</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="space-y-2">
                <div>
                  <p className="font-medium text-foreground/80">1. Merkle root 유효성</p>
                  <p><code>require(isKnownRoot(merkleRoot))</code> &mdash; 과거 root 허용</p>
                </div>
                <div>
                  <p className="font-medium text-foreground/80">2. Nullifier 중복 체크</p>
                  <p><code>require(!nullifierUsed[nullifiers[i]])</code> per input</p>
                </div>
                <div>
                  <p className="font-medium text-foreground/80">3. ZK proof 검증</p>
                  <p><code>verifier.verify(proof, [merkleRoot, ...])</code> &mdash; 가장 비싼 step (~250K gas)</p>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="font-medium text-foreground/80">4. Nullifier 기록</p>
                  <p><code>nullifierUsed[nullifiers[i]] = true</code> per input</p>
                </div>
                <div>
                  <p className="font-medium text-foreground/80">5. Commitment tree 추가</p>
                  <p><code>merkleTree.insert(commitments[j])</code> per output</p>
                </div>
                <div>
                  <p className="font-medium text-foreground/80">6. Event emission</p>
                  <p><code>emit Transact(merkleRoot, nullifiers, commitments, memos)</code></p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">Gas Cost 분석 (2 in, 2 out)</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-sm text-center">
              <div><p className="text-muted-foreground">Merkle root check</p><p className="font-mono">~5K</p></div>
              <div><p className="text-muted-foreground">Nullifier check</p><p className="font-mono">~3K &times;2</p></div>
              <div><p className="text-muted-foreground">Groth16 verify</p><p className="font-mono font-semibold">~250K</p></div>
              <div><p className="text-muted-foreground">Nullifier write</p><p className="font-mono">~20K &times;2</p></div>
              <div><p className="text-muted-foreground">Commit insert</p><p className="font-mono">~30K &times;2</p></div>
              <div><p className="text-muted-foreground">Event log</p><p className="font-mono">~10K</p></div>
            </div>
            <p className="text-center font-mono font-semibold mt-2">Total: ~400K gas</p>
          </div>
        </div>

      </div>
    </section>
  );
}
