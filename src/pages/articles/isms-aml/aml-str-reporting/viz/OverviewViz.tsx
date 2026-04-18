import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  fiu: '#6366f1',
  str: '#f59e0b',
  ctr: '#10b981',
  warn: '#ef4444',
};

const STEPS = [
  { label: 'STR vs SAR — 같은 의무, 다른 이름', body: 'STR(Suspicious Transaction Report)은 한국 특금법 용어, SAR(Suspicious Activity Report)은 미국 FinCEN 용어. 실무에서 혼용되며 본질은 동일 — "의심 거래를 당국에 보고"하는 의무.' },
  { label: 'STR vs CTR — "의심" vs "금액"', body: 'STR은 자금세탁이 의심될 때 사람이 판단하여 보고. CTR은 1천만 원 이상 현금 거래 시 기계적으로 자동 보고. 판단의 유무가 결정적 차이.' },
  { label: '보고 흐름 — VASP에서 FIU까지', body: 'VASP(가상자산사업자)가 의심거래를 인지하면 FIU(금융정보분석원)에 "지체 없이" 보고. FIU는 분석 후 법집행기관(검찰, 경찰, 국세청)에 통보.' },
  { label: '특금법 제4조 — 세 가지 보고 대상', body: '불법재산 의심(범죄 수익 유래), 자금세탁행위 의심(출처 은닉/위장), 공중협박자금 의심(테러자금 조달). "합당한 근거"가 있으면 보고 의무 발생.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#ov-arrow)" />;
}

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ov-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: STR vs SAR */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">같은 의무, 다른 이름</text>

              <ModuleBox x={30} y={30} w={180} h={55} label="STR" sub="Suspicious Transaction Report" color={C.str} />
              <ModuleBox x={270} y={30} w={180} h={55} label="SAR" sub="Suspicious Activity Report" color={C.str} />

              {/* 양방향 등호 표시 */}
              <text x={240} y={62} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.str}>=</text>

              <text x={120} y={105} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">한국 특금법 / FATF</text>
              <text x={360} y={105} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">미국 FinCEN</text>

              {/* 하단: 공통 본질 */}
              <rect x={100} y={120} width={280} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <ActionBox x={140} y={135} w={200} h={40} label="의심 거래를 당국에 보고" sub="거래 자체 vs 활동 전반 — 범위만 다름" color={C.fiu} />

              <DataBox x={30} y={185} w={85} h={28} label="거래 초점" color={C.str} />
              <DataBox x={365} y={185} w={85} h={28} label="활동 초점" color={C.str} />
              <Arrow x1={115} y1={199} x2={138} y2={170} color={C.str} />
              <Arrow x1={365} y1={199} x2={342} y2={170} color={C.str} />
            </motion.g>
          )}

          {/* Step 1: STR vs CTR */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">결정적 차이: 판단의 유무</text>

              <ModuleBox x={30} y={30} w={190} h={55} label="STR" sub="의심거래보고" color={C.str} />
              <ModuleBox x={260} y={30} w={190} h={55} label="CTR" sub="고액현금거래보고" color={C.ctr} />

              {/* STR 특징 */}
              <Arrow x1={125} y1={85} x2={125} y2={105} color={C.str} />
              <ActionBox x={50} y={108} w={150} h={38} label="사람이 판단" sub="AML 담당자 + 준법감시인" color={C.str} />

              {/* CTR 특징 */}
              <Arrow x1={355} y1={85} x2={355} y2={105} color={C.ctr} />
              <ActionBox x={280} y={108} w={150} h={38} label="기계적 자동 보고" sub="1천만 원 이상 → 자동 제출" color={C.ctr} />

              {/* 하단 비교 */}
              <DataBox x={50} y={165} w={150} h={28} label="의심 기반" color={C.str} />
              <DataBox x={280} y={165} w={150} h={28} label="금액 기반" color={C.ctr} />

              <text x={125} y={210} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">3영업일 이내 보고</text>
              <text x={355} y={210} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">30일 이내 보고</text>
            </motion.g>
          )}

          {/* Step 2: 보고 흐름 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">의심거래 보고 흐름</text>

              {/* VASP */}
              <ModuleBox x={10} y={40} w={100} h={50} label="VASP" sub="가상자산사업자" color={C.str} />

              {/* 의심 인지 */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <Arrow x1={110} y1={65} x2={145} y2={65} color={C.str} />
                <ActionBox x={148} y={45} w={90} h={40} label="의심 인지" sub="FDS / 현업" color={C.str} />
              </motion.g>

              {/* FIU */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <Arrow x1={238} y1={65} x2={275} y2={65} color={C.fiu} />
                <ModuleBox x={278} y={40} w={90} h={50} label="FIU" sub="금융정보분석원" color={C.fiu} />
              </motion.g>

              {/* 법집행기관 */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                <Arrow x1={368} y1={65} x2={395} y2={65} color={C.warn} />
                <AlertBox x={398} y={40} w={70} h={50} label="수사기관" sub="검찰/경찰" color={C.warn} />
              </motion.g>

              {/* 하단: 시한 */}
              <rect x={10} y={115} width={458} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={135} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">보고 시한</text>

              <DataBox x={50} y={145} w={120} h={30} label="지체 없이 보고" color={C.str} />
              <DataBox x={200} y={145} w={120} h={30} label="3영업일 이내" color={C.str} />

              <text x={110} y={195} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">특금법 규정</text>
              <text x={260} y={195} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">실무 표준 기준</text>

              <DataBox x={350} y={145} w={110} h={30} label="FIU → 통보" color={C.fiu} />
              <text x={405} y={195} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">수사 가치 건 선별</text>
            </motion.g>
          )}

          {/* Step 3: 세 가지 보고 대상 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">특금법 제4조 — 보고 대상 3유형</text>

              <ModuleBox x={170} y={30} w={140} h={42} label="특금법 제4조" sub="합당한 근거가 있는 경우" color={C.fiu} />

              {/* 세 가지 갈래 */}
              <Arrow x1={200} y1={72} x2={95} y2={100} color={C.warn} />
              <Arrow x1={240} y1={72} x2={240} y2={100} color={C.str} />
              <Arrow x1={280} y1={72} x2={385} y2={100} color={C.warn} />

              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <AlertBox x={20} y={105} w={150} h={45} label="불법재산 의심" sub="사기/횡령/마약 수익 유래" color={C.warn} />
              </motion.g>

              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <ActionBox x={185} y={105} w={115} h={45} label="자금세탁 의심" sub="출처 은닉/위장 행위" color={C.str} />
              </motion.g>

              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <AlertBox x={315} y={105} w={145} h={45} label="공중협박자금 의심" sub="테러자금 조달/제공" color={C.warn} />
              </motion.g>

              {/* 하단: 합리적 의심 기준 */}
              <rect x={40} y={170} width={400} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <DataBox x={80} y={180} w={140} h={28} label="너무 높으면 → 미탐" color={C.ctr} />
              <DataBox x={260} y={180} w={140} h={28} label="너무 낮으면 → 과탐" color={C.warn} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
