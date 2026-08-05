import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = {
  c: '#6366f1',
  nat: '#6b7280',
  stun: '#10b981',
  r: '#f59e0b',
  xor: '#a855f7',
};

const STEPS = [
  {
    label: '1: Binding Request 전송',
    body: 'Client 가 STUN 서버로 binding request UDP 패킷 전송.\nheader = type + magic + 12B txn_id 만 — 본문 비어있음.',
  },
  {
    label: '2: NAT 매핑 생성',
    body: 'NAT 가 internal:port 와 external:port 를 매핑.\n패킷 src 를 external 로 rewrite 하여 STUN 서버로 전달.',
  },
  {
    label: '3: Binding Response (XOR-MAPPED-ADDRESS)',
    body: 'STUN 서버는 받은 src 를 magic XOR 로 인코딩하여 응답.\nXOR 가 없으면 NAT/ALG 가 응답 본문의 IP 를 변조할 수 있음.',
  },
  {
    label: '4: 외부 주소 복원',
    body: 'Client 가 magic XOR 해제 → 자신의 공인 IP:port 획득.\nICE candidate 로 피어에게 광고 → P2P 연결 시도.',
  },
];

export default function STUNViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="st-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 z" fill={C.c} />
            </marker>
          </defs>

          {/* 3 노드 공통 */}
          <ModuleBox x={10} y={20} w={90} h={42} label="Client" sub="LAN" color={C.c} />
          <ModuleBox x={210} y={20} w={90} h={42} label="NAT" color={C.nat} />
          <ModuleBox x={400} y={20} w={90} h={42} label="STUN" color={C.stun} />

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={20} y={85} w={170} h={50} label="STUN Binding Request" sub="type 0x0001 · magic 0x2112A442" color={C.c} outlined />
              <DataBox x={20} y={145} w={170} h={36} label="src 192.168.1.5:3000" color={C.c} outlined />

              <motion.line x1={195} y1={110} x2={400} y2={42} stroke={C.c} strokeWidth={1.5}
                markerEnd="url(#st-arr)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.3 }} />
              <text x={295} y={92} textAnchor="middle" fontSize={9.5} fontWeight={600} fill={C.c}>
                txn_id = random(12B)
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={170} y={80} w={170} h={42} label="NAT entry 추가" color={C.nat} />
              <DataBox x={20} y={130} w={150} h={36} label="internal" sub="192.168.1.5:3000" color={C.c} outlined />
              <DataBox x={180} y={130} w={150} h={36} label="external" sub="203.0.113.10:5678" color={C.r} outlined />
              <DataBox x={340} y={130} w={140} h={36} label="remote" sub="stun:3478" color={C.stun} outlined />

              <motion.line x1={95} y1={130} x2={245} y2={122} stroke={C.nat} strokeWidth={1.2} strokeDasharray="3 3"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />

              <text x={250} y={195} textAnchor="middle" fontSize={9.5}
                fill="var(--muted-foreground)">
                NAT 가 src rewrite: .5:3000 → .10:5678
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={310} y={85} w={170} h={50} label="XOR-MAPPED-ADDRESS" sub="family · XOR(port) · XOR(addr)" color={C.stun} outlined />
              <ActionBox x={310} y={145} w={170} h={36} label="XOR 0x2112A442" sub="ALG 변조 방지" color={C.xor} />

              <motion.line x1={400} y1={62} x2={195} y2={110} stroke={C.stun} strokeWidth={1.5}
                markerEnd="url(#st-arr)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.2 }} />
              <DataBox x={20} y={85} w={170} h={50} label="response 수신" sub="XOR 인코딩된 주소" color={C.stun} outlined />
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={20} y={80} w={170} h={42} label="XOR 해제" sub="port ⊕ 0x2112 / addr ⊕ magic" color={C.xor} />
              <DataBox x={20} y={130} w={170} h={42} label="port = 5678" color={C.r} outlined />
              <DataBox x={210} y={130} w={170} h={42} label="addr = 203.0.113.10" color={C.r} outlined />

              <StatusBox x={130} y={185} w={240} h={28} label="ICE candidate 로 피어에게 전달" sub=" " color={C.r} progress={1} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
