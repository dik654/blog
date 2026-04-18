import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  attacker: '#ef4444',
  market: '#6366f1',
  victim: '#f59e0b',
  detect: '#10b981',
};

const STEPS = [
  { label: 'Spoofing 공격 흐름', body: '대량 허수 주문 → 시장 반응 유도 → 주문 취소 → 반대 방향 매도로 차익. 체결 의사 없는 주문으로 시장을 속인다.' },
  { label: 'Wash Trading 구조', body: '동일인이 매수+매도를 동시에. 거래량 위장 → 인기 코인으로 오인 유도. 또는 극저 유동성 코인에 가격 설정 목적.' },
  { label: '탐지 신호와 방법', body: '주문 생존 시간 분석(수초 이내 취소 반복), 동일 IP/기기 지문, 기계적 패턴 반복. 교차 거래소 조종은 단일 플랫폼에서 포착 불가.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#spf-arrow)" />;
}

export default function SpoofingFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="spf-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">Spoofing 공격 4단계</text>

              <ActionBox x={10} y={30} w={100} h={38} label="1. 대량 매수 주문" sub="체결 의사 없음" color={C.attacker} />
              <Arrow x1={110} y1={49} x2={128} y2={49} color={C.attacker} />

              <ActionBox x={130} y={30} w={100} h={38} label="2. 시장 반응" sub="타인 매수 동참" color={C.victim} />
              <Arrow x1={230} y1={49} x2={248} y2={49} color={C.victim} />

              <ActionBox x={250} y={30} w={100} h={38} label="3. 주문 취소" sub="전량 취소" color={C.attacker} />
              <Arrow x1={350} y1={49} x2={368} y2={49} color={C.attacker} />

              <AlertBox x={370} y={27} w={100} h={44} label="4. 고가 매도" sub="차익 실현" color={C.attacker} />

              {/* Price visualization */}
              <text x={50} y={95} fontSize={8} fill="var(--muted-foreground)">가격</text>
              <line x1={60} y1={100} x2={60} y2={170} stroke="var(--border)" strokeWidth={0.5} />
              <line x1={60} y1={170} x2={440} y2={170} stroke="var(--border)" strokeWidth={0.5} />

              {/* Price line: flat → up → down */}
              <polyline points="70,155 130,155 200,115 280,110 340,155 420,155"
                fill="none" stroke={C.market} strokeWidth={1.5} />

              <text x={100} y={148} fontSize={8} fill="var(--muted-foreground)">허수 주문 진입</text>
              <text x={230} y={105} fontSize={8} fill={C.victim}>타인 매수 쏠림</text>
              <text x={310} y={130} fontSize={8} fill={C.attacker}>취소+매도</text>
              <text x={390} y={148} fontSize={8} fill="var(--muted-foreground)">원래 수준</text>

              <text x={240} y={198} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">주문-취소 수수료 없는 거래소에서 더 쉽게 실행 가능</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">Wash Trading 구조</text>

              {/* Self-trading loop */}
              <ModuleBox x={140} y={30} w={200} h={40} label="동일인 (또는 공모자)" sub="복수 계정 보유" color={C.attacker} />

              <ActionBox x={60} y={95} w={100} h={35} label="계정 A: 매수" sub="1000원에 100개" color={C.attacker} />
              <ActionBox x={320} y={95} w={100} h={35} label="계정 B: 매도" sub="1000원에 100개" color={C.attacker} />

              {/* Circular arrows */}
              <Arrow x1={160} y1={112} x2={318} y2={112} color={C.attacker} />
              <Arrow x1={320} y1={100} x2={162} y2={100} color={C.attacker} />

              <text x={240} y={108} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.attacker}>자전 거래</text>

              {/* Two purposes */}
              <DataBox x={40} y={150} w={170} h={28} label="목적1: 거래량 부풀리기" color={C.victim} />
              <DataBox x={270} y={150} w={170} h={28} label="목적2: 원하는 가격 설정" color={C.victim} />

              <text x={240} y={200} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">"권리의 이전을 목적으로 하지 않는 거짓으로 꾸민 매매"</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">시세조종 탐지 신호</text>

              <DataBox x={20} y={32} w={200} h={32} label="주문 생존 시간 분석" color={C.detect} />
              <text x={230} y={45} fontSize={8} fill="var(--muted-foreground)">수초 이내 반복 주문+취소 → 스푸핑 의심</text>

              <DataBox x={20} y={78} w={200} h={32} label="IP / 기기 지문 대조" color={C.detect} />
              <text x={230} y={91} fontSize={8} fill="var(--muted-foreground)">동일 IP에서 매수+매도 동시 → 워시 트레이딩 의심</text>

              <DataBox x={20} y={124} w={200} h={32} label="계정 쌍 패턴 분석" color={C.detect} />
              <text x={230} y={137} fontSize={8} fill="var(--muted-foreground)">시간·가격 일치도 높은 계정 쌍 → 통정 매매 의심</text>

              <AlertBox x={120} y={170} w={240} h={30} label="교차 거래소 조종: 단일 플랫폼 탐지 불가" sub="" color={C.attacker} />
              <text x={240} y={207} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">거래소 간 감시 정보 공유 체계 필수</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
