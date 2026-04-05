import { motion } from 'framer-motion';
import { ActionBox } from '@/components/viz/boxes';

const C = { gossip: '#6366f1', vote: '#10b981' };

function ProtocolViz() {
  const phases = [
    { label: 'QUALITY', sub: '후보 tipset 선택' },
    { label: 'CONVERGE', sub: '최선 후보 수렴' },
    { label: 'PREPARE', sub: '준비 투표' },
    { label: 'COMMIT', sub: '커밋 투표' },
  ];
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">GossiPBFT 인스턴스: 4단계 투표</p>
      <svg viewBox="0 0 420 90" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        {phases.map((p, i) => (
          <motion.g key={p.label} initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}>
            <ActionBox x={5 + i * 105} y={10} w={95} h={35}
              label={p.label} sub={p.sub} color={C.gossip} />
            {i < 3 && (
              <motion.line x1={100 + i * 105} y1={27} x2={110 + i * 105} y2={27}
                stroke={C.gossip} strokeWidth={1}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: i * 0.12 + 0.2 }} />
            )}
          </motion.g>
        ))}
        <motion.text x={210} y={68} textAnchor="middle" fontSize={11}
          fill={C.vote} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}>
          💡 각 투표는 gossip으로 전파 — 리더 병목 없음
        </motion.text>
      </svg>
    </div>
  );
}

