import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = {
  bn: '#0ea5e9',     // sky — BN254
  bls: '#10b981',    // emerald — BLS12-381
  warn: '#ef4444',   // red — 문제
  fix: '#a855f7',    // violet — 해결
};

const STEPS = [
  { label: 'BN254 Fp 파라미터', body: 'Filecoin Groth16 검증 / Ethereum precompile에서 사용.\n254비트 소수, 4-limb (uint64 4개).' },
  { label: 'BLS12-381 Fp 파라미터', body: 'Eth2 BLS 서명 / Filecoin SNARK 등 산업 표준.\n381비트 소수, 6-limb.' },
  { label: '같은 로직, 다른 상수', body: 'Fp 곱셈 알고리즘은 동일 (Montgomery CIOS).\n그러나 limb 수와 상수 (p, R, R2, inv) 가 커브마다 다르다.' },
  { label: '커브마다 손코딩 → 유지보수 불가', body: '현재 활용 커브 12종+, 향후 더 늘어날 예정.\n파라미터만 다른 커널을 매번 작성/디버깅 불가능.' },
  { label: '해결: 빌드 타임 자동 생성 (ec-gpu-gen)', body: 'GpuField trait → 파라미터 추출.\n템플릿에 주입 → OUT_DIR 에 .cl/.cu 생성.' },
];

const BN_PARAMS = [
  { k: 'p', v: '~2.18 × 10^76 (254-bit)' },
  { k: 'limbs', v: '4 (uint64 × 4 = 256-bit)' },
  { k: 'R', v: '2^256 mod p' },
  { k: 'R2', v: 'R · R mod p' },
  { k: 'inv', v: '-p^-1 mod 2^64' },
];

const BLS_PARAMS = [
  { k: 'p', v: '0x1a01...585 (381-bit)' },
  { k: 'limbs', v: '6 (uint64 × 6 = 384-bit)' },
  { k: 'R', v: '2^384 mod p' },
  { k: 'R2', v: 'R · R mod p' },
  { k: 'inv', v: '-p^-1 mod 2^64' },
];

function ParamCard({ title, color, params, x }: {
  title: string; color: string; params: typeof BN_PARAMS; x: number;
}) {
  return (
    <g>
      <text x={x + 110} y={28} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>{title}</text>
      <rect x={x} y={36} width={220} height={114} rx={8} fill={color + '08'} stroke={color} strokeWidth={0.8} />
      {params.map((p, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.06 }}>
          <text x={x + 12} y={56 + i * 18} fontSize={9} fontWeight={700} fill={color}>{p.k}</text>
          <text x={x + 60} y={56 + i * 18} fontSize={8} fill="var(--foreground)">{p.v}</text>
        </motion.g>
      ))}
    </g>
  );
}

function BNStep() {
  return <ParamCard title="BN254 Fp" color={C.bn} params={BN_PARAMS} x={130} />;
}

function BLSStep() {
  return <ParamCard title="BLS12-381 Fp" color={C.bls} params={BLS_PARAMS} x={130} />;
}

function CompareStep() {
  return (
    <g>
      <ParamCard title="BN254" color={C.bn} params={BN_PARAMS} x={20} />
      <ParamCard title="BLS12-381" color={C.bls} params={BLS_PARAMS} x={250} />
    </g>
  );
}

function ManualPainStep() {
  const curves = ['BN254', 'BLS12-381', 'BLS12-377', 'BW6-761', 'Pallas', 'Vesta', 'Pluto'];
  return (
    <g>
      <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.warn}>
        커브마다 커널 손코딩 → 유지보수 불가능
      </text>
      {curves.map((c, i) => {
        const col = i % 4, row = Math.floor(i / 4);
        return (
          <motion.g key={c} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}>
            <rect x={20 + col * 115} y={36 + row * 40} width={108} height={32} rx={6}
              fill={C.warn + '08'} stroke={C.warn} strokeWidth={0.8} strokeDasharray="3 2" />
            <text x={74 + col * 115} y={49 + row * 40} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.warn}>
              {c}.cu
            </text>
            <text x={74 + col * 115} y={62 + row * 40} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
              ~2000줄
            </text>
          </motion.g>
        );
      })}
      <motion.text x={240} y={140} textAnchor="middle" fontSize={8} fill={C.warn}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        디버그 7+ 종류 × 알고리즘 수정 시 N개 동기화
      </motion.text>
    </g>
  );
}

function SolutionStep() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.fix}>
        ec-gpu-gen: 빌드 타임 자동 생성
      </text>
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
        <rect x={20} y={32} width={120} height={50} rx={8} fill={C.bn + '12'} stroke={C.bn} strokeWidth={0.8} />
        <text x={80} y={50} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.bn}>impl GpuField</text>
        <text x={80} y={64} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">for Bn254Fp</text>
        <text x={80} y={75} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">limbs/p/R/R2/inv</text>
      </motion.g>
      <motion.line x1={143} y1={57} x2={188} y2={57} stroke={C.fix} strokeWidth={1} markerEnd="url(#arrSol)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 }} />
      <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
        <rect x={190} y={32} width={130} height={50} rx={8} fill={C.fix + '12'} stroke={C.fix} strokeWidth={0.8} />
        <text x={255} y={50} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.fix}>build.rs</text>
        <text x={255} y={64} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">템플릿 + 파라미터</text>
        <text x={255} y={75} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">→ OpenCL/CUDA 소스</text>
      </motion.g>
      <motion.line x1={323} y1={57} x2={368} y2={57} stroke={C.fix} strokeWidth={1} markerEnd="url(#arrSol)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8 }} />
      <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9 }}>
        <rect x={370} y={32} width={100} height={50} rx={8} fill={C.bls + '12'} stroke={C.bls} strokeWidth={0.8} />
        <text x={420} y={50} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.bls}>kernel.cu</text>
        <text x={420} y={64} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">생성된 소스</text>
        <text x={420} y={75} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">OUT_DIR</text>
      </motion.g>
      <motion.text x={240} y={108} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
        새 커브 추가: GpuField 한 줄 구현 = 커널 자동 생성
      </motion.text>
      <motion.text x={240} y={124} textAnchor="middle" fontSize={8} fill={C.fix}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
        알고리즘 수정 = 모든 커브에 일괄 반영
      </motion.text>
      <defs>
        <marker id="arrSol" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6" fill={C.fix} />
        </marker>
      </defs>
    </g>
  );
}

const R = [BNStep, BLSStep, CompareStep, ManualPainStep, SolutionStep];

export default function ProblemViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 160" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
