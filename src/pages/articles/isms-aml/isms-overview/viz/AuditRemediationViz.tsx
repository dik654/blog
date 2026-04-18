import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  blue: '#3B82F6',
  green: '#22C55E',
  amber: '#F59E0B',
  red: '#EF4444',
};

const STEPS = [
  {
    label: '심사 단계: 서면 -> 현장 → 결함 도출',
    body: '서면심사에서 문서 논리적 완결성 확인. 현장심사(3~5일)에서 문서와 현실의 일치 검증. 심사원이 랜덤 샘플링으로 항목 검증.',
  },
  {
    label: '결함 분류와 번호 체계',
    body: '결함은 중결함(미이행/심각 부적합 -> 보완 필수)과 경결함(부분 미흡 → 보완 후 인증)으로 분류. 번호는 인증 기준 3자리(영역.분류.항목)를 그대로 사용.',
  },
  {
    label: '보완조치 4단계 프로세스',
    body: '결함 정리(대장 작성) -> 보완 내역서(현상->조치->결과) -> 증적 첨부(스크린샷, 보고서, 설정 파일) → 완료 공문 제출. 40일 이내 완료 필수.',
  },
  {
    label: '사후관리: 인증 유지의 핵심',
    body: '연 1회 사후심사 + 3년 유효기간 후 갱신 심사. 내부 감사 연 1회, 중대 사고 시 수시 보고 필수. 증적 관리 체계(일원화, 자동화, 날짜 기록)가 성패를 좌우.',
  },
];

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--muted-foreground)" strokeWidth={1} markerEnd="url(#aur-arrow)" />;
}

