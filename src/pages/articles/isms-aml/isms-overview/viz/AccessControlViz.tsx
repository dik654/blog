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
    label: '2.5 인증: MFA와 비밀번호 정책',
    body: '관리자 시스템 접속 시 MFA(다중 인증) 필수. TOTP 또는 하드웨어 키 권장 — SMS 기반 OTP는 SIM 스와핑 공격에 취약. 비밀번호는 8자+, 90일 주기 변경.',
  },
  {
    label: '2.5 권한: 최소 권한 원칙',
    body: '업무에 필요한 최소 권한만 부여. 장기 미접속(6개월+) 계정은 자동 잠금. 공용 계정은 대장 등록 + 90일 변경. 관리자 권한은 별도 승인 절차.',
  },
  {
    label: '2.6 접근통제: 기술적 강제',
    body: 'DB 접근제어 프록시로 모든 쿼리 기록. DBA도 우회 불가. IP 기반 접근 제한 + 월간 로그 검토. 비상 계정은 봉인 관리(금고 보관).',
  },
];

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--muted-foreground)" strokeWidth={1} markerEnd="url(#ac-arrow)" />;
}

export default function AccessControlViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ac-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">MFA: 다중 인증 구성</text>

              {/* User attempting login */}
              <DataBox x={20} y={28} w={80} h={28} label="사용자" color={C.blue} />
              <Arrow x1={100} y1={42} x2={125} y2={42} />

              {/* Factor 1 */}
              <ActionBox x={130} y={25} w={100} h={34} label="알고 있는 것" sub="비밀번호" color={C.blue} />
              <Arrow x1={230} y1={42} x2={248} y2={42} />

              {/* Factor 2 */}
              <ActionBox x={252} y={25} w={100} h={34} label="가지고 있는 것" sub="TOTP / HW 키" color={C.green} />
              <Arrow x1={352} y1={42} x2={370} y2={42} />

              {/* Access granted */}
              <ModuleBox x={375} y={22} w={90} h={40} label="접근 허용" sub="2요소 충족" color={C.green} />

              {/* Password policy */}
              <motion.g initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                <rect x={20} y={78} width={200} height={50} rx={6} fill="var(--card)" stroke={C.blue} strokeWidth={0.8} />
                <text x={120} y={96} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.blue}>비밀번호 정책</text>
                <text x={120} y={110} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">8자+, 영문+숫자+특수, 90일 변경</text>
                <text x={120} y={122} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">직전 5개 재사용 금지</text>
              </motion.g>

              {/* OTP recommendation */}
              <motion.g initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                <rect x={240} y={78} width={220} height={50} rx={6} fill="var(--card)" stroke={C.green} strokeWidth={0.8} />
                <text x={350} y={96} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.green}>OTP 선택 가이드</text>

                <rect x={250} y={105} width={90} height={16} rx={3} fill={`${C.green}15`} stroke={C.green} strokeWidth={0.6} />
                <text x={295} y={117} textAnchor="middle" fontSize={8} fill={C.green}>TOTP / HW 키 권장</text>

                <rect x={350} y={105} width={100} height={16} rx={3} fill={`${C.red}10`} stroke={C.red} strokeWidth={0.6} />
                <text x={400} y={117} textAnchor="middle" fontSize={8} fill={C.red}>SMS OTP 비권장</text>
              </motion.g>

              {/* SIM swapping warning */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <AlertBox x={250} y={140} w={210} h={32} label="SMS → SIM 스와핑 취약" sub="공격자가 통신사 속여 번호 탈취" color={C.red} />
              </motion.g>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">최소 권한 원칙 (Least Privilege)</text>

              {/* User types */}
              <DataBox x={20} y={30} w={80} h={26} label="일반 직원" color={C.blue} />
              <DataBox x={20} y={65} w={80} h={26} label="개발자" color={C.green} />
              <DataBox x={20} y={100} w={80} h={26} label="DBA" color={C.amber} />
              <DataBox x={20} y={135} w={80} h={26} label="관리자" color={C.red} />

              {/* Permission levels - bars */}
              <Arrow x1={100} y1={43} x2={128} y2={43} />
              <Arrow x1={100} y1={78} x2={128} y2={78} />
              <Arrow x1={100} y1={113} x2={128} y2={113} />
              <Arrow x1={100} y1={148} x2={128} y2={148} />

              {/* Permission bars */}
              <motion.rect x={130} y={35} width={80} height={16} rx={3} fill={C.blue} opacity={0.3}
                initial={{ width: 0 }} animate={{ width: 80 }} transition={{ duration: 0.5 }} />
              <text x={175} y={47} textAnchor="middle" fontSize={8} fill={C.blue}>읽기 전용</text>

              <motion.rect x={130} y={70} width={150} height={16} rx={3} fill={C.green} opacity={0.3}
                initial={{ width: 0 }} animate={{ width: 150 }} transition={{ duration: 0.5, delay: 0.1 }} />
              <text x={210} y={82} textAnchor="middle" fontSize={8} fill={C.green}>개발 환경 한정</text>

              <motion.rect x={130} y={105} width={220} height={16} rx={3} fill={C.amber} opacity={0.3}
                initial={{ width: 0 }} animate={{ width: 220 }} transition={{ duration: 0.5, delay: 0.2 }} />
              <text x={245} y={117} textAnchor="middle" fontSize={8} fill={C.amber}>DB 접근 (접근제어 경유)</text>

              <motion.rect x={130} y={140} width={300} height={16} rx={3} fill={C.red} opacity={0.3}
                initial={{ width: 0 }} animate={{ width: 300 }} transition={{ duration: 0.5, delay: 0.3 }} />
              <text x={285} y={152} textAnchor="middle" fontSize={8} fill={C.red}>별도 승인 절차 (root/admin)</text>

              {/* Auto-lock policy */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <rect x={300} y={30} width={160} height={40} rx={6} fill="var(--card)" stroke={C.amber} strokeWidth={0.8} strokeDasharray="4 3" />
                <text x={380} y={48} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.amber}>6개월 미접속</text>
                <text x={380} y={62} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">자동 잠금/비활성화</text>
              </motion.g>

              <text x={240} y={180} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">업무 범위에 따라 권한 폭 제한 → 내부자 위협 최소화</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">DB 접근통제 아키텍처</text>

              {/* Users */}
              <DataBox x={15} y={30} w={65} h={24} label="서비스" color={C.blue} />
              <DataBox x={15} y={62} w={65} h={24} label="DBA" color={C.amber} />
              <DataBox x={15} y={94} w={65} h={24} label="백업" color={C.green} />
              <DataBox x={15} y={126} w={65} h={24} label="비상" color={C.red} />

              {/* Access control proxy */}
              <Arrow x1={80} y1={42} x2={118} y2={75} />
              <Arrow x1={80} y1={74} x2={118} y2={80} />
              <Arrow x1={80} y1={106} x2={118} y2={90} />
              <Arrow x1={80} y1={138} x2={118} y2={95} />

              <ModuleBox x={120} y={50} w={130} h={60} label="접근제어 프록시" sub="모든 쿼리 기록 + 통제" color={C.blue} />

              <Arrow x1={250} y1={80} x2={275} y2={80} />

              {/* Database */}
              <ModuleBox x={280} y={55} w={100} h={50} label="Database" sub="MySQL/PostgreSQL" color={C.green} />

              {/* Blocked dangerous queries */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <rect x={120} y={120} width={130} height={28} rx={6} fill="var(--card)" stroke={C.red} strokeWidth={0.8} strokeDasharray="4 3" />
                <text x={185} y={133} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.red}>차단: DROP / TRUNCATE</text>
                <text x={185} y={144} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">대량 SELECT 경고</text>
              </motion.g>

              {/* IP restriction + log review */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <ActionBox x={290} y={120} w={85} h={30} label="IP 제한" sub="사내/VPN만" color={C.amber} />
                <ActionBox x={385} y={120} w={85} h={30} label="월간 로그" sub="비정상 패턴" color={C.amber} />
              </motion.g>

              {/* Emergency account note */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <rect x={30} y={163} width={420} height={28} rx={6} fill="var(--card)" stroke={C.red} strokeWidth={0.8} />
                <text x={240} y={178} textAnchor="middle" fontSize={9} fill={C.red}>
                  비상 계정: 봉인 관리 (비밀번호 봉투 → 금고 보관 → 사용 시 파봉 기록)
                </text>
                <text x={240} y={188} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">로그 검토 증적 미비 = 사후심사 최빈 결함</text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
