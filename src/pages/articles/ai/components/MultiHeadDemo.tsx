import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const heads = [
  { name: 'Head 1', focus: '문법적 관계', color: '#3b82f6', desc: '주어-동사, 수식어-피수식어 관계를 포착' },
  { name: 'Head 2', focus: '의미적 유사성', color: '#10b981', desc: '의미가 비슷한 토큰 간 높은 가중치 부여' },
  { name: 'Head 3', focus: '위치 기반 패턴', color: '#f59e0b', desc: '인접한 토큰에 높은 가중치를 부여하는 패턴' },
  { name: 'Head 4', focus: '장거리 의존성', color: '#ef4444', desc: '문장 시작과 끝, 멀리 떨어진 토큰 간 관계 포착' },
];

export default function MultiHeadDemo() {
  const [activeHead, setActiveHead] = useState(0);

  return (
    <div className="rounded-lg border p-6">
      <p className="text-sm text-muted-foreground mb-4">
        각 Head를 선택하면 어떤 관점을 학습하는지 확인할 수 있습니다.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-4">
        {heads.map((head, i) => (
          <motion.button
            key={head.name}
            onClick={() => setActiveHead(i)}
            className="rounded-lg border p-3 text-center text-sm font-medium cursor-pointer"
            animate={{
              borderColor: activeHead === i ? head.color : '#e5e5e5',
              backgroundColor:
                activeHead === i ? `${head.color}10` : 'transparent',
            }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            {head.name}
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeHead}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="rounded-lg p-4 text-center"
          style={{ backgroundColor: `${heads[activeHead].color}10` }}
        >
          <p className="font-medium" style={{ color: heads[activeHead].color }}>
            {heads[activeHead].focus}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {heads[activeHead].desc}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
