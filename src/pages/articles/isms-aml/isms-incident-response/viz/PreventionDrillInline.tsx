import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, StatusBox, ModuleBox, AlertBox } from '@/components/viz/boxes';

const C = { blue: '#3b82f6', red: '#ef4444', green: '#22c55e', amber: '#f59e0b' };

const STEPS = [
  {
    label: '재발방지: 정책 개정 → 시스템 강화 → 교육',
    body: '사고 원인에 해당하는 정책 강화, 불필요 서비스 비활성화와 네트워크 세분화로 공격 표면 축소, 전 직원 보안교육과 기술 심화교육 분리 실시.',
  },
  {
    label: '내부자 모니터링: UBA + 이상 로그인 감시',
    body: 'UBA로 평소 행동 패턴 학습 후 이탈 탐지. 동시 다중 로그인, 임파서블 트래블, 비인가 장치를 실시간 감시. 프라이버시와 균형 필수.',
  },
  {
    label: '정기 모의훈련: 탁상 + 시뮬레이션',
    body: '탁상 훈련은 구두 진행으로 분기별 적합. 시뮬레이션은 레드팀 vs 블루팀 실전 공방. AAR로 개선점 도출 후 절차서 반영.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} markerEnd="url(#ir-pd-arrow)" />;
}

export default function PreventionDrillInline() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ir-pd-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={160} y={5} w={160} h={26} label="사고 원인 분석 결과" color={C.red} />
              <Arrow x1={200} y1={33} x2={70} y2={55} color={C.red} />
              <Arrow x1={240} y1={33} x2={240} y2={55} color={C.amber} />
              <Arrow x1={280} y1={33} x2={410} y2={55} color={C.green} />

              <ActionBox x={10} y={56} w={120} h={36} label="정책 개정" sub="MFA 확대·게이트웨이 도입" color={C.red} />
              <ActionBox x={180} y={56} w={120} h={36} label="시스템 강화" sub="서비스 비활성화·세분화" color={C.amber} />
              <ActionBox x={350} y={56} w={120} h={36} label="보안 교육" sub="전직원 + 기술 심화" color={C.green} />

              <Arrow x1={70} y1={94} x2={70} y2={115} color={C.red} />
              <Arrow x1={240} y1={94} x2={240} y2={115} color={C.amber} />
              <Arrow x1={410} y1={94} x2={410} y2={115} color={C.green} />

              <rect x={10} y={117} width={120} height={22} rx={4} fill="var(--card)" stroke={C.red} strokeWidth={0.6} />
              <text x={70} y={132} textAnchor="middle" fontSize={8} fill="var(--foreground)">조항 강화·신설</text>
              <rect x={180} y={117} width={120} height={22} rx={4} fill="var(--card)" stroke={C.amber} strokeWidth={0.6} />
              <text x={240} y={132} textAnchor="middle" fontSize={8} fill="var(--foreground)">공격 표면 축소</text>
              <rect x={350} y={117} width={120} height={22} rx={4} fill="var(--card)" stroke={C.green} strokeWidth={0.6} />
              <text x={410} y={132} textAnchor="middle" fontSize={8} fill="var(--foreground)">인식·기술 분리</text>

              <text x={240} y={165} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">교육이 재발방지의 가장 효과적 수단</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={140} y={5} w={200} h={28} label="UBA (사용자 행위 분석)" sub="평소 패턴 학습" color={C.amber} />
              <Arrow x1={200} y1={35} x2={80} y2={58} color={C.amber} />
              <Arrow x1={280} y1={35} x2={400} y2={58} color={C.amber} />

              <AlertBox x={15} y={60} w={130} h={34} label="이상 행위 탐지" sub="업무 외 대량 다운로드" color={C.red} />
              <AlertBox x={335} y={60} w={130} h={34} label="이상 로그인 감시" sub="동시접속·임파서블 트래블" color={C.red} />

              <Arrow x1={80} y1={96} x2={240} y2={118} color={C.red} />
              <Arrow x1={400} y1={96} x2={240} y2={118} color={C.red} />
              <ActionBox x={160} y={118} w={160} h={30} label="자동 경보 발생" sub="보안팀 검토" color={C.blue} />

              <text x={240} y={172} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">모니터링 사전 고지 + 업무 범위 한정 + 열람 권한 제한</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={160} y={5} w={160} h={26} label="연 1회+ 모의훈련" color={C.blue} />
              <Arrow x1={200} y1={33} x2={100} y2={55} color={C.blue} />
              <Arrow x1={280} y1={33} x2={380} y2={55} color={C.blue} />

              <ModuleBox x={20} y={56} w={160} h={38} label="탁상 훈련" sub="Tabletop Exercise" color={C.green} />
              <ModuleBox x={300} y={56} w={160} h={38} label="시뮬레이션 훈련" sub="Red vs Blue Team" color={C.red} />

              <rect x={20} y={100} width={160} height={22} rx={4} fill="var(--card)" stroke={C.green} strokeWidth={0.6} />
              <text x={100} y={115} textAnchor="middle" fontSize={8} fill="var(--foreground)">저비용·구두 진행·분기별</text>
              <rect x={300} y={100} width={160} height={22} rx={4} fill="var(--card)" stroke={C.red} strokeWidth={0.6} />
              <text x={380} y={115} textAnchor="middle" fontSize={8} fill="var(--foreground)">실전 공방·실환경·연 1회</text>

              <Arrow x1={100} y1={124} x2={200} y2={142} color={C.green} />
              <Arrow x1={380} y1={124} x2={280} y2={142} color={C.red} />
              <StatusBox x={160} y={140} w={160} h={28} label="AAR 사후 검토" sub="개선점 → 절차서 반영" color={C.amber} progress={1} />
              <text x={240} y={190} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">미실시는 ISMS 심사 결함으로 판정</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
