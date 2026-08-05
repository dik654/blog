import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Swarm 4가지 역할' },
  { label: '주요 상태 — Listeners, Connections, Pending dials' },
  { label: 'poll() 메인 루프' },
  { label: 'NetworkBehaviour 7개 콜백' },
  { label: 'derive(NetworkBehaviour) 합성' },
  { label: 'SwarmBuilder 사용 패턴' },
];

const ROLES = [
  { name: 'Connection 관리', sub: 'Transport에서 conn 받음', color: '#8b5cf6' },
  { name: 'Behaviour 이벤트', sub: 'NetworkBehaviour 처리', color: '#6366f1' },
  { name: 'Handler 스케줄링', sub: 'ConnectionHandler', color: '#10b981' },
  { name: '프로토콜 멀티플렉싱', sub: 'substream 협상', color: '#f59e0b' },
];

const CALLBACKS = [
  'handle_pending_inbound',
  'handle_established_inbound',
  'handle_pending_outbound',
  'handle_established_outbound',
  'on_swarm_event',
  'on_connection_handler_event',
  'poll',
];

export default function SwarmEventLoopDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: 4 roles */}
          {step === 0 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Swarm = 중앙 이벤트 루프
              </text>
              {ROLES.map((r, i) => (
                <motion.g key={r.name} initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                  <ModuleBox x={30 + (i % 2) * 230} y={45 + Math.floor(i / 2) * 80}
                    w={210} h={64} label={r.name} sub={r.sub} color={r.color} />
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 1: state */}
          {step === 1 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                주요 상태
              </text>
              {[
                { name: 'Listeners', desc: '수신 대기 multiaddr 집합', color: '#10b981' },
                { name: 'Connections', desc: '활성 peer 연결 (peer_id → conn)', color: '#6366f1' },
                { name: 'Pending dials', desc: '진행 중 dial 요청', color: '#f59e0b' },
                { name: 'Behaviours', desc: '등록된 프로토콜 모음', color: '#ec4899' },
              ].map((s, i) => (
                <motion.g key={s.name} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <rect x={40} y={45 + i * 44} width={400} height={36} rx={5}
                    fill={s.color + '0a'} stroke={s.color + '60'} strokeWidth={0.7} />
                  <text x={56} y={68 + i * 44} fontSize={10.5} fontWeight={700} fill={s.color}>{s.name}</text>
                  <text x={170} y={68 + i * 44} fontSize={9} fill="var(--muted-foreground)">{s.desc}</text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 2: poll loop */}
          {step === 2 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                async poll() 의사코드
              </text>
              {[
                { y: 50, label: '1. behaviour.poll(cx)', desc: '→ Ready: handle_event', color: '#6366f1' },
                { y: 95, label: '2. connections.poll_next(cx)', desc: '→ Ready(Some): handle, None: break', color: '#10b981' },
                { y: 140, label: '3. process_pending_dials(cx)', desc: 'pending 중인 dial 진행', color: '#f59e0b' },
                { y: 185, label: '→ Pending', desc: '모두 Pending 시 반환', color: '#94a3b8' },
              ].map((s, i) => (
                <motion.g key={s.y} initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
                  <rect x={40} y={s.y} width={400} height={36} rx={5}
                    fill={s.color + '0a'} stroke={s.color + '50'} strokeWidth={0.7} />
                  <text x={56} y={s.y + 16} fontSize={10} fontWeight={700} fill={s.color}>{s.label}</text>
                  <text x={56} y={s.y + 30} fontSize={8.5} fill="var(--muted-foreground)">{s.desc}</text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 3: 7 callbacks */}
          {step === 3 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                NetworkBehaviour 7 callbacks
              </text>
              {CALLBACKS.map((c, i) => (
                <motion.g key={c} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                  <rect x={50} y={42 + i * 26} width={380} height={20} rx={3}
                    fill="#6366f10a" stroke="#6366f140" strokeWidth={0.6} />
                  <text x={70} y={56 + i * 26} fontSize={9.5} fontWeight={600} fill="#6366f1"
                    style={{ fontFamily: 'monospace' }}>{c}()</text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 4: derive macro */}
          {step === 4 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                #[derive(NetworkBehaviour)]
              </text>
              <ModuleBox x={170} y={40} w={140} h={42} label="MyBehaviour" sub="합성 struct" color="#ec4899" />

              {[
                { x: 30, label: 'kad', sub: 'Kademlia', color: '#10b981' },
                { x: 130, label: 'gossip', sub: 'GossipSub', color: '#6366f1' },
                { x: 230, label: 'identify', sub: 'Identify', color: '#f59e0b' },
                { x: 330, label: 'ping', sub: 'Ping', color: '#ec4899' },
              ].map((b, i) => (
                <motion.g key={b.label} initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
                  <line x1={240} y1={82} x2={b.x + 50} y2={120}
                    stroke="#94a3b8" strokeWidth={0.8} />
                  <rect x={b.x} y={120} width={100} height={40} rx={5}
                    fill={b.color + '0a'} stroke={b.color + '60'} strokeWidth={0.7} />
                  <text x={b.x + 50} y={138} textAnchor="middle" fontSize={10}
                    fontWeight={700} fill={b.color}>{b.label}</text>
                  <text x={b.x + 50} y={152} textAnchor="middle" fontSize={8}
                    fill="var(--muted-foreground)">{b.sub}</text>
                </motion.g>
              ))}
              <text x={240} y={188} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Macro 가 enum MyBehaviourEvent + poll 자동 생성
              </text>
              <text x={240} y={206} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                ConnectionHandler 도 자동 합성
              </text>
            </g>
          )}

          {/* Step 5: SwarmBuilder pattern */}
          {step === 5 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                SwarmBuilder 사용 패턴
              </text>
              {[
                { y: 45, label: 'SwarmBuilder::with_tokio_executor()', color: '#6366f1' },
                { y: 78, label: '.with_tcp(...)', color: '#8b5cf6' },
                { y: 111, label: '.with_behaviour(|key| MyBehaviour::new(key))', color: '#10b981' },
                { y: 144, label: '.build()', color: '#f59e0b' },
                { y: 188, label: 'loop { swarm.select_next_some().await ⇒ handle }', color: '#ec4899' },
              ].map((s, i) => (
                <motion.g key={s.y} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
                  <rect x={30} y={s.y} width={420} height={26} rx={4}
                    fill={s.color + '0a'} stroke={s.color + '60'} strokeWidth={0.7} />
                  <text x={50} y={s.y + 17} fontSize={10} fontWeight={600} fill={s.color}
                    style={{ fontFamily: 'monospace' }}>{s.label}</text>
                </motion.g>
              ))}
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
