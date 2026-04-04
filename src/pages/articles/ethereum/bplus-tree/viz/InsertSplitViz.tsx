import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import InsertSteps from './InsertSteps';

const STEPS = [
  { label: 'Step 1: 초기 상태 — leaf [10, 20, 30]',
    body: '차수 m=4 (최대 3개 키). leaf에 3개 키가 들어있어 가득 찬 상태다.' },
  { label: 'Step 2: 키 25 삽입 시도',
    body: 'leaf에 25를 넣으면 [10, 20, 25, 30]으로 4개가 되어 최대(3)를 초과한다.' },
  { label: 'Step 3: Leaf 분할(split)',
    body: '중간값 25를 부모로 올리고, [10, 20]과 [25, 30] 두 leaf로 나눈다.' },
  { label: 'Step 4: 부모도 가득 차면 — 재귀 전파',
    body: '부모 internal도 가득 차면 같은 방식으로 분할한다. root가 분할되면 새 root가 생기고 높이 +1.' },
];

export default function InsertSplitViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <motion.div
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full flex justify-center"
        >
          <InsertSteps step={step} />
        </motion.div>
      )}
    </StepViz>
  );
}
