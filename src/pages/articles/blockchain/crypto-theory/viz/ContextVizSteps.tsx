import { motion } from 'framer-motion';
import { AlertBox, ActionBox, ModuleBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: 왜 암호학 */
export function StepWhyCrypto() {
  return (<g>
    <AlertBox x={30} y={15} w={150} h={42}
      label="중앙 기관 없음" sub="누구를 믿을 것인가?" color={C.err} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}>
      <ActionBox x={230} y={15} w={150} h={42}
        label="수학적 증명" sub="암호학이 신뢰를 대체" color={C.asym} />
    </motion.g>
    <motion.line x1={180} y1={36} x2={230} y2={36}
      stroke={C.asym} strokeWidth={1.2}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ delay: 0.4 }} />
    <motion.text x={200} y={88} textAnchor="middle" fontSize={11}
      fill={C.asym} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}>
      계정 소유권 · 트랜잭션 인증 · 합의 투표
    </motion.text>
    <motion.text x={200} y={108} textAnchor="middle" fontSize={11}
      fill="var(--muted-foreground)" initial={{ opacity: 0 }}
      animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      💡 모두 암호학에 의존
    </motion.text>
  </g>);
}

/* Step 1: 대칭 암호 */
export function StepSymmetric() {
  return (<g>
    <ModuleBox x={120} y={10} w={170} h={42}
      label="대칭 암호" sub="같은 키 K — AES, ChaCha20" color={C.sym} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}>
      <ActionBox x={50} y={72} w={100} h={32}
        label="Alice" sub="Enc(K, m)" color={C.sym} />
      <ActionBox x={250} y={72} w={100} h={32}
        label="Bob" sub="Dec(K, c)" color={C.sym} />
      <motion.line x1={150} y1={88} x2={250} y2={88}
        stroke={C.sym} strokeWidth={1} strokeDasharray="4 2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.5 }} />
    </motion.g>
    <motion.text x={200} y={125} textAnchor="middle" fontSize={11}
      fill={C.sig} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}>
      ⚠ 키 배포 문제 — K를 어떻게 안전하게 공유?
    </motion.text>
  </g>);
}

/* Step 2: 비대칭 암호 */
export function StepAsymmetric() {
  return (<g>
    <ModuleBox x={100} y={10} w={200} h={42}
      label="비대칭 암호" sub="pk(공개) + sk(비밀)" color={C.asym} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}>
      <ActionBox x={30} y={72} w={130} h={35}
        label="주소 = Hash(pk)" sub="공개키에서 파생" color={C.asym} />
      <ActionBox x={230} y={72} w={140} h={35}
        label="서명 = Sign(sk, tx)" sub="비밀키로 생성" color={C.sig} />
    </motion.g>
    <motion.text x={200} y={125} textAnchor="middle" fontSize={11}
      fill={C.asym} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}>
      💡 공개키는 공유해도 안전 — 키 배포 문제 해결
    </motion.text>
  </g>);
}

/* Step 3: 핵심 응용 */
export function StepApplications() {
  const apps = [
    { label: '디지털 서명', sub: 'ECDSA · BLS', color: C.sig },
    { label: '키 교환', sub: 'ECDH', color: C.asym },
    { label: '비밀 분산', sub: 'SSS · TSS', color: C.sym },
  ];
  return (<g>
    {apps.map((a, i) => (
      <motion.g key={a.label} initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.15, type: 'spring' }}>
        <ModuleBox x={15 + i * 135} y={15} w={120} h={42}
          label={a.label} sub={a.sub} color={a.color} />
      </motion.g>
    ))}
    <motion.text x={200} y={80} textAnchor="middle" fontSize={11}
      fill={C.sig} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}>
      💡 이더리움: EL은 ECDSA, CL은 BLS
    </motion.text>
    <motion.text x={200} y={100} textAnchor="middle" fontSize={11}
      fill="var(--muted-foreground)" initial={{ opacity: 0 }}
      animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      BLS 서명 집계로 수천 투표를 1개 서명으로 압축
    </motion.text>
  </g>);
}
