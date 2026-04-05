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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 계층 1: UDP Discovery (피어 발견)
//   discv4 (legacy) / discv5 (현재)
//   - Kademlia DHT 기반
//   - 노드 ID (public key) 공간에서 가까운 노드 탐색
//   - ENR(Ethereum Node Record) 교환

// 계층 2: RLPx TCP transport (암호화 채널)
//   ECIES handshake → ECDSA authentication
//   - AES-CTR + HMAC-SHA256 암호화
//   - ephemeral key exchange (forward secrecy)
//   - message framing (기반 프레임 형식)

// 계층 3: P2P 프로토콜 (서브프로토콜 협상)
//   - Hello/Disconnect/Ping/Pong 메시지
//   - capability 협상 (eth/68, snap/1, les/4 등)
//   - shared capability로 통신 결정

// 계층 4: eth/68 subprotocol (이더리움 메시지)
//   - GetBlockHeaders, BlockHeaders
//   - GetBlockBodies, BlockBodies
//   - NewPooledTransactionHashes
//   - GetPooledTransactions, PooledTransactions
//   - NewBlock, NewBlockHashes

// NetworkManager: 4계층을 모두 조정하는 최상위
// - 연결 pool 관리 (max_peers: 기본 100)
// - reputation tracking
// - rate limiting`}
        </pre>
        <p className="leading-7">
          devp2p는 <strong>4계층 독립적 설계</strong>.<br />
          각 계층이 자기 역할만 담당 — Discovery는 피어 찾기, RLPx는 암호화, P2P는 서브프로토콜 협상, eth는 실제 이더리움 통신.<br />
          layer 간 느슨한 결합 → eth/69, snap/1 같은 서브프로토콜 추가 용이.
        </p>

        {/* ── tokio 비동기 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">tokio 기반 비동기 네트워킹</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// tokio 런타임: single-threaded event loop + multi-threaded executor
#[tokio::main]
async fn main() {
    // NetworkManager는 Future → tokio task로 실행
    let network = NetworkManager::new(config).await?;
    tokio::spawn(network.run());

    // 수천 개 연결을 하나의 이벤트 루프가 처리
    // epoll(Linux) / kqueue(BSD/Mac) / IOCP(Windows)
}

// 메모리 비교:
// Geth (Go goroutine):
//   - 각 연결당 goroutine: ~8KB stack
//   - 100 피어 × 8KB = 800KB (per goroutine)
//   - goroutine 스케줄링 오버헤드
//
// Reth (tokio task):
//   - 각 연결당 task: ~수백 바이트 (state machine)
//   - 100 피어 × ~200B = ~20KB
//   - epoll이 OS 수준 I/O multiplexing

// 메모리 효율: ~40배 차이 (100 피어 기준)
// 확장성: 1000+ 피어도 큰 부담 없음

// 비동기 메시지 처리 예시:
async fn handle_peer(mut stream: Framed<TcpStream, EthCodec>) {
    while let Some(msg) = stream.next().await {
        match msg? {
            EthMessage::GetBlockHeaders(req) => {
                let headers = load_headers(req)?;
                stream.send(BlockHeaders(headers)).await?;
            }
            // ...
        }
    }
}`}
        </pre>
        <p className="leading-7">
          tokio의 비동기 모델이 <strong>고밀도 연결</strong> 처리의 핵심.<br />
          Go goroutine 대비 ~40배 메모리 효율 — 동일 머신에서 더 많은 피어 유지.<br />
          epoll/kqueue 덕분에 CPU 사용률도 낮음 — 유휴 연결은 커널 수준에서 대기.
        </p>

        {/* ── capability 협상 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Capability 협상 — 피어 호환성 결정</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 연결 시작 시 Hello 메시지 교환
struct Hello {
    protocol_version: u8,  // devp2p 버전 (현재 5)
    client_id: String,     // "reth/v1.0.0" 등
    capabilities: Vec<Capability>,  // 지원 프로토콜 목록
    listen_port: u16,
    node_id: B512,
}

struct Capability {
    name: String,  // "eth", "snap", "les"
    version: u32,  // 프로토콜 버전
}

// 상대방 capabilities와 교집합 찾기
// 예시:
//   내 capabilities: [("eth", 68), ("snap", 1)]
//   상대 capabilities: [("eth", 67), ("eth", 68), ("snap", 1)]
//   교집합: [("eth", 68), ("snap", 1)]
//   → eth/68 + snap/1 프로토콜 활성화

// capability 없으면 연결 해제:
// - eth/67 이하만 지원하는 구식 노드는 연결 차단
// - 일치 없으면 Disconnect(ProtocolMismatch)

// 이더리움 프로토콜 버전 진화:
// eth/62 ~ eth/66: legacy
// eth/67: NewPooledTransactionHashes 필드 확장
// eth/68: metadata 필드 추가 (2023)
// eth/69: blob transactions 지원 예정

// Reth는 eth/68 기본, eth/67 backward compat`}
        </pre>
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
