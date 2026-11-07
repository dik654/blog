import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-output — 배정 합은 입력 위치의 합이지 출력 토큰 수가 아니다.
 * 1회: A1 B1 C6 = 8, 답변 A·B = 2. 2회: A1 B1 C4 D2 = 8, 답변 A·B·C·D = 4. 3회: 각 1 = 4, 답변 4.
 */
interface Slot {
  owner: string;
  answer: boolean;
}

const slots = (spec: readonly (readonly [string, number, boolean])[]): readonly Slot[] =>
  spec.flatMap(([owner, count, answer]) =>
    Array.from({ length: count }, (_, index) => ({ owner, answer: answer && index === count - 1 })),
  );

const RUNS: readonly (readonly Slot[])[] = [
  slots([["A", 1, true], ["B", 1, true], ["C", 6, false]]),
  slots([["A", 1, true], ["B", 1, true], ["C", 4, true], ["D", 2, true]]),
  slots([["A", 1, true], ["B", 1, true], ["C", 1, true], ["D", 1, true]]),
];

const SCENES = [
  { label: "첫째 실행", summary: "배정 8 → 답변 2", note: "C의 입력은 6토큰을 읽어도 4토큰이 남아 아직 답변을 내지 않습니다. 답변이 나오는 칸은 A와 B의 두 칸입니다." },
  { label: "둘째 실행", summary: "배정 8 → 답변 4", note: "배정 합은 첫째와 같은 8입니다. C와 D가 입력을 끝내 첫 답변을 만들므로 답변이 나오는 칸은 네 칸입니다." },
  { label: "셋째 실행", summary: "배정 4 → 답변 4", note: "네 요청이 답변을 이어 쓰면 두 합이 같습니다. 배정이 절반인데 답변 수는 둘째와 같으니, 배정 합을 출력 토큰 수로 세면 단위가 틀어집니다." },
];

const COLOR: Record<string, string> = {
  A: "border-[#2563eb] bg-[#2563eb] text-white",
  B: "border-[#2563eb] bg-[#2563eb] text-white",
  C: "border-[#f59e0b] bg-[#fde68a] text-[#451a03]",
  D: "border-[#f59e0b] bg-[#fde68a] text-[#451a03]",
};

export default function PlannedVsOutputViz() {
  return (
    <SceneShell
      eyebrow="두 가지 합"
      title="배정 합 8이 답변 8개를 뜻하지는 않습니다"
      description="칸 하나가 계산할 입력 위치 하나이고 8칸이 한도입니다. '답' 표시 칸에서만 답변 토큰이 나옵니다."
      note="3절과 8절의 A·B·C·D 사례(가정)입니다. 답변 수는 본문의 배정에서 센 값이며 실행 시간을 알려 주지 않습니다."
      ariaLabel="세 번의 실행에서 배정 합과 답변 토큰 수 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-3">
          {RUNS.map((run, index) => {
            const isActive = index === active;
            const free = 8 - run.length;
            return (
              <div key={index} className={isActive ? "" : "opacity-35"}>
                <p className={`mb-1 text-xs ${isActive ? "font-bold" : "text-muted-foreground"}`}>
                  {index + 1}회 · 배정 {run.length} · 답변 {run.filter((slot) => slot.answer).length}
                </p>
                <div className="grid grid-cols-8 gap-0.5">
                  {run.map((slot, cell) => (
                    <span key={cell} className={`flex h-10 flex-col items-center justify-center rounded-sm border text-[11px] font-bold leading-4 ${COLOR[slot.owner]}`}>
                      <span>{slot.owner}</span>
                      {slot.answer && <span className="text-[10px]">답</span>}
                    </span>
                  ))}
                  {Array.from({ length: free }, (_, cell) => (
                    <span key={`free-${cell}`} className="h-10 rounded-sm border border-dashed border-border" />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    />
  );
}
