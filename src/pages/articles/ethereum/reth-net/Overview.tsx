import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextViz from './viz/ContextViz';
import NetworkStackViz from './viz/NetworkStackViz';
import type { CodeRef } from '@/components/code/types';
import { NET_LAYERS } from './OverviewData';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = NET_LAYERS.find(l => l.id === selected);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">네트워크 스택</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          이더리움 노드는 DevP2P라는 자체 네트워킹 스택을 사용한다.<br />
          libp2p(Polkadot, Filecoin 등이 채택)와 달리, 이더리움은 2015년부터 독자 프로토콜을 운영해왔다.
        </p>
        <p className="leading-7">
          Reth는 이 DevP2P 스택을 Rust의 tokio 비동기 런타임 위에 재구현했다.<br />
          Geth가 연결마다 goroutine을 생성하는 반면, Reth는 epoll/kqueue 기반 단일 이벤트 루프로 수천 세션을 처리한다.<br />
          결과적으로 동일 피어 수 대비 메모리 사용량이 크게 줄어든다.
        </p>
        <p className="leading-7">
          네트워크 스택은 4개 계층으로 구성된다.<br />
          아래 카드를 클릭하면 각 계층의 역할과 설계 판단을 확인할 수 있다.
        </p>

        {/* ── devp2p 4계층 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">devp2p 4계층 구조</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-blue-500 mb-2">계층 1: UDP Discovery</p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              <code>discv4</code>(legacy) / <code>discv5</code>(현재) — Kademlia DHT 기반으로 노드 ID(public key) 공간에서 가까운 노드 탐색. <code>ENR</code>(Ethereum Node Record) 교환.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-green-500 mb-2">계층 2: RLPx TCP Transport</p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              ECIES handshake + ECDSA 인증. AES-CTR + HMAC-SHA256 암호화, ephemeral key exchange(forward secrecy), message framing 제공.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-purple-500 mb-2">계층 3: P2P 프로토콜</p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              Hello/Disconnect/Ping/Pong 메시지. <code>Capability</code> 협상(<code>eth/68</code>, <code>snap/1</code>, <code>les/4</code> 등)으로 통신 결정.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-orange-500 mb-2">계층 4: eth/68 Subprotocol</p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              <code>GetBlockHeaders</code>/<code>BlockHeaders</code>, <code>GetBlockBodies</code>/<code>BlockBodies</code>, <code>NewPooledTransactionHashes</code>, <code>NewBlock</code> 등 이더리움 메시지.
            </p>
          </div>
        </div>
        <div className="not-prose rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 my-4">
          <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">NetworkManager</p>
          <p className="text-sm text-foreground/80">4계층을 모두 조정하는 최상위 구조체. 연결 pool 관리(<code>max_peers</code>: 기본 100), reputation tracking, rate limiting 담당.</p>
        </div>
        <p className="leading-7">
          devp2p는 <strong>4계층 독립적 설계</strong>.<br />
          각 계층이 자기 역할만 담당 — Discovery는 피어 찾기, RLPx는 암호화, P2P는 서브프로토콜 협상, eth는 실제 이더리움 통신.<br />
          layer 간 느슨한 결합 → eth/69, snap/1 같은 서브프로토콜 추가 용이.
        </p>

        {/* ── tokio 비동기 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">tokio 기반 비동기 네트워킹</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 my-4">
          <p className="text-xs font-bold text-foreground/70 mb-3">tokio 비동기 구조</p>
          <p className="text-sm text-foreground/80 mb-3">
            <code>NetworkManager</code>는 <code>Future</code>로 tokio task에서 실행. <code>tokio::spawn(network.run())</code>으로 비동기 시작. epoll(Linux) / kqueue(BSD) / IOCP(Windows)로 수천 연결 처리.
          </p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="rounded border border-border/40 p-3">
              <p className="text-xs font-bold text-red-400 mb-1">Geth (Go goroutine)</p>
              <p className="text-sm text-foreground/70">연결당 ~8KB stack. 100 피어 = 800KB. goroutine 스케줄링 오버헤드.</p>
            </div>
            <div className="rounded border border-border/40 p-3">
              <p className="text-xs font-bold text-green-400 mb-1">Reth (tokio task)</p>
              <p className="text-sm text-foreground/70">연결당 ~200B(state machine). 100 피어 = ~20KB. epoll 기반 I/O multiplexing.</p>
            </div>
          </div>
          <p className="text-sm text-amber-600 dark:text-amber-400">메모리 효율 ~40배 차이(100 피어 기준). 1000+ 피어도 큰 부담 없음.</p>
        </div>
        <p className="leading-7">
          tokio의 비동기 모델이 <strong>고밀도 연결</strong> 처리의 핵심.<br />
          Go goroutine 대비 ~40배 메모리 효율 — 동일 머신에서 더 많은 피어 유지.<br />
          epoll/kqueue 덕분에 CPU 사용률도 낮음 — 유휴 연결은 커널 수준에서 대기.
        </p>

        {/* ── capability 협상 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Capability 협상 — 피어 호환성 결정</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">Hello 구조체</p>
              <ul className="text-sm text-foreground/80 space-y-1">
                <li><code>protocol_version: u8</code> — devp2p 버전(현재 5)</li>
                <li><code>client_id: String</code> — "reth/v1.0.0" 등</li>
                <li><code>capabilities: Vec&lt;Capability&gt;</code> — 지원 프로토콜 목록</li>
                <li><code>listen_port: u16</code>, <code>node_id: B512</code></li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">Capability 구조체</p>
              <ul className="text-sm text-foreground/80 space-y-1">
                <li><code>name: String</code> — "eth", "snap", "les"</li>
                <li><code>version: u32</code> — 프로토콜 버전</li>
              </ul>
              <p className="text-sm text-foreground/60 mt-2">상대방 capabilities 교집합 계산. 일치 없으면 <code>Disconnect(ProtocolMismatch)</code>.</p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">프로토콜 버전 진화</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
              <div className="text-foreground/60"><code>eth/62~66</code> legacy</div>
              <div className="text-foreground/60"><code>eth/67</code> TX 해시 확장</div>
              <div className="text-foreground/60"><code>eth/68</code> metadata 추가(2023)</div>
              <div className="text-foreground/60"><code>eth/69</code> blob TX 예정</div>
            </div>
            <p className="text-sm text-foreground/60 mt-2">Reth는 <code>eth/68</code> 기본, <code>eth/67</code> backward compat.</p>
          </div>
        </div>
        <p className="leading-7">
          <strong>Capability 협상</strong>이 devp2p의 확장성 — 새 프로토콜을 기존 연결에 추가 가능.<br />
          eth/68과 snap/1이 동일 TCP 연결에서 동시 동작 — 한 피어로 여러 기능 활용.<br />
          구식 피어와도 공통 capability로 부분 통신 가능.
        </p>
      </div>

      <div className="not-prose grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {NET_LAYERS.map(l => (
          <button key={l.id}
            onClick={() => setSelected(selected === l.id ? null : l.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: selected === l.id ? l.color : 'var(--color-border)',
              background: selected === l.id ? `${l.color}10` : undefined,
            }}>
            <p className="font-mono font-bold text-sm" style={{ color: l.color }}>{l.label}</p>
            <p className="text-xs text-foreground/60 mt-1">{l.role}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-2" style={{ color: sel.color }}>{sel.label}</p>
            <p className="text-sm text-foreground/80 leading-relaxed mb-2">{sel.details}</p>
            <p className="text-sm text-amber-600 dark:text-amber-400 leading-relaxed">
              {sel.why}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="not-prose mt-6"><NetworkStackViz /></div>
    </section>
  );
}
