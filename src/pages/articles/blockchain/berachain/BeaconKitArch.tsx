import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import BlockLifecycleSteps from './BlockLifecycleSteps';

const STEPS = [
  { label: 'BeaconKit ABCI 2.0 블록 생명주기', body: '표준 Cosmos SDK 모듈 미사용 — CometBFT 합의 엔진만 유지, 나머지 자체 구현.\n직렬화: Protobuf 대신 이더리움의 SSZ(Simple Serialize) 채택.' },
  { label: 'PrepareProposal → forkchoiceUpdated', body: '제안자가 Engine API로 EVM 페이로드 빌드 요청.\nCometBFT 라운드 로빈 → 이더리움의 RANDAO 선출 대체.' },
  { label: 'ProcessProposal → newPayload 검증', body: 'EL에서 페이로드 실행 & 검증.\n검증자들이 동기 BFT(Prevote/Precommit)로 투표 — 비동기 Attestation 대체.' },
  { label: 'FinalizeBlock → 상태 확정', body: '즉시 최종성 — 1 블록으로 확정 (이더리움: 2 에폭, ~12.8분).\n포크 불가: BFT safety 보장.' },
  { label: 'Commit → Optimistic Payload Building', body: 'BeaconKit 핵심 최적화 — ProcessProposal에서 이미 StateRoot 검증.\n다음 블록 N+1 페이로드를 병렬로 선행 빌드 → 블록 타임 ~40% 단축.' },
];

const CODE_MAP = ['bk-service', 'bk-block-builder', 'bk-process-proposal', 'bk-finalize-block', 'bk-block-builder'];

interface Props { onCodeRef?: (key: string, ref: CodeRef) => void }

export default function BeaconKitArch({ onCodeRef }: Props) {
  return (
    <section id="beaconkit-arch" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BeaconKit 블록 생명주기</h2>
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
        ABCI 2.0 콜백 → Engine API → EVM 실행 — 이더리움 블록 제안 흐름을 CometBFT에서 재현.
      </p>
      <StepViz steps={STEPS}>
        {(step) => (
          <div className="w-full">
            <BlockLifecycleSteps step={step} />
            {onCodeRef && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onCodeRef(CODE_MAP[step], codeRefs[CODE_MAP[step]])} />
                <span className="text-[10px] text-muted-foreground">
                  {CODE_MAP[step].replace('bk-', '').replace(/-/g, '_')}.go
                </span>
              </div>
            )}
          </div>
        )}
      </StepViz>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">BeaconKit ABCI 2.0 + Engine API</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BeaconKit Block Lifecycle (ABCI 2.0)
//
// ABCI (Application Blockchain Interface):
//   CometBFT's boundary between consensus and app
//   Methods: PrepareProposal, ProcessProposal,
//            FinalizeBlock, Commit, ExtendVote, etc.
//
// BeaconKit role:
//   ABCI app that wraps Ethereum spec
//   Translates CometBFT events → Engine API calls

// Proposal phase (only by current leader):
//
//   PrepareProposal(height, round, tx_list) {
//     // 1. Get EL's head block
//     head = EL.getCanonicalHead()
//
//     // 2. Ask EL to build a block
//     payload_id = EL.forkchoiceUpdated(
//       head_block_hash = head.hash,
//       safe_block_hash = head.hash,
//       finalized_block_hash = last_finalized.hash,
//       payload_attributes = {
//         timestamp,
//         prev_randao: beacon_state.randao_mix,
//         suggested_fee_recipient: validator_addr,
//         withdrawals: beacon_state.pending_withdrawals,
//         parent_beacon_block_root: beacon_block.parent_root,
//       }
//     )
//
//     // 3. Wait for EL to finish building
//     payload = EL.getPayload(payload_id)
//
//     // 4. Wrap into Cosmos tx
//     return BeaconBlock{
//       slot: height,
//       proposer_index: round_robin_leader(height),
//       parent_root: prev_beacon_block_root,
//       body: BeaconBlockBody{
//         execution_payload: payload,
//         randao_reveal: sign(epoch),
//         ...
//       }
//     }.marshal_ssz()
//   }

// Validation phase (all validators):
//
//   ProcessProposal(proposed_block) {
//     // 1. Parse SSZ-encoded block
//     block = BeaconBlock.unmarshal_ssz(proposed_block)
//
//     // 2. Verify beacon state transition
//     verify_block_signature(block)
//     verify_randao(block)
//     verify_slot_proposer(block)
//
//     // 3. Verify execution payload via EL
//     result = EL.newPayload(block.body.execution_payload)
//     if result.status != VALID: return REJECT
//
//     // 4. Verify beacon state root
//     new_state = apply_block(state, block)
//     if new_state.hash != block.state_root: return REJECT
//
//     return ACCEPT
//   }

// CometBFT voting rounds:
//
//   PrevoteProcess:
//     Validator signs Prevote(block_id)
//     Gossip prevote to peers
//
//   PrecommitProcess:
//     If 2/3+ Prevotes seen → Precommit(block_id)
//     Gossip precommit to peers
//
//   CommitProcess:
//     If 2/3+ Precommits → BLOCK COMMITTED

// Finalization phase:
//
//   FinalizeBlock(committed_block) {
//     // Apply state transition fully
//     new_state = apply_beacon_block(state, block)
//
//     // Tell EL: this block is finalized
//     EL.forkchoiceUpdated(
//       head_block_hash = block.body.execution_payload.block_hash,
//       safe_block_hash = block.body.execution_payload.block_hash,
//       finalized_block_hash = block.body.execution_payload.block_hash,
//       payload_attributes = nil
//     )
//
//     // Update beacon state
//     state = new_state
//   }

// Optimistic payload building (key optimization):
//
//   Traditional flow:
//     Block N committed → Build payload N+1 → Propose N+1
//
//   BeaconKit optimization:
//     ProcessProposal(N) → validate ✓
//         → simultaneously ask EL: "start building N+1"
//     EL builds N+1 while consensus finishes for N
//     FinalizeBlock(N) → commit
//     PrepareProposal(N+1) → payload already ready!
//
//   Result: ~40% reduction in block time
//   ~2s block time achievable

// SSZ (Simple Serialize) vs Protobuf:
//
//   BeaconKit uses SSZ (Ethereum spec)
//     - Fixed offsets (no tags)
//     - Merkleization built-in
//     - Smaller payloads
//     - Same hashing as Ethereum
//
//   Standard Cosmos uses Protobuf
//     - Variable-length
//     - Reflection-based
//     - Broader tooling
//
//   BeaconKit chose SSZ for Ethereum compatibility`}
        </pre>
      </div>
    </section>
  );
}
