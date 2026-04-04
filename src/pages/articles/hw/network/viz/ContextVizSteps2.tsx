import { motion } from 'framer-motion';
import { C } from './ContextVizData';
const f = (d: number) => ({ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace' };

export function StepRDMA() {
  const lines = [
    { line: '// TCP vs RDMA 레이턴시 비교', c: C.rdma, y: 38 },
    { line: 'TCP:      커널 네트워크 스택 경유, ~50us', c: C.hw, y: 58 },
    { line: 'RoCE v2:  UDP/IP 위 RDMA, CPU 바이패스, ~1us', c: C.rdma, y: 78 },
    { line: 'IB NDR:   전용 스위치, 400Gbps, ~0.5us', c: C.ib, y: 98 },
    { line: '// RDMA: 레이턴시 50배 감소, GPU 직접 통신', c: C.ib, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.rdma}>RDMA: CPU 바이패스</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={10} y={l.y - 13} width={420} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={20} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepUseCase() {
  const lines = [
    { line: '// 워크로드별 네트워크 요구량', c: C.ok, y: 38 },
    { line: '블록체인 노드: ~100KB/block → 10G 충분', c: C.eth, y: 58 },
    { line: 'GPU 클러스터:  ~1GB/iter → InfiniBand 필수', c: C.ib, y: 78 },
    { line: 'NVLink:       900 GB/s (GPU 직결, 서버 내부)', c: C.ib, y: 98 },
    { line: '// 요구 대역폭 차이: 10,000배 이상', c: C.ib, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ib}>워크로드별 네트워크 요구</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={10} y={l.y - 13} width={420} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={20} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}
