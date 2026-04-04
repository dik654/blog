import StepViz from '@/components/ui/step-viz';
import { StepOverview, StepFull } from './SyncStrategySteps';
import { StepSnap, StepLive } from './SyncStrategySteps2';

const STEPS = [
  { label: '3가지 동기화 전략 비교', body: '새 노드는 Snap->Live, 검증용은 Full 동기화를 선택합니다.' },
  { label: 'Full Sync -- 제네시스부터 모든 블록 재실행', body: 'Headers->Bodies->Execution->Merkle 순서로 Stage 실행하며 수일 소요됩니다.' },
  { label: 'Snap Sync -- 최신 상태만 다운로드 (시간 절약)', body: 'GetAccountRange/GetStorageRanges로 상태를 다운로드하고 Merkle proof를 검증합니다.' },
  { label: 'Live Sync -- ExEx 확장으로 실시간 블록 이벤트 처리', body: 'ChainCommitted/ChainReorged 이벤트를 broadcast하여 인덱서/브릿지가 처리합니다.' },
];

const R = [StepOverview, StepFull, StepSnap, StepLive];

export default function SyncStrategyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <svg viewBox="0 0 430 115" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <S />
          </svg>
        );
      }}
    </StepViz>
  );
}
