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
    label: '손해배상 책임 — 입증 책임 전환',
    body: '해킹·전산장애·횡령으로 이용자 손해 발생 시 VASP가 "과실 없음"을 스스로 증명해야 면책. 일반 민사와 반대.',
  },
  {
    label: '보험/준비금 적립 — 사고 대비 재무 장치',
    body: '핫월렛 보관분의 5%와 30억 원(교환 업무 없으면 5억) 중 큰 금액 이상 적립. 콜드월렛 비율이 높을수록 부담 감소.',
  },
  {
    label: '감독 기관 검사 — 이행 점검 체계',
    body: '금융감독원이 정기·수시 검사. 자료 제출 거부나 허위 제출은 과태료·형사처벌. 위반 시 업무정지·등록취소까지.',
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

export default function OverviewLiabilityViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blue}>입증 책임 전환 구조</text>

              {/* 일반 민사 */}
              <rect x={20} y={30} width={200} height={75} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={120} y={48} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.slate}>일반 민사소송</text>
              <ActionBox x={30} y={58} w={80} h={36} label="피해자" sub="과실 입증" color={C.red} />
              <Arrow x1={110} y1={76} x2={130} y2={76} color={C.slate} />
              <DataBox x={135} y={62} w={75} h={28} label="가해자 과실" color={C.slate} />

              {/* 가상자산법 */}
              <rect x={260} y={30} width={200} height={75} rx={8} fill="var(--card)" stroke={C.blue} strokeWidth={1} />
              <text x={360} y={48} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.blue}>가상자산이용자보호법</text>
              <ActionBox x={270} y={58} w={80} h={36} label="VASP" sub="무과실 증명" color={C.amber} />
              <Arrow x1={350} y1={76} x2={370} y2={76} color={C.blue} />
              <DataBox x={375} y={62} w={75} h={28} label="과실 없음" color={C.blue} />

              {/* 화살표: 전환 */}
              <Arrow x1={220} y1={68} x2={258} y2={68} color={C.amber} />
              <text x={240} y={62} textAnchor="middle" fontSize={8} fill={C.amber}>전환</text>

              {/* 하단 이유 */}
              <rect x={60} y={125} width={360} height={50} rx={8} fill="var(--card)" stroke={C.green} strokeWidth={0.5} />
              <text x={240} y={143} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.green}>전환 이유</text>
              <text x={240} y={160} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">이용자가 기술적 원인 파악 어려움 → VASP에 증명 부담 전가</text>
              <text x={240} y={172} textAnchor="middle" fontSize={8} fill={C.slate}>금융소비자 보호법 패턴과 동일</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blue}>보험/준비금 적립 구조</text>

              {/* 전체 자산 바 */}
              <rect x={40} y={35} width={400} height={30} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              {/* 콜드 80% */}
              <rect x={40} y={35} width={320} height={30} rx={6} fill={C.green} opacity={0.15} />
              <text x={200} y={54} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.green}>콜드월렛 80% — 적립 대상 제외</text>
              {/* 핫 20% */}
              <rect x={360} y={35} width={80} height={30} rx={0} fill={C.amber} opacity={0.15} />
              <text x={400} y={54} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.amber}>핫 20%</text>

              {/* 핫월렛에서 적립금 산출 */}
              <Arrow x1={400} y1={65} x2={400} y2={85} color={C.amber} />

              {/* 적립 기준 */}
              <rect x={220} y={90} width={240} height={50} rx={8} fill="var(--card)" stroke={C.amber} strokeWidth={1} />
              <text x={340} y={108} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.amber}>적립 기준</text>
              <text x={340} y={125} textAnchor="middle" fontSize={9} fill="var(--foreground)">핫월렛분 x 5% 또는 30억 원 중 큰 금액</text>

              {/* 교환 없는 사업자 */}
              <DataBox x={20} y={95} w={170} h={34} label="교환 업무 없는 사업자" sub="5억 원 이상" color={C.slate} />

              {/* 인센티브 */}
              <rect x={80} y={160} width={320} height={36} rx={8} fill="var(--card)" stroke={C.green} strokeWidth={1} />
              <text x={240} y={178} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.green}>콜드 비율 ↑ → 핫월렛분 ↓ → 보험료/적립금 부담 ↓</text>
              <text x={240} y={192} textAnchor="middle" fontSize={8} fill={C.slate}>경제적 인센티브가 내장된 구조</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blue}>감독 기관 검사 체계</text>

              {/* 금융감독원 */}
              <ModuleBox x={170} y={28} w={140} h={44} label="금융감독원" sub="검사 집행 기관" color={C.blue} />

              {/* 두 갈래 */}
              <Arrow x1={210} y1={72} x2={100} y2={95} color={C.green} />
              <Arrow x1={280} y1={72} x2={380} y2={95} color={C.amber} />

              {/* 정기 검사 */}
              <ActionBox x={20} y={100} w={160} h={40} label="정기 검사" sub="반기별 실태조사" color={C.green} />

              {/* 수시 검사 */}
              <ActionBox x={300} y={100} w={160} h={40} label="수시 검사" sub="사고·제보 시 즉시" color={C.amber} />

              {/* VASP 의무 */}
              <Arrow x1={100} y1={140} x2={240} y2={160} color={C.slate} />
              <Arrow x1={380} y1={140} x2={240} y2={160} color={C.slate} />

              <rect x={130} y={155} width={220} height={24} rx={6} fill="var(--card)" stroke={C.slate} strokeWidth={0.5} />
              <text x={240} y={171} textAnchor="middle" fontSize={9} fill="var(--foreground)">VASP: 자료 제출 + 관계자 출석 의무</text>

              {/* 위반 시 */}
              <AlertBox x={130} y={185} w={220} h={22} label="" sub="거부·허위 → 과태료/형사처벌 | 중대 위반 → 업무정지/등록취소" color={C.red} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
