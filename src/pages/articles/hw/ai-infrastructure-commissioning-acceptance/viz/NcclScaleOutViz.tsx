import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — node 상태 → … → multi-node NCCL test로 범위를 넓힌다.
 * depthData 실물 2: pair(-N2) → 4-node group(-N4) → 마지막에 -N16. 격리 예시 출력: 2 node pass, dgx-07이 든 4-node group fail,
 * rank 29 NET/IB timeout, 한 link의 port counter 증가. 재부팅 전에 log·counter 보존, group을 반으로 줄이거나 node를 교차 대체해 endpoint·fabric 경계를 좁힌다.
 * 노드 이름 dgx-01~16과 묶음 순서는 그림을 위한 가정.
 */
const NODE_IDS = Array.from({ length: 16 }, (_, index) => String(index + 1).padStart(2, "0"));
const FAIL_NODE = "07";
const SWAP_NODE = "03";

type Status = "pass" | "fail" | "idle" | "suspect" | "move";

const SCENES = [
  {
    label: "노드 한 대씩",
    summary: "16대 health·stress",
    note: "통신 시험 전에 노드마다 health와 stress를 먼저 통과시킵니다. 그다음에 link·RDMA·node pair를 확인하고 작은 묶음에서 16노드로 넓힙니다.",
  },
  {
    label: "2노드 pair",
    summary: "srun -N2 · 모두 통과",
    note: "두 노드씩 같은 NCCL all-reduce 시험을 돌립니다. NCCL은 GPU 사이 집단 통신 라이브러리이고, all-reduce는 모든 GPU의 값을 모아 다시 나눠 주는 연산입니다. 예시에서는 pair가 모두 통과했습니다.",
  },
  {
    label: "4노드 묶음",
    summary: "dgx-07이 든 묶음만 실패",
    note: "같은 command shape를 -N4로 넓히자 dgx-07이 든 묶음에서 rank 29가 NET/IB timeout을 냈고 한 link의 port counter가 올랐습니다(예시 출력). rank는 GPU 프로세스 번호, NET/IB는 InfiniBand를 거치는 NCCL 경로입니다. 아직 어느 노드 탓인지는 모릅니다.",
  },
  {
    label: "재부팅 전에 보존",
    summary: "host·rank log · counter",
    note: "범위를 좁히기 전에, 재부팅보다 먼저 실패한 묶음의 host·rank log와 counter snapshot을 남깁니다.",
  },
  {
    label: "범위 좁히기",
    summary: "A 반으로 줄이기 또는 B 교차 대체",
    note: "실패한 묶음을 반으로 줄여 다시 돌리거나(A), 노드를 정상 묶음의 노드와 바꿔 넣어(B) endpoint(노드·NIC) 쪽인지 fabric(스위치·케이블) 쪽인지 좁힙니다. 바꿀 노드는 그림을 위한 가정입니다.",
  },
  {
    label: "16노드 collective",
    summary: "-N16 · validation errors 0",
    note: "원인을 닫은 뒤 같은 command shape로 16노드 전체를 돌립니다. 정상 evidence는 validation error 0, transport NET/IB, busbw(NCCL bus bandwidth)가 각 규모 baseline 허용범위 안이라는 것입니다(예시 출력).",
  },
] as const;

const LOGS: readonly (readonly string[])[] = [
  ["nvsm show health", "nvsm stress-test --force", "→ 16/16 node 통과 (가정)"],
  ["srun -N2 … all_reduce_perf_mpi", "2 node pass", "(예시 출력 — 실측 아님)"],
  ["srun -N4 … all_reduce_perf_mpi", "4 node group containing dgx-07 fail", "rank 29 NET/IB timeout", "port counter increment on one link"],
  ["보존: host/rank log", "보존: counter snapshot", "그다음에 재부팅·교체"],
  ["A · 반으로: dgx-05·06 / dgx-07·08 다시 실행", "B · 교차 대체: dgx-07 ↔ dgx-03 (가정)", "→ endpoint와 fabric 경계를 좁힘"],
  ["srun -N16 … all_reduce_perf_mpi", "validation errors 0 · transport: NET/IB", "busbw: 규모별 baseline 허용범위 안"],
];

const BORDER: Record<Status, string> = {
  pass: "#059669",
  fail: "#dc2626",
  idle: "#94a3b8",
  suspect: "#d97706",
  move: "#2563eb",
};

