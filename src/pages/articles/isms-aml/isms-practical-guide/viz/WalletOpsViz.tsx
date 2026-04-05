import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  red: '#ef4444',
  green: '#22c55e',
  blue: '#3b82f6',
  amber: '#f59e0b',
  purple: '#8b5cf6',
  cyan: '#06b6d4',
};

const STEPS = [
  {
    label: '월렛룸 BEFORE — 직무 분리 위반',
    body: '월렛 담당자와 서명 담당자가 물리 접근까지 보유하면, 자산 이동 권한 + 물리 통제가 한 사람에게 집중된다.',
  },
  {
    label: '월렛룸 AFTER — 직무 분리(SoD) 충족',
    body: '물리 접근 권한을 월렛 무관 인원으로 교체하여, 단독 자산 접근이 불가능한 구조를 만든다.',
  },
  {
    label: '이상거래 탐지 기준 — 수치로 정의',
    body: '"비정상적 거래"를 숫자로 정의해야 심사 통과. 월평균 3배, 30분 내 50%, 보유액 90% 등 구체적 기준 필수.',
  },
  {
    label: '회원탈퇴 분리보관 → 자동 파기',
    body: 'status 변경은 삭제가 아니다. 별도 테이블로 이동(분리보관) 후 5년 경과 시 MySQL 이벤트 스케줄러로 자동 파기.',
  },
];

/* ── 화살표 유틸 ── */
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

export default function WalletOpsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 월렛룸 */}
              <ModuleBox x={180} y={10} w={120} h={50} label="월렛룸" sub="콜드월렛 보관" color={C.purple} />

              {/* 접근자 3명 */}
              <ActionBox x={10} y={90} w={100} h={36} label="CISO" sub="총괄 책임자" color={C.blue} />
              <Arrow x1={75} y1={90} x2={220} y2={60} color={C.blue} />

              <AlertBox x={150} y={90} w={110} h={40} label="월렛 담당자" sub="자산 이동 권한 보유" color={C.red} />
              <Arrow x1={210} y1={90} x2={240} y2={60} color={C.red} />

              <AlertBox x={300} y={90} w={120} h={40} label="콜드월렛 서명자" sub="서명 키 보유" color={C.red} />
              <Arrow x1={350} y1={90} x2={260} y2={60} color={C.red} />

              {/* 경고 */}
              <AlertBox x={130} y={150} w={220} h={50} label="직무 분리 위반" sub="자산 이동 권한자 = 물리 접근 권한자" color={C.red} />
              <Arrow x1={240} y1={140} x2={240} y2={150} color={C.red} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 월렛룸 */}
              <ModuleBox x={180} y={10} w={120} h={50} label="월렛룸" sub="콜드월렛 보관" color={C.purple} />

              {/* 접근자 재구성 */}
              <ActionBox x={10} y={90} w={100} h={36} label="CISO" sub="총괄 (유지)" color={C.blue} />
              <Arrow x1={75} y1={90} x2={220} y2={60} color={C.blue} />

              <StatusBox x={150} y={88} w={120} h={44} label="일반 개발자 A" sub="월렛 무관 업무" color={C.green} progress={1} />
              <Arrow x1={210} y1={88} x2={240} y2={60} color={C.green} />

              <StatusBox x={310} y={88} w={120} h={44} label="일반 개발자 B" sub="월렛 무관 업무" color={C.green} progress={1} />
              <Arrow x1={370} y1={88} x2={260} y2={60} color={C.green} />

              {/* SoD 충족 */}
              <DataBox x={155} y={155} w={170} h={32} label="직무 분리(SoD) 충족" sub="단독 접근 불가 구조" color={C.green} />
              <Arrow x1={240} y1={140} x2={240} y2={155} color={C.green} />

              {/* 월렛 담당자 → 동행 필요 */}
              <rect x={10} y={150} width={120} height={42} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={70} y={168} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.amber}>월렛 담당자</text>
              <text x={70} y={182} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">동행 요청 필요</text>
              <Arrow x1={130} y1={170} x2={155} y2={170} color={C.amber} />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blue}>이상거래 탐지 기준</text>

              {/* 기준 3개 — StatusBox로 프로그레스 표현 */}
              <StatusBox x={20} y={34} w={200} h={50} label="월평균 3배 금액" sub="단일 거래 초과 시 알림" color={C.amber} progress={0.33} />
              <StatusBox x={20} y={94} w={200} h={50} label="30분 내 일평균 50%" sub="단기간 집중 거래 탐지" color={C.amber} progress={0.5} />
              <StatusBox x={20} y={154} w={200} h={50} label="보유액 90% 실시간 이체" sub="대량 이체 보류" color={C.red} progress={0.9} />

              {/* 화살표 → 조치 */}
              <Arrow x1={220} y1={59} x2={270} y2={100} color={C.amber} />
              <Arrow x1={220} y1={119} x2={270} y2={120} color={C.amber} />
              <Arrow x1={220} y1={179} x2={270} y2={140} color={C.red} />

              {/* 조치 박스 */}
              <AlertBox x={275} y={80} w={180} h={80} label="기준 초과 시" sub="책임자 이중확인 + 거래 보류" color={C.red} />

              {/* 단계적 대응 */}
              <rect x={290} y={128} width={150} height={26} rx={4} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={365} y={142} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                알림 → 추가인증 → 보류 → 잠금
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 흐름: 탈퇴 → 이동 → 분리보관 → 프로시저 → 삭제 */}
              <ActionBox x={10} y={30} w={85} h={36} label="회원탈퇴 요청" color={C.blue} />
              <Arrow x1={95} y1={48} x2={115} y2={48} color={C.blue} />

              <ActionBox x={118} y={30} w={100} h={36} label="cancel_user_info" sub="데이터 이동" color={C.purple} />
              <Arrow x1={218} y1={48} x2={240} y2={48} color={C.purple} />

              <DataBox x={243} y={32} w={110} h={32} label="분리보관 DB" sub="5년 보유" color={C.amber} />
              <Arrow x1={353} y1={48} x2={375} y2={48} color={C.amber} />

              <ActionBox x={378} y={30} w={90} h={40} label="DeleteOld..." sub="저장 프로시저" color={C.green} />

              {/* 결과 */}
              <Arrow x1={423} y1={70} x2={423} y2={95} color={C.green} />
              <StatusBox x={368} y={98} w={100} h={44} label="자동 삭제" sub="보유 만료 레코드" color={C.green} progress={1} />

              {/* MySQL 이벤트 스케줄러 */}
              <rect x={10} y={100} width={340} height={65} rx={8} fill="var(--card)" stroke={C.cyan} strokeWidth={0.8} />
              <text x={20} y={118} fontSize={10} fontWeight={700} fill={C.cyan}>MySQL 이벤트 스케줄러</text>
              <text x={20} y={135} fontSize={9} fill="var(--muted-foreground)">매일 자동 실행 → 보유 만료일 경과 레코드 영구 삭제</text>
              <text x={20} y={152} fontSize={9} fill="var(--muted-foreground)">인적 오류 배제 — 시스템 자동화가 핵심</text>

              {/* 원본 테이블 설명 */}
              <rect x={10} y={178} width={220} height={32} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={120} y={196} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">원본 테이블에는 탈퇴 회원 데이터 없음 (INSERT → DELETE)</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
