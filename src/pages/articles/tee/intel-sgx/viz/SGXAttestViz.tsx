import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'EREPORT: 로컬 증명 보고서 생성 (432B)' },
  { label: 'QE3: ECDSA-P256 Quote로 변환' },
  { label: 'DCAP: Intel PCS에서 PCK 체인 검증' },
];

const ANNOT = ['CMAC 태그 128-bit 첨부', 'PCK로 ECDSA-P256 서명', 'PCK → Root CA 체인 검증'];
const ACTORS = [
  { label: '앱 엔클레이브', x: 55, color: '#6366f1' },
  { label: 'QE3', x: 190, color: '#10b981' },
  { label: '원격 검증자', x: 330, color: '#f59e0b' },
];

export default function SGXAttestViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Actors */}
          {ACTORS.map((a) => (
            <g key={a.label}>
              <rect x={a.x - 40} y={10} width={80} height={26} rx={5}
                fill={`${a.color}15`} stroke={a.color} strokeWidth={1.5} />
              <text x={a.x} y={27} textAnchor="middle" fontSize={10} fontWeight={600} fill={a.color}>{a.label}</text>
              <line x1={a.x} y1={36} x2={a.x} y2={170} stroke="var(--border)" strokeWidth={1} strokeDasharray="3,3" />
            </g>
          ))}
          {/* Step arrows */}
          {[0, 1, 2].map(i => {
            const active = i === step;
            const done = i < step;
            const y = 60 + i * 40;
            const x1 = ACTORS[i].x;
            const x2 = ACTORS[Math.min(i + 1, 2)].x;
            const lbl = ['REPORT', 'Quote', 'Verify'][i];
            const clr = ACTORS[i].color;
            return (
              <g key={i}>
                <motion.line x1={x1} y1={y} x2={x2} y2={y}
                  stroke={clr} strokeWidth={active ? 2.5 : 1}
                  animate={{ opacity: active ? 1 : done ? 0.35 : 0.12 }}
                  transition={{ duration: 0.3 }} />
                <motion.polygon
                  points={`${x2 - 6},${y - 4} ${x2},${y} ${x2 - 6},${y + 4}`}
                  fill={clr} animate={{ opacity: active ? 1 : done ? 0.35 : 0.12 }} />
                <text x={(x1 + x2) / 2} y={y - 6} textAnchor="middle" fontSize={10}
                  fontWeight={600} fill={active ? clr : 'var(--muted-foreground)'}
                  opacity={active ? 1 : done ? 0.5 : 0.25}>{lbl}</text>
                {active && (
                  <motion.circle r={6} cy={y} fill={clr}
                    initial={{ cx: x1 }} animate={{ cx: x2 }}
                    transition={{ duration: 0.7, repeat: Infinity, repeatDelay: 0.4 }} />
                )}
              </g>
            );
          })}
          {/* Result badge on last step */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}>
              <rect x={280} y={145} width={90} height={22} rx={5} fill="#10b98120" stroke="#10b981" />
              <text x={325} y={160} textAnchor="middle" fontSize={10} fontWeight={600} fill="#10b981">Trusted</text>
            </motion.g>
          )}
                  <motion.text x={405} y={90} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
