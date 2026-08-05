import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '1) 사용자 tx 제출 — ContractCall { contract_id, method, params }' },
  { label: '2) pRuntime이 chain sync 중 tx 수신 → dispatch_contract_call' },
  { label: '3) Encrypted envelope 복호화 — ecdh_key로 plain_input 추출' },
  { label: '4) Contract WASM 실행 → result 산출' },
  { label: '5) Egress 메시지 — on-chain commit / external API / inter-contract' },
  { label: '6) Gatekeeper가 egress 수집 + on-chain 제출 + PHA 보상' },
];

const TX_FIELDS = [
  { k: 'contract_id', v: '"0xabc..."', c: '#6366f1' },
  { k: 'method', v: '"fetch_api_data"', c: '#10b981' },
  { k: 'params', v: '...', c: '#f59e0b' },
];

const DECRYPT_BOXES = [
  { label: 'tx.envelope', sub: 'encrypted by client', c: '#ef4444', x: 30 },
  { label: 'self.ecdh_key', sub: 'X25519 비공개', c: '#10b981', x: 200 },
  { label: 'plain_input', sub: '평문 (TEE 안)', c: '#6366f1', x: 370 },
];

const EGRESS_KINDS = [
  { name: 'On-chain commit', sub: 'state root 업데이트', c: '#6366f1' },
  { name: 'External API', sub: '서명된 outbound', c: '#10b981' },
  { name: 'Inter-contract', sub: 'cross-contract 호출', c: '#f59e0b' },
];

const GK_TASKS = [
  { name: '서명 검증', sub: 'identity_key 일치 확인', c: '#6366f1' },
  { name: 'State root 업데이트', sub: 'on-chain commit', c: '#10b981' },
  { name: 'PHA 보상 지급', sub: 'gas + inflation share', c: '#f59e0b' },
];

export default function ContractExecModelViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">
              tx = ContractCall {`{...}`}
            </text>
            {TX_FIELDS.map((f, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}>
                <rect x={50} y={50 + i * 40} width={420} height={32} rx={5}
                  fill={`${f.c}10`} stroke={`${f.c}40`} strokeWidth={0.8} />
                <text x={70} y={70 + i * 40} fontSize={10.5} fontWeight={700} fill={f.c}
                  style={{ fontFamily: 'monospace' }}>{f.k}:</text>
                <text x={200} y={70 + i * 40} fontSize={10.5} fill="var(--foreground)"
                  style={{ fontFamily: 'monospace' }}>{f.v}</text>
              </motion.g>
            ))}
            <text x={260} y={185} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              submit_to_chain(tx) → Substrate 멤풀
            </text>
          </g>)}
          {step === 1 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
              dispatch_contract_call(tx)
            </text>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={40} y={60} w={130} h={56}
                label="chain sync" sub="block 적용 중" color="#6b7280" />
              <text x={195} y={92} fontSize={20} fill="var(--muted-foreground)">→</text>
              <ActionBox x={220} y={60} w={140} h={56}
                label="contracts.get(id)" sub="인스턴스 lookup" color="#10b981" />
              <text x={385} y={92} fontSize={20} fill="var(--muted-foreground)">→</text>
              <ModuleBox x={400} y={60} w={100} h={56}
                label="execute()" sub="WASM run" color="#f59e0b" />
            </motion.g>
            <text x={260} y={155} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              모든 cluster 워커가 같은 dispatch 실행 → deterministic 결과
            </text>
          </g>)}
          {step === 2 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">
              Encrypted envelope 복호화
            </text>
            {DECRYPT_BOXES.map((b, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}>
                <ModuleBox x={b.x} y={70} w={130} h={56}
                  label={b.label} sub={b.sub} color={b.c} />
              </motion.g>
            ))}
            <text x={165} y={102} fontSize={20} fill="var(--muted-foreground)">+</text>
            <text x={335} y={102} fontSize={20} fill="var(--muted-foreground)">→</text>
            <text x={260} y={170} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              평문은 enclave 내부에서만 존재 — Host OS는 envelope만 관측
            </text>
          </g>)}
          {step === 3 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
              Contract WASM 실행
            </text>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={40} y={60} w={130} h={56}
                label="WASM bytecode" sub="ink! compiled" color="#6366f1" />
              <text x={195} y={92} fontSize={20} fill="var(--muted-foreground)">→</text>
              <ActionBox x={220} y={60} w={140} h={56}
                label="wasmtime exec" sub="gas metering" color="#10b981" />
              <text x={385} y={92} fontSize={20} fill="var(--muted-foreground)">→</text>
              <DataBox x={395} y={75} w={110} h={32}
                label="result" sub="Vec<u8>" color="#f59e0b" outlined />
            </motion.g>
            <text x={260} y={155} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              결정성 + gas 한도 적용 + sandboxed 메모리
            </text>
          </g>)}
          {step === 4 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0ea5e9">
              egress_queue.push(Egress)
            </text>
            {EGRESS_KINDS.map((e, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.12 }}>
                <ModuleBox x={20 + i * 165} y={60} w={155} h={56}
                  label={e.name} sub={e.sub} color={e.c} />
              </motion.g>
            ))}
            <text x={260} y={150} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              모든 egress는 self.identity_key 서명 첨부 → 검증 가능
            </text>
          </g>)}
          {step === 5 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">
              Gatekeeper post-processing
            </text>
            {GK_TASKS.map((g, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12 }}>
                <ActionBox x={20 + i * 165} y={60} w={155} h={56}
                  label={g.name} sub={g.sub} color={g.c} />
              </motion.g>
            ))}
            <text x={260} y={150} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              Gatekeeper = 특권 워커 — master key 보유로 cluster 조정
            </text>
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
