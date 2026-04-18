import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = { high: '#ef4444', med: '#f59e0b', low: '#10b981', ctrl: '#3b82f6', base: '#6366f1' };

const STEPS = [
  { label: '위험 등급 산출', body: '발생 가능성(1~5) x 영향도(1~5) = 위험 점수. 1~8 저 / 9~15 중 / 16~25 고.' },
  { label: '잔여위험 = 고유위험 - 통제효과', body: '통제(CDD, 모니터링 등)를 적용한 후 남는 위험이 잔여위험. 경영진이 수용 가능 여부 판단.' },
  { label: '실제 계산 예시', body: '프라이버시 코인: 고유 16점(고) → 취급 금지 통제(-12) → 잔여 4점(저). 통제가 위험을 변환.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#rr-arrow)" />;
}

export default function ResidualRiskViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="rr-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">위험 등급 산출 공식</text>
              {/* Formula */}
              <DataBox x={30} y={35} w={120} h={36} label="발생 가능성" color={C.base} />
              <text x={168} y={57} textAnchor="middle" fontSize={16} fontWeight={700} fill="var(--foreground)">x</text>
              <DataBox x={186} y={35} w={100} h={36} label="영향도" color={C.base} />
              <text x={303} y={57} textAnchor="middle" fontSize={16} fontWeight={700} fill="var(--foreground)">=</text>
              <ModuleBox x={320} y={35} w={140} h={36} label="위험 점수" sub="(1~25)" color={C.high} />

              {/* Scale */}
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <rect x={40} y={95} width={130} height={28} rx={5} fill={`${C.low}15`} stroke={C.low} strokeWidth={0.7} />
                <text x={105} y={113} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.low}>1~8: 저위험</text>
                <rect x={180} y={95} width={130} height={28} rx={5} fill={`${C.med}15`} stroke={C.med} strokeWidth={0.7} />
                <text x={245} y={113} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.med}>9~15: 중위험</text>
                <rect x={320} y={95} width={130} height={28} rx={5} fill={`${C.high}15`} stroke={C.high} strokeWidth={0.7} />
                <text x={385} y={113} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.high}>16~25: 고위험</text>
              </motion.g>

              <text x={240} y={148} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">
                평가 기준표(scoring criteria) 사전 문서화 + 복수 평가자 합의 필수
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">잔여위험 산출</text>
              {/* Formula */}
              <ModuleBox x={15} y={35} w={140} h={40} label="고유위험" sub="Inherent Risk" color={C.high} />
              <text x={172} y={60} textAnchor="middle" fontSize={16} fontWeight={700} fill="var(--foreground)">-</text>
              <ActionBox x={190} y={35} w={140} h={40} label="통제효과" sub="Control Effectiveness" color={C.ctrl} />
              <text x={347} y={60} textAnchor="middle" fontSize={16} fontWeight={700} fill="var(--foreground)">=</text>
              <DataBox x={365} y={38} w={100} h={34} label="잔여위험" color={C.low} />

              {/* Control examples */}
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <text x={240} y={100} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">통제 수단 예시</text>
                <rect x={30} y={108} width={90} height={22} rx={4} fill={`${C.ctrl}10`} stroke={C.ctrl} strokeWidth={0.5} />
                <text x={75} y={123} textAnchor="middle" fontSize={8} fill={C.ctrl}>CDD/EDD</text>
                <rect x={130} y={108} width={90} height={22} rx={4} fill={`${C.ctrl}10`} stroke={C.ctrl} strokeWidth={0.5} />
                <text x={175} y={123} textAnchor="middle" fontSize={8} fill={C.ctrl}>FDS 모니터링</text>
                <rect x={230} y={108} width={90} height={22} rx={4} fill={`${C.ctrl}10`} stroke={C.ctrl} strokeWidth={0.5} />
                <text x={275} y={123} textAnchor="middle" fontSize={8} fill={C.ctrl}>취급 금지</text>
                <rect x={330} y={108} width={120} height={22} rx={4} fill={`${C.ctrl}10`} stroke={C.ctrl} strokeWidth={0.5} />
                <text x={390} y={123} textAnchor="middle" fontSize={8} fill={C.ctrl}>경영진 승인 필수</text>
              </motion.g>

              <AlertBox x={80} y={145} w={320} h={35} label="수용 가능 수준(Risk Appetite)" sub="잔여위험이 초과하면: 추가 통제 도입 또는 서비스 중단" color={C.high} />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">실제 예시: 프라이버시 코인</text>
              {/* Inherent */}
              <rect x={25} y={35} width={100} height={50} rx={6} fill={`${C.high}12`} stroke={C.high} strokeWidth={0.7} />
              <text x={75} y={55} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.high}>고유위험</text>
              <text x={75} y={72} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.high}>16점</text>
              <text x={75} y={98} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">가능성 4 x 영향 4</text>

              {/* Control */}
              <Arrow x1={125} y1={60} x2={165} y2={60} color={C.ctrl} />
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                <rect x={168} y={35} width={120} height={50} rx={6} fill={`${C.ctrl}12`} stroke={C.ctrl} strokeWidth={0.7} />
                <text x={228} y={55} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.ctrl}>통제: 취급 금지</text>
                <text x={228} y={72} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.ctrl}>-12</text>
              </motion.g>

              {/* Residual */}
              <Arrow x1={288} y1={60} x2={320} y2={60} color={C.low} />
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <rect x={323} y={35} width={130} height={50} rx={6} fill={`${C.low}12`} stroke={C.low} strokeWidth={0.7} />
                <text x={388} y={55} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.low}>잔여위험</text>
                <text x={388} y={72} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.low}>4점 (저)</text>
              </motion.g>

              {/* OTC comparison */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                <text x={240} y={118} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">비교: OTC 거래</text>
                <rect x={30} y={128} width={80} height={28} rx={4} fill={`${C.high}10`} stroke={C.high} strokeWidth={0.5} />
                <text x={70} y={146} textAnchor="middle" fontSize={8} fill={C.high}>고유 16(고)</text>
                <text x={125} y={146} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">→</text>
                <rect x={140} y={128} width={130} height={28} rx={4} fill={`${C.ctrl}10`} stroke={C.ctrl} strokeWidth={0.5} />
                <text x={205} y={146} textAnchor="middle" fontSize={8} fill={C.ctrl}>대면확인+자금출처(-6)</text>
                <text x={290} y={146} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">→</text>
                <rect x={305} y={128} width={100} height={28} rx={4} fill={`${C.med}10`} stroke={C.med} strokeWidth={0.5} />
                <text x={355} y={146} textAnchor="middle" fontSize={8} fill={C.med}>잔여 10(중)</text>
              </motion.g>

              <text x={240} y={178} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">
                같은 고유위험이라도 통제의 강도에 따라 잔여위험이 달라진다
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
