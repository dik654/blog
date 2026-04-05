import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from '../libp2p/codeRefs';

type Mode = 'dialer' | 'listener';

const MODES: Record<Mode, { label: string; color: string; steps: string[] }> = {
  dialer: {
    label: 'Dialer 모드', color: '#f59e0b',
    steps: [
      'eligible_listener()로 기존 리스너 탐색',
      '리스너 있으면 → Endpoint 재사용 (포트 공유)',
      '리스너 없으면 → dialer HashMap에서 Endpoint 생성',
      'endpoint.connect_with(config, addr, "l")',
      'Connecting Future → 핸드셰이크 완료 대기',
    ],
  },
  listener: {
    label: 'Listener 모드 (홀 펀칭)', color: '#8b5cf6',
    steps: [
      'peer_id 필수 — Multiaddr에서 추출',
      'eligible_listener()로 리스너 소켓 복제',
      'hole_puncher() — UDP 패킷으로 NAT 매핑 생성',
      'hole_punch_attempts에 oneshot::Sender 등록',
      'receiver vs hole_puncher 레이스',
    ],
  },
};

export default function DialMechanism({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  const [mode, setMode] = useState<Mode>('dialer');
  const m = MODES[mode];

  return (
    <section id="dial-mechanism" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">dial() 두 가지 모드</h2>

      {/* 모드 토글 */}
      <div className="rounded-xl border border-border bg-card p-5 mb-6">
        <div className="flex gap-2 mb-4">
          {(Object.keys(MODES) as Mode[]).map(k => (
            <button key={k} onClick={() => setMode(k)}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors"
              style={{
                background: mode === k ? MODES[k].color + '18' : 'transparent',
                color: mode === k ? MODES[k].color : 'var(--color-foreground)',
                border: `1px solid ${mode === k ? MODES[k].color + '60' : 'var(--color-border)'}`,
              }}>
              {MODES[k].label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={mode}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
            className="flex flex-col gap-2">
            {m.steps.map((s, i) => (
              <motion.div key={s}
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 rounded-lg border px-4 py-2.5"
                style={{ borderColor: m.color + '40', background: m.color + '08' }}>
                <span className="text-[10px] font-mono font-bold w-5 shrink-0"
                  style={{ color: m.color }}>{i + 1}</span>
                <span className="text-xs text-foreground/70">{s}</span>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">eligible_listener() — 결정론적 선택</h3>
        <p>
          리스너가 여러 개일 때 SocketAddr를 해시해서 인덱스를 결정한다.
          <strong>같은 대상이면 항상 같은 리스너.</strong>{' '}
          홀 펀칭에서 양쪽이 같은 소켓 쌍을 써야 NAT 매핑이 일치하기 때문이다.
        </p>
        <p>
          <strong>"l" 문자열:</strong> <code>connect_with()</code> 세 번째 인자는 SNI다.
          libp2p는 도메인이 아닌 PeerId 기반이므로 더미 값 &quot;l&quot;을 넣는다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('quic-transport', codeRefs['quic-transport'])} />
            <span className="text-[10px] text-muted-foreground self-center">dial() 구현</span>
            <CodeViewButton onClick={() => onCodeRef('transport-trait', codeRefs['transport-trait'])} />
            <span className="text-[10px] text-muted-foreground self-center">Transport::dial()</span>
          </div>
        )}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Endpoint Reuse 전략</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// QUIC Endpoint Management
//
// Endpoint = single UDP socket
//   multiplexing multiple connections
//
// libp2p-quic 전략:
//
// 1. Listener Endpoint (port forward됨)
//    용도: incoming connections 받음
//    포트: listen_on() 지정
//
//    재사용 조건:
//      outgoing dial 시 같은 port 사용
//      → 홀 펀칭에 필수
//      → NAT 매핑 재활용
//
// 2. Dialer Endpoint (ephemeral port)
//    용도: outbound only
//    포트: OS 할당 (0)
//
//    생성 조건:
//      - Listener 없을 때
//      - 같은 address family당 1개

// SocketFamily 분리:
//   IPv4 dialer Endpoint
//   IPv6 dialer Endpoint
//   각각 HashMap에 저장

// eligible_listener() 동작:
//
//   fn eligible_listener(&self, addr: &SocketAddr)
//       -> Option<Arc<Listener<P>>>
//   {
//       matching = self.listeners
//           .filter(|l| l.matches_addr_family(addr))
//           .collect();
//
//       if matching.is_empty():
//           return None;
//
//       // Deterministic selection:
//       index = hash(addr) % matching.len();
//       return Some(matching[index]);
//   }
//
//   핵심: 같은 addr → 같은 listener
//   → 홀 펀칭 symmetry 보장

// Dial 흐름 상세:
//
//   fn dial(self, addr: Multiaddr)
//       -> Result<Connecting>
//   {
//       let (socket_addr, peer_id) = parse(addr)?;
//
//       // Get or create endpoint
//       let endpoint = if let Some(listener) =
//           self.eligible_listener(&socket_addr) {
//           listener.endpoint.clone()
//       } else {
//           let family = SocketFamily::from(&socket_addr);
//           self.dialer.entry(family)
//               .or_insert_with(|| create_new_endpoint())
//               .clone()
//       };
//
//       // Start connection
//       let connecting = endpoint
//           .connect_with(self.client_config, socket_addr, "l")?;
//
//       Ok(Connecting { ... })
//   }

// 장점:
//   - Port 최적화 (listener + dialer 공유)
//   - NAT-friendly
//   - 간단한 구조
//
// 단점:
//   - Endpoint 수명 관리 복잡
//   - Per-family 리소스`}
        </pre>
      </div>
    </section>
  );
}
