import VizFrame from "@/components/viz/VizFrame";

type Mode =
  | "type-boundary"
  | "light-client-types"
  | "signing-context"
  | "ssz-proof"
  | "config-precedence"
  | "network-bundle"
  | "client-startup"
  | "checkpoint-storage";

const FLOWS: Record<
  Mode,
  {
    eyebrow: string;
    title: string;
    description: string;
    steps: readonly { label: string; detail: string; receipt: string }[];
    note: string;
  }
> = {
  "type-boundary": {
    eyebrow: "CL → verified EL view",
    title: "타입 이름보다 먼저 각 값의 검증 책임을 나눕니다",
    description: "고정 예시 slot 8,192의 light-client update가 어떤 commitment를 거쳐 실행 상태 조회의 기준이 되는지 추적합니다.",
    steps: [
      { label: "Wire bytes", detail: "fork별 SSZ schema로 bounded decode", receipt: "bytes digest · fork" },
      { label: "CL header", detail: "slot · beacon state root · body root", receipt: "header root" },
      { label: "Execution header", detail: "execution branch로 beacon body에 결속", receipt: "block · state root" },
      { label: "State query", detail: "EIP-1186 proof를 같은 state root에 대조", receipt: "view identity" },
    ],
    note: "BeaconBlockHeader.state_root는 BeaconState의 root입니다. EVM account trie root는 검증된 execution payload header에서 따로 읽습니다.",
  },
  "light-client-types": {
    eyebrow: "Typed state transition",
    title: "메시지·서명·누적 store를 서로 다른 생명주기로 읽습니다",
    description: "Update 하나가 검증되더라도 store의 모든 field가 자동으로 전진하는 것은 아닙니다.",
    steps: [
      { label: "Header", detail: "beacon + fork별 execution fields", receipt: "slot · roots" },
      { label: "SyncAggregate", detail: "participant bits + BLS signature", receipt: "participants · signing root" },
      { label: "Update", detail: "attested/finalized/next committee branches", receipt: "validation outcome" },
      { label: "Store", detail: "optimistic/finalized header + current/next committee", receipt: "pre/post store root" },
    ],
    note: "Optimistic head, finalized head, current committee와 next committee는 서로 다른 조건으로 갱신됩니다. 최신 slot 하나로 모두 덮어쓰지 않습니다.",
  },
  "signing-context": {
    eyebrow: "Domain separation",
    title: "같은 object root도 역할·fork·network가 다르면 다른 서명 메시지입니다",
    description: "Domain type과 fork data root를 결합해 signature가 다른 역할이나 chain에서 재사용되지 않게 합니다.",
    steps: [
      { label: "Object root", detail: "SSZ hash_tree_root(message)", receipt: "32-byte root" },
      { label: "Fork data", detail: "fork version + genesis validators root", receipt: "fork-data root" },
      { label: "Domain", detail: "domain type + root prefix", receipt: "32-byte domain" },
      { label: "Signing root", detail: "object root + domain commitment", receipt: "BLS input" },
    ],
    note: "BLS signature가 수학적으로 유효해도 active fork, duty type, network와 participant set을 잘못 골랐다면 update는 유효하지 않습니다.",
  },
  "ssz-proof": {
    eyebrow: "SSZ proof contract",
    title: "Schema가 bytes 배치와 Merkle path를 함께 결정합니다",
    description: "Decode 성공, object root 일치, branch 검증을 한 단계로 뭉치지 않고 순서대로 확인합니다.",
    steps: [
      { label: "Schema", detail: "fixed/variable fields · list limits", receipt: "type + fork" },
      { label: "Canonical bytes", detail: "offset·length·full consumption", receipt: "decode result" },
      { label: "Merkleize", detail: "32-byte chunks · mix-in length", receipt: "object root" },
      { label: "Branch", detail: "generalized index의 sibling path", receipt: "root equality" },
    ],
    note: "Schema나 fork가 달라지면 같은 bytes를 다른 object로 읽을 수 있습니다. Source commit·fork·preset은 proof receipt에 포함해야 합니다.",
  },
  "config-precedence": {
    eyebrow: "Config normalization",
    title: "Default·TOML·CLI 후보를 하나의 typed launch receipt로 만듭니다",
    description: "값만 남기지 않고 어느 source가 이겼고 무엇이 가려졌는지 함께 기록합니다.",
    steps: [
      { label: "Network default", detail: "chain ID · genesis · forks · endpoint", receipt: "network profile" },
      { label: "TOML", detail: "network section의 operator override", receipt: "file digest" },
      { label: "CLI", detail: "이번 실행의 explicit override", receipt: "argv redacted" },
      { label: "Typed config", detail: "validate한 최종값과 source", receipt: "config digest" },
    ],
    note: "Pinned source의 Figment merge 순서는 release 사실입니다. Parse 성공은 endpoint trust, checkpoint freshness, bind 안전성을 보장하지 않습니다.",
  },
  "network-bundle": {
    eyebrow: "Network identity bundle",
    title: "Network 이름은 chain ID 하나가 아니라 합의·실행 규칙의 묶음입니다",
    description: "한 field만 다른 network에서 가져오면 서명 검증이나 실행 fork 선택이 조용히 어긋날 수 있습니다.",
    steps: [
      { label: "Chain", detail: "chain ID · genesis time/root", receipt: "network identity" },
      { label: "Consensus forks", detail: "epoch + 4-byte fork version", receipt: "active CL fork" },
      { label: "Execution forks", detail: "timestamp schedule", receipt: "active EL fork" },
      { label: "Endpoints", detail: "consensus/execution role 분리", receipt: "health + capability" },
    ],
    note: "Mainnet·Sepolia·Holesky·Hoodi의 current 값은 pinned Helios snapshot에 귀속합니다. 새 fork나 network 추가를 영구 목록처럼 쓰지 않습니다.",
  },
  "client-startup": {
    eyebrow: "Fail-closed startup",
    title: "Client는 endpoint 연결보다 먼저 trust anchor와 network identity를 확정합니다",
    description: "Startup 단계별 실패를 typed reason으로 남겨 부분적으로 열린 RPC를 피합니다.",
    steps: [
      { label: "Normalize", detail: "config source·secret redaction", receipt: "config digest" },
      { label: "Resolve anchor", detail: "explicit/local/default/fallback checkpoint", receipt: "source · age" },
      { label: "Probe", detail: "CL/EL chain·capability·head", receipt: "endpoint matrix" },
      { label: "Sync + serve", detail: "verified store 뒤 local RPC readiness", receipt: "ready generation" },
    ],
    note: "Endpoint가 응답하거나 builder가 object를 만들었다고 ready가 아닙니다. Wrong chain·expired anchor·partial sync에서는 public service를 열지 않습니다.",
  },
  "checkpoint-storage": {
    eyebrow: "Checkpoint lifecycle",
    title: "32-byte 파일은 cache이며 trust policy와 durability는 별도입니다",
    description: "Source가 읽는 현재 동작과 production hardening을 같은 주장으로 섞지 않습니다.",
    steps: [
      { label: "Choose", detail: "explicit · local · default · remote fallback", receipt: "source authority" },
      { label: "Validate", detail: "network · root · age · sync result", receipt: "accepted anchor" },
      { label: "Persist", detail: "32-byte checkpoint", receipt: "path · digest · fs result" },
      { label: "Restart", detail: "exact length 또는 default fallback", receipt: "load outcome" },
    ],
    note: "Pinned FileDB는 truncate 후 write하므로 atomic replace를 입증하지 않습니다. Temp-write·fsync·rename·directory sync와 crash fixture는 별도 hardening 계약입니다.",
  },
};

export default function HeliosContractViz({ mode }: { mode: Mode }) {
  const flow = FLOWS[mode];
  return (
    <VizFrame eyebrow={flow.eyebrow} title={flow.title} description={flow.description} note={flow.note}>
      <ol className="grid min-w-0 gap-4 lg:grid-cols-4">
        {flow.steps.map((step, index) => (
          <li key={step.label} className="min-w-0 border-t border-border pt-4">
            <div className="flex min-w-0 items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-primary">{String(index + 1).padStart(2, "0")}</span>
              <p className="min-w-0 break-words text-sm font-bold leading-5 text-foreground">{step.label}</p>
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
