import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function NewPayload({ onCodeRef }: Props) {
  return (
    <section id="new-payload" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">NewPayload 호출</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-2 mb-3">호출 시점</h3>
        <p className="leading-7">
          비콘 블록 처리 중 <code>notifyNewPayload()</code>가 실행 페이로드를 추출하여 EL에 전달한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('engine-new-payload', codeRefs['engine-new-payload'])} />
          <span className="text-[10px] text-muted-foreground self-center">NewPayload()</span>
        </div>

        {/* ── newPayloadV3 request/response ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">engine_newPayloadV3 — 요청/응답 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// engine_newPayloadV3 request
// JSON-RPC 2.0 format

POST http://localhost:8551
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "engine_newPayloadV3",
    "params": [
        // 1. ExecutionPayload
        {
            "parentHash": "0x...",
            "feeRecipient": "0x...",
            "stateRoot": "0x...",
            "receiptsRoot": "0x...",
            "logsBloom": "0x...",
            "prevRandao": "0x...",
            "blockNumber": "0x12345",
            "gasLimit": "0x1c9c380",
            "gasUsed": "0x123456",
            "timestamp": "0x67890abc",
            "extraData": "0x",
            "baseFeePerGas": "0x1234",
            "blockHash": "0x...",
            "transactions": [ "0x...", "0x..." ],
            "withdrawals": [ ... ],
            "blobGasUsed": "0x20000",
            "excessBlobGas": "0x40000"
        },
        // 2. versionedHashes (blob commitments)
        ["0x01abc...", "0x01def..."],
        // 3. parentBeaconBlockRoot (EIP-4788)
        "0x..."
    ]
}

// Response:
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "status": "VALID",              // VALID / INVALID / SYNCING / ACCEPTED
        "latestValidHash": "0x...",     // 가장 최신 valid 블록
        "validationError": null          // INVALID 시 에러 메시지
    }
}

// 타임아웃: 8초
// 이보다 길면 CL이 EL 응답 포기 → optimistic 처리`}
        </pre>
        <p className="leading-7">
          newPayloadV3 요청이 <strong>3 파라미터 포함</strong>.<br />
          ExecutionPayload (블록) + versionedHashes (blob) + beaconRoot (EIP-4788).<br />
          응답은 4가지 상태 (VALID/INVALID/SYNCING/ACCEPTED).
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">요청 파라미터</h3>
        <ul>
          <li><strong>executionPayload</strong> — 트랜잭션, 상태 루트, 가스 정보</li>
          <li><strong>versionedHashes</strong> — Deneb blob KZG 커밋먼트 해시</li>
          <li><strong>parentBeaconBlockRoot</strong> — 부모 비콘 블록 루트</li>
        </ul>

        {/* ── Response 처리 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Response 처리 — 4가지 상태</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Prysm의 response 처리
func (s *Service) notifyNewPayload(
    ctx context.Context,
    payload ExecutionPayload,
) error {
    resp, err := s.engineClient.NewPayloadV3(ctx, payload, versionedHashes, parentRoot)
    if err != nil {
        return err  // network error
    }

    switch resp.Status {
    case VALID:
        // EL이 검증 성공 → block은 유효
        log.Info("payload VALID", "hash", payload.BlockHash)
        return nil

    case INVALID:
        // EL이 거부 → 이 block을 fork choice에서 제외
        log.Error("payload INVALID", "error", resp.ValidationError)
        return s.markBlockInvalid(payload.BlockHash)

    case SYNCING:
        // EL이 아직 sync 중 → optimistic 수락
        // 나중에 완료되면 재검증
        log.Warn("payload SYNCING - optimistic accept")
        return s.markBlockOptimistic(payload.BlockHash)

    case ACCEPTED:
        // side chain으로만 수락 (canonical 아님)
        log.Info("payload ACCEPTED (side chain)")
        return nil

    default:
        return ErrUnknownStatus
    }
}

// Optimistic Sync:
// EL이 SYNCING일 때 CL은 블록을 "잠정적 유효"로 표시
// - 계속 블록 처리 진행
// - EL sync 완료 시 재검증
// - INVALID 판정 시 해당 블록 + 후손 전부 무효화 → reorg

// 실제 케이스:
// 1. 노드 시작 시 EL이 뒤처진 상태
// 2. CL이 몇 블록 앞서 처리
// 3. EL이 따라오면 모두 재검증
// 4. 모두 VALID면 optimistic → verified`}
        </pre>
        <p className="leading-7">
          <strong>4가지 응답 상태</strong>로 CL이 다르게 처리.<br />
          SYNCING은 optimistic sync 트리거 — EL 지연 시에도 CL 진행.<br />
          INVALID는 즉시 block + 후손 무효화 → reorg.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 응답 3가지 상태</strong> — VALID: 모든 TX 실행 성공 + 상태 루트 일치.<br />
          INVALID: 실행 실패 → 포크 선택에서 해당 체인 제거.<br />
          SYNCING: EL이 아직 동기화 중 → 나중에 재검증 (임시 보류).
        </p>
      </div>
    </section>
  );
}
