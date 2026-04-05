import TLSKeyScheduleViz from './viz/TLSKeyScheduleViz';
import CodePanel from '@/components/ui/code-panel';

const keyCode = `// TLS 1.3 Key Schedule (RFC 8446 §7.1)
// HKDF-Extract(salt, IKM) → PRK
// HKDF-Expand-Label(Secret, Label, Context, Len) → 파생 키

// 1단계: Early Secret
Early Secret = HKDF-Extract(salt=0, IKM=PSK or 0)
  → binder_key          // PSK 바인더 검증
  → early_traffic_secret // 0-RTT 데이터 암호화

// 2단계: Handshake Secret
Handshake Secret = HKDF-Extract(salt=derived, IKM=ECDHE)
  → client_handshake_traffic_secret  // 클라이언트 핸드셰이크 키
  → server_handshake_traffic_secret  // 서버 핸드셰이크 키

// 3단계: Master Secret
Master Secret = HKDF-Extract(salt=derived, IKM=0)
  → client_application_traffic_secret  // 클라이언트 앱 데이터 키
  → server_application_traffic_secret  // 서버 앱 데이터 키
  → resumption_master_secret           // 다음 세션 PSK 파생`;

const annotations: { lines: [number, number]; color: 'sky' | 'emerald' | 'amber'; note: string }[] = [
  { lines: [5, 8], color: 'amber', note: 'Early Secret: PSK 기반, 0-RTT 키 파생' },
  { lines: [10, 13], color: 'sky', note: 'Handshake Secret: ECDHE 공유 비밀 투입' },
  { lines: [15, 20], color: 'emerald', note: 'Master Secret: 최종 애플리케이션 키 + 세션 재개용 PSK' },
];

export default function KeySchedule() {
  return (
    <section id="key-schedule" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">키 스케줄</h2>
      <div className="not-prose mb-8"><TLSKeyScheduleViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          TLS 1.3은 HKDF(HMAC-based Key Derivation Function) 기반으로 모든 키를 파생함.
          <br />
          단일 공유 비밀에서 Extract → Expand 2단계로 다수의 독립 키를 생성함.
          <br />
          키 파생 과정이 명확히 정의되어 구현 오류와 취약점 감소.
        </p>
        <h3>3단계 키 파생</h3>
        <p className="leading-7">
          Early Secret — PSK에서 파생. 0-RTT 데이터 암호화에 사용.
          <br />
          Handshake Secret — ECDHE 공유 비밀을 투입. 핸드셰이크 메시지 암호화.
          <br />
          Master Secret — 최종 단계. 애플리케이션 데이터 암호화 + 세션 재개용 PSK 생성.
        </p>
        <h3>Forward Secrecy(전방 비밀성)</h3>
        <p className="leading-7">
          ECDHE 임시 키는 핸드셰이크 후 즉시 폐기함.
          <br />
          서버의 장기 개인 키가 노출되어도 과거 세션의 트래픽 복호화 불가능.
          <br />
          TLS 1.2의 정적 RSA 키 교환에서는 이 보장이 없었음.
        </p>
        <h3>Key Update 메커니즘</h3>
        <p className="leading-7">
          애플리케이션 단계에서 KeyUpdate 메시지로 트래픽 키 갱신 가능.
          <br />
          기존 application_traffic_secret에서 새 키를 파생함.
          <br />
          장기 연결에서도 키 노출 위험을 최소화함.
        </p>
        <CodePanel title="TLS 1.3 Key Schedule — HKDF 파이프라인" code={keyCode}
          annotations={annotations} />

        <h3 className="text-xl font-semibold mt-6 mb-3">HKDF와 키 파생 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// HKDF (HMAC-based Key Derivation Function)
// RFC 5869
//
// 2 Functions:
//
// HKDF-Extract(salt, IKM) → PRK
//   PRK = HMAC(salt, IKM)  // Pseudo-Random Key
//   IKM = Input Keying Material
//
// HKDF-Expand(PRK, info, L) → OKM
//   OKM = T(1) || T(2) || ... || T(N)
//   T(i) = HMAC(PRK, T(i-1) || info || i)
//   L = desired output length

// HKDF-Expand-Label (TLS 1.3):
//   HKDFLabel struct:
//     length: 2 bytes
//     label: "tls13 " || protocol_label
//     context: transcript hash
//
//   Derived keys:
//     "tls13 derived"
//     "tls13 c hs traffic"
//     "tls13 s hs traffic"
//     "tls13 c ap traffic"
//     "tls13 s ap traffic"
//     "tls13 res master"

// Traffic Keys per direction:
//   key  = HKDF-Expand-Label(secret, "key", "", key_length)
//   iv   = HKDF-Expand-Label(secret, "iv", "", iv_length)
//   finished = HKDF-Expand-Label(secret, "finished", "", hash_length)

// Per-record nonce:
//   nonce_i = iv XOR be_to_le(counter_i)
//   counter incremented per record
//   → 재사용 없음 (AEAD 요구사항)

// Rekeying (Key Update):
//   New secret = HKDF-Expand-Label(
//       old_secret, "traffic upd", "", hash_length
//   )
//   → 새 key, iv 파생
//   → 장기 연결 보호`}
        </pre>
      </div>
    </section>
  );
}
