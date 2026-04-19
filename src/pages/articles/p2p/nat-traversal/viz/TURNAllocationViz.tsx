import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const STEPS = [
  {
    label: 'Allocate — 릴레이 주소 획득',
    body: '클라이언트가 TURN에 Allocate Request 전송 (USERNAME + MESSAGE-INTEGRITY).\nTURN 서버가 RELAYED-ADDRESS 할당 (예: relay.example.com:55000).\nLIFETIME 기본 600초 — 만료 전 Refresh 필요.',
  },
  {
    label: 'CreatePermission — 피어 허용',
    body: '클라이언트가 통신할 피어 IP를 XOR-PEER-ADDRESS로 지정.\nTURN이 권한 목록에 추가 — 허용된 IP 외에는 패킷 차단.\n방화벽으로 동작 — 무차별 릴레이 남용 방지.',
  },
  {
    label: '데이터 송수신 — Send/Data Indication 모드',
    body: '클라이언트가 Send Indication에 XOR-PEER-ADDRESS + DATA 포장.\nTURN이 헤더를 벗기고 피어로 전달.\n피어 응답은 Data Indication에 감싸 클라이언트로.\n패킷당 32 byte 오버헤드.',
  },
  {
    label: 'Channel 모드 — 4 byte 오버헤드',
    body: 'ChannelBind로 channel-number와 peer를 매핑 (0x4000~0x7FFF).\n이후 ChannelData = 4 byte 헤더 + payload.\n실시간 미디어에 유리 — 고빈도 전송 시 대역폭 절약.\nDERP는 더 단순 (HTTPS WebSocket, 5-tuple 무관).',
  },
];