export default function AuditRemediationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="aur-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: Audit Stages */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Three audit stages */}
              <ModuleBox x={30} y={20} w={130} h={50} label="서면심사" sub="문서 논리 검토" color={C.blue} />
              <ModuleBox x={185} y={20} w={130} h={50} label="현장심사" sub="3~5일 현장 방문" color={C.green} />
              <ModuleBox x={340} y={20} w={120} h={50} label="결함 도출" sub="결함 보고서 작성" color={C.red} />

              <Arrow x1={160} y1={45} x2={183} y2={45} />
              <Arrow x1={315} y1={45} x2={338} y2={45} />

              {/* Document review items */}
              <text x={95} y={88} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.blue}>서면심사 확인 사항</text>
              <DataBox x={15} y={95} w={80} h={24} label="정책 반영 여부" color={C.blue} />
              <DataBox x={105} y={95} w={75} h={24} label="자산 완전성" color={C.blue} />

              {/* On-site verification items */}
              <text x={250} y={88} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.green}>현장심사 확인 사항</text>
              <DataBox x={185} y={95} w={70} h={24} label="출입통제" color={C.green} />
              <DataBox x={265} y={95} w={70} h={24} label="MFA 확인" color={C.green} />

              {/* Random sampling highlight */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <AlertBox x={100} y={140} w={280} h={44} label="랜덤 샘플링으로 검증" sub="200명 중 10명 선정, 서버 20대 중 3대 점검" color={C.amber} />
                <Arrow x1={250} y1={119} x2={250} y2={138} />
              </motion.g>

              <text x={240} y={205} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">'일부만 준비'하면 샘플에 걸릴 때 즉시 결함 -- 전수 대비 필수</text>
            </motion.g>
          )}

          {/* Step 1: Defect Classification */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">결함 분류 체계</text>

              {/* Two defect types */}
              <rect x={40} y={35} width={180} height={60} rx={8} fill={`${C.red}08`} stroke={C.red} strokeWidth={1} />
              <text x={130} y={55} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.red}>중결함</text>
              <text x={130} y={72} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">미이행 또는 심각 부적합</text>
              <text x={130} y={86} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.red}>보완 미완료 = 인증 불가</text>

              <rect x={260} y={35} width={180} height={60} rx={8} fill={`${C.amber}08`} stroke={C.amber} strokeWidth={1} />
              <text x={350} y={55} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.amber}>경결함</text>
              <text x={350} y={72} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">부분 이행, 일부 미흡</text>
              <text x={350} y={86} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.amber}>보완 후 인증 가능</text>

              {/* Number system */}
              <text x={240} y={118} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">번호 체계: 영역.분류.항목</text>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                {/* Example breakdown */}
                <rect x={120} y={128} width={240} height={36} rx={6} fill="var(--card)" stroke={C.blue} strokeWidth={1} />

                <rect x={130} y={135} width={50} height={22} rx={4} fill={`${C.blue}15`} />
                <text x={155} y={150} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.blue}>2</text>

                <text x={188} y={150} textAnchor="middle" fontSize={12} fill="var(--muted-foreground)">.</text>

                <rect x={196} y={135} width={50} height={22} rx={4} fill={`${C.green}15`} />
                <text x={221} y={150} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.green}>5</text>

                <text x={254} y={150} textAnchor="middle" fontSize={12} fill="var(--muted-foreground)">.</text>

                <rect x={262} y={135} width={50} height={22} rx={4} fill={`${C.amber}15`} />
                <text x={287} y={150} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.amber}>6</text>

                <text x={155} y={180} textAnchor="middle" fontSize={8} fill={C.blue}>보호대책</text>
                <text x={221} y={180} textAnchor="middle" fontSize={8} fill={C.green}>인증/권한</text>
                <text x={287} y={180} textAnchor="middle" fontSize={8} fill={C.amber}>특권계정 관리</text>
              </motion.g>

              <text x={240} y={205} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">심사 소견을 정확히 이해해야 올바른 보완 방향 설정 가능</text>
            </motion.g>
          )}

          {/* Step 2: Remediation Process */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">보완조치 4단계 (40일 이내)</text>

              {/* 4 steps */}
              <ActionBox x={15} y={30} w={105} h={42} label="1. 결함 정리" sub="대장 작성 + 우선순위" color={C.blue} />
              <ActionBox x={130} y={30} w={105} h={42} label="2. 보완 내역서" sub="현상->조치->결과" color={C.green} />
              <ActionBox x={245} y={30} w={105} h={42} label="3. 증적 첨부" sub="스크린샷 + 보고서" color={C.amber} />
              <ActionBox x={360} y={30} w={105} h={42} label="4. 공문 제출" sub="일괄 제출" color={C.red} />

              <Arrow x1={120} y1={51} x2={128} y2={51} />
              <Arrow x1={235} y1={51} x2={243} y2={51} />
              <Arrow x1={350} y1={51} x2={358} y2={51} />

              {/* Evidence types */}
              <text x={240} y={92} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">증적 유형 예시</text>

              <DataBox x={15} y={100} w={100} h={26} label="설정 스크린샷" color={C.blue} />
              <DataBox x={125} y={100} w={100} h={26} label="교육 수료증" color={C.green} />
              <DataBox x={235} y={100} w={110} h={26} label="로그 검토 보고서" color={C.amber} />
              <DataBox x={355} y={100} w={110} h={26} label="복구 훈련 결과" color={C.red} />

              {/* Timeline bar */}
              <rect x={40} y={145} width={400} height={4} rx={2} fill="var(--border)" opacity={0.3} />
              <motion.rect x={40} y={145} width={400} height={4} rx={2} fill={C.amber}
                initial={{ width: 0 }} animate={{ width: 400 }} transition={{ duration: 1.2 }} />
              <text x={40} y={163} fontSize={8} fill="var(--muted-foreground)">결함 도출</text>
              <text x={440} y={163} textAnchor="end" fontSize={8} fill="var(--muted-foreground)">40일 마감</text>

              {/* Extension note */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <AlertBox x={130} y={175} w={220} h={34} label="연장 가능: 최대 1회, 40일 추가" sub="연장 사유서 + 진행 현황 + 완료 계획 제출" color={C.amber} />
              </motion.g>
            </motion.g>
          )}

          {/* Step 3: Post-Certification Management */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">인증 유지 = 인증 취득보다 중요</text>

              {/* 3-year cycle */}
              <ModuleBox x={170} y={28} w={140} h={40} label="인증 부여" sub="3년 유효기간" color={C.green} />

              {/* Annual cycle arrows */}
              <ActionBox x={20} y={90} w={130} h={40} label="연 1회 사후심사" sub="변경 관리 중점 확인" color={C.blue} />
              <ActionBox x={175} y={90} w={130} h={40} label="연 1회 내부 감사" sub="자체 점검 + 보완" color={C.green} />
              <ActionBox x={330} y={90} w={130} h={40} label="수시 보고" sub="중대 사고/조직 변경" color={C.amber} />

              <Arrow x1={210} y1={68} x2={85} y2={88} />
              <Arrow x1={240} y1={68} x2={240} y2={88} />
              <Arrow x1={270} y1={68} x2={395} y2={88} />

              {/* Evidence management */}
              <text x={240} y={152} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">증적 관리 체계 (성패의 핵심)</text>

              <StatusBox x={20} y={162} w={140} h={48} label="저장소 일원화" sub="인증 기준 번호 폴더 구조" color={C.blue} progress={1} />
              <StatusBox x={175} y={162} w={140} h={48} label="자동 수집" sub="로그, 백업 알림 스크립트" color={C.green} progress={0.8} />
              <StatusBox x={330} y={162} w={130} h={48} label="날짜 기록 필수" sub="수행일/승인일 명확 기재" color={C.amber} progress={0.6} />

              {/* Cancellation warning */}
              <motion.text x={240} y={218} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.red}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                인증 취소 사유: 거짓 서류, 중대 사고 미보고, 사후심사 거부 -- VASP 영업 정지 위험
              </motion.text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
