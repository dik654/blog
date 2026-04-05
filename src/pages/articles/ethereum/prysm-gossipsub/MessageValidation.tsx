import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function MessageValidation({ onCodeRef }: Props) {
  return (
    <section id="message-validation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">메시지 검증 파이프라인</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          가십으로 수신된 블록은 6단계 검증을 통과해야 한다.<br />
          검증 결과에 따라 전파·무시·거부를 결정한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('validate-block-pubsub', codeRefs['validate-block-pubsub'])} />
          <span className="text-[10px] text-muted-foreground self-center">validateBeaconBlockPubSub()</span>
        </div>

        {/* ── beacon_block validation ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">beacon_block 검증 — spec 정의 규칙</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// consensus-specs의 gossip validation for beacon_block
// https://github.com/ethereum/consensus-specs/blob/dev/specs/phase0/p2p-interface.md

// 조건 (하나라도 실패 시 validation 실패):

// 1. slot 범위
//    current_slot - MAXIMUM_GOSSIP_CLOCK_DISPARITY
//      <= block.slot <=
//    current_slot + MAXIMUM_GOSSIP_CLOCK_DISPARITY (500ms)

// 2. 유일성 확인
//    (block.slot, block.proposer_index) 쌍이 이미 처리된 것이 아님
//    → 동일 슬롯에 같은 제안자의 다른 블록은 Ignore

// 3. 조상 블록 finality 확인
//    block.parent_root의 조상이 finalized checkpoint와 일치

// 4. 제안자 일치 확인
//    block.proposer_index가 해당 slot의 예상 proposer와 일치

// 5. 서명 검증
//    block.signature가 proposer의 BLS public key로 검증 가능

// 6. 부모 존재 확인
//    block.parent_root가 이미 store에 있음 (알려진 블록)

// Prysm 구현:
func validateBeaconBlockPubSub(
    ctx context.Context,
    pid peer.ID,
    msg *pubsub.Message,
) pubsub.ValidationResult {
    block := decodeBlock(msg.Data)

    // 1. 슬롯 체크
    if block.Slot < genesisSlot || block.Slot > currentSlot + 1 {
        return pubsub.ValidationIgnore  // 너무 과거/미래
    }

    // 2. 유일성
    if s.hasSeenBlock(block.Slot, block.ProposerIndex) {
        return pubsub.ValidationIgnore  // 중복
    }

    // 3. finality 체크
    if !ancestorOf(block.ParentRoot, finalizedRoot) {
        return pubsub.ValidationReject
    }

    // 4~6. proposer, signature, parent
    if err := fullValidation(block); err != nil {
        return pubsub.ValidationReject
    }

    return pubsub.ValidationAccept
}`}
        </pre>
        <p className="leading-7">
          <strong>6단계 검증</strong>을 spec이 정의 — 모든 CL 구현체가 따라야 함.<br />
          slot 체크(±500ms)로 시간 동기화 확인.<br />
          unique (slot, proposer) 체크로 중복 제안 감지.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">검증 단계</h3>
        <ul>
          <li><strong>SSZ-Snappy 디코딩</strong> — 포맷 오류 시 Reject</li>
          <li><strong>슬롯 범위</strong> — 너무 오래된 블록은 Ignore</li>
          <li><strong>서명 검증</strong> — BLS 서명 무효 시 Reject</li>
          <li><strong>부모 존재</strong> — 부모 미확인 시 Ignore (나중에 재시도)</li>
          <li><strong>제안자 인덱스</strong> — 해당 슬롯 예상 제안자와 불일치 시 Reject</li>
          <li><strong>이중 제안</strong> — 같은 슬롯에 이미 제안 확인 시 Ignore</li>
        </ul>

        {/* ── attestation validation ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">beacon_attestation 검증 — 더 엄격</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// attestation은 블록보다 많이 전파되므로 엄격한 검증

func validateBeaconAttestationPubSub(
    ctx context.Context,
    pid peer.ID,
    msg *pubsub.Message,
) pubsub.ValidationResult {
    att := decodeAttestation(msg.Data)

    // 1. subnet 일치 확인
    //    att.data.committee_index → expected subnet
    if getSubnet(att.data) != topicSubnet(msg.Topic) {
        return pubsub.ValidationReject  // 잘못된 subnet
    }

    // 2. slot 체크 (attestation은 epoch 단위)
    current := getCurrentSlot()
    if att.data.slot > current || att.data.slot < current - SLOTS_PER_EPOCH {
        return pubsub.ValidationIgnore
    }

    // 3. 단일 validator만 서명 (aggregation_bits count = 1)
    if popcount(att.aggregation_bits) != 1 {
        return pubsub.ValidationReject  // 집계된 건 다른 토픽
    }

    // 4. committee_index 유효성
    if att.data.committee_index >= getCommitteesPerSlot(att.data.slot) {
        return pubsub.ValidationReject
    }

    // 5. 단일 validator의 중복 attestation 체크
    validator_idx := getValidatorFromBits(att.aggregation_bits)
    if s.hasSeenAttestation(att.data.slot, validator_idx) {
        return pubsub.ValidationIgnore
    }

    // 6. 서명 검증 (단일 validator, FastAggregateVerify 불필요)
    if err := verifySignature(att, validator_idx); err != nil {
        return pubsub.ValidationReject
    }

    // 7. LMD-GHOST vote 일관성
    if !isValidTarget(att.data.target) {
        return pubsub.ValidationReject
    }

    return pubsub.ValidationAccept
}

// 볼륨 대비 비용:
// 메인넷: ~30,000 attestation/slot → 주요 검증 부하
// validator 1개당 ~0.5ms 검증 비용
// 총: 15 seconds worth of work per slot (병렬 처리 필수)`}
        </pre>
        <p className="leading-7">
          attestation은 <strong>블록보다 7단계 엄격 검증</strong>.<br />
          볼륨이 30K/slot으로 많아 검증 오버헤드 큼.<br />
          검증 대부분을 병렬 처리 + 배치화 필수.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 Reject vs Ignore 차이</strong> — Reject은 피어 점수를 감점하고 메시지를 버림.<br />
          Ignore는 점수 영향 없이 전파만 중단.<br />
          부모 미확인처럼 "나중에 유효할 수 있는" 경우 Ignore로 처리해 오판을 방지.
        </p>
      </div>
    </section>
  );
}
