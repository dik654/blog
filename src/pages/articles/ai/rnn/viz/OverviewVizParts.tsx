import { motion } from 'framer-motion';
import { RNN_C } from './OverviewVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export function Step2() {
  return (
    <g>
      {['baseball', '...', 'bat'].map((w, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: i * 0.2 }}>
          <rect x={60 + i * 140} y={35} width={100} height={30} rx={6}
            fill={i === 2 ? '#f59e0b20' : '#88888810'}
            stroke={i === 2 ? '#f59e0b' : '#888'} strokeWidth={1} />
          <text x={110 + i * 140} y={55} textAnchor="middle" fontSize={11}
            fill={i === 2 ? '#f59e0b' : '#888'} fontWeight={600}>{w}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <rect x={310} y={80} width={120} height={24} rx={5}
          fill={RNN_C + '15'} stroke={RNN_C} strokeWidth={1} />
        <text x={370} y={96} textAnchor="middle" fontSize={10} fill={RNN_C}>
          → 방망이 (O)
        </text>
        <rect x={310} y={110} width={120} height={24} rx={5}
          fill="#ef444410" stroke="#ef4444" strokeWidth={1} />
        <text x={370} y={126} textAnchor="middle" fontSize={10} fill="#ef4444">
          → 박쥐 (X)
        </text>
      </motion.g>
      <motion.text x={120} y={90} fontSize={9} fill="#999"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        은닉 상태가 "baseball" 기억 보존
      </motion.text>
    </g>
  );
}

export function Step3() {
  return (
    <g>
      {['가변 길이', '순서 보존', '장기 의존성', '파라미터 공유'].map((t, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ ...sp, delay: i * 0.12 }}>
          <rect x={30 + i * 112} y={35} width={100} height={30} rx={6}
            fill={RNN_C + '15'} stroke={RNN_C} strokeWidth={1} />
          <text x={80 + i * 112} y={55} textAnchor="middle" fontSize={9}
            fill={RNN_C} fontWeight={600}>{t}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={140} y={90} width={200} height={36} rx={8}
          fill={RNN_C + '10'} stroke={RNN_C} strokeWidth={1.5} />
        <text x={240} y={112} textAnchor="middle" fontSize={11} fill={RNN_C} fontWeight={700}>
          RNN
        </text>
      </motion.g>
    </g>
  );
}
