import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = {
  tcp: '#ef4444',
  udp: '#06b6d4',
  nat: '#6b7280',
  ok: '#22c55e',
  warn: '#f59e0b',
  punch: '#8b5cf6',
};

const STEPS = [
  {
    label: '1. TCP 홀펀칭의 4가지 어려움',
    body: 'SYN flood 감지 (IDS).\n동시 open 미지원 NAT 존재.\nSequence number 조율 필요.\nOS-level retry 제어 어려움.',
  },
  {
    label: '2. UDP/QUIC 의 3가지 장점',
    body: 'Stateless — 각 패킷 독립적.\n단순한 datagram 교환.\nNo TCP state machine — timeout 제어 쉬움.',
  },
  {
    label: '3. Setup — Signaling 단계',
    body: 'A external addr: 203.0.113.5:40000.\nB external addr: 198.51.100.10:50000.\n둘 다 NAT 뒤. signaling 채널로 주소 교환.',
  },
  {
    label: '4. Phase 1 — Punch (양방향 datagram)',
    body: 'A → B_ext: A NAT mapping 생성, B NAT 드롭.\nB → A_ext: B NAT mapping 생성, A NAT 통과 (mapping 존재).\n양방향 매핑 성립.',
  },
  {
    label: '5. Phase 2 — QUIC Handshake',
    body: 'A ↔ B 정상 QUIC 1-RTT 핸드셰이크.\nDirect connection 수립. relay 불필요.',
  },
  {
    label: '6. NAT 유형별 성공률',
    body: 'Cone NAT: ~95%.\nPort-restricted: ~80%.\nSymmetric NAT: ~10–20% → relay fallback.',
  },
];

export default function UdpVsTcpHolePunchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.tcp}>
                TCP 홀펀칭 어려움 4가지
              </text>
              {[
                { l: '1. SYN flood 감지', d: '다수 SYN → IDS / NAT drop' },
                { l: '2. 동시 open 미지원', d: '일부 NAT 양쪽 SYN 지원 X' },
                { l: '3. Sequence 조율', d: 'SYN-ACK state machine 복잡' },
                { l: '4. OS retry 제어 X', d: 'TCP handshake timeout 강제' },
              ].map((row, i) => (
                <motion.g key={row.l}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i }}>
                  <rect x={30} y={36 + i * 36} width={420} height={30} rx={6}
                    fill={C.tcp + '08'} stroke={C.tcp + '40'} strokeWidth={0.6} />
                  <text x={50} y={56 + i * 36} fontSize={10} fontWeight={700} fill={C.tcp}>
                    {row.l}
                  </text>
                  <text x={210} y={56 + i * 36} fontSize={9} fill="var(--muted-foreground)">
                    {row.d}
                  </text>
                </motion.g>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.udp}>
                UDP/QUIC 홀펀칭 장점 3가지
              </text>
              {[
                { l: 'Stateless', d: '각 datagram 독립적, NAT 매핑만 필요' },
                { l: '단순 교환', d: 'A → B / B → A datagram만' },
                { l: 'No TCP FSM', d: 'timeout/retry 자유롭게 제어' },
              ].map((row, i) => (
                <motion.g key={row.l}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.07 * i }}>
                  <rect x={30} y={40 + i * 48} width={420} height={42} rx={6}
                    fill={C.udp + '08'} stroke={C.udp + '40'} strokeWidth={0.6} />
                  <text x={50} y={62 + i * 48} fontSize={10} fontWeight={700} fill={C.udp}>
                    {row.l}
                  </text>
                  <text x={50} y={75 + i * 48} fontSize={8} fill="var(--muted-foreground)">
                    {row.d}
                  </text>
                </motion.g>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.punch}>
                Signaling — 외부 주소 교환
              </text>
              <ModuleBox x={20} y={45} w={120} h={50}
                label="Peer A" sub="behind NAT_A" color={C.udp} />
              <ModuleBox x={340} y={45} w={120} h={50}
                label="Peer B" sub="behind NAT_B" color={C.udp} />
              <ModuleBox x={170} y={45} w={140} h={50}
                label="Signaling Server" sub="(rendezvous)" color={C.warn} />
              <DataBox x={30} y={120} w={200} h={28}
                label="A_ext: 203.0.113.5:40000" color={C.udp} />
              <DataBox x={250} y={120} w={200} h={28}
                label="B_ext: 198.51.100.10:50000" color={C.udp} />
              <text x={240} y={180} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                signaling 채널로 양측 외부 addr 교환
              </text>
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.punch}>
                Phase 1 — Punch (양방향)
              </text>
              <ModuleBox x={20} y={40} w={80} h={36} label="A" color={C.udp} />
              <ModuleBox x={120} y={40} w={80} h={36} label="NAT_A" color={C.nat} />
              <ModuleBox x={280} y={40} w={80} h={36} label="NAT_B" color={C.nat} />
              <ModuleBox x={380} y={40} w={80} h={36} label="B" color={C.udp} />
              <motion.g
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}>
                <line x1={100} y1={88} x2={380} y2={88}
                  stroke={C.tcp} strokeWidth={1.5} strokeDasharray="3 2" />
                <text x={240} y={102} textAnchor="middle" fontSize={9} fill={C.tcp}>
                  A → B_ext (B NAT drops, mapping created at A)
                </text>
              </motion.g>
              <motion.g
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}>
                <line x1={380} y1={130} x2={100} y2={130}
                  stroke={C.ok} strokeWidth={1.5} />
                <text x={240} y={144} textAnchor="middle" fontSize={9} fill={C.ok}>
                  B → A_ext (A NAT passes! mapping exists)
                </text>
              </motion.g>
              <text x={240} y={180} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                양방향 매핑 성립
              </text>
            </motion.g>
          )}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ok}>
                Phase 2 — QUIC Direct Handshake
              </text>
              <ModuleBox x={20} y={45} w={140} h={50}
                label="Peer A" sub="QUIC client" color={C.udp} />
              <ModuleBox x={320} y={45} w={140} h={50}
                label="Peer B" sub="QUIC server" color={C.udp} />
              <ActionBox x={170} y={50} w={140} h={42}
                label="QUIC 1-RTT" sub="TLS 1.3 + multiplex" color={C.ok} />
              <AlertBox x={30} y={120} w={420} h={60}
                label="Direct connection 수립"
                sub="relay 경유 없음, 양방향 P2P"
                color={C.ok} />
            </motion.g>
          )}
          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.punch}>
                NAT 유형별 홀펀칭 성공률
              </text>
              <StatusBox x={30} y={35} w={420} h={42}
                label="Cone NAT" sub="~95%"
                color={C.ok} progress={0.95} />
              <StatusBox x={30} y={85} w={420} h={42}
                label="Port-restricted" sub="~80%"
                color={C.warn} progress={0.80} />
              <StatusBox x={30} y={135} w={420} h={42}
                label="Symmetric NAT" sub="~10–20% → relay fallback"
                color={C.tcp} progress={0.15} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
