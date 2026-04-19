import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const STEPS = [
  {
    label: 'Phase 1 — Candidate Gathering',
    body: 'Host candidates: 로컬 NIC의 모든 IP:Port (사설 + 공인 + IPv6).\nServer Reflexive: STUN으로 발견한 NAT 외부 주소.\nRelay candidates: TURN에서 할당받은 릴레이 주소.\nTrickle ICE는 모이는 즉시 점진적으로 교환 — 연결 시간 단축.',
  },
  {
    label: 'Phase 2 — Candidate Exchange',
    body: '시그널링 채널(SIP / WebSocket / Firebase / 자체)로 후보 리스트 교환.\n각 후보마다 priority 계산: type_pref << 24 | local_pref << 8 | component_id.\nHost > Server Reflexive > Relay 순으로 type_pref 결정.',
  },
  {
    label: 'Phase 3 — Connectivity Checks',
    body: '모든 (local, remote) pair에 대해 STUN Binding Request.\n양방향 모두 성공 → Valid Pair.\nordered list로 우선순위 높은 순부터 시도.\n네트워크 변경 시 ICE Restart로 재협상.',
  },
  {
    label: 'Phase 4 — Nomination & Active',
    body: 'Controlling agent가 최우선 valid pair를 선택.\nUSE-CANDIDATE flag로 확정 → Data flow 시작.\niroh MagicSock은 ICE 대신 자체 logic — 직접/DERP 중 RTT 낮은 경로 자동 선택.',
  },
];

const CAND_TYPES = [
  { name: 'Host', pref: 126, color: '#10b981', desc: '로컬 NIC' },
  { name: 'Srflx', pref: 100, color: '#f59e0b', desc: 'STUN 외부' },
  { name: 'Relay', pref: 0, color: '#ef4444', desc: 'TURN 릴레이' },
];

