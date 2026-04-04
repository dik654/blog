import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { err: '#ef4444', ok: '#10b981', vc: '#f59e0b', pp: '#6366f1' };
const f = { opacity: 0, y: 4 };
const t = (d: number) => ({ delay: d });

const STEPS = [
  { label: 'Primary 장애 감지' },
  { label: 'VIEW-CHANGE 메시지 구성' },
  { label: '새 Primary의 NEW-VIEW' },
];

function Step0() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.err}
      initial={f} animate={{ opacity: 1, y: 0 }}>Trigger: Primary Timeout</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'pᵢ: timer(v=3) expired → Primary p₀ 무응답'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'조건: 2f+1 타임아웃 동의 시 view change 시작'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill={C.vc}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'State: pᵢ.view=3→4, pᵢ.status=view-changing'}
    </motion.text>
    <motion.text x={15} y={98} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.6)}>
      {'새 Primary: p = v+1 mod |R| = 4 mod 4 = p₀→p₁'}
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.vc}
      initial={f} animate={{ opacity: 1, y: 0 }}>Msg: VIEW-CHANGE 구성</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'⟨VIEW-CHANGE, v+1=4, n_s, C, P, i⟩σ_pᵢ'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'n_s=마지막 체크포인트, C=체크포인트 증거'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'P={prepared(m,v,n) 집합} — 각 O(n) 증거 포함'}
    </motion.text>
    <motion.text x={15} y={98} fontSize={10} fill={C.err}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.6)}>
      {'통신: O(n²) 메시지 x O(n) 증거 = O(n³) 복잡도'}
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.ok}
      initial={f} animate={{ opacity: 1, y: 0 }}>Msg: NEW-VIEW (새 Primary)</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'⟨NEW-VIEW, v+1=4, V, O⟩σ_p₁'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'V = 2f+1 VIEW-CHANGE 메시지 집합'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'O = prepared 상태 이월용 PRE-PREPARE 재생성'}
    </motion.text>
    <motion.text x={15} y={98} fontSize={10} fill={C.ok}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.6)}>
      {'Safety: prepared(m,v,n) → 새 view에서도 동일 n에 m 배정'}
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2];

export default function ViewChangeViz() {
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
