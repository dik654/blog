import CSPRNGFlowViz from './viz/CSPRNGFlowViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CSPRNG란?</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          컴퓨터는 결정론적(deterministic) 기계이므로 "진짜 랜덤"을 만들 수 없다.
          <br />
          일반 난수생성기(PRNG)는 시드를 알면 출력을 예측할 수 있어 암호학에서는 치명적이다.
          <br />
          암호학적 난수생성기(CSPRNG)는 출력을 관찰해도 다음 값을 예측할 수 없도록
          설계된 특수한 PRNG로, 모든 암호 프로토콜의 안전성 기반이다.
        </p>
      </div>
      <div className="not-prose"><CSPRNGFlowViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">CSPRNG 안전성 요건</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// CSPRNG (Cryptographically Secure PRNG) 요건
//
// 1. Next-Bit Test (Yao, 1982)
//    첫 k bits 관찰해도 k+1번째 bit 예측 불가
//    공격자 우위 = 1/2 + negligible
//
// 2. Forward Secrecy
//    현재 상태 알아도 과거 출력 복원 불가
//    State 전환 함수가 one-way
//
// 3. Backward Secrecy (Recovery)
//    과거 상태가 compromised 되어도
//    reseeding 후 새 출력 안전
//
// 4. Indistinguishability
//    CSPRNG 출력과 진짜 random 구분 불가
//    (계산적으로)

// PRNG vs CSPRNG:
//
// 일반 PRNG (rand()):
//   - Fast
//   - Predictable (시드 알면 복원)
//   - 용도: 시뮬레이션, 게임
//
// CSPRNG:
//   - Slower
//   - Unpredictable
//   - 용도: 암호 키, nonce, 토큰

// 주요 CSPRNG 알고리즘:
//
// 1. ChaCha20-based (Linux /dev/urandom)
//    - Fast, modern
//    - Stream cipher 기반
//    - Reseeding 지원
//
// 2. AES-CTR-DRBG (NIST SP 800-90A)
//    - Windows CNG 사용
//    - AES block cipher counter mode
//    - 표준화됨
//
// 3. Hash-DRBG
//    - SHA-256/512 기반
//    - 간단한 구조
//
// 4. HMAC-DRBG
//    - HMAC 기반
//    - 가장 보수적

// Dual_EC_DRBG 사건:
//   - NIST 표준 (2006)
//   - NSA backdoor 의혹 (2013)
//   - 2014년 폐기
//   → 알고리즘 선택의 중요성

// /dev/random vs /dev/urandom:
//   /dev/random: entropy 부족시 blocking
//   /dev/urandom: 항상 available (ChaCha20)
//   → 현대는 urandom 권장 (Linux 5.17+ 통합)`}
        </pre>
      </div>
    </section>
  );
}
