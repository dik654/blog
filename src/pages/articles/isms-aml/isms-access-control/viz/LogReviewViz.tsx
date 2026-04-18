import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  primary: '#6366f1',
  action: '#f59e0b',
  safe: '#10b981',
  danger: '#ef4444',
};

const STEPS = [
  {
    label: '월간 로그 검토 흐름',
    body: 'DB 접근 로그 수집 → 비정상 패턴 탐지(비인가 접근, 대량 조회, 비업무 시간) → 조치 + 이력 기록.\nISMS 심사: "로그 검토를 실시했는가, 이상 징후에 어떻게 대응했는가" 확인.',
  },
  {
    label: '로그 보관과 정책 순환 구조',
    body: '정책 수립 → 솔루션 구현 → 로그 생성 → 정기 검토 → 이상 조치 → 정책 개선의 순환.\n"도구를 샀다"가 아니라 "도구로 무엇을 발견하고 어떻게 대응했는가"가 심사 핵심.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#lr-viz-arr)" />;
}

export default function LogReviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="lr-viz-arr" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.primary}>월간 로그 검토 프로세스</text>

              {/* 수집 → 분석 → 조치 */}
              <DataBox x={10} y={32} w={80} h={28} label="로그 수집" color={C.primary} />
              <Arrow x1={90} y1={46} x2={108} y2={46} color={C.action} />
              <ActionBox x={110} y={30} w={95} h={32} label="패턴 분석" sub="비정상 탐지" color={C.action} />
              <Arrow x1={205} y1={46} x2={223} y2={46} color={C.danger} />
              <ActionBox x={225} y={30} w={85} h={32} label="이상 식별" sub="사유 확인" color={C.danger} />
              <Arrow x1={310} y1={46} x2={328} y2={46} color={C.safe} />
              <ActionBox x={330} y={30} w={70} h={32} label="조치" sub="차단/경고" color={C.safe} />
              <Arrow x1={400} y1={46} x2={418} y2={46} color={C.safe} />
              <StatusBox x={420} y={30} w={55} h={32} label="기록" sub="" color={C.safe} progress={1} />

              <rect x={10} y={75} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={92} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.danger}>탐지 대상 항목</text>

              <AlertBox x={10} y={100} w={110} h={40} label="비인가 접근" sub="차단 IP에서 시도" color={C.danger} />
              <AlertBox x={130} y={100} w={100} h={40} label="대량 조회" sub="SELECT * 전체" color={C.danger} />
              <AlertBox x={240} y={100} w={105} h={40} label="권한 밖 쿼리" sub="읽기 계정 INSERT" color={C.danger} />
              <AlertBox x={355} y={100} w={115} h={40} label="비업무 시간" sub="심야/주말 접속" color={C.action} />

              <rect x={60} y={155} width={360} height={34} rx={6} fill="var(--card)" stroke={C.primary} strokeWidth={0.5} />
              <text x={240} y={170} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.primary}>ISMS 심사 포인트</text>
              <text x={240} y={183} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">검토 실시 여부 + 이상 징후 발견 시 조치 이력 + 월간 검토서 산출물</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.safe}>접근통제 순환 구조</text>

              {/* 순환 흐름: 6단계 원형 배치 */}
              <ActionBox x={170} y={30} w={90} h={30} label="정책 수립" sub="" color={C.primary} />
              <Arrow x1={260} y1={45} x2={305} y2={55} color={C.primary} />

              <ActionBox x={310} y={50} w={90} h={30} label="솔루션 구현" sub="" color={C.action} />
              <Arrow x1={355} y1={80} x2={355} y2={95} color={C.action} />

              <ActionBox x={310} y={98} w={90} h={30} label="로그 생성" sub="" color={C.action} />
              <Arrow x1={310} y1={113} x2={260} y2={125} color={C.danger} />

              <ActionBox x={170} y={118} w={90} h={30} label="정기 검토" sub="" color={C.danger} />
              <Arrow x1={170} y1={133} x2={120} y2={120} color={C.danger} />

              <ActionBox x={60} y={98} w={90} h={30} label="이상 조치" sub="" color={C.safe} />
              <Arrow x1={105} y1={98} x2={105} y2={82} color={C.safe} />

              <ActionBox x={60} y={50} w={90} h={30} label="정책 개선" sub="" color={C.safe} />
              <Arrow x1={150} y1={58} x2={170} y2={50} color={C.primary} />

              {/* 중앙 핵심 메시지 */}
              <rect x={155} y={70} width={140} height={36} rx={18} fill="var(--card)" stroke={C.safe} strokeWidth={0.8} />
              <text x={225} y={85} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.safe}>지속적 순환</text>
              <text x={225} y={98} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">1회성이 아닌 반복</text>

              <rect x={40} y={160} width={400} height={32} rx={6} fill="var(--card)" stroke={C.danger} strokeWidth={0.5} />
              <text x={240} y={176} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.danger}>심사 핵심: "도구를 샀다"가 아니라 "발견하고 대응했는가"</text>
              <text x={240} y={188} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">로그 보관: 개인정보보호법 최소 1년, VASP 특금법 5년 권장</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
