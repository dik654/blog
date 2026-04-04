import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { v: '#6366f1', e: '#10b981', cert: '#f59e0b' };
const f = { opacity: 0, y: 4 };
const t = (d: number) => ({ delay: d });

const STEPS = [
  { label: 'Round r: 정점(Vertex) 생성' },
  { label: 'Round r+1: 이전 라운드 참조' },
  { label: '증명서(Certificate)로 DAG 확정' },
];

function Step0() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.v}
      initial={f} animate={{ opacity: 1, y: 0 }}>Round r: Vertex 생성</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'Vᵢ = ⟨round=r, author=pᵢ, txs, parents={}⟩'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'pᵢ→all: broadcast(Vᵢ) — 자신의 배치 전파'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill={C.v}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'각 검증자가 독립 생성 → n개 정점/라운드'}
    </motion.text>
    <motion.text x={15} y={98} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.6)}>
      {'Round 0: parents 없음 (제네시스 라운드)'}
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.e}
      initial={f} animate={{ opacity: 1, y: 0 }}>Round r+1: 인과적 참조 (Edge)</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'Vⱼ = ⟨round=r+1, author=pⱼ, txs, parents⟩'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'parents = {Cert(Vₖ) | k ∈ round r} — 2f+1개 이상'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill={C.e}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'조건: |parents| ≥ 2f+1 → 데이터 가용성 보장'}
    </motion.text>
    <motion.text x={15} y={98} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.6)}>
      {'Edge = 이전 라운드 정점의 Certificate 해시'}
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.cert}
      initial={f} animate={{ opacity: 1, y: 0 }}>Certificate: 2f+1 서명 집합</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'pᵢ: receive(Vⱼ) → verify → ⟨SIGN, H(Vⱼ)⟩σᵢ'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'Cert(Vⱼ) = ⟨Vⱼ, {σᵢ | i ∈ S, |S|≥2f+1}⟩'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill={C.cert}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'역할: 데이터 가용성 증명 — Vⱼ를 2f+1이 수신 확인'}
    </motion.text>
    <motion.text x={15} y={98} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.6)}>
      {'DAG 진행 = Certificate 교환 — 합의와 분리된 구조'}
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2];

export default function RoundViz() {
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
