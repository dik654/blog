import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const C = {
  circom: '#0ea5e9',
  wgen: '#10b981',
  prover: '#a855f7',
  core: '#f59e0b',
  target: '#ef4444',
};

const STEPS = [
  {
    label: '1. circom 컴파일',
    body: 'circuit.circom → circuit.r1cs (제약 행렬) + circuit_js/ (witness 생성기).\n.r1cs는 A·w ⊙ B·w = C·w 형식의 R1CS 제약 시스템.',
  },
  {
    label: '2. Witness Generation',
    body: 'input.json + circuit.wasm → witness.wtns.\n각 신호 변수 값을 계산해 바이너리로 직렬화.',
  },
  {
    label: '3. rapidsnark Prover',
    body: 'witness.wtns + circuit.zkey → proof.json + public.json.\nGroth16 프로토콜 — 출력은 G1 점 2개 + G2 점 1개.',
  },
  {
    label: 'C++ Core 내부 모듈',
    body: 'BN128 필드 연산 (ffiasm 어셈블리), NTT/INTT (멀티스레드 FFT),\nMSM (Pippenger, GPU 오프로드), Groth16 prover 로직.',
  },
  {
    label: '빌드 타깃',
    body: 'x86_64 서버 (prover_server, 최고 성능), ARM (M1/M2 Neon SIMD),\nWASM (브라우저/React Native), GPU (CUDA MSM 백엔드, 실험적).',
  },
];

export default function RapidsnarkArchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 260" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
            rapidsnark 아키텍처 & 빌드 타깃
          </text>

          {/* 파이프라인 단계 1~3 */}
          {step <= 2 && (
            <>
              <motion.g initial={{ opacity: 0 }}
                animate={{ opacity: step >= 0 ? 1 : 0.3 }} transition={sp}>
                <ModuleBox x={20} y={36} w={140} h={42} label="circom" sub="컴파일러" color={C.circom} />
                <DataBox x={28} y={88} w={60} h={20} label=".r1cs" color={C.circom} outlined />
                <DataBox x={92} y={88} w={60} h={20} label=".wasm" color={C.circom} outlined />
              </motion.g>

              <motion.g initial={{ opacity: 0 }}
                animate={{ opacity: step >= 1 ? 1 : 0.3 }} transition={sp}>
                <motion.line x1={160} y1={56} x2={180} y2={56} stroke={C.circom} strokeWidth={1}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
                <ModuleBox x={180} y={36} w={140} h={42} label="witness gen" sub="JS / wasm runtime" color={C.wgen} />
                <DataBox x={210} y={88} w={80} h={20} label=".wtns" color={C.wgen} outlined />
              </motion.g>

              <motion.g initial={{ opacity: 0 }}
                animate={{ opacity: step >= 2 ? 1 : 0.3 }} transition={sp}>
                <motion.line x1={320} y1={56} x2={340} y2={56} stroke={C.wgen} strokeWidth={1}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
                <ModuleBox x={340} y={36} w={140} h={42} label="rapidsnark" sub="prover (C++/asm)" color={C.prover} />
                <DataBox x={350} y={88} w={60} h={20} label=".zkey" color={C.prover} outlined />
                <DataBox x={414} y={88} w={62} h={20} label="proof.json" color={C.prover} outlined />
              </motion.g>

              <DataBox x={20} y={140} w={460} h={36}
                label="circom → witness → rapidsnark Groth16 증명"
                sub="snarkjs와 동일 .wtns/.r1cs/.zkey 포맷 호환"
                color={C.prover} outlined />
            </>
          )}

          {/* C++ 코어 분해 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <ModuleBox x={20} y={36} w={440} h={20} label="C++ Core" color={C.core} />
              <ActionBox x={30} y={68} w={200} h={36} label="BN128 필드 연산" sub="ffiasm asm + GMP" color={C.core} />
              <ActionBox x={250} y={68} w={210} h={36} label="NTT / INTT" sub="멀티스레드 OpenMP" color={C.core} />
              <ActionBox x={30} y={114} w={200} h={36} label="MSM (Pippenger)" sub="GPU 오프로드 가능" color={C.core} />
              <ActionBox x={250} y={114} w={210} h={36} label="Groth16 prover" sub="증명 조립 로직" color={C.core} />
              <DataBox x={20} y={164} w={440} h={36} label="병목 70~80% = MSM" sub="GPU 가속 우선 타깃" color={C.target} outlined />
            </motion.g>
          )}

          {/* 빌드 타깃 */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <ModuleBox x={20} y={36} w={440} h={20} label="빌드 타깃" color={C.target} />
              <DataBox x={30} y={68} w={210} h={32} label="x86_64 서버" sub="prover_server (최고 성능)" color={C.target} outlined />
              <DataBox x={250} y={68} w={210} h={32} label="ARM (M1/M2)" sub="Neon SIMD" color={C.target} outlined />
              <DataBox x={30} y={108} w={210} h={32} label="WASM" sub="브라우저 / React Native" color={C.target} outlined />
              <DataBox x={250} y={108} w={210} h={32} label="GPU (CUDA)" sub="MSM 백엔드 (실험적)" color={C.prover} outlined />
              <StatusBox x={20} y={156} w={440} h={36} label="단일 코드베이스로 4개 타깃 지원" sub="ffiasm이 타깃별 어셈블리 생성" color={C.prover} progress={1} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
