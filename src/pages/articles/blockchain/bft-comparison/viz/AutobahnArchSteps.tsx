import { motion } from 'framer-motion';

const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';
const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const slide = (d: number) => ({ initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { delay: d } });

export function HighwayStep() {
  return (
    <svg viewBox="0 0 440 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.g {...fade(0.2)}>
        <rect x={15} y={10} width={200} height={80} rx={5} fill={`${CV}08`} stroke={CV} strokeWidth={1.2} />
        <text x={115} y={28} textAnchor="middle" fontSize={10} fontWeight={600} fill={CV}>Highway (Consensus)</text>
        <line x1={25} y1={34} x2={205} y2={34} stroke={CV} strokeWidth={0.3} opacity={0.3} />
        <text x={115} y={50} textAnchor="middle" fontSize={10} fill="var(--foreground)">리더 기반 부분 동기 합의</text>
        <text x={115} y={66} textAnchor="middle" fontSize={10} fill="var(--foreground)">블록 순서 결정만 담당</text>
        <text x={115} y={82} textAnchor="middle" fontSize={10} fill={CV}>데이터 전파는 Lanes에 위임</text>
      </motion.g>
      <motion.g {...slide(0.7)}>
        <rect x={240} y={16} width={90} height={28} rx={4} fill={`${CE}10`} stroke={CE} strokeWidth={0.8} />
        <text x={285} y={34} textAnchor="middle" fontSize={10} fontWeight={500} fill={CE}>Fast: 1.5 RTT</text>
        <rect x={240} y={52} width={90} height={28} rx={4} fill={`${CA}10`} stroke={CA} strokeWidth={0.8} />
        <text x={285} y={70} textAnchor="middle" fontSize={10} fontWeight={500} fill={CA}>Slow: 2.5 RTT</text>
      </motion.g>
    </svg>
  );
}

export function LanesStep() {
  const lanes = ['Lane 1', 'Lane 2', 'Lane 3'];
  return (
    <svg viewBox="0 0 440 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.g {...fade(0.2)}>
        <rect x={15} y={8} width={200} height={84} rx={5} fill={`${CE}06`} stroke={CE} strokeWidth={1.2} />
        <text x={115} y={24} textAnchor="middle" fontSize={10} fontWeight={600} fill={CE}>Lanes (Data)</text>
        <line x1={25} y1={30} x2={205} y2={30} stroke={CE} strokeWidth={0.3} opacity={0.3} />
      </motion.g>
      {lanes.map((l, i) => (
        <motion.g key={i} {...slide(0.4 + i * 0.2)}>
          <rect x={25} y={36 + i * 18} width={180} height={14} rx={3} fill={`${CE}10`} stroke={CE} strokeWidth={0.4} />
          <text x={115} y={47 + i * 18} textAnchor="middle" fontSize={10} fill={CE}>{l} — DAG 병렬 전파</text>
        </motion.g>
      ))}
      <motion.g {...fade(1.0)}>
        <rect x={240} y={20} width={185} height={60} rx={4} fill="var(--background)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={332} y={38} textAnchor="middle" fontSize={10} fontWeight={500} fill="var(--foreground)">비동기 데이터 전파</text>
        <text x={332} y={54} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">Reliable Broadcast로 가용성 보장</text>
        <text x={332} y={70} textAnchor="middle" fontSize={10} fill={CE}>Highway 장애와 독립적으로 동작</text>
      </motion.g>
    </svg>
  );
}

export function RideSharingStep() {
  return (
    <svg viewBox="0 0 440 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {/* Lane car with piggybacked consensus msg */}
      <motion.g {...fade(0.2)}>
        <rect x={30} y={20} width={160} height={60} rx={5} fill={`${CE}08`} stroke={CE} strokeWidth={0.8} />
        <text x={110} y={38} textAnchor="middle" fontSize={9} fontWeight={500} fill={CE}>Lane Car (데이터)</text>
        <rect x={40} y={46} width={140} height={26} rx={3} fill={`${CV}12`} stroke={CV} strokeWidth={0.8} />
        <text x={110} y={63} textAnchor="middle" fontSize={10} fontWeight={500} fill={CV}>+ 합의 메시지 (피기백)</text>
      </motion.g>
      <motion.g {...slide(0.6)}>
        <line x1={190} y1={50} x2={230} y2={50} stroke={CA} strokeWidth={1} markerEnd="url(#abA)" />
      </motion.g>
      <motion.g {...slide(0.8)}>
        <rect x={240} y={14} width={185} height={72} rx={4} fill="var(--background)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={332} y={32} textAnchor="middle" fontSize={10} fontWeight={500} fill="var(--foreground)">Ride-Sharing 효과</text>
        <text x={332} y={50} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">별도 합의 메시지 전송 불필요</text>
        <text x={332} y={66} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">데이터 전파와 합의가 동시 진행</text>
        <text x={332} y={80} textAnchor="middle" fontSize={10} fill={CA}>통신 오버헤드 최소화</text>
      </motion.g>
      <defs>
        <marker id="abA" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={4} markerHeight={4} orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={CA} />
        </marker>
      </defs>
    </svg>
  );
}
