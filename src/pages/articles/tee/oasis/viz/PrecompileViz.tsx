import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '난수 & 키 유도 프리컴파일', body: 'RANDOM_BYTES(0x01...01): SGX 내 PRNG으로 안전한 난수 생성.\nDERIVE_KEY(0x01...02): HKDF 키 유도.' },
  { label: '대칭 암호화/복호화 프리컴파일', body: 'ENCRYPT(0x01...03): DeoxysII-256 대칭 암호화.\nDECRYPT(0x01...04): 대칭 복호화. SGX 안에서만 수행.' },
  { label: '서명 프리컴파일', body: 'GENERATE_SIGNING_KEYPAIR(0x01...05): 키쌍 생성.\nSIGN/VERIFY(0x01...06~07): Ed25519, Secp256k1 서명.' },
  { label: '기밀 난수 사용 예시', body: 'Sapphire.randomBytes(32, "") → 32바이트 기밀 난수.\nabi.decode로 uint256으로 변환하여 컨트랙트에서 활용.' },
];

const BLOCKS = [
  { label: 'RANDOM', sub: '0x01...01', color: '#6366f1', x: 60 },
  { label: 'DERIVE_KEY', sub: '0x01...02', color: '#6366f1', x: 175 },
  { label: 'ENCRYPT', sub: '0x01...03', color: '#10b981', x: 290 },
  { label: 'DECRYPT', sub: '0x01...04', color: '#10b981', x: 395 },
  { label: 'SIGN', sub: '0x01...06', color: '#f59e0b', x: 505 },
];

export default function PrecompileViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const highlight = [
          [0, 1], // step 0: random + derive
          [2, 3], // step 1: encrypt + decrypt
          [4],    // step 2: sign
          [0, 1, 2, 3, 4], // step 3: all (usage)
        ];
        const active = highlight[step] ?? [];
        return (
          <svg viewBox="0 0 560 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <rect x={15} y={10} width={530} height={55} rx={8}
              fill="none" stroke="#6366f120" strokeWidth={1} strokeDasharray="5,4" />
            <text x={30} y={26} fontSize={10} fill="#6366f1" fontWeight={600}>Sapphire Precompiles (SGX)</text>
            {BLOCKS.map((b, i) => (
              <g key={b.label}>
                <motion.rect x={b.x - 40} y={30} width={80} height={30} rx={5}
                  fill={active.includes(i) ? `${b.color}20` : `${b.color}08`}
                  stroke={active.includes(i) ? b.color : `${b.color}30`}
                  strokeWidth={active.includes(i) ? 1.8 : 0.6}
                  animate={{ opacity: active.includes(i) ? 1 : 0.25 }}
                  transition={{ duration: 0.3 }} />
                <text x={b.x} y={44} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={active.includes(i) ? b.color : 'var(--foreground)'}>{b.label}</text>
                <text x={b.x} y={56} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)">{b.sub}</text>
              </g>
            ))}
            {/* EVM call arrow */}
            {step === 3 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <rect x={180} y={85} width={200} height={32} rx={6}
                  fill="#f59e0b10" stroke="#f59e0b50" strokeWidth={1} />
                <text x={280} y={105} textAnchor="middle" fontSize={10}
                  fill="#f59e0b" fontWeight={600}>Sapphire.randomBytes(32,"")</text>
                <line x1={280} y1={65} x2={280} y2={85} stroke="#f59e0b" strokeWidth={1} />
              </motion.g>
            )}
          </svg>
        );
      }}
    </StepViz>
  );
}
