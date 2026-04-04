import { motion } from 'framer-motion';
import { C } from './ContextVizData';

const f = (d: number) => ({ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace' };

export function StepCloud() {
  const lines = [
    { line: '// 호스트가 게스트 메모리를 읽는 경로', c: C.err, y: 38 },
    { line: 'fd = open("/dev/mem", O_RDONLY)', c: C.err, y: 58 },
    { line: 'ptr = mmap(NULL, 4096, PROT_READ, fd, phys_addr)', c: C.err, y: 78 },
    { line: 'memcpy(buf, ptr, 4096)  // 게스트 데이터 탈취', c: C.err, y: 98 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.err}>물리 메모리 직접 접근</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.12)}>
        <rect x={20} y={l.y - 13} width={380} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={30} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepThreat() {
  const lines = [
    { line: '// EPT 엔트리 조작 (하이퍼바이저)', c: C.err, y: 38 },
    { line: 'EPT[GPA_victim].HPA = attacker_page', c: C.err, y: 58 },
    { line: '// DMA 공격 (물리 장치)', c: C.err, y: 82 },
    { line: 'DMA_READ(phys_addr, len) → PCIe로 직접 DRAM 읽기', c: C.err, y: 102 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.err}>EPT 조작 + DMA 공격</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.12)}>
        <rect x={20} y={l.y - 13} width={400} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={30} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepTEE() {
  const lines = [
    { line: '// 메모리 컨트롤러 하드웨어 검사', c: C.ok, y: 38 },
    { line: 'if (req.KeyID != page.KeyID)', c: C.ok, y: 58 },
    { line: '  return AES_Decrypt(wrong_key, ciphertext)', c: C.err, y: 78 },
    { line: '  // → 의미 없는 쓰레기 데이터 반환', c: C.err, y: 98 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ok}>TEE: 메모리 컨트롤러 검증</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.12)}>
        <rect x={20} y={l.y - 13} width={380} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={30} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}
