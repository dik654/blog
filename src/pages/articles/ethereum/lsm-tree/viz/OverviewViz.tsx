import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const STEPS = [
  { label: '랜덤 쓰기 — 디스크 헤드가 매번 이동', body: 'HDD는 헤드 탐색(seek)에 ~10ms, SSD도 랜덤 쓰기 시 write amplification이 발생. 데이터가 흩어진 위치에 쓰여짐.' },
  { label: '순차 쓰기 — 연속된 주소에 한 번에 기록', body: 'HDD seek 없이 연속 기록 → 100배 이상 빠름. SSD도 페이지 단위 순차 기록이 최적. LSM-tree의 핵심 아이디어.' },
  { label: 'LSM-tree 구조: Memtable + SSTable 레벨', body: '쓰기를 메모리(Memtable)에 모은 뒤, 가득 차면 정렬된 SSTable 파일로 순차 기록. 디스크에는 L0→L1→L2 레벨 구조.' },
  { label: '대표 구현과 블록체인', body: 'LevelDB(Google), RocksDB(Facebook), Cassandra, HBase 등. Geth는 LevelDB를 사용 — 쓰기 처리량이 높고 Go 바인딩이 존재.' },
];

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: Random I/O */}
          <motion.g animate={{ opacity: step === 0 ? 1 : 0.15 }}>
            <rect x={20} y={30} width={220} height={160} rx={6} fill={`${C1}08`} stroke={C1} strokeWidth={step === 0 ? 1.2 : 0.5} />
            <text x={130} y={22} textAnchor="middle" fontSize={11} fontWeight={600} fill={C1}>Random I/O</text>
            {/* Disk platter */}
            <ellipse cx={130} cy={130} rx={70} ry={30} fill="none" stroke={C1} strokeWidth={0.8} />
            {/* Random seek arrows */}
            {[{ x: 80, y: 110 }, { x: 170, y: 140 }, { x: 100, y: 150 }, { x: 160, y: 115 }].map((p, i) => (
              <motion.circle key={i} cx={p.x} cy={p.y} r={4} fill={C1}
                initial={{ opacity: 0 }} animate={{ opacity: step === 0 ? 1 : 0 }}
                transition={{ delay: i * 0.15 }} />
            ))}
            {/* Seek lines */}
            <motion.polyline points="80,110 170,140 100,150 160,115" fill="none" stroke={C1} strokeWidth={1} strokeDasharray="3,3"
              animate={{ opacity: step === 0 ? 0.7 : 0 }} />
            <text x={130} y={180} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">~10ms seek per write</text>
          </motion.g>

          {/* Step 1: Sequential I/O */}
          <motion.g animate={{ opacity: step === 1 ? 1 : 0.15 }}>
            <rect x={280} y={30} width={220} height={160} rx={6} fill={`${C2}08`} stroke={C2} strokeWidth={step === 1 ? 1.2 : 0.5} />
            <text x={390} y={22} textAnchor="middle" fontSize={11} fontWeight={600} fill={C2}>Sequential I/O</text>
            {/* Sequential blocks */}
            {Array.from({ length: 8 }, (_, i) => (
              <motion.rect key={i} x={300 + i * 22} y={100} width={18} height={30} rx={3}
                fill={`${C2}20`} stroke={C2} strokeWidth={0.8}
                initial={{ opacity: 0 }} animate={{ opacity: step === 1 ? 1 : 0 }}
                transition={{ delay: i * 0.08 }} />
            ))}
            <motion.line x1={300} y1={85} x2={476} y2={85} stroke={C2} strokeWidth={1.5}
              animate={{ opacity: step === 1 ? 1 : 0 }} markerEnd="url(#seqArr)" />
            <defs><marker id="seqArr" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={5} markerHeight={5} orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={C2} /></marker></defs>
            <text x={390} y={155} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">연속 기록: ~0.1ms per write</text>
            <text x={390} y={180} textAnchor="middle" fontSize={10} fontWeight={600} fill={C2}>100x faster</text>
          </motion.g>

          {/* Step 2: LSM structure */}
          <motion.g animate={{ opacity: step === 2 ? 1 : 0.15 }}>
            <rect x={30} y={50} width={90} height={40} rx={5} fill={`${C3}15`} stroke={C3} strokeWidth={1} />
            <text x={75} y={74} textAnchor="middle" fontSize={10} fontWeight={600} fill={C3}>Memtable</text>
            <text x={75} y={44} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">(메모리)</text>
            {/* Arrow */}
            <line x1={120} y1={70} x2={155} y2={70} stroke="var(--border)" strokeWidth={1} markerEnd="url(#lsmArr)" />
            {/* SSTable levels */}
            {[{ lbl: 'L0', x: 160, w: 70, c: C1 }, { lbl: 'L1', x: 240, w: 100, c: C1 }, { lbl: 'L2', x: 350, w: 140, c: C2 }].map((lv, i) => (
              <g key={i}>
                <rect x={lv.x} y={50} width={lv.w} height={40} rx={5} fill={`${lv.c}10`} stroke={lv.c} strokeWidth={0.8} />
                <text x={lv.x + lv.w / 2} y={74} textAnchor="middle" fontSize={10} fontWeight={500} fill={lv.c}>{lv.lbl}</text>
                {i < 2 && <line x1={lv.x + lv.w} y1={70} x2={lv.x + lv.w + 10} y2={70} stroke="var(--border)" strokeWidth={0.8} markerEnd="url(#lsmArr)" />}
              </g>
            ))}
            <defs><marker id="lsmArr" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={5} markerHeight={5} orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="var(--muted-foreground)" /></marker></defs>
            <text x={260} y={44} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">(디스크 — SSTable 레벨)</text>
            <text x={260} y={115} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">랜덤 쓰기 → 메모리 정렬 → 순차 flush</text>
          </motion.g>

          {/* Step 3: Implementations */}
          <motion.g animate={{ opacity: step === 3 ? 1 : 0.15 }}>
            {[
              { name: 'LevelDB', sub: 'Google · Go', x: 40 },
              { name: 'RocksDB', sub: 'Facebook · C++', x: 160 },
              { name: 'Cassandra', sub: 'Apache · Java', x: 280 },
              { name: 'Geth', sub: 'LevelDB 사용', x: 400 },
            ].map((impl, i) => (
              <g key={i}>
                <rect x={impl.x} y={60} width={100} height={50} rx={6}
                  fill={i === 3 ? `${C3}15` : `${C1}08`}
                  stroke={i === 3 ? C3 : C1} strokeWidth={i === 3 ? 1.2 : 0.7} />
                <text x={impl.x + 50} y={82} textAnchor="middle" fontSize={11} fontWeight={600}
                  fill={i === 3 ? C3 : C1}>{impl.name}</text>
                <text x={impl.x + 50} y={100} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">{impl.sub}</text>
              </g>
            ))}
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
