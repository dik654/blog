import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { C0, C1, C2, CR, STEPS, L0_FILES, L1_BEFORE, L1_AFTER, L2_BEFORE, L2_AFTER, WA_LEVELS } from './CompactionData';

function MergeArrow() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <line x1={260} y1={80} x2={260} y2={110} stroke={CR} strokeWidth={1.2} markerEnd="url(#cpArr)" />
      <text x={275} y={100} fontSize={10} fontWeight={600} fill={CR}>merge sort</text>
    </motion.g>
  );
}

function FileBoxes({ files, color, w = 65 }: { files: { k: string; x: number }[]; color: string; w?: number }) {
  return <>{files.map((f, i) => (
    <g key={i}>
      <rect x={f.x} y={38} width={w} height={28} rx={4} fill={`${color}12`} stroke={color} strokeWidth={0.7} />
      <text x={f.x + w / 2} y={56} textAnchor="middle" fontSize={9} fill={color}>{f.k}</text>
    </g>
  ))}</>;
}

export default function CompactionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 230" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="cpArr" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={5} markerHeight={5} orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="var(--muted-foreground)" /></marker>
          </defs>
          {/* Step 0 */}
          <motion.g animate={{ opacity: step === 0 ? 1 : 0.15 }}>
            <text x={260} y={24} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">파일이 쌓이면 읽기 성능 저하</text>
            {Array.from({ length: 6 }, (_, i) => (
              <motion.rect key={i} x={80 + i * 60} y={40} width={50} height={30} rx={4}
                fill={`${C0}${10 + i * 3}`} stroke={C0} strokeWidth={0.7}
                initial={{ y: 40 }} animate={{ y: 40 + Math.floor(i / 2) * 35 }} transition={{ delay: i * 0.1 }} />
            ))}
            {Array.from({ length: 6 }, (_, i) => (
              <text key={`t${i}`} x={105 + i * 60} y={60 + Math.floor(i / 2) * 35} textAnchor="middle" fontSize={9} fill={C0}>SST{i}</text>
            ))}
            <text x={260} y={165} textAnchor="middle" fontSize={10} fill={CR}>읽기: 최대 6개 파일 순회 필요</text>
          </motion.g>
          {/* Step 1: L0→L1 */}
          <motion.g animate={{ opacity: step === 1 ? 1 : 0.15 }}>
            <text x={130} y={30} textAnchor="middle" fontSize={10} fontWeight={600} fill={C0}>L0</text>
            <FileBoxes files={L0_FILES} color={C0} />
            <text x={380} y={30} textAnchor="middle" fontSize={10} fontWeight={600} fill={C1}>L1 (before)</text>
            <FileBoxes files={L1_BEFORE} color={C1} w={60} />
            <MergeArrow />
            <text x={260} y={130} textAnchor="middle" fontSize={10} fontWeight={600} fill={C1}>L1 (after)</text>
            <FileBoxes files={L1_AFTER.map(f => ({ ...f, k: f.k }))} color={C1} w={80} />
          </motion.g>
          {/* Step 2: L1→L2 */}
          <motion.g animate={{ opacity: step === 2 ? 1 : 0.15 }}>
            <text x={130} y={30} textAnchor="middle" fontSize={10} fontWeight={600} fill={C1}>L1 (10MB 초과)</text>
            <rect x={60} y={38} width={140} height={28} rx={4} fill={`${C1}15`} stroke={C1} strokeWidth={1.2} />
            <text x={130} y={56} textAnchor="middle" fontSize={9} fill={C1}>선택된 SSTable (k-p)</text>
            <text x={380} y={30} textAnchor="middle" fontSize={10} fontWeight={600} fill={C2}>L2 (100MB 한도)</text>
            <FileBoxes files={L2_BEFORE} color={C2} w={60} />
            <MergeArrow />
            <text x={260} y={130} textAnchor="middle" fontSize={10} fontWeight={600} fill={C2}>L2 (after)</text>
            {L2_AFTER.map((f, i) => (
              <g key={i}>
                <rect x={f.x} y={138} width={100} height={28} rx={4} fill={`${C2}18`} stroke={C2} strokeWidth={1} />
                <text x={f.x + 50} y={156} textAnchor="middle" fontSize={9} fill={C2}>{f.k}</text>
              </g>
            ))}
          </motion.g>
          {/* Step 3: Write Amplification */}
          <motion.g animate={{ opacity: step === 3 ? 1 : 0.15 }}>
            <text x={260} y={30} textAnchor="middle" fontSize={11} fontWeight={600} fill={CR}>Write Amplification</text>
            {WA_LEVELS.map((lv, i) => {
              const y = 50 + i * 40;
              return (
                <g key={lv.lv}>
                  <rect x={260 - lv.w / 2} y={y} width={lv.w} height={28} rx={5} fill={`${lv.c}10`} stroke={lv.c} strokeWidth={0.8} />
                  <text x={260} y={y + 18} textAnchor="middle" fontSize={10} fontWeight={500} fill={lv.c}>{lv.lv}</text>
                  <text x={260 + lv.w / 2 + 10} y={y + 18} fontSize={9} fill="var(--muted-foreground)">{lv.sz}</text>
                  {i < 3 && <line x1={260} y1={y + 28} x2={260} y2={y + 40} stroke="var(--border)" strokeWidth={0.8} markerEnd="url(#cpArr)" />}
                </g>
              );
            })}
            <text x={260} y={215} textAnchor="middle" fontSize={10} fill={CR} fontWeight={600}>1회 쓰기 = 실제 디스크 쓰기 10~30배</text>
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
