import ContextViz from './viz/ContextViz';
import EpochPipelineViz from './viz/EpochPipelineViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">에폭 전환 파이프라인</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 ProcessEpoch의 7단계 파이프라인이 검증자 보상을 정산하는 전체 과정을 코드 수준으로 추적한다.
        </p>

        {/* ── Epoch processing 7단계 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ProcessEpoch — 7단계 파이프라인</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// process_epoch: epoch 경계 (32 slot마다)에 실행
// 1 epoch = 6.4분

func ProcessEpoch(state *BeaconState) error {
    // 1. Justification & Finalization
    //    - 이전/현재 epoch의 attestation 집계
    //    - 2/3+ supermajority 확인
    //    - justified_checkpoint, finalized_checkpoint 갱신
    if err := processJustificationAndFinalization(state); err != nil {
        return err
    }

    // 2. Inactivity updates (Altair+)
    //    - finality 지연 시 inactivity score 증가
    //    - leak 메커니즘 트리거
    if err := processInactivityUpdates(state); err != nil {
        return err
    }

    // 3. Rewards & Penalties
    //    - 모든 validator에게 보상/패널티 적용
    //    - attestation 참여, head vote, target vote 등 평가
    if err := processRewardsAndPenalties(state); err != nil {
        return err
    }

    // 4. Registry updates
    //    - activation queue 처리
    //    - exit queue 처리
    //    - churn limit 적용
    if err := processRegistryUpdates(state); err != nil {
        return err
    }

    // 5. Slashings
    //    - 슬래싱 페널티 적용
    //    - 에폭 offset (slashing period 분산)
    if err := processSlashings(state); err != nil {
        return err
    }

    // 6. Eth1 data reset
    //    - eth1_data_votes 초기화
    //    - 2 epoch마다 (SLOTS_PER_ETH1_VOTING_PERIOD = 2048)
    if err := processEth1DataReset(state); err != nil {
        return err
    }

    // 7. Effective balance updates + misc
    //    - effective_balance 재계산 (hysteresis)
    //    - slashings offset 갱신
    //    - randao mix 슬롯으로 옮기기
    //    - historical summaries 추가
    if err := processFinalUpdates(state); err != nil {
        return err
    }

    return nil
}

// 소요 시간 (메인넷 1M validator):
// - Justification: ~50ms
// - Inactivity: ~20ms
// - Rewards: ~200ms (가장 비쌈)
// - Registry: ~30ms
// - Slashings: ~10ms
// - 기타: ~10ms
// 총: ~320ms per epoch (6.4분 대비 매우 여유)`}
        </pre>
        <p className="leading-7">
          Epoch processing은 <strong>7단계 파이프라인</strong>.<br />
          매 epoch(6.4분) 1회만 실행 → validator 보상 일괄 정산.<br />
          총 ~320ms 소요 — slot processing보다 무겁지만 빈도 낮음.
        </p>
      </div>
      <div className="not-prose mt-6"><EpochPipelineViz /></div>
    </section>
  );
}
