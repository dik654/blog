import SceneShell from "./SceneShell";

/**
 * 본문 대응: #langgraph — 목록 추가 vs 작업 ID 집합 리듀서.
 * 도착 순서 t-01 → t-03 → t-02 → t-02(재시도, 같은 식별값) → t-02(다른 식별값).
 * 목록 추가: 1 → 2 → 3 → 4 → 5칸. 작업 ID 집합: 1 → 2 → 3 → 3 → 3 + 충돌.
 * 작업 ID·식별값 8b2·a41·c07은 도입부 Viz의 예시, 7c9는 그림을 위한 가정.
 */
type Arrival = { id: string; hash: string; tag: string };

const ARRIVALS: readonly Arrival[] = [
  { id: "t-01", hash: "8b2", tag: "첫 도착" },
  { id: "t-03", hash: "c07", tag: "순서 바뀜" },
  { id: "t-02", hash: "a41", tag: "늦게 도착" },
  { id: "t-02", hash: "a41", tag: "재시도·같은 값" },
  { id: "t-02", hash: "7c9", tag: "같은 ID·다른 값" },
];

const TASKS = ["t-01", "t-02", "t-03"] as const;

const SCENES = [
  { label: "t-01 도착", summary: "목록 1 · 집합 1", note: "두 리듀서 모두 결과 하나를 받습니다. t-02·t-03은 아직 pending입니다." },
  { label: "t-03이 먼저 도착", summary: "목록 2 · 집합 2", note: "병렬 분기는 끝나는 순서가 정해져 있지 않습니다. 목록은 온 순서대로 붙고, 집합은 작업 ID만 셉니다." },
  { label: "t-02 도착", summary: "목록 3 · 집합 3", note: "목록은 도착 순서(01·03·02)를 따라 달라지지만, 집합은 어떤 순서로 와도 같은 세 작업입니다." },
  { label: "t-02 재시도 도착", summary: "목록 4 · 집합 3", note: "같은 결과 a41이 다시 왔습니다. 목록에는 중복이 생기고, 집합은 이미 있는 값이라 한 번만 반영합니다." },
  { label: "t-02에 다른 식별값", summary: "집합 → 충돌", note: "t-02에 다른 값 7c9(가정)가 왔습니다. 집합은 조용히 덮어쓰지 않고 충돌로 올립니다." },
] as const;

const SLOTS = 5;

function Chip({ text, tone }: { text: string; tone: "on" | "dup" | "bad" | "empty" }) {
  const cls =
    tone === "on"
      ? "border-[#2563eb] text-foreground"
      : tone === "dup"
        ? "border-[#d97706] text-[#b45309] dark:text-[#fbbf24]"
        : tone === "bad"
          ? "border-[#dc2626] text-[#b91c1c] dark:text-[#f87171]"
          : "border-dashed border-border text-transparent";
  return <span className={`flex h-9 min-w-0 items-center justify-center rounded-md border px-1 font-mono text-[11px] leading-4 sm:text-xs ${cls}`}>{text}</span>;
}

export default function ReducerRetryViz() {
  return (
    <SceneShell
      eyebrow="리듀서 비교"
      title="재시도와 순서 바뀜에서 목록과 집합이 갈라집니다"
      description="목록 추가(list append)는 온 순서대로 뒤에 붙이고, 집합(set) 리듀서는 작업 ID를 키로 씁니다. 칩은 작업 번호·결과 식별값이고 주황은 이미 있던 작업 ID입니다. 도착 순서와 7c9는 그림을 위한 가정입니다."
      ariaLabel="결과가 순서를 바꿔 오거나 재시도로 다시 올 때 목록 추가와 집합 리듀서의 상태 비교"
      scenes={SCENES}
      render={(active) => {
        const seen = ARRIVALS.slice(0, active + 1);
        const latest = ARRIVALS[active];
        const statusOf = (task: string) => (seen.some((a) => a.id === task) ? "success" : "pending");
        const conflict = active === 4;
        return (
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-y border-border py-2 text-xs">
              <span className="font-semibold text-muted-foreground">도착</span>
              <span className="font-mono font-bold text-primary">
                {latest.id}@{latest.hash}
              </span>
              <span className="text-muted-foreground">{latest.tag}</span>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1 text-center text-[11px]">
              {TASKS.map((task) => {
                const status = statusOf(task);
                return (
                  <div key={task} className="min-w-0 truncate">
                    <span className="font-mono font-semibold">{task}</span>{" "}
                    <span className={status === "success" ? "text-primary" : "text-muted-foreground"}>{status}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 sm:gap-4">
              <section className="min-w-0">
                <p className="text-xs font-bold">목록 추가 · {seen.length}칸</p>
                <div className="mt-2 grid grid-cols-5 gap-1">
                  {Array.from({ length: SLOTS }, (_, i) => {
                    const item = seen[i];
                    const dup = item !== undefined && seen.slice(0, i).some((a) => a.id === item.id);
                    return <Chip key={i} text={item ? `${item.id.slice(2)}·${item.hash}` : "·"} tone={item ? (dup ? "dup" : "on") : "empty"} />;
                  })}
                </div>
              </section>
              <section className="min-w-0">
                <p className="text-xs font-bold">작업 ID 집합 · {new Set(seen.map((a) => a.id)).size}개</p>
                <div className="mt-2 grid grid-cols-3 gap-1">
                  {TASKS.map((task) => {
                    const first = seen.find((a) => a.id === task);
                    const bad = conflict && task === "t-02";
                    return <Chip key={task} text={first ? (bad ? "a41≠7c9" : `${task}@${first.hash}`) : "·"} tone={first ? (bad ? "bad" : "on") : "empty"} />;
                  })}
                </div>
                <p className={`mt-2 text-[11px] ${conflict ? "font-bold text-[#b91c1c] dark:text-[#f87171]" : "text-muted-foreground"}`}>
                  {conflict ? "충돌 · 결과를 합치지 않음" : "같은 ID·같은 값은 한 번만"}
                </p>
              </section>
            </div>
          </div>
        );
      }}
    />
  );
}
