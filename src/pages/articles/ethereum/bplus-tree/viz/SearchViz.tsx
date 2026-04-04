import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import SearchSteps from './SearchSteps';

const STEPS = [
  { label: 'Step 1: Root에서 시작 — 키 23 검색',
    body: 'root 노드 [15 | 30] 에서 23은 15 이상, 30 미만이므로 가운데 포인터(P₁)를 따른다.' },
  { label: 'Step 2: Internal 노드로 하강',
    body: 'internal 노드 [18 | 25]에서 23은 18 이상, 25 미만이므로 P₁을 따른다.' },
  { label: 'Step 3: Leaf에서 이진 탐색',
    body: 'leaf [20, 21, 23, 24]에서 이진 탐색으로 키 23을 찾고 값을 반환한다.' },
  { label: 'Step 4: 범위 검색 — 23~35 조회',
    body: '시작 키(23)의 leaf를 찾은 뒤 →next 포인터를 따라 다음 leaf로 순차 이동하며 35까지 스캔한다.' },
];

export default function SearchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <motion.div
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full flex justify-center"
        >
          <SearchSteps step={step} />
        </motion.div>
      )}
    </StepViz>
  );
}