export default function ICEPhasesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={14} textAnchor="middle" fontSize={9}
                fontWeight={600} fill="#64748b">
                Phase 1 — 3종류 candidate 수집
              </text>
              <ModuleBox x={20} y={88} w={70} h={42} label="ICE Agent" color="#6366f1" />
              {CAND_TYPES.map((c, i) => (
                <motion.g key={c.name}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.1 }}>
                  <line x1={90} y1={109} x2={170} y2={50 + i * 50}
                    stroke={c.color} strokeWidth={0.9} strokeOpacity={0.5} />
                  <DataBox x={170} y={36 + i * 50} w={86} h={28} label={c.name}
                    sub={c.desc} color={c.color} outlined />
                  <DataBox x={270} y={36 + i * 50} w={70} h={28}
                    label={`pref=${c.pref}`} color={c.color} />
                  <DataBox x={350} y={36 + i * 50} w={110} h={28}
                    label={['192.168.1.10:5000', '203.0.113.5:40000', 'relay:55000'][i]}
                    color={c.color} />
                </motion.g>
              ))}
              <text x={20} y={195} fontSize={7.5} fill="#64748b">
                Trickle ICE: 모이는 즉시 점진 교환 → 첫 연결까지 1-10s → 100ms 단위 단축.
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={14} textAnchor="middle" fontSize={9}
                fontWeight={600} fill="#64748b">
                Phase 2 — 시그널링으로 candidate 교환
              </text>
              <ModuleBox x={20} y={88} w={75} h={42} label="Agent A"
                color="#6366f1" />
              <ModuleBox x={385} y={88} w={75} h={42} label="Agent B"
                color="#ec4899" />
              <ModuleBox x={205} y={30} w={70} h={32} label="Signaling"
                sub="SIP/WS" color="#f59e0b" />

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.05 }}>
                <line x1={95} y1={109} x2={205} y2={62}
                  stroke="#6366f1" strokeWidth={1.2} markerEnd="url(#ice-arr-b)" />
                <line x1={275} y1={62} x2={385} y2={109}
                  stroke="#6366f1" strokeWidth={1.2} strokeDasharray="3 2"
                  markerEnd="url(#ice-arr-b)" />
                <text x={140} y={86} fontSize={8} fontWeight={600} fill="#6366f1">A's list</text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.2 }}>
                <line x1={385} y1={120} x2={275} y2={64}
                  stroke="#ec4899" strokeWidth={1.2} markerEnd="url(#ice-arr-p)" />
                <line x1={205} y1={64} x2={95} y2={120}
                  stroke="#ec4899" strokeWidth={1.2} strokeDasharray="3 2"
                  markerEnd="url(#ice-arr-p)" />
                <text x={310} y={86} fontSize={8} fontWeight={600} fill="#ec4899">B's list</text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.35 }}>
                <ActionBox x={120} y={150} w={240} h={48}
                  label="priority = (type_pref << 24) | (local_pref << 8) | component_id"
                  sub="Host=126, Srflx=100, PeerRflx=110, Relay=0"
                  color="#10b981" />
              </motion.g>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={14} textAnchor="middle" fontSize={9}
                fontWeight={600} fill="#64748b">
                Phase 3 — 모든 pair에 STUN Binding 검사
              </text>
              {/* Pairs matrix */}
              <text x={120} y={42} fontSize={8} fontWeight={700} fill="#64748b">
                Local A
              </text>
              <text x={300} y={42} fontSize={8} fontWeight={700} fill="#64748b">
                Remote B
              </text>
              <text x={210} y={42} fontSize={8} fontWeight={700} fill="#64748b">
                Pair
              </text>

              {[
                { l: 'Host', r: 'Host', pri: 7286, status: 'fail', sub: '사설망 격리', color: '#ef4444' },
                { l: 'Srflx', r: 'Srflx', pri: 6710, status: 'ok', sub: 'Cone+Cone', color: '#10b981' },
                { l: 'Srflx', r: 'Relay', pri: 6286, status: 'ok', sub: 'fallback', color: '#3b82f6' },
                { l: 'Relay', r: 'Relay', pri: 0, status: 'ok', sub: '비싸지만 확실', color: '#f59e0b' },
              ].map((p, i) => (
                <motion.g key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.08 }}>
                  <DataBox x={20} y={52 + i * 36} w={80} h={26}
                    label={p.l} color={p.color} outlined />
                  <DataBox x={108} y={52 + i * 36} w={62} h={26}
                    label={`p=${p.pri}`} color={p.color} />
                  <DataBox x={180} y={52 + i * 36} w={80} h={26}
                    label={p.r} color={p.color} outlined />
                  <text x={272} y={70 + i * 36} fontSize={9}
                    fontFamily="monospace"
                    fill={p.status === 'ok' ? '#10b981' : '#ef4444'}>
                    {p.status === 'ok' ? '✓ Valid' : '✗ Failed'}
                  </text>
                  <text x={342} y={70 + i * 36} fontSize={8.5}
                    fill="#64748b">{p.sub}</text>
                </motion.g>
              ))}
              <text x={20} y={205} fontSize={7.5} fill="#64748b">
                양방향 STUN Binding 모두 성공해야 Valid. ICE Restart로 네트워크 변경 대응.
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={14} textAnchor="middle" fontSize={9}
                fontWeight={600} fill="#64748b">
                Phase 4 — Nomination & Active
              </text>

              {/* Controlling agent picks */}
              <ModuleBox x={20} y={32} w={140} h={36} label="Controlling Agent"
                sub="가장 높은 priority 선택" color="#6366f1" />

              <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.1 }}>
                <line x1={90} y1={68} x2={90} y2={94}
                  stroke="#6366f1" strokeWidth={1} markerEnd="url(#ice-arr-b)" />
                <ActionBox x={20} y={96} w={200} h={36}
                  label="Srflx ⇄ Srflx (p=6710)"
                  sub="USE-CANDIDATE flag" color="#10b981" />
              </motion.g>

              {/* Active state */}
              <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.25 }}>
                <StatusBox x={250} y={32} w={210} h={56}
                  label="Active — Data flowing" sub="DTLS-SRTP, DataChannel"
                  color="#10b981" progress={1} />
              </motion.g>

              {/* MagicSock comparison */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.4 }}>
                <ActionBox x={250} y={96} w={210} h={36}
                  label="iroh MagicSock"
                  sub="ICE 대신 자체 RTT 측정 → 자동 전환" color="#8b5cf6" />
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.55 }}>
                <DataBox x={20} y={150} w={140} h={28}
                  label="WebRTC 통합" sub="RTCPeerConnection"
                  color="#ec4899" outlined />
                <DataBox x={170} y={150} w={140} h={28}
                  label="Trickle ICE" sub="실시간 후보 추가"
                  color="#3b82f6" outlined />
                <DataBox x={320} y={150} w={140} h={28}
                  label="성공률 95~98%" sub="Multi-STUN + TURN"
                  color="#10b981" outlined />
              </motion.g>

              <text x={240} y={205} textAnchor="middle" fontSize={7.5} fill="#64748b">
                ICE 단점: 1-10s 연결 지연, 복잡한 state machine — Trickle로 완화.
              </text>
            </motion.g>
          )}

          <defs>
            <marker id="ice-arr-b" markerWidth={5} markerHeight={5} refX={4} refY={2.5} orient="auto">
              <polygon points="0 0, 5 2.5, 0 5" fill="#6366f1" />
            </marker>
            <marker id="ice-arr-p" markerWidth={5} markerHeight={5} refX={4} refY={2.5} orient="auto">
              <polygon points="0 0, 5 2.5, 0 5" fill="#ec4899" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
