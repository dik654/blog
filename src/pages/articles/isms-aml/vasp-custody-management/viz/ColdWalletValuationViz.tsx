import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  blue: '#3b82f6',
  green: '#22c55e',
  amber: '#f59e0b',
  red: '#ef4444',
  slate: '#64748b',
};

const STEPS = [
  {
    label: '경제적 가치 산정 공식',
    body: '종류별 (총수량 x 최근 1년 1일 평균 원화환산액)의 합계. 1년 평균을 사용해 단기 급등락 왜곡을 방지한다.',
  },
  {
    label: '월초 재산정 4단계 절차',
    body: '수량 집계 → 가치 산정 → 비율 계산 → 미달 시 즉시 보완. 매월 초 5영업일 이내 완료해야 한다.',
  },
  {
    label: '미달 시 보완 조치',
    body: '80% 미만이면 핫월렛에서 콜드월렛으로 즉시 이동. 다중서명 승인 필요하므로 실무적으로 수 시간~1영업일 소요.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len, uy = dy / len;
  const ax = x2 - ux * 4, ay = y2 - uy * 4;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} />
      <polygon points={`${x2},${y2} ${ax - uy * 3},${ay + ux * 3} ${ax + uy * 3},${ay - ux * 3}`} fill={color} />
    </g>
  );
}

export default function ColdWalletValuationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blue}>경제적 가치 산정</text>

              {/* 종류별 수량 */}
              <DataBox x={20} y={35} w={100} h={34} label="BTC 300개" color={C.amber} />
              <DataBox x={20} y={78} w={100} h={34} label="ETH 5,000개" color={C.amber} />
              <DataBox x={20} y={121} w={100} h={34} label="기타 토큰" color={C.amber} />

              {/* x 기호 */}
              <text x={135} y={56} textAnchor="middle" fontSize={12} fill={C.slate}>x</text>
              <text x={135} y={99} textAnchor="middle" fontSize={12} fill={C.slate}>x</text>
              <text x={135} y={142} textAnchor="middle" fontSize={12} fill={C.slate}>x</text>

              {/* 1년 평균가 */}
              <ActionBox x={155} y={35} w={140} h={34} label="1년 일평균 원화환산액" sub="전월 말 기준" color={C.green} />
              <ActionBox x={155} y={78} w={140} h={34} label="1년 일평균 원화환산액" sub="전월 말 기준" color={C.green} />
              <ActionBox x={155} y={121} w={140} h={34} label="1년 일평균 원화환산액" sub="전월 말 기준" color={C.green} />

              {/* 합계 화살표 */}
              <Arrow x1={295} y1={52} x2={340} y2={90} color={C.blue} />
              <Arrow x1={295} y1={95} x2={340} y2={90} color={C.blue} />
              <Arrow x1={295} y1={138} x2={340} y2={100} color={C.blue} />

              {/* 결과 */}
              <ModuleBox x={345} y={70} w={120} h={50} label="경제적 가치" sub="종류별 합산 총액" color={C.blue} />

              {/* 하단 이유 */}
              <rect x={60} y={170} width={360} height={30} rx={6} fill="var(--card)" stroke={C.green} strokeWidth={0.5} />
              <text x={240} y={189} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">1년 평균 사용 이유: 단기 급등락(10배 폭등/폭락)에 의한 비율 왜곡 방지</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blue}>월초 재산정 절차</text>

              {/* 4단계 흐름 */}
              <ActionBox x={10} y={40} w={100} h={44} label="1. 수량 집계" sub="종류별 총수량" color={C.blue} />
              <Arrow x1={110} y1={62} x2={130} y2={62} color={C.blue} />

              <ActionBox x={135} y={40} w={100} h={44} label="2. 가치 산정" sub="수량 x 1년평균가" color={C.green} />
              <Arrow x1={235} y1={62} x2={255} y2={62} color={C.green} />

              <ActionBox x={260} y={40} w={100} h={44} label="3. 비율 계산" sub="콜드/전체 비율" color={C.amber} />
              <Arrow x1={360} y1={62} x2={380} y2={62} color={C.amber} />

              <StatusBox x={385} y={40} w={85} h={44} label="80% 이상?" sub="" color={C.green} progress={0.8} />

              {/* 기한 */}
              <rect x={10} y={100} width={460} height={24} rx={6} fill="var(--card)" stroke={C.slate} strokeWidth={0.5} />
              <text x={240} y={116} textAnchor="middle" fontSize={9} fill={C.slate}>기한: 전월 말 기준 데이터로 매월 초 5영업일 이내 완료</text>

              {/* 분기: OK / 미달 */}
              <Arrow x1={427} y1={84} x2={350} y2={140} color={C.green} />
              <Arrow x1={427} y1={84} x2={427} y2={140} color={C.red} />

              <DataBox x={280} y={145} w={100} h={30} label="80% 이상 OK" color={C.green} />
              <AlertBox x={380} y={145} w={90} h={30} label="미달" sub="즉시 보완" color={C.red} />

              <text x={240} y={198} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">재산정 기록은 내부 문서로 보관 → 감독 기관 검사 시 제출</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.red}>미달 시 보완 조치</text>

              {/* 핫월렛 (과다) */}
              <ModuleBox x={20} y={40} w={140} h={50} label="핫월렛" sub="현재 25% (초과)" color={C.red} />

              {/* 전송 화살표 */}
              <Arrow x1={160} y1={65} x2={195} y2={65} color={C.amber} />
              <text x={178} y={55} textAnchor="middle" fontSize={8} fill={C.amber}>전송</text>

              {/* 다중서명 게이트 */}
              <rect x={200} y={40} width={80} height={50} rx={8} fill="var(--card)" stroke={C.amber} strokeWidth={1} />
              <text x={240} y={58} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.amber}>다중서명</text>
              <text x={240} y={72} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">2인 이상</text>
              <text x={240} y={83} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">승인 필요</text>

              {/* 콜드월렛 (부족) */}
              <Arrow x1={280} y1={65} x2={320} y2={65} color={C.green} />
              <ModuleBox x={325} y={40} w={140} h={50} label="콜드월렛" sub="현재 75% → 80%+" color={C.green} />

              {/* 소요 시간 */}
              <rect x={120} y={110} width={240} height={30} rx={6} fill="var(--card)" stroke={C.slate} strokeWidth={0.5} />
              <text x={240} y={129} textAnchor="middle" fontSize={9} fill={C.slate}>실무 소요: 수 시간 ~ 1영업일 (다중서명 절차)</text>

              {/* 전송 후 재확인 */}
              <Arrow x1={240} y1={140} x2={240} y2={158} color={C.blue} />
              <StatusBox x={140} y={160} w={200} h={36} label="전송 후 비율 재확인" sub="80% 이상 달성 여부 점검" color={C.blue} progress={0.8} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
