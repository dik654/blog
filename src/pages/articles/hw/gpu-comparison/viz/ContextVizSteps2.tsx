import { motion } from 'framer-motion';
import { C } from './ContextVizData';

const f = (d: number) => ({ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace' };

export function StepMetrics() {
  const lines = [
    { line: '// 워크로드별 핵심 지표', c: C.ok, y: 38 },
    { line: 'MSM:  메모리 대역폭 (GB/s) — 4090: 1008, H100: 3352', c: C.consumer, y: 58 },
    { line: 'NTT:  CUDA 코어 수 (FP32) — 4090: 16384, H100: 16896', c: C.dc, y: 78 },
    { line: '봉인: TDP당 해시율 — 4090: 450W, A100: 400W, H100: 700W', c: C.hw, y: 98 },
    { line: '// 한 가지 스펙으로 판단 불가 → 워크로드 프로파일링 필수', c: C.err, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ok}>워크로드별 핵심 지표</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={10} y={l.y - 13} width={420} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={20} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepTrap() {
  const lines = [
    { line: '// 쿨링 방식 비교', c: C.err, y: 38 },
    { line: 'RTX 4090: 오픈에어 3슬롯 → 사방 확산 → 서버 부적합', c: C.err, y: 58 },
    { line: 'A100 PCIe: 블로워 2슬롯 → 전후 배기 → 서버 OK', c: C.dc, y: 78 },
    { line: 'H100 SXM: 히트싱크 + 시스템 팬 → DGX 전용', c: C.dc, y: 98 },
    { line: '// 서버 랙: 전→후 에어플로만 가능 (오픈에어 금지)', c: C.err, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.err}>서버 랙 쿨링 호환성</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={10} y={l.y - 13} width={420} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={20} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}
