import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  fatf: '#6366f1',
  law: '#10b981',
  warn: '#f59e0b',
};

const STEPS = [
  {
    label: 'FATF 상호평가 구조',
    body: 'FATF가 40개 권고사항을 발표하면 각 회원국이 국내법에 반영. 이행 여부를 상호평가(Mutual Evaluation)로 검증한다.',
  },
  {
    label: '불이행 시 결과',
    body: '상호평가에서 불이행 판정을 받으면 국가 전체가 그레이리스트에 등재되어 국제 금융 거래에 제약이 생긴다.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#fatf-fl-arrow)" />;
}

export default function FatfFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="fatf-fl-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={15} y={20} w={100} h={50} label="FATF" sub="국제 기준 설정" color={C.fatf} />
              <Arrow x1={115} y1={45} x2={145} y2={45} color={C.fatf} />

              <DataBox x={148} y={29} w={110} h={32} label="40개 권고사항" color={C.fatf} />
              <Arrow x1={258} y1={45} x2={288} y2={45} color={C.fatf} />

              <ActionBox x={291} y={24} w={90} h={42} label="회원국 입법" sub="국내법 반영" color={C.law} />
              <Arrow x1={381} y1={45} x2={398} y2={45} color={C.law} />

              <ActionBox x={401} y={24} w={65} h={42} label="시행" sub="규제 집행" color={C.law} />

              {/* 하단: 상호평가 루프 */}
              <rect x={15} y={95} width={450} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={115} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">상호평가 (Mutual Evaluation)</text>

              <ActionBox x={80} y={125} w={140} h={42} label="39개국 상호 검증" sub="이행 수준 점검" color={C.fatf} />
              <Arrow x1={220} y1={146} x2={260} y2={146} color={C.fatf} />
              <DataBox x={263} y={130} w={120} h={32} label="평가 등급 부여" color={C.law} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">불이행 판정의 파급 효과</text>

              <ActionBox x={170} y={35} w={140} h={42} label="상호평가 불이행" sub="핵심 의무 미충족" color={C.warn} />
              <Arrow x1={240} y1={77} x2={240} y2={95} color={C.warn} />

              <AlertBox x={140} y={98} w={200} h={42} label="그레이리스트 등재" sub="국가 신뢰도 하락" color={C.warn} />

              <Arrow x1={140} y1={140} x2={70} y2={155} color={C.warn} />
              <Arrow x1={240} y1={140} x2={240} y2={155} color={C.warn} />
              <Arrow x1={340} y1={140} x2={400} y2={155} color={C.warn} />

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <AlertBox x={15} y={158} w={115} h={35} label="환거래 제한" sub="해외 송금 지연" color={C.warn} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <AlertBox x={175} y={158} w={130} h={35} label="외국인 투자 위축" sub="신용등급 영향" color={C.warn} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <AlertBox x={350} y={158} w={115} h={35} label="금융기관 제재" sub="거래 거부 가능" color={C.warn} />
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
