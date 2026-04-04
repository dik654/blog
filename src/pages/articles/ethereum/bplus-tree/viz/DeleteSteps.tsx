import { motion } from 'framer-motion';
import { Box, RedistributeStep, MergeStep } from './DeleteStepsParts';

const CI = '#6366f1', CG = '#10b981', CR = '#ef4444', CW = '#f59e0b';

function Step0() {
  return (
    <svg viewBox="0 0 400 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <Box x={140} y={15} keys={['15', '25']} color={CI} label="root" />
      <line x1={155} y1={39} x2={75} y2={52} stroke="var(--border)" strokeWidth={0.7} />
      <line x1={178} y1={39} x2={178} y2={52} stroke="var(--border)" strokeWidth={0.7} />
      <line x1={200} y1={39} x2={290} y2={52} stroke="var(--border)" strokeWidth={0.7} />
      <Box x={30} y={54} keys={['10', '12']} color={CG} />
      <Box x={155} y={54} keys={['20']} color={CW} label="최소 상태" />
      <Box x={260} y={54} keys={['30', '35']} color={CG} />
      <text x={200} y={95} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        m=4, 최소 키 = ceil(m/2)-1 = 1개
      </text>
    </svg>
  );
}

function Step1() {
  return (
    <svg viewBox="0 0 400 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <Box x={140} y={15} keys={['15', '25']} color={CI} label="root" />
      <line x1={155} y1={39} x2={75} y2={52} stroke="var(--border)" strokeWidth={0.7} />
      <line x1={178} y1={39} x2={178} y2={52} stroke="var(--border)" strokeWidth={0.7} />
      <line x1={200} y1={39} x2={290} y2={52} stroke="var(--border)" strokeWidth={0.7} />
      <Box x={30} y={54} keys={['10', '12']} color={CG} />
      <rect x={160} y={54} width={40} height={24} rx={4}
        fill={`${CR}10`} stroke={CR} strokeWidth={1.2} strokeDasharray="4,2" />
      <motion.text x={180} y={68} textAnchor="middle" fontSize={11} fill={CR}
        initial={{ opacity: 1 }} animate={{ opacity: 0.3 }}>20</motion.text>
      <text x={180} y={95} textAnchor="middle" fontSize={10} fill={CR}>
        키 0개 = 언더플로우!
      </text>
      <Box x={260} y={54} keys={['30', '35']} color={CG} />
    </svg>
  );
}

export default function DeleteSteps({ step }: { step: number }) {
  return [<Step0 />, <Step1 />, <RedistributeStep />, <MergeStep />][step];
}
