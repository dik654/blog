import SceneShell from "./SceneShell";

/**
 * 본문 대응: #node-builder "컴파일 단계의 제약이 실행 준비 상태를 대신하지는 않습니다".
 * 시작 기록의 다섯 상태와 단계별 고정 시도 식별자, 중간 종료 → 마지막 저장 상태 읽기 → 열린 자원 정리 → 중복 없는 재시도.
 * 어느 단계에서 끊기는지, 식별자 문자열, 다시 시도하는 위치는 설명용 가정이다.
 */
const STATES: readonly string[] = ["config_validated", "storage_open", "components_initialized", "add_ons_started", "ready"];
const IDS: readonly string[] = ["s1-a7", "s2-a7", "s3-a7", "s4-a7", "s5-a7"];

type Status = "done" | "running" | "crashed" | "retry" | "wait";

const STATUS_TEXT: Record<Status, string> = {
  done: "기록됨",
  running: "진행 중",
  crashed: "종료로 끊김",
  retry: "같은 식별자로 재시도",
  wait: "대기",
};

const STATUS_COLOR: Record<Status, string> = {
  done: "#10b981",
  running: "#6366f1",
  crashed: "#ef4444",
  retry: "#f59e0b",
  wait: "#94a3b8",
};

interface SceneDef {
  label: string;
  short: string;
  summary: string;
  note: string;
  status: readonly Status[];
  last: string;
  open: string;
  action: string;
}

const SCENES: readonly SceneDef[] = [
  {
    short: "기록",
    label: "단계마다 기록",
    summary: "기록 2 / 5",
    note: "설정 검사와 저장소 열기가 끝날 때마다 상태 이름과 그 단계의 고정된 시도 식별자를 기록합니다. 아직 부품 초기화가 진행 중입니다.",
    status: ["done", "done", "running", "wait", "wait"],
    last: "storage_open",
    open: "저장소 핸들 (가정)",
    action: "—",
  },
  {
    short: "종료",
    label: "중간 종료",
    summary: "마지막 기록 = storage_open",
    note: "부품 초기화 도중 프로세스가 끝났다고 가정합니다. 기록에 남은 마지막 상태는 storage_open이고, 그때 연 자원은 아직 정리되지 않았습니다.",
    status: ["done", "done", "crashed", "wait", "wait"],
    last: "storage_open",
    open: "저장소 핸들 (가정) · 정리 안 됨",
    action: "—",
  },
  {
    short: "정리",
    label: "재시작: 읽고 정리",
    summary: "기록 읽기 → 자원 정리",
    note: "다시 시작하면 먼저 마지막으로 저장된 상태를 읽고, 이미 열린 자원을 정리합니다. 이 순서를 건너뛰면 남은 자원 위에 같은 작업을 한 번 더 쌓게 됩니다.",
    status: ["done", "done", "crashed", "wait", "wait"],
    last: "storage_open",
    open: "정리 완료",
    action: "마지막 기록 읽기 · 열린 자원 정리",
  },
  {
    short: "재시도",
    label: "중복 없이 재시도",
    summary: "s2-a7 · s3-a7 다시",
    note: "정리한 저장소 핸들을 다시 열어야 하므로 이 그림은 storage_open부터 같은 식별자로 다시 합니다. 각 단계에 고정된 시도 식별자가 있으니 이미 한 부작용인지 구분할 수 있습니다. 어느 단계부터 다시 하는지는 이 그림의 가정이며 구현이 정합니다.",
    status: ["done", "retry", "retry", "wait", "wait"],
    last: "storage_open",
    open: "저장소 다시 여는 중 (가정)",
    action: "중복 부작용 확인 후 재시도",
  },
  {
    short: "ready",
    label: "ready까지 확인",
    summary: "기록 5 / 5",
    note: "다섯 상태가 모두 기록된 뒤에야 준비 완료입니다. 핸들을 받았다는 사실만으로 ready를 선언하지 않습니다.",
    status: ["done", "done", "done", "done", "done"],
    last: "ready",
    open: "실행 중인 서비스",
    action: "핸들 받음 ≠ ready",
  },
];

export default function StartupRecordViz() {
  return (
    <SceneShell
      eyebrow="시작 기록 · 중간 종료와 재시도"
      title="단계별 시작 기록이 있어야 끊긴 자리에서 중복 없이 다시 시도할 수 있습니다"
      description="왼쪽은 본문이 요구하는 다섯 상태와 단계마다 고정한 시도 식별자, 오른쪽은 기록에 남은 마지막 상태와 열린 자원입니다. 끊기는 위치와 식별자 문자열은 설명용 가정입니다."
      ariaLabel="시작 기록 다섯 상태가 중간 종료 뒤 정리와 재시도를 거쳐 ready에 이르는 과정"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="grid min-w-0 gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <ol className="grid min-w-0 gap-px bg-border p-px" aria-label="시작 상태 기록">
              {STATES.map((state, i) => {
                const status = scene.status[i];
                return (
                  <li key={state} className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 bg-background px-3 py-2">
                    <div className="min-w-0">
                      <span className="block break-all font-mono text-xs font-bold">{state}</span>
                      <span className="block font-mono text-[10px] text-muted-foreground">시도 식별자 {IDS[i]} (가정)</span>
                    </div>
                    <span
                      className="whitespace-nowrap rounded border px-2 py-0.5 text-[10px] font-bold"
                      style={{ borderColor: STATUS_COLOR[status], color: STATUS_COLOR[status] }}
                    >
                      {STATUS_TEXT[status]}
                    </span>
                  </li>
                );
              })}
            </ol>
            <div className="grid min-w-0 content-start gap-px self-start bg-border p-px">
              <div className="bg-background px-3 py-2">
                <p className="text-[10px] font-bold text-muted-foreground">기록에 남은 마지막 상태</p>
                <p className="mt-1 break-all font-mono text-sm font-bold">{scene.last}</p>
              </div>
              <div className="bg-background px-3 py-2">
                <p className="text-[10px] font-bold text-muted-foreground">이미 열린 자원</p>
                <p className="mt-1 break-keep text-sm font-bold">{scene.open}</p>
              </div>
              <div className="bg-background px-3 py-2">
                <p className="text-[10px] font-bold text-muted-foreground">재시작 쪽 동작</p>
                <p className="mt-1 break-keep text-sm font-bold">{scene.action}</p>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
