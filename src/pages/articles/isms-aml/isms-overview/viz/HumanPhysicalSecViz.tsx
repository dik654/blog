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
    label: '2.2 인적 보안: 입사→재직→퇴사 생명주기',
    body: '입사 시 보안 서약 + 교육 → 재직 중 연 1회 갱신 교육 → 퇴사 시 전 시스템 권한 즉시 회수. 교육 미수료 상태에서 권한 부여 시 즉시 결함.',
  },
  {
    label: '2.4 물리 보안: 보안 구역 3계층',
    body: '사무실(일반) → 서버실(제한) → 월렛룸(최고 보안). 각 구역마다 출입 인증 수준이 다르며, 월렛룸은 지문+카드 이중 인증 + 동행 원칙.',
  },
  {
    label: '월렛룸 작업 승인 프로세스',
    body: '작업계획서 → 보안담당자/CISO 승인 → 동행 출입 + 작업 수행 → 완료서 작성. 개인 전자기기 반입 금지, CCTV 24시간 녹화.',
  },
];

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--muted-foreground)" strokeWidth={1} markerEnd="url(#hps-arrow)" />;
}

export default function HumanPhysicalSecViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="hps-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">직원 생명주기별 보안 절차</text>

              {/* Timeline */}
              <rect x={40} y={30} width={400} height={4} rx={2} fill="var(--border)" opacity={0.3} />
              <motion.rect x={40} y={30} width={400} height={4} rx={2} fill={C.blue}
                initial={{ width: 0 }} animate={{ width: 400 }} transition={{ duration: 1 }} />

              {/* Phase markers */}
              <circle cx={40} cy={32} r={4} fill={C.blue} />
              <circle cx={170} cy={32} r={4} fill={C.green} />
              <circle cx={340} cy={32} r={4} fill={C.green} />
              <circle cx={440} cy={32} r={4} fill={C.red} />

              <text x={40} y={50} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.blue}>입사</text>
              <text x={170} y={50} textAnchor="middle" fontSize={8} fill={C.green}>교육 완료</text>
              <text x={340} y={50} textAnchor="middle" fontSize={8} fill={C.green}>재직 중</text>
              <text x={440} y={50} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.red}>퇴사</text>

              {/* Entry tasks */}
              <ActionBox x={10} y={60} w={110} h={32} label="보안 서약서" sub="비밀유지 서명" color={C.blue} />
              <Arrow x1={120} y1={76} x2={135} y2={76} />
              <ActionBox x={137} y={60} w={110} h={32} label="정보보호 교육" sub="1시간 이상" color={C.blue} />
              <Arrow x1={247} y1={76} x2={262} y2={76} />
              <ActionBox x={264} y={60} w={100} h={32} label="권한 부여" sub="교육 후에만" color={C.green} />

              {/* Ongoing */}
              <ActionBox x={264} y={105} w={120} h={30} label="연 1회 갱신 교육" sub="수료 증적 보관" color={C.green} />

              {/* Exit tasks */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <ActionBox x={370} y={60} w={100} h={32} label="퇴사일 당일" sub="모든 계정 삭제" color={C.red} />
                <ActionBox x={370} y={105} w={100} h={30} label="퇴직 서약서" sub="유출 금지 지속" color={C.red} />
              </motion.g>

              {/* Warning */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <AlertBox x={60} y={150} w={360} h={30} label="교육 미수료 상태에서 권한 부여 = 2.2.4 결함" sub="입사일 → 교육일 → 권한 부여일 시간 순서 증적 필수" color={C.red} />
              </motion.g>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">물리 보안 구역 3계층</text>

              {/* Nested zones - outer to inner */}
              <rect x={20} y={30} width={440} height={140} rx={10} fill="var(--card)" stroke={C.green} strokeWidth={0.8} />
              <text x={40} y={48} fontSize={9} fontWeight={600} fill={C.green}>사무실 (일반 구역)</text>
              <text x={40} y={60} fontSize={8} fill="var(--muted-foreground)">카드키 출입</text>

              <rect x={50} y={70} width={380} height={90} rx={8} fill="var(--card)" stroke={C.amber} strokeWidth={1} />
              <text x={70} y={88} fontSize={9} fontWeight={600} fill={C.amber}>서버실 (제한 구역)</text>
              <text x={70} y={100} fontSize={8} fill="var(--muted-foreground)">카드 + 승인 필요</text>

              <motion.rect x={220} y={78} width={195} height={74} rx={6} fill="var(--card)" stroke={C.red} strokeWidth={1.2}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />
              <text x={240} y={96} fontSize={9} fontWeight={700} fill={C.red}>월렛룸 (최고 보안)</text>
              <text x={240} y={108} fontSize={8} fill="var(--muted-foreground)">지문 + 카드 이중 인증</text>

              {/* Security features in wallet room */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <DataBox x={228} y={115} w={70} h={20} label="CCTV 24h" color={C.red} />
                <DataBox x={305} y={115} w={70} h={20} label="동행 원칙" color={C.red} />
                <DataBox x={228} y={138} w={70} h={20} label="기기 반입금지" color={C.red} />
                <DataBox x={305} y={138} w={70} h={20} label="네트워크 차단" color={C.red} />
              </motion.g>

              {/* Access arrow */}
              <motion.path d="M 20 100 L 50 100" fill="none" stroke={C.green} strokeWidth={1.5} markerEnd="url(#hps-arrow)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
              <motion.path d="M 50 105 L 220 105" fill="none" stroke={C.amber} strokeWidth={1.5} markerEnd="url(#hps-arrow)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.3 }} />

              <text x={240} y={184} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">안쪽으로 갈수록 인증 수준 강화 → 최소 권한 원칙</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">월렛룸 작업 승인 4단계</text>

              {/* 4-step process */}
              <ActionBox x={10} y={30} w={100} h={42} label="작업계획서" sub="목적/시간/담당자" color={C.blue} />
              <Arrow x1={110} y1={51} x2={128} y2={51} />

              <ActionBox x={130} y={30} w={100} h={42} label="승인" sub="CISO/보안담당자" color={C.green} />
              <Arrow x1={230} y1={51} x2={248} y2={51} />

              <ActionBox x={250} y={30} w={100} h={42} label="동행 출입" sub="2인 이상 원칙" color={C.amber} />
              <Arrow x1={350} y1={51} x2={368} y2={51} />

              <ActionBox x={370} y={30} w={100} h={42} label="완료서" sub="결과 기록" color={C.green} />

              {/* Constraints */}
              <motion.g initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                <rect x={30} y={90} width={420} height={45} rx={8} fill="var(--card)" stroke={C.red} strokeWidth={0.8} strokeDasharray="4 3" />
                <text x={240} y={108} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.red}>작업 중 통제 사항</text>
                <DataBox x={45} y={115} w={110} h={22} label="개인 기기 반입 금지" color={C.red} />
                <DataBox x={170} y={115} w={110} h={22} label="CCTV 녹화 필수" color={C.red} />
                <DataBox x={295} y={115} w={140} h={22} label="서명 전용 PC만 사용" color={C.red} />
              </motion.g>

              {/* Evidence */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <text x={240} y={158} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">심사 시 증적 대조</text>
                <Arrow x1={240} y1={162} x2={240} y2={172} />
                <DataBox x={60} y={173} w={120} h={22} label="출입 로그 (6개월)" color={C.blue} />
                <DataBox x={200} y={173} w={120} h={22} label="CCTV 영상 대조" color={C.blue} />
                <DataBox x={340} y={173} w={110} h={22} label="작업계획서/완료서" color={C.blue} />
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
