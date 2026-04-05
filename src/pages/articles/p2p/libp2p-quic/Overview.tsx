import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from '../libp2p/codeRefs';

const COMPARE = [
  { label: 'TCP', steps: ['TCP 연결', 'Noise 핸드셰이크', 'Yamux 협상'], color: '#ef4444', rtt: '3 RTT' },
  { label: 'QUIC', steps: ['QUIC 1-RTT (TLS 1.3 + Mux 내장)'], color: '#06b6d4', rtt: '1 RTT' },
];

export default function Overview({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  const [active, setActive] = useState<number>(0);
  const item = COMPARE[active];

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">QUIC Transport: TCP와 무엇이 다른가</h2>

      {/* TCP vs QUIC 인터랙티브 비교 */}
      <div className="rounded-xl border border-border bg-card p-5 mb-6">
        <div className="flex gap-2 mb-4">
          {COMPARE.map((c, i) => (
            <button key={c.label} onClick={() => setActive(i)}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors"
              style={{
                background: active === i ? c.color + '18' : 'transparent',
                color: active === i ? c.color : 'var(--color-foreground)',
                border: `1px solid ${active === i ? c.color + '60' : 'var(--color-border)'}`,
              }}>
              {c.label}
            </button>
          ))}
          <span className="ml-auto text-[10px] font-mono text-foreground/40 self-center">
            연결 수립 단계
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
            className="flex flex-col gap-2">
            {item.steps.map((s, i) => (
              <motion.div key={s}
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 rounded-lg border px-4 py-2.5"
                style={{ borderColor: item.color + '40', background: item.color + '08' }}>
                <span className="text-[10px] font-mono font-bold w-5 shrink-0"
                  style={{ color: item.color }}>{i + 1}</span>
                <span className="text-xs text-foreground/70">{s}</span>
              </motion.div>
            ))}
            <div className="text-right mt-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded"
                style={{ background: item.color + '15', color: item.color }}>
                {item.rtt}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          TCP 기반 libp2p는 연결 후 <strong>Noise + Yamux</strong> 업그레이드가 필요하다.<br />
          QUIC는 TLS 1.3과 멀티플렉싱이 내장되어 Transport 하나로 Security+Mux가 완료된다.
        </p>
        <p>
          <strong>설계 판단:</strong> Output이 <code>(PeerId, Connection)</code>이다.<br />
          TCP처럼 StreamMuxerBox로 감싸지 않는다. QUIC 자체가 멀티플렉서이기 때문이다.
          0-RTT도 가능하지만 리플레이 공격 때문에 1-RTT만 사용한다.
        </p>

        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton
              onClick={() => onCodeRef('quic-transport', codeRefs['quic-transport'])}
            />
            <span className="text-[10px] text-muted-foreground self-center">
              GenTransport 구조체
            </span>
            <CodeViewButton
              onClick={() => onCodeRef('transport-trait', codeRefs['transport-trait'])}
            />
            <span className="text-[10px] text-muted-foreground self-center">
              Transport 트레이트
            </span>
          </div>
        )}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">libp2p-quic 설계 결정</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// libp2p-quic Transport Design
//
// Multiaddr 형식:
//   /ip4/1.2.3.4/udp/4001/quic-v1
//   /ip4/1.2.3.4/udp/4001/quic-v1/p2p/QmID
//   /dns4/example.com/udp/4001/quic-v1
//
//   quic-v1: RFC 9000 (versioned)
//   quic: legacy (draft versions)

// Transport Output Type:
//   TCP: (PeerId, StreamMuxerBox)
//   QUIC: (PeerId, Connection)
//
//   → QUIC Connection은 이미 muxer이므로
//     StreamMuxerBox 불필요
//   → 직접 stream create 가능

// 0-RTT vs 1-RTT:
//
// libp2p-quic 선택: 1-RTT만
//
// 이유:
//   - 0-RTT는 replay attack 취약
//   - P2P에서 idempotency 보장 어려움
//   - 단순성 우선
//
// 향후 계획:
//   - 0-RTT는 specific use case에서만
//   - Application-level opt-in

// Identity (인증):
//
//   TCP+Noise: Noise XX handshake로 identity 교환
//   QUIC: TLS 1.3 certificate에 libp2p-TLS extension
//
//   libp2p-TLS extension:
//     Self-signed cert
//     Contains PeerId
//     Signed by host key
//
//   Certificate verification:
//     Extract PeerId
//     Verify signature
//     No CA chain needed (P2P)

// 성능 비교 (typical):
//
//   Connection setup:
//     TCP+Noise+Yamux: ~200ms (3 RTT)
//     QUIC: ~80ms (1 RTT)
//     QUIC 0-RTT: ~0ms (0 RTT)
//
//   Throughput:
//     Similar (bandwidth limited)
//
//   Mobile/lossy networks:
//     QUIC 훨씬 유리
//     (Connection migration + 빠른 recovery)

// 사용 현황:
//   Ethereum 2.0: TCP+Noise+Yamux (더 안정)
//   IPFS: TCP + QUIC (dual)
//   iroh: QUIC 중심
//   일부 projects QUIC만 (UDP-native)`}
        </pre>
      </div>
    </section>
  );
}
