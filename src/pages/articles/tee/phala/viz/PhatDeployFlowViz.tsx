import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, ModuleBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '1) cargo contract build — Ink! 코드를 .contract WASM으로 컴파일' },
  { label: '2) phat-contract-cli deploy — testnet/cluster에 배포 + suri 서명' },
  { label: '3) JS SDK Query — read-only 호출, gas 소비 없이 결과 조회' },
  { label: '3) JS SDK Tx — 상태 변경, signAndSend로 on-chain commit' },
];

const BUILD_OUTPUTS = [
  { name: '.contract', sub: 'metadata + WASM' },
  { name: '.wasm', sub: 'pure bytecode' },
  { name: 'metadata.json', sub: 'ABI 스펙' },
];

const DEPLOY_FIELDS = [
  { k: '--artifact', v: 'price_oracle.contract', c: '#6366f1' },
  { k: '--network', v: 'testnet', c: '#10b981' },
  { k: '--suri', v: '"seed phrase"', c: '#f59e0b' },
  { k: '--cluster', v: '0x0000...0001', c: '#0ea5e9' },
];

const QUERY_FIELDS = [
  { line: 'OnChainRegistry.create(api)', c: '#6366f1' },
  { line: 'new PinkContractPromise(...)', c: '#6366f1' },
  { line: 'contract.query.getBtcPrice(addr)', c: '#10b981' },
  { line: 'output.toHuman()  // free', c: '#10b981' },
];

const TX_FIELDS = [
  { line: 'contract.tx.updateApiKey(...)', c: '#f59e0b' },
  { line: '.signAndSend(signer)', c: '#f59e0b' },
  { line: 'gas: cluster 정책 따름', c: '#ef4444' },
  { line: 'state 변경 → on-chain commit', c: '#ef4444' },
];

export default function PhatDeployFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">
              cargo contract build --release
            </text>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={40} y={60} w={130} h={50}
                label="src/lib.rs" sub="Ink! Rust DSL" color="#6b7280" />
              <text x={195} y={90} fontSize={20} fill="var(--muted-foreground)">→</text>
              <ActionBox x={220} y={60} w={130} h={50}
                label="ink_codegen" sub="WASM 컴파일" color="#6366f1" />
              <text x={365} y={90} fontSize={20} fill="var(--muted-foreground)">→</text>
            </motion.g>
            {BUILD_OUTPUTS.map((o, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}>
                <DataBox x={395} y={20 + i * 60} w={110} h={32} label={o.name} sub={o.sub} color="#10b981" outlined />
              </motion.g>
            ))}
            <text x={260} y={170} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              .contract = WASM + ABI 메타데이터 통합 패키지
            </text>
          </g>)}
          {step === 1 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
              phat-contract-cli deploy
            </text>
            {DEPLOY_FIELDS.map((f, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}>
                <rect x={60} y={42 + i * 30} width={400} height={24} rx={4}
                  fill={`${f.c}10`} stroke={`${f.c}40`} strokeWidth={0.8} />
                <text x={75} y={59 + i * 30} fontSize={10} fontWeight={700} fill={f.c}
                  style={{ fontFamily: 'monospace' }}>{f.k}</text>
                <text x={200} y={59 + i * 30} fontSize={10} fill="var(--foreground)"
                  style={{ fontFamily: 'monospace' }}>{f.v}</text>
              </motion.g>
            ))}
            <text x={260} y={185} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              결과: Contract address + Cluster + Deployer 출력
            </text>
          </g>)}
          {step === 2 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
              Query — read-only (gas 없음)
            </text>
            {QUERY_FIELDS.map((q, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}>
                <rect x={50} y={42 + i * 30} width={420} height={24} rx={4}
                  fill={`${q.c}10`} stroke={`${q.c}40`} strokeWidth={0.8} />
                <text x={65} y={59 + i * 30} fontSize={10} fontWeight={600} fill={q.c}
                  style={{ fontFamily: 'monospace' }}>{q.line}</text>
              </motion.g>
            ))}
            <text x={260} y={185} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              TEE worker 직접 응답 — 블록체인 finality 없이 즉시 결과
            </text>
          </g>)}
          {step === 3 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">
              Tx — state 변경 (gas 소비)
            </text>
            {TX_FIELDS.map((q, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}>
                <rect x={50} y={42 + i * 30} width={420} height={24} rx={4}
                  fill={`${q.c}10`} stroke={`${q.c}40`} strokeWidth={0.8} />
                <text x={65} y={59 + i * 30} fontSize={10} fontWeight={600} fill={q.c}
                  style={{ fontFamily: 'monospace' }}>{q.line}</text>
              </motion.g>
            ))}
            <text x={260} y={185} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              Egress message → Gatekeeper가 on-chain commit
            </text>
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
