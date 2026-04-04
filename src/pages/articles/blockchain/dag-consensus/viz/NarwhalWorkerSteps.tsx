import { motion } from 'framer-motion';

const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';
const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const slide = (d: number) => ({ initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { delay: d } });

export function PrimaryStep() {
  const tasks = ['Certificate 생성/검증', 'DAG 구축 (digest 참조)', '라운드 진행 관리'];
  return (
    <svg viewBox="0 0 440 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.g {...fade(0.2)}>
        <rect x={15} y={8} width={200} height={82} rx={5} fill={`${CV}08`} stroke={CV} strokeWidth={1.2} />
        <text x={115} y={24} textAnchor="middle" fontSize={10} fontWeight={600} fill={CV}>Primary</text>
        <line x1={25} y1={30} x2={205} y2={30} stroke={CV} strokeWidth={0.3} opacity={0.3} />
        <text x={115} y={42} textAnchor="middle" fontSize={10} fill={CV} opacity={0.7}>메타데이터 관리</text>
      </motion.g>
      {tasks.map((t, i) => (
        <motion.g key={i} {...slide(0.4 + i * 0.2)}>
          <text x={30} y={58 + i * 14} fontSize={10} fill="var(--foreground)">· {t}</text>
        </motion.g>
      ))}
      <motion.g {...fade(1.0)}>
        <rect x={240} y={20} width={185} height={60} rx={4} fill="var(--background)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={332} y={38} textAnchor="middle" fontSize={10} fontWeight={500} fill={CV}>O(n) 통신</text>
        <text x={332} y={56} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">digest(32B)만 교환</text>
        <text x={332} y={72} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">실제 데이터는 Worker가 처리</text>
      </motion.g>
    </svg>
  );
}

export function WorkerStep() {
  return (
    <svg viewBox="0 0 440 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.g {...fade(0.2)}>
        <rect x={15} y={8} width={80} height={82} rx={4} fill={`${CV}06`} stroke={CV} strokeWidth={0.6} />
        <text x={55} y={30} textAnchor="middle" fontSize={10} fontWeight={500} fill={CV}>Primary</text>
        <text x={55} y={46} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">digest</text>
      </motion.g>
      {[1, 2, 3].map(i => (
        <motion.g key={i} {...slide(0.3 + i * 0.2)}>
          <line x1={95} y1={20 + i * 20} x2={125} y2={20 + i * 20} stroke={CE} strokeWidth={0.6} />
          <rect x={130} y={12 + i * 20} width={80} height={20} rx={3} fill={`${CE}10`} stroke={CE} strokeWidth={0.8} />
          <text x={170} y={26 + i * 20} textAnchor="middle" fontSize={10} fontWeight={500} fill={CE}>Worker {i}</text>
        </motion.g>
      ))}
      <motion.g {...fade(1.0)}>
        <rect x={235} y={14} width={190} height={72} rx={4} fill="var(--background)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={330} y={32} textAnchor="middle" fontSize={10} fontWeight={500} fill={CE}>수평 확장</text>
        <text x={330} y={48} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">Worker 추가 → 처리량 선형 증가</text>
        <text x={330} y={64} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">대역폭 집약 작업을 분산</text>
        <text x={330} y={80} textAnchor="middle" fontSize={10} fill={CA}>130,000 tx/s 달성</text>
      </motion.g>
    </svg>
  );
}

export function EthCompareStep() {
  return (
    <svg viewBox="0 0 440 90" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.g {...slide(0.2)}>
        <rect x={15} y={10} width={200} height={30} rx={4} fill="#ef444410" stroke="#ef4444" strokeWidth={0.6} />
        <text x={115} y={29} textAnchor="middle" fontSize={10} fontWeight={500} fill="#ef4444">이더리움: 단일 Proposer → 병목</text>
      </motion.g>
      <motion.g {...slide(0.6)}>
        <rect x={15} y={48} width={200} height={30} rx={4} fill={`${CE}10`} stroke={CE} strokeWidth={0.8} />
        <text x={115} y={67} textAnchor="middle" fontSize={10} fontWeight={600} fill={CE}>Narwhal: 모든 검증자 동시 제안</text>
      </motion.g>
      <motion.g {...fade(1.0)}>
        <rect x={240} y={20} width={185} height={50} rx={4} fill="var(--background)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={332} y={40} textAnchor="middle" fontSize={10} fill="var(--foreground)">Primary: digest만 교환 (가벼움)</text>
        <text x={332} y={58} textAnchor="middle" fontSize={10} fill="var(--foreground)">Worker: 데이터 병렬 전파 (무거움)</text>
      </motion.g>
    </svg>
  );
}
