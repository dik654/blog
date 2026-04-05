import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import SessionDetailViz from './viz/SessionDetailViz';
import { SESSION_STATES, GETH_VS_RETH } from './SessionData';

export default function Session({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeState, setActiveState] = useState<string | null>(null);
  const sel = SESSION_STATES.find(s => s.id === activeState);

  return (
    <section id="session" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SessionManager & 세션 라이프사이클</h2>
      <div className="not-prose mb-8"><SessionDetailViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('net-session', codeRefs['net-session'])} />
          <span className="text-[10px] text-muted-foreground self-center">SessionManager 전체</span>
        </div>
        <p className="leading-7">
          SessionManager는 모든 피어 TCP 연결의 상태를 추적하는 중앙 관리자다.<br />
          내부적으로 <code>HashMap&lt;PeerId, ActiveSession&gt;</code>과 pending 세션 카운터를 유지한다.
        </p>
        <p className="leading-7">
          핵심 설계 판단 — Geth는 연결마다 goroutine을 생성하지만, Reth는 tokio의 <code>select!</code> 매크로로 단일 태스크에서 모든 세션 이벤트를 처리한다.<br />
          OS 스레드 수가 아닌 epoll/kqueue의 fd 감시 능력이 병렬성의 상한이 된다.
        </p>

        {/* ── RLPx handshake ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">RLPx 핸드셰이크 — ECIES 기반 암호화 채널</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// RLPx v4 handshake 4단계

// Step 1: Auth 메시지 (클라이언트 → 서버)
// ECIES(server_pubkey, auth_body)
struct AuthBody {
    signature: Signature,            // ECDSA 서명 (session key 소유 증명)
    initiator_pubkey: PublicKey,     // 클라이언트 공개키
    initiator_nonce: B256,           // 랜덤 nonce
    version: u8,                     // RLPx v4 = 4
}

// Step 2: AuthAck 메시지 (서버 → 클라이언트)
// ECIES(client_pubkey, auth_ack_body)
struct AuthAckBody {
    recipient_ephemeral_pubkey: PublicKey,  // 서버의 ephemeral key
    recipient_nonce: B256,
    version: u8,
}

// Step 3: Session key 유도 (양쪽 독립 수행)
// - ephemeral_shared_secret = ECDH(client_ephemeral, server_ephemeral)
// - shared_secret = keccak256(ephemeral_shared_secret ‖ keccak256(nonces))
// - aes_secret = keccak256(ephemeral_shared_secret ‖ shared_secret)
// - mac_secret = keccak256(ephemeral_shared_secret ‖ aes_secret)

// Step 4: 암호화 채널 활성화
// - AES-CTR-256 for payload encryption
// - HMAC-SHA256 for MAC

// Forward secrecy:
// - ephemeral key는 세션 종료 시 폐기
// - 장기 키 유출되어도 과거 세션 복호화 불가

// 성능:
// handshake 1회 ~수 ms
// 이후 메시지 암/복호화: ~마이크로초 단위`}
        </pre>
        <p className="leading-7">
          RLPx v4가 <strong>forward secrecy + 인증</strong> 제공.<br />
          ECIES(Elliptic Curve Integrated Encryption Scheme)로 초기 키 교환 → AES-CTR 스트리밍.<br />
          ephemeral key 사용으로 장기 키 유출 시에도 과거 세션 보호.
        </p>

        {/* ── select! 이벤트 루프 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">tokio select! — 다중 이벤트 처리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// SessionManager의 메인 이벤트 루프
async fn run(&mut self) {
    loop {
        tokio::select! {
            // 새 인바운드 연결
            Ok((stream, _)) = self.listener.accept() => {
                self.handle_incoming(stream).await;
            }
            // 아웃바운드 연결 요청 완료
            Some(stream) = self.dial_tasks.next() => {
                self.handle_outgoing(stream?).await;
            }
            // 기존 세션의 메시지 수신
            Some((peer_id, msg)) = self.active_sessions.next() => {
                self.handle_session_message(peer_id, msg).await;
            }
            // 피어 관리 명령 (추가/삭제)
            Some(cmd) = self.commands.recv() => {
                self.handle_command(cmd).await;
            }
            // 주기적 keepalive
            _ = self.ping_interval.tick() => {
                self.send_pings().await;
            }
        }
    }
}

// select!의 작동:
// 1. 모든 branches를 병렬로 polling
// 2. 먼저 ready된 branch 선택 (랜덤 tie-break)
// 3. 나머지 branches는 다음 루프에서 재검사
// 4. 모두 pending이면 스레드 yield (epoll)

// 이점:
// - 수천 세션을 단일 스레드가 관리
// - fairness 보장 (한 연결이 독점 불가)
// - lock-free (HashMap만 스레드 로컬)`}
        </pre>
        <p className="leading-7">
          <code>tokio::select!</code>가 <strong>비동기 이벤트 멀티플렉싱</strong>의 핵심.<br />
          여러 Future 중 먼저 완료되는 것을 선택 → 모든 세션이 공평하게 처리됨.<br />
          OS의 epoll/kqueue과 tokio의 task scheduler가 결합하여 수천 연결을 1개 스레드로 관리.
        </p>

        {/* ── Reputation 시스템 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Peer Reputation — 악의적 피어 차단</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pub struct PeerScore {
    pub reputation: i32,  // -1000 ~ +1000
    pub last_seen: Instant,
    pub connection_count: u32,
    pub error_count: u32,
}

// Reputation 조정 규칙:
impl PeerScore {
    fn on_successful_response(&mut self) {
        self.reputation = (self.reputation + 10).min(1000);
    }

    fn on_invalid_header(&mut self) {
        self.reputation -= 100;
    }

    fn on_protocol_violation(&mut self) {
        self.reputation -= 500;  // 심각한 위반
    }

    fn on_timeout(&mut self) {
        self.reputation -= 10;
    }
}

// 차단 정책:
const BAN_THRESHOLD: i32 = -1000;
const BAN_DURATION: Duration = Duration::from_secs(3600);  // 1시간

fn handle_peer_event(&mut self, peer: &PeerId, event: PeerEvent) {
    let score = self.scores.entry(*peer).or_default();
    match event {
        PeerEvent::BadHeader => score.on_invalid_header(),
        PeerEvent::Timeout => score.on_timeout(),
        // ...
    }

    if score.reputation <= BAN_THRESHOLD {
        self.ban_peer(peer, BAN_DURATION);
    }
}

// 시나리오:
// - 정직한 피어: 시간 경과로 reputation 증가
// - 가끔 실수: timeout 몇 번은 복구 가능
// - 악의적 공격: 10회 protocol violation → BAN (1시간)`}
        </pre>
        <p className="leading-7">
          <strong>Reputation 시스템</strong>으로 네트워크 품질 유지.<br />
          각 피어의 행동을 점수화 → 악의적 피어 자동 차단.<br />
          위반 심각도에 따라 차등 감점 (protocol violation &gt; header 오류 &gt; timeout).
        </p>
      </div>

      {/* Session state machine cards */}
      <div className="not-prose flex gap-3 mb-4">
        {SESSION_STATES.map(s => (
          <button key={s.id}
            onClick={() => setActiveState(activeState === s.id ? null : s.id)}
            className="flex-1 rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: activeState === s.id ? s.color : 'var(--color-border)',
              background: activeState === s.id ? `${s.color}10` : undefined,
            }}>
            <p className="font-mono font-bold text-sm" style={{ color: s.color }}>{s.label}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-4 overflow-hidden">
            <p className="font-semibold text-sm mb-2" style={{ color: sel.color }}>{sel.label}</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{sel.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Geth vs Reth comparison */}
      <div className="not-prose overflow-x-auto mb-4">
        <table className="min-w-full text-sm border border-border">
          <thead><tr className="bg-muted">
            <th className="border border-border px-4 py-2 text-left">항목</th>
            <th className="border border-border px-4 py-2 text-left">Geth</th>
            <th className="border border-border px-4 py-2 text-left">Reth</th>
          </tr></thead>
          <tbody>
            {GETH_VS_RETH.map(r => (
              <tr key={r.aspect}>
                <td className="border border-border px-4 py-2 font-medium">{r.aspect}</td>
                <td className="border border-border px-4 py-2">{r.geth}</td>
                <td className="border border-border px-4 py-2">{r.reth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>max_sessions 제한</strong> — 기본 100으로 설정.
          피어 수가 많을수록 대역폭과 메모리가 비례 증가하므로, 노드 사양에 맞게 조절한다.
        </p>
      </div>
    </section>
  );
}
