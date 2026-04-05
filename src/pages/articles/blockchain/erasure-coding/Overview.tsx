import ErasureOverviewViz from './viz/ErasureOverviewViz';

export default function Overview() {
  return (
    <section id="overview">
      <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">
        개요 &mdash; 이레이저 코딩
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          n개 조각 중 임의의 k개만으로 원본 복원 &mdash; 분산 저장, DA, 네트워크 전송의 핵심.
        </p>
      </div>
      <div className="not-prose"><ErasureOverviewViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Erasure Coding 개요</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Erasure Coding (EC):

// 핵심 속성:
// - input: k 조각
// - output: n 조각 (n >= k)
// - 임의의 k개로 원본 복원
// - redundancy: n - k

// (n, k) 파라미터:
// - n: total encoded pieces
// - k: required for recovery
// - rate = k/n
// - overhead = (n-k)/k

// 예시 (10, 6):
// - 6 original pieces
// - 10 encoded pieces (4 redundancy)
// - any 6 pieces → recover
// - 60% overhead

// 기본 원리:
// 1. data → k symbols
// 2. encode to n symbols (redundant)
// 3. distribute n pieces
// 4. 임의 k개 수신 시 decode

// MDS (Maximum Distance Separable):
// - optimal redundancy
// - 정확히 k개로 복구 가능
// - Reed-Solomon 대표

// Non-MDS (Fountain, LDPC):
// - 살짝 더 많은 조각 필요
// - 더 빠른 encoding/decoding
// - tradeoff

// 블록체인 사용처:
// 1. Data Availability (DA):
//    - Ethereum EIP-4844 blobs
//    - Celestia
//    - EigenDA
//
// 2. Distributed Storage:
//    - Filecoin sector redundancy
//    - Storj, Sia
//    - IPFS alternative
//
// 3. Light clients:
//    - sampling-based verification
//    - DAS (Data Availability Sampling)
//
// 4. Network transmission:
//    - gossip protocols
//    - redundant broadcast

// 역사:
// - 1960: Reed-Solomon (CD, QR codes)
// - 1998: Digital Fountain (rateless)
// - 2000s: LDPC (5G, Wi-Fi)
// - 2020: blockchain adoption
// - 2024: mainstream DA`}
        </pre>
        <p className="leading-7">
          EC: <strong>(n,k) coding, k pieces → recover from any k of n</strong>.<br />
          MDS (Reed-Solomon) vs Non-MDS (Fountain, LDPC).<br />
          blockchain DA + distributed storage의 핵심.
        </p>
      </div>
    </section>
  );
}