export default function Protocol() {
  return (
    <section id="protocol" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">프로토콜 구조</h2>
      <ProtocolViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          GossiPBFT는 <strong>4단계 투표</strong>로 tipset 확정.<br />
          QUALITY → CONVERGE → PREPARE → COMMIT.<br />
          투표 가중치 = storage power 비례 (일반 BFT의 1노드1표와 다름).
        </p>

        {/* ── 4-Phase Protocol ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">4-Phase Protocol 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// GossiPBFT 4-Phase 상세:

// Instance start:
// - 모든 validator가 최근 EC tipset 관찰
// - F3 instance 시작 (매 N epochs)
// - 시간: 매 X분 또는 trigger-based

// Phase 1: QUALITY
// - purpose: 후보 tipsets 식별
// - each validator proposes tipset candidate
// - broadcast: QualityVote(tipset, power, sig)
// - aggregate: 모든 candidates 수집
// - 결과: candidate set

// Phase 2: CONVERGE
// - purpose: 최선 candidate 수렴
// - each validator chooses "best" tipset
// - typically longest chain 또는 max power
// - broadcast: ConvergeVote(tipset, power, sig)
// - aggregate: 2/3+ power agreement
// - 결과: single tipset consensus

// Phase 3: PREPARE
// - purpose: 준비 투표
// - validators lock onto chosen tipset
// - broadcast: PrepareVote(tipset, power, sig)
// - collect: 2/3+ power PREPARE
// - 결과: prepared certificate

// Phase 4: COMMIT
// - purpose: 최종 확정
// - validators sign commit
// - broadcast: CommitVote(tipset, power, sig)
// - collect: 2/3+ power COMMIT
// - 결과: finalized tipset

// Instance completion:
// - tipset declared finalized
// - cross-chain proofs 가능
// - next instance starts

// Latency per instance:
// - QUALITY: ~30s (network gossip)
// - CONVERGE: ~30s
// - PREPARE: ~30s
// - COMMIT: ~30s
// - total: ~2 minutes

// Throughput:
// - 1 tipset per instance
// - ~30 tipsets per hour
// - vs EC: 120 tipsets per hour
// - F3 finalizes subset

// Byzantine tolerance:
// - f < 1/3 power
// - storage power weighted
// - Byzantine provider 탐지 가능`}
        </pre>
        <p className="leading-7">
          4-phase: <strong>QUALITY → CONVERGE → PREPARE → COMMIT</strong>.<br />
          each phase ~30s gossip → ~2 min total.<br />
          storage power weighted, Byzantine ≤ 1/3 power.
        </p>

        {/* ── Gossip 메커니즘 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Gossip Mechanism 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Gossip 구조 (GossiPBFT):
//
// 기본 원리:
// - validator가 message 보면 random subset에 forward
// - 무작위 propagation
// - eventually all validators receive

// Gossip 알고리즘:
// fn gossip_broadcast(msg):
//     for neighbor in random_subset(peers, fanout):
//         send(msg, neighbor)
//
// fn gossip_receive(msg):
//     if not seen_before(msg):
//         store(msg)
//         gossip_broadcast(msg)  # forward
//     else:
//         discard

// Parameters:
// - fanout: 각 gossip당 peers 수 (typically 6-10)
// - TTL: message time-to-live
// - max cache size

// Propagation time:
// - log_fanout(n) rounds
// - n=1000, fanout=8: ~4 rounds
// - n=10000, fanout=8: ~5 rounds
// - scales well

// Reliability:
// - multiple paths (redundant)
// - partial failure tolerant
// - no single point of failure

// Bandwidth:
// - O(log n) per message per node
// - aggregate: O(n log n)
// - linear in peers

// Vote aggregation (gossip 버전):
// - 각 validator가 received votes 카운트
// - local view: 2/3+ power 수집 시 advance
// - independent decision (no leader)

// Optimization:
// - bloom filters (dedup)
// - batching (multiple votes per message)
// - topic-based (F3 specific)
// - integration with libp2p gossipsub

// libp2p gossipsub:
// - Filecoin's 기본 P2P layer
// - topic-based pub/sub
// - mesh + gossip hybrid
// - GossiPBFT uses this infrastructure

// 비교: leader vs gossip
//
// Leader (PBFT/HotStuff):
// - 효율적 (direct communication)
// - single point of failure
// - DDoS 취약
//
// Gossip (GossiPBFT):
// - 강건 (no single leader)
// - redundant paths
// - DDoS 저항`}
        </pre>
        <p className="leading-7">
          Gossip: <strong>random fanout forward → O(log n) propagation</strong>.<br />
          no leader → DDoS 저항, redundant paths.<br />
          Filecoin libp2p gossipsub 활용.
        </p>

        {/* ── Safety & Liveness ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Safety &amp; Liveness</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// GossiPBFT Safety:
//
// Claim: finalized tipset은 revert 불가
//
// Proof sketch:
// - 2/3+ power COMMIT 필요
// - Byzantine < 1/3 power 가정
// - honest 2/3+ power → quorum intersection
// - f+1 honest power 교차
// - conflicting tipset 2/3+ 불가능
// - safety 보장

// Storage power weighted safety:
// - 1 TB = 1 vote weight
// - large providers 더 많은 vote
// - hostile providers 33%+ 확보 어려움
// - economic security (stake in storage)

// GossiPBFT Liveness:
//
// Claim: GST 이후 eventually finalize
//
// Conditions:
// - 2/3+ honest power
// - GST (Global Stabilization Time) passed
// - gossip eventual delivery
//
// Argument:
// - each phase eventually 2/3+ agreement
// - gossip ensures message delivery
// - 4 phases sequential
// - O(1) instance time after GST

// Async safety:
// - GossiPBFT is partial sync
// - async-safe 아님 (not fully)
// - but storage power 33% 공격 어려움

// F3 Integration safety:
// - EC에서 fork 가능
// - F3가 finalized subset 선택
// - finalized 이전 rollback 불가
// - F3 safety inherits to EC

// Attack vectors:
// 1. Long-range attack:
//    - 과거 storage power 재현?
//    - checkpoint으로 방어
//
// 2. Bribery:
//    - storage power 구매
//    - 비용 ≈ 33% of network
//    - 경제적 비합리
//
// 3. DDoS:
//    - gossip 공격
//    - but redundant paths
//    - impact limited

// Formal verification:
// - TLA+ specification
// - Stacks model checker
// - 2024 audit ongoing
// - production-ready`}
        </pre>
        <p className="leading-7">
          Safety: <strong>2/3+ power quorum intersection</strong>.<br />
          Liveness: GST 후 eventually finalize (4 phases).<br />
          TLA+ formal verification, 2024 audit.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 Filecoin은 gossip BFT를 선택했나</strong> — storage provider 특성.<br />
          Ethereum PoS: staked ETH (easy to measure).<br />
          Filecoin: storage power (physical hardware).<br />
          providers 널리 분산 → gossip이 자연스러움.<br />
          leader 기반은 storage provider 네트워크에 부적합.
        </p>
      </div>
    </section>
  );
}
