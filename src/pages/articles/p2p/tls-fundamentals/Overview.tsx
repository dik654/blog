import TLSOverviewViz from './viz/TLSOverviewViz';

export default function Overview() {
  const features = [
    { metric: '1-RTT', desc: '풀 핸드셰이크', note: 'TLS 1.2 대비 절반' },
    { metric: '0-RTT', desc: 'PSK 재연결', note: '이전 세션 키 재사용' },
    { metric: 'AEAD', desc: '모던 암호만 허용', note: 'AES-GCM, ChaCha20' },
  ];

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요</h2>
      <div className="not-prose mb-8"><TLSOverviewViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          TLS(Transport Layer Security)는 전송 계층 보안 프로토콜입니다.
          <br />
          HTTPS, gRPC, QUIC 등 현대 프로토콜의 암호화 기반입니다.
          <br />
          TLS 1.3(RFC 8446)은 2018년 표준화되었으며, 이전 버전 대비 성능과 보안 모두 개선함.
        </p>
        <h3>TLS 1.2 대비 주요 변경</h3>
        <p className="leading-7">
          핸드셰이크 RTT가 2에서 1로 절반 감소함.
          <br />
          위험한 레거시 암호 스위트(RC4, DES, CBC 모드, SHA-1 MAC)를 전면 제거함.
          <br />
          정적 RSA 키 교환 제거 — ECDHE(Elliptic Curve Diffie-Hellman Ephemeral)만 허용.
          <br />
          모든 핸드셰이크 메시지가 ServerHello 이후 암호화됨.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 not-prose my-6">
        {features.map(({ metric, desc, note }) => (
          <div key={desc} className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 text-center">
            <p className="text-2xl font-mono font-bold text-indigo-400">{metric}</p>
            <p className="text-sm font-medium mt-1">{desc}</p>
            <p className="text-xs text-foreground/50 mt-0.5">{note}</p>
          </div>
        ))}
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          QUIC는 TLS 1.3을 전송 계층에 직접 통합함.
          <br />
          TLS 1.3을 이해하면 QUIC의 보안 모델이 자연스럽게 이해 가능.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">TLS 역사와 버전별 특징</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// TLS Version History
//
// SSL 2.0 (1995, Netscape): 취약점 많음, 폐기
// SSL 3.0 (1996): POODLE (2014), 폐기
// TLS 1.0 (1999, RFC 2246): BEAST 공격, 폐기
// TLS 1.1 (2006, RFC 4346): 주요 개선, 폐기 (2020)
// TLS 1.2 (2008, RFC 5246): 현재 호환성, 광범위
// TLS 1.3 (2018, RFC 8446): 현대 표준

// TLS 1.3 주요 개선:
//   - 1-RTT handshake (TLS 1.2 대비 RTT 절반)
//   - 0-RTT resumption (PSK)
//   - Legacy cipher 제거
//   - Key exchange 강제 ephemeral (FS)
//   - ServerHello 이후 모든 것 암호화

// 제거된 cipher suites (TLS 1.3):
//   ✗ RC4 (스트림 암호, 취약)
//   ✗ 3DES (구식)
//   ✗ SHA-1 MAC
//   ✗ CBC 모드 (BEAST, POODLE, Lucky13)
//   ✗ Static RSA key exchange (no FS)
//   ✗ Static DH key exchange
//   ✗ Export-grade crypto
//   ✗ Compression (CRIME)
//   ✗ Renegotiation

// 허용되는 것:
//   ✓ AES-GCM, ChaCha20-Poly1305 (AEAD)
//   ✓ ECDHE (forward secrecy)
//   ✓ RSA signatures, ECDSA, EdDSA

// 브라우저 지원:
//   Chrome 70 (2018)
//   Firefox 63 (2018)
//   Safari 12.1 (2019)
//   Edge 79 (2020)
//   → 2024: 95%+ 지원`}
        </pre>
      </div>
    </section>
  );
}
