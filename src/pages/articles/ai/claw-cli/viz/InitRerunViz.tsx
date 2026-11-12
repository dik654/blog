import CliSceneShell from "./CliSceneShell";

/**
 * 본문 대응: #init "재실행해도 사용자 편집을 지우지 않아야 한다".
 * 장면 1–3 = pinned source의 create-if-missing·exact ignore-entry·기존 CLAUDE.md 보존.
 * 장면 4–5 = 본문이 hardening 목표로 둔 marker block ownership·conflict 보고(현재 source에 없음).
 */
type Row = { text: string; tone: "write" | "keep" | "conflict" };

const SCENES = [
  {
    label: "첫 실행: 없는 파일은 만들고 entry를 더합니다",
    summary: "pinned source",
    note: "starter setting file과 CLAUDE.md가 없으므로 만들고, .gitignore에는 필요한 entry를 추가합니다. 시작 상태는 .gitignore만 있는 저장소로 가정했습니다(가정).",
    hardening: false,
    rows: [
      { text: "없음 → starter 값 생성", tone: "write" },
      { text: "필요한 entry 추가", tone: "write" },
      { text: "없음 → 초안 생성", tone: "write" },
    ] as Row[],
    doc: "draft",
  },
  {
    label: "같은 입력으로 다시 실행합니다",
    summary: "새 변경 0건",
    note: "파일이 이미 있고 같은 ignore entry도 이미 있으므로 아무것도 바뀌지 않습니다. 같은 버전과 같은 입력으로 다시 실행해 새 변경이 없는 성질을 idempotent라고 부릅니다.",
    hardening: false,
    rows: [
      { text: "이미 있음 → 그대로", tone: "keep" },
      { text: "같은 entry 있음 → 그대로", tone: "keep" },
      { text: "이미 있음 → 건너뜀", tone: "keep" },
    ] as Row[],
    doc: "draft",
  },
  {
    label: "사용자가 CLAUDE.md를 고친 뒤 다시 실행합니다",
    summary: "사용자 편집 보존",
    note: "Pinned init은 기존 CLAUDE.md를 덮어쓰지 않으므로 사용자 편집이 남습니다. 다만 이 source에는 도구가 만든 부분을 표시하는 marker도, 기대한 digest도 없습니다.",
    hardening: false,
    rows: [
      { text: "이미 있음 → 그대로", tone: "keep" },
      { text: "같은 entry 있음 → 그대로", tone: "keep" },
      { text: "이미 있음 → 건너뜀", tone: "keep" },
    ] as Row[],
    doc: "edited",
  },
  {
    label: "Hardening: marker 안쪽만 갱신합니다",
    summary: "source에 없는 설계",
    note: "도구가 만든 block에 marker와 schema version을 남기면, 새 버전의 init은 그 block 안쪽만 갱신하고 marker 밖의 사용자 편집은 건드리지 않습니다. 이 동작은 현재 pinned source의 기능이 아닙니다.",
    hardening: true,
    rows: [
      { text: "이미 있음 → 그대로", tone: "keep" },
      { text: "같은 entry 있음 → 그대로", tone: "keep" },
      { text: "marker 안쪽 block만 갱신", tone: "write" },
    ] as Row[],
    doc: "marker",
  },
  {
    label: "Hardening: 모르는 내용은 conflict로 보고합니다",
    summary: "자동 덮어쓰기 없음",
    note: "갱신하려는 자리에 알 수 없는 기존 설정이 있으면 덮어쓰지 않고 conflict로 보고합니다. 여기서는 사용자가 setting file에 직접 넣은 값을 예로 들었습니다(가정). 역시 source에 없는 설계입니다.",
    hardening: true,
    rows: [
      { text: "알 수 없는 기존 설정 → conflict 보고", tone: "conflict" },
      { text: "같은 entry 있음 → 그대로", tone: "keep" },
      { text: "marker 밖 사용자 영역 → 그대로", tone: "keep" },
    ] as Row[],
    doc: "marker",
  },
] as const;

