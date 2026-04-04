import TLSRecordViz from './viz/TLSRecordViz';
import CodePanel from '@/components/ui/code-panel';

const recordCode = `// TLS 1.3 Record 구조 (RFC 8446 §5.1)
struct TLSCiphertext {
    content_type: u8,          // 항상 0x17 (application_data로 위장)
    legacy_version: [u8; 2],   // 0x0303 (TLS 1.2로 위장 — 미들박스 호환)
    length: u16,               // Fragment + Auth Tag 길이
    encrypted_record: Vec<u8>, // AEAD 암호화된 페이로드
}

// AEAD 암호화: Encrypt(key, nonce, plaintext, AAD)
//   plaintext = content + content_type(1B) + padding(0+B)
//   AAD = record_header (5 bytes)
//   Auth Tag = 16 bytes (무결성 검증)

// 지원 AEAD 스위트:
//   TLS_AES_128_GCM_SHA256        — 가장 범용
//   TLS_AES_256_GCM_SHA384        — 높은 보안
//   TLS_CHACHA20_POLY1305_SHA256  — ARM/모바일 최적화`;

const annotations: { lines: [number, number]; color: 'sky' | 'emerald' | 'amber'; note: string }[] = [
  { lines: [2, 7], color: 'sky', note: '레코드 구조: 실제 content_type은 암호화 내부에 숨김' },
  { lines: [9, 12], color: 'emerald', note: 'AEAD: 암호화 + 인증을 단일 연산으로 수행' },
  { lines: [14, 17], color: 'amber', note: 'TLS 1.3은 AEAD만 허용 — CBC, RC4 등 제거' },
];

export default function RecordProtocol() {
  return (
    <section id="record-protocol" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">레코드 프로토콜</h2>
      <div className="not-prose mb-8"><TLSRecordViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          TLS 1.3의 레코드 프로토콜은 AEAD(Authenticated Encryption with Associated Data)만 사용함.
          <br />
          암호화와 무결성 인증을 단일 연산으로 동시 수행함.
          <br />
          TLS 1.2에서 허용되던 MAC-then-Encrypt(CBC 모드) 방식은 완전히 제거됨.
        </p>
        <h3>레코드 구조</h3>
        <p className="leading-7">
          모든 레코드의 외부 content_type은 0x17(application_data)로 고정함.
          <br />
          실제 content_type은 암호화된 페이로드 내부에 포함 — 트래픽 유형 은닉.
          <br />
          legacy_version은 0x0303(TLS 1.2)으로 설정 — 미들박스 호환성 유지.
        </p>
        <h3>Padding</h3>
        <p className="leading-7">
          레코드 끝에 0바이트 이상의 패딩 추가 가능.
          <br />
          실제 메시지 크기를 은닉하여 트래픽 분석(traffic analysis) 공격 방어.
          <br />
          패딩은 암호화 내부에 포함되므로 외부에서 구분 불가능.
        </p>
        <CodePanel title="TLS 1.3 레코드 & AEAD 구조" code={recordCode}
          annotations={annotations} />
      </div>
    </section>
  );
}
