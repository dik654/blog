import BashSceneShell from "./BashSceneShell";

/**
 * 본문 대응: #validation-pipeline "Canonical path를 한 번 계산해도 TOCTOU는 남습니다"와
 * "Release gate" 절의 parent handle 기준 open·no-follow.
 * 가로 = 시간(검사 → 사이 → 사용), 세로 = host 검사·실행 줄과 동시에 움직이는 다른 process 줄.
 * workspace root /work/app과 바뀌는 entry는 설명용 가정입니다.
 */

type Cell = { text: string; tone: "ok" | "warn" | "bad" | "idle" | "fix" };

interface SceneData {
  label: string;
  summary: string;
  note: string;
  host: readonly Cell[];
  other: readonly Cell[];
  checked: string;
  opened: Cell;
}

const IDLE: Cell = { text: "", tone: "idle" };

const SCENES: readonly SceneData[] = [
  {
    label: "검사 (check)",
    summary: "workspace 안 → 통과",
    note: "요청 시점에 src/auth.ts를 canonical path로 바꾸고 workspace root와 component 단위로 비교합니다. 이 시점의 대상은 workspace 안이므로 통과로 기록됩니다.",
    host: [{ text: "src/auth.ts → /work/app/src/auth.ts · 안쪽 확인", tone: "ok" }, IDLE, IDLE],
    other: [IDLE, IDLE, IDLE],
    checked: "/work/app/src/auth.ts",
    opened: { text: "아직 열지 않음", tone: "idle" },
  },
  {
    label: "검사와 사용 사이",
    summary: "entry가 바뀜",
    note: "검사가 끝난 뒤 process가 file을 열기 전에 다른 process가 directory entry를 workspace 밖을 가리키는 symlink로 바꿉니다. 검사 결과 기록은 그대로 ‘안쪽’입니다.",
    host: [{ text: "src/auth.ts → /work/app/src/auth.ts · 안쪽 확인", tone: "ok" }, { text: "대기", tone: "idle" }, IDLE],
    other: [IDLE, { text: "같은 이름을 workspace 밖 symlink로 교체", tone: "warn" }, IDLE],
    checked: "/work/app/src/auth.ts",
    opened: { text: "아직 열지 않음", tone: "idle" },
  },
  {
    label: "사용 (use)",
    summary: "검사한 대상 ≠ 열린 대상",
    note: "Process가 같은 path 문자열로 file을 열면 바뀐 symlink를 따라가 workspace 밖 대상이 열립니다. Decision log의 canonical string과 실제로 열린 대상이 달라지는 TOCTOU race입니다.",
    host: [
      { text: "src/auth.ts → /work/app/src/auth.ts · 안쪽 확인", tone: "ok" },
      { text: "대기", tone: "idle" },
      { text: "path 문자열로 open · symlink를 따라감", tone: "bad" },
    ],
    other: [IDLE, { text: "같은 이름을 workspace 밖 symlink로 교체", tone: "warn" }, IDLE],
    checked: "/work/app/src/auth.ts",
    opened: { text: "workspace 밖 대상", tone: "bad" },
  },
  {
    label: "HARDENING · handle 기준 open",
    summary: "symlink를 따라가지 않음",
    note: "Check 시점에 parent directory handle을 잡고, 그 handle을 기준으로 상대 open을 하며 symlink를 따라가지 않는 no-follow resolution을 씁니다. 결정의 resource identity와 실제 handle identity를 같은 receipt에 넣습니다.",
    host: [
      { text: "canonical target 기록 · parent directory handle 확보", tone: "fix" },
      { text: "대기", tone: "idle" },
      { text: "handle 기준 상대 open · no-follow", tone: "fix" },
    ],
    other: [IDLE, { text: "같은 이름을 workspace 밖 symlink로 교체", tone: "warn" }, IDLE],
    checked: "/work/app/src/auth.ts",
    opened: { text: "교체된 symlink를 따라가지 않음", tone: "fix" },
  },
];

const TONE: Record<Cell["tone"], string> = {
  ok: "#2563eb",
  warn: "#d97706",
  bad: "#dc2626",
  idle: "#cbd5e1",
  fix: "#059669",
};

const COLUMNS = ["① 검사", "② 사이", "③ 사용"] as const;

function LaneCell({ cell }: { cell: Cell }) {
  if (!cell.text) return <div className="min-h-16 rounded-md border border-dashed border-border/50" aria-hidden />;
  return (
    <div
      className={`min-h-16 min-w-0 rounded-md border px-2 py-1.5 text-[11px] leading-4 sm:text-xs sm:leading-5 ${cell.tone === "idle" ? "text-muted-foreground" : "font-semibold text-foreground"}`}
      style={{ borderColor: TONE[cell.tone] }}
    >
      <span className="break-words [overflow-wrap:anywhere]">{cell.text}</span>
    </div>
  );
}

export default function ToctouRaceViz() {
  return (
    <BashSceneShell
      eyebrow="TOCTOU"
      title="검사한 순간과 여는 순간 사이에 대상이 바뀔 수 있습니다"
      description="가로는 시간 순서이고, 위 줄은 host의 검사·실행, 아래 줄은 동시에 움직이는 다른 process입니다. 맨 아래에서 검사한 대상과 실제로 열린 대상을 비교합니다."
      note="/work/app과 바뀌는 entry는 설명용 가정입니다. handle 기준 open도 platform별 API와 동시 attacker negative test 없이는 완전하다고 주장할 수 없습니다."
      ariaLabel="time-of-check와 time-of-use 사이 symlink 교체"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="grid min-w-0 gap-3">
            <div className="grid min-w-0 grid-cols-[3.25rem_repeat(3,minmax(0,1fr))] gap-1.5 sm:grid-cols-[5.5rem_repeat(3,minmax(0,1fr))] sm:gap-2">
              <span />
              {COLUMNS.map((col) => (
                <span key={col} className="text-center text-[11px] font-bold text-muted-foreground">{col}</span>
              ))}
              <span className="self-center text-[11px] font-bold leading-4 text-foreground">host 검사·실행</span>
              {scene.host.map((cell, cellIndex) => (
                <LaneCell key={`h-${cellIndex}`} cell={cell} />
              ))}
              <span className="self-center text-[11px] font-bold leading-4 text-foreground">다른 process</span>
              {scene.other.map((cell, cellIndex) => (
                <LaneCell key={`o-${cellIndex}`} cell={cell} />
              ))}
            </div>
            <div className="grid min-w-0 grid-cols-2 gap-2 border-t border-border pt-3 text-xs">
              <div className="min-w-0">
                <p className="font-bold text-muted-foreground">검사한 대상</p>
                <p className="mt-1 break-all font-mono font-semibold" style={{ color: TONE.ok }}>{scene.checked}</p>
              </div>
              <div className="min-w-0">
                <p className="font-bold text-muted-foreground">실제로 열린 대상</p>
                <p className="mt-1 break-keep font-semibold" style={{ color: scene.opened.tone === "idle" ? "#64748b" : TONE[scene.opened.tone] }}>
                  {scene.opened.text}
                </p>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
