import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = { law: '#6366f1', type: '#ef4444', judge: '#f59e0b', ok: '#10b981' };

const STEPS = [
  { label: '3가지 보고 대상 유형', body: '불법재산 의심 / 자금세탁행위 의심 / 공중협박자금(테러) 의심. 특금법 제4조.' },
  { label: '"합리적 의심"의 기준', body: '확정 증거는 아니지만 종합적으로 "일반 거래로 보기 어렵다"는 수준. 너무 높으면 미탐, 너무 낮으면 과탐.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#ro-arrow)" />;
}

export default function ReportingObligationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ro-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.law}>특금법 제4조 — 3가지 보고 대상</text>
              <ModuleBox x={150} y={25} w={180} h={36} label="특금법 제4조" sub="의심거래 보고 의무" color={C.law} />
              <Arrow x1={200} y1={61} x2={90} y2={82} color={C.type} />
              <Arrow x1={240} y1={61} x2={240} y2={82} color={C.type} />
              <Arrow x1={280} y1={61} x2={390} y2={82} color={C.type} />
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <ActionBox x={15} y={85} w={150} h={42} label="불법재산 의심" sub="사기·횡령·마약 수익" color={C.type} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <ActionBox x={175} y={85} w={130} h={42} label="자금세탁행위 의심" sub="출처 은닉·위장" color={C.type} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                <ActionBox x={315} y={85} w={150} h={42} label="공중협박자금 의심" sub="테러자금 조달" color={C.type} />
              </motion.g>
              <rect x={60} y={145} width={360} height={26} rx={5} fill={`${C.law}06`} stroke={C.law} strokeWidth={0.5} />
              <text x={240} y={162} textAnchor="middle" fontSize={9} fill={C.law}>
                "금융회사등"에 VASP 포함 (특금법 제2조)
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.judge}>"합리적 의심(합당한 근거)"의 기준</text>
              {/* Scale */}
              <rect x={40} y={40} width={400} height={10} rx={5} fill="var(--border)" opacity={0.3} />
              {/* Low threshold */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <rect x={40} y={40} width={130} height={10} rx={5} fill={`${C.ok}30`} />
                <text x={105} y={65} textAnchor="middle" fontSize={8} fill={C.ok}>기준 너무 낮음</text>
                <text x={105} y={78} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">과탐: 보고 폭증</text>
              </motion.g>
              {/* Right threshold */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
                <rect x={180} y={38} width={120} height={14} rx={5} fill={`${C.judge}30`} stroke={C.judge} strokeWidth={0.7} />
                <text x={240} y={65} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.judge}>적정 수준</text>
                <text x={240} y={78} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">"일반 거래로 보기 어렵다"</text>
              </motion.g>
              {/* High threshold */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <rect x={310} y={40} width={130} height={10} rx={5} fill={`${C.type}30`} />
                <text x={375} y={65} textAnchor="middle" fontSize={8} fill={C.type}>기준 너무 높음</text>
                <text x={375} y={78} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">미탐: 세탁 거래 놓침</text>
              </motion.g>
              {/* Judgment basis */}
              <text x={240} y={102} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">판단 근거</text>
              {[
                { label: 'FDS 경보 매칭', x: 20 },
                { label: 'CDD 불일치', x: 130 },
                { label: '온체인 분석', x: 240 },
                { label: '행동 패턴', x: 350 },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + 0.1 * i }}>
                  <DataBox x={item.x} y={110} w={100} h={26} label={item.label} color={C.judge} />
                </motion.g>
              ))}
              <AlertBox x={60} y={150} w={360} h={30} label="확정 증거 불필요" sub="합리적 의심만으로 보고 의무 발생 — 수사는 FIU와 수사기관 몫" color={C.type} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
