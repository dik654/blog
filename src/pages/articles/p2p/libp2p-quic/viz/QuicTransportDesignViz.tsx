import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = {
  tcp: '#ef4444',
  quic: '#06b6d4',
  ma: '#8b5cf6',
  out: '#10b981',
  warn: '#f59e0b',
  ok: '#22c55e',
};

const STEPS = [
  {
    label: '1. Multiaddr 표기 — quic-v1 vs quic',
    body: '/ip4/X/udp/PORT/quic-v1: RFC 9000 (versioned).\n/ip4/X/udp/PORT/quic: legacy draft.\n/p2p/QmID 추가 시 PeerId 포함.',
  },
  {
    label: '2. Output 타입 — TCP vs QUIC 차이',
    body: 'TCP: (PeerId, StreamMuxerBox) — Yamux 래핑.\nQUIC: (PeerId, Connection) — Connection이 곧 muxer.\nStreamMuxerBox 불필요.',
  },
  {
    label: '3. 0-RTT vs 1-RTT — libp2p 선택',
    body: 'libp2p-quic은 1-RTT 만 사용.\n0-RTT는 replay 공격에 취약.\nP2P에서 idempotency 보장 어려움.',
  },
  {
    label: '4. Identity — libp2p-TLS extension',
    body: 'TLS 1.3 self-signed 인증서에 PeerId 포함.\nHost key로 cert 서명.\nCA 체인 불필요.',
  },
  {
    label: '5. 성능 비교 — Setup 시간',
    body: 'TCP+Noise+Yamux: ~200ms (3 RTT).\nQUIC: ~80ms (1 RTT).\n모바일/lossy 환경에서 QUIC 우월.',
  },
  {
    label: '6. 사용 현황 — 프로젝트별',
    body: 'Ethereum 2.0: TCP+Noise+Yamux (안정 우선).\nIPFS: TCP + QUIC dual stack.\niroh: QUIC 중심.',
  },
];

export default function QuicTransportDesignViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ma}>
                Multiaddr 표기 — QUIC
              </text>
              {[
                { ma: '/ip4/1.2.3.4/udp/4001/quic-v1', t: 'RFC 9000', c: C.ok },
                { ma: '/ip4/1.2.3.4/udp/4001/quic-v1/p2p/QmID', t: 'with PeerId', c: C.ma },
                { ma: '/dns4/example.com/udp/4001/quic-v1', t: 'DNS', c: C.quic },
                { ma: '/ip4/1.2.3.4/udp/4001/quic', t: 'legacy draft', c: C.warn },
              ].map((row, i) => (
                <motion.g key={row.ma}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}>
                  <rect x={30} y={38 + i * 32} width={420} height={26} rx={6}
                    fill={row.c + '08'} stroke={row.c + '40'} strokeWidth={0.6} />
                  <text x={50} y={56 + i * 32} fontSize={9} fontFamily="monospace" fill={row.c}>
                    {row.ma}
                  </text>
                  <text x={440} y={56 + i * 32} textAnchor="end" fontSize={8} fontWeight={700} fill={row.c}>
                    {row.t}
                  </text>
                </motion.g>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.out}>
                Transport::Output 타입 차이
              </text>
              <ModuleBox x={30} y={35} w={195} h={50}
                label="TCP Transport" sub="(PeerId, StreamMuxerBox)" color={C.tcp} />
              <ModuleBox x={255} y={35} w={195} h={50}
                label="QUIC Transport" sub="(PeerId, Connection)" color={C.quic} />
              <ActionBox x={30} y={100} w={195} h={42}
                label="Yamux 래핑 필요" sub="별도 muxer 레이어" color={C.tcp} />
              <ActionBox x={255} y={100} w={195} h={42}
                label="Connection = muxer" sub="QUIC 자체에 stream 내장" color={C.quic} />
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                QUIC은 Yamux 불필요 — 직접 stream open 가능
              </text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.warn}>
                0-RTT vs 1-RTT — libp2p 결정
              </text>
              <ModuleBox x={30} y={35} w={195} h={50}
                label="0-RTT (불채택)" sub="replay 공격 취약" color={C.warn} />
              <ModuleBox x={255} y={35} w={195} h={50}
                label="1-RTT (채택)" sub="단순 + 안전" color={C.ok} />
              <AlertBox x={30} y={100} w={420} h={40}
                label="P2P에서 idempotency 보장 어려움"
                sub="동일 메시지 재전송 시 상태 오염 가능"
                color={C.warn} />
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                향후 application-level opt-in 가능성
              </text>
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ma}>
                libp2p-TLS Extension
              </text>
              <DataBox x={30} y={40} w={420} h={32}
                label="self-signed cert + libp2p-TLS extension" color={C.ma} />
              <ActionBox x={30} y={82} w={195} h={36}
                label="extension 내용" sub="PeerId 포함" color={C.quic} />
              <ActionBox x={255} y={82} w={195} h={36}
                label="cert 서명" sub="host key로 sign" color={C.out} />
              <ActionBox x={30} y={128} w={420} h={40}
                label="검증: cert에서 PeerId 추출 + signature verify"
                sub="No CA chain (P2P 환경)"
                color={C.ok} />
            </motion.g>
          )}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.out}>
                Connection Setup 시간 비교
              </text>
              <StatusBox x={30} y={35} w={420} h={42}
                label="TCP + Noise + Yamux" sub="3 RTT, ~200ms"
                color={C.tcp} progress={1.0} />
              <StatusBox x={30} y={85} w={420} h={42}
                label="QUIC 1-RTT" sub="1 RTT, ~80ms"
                color={C.quic} progress={0.4} />
              <StatusBox x={30} y={135} w={420} h={42}
                label="QUIC 0-RTT (libp2p 미사용)" sub="0 RTT, ~0ms"
                color={C.warn} progress={0.05} />
            </motion.g>
          )}
          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ma}>
                프로젝트별 Transport 선택
              </text>
              {[
                { p: 'Ethereum 2.0', s: 'TCP+Noise+Yamux', c: C.tcp },
                { p: 'IPFS', s: 'TCP + QUIC (dual)', c: C.ma },
                { p: 'iroh', s: 'QUIC 중심', c: C.quic },
                { p: 'libp2p-quic', s: 'QUIC only (UDP-native)', c: C.ok },
              ].map((row, i) => (
                <motion.g key={row.p}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}>
                  <rect x={30} y={38 + i * 32} width={420} height={26} rx={6}
                    fill={row.c + '08'} stroke={row.c + '40'} strokeWidth={0.6} />
                  <text x={50} y={56 + i * 32} fontSize={10} fontWeight={700} fill={row.c}>
                    {row.p}
                  </text>
                  <text x={200} y={56 + i * 32} fontSize={9} fill="var(--muted-foreground)">
                    {row.s}
                  </text>
                </motion.g>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
