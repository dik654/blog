import SceneShell from "./SceneShell";

/**
 * 본문 대응: #langchain "Node는 state 전체를 마음대로 고치기보다 update를 반환합니다".
 * phase는 새 값으로 덮어쓰고, audit_events는 기존 list 뒤에 붙인다.
 * reducer를 잘못 정하면 retry 때 event가 사라지거나 중복된다.
 * event 이름과 phase 값은 설명용 가정이다.
 */
type Field = "phase" | "audit_events";

interface Scene {
  label: string;
  summary: string;
  note: string;
  field: Field;
  rule: string;
  ok: boolean;
  before: readonly string[];
  update: readonly string[];
  after: readonly string[];
}

const SCENES: readonly Scene[] = [
  {
    label: "phase는 덮어씁니다",
    summary: "정책 판정 → 승인 대기",
    note: "현재 단계는 하나만 있으면 됩니다. Node가 새 phase를 돌려주면 reducer는 기존 값을 버리고 새 값으로 바꿉니다.",
    field: "phase",
    rule: "덮어쓰기",
    ok: true,
    before: ["정책 판정"],
    update: ["승인 대기"],
    after: ["승인 대기"],
  },
  {
    label: "audit_events는 뒤에 붙입니다",
    summary: "event 1개 + 1개 = 2개",
    note: "기록은 지난 일이 남아야 하므로 기존 list 뒤에 새 event를 붙입니다. Node는 새 event 하나만 update로 돌려줍니다.",
    field: "audit_events",
    rule: "뒤에 붙이기",
    ok: true,
    before: ["주문 조회됨"],
    update: ["정책 판정됨"],
    after: ["주문 조회됨", "정책 판정됨"],
  },
  {
    label: "잘못 정하면 사라집니다",
    summary: "2개여야 할 기록이 1개",
    note: "audit_events에 덮어쓰기 reducer를 고르면 새 event가 들어올 때 앞의 기록이 지워집니다.",
    field: "audit_events",
    rule: "덮어쓰기 (잘못된 선택)",
    ok: false,
    before: ["주문 조회됨"],
    update: ["정책 판정됨"],
    after: ["정책 판정됨"],
  },
  {
    label: "retry 때 중복될 수 있습니다",
    summary: "같은 update가 두 번 → 3개",
    note: "같은 transition을 retry해 같은 event update가 다시 들어오면, 단순히 붙이기만 하는 규칙은 같은 기록을 두 번 남깁니다. 어떤 합치기 규칙이 맞는지는 field의 의미로 정합니다.",
    field: "audit_events",
    rule: "뒤에 붙이기 · retry",
    ok: false,
    before: ["주문 조회됨", "정책 판정됨"],
    update: ["정책 판정됨"],
    after: ["주문 조회됨", "정책 판정됨", "정책 판정됨"],
  },
];

function Column({ title, items, tone }: { title: string; items: readonly string[]; tone: "base" | "update" | "ok" | "bad" }) {
  const border = tone === "update" ? "border-blue-600" : tone === "ok" ? "border-emerald-600" : tone === "bad" ? "border-red-600" : "border-border";
  return (
    <div className="min-w-0">
      <p className="text-xs font-bold text-muted-foreground">{title}</p>
      <div className={`mt-2 min-h-[8.5rem] rounded-lg border p-2 ${border}`}>
        <ul className="space-y-1.5">
          {items.map((item, index) => (
            <li key={`${item}-${index}`} className="break-keep rounded border border-border/70 bg-background px-2 py-1 text-xs leading-5">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function ReducerMergeViz() {
  return (
    <SceneShell
      eyebrow="reducer"
      title="같은 update도 field마다 합치는 규칙이 다릅니다"
      description="Node는 state 전체가 아니라 바꿀 field만 돌려주고, reducer가 기존 값과 합칩니다. 칸 안의 phase 값과 event 이름은 설명용입니다(가정)."
      ariaLabel="phase는 덮어쓰고 audit_events는 붙이는 reducer와, 잘못된 reducer에서 기록이 사라지거나 중복되는 경우"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <p className="mb-3 text-xs text-muted-foreground">
              field <code className="font-mono font-bold text-foreground">{scene.field}</code> · 합치는 규칙{" "}
              <span className={`font-bold ${scene.ok ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>{scene.rule}</span>
            </p>
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <Column title="기존 state" items={scene.before} tone="base" />
              <Column title="node update" items={scene.update} tone="update" />
              <Column title="합친 결과" items={scene.after} tone={scene.ok ? "ok" : "bad"} />
            </div>
          </div>
        );
      }}
    />
  );
}
