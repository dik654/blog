import STUNViz from './viz/STUNViz';
import CodePanel from '@/components/ui/code-panel';

const stunCode = `// STUN 바인딩 요청 (RFC 5389)
// 1. 클라이언트 → STUN 서버: Binding Request
//    - Message Type: 0x0001
//    - Transaction ID: 96-bit 랜덤
//
// 2. STUN 서버 → 클라이언트: Binding Response
//    - XOR-MAPPED-ADDRESS: 서버가 본 클라이언트의 공인 IP:포트
//    - 이 주소가 "서버 반사 후보(Server Reflexive Candidate)"
//
// NAT 타입 판별:
//   - 두 STUN 서버에 요청 → 같은 매핑이면 Cone NAT
//   - 다른 매핑이면 Symmetric NAT
//   - Symmetric NAT에서는 STUN만으로 홀 펀칭 불가 → TURN 필요`;

const stunAnnotations: { lines: [number, number]; color: 'sky' | 'emerald' | 'amber'; note: string }[] = [
  { lines: [1, 4], color: 'sky', note: 'Binding Request — 가벼운 UDP 패킷' },
  { lines: [6, 8], color: 'emerald', note: 'XOR-MAPPED-ADDRESS — NAT 외부 주소 발견' },
  { lines: [10, 13], color: 'amber', note: 'NAT 타입 판별 — Symmetric 여부 확인' },
];

export default function Stun() {
  return (
    <section id="stun" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">STUN: 바인딩 요청</h2>
      <div className="not-prose mb-8"><STUNViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          STUN(Session Traversal Utilities for NAT)은 NAT 외부 주소를 발견하는 프로토콜입니다.<br />
          클라이언트가 STUN 서버에 바인딩 요청을 보내면,
          서버는 관측한 공인 IP:포트를 응답합니다.<br />
          이 주소를 <strong>서버 반사 후보(Server Reflexive Candidate)</strong>라 합니다.
        </p>
        <CodePanel title="STUN 프로토콜 흐름" code={stunCode}
          annotations={stunAnnotations} />
        <p className="leading-7">
          iroh는 기본 STUN 서버를 운영하며 자동으로 NAT 외부 주소를 발견합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">STUN 메시지 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// STUN Message (RFC 5389) 바이너리 포맷
//
// ┌──────────────────────────────────┐
// │ 2: 0 0 | 14: Message Type        │  (16 bits)
// ├──────────────────────────────────┤
// │ 16: Message Length               │  (16 bits)
// ├──────────────────────────────────┤
// │ 32: Magic Cookie (0x2112A442)    │  (32 bits)
// ├──────────────────────────────────┤
// │ 96: Transaction ID               │  (96 bits)
// ├──────────────────────────────────┤
// │ Attributes (TLV format)          │
// └──────────────────────────────────┘
//
// Message Types:
//   0x0001: Binding Request
//   0x0101: Binding Response (Success)
//   0x0111: Binding Error
//
// Common Attributes:
//   0x0001: MAPPED-ADDRESS (obsolete)
//   0x0020: XOR-MAPPED-ADDRESS
//   0x0006: USERNAME
//   0x0008: MESSAGE-INTEGRITY
//   0x0022: SOFTWARE
//   0x8022: SOFTWARE (comprehension-optional)

// XOR-MAPPED-ADDRESS 계산:
//   Original:  IPv4=203.0.113.5, Port=40000
//   Magic Cookie: 0x2112A442
//
//   XOR된 Port:
//     40000 ^ (0x2112A442 >> 16) = 40000 ^ 0x2112
//
//   XOR된 IP:
//     203.0.113.5 ^ 0x2112A442
//
//   Why XOR? Middlebox에서 IP 변환 방지
//   (일부 NAT가 패킷 내부 IP 자동 변환)

// STUN 서버 예시:
//   stun.l.google.com:19302 (Google)
//   stun1.l.google.com:19302
//   stun.ekiga.net:3478
//   stun.schlund.de:3478
//
// 사용 예 (Rust):
//   use stun_coder::StunPacket;
//   let req = StunPacket::binding_request();
//   socket.send_to(&req.encode(), stun_server)?;
//   let resp = recv_response();
//   println!("External: {}", resp.mapped_addr());

// 주의사항:
//   - STUN은 UDP 기반 (TCP 버전도 있음)
//   - NAT timeout: 30~60s (매핑 유지)
//   - Keep-alive: 주기적 STUN 요청
//   - 방화벽 정책으로 차단 가능`}
        </pre>
      </div>
    </section>
  );
}
