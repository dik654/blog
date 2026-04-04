import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import OverviewSteps from './OverviewSteps';

const STEPS = [
  { label: '배열 — O(n) 삽입, 범위 검색 가능',
    body: '정렬 배열은 이진 탐색 O(log n)이 가능하지만, 삽입 시 뒤쪽 원소를 모두 밀어야 해서 O(n)이다.' },
  { label: '해시 테이블 — O(1) 접근, 범위 검색 불가',
    body: '키를 해시 함수로 변환해 O(1) 조회가 가능하지만, 순서가 없어 "10~20 사이의 키"를 찾을 수 없다.' },
  { label: 'BST — O(log n) 검색+삽입, 디스크에 비효율',
    body: '이진 탐색 트리는 노드당 키 1개. 높이가 log₂n이므로 100만 개면 20번 디스크 I/O가 필요하다.' },
  { label: 'B-tree — 노드에 여러 키, I/O 최소화',
    body: '한 노드에 수백 개 키를 담아 높이를 3~4로 낮춘다. 한 노드 = 한 페이지(4KB) 읽기.' },
  { label: 'B+tree — 데이터는 리프에만, 리프끼리 연결',
    body: 'B-tree를 개선하여 internal node는 키만, leaf에 데이터를 저장한다. leaf끼리 연결 리스트로 이어져 범위 검색이 빠르다.' },
];

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <motion.div
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full flex justify-center"
        >
          <OverviewSteps step={step} />
        </motion.div>
      )}
    </StepViz>
  );
}
