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
        {/* ABCI 2.0 개요 */}
        <div className="bg-muted rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-sm mb-2">ABCI 2.0 (Application Blockchain Interface)</h4>
          <p className="text-sm text-muted-foreground mb-2">CometBFT와 애플리케이션 간 경계 인터페이스.</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
            <span className="text-muted-foreground">메서드</span>
            <span><code className="text-xs bg-background/50 px-1 rounded">PrepareProposal</code>, <code className="text-xs bg-background/50 px-1 rounded">ProcessProposal</code>, <code className="text-xs bg-background/50 px-1 rounded">FinalizeBlock</code>, <code className="text-xs bg-background/50 px-1 rounded">Commit</code>, <code className="text-xs bg-background/50 px-1 rounded">ExtendVote</code></span>
            <span className="text-muted-foreground">BeaconKit 역할</span>
            <span>이더리움 스펙을 감싸는 ABCI 앱 — CometBFT 이벤트 → Engine API 호출로 변환</span>
          </div>
        </div>

        {/* PrepareProposal */}
        <div className="bg-muted rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-sm mb-2">Proposal 단계 — <code className="text-xs bg-background/50 px-1 rounded">PrepareProposal(height, round, tx_list)</code></h4>
          <p className="text-xs text-muted-foreground mb-2">현재 리더(제안자)만 실행</p>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-[24px_1fr] gap-2">
              <span className="font-mono text-muted-foreground">1.</span>
              <span>EL의 head 블록 조회 — <code className="text-xs bg-background/50 px-1 rounded">head = EL.getCanonicalHead()</code></span>
            </div>
            <div className="grid grid-cols-[24px_1fr] gap-2">
              <span className="font-mono text-muted-foreground">2.</span>
              <div>
                <span>EL에 블록 빌드 요청 — <code className="text-xs bg-background/50 px-1 rounded">EL.forkchoiceUpdated(...)</code></span>
                <div className="ml-4 mt-1 text-xs text-muted-foreground grid grid-cols-[160px_1fr] gap-x-3 gap-y-0.5">
                  <span><code className="bg-background/50 px-1 rounded">head_block_hash</code></span><span>head.hash</span>
                  <span><code className="bg-background/50 px-1 rounded">prev_randao</code></span><span>beacon_state.randao_mix</span>
                  <span><code className="bg-background/50 px-1 rounded">fee_recipient</code></span><span>validator_addr</span>
                  <span><code className="bg-background/50 px-1 rounded">withdrawals</code></span><span>beacon_state.pending_withdrawals</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-[24px_1fr] gap-2">
              <span className="font-mono text-muted-foreground">3.</span>
              <span>빌드 완료 대기 — <code className="text-xs bg-background/50 px-1 rounded">payload = EL.getPayload(payload_id)</code></span>
            </div>
            <div className="grid grid-cols-[24px_1fr] gap-2">
              <span className="font-mono text-muted-foreground">4.</span>
              <div>
                <span>Cosmos tx로 래핑 — <code className="text-xs bg-background/50 px-1 rounded">BeaconBlock</code> SSZ 직렬화</span>
                <div className="ml-4 mt-1 text-xs text-muted-foreground grid grid-cols-[120px_1fr] gap-x-3 gap-y-0.5">
                  <span><code className="bg-background/50 px-1 rounded">slot</code></span><span>height</span>
                  <span><code className="bg-background/50 px-1 rounded">proposer_index</code></span><span>round_robin_leader(height)</span>
                  <span><code className="bg-background/50 px-1 rounded">execution_payload</code></span><span>EL이 빌드한 payload</span>
                  <span><code className="bg-background/50 px-1 rounded">randao_reveal</code></span><span>sign(epoch)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ProcessProposal */}
        <div className="bg-muted rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-sm mb-2">Validation 단계 — <code className="text-xs bg-background/50 px-1 rounded">ProcessProposal(proposed_block)</code></h4>
          <p className="text-xs text-muted-foreground mb-2">모든 검증자가 실행</p>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-[24px_1fr] gap-2">
              <span className="font-mono text-muted-foreground">1.</span>
              <span>SSZ 디코딩 — <code className="text-xs bg-background/50 px-1 rounded">BeaconBlock.unmarshal_ssz(proposed_block)</code></span>
            </div>
            <div className="grid grid-cols-[24px_1fr] gap-2">
              <span className="font-mono text-muted-foreground">2.</span>
              <span>비콘 상태 전이 검증 — 서명, RANDAO, 슬롯 제안자 확인</span>
            </div>
            <div className="grid grid-cols-[24px_1fr] gap-2">
              <span className="font-mono text-muted-foreground">3.</span>
              <span>EL 페이로드 검증 — <code className="text-xs bg-background/50 px-1 rounded">EL.newPayload(execution_payload)</code> → VALID가 아니면 REJECT</span>
            </div>
            <div className="grid grid-cols-[24px_1fr] gap-2">
              <span className="font-mono text-muted-foreground">4.</span>
              <span>비콘 state root 검증 — <code className="text-xs bg-background/50 px-1 rounded">apply_block(state, block)</code> 해시 불일치 시 REJECT</span>
            </div>
          </div>
        </div>

        {/* CometBFT Voting */}
        <div className="bg-muted rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-sm mb-3">CometBFT 투표 라운드</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="bg-background/30 rounded p-3">
              <p className="font-medium mb-1">Prevote</p>
              <p className="text-xs text-muted-foreground">검증자가 <code className="bg-background/50 px-1 rounded">Prevote(block_id)</code> 서명 → 피어에 가십</p>
            </div>
            <div className="bg-background/30 rounded p-3">
              <p className="font-medium mb-1">Precommit</p>
              <p className="text-xs text-muted-foreground">2/3+ Prevote 수집 시 → <code className="bg-background/50 px-1 rounded">Precommit(block_id)</code> 서명 → 피어에 가십</p>
            </div>
            <div className="bg-background/30 rounded p-3">
              <p className="font-medium mb-1">Commit</p>
              <p className="text-xs text-muted-foreground">2/3+ Precommit 수집 시 → 블록 커밋 확정</p>
            </div>
          </div>
        </div>

        {/* FinalizeBlock */}
        <div className="bg-muted rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-sm mb-2">Finalization 단계 — <code className="text-xs bg-background/50 px-1 rounded">FinalizeBlock(committed_block)</code></h4>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-[24px_1fr] gap-2">
              <span className="font-mono text-muted-foreground">1.</span>
              <span>전체 상태 전이 적용 — <code className="text-xs bg-background/50 px-1 rounded">new_state = apply_beacon_block(state, block)</code></span>
            </div>
            <div className="grid grid-cols-[24px_1fr] gap-2">
              <span className="font-mono text-muted-foreground">2.</span>
              <span>EL에 최종성 알림 — <code className="text-xs bg-background/50 px-1 rounded">EL.forkchoiceUpdated(...)</code> (head/safe/finalized 모두 동일 해시)</span>
            </div>
            <div className="grid grid-cols-[24px_1fr] gap-2">
              <span className="font-mono text-muted-foreground">3.</span>
              <span>비콘 상태 업데이트 — <code className="text-xs bg-background/50 px-1 rounded">state = new_state</code></span>
            </div>
          </div>
        </div>

        {/* Optimistic Payload Building */}
        <div className="bg-muted rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-sm mb-3">Optimistic Payload Building (핵심 최적화)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium mb-1">기존 방식</p>
              <p className="text-muted-foreground text-xs">Block N 커밋 → Payload N+1 빌드 → N+1 제안 (순차 실행)</p>
            </div>
            <div>
              <p className="font-medium mb-1">BeaconKit 최적화</p>
              <div className="text-xs text-muted-foreground space-y-0.5">
                <p><code className="bg-background/50 px-1 rounded">ProcessProposal(N)</code> 검증 통과 → 동시에 EL에 N+1 빌드 요청</p>
                <p>EL이 N+1 빌드하는 동안 N 합의 완료</p>
                <p><code className="bg-background/50 px-1 rounded">PrepareProposal(N+1)</code> 시 payload 이미 준비 완료</p>
              </div>
            </div>
          </div>
          <p className="text-xs mt-2 font-medium">결과: 블록 타임 ~40% 단축 → ~2초 블록 타임 달성</p>
        </div>

        {/* SSZ vs Protobuf */}
        <div className="bg-muted rounded-lg p-4">
          <h4 className="font-semibold text-sm mb-3">SSZ vs Protobuf</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium mb-1">SSZ (BeaconKit 채택)</p>
              <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                <li>고정 오프셋 (태그 없음)</li>
                <li>Merkleization 내장</li>
                <li>더 작은 페이로드</li>
                <li>이더리움과 동일 해싱</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Protobuf (표준 Cosmos)</p>
              <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                <li>가변 길이</li>
                <li>리플렉션 기반</li>
                <li>더 넓은 툴링 지원</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">BeaconKit가 SSZ를 선택한 이유: 이더리움 호환성 극대화</p>
        </div>
      </div>
    </section>
  );
}
