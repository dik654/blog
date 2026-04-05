import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function PeerScoring({ onCodeRef }: Props) {
  return (
    <section id="peer-scoring" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">피어 스코어링</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Prysm은 4가지 스코어러를 합산해 피어 품질을 평가한다.<br />
          점수가 임계값 이하로 떨어지면 연결을 끊고 IP를 블랙리스트에 추가한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('peer-score', codeRefs['peer-score'])} />
          <span className="text-[10px] text-muted-foreground self-center">Score()</span>
          <CodeViewButton onClick={() => onCodeRef('peer-decay', codeRefs['peer-decay'])} />
          <span className="text-[10px] text-muted-foreground self-center">Decay()</span>
        </div>

        {/* ── GossipSub 스코어 파라미터 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">GossipSub Peer Score — 7가지 지표</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// pubsub.PeerScoreParams에서 설정되는 토픽별 점수

type TopicScoreParams struct {
    // 1. First message deliveries (긍정적)
    // 해당 토픽에서 내가 처음 메시지를 전달받은 횟수
    FirstMessageDeliveriesWeight   float64  // 1.0
    FirstMessageDeliveriesDecay    float64  // 0.999
    FirstMessageDeliveriesCap      float64  // 1000.0

    // 2. Mesh message deliveries (긍정적)
    // mesh peer가 정상 전달하는 빈도
    MeshMessageDeliveriesWeight    float64  // -0.5 (목표 미달 시 감점)
    MeshMessageDeliveriesDecay     float64  // 0.997
    MeshMessageDeliveriesThreshold float64  // 53.0 (목표 delivery 수)
    MeshMessageDeliveriesWindow    Duration // 2 seconds
    MeshMessageDeliveriesActivation Duration // 4 seconds

    // 3. Mesh failure penalty (부정적)
    // mesh에서 쫓아낸 피어 (악의적 동작)
    MeshFailurePenaltyWeight       float64  // -0.5
    MeshFailurePenaltyDecay        float64  // 0.997

    // 4. Invalid messages (부정적, 가장 강력)
    // 검증 실패 메시지 전송
    InvalidMessageDeliveriesWeight float64  // -80.0
    InvalidMessageDeliveriesDecay  float64  // 0.99

    // 5. Time in mesh (긍정적)
    TimeInMeshWeight               float64  // 0.0333
    TimeInMeshQuantum              Duration // 12 seconds (slot)
    TimeInMeshCap                  float64  // 300.0
}

// 이더리움 토픽별 파라미터 맞춤:
// - beacon_block: 엄격 (블록 전파 중요)
// - beacon_attestation_{0-63}: 완화 (자주 발생)
// - voluntary_exit, proposer_slashing: 느슨 (희귀)`}
        </pre>
        <p className="leading-7">
          GossipSub 스코어가 <strong>토픽별 정밀 조정</strong>.<br />
          invalid message는 -80 가중치로 강력 처벌 → 악의적 피어 즉시 배제.<br />
          decay로 시간 지나면 점수 회복 → 일시적 장애 용서.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">스코어 구성</h3>
        <ul>
          <li><strong>Gossip Score</strong> — 토픽별 메시지 전달 품질</li>
          <li><strong>Block Provider</strong> — 블록 응답 속도 및 정확도</li>
          <li><strong>Peer Status</strong> — 체인 헤드·Finalized 에폭 일치도</li>
          <li><strong>Bad Response</strong> — 잘못된 응답 횟수 기반 감점</li>
        </ul>

        {/* ── 실제 구현 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Prysm 4-scorer 아키텍처</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// beacon-chain/p2p/peers/scorers/
type Service struct {
    gossipScorer     *GossipScorer      // GossipSub 스코어
    blockProvider    *BlockProviderScorer
    peerStatusScorer *PeerStatusScorer
    badResponses     *BadResponsesScorer
}

// 1. GossipScorer: libp2p pubsub 점수 래퍼
//    - 위 7가지 지표 통합
//    - 주기적 스냅샷

// 2. BlockProviderScorer: 블록 응답 품질
//    - beacon_blocks_by_range 요청 성공률
//    - 응답 속도 (ms)
//    - 정확도 (올바른 블록 반환 여부)

// 3. PeerStatusScorer: 체인 헤드 일치도
//    - 피어의 status 메시지 기반
//    - head_root 일치 여부
//    - finalized_epoch 근접도

// 4. BadResponsesScorer: 잘못된 응답 카운터
//    - protocol violation 감지
//    - SSZ 디코딩 오류
//    - timeout 초과

// 합산 Score:
func (s *Service) Score(pid peer.ID) float64 {
    return s.gossipScorer.Score(pid) +
           s.blockProvider.Score(pid) +
           s.peerStatusScorer.Score(pid) +
           s.badResponses.Score(pid)
}

// 임계값 기반 행동:
// Score > 0:     정상 피어
// -100 < S < 0:  관찰 대상
// Score < -100:  연결 해제 + ban (30분)
// Score < -500:  IP 블랙리스트 (1시간)`}
        </pre>
        <p className="leading-7">
          Prysm은 <strong>4개 독립 scorer 합산</strong> 방식.<br />
          각 지표가 다른 측면 평가 → 종합적 피어 품질 측정.<br />
          임계값별 차등 제재로 오버엔지니어링 방지.
        </p>

        {/* ── Decay 메커니즘 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">지수 감쇠 (Decay) — 자가 치유</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 주기적으로 모든 점수에 decay 적용
// new_score = old_score * decay_factor

// 이더리움 스펙 decay 간격: 1 slot (12초)
// decay factor 예시:
// - FirstMessageDeliveries: 0.999 (매우 느린 감쇠)
// - MeshMessageDeliveries: 0.997
// - InvalidMessageDeliveries: 0.99 (빠른 감쇠, 복구 가능)

// 계산 예시: InvalidMessage 1회 후 시간 경과:
// t=0:  score -80
// t=12s (1 slot): -80 × 0.99 = -79.2
// t=2min (10 slot): -80 × 0.99^10 ≈ -72.3
// t=10min: -80 × 0.99^50 ≈ -48.5
// t=1h: -80 × 0.99^300 ≈ -4.0 (거의 회복)

// Decay 주기:
func (s *Service) DecayLoop() {
    ticker := time.NewTicker(SECONDS_PER_SLOT)
    for range ticker.C {
        s.ApplyDecay()
    }
}

func (s *Service) ApplyDecay() {
    for pid, score := range s.scores {
        s.scores[pid] = score * s.decayFactor
    }
}

// Decay의 목적:
// 1. 일시적 장애 용서: 네트워크 glitch → 영구 불이익 방지
// 2. 회복 인센티브: 정상 동작 시 자연 점수 회복
// 3. 메모리 누수 방지: 오래된 점수는 0으로 수렴`}
        </pre>
        <p className="leading-7">
          <strong>지수 감쇠</strong>가 자가 치유 메커니즘 — 일시적 장애에서 자연 복구.<br />
          매 slot(12초)마다 decay → 1시간 후 -80 → -4 (정상 복귀).<br />
          영구 ban 방지 + 정상 동작 인센티브.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 지수 감쇠 설계</strong> — Decay()가 주기적으로 호출되어 오래된 점수를 지수적으로 감쇠.<br />
          일시적 장애(네트워크 불안정 등)로 인한 영구 불이익을 방지.<br />
          정상 복귀한 피어가 자연스럽게 점수를 회복하는 자가 치유 메커니즘.
        </p>
      </div>
    </section>
  );
}
