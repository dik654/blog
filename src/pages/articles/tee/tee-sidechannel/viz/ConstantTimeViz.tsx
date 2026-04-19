import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_BAD = '#ef4444';
const C_GOOD = '#10b981';
const C_NEUTRAL = '#6366f1';

const STEPS = [
  {
    label: '취약 — early-exit memcmp는 timing leak',
    body: 'a[i] != b[i] 발견 즉시 return → 첫 다른 byte 위치가 시간으로 노출.\n공격자는 byte 단위로 비교 시간을 재며 비밀을 한 자씩 맞춰 간다.',
  },
  {
    label: 'Constant-time 비교 — 전체 byte XOR 누적',
    body: 'diff |= a[i] ^ b[i]; 모든 byte 검사.\n실행 시간이 입력과 무관 → 시간 정보 누출 차단.',
  },
  {
    label: 'Conditional select — branch 없이 선택',
    body: 'mask = -cond → 0 또는 0xFFFFFFFF.\nresult = (a & mask) | (b & ~mask). 분기 예측 정보 누출 없음.',
  },
  {
    label: 'Table lookup → 전체 스캔',
    body: 'for i: result |= table[i] & -ct_eq(i, index).\n모든 entry 접근 → cache pattern이 index와 무관.',
  },
];

export default function ConstantTimeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={20} w={400} h={36} label="memcmp_insecure" sub="if (a[i] != b[i]) return false;" color={C_BAD} />
              <text x={240} y={80} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={C_BAD}>
                실행 시간이 첫 다른 byte 위치에 비례
              </text>
              {[1, 2, 3, 4, 5].map((n, i) => {
                const w = n * 50;
                return (
                  <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
                    <text x={40} y={108 + i * 22} fontSize={9} fill="var(--muted-foreground)">match {n} byte</text>
                    <rect x={130} y={100 + i * 22} width={w} height={14} rx={2} fill={C_BAD} opacity={0.85} />
                  </motion.g>
                );
              })}
              <text x={240} y={210} textAnchor="middle" fontSize={9} fill={C_BAD}>
                공격자는 byte 단위로 비밀 추측
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={20} w={400} h={36} label="memcmp_ct" sub="diff |= a[i] ^ b[i]; (전체 byte)" color={C_GOOD} />
              <text x={240} y={80} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={C_GOOD}>
                실행 시간이 입력과 무관 (constant)
              </text>
              {[1, 2, 3, 4, 5].map((n, i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
                  <text x={40} y={108 + i * 22} fontSize={9} fill="var(--muted-foreground)">case {n}</text>
                  <rect x={130} y={100 + i * 22} width={250} height={14} rx={2} fill={C_GOOD} opacity={0.85} />
                </motion.g>
              ))}
              <text x={240} y={210} textAnchor="middle" fontSize={9} fill={C_GOOD}>
                timing leak 차단 — 항상 같은 시간
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={20} w={400} h={36} label="ct_select(cond, a, b)" color={C_GOOD} />
              <DataBox x={40} y={70} w={120} h={32} label="cond ∈ {0, 1}" color={C_NEUTRAL} outlined />
              <DataBox x={180} y={70} w={140} h={32} label="mask = -cond" color={C_NEUTRAL} outlined />
              <DataBox x={340} y={70} w={100} h={32} label="0x00 or 0xFF…" color={C_NEUTRAL} outlined />
              <ActionBox x={40} y={120} w={400} h={36} label="(a & mask) | (b & ~mask)" sub="branch 없음" color={C_GOOD} />
              <text x={240} y={180} textAnchor="middle" fontSize={9} fill={C_GOOD}>
                분기 예측·캐시 패턴 누출 없음
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={20} w={400} h={32} label="for i: result |= table[i] & -ct_eq(i, idx)" color={C_GOOD} />
              {Array.from({ length: 16 }).map((_, i) => {
                const x = 40 + i * 25;
                return (
                  <motion.rect key={i} x={x} y={70} width={20} height={28} rx={3}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    fill={C_GOOD} opacity={0.7} />
                );
              })}
              <text x={240} y={120} textAnchor="middle" fontSize={9} fill={C_GOOD}>
                모든 entry 접근 → cache pattern uniform
              </text>
              <AlertBox x={120} y={150} w={240} h={32} label="비용: O(N) — 작은 table만 권장" color={C_BAD} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
