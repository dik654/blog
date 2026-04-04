import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '키 파생 구조: KM Root -> Runtime -> Contract -> 용도별 키' },
  { label: '키 요청 흐름: 컴퓨트 워커 -> 키 매니저 -> EVM 실행' },
];
const ANNOT = ['SGX EGETKEY → HKDF 파생', 'CallGetOrCreateKey 요청'];

const DERIVE = [
  { label: 'KM Root Secret', sub: 'SGX EGETKEY 봉인', color: '#a855f7' },
  { label: 'Runtime Secret', sub: 'HKDF(runtime_id)', color: '#6366f1' },
  { label: 'Contract Secret', sub: 'HKDF(contract_addr)', color: '#3b82f6' },
  { label: 'AES / X25519 / Ed25519', sub: '상태 암호화 / Tx 복호화 / 서명', color: '#10b981' },
];

const FLOW = [
  { from: '컴퓨트 워커', to: '키 매니저', color: '#10b981' },
  { from: '키 매니저', to: 'Intel PCS', color: '#8b5cf6' },
  { from: '키 매니저', to: '컴퓨트 워커', color: '#f59e0b' },
  { from: '컴퓨트 워커', to: 'EVM', color: '#0ea5e9' },
];

export default function KMTrustViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && DERIVE.map((d, i) => (
            <g key={d.label}>
              {i > 0 && (
                <motion.line x1={190} y1={i * 50 - 5} x2={190} y2={i * 50 + 10}
                  stroke={d.color} strokeWidth={1.5} strokeDasharray="3,3"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: i * 0.12 }} />
              )}
              <motion.rect x={70} y={10 + i * 50} width={240} height={36} rx={7}
                fill={`${d.color}15`} stroke={d.color} strokeWidth={1.5}
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ delay: i * 0.1, duration: 0.3 }} style={{ originX: 0.5 }} />
              <text x={90} y={28 + i * 50} fontSize={10} fontWeight={600} fill={d.color}>{d.label}</text>
              <text x={90} y={40 + i * 50} fontSize={10} fill="var(--muted-foreground)">{d.sub}</text>
            </g>
          ))}

          {step === 1 && FLOW.map((f, i) => {
            const y = 25 + i * 48;
            return (
              <g key={i}>
                <motion.rect x={20} y={y} width={340} height={34} rx={6}
                  fill={`${f.color}10`} stroke={f.color} strokeWidth={1.5}
                  initial={{ x: -20, opacity: 0 }} animate={{ x: 20, opacity: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.3 }} />
                <text x={35} y={y + 15} fontSize={10} fontWeight={600} fill={f.color}>{f.from}</text>
                <motion.line x1={130} y1={y + 17} x2={210} y2={y + 17}
                  stroke={f.color} strokeWidth={1.5}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: i * 0.1 + 0.2 }} />
                <polygon points={`${210},${y + 14} ${216},${y + 17} ${210},${y + 20}`} fill={f.color} />
                <text x={220} y={y + 15} fontSize={10} fontWeight={600} fill={f.color}>{f.to}</text>
                {/* moving dot */}
                <motion.circle r={4} cy={y + 17} fill={f.color}
                  initial={{ cx: 130 }} animate={{ cx: 210 }}
                  transition={{ delay: i * 0.15, duration: 0.6, repeat: Infinity, repeatDelay: 0.8 }} />
              </g>
            );
          })}
          <motion.text x={385} y={105} fontSize={10} fill="var(--foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
