import ProtocolCompareViz from './viz/ProtocolCompareViz';
import CodePanel from '@/components/ui/code-panel';

const swimCode = `// SWIM: Scalable Weakly-consistent Infection-style Membership
// 1. Probe(핑) — 주기적으로 랜덤 노드에 ping 전송
// 2. Indirect Probe — ping 실패 시 다른 노드를 통해 간접 확인
// 3. Suspect → Dead — 응답 없으면 의심(suspect) → 일정 시간 후 dead
// 4. Piggybacking — 멤버십 변경을 일반 메시지에 부착해 전파

// HyParView: Hybrid Partial View
// 1. Active View — 직접 TCP 연결 유지 (소수, 예: 5개)
// 2. Passive View — 백업 후보 목록 (다수, 예: 30개)
// 3. Shuffle — 주기적으로 Active/Passive 뷰 교환
// 4. 장점: Active View는 안정적, Passive View로 복구 빠름

// PlumTree: Push-Lazy-Push Multicast Tree
// 1. Eager Push — 스패닝 트리 위 즉시 전달
// 2. Lazy Push — 트리 외 이웃에게 메타데이터(IHAVE)만 전달
// 3. 트리 복구 — 메시지 누락 시 lazy 이웃에게 IWANT로 요청`;

const swimAnnotations: { lines: [number, number]; color: 'sky' | 'emerald' | 'amber'; note: string }[] = [
  { lines: [1, 5], color: 'sky', note: 'SWIM — 장애 감지 + 피기백 전파' },
  { lines: [7, 11], color: 'emerald', note: 'HyParView — Active/Passive 이중 뷰' },
  { lines: [13, 16], color: 'amber', note: 'PlumTree — Eager+Lazy 이중 전략' },
];

export default function Protocols() {
  return (
    <section id="protocols" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SWIM & HyParView</h2>
      <div className="not-prose mb-8"><ProtocolCompareViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Gossip 프로토콜은 멤버십 관리와 메시지 전파를 동시에 해결합니다.<br />
          SWIM은 장애 감지에, HyParView는 오버레이 관리에, PlumTree는 효율적 브로드캐스트에 특화됩니다.
        </p>
        <CodePanel title="주요 Gossip 프로토콜" code={swimCode}
          annotations={swimAnnotations} />
      </div>
    </section>
  );
}
