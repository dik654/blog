import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'queued: 피어 발견 & 대기열 추가' },
  { label: 'connected: TCP 핸드셰이크 & BitTorrent 핸드셰이크' },
  { label: 'live: Choke/Unchoke & 피스 교환' },
  { label: 'dead/not_needed: 연결 종료' },
];

const ANNOT = ['Tracker Announce 피어 발견', 'TCP+BT 핸드셰이크 연결', 'Choke/Unchoke 피스 교환', '오류 발생 시 연결 종료'];
const PEERS = [
  { x: 50, y: 70, state: 'Q' },
  { x: 130, y: 70, state: 'C' },
  { x: 210, y: 70, state: 'L' },
  { x: 290, y: 70, state: 'D' },
];

export default function PeerConnViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <line x1={50} y1={70} x2={290} y2={70} stroke="var(--border)" strokeWidth={1.5} />
          {PEERS.map((p, i) => {
            const active = i === step;
            const color = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'][i];
            const label = ['queued', 'connected', 'live', 'dead'][i];
            return (
              <g key={label}>
                <motion.circle cx={p.x} cy={p.y} r={18}
                  fill={active ? `${color}25` : `${color}08`}
                  stroke={active ? color : `${color}30`}
                  strokeWidth={active ? 2.5 : 1}
                  animate={{ scale: active ? 1.15 : 1 }}
                  transition={{ duration: 0.3 }} />
                <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={active ? color : 'var(--muted-foreground)'}>{p.state}</text>
                <text x={p.x} y={p.y + 30} textAnchor="middle" fontSize={8} fontWeight={600}
                  fill={active ? color : 'var(--muted-foreground)'}>{label}</text>
              </g>
            );
          })}
          {/* Data flow animation on step 2 */}
          {step === 2 && (
            <>
              <motion.rect x={170} y={115} width={80} height={18} rx={4}
                fill="#10b98120" stroke="#10b981" strokeWidth={1}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
              <text x={210} y={127} textAnchor="middle" fontSize={10} fontWeight={600} fill="#10b981">
                Piece #42
              </text>
              <motion.circle r={5} fill="#10b981"
                animate={{ cx: [170, 250], cy: [125, 125] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }} />
            </>
          )}
                  <motion.text x={365} y={75} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
