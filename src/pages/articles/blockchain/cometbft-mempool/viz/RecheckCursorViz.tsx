import SceneShell from "./SceneShell";

/**
 * 본문 대응: #recheck — recheck callback은 시작 때 잡은 cursor와 end 사이에서 응답 tx를 순서대로 찾는다.
 * 응답이 늦거나 빠지면 cursor가 일부 entry를 건너뛸 수 있고, RecheckTimeout 뒤 늦은 응답은 버린다.
 * pool의 A·B·C 세 entry와 응답 도착 순서는 설명용 가정이다.
 * v0.40.0 findNextEntryMatching/tryFinish: end entry의 응답을 처리하면 그 자리에서 done이 되므로,
 * timeout 장면이 성립하려면 end(C)의 응답이 오지 않아야 한다. 그래서 end를 B가 아닌 C로 둔다.
 */
type Mark = "wait" | "removed" | "kept" | "skipped" | "late" | "unjudged";

const ENTRIES = ["T2", "A", "B", "C"] as const;
const NO_CURSOR = ENTRIES.length;

const SCENES = [
  { label: "cursor와 end", summary: "T2 → A → B → C 순서로 응답 기다림", cursor: 0, done: false, marks: ["wait", "wait", "wait", "wait"], note: "Recheck가 시작될 때 cursor는 list 맨 앞 T2, end는 맨 뒤 C를 가리킵니다. 네 entry 모두 X41 기준 CheckTxType_Recheck 요청을 보냈고 응답을 기다립니다." },
  { label: "T2 응답", summary: "invalid → pool에서 제거", cursor: 1, done: false, marks: ["removed", "wait", "wait", "wait"], note: "T2의 응답이 먼저 옵니다. cursor 위치와 일치하고 X41에서 invalid이므로 pool에서 지웁니다. cursor는 다음 entry A로 갑니다." },
  { label: "A 응답 없이 B 응답", summary: "cursor가 A를 지나 B를 찾음", cursor: 3, done: false, marks: ["removed", "skipped", "kept", "wait"], note: "A의 응답이 늦거나 빠진 채 B의 응답이 옵니다. cursor는 B를 찾을 때까지 순서대로 나아가므로 A는 X41 판정 없이 pool에 남은 채 지나갑니다. B는 valid라 남는다고 두었습니다(가정). cursor는 다음 C를 가리킵니다." },
  { label: "RecheckTimeout", summary: "done · 늦은 A 응답은 버림", cursor: NO_CURSOR, done: true, marks: ["removed", "late", "kept", "unjudged"], note: "C의 응답도 오지 않은 채 RecheckTimeout이 지나면 recheck state를 done으로 바꿉니다. 그 뒤 A의 응답이 도착해도 버립니다. A와 C는 X41 판정 없이 pool에 남으므로, Timeout은 남은 entry가 모두 valid라는 영수증이 아닙니다." },
] as const;

const MARK_TEXT: Record<Mark, string> = {
  wait: "응답 대기",
  removed: "invalid · 제거",
  kept: "valid · 잔류",
  skipped: "응답 없이 건너뜀",
  late: "늦은 응답 버림 · 판정 없음",
  unjudged: "응답 없음 · 판정 없음",
};

const MARK_TONE: Record<Mark, string> = {
  wait: "border-border text-muted-foreground",
  removed: "border-red-600 text-red-700 line-through dark:text-red-400",
  kept: "border-emerald-600 text-emerald-700 dark:text-emerald-400",
  skipped: "border-dashed border-amber-600 text-amber-700 dark:text-amber-400",
  late: "border-dashed border-amber-600 text-amber-700 dark:text-amber-400",
  unjudged: "border-dashed border-amber-600 text-amber-700 dark:text-amber-400",
};

export default function RecheckCursorViz() {
  return (
    <SceneShell
      eyebrow="Recheck cursor"
      title="응답 하나가 빠지면 cursor는 그 entry를 건너뛰고, timeout 뒤 늦은 응답은 버려집니다"
      description="왼쪽에서 오른쪽이 pool의 list 순서입니다. ▼가 cursor 위치입니다. A·B·C 세 entry와 응답 순서는 설명용 가정입니다(가정)."
      ariaLabel="recheck cursor가 응답 순서에 따라 entry를 제거하거나 건너뛰고 timeout 뒤 늦은 응답을 버리는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const marks = scene.marks as readonly Mark[];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-center text-[11px] leading-5 sm:text-xs">
              {ENTRIES.map((name, index) => (
                <div key={name} className="min-w-0">
                  <div className={`h-5 font-bold text-primary ${scene.cursor === index ? "" : "invisible"}`} aria-hidden>▼ cursor</div>
                  <div className={`min-h-[5.5rem] sm:min-h-[4.5rem] rounded-md border p-1.5 sm:p-2 ${MARK_TONE[marks[index]]}`}>
                    <strong className="block font-mono text-sm">{name}</strong>
                    <span className="block break-keep">{MARK_TEXT[marks[index]]}</span>
                  </div>
                  <div className="mt-1 h-5 text-[10px] text-muted-foreground">{index === 0 ? "start" : index === ENTRIES.length - 1 ? "end" : ""}</div>
                </div>
              ))}
            </div>
            <div className={`mt-2 rounded-md border px-3 py-2 text-xs ${scene.done ? "border-amber-600 font-bold text-amber-700 dark:text-amber-400" : "border-border text-muted-foreground"}`}>
              recheck 상태: {scene.done ? "done (timeout)" : "진행 중"}
            </div>
          </div>
        );
      }}
    />
  );
}
