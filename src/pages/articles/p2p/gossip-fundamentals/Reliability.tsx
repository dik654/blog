import ReliabilityViz from './viz/ReliabilityViz';
import CodePanel from '@/components/ui/code-panel';

const reliabilityCode = `// GossipSub 신뢰성 메커니즘

// 1. 메시지 중복 제거 (Deduplication)
//    msg_id = hash(message.data)
//    이미 본 msg_id → 무시 (seen 캐시, TTL 기반 만료)

// 2. Peer Scoring (v1.1)
//    Score(p) = Σ(topic_score) + app_score + ip_colocation
//    점수 < graylist_threshold → 메시에서 제외
//    점수 < 0 → 메시지 수신 거부

// 3. TTL & 전파 제한
//    heartbeat_interval = 1s  — 주기적 메시 유지보수
//    seen_ttl = 120s          — 중복 검사 캐시 수명
//    max_transmit = 3         — 동일 메시지 최대 전송 횟수

// 4. Flood Publishing
//    자기가 발행한 메시지는 메시 피어 전체에 즉시 전송
//    D와 무관하게 모든 메시 피어에 전달 (신뢰성 우선)`;

const relAnnotations: { lines: [number, number]; color: 'sky' | 'emerald' | 'amber'; note: string }[] = [
  { lines: [3, 5], color: 'sky', note: '중복 제거 — hash 기반 seen 캐시' },
  { lines: [7, 10], color: 'emerald', note: 'Peer Scoring — 악의적 노드 제외' },
  { lines: [12, 14], color: 'amber', note: 'TTL & 전파 제한 — 무한 루프 방지' },
];

export default function Reliability() {
  return (
    <section id="reliability" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">신뢰성 & 스코어링</h2>
      <div className="not-prose mb-8"><ReliabilityViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Gossip 프로토콜의 가장 큰 과제는 메시지 중복, 무한 루프, 악의적 노드 대응입니다.<br />
          GossipSub v1.1은 Peer Scoring으로 Sybil 공격을 방어하고,
          중복 제거와 TTL로 대역폭 낭비를 방지합니다.
        </p>
        <CodePanel title="GossipSub 신뢰성 메커니즘" code={reliabilityCode}
          annotations={relAnnotations} />
        <p className="leading-7">
          Ethereum Beacon Chain은 이 스코어링 시스템으로
          악의적 검증자의 메시지를 네트워크 레벨에서 차단합니다.
        </p>
      </div>
    </section>
  );
}
