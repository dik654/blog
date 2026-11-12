import SceneShell from "./SceneShell";

/**
 * 본문 대응: #timing-source — 의사코드 "한 단계의 동의 묶음 검사".
 * 기대한 문맥 = 주문 7·후보 X. 도착 순서는 설명용 가정.
 * A×3 → seen 크기 1, B → 2, D(X) → 3 ≥ q=3, D(Y) → X 표로 세지 않고 위반 증거로 보존.
 */
const MESSAGES = [
  { from: "A", target: "X", verdict: "새 발신자 → 추가" },
  { from: "A", target: "X", verdict: "이미 셈 → 그대로" },
  { from: "A", target: "X", verdict: "이미 셈 → 그대로" },
  { from: "B", target: "X", verdict: "새 발신자 → 추가" },
  { from: "D", target: "X", verdict: "새 발신자 → 추가" },
  { from: "D", target: "Y", verdict: "문맥 다름 → 거절" },
] as const;

const SEEN_AFTER: readonly (readonly string[])[] = [["A"], ["A"], ["A"], ["A", "B"], ["A", "B", "D"], ["A", "B", "D"]];

const SCENES = [
  { label: "A의 표 도착", summary: "seen = {A} · 1/3", note: "서명과 문맥(주문 7·후보 X)이 맞고 A는 처음 보는 발신자입니다. seen에 A를 넣어 크기는 1입니다." },
  { label: "A의 표가 또 도착", summary: "seen = {A} · 1/3", note: "같은 A의 표가 다른 경로로 다시 왔습니다. seen에 이미 있으므로 표 수에 더하지 않습니다." },
  { label: "A의 표가 세 번째", summary: "seen = {A} · 1/3", note: "A의 표를 세 번 받아도 크기는 1입니다. 같은 사람의 서명 세 개는 세 사람의 동의가 아닙니다." },
  { label: "B의 표 도착", summary: "seen = {A, B} · 2/3", note: "B는 명단에 있고 문맥도 같으므로 seen에 들어갑니다. 크기는 2라 아직 필요한 3에 못 미칩니다." },
  { label: "D의 X 표 도착", summary: "seen = {A, B, D} · 3/3", note: "세 번째 서로 다른 발신자입니다. |seen| ≥ 3이 되어 이 단계의 동의 근거가 나옵니다. 이것만으로 어떤 단계에서나 최종 확정해도 된다는 뜻은 아닙니다." },
  { label: "D의 Y 표 도착", summary: "X 표는 그대로 3 · 위반 증거 보존", note: "후보가 Y라 기대한 문맥과 달라 X 표로 세지 않습니다. 같은 D가 X와 Y에 서명했으므로 위반 증거로 보존하되, D를 없었던 것으로 지우거나 장애 허용 수를 다시 계산하지 않습니다." },
] as const;

const ROSTER = ["A", "B", "C", "D"] as const;

export default function VoteCountViz() {
  return (
    <SceneShell
      eyebrow="표 세기"
      title="서명 메시지 여섯 개가 들어와도 셀 수 있는 사람은 셋입니다"
      description="기대한 문맥은 주문 7·후보 X이고 필요한 수는 3입니다. 왼쪽은 도착한 메시지(도착 순서는 가정), 오른쪽 seen은 이미 센 서로 다른 발신자 집합입니다."
      ariaLabel="중복과 문맥을 걸러 서로 다른 발신자만 세는 과정"
      scenes={SCENES}
      render={(active) => {
        const seen = SEEN_AFTER[active];
        const evidence = active === 5;
        return (
          <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <ol className="space-y-1.5">
              {MESSAGES.map((m, i) => {
                const state = i < active ? "done" : i === active ? "now" : "wait";
                return (
                  <li
                    key={i}
                    className={`grid grid-cols-[1rem_6.5rem_minmax(0,1fr)] items-center gap-2 rounded-md border px-2 py-1 text-xs ${
                      state === "now" ? "border-primary bg-primary/10" : state === "done" ? "border-border" : "border-dashed border-border/50 text-muted-foreground/50"
                    }`}
                  >
                    <span className="font-mono text-muted-foreground">{i + 1}</span>
                    <span className="whitespace-nowrap font-mono font-semibold" style={state === "wait" ? undefined : { color: m.from === "D" ? "#dc2626" : undefined }}>
                      {m.from}: vote(7, {m.target})
                    </span>
                    <span className={state === "wait" ? "" : m.verdict.endsWith("추가") ? "text-[#15803d] dark:text-[#4ade80]" : "text-muted-foreground"}>
                      {state === "wait" ? "대기" : m.verdict}
                    </span>
                  </li>
                );
              })}
            </ol>
            <div className="min-w-0 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground">seen (명단 A·B·C·D)</p>
              <div className="grid grid-cols-4 gap-1.5">
                {ROSTER.map((p) => {
                  const inSeen = seen.includes(p);
                  return (
                    <span
                      key={p}
                      className={`flex h-10 items-center justify-center rounded-md border text-sm font-bold ${inSeen ? "border-[#2563eb] bg-[#2563eb1a] text-[#2563eb] dark:text-[#93c5fd]" : "border-dashed border-border/60 text-muted-foreground/50"}`}
                    >
                      {p}
                    </span>
                  );
                })}
              </div>
              <div>
                <div className="flex h-3 overflow-hidden rounded-sm bg-muted/50">
                  {[0, 1, 2].map((k) => (
                    <span key={k} className="h-full flex-1 border-r border-background last:border-r-0" style={{ backgroundColor: k < seen.length ? "#2563eb" : "transparent" }} />
                  ))}
                </div>
                <p className="mt-1 font-mono text-xs">|seen| = {seen.length} / 필요 3{seen.length >= 3 ? " → 동의 근거" : ""}</p>
              </div>
              <div className={`rounded-md border px-2 py-1.5 text-xs leading-5 ${evidence ? "border-[#dc2626] text-[#b91c1c] dark:text-[#fca5a5]" : "border-dashed border-border/50 text-muted-foreground/50"}`}>
                위반 증거: {evidence ? "D가 주문 7의 X와 Y에 모두 서명" : "아직 없음"}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
