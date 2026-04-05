import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function ForkchoiceUpdated({ onCodeRef }: Props) {
  return (
    <section id="forkchoice-updated" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ForkchoiceUpdated</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-2 mb-3">역할</h3>
        <p className="leading-7">
          CL의 포크 선택 결과를 EL에 통보한다.<br />
          EL은 이 정보로 자체 캐노니컬 체인 헤드를 갱신한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('engine-forkchoice', codeRefs['engine-forkchoice'])} />
          <span className="text-[10px] text-muted-foreground self-center">ForkchoiceUpdated()</span>
        </div>

        {/* ── ForkchoiceState ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ForkchoiceState — 3개 포인터</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// ForkchoiceState: CL이 EL에 통지하는 chain state
struct ForkchoiceState {
    headBlockHash: Hash32,        // 현재 canonical head
    safeBlockHash: Hash32,        // safe checkpoint (justified 근처)
    finalizedBlockHash: Hash32,   // finalized checkpoint
}

// 3 포인터의 의미:
// head: 최신 블록 (LMD-GHOST 결과)
// safe: 2/3+ validator가 투표한 블록 (justified)
// finalized: 되돌릴 수 없는 블록 (finalized checkpoint)

// EL이 ForkchoiceState로 하는 일:
// 1. canonical chain 업데이트 (head → tip)
// 2. safe/finalized 마킹 (reorg 불가 영역)
// 3. pruning hint (finalized 이하는 permanent)
// 4. RPC 응답 (eth_getBlockByTag "safe"/"finalized")

// 업데이트 타이밍:
// - 매 CL slot (12초)
// - 특정 이벤트 (새 block 수신, attestation 반영)
// - finality 갱신 (매 2 epoch)

// 호출 빈도:
// - Prysm: slot당 여러 번 (fork choice 재계산마다)
// - EL은 단순 이벤트 수신 → 내부 state만 업데이트`}
        </pre>
        <p className="leading-7">
          <code>ForkchoiceState</code>는 <strong>3개 chain 포인터</strong>.<br />
          head(최신) / safe(justified) / finalized → EL에 chain state 통지.<br />
          EL은 이를 받아 internal state 업데이트 + RPC 응답 갱신.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">ForkchoiceState</h3>
        <ul>
          <li><strong>headBlockHash</strong> — 현재 체인 헤드</li>
          <li><strong>safeBlockHash</strong> — 2/3 검증자가 투표한 블록</li>
          <li><strong>finalizedBlockHash</strong> — 되돌릴 수 없는 확정 블록</li>
        </ul>

        {/* ── PayloadAttributes ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">PayloadAttributes — validator 전용 필드</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// PayloadAttributesV3 (Deneb):
struct PayloadAttributes {
    timestamp: uint64,                 // 다음 block timestamp
    prevRandao: Hash32,                // RANDAO mix
    suggestedFeeRecipient: Address,    // 수수료 수취인
    withdrawals: Array[Withdrawal],    // Capella+
    parentBeaconBlockRoot: Hash32,     // EIP-4788 (Cancun+)
}

// 포함 여부:
// - validator가 다음 slot proposer일 때 → 포함 (EL이 블록 빌드 시작)
// - 일반 slot → null (단순 chain state 통지)

// EL의 응답:
// payload_attrs != null:
//   payload_id 반환 (새 빌드 작업 ID)
//   EL이 백그라운드에서 블록 조립 시작
// payload_attrs == null:
//   payload_id: null
//   단순 state 업데이트만

// Validator 블록 빌드 흐름:
// t=0s (slot 시작):
//   CL → EL: FCU + payload_attrs
//   EL: "빌드 시작" payload_id 반환
//   EL: 백그라운드에서 TX 선택 + 실행
//
// t=4s:
//   CL → EL: getPayload(payload_id)
//   EL: 현재까지 가장 좋은 블록 반환
//   CL: 블록 서명 + 네트워크 전파
//
// 빌드 시간 (0~4초):
//   EL이 더 많이 수집할수록 수익 증가
//   timing game → MEV 최적화`}
        </pre>
        <p className="leading-7">
          <strong>PayloadAttributes</strong>가 validator 블록 빌드 트리거.<br />
          validator의 slot일 때만 포함 → EL이 payload 빌드 시작.<br />
          4초 빌드 시간 → 수익 최대화 vs timeout 균형.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 PayloadAttributes 이중 역할</strong> — 블록 제안자일 때만 포함.<br />
          EL이 다음 블록 페이로드 빌드를 시작하고 payloadId를 반환.<br />
          이 ID로 나중에 GetPayload를 호출 — FCU가 빌드 트리거 역할.
        </p>
      </div>
    </section>
  );
}
