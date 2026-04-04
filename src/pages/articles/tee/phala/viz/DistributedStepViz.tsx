import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '클러스터 — Cluster::add_worker(pubkey) → 장애 시 re-elect(backup)' },
  { label: 'Offchain Rollup — TEE 내 execute() → commit_state(hash) 온체인' },
  { label: 'SideVM — WasmEngine::instantiate(module) → async_io::spawn(task)' },
];
const mono = { fontFamily: 'monospace' };
const f = (d: number) => ({ initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });

export default function DistributedStepViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">Cluster: 워커 그룹 관리</text>
            {[
              { line: 'let cluster = Cluster::create(owner, workers: 3)', c: '#6366f1', y: 42 },
              { line: 'cluster.add_worker(worker_1_pubkey)', c: '#6366f1', y: 64 },
              { line: 'cluster.deploy_contract(code_hash, salt)', c: '#10b981', y: 86 },
              { line: '// 장애 감지 시:', c: '#f59e0b', y: 110 },
              { line: 'if !worker_1.heartbeat() {', c: '#ef4444', y: 130 },
              { line: '  cluster.re_elect(worker_2)  // 인계', c: '#f59e0b', y: 150 },
            ].map((l, i) => (
              <motion.g key={i} {...f(i * 0.08)}>
                <rect x={25} y={l.y - 13} width={470} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
                <text x={40} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 1 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">Offchain Rollup</text>
            {[
              { line: '// TEE Enclave 내부:', c: '#10b981', y: 42 },
              { line: 'let result = contract.execute(input)?;', c: '#10b981', y: 64 },
              { line: 'let state_hash = SHA-256(&new_state);', c: '#10b981', y: 86 },
              { line: '// 온체인 커밋 (가스 절감):', c: '#6366f1', y: 110 },
              { line: 'pallet::commit_state(contract_id, state_hash)', c: '#6366f1', y: 130 },
              { line: '// 전체 상태는 TEE에만 존재 → 비용 절감', c: '#f59e0b', y: 152 },
            ].map((l, i) => (
              <motion.g key={i} {...f(i * 0.08)}>
                <rect x={25} y={l.y - 13} width={470} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
                <text x={40} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 2 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">SideVM: 비동기 보조 서비스</text>
            {[
              { line: 'let engine = WasmEngine::new(config)', c: '#f59e0b', y: 42 },
              { line: 'let module = engine.compile(wasm_bytes)?', c: '#f59e0b', y: 64 },
              { line: 'let instance = engine.instantiate(&module)?', c: '#10b981', y: 86 },
              { line: '// 비동기 I/O 지원:', c: '#10b981', y: 110 },
              { line: 'async_io::spawn(instance.run())', c: '#6366f1', y: 130 },
              { line: '// 독립 수명주기: start/stop/restart', c: '#6366f1', y: 150 },
            ].map((l, i) => (
              <motion.g key={i} {...f(i * 0.08)}>
                <rect x={25} y={l.y - 13} width={470} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
                <text x={40} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
              </motion.g>
            ))}
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
