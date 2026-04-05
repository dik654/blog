import ZodaViz from './viz/ZodaViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Zoda({ onCodeRef }: Props) {
  return (
    <section id="zoda" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ZODA: Reed-Solomon 이레이저 코딩</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>Scheme</code> trait — encode/check/decode 3단계 이레이저 코딩 추상화
          <br />
          <code>PhasedScheme</code> — Strong(직접 수신)/Weak(전달) 샤드 분리. 검증 비용 최적화
        </p>
        <p className="leading-7">
          <strong>ZODA</strong> — Reed-Solomon + Hadamard + Fiat-Shamir 기반
          <br />
          데이터 → n·S × c 행렬 → RS 인코딩 → Merkle 커밋 → 체크섬 Z = X · H
          <br />
          KZG 대비: 신뢰 설정 불필요 · <code>ValidatingScheme</code> — 샤드 1개만 검증해도 전체 유효성 보장
        </p>
        <p className="leading-7">
          <strong>Strong → Weak</strong> 변환: weaken()으로 checksum/root 제거 → 대역폭 절약
          <br />
          check(): Merkle inclusion 검증 + shard · H == encoded_checksum 비교
        </p>
      </div>
      <div className="not-prose mb-8">
        <ZodaViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">ZODA 상세 설계</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// ZODA: Zero-trust Online Data Availability
//
// Goal:
//   Distribute data among N nodes
//   Any k of them can reconstruct full data
//   Verifiable that data is available
//   No trusted setup required

// Design comparison:
//
//   KZG polynomial commitments:
//     Pros: single commitment per block, small proofs
//     Cons: requires trusted setup ceremony
//     Used: Ethereum 4844 blobs
//
//   Merkle tree + RS:
//     Pros: no trusted setup
//     Cons: commitments grow with block size
//     Used: Celestia, ZODA
//
//   ZODA innovation:
//     Uses Hadamard-encoded checksum
//     Fiat-Shamir challenge
//     Provably available with 1-of-n honest holders

// ZODA algorithm:
//
//   Input: data D of size m bytes
//
//   Step 1: Arrange as matrix
//     D -> X matrix of shape (n*S) x c
//     where n*S = rows, c = columns
//
//   Step 2: Reed-Solomon encode columns
//     Each column is RS-encoded to length n (from S)
//     Blowup factor: rate = S/n
//
//   Step 3: Merkle commit to rows
//     merkle_tree.commit(X[i,:]) for each row i
//     Produces commitment roots
//
//   Step 4: Compute checksum
//     Z = X · H  where H is Hadamard matrix
//     Z is the "Hadamard-projected" data
//
//   Step 5: Fiat-Shamir challenge
//     challenge = hash(X_roots, Z_root)
//     Derive random vector 'r' from challenge
//
//   Step 6: Compute check vector
//     proof = X^T · r
//     Distributed to validators

// Verification:
//
//   Validator holds shard X[i,:] (one row)
//
//   Verifier checks:
//     1. Merkle inclusion: X[i,:] is in committed root
//     2. Hadamard check: X[i,:] · H == Z[i,:] (encoded checksum)
//     3. Fiat-Shamir: shard is randomly queried
//
//   If all checks pass:
//     High probability that X is well-formed
//     Any f+1 shards can reconstruct X

// Scheme trait:
//
//   trait Scheme {
//       type Input;
//       type Shard;
//       type Proof;
//
//       fn encode(input: Self::Input) -> Vec<Self::Shard>;
//       fn check(shard: &Self::Shard, proof: &Self::Proof) -> bool;
//       fn decode(shards: &[Self::Shard]) -> Option<Self::Input>;
//   }
//
//   ZODA implements this trait
//   Extensible to other schemes (KZG, Merkle-only, etc.)

// ValidatingScheme (provable availability):
//
//   Stronger guarantee: if shard passes check(),
//   then data IS available from any honest holder
//
//   Implementation property:
//     Successfully checked shards -> can always reconstruct
//     No "bad holder" can lie about having data

// PhasedScheme (Strong/Weak):
//
//   Strong shards:
//     Full data + checksum + merkle root
//     Sent to primary replicas
//     Self-sufficient validation
//
//   Weak shards:
//     Just raw data (no checksum)
//     Sent to secondary replicas
//     Validated against strong shards
//
//   Bandwidth savings:
//     Strong: small number, full metadata
//     Weak: majority of replicas, minimal overhead

// Strong → Weak conversion:
//
//   fn weaken(strong_shard: StrongShard) -> WeakShard {
//       WeakShard {
//           data: strong_shard.data,
//           // checksum, merkle_root stripped
//       }
//   }
//
//   Saves: ~32-64 bytes per shard (hash sizes)
//   Scales: huge savings with many replicas

// Reed-Solomon parameters:
//
//   Block size: 1 MB = 2^20 bytes
//   Chunk size: 256 bytes
//   n (encoded chunks): 1024
//   k (data chunks): 256
//   Rate: 1/4 (25% redundancy)
//
//   Reconstruction:
//     Any 256 chunks recover full data
//     Even if 768 chunks lost (75%)

// Security analysis:
//
//   Soundness:
//     ZODA proof passes => data is correctly encoded
//     Probability of wrong encoding passing: 2^-lambda
//     Where lambda determined by FS challenge entropy
//
//   Availability:
//     If 1+ honest validator holds valid shard,
//     full data can be reconstructed
//     Resists all-but-one corruption
//
//   Post-quantum:
//     Reed-Solomon is quantum-safe
//     Hadamard/FS with SHA-3 is quantum-safe
//     No DL/pairing dependencies

// Applications:
//   - Data availability for rollups
//   - Proof of replication in storage
//   - BFT consensus data layer
//   - File sharing with integrity`}
        </pre>
      </div>
    </section>
  );
}
