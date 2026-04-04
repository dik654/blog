import { motion } from 'framer-motion';

const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';
const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const slide = (d: number) => ({ initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { delay: d } });

export function AnchorElectStep() {
  const rounds = [
    { label: 'R1', type: '투표', c: CV },
    { label: 'R2', type: '앵커', c: CA },
    { label: 'R3', type: '투표', c: CV },
    { label: 'R4', type: '앵커', c: CA },
  ];
  return (
    <svg viewBox="0 0 440 90" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {rounds.map((r, i) => (
        <motion.g key={i} {...slide(0.2 + i * 0.2)}>
          <rect x={20 + i * 105} y={14} width={95} height={36} rx={4}
            fill={`${r.c}${r.type === '앵커' ? '15' : '08'}`} stroke={r.c}
            strokeWidth={r.type === '앵커' ? 1.2 : 0.6} />
          <text x={67 + i * 105} y={30} textAnchor="middle" fontSize={10} fontWeight={600} fill={r.c}>{r.label}</text>
          <text x={67 + i * 105} y={44} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{r.type}</text>
        </motion.g>
      ))}
      <motion.g {...fade(1.0)}>
        <text x={220} y={70} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          짝수 라운드 = 앵커(리더 Vertex) 선출 / 홀수 = 투표
        </text>
      </motion.g>
    </svg>
  );
}

export function CommitRuleStep() {
  return (
    <svg viewBox="0 0 440 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.g {...fade(0.2)}>
        <rect x={160} y={8} width={80} height={28} rx={4} fill={`${CA}15`} stroke={CA} strokeWidth={1.2} />
        <text x={200} y={26} textAnchor="middle" fontSize={10} fontWeight={600} fill={CA}>앵커 ★</text>
      </motion.g>
      {[0, 1, 2].map(i => (
        <motion.g key={i} {...slide(0.4 + i * 0.2)}>
          <line x1={200} y1={36} x2={80 + i * 80} y2={50} stroke={CE} strokeWidth={0.8} />
          <rect x={50 + i * 80} y={50} width={60} height={22} rx={3} fill={`${CE}08`} stroke={CE} strokeWidth={0.6} />
          <text x={80 + i * 80} y={65} textAnchor="middle" fontSize={10} fill={CE}>V{i + 1}</text>
        </motion.g>
      ))}
      <motion.g {...fade(1.0)}>
        <rect x={60} y={82} width={320} height={22} rx={4} fill={`${CE}06`} stroke={CE} strokeWidth={0.6} />
        <text x={220} y={97} textAnchor="middle" fontSize={10} fontWeight={500} fill={CE}>
          2f+1 참조 = 앵커 커밋 → ancestors 전체 순서 확정
        </text>
      </motion.g>
    </svg>
  );
}

export function LinearizeStep() {
  const ops = ['ancestors 수집 (BFS)', '(round, author) 정렬', '커밋 목록 반환'];
  return (
    <svg viewBox="0 0 440 80" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {ops.map((op, i) => (
        <motion.g key={i} {...slide(0.2 + i * 0.25)}>
          <rect x={10 + i * 145} y={14} width={135} height={28} rx={4}
            fill={`${[CV, CE, CA][i]}10`} stroke={[CV, CE, CA][i]} strokeWidth={0.8} />
          <text x={77 + i * 145} y={32} textAnchor="middle" fontSize={10} fontWeight={500}
            fill={[CV, CE, CA][i]}>{op}</text>
          {i < 2 && <text x={145 + i * 145} y={32} fontSize={10} fill="var(--muted-foreground)">→</text>}
        </motion.g>
      ))}
      <motion.g {...fade(1.0)}>
        <text x={220} y={60} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          Zero-message overhead — DAG 구조 자체가 투표 역할
        </text>
      </motion.g>
    </svg>
  );
}

export function WaveStep() {
  return (
    <svg viewBox="0 0 440 90" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.g {...fade(0.2)}>
        <rect x={15} y={10} width={410} height={40} rx={5} fill={`${CV}04`} stroke={CV} strokeWidth={0.8} />
        <text x={220} y={22} textAnchor="middle" fontSize={10} fontWeight={500} fill={CV}>Wave (4라운드 단위)</text>
      </motion.g>
      {['투표', '앵커', '투표', '앵커'].map((t, i) => (
        <motion.g key={i} {...slide(0.3 + i * 0.15)}>
          <rect x={25 + i * 100} y={28} width={90} height={18} rx={3}
            fill={t === '앵커' ? `${CA}15` : `${CE}08`}
            stroke={t === '앵커' ? CA : CE} strokeWidth={0.6} />
          <text x={70 + i * 100} y={40} textAnchor="middle" fontSize={10}
            fill={t === '앵커' ? CA : CE}>{t}</text>
        </motion.g>
      ))}
      <motion.g {...fade(1.0)}>
        <text x={220} y={68} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          Best-case: 2 round-trip 지연 · 이더리움 LMD-GHOST와 유사한 포크 선택
        </text>
      </motion.g>
    </svg>
  );
}
