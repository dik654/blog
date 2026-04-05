import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function PayloadRetrieval({ onCodeRef }: Props) {
  return (
    <section id="payload-retrieval" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">GetPayload & MEV-Boost</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-2 mb-3">GetPayloadV3</h3>
        <p className="leading-7">
          ForkchoiceUpdated에서 받은 <code>payloadId</code>로 EL이 빌드한 페이로드를 회수한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('engine-get-payload', codeRefs['engine-get-payload'])} />
          <span className="text-[10px] text-muted-foreground self-center">GetPayload()</span>
        </div>

        {/* ── GetPayloadV3 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">engine_getPayloadV3 — 응답 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Request:
{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "engine_getPayloadV3",
    "params": ["0x..."]  // payload_id
}

// Response (Deneb):
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "executionPayload": {
            "parentHash": "0x...",
            "feeRecipient": "0x...",
            "stateRoot": "0x...",
            "receiptsRoot": "0x...",
            "logsBloom": "0x...",
            "prevRandao": "0x...",
            "blockNumber": "0x...",
            "gasLimit": "0x...",
            "gasUsed": "0x...",
            "timestamp": "0x...",
            "extraData": "0x...",
            "baseFeePerGas": "0x...",
            "blockHash": "0x...",
            "transactions": [ ... ],
            "withdrawals": [ ... ],
            "blobGasUsed": "0x...",
            "excessBlobGas": "0x..."
        },
        "blockValue": "0x...",           // validator 예상 수익 (wei)
        "blobsBundle": {                  // Deneb blob 데이터
            "commitments": [ ... ],
            "proofs": [ ... ],
            "blobs": [ ... ]
        },
        "shouldOverrideBuilder": false    // MEV-Boost override hint
    }
}

// Prysm의 처리:
// 1. 응답 수신 → ExecutionPayload 파싱
// 2. Beacon block에 payload 통합
// 3. blob sidecar 준비 (Deneb+)
// 4. validator의 BLS 서명 추가
// 5. SignedBeaconBlock 완성`}
        </pre>
        <p className="leading-7">
          <code>getPayloadV3</code>가 <strong>완성된 ExecutionPayload + 추가 정보</strong> 반환.<br />
          blockValue로 validator 예상 수익 공지.<br />
          blobsBundle (commitments/proofs/blobs) → sidecar에 저장.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">블록 조립 완료</h3>
        <ul>
          <li><strong>비콘 블록 헤더</strong> — slot, proposer_index, parent_root, state_root</li>
          <li><strong>실행 페이로드</strong> — GetPayload 또는 MEV-Boost에서 획득</li>
          <li><strong>BLS 서명</strong> — RANDAO reveal + 블록 서명</li>
        </ul>

        {/* ── MEV-Boost 비교 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">MEV-Boost 선택 — local vs relay bid</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Validator가 MEV-Boost 활성화 시 2개 후보 비교:
// 1. Local build (EL GetPayloadV3): local_payload + local_value
// 2. MEV-Boost relay: relay_payload_header + relay_bid

// Relay 요청 흐름:
// POST https://relay.flashbots.net/eth/v1/builder/header/{slot}/{parent_hash}/{pubkey}
// Response:
// - execution_payload_header (payload 없이 header만)
// - value (bid 금액)
// - pubkey (builder 공개키)

// 선택 로직:
func (v *validator) selectPayload(
    localPayload *ExecutionPayload,
    localValue *big.Int,
    relayHeader *ExecutionPayloadHeader,
    relayBid *big.Int,
) Selection {
    // 1. relay가 더 높으면 relay 선택
    if relayBid.Cmp(localValue) > 0 {
        return Selection{
            UseRelay: true,
            Header: relayHeader,
            Bid: relayBid,
        }
    }

    // 2. local이 더 높거나 같으면 local 선택
    return Selection{
        UseRelay: false,
        Payload: localPayload,
        Value: localValue,
    }
}

// Relay 선택 후 블록 완성:
// 1. validator가 header에 서명 (블록 서명)
// 2. relay에 signed_header POST
// 3. relay가 full payload 반환
// 4. validator가 block + payload 전파

// Local vs Relay 분포 (메인넷 2025):
// - ~90% relay (MEV 최적화)
// - ~10% local (solo staker, censorship-resistant)

// 수익 비교:
// - Local average: ~0.05 ETH per slot
// - Relay average: ~0.15 ETH per slot (3배)
// - Relay peak (airdrop): 10+ ETH per slot`}
        </pre>
        <p className="leading-7">
          Validator는 <strong>local vs relay bid 비교</strong>하여 더 높은 것 선택.<br />
          메인넷 90% validators가 MEV-Boost 사용 → 평균 3배 수익.<br />
          Relay가 full payload 전달 → validator가 서명 후 전파.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 MEV-Boost 비드 비교</strong> — MEV-Boost 릴레이에서도 페이로드 비드를 받음.<br />
          로컬 빌드 가치 vs 릴레이 비드 가치를 비교하여 더 높은 쪽 선택.<br />
          조립된 블록에 제안자 서명을 추가하고 GossipSub으로 전파.
        </p>
      </div>
    </section>
  );
}
