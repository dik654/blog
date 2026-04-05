import ContextViz from './viz/ContextViz';
import BlockProposalFlowViz from './viz/BlockProposalFlowViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">블록 제안 파이프라인</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 제안자 선정부터 블록 조립, 서명, 전파까지의 전체 파이프라인을 코드 수준으로 추적한다.
        </p>

        {/* ── Block proposal 흐름 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Block Proposal — 7단계 흐름</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 매 slot마다 1명의 proposer가 블록 생성
// 12초 slot 내에 완료 필수

// 1. Proposer 선정 (epoch 시작 시)
//    RANDAO 기반 결정적 선정
//    validator는 자기 차례 미리 알 수 있음

// 2. Duty notification (slot 전)
//    beacon-chain → validator (gRPC)
//    "slot N에 블록 제안 필요"

// 3. Block 준비 (slot 시작)
//    - parent block 선택 (LMD-GHOST head)
//    - RANDAO reveal 생성
//    - eth1 data 조회
//    - operations 수집

// 4. Block body 조립
//    - attestations (from pool, max 128)
//    - proposer_slashings, attester_slashings
//    - deposits (from eth1_data.deposit_count)
//    - voluntary_exits
//    - sync_aggregate (Altair+)
//    - execution_payload (Bellatrix+)
//    - blob_kzg_commitments (Deneb+)

// 5. State transition 시뮬레이션
//    임시 state 계산 → state_root 결정
//    block.StateRoot = computed_root

// 6. BLS 서명
//    proposer의 개인키로 block 서명
//    SignedBeaconBlock 생성

// 7. 전파
//    beacon_block topic에 publish
//    peers에게 gossip

// 타이밍:
// t=0s: slot 시작
// t=0~4s: block 조립 + 서명 (validator)
// t=4s: 블록 방송
// t=4~8s: 네트워크 전파
// t=8s: validator가 attestation 생성 (block 받았을 때)
// t=12s: slot 종료 → 다음 slot

// 실패 시나리오:
// - 4s 내 블록 생성 못 함 → slot skip
// - 네트워크 장애 → 다른 노드 못 받음 → orphaned
// - validator penalty: missed proposal`}
        </pre>
        <p className="leading-7">
          Block proposal은 <strong>7단계 파이프라인</strong>.<br />
          4초 내 조립+서명+전파 완료 필수.<br />
          실패 시 slot skip + validator 보상 손실.
        </p>
      </div>
      <div className="not-prose mt-6"><BlockProposalFlowViz /></div>
    </section>
  );
}
