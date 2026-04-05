import ContextViz from './viz/ContextViz';
import AttestationFlowViz from './viz/AttestationFlowViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">어테스테이션 생명주기</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 어테스테이션 생성부터 집계, 블록 포함, 보상 수령까지의 전체 생명주기를 코드 수준으로 추적한다.
        </p>

        {/* ── Attestation 역할 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Attestation — PoS 합의의 기본 단위</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Attestation: validator의 vote
// Ethereum 2.0 consensus의 기본 단위

struct Attestation {
    aggregation_bits: Bitlist[MAX_VALIDATORS_PER_COMMITTEE],  // 누가 서명했는지
    data: AttestationData,         // 투표 내용
    signature: BLSSignature,        // 집계 서명 (96 bytes)
}

struct AttestationData {
    slot: Slot,                    // 투표 대상 slot
    index: CommitteeIndex,         // 어느 committee
    beacon_block_root: Root,       // head block vote
    source: Checkpoint,            // LMD-GHOST source (justified)
    target: Checkpoint,            // LMD-GHOST target
}

// 3가지 vote per attestation:
// 1. beacon_block_root: head 블록 (LMD-GHOST input)
// 2. source: 이미 justified된 checkpoint
// 3. target: justify 대상 checkpoint (Casper FFG)

// Committee 할당:
// 매 slot마다 모든 active validator가 committee에 배정
// epoch당 committees = 2048 (기본) × 32 = committee 수
// 메인넷: ~30,000 attestation/slot (committee별 몇백)

// Validator duty:
// - 1 epoch에 정확히 1번 attestation 생성
// - 할당된 slot의 할당된 committee로
// - 실패 시 inactivity penalty

// Attestation의 역할:
// 1. Fork choice 입력 (LMD-GHOST)
// 2. Justification/Finalization (Casper FFG)
// 3. Validator reward 기반
// 4. 슬래싱 증거 (double-vote 감지)`}
        </pre>
        <p className="leading-7">
          Attestation은 <strong>3가지 투표 동시 포함</strong>.<br />
          beacon_block_root + source + target → fork choice + finality.<br />
          매 validator epoch당 1번 → 슬롯당 ~30K attestation.
        </p>

        {/* ── 생명주기 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Attestation 생명주기 — 10단계</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 1. Committee assignment
//    매 epoch 시작 시 validator에게 committee 할당
//    (slot N, committee_index C) 결정

// 2. Attestation 준비 (slot N, t=4s)
//    validator가 현재 head 조회
//    source/target checkpoint 결정

// 3. Slashing protection 체크
//    로컬 DB에서 이미 서명한 attestation 확인
//    Double-vote / surrounded-vote 방지

// 4. Attestation 서명
//    domain=DOMAIN_BEACON_ATTESTER
//    BLS 서명 생성

// 5. Subnet publish (t=4s)
//    beacon_attestation_{subnet} 토픽에 방송
//    aggregation_bits에 자기 bit만 set

// 6. Aggregator 수집 (t=8s)
//    Aggregator (무작위 선정 validator)가 같은 committee attestations 수집
//    BLS 집계 서명 생성

// 7. Aggregate 방송 (t=8s)
//    beacon_aggregate_and_proof 토픽
//    블록 proposer가 참고

// 8. Block inclusion (slot N+1 이후)
//    다음 block proposer가 aggregate를 block body에 포함
//    최대 128 aggregates per block

// 9. Block state transition
//    processAttestation 실행
//    Participation flag 설정

// 10. Rewards (epoch 경계)
//     epoch 종료 시 reward 계산
//     source/target/head vote 정확도별 reward

// 타이밍 요약:
// - slot N t=0: slot 시작
// - t=4s: attestation 서명 & 방송
// - t=8s: aggregate 방송
// - t=12s: slot N+1 시작
// - slot N+1 ~ N+32: 블록에 포함될 기회`}
        </pre>
        <p className="leading-7">
          Attestation <strong>10단계 생명주기</strong>.<br />
          assignment → 서명 → 방송 → 집계 → block 포함 → 보상.<br />
          생성~보상까지 최대 1 epoch 소요 (~6.4분).
        </p>
      </div>
      <div className="not-prose mt-6"><AttestationFlowViz /></div>
    </section>
  );
}
