import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  source: '#6366f1',
  flow: '#f59e0b',
  trade: '#10b981',
  danger: '#ef4444',
};

const STEPS = [
  { label: 'MNPI 발생원: 누가 정보를 가지는가', body: 'VASP 임직원, 대리인, 주요주주, 계약 상대방이 1차 정보 보유자. 여기서 정보가 외부로 유출되면 2차, 3차 수령자까지 규제 대상.' },
  { label: '정보 전달 경로와 규제 범위', body: '정보 보유자 → 가족/지인 → 제3자까지 연쇄적으로 규제. "나는 직접 거래하지 않았다"는 변명 불가. 타인에게 이용하게 하는 것 자체가 위반.' },
  { label: '정보 공개 후 거래 허용 시점', body: '신문 게재 → 다음날 0시+6h. 전자매체 → 게재+6h. 홈페이지 → 공개+24h. 시장 반영 시간 보장이 목적.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#iif-arrow)" />;
}

export default function InsiderInfoFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="iif-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">MNPI 발생원과 1차 보유자</text>

              <ModuleBox x={160} y={30} w={160} h={35} label="미공개중요정보 발생" sub="상장/에어드롭/파트너십 등" color={C.source} />
              <Arrow x1={240} y1={65} x2={80} y2={90} color={C.source} />
              <Arrow x1={240} y1={65} x2={190} y2={90} color={C.source} />
              <Arrow x1={240} y1={65} x2={300} y2={90} color={C.source} />
              <Arrow x1={240} y1={65} x2={400} y2={90} color={C.source} />

              <ActionBox x={25} y={95} w={110} h={35} label="VASP 임직원" sub="거래소 직원·경영진" color={C.flow} />
              <ActionBox x={148} y={95} w={90} h={35} label="대리인" sub="위탁업체" color={C.flow} />
              <ActionBox x={250} y={95} w={100} h={35} label="주요주주" sub="의결권 보유자" color={C.flow} />
              <ActionBox x={362} y={95} w={95} h={35} label="계약상대방" sub="협상 중인 자" color={C.flow} />

              <rect x={25} y={148} width={432} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">모든 1차 보유자의 거래 금지 + 정보 수령자(2차, 3차)까지 확대 적용</text>
              <text x={240} y={188} textAnchor="middle" fontSize={8} fill={C.danger}>가장 빈번: 거래소 상장/상폐 결정 사전 인지</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">정보 전달 연쇄와 규제 범위</text>

              <ModuleBox x={20} y={35} w={110} h={40} label="1차: 임직원" sub="정보 보유" color={C.source} />
              <Arrow x1={130} y1={55} x2={155} y2={55} color={C.flow} />
              <ActionBox x={158} y={35} w={110} h={40} label="2차: 가족/지인" sub="정보 전달받음" color={C.flow} />
              <Arrow x1={268} y1={55} x2={293} y2={55} color={C.danger} />
              <AlertBox x={296} y={32} w={110} h={46} label="3차: 제3자" sub="거래 실행" color={C.danger} />

              <Arrow x1={75} y1={75} x2={75} y2={105} color={C.danger} />
              <Arrow x1={213} y1={75} x2={213} y2={105} color={C.danger} />
              <Arrow x1={351} y1={78} x2={351} y2={105} color={C.danger} />

              <rect x={20} y={108} width={390} height={30} rx={6} fill={`${C.danger}10`} stroke={C.danger} strokeWidth={0.8} />
              <text x={215} y={128} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.danger}>전원 처벌 대상</text>

              <text x={240} y={165} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">정보 전달한 임직원 + 전달받아 거래한 수령자 모두 위반</text>
              <text x={240} y={182} textAnchor="middle" fontSize={8} fill={C.danger}>"직접 거래하지 않았다"는 변명 불가 -- 이용하게 하는 것 자체가 금지</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">공개 후 거래 허용 시점</text>

              <DataBox x={20} y={35} w={130} h={35} label="신문 게재(종이)" color={C.source} />
              <Arrow x1={150} y1={52} x2={268} y2={52} color={C.source} />
              <text x={280} y={50} fontSize={9} fill={C.source}>다음날 0시 + 6시간</text>

              <DataBox x={20} y={85} w={130} h={35} label="전자 간행물" color={C.flow} />
              <Arrow x1={150} y1={102} x2={268} y2={102} color={C.flow} />
              <text x={280} y={100} fontSize={9} fill={C.flow}>게재 시점 + 6시간</text>

              <DataBox x={20} y={135} w={130} h={35} label="발행자 홈페이지" color={C.trade} />
              <Arrow x1={150} y1={152} x2={268} y2={152} color={C.trade} />
              <text x={280} y={150} fontSize={9} fill={C.trade}>공개 시점 + 24시간</text>

              <text x={240} y={195} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">홈페이지가 24시간인 이유: 언론보다 접근 빈도 낮아 시장 전파에 더 오래 걸림</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