export default function TURNAllocationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Common: Client + TURN + Peer */}
          <ModuleBox x={20} y={90} w={75} h={42} label="Client" sub="behind NAT" color="#6366f1" />
          <ModuleBox x={200} y={90} w={80} h={42} label="TURN" sub="server" color="#f59e0b" />
          <ModuleBox x={385} y={90} w={75} h={42} label="Peer B" color="#ec4899" />

          {/* Connecting lines (always visible base) */}
          <line x1={95} y1={111} x2={200} y2={111} stroke="#64748b" strokeWidth={0.6} strokeOpacity={0.3} />
          <line x1={280} y1={111} x2={385} y2={111} stroke="#64748b" strokeWidth={0.6} strokeOpacity={0.3} />

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={14} textAnchor="middle" fontSize={9}
                fontWeight={600} fill="#64748b">
                Phase 1 — Allocate Request / Response
              </text>
              {/* Allocate request */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.05 }}>
                <DataBox x={105} y={50} w={88} h={26}
                  label="Allocate Req" color="#10b981" outlined />
                <line x1={95} y1={100} x2={200} y2={100}
                  stroke="#10b981" strokeWidth={1.2} markerEnd="url(#arr-r)" />
              </motion.g>
              {/* Response */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.18 }}>
                <DataBox x={105} y={140} w={88} h={26}
                  label="Allocate Resp" color="#3b82f6" outlined />
                <line x1={200} y1={122} x2={95} y2={122}
                  stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#arr-l)" />
              </motion.g>
              {/* Allocated address */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.32 }}>
                <DataBox x={290} y={50} w={170} h={26}
                  label="RELAYED-ADDRESS" sub="relay.example:55000"
                  color="#ec4899" outlined />
                <DataBox x={290} y={140} w={170} h={26}
                  label="LIFETIME = 600s" sub="Refresh 갱신 필수"
                  color="#64748b" outlined />
              </motion.g>
              <text x={240} y={195} textAnchor="middle" fontSize={7.5} fill="#64748b">
                USERNAME / MESSAGE-INTEGRITY (HMAC-SHA1) — 인증 없으면 401 Unauthorized
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={14} textAnchor="middle" fontSize={9}
                fontWeight={600} fill="#64748b">
                Phase 2 — CreatePermission
              </text>
              {/* CreatePermission */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.05 }}>
                <DataBox x={105} y={45} w={90} h={26}
                  label="CreatePerm" color="#10b981" outlined />
                <DataBox x={105} y={75} w={90} h={20}
                  label="XOR-PEER-ADDR" color="#10b981" />
                <line x1={95} y1={100} x2={200} y2={100}
                  stroke="#10b981" strokeWidth={1.2} markerEnd="url(#arr-r)" />
              </motion.g>

              {/* Permission table */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.2 }}>
                <ActionBox x={290} y={45} w={170} h={70} label="Permission List"
                  sub="허용 IP만 통과" color="#f59e0b" />
                <text x={300} y={88} fontSize={8} fontFamily="monospace" fill="#f59e0b">
                  198.51.100.10 ✓
                </text>
                <text x={300} y={101} fontSize={8} fontFamily="monospace"
                  fill="#64748b" opacity={0.5}>
                  203.0.113.99 ✗ (drop)
                </text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.35 }}>
                <line x1={280} y1={140} x2={385} y2={140}
                  stroke="#10b981" strokeWidth={1.2} strokeDasharray="4 3"
                  markerEnd="url(#arr-r)" />
                <text x={332} y={155} textAnchor="middle" fontSize={8.5}
                  fontWeight={600} fill="#10b981">peer 허용됨</text>
              </motion.g>

              <text x={240} y={195} textAnchor="middle" fontSize={7.5} fill="#64748b">
                Permission 없으면 TURN이 inbound 차단 — 무차별 릴레이 남용 방지.
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={14} textAnchor="middle" fontSize={9}
                fontWeight={600} fill="#64748b">
                Phase 3a — Send / Data Indication 모드
              </text>
              {/* Send Indication */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.05 }}>
                <DataBox x={100} y={45} w={100} h={26}
                  label="Send Indication" color="#10b981" outlined />
                <text x={150} y={84} textAnchor="middle" fontSize={7.5}
                  fontFamily="monospace" fill="#10b981">+XOR-PEER+DATA</text>
                <line x1={95} y1={100} x2={200} y2={100}
                  stroke="#10b981" strokeWidth={1.2} markerEnd="url(#arr-r)" />
              </motion.g>
              {/* TURN forward */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.2 }}>
                <DataBox x={285} y={45} w={100} h={26}
                  label="raw DATA" color="#ec4899" outlined />
                <line x1={280} y1={100} x2={385} y2={100}
                  stroke="#ec4899" strokeWidth={1.2} markerEnd="url(#arr-r)" />
              </motion.g>

              {/* Reverse direction */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.35 }}>
                <DataBox x={285} y={140} w={100} h={26}
                  label="raw response" color="#ec4899" outlined />
                <line x1={385} y1={122} x2={280} y2={122}
                  stroke="#ec4899" strokeWidth={1.2} markerEnd="url(#arr-l)" />
                <DataBox x={100} y={140} w={100} h={26}
                  label="Data Indication" color="#3b82f6" outlined />
                <line x1={200} y1={122} x2={95} y2={122}
                  stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#arr-l)" />
              </motion.g>

              <AlertBox x={140} y={180} w={200} h={32}
                label="+32 byte / packet" sub="STUN-like 헤더 오버헤드"
                color="#f59e0b" />
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={14} textAnchor="middle" fontSize={9}
                fontWeight={600} fill="#64748b">
                Phase 3b — Channel 모드 (4 byte 오버헤드)
              </text>
              {/* ChannelBind */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.05 }}>
                <DataBox x={100} y={42} w={100} h={24}
                  label="ChannelBind" color="#10b981" outlined />
                <line x1={95} y1={70} x2={200} y2={70}
                  stroke="#10b981" strokeWidth={1.2} markerEnd="url(#arr-r)" />
                <DataBox x={290} y={42} w={170} h={24}
                  label="ch=0x4001 ⇄ peer" color="#f59e0b" outlined />
              </motion.g>

              {/* ChannelData packet */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.2 }}>
                <text x={20} y={156} fontSize={9} fontWeight={700} fill="#64748b">
                  ChannelData
                </text>
                <rect x={20} y={162} width={50} height={26} rx={3}
                  fill="#10b98114" stroke="#10b981" strokeWidth={0.8} />
                <text x={45} y={177} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill="#10b981">CH#</text>
                <text x={45} y={186} textAnchor="middle" fontSize={7} fill="#10b981">2B</text>

                <rect x={70} y={162} width={50} height={26} rx={3}
                  fill="#10b98114" stroke="#10b981" strokeWidth={0.8} />
                <text x={95} y={177} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill="#10b981">LEN</text>
                <text x={95} y={186} textAnchor="middle" fontSize={7} fill="#10b981">2B</text>

                <rect x={120} y={162} width={340} height={26} rx={3}
                  fill="#ec489914" stroke="#ec4899" strokeWidth={0.8} />
                <text x={290} y={180} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill="#ec4899">DATA (payload)</text>
              </motion.g>

              {/* Comparison */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.35 }}>
                <DataBox x={290} y={75} w={170} h={24}
                  label="32B → 4B" sub="대역폭 88% 절감"
                  color="#10b981" outlined />
              </motion.g>

              <text x={240} y={210} textAnchor="middle" fontSize={7.5} fill="#64748b">
                실시간 미디어용. DERP(iroh)는 HTTPS WebSocket — 더 단순 + 방화벽 친화.
              </text>
            </motion.g>
          )}

          <defs>
            <marker id="arr-r" markerWidth={5} markerHeight={5} refX={4} refY={2.5} orient="auto">
              <polygon points="0 0, 5 2.5, 0 5" fill="#10b981" />
            </marker>
            <marker id="arr-l" markerWidth={5} markerHeight={5} refX={4} refY={2.5} orient="auto">
              <polygon points="0 0, 5 2.5, 0 5" fill="#3b82f6" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
