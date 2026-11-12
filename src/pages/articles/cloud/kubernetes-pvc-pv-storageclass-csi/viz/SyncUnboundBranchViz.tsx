import SceneShell from "./SceneShell";

/**
 * 본문 대응: #controller-source — v1.37.1 pv_controller.go syncUnboundClaim(332행부터)의 갈래.
 * 338 WFFC 여부 → 344 맞는 Available PV 찾기 → (찾으면 1095 bind) → 354~363 빈 클래스 채우고 재시작 → switch 세 갈래(366~370, 371~380, 381~382).
 */
type Key = "read" | "find" | "bind" | "empty" | "fill" | "wffc" | "prov" | "fail";

interface Scene {
  label: string;
  summary: string;
  path: readonly Key[];
  find: string;
  empty: string;
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "PV 있음",
    summary: "→ bind (1095행)",
    path: ["read", "find", "bind"],
    find: "있음",
    empty: "—",
    note: "344행이 용량·접근 모드·클래스가 맞는 Available PV를 찾으면 아래 갈래는 보지 않고 bind로 갑니다. bind가 어떻게 저장하는지는 바로 다음 그림입니다.",
  },
  {
    label: "빈 클래스",
    summary: "기본 클래스 채우고 재시작",
    path: ["read", "find", "empty", "fill"],
    find: "없음",
    empty: "비었음 · 기본 클래스 있음",
    note: "PV를 못 찾았고 PVC에 storageClassName이 없으면 354~363행이 기본 클래스를 채우고 sync를 처음부터 다시 시작합니다. 다시 돌 때는 클래스가 있으므로 다음 두 장면 중 하나로 갑니다.",
  },
  {
    label: "노드 대기",
    summary: "이벤트만 남김 (366~370행)",
    path: ["read", "find", "empty", "wffc"],
    find: "없음",
    empty: "이름 있음",
    note: "338행에서 읽어 둔 모드가 WaitForFirstConsumer이고 PVC에 노드 주석이 아직 없으면 WaitForFirstConsumer 이벤트만 남기고 끝납니다. 5절의 설계된 대기입니다.",
  },
  {
    label: "Immediate",
    summary: "provisionClaim (371~380행)",
    path: ["read", "find", "empty", "prov"],
    find: "없음",
    empty: "이름 있음",
    note: "3절의 Immediate 사례가 이 갈래입니다. 클래스가 있으니 provisionClaim으로 비동기 프로비저닝을 시작하고, Pod 정보 없이 디스크가 먼저 만들어집니다.",
  },
  {
    label: "클래스 없음",
    summary: "FailedBinding (381~382행)",
    path: ["read", "find", "empty", "fail"],
    find: "없음",
    empty: "비었음 · 기본 클래스 없음",
    note: "채울 기본 클래스가 없으면 앞의 두 갈래 어디에도 맞지 않아 FailedBinding \"no persistent volumes available for this claim and no storage class is set\"을 남기고 Pending에 머뭅니다.",
  },
];

const ON = "#2563eb";
const OFF = "#94a3b8";

function Box({ k, path, line, text, answer }: { k: Key; path: readonly Key[]; line: string; text: string; answer?: string }) {
  const on = path.includes(k);
  const end = path[path.length - 1] === k;
  return (
    <div
      className="rounded-lg border px-3 py-1.5"
      style={{ borderColor: on ? ON : OFF, borderStyle: on ? "solid" : "dashed", borderWidth: end ? 1.25 : 1 }}
    >
      <p className="font-mono text-[11px] leading-5" style={{ color: on ? ON : OFF }}>{line}</p>
      <p className={`text-sm leading-5 ${on ? "font-bold" : "text-muted-foreground"}`}>{text}</p>
      {answer !== undefined && (
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          이번 경우: <span className={on ? "font-bold text-foreground" : ""}>{on ? answer : "—"}</span>
        </p>
      )}
    </div>
  );
}

export default function SyncUnboundBranchViz() {
  return (
    <SceneShell
      eyebrow="syncUnboundClaim의 갈래"
      title="묶이지 않은 PVC는 다섯 출구 중 하나로 나갑니다"
      description="위에서 아래로 읽는 Kubernetes v1.37.1 pv_controller.go의 순서입니다. 실선이 이번 경우가 지나간 칸이고, 굵은 테두리가 이번 sync가 끝나는 출구입니다."
      ariaLabel="syncUnboundClaim이 PV를 찾거나, 기본 클래스를 채우거나, 기다리거나, 만들거나, FailedBinding을 남기는 갈래"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        return (
          <div className="min-w-0 space-y-2">
            <div className="grid gap-2 sm:grid-cols-3">
              <Box k="read" path={s.path} line="338행" text="WaitForFirstConsumer 여부 읽기" />
              <Box k="find" path={s.path} line="344행" text="맞는 Available PV 찾기" answer={s.find} />
              <Box k="bind" path={s.path} line="1095행 · 찾았으면" text="bind로 묶음" />
            </div>
            <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
              <Box k="empty" path={s.path} line="354~363행 · 못 찾았으면" text="storageClassName이 비었나?" answer={s.empty} />
              <Box k="fill" path={s.path} line="비었고 기본 클래스가 있으면" text="기본 클래스 채우고 sync 재시작" />
            </div>
            <p className="text-xs font-bold text-muted-foreground">switch 세 갈래</p>
            <div className="grid gap-2 sm:grid-cols-3">
              <Box k="wffc" path={s.path} line="366~370행" text="WaitForFirstConsumer · 노드 주석 없음 → 이벤트만" />
              <Box k="prov" path={s.path} line="371~380행" text="클래스 있음 → provisionClaim" />
              <Box k="fail" path={s.path} line="381~382행" text="둘 다 아님 → FailedBinding" />
            </div>
          </div>
        );
      }}
    />
  );
}
