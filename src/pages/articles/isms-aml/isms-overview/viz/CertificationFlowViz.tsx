import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, ModuleBox } from '@/components/viz/boxes';

const C = {
  blue: '#3B82F6',
  green: '#22C55E',
  amber: '#F59E0B',
  red: '#EF4444',
};

const STEPS = [
  {
    label: '인증 신청 → 서면심사',
    body: '범위 확정(시스템, 서비스, 물리 위치)이 첫 단계. 범위가 넓으면 비용 증가, 좁으면 "범위 축소 지적". 서면심사는 제출 문서의 논리적 완결성을 검토.',
  },
  {
    label: '현장심사 → 보완조치',
    body: '심사원이 실제 사업장을 방문하여 문서와 현실의 일치를 검증. VASP의 경우 콜드월렛 보관, 멀티시그 설정, 출금 승인 체계가 중점 심사 대상. 결함 시 40일 이내 보완.',
  },
  {
    label: '인증 부여 → 사후 관리',
    body: '보완조치 적합 판정 후 인증서 발급. 유효기간 3년, 매년 사후심사로 유지 여부 재확인. 갱신 심사를 놓치면 인증 만료.',
  },
];

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--muted-foreground)" strokeWidth={1} markerEnd="url(#cf-arrow)" />;
}

export default function CertificationFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="cf-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Scope definition */}
              <ModuleBox x={30} y={15} w={140} h={50} label="인증 범위 확정" sub="시스템 + 서비스 + 물리 위치" color={C.blue} />

              <Arrow x1={170} y1={40} x2={195} y2={40} />

              {/* Application */}
              <ActionBox x={200} y={20} w={100} h={40} label="KISA 신청" sub="신청서 제출" color={C.blue} />

              <Arrow x1={300} y1={40} x2={325} y2={40} />

              {/* Document review */}
              <ActionBox x={330} y={20} w={120} h={40} label="서면심사" sub="문서 논리 검토" color={C.green} />

              {/* Documents flowing in */}
              <DataBox x={50} y={90} w={100} h={26} label="정보보호 정책서" color={C.blue} />
              <DataBox x={170} y={90} w={90} h={26} label="위험평가서" color={C.blue} />
              <DataBox x={280} y={90} w={110} h={26} label="보호대책 증적" color={C.blue} />

              <Arrow x1={100} y1={116} x2={390} y2={65} />
              <Arrow x1={215} y1={116} x2={390} y2={65} />
              <Arrow x1={335} y1={116} x2={390} y2={65} />

              {/* Warning */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <rect x={80} y={140} width={320} height={30} rx={6} fill="var(--card)" stroke={C.amber} strokeWidth={0.8} strokeDasharray="4 3" />
                <text x={240} y={155} textAnchor="middle" fontSize={9} fill={C.amber}>범위 설정 = 인증의 성패를 좌우하는 첫 번째 결정</text>
                <text x={240} y={166} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">넓으면 비용 폭증, 좁으면 범위 축소 지적</text>
              </motion.g>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* On-site audit */}
              <ModuleBox x={20} y={15} w={140} h={50} label="현장심사" sub="3~5일, 심사원 2~4명" color={C.green} />

              {/* Audit checks */}
              <motion.g initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                <ActionBox x={190} y={10} w={130} h={28} label="서버실 출입통제 확인" color={C.green} />
                <ActionBox x={190} y={42} w={130} h={28} label="DB 접근 로그 검증" color={C.green} />
                <ActionBox x={340} y={10} w={120} h={28} label="MFA 적용 확인" color={C.green} />
                <ActionBox x={340} y={42} w={120} h={28} label="퇴사자 계정 조회" color={C.green} />
              </motion.g>

              <Arrow x1={160} y1={40} x2={188} y2={30} />
              <Arrow x1={160} y1={40} x2={188} y2={56} />

              {/* Gap found */}
              <Arrow x1={240} y1={75} x2={240} y2={90} />

              <rect x={120} y={90} width={240} height={35} rx={8} fill="var(--card)" stroke={C.red} strokeWidth={1} />
              <text x={240} y={107} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.red}>결함 도출 (중결함 / 경결함)</text>
              <text x={240} y={120} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">문서와 현실이 불일치하는 항목</text>

              {/* Remediation */}
              <Arrow x1={240} y1={127} x2={240} y2={142} />

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <ActionBox x={140} y={145} w={200} h={40} label="보완조치 수행 → 증적 제출" sub="40일 이내 완료 필수" color={C.amber} />
              </motion.g>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Certification granted */}
              <ModuleBox x={160} y={10} w={160} h={45} label="인증서 발급" sub="보완조치 적합 판정 후" color={C.green} />

              <Arrow x1={240} y1={55} x2={240} y2={70} />

              {/* Timeline bar */}
              <rect x={40} y={75} width={400} height={4} rx={2} fill="var(--border)" opacity={0.3} />
              <motion.rect x={40} y={75} width={400} height={4} rx={2} fill={C.blue}
                initial={{ width: 0 }} animate={{ width: 400 }} transition={{ duration: 1.2 }} />

              {/* Year markers */}
              <text x={40} y={95} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.blue}>인증일</text>
              <text x={173} y={95} textAnchor="middle" fontSize={8} fill={C.amber}>1년차</text>
              <text x={307} y={95} textAnchor="middle" fontSize={8} fill={C.amber}>2년차</text>
              <text x={440} y={95} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.red}>3년 만료</text>

              <circle cx={40} cy={77} r={3} fill={C.blue} />
              <circle cx={173} cy={77} r={3} fill={C.amber} />
              <circle cx={307} cy={77} r={3} fill={C.amber} />
              <circle cx={440} cy={77} r={3} fill={C.red} />

              {/* Annual audits */}
              <ActionBox x={113} y={105} w={120} h={30} label="사후심사 (1회차)" sub="핵심 항목 재확인" color={C.amber} />
              <ActionBox x={247} y={105} w={120} h={30} label="사후심사 (2회차)" sub="변경 관리 중점" color={C.amber} />

              {/* Renewal */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <Arrow x1={440} y1={95} x2={440} y2={148} />
                <rect x={340} y={150} width={130} height={35} rx={8} fill="var(--card)" stroke={C.red} strokeWidth={1} />
                <text x={405} y={166} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.red}>갱신 심사</text>
                <text x={405} y={179} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">최초 심사 동일 수준</text>

                <motion.path d="M 340 167 L 60 167 C 45 167, 40 158, 40 148 L 40 100"
                  fill="none" stroke={C.blue} strokeWidth={0.8} strokeDasharray="4 3" markerEnd="url(#cf-arrow)"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.7 }} />
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
