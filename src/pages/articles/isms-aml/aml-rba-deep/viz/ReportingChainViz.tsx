import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = { line1: '#10b981', line2: '#f59e0b', line3: '#6366f1', board: '#3b82f6', red: '#ef4444' };

const STEPS = [
  { label: '보고 체계 전체 흐름', body: '1선→2선→위원회→이사회. 3선(감사)은 이사회 직보. "위로 올라가되 중간을 건너뛰지 않는" 구조.' },
  { label: 'ML/TF 위원회 역할', body: '전사 AML/CFT 총괄 의사결정. CEO·CCO·CISO·법무·영업부서장 참여. 분기 1회 정기 + 수시.' },
  { label: '소규모 VASP 현실', body: '30명 미만 시 1선+2선 겸직 허용, 단 3선(감사)만큼은 반드시 독립. 연 1회 외부 감사 필수.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#rpc-arrow)" />;
}

export default function ReportingChainViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="rpc-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">보고 체계 전체 흐름</text>
              {/* Chain */}
              <ActionBox x={10} y={30} w={95} h={36} label="1선 (현업)" sub="일상 보고" color={C.line1} />
              <Arrow x1={105} y1={48} x2={130} y2={48} color={C.line2} />
              <ActionBox x={133} y={30} w={100} h={36} label="2선 (준법)" sub="분기 보고" color={C.line2} />
              <Arrow x1={233} y1={48} x2={258} y2={48} color={C.board} />
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <ActionBox x={261} y={30} w={95} h={36} label="위원회" sub="분기 보고" color={C.board} />
              </motion.g>
              <Arrow x1={356} y1={48} x2={381} y2={48} color={C.board} />
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
                <ModuleBox x={384} y={30} w={85} h={36} label="이사회" sub="" color={C.board} />
              </motion.g>
              {/* 3선 direct */}
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <ActionBox x={170} y={90} w={120} h={36} label="3선 (감사)" sub="연 1회 + 수시" color={C.line3} />
                <Arrow x1={290} y1={108} x2={420} y2={66} color={C.line3} />
                <text x={370} y={85} fontSize={8} fontWeight={600} fill={C.line3}>직보</text>
              </motion.g>
              {/* Summary */}
              <rect x={60} y={145} width={360} height={28} rx={5} fill={`${C.line3}08`} stroke={C.line3} strokeWidth={0.5} />
              <text x={240} y={163} textAnchor="middle" fontSize={9} fill={C.line3}>
                3선 직보 = 2선(CCO) 자체의 부적절 행위를 견제하는 설계
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.board}>ML/TF 위험관리 위원회</text>
              <ModuleBox x={140} y={25} w={200} h={40} label="위원회 (분기 1회)" sub="전사 AML/CFT 최상위 의사결정" color={C.board} />
              {/* Members */}
              {['CEO', 'CCO', 'CISO', '법무', '영업부서장'].map((m, i) => (
                <motion.g key={m} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 * i }}>
                  <rect x={20 + i * 92} y={78} width={80} height={22} rx={4} fill={`${C.board}10`} stroke={C.board} strokeWidth={0.5} />
                  <text x={60 + i * 92} y={93} textAnchor="middle" fontSize={8} fill={C.board}>{m}</text>
                </motion.g>
              ))}
              {/* Decisions */}
              <text x={240} y={120} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">의결 사항</text>
              <DataBox x={20} y={128} w={140} h={26} label="위험평가 결과 승인" color={C.board} />
              <DataBox x={170} y={128} w={140} h={26} label="Risk Appetite 결정" color={C.board} />
              <DataBox x={320} y={128} w={140} h={26} label="정책 개정 + 예산" color={C.board} />
              <text x={240} y={175} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                수시 회의: 중대 사고 / 법규 변경 시 즉시 소집
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">소규모 VASP (30명 미만)</text>
              {/* Merged 1+2 */}
              <rect x={30} y={30} width={200} height={55} rx={8} fill={`${C.line1}06`} stroke={C.line1} strokeWidth={0.7} strokeDasharray="4 2" />
              <text x={130} y={50} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.line1}>1선 + 2선 겸직 허용</text>
              <text x={130} y={66} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">"기능적 분리" — FIU 가이드라인</text>

              {/* 3선 must be independent */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <ModuleBox x={270} y={30} w={180} h={55} label="3선: 반드시 독립" sub="연 1회 외부 감사 필수" color={C.line3} />
              </motion.g>

              {/* Arrow to report */}
              <Arrow x1={360} y1={85} x2={360} y2={115} color={C.line3} />
              <DataBox x={280} y={118} w={160} h={30} label="이사회(또는 주주)에 보고" color={C.line3} />

              {/* Warning */}
              <AlertBox x={40} y={108} w={210} h={40} label="감사인 독립성 확인" sub="동일 법인이 회계 감사 + AML 감사하면 이해 충돌" color={C.red} />

              <text x={240} y={175} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">
                최소 원칙: 감사만큼은 반드시 독립 + 대표이사가 아닌 이사회에 보고
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
