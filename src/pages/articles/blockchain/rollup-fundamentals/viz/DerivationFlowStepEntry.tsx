import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };
const Cs = ['#ec4899', '#f59e0b', '#14b8a6', '#10b981', '#0ea5e9', '#3b82f6', '#6366f1'];

export function DerivStep1() {
  return (
    <g>
      <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
        <rect x={20} y={10} width={480} height={26} rx={6}
          fill={`${Cs[6]}10`} stroke={Cs[6]} strokeWidth={1.2} />
        <text x={260} y={28} textAnchor="middle" fontSize={11} fontWeight={700} fill={Cs[6]}>
          DerivationPipeline.Step(ctx, pendingSafeHead)
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.15 }}>
        <rect x={20} y={50} width={480} height={22} rx={4} fill="#ffffff08" stroke="var(--border)" strokeWidth={0.8} />
        <text x={30} y={64} fontSize={10} fontWeight={600} fill="var(--foreground)" fontFamily="monospace">
          Line 1: if dp.resetting {'<'} len(stages) {'{'} stages[dp.resetting].Reset() {'}'}</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
        <rect x={20} y={78} width={480} height={22} rx={4} fill={`${Cs[0]}08`} stroke={Cs[0]} strokeWidth={0.8} />
        <text x={30} y={92} fontSize={10} fontWeight={600} fill={Cs[0]} fontFamily="monospace">
          Line 2: attrib, err := dp.attrib.NextAttributes(ctx, safeHead)</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.45 }}>
        <rect x={20} y={114} width={230} height={34} rx={6}
          fill={`${Cs[3]}08`} stroke={Cs[3]} strokeWidth={0.8} />
        <text x={30} y={128} fontSize={10} fontWeight={600} fill={Cs[3]} fontFamily="monospace">
          Line 3: if err == nil {'{'} return attrib {'}'}</text>
        <text x={30} y={142} fontSize={10} fill="var(--muted-foreground)">
          PayloadAttributes 도출 성공
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.5 }}>
        <rect x={270} y={114} width={230} height={34} rx={6}
          fill={`${Cs[6]}08`} stroke={Cs[6]} strokeWidth={0.8} />
        <text x={280} y={128} fontSize={10} fontWeight={600} fill={Cs[6]} fontFamily="monospace">
          Line 4: if err == io.EOF {'{'} AdvanceL1 {'}'}</text>
        <text x={280} y={142} fontSize={10} fill="var(--muted-foreground)">
          L1 블록 전진 후 재시도
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.65 }}>
        <rect x={20} y={164} width={480} height={28} rx={6}
          fill="#ffffff08" stroke="var(--border)" strokeWidth={0.8} />
        <text x={260} y={182} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          nil → 계속 호출 | io.EOF → L1 대기 | *Attrib → 블록 생성 | ResetError → 리셋
        </text>
      </motion.g>
    </g>
  );
}
