import SceneShell from "./PhalaSceneShell";

/**
 * 본문 대응: #execution-boundary — REGISTER → DISTRIBUTE → INVOKE → COMMIT 네 단계와
 * 03절 실패 주입 표의 "HTTP timeout after send", "Replayed client nonce" 두 행.
 * 위 칸 = 누가 누구에게 무엇을 보내는지, 아래 칸 = 단계마다 따로 남는 기록 다섯 줄(고정 자리).
 */
type NodeId = "client" | "chain" | "gatekeeper" | "worker" | "http";
type Mark = "wait" | "ok" | "fail" | "unknown" | "reject";

interface FlowScene {
  label: string;
  summary: string;
  note: string;
  from: NodeId;
  to: NodeId;
  payload: readonly string[];
  check: string;
  fail: boolean;
  toLabel?: string;
  /** from과 to 사이에서 요청이 거쳐 가는 노드(본문 CHAIN 역할: encrypted message와 nonce 기록) */
  via?: { id: NodeId; label: string };
  records: readonly [Mark, Mark, Mark, Mark, Mark];
}

const NODES: readonly { id: NodeId; tag: string; sub: string }[] = [
  { id: "client", tag: "CLIENT", sub: "요청을 서명해 보냄" },
  { id: "chain", tag: "CHAIN", sub: "registry · nonce 기록" },
  { id: "gatekeeper", tag: "GATEKEEPER", sub: "key 분배" },
  { id: "worker", tag: "WORKER", sub: "pRuntime(TEE) 안 Phat Contract" },
  { id: "http", tag: "외부 HTTP", sub: "chain 밖 서비스" },
];

const RECORDS = ["worker registry 등록", "scoped key material", "nonce · encrypted message", "contract state root", "HTTP effect receipt"] as const;

const SCENES: readonly FlowScene[] = [
  {
    label: "REGISTER",
    summary: "worker → chain: 누구인지 등록",
    note: "Worker는 quote·measurement·TCB·identity key를 내고, 이것이 검증을 통과하면 chain registry에 등록됩니다. Quote는 TEE 하드웨어가 '이 code가 이 환경에서 돌고 있다'고 서명한 증거입니다. 등록은 worker가 누구인지만 알려 줄 뿐 key나 요청을 주지는 않습니다.",
    from: "worker",
    to: "chain",
    payload: ["quote", "measurement", "TCB", "identity key"],
    check: "검증 통과 → registry에 worker 등록",
    fail: false,
    records: ["ok", "wait", "wait", "wait", "wait"],
  },
  {
    label: "DISTRIBUTE",
    summary: "gatekeeper → worker: 범위가 정해진 key",
    note: "Gatekeeper는 허용된 worker·contract·epoch(key를 바꿔 가는 세대 번호)에 맞는 key material만 암호화해 건넵니다. 등록 기록과 key 지급은 서로 다른 칸에 남습니다. 어떤 범위로 key를 나누는지는 02절 식이 다룹니다.",
    from: "gatekeeper",
    to: "worker",
    payload: ["encrypted key material", "worker · contract · epoch 범위"],
    check: "허용 worker·contract·epoch만 지급",
    fail: false,
    records: ["ok", "ok", "wait", "wait", "wait"],
  },
  {
    label: "INVOKE",
    summary: "client → chain → worker: from/to/nonce/input",
    note: "요청에는 보낸 사람(from), 대상 contract(to), nonce, 암호화된 input이 들어갑니다. Nonce는 같은 요청을 두 번 쓰지 못하게 붙이는 일회용 번호입니다. 요청은 worker로 바로 가지 않고 먼저 chain에 올라가 encrypted message와 nonce로 기록되고, worker는 chain에서 그 요청을 가져옵니다. Chain이 암호화된 message queue 역할을 하는 셈입니다. Worker는 client signature·target contract·nonce·ciphertext를 검증한 뒤 한 worker의 실행 한 번에 묶습니다.",
    from: "client",
    to: "worker",
    payload: ["from", "to", "nonce", "ciphertext input", "signature"],
    check: "signature · target · nonce 확인 → 실행 한 번에 결속",
    fail: false,
    via: { id: "chain", label: "기록 · 전달" },
    records: ["ok", "ok", "ok", "wait", "wait"],
  },
  {
    label: "COMMIT",
    summary: "state root와 외부 effect를 따로 기록",
    note: "Contract가 private state를 바꾸면 state root가 남고, HTTP를 호출했다면 그 시도는 별도 receipt로 남습니다. 외부 결과는 consensus state와 같은 증거가 아니므로 두 기록을 한 칸에 합치지 않고 idempotency key로 맞춰 봅니다. Idempotency key는 같은 시도를 다시 보내도 한 번으로 셀 수 있게 붙이는 시도 번호입니다.",
    from: "worker",
    to: "http",
    payload: ["HTTP 요청", "idempotency key"],
    check: "state root 기록 · effect 시도는 별도 receipt",
    fail: false,
    records: ["ok", "ok", "ok", "ok", "ok"],
  },
  {
    label: "실패: 보낸 뒤 timeout",
    summary: "외부 결과 미확인 → 다시 보내지 않음",
    note: "03절 표의 'HTTP timeout after send' 행입니다. 요청은 나갔지만 응답이 오지 않아 외부에서 처리됐는지 알 수 없습니다. Timeout을 곧 실패로 단정해 같은 effect를 다시 보내지 않고, 저장해 둔 attempt ID·idempotency key로 receipt를 확인해 reconcile합니다.",
    from: "worker",
    to: "http",
    payload: ["HTTP 요청(이미 보냄)", "응답 없음"],
    check: "blind retry 금지 → receipt로 reconcile",
    fail: true,
    toLabel: "처리 여부 모름",
    records: ["ok", "ok", "ok", "ok", "unknown"],
  },
  {
    label: "실패: nonce 재사용",
    summary: "같은 nonce → 실행 전에 거부",
    note: "03절 표의 'Replayed client nonce' 행입니다. 이미 쓴 nonce가 다시 오면 invocation 전에 거부하므로 state와 외부 effect 모두 commit이 0건이어야 합니다. 아래 3줄은 다시 들어온 이 요청이 거부됐다는 표시이고 4~5줄은 그 결과 state·effect commit이 0건이라는 뜻입니다. Worker가 등록돼 있고 key를 가졌다는 사실은 이 거부를 바꾸지 않습니다.",
    from: "client",
    to: "worker",
    payload: ["from", "to", "nonce(이미 사용)", "ciphertext input"],
    via: { id: "chain", label: "거쳐 감" },
    check: "nonce 재사용 → invocation 전 거부",
    fail: true,
    toLabel: "거부",
    records: ["ok", "ok", "reject", "fail", "fail"],
  },
];

