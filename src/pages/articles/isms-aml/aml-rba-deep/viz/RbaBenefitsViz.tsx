import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = { eff: '#10b981', flex: '#f59e0b', efct: '#6366f1', red: '#ef4444' };

const STEPS = [
  { label: '효율성 (Efficiency)', body: '저위험 간소화 → 비용 절감, 고위험 EDD 집중 → 통제 강화. 동시에 달성.' },
  { label: '유연성 (Flexibility)', body: '주기적 위험평가 갱신으로 새 토큰·프로토콜·거래 패턴에 유연 대응. 고정 규칙의 한계 극복.' },
  { label: '실효성 (Effectiveness)', body: 'defensive reporting 방지 → FIU가 진짜 의심거래에 집중 → 분석 역량 극대화.' },
];

export default function RbaBenefitsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.eff}>효율성 — 비용 구조 전환</text>
              <DataBox x={20} y={32} w={200} h={34} label="RBA 이전: 균등 배분" color={C.red} />
              {[0, 1, 2, 3].map((i) => (
                <rect key={i} x={30 + i * 50} y={76} width={40} height={20} rx={3} fill={`${C.red}15`} stroke={C.red} strokeWidth={0.5} />
              ))}
              <text x={120} y={112} textAnchor="middle" fontSize={8} fill={C.red}>모든 고객 동일 비용</text>

              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <DataBox x={260} y={32} w={200} h={34} label="RBA 이후: 차등 배분" color={C.eff} />
                <rect x={270} y={76} width={70} height={28} rx={3} fill={`${C.red}15`} stroke={C.red} strokeWidth={0.5} />
                <text x={305} y={94} textAnchor="middle" fontSize={8} fill={C.red}>고위험 EDD</text>
                <rect x={350} y={80} width={50} height={20} rx={3} fill={`${C.flex}15`} stroke={C.flex} strokeWidth={0.5} />
                <text x={375} y={94} textAnchor="middle" fontSize={7} fill={C.flex}>중위험</text>
                <rect x={410} y={84} width={40} height={14} rx={3} fill={`${C.eff}15`} stroke={C.eff} strokeWidth={0.5} />
                <text x={430} y={94} textAnchor="middle" fontSize={7} fill={C.eff}>저</text>
                <text x={360} y={118} textAnchor="middle" fontSize={8} fill={C.eff}>비용 절감 + 통제 강화</text>
              </motion.g>

              <rect x={100} y={140} width={280} height={26} rx={5} fill={`${C.eff}08`} stroke={C.eff} strokeWidth={0.5} />
              <text x={240} y={157} textAnchor="middle" fontSize={9} fill={C.eff}>저위험 간소화 → 고위험에 자원 재투입</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.flex}>유연성 — 변화 대응력</text>
              <ActionBox x={20} y={35} w={100} h={40} label="새 토큰" sub="NFT, 밈코인" color={C.flex} />
              <ActionBox x={130} y={35} w={100} h={40} label="새 프로토콜" sub="크로스체인 브릿지" color={C.flex} />
              <ActionBox x={240} y={35} w={100} h={40} label="새 규제" sub="Travel Rule 확대" color={C.flex} />
              <ActionBox x={350} y={35} w={110} h={40} label="새 거래 패턴" sub="DeFi 레이어링" color={C.flex} />

              {/* All converge to re-assessment */}
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <line x1={70} y1={75} x2={200} y2={100} stroke={C.flex} strokeWidth={0.7} />
                <line x1={180} y1={75} x2={220} y2={100} stroke={C.flex} strokeWidth={0.7} />
                <line x1={290} y1={75} x2={260} y2={100} stroke={C.flex} strokeWidth={0.7} />
                <line x1={405} y1={75} x2={280} y2={100} stroke={C.flex} strokeWidth={0.7} />
                <DataBox x={160} y={102} w={160} h={34} label="위험평가 주기적 갱신" color={C.flex} />
              </motion.g>

              <rect x={80} y={152} width={320} height={26} rx={5} fill={`${C.flex}08`} stroke={C.flex} strokeWidth={0.5} />
              <text x={240} y={169} textAnchor="middle" fontSize={9} fill={C.flex}>고정 규칙으로는 대응 불가 → RBA의 동적 갱신이 핵심</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.efct}>실효성 — FIU 분석 역량 집중</text>
              {/* Before */}
              <DataBox x={20} y={35} w={190} h={30} label="과잉 보고 (Defensive)" color={C.red} />
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <rect key={i} x={25 + i * 27} y={75} width={22} height={12} rx={2} fill={i === 3 ? C.red : `${C.red}15`} stroke={C.red} strokeWidth={0.4} />
              ))}
              <text x={115} y={104} textAnchor="middle" fontSize={8} fill={C.red}>대부분 의미 없는 보고 → FIU 과부하</text>

              {/* After */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <DataBox x={260} y={35} w={200} h={30} label="선별적 보고 (RBA)" color={C.efct} />
                <rect x={310} y={75} width={30} height={14} rx={3} fill={C.efct} opacity={0.7} />
                <text x={325} y={85} textAnchor="middle" fontSize={7} fill="#ffffff">진짜</text>
                <rect x={350} y={77} width={18} height={10} rx={2} fill={`${C.efct}20`} stroke={C.efct} strokeWidth={0.4} />
                <rect x={375} y={75} width={30} height={14} rx={3} fill={C.efct} opacity={0.7} />
                <text x={390} y={85} textAnchor="middle" fontSize={7} fill="#ffffff">진짜</text>
                <text x={360} y={104} textAnchor="middle" fontSize={8} fill={C.efct}>위험 판단 기반 선별 → FIU 집중</text>
              </motion.g>

              <AlertBox x={100} y={125} w={280} h={40} label="양보다 질" sub="구체적 의심 사유 + 논리적 서술이 FIU 분석 효과 결정" color={C.efct} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
