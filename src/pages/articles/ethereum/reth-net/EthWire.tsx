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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`#[derive(RlpEncodable, RlpDecodable)]
pub enum EthMessage {
    // 연결 협상 (eth/68 Status)
    Status(Status),

    // 블록 동기화
    NewBlockHashes(NewBlockHashes),
    NewBlock(NewBlock),                        // PoS 이후 미사용
    GetBlockHeaders(GetBlockHeaders),
    BlockHeaders(BlockHeaders),
    GetBlockBodies(GetBlockBodies),
    BlockBodies(BlockBodies),

    // TX 전파 (eth/68)
    NewPooledTransactionHashes(NewPooledTransactionHashes68),
    GetPooledTransactions(GetPooledTransactions),
    PooledTransactions(PooledTransactions),
    Transactions(Transactions),  // 즉시 전송 (작은 TX만)

    // 영수증
    GetReceipts(GetReceipts),
    Receipts(Receipts),
}

// 각 메시지 TypeID (RLP envelope):
// 0x00: Status
// 0x01: NewBlockHashes
// 0x02: Transactions
// 0x03: GetBlockHeaders
// 0x04: BlockHeaders
// 0x05: GetBlockBodies
// 0x06: BlockBodies
// 0x07: NewBlock (legacy)
// 0x08: NewPooledTransactionHashes
// 0x09: GetPooledTransactions
// 0x0A: PooledTransactions
// 0x0F: GetReceipts
// 0x10: Receipts`}
        </pre>
        <p className="leading-7">
          <code>EthMessage</code>가 <strong>eth/68의 전체 통신 어휘</strong>.<br />
          12개 메시지 타입으로 동기화 + TX 전파 + 영수증 조회 모두 커버.<br />
          <code>#[derive(RlpEncodable)]</code>로 직렬화 자동 생성 — 수동 코드 0줄.
        </p>

        {/* ── eth/68 개선 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">eth/68 — NewPooledTransactionHashes 확장</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// eth/67 (2022)
pub struct NewPooledTransactionHashes67 {
    pub hashes: Vec<B256>,  // TX 해시만 전송
}
// 문제: 수신 노드가 TX 크기를 모름
// → 큰 blob TX도 일단 요청해야 함

// eth/68 (2023)
pub struct NewPooledTransactionHashes68 {
    pub types: Vec<u8>,      // TX 타입 (0=Legacy, 1=2930, 2=1559, 3=4844)
    pub sizes: Vec<u32>,     // TX 크기 (바이트)
    pub hashes: Vec<B256>,
}
// 해결: 타입 + 크기를 미리 알림
// → 수신 노드가 "blob TX는 건너뛰기" 등 선택적 수신 가능

// 대역폭 절감 예시:
// 10K TX hash 전파 중 100개가 blob TX (각 125KB)
// eth/67: 모두 요청 → 12.5 MB 다운로드
// eth/68: blob 건너뛰기 → 0 MB
// → 최대 100% 절감 (blob TX 비율 높을수록 효과 ↑)

// 실제 도입 효과:
// Cancun 포크 이후 blob TX 비율 증가
// eth/68이 대역폭 병목 완화에 결정적 기여`}
        </pre>
        <p className="leading-7">
          eth/68의 핵심 개선: <strong>TX 메타데이터 사전 제공</strong>.<br />
          수신 노드가 블록스페이스 예산에 따라 TX 선별 수신 가능.<br />
          Cancun 이후 blob TX 증가로 이 기능의 가치가 크게 부각.
        </p>

        {/* ── Status 메시지 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Status 메시지 — 연결 검증</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 연결 직후 양쪽이 Status 교환
pub struct Status {
    pub version: u8,           // eth/68 = 68
    pub chain: Chain,          // ChainId (mainnet=1, sepolia=11155111)
    pub total_difficulty: U256, // PoS 이후 고정값
    pub blockhash: B256,       // 현재 tip 해시
    pub genesis: B256,         // genesis 해시
    pub forkid: ForkId,        // EIP-2124 fork identifier
}

// 연결 검증 로직:
fn validate_peer_status(peer: &Status, local: &Status) -> Result<()> {
    // 1. chain_id 일치
    if peer.chain != local.chain {
        return Err(WrongChain);
    }

    // 2. genesis 일치
    if peer.genesis != local.genesis {
        return Err(WrongGenesis);
    }

    // 3. fork_id 호환성 (EIP-2124)
    //    둘 다 최신 포크를 알고 있는지
    if !peer.forkid.is_compatible_with(&local.forkid) {
        return Err(IncompatibleForks);
    }

    // 4. version 최소 지원
    if peer.version < 66 {
        return Err(VersionTooOld);
    }

    Ok(())
}

// 실패 시 Disconnect 메시지 전송 후 연결 종료
// 성공 시 정식 통신 시작`}
        </pre>
        <p className="leading-7">
          <strong>Status 검증</strong>이 잘못된 네트워크/체인 연결 즉시 차단.<br />
          chain_id, genesis_hash, fork_id 3중 검사 → 다른 체인 피어는 확실히 거부.<br />
          이 단계 통과 후에만 블록/TX 메시지 교환 허용.
        </p>

        {/* ── TX 브로드캐스트 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">TX 전파 — 3가지 방식</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// TX 전파 전략 (크기별)
//
// 1. Transactions (직접 전송)
//    - 작은 TX (< 100KB)
//    - 피어에게 TX 본체 직접 발송
//    - 지연 최소, 대역폭 높음
//
// 2. NewPooledTransactionHashes (해시 알림)
//    - 큰 TX (>= 100KB, blob TX 등)
//    - 해시 + 타입 + 크기만 먼저 알림
//    - 피어가 GetPooledTransactions로 요청
//    - 지연 약간 증가, 대역폭 절약

// 전파 알고리즘 (txpool):
fn propagate_tx(tx: &TransactionSigned) {
    let tx_size = tx.size();

    // sqrt(peer_count)만큼의 피어에게 직접 전송
    let direct_count = (self.peers.len() as f64).sqrt() as usize;
    let direct_peers = self.peers.choose_multiple(direct_count);

    if tx_size < SMALL_TX_THRESHOLD {
        // 직접 전송
        for peer in direct_peers {
            peer.send(EthMessage::Transactions(vec![tx.clone()]));
        }
    } else {
        // 해시 알림만
        let announcement = NewPooledTransactionHashes68 {
            types: vec![tx.tx_type()],
            sizes: vec![tx_size as u32],
            hashes: vec![tx.hash()],
        };
        for peer in direct_peers {
            peer.send(EthMessage::NewPooledTransactionHashes(announcement.clone()));
        }
    }

    // 나머지 피어에게는 해시만 (지연 방지)
    let hash_only = self.peers.iter().filter(|p| !direct_peers.contains(p));
    for peer in hash_only {
        peer.send_announcement(tx);
    }
}

// sqrt(N) 알고리즘:
// - 100 피어 → 10 피어에 직접 전송
// - 1000 피어 → 32 피어에 직접 전송
// - 네트워크 전파 속도 vs 대역폭 균형`}
        </pre>
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
