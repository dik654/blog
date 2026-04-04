import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'VM 생성: Docker Compose -> TDX TD 시작' },
  { label: 'TDX Quote: 하드웨어 증명 생성 (ECDSA-P256)' },
  { label: 'KMS 검증: Intel PCS 조회 + 화이트리스트 대조' },
  { label: '키 발급 & 복호화: 앱 키로 디스크/환경 복호화' },
];

const ANNOT = ['Compose 제출 -> TD 생성', 'TDX SEAM Quote ECDSA 서명', 'Intel PCS TCB 검증', 'HKDF App Keys 파생 발급'];
const ACTORS = [
  { label: 'User', x: 30, y: 25, color: '#94a3b8' },
  { label: 'VMM', x: 100, y: 25, color: '#6366f1' },
  { label: 'TDX HW', x: 190, y: 25, color: '#ec4899' },
  { label: 'Agent', x: 260, y: 25, color: '#10b981' },
  { label: 'KMS', x: 330, y: 25, color: '#f59e0b' },
];

const MSGS = [
  [{ from: 0, to: 1, label: 'Compose' }, { from: 1, to: 2, label: 'TD 생성' }],
  [{ from: 3, to: 2, label: 'get_quote' }, { from: 2, to: 3, label: 'Quote' }],
  [{ from: 3, to: 4, label: 'get_app_key(quote)' }],
  [{ from: 4, to: 3, label: 'App Keys' }],
];

export default function TrustFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Actors */}
          {ACTORS.map(a => (
            <g key={a.label}>
              <rect x={a.x - 25} y={a.y} width={50} height={20} rx={4}
                fill={`${a.color}15`} stroke={a.color} strokeWidth={1} />
              <text x={a.x} y={a.y + 14} textAnchor="middle" fontSize={10} fontWeight={600} fill={a.color}>{a.label}</text>
              <line x1={a.x} y1={a.y + 20} x2={a.x} y2={175} stroke="var(--border)" strokeWidth={1} strokeDasharray="2,2" />
            </g>
          ))}
          {/* Messages */}
          {MSGS.map((group, si) => group.map((m, mi) => {
            const active = si === step;
            const done = si < step;
            const y = 60 + si * 30 + mi * 14;
            const x1 = ACTORS[m.from].x;
            const x2 = ACTORS[m.to].x;
            const clr = ACTORS[m.from].color;
            return (
              <g key={`${si}-${mi}`}>
                <motion.line x1={x1} y1={y} x2={x2} y2={y}
                  stroke={clr} strokeWidth={active ? 2 : 1}
                  animate={{ opacity: active ? 1 : done ? 0.3 : 0.08 }} />
                <motion.polygon
                  points={x2 > x1 ? `${x2 - 4},${y - 3} ${x2},${y} ${x2 - 4},${y + 3}` : `${x2 + 4},${y - 3} ${x2},${y} ${x2 + 4},${y + 3}`}
                  fill={clr} animate={{ opacity: active ? 1 : done ? 0.3 : 0.08 }} />
                <text x={(x1 + x2) / 2} y={y - 4} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={active ? clr : 'var(--muted-foreground)'} opacity={active ? 1 : done ? 0.4 : 0.1}>
                  {m.label}
                </text>
                {active && (
                  <motion.circle r={3} cy={y} fill={clr}
                    initial={{ cx: x1 }} animate={{ cx: x2 }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.3 }} />
                )}
              </g>
            );
          }))}
                  <motion.text x={385} y={90} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