const MARK: Record<Status, string> = {
  pass: "통과",
  fail: "묶음 실패",
  idle: "",
  suspect: "보존",
  move: "B 교차 대체",
};

function Chip({ id, status }: { id: string; status: Status }) {
  const mark = MARK[status];
  return (
    <span
      className="flex h-11 min-w-0 flex-col items-center justify-center rounded-md border bg-background text-[11px] leading-4"
      style={{ borderColor: BORDER[status], borderStyle: status === "idle" ? "dashed" : "solid" }}
    >
      <span className="font-mono font-bold">dgx-{id}</span>
      <span style={{ color: BORDER[status] }}>{mark}</span>
    </span>
  );
}

function Groups({ size, statusOf, labelOf }: { size: 1 | 2 | 4 | 16; statusOf: (id: string, group: number) => Status; labelOf?: (group: number) => string }) {
  const groups = Array.from({ length: 16 / size }, (_, group) => NODE_IDS.slice(group * size, group * size + size));
  const outer = size === 16 ? "grid-cols-1" : size === 4 ? "grid-cols-1 sm:grid-cols-2" : size === 2 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-4 sm:grid-cols-8";
  const inner = size === 1 ? "grid-cols-1" : size === 2 ? "grid-cols-2" : size === 4 ? "grid-cols-4" : "grid-cols-4 sm:grid-cols-8";
  return (
    <div className={`grid gap-2 ${outer}`}>
      {groups.map((ids, group) => (
        <div key={ids[0]} className={`min-w-0 rounded-lg ${size === 1 ? "" : "border border-border p-1.5"}`}>
          {labelOf ? <p className="mb-1 text-[11px] leading-4 text-muted-foreground">{labelOf(group)}</p> : null}
          <div className={`grid gap-1 ${inner}`}>
            {ids.map((id) => (
              <Chip key={id} id={id} status={statusOf(id, group)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Log({ lines, alert }: { lines: readonly string[]; alert: boolean }) {
  return (
    <div className={`mt-3 rounded-md border bg-background px-3 py-2 font-mono text-[11px] leading-5 sm:text-xs ${alert ? "border-red-600/70" : "border-border"}`}>
      {lines.map((line) => (
        <p key={line} className="break-words">{line}</p>
      ))}
    </div>
  );
}

export default function NcclScaleOutViz() {
  return (
    <SceneShell
      eyebrow="2 → 4 → 16노드"
      title="통신 시험을 한 번에 16노드로 키우지 않고 처음 실패한 묶음을 찾습니다"
      description="칸 하나가 노드 한 대, 테두리 상자가 함께 시험한 묶음입니다. 노드 이름과 묶는 순서는 가정이고, 로그는 이 절 아래 실물 1·2의 명령과 예시 출력이며 실측이 아닙니다."
      ariaLabel="노드별 시험, 2노드 pair, 4노드 묶음에서 dgx-07 묶음 실패, 보존과 범위 좁히기, 16노드 collective"
      scenes={SCENES}
      render={(active) => {
        const failGroup = (group: number) => group === 1;
        const grid =
          active === 0 ? (
            <Groups size={1} statusOf={() => "pass"} />
          ) : active === 1 ? (
            <Groups size={2} statusOf={() => "pass"} labelOf={(group) => `pair ${group + 1}`} />
          ) : active === 2 ? (
            <Groups size={4} statusOf={(_, group) => (failGroup(group) ? "fail" : "pass")} labelOf={(group) => `묶음 ${group + 1}${failGroup(group) ? " · 실패" : ""}`} />
          ) : active === 3 ? (
            <Groups size={4} statusOf={(_, group) => (failGroup(group) ? "suspect" : "idle")} labelOf={(group) => `묶음 ${group + 1}${failGroup(group) ? " · log 보존" : ""}`} />
          ) : active === 4 ? (
            <Groups
              size={4}
              statusOf={(id) => (id === FAIL_NODE || id === SWAP_NODE ? "move" : "idle")}
              labelOf={(group) => `묶음 ${group + 1}${group === 0 ? " · B 교차 상대(가정)" : failGroup(group) ? " · A 반으로 또는 B 교차" : ""}`}
            />
          ) : (
            <Groups size={16} statusOf={() => "pass"} labelOf={() => "16노드 한 묶음"} />
          );
        return (
          <div>
            {grid}
            <Log lines={LOGS[active]} alert={active === 2} />
          </div>
        );
      }}
    />
  );
}
