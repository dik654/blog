import KeyExchangeViz from './viz/KeyExchangeViz';

export default function KeyExchange() {
  return (
    <section id="key-exchange" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">키 교환: ECDH</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          안전하지 않은 채널에서 공유 비밀을 수립하는 프로토콜. DH(1976)가 원조, ECDH가 현대 표준.
        </p>
      </div>
      <div className="not-prose"><KeyExchangeViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Diffie-Hellman 원리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Diffie-Hellman Key Exchange (1976)
//
// 공개 파라미터:
//   p: 큰 소수
//   g: 원시근 (generator) of Z_p*
//
// Alice와 Bob의 키 교환:
//
// Alice:
//   1. 랜덤 a 선택 (비밀)
//   2. A = g^a mod p 계산
//   3. A를 Bob에게 전송 (공개 채널)
//   4. Bob으로부터 B 수신
//   5. 공유 비밀: s = B^a mod p
//
// Bob:
//   1. 랜덤 b 선택 (비밀)
//   2. B = g^b mod p 계산
//   3. B를 Alice에게 전송
//   4. Alice로부터 A 수신
//   5. 공유 비밀: s = A^b mod p
//
// 수학적 결과:
//   s_Alice = B^a = (g^b)^a = g^(ab) mod p
//   s_Bob   = A^b = (g^a)^b = g^(ab) mod p
//   → 같은 값 공유!
//
// 공격자 Eve:
//   - A, B, g, p 모두 관찰 가능
//   - a 또는 b를 구해야 s 계산 가능
//   - Discrete Logarithm Problem → 어려움

// ECDH (Elliptic Curve DH)
//
// 더 효율적 버전:
//   G: curve의 generator point
//   A = a·G (Alice's public)
//   B = b·G (Bob's public)
//   s = b·A = a·B = ab·G
//
// 장점:
//   - 같은 보안 수준에 키 길이 짧음
//   - RSA 3072-bit ≈ ECC 256-bit
//   - 계산 빠름

// 실무 적용:
//   - TLS 1.3 (key_share extension)
//   - Signal protocol (X3DH)
//   - SSH (curve25519-sha256)
//   - WireGuard VPN

// MitM 공격 방어:
//   DH 자체는 인증 없음
//   → 공격자가 중간에서 키 교체 가능
//   해결: 디지털 서명으로 pub key 인증
//         (TLS 인증서, PGP 등)

// Curve25519 예시:
//   Alice priv: 32 bytes random
//   Alice pub:  x25519(Alice priv, 9)
//   Bob priv:   32 bytes random
//   Bob pub:    x25519(Bob priv, 9)
//   Shared:     x25519(Alice priv, Bob pub)
//            =  x25519(Bob priv, Alice pub)`}
        </pre>
      </div>
    </section>
  );
}
