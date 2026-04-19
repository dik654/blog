import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = {
  list: '#10b981',
  dial: '#f59e0b',
  fam: '#8b5cf6',
  hash: '#06b6d4',
  ok: '#22c55e',
  warn: '#ef4444',
};

const STEPS = [
  {
    label: '1. Endpoint = 단일 UDP 소켓 (multiplexer)',
    body: 'QUIC Endpoint는 하나의 UDP 소켓에서 여러 connection을 관리한다.\nlibp2p는 두 종류 endpoint를 운영한다.',
  },
  {
    label: '2. Listener Endpoint — 포트 고정',
    body: 'listen_on()이 지정한 port에 바인드.\nIncoming connection 받음.\nOutgoing dial에서도 재사용 → 홀펀칭 NAT 매핑 활용.',
  },
  {
    label: '3. Dialer Endpoint — ephemeral port',
    body: 'OS가 자동 할당 (port=0).\nListener가 없을 때만 생성.\nAddress family당 하나씩 (IPv4, IPv6).',
  },
  {
    label: '4. SocketFamily 분리 — HashMap 키',
    body: 'IPv4와 IPv6 dialer를 별도 HashMap으로 관리.\n런타임에 lazy 생성.',
  },
  {
    label: '5. eligible_listener() — Deterministic',
    body: 'addr family 매칭 listener 필터링.\nhash(addr) % len 으로 인덱스 결정.\n같은 addr → 항상 같은 listener.',
  },
  {
    label: '6. Hole Punching Symmetry',
    body: 'A→B 와 B→A 가 같은 socket pair 사용해야 NAT 매핑 일치.\nDeterministic selection이 이를 보장.',
  },
];

export default function EndpointReuseViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.fam}>
                QUIC Endpoint 개념
              </text>
              <ModuleBox x={150} y={45} w={180} h={50}
                label="UDP Socket" sub="single port" color={C.list} />
              {[0, 1, 2, 3].map(i => (
                <motion.g key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.05 * i }}>
                  <DataBox x={30 + i * 110} y={120} w={100} h={30}
                    label={`conn ${i + 1}`} color={C.dial} />
                  <line x1={240} y1={95} x2={80 + i * 110} y2={120}
                    stroke={C.dial + '60'} strokeWidth={0.8} strokeDasharray="3 2" />
                </motion.g>
              ))}
              <text x={240} y={180} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                1 socket → N connections (multiplexer)
              </text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.list}>
                Listener Endpoint
              </text>
              <ModuleBox x={140} y={35} w={200} h={50}
                label="bound to listen_on(port)" sub="port forwarded" color={C.list} />
              <ActionBox x={30} y={100} w={195} h={42}
                label="incoming accept()" sub="server 역할" color={C.list} />
              <ActionBox x={255} y={100} w={195} h={42}
                label="outgoing dial 재사용" sub="같은 port → NAT 친화" color={C.ok} />
              <AlertBox x={80} y={150} w={320} h={36}
                label="홀펀칭에 필수 — NAT 매핑 재활용"
                color={C.fam} />
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.dial}>
                Dialer Endpoint (fallback)
              </text>
              <ModuleBox x={140} y={35} w={200} h={50}
                label="ephemeral port" sub="OS allocate (0)" color={C.dial} />
              <ActionBox x={30} y={100} w={420} h={36}
                label="조건: Listener 없을 때만"
                sub="& 같은 address family 당 1개"
                color={C.warn} />
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                outbound 전용 — incoming 안 받음
              </text>
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.fam}>
                HashMap&lt;SocketFamily, Endpoint&gt;
              </text>
              <ModuleBox x={30} y={40} w={200} h={70}
                label="IPv4 dialer" sub="Endpoint instance" color={C.dial} />
              <ModuleBox x={250} y={40} w={200} h={70}
                label="IPv6 dialer" sub="Endpoint instance" color={C.dial} />
              <ActionBox x={30} y={130} w={420} h={42}
                label="lazy 생성: dial 시점에 entry().or_insert_with()"
                sub="사용 안 한 family는 endpoint 없음"
                color={C.hash} />
            </motion.g>
          )}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.hash}>
                eligible_listener() — Deterministic
              </text>
              <DataBox x={30} y={40} w={420} h={28}
                label="filter: matches_addr_family(target)" color={C.list} />
              <DataBox x={30} y={75} w={420} h={28}
                label="index = hash(addr) % matching.len()" color={C.hash} />
              <DataBox x={30} y={110} w={420} h={28}
                label="return matching[index]" color={C.ok} />
              <ActionBox x={30} y={148} w={420} h={36}
                label="동일 addr → 동일 listener (boostrap of symmetry)"
                color={C.fam} />
            </motion.g>
          )}
          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.fam}>
                Hole Punching Symmetry
              </text>
              <ModuleBox x={30} y={40} w={140} h={50}
                label="Peer A" sub="dial → B" color={C.dial} />
              <ModuleBox x={310} y={40} w={140} h={50}
                label="Peer B" sub="dial → A" color={C.list} />
              <ActionBox x={170} y={45} w={140} h={36}
                label="A:port_a ↔ B:port_b"
                color={C.ok} />
              <AlertBox x={30} y={110} w={420} h={70}
                label="양쪽 socket pair 일치 필수"
                sub="같은 (A_addr, A_port) ↔ (B_addr, B_port) 가 NAT 매핑 두 방향 모두 통과"
                color={C.fam} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
