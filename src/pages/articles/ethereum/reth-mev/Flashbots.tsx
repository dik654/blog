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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Searcher → Builder 번들 전송
POST https://builder.flashbots.net/
Content-Type: application/json
X-Flashbots-Signature: <searcher_address>:<signature>

{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "eth_sendBundle",
  "params": [{
    "txs": [
      "0x02f86b...",  // TX 1 (serialized RLP)
      "0x02f86c...",  // TX 2
      "0x02f86d..."   // TX 3
    ],
    "blockNumber": "0x112abcd",      // 이 블록에만 포함
    "minTimestamp": 1720000000,       // 블록 ts 최소값
    "maxTimestamp": 1720010000,       // 블록 ts 최대값
    "revertingTxHashes": ["0xaaa..."] // 실패해도 OK인 TX
  }]
}

// Bundle 규칙:
// 1. 번들은 atomic — 전부 포함되거나 전부 빠짐
// 2. 순서 보장 — params.txs 순서대로 실행
// 3. 단일 블록 — specified block_number에만
// 4. failure tolerance — revertingTxHashes의 TX는 fail 허용

// 번들 수익 계산:
// builder_reward = sum(tx.gas_used × tx.priority_fee) +
//                   direct_coinbase_payment  // 끝 TX에서 block.coinbase로 전송
//
// Builder는 bundle 수익 기준으로 순위 매김
// 높은 수익 번들 우선 포함`}
        </pre>
        <p className="leading-7">
          <code>eth_sendBundle</code>이 <strong>MEV 번들 전송 표준</strong>.<br />
          원자성 보장 — "이 N개 TX가 모두 이 순서로 같은 블록에 포함되어야 함".<br />
          builder는 bundle 수익 계산 후 최고 수익 조합 선택.
        </p>

        {/* ── Builder API 흐름 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Builder API — validator ↔ relay 흐름</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 1. 등록 (노드 시작 시 1회)
POST /relay/v1/builder/validators
Body: [{
  "message": {
    "fee_recipient": "0x...",
    "gas_limit": "30000000",
    "timestamp": "...",
    "pubkey": "0x..."  // validator 공개키
  },
  "signature": "0x..."  // validator 서명
}]
// → relay가 validator 등록, 해당 slot에 block 제안 시 사용

// 2. Header 요청 (슬롯 시작 직전)
GET /relay/v1/builder/header/{slot}/{parent_hash}/{pubkey}
Response: {
  "version": "deneb",
  "data": {
    "message": {
      "header": { ... },           // ExecutionPayloadHeader
      "value": "100000000000000000", // bid 금액 (wei)
      "pubkey": "0x..."             // builder 공개키
    },
    "signature": "0x..."  // relay 서명
  }
}
// → validator가 최고 bid header 수신

// 3. Payload 요청 (header 서명 후)
POST /relay/v1/builder/blinded_blocks
Body: {
  "message": { ... signed block header ... },
  "signature": "0x..."  // validator 서명
}
Response: {
  "version": "deneb",
  "data": {
    "header": { ... },
    "transactions": [ ... ],       // 실제 TX들
    "withdrawals": [ ... ]
  }
}
// → validator가 full block 수신 → 네트워크 전파

// 타이밍:
// T=0s: 슬롯 시작
// T=0~4s: relay가 builder들로부터 입찰 수집
// T=4s: validator의 get_header 호출
// T=4.5s: validator의 get_payload 호출
// T=4.6s: validator가 block 전파`}
        </pre>
        <p className="leading-7">
          Builder API의 <strong>3단계 프로토콜</strong> — register → get_header → get_payload.<br />
          Blinded block 패턴으로 validator가 builder 블록 내용 모르고 서명.<br />
          서명 완료 시에만 payload 공개 → commit-reveal 방식.
        </p>

        {/* ── 다중 relay 전략 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">다중 Relay — 경쟁 입찰 극대화</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// MEV-Boost 클라이언트의 다중 relay 쿼리
struct MevBoostClient {
    relays: Vec<RelayUrl>,  // 5~10개 relay 연결
}

async fn get_best_bid(&self, slot: u64, parent: B256, pk: PublicKey) -> BestBid {
    // 모든 relay에 병렬 get_header
    let bids = join_all(
        self.relays.iter().map(|relay| {
            client.get_header(relay, slot, parent, pk).timeout(Duration::from_millis(950))
        })
    ).await;

    // 최고 bid 선택
    bids.into_iter()
        .filter_map(|b| b.ok())
        .max_by_key(|b| b.value)
        .expect("at least one relay must respond")
}

// 다중 relay의 이점:
// 1. 경쟁 입찰 → 더 높은 MEV 수익
// 2. relay 가용성 → 일부 down돼도 fallback
// 3. 검열 저항성 → 한 relay가 특정 TX 배제해도 다른 relay 사용

// 대표 relay들:
// - Flashbots: 가장 큰 점유율, OFAC 준수
// - Agnostic: censorship-resistant
// - Ultra Sound: free 서비스, 기본 채택
// - BloXroute: enterprise-grade

// 위험:
// - relay 검열: 특정 TX/주소 제외 → 탈중앙 위협
// - relay compromise: 잘못된 block 전달 → validator slash 위험
// - timeout: 950ms 이내 응답 안 오면 self-build fallback`}
        </pre>
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
