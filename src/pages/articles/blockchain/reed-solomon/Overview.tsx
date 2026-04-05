import Math from '@/components/ui/math';

export default function Overview() {
  const useCases = [
    { name: 'CD / DVD', desc: '스크래치로 손상된 비트를 자동 복구한다', color: 'indigo' },
    { name: 'QR 코드', desc: '일부가 가려져도 원본 데이터를 복원한다', color: 'emerald' },
    { name: '심우주 통신', desc: 'Voyager, Mars Rover 등 NASA 탐사선이 수십억 km 너머로 데이터를 전송할 때 사용한다', color: 'amber' },
    { name: 'ZKP (STARK)', desc: '다항식 차수 바운드 검증에 Reed-Solomon 근접성 테스트(FRI)를 사용한다', color: 'indigo' },
  ];

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Reed-Solomon이란?</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">동기: 데이터 전송과 오류</h3>
        <p>
          통신 채널은 완벽하지 않다. 우주 방사선, 디스크 스크래치, 네트워크 잡음 — 전송 중 데이터가 깨질 수 있다.
          <br />
          단순히 데이터를 두 번 보내면 어디가 틀렸는지 알 수 없다.
          <br />
          세 번 보내면 다수결로 복구할 수 있지만, 대역폭을 3배 소모한다
        </p>
        <p>
          Reed-Solomon 부호는 <strong>수학적으로 최소한의 중복</strong>만 추가하여
          오류를 감지하고 복구하는 방법이다
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">핵심 아이디어</h3>
        <p>
          차수 <Math>{'d'}</Math>인 다항식은 <Math>{'d+1'}</Math>개의 점으로 유일하게 결정된다.
          <br />
          이것이{' '}
          <a href="/crypto/lagrange" className="text-indigo-400 hover:underline">Lagrange 보간</a>의 핵심이다
        </p>
        <p>
          메시지가 <Math>{'k'}</Math>개 심볼이면, 이를 차수 <Math>{'k-1'}</Math> 다항식의 계수로 삼는다.
          <br />
          이 다항식을 <Math>{'n > k'}</Math>개 점에서 평가하면 <Math>{'n'}</Math>개의 값(코드워드)을 얻는다.
          <br />
          <Math>{'n - k'}</Math>개의 추가 값이 중복(redundancy)이다 — 이것으로 오류를 감지하고 복구한다
        </p>
        <Math display>{'k \\text{개 메시지} \\xrightarrow{\\text{다항식 평가}} n \\text{개 코드워드} \\quad (n - k \\text{개 중복})'}</Math>
      </div>

      <h3 className="text-lg font-semibold mt-8 mb-3">어디에 쓰이는가?</h3>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3">
        {useCases.map(p => (
          <div key={p.name} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
            <p className={`font-semibold text-sm text-${p.color}-400`}>{p.name}</p>
            <p className="text-sm mt-1.5 text-foreground/75">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Reed-Solomon 역사와 개발</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Reed-Solomon Code History
//
// 1960: Irving Reed & Gustave Solomon
//   MIT Lincoln Lab
//   "Polynomial codes over certain finite fields"
//   원 논문은 다항식 평가 관점
//
// 1969: Berlekamp algorithm
//   실용적 decoding 가능
//
// 1975: Welch-Berlekamp algorithm
//   더 효율적 decoding
//   O(n²) time complexity
//
// 1986: Voyager 2 Uranus flyby
//   NASA가 RS coding 사용
//   3.2 billion km 떨어진 데이터 복원
//
// 1990s: CD/DVD standardization
//   모든 optical media 표준
//   CIRC (Cross-Interleaved RS)
//
// 2000s: Wireless communications
//   DVB-T, DAB, 802.11
//   QR codes (2000)
//
// 2018: STARKs (Ben-Sasson et al.)
//   RS code의 "proximity testing"
//   FRI protocol 기반
//   → Modern ZK systems

// 수학적 기반:
//
// Reed-Solomon code RS(n, k, d):
//   n: codeword length
//   k: message length
//   d: minimum distance = n - k + 1
//   → MDS (Maximum Distance Separable)
//
// Error correction capability:
//   t = ⌊(d-1)/2⌋ = ⌊(n-k)/2⌋ errors
//   Erasure correction: up to n-k erasures
//
// Field selection:
//   RS over F_p where p > n
//   Common: F_{2^8} (bytes), F_p for p ~ 2^256 (ZK)

// 알고리즘 진화:
//
//   Decoding algorithms:
//     Berlekamp-Massey: O(n²)
//     Euclidean algorithm: O(n²)
//     Guruswami-Sudan (list decoding): O(n^4)
//     Koetter-Vardy: soft decoding
//
//   Encoding:
//     Systematic: easier decoding
//     Non-systematic: all-polynomial

// 응용별 설정:
//
//   CD audio:
//     RS(32, 28) + RS(28, 24)
//     Cross-interleaved
//     Handle 4000+ bit burst errors
//
//   QR Code:
//     Multiple RS codes per block
//     L (7%), M (15%), Q (25%), H (30%)
//
//   Voyager:
//     RS(255, 223)
//     Concatenated with convolutional code
//     Can recover 16 symbol errors`}
        </pre>
      </div>
    </section>
  );
}
