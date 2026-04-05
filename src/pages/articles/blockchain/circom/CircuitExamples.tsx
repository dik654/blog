import CircuitExampleViz from './viz/CircuitExampleViz';
import CodePanel from '@/components/ui/code-panel';

const HASH_CODE = `template Poseidon(nInputs) {
    signal input inputs[nInputs];
    signal output out;

    // 라운드 상수 & S-box
    component ark[nRounds];
    component sbox[nRounds];
    component mix[nRounds];

    // Full rounds → Partial rounds → Full rounds
    for (var r = 0; r < nRounds; r++) {
        ark[r] = AddRoundKey(nInputs);
        sbox[r] = (r < RF/2 || r >= RF/2+RP)
            ? SBoxFull(nInputs)    // Full round
            : SBoxPartial();       // Partial round
        mix[r] = MixLayer(nInputs);
    }
    out <== mix[nRounds-1].out[0];
}`;

const MERKLE_CODE = `template MerkleProof(levels) {
    signal input leaf;
    signal input pathElements[levels];
    signal input pathIndices[levels];
    signal output root;

    component hashers[levels];
    for (var i = 0; i < levels; i++) {
        hashers[i] = Poseidon(2);
        // pathIndices[i]가 0이면 왼쪽, 1이면 오른쪽
        hashers[i].inputs[0] <== leaf_or_prev * (1 - pathIndices[i])
            + pathElements[i] * pathIndices[i];
        hashers[i].inputs[1] <== leaf_or_prev * pathIndices[i]
            + pathElements[i] * (1 - pathIndices[i]);
    }
    root <== hashers[levels-1].out;
}`;

export default function CircuitExamples({ title }: { title?: string }) {
  return (
    <section id="examples" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '실전 회로 예제'}</h2>
      <div className="not-prose mb-8">
        <CircuitExampleViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          실전 ZK 애플리케이션에서 자주 사용되는 Circom 회로 패턴입니다.<br />
          Tornado Cash, Semaphore 등 프로덕션 프로젝트에서 검증된 구조입니다.
        </p>
        <CodePanel
          title="Poseidon 해시 회로"
          code={HASH_CODE}
          annotations={[
            { lines: [2, 3], color: 'sky', note: '입력 배열 & 단일 출력' },
            { lines: [14, 18], color: 'emerald', note: 'Full/Partial 라운드 분기' },
          ]}
        />
        <CodePanel
          title="Merkle Proof 검증 회로"
          code={MERKLE_CODE}
          annotations={[
            { lines: [2, 4], color: 'sky', note: 'leaf + 경로 요소/인덱스' },
            { lines: [10, 14], color: 'emerald', note: '경로 인덱스로 좌우 선택' },
          ]}
        />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">실전 회로 패턴</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Production Circom Circuit Patterns
//
// 1) Nullifier construction (Tornado Cash):
//
//    template Commitment() {
//        signal input nullifier;      // prover secret
//        signal input secret;         // prover secret
//        signal output commitment;    // public
//        signal output nullifierHash; // public
//
//        component commitHasher = Poseidon(2);
//        commitHasher.inputs[0] <== nullifier;
//        commitHasher.inputs[1] <== secret;
//        commitment <== commitHasher.out;
//
//        component nullifierHasher = Poseidon(1);
//        nullifierHasher.inputs[0] <== nullifier;
//        nullifierHash <== nullifierHasher.out;
//    }
//
//    On deposit: reveal commitment, keep (nullifier, secret)
//    On withdraw: reveal nullifierHash, prove in tree
//    Prevents double-spend via nullifier uniqueness

// 2) Signal membership (Semaphore):
//
//    template SemaphoreSignal(levels) {
//        signal input identityNullifier;
//        signal input identityTrapdoor;
//        signal input pathElements[levels];
//        signal input pathIndices[levels];
//        signal input externalNullifier;
//        signal input signalHash;
//
//        signal input root;           // public
//        signal input nullifierHash;  // public
//
//        // 1. Compute identity commitment
//        component identityCommitment = Poseidon(2);
//        identityCommitment.inputs[0] <== identityNullifier;
//        identityCommitment.inputs[1] <== identityTrapdoor;
//
//        // 2. Verify Merkle inclusion
//        component tree = MerkleTree(levels);
//        tree.leaf <== identityCommitment.out;
//        // ... path inputs ...
//        tree.root === root;
//
//        // 3. Compute nullifier hash (anti-double-signal)
//        component nullifierHasher = Poseidon(2);
//        nullifierHasher.inputs[0] <== externalNullifier;
//        nullifierHasher.inputs[1] <== identityNullifier;
//        nullifierHasher.out === nullifierHash;
//
//        // 4. Sign signal (binds proof to specific message)
//        signal signalSquared;
//        signalSquared <== signalHash * signalHash;
//    }

// 3) EdDSA signature verification:
//
//    template VerifySignature() {
//        signal input msg[256];
//        signal input pubKey[2];     // Baby Jubjub point
//        signal input R8[2];         // signature R
//        signal input S;             // signature S
//
//        component verifier = EdDSAVerifier(256);
//        verifier.msg <== msg;
//        verifier.A <== pubKey;
//        verifier.R8 <== R8;
//        verifier.S <== S;
//    }
//
//    Baby Jubjub: efficient EC inside BN254 circuits

// 4) Range proof:
//
//    template RangeProof(bits) {
//        signal input value;
//        signal output valid;
//
//        component n2b = Num2Bits(bits);
//        n2b.in <== value;
//
//        // Decomposing proves value < 2^bits
//        valid <== 1;
//    }
//
//    // Usage:
//    component rp = RangeProof(32);
//    rp.in <== age;  // age must be < 2^32

// 5) Conditional execution:
//
//    template Switcher() {
//        signal input sel;
//        signal input L;
//        signal input R;
//        signal output outL;
//        signal output outR;
//
//        // if sel=0: (outL, outR) = (L, R)
//        // if sel=1: (outL, outR) = (R, L)
//        outL <== (R - L) * sel + L;
//        outR <== (L - R) * sel + R;
//    }
//
//    Used in Merkle tree (swap left/right by path bit)

// 6) ECDSA signature (expensive!):
//
//    template ECDSAVerify(n, k) {
//        signal input msghash[k];
//        signal input pubkey[2][k];
//        signal input r[k];
//        signal input s[k];
//        signal output result;
//
//        // Uses secp256k1 math in BN254 field
//        // ~1.5M constraints (naive)
//        // ~400K constraints (optimized)
//    }
//
//    Needed for Ethereum signature verification
//    Very expensive — often pushed to recursion

// 7) MIMC hash (legacy alternative):
//
//    template MiMC(nInputs) {
//        signal input ins[nInputs];
//        signal output out;
//        // 220 rounds of x^5 permutation
//    }
//
//    Deprecated in favor of Poseidon
//    Still found in older code (Tornado Cash)

// Circuit statistics (typical dApp):
//
//   Tornado Cash 10 ETH:
//     Merkle depth: 20
//     Poseidon hashes: ~20 (per level)
//     Total constraints: ~12,000
//     Proof time: 1-5 seconds
//
//   Semaphore:
//     Merkle depth: 16
//     Total constraints: ~8,000
//     Proof time: 0.5-2 seconds
//
//   Dark Forest (game):
//     Constraints per move: 50,000+
//     Proof time: 5-30 seconds
//
//   zkRollup batch (Polygon Hermez):
//     Constraints per tx: 200-500
//     Batch size: 2000 txs
//     Total: ~1M constraints`}
        </pre>
      </div>
    </section>
  );
}
