import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const C = {
  dense: '#ef4444',
  sparse: '#10b981',
  factor: '#a855f7',
  saved: '#f59e0b',
  diag: '#94a3b8',
};

const STEPS = [
  {
    label: '문제: 일반 MDS — width × width 곱셈',
    body: 'Partial round에서 S-box는 첫 원소만 적용하지만\nMDS 곱셈은 여전히 width^2 Fp 곱셈.\narity=11(width=12)라면 144회/라운드 — 57개 라운드면 8208회.',
  },
  {
    label: 'Sparse 분해: M = M\' · M\'\'',
    body: '사전 계산으로 MDS 행렬을 두 행렬의 곱으로 분해.\nM\' = 첫 라운드에만 사용하는 밀집 행렬.\nM\'\' = 나머지 Partial round용 희소 행렬.',
  },
  {
    label: '희소 행렬 M\'\' 구조 (width = 4)',
    body: '첫 행: 밀집 [v0, v1, v2, v3].\n나머지 행: 첫 열 + 대각 — [w_i, ..., 1, ..., 0].\n→ 0이 아닌 항목 수 = 2·width − 1.',
  },
  {
    label: '곱셈 비용 — 2·width − 1',
    body: 'state\'[0] = dot(v, state) — width 곱셈.\nstate\'[i] = w[i]·state[0] + state[i] — i>0에 대해 1 곱셈씩.\n총 = width + (width−1) = 2·width − 1.',
  },
  {
    label: '비용 절감 — arity=11, R_P=57',
    body: '일반: 144 mul × 57 = 8208 곱셈.\nSparse: 23 mul × 57 = 1311 곱셈.\n절감 = 6897 곱셈/해시 → Neptune, ICICLE 모두 적용.',
  },
];

export default function SparseMdsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
            Sparse MDS 분해 — Partial round 최적화
          </text>

          {/* 일반 MDS */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={120} y={40} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.dense}>
                일반 MDS (4×4 예시)
              </text>
              {[0, 1, 2, 3].map((r) =>
                [0, 1, 2, 3].map((c) => (
                  <rect key={`${r}-${c}`} x={50 + c * 28} y={50 + r * 28} width={26} height={26} rx={3}
                    fill={C.dense + '30'} stroke={C.dense} strokeWidth={0.5} />
                ))
              )}
              <DataBox x={250} y={70} w={210} h={36} label="모든 셀이 곱셈에 참여" sub="총 width^2 곱셈" color={C.dense} outlined />
              <DataBox x={250} y={114} w={210} h={36} label="arity=11 → 12×12 = 144 mul" sub="× R_P 만큼 누적" color={C.dense} outlined />
              <StatusBox x={50} y={200} w={400} h={36} label="Partial 57라운드 = 8208 곱셈" sub="병목!" color={C.dense} progress={1} />
            </motion.g>
          )}

          {/* M = M' * M'' 분해 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={20} y={80} w={120} h={56} label="M (원본)" sub="Partial 라운드용" color={C.dense} outlined />
              <text x={160} y={114} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.factor}>=</text>
              <DataBox x={180} y={80} w={120} h={56} label="M' (밀집)" sub="첫 라운드만" color={C.factor} outlined />
              <text x={310} y={114} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.factor}>·</text>
              <DataBox x={330} y={80} w={120} h={56} label="M'' (희소)" sub="나머지 라운드" color={C.sparse} outlined />

              <StatusBox x={20} y={170} w={440} h={36} label="사전 계산 1회 — 런타임 비용 0" sub="setup phase에서만 분해" color={C.factor} progress={1} />
            </motion.g>
          )}

          {/* M'' 구조 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={120} y={40} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.sparse}>
                M'' (4×4) — 희소 패턴
              </text>
              {/* 첫 행: 밀집 v0..v3 */}
              {[0, 1, 2, 3].map((c) => (
                <g key={`top-${c}`}>
                  <rect x={50 + c * 28} y={50} width={26} height={26} rx={3}
                    fill={C.sparse + '30'} stroke={C.sparse} strokeWidth={0.6} />
                  <text x={63 + c * 28} y={66} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={C.sparse}>{`v${c}`}</text>
                </g>
              ))}
              {/* 나머지 행 */}
              {[1, 2, 3].map((r) => (
                [0, 1, 2, 3].map((c) => {
                  const isW = c === 0;
                  const isDiag = c === r;
                  const fill = isW ? C.sparse + '30' : isDiag ? C.diag + '24' : 'transparent';
                  const stroke = isW || isDiag ? (isW ? C.sparse : C.diag) : C.diag + '40';
                  const text = isW ? `w${r}` : isDiag ? '1' : '0';
                  return (
                    <g key={`${r}-${c}`}>
                      <rect x={50 + c * 28} y={50 + r * 28} width={26} height={26} rx={3}
                        fill={fill} stroke={stroke} strokeWidth={0.6} />
                      <text x={63 + c * 28} y={66 + r * 28} textAnchor="middle" fontSize={8.5}
                        fontWeight={isW || isDiag ? 700 : 400}
                        fill={isW ? C.sparse : isDiag ? C.diag : C.diag}>{text}</text>
                    </g>
                  );
                })
              ))}
              <DataBox x={250} y={56} w={210} h={36} label="비-0 셀 = 2·width − 1" sub="첫 행 + 첫 열 + 대각" color={C.sparse} outlined />
              <DataBox x={250} y={100} w={210} h={36} label="width=4 → 7개 셀" color={C.sparse} outlined />
            </motion.g>
          )}

          {/* 비용 분석 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={20} y={40} w={440} h={32}
                label="state'[0] = v0·s0 + v1·s1 + ... + v_{w−1}·s_{w−1}" sub="dot product = width 곱셈"
                color={C.sparse} />
              <ActionBox x={20} y={80} w={440} h={32}
                label="state'[i] = w_i · state[0] + state[i]" sub="i = 1..w−1 → 1 곱셈씩"
                color={C.sparse} />

              <DataBox x={20} y={130} w={210} h={36} label="총 = w + (w − 1)" sub="= 2·width − 1" color={C.factor} outlined />
              <DataBox x={250} y={130} w={210} h={36} label="width=12 → 23 곱셈/라운드" color={C.factor} outlined />

              <StatusBox x={20} y={180} w={440} h={36} label="라운드당 144 → 23 곱셈" sub="≈ 6.3× 절감" color={C.saved} progress={0.84} />
            </motion.g>
          )}

          {/* 누적 절감 */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={20} y={40} w={210} h={20} label="일반 MDS" color={C.dense} />
              <DataBox x={30} y={70} w={190} h={26} label="144 mul × R_P=57" color={C.dense} outlined />
              <DataBox x={30} y={102} w={190} h={26} label="= 8208 mul" color={C.dense} outlined />

              <ModuleBox x={250} y={40} w={210} h={20} label="Sparse MDS" color={C.sparse} />
              <DataBox x={260} y={70} w={190} h={26} label="23 mul × R_P=57" color={C.sparse} outlined />
              <DataBox x={260} y={102} w={190} h={26} label="= 1311 mul" color={C.sparse} outlined />

              <StatusBox x={20} y={150} w={440} h={36} label="절감: 6897 mul / 해시" sub="배치 1M 해시 → ~6.9G mul 절약" color={C.saved} progress={1} />
              <text x={240} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Neptune (Filecoin), ICICLE 모두 이 분해를 적용
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
