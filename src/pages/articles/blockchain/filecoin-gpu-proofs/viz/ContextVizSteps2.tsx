import { motion } from 'framer-motion';
import { C } from './ContextVizData';

const f = (d: number) => ({ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace' };

export function StepLibs() {
  const lines = [
    { line: '// bellperson: Groth16 GPU 가속 (Rust)', c: C.proof, y: 38 },
    { line: 'let proof = groth16::create_proof_gpu(', c: C.proof, y: 58 },
    { line: '  circuit, &params, rng)?;', c: C.proof, y: 78 },
    { line: '// sppark: NVIDIA MSM 최적화 커널', c: C.gpu, y: 102 },
    { line: 'sppark::msm_mont(points, scalars, n)  // CUDA', c: C.gpu, y: 122 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.proof}>bellperson + sppark</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={15} y={l.y - 13} width={410} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={25} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepGPU() {
  const lines = [
    { line: '// GPU별 C2 증명 시간 (32GiB 섹터)', c: C.ok, y: 38 },
    { line: 'RTX 4090 — 16384코어, 24GB, 1008 GB/s: C2 ~4분', c: C.gpu, y: 58 },
    { line: 'A100 80GB — 6912코어, 80GB, 2039 GB/s: C2 ~3분', c: C.proof, y: 78 },
    { line: 'RTX 3090 — 10496코어, 24GB,  936 GB/s: C2 ~6분', c: C.seal, y: 98 },
    { line: '// WindowPoSt 30분 제한 → 최소 3090 급 필요', c: C.err, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ok}>GPU별 C2 벤치마크</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={10} y={l.y - 13} width={420} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={20} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}
