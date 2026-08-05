import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_K = '#6366f1';
const C_CTR = '#10b981';
const C_GH = '#f59e0b';
const C_TAG = '#a855f7';

const STEPS = [
  {
    label: 'GCM = CTR encryption + GHASH authentication',
    body: '입력: K(128-bit), IV(96-bit), P(plaintext), A(AAD).\n출력: C(ciphertext) + T(128-bit tag).',
  },
  {
    label: 'CTR — 카운터 모드 암호화',
    body: 'counter_i = IV || i. C[i] = P[i] XOR AES_K(counter_i).\n병렬 처리 가능 → 매우 빠름.',
  },
  {
    label: 'GHASH — GF(2^128) 누적 곱셈',
    body: 'H = AES_K(0^128). Y[i+1] = (Y[i] XOR X[i]) · H.\nA + C + len 모두 인증 → 데이터 무결성 보장.',
  },
  {
    label: 'Tag = GHASH XOR AES_K(counter_0)',
    body: '최종 tag는 GHASH 결과를 counter_0로 한 번 더 암호화.\n성능: AES-NI ~1 cyc/byte, PCLMULQDQ로 GHASH 가속.',
  },
];

export default function GcmModeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={40} y={20} w={170} h={28} label="K (128-bit)" color={C_K} outlined />
              <DataBox x={250} y={20} w={170} h={28} label="IV (96-bit nonce)" color={C_K} outlined />
              <DataBox x={40} y={60} w={170} h={28} label="P (plaintext)" color={C_CTR} outlined />
              <DataBox x={250} y={60} w={170} h={28} label="A (AAD)" color={C_GH} outlined />
              <ActionBox x={130} y={104} w={220} h={36} label="AES-128-GCM" color={C_TAG} />
              <DataBox x={40} y={156} w={170} h={28} label="C (ciphertext)" color={C_CTR} outlined />
              <DataBox x={250} y={156} w={170} h={28} label="T (128-bit tag)" color={C_TAG} outlined />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {[1, 2, 3, 4].map((i) => {
                const x = 40 + (i - 1) * 110;
                return (
                  <motion.g key={i} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}>
                    <DataBox x={x} y={20} w={100} h={24} label={`counter_${i}`} color={C_CTR} outlined />
                    <ActionBox x={x} y={56} w={100} h={28} label="AES_K" color={C_K} />
                    <DataBox x={x} y={100} w={100} h={24} label={`P[${i}]`} color={C_GH} outlined />
                    <text x={x + 50} y={140} textAnchor="middle" fontSize={11} fill={C_CTR}>⊕</text>
                    <DataBox x={x} y={148} w={100} h={24} label={`C[${i}]`} color={C_CTR} outlined />
                  </motion.g>
                );
              })}
              <text x={240} y={196} textAnchor="middle" fontSize={9} fill={C_CTR}>
                병렬 처리 가능 — 매우 빠름
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={130} y={20} w={220} h={28} label="H = AES_K(0^128)" color={C_K} outlined />
              {[1, 2, 3, 4].map((i) => {
                const x = 40 + (i - 1) * 110;
                return (
                  <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.07 }}>
                    <DataBox x={x} y={70} w={100} h={26} label={`Y[${i}]`} color={C_GH} outlined />
                    <text x={x + 50} y={108} textAnchor="middle" fontSize={9} fill={C_GH}>· H</text>
                    <DataBox x={x} y={114} w={100} h={26} label={`Y[${i + 1}]`} color={C_GH} outlined />
                  </motion.g>
                );
              })}
              <text x={240} y={172} textAnchor="middle" fontSize={9} fill={C_GH}>
                A + C + len 모두 인증
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={40} y={30} w={170} h={32} label="GHASH 결과" color={C_GH} outlined />
              <text x={235} y={50} textAnchor="middle" fontSize={11} fill={C_TAG}>⊕</text>
              <DataBox x={250} y={30} w={170} h={32} label="AES_K(counter_0)" color={C_K} outlined />
              <DataBox x={130} y={84} w={220} h={36} label="T (128-bit Tag)" color={C_TAG} outlined />
              <text x={240} y={156} textAnchor="middle" fontSize={9} fontWeight={600} fill={C_TAG}>
                AES-NI: ~1 cycle per byte
              </text>
              <text x={240} y={174} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                64B cache line: ~30ns (L1 hit)
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
