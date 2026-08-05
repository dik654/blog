import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const STEPS = [
  {
    label: 'Phase 1 — 외부 주소 발견',
    body: 'A, B 각자 STUN 서버에 Binding Request.\nA_ext = 203.0.113.5:40000, B_ext = 198.51.100.10:50000.\n각 NAT는 STUN 서버용 매핑만 보유 — 아직 서로의 매핑 없음.',
  },
  {
    label: 'Phase 2 — 시그널링으로 주소 교환',
    body: '랑데부 서버 (또는 시그널링 채널) 통해 외부 주소 교환.\nA → Server: "I am A_ext, want B".\nServer → A: B_ext / Server → B: A_ext.\n동시 전송 시각도 합의 (timestamp) — 정밀 동기화가 성공률 좌우.',
  },
  {
    label: 'Phase 3 — 동시 hole punching',
    body: 'A → B_ext: A의 NAT는 B_ext 매핑 생성. B의 NAT는 매핑 없어 drop.\nB → A_ext: B의 NAT는 A_ext 매핑 생성. A의 NAT는 직전 매핑이 있어 PASS.\nB가 A의 패킷 수신 → 응답 → 양방향 매핑 완성.',
  },
  {
    label: 'Phase 4 — 직접 연결 + Keep-alive',
    body: '양방향 NAT 매핑이 모두 살아있는 상태 — 릴레이 없이 직접 P2P.\nNAT 매핑 timeout (30~60s) 전 keep-alive 패킷 주기 전송 필수.\nlibp2p DCUtR: 릴레이 거쳐 시그널링 후 직접 연결로 업그레이드.',
  },
  {
    label: '실패 모드 — Symmetric / 방화벽 / 타이밍',
    body: 'Symmetric NAT: 목적지마다 다른 매핑 → A_ext가 B 시점에서 무효.\nStrict firewall: 모든 inbound drop — 홀 펀칭 자체 실패.\nTiming off: 한쪽이 너무 일찍/늦으면 매핑 만료 또는 drop.\n→ TURN/DERP 폴백 필수.',
  },
];

