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
      </div>
    </section>
  );
}
