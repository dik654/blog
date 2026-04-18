import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const C = {
  blue: '#3B82F6',
  green: '#22C55E',
  amber: '#F59E0B',
  slate: '#64748B',
};

const STEPS = [
  {
    label: 'CISO + CPO 역할 분리',
    body: 'CISO는 정보보호 정책 총괄(정보통신망법 45조의3), CPO는 개인정보 처리 총괄(개인정보보호법 31조). 겸직은 소규모 사업자에 한정.',
  },
  {
    label: '실무 조직의 책임 체인',
    body: '보안팀/IT운영팀이 위험평가 실행, 보호대책 이행, 증적 수집을 담당. CISO/CPO의 정책 결정이 실무 조직을 통해 실행되는 위임 구조.',
  },
  {
    label: 'VASP 특수 역할 체계',
    body: '일반 조직과 달리 월렛 관리자, 트래블룰 담당자 등 VASP 고유 역할이 추가. 핫/콜드월렛 비율 결정, 출금 승인 체계가 CISO 직할.',
  },
];

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--muted-foreground)" strokeWidth={1} markerEnd="url(#or-arrow)" />;
}

export default function OrgRolesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="or-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* CEO at top */}
              <DataBox x={190} y={10} w={100} h={26} label="경영진" color={C.slate} />

              <Arrow x1={210} y1={36} x2={130} y2={58} />
              <Arrow x1={290} y1={36} x2={350} y2={58} />

              {/* CISO */}
              <ModuleBox x={50} y={60} w={160} h={52} label="CISO" sub="정보보호 총괄" color={C.blue} />
              <text x={130} y={126} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">정보통신망법 45조의3</text>

              {/* CPO */}
              <ModuleBox x={270} y={60} w={160} h={52} label="CPO" sub="개인정보보호 총괄" color={C.green} />
              <text x={350} y={126} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">개인정보보호법 31조</text>

              {/* Responsibilities */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <ActionBox x={30} y={140} w={95} h={28} label="정책 총괄" sub="예산 승인" color={C.blue} />
                <ActionBox x={135} y={140} w={95} h={28} label="사고 대응" sub="총책임" color={C.blue} />
                <ActionBox x={250} y={140} w={95} h={28} label="개인정보 정책" sub="파기 관리" color={C.green} />
                <ActionBox x={355} y={140} w={95} h={28} label="정보주체 권리" sub="열람/정정" color={C.green} />
              </motion.g>

              {/* Constraint */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <rect x={140} y={177} width={200} height={18} rx={9} fill="var(--card)" stroke={C.amber} strokeWidth={0.8} strokeDasharray="4 3" />
                <text x={240} y={190} textAnchor="middle" fontSize={8} fill={C.amber}>자산 5조+ 또는 이용자 100만+ → 겸직 불가</text>
              </motion.g>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Top: Decision layer */}
              <ModuleBox x={80} y={10} w={130} h={40} label="CISO" sub="정책 결정" color={C.blue} />
              <ModuleBox x={270} y={10} w={130} h={40} label="CPO" sub="정책 결정" color={C.green} />

              {/* Arrows down */}
              <Arrow x1={145} y1={50} x2={200} y2={72} />
              <Arrow x1={335} y1={50} x2={280} y2={72} />

              {/* Practice team */}
              <ModuleBox x={160} y={75} w={160} h={45} label="실무 조직 (보안팀/IT운영팀)" sub="위험평가 + 보호대책 이행" color={C.amber} />

              {/* Task flow */}
              <Arrow x1={240} y1={120} x2={100} y2={140} />
              <Arrow x1={240} y1={120} x2={240} y2={140} />
              <Arrow x1={240} y1={120} x2={380} y2={140} />

              <motion.g initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                <ActionBox x={40} y={142} w={120} h={32} label="위험평가 수행" sub="연 1회 이상" color={C.amber} />
                <ActionBox x={180} y={142} w={120} h={32} label="보호대책 구현" sub="2.x 항목 이행" color={C.amber} />
                <ActionBox x={320} y={142} w={120} h={32} label="증적 수집" sub="심사 대비 보관" color={C.amber} />
              </motion.g>

              {/* feedback loop */}
              <motion.path d="M 440 158 C 460 158, 465 100, 420 60 L 402 52"
                fill="none" stroke={C.blue} strokeWidth={0.8} strokeDasharray="4 3" markerEnd="url(#or-arrow)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.5 }} />
              <text x={460} y={108} fontSize={7} fill={C.blue}>보고</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* VASP-specific org */}
              <ModuleBox x={170} y={5} w={140} h={40} label="CISO (VASP)" sub="정보보호 + 자산 보호" color={C.blue} />

              <Arrow x1={210} y1={45} x2={100} y2={65} />
              <Arrow x1={240} y1={45} x2={240} y2={65} />
              <Arrow x1={270} y1={45} x2={380} y2={65} />

              {/* Special roles */}
              <ActionBox x={30} y={68} w={140} h={38} label="월렛 관리자" sub="Hot/Cold 비율 운영" color={C.blue} />
              <ActionBox x={185} y={68} w={110} h={38} label="출금 승인자" sub="멀티시그 참여" color={C.green} />
              <ActionBox x={310} y={68} w={140} h={38} label="트래블룰 담당자" sub="송수신자 정보 전달" color={C.amber} />

              {/* Flow to wallet */}
              <Arrow x1={100} y1={106} x2={100} y2={125} />
              <Arrow x1={240} y1={106} x2={240} y2={125} />
              <Arrow x1={380} y1={106} x2={380} y2={125} />

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <DataBox x={40} y={128} w={120} h={26} label="콜드월렛 서명" color={C.blue} />
                <DataBox x={180} y={128} w={120} h={26} label="출금 요청 검증" color={C.green} />
                <DataBox x={320} y={128} w={120} h={26} label="Travel Rule 준수" color={C.amber} />
              </motion.g>

              {/* Bottom emphasis */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <rect x={80} y={168} width={320} height={24} rx={12} fill="var(--card)" stroke={C.blue} strokeWidth={1} />
                <text x={240} y={184} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.blue}>
                  일반 조직 대비 3가지 고유 역할이 추가
                </text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