const FILES = [".claw/settings.json · .claw.json", ".gitignore", "CLAUDE.md"] as const;

const TONE: Record<Row["tone"], { border: string; text: string; tag: string }> = {
  write: { border: "#2563eb", text: "text-[#1d4ed8] dark:text-[#93c5fd]", tag: "변경" },
  keep: { border: "#94a3b8", text: "text-muted-foreground", tag: "유지" },
  conflict: { border: "#dc2626", text: "text-[#b91c1c] dark:text-[#fca5a5]", tag: "보고" },
};

export default function InitRerunViz() {
  return (
    <CliSceneShell
      eyebrow="Idempotent init"
      title="init을 다시 돌려도 사용자 편집이 남는 경계"
      description="세 파일이 실행마다 어떻게 되는지와 CLAUDE.md 안쪽 구성을 함께 봅니다. 앞의 세 장면은 pinned source, 뒤의 두 장면은 본문이 hardening 목표로 둔 설계입니다."
      ariaLabel="claw init 재실행 시 파일별 변경, 유지, conflict 보고"
      scenes={SCENES}
      render={(active) => {
        const scene = (SCENES as readonly (typeof SCENES)[number][])[active];
        return (
          <div className="min-w-0 space-y-3 text-xs">
            <span
              className={`inline-block rounded border px-2 py-0.5 text-[10px] font-bold ${
                scene.hardening ? "border-dashed border-[#d97706] text-[#b45309] dark:text-[#fbbf24]" : "border-border text-foreground"
              }`}
            >
              {scene.hardening ? "hardening 설계 · pinned source에 없음" : "pinned source 동작"}
            </span>
            <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] sm:gap-5">
              <ul className="min-w-0 space-y-1.5">
                {FILES.map((file, index) => {
                  const row = scene.rows[index];
                  const tone = TONE[row.tone];
                  return (
                    <li key={file} className="grid min-h-[3rem] grid-cols-[minmax(0,1fr)_2.5rem] items-center gap-2 rounded-md border px-2 py-1.5" style={{ borderColor: tone.border }}>
                      <span className="min-w-0 leading-4">
                        <code className="block break-all text-[11px]">{file}</code>
                        <span className={`block break-keep text-[11px] ${tone.text}`}>{row.text}</span>
                      </span>
                      <span className={`text-center text-[10px] font-bold ${tone.text}`}>{tone.tag}</span>
                    </li>
                  );
                })}
              </ul>
              <div className="min-w-0 rounded-md border border-border px-2 py-2">
                <p className="mb-1.5 font-mono text-[10px] font-bold text-muted-foreground">CLAUDE.md 안쪽</p>
                <div className="min-h-[7.5rem] space-y-1.5">
                  {scene.doc === "marker" ? (
                    <div className="rounded border border-dashed border-[#2563eb] px-2 py-1.5">
                      <span className="block text-[10px] font-bold text-[#1d4ed8] dark:text-[#93c5fd]">marker + schema version</span>
                      <span className="block leading-4">도구가 소유한 block{active === 3 ? " · 이번 실행에서 갱신" : ""}</span>
                    </div>
                  ) : (
                    <div className="rounded border border-border px-2 py-1.5">
                      <span className="block text-[10px] font-bold text-muted-foreground">marker 없음</span>
                      <span className="block leading-4">init이 만든 초안 (언어·검증 명령)</span>
                    </div>
                  )}
                  <div className={`rounded border px-2 py-1.5 ${scene.doc === "draft" ? "border-dashed border-border/40 text-transparent" : "border-[#16a34a]"}`}>
                    <span className="block text-[10px] font-bold text-[#15803d] dark:text-[#4ade80]">{scene.doc === "draft" ? "·" : "사용자 편집"}</span>
                    <span className="block leading-4">{scene.doc === "draft" ? "·" : scene.doc === "marker" ? "marker 밖 · 건드리지 않음" : "덮어쓰지 않아 남음"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
