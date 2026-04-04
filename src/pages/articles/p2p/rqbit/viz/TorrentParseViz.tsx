import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'Bencode 디코딩: Serde 역직렬화' },
  { label: 'TorrentMetadata 구성: 파일 정보 추출' },
  { label: 'Info Hash 계산: SHA-1 of info dict' },
  { label: 'ManagedTorrent 생성: 상태 머신 초기화' },
];

const ANNOT = ['Bencode Serde 역직렬화', '파일 정보+피스 길이 추출', 'info dict SHA-1 해시', 'ManagedTorrent 상태 초기화'];
const P = [
  { label: '.torrent', color: '#f59e0b', icon: 'B' },
  { label: 'Metadata', color: '#3b82f6', icon: 'M' },
  { label: 'InfoHash', color: '#10b981', icon: 'H' },
  { label: 'Torrent', color: '#6366f1', icon: 'T' },
];

export default function TorrentParseViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <line x1={40} y1={60} x2={320} y2={60} stroke="var(--border)" strokeWidth={1.5} />
          {P.map((s, i) => {
            const cx = 55 + i * 88;
            const active = i === step;
            return (
              <g key={s.label}>
                <motion.circle cx={cx} cy={60} r={22}
                  fill={active ? `${s.color}25` : i < step ? `${s.color}15` : `${s.color}06`}
                  stroke={active ? s.color : `${s.color}40`}
                  strokeWidth={active ? 2.5 : 1}
                  animate={{ scale: active ? 1.15 : 1 }}
                  transition={{ duration: 0.3 }} />
                <text x={cx} y={57} textAnchor="middle" fontSize={13} fontWeight={600}
                  fill={active ? s.color : 'var(--muted-foreground)'}>{s.icon}</text>
                <text x={cx} y={70} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)">{i + 1}</text>
                <text x={cx} y={100} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={active ? s.color : 'var(--muted-foreground)'}>{s.label}</text>
              </g>
            );
          })}
          <motion.g animate={{ x: step * 88 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}>
            <circle cx={55} cy={130} r={9} fill={P[step].color} />
            <text x={55} y={133} textAnchor="middle" fontSize={10} fontWeight={600} fill="white">P</text>
          </motion.g>
                  <motion.text x={365} y={80} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
