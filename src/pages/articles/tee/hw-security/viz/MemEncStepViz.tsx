import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'AES-XTS 내부 — tweak = AES(key2, sector_addr), 블록별 XOR 후 AES(key1) 수행' },
  { label: '무결성 트리 — MAC[i] = CMAC(key3, data || addr || ver), Merkle Root까지 검증' },
  { label: '리플레이 방지 — VER_TABLE[phys_addr]++ 후 MAC 재계산, 카운터 불일치 = 탐지' },
];
const mono = { fontFamily: 'monospace' };

export default function MemEncStepViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 190" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (<g>
            <text x={270} y={20} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">AES-XTS 내부 연산</text>
            {[
              { line: 'tweak = AES(key2, sector_addr)', c: '#6366f1', y: 44 },
              { line: 'P\' = plaintext XOR tweak', c: '#6366f1', y: 68 },
              { line: 'C\' = AES_encrypt(key1, P\')', c: '#10b981', y: 92 },
              { line: 'ciphertext = C\' XOR tweak', c: '#10b981', y: 116 },
            ].map((l, i) => (
              <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
                <rect x={80} y={l.y - 14} width={380} height={22} rx={3} fill={`${l.c}10`} stroke={`${l.c}50`} strokeWidth={0.8} />
                <text x={95} y={l.y} fontSize={11} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
              </motion.g>
            ))}
            <text x={270} y={150} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
              sector_addr이 다르면 같은 plaintext도 다른 ciphertext
            </text>
          </g>)}
          {step === 1 && (<g>
            <text x={270} y={20} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">무결성 트리 MAC 계산</text>
            {[
              { line: 'MAC[i] = CMAC(key3, data_i || phys_addr || version)', c: '#10b981', y: 48 },
              { line: 'H1 = SHA-256(MAC[0] || MAC[1])', c: '#6366f1', y: 78 },
              { line: 'Root = SHA-256(H1 || H2 || ... || Hn)', c: '#6366f1', y: 108 },
            ].map((l, i) => (
              <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}>
                <rect x={50} y={l.y - 14} width={440} height={22} rx={3} fill={`${l.c}10`} stroke={`${l.c}50`} strokeWidth={0.8} />
                <text x={65} y={l.y} fontSize={11} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
              </motion.g>
            ))}
            <motion.text x={270} y={148} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              Root를 CPU 내부 레지스터에 보관 → DRAM 변조 즉시 탐지
            </motion.text>
          </g>)}
          {step === 2 && (<g>
            <text x={270} y={20} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">리플레이 방지 카운터</text>
            {[
              { line: '// 쓰기 시', c: '#f59e0b', y: 48 },
              { line: 'VER_TABLE[phys_addr] += 1', c: '#f59e0b', y: 70 },
              { line: 'MAC = CMAC(key, data || VER_TABLE[phys_addr])', c: '#10b981', y: 92 },
              { line: '// 읽기 시: 저장된 MAC vs 재계산 MAC 비교', c: '#6366f1', y: 120 },
              { line: 'if (mac_stored != mac_calc) → SECURITY_FAULT', c: '#ef4444', y: 142 },
            ].map((l, i) => (
              <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <rect x={60} y={l.y - 14} width={420} height={22} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
                <text x={75} y={l.y} fontSize={11} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
              </motion.g>
            ))}
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