export default function HolePunchPhasesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Common topology base */}
          {step < 4 && (
            <>
              <ModuleBox x={10} y={90} w={68} h={42} label="Peer A" sub="10.0.0.5:5000" color="#6366f1" />
              <ModuleBox x={95} y={90} w={68} h={42} label="NAT A" sub=":40000" color="#64748b" />
              <ModuleBox x={317} y={90} w={68} h={42} label="NAT B" sub=":50000" color="#64748b" />
              <ModuleBox x={402} y={90} w={68} h={42} label="Peer B" sub="192.168.1.10" color="#ec4899" />
            </>
          )}

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={14} textAnchor="middle" fontSize={9}
                fontWeight={600} fill="#64748b">
                Phase 1 — STUN으로 외부 주소 발견
              </text>
              <ModuleBox x={210} y={20} w={60} h={32} label="STUN" color="#10b981" />
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.05 }}>
                <line x1={163} y1={111} x2={210} y2={50}
                  stroke="#10b981" strokeWidth={1} markerEnd="url(#hp-arr-g)" />
                <DataBox x={170} y={62} w={60} h={20} label="A_ext"
                  sub="40000" color="#6366f1" outlined />
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.18 }}>
                <line x1={317} y1={111} x2={270} y2={50}
                  stroke="#10b981" strokeWidth={1} markerEnd="url(#hp-arr-g)" />
                <DataBox x={250} y={62} w={60} h={20} label="B_ext"
                  sub="50000" color="#ec4899" outlined />
              </motion.g>
              <text x={240} y={195} textAnchor="middle" fontSize={7.5} fill="#64748b">
                각 NAT가 STUN 서버에 대해서만 매핑 생성 — 서로의 매핑은 아직 없음.
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={14} textAnchor="middle" fontSize={9}
                fontWeight={600} fill="#64748b">
                Phase 2 — 랑데부 서버로 외부 주소 교환
              </text>
              <ModuleBox x={205} y={20} w={70} h={32} label="Rendezvous"
                sub="signaling" color="#f59e0b" />
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.05 }}>
                <line x1={163} y1={111} x2={205} y2={50}
                  stroke="#f59e0b" strokeWidth={1} markerEnd="url(#hp-arr-y)" />
                <DataBox x={170} y={60} w={50} h={18} label="A_ext"
                  color="#6366f1" />
                <line x1={317} y1={111} x2={275} y2={50}
                  stroke="#f59e0b" strokeWidth={1} markerEnd="url(#hp-arr-y)" />
                <DataBox x={258} y={60} w={50} h={18} label="B_ext"
                  color="#ec4899" />
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.25 }}>
                <line x1={205} y1={52} x2={163} y2={91}
                  stroke="#10b981" strokeWidth={1} strokeDasharray="3 2"
                  markerEnd="url(#hp-arr-g)" />
                <line x1={275} y1={52} x2={317} y2={91}
                  stroke="#10b981" strokeWidth={1} strokeDasharray="3 2"
                  markerEnd="url(#hp-arr-g)" />
                <text x={130} y={82} fontSize={7.5} fontWeight={600}
                  fill="#10b981">→ B_ext</text>
                <text x={325} y={82} fontSize={7.5} fontWeight={600}
                  fill="#10b981">→ A_ext</text>
              </motion.g>
              <text x={240} y={195} textAnchor="middle" fontSize={7.5} fill="#64748b">
                동시 전송 시각도 합의 — 시간 동기화 ±500ms가 성공의 핵심.
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={14} textAnchor="middle" fontSize={9}
                fontWeight={600} fill="#64748b">
                Phase 3 — 동시 punch
              </text>
              {/* A → B_ext (drops at NAT B) */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.05 }}>
                <line x1={78} y1={102} x2={317} y2={102}
                  stroke="#6366f1" strokeWidth={1.4} />
                <text x={170} y={66} fontSize={8} fontWeight={600}
                  fill="#6366f1">① A → B_ext</text>
                <text x={170} y={78} fontSize={7} fill="#6366f1">
                  매핑 생성 (A_NAT)
                </text>
                <DataBox x={350} y={48} w={70} h={20} label="DROP"
                  color="#ef4444" outlined />
                <line x1={365} y1={68} x2={355} y2={95}
                  stroke="#ef4444" strokeWidth={1} strokeDasharray="2 2" />
              </motion.g>
              {/* B → A_ext (passes!) */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.25 }}>
                <line x1={402} y1={120} x2={163} y2={120}
                  stroke="#ec4899" strokeWidth={1.4} />
                <text x={250} y={144} fontSize={8} fontWeight={600}
                  fill="#ec4899">② B → A_ext</text>
                <text x={250} y={156} fontSize={7} fill="#ec4899">
                  A_NAT 매핑 일치 → PASS
                </text>
                <DataBox x={60} y={142} w={70} h={20} label="PASS"
                  color="#10b981" outlined />
              </motion.g>
              {/* Confirm direct */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.45 }}>
                <DataBox x={170} y={175} w={140} h={24}
                  label="③ B → A 응답 시작" color="#10b981" outlined />
              </motion.g>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={14} textAnchor="middle" fontSize={9}
                fontWeight={600} fill="#64748b">
                Phase 4 — 양방향 직접 연결 (릴레이 우회)
              </text>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.05 }}>
                <line x1={78} y1={104} x2={402} y2={104}
                  stroke="#10b981" strokeWidth={1.6} markerEnd="url(#hp-arr-g)" />
                <line x1={402} y1={118} x2={78} y2={118}
                  stroke="#10b981" strokeWidth={1.6} markerEnd="url(#hp-arr-g)" />
                <DataBox x={185} y={50} w={110} h={26}
                  label="Direct UDP" color="#10b981" outlined />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.25 }}>
                <DataBox x={20} y={170} w={130} h={28}
                  label="Keep-alive ping" sub="30~60s" color="#f59e0b" outlined />
                <DataBox x={170} y={170} w={140} h={28}
                  label="libp2p DCUtR" sub="릴레이→직접 업그레이드"
                  color="#8b5cf6" outlined />
                <DataBox x={330} y={170} w={130} h={28}
                  label="QUIC migration" sub="네트워크 변경 대응"
                  color="#3b82f6" outlined />
              </motion.g>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={14} textAnchor="middle" fontSize={9}
                fontWeight={600} fill="#64748b">
                실패 모드 — TURN/DERP 폴백이 필요한 이유
              </text>
              {[
                {
                  label: 'Symmetric NAT',
                  sub: '목적지별 다른 매핑 — A_ext가 B 시점에서 무효',
                  color: '#ef4444',
                  y: 32,
                },
                {
                  label: 'Strict firewall',
                  sub: '모든 inbound drop — 홀 펀칭 자체 차단',
                  color: '#f59e0b',
                  y: 76,
                },
                {
                  label: 'Timing off',
                  sub: '한쪽이 너무 일찍/늦으면 매핑 만료 / packet loss',
                  color: '#8b5cf6',
                  y: 120,
                },
                {
                  label: 'NAT timeout',
                  sub: 'keep-alive 누락 시 30~60s 후 매핑 사라짐',
                  color: '#64748b',
                  y: 164,
                },
              ].map((f, i) => (
                <motion.g key={f.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.08 }}>
                  <AlertBox x={20} y={f.y} w={440} h={36}
                    label={f.label} sub={f.sub} color={f.color} />
                </motion.g>
              ))}
            </motion.g>
          )}

          <defs>
            <marker id="hp-arr-g" markerWidth={5} markerHeight={5} refX={4} refY={2.5} orient="auto">
              <polygon points="0 0, 5 2.5, 0 5" fill="#10b981" />
            </marker>
            <marker id="hp-arr-y" markerWidth={5} markerHeight={5} refX={4} refY={2.5} orient="auto">
              <polygon points="0 0, 5 2.5, 0 5" fill="#f59e0b" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
