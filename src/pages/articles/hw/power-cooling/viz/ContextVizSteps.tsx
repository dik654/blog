import { motion } from 'framer-motion';
import { C } from './ContextVizData';
const f = (d: number) => ({ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace' };

export function StepWhy() {
  const lines = [
    { line: '// GPU 서버 전력 소비', c: C.gpu, y: 38 },
    { line: 'RTX 4090 × 4: 450W × 4 = 1,800W', c: C.gpu, y: 58 },
    { line: 'CPU + 시스템:           =   500W', c: C.hw, y: 78 },
    { line: '합계: 2,300W → 월 전기료 ~$200', c: C.err, y: 98 },
    { line: '// 전기료가 운영비의 60~70% 차지', c: C.err, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.err}>GPU 서버 전력 소비</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={15} y={l.y - 13} width={410} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={25} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepBlower() {
  const lines = [
    { line: '// 쿨링 방식 비교', c: C.cool, y: 38 },
    { line: 'A100 PCIe: 블로워 2슬롯, 전→후 배기, 250W TDP', c: C.cool, y: 58 },
    { line: 'H100 SXM:  히트싱크, 시스템 팬 의존, 700W TDP', c: C.cool, y: 78 },
    { line: 'RTX 4090:  오픈에어 3슬롯, 사방 확산, 450W TDP', c: C.err, y: 98 },
    { line: '// 서버 랙: 전→후 에어플로만 가능', c: C.err, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.cool}>쿨링 방식 호환성</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={10} y={l.y - 13} width={420} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={20} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}
