import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'SGX MEE 개요 — 기밀성 + 무결성 + replay 방어 모두 제공' },
  { label: 'Merkle tree 구조 — leaf hash가 페이지마다, root는 CPU 내부 저장' },
  { label: '메모리 read 5단계 — fetch → AES → counter → tree walk → cache load' },
  { label: 'Replay 방어 — page별 monotonic counter가 tree에 포함, old ciphertext 거부' },
  { label: '성능 비용 — AES 2-5%, 무결성 tree 10-30% (SGX 강력함의 대가)' },
];

const READ_STEPS = [
  { idx: '1', label: 'page fetch (암호문)', c: '#6366f1' },
  { idx: '2', label: 'CPU AES 복호화 → 평문', c: '#10b981' },
  { idx: '3', label: 'Counter 확인 (replay 방어)', c: '#f59e0b' },
  { idx: '4', label: 'Integrity tree walk → root 비교', c: '#0ea5e9' },
  { idx: '5', label: '매치하면 CPU 캐시 load', c: '#10b981' },
];

const REPLAY_DEFS = [
  { line: '각 페이지마다 monotonic counter', c: '#6366f1' },
  { line: 'Counter가 Integrity tree에 포함', c: '#10b981' },
  { line: 'Old ciphertext 주입 → counter mismatch → fault', c: '#ef4444' },
];

const PERF = [
  { name: 'AES 암호화', val: '~2-5%', c: '#10b981' },
  { name: '무결성 tree walk', val: '~10-30%', c: '#f59e0b' },
  { name: 'TDX/SEV', val: '무결성 tree 없음 (MAC만)', c: '#ef4444' },
];

export default function MEEMerkleViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">
              SGX MEE — Memory Encryption Engine
            </text>
            <motion.g initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}>
              <ModuleBox x={20} y={60} w={150} h={62}
                label="기밀성" sub="AES 암호화" color="#6366f1" />
              <ModuleBox x={185} y={60} w={150} h={62}
                label="무결성" sub="Merkle tree" color="#10b981" />
              <ModuleBox x={350} y={60} w={150} h={62}
                label="Replay 방어" sub="counter 포함" color="#f59e0b" />
            </motion.g>
            <text x={260} y={160} textAnchor="middle" fontSize={11} fontWeight={700} fill="#6366f1">
              세 가지 보호 모두 제공 — TDX/SEV는 무결성/replay 미흡
            </text>
            <text x={260} y={185} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              가장 강력하지만 가장 큰 성능 비용
            </text>
          </g>)}
          {step === 1 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
              Merkle tree 구조
            </text>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={30} y={50} width={200} height={140} rx={8}
                fill="#6366f110" stroke="#6366f140" strokeWidth={0.8} />
              <text x={130} y={70} textAnchor="middle"
                fontSize={11} fontWeight={700} fill="#6366f1">DRAM</text>
              {[0, 1, 2].map((i) => (
                <g key={i}>
                  <rect x={50} y={85 + i * 30} width={160} height={22} rx={3}
                    fill="#6366f120" />
                  <text x={130} y={100 + i * 30} textAnchor="middle"
                    fontSize={10} fill="#6366f1">page{i} (encrypted)</text>
                </g>
              ))}
              <rect x={290} y={50} width={200} height={140} rx={8}
                fill="#10b98110" stroke="#10b98140" strokeWidth={0.8} />
              <text x={390} y={70} textAnchor="middle"
                fontSize={11} fontWeight={700} fill="#10b981">MEE (CPU die)</text>
              {[0, 1, 2].map((i) => (
                <g key={i}>
                  <rect x={310} y={85 + i * 30} width={160} height={22} rx={3}
                    fill="#10b98120" />
                  <text x={390} y={100 + i * 30} textAnchor="middle"
                    fontSize={10} fill="#10b981">leaf hash {i}</text>
                </g>
              ))}
              <text x={390} y={205} textAnchor="middle"
                fontSize={10} fontWeight={700} fill="#f59e0b">tree root → CPU 레지스터</text>
            </motion.g>
          </g>)}
          {step === 2 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0ea5e9">
              메모리 read 5단계
            </text>
            {READ_STEPS.map((s, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12 }}>
                <rect x={30} y={42 + i * 32} width={460} height={26} rx={4}
                  fill={`${s.c}10`} stroke={`${s.c}40`} strokeWidth={0.8} />
                <circle cx={52} cy={55 + i * 32} r={9} fill={s.c} />
                <text x={52} y={59 + i * 32} textAnchor="middle"
                  fontSize={10} fontWeight={700} fill="#fff">{s.idx}</text>
                <text x={75} y={59 + i * 32} fontSize={10.5} fontWeight={600} fill={s.c}>{s.label}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 3 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">
              Replay attack 방어
            </text>
            {REPLAY_DEFS.map((r, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}>
                <rect x={50} y={50 + i * 50} width={420} height={36} rx={5}
                  fill={`${r.c}10`} stroke={`${r.c}50`} strokeWidth={0.8} />
                <rect x={50} y={50 + i * 50} width={4} height={36} fill={r.c} />
                <text x={70} y={72 + i * 50} fontSize={11} fontWeight={600} fill={r.c}>{r.line}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 4 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">
              성능 비용
            </text>
            {PERF.map((p, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}>
                <rect x={40} y={50 + i * 50} width={440} height={38} rx={5}
                  fill={`${p.c}10`} stroke={`${p.c}50`} strokeWidth={0.8} />
                <text x={60} y={73 + i * 50} fontSize={11} fontWeight={700} fill={p.c}>{p.name}</text>
                <text x={300} y={73 + i * 50} fontSize={11} fill="var(--foreground)"
                  style={{ fontFamily: 'monospace' }}>{p.val}</text>
              </motion.g>
            ))}
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
