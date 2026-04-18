import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  attack: '#ef4444',
  victim: '#6366f1',
  flow: '#f59e0b',
  ok: '#10b981',
};

const STEPS = [
  { label: '스푸핑(Spoofing) -- 허수 주문', body: '체결 의사 없는 대량 주문 → 시장 반응 유도 → 즉시 취소 → 올라간 가격에 매도. 주문 생존 시간이 수초 이내면 탐지 대상.' },
  { label: '워시 트레이딩 -- 자기 자신과 거래', body: '동일인 또는 공모자가 매수·매도를 동시 실행하여 거래량 부풀리기. 목적: 거래량 위장(순위 조작) + 원하는 가격 설정.' },
  { label: '펌프 앤 덤프 -- 유포 후 매도', body: '① 저가 매집 → ② 허위 호재 유포(텔레그램·SNS) → ③ FOMO 매수 쏠림 → ④ 고점 대량 매도. 가장 빈번하고 피해가 큰 유형.' },
  { label: '부정거래 -- 허위·기망적 수단', body: '허위 시세 표시, 가짜 파트너십·감사 보고서, 허위 유동성 표시. 시세조종이 "가격을 움직이는 것"이면, 부정거래는 "사람을 속이는 것".' },
  { label: '자기발행 가상자산 거래 제한', body: 'VASP·특수관계인이 발행한 가상자산의 매매 중개 금지. 가격 정보 + 상폐 권한 + 유동성 통제를 모두 보유하면 이해상충이 극단적.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#mm-arrow)" />;
}

export default function MarketManipulationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="mm-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: Spoofing */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">스푸핑(Spoofing) 동작 흐름</text>

              {/* 공격자 행동 플로우 */}
              <ActionBox x={10} y={35} w={95} h={42} label="대량 매수 주문" sub="체결 의사 없음" color={C.attack} />
              <Arrow x1={105} y1={56} x2={125} y2={56} color={C.flow} />

              <DataBox x={128} y={40} w={95} h={32} label="매수 벽 형성" color={C.flow} />
              <Arrow x1={223} y1={56} x2={243} y2={56} color={C.flow} />

              <ActionBox x={246} y={35} w={95} h={42} label="타 이용자 매수" sub="지지선 오인" color={C.victim} />
              <Arrow x1={341} y1={56} x2={361} y2={56} color={C.flow} />

              <DataBox x={364} y={40} w={100} h={32} label="가격 상승" color={C.ok} />

              {/* 두 번째 줄: 취소 후 매도 */}
              <Arrow x1={55} y1={77} x2={55} y2={100} color={C.attack} />
              <ActionBox x={10} y={103} w={95} h={42} label="주문 전량 취소" sub="매수 지지 소멸" color={C.attack} />
              <Arrow x1={105} y1={124} x2={125} y2={124} color={C.attack} />

              <ActionBox x={128} y={103} w={95} h={42} label="보유분 매도" sub="올라간 가격에" color={C.attack} />
              <Arrow x1={223} y1={124} x2={243} y2={124} color={C.attack} />

              <AlertBox x={246} y={100} w={95} h={48} label="가격 하락" sub="지지 소멸로 급락" color={C.attack} />
              <Arrow x1={341} y1={124} x2={361} y2={124} color={C.attack} />

              <AlertBox x={364} y={100} w={100} h={48} label="피해자 손실" sub="고점 매수 물량" color={C.attack} />

              <text x={240} y={180} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">탐지: 주문 생존 시간 수초 이내 + 반복적 주문-취소 패턴</text>
              <text x={240} y={198} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">가상자산: 주문-취소 수수료 없는 거래소가 많아 실행이 용이</text>
            </motion.g>
          )}

          {/* Step 1: Wash Trading */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">워시 트레이딩(Wash Trading)</text>

              {/* 자전 거래 구조 */}
              <ModuleBox x={120} y={30} w={110} h={48} label="계정 A (매수)" sub="공격자 소유" color={C.attack} />
              <ModuleBox x={260} y={30} w={110} h={48} label="계정 B (매도)" sub="공격자 소유" color={C.attack} />

              {/* 순환 화살표 */}
              <Arrow x1={230} y1={44} x2={258} y2={44} color={C.flow} />
              <Arrow x1={260} y1={68} x2={232} y2={68} color={C.flow} />
              <text x={245} y={58} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.flow}>자전</text>

              {/* 목적 */}
              <rect x={20} y={100} width={440} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={120} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">목적</text>

              <DataBox x={40} y={130} w={170} h={32} label="거래량 위장 (순위 조작)" color={C.flow} />
              <DataBox x={270} y={130} w={170} h={32} label="원하는 가격 설정" color={C.attack} />

              {/* 탐지 신호 */}
              <text x={240} y={190} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">탐지: 동일 IP/기기 지문 + 매수·매도 동시 발생 + 기계적 반복 패턴</text>
            </motion.g>
          )}

          {/* Step 2: Pump and Dump */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">펌프 앤 덤프 4단계</text>

              {/* 4단계 플로우 */}
              <ActionBox x={10} y={35} w={100} h={42} label="1. 사전 매집" sub="저가 분산 매수" color={C.flow} />
              <Arrow x1={110} y1={56} x2={128} y2={56} color={C.flow} />

              <ActionBox x={131} y={35} w={100} h={42} label="2. 정보 유포" sub="허위 호재 유포" color={C.attack} />
              <Arrow x1={231} y1={56} x2={249} y2={56} color={C.attack} />

              <ActionBox x={252} y={35} w={100} h={42} label="3. FOMO 매수" sub="일반 이용자 쏠림" color={C.victim} />
              <Arrow x1={352} y1={56} x2={370} y2={56} color={C.attack} />

              <AlertBox x={373} y={32} w={95} h={48} label="4. 대량 매도" sub="고점 전량 매도" color={C.attack} />

              {/* 가격 그래프 시뮬레이션 */}
              <rect x={30} y={100} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={30} y={120} fontSize={8} fill="var(--muted-foreground)">가격</text>

              {/* 간이 가격 차트 */}
              <motion.polyline
                points="50,170 120,168 180,165 220,140 260,115 300,100 330,95 350,100 370,130 400,155 430,170"
                fill="none" stroke={C.attack} strokeWidth={1.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 1.2 }}
              />

              {/* 라벨 */}
              <text x={80} y={183} textAnchor="middle" fontSize={7} fill={C.flow}>매집</text>
              <text x={200} y={183} textAnchor="middle" fontSize={7} fill={C.attack}>유포</text>
              <text x={300} y={183} textAnchor="middle" fontSize={7} fill={C.victim}>FOMO</text>
              <text x={400} y={183} textAnchor="middle" fontSize={7} fill={C.attack}>덤프</text>

              {/* 고점 표시 */}
              <motion.circle cx={330} cy={95} r={3} fill={C.attack}
                initial={{ scale: 0 }} animate={{ scale: 1 }} />
              <text x={340} y={90} fontSize={7} fill={C.attack}>고점</text>

              <text x={240} y={205} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">FOMO(Fear Of Missing Out): "나만 놓치는 것 아닌가" 심리 자극</text>
            </motion.g>
          )}

          {/* Step 3: 부정거래 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">부정거래 유형</text>

              <ModuleBox x={155} y={30} w={170} h={45} label="부정거래" sub="허위·기망적 수단으로 거래 유인" color={C.attack} />

              <Arrow x1={170} y1={75} x2={100} y2={100} color={C.attack} />
              <Arrow x1={240} y1={75} x2={240} y2={100} color={C.attack} />
              <Arrow x1={310} y1={75} x2={380} y2={100} color={C.attack} />

              <AlertBox x={30} y={103} w={140} h={48} label="허위 시세 이용" sub="호가창 조작, 가격 왜곡" color={C.attack} />
              <AlertBox x={190} y={103} w={100} h={48} label="기망적 수단" sub="가짜 기술·파트너십" color={C.attack} />
              <AlertBox x={310} y={103} w={140} h={48} label="허위 유동성" sub="거래량·시총 허위 표시" color={C.attack} />

              {/* 비교 */}
              <rect x={20} y={170} width={440} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={120} y={195} textAnchor="middle" fontSize={9} fill={C.flow}>시세조종 = 가격을 직접 움직임</text>
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">vs</text>
              <text x={360} y={195} textAnchor="middle" fontSize={9} fill={C.attack}>부정거래 = 사람을 속임</text>
            </motion.g>
          )}

          {/* Step 4: 자기발행 거래 제한 */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">자기발행 가상자산 거래 제한</text>

              <ModuleBox x={20} y={35} w={130} h={48} label="VASP (거래소)" sub="플랫폼 운영자" color={C.victim} />

              {/* 보유 권한들 */}
              <Arrow x1={85} y1={83} x2={85} y2={105} color={C.victim} />
              <DataBox x={20} y={108} w={130} h={28} label="가격 정보 + 상폐 권한" color={C.victim} />

              {/* 자기 발행 코인 */}
              <ModuleBox x={200} y={35} w={130} h={48} label="자기발행 코인" sub="VASP가 직접 발행" color={C.attack} />

              {/* 금지 표시 */}
              <line x1={150} y1={55} x2={198} y2={55} stroke={C.attack} strokeWidth={2} strokeDasharray="6 3" />
              <text x={174} y={50} textAnchor="middle" fontSize={12} fill={C.attack}>X</text>

              {/* 특수관계인 */}
              <ModuleBox x={370} y={35} w={95} h={48} label="특수관계인" sub="계열사·대주주" color={C.attack} />
              <line x1={330} y1={55} x2={368} y2={55} stroke={C.attack} strokeWidth={2} strokeDasharray="6 3" />
              <text x={349} y={50} textAnchor="middle" fontSize={12} fill={C.attack}>X</text>

              {/* 이해상충 설명 */}
              <rect x={20} y={155} width={440} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <AlertBox x={60} y={165} w={160} h={40} label="이해상충 극대화" sub="정보+권한+유동성 통제 독점" color={C.attack} />

              <Arrow x1={220} y1={185} x2={260} y2={185} color={C.ok} />

              <ActionBox x={263} y={166} w={160} h={38} label="해결: 매매 중개 금지" sub="공시 의무 부과" color={C.ok} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
