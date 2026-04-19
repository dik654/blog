import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'NetworkBehaviour 4가지 책임' },
  { label: 'Connection lifecycle 4 hooks' },
  { label: 'State updates 2 hooks' },
  { label: 'Async polling — poll()' },
  { label: 'derive(NetworkBehaviour) 합성' },
  { label: 'Composition over Inheritance 철학' },
];

const HOOKS = [
  { name: 'handle_pending_inbound_connection', desc: '인바운드 거부 가능', color: '#10b981' },
  { name: 'handle_established_inbound_connection', desc: 'Handler 인스턴스 반환', color: '#6366f1' },
  { name: 'handle_pending_outbound_connection', desc: '추가 multiaddr Vec 반환', color: '#f59e0b' },
  { name: 'handle_established_outbound_connection', desc: 'Handler 인스턴스 반환', color: '#ec4899' },
];

const STATE_HOOKS = [
  { name: 'on_swarm_event(FromSwarm)', desc: '연결/주소 변경 알림', color: '#8b5cf6' },
  { name: 'on_connection_handler_event', desc: 'Handler → Behaviour 이벤트', color: '#06b6d4' },
];

export default function NetworkBehaviourTraitViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: 4 responsibilities */}
          {step === 0 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                trait NetworkBehaviour
              </text>
              {[
                { x: 30, y: 50, label: 'Connection lifecycle', sub: '4 callbacks', color: '#10b981' },
                { x: 250, y: 50, label: 'State updates', sub: '2 callbacks', color: '#6366f1' },
                { x: 30, y: 130, label: 'Async polling', sub: 'poll()', color: '#f59e0b' },
                { x: 250, y: 130, label: 'Type bindings', sub: 'ConnectionHandler + ToSwarm', color: '#ec4899' },
              ].map((r, i) => (
                <motion.g key={r.label} initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                  <ModuleBox x={r.x} y={r.y} w={200} h={60} label={r.label} sub={r.sub} color={r.color} />
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 1: lifecycle hooks */}
          {step === 1 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Connection lifecycle (4 hooks)
              </text>
              {HOOKS.map((h, i) => (
                <motion.g key={h.name} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <rect x={20} y={45 + i * 44} width={440} height={36} rx={5}
                    fill={h.color + '0a'} stroke={h.color + '50'} strokeWidth={0.7} />
                  <text x={36} y={62 + i * 44} fontSize={9.5} fontWeight={700} fill={h.color}>{h.name}</text>
                  <text x={36} y={75 + i * 44} fontSize={8.5} fill="var(--muted-foreground)">{h.desc}</text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 2: state hooks */}
          {step === 2 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                State updates (2 hooks)
              </text>
              {STATE_HOOKS.map((h, i) => (
                <motion.g key={h.name} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}>
                  <rect x={30} y={50 + i * 60} width={420} height={48} rx={6}
                    fill={h.color + '0a'} stroke={h.color + '60'} strokeWidth={0.8} />
                  <text x={50} y={73 + i * 60} fontSize={10.5} fontWeight={700} fill={h.color}>{h.name}</text>
                  <text x={50} y={88 + i * 60} fontSize={9} fill="var(--muted-foreground)">{h.desc}</text>
                </motion.g>
              ))}
              <text x={240} y={205} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                FromSwarm 열거형 = Behaviour 가 받는 모든 swarm 이벤트
              </text>
            </g>
          )}

          {/* Step 3: poll */}
          {step === 3 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                fn poll(cx) → Poll&lt;ToSwarm&gt;
              </text>
              <ActionBox x={30} y={50} w={140} h={50} label="poll(cx)" sub="비동기 polling" color="#f59e0b" />
              <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }}
                x1={170} y1={75} x2={210} y2={75} stroke="#94a3b8" strokeWidth={1.5} markerEnd="url(#nbr)" />

              {[
                { y: 50, label: 'GenerateEvent(T)', sub: '외부 이벤트', color: '#6366f1' },
                { y: 95, label: 'Dial(opts)', sub: '새 연결 시도', color: '#10b981' },
                { y: 140, label: 'NotifyHandler(p, ev)', sub: 'Handler에 메시지', color: '#ec4899' },
                { y: 185, label: 'CloseConnection(p)', sub: '연결 종료', color: '#ef4444' },
              ].map((v, i) => (
                <motion.g key={v.y} initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.08 }}>
                  <rect x={210} y={v.y} width={240} height={36} rx={4}
                    fill={v.color + '0a'} stroke={v.color + '50'} strokeWidth={0.7} />
                  <text x={226} y={v.y + 16} fontSize={9.5} fontWeight={700} fill={v.color}>{v.label}</text>
                  <text x={226} y={v.y + 30} fontSize={8.5} fill="var(--muted-foreground)">{v.sub}</text>
                </motion.g>
              ))}
              <defs>
                <marker id="nbr" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                  <polygon points="0 0,6 2.5,0 5" fill="#94a3b8" />
                </marker>
              </defs>
            </g>
          )}

          {/* Step 4: derive */}
          {step === 4 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                #[derive(NetworkBehaviour)] 자동 합성
              </text>
              <ModuleBox x={130} y={45} w={220} h={42} label="MyBehaviour" sub="derive 합성 struct" color="#ec4899" />
              {[
                { x: 40, label: 'kad', color: '#10b981' },
                { x: 150, label: 'gossip', color: '#6366f1' },
                { x: 260, label: 'identify', color: '#f59e0b' },
                { x: 370, label: 'ping', color: '#8b5cf6' },
              ].map((b, i) => (
                <motion.g key={b.label} initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
                  <line x1={240} y1={87} x2={b.x + 35} y2={120} stroke="#94a3b8" strokeWidth={0.8} />
                  <DataBox x={b.x} y={120} w={70} h={28} label={b.label} color={b.color} />
                </motion.g>
              ))}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                <rect x={50} y={170} width={380} height={50} rx={6}
                  fill="#ec48990a" stroke="#ec4899" strokeWidth={0.8} strokeDasharray="3 2" />
                <text x={240} y={188} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ec4899">
                  Auto-generated
                </text>
                <text x={240} y={204} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  enum MyBehaviourEvent · poll() · ConnectionHandler 합성
                </text>
              </motion.g>
            </g>
          )}

          {/* Step 5: philosophy */}
          {step === 5 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Composition over Inheritance
              </text>
              {[
                { label: '각 protocol 은 독립 module', color: '#10b981' },
                { label: '운영 시점에 조합 결정', color: '#6366f1' },
                { label: 'Type-safe event routing (enum)', color: '#ec4899' },
                { label: 'Async poll() = 논블로킹', color: '#f59e0b' },
                { label: 'Waker 기반 알림 — tokio/smol 호환', color: '#8b5cf6' },
              ].map((p, i) => (
                <motion.g key={p.label} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <rect x={30} y={50 + i * 36} width={420} height={28} rx={5}
                    fill={p.color + '0a'} stroke={p.color + '50'} strokeWidth={0.7} />
                  <text x={50} y={68 + i * 36} fontSize={10} fontWeight={600} fill={p.color}>{p.label}</text>
                </motion.g>
              ))}
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
