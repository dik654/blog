import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #cell-architecture "Stateful serving은 state의 소유자와 version을 함께 저장한다".
 * entity_id·session을 key로 hidden·cell state, model revision, 마지막 event time을 함께 저장하고,
 * session 종료·긴 gap·model 교체·entity 변경에서 reset, migration에서는 같은 version state를 한 번만 handoff.
 * entity A·B, session s1·s2, revision r1·r2, replica 1·2는 설명용 이름(가정).
 */
type Record = { key: string; state: string; revision: string; place: string };

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  event: string;
  action: string;
  before: Record;
  after: Record;
  negative: string;
}[] = [
  {
    label: "같은 session",
    summary: "state를 이어서 갱신",
    note: "같은 entity·session의 다음 event라면 저장된 hidden·cell state에서 이어서 계산하고, 마지막 event time을 갱신합니다.",
    event: "A의 다음 event",
    action: "이어 씀",
    before: { key: "A · s1", state: "직전 h · c", revision: "r1", place: "replica 1" },
    after: { key: "A · s1", state: "갱신된 h · c", revision: "r1", place: "replica 1" },
    negative: "—",
  },
  {
    label: "Session 종료 · 긴 gap",
    summary: "명시적으로 reset",
    note: "Session이 끝났거나 event 사이 gap이 길면 이전 state를 이어 쓰지 않고 명시적으로 reset한 뒤 새 session을 시작합니다.",
    event: "session 종료 / 긴 gap",
    action: "reset",
    before: { key: "A · s1", state: "직전 h · c", revision: "r1", place: "replica 1" },
    after: { key: "A · s2", state: "초기 state", revision: "r1", place: "replica 1" },
    negative: "—",
  },
  {
    label: "Entity 변경",
    summary: "A의 state를 B에 넘기지 않음",
    note: "다른 entity의 event가 오면 key가 바뀝니다. A의 state를 B 계산에 쓰지 않고 reset합니다. Test에서는 A state를 B에 일부러 주입해 output과 audit receipt가 예상대로 실패하는지 봅니다.",
    event: "B의 event",
    action: "reset",
    before: { key: "A · s1", state: "A의 h · c", revision: "r1", place: "replica 1" },
    after: { key: "B · s1", state: "초기 state", revision: "r1", place: "replica 1" },
    negative: "A state를 B에 주입 → 실패해야 함",
  },
  {
    label: "Model 교체",
    summary: "revision이 바뀌면 reset",
    note: "Model revision이 바뀌면 이전 revision이 만든 state를 새 model에 넣지 않고 reset합니다. Test에서는 stale revision의 state를 읽게 해 실패하는지 봅니다.",
    event: "model r1 → r2",
    action: "reset",
    before: { key: "A · s1", state: "r1이 만든 h · c", revision: "r1", place: "replica 1" },
    after: { key: "A · s1", state: "초기 state", revision: "r2", place: "replica 1" },
    negative: "stale revision(r1) 읽기 → 실패해야 함",
  },
  {
    label: "Replica migration",
    summary: "같은 version을 한 번만 handoff",
    note: "Replica를 옮길 때는 같은 revision의 state를 정확히 한 번 넘깁니다. Test에서는 handoff가 두 번 되거나 빠지는 경우를 만들어 실패하는지 봅니다.",
    event: "replica 1 → 2",
    action: "handoff 1회",
    before: { key: "A · s1", state: "직전 h · c", revision: "r1", place: "replica 1" },
    after: { key: "A · s1", state: "직전 h · c", revision: "r1", place: "replica 2" },
    negative: "duplicate · missing handoff → 실패해야 함",
  },
];

const FIELDS: readonly [keyof Record, string][] = [
  ["key", "entity_id · session"],
  ["state", "hidden · cell"],
  ["revision", "model revision"],
  ["place", "보관 위치"],
];

function Ledger({ before, after }: { before: Record; after: Record }) {
  return (
    <div className="grid grid-cols-[minmax(0,5.5rem)_minmax(0,1fr)_minmax(0,1fr)] gap-px overflow-hidden rounded-lg border border-border bg-border text-xs leading-5 sm:grid-cols-[minmax(0,9rem)_minmax(0,1fr)_minmax(0,1fr)]">
      <span className="bg-background px-2 py-1.5 text-muted-foreground">저장 칸</span>
      <span className="bg-background px-2 py-1.5 font-bold text-muted-foreground">event 전</span>
      <span className="bg-background px-2 py-1.5 font-bold text-muted-foreground">event 뒤</span>
      {FIELDS.map(([field, label]) => {
        const diff = before[field] !== after[field];
        return (
          <div key={field} className="contents">
            <span className="break-keep bg-background px-2 py-1.5 text-muted-foreground">{label}</span>
            <span className="break-keep bg-background px-2 py-1.5 font-mono">{before[field]}</span>
            <span className={`break-keep bg-background px-2 py-1.5 font-mono ${diff ? "font-bold text-primary" : ""}`}>{after[field]}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function StateLifetimeViz() {
  return (
    <SceneShell
      eyebrow="State의 소유자와 수명"
      title="저장된 state는 key와 revision이 맞을 때만 이어 씁니다"
      description="가운데 열이 event 전, 오른쪽 열이 event 뒤의 저장 기록입니다. 바뀐 칸은 굵게 표시합니다. 마지막 event time도 함께 저장하지만 그림에서는 생략했습니다. A·B, s1·s2, r1·r2는 설명용 이름입니다(가정)."
      ariaLabel="stateful LSTM serving에서 event 종류별로 state를 이어 쓰거나 reset하는 규칙"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene) => (
          <div key={scene.label} className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="break-keep text-muted-foreground">{scene.event}</span>
              <span aria-hidden className="text-primary">→</span>
              <span className={`rounded-md border px-2 py-0.5 font-bold ${scene.action === "reset" ? "border-amber-600 text-amber-700 dark:text-amber-400" : "border-primary/50 text-primary"}`}>{scene.action}</span>
            </div>
            <Ledger before={scene.before} after={scene.after} />
            <p className="mt-3 rounded-md border border-dashed border-border px-3 py-2 text-xs leading-5">
              <b>Negative fixture</b> <span className="text-muted-foreground">{scene.negative}</span>
            </p>
          </div>
          ))}
        />
      )}
    />
  );
}
