import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';
import { RELAY_ENDPOINTS } from './FlashbotsData';

export default function Flashbots({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeEndpoint, setActiveEndpoint] = useState<string | null>(null);
  const sel = RELAY_ENDPOINTS.find(e => e.id === activeEndpoint);

  return (
    <section id="flashbots" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Flashbots 릴레이 연동</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('relay-register', codeRefs['relay-register'])} />
          <span className="text-[10px] text-muted-foreground self-center">register_validator</span>
          <CodeViewButton onClick={() => onCodeRef('relay-get-header', codeRefs['relay-get-header'])} />
          <span className="text-[10px] text-muted-foreground self-center">get_header</span>
          <CodeViewButton onClick={() => onCodeRef('relay-get-payload', codeRefs['relay-get-payload'])} />
          <span className="text-[10px] text-muted-foreground self-center">get_payload</span>
        </div>
        <p className="leading-7">
          Reth의 RelayClient는 Flashbots Builder API 표준을 구현한다.<br />
          이 API는 REST 기반이므로, Flashbots, bloXroute, Aestus, Ultra Sound 등 어떤 릴레이든 동일 코드로 연동할 수 있다.
        </p>
        <p className="leading-7">
          <strong>Blinded Block 패턴</strong>이 핵심이다.<br />
          Proposer는 get_header로 블록 헤더(바디 없이)만 수신한다.<br />
          헤더에 서명한 후 get_payload로 실제 바디를 받는다.<br />
          이 순서 덕분에 빌더의 MEV 전략이 Proposer에게 노출되지 않는다.
        </p>

        {/* ── eth_sendBundle ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">eth_sendBundle — Flashbots Bundle Protocol</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">eth_sendBundle — Flashbots Bundle Protocol</p>
            <p className="text-sm text-foreground/80 mb-2">
              <code>POST builder.flashbots.net</code> / <code>X-Flashbots-Signature: &lt;address&gt;:&lt;sig&gt;</code>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-foreground/80">
              <span><code>txs: Vec&lt;Bytes&gt;</code> — serialized RLP TX 목록</span>
              <span><code>blockNumber</code> — 이 블록에만 포함</span>
              <span><code>minTimestamp</code> / <code>maxTimestamp</code></span>
              <span><code>revertingTxHashes</code> — 실패 허용 TX</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-2 text-foreground/60">atomic(전부 or 전무)</div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">순서 보장</div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">단일 블록 타겟</div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">failure tolerance</div>
          </div>
          <p className="text-sm text-foreground/60">수익 계산: <code>sum(gas_used x priority_fee) + direct coinbase_payment</code>. Builder가 수익 기준 번들 순위 매김.</p>
        </div>
        <p className="leading-7">
          <code>eth_sendBundle</code>이 <strong>MEV 번들 전송 표준</strong>.<br />
          원자성 보장 — "이 N개 TX가 모두 이 순서로 같은 블록에 포함되어야 함".<br />
          builder는 bundle 수익 계산 후 최고 수익 조합 선택.
        </p>

        {/* ── Builder API 흐름 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Builder API — validator ↔ relay 흐름</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-3">Builder API — 3단계 프로토콜</p>
            <div className="space-y-2 text-sm">
              <div className="flex gap-3 items-start border-l-2 border-blue-500/50 pl-3">
                <span className="font-mono text-xs text-blue-500 shrink-0">1</span>
                <div className="text-foreground/80"><code>POST /relay/v1/builder/validators</code> — validator 등록(시작 시 1회). <code>fee_recipient</code>, <code>pubkey</code>, validator 서명 포함.</div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-green-500/50 pl-3">
                <span className="font-mono text-xs text-green-500 shrink-0">2</span>
                <div className="text-foreground/80"><code>GET /relay/v1/builder/header/&#123;slot&#125;/&#123;parent_hash&#125;/&#123;pubkey&#125;</code> — 최고 bid header 수신. <code>value</code>(wei) + <code>ExecutionPayloadHeader</code>.</div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-purple-500/50 pl-3">
                <span className="font-mono text-xs text-purple-500 shrink-0">3</span>
                <div className="text-foreground/80"><code>POST /relay/v1/builder/blinded_blocks</code> — signed header 전송 → full block(transactions + withdrawals) 수신.</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-1.5"><p className="text-foreground/60">T=0s</p><p className="text-foreground/40">슬롯 시작</p></div>
            <div className="rounded border border-border/40 p-1.5"><p className="text-foreground/60">T=0~4s</p><p className="text-foreground/40">입찰 수집</p></div>
            <div className="rounded border border-border/40 p-1.5"><p className="text-foreground/60">T=4s</p><p className="text-foreground/40">get_header</p></div>
            <div className="rounded border border-border/40 p-1.5"><p className="text-foreground/60">T=4.5s</p><p className="text-foreground/40">get_payload</p></div>
          </div>
        </div>
        <p className="leading-7">
          Builder API의 <strong>3단계 프로토콜</strong> — register → get_header → get_payload.<br />
          Blinded block 패턴으로 validator가 builder 블록 내용 모르고 서명.<br />
          서명 완료 시에만 payload 공개 → commit-reveal 방식.
        </p>

        {/* ── 다중 relay 전략 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">다중 Relay — 경쟁 입찰 극대화</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">MevBoostClient — 다중 relay 경쟁 입찰</p>
            <p className="text-sm text-foreground/80 mb-2">
              <code>relays: Vec&lt;RelayUrl&gt;</code>(5~10개). 모든 relay에 <code>get_header</code> 병렬 전송(timeout 950ms) → <code>max_by_key(value)</code>로 최고 bid 선택.
            </p>
            <div className="grid grid-cols-3 gap-2 text-sm text-center mb-2">
              <div className="rounded border border-green-500/30 bg-green-500/5 p-2"><p className="text-xs text-green-500">경쟁 입찰</p><p className="text-xs text-foreground/50">더 높은 수익</p></div>
              <div className="rounded border border-blue-500/30 bg-blue-500/5 p-2"><p className="text-xs text-blue-500">가용성</p><p className="text-xs text-foreground/50">일부 down OK</p></div>
              <div className="rounded border border-purple-500/30 bg-purple-500/5 p-2"><p className="text-xs text-purple-500">검열 저항</p><p className="text-xs text-foreground/50">다른 relay 대체</p></div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-1.5 text-foreground/60">Flashbots (OFAC)</div>
            <div className="rounded border border-border/40 p-1.5 text-foreground/60">Agnostic (검열 저항)</div>
            <div className="rounded border border-border/40 p-1.5 text-foreground/60">Ultra Sound (free)</div>
            <div className="rounded border border-border/40 p-1.5 text-foreground/60">BloXroute (enterprise)</div>
          </div>
          <p className="text-sm text-foreground/60">위험: relay 검열(탈중앙 위협), compromise(slash 위험), timeout 950ms 초과 시 self-build fallback.</p>
        </div>
        <p className="leading-7">
          다중 relay로 <strong>경쟁 + 가용성</strong> 동시 확보.<br />
          950ms 타임아웃 — 시간 내 응답 없으면 self-build로 fallback.<br />
          relay 검열 리스크 — validator가 censorship-resistant relay 우선 사용 유도.
        </p>
      </div>

      {/* Relay endpoint cards */}
      <h3 className="text-lg font-semibold mb-3">Relay REST API</h3>
      <div className="not-prose space-y-2 mb-4">
        {RELAY_ENDPOINTS.map(e => (
          <button key={e.id}
            onClick={() => setActiveEndpoint(activeEndpoint === e.id ? null : e.id)}
            className="w-full text-left rounded-lg border p-3 transition-all duration-200 cursor-pointer"
            style={{
              borderColor: activeEndpoint === e.id ? e.color : 'var(--color-border)',
              background: activeEndpoint === e.id ? `${e.color}10` : undefined,
            }}>
            <div className="flex gap-3 items-center">
              <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-foreground/5" style={{ color: e.color }}>{e.method}</span>
              <span className="font-mono text-xs text-foreground/70">{e.endpoint}</span>
              <span className="text-xs text-foreground/40 ml-auto">{e.timing}</span>
            </div>
            <AnimatePresence>
              {activeEndpoint === e.id && sel && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.15 }}>
                  <p className="text-sm text-foreground/70 mt-2">{sel.desc}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>릴레이 다중화</strong> — RelayClient는 복수의 릴레이 URL을 설정할 수 있다.
          get_header 시 모든 릴레이에 동시 요청하여 가장 높은 입찰을 선택한다.<br />
          특정 릴레이가 다운되어도 나머지가 응답하면 MEV 수익 극대화를 유지한다.
        </p>
      </div>
    </section>
  );
}
