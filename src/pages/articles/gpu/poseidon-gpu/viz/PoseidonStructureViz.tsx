import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const C = {
  full: '#0ea5e9',
  partial: '#10b981',
  mds: '#a855f7',
  warn: '#f59e0b',
  state: '#94a3b8',
};

const STEPS = [
  {
    label: 'HADES 구조 — Full / Partial / Full',
    body: '상태 벡터 [s0, s1, ..., s_{t-1}], t = arity + 1.\nFull rounds (R_F/2) → Partial rounds (R_P) → Full rounds (R_F/2).\n각 라운드 = (round constant 덧셈) + S-box(x^5) + MDS 곱셈.',
  },
  {
    label: 'Full round — 모든 lane에 S-box',
    body: '모든 상태 원소에 S-box(x^5)를 적용.\n비용: width개 lane × Fp 곱셈 3회 (squaring 2 + mul 1) = 3·width Fp mul/라운드.',
  },
  {
    label: 'Partial round — lane 0만 S-box',
    body: '첫 번째 원소만 비선형 변환, 나머지는 round constant만 더함.\n비용 절약: 3·width → 3 Fp mul/라운드 → R_P가 라운드 수 대부분을 차지.',
  },
  {
    label: '예시: arity=2 vs arity=11',
    body: 'arity=2 (t=3): R_F=8, R_P=57 → S-box 호출 4·3 + 57·1 + 4·3 = 81회.\narity=11 (t=12): R_F=8, R_P=57 → S-box 호출 4·12 + 57·1 + 4·12 = 153회.\nMDS 행렬은 12×12 → 144회 Fp 곱셈/라운드.',
  },
];

export default function PoseidonStructureViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
            Poseidon HADES 라운드 구조
          </text>

          {/* 상태 벡터 표시 */}
          {step <= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={42} fontSize={9} fontWeight={700} fill={C.state}>state</text>
              {[0, 1, 2, 3].map((i) => (
                <DataBox key={i} x={60 + i * 60} y={28} w={50} h={26}
                  label={`s${i}`} color={C.state} outlined />
              ))}
            </motion.g>
          )}

          {/* 라운드 시퀀스 (step 0) */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <ActionBox x={20} y={80} w={130} h={42} label="Full × R_F/2" sub="모든 lane S-box" color={C.full} />
              <ActionBox x={170} y={80} w={140} h={42} label="Partial × R_P" sub="lane 0만 S-box" color={C.partial} />
              <ActionBox x={330} y={80} w={130} h={42} label="Full × R_F/2" sub="모든 lane S-box" color={C.full} />
              <text x={240} y={142} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                각 라운드: round constant + S-box + MDS
              </text>
              <DataBox x={20} y={158} w={440} h={38} label="state width t = arity + 1" sub="capacity 1 + rate(arity)" color={C.state} outlined />
            </motion.g>
          )}

          {/* Full round 강조 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              {[0, 1, 2, 3].map((i) => (
                <g key={i}>
                  <motion.line x1={85 + i * 60} y1={56} x2={85 + i * 60} y2={88} stroke={C.full} strokeWidth={1}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * 0.05 }} />
                  <ActionBox x={60 + i * 60} y={90} w={50} h={36} label="x^5" sub={`lane ${i}`} color={C.full} />
                </g>
              ))}
              <ActionBox x={20} y={140} w={440} h={36} label="MDS 행렬 곱셈" sub="모든 lane → 모든 lane (full diffusion)" color={C.mds} />
              <text x={240} y={196} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Full: width × 3 Fp 곱셈/라운드
              </text>
            </motion.g>
          )}

          {/* Partial round 강조 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <motion.line x1={85} y1={56} x2={85} y2={88} stroke={C.partial} strokeWidth={1.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <ActionBox x={60} y={90} w={50} h={36} label="x^5" sub="lane 0" color={C.partial} />
              {[1, 2, 3].map((i) => (
                <DataBox key={i} x={60 + i * 60} y={90} w={50} h={36} label="id" sub="pass" color={C.state} outlined />
              ))}
              <ActionBox x={20} y={140} w={440} h={36} label="MDS 행렬 곱셈 (Sparse 가능)" sub="2·width − 1 곱셈으로 축소" color={C.mds} />
              <text x={240} y={196} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Partial: 3 Fp 곱셈 + Sparse MDS → 비용 ↓
              </text>
            </motion.g>
          )}

          {/* 비교: arity=2 vs arity=11 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <ModuleBox x={20} y={28} w={210} h={20} label="arity = 2 (t = 3)" color={C.full} />
              <DataBox x={30} y={56} w={190} h={26} label="R_F = 8, R_P = 57" color={C.full} outlined />
              <DataBox x={30} y={88} w={190} h={26} label="S-box 호출 = 81회" color={C.full} outlined />
              <DataBox x={30} y={120} w={190} h={26} label="MDS 3×3 = 9 mul/라운드" color={C.mds} outlined />

              <ModuleBox x={250} y={28} w={210} h={20} label="arity = 11 (t = 12)" color={C.warn} />
              <DataBox x={260} y={56} w={190} h={26} label="R_F = 8, R_P = 57" color={C.warn} outlined />
              <DataBox x={260} y={88} w={190} h={26} label="S-box 호출 = 153회" color={C.warn} outlined />
              <DataBox x={260} y={120} w={190} h={26} label="MDS 12×12 = 144 mul/라운드" color={C.mds} outlined />

              <StatusBox x={20} y={158} w={440} h={36} label="arity↑ → Merkle 깊이 ↓ but MDS 비용 ↑" sub="Filecoin: 2/4/8/11 용도별 사용" color={C.partial} progress={1} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
