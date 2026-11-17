import SceneShell from "./SceneShell";

/**
 * 본문 대응: #deletion-derived-data 두 번째 문단 — 즉시 덮어쓸 수 없는 backup과 restore 뒤 재삭제.
 * 순서: primary 삭제 + tombstone 기록 → restore → (A) pre-serve deletion 뒤 service, (B) service 먼저 → 재등장.
 * B는 글의 실패 주입 표 "Backup restore 뒤 삭제 대상 재등장"입니다. 레코드 이름 R은 설명용입니다.
 */
type Lane = { text: string; tone: "present" | "gone" | "mark" | "bad" | "idle" };

const SCENES = [
  {
    label: "삭제 직후",
    summary: "service에서는 사라짐 · backup에는 남음",
    lanes: [
      { text: "R 없음", tone: "gone" },
      { text: "R 남음 · 즉시 덮어쓰지 못할 수 있음", tone: "present" },
      { text: "R 삭제 표지", tone: "mark" },
      { text: "비어 있음", tone: "idle" },
    ],
    note: "Primary에서 R을 지웠지만 backup은 보존·복구 목적과 immutability(쓴 뒤 바꿀 수 없게 막는 성질) 때문에 R만 골라 즉시 덮어쓰지 못할 수 있습니다. 그래서 지운 대상의 ID를 tombstone(삭제 표지)으로 남깁니다.",
  },
  {
    label: "만료 전까지 격리",
    summary: "backup expiry · access isolation",
    lanes: [
      { text: "R 없음", tone: "gone" },
      { text: "R 남음 · 접근 격리 · expiry 대기", tone: "present" },
      { text: "R 삭제 표지", tone: "mark" },
      { text: "비어 있음", tone: "idle" },
    ],
    note: "남아 있는 동안에는 backup의 만료 시점과 접근 격리를 계약으로 정해 둡니다. 이 상태는 R이 파기됐다는 뜻이 아닙니다.",
  },
  {
    label: "restore",
    summary: "복원 환경에 R이 다시 나타남",
    lanes: [
      { text: "R 없음 · 복원본 미연결", tone: "gone" },
      { text: "R 남음", tone: "present" },
      { text: "R 삭제 표지", tone: "mark" },
      { text: "R 다시 나타남", tone: "bad" },
    ],
    note: "Backup을 restore environment에 되살리면 지웠던 R도 함께 돌아옵니다. 여기서 service 순서가 갈립니다.",
  },
  {
    label: "올바른 순서",
    summary: "tombstone 재적용 → evidence → service",
    lanes: [
      { text: "R 없이 service", tone: "gone" },
      { text: "R 남음", tone: "present" },
      { text: "적용 완료 기록", tone: "mark" },
      { text: "R 재삭제", tone: "gone" },
    ],
    note: "Service 전에 tombstone을 다시 적용해 R을 지우는 pre-serve deletion을 하고, 그 evidence를 남긴 뒤에만 service로 연결합니다.",
  },
  {
    label: "잘못된 순서",
    summary: "service 먼저 → 삭제 대상 재등장",
    lanes: [
      { text: "R 다시 보임", tone: "bad" },
      { text: "R 남음", tone: "present" },
      { text: "적용 전", tone: "mark" },
      { text: "R 그대로 연결", tone: "bad" },
    ],
    note: "Tombstone을 적용하기 전에 service를 열면 지운 R이 다시 보입니다. 글의 실패 주입 표는 이 경우 restore test를 실패시킵니다.",
  },
] as const satisfies readonly { label: string; summary: string; lanes: readonly Lane[]; note: string }[];

const LANES = ["Service (primary)", "Backup", "Tombstone 목록", "Restore 환경"] as const;

const TONE: Record<Lane["tone"], string> = {
  present: "text-amber-700 dark:text-amber-400",
  gone: "text-emerald-700 dark:text-emerald-400",
  mark: "text-primary",
  bad: "text-red-700 dark:text-red-400",
  idle: "text-muted-foreground",
};
const MARK: Record<Lane["tone"], string> = { present: "◐", gone: "●", mark: "▤", bad: "✕", idle: "○" };

export default function RestoreTombstoneViz() {
  return (
    <SceneShell
      eyebrow="backup과 restore"
      title="복원한 데이터는 삭제 표지를 다시 적용한 뒤에만 서비스에 나갑니다"
      description="R은 이미 삭제를 요청받은 한 사람의 레코드입니다(설명용). ●는 R이 보이지 않음, ◐는 R이 남아 있음, ▤는 삭제 표지, ✕는 지운 R이 다시 노출됨입니다."
      ariaLabel="backup에 남은 삭제 대상이 restore 뒤 tombstone 재적용 여부에 따라 사라지거나 재등장하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid grid-cols-2 gap-2">
            {LANES.map((lane, index) => (
              <div key={lane} className="min-w-0 rounded-lg border border-border bg-background px-3 py-2 text-xs sm:text-sm">
                <p className="text-[11px] font-semibold text-muted-foreground">{lane}</p>
                <p className={`mt-0.5 break-keep font-semibold ${TONE[scene.lanes[index].tone]}`}>
                  {MARK[scene.lanes[index].tone]} {scene.lanes[index].text}
                </p>
              </div>
            ))}
          </div>
        );
      }}
    />
  );
}
