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
        <div className="not-prose space-y-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-blue-500 mb-2">Step 1: Auth (클라이언트 → 서버)</p>
              <p className="text-sm text-foreground/80">ECIES(<code>server_pubkey</code>, auth_body) 전송.</p>
              <ul className="text-sm text-foreground/70 mt-1 space-y-0.5">
                <li><code>signature: Signature</code> — ECDSA 서명</li>
                <li><code>initiator_pubkey: PublicKey</code></li>
                <li><code>initiator_nonce: B256</code></li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-green-500 mb-2">Step 2: AuthAck (서버 → 클라이언트)</p>
              <p className="text-sm text-foreground/80">ECIES(<code>client_pubkey</code>, auth_ack) 응답.</p>
              <ul className="text-sm text-foreground/70 mt-1 space-y-0.5">
                <li><code>recipient_ephemeral_pubkey: PublicKey</code></li>
                <li><code>recipient_nonce: B256</code></li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-purple-500 mb-2">Step 3: Session Key 유도</p>
              <p className="text-sm text-foreground/80">양쪽 독립 수행. ECDH(ephemeral keys) → <code>keccak256</code> 체인으로 <code>aes_secret</code>, <code>mac_secret</code> 도출.</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-orange-500 mb-2">Step 4: 암호화 채널</p>
              <p className="text-sm text-foreground/80">AES-CTR-256 payload 암호화 + HMAC-SHA256 MAC. handshake ~수 ms, 이후 암복호화 ~마이크로초.</p>
            </div>
          </div>
          <div className="rounded border border-amber-500/30 bg-amber-500/5 p-3">
            <p className="text-sm text-amber-600 dark:text-amber-400">Forward secrecy — ephemeral key는 세션 종료 시 폐기. 장기 키 유출되어도 과거 세션 복호화 불가.</p>
          </div>
        </div>
        <p className="leading-7">
          RLPx v4가 <strong>forward secrecy + 인증</strong> 제공.<br />
          ECIES(Elliptic Curve Integrated Encryption Scheme)로 초기 키 교환 → AES-CTR 스트리밍.<br />
          ephemeral key 사용으로 장기 키 유출 시에도 과거 세션 보호.
        </p>

        {/* ── select! 이벤트 루프 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">tokio select! — 다중 이벤트 처리</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 my-4">
          <p className="text-xs font-bold text-foreground/70 mb-3">tokio::select! 이벤트 루프</p>
          <div className="space-y-2 mb-3">
            <div className="flex gap-3 items-start text-sm border-l-2 border-blue-500/50 pl-3">
              <span className="font-mono text-xs text-blue-500 shrink-0">accept</span>
              <span className="text-foreground/80"><code>self.listener.accept()</code> — 새 인바운드 연결 수락</span>
            </div>
            <div className="flex gap-3 items-start text-sm border-l-2 border-green-500/50 pl-3">
              <span className="font-mono text-xs text-green-500 shrink-0">dial</span>
              <span className="text-foreground/80"><code>self.dial_tasks.next()</code> — 아웃바운드 연결 완료 처리</span>
            </div>
            <div className="flex gap-3 items-start text-sm border-l-2 border-purple-500/50 pl-3">
              <span className="font-mono text-xs text-purple-500 shrink-0">msg</span>
              <span className="text-foreground/80"><code>self.active_sessions.next()</code> — 기존 세션 메시지 수신</span>
            </div>
            <div className="flex gap-3 items-start text-sm border-l-2 border-orange-500/50 pl-3">
              <span className="font-mono text-xs text-orange-500 shrink-0">cmd</span>
              <span className="text-foreground/80"><code>self.commands.recv()</code> — 피어 관리 명령(추가/삭제)</span>
            </div>
            <div className="flex gap-3 items-start text-sm border-l-2 border-foreground/20 pl-3">
              <span className="font-mono text-xs text-foreground/50 shrink-0">ping</span>
              <span className="text-foreground/80"><code>self.ping_interval.tick()</code> — 주기적 keepalive</span>
            </div>
          </div>
          <p className="text-sm text-foreground/60">모든 branch 병렬 polling → 먼저 ready된 선택(랜덤 tie-break) → 나머지는 다음 루프. 수천 세션을 단일 스레드가 lock-free로 관리.</p>
        </div>
        <p className="leading-7">
          <code>tokio::select!</code>가 <strong>비동기 이벤트 멀티플렉싱</strong>의 핵심.<br />
          여러 Future 중 먼저 완료되는 것을 선택 → 모든 세션이 공평하게 처리됨.<br />
          OS의 epoll/kqueue과 tokio의 task scheduler가 결합하여 수천 연결을 1개 스레드로 관리.
        </p>

        {/* ── Reputation 시스템 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Peer Reputation — 악의적 피어 차단</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">PeerScore 구조체</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-foreground/80">
              <span><code>reputation: i32</code> — -1000 ~ +1000</span>
              <span><code>last_seen: Instant</code></span>
              <span><code>connection_count: u32</code></span>
              <span><code>error_count: u32</code></span>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">Reputation 조정 규칙</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-foreground/80"><span><code>on_successful_response</code></span><span className="text-green-500">+10</span></div>
              <div className="flex justify-between text-foreground/80"><span><code>on_timeout</code></span><span className="text-orange-500">-10</span></div>
              <div className="flex justify-between text-foreground/80"><span><code>on_invalid_header</code></span><span className="text-red-400">-100</span></div>
              <div className="flex justify-between text-foreground/80"><span><code>on_protocol_violation</code></span><span className="text-red-500">-500</span></div>
            </div>
            <p className="text-sm text-foreground/60 mt-2">
              <code>BAN_THRESHOLD</code>: -1000 / <code>BAN_DURATION</code>: 1시간. 10회 protocol violation = 즉시 BAN.
            </p>
          </div>
        </div>
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
