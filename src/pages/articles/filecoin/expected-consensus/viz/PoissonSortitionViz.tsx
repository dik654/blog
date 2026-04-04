import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

const STEPS = [
  { label: 'VRF 티켓 생성', body: '이전 티켓 + 비밀키로 VRF 해시 계산\n→ 검증 가능한 난수 생성' },
  { label: '임계값 비교', body: '마이너 파워 비례 임계값과 비교\n→ ticket < threshold 이면 당선' },
  { label: 'WinCount 산출 (Poisson)', body: '포아송 분포로 당선 횟수 결정\nλ = 5 × (마이너 파워 / 전체 파워)' },
  { label: '블록 제출', body: 'WinCount > 0 이면 블록 생성\nWinCount가 높을수록 보상 증가' },
];

const C = ['#6366f1', '#f59e0b', '#10b981', '#8b5cf6'];

export default function PoissonSortitionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Miner node */}
          <rect x={15} y={25} width={90} height={42} rx={6} fill="#6366f115" stroke="#6366f1" strokeWidth={1.5} />
          <text x={60} y={50} textAnchor="middle" fontSize={12} fontWeight={600} fill="#6366f1">Miner</text>

          {/* VRF ticket */}
          {step >= 0 && (
            <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
              <line x1={107} y1={46} x2={138} y2={46} stroke={C[0]} strokeWidth={1.5} markerEnd="url(#ps-arr)" />
              <rect x={140} y={25} width={110} height={42} rx={6}
                fill={C[0] + '15'} stroke={C[0]} strokeWidth={step === 0 ? 2 : 0.8} />
              <text x={195} y={44} textAnchor="middle" fontSize={11} fontWeight={600} fill={C[0]}>VRF Ticket</text>
              <text x={195} y={58} textAnchor="middle" fontSize={10} fill={C[0]} opacity={0.6}>sha(prev + sk)</text>
            </motion.g>
          )}

          {/* Threshold comparison */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
              <line x1={252} y1={46} x2={278} y2={46} stroke={C[1]} strokeWidth={1.5} markerEnd="url(#ps-arr)" />
              <rect x={280} y={25} width={150} height={42} rx={6}
                fill={C[1] + '15'} stroke={C[1]} strokeWidth={step === 1 ? 2 : 0.8} />
              <text x={355} y={44} textAnchor="middle" fontSize={11} fontWeight={600} fill={C[1]}>임계값 비교</text>
              <text x={355} y={58} textAnchor="middle" fontSize={10} fill={C[1]} opacity={0.6}>
                {'ticket < threshold?'}
              </text>
            </motion.g>
          )}

          {/* Poisson WinCount histogram */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={230} y={92} textAnchor="middle" fontSize={11} fontWeight={600} fill={C[2]}>
                Poisson 분포 (λ = 5 × power%)
              </text>
              {[0, 1, 2, 3, 4, 5].map(k => {
                const x = 55 + k * 60;
                const heights = [10, 34, 28, 16, 8, 4];
                const h = heights[k];
                const peak = k === 1;
                return (
                  <g key={k}>
                    <motion.rect x={x} y={155 - h} width={45} height={h} rx={4}
                      fill={C[2]} fillOpacity={peak ? 0.6 : 0.25}
                      stroke={C[2]} strokeWidth={peak ? 1.5 : 0}
                      initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                      style={{ transformOrigin: `${x + 22}px 155px` }}
                      transition={{ delay: k * 0.08 }} />
                    <text x={x + 22} y={170} textAnchor="middle" fontSize={10} fill={C[2]}>k={k}</text>
                  </g>
                );
              })}
            </motion.g>
          )}

          {/* Block submission */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={sp} style={{ transformOrigin: '60px 140px' }}>
              <rect x={15} y={120} width={90} height={36} rx={6}
                fill={C[3] + '20'} stroke={C[3]} strokeWidth={1.5} />
              <text x={60} y={142} textAnchor="middle" fontSize={12} fontWeight={700} fill={C[3]}>Block!</text>
            </motion.g>
          )}

          <defs>
            <marker id="ps-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
