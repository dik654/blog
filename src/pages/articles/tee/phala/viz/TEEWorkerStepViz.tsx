import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'pRuntime — ECREATE → EINIT → EENTER → RA Quote 생성' },
  { label: 'Phactory — sync_header() → dispatch() → execute_contract()' },
  { label: '4계층 보안 — HW(EPC 암호화) → SW(WASM) → Protocol(온체인) → Crypto(E2E)' },
];
const mono = { fontFamily: 'monospace' };
const f = (d: number) => ({ initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });

export default function TEEWorkerStepViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">pRuntime: SGX Enclave 초기화</text>
            {[
              { line: 'ECREATE(pruntime_secs)  // EPC 할당', c: '#6366f1', y: 42 },
              { line: 'EINIT(SIGSTRUCT)  // MRENCLAVE 확정', c: '#6366f1', y: 64 },
              { line: 'EENTER(TCS)  // Enclave 진입', c: '#10b981', y: 86 },
              { line: 'let RA_report = EREPORT(QE_target, ecdsa_pub)', c: '#10b981', y: 108 },
              { line: 'let quote = QE.sign(RA_report)  // IAS 검증용', c: '#f59e0b', y: 130 },
              { line: '// 상태: AES-256-GCM으로 EPC 내 암호화 저장', c: '#f59e0b', y: 152 },
            ].map((l, i) => (
              <motion.g key={i} {...f(i * 0.08)}>
                <rect x={20} y={l.y - 13} width={480} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
                <text x={35} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 1 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">Phactory: 블록 동기화 + 실행</text>
            {[
              { line: 'fn sync_header(header: EncodedHeader) {', c: '#6366f1', y: 42 },
              { line: '  light_client.verify(header)?;', c: '#6366f1', y: 64 },
              { line: '}', c: '#6366f1', y: 82 },
              { line: 'fn dispatch_block(body: BlockBody) {', c: '#10b981', y: 104 },
              { line: '  for tx in body.extrinsics {', c: '#10b981', y: 124 },
              { line: '    pink_runtime.execute(tx)?;  // WASM VM 실행', c: '#f59e0b', y: 144 },
            ].map((l, i) => (
              <motion.g key={i} {...f(i * 0.08)}>
                <rect x={20} y={l.y - 13} width={480} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
                <text x={35} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 2 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">4계층 보안 모델</text>
            {[
              { line: 'L1 HW:  EPC 메모리 암호화 (AES-128-XTS)', c: '#6366f1', y: 42 },
              { line: 'L2 SW:  WASM 샌드박스 (wasmtime::Instance)', c: '#6366f1', y: 66 },
              { line: 'L3 Protocol: 온체인 Quote 검증', c: '#10b981', y: 90 },
              { line: '  pallet::verify_quote(quote, IAS_root_cert)', c: '#10b981', y: 112 },
              { line: 'L4 Crypto: E2E 암호화 (ECDH + AES-256-GCM)', c: '#f59e0b', y: 136 },
              { line: '  shared = ECDH(worker_sk, user_pk)', c: '#f59e0b', y: 156 },
            ].map((l, i) => (
              <motion.g key={i} {...f(i * 0.08)}>
                <rect x={20} y={l.y - 13} width={480} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
                <text x={35} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
              </motion.g>
            ))}
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
