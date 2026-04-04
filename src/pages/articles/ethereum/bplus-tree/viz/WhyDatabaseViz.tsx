import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import WhyDbSteps from './WhyDbSteps';

const STEPS = [
  { label: '디스크 I/O 최적화',
    body: '노드 크기 = OS 페이지(4KB). fan-out이 높아 1억 레코드도 높이 4. 즉 4번의 디스크 읽기로 충분.' },
  { label: '범위 쿼리 효율',
    body: 'leaf가 연결 리스트로 이어져 "WHERE age BETWEEN 20 AND 30" 같은 범위 쿼리를 O(k)에 처리.' },
  { label: '캐시 친화적 + 동시성',
    body: 'root와 상위 internal 노드는 OS 페이지 캐시에 상주. MVCC와 결합하면 읽기/쓰기 비차단 가능.' },
  { label: '실제 사용: DB와 파일시스템',
    body: 'MDBX(Reth), InnoDB(MySQL), PostgreSQL, SQLite, 파일시스템(APFS, ext4, NTFS) 등 대부분의 저장 엔진이 B+tree 기반.' },
];

export default function WhyDatabaseViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <motion.div
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full flex justify-center"
        >
          <WhyDbSteps step={step} />
        </motion.div>
      )}
    </StepViz>
  );
}
