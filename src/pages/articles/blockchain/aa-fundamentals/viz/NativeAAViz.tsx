import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const STEPS = [
  { label: 'ERC-4337 vs Native AA', body: 'ERC-4337은 애플리케이션 레이어. Native AA는 프로토콜 레이어에서 직접 지원.' },
  { label: 'ERC-4337 구조', body: 'User → Bundler(EOA) → EntryPoint(컨트랙트) → Account. 추가 인프라와 가스 오버헤드.' },
  { label: 'Native AA 구조', body: 'User → Mempool → Block. 프로토콜이 직접 validateTransaction() 호출. Bundler 불필요.' },
  { label: '장기 전망', body: 'L2(zkSync, StarkNet)는 Native AA 구현 완료. L1은 EIP-7701로 점진적 도입 예정.' },
];

export default function NativeAAViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* ERC-4337 row */}
          <motion.g animate={{ opacity: step === 1 || step === 0 ? 1 : 0.2 }}>
            <text x={15} y={40} fontSize={10} fontWeight={500} fill={C1}>ERC-4337</text>
            {['User', 'Bundler', 'EntryPoint', 'Account'].map((label, i) => (
              <g key={label}>
                <rect x={75 + i * 85} y={25} width={70} height={22} rx={4}
                  fill={`${C1}08`} stroke={C1} strokeWidth={0.7} />
                <text x={110 + i * 85} y={40} textAnchor="middle" fontSize={10} fill={C1}>{label}</text>
                {i < 3 && <line x1={145 + i * 85} y1={36} x2={155 + i * 85} y2={36}
                  stroke={C1} strokeWidth={0.5} />}
              </g>
            ))}
          </motion.g>
          {/* Native AA row */}
          <motion.g animate={{ opacity: step >= 2 ? 1 : (step === 0 ? 0.5 : 0.2) }}>
            <text x={15} y={85} fontSize={10} fontWeight={500} fill={C2}>Native AA</text>
            {['User', 'Mempool', 'Block'].map((label, i) => (
              <g key={label}>
                <rect x={75 + i * 120} y={70} width={80} height={22} rx={4}
                  fill={`${C2}${step >= 2 ? '12' : '06'}`} stroke={C2}
                  strokeWidth={step >= 2 ? 1.2 : 0.6} />
                <text x={115 + i * 120} y={85} textAnchor="middle" fontSize={10} fontWeight={step >= 2 ? 500 : 400} fill={C2}>{label}</text>
                {i < 2 && <line x1={155 + i * 120} y1={81} x2={195 + i * 120} y2={81}
                  stroke={C2} strokeWidth={0.5} />}
              </g>
            ))}
            {step >= 2 && (
              <motion.text x={295} y={98} fontSize={10} fill={C2}
                initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>
                Bundler 불필요
              </motion.text>
            )}
          </motion.g>
          {/* Comparison */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[
                { label: 'zkSync', x: 100 },
                { label: 'StarkNet', x: 210 },
                { label: 'L1 (EIP-7701)', x: 340 },
              ].map((c, i) => (
                <g key={c.label}>
                  <rect x={c.x - 40} y={110} width={80} height={18} rx={3}
                    fill={`${i < 2 ? C2 : C3}10`} stroke={i < 2 ? C2 : C3} strokeWidth={0.6} />
                  <text x={c.x} y={122} textAnchor="middle" fontSize={10}
                    fill={i < 2 ? C2 : C3}>{c.label}</text>
                </g>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
