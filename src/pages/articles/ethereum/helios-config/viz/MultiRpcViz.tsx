import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '기본 RPC에 요청 전송', body: 'consensus_rpc + execution_rpc 우선 사용' },
  { label: '타임아웃 또는 에러 시 fallback 시도', body: 'fallback_rpcs 목록에서 순차적으로 시도' },
  { label: '모든 RPC 실패 시 에러 반환', body: 'Reth: 자체 실행 → 외부 RPC 의존 없음' },
];

const C = { primary: '#6366f1', fallback: '#f59e0b', fail: '#ef4444' };

export default function MultiRpcViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <motion.g key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
            {step === 0 && (
              <g>
                <rect x={50} y={45} width={130} height={40} rx={8} fill={C.primary + '15'} stroke={C.primary} strokeWidth={1.5} />
                <text x={115} y={70} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.primary}>Helios</text>
                <motion.line x1={180} y1={65} x2={230} y2={65} stroke={C.primary} strokeWidth={1.5}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
                <rect x={230} y={45} width={200} height={40} rx={8} fill={C.primary + '15'} stroke={C.primary} strokeWidth={2} />
                <text x={330} y={62} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.primary}>Primary RPC</text>
                <text x={330} y={77} textAnchor="middle" fontSize={10} fill={C.primary} fillOpacity={0.6}>consensus + execution</text>
              </g>
            )}
            {step === 1 && (
              <g>
                <rect x={50} y={35} width={130} height={30} rx={6} fill={C.fail + '12'} stroke={C.fail} strokeWidth={1} strokeDasharray="4 2" />
                <text x={115} y={55} textAnchor="middle" fontSize={10} fill={C.fail}>Primary 실패</text>
                {['Fallback 1', 'Fallback 2', 'Fallback 3'].map((t, i) => (
                  <g key={t}>
                    <rect x={220} y={25 + i * 32} width={130} height={26} rx={6}
                      fill={C.fallback + '15'} stroke={C.fallback} strokeWidth={1} />
                    <text x={285} y={42 + i * 32} textAnchor="middle" fontSize={10} fontWeight={500} fill={C.fallback}>{t}</text>
                  </g>
                ))}
              </g>
            )}
            {step === 2 && (
              <g>
                <rect x={60} y={40} width={160} height={50} rx={8} fill={C.fail + '12'} stroke={C.fail} strokeWidth={1.5} />
                <text x={140} y={60} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.fail}>모든 RPC 실패</text>
                <text x={140} y={78} textAnchor="middle" fontSize={10} fill={C.fail} fillOpacity={0.6}>에러 반환</text>
                <rect x={260} y={40} width={170} height={50} rx={8} fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={1.5} />
                <text x={345} y={60} textAnchor="middle" fontSize={10} fontWeight={600} fill="#10b981">Reth (풀노드)</text>
                <text x={345} y={78} textAnchor="middle" fontSize={10} fill="#10b981" fillOpacity={0.6}>자체 실행 → 항상 가용</text>
              </g>
            )}
          </motion.g>
          <text x={240} y={125} textAnchor="middle" fontSize={10} fill="currentColor" fillOpacity={0.4}>
            {['기본 RPC 우선', '순차적 fallback 시도', '가용성: 풀노드 > 경량 클라이언트'][step]}
          </text>
        </svg>
      )}
    </StepViz>
  );
}
