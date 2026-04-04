import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'Blockchain Layer — Substrate 노드 + WASM Runtime + RPC 엔드포인트' },
  { label: 'TEE Compute — pRuntime(SGX Enclave) → Phactory → Pink Runtime' },
  { label: 'Bridge — Pherry: subscribe_blocks() → sync_to(pruntime)' },
  { label: 'Pallets — pallet_phala::register_worker(pubkey, sgx_quote)' },
];
const mono = { fontFamily: 'monospace' };
const f = (d: number) => ({ initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });

export default function OverviewStepViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">Blockchain Layer</text>
            {[
              { line: 'PhalaNode::new(config)  // Substrate 기반', c: '#6366f1', y: 42 },
              { line: '  runtime = WasmExecutor::new(phala_runtime)', c: '#6366f1', y: 64 },
              { line: '  rpc = start_rpc_server(port: 9933)', c: '#10b981', y: 86 },
              { line: '  network = libp2p::build(bootnodes)', c: '#10b981', y: 108 },
              { line: '  consensus = Aura + Grandpa 하이브리드', c: '#f59e0b', y: 130 },
            ].map((l, i) => (
              <motion.g key={i} {...f(i * 0.08)}>
                <rect x={30} y={l.y - 13} width={460} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
                <text x={45} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 1 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">TEE Compute Layer</text>
            {[
              { line: 'ECREATE(pruntime_enclave)  // SGX Enclave 생성', c: '#6366f1', y: 42 },
              { line: 'EINIT(SIGSTRUCT) → MRENCLAVE 확정', c: '#6366f1', y: 64 },
              { line: 'Phactory::new() {', c: '#10b981', y: 86 },
              { line: '  master_key = generate_sr25519_pair()', c: '#10b981', y: 108 },
              { line: '  pink_runtime = PinkRuntime::init()', c: '#10b981', y: 130 },
              { line: '}', c: '#10b981', y: 148 },
            ].map((l, i) => (
              <motion.g key={i} {...f(i * 0.08)}>
                <rect x={30} y={l.y - 13} width={460} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
                <text x={45} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 2 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">Bridge: Pherry 릴레이</text>
            {[
              { line: 'let blocks = node.subscribe_finalized_blocks()', c: '#6366f1', y: 42 },
              { line: 'for block in blocks {', c: '#6366f1', y: 64 },
              { line: '  let header = encode_header(&block)', c: '#10b981', y: 86 },
              { line: '  pruntime.sync_header(header).await?', c: '#10b981', y: 108 },
              { line: '  pruntime.dispatch_block(block.body).await?', c: '#f59e0b', y: 130 },
              { line: '}', c: '#f59e0b', y: 148 },
            ].map((l, i) => (
              <motion.g key={i} {...f(i * 0.08)}>
                <rect x={30} y={l.y - 13} width={460} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
                <text x={45} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 3 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">Phala Pallet: 워커 등록</text>
            {[
              { line: 'pallet_phala::register_worker {', c: '#6366f1', y: 42 },
              { line: '  pubkey: Sr25519Public,', c: '#6366f1', y: 64 },
              { line: '  ecdsa_pubkey: Vec<u8>,', c: '#10b981', y: 86 },
              { line: '  sgx_quote: Vec<u8>,  // IAS 검증 통과 필수', c: '#10b981', y: 108 },
              { line: '}', c: '#10b981', y: 126 },
              { line: '// 온체인에서 SGX Quote 검증 → 워커 인증', c: '#f59e0b', y: 148 },
            ].map((l, i) => (
              <motion.g key={i} {...f(i * 0.08)}>
                <rect x={30} y={l.y - 13} width={460} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
                <text x={45} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
              </motion.g>
            ))}
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
