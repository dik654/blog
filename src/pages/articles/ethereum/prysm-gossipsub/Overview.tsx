import ContextViz from './viz/ContextViz';
import GossipsubMeshViz from './viz/GossipsubMeshViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">GossipSub 프로토콜</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 GossipSub 토픽 구독, 메시 구성, 메시지 검증 파이프라인을 코드 수준으로 추적한다.
        </p>

        {/* ── GossipSub 개요 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">GossipSub — publish-subscribe 프로토콜</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// GossipSub 1.1 (Ethereum 2.0 채택)
// libp2p의 publish-subscribe 프로토콜

// 핵심 개념:
// - Topic: 메시지 채널 이름 (예: "beacon_block")
// - Mesh: 토픽당 peer 연결 그래프 (D=8 기본)
// - Gossip: mesh 외부 peer에게 메시지 ID만 광고
// - IWANT/IHAVE: 메시지 교환 프로토콜

// 동작 방식:
// 1. Publisher가 topic에 메시지 전송
// 2. mesh 내 peers에게 직접 forward
// 3. 각 peer가 자기 mesh에 re-forward → 지수 확산
// 4. 주기적으로 mesh 외부에도 IHAVE 광고
// 5. 필요한 peer가 IWANT로 요청 → 추가 전달

// 수학적 특성:
// - Propagation time: O(log N) (mesh 덕분에 빠름)
// - Bandwidth: O(D) per peer (mesh degree만큼)
// - 안정성: D_lo=6 유지 (최소 mesh 연결)

// Ethereum 2.0 사용 토픽:
// - beacon_block: 블록 전파 (슬롯당 1개)
// - beacon_attestation_{0-63}: 64 subnet attestation
// - beacon_aggregate_and_proof: 집계된 attestation
// - voluntary_exit, proposer_slashing, attester_slashing: 드문 이벤트
// - sync_committee_{0-3}: sync committee 서브넷
// - sync_committee_contribution_and_proof: sync 집계

// 네트워크 부하 (메인넷):
// 슬롯당 메시지:
// - 1 block
// - ~30,000 attestations (subnet 분산)
// - ~500 aggregates
// → 피어당 대역폭 ~1 MB/s`}
        </pre>
        <p className="leading-7">
          GossipSub는 <strong>mesh + gossip 이중 구조</strong>.<br />
          mesh가 빠른 전파 담당, gossip이 안정성/완전성 보장.<br />
          O(log N) propagation time으로 대규모 네트워크 지원.
        </p>

        {/* ── mesh 관리 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Mesh 관리 — Heartbeat 프로토콜</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// GossipSub heartbeat (1초 간격)
// 각 토픽의 mesh를 주기적으로 조정

const (
    D      = 8   // 목표 mesh degree
    D_lo   = 6   // 최소 mesh degree
    D_hi   = 12  // 최대 mesh degree
    D_lazy = 6   // gossip 대상 수
)

func (ps *PubSub) heartbeat() {
    for topic, mesh := range ps.mesh {
        // 1. mesh 크기 확인
        if len(mesh) < D_lo {
            // 부족 → 새 peer 추가 (backoff 고려)
            candidates := ps.getTopicPeers(topic, D - len(mesh))
            for _, p := range candidates {
                ps.addToMesh(topic, p)
                ps.sendGRAFT(p, topic)  // "mesh 추가 요청"
            }
        } else if len(mesh) > D_hi {
            // 과다 → 일부 제거 (score 낮은 순)
            toRemove := ps.selectLowestScore(mesh, len(mesh) - D)
            for _, p := range toRemove {
                ps.removeFromMesh(topic, p)
                ps.sendPRUNE(p, topic)  // "mesh 제거 알림"
            }
        }

        // 2. gossip: mesh 외부에 IHAVE 전송
        nonMeshPeers := ps.getTopicPeersNotInMesh(topic, D_lazy)
        messageIDs := ps.recentMessageIDs(topic, 5)  // 최근 5개
        for _, p := range nonMeshPeers {
            ps.sendIHAVE(p, topic, messageIDs)
        }
    }
}

// GRAFT/PRUNE/IHAVE/IWANT 메시지로 mesh 동적 관리
// 목표: D=8 peer 유지, 연결 품질 최적화`}
        </pre>
        <p className="leading-7">
          Heartbeat(1초)가 <strong>mesh 동적 관리</strong> 수행.<br />
          GRAFT/PRUNE으로 mesh 확장/축소 → D_lo~D_hi 범위 유지.<br />
          IHAVE/IWANT로 mesh 외부 메시지 보완 전파.
        </p>

        {/* ── Validation Pipeline ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">메시지 검증 파이프라인</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// GossipSub 메시지 수신 시 검증 단계
// 각 토픽별 validator 함수 등록

// Prysm의 beacon_block 토픽 validator:
func validateBeaconBlock(
    ctx context.Context,
    pid peer.ID,
    msg *pubsub.Message,
) pubsub.ValidationResult {
    // 1. SSZ-Snappy 디코딩
    decoded, err := snappy.Decode(nil, msg.Data)
    if err != nil { return pubsub.ValidationReject }

    block := &BeaconBlock{}
    if err := block.UnmarshalSSZ(decoded); err != nil {
        return pubsub.ValidationReject
    }

    // 2. gossip validation rules (spec 정의)
    //    - slot <= current_slot + MAXIMUM_GOSSIP_CLOCK_DISPARITY
    //    - signature 검증
    //    - proposer_index matches
    //    - parent_root exists in store
    //    - not already seen
    if err := runGossipValidation(block); err != nil {
        return pubsub.ValidationReject
    }

    // 3. 성공 → forward
    msg.ValidatorData = block  // cached for later use
    return pubsub.ValidationAccept
}

// ValidationResult:
// - ValidationAccept: forward to mesh
// - ValidationIgnore: keep but don't forward
// - ValidationReject: peer penalty (invalid message)

// Score 영향:
// Accept: +1 first_delivery
// Ignore: 영향 없음
// Reject: -80 invalid_message

// 검증 완료 전까지 forward 안 함 → 악의적 메시지 차단`}
        </pre>
        <p className="leading-7">
          <strong>3단계 검증</strong>: 디코딩 → spec 규칙 → forward 결정.<br />
          ValidationReject는 peer score -80 → 악의적 피어 강력 처벌.<br />
          검증 완료 전까지 forward 안 함 → 잘못된 메시지 전파 방지.
        </p>
      </div>
      <div className="not-prose mt-6"><GossipsubMeshViz /></div>
    </section>
  );
}
