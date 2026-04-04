import { motion } from 'framer-motion';
import { C } from './ContextVizData';

const f = (d: number) => ({ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace' };

export function StepWhy() {
  const lines = [
    { line: 'ECREATE(SECS_page)', c: C.sgx, y: 38 },
    { line: '  SECS.base   = enclave_base_addr', c: C.sgx, y: 58 },
    { line: '  SECS.size   = enclave_size (power of 2)', c: C.sgx, y: 78 },
    { line: '  MRENCLAVE   = SHA-256_Init()', c: C.ok, y: 100 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.sgx}>ECREATE: Enclave 생성</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.12)}>
        <rect x={30} y={l.y - 13} width={360} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={40} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepEnclave() {
  const lines = [
    { line: 'EADD(EPC_page, src_page, SECINFO)', c: C.epc, y: 38 },
    { line: '  EPC[page] = copy(src_page)  // 암호화 복사', c: C.epc, y: 58 },
    { line: 'EEXTEND(EPC_page, offset)  // 256B 블록 단위', c: C.ok, y: 82 },
    { line: '  MRENCLAVE = SHA-256_Update(page_data[0:256])', c: C.ok, y: 102 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.epc}>EADD + EEXTEND: 페이지 로딩</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.12)}>
        <rect x={30} y={l.y - 13} width={370} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={40} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepMeasure() {
  const lines = [
    { line: 'EINIT(SIGSTRUCT, SECS, EINITTOKEN)', c: C.key, y: 38 },
    { line: '  verify RSA-3072(SIGSTRUCT.sig, modulus)', c: C.key, y: 58 },
    { line: '  MRENCLAVE = SHA-256_Final()  // 해시 확정', c: C.ok, y: 80 },
    { line: '  MRSIGNER  = SHA-256(SIGSTRUCT.modulus)', c: C.ok, y: 100 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.key}>EINIT: 측정값 확정</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.12)}>
        <rect x={30} y={l.y - 13} width={360} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={40} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepAttest() {
  const lines = [
    { line: 'EENTER(TCS_addr = 0x7000)', c: C.sgx, y: 38 },
    { line: '  RBP = TCS.ossa   // SSA 프레임 포인터', c: C.sgx, y: 58 },
    { line: '  CR_ENCLAVE_MODE = 1   // Enclave 모드 활성화', c: C.ok, y: 78 },
    { line: '  TLB.flush()      // 이전 매핑 무효화', c: C.err, y: 98 },
    { line: '  RIP = TCS.oentry // Enclave 진입점 점프', c: C.ok, y: 118 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.sgx}>EENTER: Enclave 진입</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={30} y={l.y - 13} width={370} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={40} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}
