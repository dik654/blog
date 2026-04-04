import StepViz from '@/components/ui/step-viz';
import { StepAddPiece, StepPC1, StepPC2, StepWaitSeed, StepCommit, StepFinalize } from './SealingSteps';

const STEPS = [
  { label: 'AddPiece: 데이터 → 섹터 패킹' },
  { label: 'PC1: SDR 11레이어 인코딩 (CPU)' },
  { label: 'PC2: Poseidon Merkle Tree (GPU)' },
  { label: 'WaitSeed: 랜덤 시드 대기 (75분)' },
  { label: 'C1+C2: Groth16 증명 (GPU)' },
  { label: 'Finalize: 온체인 제출' },
];

const R = [StepAddPiece, StepPC1, StepPC2, StepWaitSeed, StepCommit, StepFinalize];

export default function SealingPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <svg viewBox="0 0 460 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <S />
          </svg>
        );
      }}
    </StepViz>
  );
}
