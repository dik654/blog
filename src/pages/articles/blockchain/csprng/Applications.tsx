export default function Applications() {
  const items = [
    {
      name: 'Schnorr / Sigma 프로토콜',
      desc: '커밋 r, 챌린지 e 모두 CSPRNG에서 생성. r이 예측 가능하면 비밀키 x가 노출된다.',
      color: 'indigo',
      href: '/crypto/zk-theory#sigma-protocol',
    },
    {
      name: 'TLS 핸드셰이크',
      desc: '세션키 협상 시 클라이언트/서버 랜덤 32바이트. 예측 가능하면 세션 탈취.',
      color: 'emerald',
    },
    {
      name: '지갑 개인키 생성',
      desc: 'BIP-39 니모닉, secp256k1 개인키 모두 CSPRNG 의존. 엔트로피 부족 시 자산 탈취.',
      color: 'amber',
    },
    {
      name: 'Nonce 생성',
      desc: 'ECDSA, EdDSA 서명의 nonce가 재사용 또는 예측되면 개인키 복원 가능 (Sony PS3 해킹 사례).',
      color: 'indigo',
    },
  ];

  return (
    <section id="applications" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">암호학에서의 사용</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          암호 프로토콜의 모든 비밀값은 CSPRNG에서 생성된다.
          <br />
          랜덤이 깨지면 알고리즘 자체의 수학적 안전성과 무관하게 시스템 전체가 무너진다.
        </p>
      </div>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map(p => (
          <div key={p.name} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
            <p className={`font-semibold text-sm text-${p.color}-400`}>
              {p.href ? <a href={p.href} className="hover:underline">{p.name} →</a> : p.name}
            </p>
            <p className="text-sm mt-1.5 text-foreground/75">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">ECDSA Nonce 재사용 취약점</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// ECDSA Nonce Reuse Attack
//
// ECDSA 서명:
//   1. k ← random (nonce)
//   2. R = k·G, r = R.x mod n
//   3. s = k⁻¹·(hash(m) + r·priv) mod n
//   4. signature = (r, s)
//
// Nonce 재사용 시 (같은 k로 2개 서명):
//   s1 = k⁻¹·(h1 + r·priv) mod n
//   s2 = k⁻¹·(h2 + r·priv) mod n
//
// 두 식 빼면:
//   s1 - s2 = k⁻¹·(h1 - h2) mod n
//   k = (h1 - h2) / (s1 - s2) mod n
//
// k를 알면 priv 복원:
//   priv = (s1·k - h1) / r mod n
//
// → 완전한 개인키 복원!

// 실제 사례:
//
// 1. Sony PS3 (2010)
//    - ECDSA firmware 서명
//    - 모든 서명에 같은 k 사용 (!)
//    - Master signing key 복원됨
//    - Custom firmware 가능
//
// 2. Bitcoin Android Wallet (2013)
//    - SecureRandom 버그
//    - Nonce 재사용
//    - 여러 지갑 도난
//
// 3. Blockchain 거래 분석
//    - 수백 BTC 계좌에서
//    - 반복되는 nonce 발견
//    - 지속적 자금 도난

// Deterministic ECDSA (RFC 6979):
//   k = HMAC(priv, hash(m))
//   - nonce를 메시지와 priv로 도출
//   - RNG 불필요
//   - 재사용 불가능
//
// 현대 권장:
//   - Ed25519 (deterministic by design)
//   - RFC 6979 ECDSA
//   - Schnorr signatures

// 기타 랜덤 실패:
//
// 1. Debian OpenSSL (2008)
//    - Valgrind warning 제거 → entropy 0
//    - PID만으로 키 생성
//    - 수백만 SSH/SSL 키 교체
//
// 2. Dual_EC_DRBG backdoor (2013)
//    - NSA가 P, Q 파라미터 선택
//    - 출력 예측 가능 의혹
//    - RSA가 $10M에 사용 권고
//
// 3. Infineon ROCA (2017)
//    - RSA 키 생성 취약
//    - Estonian IDs 이동 필요
//    - 10억 키 영향`}
        </pre>
      </div>
    </section>
  );
}
