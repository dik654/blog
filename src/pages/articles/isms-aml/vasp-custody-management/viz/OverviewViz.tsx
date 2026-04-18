import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  blue: '#3b82f6',
  green: '#22c55e',
  amber: '#f59e0b',
  red: '#ef4444',
};

const STEPS = [
  {
    label: '분리 보관 원칙 — 자기 자산 vs 이용자 자산',
    body: 'VASP의 고유재산과 이용자가 위탁한 자산은 반드시 별도 지갑/계좌로 관리. 혼합 보관은 장부 조작·횡령의 직접 원인이 된다.',
  },
  {
    label: '종류 동일성 + 수량 동일성 = 100% 상시 보유',
    body: '비트코인을 맡겼으면 비트코인으로, 이더리움으로 대체 불가. 위탁 수량 합계를 어떤 시점에도 전량 보유해야 한다.',
  },
  {
    label: '이용자명부 작성 — 기록과 감독의 기준',
    body: '이용자 실명, 가상자산 종류·수량, 지갑 주소를 암호화 저장. 이용자 확인 근거 + 감독 기관 점검 대조 기준.',
  },
  {
    label: '5층 보관 체계 — 중첩 방어 구조',
    body: '분리 보관 → 동일성 유지 → 콜드월렛 80% → 이용자명부 → 손해배상 대비. 5개 층위가 중첩되어야 제도적 보호가 완성된다.',
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
      <polygon
        points={`${x2},${y2} ${ax - uy * 3},${ay + ux * 3} ${ax + uy * 3},${ay - ux * 3}`}
        fill={color}
      />
    </g>
  );
}

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* VASP 중앙 */}
              <ModuleBox x={180} y={10} w={120} h={48} label="VASP" sub="가상자산사업자" color={C.blue} />

              {/* 왼쪽: 자기 자산 */}
              <DataBox x={20} y={90} w={120} h={34} label="자기 자산(고유재산)" color={C.amber} />
              <Arrow x1={140} y1={107} x2={180} y2={58} color={C.amber} />

              {/* 오른쪽: 이용자 자산 */}
              <DataBox x={340} y={90} w={120} h={34} label="이용자 위탁 자산" color={C.green} />
              <Arrow x1={340} y1={107} x2={300} y2={58} color={C.green} />

              {/* 분리 표시 */}
              <line x1={240} y1={75} x2={240} y2={145} stroke={C.red} strokeWidth={1.5} strokeDasharray="4 3" />
              <text x={240} y={160} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.red}>분리 보관 필수</text>

              {/* 하단 법적 근거 */}
              <rect x={60} y={175} width={160} height={28} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={140} y={193} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">예치금(원화) → 은행 예치/신탁</text>

              <rect x={260} y={175} width={160} height={28} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={340} y={193} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">가상자산 → 별도 지갑 분리</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blue}>100% 상시 보유 의무</text>

              {/* 종류 동일성 */}
              <ActionBox x={30} y={38} w={180} h={40} label="종류 동일성" sub="BTC 맡기면 BTC로 보유" color={C.green} />

              {/* 수량 동일성 */}
              <ActionBox x={270} y={38} w={180} h={40} label="수량 동일성" sub="위탁 합계 = 보유량" color={C.green} />

              {/* 화살표 합류 */}
              <Arrow x1={120} y1={78} x2={200} y2={105} color={C.green} />
              <Arrow x1={360} y1={78} x2={280} y2={105} color={C.green} />

              {/* 합류 결과 */}
              <StatusBox x={180} y={100} w={120} h={48} label="전량 보유" sub="어떤 시점에도 100%" color={C.green} progress={1} />

              {/* vs 전통 은행 */}
              <AlertBox x={30} y={165} w={180} h={40} label="전통 은행" sub="부분지급준비금 허용" color={C.amber} />
              <DataBox x={270} y={165} w={180} h={40} label="VASP" sub="100% 보유 의무 (예보 미적용)" color={C.blue} />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blue}>이용자명부 구성</text>

              {/* 이용자 */}
              <ModuleBox x={10} y={40} w={100} h={44} label="이용자" sub="자산 위탁" color={C.blue} />
              <Arrow x1={110} y1={62} x2={150} y2={62} color={C.blue} />

              {/* 명부 3개 항목 */}
              <rect x={155} y={30} width={170} height={100} rx={8} fill="var(--card)" stroke={C.green} strokeWidth={1} />
              <text x={240} y={48} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.green}>이용자명부</text>

              <text x={170} y={68} fontSize={9} fill="var(--foreground)">1. 주소 및 성명</text>
              <text x={170} y={84} fontSize={9} fill="var(--foreground)">2. 가상자산 종류 및 수량</text>
              <text x={170} y={100} fontSize={9} fill="var(--foreground)">3. 가상자산주소(고유 ID)</text>

              <text x={240} y={120} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">암호화 저장 필수</text>

              {/* 활용 화살표 2개 */}
              <Arrow x1={325} y1={55} x2={370} y2={55} color={C.amber} />
              <ActionBox x={375} y={35} w={95} h={36} label="이용자 확인" sub="자산 현황 근거" color={C.amber} />

              <Arrow x1={325} y1={95} x2={370} y2={95} color={C.amber} />
              <ActionBox x={375} y={77} w={95} h={36} label="감독 점검" sub="대조 기준 자료" color={C.amber} />

              {/* 접근 통제 */}
              <AlertBox x={155} y={145} w={170} h={40} label="접근 통제" sub="최소 인원 + 접근 로그 기록" color={C.red} />
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blue}>5층 보관 체계</text>

              {/* 5개 층위를 아래에서 위로 쌓기 */}
              <StatusBox x={90} y={170} w={300} h={36} label="5. 손해배상 대비" sub="보험 또는 준비금 적립" color={C.red} progress={1} />
              <StatusBox x={90} y={130} w={300} h={36} label="4. 이용자명부" sub="암호화 기록·비치" color={C.amber} progress={0.85} />
              <StatusBox x={90} y={90} w={300} h={36} label="3. 콜드월렛 80%" sub="오프라인 보관" color={C.green} progress={0.8} />
              <StatusBox x={90} y={50} w={300} h={36} label="2. 동일성 유지" sub="종류·수량 일치" color={C.blue} progress={0.7} />
              <StatusBox x={90} y={28} w={300} h={20} label="1. 분리 보관" sub="" color={C.blue} progress={0.6} />

              {/* 좌측 범례 */}
              <text x={60} y={45} textAnchor="end" fontSize={8} fill="var(--muted-foreground)">기본</text>
              <text x={60} y={65} textAnchor="end" fontSize={8} fill="var(--muted-foreground)">수치</text>
              <text x={60} y={113} textAnchor="end" fontSize={8} fill="var(--muted-foreground)">물리</text>
              <text x={60} y={153} textAnchor="end" fontSize={8} fill="var(--muted-foreground)">기록</text>
              <text x={60} y={193} textAnchor="end" fontSize={8} fill="var(--muted-foreground)">재무</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
