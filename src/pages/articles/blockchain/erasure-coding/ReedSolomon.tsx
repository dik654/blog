import RSCodingViz from './viz/RSCodingViz';

export default function ReedSolomon() {
  return (
    <section id="reed-solomon">
      <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">
        Reed-Solomon 코딩
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          데이터를 유한체 위 다항식 계수로 매핑, n개 평가점에서 코드워드 생성. MDS 코드.
        </p>
      </div>
      <div className="not-prose"><RSCodingViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Reed-Solomon 코딩 원리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Reed-Solomon (RS) Coding:

// 기본 아이디어:
// - data를 finite field GF(q) polynomial로 표현
// - n개 evaluation points에서 평가
// - k개 points → polynomial 복원 가능

// Encoding:
// 1. data: k symbols [d_0, d_1, ..., d_{k-1}]
// 2. polynomial: p(x) = d_0 + d_1·x + ... + d_{k-1}·x^{k-1}
// 3. evaluate at n points:
//    [p(α_0), p(α_1), ..., p(α_{n-1})]
// 4. codeword = evaluations

// Decoding:
// - receive any k evaluations (with positions)
// - Lagrange interpolation
// - reconstruct p(x)
// - extract original data

// Finite Field GF(q):
// - q = 2^m (binary field)
// - common: GF(2^8) for bytes
// - GF(2^16), GF(2^32) for larger
// - operations: add, mul, inv

// MDS Property:
// - any k of n suffice
// - optimal: no less possible
// - quasi-optimal: exactly k

// Performance:
// - encoding: O(nk)
// - decoding: O(k^2) or O(k log k)
// - matrix multiplication
// - optimized with SIMD

// Applications:
// - QR codes (Level L: 7%, L: 15%, Q: 25%, H: 30%)
// - CD / DVD error correction
// - DSL modems
// - satellite communication
// - DNS DNSSEC
// - blockchain DA

// Blockchain RS implementations:
// - Ethereum blobs: RS over GF(2^8)
// - Celestia: 2D RS
// - Filecoin: RS for sector redundancy
// - Avalanche: network coding

// Cauchy Reed-Solomon:
// - optimized encoding
// - Cauchy matrix (invertible submatrix)
// - fewer field operations
// - libraries: leopard, klauspost/reedsolomon

// Systematic RS:
// - first k symbols = original data
// - next n-k = parity
// - decoding: trivial if data received
// - common in storage systems

// Galois Field ops:
// - SIMD acceleration (AVX2, AVX-512)
// - 10+ GB/s throughput
// - ISA-L (Intel Storage Acceleration Library)
// - FLAKY (Fast LFSR-based)`}
        </pre>
        <p className="leading-7">
          RS: <strong>polynomial evaluation in finite field</strong>.<br />
          MDS optimal (k of n), O(nk) encoding, O(k²) decoding.<br />
          SIMD accelerated to 10+ GB/s (ISA-L).
        </p>
      </div>
    </section>
  );
}
