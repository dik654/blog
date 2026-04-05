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

        <h3 className="text-xl font-semibold mt-6 mb-3">Gossip 공격과 방어</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Gossip 프로토콜 공격 벡터
//
// 1. Sybil Attack
//    공격: 많은 가짜 노드 생성 → 네트워크 장악
//    방어:
//      - Peer scoring
//      - IP-based throttling
//      - Resource-based identity (PoW, PoS)
//      - Admission control
//
// 2. Eclipse Attack
//    공격: 피해자의 연결 모두 공격자로 변경
//    방어:
//      - Diverse peer selection
//      - Anchor peers
//      - Random walk
//
// 3. Message Flooding
//    공격: 대량 메시지 발송 → bandwidth 소진
//    방어:
//      - Rate limiting per peer
//      - Message size limits
//      - Scoring + blacklist
//
// 4. Invalid Message Injection
//    공격: 잘못된 서명/형식 메시지
//    방어:
//      - Validator hooks
//      - Invalid message penalty
//      - Topic-level validation
//
// 5. Censorship
//    공격: 특정 메시지 전파 차단
//    방어:
//      - Redundant paths (gossip)
//      - Self-healing mesh
//      - Flood publishing

// Ethereum Beacon Chain 사례:
//
//   Slashable offenses:
//     - Double vote (slashing)
//     - Surround vote (slashing)
//     → 메시지 전파 + slashing proof
//
//   Spam prevention:
//     - Per-topic message limits
//     - Attestation aggregation
//     - Gossipsub scoring
//
//   Network health:
//     - Mesh diameter 모니터링
//     - Topic coverage metrics
//     - Peer diversity checks

// 실무 튜닝:
//   D (fanout): 성능 vs 대역폭
//   Heartbeat: 빈도 vs 오버헤드
//   Scoring weights: false positive vs security
//   Cache TTL: memory vs dedup efficiency`}
        </pre>
      </div>
    </section>
  );
}
