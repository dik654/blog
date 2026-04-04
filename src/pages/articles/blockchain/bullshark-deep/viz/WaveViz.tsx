import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { anchor: '#f59e0b', normal: '#6366f1', commit: '#10b981' };
const f = { opacity: 0, y: 4 };
const t = (d: number) => ({ delay: d });

const STEPS = [
  { label: 'Wave 구조: 2라운드 = 1 Wave' },
  { label: 'Wave 1: 앵커 + 투표 라운드' },
  { label: '커밋 규칙: 앵커 연결 확인' },
];

function Step0() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.anchor}
      initial={f} animate={{ opacity: 1, y: 0 }}>Wave 구조: 앵커 + 투표 라운드</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'Wave w = {Round 2w, Round 2w+1}'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'Round 2w: 앵커 라운드 — 리더의 정점이 앵커'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'Round 2w+1: 투표 라운드 — 앵커 참조 = 암시적 투표'}
    </motion.text>
    <motion.text x={15} y={98} fontSize={10} fill={C.anchor}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.6)}>
      {'리더 선택: leader(w) = validators[w mod n]'}
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.normal}
      initial={f} animate={{ opacity: 1, y: 0 }}>Wave 1 상세 (R2, R3)</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'R2 앵커: A₁ = vertex(r=2, author=leader(1))'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'R3 정점: parents에 Cert(A₁) 포함 = A₁에 투표'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill={C.normal}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'투표 카운트: |{V ∈ R3 | A₁ ∈ V.parents}| ≥ 2f+1'}
    </motion.text>
    <motion.text x={15} y={98} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.6)}>
      {'추가 메시지 없음 — DAG 구축 자체가 투표 역할'}
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.commit}
      initial={f} animate={{ opacity: 1, y: 0 }}>커밋 규칙: 다음 Wave 앵커 연결</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'A₂(w=2 앵커)의 인과 히스토리에 A₁ 포함?'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'A₁ ∈ causal_history(A₂) → commit(A₁)'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill={C.commit}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'커밋 시: A₁의 전체 인과 히스토리 순서대로 실행'}
    </motion.text>
    <motion.text x={15} y={98} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.6)}>
      {'지연: 2 라운드 (앵커→투표→다음 앵커 확인)'}
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2];

export default function WaveViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <svg viewBox="0 0 480 115" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <S />
          </svg>
        );
      }}
    </StepViz>
  );
}
