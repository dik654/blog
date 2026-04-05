import { useState } from 'react';
import { motion } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from '../libp2p/codeRefs';

const STEPS = [
  { label: 'dial(Listener)', desc: 'eligible_listener()로 소켓 선택', color: '#8b5cf6' },
  { label: 'hole_puncher()', desc: 'UDP 패킷 → NAT 매핑 생성', color: '#f59e0b' },
  { label: 'Sender 등록', desc: 'hole_punch_attempts에 저장', color: '#06b6d4' },
  { label: 'poll() 매칭', desc: 'send_back_addr와 HashMap 비교', color: '#10b981' },
  { label: 'Sender 전달', desc: 'sender.send(upgrade) → receiver 수신', color: '#ef4444' },
];

const CMP = [
  { a: 'NAT 매핑', tcp: '포트 고정 필요, 타임아웃 짧음', quic: 'UDP 매핑 유지 쉬움', c: '#06b6d4' },
  { a: 'SYN 충돌', tcp: '동시 SYN → NAT 드롭 가능', quic: 'Initial 패킷 → 충돌 없음', c: '#10b981' },
  { a: '포트 재사용', tcp: 'SO_REUSEPORT (OS 의존)', quic: 'Endpoint 소켓 공유', c: '#f59e0b' },
];

export default function HolePunching({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  const [step, setStep] = useState(0);

  return (
    <section id="hole-punching" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">QUIC 홀 펀칭</h2>

      <div className="rounded-xl border border-border bg-card p-5 mb-6">
        <p className="text-xs font-mono text-foreground/50 mb-4">홀 펀칭 흐름 — 클릭</p>
        <div className="flex flex-col gap-2">
          {STEPS.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3 rounded-lg border px-4 py-2.5 cursor-pointer transition-all"
              onClick={() => setStep(i)}
              style={{
                borderColor: step === i ? s.color + '60' : s.color + '25',
                background: step === i ? s.color + '12' : s.color + '04',
                transform: step === i ? 'scale(1.01)' : 'scale(1)',
              }}>
              <span className="text-[10px] font-mono font-bold w-5 shrink-0"
                style={{ color: s.color }}>{i + 1}</span>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-mono font-bold"
                  style={{ color: s.color }}>{s.label}</span>
                {step === i && (
                  <motion.span
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-[11px] text-foreground/60">
                    {s.desc}
                  </motion.span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">왜 TCP보다 쉬운가?</h3>
        <p>
          핵심은 UDP다. TCP는 동시 SYN이 NAT에서 드롭될 수 있다.<br />
          QUIC Initial 패킷은 이 문제가 없다.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 mt-4 mb-6">
        <p className="text-xs font-mono text-foreground/50 mb-3">TCP vs QUIC 홀 펀칭</p>
        {CMP.map((r, i) => (
          <motion.div key={r.a}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="grid grid-cols-[72px_1fr_1fr] gap-2 py-2 border-b border-border/30 last:border-0">
            <span className="text-[10px] font-mono font-bold" style={{ color: r.c }}>{r.a}</span>
            <span className="text-[11px] text-foreground/50">{r.tcp}</span>
            <span className="text-[11px] text-foreground/70">{r.quic}</span>
          </motion.div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>poll() 매칭:</strong> Incoming의 send_back_addr에서 SocketAddr를 추출한다.
          hole_punch_attempts에 키가 있으면 sender.send()로 전달, 없으면 일반 인바운드로 처리한다.
          send 실패 시 upgrade를 Incoming으로 되돌린다. 연결을 버리지 않는 방어적 설계다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('quic-transport', codeRefs['quic-transport'])} />
            <span className="text-[10px] text-muted-foreground self-center">poll() 홀 펀칭 매칭</span>
          </div>
        )}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">UDP vs TCP Hole Punching</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// UDP (QUIC) Hole Punching의 이점
//
// TCP Hole Punching 어려움:
//
// 1. SYN flood 감지
//    다수 SYN → IDS 탐지
//    NAT의 "drop unexpected SYN"
//
// 2. 동시 open (TCP)
//    양쪽 SYN 동시 전송
//    일부 NAT 지원 안 함
//    OS 구현 차이
//
// 3. Sequence number 조율
//    SYN-ACK 주고받기
//    State 복잡
//
// 4. TCP handshake timeout
//    실패 시 OS-level retry
//    Control 어려움
//
// UDP (QUIC) Hole Punching의 장점:
//
// 1. Stateless
//    각 packet 독립적
//    NAT 매핑만 필요
//
// 2. 단순한 packet 교환
//    A → B: UDP datagram
//    B → A: UDP datagram
//    NAT 매핑 성공 → QUIC handshake
//
// 3. No TCP state machine
//    Timeout 제어 쉬움
//    Retry 유연

// QUIC Hole Punching 프로토콜:
//
// Setup (via signaling):
//   A external addr: 203.0.113.5:40000
//   B external addr: 198.51.100.10:50000
//   Both behind NAT
//
// Phase 1: Punch
//   A → B_ext: UDP datagram (random payload)
//     A NAT: creates mapping A:5000 ↔ B_ext
//     B NAT: drops (no mapping)
//
//   B → A_ext: UDP datagram
//     B NAT: creates mapping B:6000 ↔ A_ext
//     A NAT: PASSES (mapping exists!)
//
// Phase 2: QUIC Handshake
//   A ↔ B: normal QUIC handshake
//   → Direct connection established

// libp2p-quic hole puncher:
//
//   pub async fn hole_puncher(
//       socket: UdpSocket,
//       remote: SocketAddr,
//       timeout: Duration,
//   ) -> Result<()> {
//       let interval = Duration::from_millis(100);
//       let start = Instant::now();
//
//       while start.elapsed() < timeout {
//           socket.send_to(b"libp2p-punch", remote).await?;
//           tokio::time::sleep(interval).await;
//       }
//       Ok(())
//   }
//
//   Send packets until:
//   - Connection established (receiver succeeds)
//   - Timeout reached

// 성공률:
//   Cone NAT: ~95%
//   Port-restricted: ~80%
//   Symmetric NAT: ~10-20%
//
//   Symmetric failure → fall back to relay`}
        </pre>
      </div>
    </section>
  );
}
