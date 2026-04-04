import { motion } from 'framer-motion';
import { Box, SplitStep, RootSplitStep } from './InsertStepsParts';

const C1 = '#6366f1', C2 = '#10b981', CR = '#ef4444', CW = '#f59e0b';

function Step0() {
  return (
    <svg viewBox="0 0 400 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <Box x={120} y={20} keys={['15']} color={C1} label="root (internal)" />
      <line x1={148} y1={46} x2={92} y2={60} stroke="var(--border)" strokeWidth={0.7} />
      <line x1={160} y1={46} x2={222} y2={60} stroke="var(--border)" strokeWidth={0.7} />
      <Box x={30} y={62} keys={['10', '12']} color={C2} label="leaf" />
      <Box x={190} y={62} keys={['20', '25', '30']} color={CR} label="leaf (가득 참!)" />
      <text x={340} y={80} fontSize={10} fill={CR}>m=4: 최대 3키</text>
    </svg>
  );
}

function Step1() {
  return (
    <svg viewBox="0 0 400 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <Box x={120} y={20} keys={['15']} color={C1} label="root" />
      <line x1={148} y1={46} x2={92} y2={60} stroke="var(--border)" strokeWidth={0.7} />
      <line x1={160} y1={46} x2={240} y2={60} stroke="var(--border)" strokeWidth={0.7} />
      <Box x={30} y={62} keys={['10', '12']} color={C2} />
      <rect x={190} y={62} width={140} height={26} rx={5}
        fill={`${CR}10`} stroke={CR} strokeWidth={1.2} strokeDasharray="4,2" />
      {['20', '22', '25', '30'].map((k, i) => (
        <text key={i} x={204 + i * 32} y={79} textAnchor="middle" fontSize={11}
          fill={k === '22' ? CW : 'var(--foreground)'}
          fontWeight={k === '22' ? 700 : 400}>{k}</text>
      ))}
      <motion.text x={260} y={105} textAnchor="middle" fontSize={10} fill={CR}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        4키 = 오버플로우! 분할 필요
      </motion.text>
    </svg>
  );
}

export default function InsertSteps({ step }: { step: number }) {
  return [<Step0 />, <Step1 />, <SplitStep />, <RootSplitStep />][step];
}
