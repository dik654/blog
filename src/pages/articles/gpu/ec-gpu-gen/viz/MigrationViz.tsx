import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox } from '@/components/viz/boxes';

const C = {
  old: '#0ea5e9',     // sky — ec-gpu-gen
  newF: '#10b981',    // emerald — ICICLE
  pro: '#a855f7',     // violet — 이점
  fc: '#f59e0b',      // amber — Filecoin 현역
};

const STEPS = [
  { label: 'ec-gpu-gen (2020~)', body: 'OpenCL + CUDA 양쪽 지원.\nbuild.rs 가 텍스트로 코드 생성.\nFilecoin 커브(BN254/BLS12-381) 중심.\nRust only.' },
  { label: 'ICICLE (2023~)', body: 'CUDA 네이티브 (C++ 템플릿 특수화).\n사전 컴파일된 라이브러리.\nBN254/BLS/STARK 친화 12+ 커브.\nRust + Go + Python 바인딩.' },
  { label: '비교 5개 차원', body: '백엔드 / 코드 생성 방식 / 사용처 / 커브 수 / 언어.\nICICLE 가 더 범용적, ec-gpu-gen 은 더 가볍다.' },
  { label: '왜 ICICLE 로 이동하는가', body: 'C++ 템플릿: 코드 생성보다 유지보수 용이.\n사전 컴파일: 빌드 타임 GPU 종속성 제거.\n멀티 백엔드: CUDA + CPU fallback.\n커뮤니티: 더 많은 커브, 빠른 최적화.' },
  { label: '하지만 ec-gpu-gen 은 현역', body: 'bellperson / Neptune 가 여전히 사용.\nFilecoin 메인넷 증명 파이프라인의 핵심.\n수년간 운영된 안정성.' },
];

const COMPARE_ROWS: { dim: string; old: string; nu: string }[] = [
  { dim: '백엔드',      old: 'OpenCL + CUDA',  nu: 'CUDA 네이티브' },
  { dim: '코드 생성',   old: 'build.rs 텍스트', nu: 'C++ 템플릿 특수화' },
  { dim: '주요 사용처', old: 'bellperson 전용', nu: 'gnark/Polygon/Scroll' },
  { dim: '커브 수',     old: 'Filecoin 중심',   nu: '12+ 지원' },
  { dim: '언어',        old: 'Rust only',       nu: 'Rust + Go + Python' },
];

function OldStep() {
  return (
    <g>
      <ModuleBox x={140} y={28} w={200} h={50} label="ec-gpu-gen" sub="2020~" color={C.old} />
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <text x={240} y={94} textAnchor="middle" fontSize={9} fill={C.old}>OpenCL + CUDA</text>
        <text x={240} y={108} textAnchor="middle" fontSize={9} fill={C.old}>build.rs 코드 생성</text>
        <text x={240} y={122} textAnchor="middle" fontSize={9} fill={C.old}>bellperson 전용</text>
        <text x={240} y={136} textAnchor="middle" fontSize={9} fill={C.old}>Rust only</text>
      </motion.g>
    </g>
  );
}

function NewStep() {
  return (
    <g>
      <ModuleBox x={140} y={28} w={200} h={50} label="ICICLE" sub="2023~" color={C.newF} />
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <text x={240} y={94} textAnchor="middle" fontSize={9} fill={C.newF}>CUDA 네이티브 (C++)</text>
        <text x={240} y={108} textAnchor="middle" fontSize={9} fill={C.newF}>사전 컴파일 라이브러리</text>
        <text x={240} y={122} textAnchor="middle" fontSize={9} fill={C.newF}>gnark / Polygon / Scroll</text>
        <text x={240} y={136} textAnchor="middle" fontSize={9} fill={C.newF}>Rust + Go + Python</text>
      </motion.g>
    </g>
  );
}

function CompareStep() {
  return (
    <g>
      <text x={130} y={16} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.old}>ec-gpu-gen</text>
      <text x={350} y={16} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.newF}>ICICLE</text>
      {COMPARE_ROWS.map((r, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
          <text x={20} y={36 + i * 22} fontSize={8} fontWeight={600} fill="var(--muted-foreground)">{r.dim}</text>
          <rect x={70} y={26 + i * 22} width={170} height={16} rx={3} fill={C.old + '08'} stroke={C.old} strokeWidth={0.4} />
          <text x={155} y={37 + i * 22} textAnchor="middle" fontSize={7.5} fill={C.old}>{r.old}</text>
          <rect x={250} y={26 + i * 22} width={210} height={16} rx={3} fill={C.newF + '08'} stroke={C.newF} strokeWidth={0.4} />
          <text x={355} y={37 + i * 22} textAnchor="middle" fontSize={7.5} fill={C.newF}>{r.nu}</text>
        </motion.g>
      ))}
    </g>
  );
}

function WhyStep() {
  const reasons = [
    'C++ 템플릿 특수화: 유지보수 용이',
    '사전 컴파일: 빌드 타임 GPU 불필요',
    '멀티 백엔드: CUDA + CPU fallback',
    '커뮤니티: 더 많은 커브, 빠른 최적화',
  ];
  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.pro}>
        ICICLE 채택 4가지 이유
      </text>
      {reasons.map((t, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
          <circle cx={40} cy={36 + i * 24} r={10} fill={C.pro + '15'} stroke={C.pro} strokeWidth={0.8} />
          <text x={40} y={40 + i * 24} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.pro}>{i + 1}</text>
          <text x={62} y={40 + i * 24} fontSize={8.5} fill="var(--foreground)">{t}</text>
        </motion.g>
      ))}
    </g>
  );
}

function StillCurrentStep() {
  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.fc}>
        ec-gpu-gen 은 Filecoin 메인넷에서 현역
      </text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <ModuleBox x={50} y={32} w={120} h={40} label="bellperson" sub="Groth16 prover" color={C.fc} />
        <ModuleBox x={180} y={32} w={120} h={40} label="Neptune" sub="Poseidon GPU" color={C.fc} />
        <ModuleBox x={310} y={32} w={120} h={40} label="Filecoin" sub="메인넷 증명" color={C.fc} />
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <line x1={110} y1={84} x2={110} y2={100} stroke={C.fc} strokeWidth={0.8} />
        <line x1={240} y1={84} x2={240} y2={100} stroke={C.fc} strokeWidth={0.8} />
        <line x1={370} y1={84} x2={370} y2={100} stroke={C.fc} strokeWidth={0.8} />
        <rect x={60} y={102} width={360} height={32} rx={6} fill={C.fc + '08'} stroke={C.fc} strokeWidth={0.6} />
        <text x={240} y={118} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.fc}>ec-gpu-gen</text>
        <text x={240} y={130} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
          수년간 운영된 안정성 + 마이그레이션 비용
        </text>
      </motion.g>
    </g>
  );
}

const R = [OldStep, NewStep, CompareStep, WhyStep, StillCurrentStep];

export default function MigrationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 150" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
