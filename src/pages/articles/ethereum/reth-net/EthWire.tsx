import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { ETH_MESSAGES, BROADCAST_TYPES } from './EthWireData';

export default function EthWire({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = ETH_MESSAGES.find(m => m.id === selected);

  return (
    <section id="eth-wire" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">eth-wire 프로토콜 메시지</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('net-eth-wire', codeRefs['net-eth-wire'])} />
          <span className="text-[10px] text-muted-foreground self-center">EthMessage enum</span>
        </div>
        <p className="leading-7">
          <strong>EthMessage</strong> enum은 eth/68 프로토콜의 전체 메시지를 정의한다.<br />
          RLP 인코딩/디코딩을 derive 매크로로 자동 지원하여, 직렬화 코드를 수동으로 작성할 필요가 없다.
        </p>
        <p className="leading-7">
          eth 프로토콜은 요청-응답 쌍과 브로드캐스트 메시지로 구분된다.<br />
          요청-응답은 동기화에, 브로드캐스트는 새 블록/TX 전파에 사용한다.
        </p>

        {/* ── EthMessage enum ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">EthMessage enum — 전체 메시지 타입</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">EthMessage enum <span className="font-normal text-foreground/50">#[derive(RlpEncodable, RlpDecodable)]</span></p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-blue-500 font-semibold mb-1">연결 협상</p>
                <p className="text-sm text-foreground/80"><code>Status(Status)</code></p>
              </div>
              <div>
                <p className="text-xs text-green-500 font-semibold mb-1">블록 동기화</p>
                <div className="text-sm text-foreground/80 space-y-0.5">
                  <p><code>NewBlockHashes</code>, <code>NewBlock</code></p>
                  <p><code>GetBlockHeaders</code> / <code>BlockHeaders</code></p>
                  <p><code>GetBlockBodies</code> / <code>BlockBodies</code></p>
                </div>
              </div>
              <div>
                <p className="text-xs text-purple-500 font-semibold mb-1">TX 전파</p>
                <div className="text-sm text-foreground/80 space-y-0.5">
                  <p><code>NewPooledTransactionHashes68</code></p>
                  <p><code>GetPooledTransactions</code> / <code>PooledTransactions</code></p>
                  <p><code>Transactions</code> (즉시 전송)</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-foreground/60 mt-2">영수증: <code>GetReceipts</code> / <code>Receipts</code>. 총 12개 메시지 타입(TypeID <code>0x00</code>~<code>0x10</code>).</p>
          </div>
        </div>
        <p className="leading-7">
          <code>EthMessage</code>가 <strong>eth/68의 전체 통신 어휘</strong>.<br />
          12개 메시지 타입으로 동기화 + TX 전파 + 영수증 조회 모두 커버.<br />
          <code>#[derive(RlpEncodable)]</code>로 직렬화 자동 생성 — 수동 코드 0줄.
        </p>

        {/* ── eth/68 개선 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">eth/68 — NewPooledTransactionHashes 확장</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
              <p className="text-xs font-bold text-red-400 mb-2">eth/67 (2022)</p>
              <p className="text-sm text-foreground/80"><code>NewPooledTransactionHashes67</code></p>
              <p className="text-sm text-foreground/70 mt-1"><code>hashes: Vec&lt;B256&gt;</code> — TX 해시만 전송. 수신 노드가 TX 크기를 모름 → 큰 blob TX도 일단 요청 필요.</p>
            </div>
            <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
              <p className="text-xs font-bold text-green-500 mb-2">eth/68 (2023)</p>
              <p className="text-sm text-foreground/80"><code>NewPooledTransactionHashes68</code></p>
              <ul className="text-sm text-foreground/70 mt-1 space-y-0.5">
                <li><code>types: Vec&lt;u8&gt;</code> — TX 타입(0=Legacy, 2=1559, 3=4844)</li>
                <li><code>sizes: Vec&lt;u32&gt;</code> — TX 크기(바이트)</li>
                <li><code>hashes: Vec&lt;B256&gt;</code></li>
              </ul>
            </div>
          </div>
          <div className="rounded border border-border/40 bg-muted/20 p-3 text-sm text-foreground/70">
            대역폭 절감 예: 10K TX 중 100개 blob TX(각 125KB) → eth/67: 12.5 MB 다운로드 / eth/68: blob 건너뛰기 = 0 MB. Cancun 포크 이후 blob TX 증가로 결정적 기여.
          </div>
        </div>
        <p className="leading-7">
          eth/68의 핵심 개선: <strong>TX 메타데이터 사전 제공</strong>.<br />
          수신 노드가 블록스페이스 예산에 따라 TX 선별 수신 가능.<br />
          Cancun 이후 blob TX 증가로 이 기능의 가치가 크게 부각.
        </p>

        {/* ── Status 메시지 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Status 메시지 — 연결 검증</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">Status 구조체</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-foreground/80">
              <span><code>version: u8</code> — eth/68 = 68</span>
              <span><code>chain: Chain</code> — mainnet=1, sepolia=11155111</span>
              <span><code>total_difficulty: U256</code> — PoS 이후 고정값</span>
              <span><code>blockhash: B256</code> — 현재 tip 해시</span>
              <span><code>genesis: B256</code> — genesis 해시</span>
              <span><code>forkid: ForkId</code> — EIP-2124</span>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">validate_peer_status — 4단계 검증</p>
            <div className="space-y-1 text-sm">
              <div className="flex gap-2 text-foreground/80"><span className="text-foreground/50 shrink-0">1.</span> <code>chain_id</code> 일치 확인 → 불일치 시 <code>WrongChain</code></div>
              <div className="flex gap-2 text-foreground/80"><span className="text-foreground/50 shrink-0">2.</span> <code>genesis</code> 해시 일치 → 불일치 시 <code>WrongGenesis</code></div>
              <div className="flex gap-2 text-foreground/80"><span className="text-foreground/50 shrink-0">3.</span> <code>forkid</code> 호환성(EIP-2124) → 불일치 시 <code>IncompatibleForks</code></div>
              <div className="flex gap-2 text-foreground/80"><span className="text-foreground/50 shrink-0">4.</span> <code>version &gt;= 66</code> 확인 → 미달 시 <code>VersionTooOld</code></div>
            </div>
            <p className="text-sm text-foreground/60 mt-2">실패 시 <code>Disconnect</code> 전송 후 연결 종료. 성공 시 정식 통신 시작.</p>
          </div>
        </div>
        <p className="leading-7">
          <strong>Status 검증</strong>이 잘못된 네트워크/체인 연결 즉시 차단.<br />
          chain_id, genesis_hash, fork_id 3중 검사 → 다른 체인 피어는 확실히 거부.<br />
          이 단계 통과 후에만 블록/TX 메시지 교환 허용.
        </p>

        {/* ── TX 브로드캐스트 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">TX 전파 — 3가지 방식</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-blue-500 mb-2">Transactions (직접 전송)</p>
              <p className="text-sm text-foreground/80">작은 TX(&lt; 100KB). 피어에게 TX 본체 직접 발송. 지연 최소, 대역폭 높음.</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-green-500 mb-2">NewPooledTransactionHashes (해시 알림)</p>
              <p className="text-sm text-foreground/80">큰 TX(&gt;= 100KB, blob TX). 해시+타입+크기만 알림 → 피어가 <code>GetPooledTransactions</code>로 요청.</p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">propagate_tx — sqrt(N) 전파 알고리즘</p>
            <p className="text-sm text-foreground/80 mb-2">
              <code>sqrt(peer_count)</code>만큼의 피어에게 직접 전송. 나머지는 해시 알림만.
            </p>
            <div className="grid grid-cols-3 gap-2 text-sm text-center">
              <div className="rounded border border-border/40 p-2">
                <p className="text-foreground/70">100 피어</p>
                <p className="text-foreground/50">→ 10 직접</p>
              </div>
              <div className="rounded border border-border/40 p-2">
                <p className="text-foreground/70">1000 피어</p>
                <p className="text-foreground/50">→ 32 직접</p>
              </div>
              <div className="rounded border border-border/40 p-2">
                <p className="text-foreground/70">목적</p>
                <p className="text-foreground/50">전파 속도 vs 대역폭</p>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          TX 전파는 <strong>sqrt(peer_count) 피어에게 직접</strong>, 나머지는 해시 알림.<br />
          이 알고리즘이 네트워크 전파 속도와 대역폭의 최적 지점.<br />
          blob TX 등 대형 TX는 항상 해시 알림 방식 사용.
        </p>
      </div>

      {/* Request-Response message pairs */}
      <h3 className="text-lg font-semibold mb-3">요청-응답 메시지 쌍</h3>
      <div className="not-prose grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {ETH_MESSAGES.map(m => (
          <button key={m.id}
            onClick={() => setSelected(selected === m.id ? null : m.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: selected === m.id ? m.color : 'var(--color-border)',
              background: selected === m.id ? `${m.color}10` : undefined,
            }}>
            <p className="font-mono text-xs font-bold" style={{ color: m.color }}>{m.request}</p>
            <p className="text-xs text-foreground/50 mt-0.5">{m.purpose}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <div className="flex gap-2 items-center mb-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ background: `${sel.color}20`, color: sel.color }}>{sel.request}</span>
              <span className="text-foreground/40">&#8594;</span>
              <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ background: `${sel.color}20`, color: sel.color }}>{sel.response}</span>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">{sel.details}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Broadcast messages */}
      <h3 className="text-lg font-semibold mb-3">브로드캐스트 메시지</h3>
      <div className="not-prose space-y-2 mb-4">
        {BROADCAST_TYPES.map(b => (
          <div key={b.name} className="flex gap-3 items-start text-sm border-l-2 border-border pl-3">
            <span className="font-mono text-xs text-foreground/70 shrink-0 w-56">{b.name}</span>
            <span className="text-foreground/80">{b.desc}</span>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>eth/68 핵심 개선</strong> — NewPooledTransactionHashes에 TX 타입 + 크기가 추가되었다.<br />
          수신 노드가 blob TX(최대 ~125KB)를 건너뛰고 필요한 TX만 요청하여 대역폭을 최대 50% 절감한다.
        </p>
      </div>
    </section>
  );
}
