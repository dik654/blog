import { motion } from 'framer-motion';
import { CLIP_C } from './BPTTVizData';

export function Step3() {
  return (
    <g>
      <rect x={20} y={15} width={220} height={140} rx={8}
        fill={CLIP_C + '08'} stroke={CLIP_C} strokeWidth={1} />
      <text x={130} y={35} textAnchor="middle" fontSize={10} fill={CLIP_C} fontWeight={600}>
        Truncated BPTT
      </text>
      {[0, 1, 2].map(i => (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: i * 0.15 }}>
          <rect x={40 + i * 65} y={50} width={50} height={24} rx={5}
            fill={i < 2 ? CLIP_C + '20' : '#88888815'}
            stroke={i < 2 ? CLIP_C : '#888'} strokeWidth={1} />
          <text x={65 + i * 65} y={66} textAnchor="middle" fontSize={8}
            fill={i < 2 ? CLIP_C : '#888'}>t-{i}</text>
        </motion.g>
      ))}
      <text x={130} y={100} textAnchor="middle" fontSize={8} fill={CLIP_C}>
        k=20~35 단계만 역전파
      </text>
      <text x={130} y={118} textAnchor="middle" fontSize={8} fill="#999">
        순전파는 전체, 역전파만 절단
      </text>
      <rect x={260} y={15} width={220} height={140} rx={8}
        fill="#f59e0b08" stroke="#f59e0b" strokeWidth={1} />
      <text x={370} y={35} textAnchor="middle" fontSize={10} fill="#f59e0b" fontWeight={600}>
        Gradient Clipping
      </text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <line x1={300} y1={60} x2={300} y2={130} stroke="#88888830" strokeWidth={1} />
        <line x1={300} y1={130} x2={440} y2={130} stroke="#88888830" strokeWidth={1} />
        <line x1={320} y1={120} x2={380} y2={50} stroke="#ef4444" strokeWidth={1.5} />
        <text x={390} y={55} fontSize={8} fill="#ef4444">원래</text>
        <line x1={320} y1={120} x2={360} y2={85} stroke={CLIP_C} strokeWidth={2} />
        <text x={365} y={80} fontSize={8} fill={CLIP_C}>clipped</text>
        <text x={370} y={148} textAnchor="middle" fontSize={8} fill="#999">
          방향 유지, 크기만 θ로 제한
        </text>
      </motion.g>
    </g>
  );
}
