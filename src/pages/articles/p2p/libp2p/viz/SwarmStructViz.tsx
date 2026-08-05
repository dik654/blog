import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Swarm 구조체 — 핵심 필드' },
  { label: 'poll_next_event() — pending events 우선' },
  { label: 'pending_event 재전송 시도' },
  { label: 'Behaviour → Pool → Transport 우선순위' },
  { label: 'SwarmEvent 타입 카탈로그' },
];

const FIELDS = [
  { name: 'transport', desc: 'Box<dyn Transport>', color: '#8b5cf6' },
  { name: 'behaviour', desc: 'TBehaviour (app logic)', color: '#6366f1' },
  { name: 'pool', desc: 'Pool<THandler>', color: '#10b981' },
  { name: 'listeners', desc: 'SmallVec<[Listener; 8]>', color: '#f59e0b' },
  { name: 'local_peer_id', desc: 'PeerId (self)', color: '#ec4899' },
  { name: 'pending_event', desc: 'Option<PendingEvent>', color: '#06b6d4' },
];

const EVENTS = [
  { name: 'Behaviour(T)', color: '#6366f1' },
  { name: 'ConnectionEstablished', color: '#10b981' },
  { name: 'ConnectionClosed', color: '#ef4444' },
  { name: 'IncomingConnection', color: '#f59e0b' },
  { name: 'OutgoingConnectionError', color: '#ec4899' },
  { name: 'NewListenAddr', color: '#06b6d4' },
  { name: 'Dialing', color: '#8b5cf6' },
];

export default function SwarmStructViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: struct fields */}
          {step === 0 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                pub struct Swarm&lt;TBehaviour&gt;
              </text>
              {FIELDS.map((f, i) => (
                <motion.g key={f.name} initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                  <rect x={40 + (i % 2) * 210} y={45 + Math.floor(i / 2) * 50}
                    width={200} height={40} rx={6}
                    fill={f.color + '0a'} stroke={f.color + '60'} strokeWidth={0.7} />
                  <text x={56 + (i % 2) * 210} y={62 + Math.floor(i / 2) * 50}
                    fontSize={10} fontWeight={700} fill={f.color}>{f.name}</text>
                  <text x={56 + (i % 2) * 210} y={76 + Math.floor(i / 2) * 50}
                    fontSize={8.5} fill="var(--muted-foreground)">{f.desc}</text>
                </motion.g>
              ))}
              <text x={240} y={222} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Transport · Pool · Behaviour 를 단일 이벤트 루프로 통합
              </text>
            </g>
          )}

          {/* Step 1: pending events first */}
          {step === 1 && (
            <g>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                loop 시작: pending_swarm_events 비우기
              </text>
              <DataBox x={150} y={50} w={180} h={42} label="VecDeque" sub="pending_swarm_events" color="#06b6d4" outlined />

              {[
                { y: 110, label: 'pop_front()' },
                { y: 145, label: 'Some(ev) → return Poll::Ready(ev)' },
                { y: 180, label: 'None → 다음 단계로 진행' },
              ].map((s, i) => (
                <motion.g key={s.y} initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.15 }}>
                  <rect x={50} y={s.y} width={380} height={26} rx={4}
                    fill="#06b6d40a" stroke="#06b6d450" strokeWidth={0.7} />
                  <text x={70} y={s.y + 16} fontSize={10} fontWeight={600} fill="#06b6d4">{s.label}</text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 2: pending_event redispatch */}
          {step === 2 && (
            <g>
              <DataBox x={30} y={40} w={140} h={40} label="pending_event" sub="(peer, handler, ev)" color="#f59e0b" />
              <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }}
                x1={170} y1={60} x2={210} y2={60} stroke="#94a3b8" strokeWidth={1.5} markerEnd="url(#sa1)" />
              <ActionBox x={210} y={40} w={140} h={40} label="pool.send_to" sub="재전송 시도" color="#10b981" />

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <line x1={280} y1={80} x2={150} y2={120} stroke="#10b981" strokeWidth={1.2} />
                <rect x={30} y={120} width={170} height={36} rx={5}
                  fill="#10b9810a" stroke="#10b981" strokeWidth={0.7} />
                <text x={115} y={135} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981">Ok</text>
                <text x={115} y={148} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">behaviour 폴링 재개</text>
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                <line x1={280} y1={80} x2={350} y2={120} stroke="#ef4444" strokeWidth={1.2} />
                <rect x={280} y={120} width={170} height={36} rx={5}
                  fill="#ef44440a" stroke="#ef4444" strokeWidth={0.7} />
                <text x={365} y={135} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ef4444">Err</text>
                <text x={365} y={148} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">re-store, behaviour 폴링 중지</text>
              </motion.g>
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                continue_behaviour_poll = false 가 핵심 가드 — handler 처리 우선
              </text>
              <defs>
                <marker id="sa1" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                  <polygon points="0 0,6 2.5,0 5" fill="#94a3b8" />
                </marker>
              </defs>
            </g>
          )}

          {/* Step 3: priority loop */}
          {step === 3 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                폴링 우선순위 (highest → lowest)
              </text>
              {[
                { y: 50, label: '1. behaviour.poll(cx)', desc: '로컬 작업 우선', color: '#6366f1' },
                { y: 110, label: '2. pool.poll(cx)', desc: '기존 연결 유지', color: '#10b981' },
                { y: 170, label: '3. transport.poll(cx)', desc: '새 연결은 마지막', color: '#8b5cf6' },
              ].map((s, i) => (
                <motion.g key={s.y} initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.18 }}>
                  <rect x={50} y={s.y} width={380} height={48} rx={6}
                    fill={s.color + '0a'} stroke={s.color + '50'} strokeWidth={0.8} />
                  <text x={70} y={s.y + 22} fontSize={11} fontWeight={700} fill={s.color}>{s.label}</text>
                  <text x={70} y={s.y + 38} fontSize={9} fill="var(--muted-foreground)">{s.desc}</text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 4: SwarmEvent enum */}
          {step === 4 && (
            <g>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                enum SwarmEvent
              </text>
              {EVENTS.map((e, i) => (
                <motion.g key={e.name} initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}>
                  <rect x={30 + (i % 2) * 220} y={45 + Math.floor(i / 2) * 38}
                    width={210} height={28} rx={4}
                    fill={e.color + '0a'} stroke={e.color + '60'} strokeWidth={0.7} />
                  <text x={40 + (i % 2) * 220} y={63 + Math.floor(i / 2) * 38}
                    fontSize={9.5} fontWeight={600} fill={e.color}>{e.name}</text>
                </motion.g>
              ))}
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
