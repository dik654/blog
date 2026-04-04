import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CN, CR, CW, CB, STEPS, NORMAL_POINTS, SPIKE_POINTS, READ_BARS, BLOCKS } from './CompactionStallData';

export default function CompactionStallViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: Normal */}
          <motion.g animate={{ opacity: step === 0 ? 1 : 0.12 }}>
            <text x={260} y={24} textAnchor="middle" fontSize={11} fontWeight={600} fill={CN}>정상 상태</text>
            <line x1={40} y1={120} x2={480} y2={120} stroke="var(--border)" strokeWidth={0.8} />
            <text x={30} y={124} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">지연</text>
            <text x={260} y={140} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">시간</text>
            <motion.polyline points={NORMAL_POINTS} fill="none" stroke={CN} strokeWidth={1.5}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
            <text x={260} y={100} textAnchor="middle" fontSize={10} fill={CN} fontWeight={500}>~1ms 안정적</text>
          </motion.g>
          {/* Step 1: Bandwidth */}
          <motion.g animate={{ opacity: step === 1 ? 1 : 0.12 }}>
            <text x={260} y={24} textAnchor="middle" fontSize={11} fontWeight={600} fill={CR}>Compaction 디스크 점유</text>
            <line x1={40} y1={160} x2={480} y2={160} stroke="var(--border)" strokeWidth={0.8} />
            <text x={30} y={164} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">지연</text>
            <motion.polyline points={SPIKE_POINTS} fill="none" stroke={CR} strokeWidth={1.5}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }} />
            <rect x={200} y={40} width={80} height={115} rx={4} fill={`${CW}08`} stroke={CW} strokeWidth={0.8} strokeDasharray="3,2" />
            <text x={240} y={37} textAnchor="middle" fontSize={9} fill={CW}>compaction</text>
            <rect x={400} y={40} width={60} height={115} rx={4} fill={`${CW}08`} stroke={CW} strokeWidth={0.8} strokeDasharray="3,2" />
            <text x={430} y={37} textAnchor="middle" fontSize={9} fill={CW}>compaction</text>
            <text x={260} y={185} textAnchor="middle" fontSize={10} fill={CR} fontWeight={500}>스파이크: 50~200ms</text>
          </motion.g>
          {/* Step 2: L0 accumulation */}
          <motion.g animate={{ opacity: step === 2 ? 1 : 0.12 }}>
            <text x={260} y={24} textAnchor="middle" fontSize={11} fontWeight={600} fill={CR}>L0 파일 누적</text>
            {Array.from({ length: 10 }, (_, i) => (
              <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
                <rect x={40 + i * 44} y={50} width={40} height={25} rx={4}
                  fill={i > 6 ? `${CR}18` : `${CB}10`} stroke={i > 6 ? CR : CB} strokeWidth={0.7} />
                <text x={60 + i * 44} y={67} textAnchor="middle" fontSize={9} fill={i > 6 ? CR : CB}>SST{i}</text>
              </motion.g>
            ))}
            <text x={260} y={44} textAnchor="middle" fontSize={10} fill={CB}>L0 SSTables (키 범위 겹침)</text>
            <text x={260} y={100} textAnchor="middle" fontSize={10} fill={CR} fontWeight={600}>10개 파일 전부 검색 필요</text>
            {READ_BARS.map((n, i) => (
              <g key={i}>
                <rect x={80 + i * 80} y={180 - n * 8} width={40} height={n * 8} rx={3}
                  fill={n > 6 ? `${CR}20` : `${CN}15`} stroke={n > 6 ? CR : CN} strokeWidth={0.6} />
                <text x={100 + i * 80} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{n}개</text>
              </g>
            ))}
            <text x={260} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">L0 파일 수 vs 읽기 지연</text>
          </motion.g>
          {/* Step 3: Write stall */}
          <motion.g animate={{ opacity: step === 3 ? 1 : 0.12 }}>
            <text x={260} y={24} textAnchor="middle" fontSize={11} fontWeight={600} fill={CR}>Write Stall</text>
            <rect x={60} y={50} width={400} height={30} rx={5} fill="var(--card)" stroke="var(--border)" strokeWidth={0.8} />
            <motion.rect x={60} y={50} width={0} height={30} rx={5} fill={`${CR}20`}
              animate={{ width: 400 }} transition={{ duration: 1.5 }} />
            <text x={260} y={70} textAnchor="middle" fontSize={10} fontWeight={600} fill={CR}>L0 파일 수: 12/12 (한도 초과)</text>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
              <rect x={160} y={100} width={200} height={35} rx={5} fill={`${CR}10`} stroke={CR} strokeWidth={1.2} />
              <text x={260} y={122} textAnchor="middle" fontSize={11} fontWeight={600} fill={CR}>WRITE BLOCKED</text>
            </motion.g>
            <text x={260} y={160} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">RocksDB 완화: rate limiter + sub-compaction 병렬화</text>
          </motion.g>
          {/* Step 4: Blockchain */}
          <motion.g animate={{ opacity: step === 4 ? 1 : 0.12 }}>
            <text x={260} y={24} textAnchor="middle" fontSize={11} fontWeight={600} fill={CR}>블록체인 노드에서의 영향</text>
            {BLOCKS.map((b, i) => (
              <g key={i}>
                <rect x={40 + i * 160} y={50} width={140} height={35} rx={5}
                  fill={i === 1 ? `${CR}12` : `${CN}08`} stroke={i === 1 ? CR : CN} strokeWidth={i === 1 ? 1.2 : 0.7} />
                <text x={110 + i * 160} y={72} textAnchor="middle" fontSize={10} fontWeight={500} fill={i === 1 ? CR : CN}>{b}</text>
              </g>
            ))}
            <text x={110} y={100} textAnchor="middle" fontSize={9} fill={CN}>12초</text>
            <text x={270} y={100} textAnchor="middle" fontSize={9} fill={CR}>12초 + stall</text>
            <rect x={100} y={120} width={300} height={40} rx={5} fill={`${CW}08`} stroke={CW} strokeWidth={0.8} />
            <text x={250} y={137} textAnchor="middle" fontSize={10} fill={CW}>EVM: SLOAD 상태 읽기가 핵심 병목</text>
            <text x={250} y={152} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">compaction 스파이크 = 블록 처리 지연</text>
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
