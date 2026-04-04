import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { cfg: '#6366f1', assign: '#10b981', stack: '#f59e0b', bus: '#ec4899' };

const STEPS = [
  { label: 'Configure: 제약 시스템에 게이트/룩업 등록', body: 'ExecutionGadget::configure(cb)로 열, 게이트, 룩업 규칙을 ConstraintSystem에 등록합니다.' },
  { label: 'Assign: 실제 값(증인) 셀에 기입', body: 'assign_exec_step()에서 EVM 실행 트레이스의 실제 값을 회로 셀에 할당합니다.' },
  { label: 'ADD 오퍼코드: 스택 Pop/Push 동작', body: 'pop(a), pop(b), push(a+b). 각 연산이 RwTable 룩업과 rw_counter를 증가시킵니다.' },
  { label: 'bus-mapping: ExecStep → 회로 입력', body: 'EVM 실행 트레이스를 ExecStep으로 변환 후 assign_exec_step에서 회로에 기입합니다.' },
];

const BW = 90, BH = 40;

export default function GadgetLifecycleViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 440 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="gl-a" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
          {/* Configure box */}
          <motion.g animate={{ opacity: step >= 0 ? 1 : 0.2 }}>
            <rect x={20} y={30} width={BW} height={BH} rx={7}
              fill={C.cfg + '18'} stroke={C.cfg} strokeWidth={step === 0 ? 2.5 : 1} />
            <text x={65} y={47} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.cfg}>Configure</text>
            <text x={65} y={60} textAnchor="middle" fontSize={6.5} fill="var(--muted-foreground)">게이트/룩업</text>
          </motion.g>
          {/* Assign box */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}>
              <line x1={110} y1={50} x2={140} y2={50}
                stroke="var(--muted-foreground)" strokeWidth={1} markerEnd="url(#gl-a)" />
              <rect x={145} y={30} width={BW} height={BH} rx={7}
                fill={C.assign + '18'} stroke={C.assign} strokeWidth={step === 1 ? 2.5 : 1} />
              <text x={190} y={47} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.assign}>Assign</text>
              <text x={190} y={60} textAnchor="middle" fontSize={6.5} fill="var(--muted-foreground)">증인 기입</text>
            </motion.g>
          )}
          {/* Stack operations */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              {[
                { label: 'pop(a)', y: 90, dir: '↑' },
                { label: 'pop(b)', y: 110, dir: '↑' },
                { label: 'push(a+b)', y: 130, dir: '↓' },
              ].map((op, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}>
                  <text x={30} y={op.y + 10} fontSize={9} fill={C.stack} fontWeight={600}>{op.dir}</text>
                  <rect x={45} y={op.y} width={110} height={18} rx={4}
                    fill={C.stack + '15'} stroke={C.stack} strokeWidth={1} />
                  <text x={100} y={op.y + 12} textAnchor="middle" fontSize={7.5} fill={C.stack}>{op.label}</text>
                  <text x={170} y={op.y + 12} fontSize={6.5} fill="var(--muted-foreground)">rw_counter++</text>
                </motion.g>
              ))}
              {/* RwTable */}
              <rect x={250} y={95} width={70} height={30} rx={5}
                fill={C.stack + '10'} stroke={C.stack} strokeWidth={1} strokeDasharray="3 2" />
              <text x={285} y={114} textAnchor="middle" fontSize={9} fill={C.stack}>RwTable</text>
              <line x1={230} y1={110} x2={250} y2={110}
                stroke={C.stack} strokeWidth={0.8} strokeDasharray="3 2" />
            </motion.g>
          )}
          {/* bus-mapping */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}>
              <rect x={300} y={30} width={120} height={BH} rx={7}
                fill={C.bus + '18'} stroke={C.bus} strokeWidth={1.5} />
              <text x={360} y={47} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.bus}>bus-mapping</text>
              <text x={360} y={60} textAnchor="middle" fontSize={6.5} fill="var(--muted-foreground)">ExecStep 변환</text>
              <line x1={235} y1={50} x2={300} y2={50}
                stroke={C.bus} strokeWidth={1} markerEnd="url(#gl-a)" strokeDasharray="3 2" />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
