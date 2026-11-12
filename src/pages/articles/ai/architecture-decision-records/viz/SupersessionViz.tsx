import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #supersession — 작업자 1개 → 4개(가정). ADR-005는 고치지 않고 ADR-006에서 다시 비교한다.
 * 대체되면 ADR-005 Status만 superseded + 링크, Context·Decision은 남고 배포 결과를 소급해 바꾸지 않는다.
 */
type Field = { name: string; value: string; tone?: "changed" | "kept" | "muted" };
type Doc = { id: string; fields: readonly Field[] } | null;

const SCENES = [
  {
    label: "ADR-005 채택",
    summary: "accepted · rollout pending",
    note: "8절의 예시 기록입니다. Accepted는 결정에 합의했다는 상태일 뿐 이전·배포 완료 표시가 아니어서, 구현 추적을 따로 적습니다.",
    left: { id: "ADR-005", fields: [
      { name: "Context", value: "프로필 200개 · A만 복구 · 작업자 1개" },
      { name: "Decision", value: "프로필별 파일" },
      { name: "Status", value: "accepted", tone: "changed" },
      { name: "rollout", value: "pending" },
    ] },
    right: null,
  },
  {
    label: "조건 변화",
    summary: "작업자 1개 → 4개 (가정)",
    note: "같은 프로필에 동시 쓰기가 필요해졌습니다. ADR-005의 Context를 고쳐 과거에도 4개였다고 쓰지 않습니다. 작업자 1개라는 당시 조건이 그대로 남아야 다시 판단할 이유가 보입니다.",
    left: { id: "ADR-005", fields: [
      { name: "Context", value: "작업자 1개 (당시 조건, 고치지 않음)", tone: "kept" },
      { name: "Decision", value: "프로필별 파일" },
      { name: "Status", value: "accepted" },
      { name: "rollout", value: "pending" },
    ] },
    right: null,
  },
  {
    label: "ADR-006 검토",
    summary: "proposed · 같은 기준으로 재비교",
    note: "바뀐 조건을 ADR-006에 적고 파일과 데이터베이스를 같은 기준으로 다시 비교합니다. Proposed는 아직 검토 중이라는 뜻입니다. 숫자가 바뀌었다고 데이터베이스를 자동 채택하지는 않습니다.",
    left: { id: "ADR-005", fields: [
      { name: "Context", value: "작업자 1개" },
      { name: "Decision", value: "프로필별 파일" },
      { name: "Status", value: "accepted" },
      { name: "rollout", value: "pending" },
    ] },
    right: { id: "ADR-006", fields: [
      { name: "Context", value: "작업자 4개 · 같은 프로필 동시 쓰기", tone: "changed" },
      { name: "Options", value: "파일 / 데이터베이스 × 같은 기준", tone: "changed" },
      { name: "Decision", value: "비교 뒤 결정", tone: "muted" },
      { name: "Status", value: "proposed", tone: "changed" },
    ] },
  },
  {
    label: "대체하는 경우",
    summary: "ADR-005 → superseded + 링크",
    note: "새 선택이 ADR-005를 대체하면 ADR-005에는 superseded와 ADR-006 링크만 붙습니다. 이전 코드가 왜 그 형태였는지 설명하는 Context와 Decision은 남기고, 배포 결과를 소급해 성공으로 바꾸지 않습니다.",
    left: { id: "ADR-005", fields: [
      { name: "Context", value: "작업자 1개 (남김)", tone: "kept" },
      { name: "Decision", value: "프로필별 파일 (남김)", tone: "kept" },
      { name: "Status", value: "superseded → ADR-006", tone: "changed" },
      { name: "rollout", value: "기록 그대로 (소급 변경 없음)", tone: "kept" },
    ] },
    right: { id: "ADR-006", fields: [
      { name: "Context", value: "작업자 4개 · 같은 프로필 동시 쓰기" },
      { name: "Options", value: "파일 / 데이터베이스 × 같은 기준" },
      { name: "Decision", value: "재비교 결과 (이 글은 정하지 않음)", tone: "muted" },
      { name: "Status", value: "accepted", tone: "changed" },
    ] },
  },
] as const satisfies readonly { label: string; summary: string; note: string; left: Doc; right: Doc }[];

const TONE: Record<NonNullable<Field["tone"]>, string> = {
  changed: "font-semibold text-blue-700 dark:text-blue-400",
  kept: "font-semibold text-emerald-700 dark:text-emerald-400",
  muted: "italic text-muted-foreground",
};

function DocCard({ doc, placeholder }: { doc: Doc; placeholder: string }) {
  if (!doc) {
    return (
      <div className="flex min-h-[9.5rem] items-center justify-center rounded-lg border border-dashed border-border/60 px-3 py-3 text-center text-xs text-muted-foreground">
        {placeholder}
      </div>
    );
  }
  return (
    <div className="min-w-0 rounded-lg border border-border bg-background px-3 py-3">
      <p className="font-mono text-sm font-bold">{doc.id}</p>
      <dl className="mt-2 space-y-1.5 text-xs leading-5">
        {doc.fields.map((field) => (
          <div key={field.name} className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-2">
            <dt className="font-mono text-muted-foreground">{field.name}</dt>
            <dd className={`min-w-0 break-words ${field.tone ? TONE[field.tone] : ""}`}>{field.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function SupersessionViz() {
  return (
    <SceneShell
      eyebrow="기록의 대체"
      title="조건이 바뀌어도 이전 기록은 고치지 않고 새 기록으로 잇습니다"
      description="두 장의 기록에서 어느 칸이 바뀌고 어느 칸이 남는지 봅니다. 파란 글씨는 이번 장면에서 새로 적힌 칸, 초록 글씨는 일부러 그대로 둔 칸입니다. 작업자 4개는 9절의 가정입니다."
      ariaLabel="ADR-005와 ADR-006의 상태 변화"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="grid min-w-0 gap-3 sm:grid-cols-2">
              <DocCard doc={scene.left} placeholder="" />
              <DocCard doc={scene.right} placeholder="ADR-006 아직 없음" />
            </div>
          ))}
        />
      )}
    />
  );
}
