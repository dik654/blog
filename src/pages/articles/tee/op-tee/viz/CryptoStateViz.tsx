import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  'tee_cryp_state: 알고리즘 + 모드 + 키 + 컨텍스트',
  '대칭키: AES(ECB/CBC/CTR/XTS/GCM), SM4',
  '비대칭: RSA(1024-4096), ECC(P-256/384, Curve25519)',
  '해시/KDF: SHA-256/512, HKDF, PBKDF2',
];

const FIELDS = [
  { name: 'algo', desc: 'TEE_ALG_AES_GCM 등', color: '#6366f1' },
  { name: 'mode', desc: 'ENCRYPT / DECRYPT / SIGN', color: '#6366f1' },
  { name: 'key1', desc: '첫 번째 키 주소', color: '#10b981' },
  { name: 'key2', desc: '두 번째 키 (XTS)', color: '#10b981' },
  { name: 'ctx', desc: '암호화 컨텍스트', color: '#f59e0b' },
  { name: 'state', desc: 'INITIALIZED / UNINITIALIZED', color: '#f59e0b' },
];

const ALGOS = [
  { cat: '대칭키', list: 'AES-ECB/CBC/CTR/XTS/GCM, SM4', color: '#6366f1' },
  { cat: '비대칭', list: 'RSA 1024-4096, ECC P-256/384', color: '#10b981' },
  { cat: '해시/KDF', list: 'SHA-256/512, HKDF, PBKDF2', color: '#f59e0b' },
];

export default function CryptoStateViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 190" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Struct */}
          <motion.rect x={20} y={10} width={230} height={170} rx={7}
            fill={step === 0 ? '#6366f110' : '#6366f104'} stroke={step === 0 ? '#6366f1' : '#6366f130'}
            strokeWidth={step === 0 ? 1.5 : 1} animate={{ opacity: step === 0 ? 1 : 0.4 }} />
          <text x={35} y={28} fontSize={11} fontWeight={700} fill="#6366f1">tee_cryp_state</text>

          {FIELDS.map((f, i) => (
            <g key={f.name}>
              <motion.rect x={30} y={38 + i * 22} width={210} height={18} rx={3}
                fill={step === 0 ? `${f.color}10` : 'var(--card)'}
                stroke={step === 0 ? `${f.color}40` : 'var(--border)'} strokeWidth={0.5}
                animate={{ opacity: step === 0 ? 1 : 0.3 }} />
              <text x={40} y={51 + i * 22} fontSize={10} fontWeight={600} fill={f.color}>{f.name}</text>
              <text x={100} y={51 + i * 22} fontSize={10} fill="var(--muted-foreground)">{f.desc}</text>
            </g>
          ))}

          {/* Algorithms */}
          {ALGOS.map((a, i) => {
            const active = i + 1 === step;
            const y = 20 + i * 56;
            return (
              <g key={a.cat}>
                <motion.rect x={280} y={y} width={240} height={46} rx={6}
                  fill={active ? `${a.color}14` : `${a.color}05`}
                  stroke={active ? a.color : `${a.color}30`} strokeWidth={active ? 1.5 : 1}
                  animate={{ opacity: active ? 1 : 0.25 }} />
                <text x={295} y={y + 17} fontSize={10} fontWeight={600} fill={a.color}>{a.cat}</text>
                <text x={295} y={y + 34} fontSize={10} fill="var(--muted-foreground)">{a.list}</text>
              </g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