const MARK_TEXT: Record<Mark, string> = { wait: "대기", ok: "기록", fail: "0건", unknown: "미확인", reject: "거부" };
const MARK_CLASS: Record<Mark, string> = {
  wait: "text-muted-foreground",
  ok: "font-bold text-blue-700 dark:text-blue-400",
  fail: "font-bold text-red-700 dark:text-red-400",
  unknown: "font-bold text-amber-700 dark:text-amber-400",
  reject: "font-bold text-red-700 dark:text-red-400",
};

const tagOf = (id: NodeId) => NODES.find((node) => node.id === id)?.tag ?? id;

export default function PhalaInvokeFlowViz() {
  return (
    <SceneShell
      eyebrow="Payroll 요청 한 건"
      title="등록·key·요청·effect가 서로 다른 칸에 남습니다"
      description="위는 이번 단계에서 누가 누구에게 무엇을 보내는지, 아래는 단계마다 따로 쌓이는 기록 다섯 줄입니다. Worker는 TEE 안에서 pRuntime을 돌리는 compute node이고 Phat Contract는 그 안에서 실행됩니다."
      ariaLabel="Phala legacy stack에서 worker 등록, gatekeeper key 분배, client 요청, state와 HTTP effect 기록, 그리고 timeout과 nonce 재사용 실패"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const tone = scene.fail ? "#dc2626" : "#2563eb";
        return (
          <div className="mx-auto min-w-0 max-w-3xl">
            <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5 sm:gap-2">
              {NODES.map((node) => {
                const role = node.id === scene.from ? "보냄" : node.id === scene.to ? (scene.toLabel ?? "받음") : node.id === scene.via?.id ? scene.via.label : "";
                return (
                  <div
                    key={node.id}
                    className={`min-w-0 rounded-lg border px-2 py-2 text-xs leading-5 ${node.id === "worker" ? "col-span-2 sm:col-span-1" : ""}`}
                    style={{ borderColor: role ? tone : undefined }}
                  >
                    <span className="block text-[11px] font-bold tracking-tight sm:text-xs sm:tracking-normal" style={{ color: role ? tone : undefined }}>
                      {node.tag}
                    </span>
                    <span className="hidden break-keep text-muted-foreground sm:block">{node.sub}</span>
                    <span className="block h-5 font-semibold" style={{ color: tone }}>
                      {role}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 rounded-lg border px-3 py-2 text-xs leading-5" style={{ borderColor: tone }}>
              <p className="font-mono font-bold" style={{ color: tone }}>
                {tagOf(scene.from)} → {scene.via ? `${tagOf(scene.via.id)} → ` : ""}{tagOf(scene.to)}
              </p>
              <div className="mt-1 flex flex-wrap gap-1">
                {scene.payload.map((item) => (
                  <span key={item} className="rounded border border-border px-1.5 py-0.5 font-mono">
                    {item}
                  </span>
                ))}
              </div>
              <p className="mt-1 font-semibold">{scene.check}</p>
            </div>
            <ul className="mt-3 divide-y divide-border rounded-lg border border-border text-xs leading-5">
              {RECORDS.map((record, index) => {
                const mark = scene.records[index];
                return (
                  <li key={record} className="grid grid-cols-[1.25rem_minmax(0,1fr)_4.5rem] items-center gap-2 px-3 py-1.5">
                    <span className="font-mono text-muted-foreground">{index + 1}</span>
                    <span className="min-w-0 break-keep">{record}</span>
                    <span className={`text-right ${MARK_CLASS[mark]}`}>{MARK_TEXT[mark]}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      }}
    />
  );
}
