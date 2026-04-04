import { motion } from 'framer-motion';
import { C } from './ContextVizData';

const f = (d: number) => ({ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace' };

export function StepProofs() {
  const lines = [
    { line: '// Filecoin 봉인 파이프라인', c: C.proof, y: 38 },
    { line: 'PC1: SDR_Encode(data, 11_layers)    // CPU 순차', c: C.err, y: 58 },
    { line: 'PC2: Column_Hash(tree_r, tree_c)    // GPU NTT', c: C.gpu, y: 78 },
    { line: 'C1:  Vanilla_Proof(challenges)       // CPU 추출', c: C.proof, y: 98 },
    { line: 'C2:  Groth16_Prove(circuit, witness) // GPU MSM', c: C.ok, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.proof}>봉인 파이프라인: PC1→PC2→C1→C2</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={10} y={l.y - 13} width={420} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={20} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepBottleneck() {
  const lines = [
    { line: '// C2 Groth16 내부 GPU 연산', c: C.ok, y: 38 },
    { line: 'MSM: 2^27 points × BLS12-381 G1  // 핵심 병목', c: C.proof, y: 58 },
    { line: 'FFT: 2^30 elements (Fr field)     // 다항식 변환', c: C.gpu, y: 78 },
    { line: 'VRAM 요구량: ~10 GB (32GiB 섹터 기준)', c: C.err, y: 98 },
    { line: '// GPU 없으면 C2 = 수십 분 ~ 시간', c: C.err, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.gpu}>C2 GPU 연산: MSM + FFT</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={10} y={l.y - 13} width={420} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={20} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}
