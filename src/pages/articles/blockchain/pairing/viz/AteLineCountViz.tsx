import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-loop — 고정 설정의 6z+2를 나타내는 65자리 −1·0·1 배열.
 * 처음 자리 뒤 64자리마다 두 배 선 1개 → 64. 추가 선 21개, Frobenius 점 선 2개 → 64+21+2 = 87.
 * 누적값이 처음 1이라 첫 제곱을 건너뛰므로 square 호출은 64−1 = 63.
 * 숫자는 codebase/bn254.rs의 ATE_LOOP_COUNT(낮은 자리부터 저장)를 뒤집어 반복이 읽는 순서로 적었습니다.
 * 원문 반복은 `(1..len).rev()`로 맨 높은 자리를 시작에 쓰고, 나머지 64자리에서 두 배·추가 선을 만듭니다.
 */
const ATE_LOOP_COUNT_LOW_FIRST = [
  0, 0, 0, 1, 0, 1, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1, 0, -1, 0, 0, 0, 1, 0, -1, 0, 0, 0,
  0, -1, 0, 0, 1, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, -1, 0, 0, -1, 0, 1, 0, -1, 0, 0, 0, -1, 0,
  -1, 0, 0, 0, 1, 0, 1, 1,
] as const;
const READ_ORDER: readonly number[] = [...ATE_LOOP_COUNT_LOW_FIRST].reverse();
const DIGITS = READ_ORDER.length;
const COLS = 13;
const ADD_LINES = 21;
const FROB_LINES = 2;

const SCENES = [
  { label: "65자리", summary: "6z+2 → −1·0·1 숫자 65개", step: 0, note: "칸 하나가 ATE_LOOP_COUNT의 한 자리입니다. 배열은 낮은 자리부터 저장돼 있지만 반복은 높은 자리부터 읽으므로, 칸도 읽는 순서대로 놓았습니다. 맨 앞 자리는 시작에 쓰고 뒤의 64자리에서 반복이 일어납니다." },
  { label: "두 배 선 64개", summary: "선 64 · square 63", step: 1, note: "64자리마다 두 배 선을 하나씩 평가합니다. 누적값이 처음 1이라 첫 제곱을 건너뛰므로 square는 63회입니다." },
  { label: "추가 선 21개", summary: "64 + 21 = 85", step: 2, note: "자리가 1이면 원래 점, −1이면 반대 점을 더하는 선이 붙습니다. 시작 자리 뒤의 64자리 중 0이 아닌 칸이 21개입니다." },
  { label: "끝의 두 선", summary: "85 + 2 = 87번 선 평가", step: 3, note: "끝에 Frobenius로 옮긴 점의 선 두 개가 붙습니다. 모두 고정 버전·한 쌍·양의 z의 코드 경로 수이며 시간 측정값이 아닙니다." },
] as const;

function Tally({ label, count, active, color, sub }: { label: string; count: number; active: boolean; color: string; sub?: string }) {
  return (
    <div className={`grid grid-cols-[6.5rem_minmax(0,1fr)_2.25rem] items-center gap-2 text-xs transition-opacity duration-300 sm:text-sm ${active ? "opacity-100" : "opacity-25"}`}>
      <span className="leading-5">
        {label}
        {sub && <span className="block text-[11px] text-muted-foreground">{sub}</span>}
      </span>
      <div className="h-3 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm" style={{ width: active ? `${(count / 87) * 100}%` : "0%", backgroundColor: color }} />
      </div>
      <span className="text-right font-mono font-bold">{active ? count : "−"}</span>
    </div>
  );
}

export default function AteLineCountViz() {
  return (
    <SceneShell
      eyebrow="실제 BN254 반복"
      title="65자리, 두 배 선 64개, square 63회, 선 평가 87번"
      description="위 칸은 6z+2를 나타내는 65자리 배열입니다. 칸은 반복이 읽는 순서(높은 자리부터)로 놓았습니다. 아래 막대는 한 입력쌍에서 평가하는 선의 수를 종류별로 나눠 세고, 막대 길이는 87개 중 비율입니다."
      ariaLabel="ATE_LOOP_COUNT 65자리에서 두 배 선 64, 추가 선 21, Frobenius 선 2로 87번의 선 평가가 나오는 과정"
      scenes={SCENES}
      render={(active) => {
        const step = SCENES[active].step;
        return (
          <div className="min-w-0">
            <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
              {Array.from({ length: DIGITS }, (_, i) => {
                const first = i === 0;
                const digit = READ_ORDER[i];
                const added = !first && digit !== 0 && step >= 2;
                const doubled = !first && step >= 1;
                const skipSquare = i === 1 && step >= 1;
                return (
                  <div
                    key={i}
                    className={`flex h-4 items-center justify-center rounded-sm border text-[10px] leading-none ${
                      first ? "border-[#64748b] bg-[#e2e8f0] font-bold text-[#334155]" : added ? "border-[#d97706] bg-[#fef3c7] font-bold text-[#92400e]" : doubled ? "border-[#2563eb] bg-[#dbeafe] text-[#1d4ed8]" : "border-border bg-background text-muted-foreground"
                    } ${skipSquare ? "border-dashed" : ""}`}
                  >
                    {digit === -1 ? "−1" : digit}
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-[11px] leading-5 text-muted-foreground">회색 칸: 맨 높은 자리(시작) · 파란 칸: 두 배 선 · 주황 칸: 두 배 선 + 추가 선(±1) · 점선 칸: 첫 제곱 생략</p>
            <div className="mt-4 space-y-2">
              <Tally label="두 배 선" count={64} active={step >= 1} color="#2563eb" sub="square는 63회" />
              <Tally label="추가 선(±1 자리)" count={ADD_LINES} active={step >= 2} color="#d97706" />
              <Tally label="Frobenius 점 선" count={FROB_LINES} active={step >= 3} color="#7c3aed" />
              <div className="flex items-baseline justify-between border-t border-border pt-2 text-sm">
                <span className="font-semibold">선 평가 합계</span>
                <span className="font-mono font-bold text-[#1d4ed8]">{[0, 64, 64 + ADD_LINES, 64 + ADD_LINES + FROB_LINES][step]}</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
