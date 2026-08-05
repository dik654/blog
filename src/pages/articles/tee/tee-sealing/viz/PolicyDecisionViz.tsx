import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_Q = '#6366f1';
const C_MRE = '#10b981';
const C_MRS = '#f59e0b';

const QUESTIONS = [
  { q: '데이터 수명?', a1: '단기 (시간~일)', a2: '장기 (월~년)', winner: 'MRSIGNER' },
  { q: '업데이트 빈도?', a1: '드물게 (분기+)', a2: '자주 (매주)', winner: 'MRSIGNER' },
  { q: '보안 수준?', a1: '최고 (군사·금융)', a2: '일반 (웹 앱)', winner: 'either' },
  { q: '서명 키 관리?', a1: 'HSM 안전', a2: '개발자 로컬', winner: 'MRENCLAVE' },
];

const RECS = [
  { policy: 'MRENCLAVE', cases: ['짧은 수명 비밀', '코드 고정 appliance', '규제 요건', 'session key'], color: C_MRE },
  { policy: 'MRSIGNER', cases: ['일반 사용자 앱', '빈번한 업데이트', '다수 enclave 협업', '키 관리 가능 조직'], color: C_MRS },
];

const STEPS = [
  {
    label: '의사결정 4가지 질문',
    body: '데이터 수명, 업데이트 빈도, 보안 수준, 서명 키 관리.\n각 질문이 정책 선택에 영향.',
  },
  {
    label: 'MRENCLAVE 추천 사례',
    body: '짧은 수명 비밀(session key), 코드 고정 appliance.\n규제 요건으로 코드 불변성 증명 필요한 경우.',
  },
  {
    label: 'MRSIGNER 추천 사례',
    body: '일반 사용자 앱, 빈번한 업데이트.\n다수 enclave 협업 + 키 관리 가능한 조직.',
  },
];

export default function PolicyDecisionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {QUESTIONS.map((qa, i) => {
                const y = 18 + i * 56;
                return (
                  <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}>
                    <ActionBox x={40} y={y} w={400} h={26} label={qa.q} color={C_Q} />
                    <DataBox x={40} y={y + 28} w={195} h={20} label={qa.a1} color={C_MRE} outlined />
                    <DataBox x={245} y={y + 28} w={195} h={20} label={qa.a2} color={C_MRS} outlined />
                  </motion.g>
                );
              })}
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={130} y={20} w={220} h={36} label="MRENCLAVE 추천" color={C_MRE} />
              {RECS[0].cases.map((c, i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
                  <DataBox x={70} y={70 + i * 38} w={340} h={32} label={c} color={C_MRE} outlined />
                </motion.g>
              ))}
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={130} y={20} w={220} h={36} label="MRSIGNER 추천" color={C_MRS} />
              {RECS[1].cases.map((c, i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
                  <DataBox x={70} y={70 + i * 38} w={340} h={32} label={c} color={C_MRS} outlined />
                </motion.g>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
