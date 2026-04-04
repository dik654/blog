import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { Step0, Step1, Step2, Step3 } from './SealingPipelineSteps';

const STEPS = [
  { label: '원본 데이터 준비', body: '32GiB 섹터를 32바이트 노드로 분할합니다.' },
  { label: 'PC1 + PC2 봉인', body: 'SDR 인코딩 후 Poseidon Merkle Tree를 구축합니다.' },
  { label: 'WaitSeed → C1 챌린지', body: '150에폭 대기 후 랜덤 챌린지를 선정합니다.' },
  { label: 'C2 Groth16 → 온체인', body: 'GPU에서 증명을 생성하여 온체인 검증합니다.' },
];

const REF_KEYS = ['seal-pc1', 'seal-pc2', 'seal-c2', 'seal-c2'];
const REF_LABELS = ['데이터 준비', 'SDR+Merkle', 'C1 챌린지', 'Groth16'];
const R = [Step0, Step1, Step2, Step3];

export default function SealingPipelineViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <div className="w-full">
            <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>
            {onOpenCode && REF_KEYS[step] && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onOpenCode(REF_KEYS[step])} />
                <span className="text-[10px] text-muted-foreground">{REF_LABELS[step]}</span>
              </div>
            )}
          </div>
        );
      }}
    </StepViz>
  );
}
