import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const STEPS = [
  { label: 'Total Order Broadcast', body: '모든 정상 프로세스가 동일한 순서로 메시지를 수신하는 브로드캐스트 원시(primitive).' },
  { label: '메시지 브로드캐스트', body: '프로세스 P1이 m1, P2가 m2를 브로드캐스트한다. 네트워크 지연은 제각각.' },
  { label: '순서 합의', body: 'TOB 프로토콜이 전체 순서를 결정한다. 예: m1 → m2.' },
  { label: '동일 순서 전달', body: '모든 프로세스가 m1 → m2 순서로 전달받는다. 순서가 뒤바뀌는 프로세스는 없다.' },
];

const PROCS = ['P1', 'P2', 'P3'];
const Y = [35, 70, 105];

export default function TotalOrderViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Process labels */}
          {PROCS.map((p, i) => (
            <text key={p} x={25} y={Y[i] + 5} fontSize={10} fontWeight={500} fill={C1}>{p}</text>
          ))}
          {/* Timeline lines */}
          {Y.map((y, i) => (
            <line key={i} x1={50} y1={y} x2={400} y2={y} stroke="var(--border)" strokeWidth={0.6} />
          ))}
          {/* Messages */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* m1 from P1 */}
              <circle cx={100} cy={Y[0]} r={6} fill={`${C3}20`} stroke={C3} strokeWidth={1} />
              <text x={100} y={Y[0] + 3} textAnchor="middle" fontSize={10} fontWeight={500} fill={C3}>m1</text>
              {/* m2 from P2 */}
              <circle cx={130} cy={Y[1]} r={6} fill={`${C2}20`} stroke={C2} strokeWidth={1} />
              <text x={130} y={Y[1] + 3} textAnchor="middle" fontSize={10} fontWeight={500} fill={C2}>m2</text>
            </motion.g>
          )}
          {/* Order decided */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={170} y={20} width={70} height={110} rx={5} fill={`${C1}06`} stroke={C1} strokeWidth={0.8} strokeDasharray="3,2" />
              <text x={205} y={15} textAnchor="middle" fontSize={10} fill={C1}>순서 합의</text>
            </motion.g>
          )}
          {/* Delivered in order */}
          {step >= 3 && PROCS.map((_, i) => (
            <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, type: 'spring', bounce: 0.2 }}>
              <circle cx={300} cy={Y[i]} r={6} fill={`${C3}20`} stroke={C3} strokeWidth={0.8} />
              <text x={300} y={Y[i] + 3} textAnchor="middle" fontSize={10} fill={C3}>m1</text>
              <circle cx={340} cy={Y[i]} r={6} fill={`${C2}20`} stroke={C2} strokeWidth={0.8} />
              <text x={340} y={Y[i] + 3} textAnchor="middle" fontSize={10} fill={C2}>m2</text>
              <text x={370} y={Y[i] + 3} fontSize={10} fill="var(--muted-foreground)">✓</text>
            </motion.g>
          ))}
        </svg>
      )}
    </StepViz>
  );
}
