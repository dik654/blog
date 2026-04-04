import { motion } from 'framer-motion';
import { C } from './ContextVizData';

const f = { opacity: 0, y: 4 };
const t = (d: number) => ({ delay: d });

export function StepCertOverhead() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.err}
      initial={f} animate={{ opacity: 1, y: 0 }}>한계: Narwhal Certificate 오버헤드</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'Narwhal: Vᵢ 생성 → 2f+1 서명 수집 → Cert(Vᵢ)'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'추가 지연: +1 라운드 (인증 교환 RTT)'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill={C.err}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'Bullshark 지연: 3 라운드 = 앵커+투표+인증'}
    </motion.text>
  </g>);
}

export function StepUncertified() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.mysti}
      initial={f} animate={{ opacity: 1, y: 0 }}>핵심: Uncertified DAG</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'기존: block → sign → cert → parents에 cert 포함'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill={C.mysti}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'Mysticeti: block → 직접 DAG 삽입 (cert 생략)'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill={C.ok}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'인증 대체: |{V ∈ r+1 | Vⱼ ∈ V.parents}| ≥ 2f+1'}
    </motion.text>
  </g>);
}

export function StepFastPath() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.ok}
      initial={f} animate={{ opacity: 1, y: 0 }}>Fast Path: 소유 객체 즉시 확정</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'Sui 객체: owned(addr) → 충돌 불가 (단일 소유자)'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'소유 객체 TX: 합의 우회 → 즉시 확정 (Fast Path)'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill={C.ok}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'공유 객체 TX만 Mysticeti 합의 필요 (소수)'}
    </motion.text>
  </g>);
}

export function StepResult() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.mysti}
      initial={f} animate={{ opacity: 1, y: 0 }}>결과: Bullshark 대비 2배 지연 감소</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'Bullshark: 3 라운드 커밋 (cert 포함)'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill={C.mysti}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'Mysticeti: 2 라운드 커밋 (cert 제거)'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill={C.ok}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'Sui 메인넷 실측: 390ms 커밋 — 기존 대비 80% 감소'}
    </motion.text>
  </g>);
}
