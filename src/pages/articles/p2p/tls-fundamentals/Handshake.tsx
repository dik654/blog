import TLSHandshakeViz from './viz/TLSHandshakeViz';
import CodePanel from '@/components/ui/code-panel';

const handshakeCode = `// TLS 1.3 Full Handshake (RFC 8446)
Client                              Server
  |--- ClientHello ----------------->|  // 지원 암호 + key_share(ECDHE 공개값)
  |<-- ServerHello ------------------|  // 선택 암호 + key_share
  |<-- {EncryptedExtensions} --------|  // 암호화된 확장
  |<-- {Certificate} ----------------|  // 서버 인증서
  |<-- {CertificateVerify} ----------|  // 서명으로 인증서 소유 증명
  |<-- {Finished} -------------------|  // 핸드셰이크 무결성 MAC
  |--- {Finished} ------------------>|  // 클라이언트 확인
  |<========= 1-RTT 완료 ==========>|  // 양방향 암호화 데이터

// 0-RTT PSK Resumption
Client                              Server
  |--- ClientHello + early_data ---->|  // PSK + 0-RTT 데이터 동시 전송
  |<-- ServerHello + {Finished} -----|  // 서버 응답
  |<========= 0-RTT 완료 ==========>|  // 첫 패킷부터 데이터 포함`;

const annotations: { lines: [number, number]; color: 'sky' | 'emerald' | 'amber'; note: string }[] = [
  { lines: [2, 8], color: 'sky', note: '1-RTT: key_share로 첫 메시지에 DH 파라미터 포함' },
  { lines: [9, 11], color: 'emerald', note: '{}는 암호화된 메시지를 의미' },
  { lines: [14, 17], color: 'amber', note: '0-RTT: PSK로 재연결 시 즉시 데이터 전송' },
];

export default function Handshake() {
  return (
    <section id="handshake" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">핸드셰이크 흐름</h2>
      <div className="not-prose mb-8"><TLSHandshakeViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          TLS 1.3은 1-RTT 풀 핸드셰이크를 기본으로 함.
          <br />
          ClientHello에 key_share 확장을 포함하여 첫 메시지에서 ECDHE 공개값을 전송함.
          <br />
          TLS 1.2는 키 교환을 별도 라운드에서 수행하므로 2-RTT가 필요했음.
        </p>
        <h3>ECDHE 키 교환</h3>
        <p className="leading-7">
          양측이 임시(ephemeral) 키 쌍을 생성하여 교환함.
          <br />
          공유 비밀(shared secret)은 양측의 개인 키와 상대방 공개 키로 계산함.
          <br />
          임시 키이므로 세션마다 새 키 생성 — Forward Secrecy 보장.
        </p>
        <h3>0-RTT PSK 재연결</h3>
        <p className="leading-7">
          이전 세션에서 협상된 PSK(Pre-Shared Key)를 보관함.
          <br />
          재연결 시 ClientHello와 함께 early_data를 즉시 전송 가능.
          <br />
          단, 0-RTT 데이터는 재전송 공격(replay attack)에 취약함.
          <br />
          서버는 멱등(idempotent) 요청에만 0-RTT를 허용해야 함.
        </p>
        <CodePanel title="TLS 1.3 핸드셰이크 메시지 흐름" code={handshakeCode}
          annotations={annotations} />
      </div>
    </section>
  );
}
