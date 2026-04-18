import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const C = {
  blue: '#3B82F6',
  green: '#22C55E',
  amber: '#F59E0B',
  red: '#EF4444',
};

const STEPS = [
  {
    label: '사후관리: 3년 유지 주기',
    body: '인증 후 매년 사후심사(핵심 항목 재확인 + 변경 관리 중점). 3년 후 갱신 심사(최초 심사 동일 수준). 중대 사고/조직 변경 시 수시 보고 의무.',
  },
  {
    label: '인증 취소 사유와 영향',
    body: '거짓 서류, 중대 사고 미보고, 사후심사 거부, 보완 미이행 → 인증 취소. VASP의 경우 인증 취소 = 신고 요건 미충족 = 영업 정지.',
  },
  {
    label: '증적 관리 체계',
    body: '모든 증적을 인증 기준 번호 체계로 일원화 저장. 자동 수집 가능 항목은 스크립트로 자동화. 모든 증적에 날짜(작성일/수행일/승인일) 명확 기록.',
  },
];

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--muted-foreground)" strokeWidth={1} markerEnd="url(#pc-arrow)" />;
}

export default function PostCertViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="pc-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">인증 유지 3년 주기</text>

              {/* Timeline */}
              <rect x={30} y={30} width={420} height={4} rx={2} fill="var(--border)" opacity={0.3} />
              <motion.rect x={30} y={30} width={420} height={4} rx={2} fill={C.blue}
                initial={{ width: 0 }} animate={{ width: 420 }} transition={{ duration: 1.2 }} />

              {/* Year markers */}
              <circle cx={30} cy={32} r={4} fill={C.green} />
              <circle cx={160} cy={32} r={4} fill={C.amber} />
              <circle cx={310} cy={32} r={4} fill={C.amber} />
              <circle cx={450} cy={32} r={4} fill={C.red} />

              <text x={30} y={50} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.green}>인증 취득</text>
              <text x={160} y={50} textAnchor="middle" fontSize={8} fill={C.amber}>1차 사후심사</text>
              <text x={310} y={50} textAnchor="middle" fontSize={8} fill={C.amber}>2차 사후심사</text>
              <text x={450} y={50} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.red}>갱신 심사</text>

              {/* Annual audit details */}
              <motion.g initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                <ActionBox x={90} y={60} w={140} h={35} label="사후심사 범위" sub="핵심 항목 + 변경 관리" color={C.amber} />
                <ActionBox x={310} y={60} w={140} h={35} label="갱신 심사 범위" sub="최초 심사와 동일" color={C.red} />
              </motion.g>

              {/* Ongoing duties */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <rect x={30} y={110} width={420} height={50} rx={8} fill="var(--card)" stroke={C.blue} strokeWidth={0.6} />
                <text x={240} y={128} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.blue}>상시 의무</text>

                <DataBox x={45} y={135} w={120} h={20} label="내부 감사 (연 1회)" color={C.blue} />
                <DataBox x={180} y={135} w={120} h={20} label="위험평가 갱신" color={C.blue} />
                <DataBox x={315} y={135} w={120} h={20} label="중대 사고 수시 보고" color={C.blue} />
              </motion.g>

              {/* Renewal loop */}
              <motion.path d="M 450 50 C 470 50, 470 180, 450 180 L 50 180 C 30 180, 30 170, 30 160 L 30 155"
                fill="none" stroke={C.green} strokeWidth={0.8} strokeDasharray="4 3" markerEnd="url(#pc-arrow)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.7 }} />
              <text x={240} y={192} textAnchor="middle" fontSize={8} fill={C.green}>갱신 후 다시 3년 주기 시작</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">인증 취소 사유</text>

              {/* Causes */}
              <ActionBox x={20} y={30} w={100} h={35} label="거짓 서류" sub="허위 증적 제출" color={C.red} />
              <ActionBox x={130} y={30} w={100} h={35} label="사고 미보고" sub="중대 사고 은폐" color={C.red} />
              <ActionBox x={240} y={30} w={100} h={35} label="심사 거부" sub="사후심사 불응" color={C.red} />
              <ActionBox x={350} y={30} w={110} h={35} label="보완 미이행" sub="결함 방치" color={C.red} />

              {/* Converge to cancellation */}
              <Arrow x1={70} y1={65} x2={200} y2={85} />
              <Arrow x1={180} y1={65} x2={215} y2={85} />
              <Arrow x1={290} y1={65} x2={265} y2={85} />
              <Arrow x1={405} y1={65} x2={280} y2={85} />

              <motion.g initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }}>
                <AlertBox x={140} y={88} w={200} h={35} label="인증 취소" sub="KISA 공식 결정" color={C.red} />
              </motion.g>

              {/* VASP impact chain */}
              <Arrow x1={240} y1={123} x2={240} y2={140} />

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <rect x={60} y={142} width={360} height={45} rx={8} fill="var(--card)" stroke={C.red} strokeWidth={1} />

                <ActionBox x={70} y={148} w={100} h={30} label="인증 상실" sub="VASP" color={C.red} />
                <Arrow x1={170} y1={163} x2={188} y2={163} />
                <ActionBox x={190} y={148} w={100} h={30} label="신고 요건 미충족" sub="특금법" color={C.red} />
                <Arrow x1={290} y1={163} x2={308} y2={163} />
                <ActionBox x={310} y={148} w={100} h={30} label="영업 정지" sub="사업 중단" color={C.red} />
              </motion.g>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">증적 관리 3원칙</text>

              {/* Principle 1: Unified storage */}
              <ModuleBox x={20} y={30} w={140} h={50} label="일원화 저장" sub="인증 기준 번호 체계" color={C.blue} />

              <motion.g initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                <rect x={25} y={90} width={130} height={24} rx={4} fill="var(--card)" stroke={C.blue} strokeWidth={0.5} />
                <text x={90} y={106} textAnchor="middle" fontSize={8} fill={C.blue}>/2.5/2.5.3/비밀번호정책/</text>
              </motion.g>

              {/* Principle 2: Automation */}
              <ModuleBox x={175} y={30} w={140} h={50} label="자동 수집" sub="스크립트 적재" color={C.green} />

              <motion.g initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                <rect x={180} y={90} width={130} height={24} rx={4} fill="var(--card)" stroke={C.green} strokeWidth={0.5} />
                <text x={245} y={106} textAnchor="middle" fontSize={8} fill={C.green}>접근로그, 백업 알림, MFA</text>
              </motion.g>

              {/* Principle 3: Date */}
              <ModuleBox x={330} y={30} w={130} h={50} label="날짜 명확" sub="작성/수행/승인일" color={C.amber} />

              <motion.g initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                <rect x={335} y={90} width={120} height={24} rx={4} fill="var(--card)" stroke={C.amber} strokeWidth={0.5} />
                <text x={395} y={106} textAnchor="middle" fontSize={8} fill={C.amber}>시스템 시계 포함 캡처</text>
              </motion.g>

              {/* Flow to audit */}
              <Arrow x1={90} y1={116} x2={200} y2={140} />
              <Arrow x1={245} y1={116} x2={240} y2={140} />
              <Arrow x1={395} y1={116} x2={280} y2={140} />

              <motion.g initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6 }}>
                <rect x={120} y={142} width={240} height={35} rx={8} fill="var(--card)" stroke={C.green} strokeWidth={1} />
                <text x={240} y={159} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.green}>심사 대비 즉시 제출 가능</text>
                <text x={240} y={173} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">증적 미비 = 심사 최빈 결함</text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
