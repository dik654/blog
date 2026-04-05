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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Circom 스타일 circuit 표현

template Transaction(N_INPUTS, N_OUTPUTS, TREE_DEPTH) {
    // Public inputs (verifier가 검증)
    signal input nullifiers[N_INPUTS];
    signal input merkleRoot;
    signal input outputCommitments[N_OUTPUTS];
    signal input fee;

    // Private inputs (witness, prover만 알고 있음)
    signal input inputNotes[N_INPUTS][4];   // npk, token, value, random
    signal input spendingKeys[N_INPUTS];
    signal input merklePaths[N_INPUTS][TREE_DEPTH];
    signal input merkleIndices[N_INPUTS][TREE_DEPTH];
    signal input outputNotes[N_OUTPUTS][4];

    // Constraint 1: Nullifier correctness
    // nullifier = Poseidon(spendingKey, leafIndex)
    component nullifierHasher[N_INPUTS];
    for (var i = 0; i < N_INPUTS; i++) {
        nullifierHasher[i] = Poseidon(2);
        nullifierHasher[i].inputs[0] <== spendingKeys[i];
        nullifierHasher[i].inputs[1] <== leafIndex[i];
        nullifiers[i] === nullifierHasher[i].out;
    }

    // Constraint 2: Merkle membership
    // input note's commitment must be in tree
    component merkleProof[N_INPUTS];
    for (var i = 0; i < N_INPUTS; i++) {
        merkleProof[i] = MerkleProof(TREE_DEPTH);
        // ... verify path
        merkleRoot === merkleProof[i].root;
    }

    // Constraint 3: Balance preservation
    // sum(inputs) == sum(outputs) + fee
    var inputSum = 0;
    var outputSum = 0;
    for (var i = 0; i < N_INPUTS; i++) inputSum += inputNotes[i][2];
    for (var o = 0; o < N_OUTPUTS; o++) outputSum += outputNotes[o][2];
    inputSum === outputSum + fee;

    // Constraint 4: Output commitments correct
    for (var o = 0; o < N_OUTPUTS; o++) {
        // commitment = Poseidon(npk, token, value, random)
        outputCommitments[o] === Poseidon(outputNotes[o]);
    }
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">회로 복잡도 분석</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Circom R1CS constraints (2 inputs, 2 outputs, depth 16)

// Per input:
// - Nullifier Poseidon: ~200 constraints
// - Merkle proof: 16 × 200 = 3200 constraints
// - Commitment Poseidon: ~200 constraints
// Subtotal per input: ~3600

// Per output:
// - Commitment Poseidon: ~200 constraints
// - Range check (value): ~128 constraints
// Subtotal per output: ~330

// Constants:
// - Balance constraint: 1
// - Zero check: 1

// Total (2+2):
// 2 × 3600 + 2 × 330 + 2 = ~7862 constraints

// Groth16 proving key 크기
// ~7862 × 64 bytes ≈ 500 KB

// Proof 생성 시간
// - MSM: O(n) group operations
// - FFT: O(n log n)
// - Typical: 500ms ~ 2s on laptop

// Proof 크기
// Groth16: 192 bytes (3 G1 + 1 G2 element)
// Verification: ~250K gas on Ethereum`}</pre>

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
