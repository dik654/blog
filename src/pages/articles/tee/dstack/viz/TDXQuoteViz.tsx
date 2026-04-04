import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '① report_data 준비: 공개키/해시 바인딩' },
  { label: '② TDX Quote 생성: SEAM 모듈이 ECDSA-P256 서명' },
  { label: '③ KMS 검증: PCK 체인 + MRTD 화이트리스트' },
  { label: '④ 키 발급: HKDF 파생으로 앱 키 생성' },
];

const ANNOT = ['report_data 공개키 바인딩', 'tdx_guest SEAM Quote 생성', 'Intel PCS PCK 체인 검증', 'HKDF App Key 파생 발급'];
const ACTORS = [
  { label: 'Guest Agent', x: 50, color: '#6366f1' },
  { label: 'SEAM HW', x: 155, color: '#3b82f6' },
  { label: 'KMS', x: 260, color: '#10b981' },
  { label: 'Intel PCS', x: 355, color: '#8b5cf6' },
];

const FLOWS = [
  { from: 0, to: 1, y: 55 },
  { from: 1, to: 0, y: 80 },
  { from: 0, to: 2, y: 105 },
  { from: 2, to: 3, y: 115 },
];

export default function TDXQuoteViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Actors */}
          {ACTORS.map(a => (
            <g key={a.label}>
              <rect x={a.x - 35} y={8} width={70} height={24} rx={5}
                fill={`${a.color}12`} stroke={a.color} strokeWidth={1} />
              <text x={a.x} y={24} textAnchor="middle" fontSize={10} fontWeight={600} fill={a.color}>{a.label}</text>
              <line x1={a.x} y1={32} x2={a.x} y2={165} stroke="var(--border)" strokeWidth={1} strokeDasharray="3,3" />
            </g>
          ))}
          {/* Flow arrows per step */}
          {FLOWS.map((f, i) => {
            const stepIdx = i < 2 ? (i === 0 ? 0 : 1) : (i === 2 ? 2 : 2);
            const active = step >= stepIdx && (i <= step);
            const highlight = (step === 0 && i === 0) || (step === 1 && i === 1) || (step === 2 && (i === 2 || i === 3)) || (step === 3 && i >= 2);
            const clr = ACTORS[f.from].color;
            const x1 = ACTORS[f.from].x;
            const x2 = ACTORS[f.to].x;
            return (
              <g key={i}>
                <motion.line x1={x1} y1={f.y} x2={x2} y2={f.y}
                  stroke={clr} strokeWidth={highlight ? 2.5 : 1}
                  animate={{ opacity: highlight ? 1 : active ? 0.3 : 0.1 }}
                  transition={{ duration: 0.3 }} />
                <motion.polygon
                  points={x2 > x1 ? `${x2 - 5},${f.y - 3} ${x2},${f.y} ${x2 - 5},${f.y + 3}` : `${x2 + 5},${f.y - 3} ${x2},${f.y} ${x2 + 5},${f.y + 3}`}
                  fill={clr} animate={{ opacity: highlight ? 1 : 0.1 }} />
                {highlight && (
                  <motion.circle r={4} cy={f.y} fill={clr}
                    initial={{ cx: x1 }} animate={{ cx: x2 }}
                    transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.3 }} />
                )}
              </g>
            );
          })}
          {/* Key delivery on step 3 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <line x1={260} y1={140} x2={50} y2={140} stroke="#f59e0b" strokeWidth={1.5} />
              <polygon points="55,137 50,140 55,143" fill="#f59e0b" />
              <text x={155} y={135} textAnchor="middle" fontSize={10} fill="#f59e0b" fontWeight={600}>App Keys (HKDF)</text>
              <motion.circle r={4} cy={140} fill="#f59e0b"
                initial={{ cx: 260 }} animate={{ cx: 50 }}
                transition={{ duration: 0.7, repeat: Infinity, repeatDelay: 0.4 }} />
            </motion.g>
          )}
                  <motion.text x={405} y={85} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
