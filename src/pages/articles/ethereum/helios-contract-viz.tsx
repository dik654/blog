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
    title: "Base·TOML·CLI가 Config 하나로 병합됩니다",
    description: "0.12.0 구현의 merge 순서와 운영 계층이 따로 남겨야 할 provenance를 구분합니다.",
    steps: [
      { label: "Network default", detail: "chain ID · genesis · forks · endpoint", receipt: "network profile" },
      { label: "TOML", detail: "network section의 operator override", receipt: "file digest" },
      { label: "CLI", detail: "이번 실행의 explicit override", receipt: "argv redacted" },
      { label: "Typed config", detail: "뒤 provider가 앞 후보를 덮어씀", receipt: "최종값" },
    ],
    note: "Figment merge 순서는 0.12.0의 구현 사실입니다. Source와 가려진 후보를 launch receipt에 보존하는 일은 [A] 운영 제안이며, parse 성공은 sync readiness가 아닙니다.",
  },
  "network-bundle": {
    eyebrow: "Network identity bundle",
    title: "Network 이름은 chain ID 하나가 아니라 합의·실행 규칙의 묶음입니다",
    description: "한 field만 다른 network에서 가져오면 서명 검증이나 실행 fork 선택이 조용히 어긋날 수 있습니다.",
    steps: [
      { label: "Chain", detail: "chain ID · genesis time/root", receipt: "network identity" },
      { label: "Consensus forks", detail: "epoch + 4-byte fork version", receipt: "active CL fork" },
      { label: "Execution forks", detail: "timestamp schedule", receipt: "active EL fork" },
      { label: "Endpoints", detail: "consensus/execution role 분리", receipt: "provider inputs" },
    ],
    note: "Mainnet·Sepolia·Holesky·Hoodi의 값은 Helios 0.12.0에 귀속합니다. Builder는 URL을 역할별 provider에 넣지만 별도 chain·capability preflight를 자동 완성하지 않습니다.",
  },
  "client-startup": {
    eyebrow: "Socket ≠ synced ≠ ready",
    title: "Builder가 RPC를 열어도 검증된 head를 기다리는 단계가 남습니다",
    description: "0.12.0의 construction과 sync를 먼저 보고, Service 편입은 별도 [A] gate로 둡니다.",
    steps: [
      { label: "Normalize", detail: "base·TOML·CLI → Config", receipt: "final config" },
      { label: "Construct", detail: "consensus + execution provider", receipt: "client object" },
      { label: "Listen + sync", detail: "JSON-RPC task와 sync가 겹쳐 실행", receipt: "socket · sync status" },
      { label: "Wait + gate", detail: "initial block 뒤 Service 편입", receipt: "[A] ready generation" },
    ],
    note: "HeliosClient::new은 rpc_address가 있으면 server task를 바로 spawn합니다. wait_synced는 별도 API이며 CLI가 자동 호출하지 않으므로 배포 readiness의 owner를 따로 지정해야 합니다.",
  },
  "checkpoint-storage": {
    eyebrow: "Checkpoint lifecycle",
    title: "32-byte 파일은 cache이며 trust policy와 durability는 별도입니다",
    description: "Source가 읽는 현재 동작과 production hardening을 같은 주장으로 섞지 않습니다.",
    steps: [
      { label: "Choose", detail: "explicit · local · default · remote fallback", receipt: "source authority" },
      { label: "Validate", detail: "age policy · bootstrap proof", receipt: "sync outcome" },
      { label: "Persist", detail: "32-byte checkpoint", receipt: "path · digest · fs result" },
      { label: "Restart", detail: "exact length 또는 default fallback", receipt: "load outcome" },
    ],
    note: "0.12.0 FileDB는 truncate 후 write하며 strict age가 꺼져 있으면 오래된 checkpoint를 경고만 합니다. Atomic persistence와 fail-closed age policy는 별도 [A] hardening 계약입니다.",
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
