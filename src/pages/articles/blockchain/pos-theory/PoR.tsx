import PoRFlowViz from './viz/PoRFlowViz';

export default function PoR() {
  return (
    <section id="por" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Proof of Retrievability (PoR)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          저장자가 파일을 실제로 보유하고 요청 시 반환 가능함을 증명하는 프로토콜.<br />
          검증자는 파일 전체를 다운로드하지 않고도 무결성을 확인
        </p>
      </div>
      <div className="not-prose"><PoRFlowViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">PoR 프로토콜 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Proof of Retrievability (PoR):

// Definition (Juels-Kaliski 2007):
// "A file can be retrieved in its entirety
//  from a challenge-response protocol"

// Setup phase:
// 1. client encodes file
// 2. includes error-correcting redundancy
// 3. embeds sentinels (random values)
// 4. uploads to storage provider (SP)

// Challenge-Response:
// 1. Verifier selects random positions
// 2. Requests: "give me values at positions X, Y, Z"
// 3. SP responds with claimed values
// 4. Verifier checks sentinels
// 5. extraction: reconstruct file (probabilistic)

// Retrievability theorem:
// - if SP passes challenges with prob > ε
// - file retrievable w.h.p. (with high probability)
// - extractor algorithm recovers data

// Properties:
// ✓ probabilistic retrieval guarantee
// ✓ lightweight verification
// ✓ constant-size challenges
// ✗ doesn't prevent copying (Sybil)
// ✗ doesn't guarantee time persistence

// Variants:
// - Sentinel-based (original)
// - Merkle-tree based
// - Erasure coded (stronger)
// - Compact PoR (shorter proofs)

// Security assumptions:
// - computational security (hash, EC)
// - random oracle model
// - honest verifier
// - one honest replica

// PDP (Proof of Data Possession):
// - Ateniese et al. 2007
// - lighter than PoR
// - no retrievability guarantee
// - just existence
// - Filecoin PDP (2024) uses this

// PoR vs PDP:
// PoR:
// - retrievability guarantee
// - error correcting codes
// - file reconstruction
// - stronger
//
// PDP:
// - existence only
// - Merkle-based
// - lightweight
// - weaker but simpler

// Applications:
// - cloud storage audits
// - compliance checks
// - DRM systems
// - distributed storage networks
// - Filecoin PDP (2024+)`}
        </pre>
        <p className="leading-7">
          PoR (Juels-Kaliski 2007): <strong>challenge-response + retrievability guarantee</strong>.<br />
          PDP variant: 가벼움, Filecoin PDP가 사용.<br />
          error-correcting codes + sentinels이 기반.
        </p>
      </div>
    </section>
  );
}
