import SceneShell from "./SceneShell";

/**
 * 본문 대응: #sign-publish — 서명이 local slashing check보다 먼저 만들어지고,
 * check는 제출만 막으며, lock은 한 프로세스 안에서만 동시 실행을 묶는다.
 * 칸 하나가 호출 단계 하나입니다. 왼쪽에서 오른쪽이 Prysm v7.3.1의 호출 순서입니다.
 */
type CellState = "idle" | "now" | "done" | "stop" | "skip";

interface Row {
  owner: string;
  cells: readonly CellState[];
  results: readonly string[];
}

const STEPS = ["Lock", "Sign", "Slashing check", "Submit"] as const;
const STEP_DETAIL = ["role · public key", "block root + proposer domain", "SlashableProposalCheck", "beacon node API"] as const;

const SCENES = [
  {
    label: "Lock",
    summary: "같은 role·key 동시 실행을 묶음",
    note: "Prysm v7.3.1은 같은 proposer role과 public key의 동시 실행을 lock으로 묶습니다. 아직 서명은 없습니다. 이 lock은 서명·check·제출이 끝나고 ProposeBlock이 반환될 때 풀립니다(defer Unlock).",
  },
  {
    label: "Sign",
    summary: "signature가 먼저 생김",
    note: "Validator client가 beacon node가 돌려준 block을 proposer domain으로 서명합니다. Local slashing check보다 이 서명이 먼저 만들어집니다.",
  },
  {
    label: "Check 통과",
    summary: "signed block 제출",
    note: "Local slashing-protection database의 SlashableProposalCheck를 통과한 block만 beacon node API로 제출됩니다.",
  },
  {
    label: "Check 실패",
    summary: "서명은 남고 제출만 중단",
    note: "Conflicting proposal이면 제출이 중단됩니다. 이 check는 이미 생긴 signature를 지우는 장치가 아니라 제출을 막는 마지막 local gate입니다. Gossip과 local receive는 일어나지 않습니다.",
  },
  {
    label: "같은 key, 두 곳",
    summary: "lock은 자기 프로세스 안에서만",
    note: "같은 key를 여러 validator client나 외부 signer에서 동시에 운용하면, 한 프로세스의 lock은 다른 곳의 서명 호출을 묶지 못합니다. 이 lock만으로는 전역 중복 서명을 막을 수 없습니다.",
  },
] as const;

const ROWS: readonly (readonly Row[])[] = [
  [{ owner: "Validator client", cells: ["now", "idle", "idle", "idle"], results: ["lock 획득", "", "", ""] }],
  [{ owner: "Validator client", cells: ["done", "now", "idle", "idle"], results: ["lock 유지", "signature 있음", "", ""] }],
  [{ owner: "Validator client", cells: ["done", "done", "now", "now"], results: ["lock 유지", "signature 있음", "통과", "제출"] }],
  [{ owner: "Validator client", cells: ["done", "done", "stop", "skip"], results: ["lock 유지", "signature 있음", "slashable", "제출 안 함"] }],
  [
    { owner: "Validator client A", cells: ["now", "now", "idle", "idle"], results: ["A의 lock", "서명 가능", "", ""] },
    { owner: "다른 client · signer B", cells: ["now", "now", "idle", "idle"], results: ["A lock 밖", "서명 가능", "", ""] },
  ],
];

const CELL_CLASS: Record<CellState, string> = {
  idle: "border-border bg-background text-muted-foreground/70",
  now: "border-[#2563eb] bg-background text-foreground",
  done: "border-border bg-background text-foreground",
  stop: "border-[#dc2626] bg-background text-foreground",
  skip: "border-dashed border-border bg-background text-muted-foreground/60",
};

const RESULT_CLASS: Record<CellState, string> = {
  idle: "text-muted-foreground",
  now: "text-[#2563eb]",
  done: "text-muted-foreground",
  stop: "text-[#dc2626]",
  skip: "text-muted-foreground",
};

function RowView({ row }: { row: Row }) {
  return (
    <div className="min-w-0">
      <p className="mb-1 text-xs font-bold text-muted-foreground">{row.owner}</p>
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
        {STEPS.map((step, index) => {
          const state = row.cells[index];
          return (
            <div key={step} className={`min-w-0 rounded-lg border px-1.5 py-2 sm:px-3 ${CELL_CLASS[state]}`}>
              <span className="block break-keep text-[11px] font-bold leading-4 sm:text-sm">{step}</span>
              <span className="mt-0.5 hidden break-keep text-xs leading-4 text-muted-foreground sm:block">{STEP_DETAIL[index]}</span>
              <span className={`mt-1 block min-h-4 break-keep text-[10px] font-bold leading-4 sm:text-xs ${RESULT_CLASS[state]}`}>{row.results[index]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SignBeforeCheckViz() {
  return (
    <SceneShell
      eyebrow="서명과 제출의 순서"
      title="Slashing check는 서명 뒤, 제출 앞에 있습니다"
      description="칸 하나가 호출 단계 하나(Lock: 같은 role·key 동시 실행 묶기, Sign: proposer domain 서명, Slashing check: SlashableProposalCheck, Submit: beacon node API 제출)이고 왼쪽에서 오른쪽이 Prysm v7.3.1의 호출 순서입니다. 파란 칸은 지금 일어나는 단계, 빨간 칸은 멈춘 단계, 점선 칸은 일어나지 않은 단계입니다."
      ariaLabel="Lock, 서명, local slashing check, 제출의 순서와 lock이 미치는 범위를 다섯 장면으로 보여 줍니다"
      scenes={SCENES}
      render={(active) => {
        const rows = ROWS[active];
        const split = rows.length > 1;
        return (
          <div className="space-y-3">
            {rows.map((row) => <RowView key={row.owner} row={row} />)}
            {split && (
              <p className="rounded-lg border border-dashed border-[#dc2626] px-3 py-2 text-xs leading-5 text-foreground">
                A의 lock은 A 프로세스 안의 호출만 묶습니다. B의 서명 호출은 A의 lock을 기다리지 않습니다.
              </p>
            )}
          </div>
        );
      }}
    />
  );
}
