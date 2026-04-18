import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  intl: '#6366f1',
  law: '#10b981',
  duty: '#f59e0b',
  org: '#ef4444',
};

const STEPS = [
  {
    label: 'FATF 국제 기준 -> 국내법 반영',
    body: 'FATF 40개 권고사항이 각국 AML/CFT 법률의 뼈대. 2019년 권고사항 15 개정으로 가상자산·VASP가 명시적 규제 대상이 됨.',
  },
  {
    label: '한국 법적 근거: 특금법 + 이용자보호법',
    body: '특금법은 자금세탁 방지(CDD, STR, 기록보관), 이용자보호법은 투자자 보호·불공정거래 금지. VASP는 양쪽 모두 준수 의무.',
  },
  {
    label: 'VASP 핵심 의무 5가지',
    body: 'FIU 신고 -> 고객확인(CDD) -> 의심거래 보고(STR) -> 기록 보관(5년) → 내부 통제. 이 다섯 가지가 AML/CFT 체계의 골격.',
  },
  {
    label: '3선 방어 조직 체계',
    body: '1선(현업: CDD 실행) -> 2선(준법감시: 정책·모니터링) → 3선(감사: 독립 검증). 내부 공모 방지를 위해 각 선이 독립적으로 작동.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#ov-arrow)" />;
}

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ov-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: FATF -> 국내법 흐름 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={15} y={15} w={120} h={50} label="FATF" sub="39개 회원국" color={C.intl} />
              <Arrow x1={135} y1={40} x2={165} y2={40} color={C.intl} />

              <DataBox x={168} y={23} w={130} h={34} label="40개 권고사항" color={C.intl} />
              <Arrow x1={298} y1={40} x2={328} y2={40} color={C.intl} />

              <ActionBox x={331} y={18} w={130} h={45} label="각국 국내법 반영" sub="미이행 시 불이행 판정" color={C.intl} />

              {/* 하단: 2019년 개정 */}
              <rect x={15} y={88} width={450} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={108} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">2019년 권고사항 15 개정</text>

              <AlertBox x={40} y={118} w={130} h={45} label="가상자산 포함" sub="VASP 명시적 규제 대상" color={C.org} />
              <Arrow x1={170} y1={140} x2={200} y2={140} color={C.law} />

              <ActionBox x={203} y={120} w={120} h={42} label="한국 특금법 개정" sub="2021.03 시행" color={C.law} />
              <Arrow x1={323} y1={140} x2={353} y2={140} color={C.duty} />

              <DataBox x={356} y={124} w={100} h={34} label="Travel Rule" color={C.duty} />
              <text x={406} y={175} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">100만 원 이상 이전 시</text>
            </motion.g>
          )}

          {/* Step 1: 두 법률 비교 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={30} y={15} w={180} h={55} label="특정금융정보법(특금법)" sub="자금세탁 방지 초점" color={C.law} />
              <ModuleBox x={270} y={15} w={180} h={55} label="가상자산이용자보호법" sub="투자자 보호 초점" color={C.duty} />

              {/* 특금법 의무 */}
              <Arrow x1={80} y1={70} x2={80} y2={92} color={C.law} />
              <Arrow x1={160} y1={70} x2={160} y2={92} color={C.law} />
              <DataBox x={40} y={95} w={80} h={28} label="CDD/STR" color={C.law} />
              <DataBox x={130} y={95} w={80} h={28} label="기록 보관" color={C.law} />

              {/* 이용자보호법 의무 */}
              <Arrow x1={320} y1={70} x2={320} y2={92} color={C.duty} />
              <Arrow x1={400} y1={70} x2={400} y2={92} color={C.duty} />
              <DataBox x={280} y={95} w={85} h={28} label="자산 보호" color={C.duty} />
              <DataBox x={375} y={95} w={85} h={28} label="시세조종 금지" color={C.duty} />

              {/* 겹침 영역 */}
              <rect x={130} y={145} width={220} height={40} rx={8} fill="var(--card)" stroke={C.org} strokeWidth={1} strokeDasharray="4 3" />
              <text x={240} y={162} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.org}>VASP: 양쪽 모두 준수 의무</text>
              <text x={240} y={177} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">금융회사 + 가상자산사업자 모두 적용</text>

              <Arrow x1={120} y1={123} x2={145} y2={145} color={C.law} />
              <Arrow x1={360} y1={123} x2={335} y2={145} color={C.duty} />
            </motion.g>
          )}

          {/* Step 2: 핵심 의무 5가지 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">VASP 핵심 의무 5가지</text>

              {/* 5개 의무를 순차적으로 배치 */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <ActionBox x={10} y={35} w={80} h={42} label="FIU 신고" sub="영업 전 필수" color={C.org} />
              </motion.g>
              <Arrow x1={90} y1={56} x2={105} y2={56} color={C.duty} />

              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <ActionBox x={108} y={35} w={80} h={42} label="고객확인" sub="CDD/EDD" color={C.law} />
              </motion.g>
              <Arrow x1={188} y1={56} x2={203} y2={56} color={C.duty} />

              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <ActionBox x={206} y={35} w={80} h={42} label="STR 보고" sub="3영업일 이내" color={C.duty} />
              </motion.g>
              <Arrow x1={286} y1={56} x2={301} y2={56} color={C.duty} />

              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <ActionBox x={304} y={35} w={80} h={42} label="기록 보관" sub="최소 5년" color={C.intl} />
              </motion.g>
              <Arrow x1={384} y1={56} x2={399} y2={56} color={C.duty} />

              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <ActionBox x={402} y={35} w={68} h={42} label="내부 통제" sub="조직·절차" color={C.intl} />
              </motion.g>

              {/* 미이행 시 제재 */}
              <rect x={30} y={105} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={125} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">미이행 시 제재</text>

              <AlertBox x={40} y={135} w={120} h={42} label="과태료·시정명령" sub="FIU 검사 적발 시" color={C.org} />
              <AlertBox x={180} y={135} w={120} h={42} label="신고 말소" sub="영업 불가" color={C.org} />
              <AlertBox x={320} y={135} w={120} h={42} label="형사처벌" sub="5년 이하 징역" color={C.org} />
            </motion.g>
          )}

          {/* Step 3: 3선 방어 모델 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">3선 방어 조직 체계</text>

              {/* 1선 */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <ModuleBox x={15} y={35} w={130} h={50} label="1선 현업" sub="운영팀 / CS팀" color={C.law} />
                <DataBox x={25} y={95} w={110} h={28} label="CDD 실행·KYC 심사" color={C.law} />
              </motion.g>

              {/* 2선 */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <ModuleBox x={175} y={35} w={130} h={50} label="2선 준법감시" sub="AML팀 / CCO" color={C.duty} />
                <DataBox x={180} y={95} w={120} h={28} label="정책·FDS·STR 결정" color={C.duty} />
              </motion.g>

              {/* 3선 */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <ModuleBox x={335} y={35} w={130} h={50} label="3선 내부감사" sub="감사팀 / 외부감사" color={C.org} />
                <DataBox x={340} y={95} w={120} h={28} label="독립 평가·개선 권고" color={C.org} />
              </motion.g>

              {/* 감시 화살표 */}
              <Arrow x1={175} y1={55} x2={150} y2={55} color={C.duty} />
              <Arrow x1={335} y1={55} x2={310} y2={55} color={C.org} />

              <text x={160} y={50} textAnchor="middle" fontSize={7} fill={C.duty}>감독</text>
              <text x={320} y={50} textAnchor="middle" fontSize={7} fill={C.org}>감사</text>

              {/* 이사회 보고 */}
              <rect x={130} y={145} width={220} height={40} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={240} y={163} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">이사회 / 감사위원회</text>
              <text x={240} y={178} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">3선은 이사회에 직접 보고 (독립성 보장)</text>

              <Arrow x1={400} y1={85} x2={340} y2={145} color={C.org} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
