import { motion } from 'framer-motion';
import { C } from './ContextVizData';
const f = (d: number) => ({ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace' };

export function StepRack() {
  const lines = [
    { line: '// 랙 크기별 GPU + 냉각 조합', c: C.rack, y: 38 },
    { line: '1U (44mm): 블로워 전용, 로프로파일 GPU만', c: C.rack, y: 58 },
    { line: '2U (88mm): 듀얼 슬롯 GPU, 패시브 히트싱크', c: C.rack, y: 78 },
    { line: '4U (176mm): 풀사이즈 GPU, RTX 4090 탑재 가능', c: C.gpu, y: 98 },
    { line: '수냉: AIO 240mm 또는 커스텀 루프 (1U도 가능)', c: C.cool, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.rack}>랙 크기별 GPU 조합</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={10} y={l.y - 13} width={420} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={20} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepCost() {
  const lines = [
    { line: '// TDP당 성능 비교 (FP32 TFLOPS / W)', c: C.cool, y: 38 },
    { line: 'RTX 4090:  82.6 TFLOPS / 450W = 183 GFLOPS/W', c: C.gpu, y: 58 },
    { line: 'A100 PCIe: 19.5 TFLOPS / 250W =  78 GFLOPS/W', c: C.rack, y: 78 },
    { line: 'H100 SXM:  66.9 TFLOPS / 700W =  96 GFLOPS/W', c: C.rack, y: 98 },
    { line: '// FP32 가성비: 4090 > H100 > A100', c: C.cool, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.cool}>TDP당 성능(GFLOPS/W)</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={10} y={l.y - 13} width={420} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={20} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}
