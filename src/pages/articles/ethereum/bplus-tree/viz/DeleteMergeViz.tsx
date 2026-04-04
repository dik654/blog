import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import DeleteSteps from './DeleteSteps';

const STEPS = [
  { label: 'Step 1: 초기 상태',
    body: '차수 m=4. 최소 키 개수는 ceil(4/2)-1 = 1개. leaf [20]은 최소 상태다.' },
  { label: 'Step 2: 키 20 삭제 → 언더플로우',
    body: 'leaf에서 20을 제거하면 키가 0개가 되어 최소(1개) 미만. 언더플로우 발생.' },
  { label: 'Step 3a: 재분배 — 형제에서 빌려오기',
    body: '오른쪽 형제 [30, 35]에 여유가 있으면 30을 빌려온다. 부모 경계키도 30으로 갱신.' },
  { label: 'Step 3b: 병합 — 형제도 최소면 합침',
    body: '형제도 최소(1개)면 두 leaf를 합치고 부모에서 경계키를 제거한다. 부모도 언더플로우면 재귀 전파.' },
];

export default function DeleteMergeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <motion.div
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full flex justify-center"
        >
          <DeleteSteps step={step} />
        </motion.div>
      )}
    </StepViz>
  );
}
