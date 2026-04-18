import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const C = {
  blue: '#3B82F6',
  green: '#22C55E',
  amber: '#F59E0B',
  red: '#EF4444',
};

const STEPS = [
  {
    label: 'ISMS-P 인증의 3개 영역',
    body: '1.x 관리체계 수립(16항목) + 2.x 보호대책(64항목) + 3.x 개인정보(22항목) = 총 102개 인증 기준으로 조직의 정보보호 수준을 심사한다.',
  },
  {
    label: '인증 흐름 5단계',
    body: '인증 신청 -> 서면심사 -> 현장심사 -> 보완조치 → 인증 부여. 통상 6~12개월 소요되며, 범위 설정이 가장 중요한 출발점.',
  },
  {
    label: '조직 역할 구분',
    body: 'CISO(정보보호 총괄) + CPO(개인정보 총괄) + 실무 조직(위험평가, 보호대책 이행, 증적 관리). 일정 규모 이상 사업자는 CISO 임원급 지정 필수.',
  },
  {
    label: 'VASP 특수 요건',
    body: '특금법에 의해 VASP는 ISMS 인증 의무. 이용자 KYC 데이터를 처리하므로 ISMS-P(개인정보 포함) 취득 필요. 월렛 관리, 트래블룰 이행이 추가 심사 대상.',
  },
];

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--muted-foreground)" strokeWidth={1} markerEnd="url(#io-arrow)" />;
}

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="io-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: 3 Domains */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={30} y={20} w={120} h={50} label="1.x 관리체계" sub="16개 항목" color={C.blue} />
              <ModuleBox x={180} y={20} w={120} h={50} label="2.x 보호대책" sub="64개 항목" color={C.green} />
              <ModuleBox x={330} y={20} w={120} h={50} label="3.x 개인정보" sub="22개 항목" color={C.amber} />

              <Arrow x1={150} y1={45} x2={178} y2={45} />
              <Arrow x1={300} y1={45} x2={328} y2={45} />

              {/* Total */}
              <rect x={130} y={95} width={220} height={36} rx={18} fill="var(--card)" stroke={C.blue} strokeWidth={1} />
              <text x={240} y={117} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.blue}>총 102개 인증 기준</text>

              <Arrow x1={240} y1={70} x2={240} y2={93} />

              {/* Examples */}
              <DataBox x={50} y={150} w={100} h={28} label="정책 + 조직" color={C.blue} />
              <DataBox x={190} y={150} w={100} h={28} label="접근통제 + 암호화" color={C.green} />
              <DataBox x={330} y={150} w={110} h={28} label="수집 + 이용 + 파기" color={C.amber} />

              <line x1={100} y1={131} x2={100} y2={148} stroke={C.blue} strokeWidth={0.8} strokeDasharray="3 2" />
              <line x1={240} y1={131} x2={240} y2={148} stroke={C.green} strokeWidth={0.8} strokeDasharray="3 2" />
              <line x1={385} y1={131} x2={385} y2={148} stroke={C.amber} strokeWidth={0.8} strokeDasharray="3 2" />
            </motion.g>
          )}

          {/* Step 1: 5-Stage Certification Flow */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ActionBox x={10} y={30} w={80} h={38} label="1. 신청" sub="범위 확정" color={C.blue} />
              <ActionBox x={105} y={30} w={80} h={38} label="2. 서면심사" sub="문서 검토" color={C.blue} />
              <ActionBox x={200} y={30} w={80} h={38} label="3. 현장심사" sub="현장 검증" color={C.green} />
              <ActionBox x={295} y={30} w={80} h={38} label="4. 보완조치" sub="40일 이내" color={C.amber} />
              <ActionBox x={390} y={30} w={80} h={38} label="5. 인증" sub="3년 유효" color={C.green} />

              <Arrow x1={90} y1={49} x2={103} y2={49} />
              <Arrow x1={185} y1={49} x2={198} y2={49} />
              <Arrow x1={280} y1={49} x2={293} y2={49} />
              <Arrow x1={375} y1={49} x2={388} y2={49} />

              {/* Timeline */}
              <rect x={30} y={90} width={420} height={3} rx={1.5} fill="var(--border)" opacity={0.4} />
              <motion.rect x={30} y={90} width={420} height={3} rx={1.5} fill={C.blue}
                initial={{ width: 0 }} animate={{ width: 420 }} transition={{ duration: 1.2 }} />
              <text x={240} y={108} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">6~12개월 소요</text>

              {/* Key Points */}
              <DataBox x={40} y={130} w={130} h={28} label="범위 설정 = 핵심" color={C.blue} />
              <DataBox x={200} y={130} w={130} h={28} label="문서 vs 현실 일치" color={C.green} />
              <DataBox x={360} y={130} w={100} h={28} label="매년 사후심사" color={C.amber} />

              {/* Renewal cycle */}
              <motion.path d="M 430 158 C 460 158, 460 190, 430 190 L 40 190 C 20 190, 20 175, 40 175"
                fill="none" stroke={C.amber} strokeWidth={0.8} strokeDasharray="4 3" markerEnd="url(#io-arrow)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.5 }} />
              <text x={240} y={204} textAnchor="middle" fontSize={9} fill={C.amber}>3년 후 갱신 심사</text>
            </motion.g>
          )}

          {/* Step 2: Organization Roles */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* CISO */}
              <ModuleBox x={30} y={20} w={130} h={55} label="CISO" sub="정보보호 총괄" color={C.blue} />
              {/* CPO */}
              <ModuleBox x={180} y={20} w={130} h={55} label="CPO" sub="개인정보보호 총괄" color={C.green} />

              {/* Practical Team */}
              <ModuleBox x={105} y={110} w={130} h={55} label="실무 조직" sub="보안팀 / IT운영팀" color={C.amber} />

              {/* Arrows from CISO/CPO to team */}
              <Arrow x1={95} y1={75} x2={150} y2={108} />
              <Arrow x1={245} y1={75} x2={190} y2={108} />

              {/* Responsibilities */}
              <DataBox x={10} y={90} w={80} h={24} label="예산 승인" color={C.blue} />
              <DataBox x={310} y={90} w={80} h={24} label="파기 관리" color={C.green} />

              <StatusBox x={280} y={120} w={160} h={50} label="증적 수집" sub="위험평가 + 보호대책 이행" color={C.amber} progress={0.7} />

              {/* Legal refs */}
              <text x={95} y={195} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">정보통신망법 45조의3</text>
              <text x={245} y={195} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">개인정보보호법 31조</text>
            </motion.g>
          )}

          {/* Step 3: VASP Special Requirements */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={170} y={10} w={140} h={45} label="VASP" sub="가상자산사업자" color={C.red} />

              {/* Branching requirements */}
              <ActionBox x={20} y={80} w={100} h={40} label="KYC 의무" sub="실명 + 신분증" color={C.blue} />
              <ActionBox x={140} y={80} w={100} h={40} label="월렛 관리" sub="Hot/Cold 비율" color={C.green} />
              <ActionBox x={260} y={80} w={100} h={40} label="트래블룰" sub="송수신자 정보" color={C.amber} />
              <ActionBox x={380} y={80} w={85} h={40} label="특금법" sub="신고 의무" color={C.red} />

              <Arrow x1={220} y1={55} x2={70} y2={78} />
              <Arrow x1={240} y1={55} x2={190} y2={78} />
              <Arrow x1={260} y1={55} x2={310} y2={78} />
              <Arrow x1={280} y1={55} x2={420} y2={78} />

              {/* Result */}
              <motion.rect x={100} y={145} width={280} height={40} rx={8} fill="var(--card)" stroke={C.red} strokeWidth={1.2}
                initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.4, delay: 0.3 }} />
              <text x={240} y={163} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.red}>ISMS-P 인증 필수</text>
              <text x={240} y={177} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">미인증 시 신고 수리 불가 = 영업 불가</text>

              <Arrow x1={70} y1={120} x2={130} y2={143} />
              <Arrow x1={190} y1={120} x2={200} y2={143} />
              <Arrow x1={310} y1={120} x2={280} y2={143} />
              <Arrow x1={422} y1={120} x2={350} y2={143} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
