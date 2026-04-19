import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'SideVM 정의 — Phat Contract 비동기 확장 (이벤트 구독, polling, WebSocket)' },
  { label: 'start_price_monitor — Phat 컨트랙트가 sidevm.wasm 시작 호출' },
  { label: 'WebSocket 루프 — Binance 스트림 구독, 트레이드별 임계값 체크' },
  { label: 'notify_contract — sidevm이 Phat 컨트랙트에 알림 콜백' },
  { label: '특성 — 독립 실행, 재시작 가능, 리소스 할당, cluster 워커 복제' },
];

const SIDEVM_FEATURES = [
  { name: '이벤트 구독', sub: 'blockchain emit, webhook' },
  { name: '지속적 polling', sub: 'API 주기 호출' },
  { name: 'WebSocket', sub: '연결 유지' },
];

const WS_STEPS = [
  { line: 'connect_ws("wss://...")', c: '#6366f1' },
  { line: 'loop { msg = ws.next_message() }', c: '#10b981' },
  { line: 'trade = serde_json::from_slice(msg)', c: '#f59e0b' },
  { line: 'if trade.price > 50000 → notify', c: '#ef4444' },
];

const NOTIFY_STEPS = [
  { label: 'sidevm::notify_contract', sub: 'cross-VM call' },
  { label: 'my_contract_id', sub: '대상 Phat ID' },
  { label: '"on_price_alert"', sub: '핸들러 method' },
  { label: 'price.to_be_bytes()', sub: '인자 직렬화' },
];

const PROPS = [
  { name: 'Independent', sub: 'Contract와 독립 실행', c: '#6366f1' },
  { name: 'Restartable', sub: 'state persistent', c: '#10b981' },
  { name: 'Quota', sub: 'CPU/memory 제약', c: '#f59e0b' },
  { name: 'Replicated', sub: 'cluster 워커 복제', c: '#0ea5e9' },
];

export default function SideVMViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">
              SideVM — Phat Contract의 비동기 확장
            </text>
            {SIDEVM_FEATURES.map((f, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15 }}>
                <ModuleBox x={20 + i * 165} y={70} w={155} h={56}
                  label={f.name} sub={f.sub} color="#6366f1" />
              </motion.g>
            ))}
            <text x={260} y={170} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              일반 Phat Contract는 호출 시에만 실행, SideVM은 항상 실행
            </text>
          </g>)}
          {step === 1 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
              Phat → SideVM 시작
            </text>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={40} y={70} w={130} h={56}
                label="Phat Contract" sub="start_price_monitor" color="#6366f1" />
              <text x={195} y={102} fontSize={20} fill="var(--muted-foreground)">→</text>
              <ActionBox x={220} y={70} w={140} h={56}
                label="pink::sidevm::start" sub="wasm_bytes 전달" color="#10b981" />
              <text x={385} y={102} fontSize={20} fill="var(--muted-foreground)">→</text>
              <ModuleBox x={400} y={70} w={100} h={56}
                label="SideVM" sub="실행 시작" color="#f59e0b" />
            </motion.g>
            <text x={260} y={160} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              include_bytes!로 sidevm.wasm을 컨트랙트 바이너리에 임베드
            </text>
          </g>)}
          {step === 2 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">
              #[sidevm::main] async fn main()
            </text>
            {WS_STEPS.map((s, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12 }}>
                <rect x={50} y={50 + i * 36} width={420} height={28} rx={4}
                  fill={`${s.c}10`} stroke={`${s.c}50`} strokeWidth={0.8} />
                <text x={70} y={68 + i * 36} fontSize={11} fontWeight={600} fill={s.c}
                  style={{ fontFamily: 'monospace' }}>{s.line}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 3 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0ea5e9">
              notify_contract(...) 인자
            </text>
            {NOTIFY_STEPS.map((n, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12 }}>
                <rect x={40} y={42 + i * 36} width={440} height={28} rx={4}
                  fill="#0ea5e910" stroke="#0ea5e950" strokeWidth={0.8} />
                <text x={60} y={60 + i * 36} fontSize={10.5} fontWeight={600} fill="#0ea5e9"
                  style={{ fontFamily: 'monospace' }}>{n.label}</text>
                <text x={310} y={60 + i * 36} fontSize={9} fill="var(--muted-foreground)">{n.sub}</text>
              </motion.g>
            ))}
            <text x={260} y={195} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              await로 호출 완료 보장 → 결정성 유지
            </text>
          </g>)}
          {step === 4 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">
              SideVM 핵심 특성
            </text>
            {PROPS.map((p, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}>
                <DataBox x={30 + (i % 2) * 235} y={50 + Math.floor(i / 2) * 60}
                  w={225} h={48} label={p.name} sub={p.sub} color={p.c} outlined />
              </motion.g>
            ))}
            <text x={260} y={195} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              사용 사례: Price oracle, Event indexer, AI agent context, WS bridge
            </text>
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
