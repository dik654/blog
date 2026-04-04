import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };

const PRECOMPILES = [
  { code: 'jt[0x01] = ecRecover  // 서명 복구 (ECDSA)', color: '#6366f1' },
  { code: 'jt[0xf1] = iCosmosPrecompile{execute_cosmos, query_cosmos}', color: '#10b981' },
  { code: 'jt[0xf2] = erc20RegistryPrecompile{register, queryPair}', color: '#f59e0b' },
  { code: 'jt[0xf3] = jsonUtilsPrecompile{parseJSON, getField}', color: '#ec4899' },
];

export default function PrecompileSteps({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={14} fontSize={11} fontWeight={700} fill="var(--foreground)">
        프리컴파일 등록 — EVM 기본 + Initia 커스텀
      </text>
      {PRECOMPILES.map((p, i) => {
        const active = step === 0 || step === i + 1;
        const glow = step === i + 1;
        const y = 22 + i * 28;
        return (
          <motion.g key={i} animate={{ opacity: active ? 1 : 0.15 }} transition={sp}>
            <rect x={15} y={y} width={450} height={24} rx={4}
              fill={glow ? `${p.color}12` : `${p.color}06`}
              stroke={p.color} strokeWidth={glow ? 1.5 : 0.5} />
            <text x={25} y={y + 15} fontSize={10} fontWeight={600} fill={p.color} fontFamily="monospace">
              Line {i + 1}:
            </text>
            <text x={80} y={y + 15} fontSize={10} fill="var(--foreground)" fontFamily="monospace">
              {p.code}
            </text>
          </motion.g>
        );
      })}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <text x={15} y={148} fontSize={10} fill="var(--muted-foreground)">
          ICosmos 프리컴파일로 Solidity에서 Cosmos 모듈 직접 호출 가능
        </text>
      </motion.g>
    </svg>
  );
}
