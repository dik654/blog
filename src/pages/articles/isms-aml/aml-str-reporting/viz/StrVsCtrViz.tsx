import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = { str: '#ef4444', ctr: '#3b82f6', ok: '#10b981', warn: '#f59e0b' };

const STEPS = [
  { label: 'STR vs CTR — 핵심 차이', body: 'STR은 "의심"이 전제 → 사람의 분석 필요. CTR은 "금액"이 전제 → 기계적 보고.' },
  { label: '가상자산에서 CTR 적용', body: '가상자산 자체 이전은 CTR 대상 아님. 원화 환전 시점에서 1천만 원 도달하면 보고.' },
  { label: '보고 주체와 시기', body: 'VASP → FIU(금융정보분석원). STR은 3영업일 이내, CTR은 30일 이내.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#svc-arrow)" />;
}

export default function StrVsCtrViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="svc-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">STR vs CTR — 보고 기준의 핵심 차이</text>
              {/* STR */}
              <ModuleBox x={20} y={28} w={200} h={44} label="STR (의심거래보고)" sub="Suspicious Transaction Report" color={C.str} />
              <rect x={30} y={82} width={80} height={24} rx={4} fill={`${C.str}12`} stroke={C.str} strokeWidth={0.5} />
              <text x={70} y={98} textAnchor="middle" fontSize={8} fill={C.str}>의심 판단</text>
              <rect x={120} y={82} width={90} height={24} rx={4} fill={`${C.str}12`} stroke={C.str} strokeWidth={0.5} />
              <text x={165} y={98} textAnchor="middle" fontSize={8} fill={C.str}>사람의 분석</text>

              {/* CTR */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <ModuleBox x={260} y={28} w={200} h={44} label="CTR (고액현금거래)" sub="Currency Transaction Report" color={C.ctr} />
                <rect x={270} y={82} width={90} height={24} rx={4} fill={`${C.ctr}12`} stroke={C.ctr} strokeWidth={0.5} />
                <text x={315} y={98} textAnchor="middle" fontSize={8} fill={C.ctr}>1천만 원+</text>
                <rect x={370} y={82} width={80} height={24} rx={4} fill={`${C.ctr}12`} stroke={C.ctr} strokeWidth={0.5} />
                <text x={410} y={98} textAnchor="middle" fontSize={8} fill={C.ctr}>기계적 보고</text>
              </motion.g>

              {/* VS */}
              <text x={240} y={56} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">vs</text>

              {/* Key insight */}
              <rect x={60} y={120} width={360} height={28} rx={5} fill={`${C.str}06`} stroke={C.str} strokeWidth={0.5} />
              <text x={240} y={138} textAnchor="middle" fontSize={9} fill={C.str}>
                STR의 "의심 판단"이 AML 담당자의 핵심 역량 → 보고의 질이 FIU 효과 결정
              </text>
              <text x={240} y={168} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">미보고: STR은 과태료 + 형사처벌, CTR은 과태료</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.ctr}>가상자산에서 CTR 적용 범위</text>
              {/* Crypto transfer */}
              <DataBox x={20} y={35} w={180} h={34} label="가상자산 이전 (지갑→지갑)" color={C.ok} />
              <text x={110} y={86} textAnchor="middle" fontSize={8} fill={C.ok}>"현금"이 아님 → CTR 대상 아님</text>

              {/* KRW conversion */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <DataBox x={260} y={35} w={200} h={34} label="원화 환전 (가상자산→KRW)" color={C.ctr} />
                <text x={360} y={86} textAnchor="middle" fontSize={8} fill={C.ctr}>1천만 원 이상 시 CTR 대상</text>
              </motion.g>

              {/* Flow */}
              <Arrow x1={200} y1={52} x2={258} y2={52} color={C.warn} />
              <text x={230} y={46} fontSize={8} fill={C.warn}>환전</text>

              {/* Example */}
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <rect x={40} y={105} width={400} height={52} rx={6} fill={`${C.ctr}06`} stroke={C.ctr} strokeWidth={0.5} />
                <text x={240} y={122} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.ctr}>예시</text>
                <text x={240} y={138} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  BTC 1,500만 원어치를 원화로 출금 → CTR 자동 보고 (금액 기준 충족)
                </text>
                <text x={240} y={150} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  동일 BTC를 외부 지갑으로 전송 → CTR 미해당 (원화 아님)
                </text>
              </motion.g>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">보고 주체와 시기</text>
              {/* Flow */}
              <ActionBox x={20} y={35} w={130} h={40} label="VASP" sub="가상자산사업자" color={C.str} />
              <Arrow x1={150} y1={55} x2={190} y2={55} color={C.str} />
              <ModuleBox x={193} y={35} w={130} h={40} label="FIU" sub="금융정보분석원" color={C.ctr} />
              <Arrow x1={323} y1={55} x2={363} y2={55} color={C.ctr} />
              <ActionBox x={366} y={35} w={100} h={40} label="법집행기관" sub="검찰·경찰·국세청" color={C.ok} />

              {/* STR timeline */}
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <rect x={30} y={95} width={200} height={36} rx={5} fill={`${C.str}08`} stroke={C.str} strokeWidth={0.6} />
                <text x={130} y={110} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.str}>STR: 3영업일 이내</text>
                <text x={130} y={124} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">의심 인지 → 보고 완료</text>
              </motion.g>

              {/* CTR timeline */}
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <rect x={250} y={95} width={200} height={36} rx={5} fill={`${C.ctr}08`} stroke={C.ctr} strokeWidth={0.6} />
                <text x={350} y={110} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.ctr}>CTR: 30일 이내</text>
                <text x={350} y={124} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">거래 발생 → 자동 보고</text>
              </motion.g>

              <AlertBox x={60} y={148} w={360} h={30} label="특금법 제4조: '지체 없이' 보고 의무" sub="미보고 시 과태료 + 형사처벌 가능 — 2023년 VASP 과태료 77% 집중" color={C.str} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
