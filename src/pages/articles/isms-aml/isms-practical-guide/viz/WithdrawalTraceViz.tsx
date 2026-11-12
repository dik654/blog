import SceneShell from "./SceneShell";

/**
 * 본문 대응: #wallet-ops — 출금 trace는 request ID 하나로 아홉 단계를 잇고,
 * 단계 사이에서 hash·amount·network가 달라지면 그 자리에서 처리를 멈춘다.
 * 불일치가 생기는 단계(서명자 attestation)는 멈춤을 보이려고 고른 가정이다.
 */
const STAGES = [
  "출금 요청 · request ID 발급",
  "고객 인증",
  "risk/FDS 판단",
  "승인자",
  "unsigned tx digest",
  "signer attestation",
  "broadcast hash",
  "chain confirmation",
  "회계 원장 반영",
] as const;

const HALT_AT = 5;

interface Scene {
  label: string;
  summary: string;
  note: string;
  /** 각 단계 상태: done = 이어짐, halt = 불일치로 멈춤, skip = 실행되지 않음, idle = 강조 없음 */
  states: readonly ("done" | "halt" | "skip" | "idle")[];
  check: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "한 요청을 끝까지 잇습니다",
    summary: "request ID → … → 회계 원장",
    note: "출금 요청에서 request ID가 붙은 뒤 고객 인증부터 회계 원장 반영까지, 아홉 단계가 모두 같은 request ID로 묶여야 합니다. 그래야 원장의 한 줄에서 거꾸로 누가 승인하고 어떤 digest에 서명했는지까지 따라갈 수 있습니다.",
    states: STAGES.map(() => "done" as const),
    check: "모든 단계가 같은 request ID를 가집니다",
  },
  {
    label: "단계 사이마다 값을 대조합니다",
    summary: "hash · amount · network 일치?",
    note: "앞 단계가 넘긴 값과 다음 단계가 받은 값을 비교합니다. hash, amount, network 세 가지가 같아야 다음 칸으로 넘어갑니다.",
    states: STAGES.map(() => "done" as const),
    check: "칸 사이의 = 표시가 그 대조 지점입니다",
  },
  {
    label: "하나라도 다르면 그 자리에서 멈춥니다",
    summary: "signer attestation에서 불일치 → 중단",
    note: "예를 들어 서명자가 attest한 값이 승인된 digest와 다르면(가정) 그 단계에서 처리를 멈춥니다. 뒤의 broadcast와 원장 반영은 실행되지 않으므로 잘못된 거래가 체인에 나가지 않습니다.",
    states: STAGES.map((_, index) => (index < HALT_AT ? ("done" as const) : index === HALT_AT ? ("halt" as const) : ("skip" as const))),
    check: "멈춘 칸 뒤의 단계는 실행되지 않습니다",
  },
];

const STYLE = {
  done: { border: "#2563eb", text: "" },
  halt: { border: "#ef4444", text: "text-red-700 dark:text-red-400 font-bold" },
  skip: { border: "#cbd5e1", text: "text-muted-foreground/50 line-through" },
  idle: { border: "#cbd5e1", text: "text-muted-foreground" },
} as const;

export default function WithdrawalTraceViz() {
  return (
    <SceneShell
      eyebrow="출금 trace"
      title="출금 한 건은 같은 request ID로 아홉 단계를 지나고, 값이 어긋나면 멈춥니다"
      description="칸 하나가 trace의 한 단계이며 위에서 아래로 진행합니다. 칸 사이의 = 는 hash·amount·network 대조 지점입니다."
      note="어느 단계에서 불일치가 나는지는 멈춤을 보이려고 고른 가정입니다."
      ariaLabel="출금 요청이 request ID로 이어지는 아홉 단계와 불일치 시 중단"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const showChecks = active >= 1;
        return (
          <div className="min-w-0">
            <ol className="mx-auto grid max-w-md grid-cols-1">
              {STAGES.map((stage, index) => {
                const state = scene.states[index];
                const style = STYLE[state];
                return (
                  <li key={stage} className="min-w-0">
                    <div className="flex items-center gap-2 rounded-md border px-2 py-1 text-xs" style={{ borderColor: style.border }}>
                      <span className="w-4 shrink-0 font-mono text-[11px] text-muted-foreground">{index + 1}</span>
                      <span className={`min-w-0 truncate ${style.text}`}>{stage}</span>
                      <span className="ml-auto shrink-0 font-mono text-[11px]" aria-hidden>
                        {state === "halt" ? "≠ 중단" : ""}
                      </span>
                    </div>
                    <span className="block h-3 text-center font-mono text-[10px] leading-3 text-muted-foreground" aria-hidden>
                      {index < STAGES.length - 1 ? (showChecks ? (active === 2 && index + 1 === HALT_AT ? "↓ ≠" : active === 2 && index >= HALT_AT ? "" : "↓ =") : "↓") : ""}
                    </span>
                  </li>
                );
              })}
            </ol>
            <p className="mx-auto mt-3 max-w-md rounded-lg border border-border/80 px-3 py-2 text-xs font-semibold sm:text-sm">{scene.check}</p>
          </div>
        );
      }}
    />
  );
}
