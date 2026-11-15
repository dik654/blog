import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overview 의 예측 질문 세 개.
 * Agent가 src/auth.ts를 digest h1으로 읽음 → 다른 process가 h2로 바꿈(old_string 두 번 등장)
 * → pinned edit_file은 digest를 받지 않고 첫 occurrence를 바꿔 fs::write로 직접 씀
 * → hardening 목표는 expected digest·expected match count로 거부하고, rename·path race는 별도로 막는다.
 */
const SCENES = [
  {
    label: "Agent가 읽는다",
    summary: "snapshot digest = h1",
    note: "Agent는 src/auth.ts를 읽고 그 content(digest h1)를 바탕으로 old_string → new_string edit를 만듭니다. digest는 같은 bytes에 같은 값을 주는 hash로, 읽은 version의 이름표 역할을 합니다.",
  },
  {
    label: "다른 process가 바꾼다",
    summary: "현재 digest = h2",
    note: "Edit가 도착하기 전에 다른 process가 같은 file을 h2로 바꿨습니다. 바뀐 file에는 old_string이 두 군데 있습니다. Agent의 edit는 여전히 h1을 보고 만든 것입니다.",
  },
  {
    label: "pinned edit_file",
    summary: "첫 occurrence 교체 · 직접 write",
    note: "pinned 구현은 expected digest를 받지 않으므로 h1과 h2를 비교하지 않습니다. replace_all=false라도 match가 둘이면 거부하지 않고 첫 occurrence를 바꾼 뒤 fs::write로 바로 씁니다. 그 위치가 agent가 의도한 곳인지는 확인하지 않습니다.",
  },
  {
    label: "hardening 목표",
    summary: "h1 ≠ h2 → stale input 실패",
    note: "개선된 API라면 expected digest h1과 현재 h2가 달라 덮어쓰지 않고 새 snapshot을 읽게 합니다. expected match count를 받으면 match 수가 다를 때도 거부합니다. 다만 digest 비교만으로 temporary file·atomic rename과 검사·사용 사이 symlink·rename race가 해결되지는 않으므로 따로 설계합니다.",
  },
] as const;

type Cell = { text: string; tone: "plain" | "match" | "changed" | "muted" };

const LINES: readonly (readonly Cell[])[] = [
  [
    { text: "h1으로 읽은 content", tone: "muted" },
    { text: "…", tone: "muted" },
    { text: "…", tone: "muted" },
    { text: "…", tone: "muted" },
  ],
  [
    { text: "…", tone: "plain" },
    { text: "old_string  ← match ①", tone: "match" },
    { text: "…", tone: "plain" },
    { text: "old_string  ← match ②", tone: "match" },
  ],
  [
    { text: "…", tone: "plain" },
    { text: "new_string  ← ① 교체됨", tone: "changed" },
    { text: "…", tone: "plain" },
    { text: "old_string  ← ② 그대로", tone: "match" },
  ],
  [
    { text: "…", tone: "plain" },
    { text: "old_string  ← match ①", tone: "match" },
    { text: "…", tone: "plain" },
    { text: "old_string  ← match ②", tone: "match" },
  ],
];

const DIGEST = ["h1", "h2", "h2 이후 새 content", "h2 (변경 없음)"] as const;

const CHECKS: readonly (readonly [string, string, string])[] = [
  ["대기", "대기", "대기"],
  ["대기", "대기", "대기"],
  ["받지 않음 → 비교 안 함", "2개 → 첫 occurrence 교체", "fs::write로 직접 갱신"],
  ["h1 ≠ h2 → 실패", "기대 1 ≠ 실제 2 → 거부 (가정)", "거부됐으니 쓰지 않음 · 통과했다면 temporary file → rename"],
];

const CHECK_LABELS = ["expected digest", "match 수", "쓰기 방식"] as const;

const TONE_CLASS: Record<Cell["tone"], string> = {
  plain: "text-muted-foreground",
  match: "border-[#d97706] bg-[#fef3c7] text-[#92400e] dark:bg-[#451a03] dark:text-[#fcd34d]",
  changed: "border-[#dc2626] bg-[#fee2e2] text-[#991b1b] dark:bg-[#450a0a] dark:text-[#fca5a5]",
  muted: "text-muted-foreground/70",
};

export default function StaleEditViz() {
  return (
    <SceneShell
      eyebrow="Stale edit"
      title="h1에서 만든 edit가 h2 file에 도착할 때"
      description="왼쪽은 src/auth.ts의 현재 상태, 오른쪽은 edit를 적용할 때 거치는 검사입니다. 줄 내용은 위치만 보이려는 가정이며 old_string이 두 번 있다는 것만 본문의 조건입니다."
      note="3장면은 commit b71afdd의 동작, 4장면은 아직 구현되지 않은 hardening 목표입니다."
      ariaLabel="digest h1으로 만든 edit가 h2로 바뀐 file에 적용되는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <section className="min-w-0 rounded-lg border border-border p-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-mono text-xs font-bold">src/auth.ts</p>
              <p className="font-mono text-xs text-muted-foreground">digest {(DIGEST as readonly string[])[active]}</p>
            </div>
            <ol className="mt-2 space-y-1">
              {LINES[active].map((cell, i) => (
                <li
                  key={i}
                  className={`truncate rounded border border-transparent px-2 py-1 font-mono text-xs ${TONE_CLASS[cell.tone]}`}
                >
                  {cell.text}
                </li>
              ))}
            </ol>
          </section>
          <section className="min-w-0 rounded-lg border border-border p-3">
            <p className="text-xs font-bold">edit 적용 검사</p>
            <dl className="mt-2 space-y-2">
              {CHECK_LABELS.map((label, i) => (
                <div key={label} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-2 text-xs leading-5">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className={CHECKS[active][i] === "대기" ? "text-muted-foreground/60" : "font-semibold"}>
                    {CHECKS[active][i]}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      )}
    />
  );
}
