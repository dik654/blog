import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const STEPS = [
  { label: '암호학 두 체계', body: '대칭 — 같은 키. 비대칭 — 공개키+비밀키 쌍.' },
  { label: '대칭 키 (Symmetric)', body: '같은 키 K로 암/복호화. 빠르지만 키 배포 문제.' },
  { label: '비대칭 키 (Asymmetric)', body: 'pk로 암호화, sk로 복호화. ECDSA·EdDSA·BLS.' },
  { label: '블록체인 적용', body: 'Sign(sk,tx)→sig, Verify(pk,tx,sig)→bool. 주소=Hash(pk).' },
];

export default function CryptoModelViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Symmetric box */}
          <motion.g animate={{ opacity: step === 1 || step === 0 ? 1 : 0.25 }}>
            <rect x={20} y={20} width={170} height={50} rx={6} fill={`${C1}08`} stroke={C1}
              strokeWidth={step === 1 ? 1.2 : 0.6} />
            <text x={105} y={38} textAnchor="middle" fontSize={10} fontWeight={500} fill={C1}>대칭 암호</text>
            <text x={105} y={55} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
              같은 키 K — AES, ChaCha20
            </text>
            {step === 1 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <text x={50} y={80} fontSize={10} fill={C3}>Alice</text>
                <rect x={75} y={73} width={30} height={12} rx={2} fill={`${C3}15`} stroke={C3} strokeWidth={0.6} />
                <text x={90} y={82} textAnchor="middle" fontSize={10} fill={C3}>K</text>
                <text x={130} y={80} fontSize={10} fill={C3}>Bob</text>
                <rect x={115} y={73} width={30} height={12} rx={2} fill={`${C3}15`} stroke={C3} strokeWidth={0.6} />
                <text x={130} y={82} textAnchor="middle" fontSize={10} fill={C3}>K</text>
              </motion.g>
            )}
          </motion.g>
          {/* Asymmetric box */}
          <motion.g animate={{ opacity: step === 2 || step === 0 || step === 3 ? 1 : 0.25 }}>
            <rect x={220} y={20} width={180} height={50} rx={6} fill={`${C2}08`} stroke={C2}
              strokeWidth={step >= 2 ? 1.2 : 0.6} />
            <text x={310} y={38} textAnchor="middle" fontSize={10} fontWeight={500} fill={C2}>비대칭 암호</text>
            <text x={310} y={55} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
              pk + sk 쌍 — ECDSA, EdDSA, BLS
            </text>
            {step >= 2 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <rect x={240} y={73} width={24} height={12} rx={2} fill={`${C2}15`} stroke={C2} strokeWidth={0.6} />
                <text x={252} y={82} textAnchor="middle" fontSize={10} fill={C2}>pk</text>
                <rect x={275} y={73} width={24} height={12} rx={2} fill={`${C1}15`} stroke={C1} strokeWidth={0.6} />
                <text x={287} y={82} textAnchor="middle" fontSize={10} fill={C1}>sk</text>
                {step === 3 && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <text x={320} y={82} fontSize={10} fill={C3}>Sign(sk,tx)→sig</text>
                  </motion.g>
                )}
              </motion.g>
            )}
          </motion.g>
          {/* Blockchain application */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={100} y={100} width={220} height={28} rx={5} fill={`${C3}08`} stroke={C3} strokeWidth={0.8} />
              <text x={210} y={115} textAnchor="middle" fontSize={10} fontWeight={500} fill={C3}>
                주소 = Hash(pk) | 서명 = Sign(sk, tx)
              </text>
              <text x={210} y={125} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                검증: Verify(pk, tx, sig) → true/false
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
