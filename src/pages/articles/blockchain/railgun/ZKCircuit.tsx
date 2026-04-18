import type { CodeRef } from '@/components/code/types';
import ZKCircuitViz from './viz/ZKCircuitViz';

export default function ZKCircuit({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="zk-circuit" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ZK Circuit — R1CS 제약</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          RAILGUN의 ZK 회로는 3가지를 증명한다.
          <br />
          nullifier 정당성, Merkle 소속, 밸런스 보존.
        </p>
        <p className="leading-7">
          회로 입력은 public과 private로 나뉜다.
          <br />
          public: nullifier, merkleRoot, outputCommitments — 온체인 검증에 사용.
          <br />
          private: spendingKey, leafIndex, siblings — 증명자만 알고, 검증자에게 공개하지 않는다.
        </p>
        <p className="leading-7">
          제약 3(밸런스 보존)이 핵심이다. input 합 == output 합 + fee.
          <br />
          이 제약이 없으면 허공에서 토큰을 생성할 수 있다.
        </p>
      </div>
      <div className="not-prose"><ZKCircuitViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">R1CS 제약 상세</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-blue-500/30 p-4">
              <p className="font-semibold text-sm text-blue-400 mb-2">Public Inputs (verifier가 검증)</p>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li><code>nullifiers[N_INPUTS]</code></li>
                <li><code>merkleRoot</code></li>
                <li><code>outputCommitments[N_OUTPUTS]</code></li>
                <li><code>fee</code></li>
              </ul>
            </div>
            <div className="rounded-lg border border-green-500/30 p-4">
              <p className="font-semibold text-sm text-green-400 mb-2">Private Inputs (witness, prover만 보유)</p>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li><code>inputNotes[N_INPUTS][4]</code> &mdash; npk, token, value, random</li>
                <li><code>spendingKeys[N_INPUTS]</code></li>
                <li><code>merklePaths[N_INPUTS][TREE_DEPTH]</code></li>
                <li><code>merkleIndices[N_INPUTS][TREE_DEPTH]</code></li>
                <li><code>outputNotes[N_OUTPUTS][4]</code></li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-violet-400 mb-3">4개 제약 조건 (Circom R1CS)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground/80 mb-1">C1: Nullifier correctness</p>
                <p><code>nullifiers[i] === Poseidon(spendingKeys[i], leafIndex[i])</code></p>
              </div>
              <div>
                <p className="font-medium text-foreground/80 mb-1">C2: Merkle membership</p>
                <p><code>merkleRoot === MerkleProof(TREE_DEPTH).root</code> per input</p>
              </div>
              <div>
                <p className="font-medium text-foreground/80 mb-1">C3: Balance preservation</p>
                <p><code>sum(inputNotes[*].value) === sum(outputNotes[*].value) + fee</code></p>
              </div>
              <div>
                <p className="font-medium text-foreground/80 mb-1">C4: Output commitments correct</p>
                <p><code>outputCommitments[o] === Poseidon(outputNotes[o])</code></p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">회로 복잡도 분석</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-blue-400 mb-2">Per Input (~3,600 constraints)</p>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li>Nullifier Poseidon: ~200</li>
                <li>Merkle proof: 16 &times; 200 = 3,200</li>
                <li>Commitment Poseidon: ~200</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-green-400 mb-2">Per Output (~330 constraints)</p>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li>Commitment Poseidon: ~200</li>
                <li>Range check (value): ~128</li>
                <li>Constants (balance + zero): 2</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">총합 (2 in, 2 out): ~7,862 constraints</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-center">
              <div><p className="text-muted-foreground">Proving key</p><p className="font-mono">~500 KB</p><p className="text-xs text-muted-foreground">7862 &times; 64 bytes</p></div>
              <div><p className="text-muted-foreground">Prove time</p><p className="font-mono">0.5-2s</p><p className="text-xs text-muted-foreground">MSM O(n) + FFT O(n log n)</p></div>
              <div><p className="text-muted-foreground">Proof size</p><p className="font-mono font-semibold">192 bytes</p><p className="text-xs text-muted-foreground">3 G1 + 1 G2 element</p></div>
              <div><p className="text-muted-foreground">Verify gas</p><p className="font-mono font-semibold">~250K</p><p className="text-xs text-muted-foreground">EVM pairing precompile</p></div>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Circuit 설계의 trade-off</p>
          <p>
            <strong>Fixed N_INPUTS, N_OUTPUTS</strong>:<br />
            - Circuit마다 고정된 I/O 개수<br />
            - RAILGUN은 multiple circuits (1x1, 2x2, 10x10 등)<br />
            - 사용자가 필요한 circuit 선택
          </p>
          <p className="mt-2">
            <strong>왜 Groth16?</strong>:<br />
            ✓ 가장 작은 proof (192B)<br />
            ✓ 가장 빠른 verifier (~1ms)<br />
            ✓ L1 gas 최적화<br />
            ✗ Per-circuit trusted setup (단점)
          </p>
        </div>

      </div>
    </section>
  );
}
