import { motion } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from '../libp2p/codeRefs';

const PROTOCOLS = [
  { name: 'Kademlia DHT', desc: '피어 탐색, FIND_NODE 질의', color: '#8b5cf6' },
  { name: 'GossipSub', desc: '메시지 브로드캐스트, heartbeat', color: '#10b981' },
  { name: 'Identify', desc: '피어 정보 교환', color: '#f59e0b' },
  { name: 'Relay', desc: 'NAT 우회 중계', color: '#06b6d4' },
];

const STREAM_LIMITS = [
  { label: '최대 동시 스트림', value: '8,192개', note: 'session당', color: '#10b981' },
  { label: '인바운드 버퍼', value: '256개', note: '백프레셔 한계', color: '#f59e0b' },
  { label: '프레임 헤더', value: '12 bytes', note: '버전+타입+플래그+스트림ID+길이', color: '#8b5cf6' },
];

export default function Overview({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Yamux 멀티플렉싱 개요</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          <strong>Yamux</strong>(Yet another Multiplexer)는 단일 TCP 연결 위에
          최대 8,192개 논리 스트림을 다중화하는 프로토콜이다.
        </p>
        <p>
          왜 필요한가? libp2p에서 한 피어와 Kademlia, GossipSub, Identify 등
          <strong>여러 프로토콜이 동시에 통신</strong>한다.<br />
          프로토콜마다 TCP를 새로 열면 연결 수가 폭증한다.<br />
          Yamux가 하나의 TCP를 공유 채널로 만들어준다.
        </p>
      </div>

      {/* 동시 프로토콜 시각화 */}
      <div className="rounded-xl border border-border bg-card p-5 mb-6">
        <p className="text-xs font-mono text-foreground/50 mb-4">
          하나의 TCP 위에 여러 프로토콜이 공존
        </p>
        <div className="flex flex-col gap-1.5">
          {PROTOCOLS.map((p, i) => (
            <motion.div key={p.name}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 rounded-lg border px-4 py-2.5"
              style={{ borderColor: p.color + '40', background: p.color + '08' }}>
              <span className="text-xs font-mono font-bold w-32 shrink-0"
                style={{ color: p.color }}>{p.name}</span>
              <span className="text-xs text-foreground/60">{p.desc}</span>
            </motion.div>
          ))}
        </div>
        <p className="text-[10px] text-foreground/40 mt-3 text-center">
          4개 프로토콜이 각각 별도 스트림을 사용 — 모두 하나의 TCP 커넥션 공유
        </p>
      </div>

      {/* 스트림 한계 수치 */}
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-xs font-mono text-foreground/50 mb-3">Yamux 핵심 수치</p>
        <div className="grid grid-cols-3 gap-2">
          {STREAM_LIMITS.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="rounded-lg border p-3 text-center"
              style={{ borderColor: s.color + '40', background: s.color + '06' }}>
              <p className="text-lg font-bold font-mono" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-foreground/70 mt-0.5">{s.label}</p>
              <p className="text-[10px] text-foreground/40">{s.note}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 mt-6">
          <CodeViewButton onClick={() => onCodeRef('yamux-muxer', codeRefs['yamux-muxer'])} />
          <span className="text-[10px] text-muted-foreground self-center">Yamux Muxer 구현</span>
        </div>
      )}

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Yamux 프로토콜 명세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Yamux v0 Specification (HashiCorp)
//
// Frame Format (12-byte header):
//
//   Version  (1 byte):  0
//   Type     (1 byte):  Data/Window/Ping/GoAway
//   Flags    (2 bytes): SYN/ACK/FIN/RST
//   StreamID (4 bytes): stream identifier
//   Length   (4 bytes): body length

// Types:
//   0 = Data            (stream data)
//   1 = Window Update   (flow control)
//   2 = Ping            (keep-alive)
//   3 = Go Away         (disconnect)

// Flags:
//   SYN (0x01): new stream
//   ACK (0x02): acknowledge stream
//   FIN (0x04): half-close
//   RST (0x08): force close

// Stream ID Rules:
//   Odd IDs:  client-initiated
//   Even IDs: server-initiated
//   StreamID 0: session-level messages

// Flow Control:
//
//   Initial window: 256 KB per stream
//   Sender: bytes 전송 → window 감소
//   Receiver: Window Update → window 증가
//   Zero window: sender 대기 (backpressure)
//
//   Why flow control?
//   - Slow consumer 보호
//   - Memory bloat 방지
//   - Fair bandwidth sharing

// Keep-alive:
//   Ping frames (Type=2)
//   Sender → ping
//   Receiver → pong (same payload)
//   Timeout 시 연결 끊김 감지

// Go Away:
//   Graceful shutdown
//   Normal / Protocol Error / Internal Error
//   모든 new stream 거부
//   기존 stream은 마저 처리

// libp2p Yamux 특성:
//   Stream 한계: 8,192 (configurable)
//   Frame max size: 16MB
//   Initial window: 256KB
//   Max pending: 256 streams

// 사용 예:
//   TCP connection A-B
//   ├── Stream 1: Kademlia FIND_NODE
//   ├── Stream 3: GossipSub msg
//   ├── Stream 5: Identify exchange
//   └── Stream 7: Custom protocol
//
//   각 stream 독립 flow control
//   한 stream의 slow receiver가 다른 stream 막지 않음`}
        </pre>
      </div>
    </section>
  );
}
