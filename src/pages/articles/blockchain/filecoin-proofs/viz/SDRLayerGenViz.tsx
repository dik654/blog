import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { Step0, Step1, Step2, Step3, Step4 } from './SDRLayerGenSteps';

const STEPS = [
  { label: '섹터 분할', body: '32GiB 섹터를 32바이트 노드(약 10억 개)로 분할합니다.' },
  { label: 'replica_id 생성', body: 'prover_id, sector_id, ticket, comm_d를 SHA256 해시합니다.' },
  { label: '부모 노드 선택', body: 'DRG 6개 + Expander 8개 = 총 14개 부모를 선택합니다.' },
  { label: 'SHA256 레이블링', body: '순차 의존성으로 병렬화가 불가능합니다.' },
  { label: '11레이어 + XOR 인코딩', body: '11층 순차 생성 후 XOR로 복제본을 만듭니다.' },
];

const REF_KEYS = ['seal-pc1', 'seal-pc1', 'stacked-graph', 'seal-pc1', 'seal-pc2'];
const REF_LABELS = ['섹터 분할', 'replica_id', 'StackedGraph', 'SHA256', 'XOR 인코딩'];
const R = [Step0, Step1, Step2, Step3, Step4];

export default function SDRLayerGenViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <div className="w-full">
            <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>
            {onOpenCode && (
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
