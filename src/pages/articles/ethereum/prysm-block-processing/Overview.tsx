import ContextViz from './viz/ContextViz';
import BlockProcessingViz from './viz/BlockProcessingViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">블록 처리 전체 흐름</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 블록 수신부터 상태 반영까지의 6단계 검증 파이프라인을 코드 수준으로 추적한다.
        </p>

        {/* ── process_block 파이프라인 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">process_block — 6단계 파이프라인</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// consensus-specs의 process_block (Deneb)
func ProcessBlock(state *BeaconState, block *BeaconBlock) error {
    // 1. Block header 처리
    //    - proposer_index 검증
    //    - proposer slashing 확인
    //    - latest_block_header 업데이트
    if err := processBlockHeader(state, block); err != nil {
        return err
    }

    // 2. RANDAO 처리
    //    - proposer의 randao_reveal 서명 검증
    //    - randao_mixes[epoch % 65536] 업데이트 (XOR)
    if err := processRandao(state, block.Body); err != nil {
        return err
    }

    // 3. Eth1 data voting
    //    - eth1_data_votes에 추가
    //    - 과반 시 eth1_data 확정
    if err := processEth1Data(state, block.Body); err != nil {
        return err
    }

    // 4. Operations 처리 (핵심)
    //    - proposer_slashings
    //    - attester_slashings
    //    - attestations
    //    - deposits
    //    - voluntary_exits
    //    - bls_to_execution_changes (Capella+)
    if err := processOperations(state, block.Body); err != nil {
        return err
    }

    // 5. Sync aggregate (Altair+)
    //    - sync committee의 집계 서명 검증
    //    - 참여자 보상 지급
    if err := processSyncAggregate(state, block.Body.SyncAggregate); err != nil {
        return err
    }

    // 6. Execution payload (Bellatrix+)
    //    - EL에 payload 전달
    //    - engine_newPayload 호출
    //    - VALID/INVALID/SYNCING 결과 처리
    if err := processExecutionPayload(state, block.Body); err != nil {
        return err
    }

    return nil
}

// 성능:
// - processBlockHeader: ~1ms
// - processRandao: ~2ms (BLS verify)
// - processOperations: ~100ms (~대부분 attestations)
// - processExecutionPayload: ~수십 ms (EL 호출 + wait)
// - 총: ~200ms per block (12초 slot 대비 여유)`}
        </pre>
        <p className="leading-7">
          블록 처리는 <strong>6단계 파이프라인</strong>.<br />
          각 단계가 독립적 검증 + state 업데이트.<br />
          attestations 처리가 가장 큰 비중 — ~100ms.
        </p>
      </div>
      <div className="not-prose mt-6"><BlockProcessingViz /></div>
    </section>
  );
}
