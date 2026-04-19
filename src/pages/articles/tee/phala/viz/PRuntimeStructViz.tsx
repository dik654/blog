import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Identity Keys — Ed25519(워커 식별) + X25519(키 교환)' },
  { label: 'Attestation Provider — SGX DCAP 기반 quote 생성·검증' },
  { label: 'Contract Execution — contract_groups + chain_store' },
  { label: 'Communication — LightClient + GatekeeperClient' },
  { label: 'Scheduler — egress_queue + EventDispatcher' },
  { label: 'gRPC API — host proxy 외부 노출, 민감 데이터는 envelope 암호화' },
];

const FIELD_GROUPS: { color: string; title: string; fields: { name: string; type: string; note: string }[] }[] = [
  {
    color: '#6366f1',
    title: 'Identity keys',
    fields: [
      { name: 'identity_key', type: 'Ed25519Keypair', note: '워커 고유 ID (on-chain 등록)' },
      { name: 'ecdh_key', type: 'X25519Keypair', note: 'client ↔ worker envelope 암호화' },
    ],
  },
  {
    color: '#10b981',
    title: 'Attestation',
    fields: [
      { name: 'attestation_provider', type: 'AttestationProvider', note: 'SGX DCAP quote 생성기' },
    ],
  },
  {
    color: '#f59e0b',
    title: 'Contract Execution',
    fields: [
      { name: 'contract_groups', type: 'HashMap<ContractId, ContractGroup>', note: '배포된 Phat 인스턴스 모음' },
      { name: 'chain_store', type: 'ChainStore', note: 'Substrate 체인 동기화 상태' },
    ],
  },
  {
    color: '#0ea5e9',
    title: 'Communication',
    fields: [
      { name: 'light_client', type: 'LightClient', note: 'Relay chain 헤더 검증' },
      { name: 'gatekeeper_client', type: 'GatekeeperClient', note: 'Master key 협상' },
    ],
  },
  {
    color: '#ef4444',
    title: 'Scheduler',
    fields: [
      { name: 'egress_queue', type: 'Mutex<VecDeque<Message>>', note: 'on-chain 송신 대기 큐' },
      { name: 'event_dispatcher', type: 'EventDispatcher', note: '내부 이벤트 라우팅' },
    ],
  },
];

const GRPC_METHODS = [
  { name: 'GetInfo', sub: '워커 메타데이터' },
  { name: 'SyncHeader', sub: 'chain header 주입' },
  { name: 'DispatchBlocks', sub: 'block 적용' },
  { name: 'ContractQuery', sub: 'read-only call' },
  { name: 'GetEgressMessages', sub: 'on-chain 송신' },
  { name: 'SignEndpointInfo', sub: '엔드포인트 서명' },
];

export default function PRuntimeStructViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step < 5 && (() => {
            const g = FIELD_GROUPS[step];
            return (<g>
              <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill={g.color}>
                pub struct PRuntime — {g.title}
              </text>
              {g.fields.map((f, i) => (
                <motion.g key={i}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}>
                  <rect x={40} y={50 + i * 70} width={440} height={56} rx={6}
                    fill={`${g.color}10`} stroke={`${g.color}50`} strokeWidth={0.8} />
                  <rect x={40} y={50 + i * 70} width={4} height={56} fill={g.color} />
                  <text x={60} y={70 + i * 70} fontSize={11} fontWeight={700} fill={g.color}
                    style={{ fontFamily: 'monospace' }}>{f.name}</text>
                  <text x={60} y={86 + i * 70} fontSize={9.5} fill="var(--muted-foreground)"
                    style={{ fontFamily: 'monospace' }}>: {f.type}</text>
                  <text x={60} y={100 + i * 70} fontSize={9} fill="var(--foreground)" opacity={0.75}>{f.note}</text>
                </motion.g>
              ))}
            </g>);
          })()}
          {step === 5 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0ea5e9">
              service PhactoryAPI (gRPC)
            </text>
            {GRPC_METHODS.map((m, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}>
                <DataBox x={30 + (i % 3) * 165} y={50 + Math.floor(i / 3) * 60}
                  w={150} h={48} label={m.name} sub={m.sub} color="#0ea5e9" outlined />
              </motion.g>
            ))}
            <text x={260} y={195} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              gRPC는 enclave 외부 host proxy — 민감 페이로드는 envelope 암호화로 보호
            </text>
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
