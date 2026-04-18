import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  accumulate: '#6366f1',
  pump: '#f59e0b',
  fomo: '#10b981',
  dump: '#ef4444',
};

const STEPS = [
  { label: 'Pump and Dump 4단계', body: '사전 매집 → 허위 호재 유포(Pump) → FOMO 매수 쏠림 → 고점 대량 매도(Dump). 가상자산에서 가장 빈번하고 피해가 큰 유형.' },
  { label: '부정거래: 허위/기망적 수단', body: '시세조종이 "가격을 직접 움직이는 것"이라면, 부정거래는 "거짓으로 사람을 속이는 것". 허위 시세 표시, 가짜 파트너십, 허위 유동성.' },
  { label: '자기발행 가상자산 거래 제한', body: 'VASP가 발행한 코인을 자기 플랫폼에서 거래 중개 금지. 발행+거래 동시 운영 시 이해상충이 극단적. 특수관계인 발행도 동일 제한.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#pdf-arrow)" />;
}

export default function PumpDumpFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="pdf-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">Pump and Dump 공격 사이클</text>

              <ActionBox x={10} y={30} w={100} h={38} label="1. 사전 매집" sub="저가 대량 매수" color={C.accumulate} />
              <Arrow x1={110} y1={49} x2={128} y2={49} color={C.accumulate} />

              <ActionBox x={130} y={30} w={100} h={38} label="2. 호재 유포" sub="텔레그램/SNS" color={C.pump} />
              <Arrow x1={230} y1={49} x2={248} y2={49} color={C.pump} />

              <ActionBox x={250} y={30} w={100} h={38} label="3. FOMO 매수" sub="일반 이용자 쏠림" color={C.fomo} />
              <Arrow x1={350} y1={49} x2={368} y2={49} color={C.fomo} />

              <AlertBox x={370} y={27} w={100} h={44} label="4. 대량 매도" sub="가격 급락" color={C.dump} />

              {/* Price curve */}
              <text x={50} y={92} fontSize={8} fill="var(--muted-foreground)">가격</text>
              <line x1={60} y1={95} x2={60} y2={175} stroke="var(--border)" strokeWidth={0.5} />
              <line x1={60} y1={175} x2={440} y2={175} stroke="var(--border)" strokeWidth={0.5} />

              <polyline points="70,165 120,165 160,150 220,120 280,100 310,95 340,130 380,165 430,165"
                fill="none" stroke={C.dump} strokeWidth={1.5} />

              <text x={100} y={160} fontSize={8} fill={C.accumulate}>매집</text>
              <text x={190} y={118} fontSize={8} fill={C.pump}>유포</text>
              <text x={290} y={88} fontSize={8} fill={C.fomo}>FOMO</text>
              <text x={360} y={138} fontSize={8} fill={C.dump}>Dump!</text>

              <text x={240} y={198} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">FOMO = Fear Of Missing Out: "나만 놓치는 것 아닌가" 심리 자극</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">부정거래: 허위/기망적 수단</text>

              <ModuleBox x={130} y={30} w={220} h={35} label="시세조종 vs 부정거래" sub="가격 직접 조작 vs 사람을 속이는 것" color={C.accumulate} />

              <Arrow x1={180} y1={65} x2={100} y2={85} color={C.dump} />
              <Arrow x1={240} y1={65} x2={240} y2={85} color={C.dump} />
              <Arrow x1={300} y1={65} x2={380} y2={85} color={C.dump} />

              <DataBox x={20} y={90} w={140} h={32} label="허위 시세 표시" color={C.dump} />
              <DataBox x={170} y={90} w={140} h={32} label="가짜 파트너십 발표" color={C.dump} />
              <DataBox x={320} y={90} w={140} h={32} label="허위 유동성 표시" color={C.dump} />

              <text x={90} y={136} fontSize={8} fill="var(--muted-foreground)">호가창 조작, 가격 왜곡</text>
              <text x={240} y={136} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">존재하지 않는 기술/감사</text>
              <text x={390} y={136} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">거래량/시총 허위 표시</text>

              <AlertBox x={100} y={155} w={280} h={32} label="공통 목적: 이용자의 투자 판단을 기만" sub="" color={C.dump} />
              <text x={240} y={205} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">펌프 앤 덤프의 정보 유포도 부정거래에 해당</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">자기발행 가상자산 거래 제한</text>

              <ModuleBox x={30} y={35} w={120} h={42} label="VASP (거래소)" sub="코인 발행 + 거래 운영" color={C.accumulate} />
              <Arrow x1={150} y1={56} x2={198} y2={56} color={C.dump} />

              <AlertBox x={200} y={32} w={140} h={48} label="자기 플랫폼 상장" sub="이해상충 극단적" color={C.dump} />

              {/* Conflict items */}
              <Arrow x1={270} y1={80} x2={270} y2={100} color={C.dump} />

              <rect x={140} y={103} width={260} height={55} rx={6} fill={`${C.dump}08`} stroke={C.dump} strokeWidth={0.6} />
              <text x={152} y={120} fontSize={9} fontWeight={600} fill={C.dump}>이해상충 요소</text>
              <text x={152} y={135} fontSize={8} fill="var(--muted-foreground)">가격 정보 독점 + 상장/상폐 권한 + 유동성 통제</text>
              <text x={152} y={148} fontSize={8} fill="var(--muted-foreground)">→ 이용자와의 정보 비대칭 극대화</text>

              <text x={240} y={180} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">VASP 자체 발행 + 특수관계인 발행 모두 매매 중개 금지</text>
              <text x={240} y={198} textAnchor="middle" fontSize={8} fill={C.accumulate}>예외적 취득 시에도 공시 의무 부담</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
