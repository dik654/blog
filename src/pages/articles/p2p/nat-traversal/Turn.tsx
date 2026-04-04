import TURNViz from './viz/TURNViz';
import CodePanel from '@/components/ui/code-panel';

const turnCode = `// TURN 릴레이 흐름 (RFC 5766)
// Symmetric NAT처럼 직접 연결 불가 시 사용

// 1. Allocate Request
//    클라이언트 → TURN 서버: 릴레이 주소 할당 요청
//    TURN 서버: 릴레이 주소(Relayed Address) 할당

// 2. 권한 설정
//    클라이언트 → TURN: CreatePermission (상대 피어 IP 허용)

// 3. 데이터 중계
//    A → TURN → B: Send/Data indication 또는 Channel 바인딩
//    모든 트래픽이 TURN 서버를 경유

// 단점: 대역폭 비용, 지연 증가 (2x RTT)
// → 가능하면 STUN + Hole Punching으로 직접 연결 선호`;

const turnAnnotations: { lines: [number, number]; color: 'sky' | 'emerald' | 'amber'; note: string }[] = [
  { lines: [3, 6], color: 'sky', note: 'Allocate — 릴레이 주소 획득' },
  { lines: [8, 9], color: 'emerald', note: 'Permission — 상대 피어 허용' },
  { lines: [11, 15], color: 'amber', note: '모든 트래픽 중계 — 비용 발생' },
];

export default function Turn() {
  return (
    <section id="turn" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TURN: 릴레이</h2>
      <div className="not-prose mb-8"><TURNViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          TURN(Traversal Using Relays around NAT)은 직접 연결 불가 시 중계 서버를 사용합니다.<br />
          Symmetric NAT처럼 홀 펀칭이 불가능한 환경에서 마지막 수단입니다.<br />
          모든 트래픽이 서버를 경유하므로 대역폭 비용과 지연이 발생합니다.
        </p>
        <CodePanel title="TURN 릴레이 프로토콜" code={turnCode}
          annotations={turnAnnotations} />
        <p className="leading-7">
          iroh에서는 DERP(Designated Encrypted Relay for Packets) 서버가 TURN 역할을 합니다.<br />
          libp2p에서는 Circuit Relay v2가 동일한 릴레이 기능을 제공합니다.
        </p>
      </div>
    </section>
  );
}
