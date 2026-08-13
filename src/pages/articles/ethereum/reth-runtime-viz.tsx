import VizFrame from "@/components/viz/VizFrame";

type Mode =
  | "blob-boundary"
  | "blob-pool"
  | "blob-store"
  | "blob-gas"
  | "blob-lifecycle"
  | "payload-flow"
  | "payload-job"
  | "engine-handoff"
  | "sync-paths"
  | "sync-pipeline"
  | "sync-handoff";

const FLOWS: Record<
  Mode,
  { eyebrow: string; title: string; description: string; steps: readonly { label: string; detail: string; receipt: string }[]; note: string }
> = {
  "blob-boundary": {
    eyebrow: "EIP-4844 경계",
    title: "실행에 남는 hash와 가용성에 필요한 sidecar를 분리합니다",
    description: "하나의 blob transaction을 execution payload와 별도 data artifact로 나눠 추적합니다.",
    steps: [
      { label: "Type-3 transaction", detail: "fee·nonce·versioned hash", receipt: "tx hash" },
      { label: "Sidecar", detail: "blob·commitment·proof", receipt: "sidecar digest" },
      { label: "검증", detail: "hash binding·KZG·fork limit", receipt: "validation result" },
      { label: "포함", detail: "payload에는 transaction만", receipt: "block/root" },
    ],
    note: "Versioned hash는 blob byte 자체가 아닙니다. Sidecar가 없으면 hash만으로 원문을 복원할 수 없습니다.",
  },
  "blob-pool": {
    eyebrow: "Admission pipeline",
    title: "구조 검증 뒤 chain state와 cryptographic binding을 확인합니다",
    description: "비싼 KZG 검증 전에 값싼 구조·fork·개수 검사를 앞에 둡니다.",
    steps: [
      { label: "Decode", detail: "bounded wrapper와 길이", receipt: "typed input" },
      { label: "Stateless", detail: "fork·count·size·hash count", receipt: "reject reason" },
      { label: "Stateful", detail: "nonce·balance·fee·KZG", receipt: "validated tx" },
      { label: "Admit", detail: "pool budget·replacement", receipt: "pool generation" },
    ],
    note: "Admission 성공은 block inclusion 약속이 아니며, reorg 뒤 재주입도 sidecar availability를 다시 확인해야 합니다.",
  },
  "blob-store": {
    eyebrow: "Storage ownership",
    title: "Transaction index와 큰 sidecar artifact의 수명을 따로 관리합니다",
    description: "Memory·disk 구현이 달라도 key, atomicity, cleanup receipt는 같아야 합니다.",
    steps: [
      { label: "Key", detail: "transaction hash", receipt: "key/version" },
      { label: "Write", detail: "sidecar bytes·metadata", receipt: "durable write" },
      { label: "Read", detail: "bounded decode·digest check", receipt: "hit/miss/corrupt" },
      { label: "Cleanup", detail: "canonical/finalized boundary", receipt: "deleted keys" },
    ],
    note: "Execution txpool cleanup과 consensus-layer blob retention은 서로 다른 owner와 보존 규칙을 가집니다.",
  },
  "blob-gas": {
    eyebrow: "Fee feedback",
    title: "이전 block의 초과 수요가 다음 blob base fee를 움직입니다",
    description: "현재 사용량 하나가 아니라 누적 excess와 활성 fork parameter를 함께 봅니다.",
    steps: [
      { label: "Parent state", detail: "excess + blob gas used", receipt: "parent header" },
      { label: "Target 차감", detail: "saturating subtraction", receipt: "next excess" },
      { label: "정수 지수", detail: "fake_exponential", receipt: "blob base fee" },
      { label: "Admission", detail: "max fee와 현재 fee 비교", receipt: "priced/rejected" },
    ],
    note: "Execution gas와 blob gas는 별도 시장입니다. Blob fee가 낮아졌다는 사실만으로 rollup의 총비용이 같은 비율로 줄었다고 결론내리지 않습니다.",
  },
  "blob-lifecycle": {
    eyebrow: "Lifecycle",
    title: "제출부터 reorg·finalization cleanup까지 sidecar 소유권을 추적합니다",
    description: "각 상태 전환에는 artifact와 실패 시 복구할 owner가 있습니다.",
    steps: [
      { label: "제출", detail: "tx + sidecar", receipt: "admission" },
      { label: "전파", detail: "announce 뒤 bounded fetch", receipt: "peer/source" },
      { label: "포함", detail: "payload transaction", receipt: "canonical block" },
      { label: "정리/재주입", detail: "finalize 또는 reorg", receipt: "cleanup/reinsert" },
    ],
    note: "Sidecar cache miss가 난 reorg에서는 transaction hash만으로 data를 되살릴 수 없으므로 network fetch 또는 명시적 실패가 필요합니다.",
  },
  "payload-flow": {
    eyebrow: "Payload construction",
    title: "Payload attributes를 고정한 뒤 예산 안에서 transaction을 실행합니다",
    description: "같은 payload ID가 어떤 parent·timestamp·fee recipient·randomness를 가리키는지 먼저 고정합니다.",
    steps: [
      { label: "Attributes", detail: "parent·time·withdrawals", receipt: "build key" },
      { label: "Snapshot", detail: "state·pool generation", receipt: "input digest" },
      { label: "Execute", detail: "gas/blob/dependency budget", receipt: "receipts/value" },
      { label: "Publish best", detail: "valid candidate only", receipt: "payload ID" },
    ],
    note: "Transaction fee 합이 큰 후보가 반드시 유효하거나 더 좋은 payload라는 뜻은 아닙니다. State dependency와 deadline을 함께 지켜야 합니다.",
  },
  "payload-job": {
    eyebrow: "Build job",
    title: "한 번의 build는 snapshot·deadline·cancellation을 가진 작업입니다",
    description: "Pool이 변해도 이미 실행 중인 후보의 입력 경계를 뒤섞지 않습니다.",
    steps: [
      { label: "Freeze", detail: "parent/state/pool view", receipt: "job ID" },
      { label: "Select", detail: "fee order + dependency", receipt: "candidate order" },
      { label: "Execute", detail: "commit on success", receipt: "state diff" },
      { label: "Cancel/finish", detail: "deadline·new attributes", receipt: "terminal status" },
    ],
    note: "부분 실행 state를 canonical DB에 쓰지 않고 candidate overlay에 격리해야 timeout과 cancellation이 안전합니다.",
  },
  "engine-handoff": {
    eyebrow: "Engine API handoff",
    title: "forkchoiceUpdated가 job을 만들고 getPayload가 같은 build를 회수합니다",
    description: "Consensus client의 요청과 execution client의 local work를 stable payload ID로 연결합니다.",
    steps: [
      { label: "forkchoiceUpdated", detail: "head + payload attributes", receipt: "payload ID" },
      { label: "Build", detail: "async local candidate", receipt: "best version" },
      { label: "getPayload", detail: "ID lookup·fork schema", receipt: "payload/envelope" },
      { label: "newPayload", detail: "peer/proposer result 검증", receipt: "payload status" },
    ],
    note: "Unknown payload ID, restart, fork mismatch는 typed failure여야 합니다. 빈 payload나 최신 job을 임의로 반환하면 요청과 결과가 섞입니다.",
  },
  "sync-paths": {
    eyebrow: "Sync 선택",
    title: "거리와 신뢰 anchor에 따라 pipeline·backfill·live 경로를 나눕니다",
    description: "세 경로는 속도 이름이 아니라 입력·검증·commit cursor가 다른 작업입니다.",
    steps: [
      { label: "Anchor", detail: "genesis/checkpoint/local tip", receipt: "chain identity" },
      { label: "Acquire", detail: "headers·bodies·state input", receipt: "source range" },
      { label: "Verify", detail: "ordered stages·execution", receipt: "stage checkpoint" },
      { label: "Handoff", detail: "contiguous cursor→live", receipt: "head fence" },
    ],
    note: "많이 내려받았다는 사실과 검증된 canonical prefix를 durable commit했다는 사실을 분리합니다.",
  },
  "sync-pipeline": {
    eyebrow: "Staged sync",
    title: "앞 stage의 검증된 범위만 다음 stage가 소비합니다",
    description: "각 checkpoint는 block number뿐 아니라 chain/fork·input digest·schema를 함께 가져야 합니다.",
    steps: [
      { label: "Headers", detail: "parent·difficulty/consensus", receipt: "header cursor" },
      { label: "Bodies/Senders", detail: "bounded data·signature", receipt: "body cursor" },
      { label: "Execution", detail: "state transition·receipts", receipt: "exec cursor" },
      { label: "Indexes/Finish", detail: "derived views", receipt: "pipeline checkpoint" },
    ],
    note: "Stage 하나가 앞서가더라도 전체 sync cursor는 필요한 모든 authoritative stage의 최소 연속 지점으로 읽습니다.",
  },
  "sync-handoff": {
    eyebrow: "Backfill → live",
    title: "과거 범위와 새 head 사이에 gap·duplicate가 없을 때만 ownership을 넘깁니다",
    description: "Handoff fence는 같은 block을 두 경로가 commit하거나 어느 쪽도 처리하지 않는 일을 막습니다.",
    steps: [
      { label: "Backfill cursor", detail: "검증된 contiguous prefix", receipt: "last committed" },
      { label: "Fence", detail: "target/head generation", receipt: "handoff token" },
      { label: "Catch up", detail: "queued canonical notifications", receipt: "ordered apply" },
      { label: "Live owner", detail: "reorg/unwind 포함", receipt: "active generation" },
    ],
    note: "ExEx notification은 canonical commit 뒤의 소비 경계이며 sync correctness를 대신하지 않습니다. External effect는 별도 idempotency·reconciliation이 필요합니다.",
  },
};

export default function RethRuntimeViz({ mode }: { mode: Mode }) {
  const flow = FLOWS[mode];
  return (
    <VizFrame eyebrow={flow.eyebrow} title={flow.title} description={flow.description} note={flow.note}>
      <ol className="grid min-w-0 gap-4 lg:grid-cols-4">
        {flow.steps.map((step, index) => (
          <li key={step.label} className="min-w-0 border-t border-border pt-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-primary">{String(index + 1).padStart(2, "0")}</span>
              <p className="min-w-0 text-sm font-bold text-foreground">{step.label}</p>
            </div>
            <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">{step.detail}</p>
            <p className="mt-3 break-words border-l border-primary/50 pl-3 text-xs leading-5 text-foreground/75">
              receipt · {step.receipt}
            </p>
          </li>
        ))}
      </ol>
    </VizFrame>
  );
}
