import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function BlockConstruction({ onCodeRef }: Props) {
  return (
    <section id="block-construction" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">블록 조립</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('aggregate-attestations', codeRefs['aggregate-attestations'])} />
          <span className="text-[10px] text-muted-foreground self-center">어테스테이션 수집</span>
        </div>

        {/* ── Block construction ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ProduceBlockV3 — 블록 조립 흐름</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// validator가 beacon-chain에 블록 생성 요청
// gRPC: ProduceBlock (또는 REST: /eth/v3/validator/blocks/{slot})

func (s *Server) ProduceBlock(
    ctx context.Context,
    req *ProduceBlockRequest,
) (*ProduceBlockResponse, error) {
    // 1. Parent block 결정 (LMD-GHOST head)
    head, err := s.forkchoiceStore.GetHead()
    parent, err := s.beaconDB.Block(head)

    // 2. Parent state 로드
    parentState, err := s.stategen.StateByRoot(head)

    // 3. State를 현재 slot으로 진전
    preState := ProcessSlots(parentState, req.Slot)

    // 4. Block body 조립
    body := &BeaconBlockBody{
        RandaoReveal: req.RandaoReveal,
        Eth1Data: s.eth1DataFetcher.getEth1Data(),
        Graffiti: req.Graffiti,

        // operations from pools
        ProposerSlashings: s.slashingPool.GetProposerSlashings(128, preState),
        AttesterSlashings: s.slashingPool.GetAttesterSlashings(2, preState),
        Attestations: s.attestationPool.AttestationsForInclusion(ctx, req.Slot),
        Deposits: s.getDepositsFromEth1(preState),
        VoluntaryExits: s.exitPool.GetExits(16, preState),
        BlsToExecutionChanges: s.blsChangePool.GetChanges(16, preState),

        // altair+
        SyncAggregate: s.syncAggregateForBlock(req.Slot, head),

        // bellatrix+
        ExecutionPayload: s.getExecutionPayload(ctx, req.Slot),

        // deneb+
        BlobKzgCommitments: s.getBlobCommitments(),
    }

    // 5. Block 완성 (state_root 미정)
    block := &BeaconBlock{
        Slot: req.Slot,
        ProposerIndex: req.ProposerIndex,
        ParentRoot: head,
        StateRoot: ZERO_HASH,  // 임시
        Body: body,
    }

    // 6. 임시 state transition (state_root 계산용)
    postState := processBlock(preState, block)
    stateRoot, _ := postState.HashTreeRoot()
    block.StateRoot = stateRoot  // backfill

    return &ProduceBlockResponse{Block: block}, nil
}`}
        </pre>
        <p className="leading-7">
          Block construction은 <strong>6단계 파이프라인</strong>.<br />
          parent 선택 → operations 수집 → state transition → state_root 계산.<br />
          validator가 이 블록에 서명하면 완성.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 임시 상태 전이</strong> — 조립된 블록으로 임시 상태 전이를 실행.<br />
          결과 상태의 HashTreeRoot를 block.StateRoot에 설정.<br />
          이 과정이 블록 조립에서 가장 비용이 큰 연산.
        </p>
      </div>
    </section>
  );
}
