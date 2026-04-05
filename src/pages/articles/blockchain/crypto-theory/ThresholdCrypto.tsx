import ThresholdViz from './viz/ThresholdViz';

export default function ThresholdCrypto() {
  return (
    <section id="threshold-crypto" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">비밀 분산 & 임계값 서명</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Shamir(1979) — 비밀을 여러 share로 분산하여 t개 이상 모여야 복원. 단일 장애점 제거.
        </p>
      </div>
      <div className="not-prose"><ThresholdViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Shamir's Secret Sharing</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Shamir's Secret Sharing (SSS, 1979)
//
// 목표: 비밀 s를 n개 share로 분산
//   t개 이상 모이면 s 복원
//   t-1개 이하면 s에 대한 정보 0
//
// 원리: Polynomial interpolation
//
// Sharing:
//   1. t-1 차 다항식 생성
//      f(x) = s + a_1·x + a_2·x² + ... + a_{t-1}·x^(t-1)
//      (a_i는 랜덤 계수)
//
//   2. n개 share 생성
//      share_i = (i, f(i)) for i = 1..n
//
//   3. f(0) = s (비밀)
//
// Reconstruction:
//   t개의 (x, y) 점으로 라그랑주 보간
//   f(0) = Σ y_i · L_i(0)
//
//   여기서 L_i는 라그랑주 기저 다항식:
//   L_i(x) = ∏_{j≠i} (x - x_j)/(x_i - x_j)
//
// 예시 (t=3, n=5):
//   s = 100 (비밀)
//   f(x) = 100 + 5x + 2x²
//   shares:
//     (1, 107), (2, 118), (3, 133),
//     (4, 152), (5, 175)
//
//   3개 모으면 복원 가능
//   2개만 있으면 무한한 f(x) 가능

// 보안 특성:
//   - t-1개 share = 정보 이론적으로 0
//   - One-time pad 수준 안전
//   - Modular arithmetic으로 실제 구현

// Threshold Signatures
//
// 아이디어: 비밀 키를 SSS로 분산 → 서명도 분산 계산
//
// 프로토콜 예시:
//   1. Key Generation (DKG):
//      - Distributed Key Generation
//      - 아무도 full priv key 보지 못함
//      - 각자 share만 보유
//
//   2. Signing:
//      - t개 참여자가 partial sig 생성
//      - Combine → full signature
//      - verifier는 표준 검증만 수행
//
//   3. 외부에서 보면 일반 서명과 동일

// 주요 구현:
//   - Threshold BLS: 가장 단순
//   - FROST: threshold Schnorr
//   - GG18/GG20: threshold ECDSA
//   - DKLs19, CCLST20: 최신 프로토콜

// 실무 사용:
//   - MPC Wallets (Fireblocks, ZenGo, Coinbase)
//   - Validator key management
//   - Multi-sig wallet 대체
//   - HSM 분산화

// MPC Wallet 장점:
//   - Single point of failure 제거
//   - Seed phrase 보관 불필요
//   - Key rotation 가능
//   - 더 나은 UX (외부에선 일반 서명)`}
        </pre>
      </div>
    </section>
  );
}
