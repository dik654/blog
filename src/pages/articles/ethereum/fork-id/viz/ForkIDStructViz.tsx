import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'EIP-2124 이전: TCP 연결 후에야 비호환 감지' },
  { label: 'EIP-2124 이후: ENR(UDP)에서 즉시 검증' },
  { label: 'fork_hash: CRC32(genesis) XOR CRC32(fork blocks)', body: '예: CRC32(0xd4e5…cb8fa3) XOR CRC32(1150000) XOR … = 0xfc64ec04' },
  { label: 'fork_next: 다음 예정 포크 블록/타임스탬프', body: 'Cancun 이후: fork_next = 0 (예정 포크 없음). 새 포크 확정 시 갱신.' },
];
const ANNOT = ['TCP+RLPx 후 핸드셰이크', 'ENR(UDP)로 즉시 검증', 'Mainnet: 0xfc64ec04', 'next=0 (예정 포크 없음)'];
const FH_C = '#6366f1', FN_C = '#10b981', OLD_C = '#ef4444';

export default function ForkIDStructViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {['TCP/IP 연결', 'RLPx 암호화', 'eth 핸드셰이크', '종료'].map((s, i) => {
                const x = 30 + i * 90;
                const c = i < 3 ? OLD_C : '#6b7280';
                return (
                  <g key={s}>
                    <rect x={x} y={55} width={80} height={30} rx={6}
                      fill={c + '12'} stroke={c} strokeWidth={1.5} strokeOpacity={0.6} />
                    <text x={x + 40} y={74} textAnchor="middle" fontSize={9} fontWeight={600} fill={c}>{s}</text>
                    {i < 3 && <motion.line x1={x + 80} y1={70} x2={x + 90} y2={70}
                      stroke={c} strokeWidth={1.5} strokeOpacity={0.4}
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * 0.15 }} />}
                  </g>
                );
              })}
              <text x={200} y={110} textAnchor="middle" fontSize={9} fill={OLD_C} fillOpacity={0.5}>
                비호환 피어마다 전체 과정 반복 (슬롯 낭비)
              </text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[{ t: 'ENR 조회', c: FH_C }, { t: 'Fork ID 검증', c: FN_C }].map((s, i) => (
                <g key={s.t}>
                  <rect x={60 + i * 160} y={40} width={120} height={36} rx={8}
                    fill={s.c + '15'} stroke={s.c} strokeWidth={1.5} />
                  <text x={120 + i * 160} y={63} textAnchor="middle" fontSize={10} fontWeight={600} fill={s.c}>{s.t}</text>
                </g>
              ))}
              <motion.line x1={180} y1={58} x2={220} y2={58}
                stroke="currentColor" strokeOpacity={0.3} strokeWidth={1.5}
                markerEnd="url(#fidarr)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <text x={200} y={105} textAnchor="middle" fontSize={9} fill={FN_C} fillOpacity={0.6}>
                UDP만으로 호환성 즉시 판별 (TCP 불필요)
              </text>
            </motion.g>
          )}
          {(step === 2 || step === 3) && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              {/* Fork ID 12-byte struct */}
              <rect x={60} y={35} width={280} height={50} rx={8}
                fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth={1.5} />
              <text x={200} y={30} textAnchor="middle" fontSize={9} fill="currentColor" fillOpacity={0.3}>Fork ID (12 bytes)</text>
              {/* fork_hash */}
              <motion.rect x={65} y={40} width={130} height={40} rx={6}
                fill={FH_C + (step === 2 ? '25' : '0a')} stroke={FH_C}
                strokeWidth={step === 2 ? 2 : 1} strokeOpacity={step === 2 ? 1 : 0.3} />
              <text x={130} y={53} textAnchor="middle" fontSize={9} fontWeight={600} fill={FH_C}>fork_hash</text>
              <text x={130} y={65} textAnchor="middle" fontSize={8} fill={FH_C} fillOpacity={0.6}>4B CRC32</text>
              <text x={130} y={76} textAnchor="middle" fontSize={8} fill={FH_C} fillOpacity={0.5} fontFamily="monospace">0xfc64ec04</text>
              {/* fork_next */}
              <motion.rect x={205} y={40} width={130} height={40} rx={6}
                fill={FN_C + (step === 3 ? '25' : '0a')} stroke={FN_C}
                strokeWidth={step === 3 ? 2 : 1} strokeOpacity={step === 3 ? 1 : 0.3} />
              <text x={270} y={53} textAnchor="middle" fontSize={9} fontWeight={600} fill={FN_C}>fork_next</text>
              <text x={270} y={65} textAnchor="middle" fontSize={8} fill={FN_C} fillOpacity={0.6}>8B uint64</text>
              <text x={270} y={76} textAnchor="middle" fontSize={8} fill={FN_C} fillOpacity={0.5} fontFamily="monospace">0 (no pending fork)</text>
            </motion.g>
          )}
          <defs>
            <marker id="fidarr" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0,0 L7,3.5 L0,7 Z" fill="currentColor" fillOpacity={0.3} />
            </marker>
          </defs>
                  <motion.text x={405} y={80} fontSize={9} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
