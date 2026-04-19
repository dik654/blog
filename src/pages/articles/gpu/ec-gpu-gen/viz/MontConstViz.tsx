import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';

const C = {
  R: '#0ea5e9',     // sky
  R2: '#10b981',    // emerald
  inv: '#a855f7',   // violet
  bn: '#f59e0b',    // amber — BN254
  bls: '#ef4444',   // red — BLS12-381
  build: '#0891b2',
};

const STEPS = [
  { label: 'R = 2^(64·LIMBS) mod p', body: 'Montgomery 표현 변환의 베이스.\n4-limb (256-bit) → R = 2^256.\n6-limb (384-bit) → R = 2^384.' },
  { label: 'R2 = R · R mod p', body: 'to_montgomery(x) = x · R2 (mod p) 에 사용.\n일반값을 Montgomery form 으로 한 번에 변환.' },
  { label: 'inv = -p^-1 mod 2^64', body: 'CIOS 환원의 핵심: t · inv → m (lowest limb 소거).\n64-bit 단위로만 계산하므로 GPU 친화적.' },
  { label: 'BN254 (4-limb) 상수값', body: 'p = 0x30644e72e131a029...\nR  = 0x0e0a77c19a07df2f...\ninv = 0x87d20782e4866389' },
  { label: 'BLS12-381 (6-limb) 상수값', body: 'p   = 0x1a0111ea397fe69a...\nR   = 0x015f65ec3fa80e49...\ninv = 0x89f3fffcfffcfffd' },
  { label: 'build.rs 정확성 = 전체 증명 정합성', body: '한 번 잘못 계산되면 모든 Fp 곱셈이 잘못된 결과 생성.\nGroth16 검증 실패 → 증명 자체가 무효.' },
];

function ConstStep({ which }: { which: 'R' | 'R2' | 'inv' }) {
  const data = {
    R:   { color: C.R,   formula: 'R = 2^(64·LIMBS) mod p', use: '일반값 → Montgomery form 변환의 베이스' },
    R2:  { color: C.R2,  formula: 'R2 = R · R mod p',       use: 'to_montgomery(x) = x · R2 (mod p)' },
    inv: { color: C.inv, formula: 'inv = -p^-1 mod 2^64',   use: 'CIOS 환원: m = t[0] · inv (lowest limb 소거)' },
  }[which];

  return (
    <g>
      <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={data.color}>
        {data.formula}
      </text>
      <motion.g initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
        <rect x={60} y={36} width={360} height={48} rx={8} fill={data.color + '08'} stroke={data.color} strokeWidth={0.8} />
        <text x={240} y={56} textAnchor="middle" fontSize={9} fontWeight={600} fill={data.color}>build.rs 가 컴파일 타임 1회 계산</text>
        <text x={240} y={72} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">{data.use}</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <rect x={60} y={94} width={170} height={36} rx={6} fill={C.bn + '08'} stroke={C.bn} strokeWidth={0.6} />
        <text x={145} y={108} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.bn}>BN254 (4-limb)</text>
        <text x={145} y={122} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
          {which === 'R' ? '0x0e0a...df2f' : which === 'R2' ? '0x06d8...351f' : '0x87d2...6389'}
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <rect x={250} y={94} width={170} height={36} rx={6} fill={C.bls + '08'} stroke={C.bls} strokeWidth={0.6} />
        <text x={335} y={108} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.bls}>BLS12-381 (6-limb)</text>
        <text x={335} y={122} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
          {which === 'R' ? '0x015f...0e49' : which === 'R2' ? '0x05f1...6ce5' : '0x89f3...fffd'}
        </text>
      </motion.g>
    </g>
  );
}

function CurveStep({ curve }: { curve: 'BN254' | 'BLS12-381' }) {
  const isBn = curve === 'BN254';
  const color = isBn ? C.bn : C.bls;
  const limbs = isBn ? 4 : 6;
  const consts = isBn
    ? [
        { k: 'p',   v: '0x30644e72e131a029 0xb85045b68181585d 0x97816a916871ca8d 0x3c208c16d87cfd47' },
        { k: 'R',   v: '0x0e0a77c19a07df2f 0x666ea36f7879462c 0x0a78eb28f5c70b3d 0xd35d438dc58f0d9d' },
        { k: 'R2',  v: '0x06d89f71cab8351f 0x47ab1eff0a417ff6 0xb5e71911d44501fb 0xf32cfc5b538afa89' },
        { k: 'inv', v: '0x87d20782e4866389' },
      ]
    : [
        { k: 'p',   v: '0x1a0111ea397fe69a ... (6 × uint64)' },
        { k: 'R',   v: '0x015f65ec3fa80e49 ... (6 × uint64)' },
        { k: 'R2',  v: '0x05f19672fdf76ce5 ... (6 × uint64)' },
        { k: 'inv', v: '0x89f3fffcfffcfffd' },
      ];
  return (
    <g>
      <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>
        {curve} ({limbs}-limb)
      </text>
      {consts.map((c, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
          <rect x={20} y={28 + i * 28} width={440} height={22} rx={4}
            fill={color + '08'} stroke={color} strokeWidth={0.5} />
          <text x={32} y={42 + i * 28} fontSize={9} fontWeight={700} fill={color}>{c.k}</text>
          <text x={70} y={42 + i * 28} fontSize={7.5} fill="var(--foreground)" fontFamily="monospace">{c.v}</text>
        </motion.g>
      ))}
    </g>
  );
}

function CorrectnessStep() {
  return (
    <g>
      <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.inv}>
        build.rs 정확성 = 전체 증명 정합성
      </text>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <DataBox x={30} y={36} w={120} h={28} label="잘못된 inv" color="#ef4444" outlined />
      </motion.g>
      <motion.text x={155} y={54} fontSize={11} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>→</motion.text>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <DataBox x={170} y={36} w={140} h={28} label="모든 Fp 곱셈 오류" color="#ef4444" outlined />
      </motion.g>
      <motion.text x={315} y={54} fontSize={11} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>→</motion.text>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <DataBox x={330} y={36} w={130} h={28} label="증명 검증 실패" color="#ef4444" outlined />
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
        <rect x={40} y={84} width={400} height={50} rx={8} fill={C.inv + '08'} stroke={C.inv} strokeWidth={0.8} />
        <text x={240} y={102} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.inv}>
          ec-gpu-gen 검증 전략
        </text>
        <text x={240} y={117} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          빌드 직후 CPU 표준 라이브러리(ark-bn254 등)와 결과 비교
        </text>
        <text x={240} y={129} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          모든 필드/곡선 연산을 cargo test 로 자동 검증
        </text>
      </motion.g>
    </g>
  );
}

const R = [
  () => <ConstStep which="R" />,
  () => <ConstStep which="R2" />,
  () => <ConstStep which="inv" />,
  () => <CurveStep curve="BN254" />,
  () => <CurveStep curve="BLS12-381" />,
  () => <CorrectnessStep />,
];

export default function MontConstViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 150" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
