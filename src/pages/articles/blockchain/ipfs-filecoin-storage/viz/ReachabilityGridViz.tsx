import SceneShell from "./SceneShell";

/**
 * 본문 대응: #retention ExplainedFormula — 독립 경로 두 곳이 각각 0.9로 응답하면
 * 함께 실패 0.1 × 0.1 = 0.01, 최소 한 곳 응답 0.99.
 * 100칸 = 관찰 전체. 행 = 경로 1의 결과 10등분, 열 = 경로 2의 결과 10등분.
 * 마지막 장면은 공통 원인을 공유하는 극단(가정)으로, 두 실패가 같은 10칸에 겹쳐 0.9가 된다.
 */
const N = 10;
const CELLS = Array.from({ length: N * N }, (_, index) => index);

type Mode = "p1" | "p2" | "result" | "shared";

const SCENES = [
  { label: "경로 1이 실패하는 칸", summary: "1 − 0.9 = 0.1 → 10칸", mode: "p1" as Mode, note: "100칸 전체를 관찰 window라고 봅니다. 경로 1이 실패하는 10%는 맨 아래 한 줄 10칸입니다." },
  { label: "경로 2도 실패하는 칸", summary: "0.1 × 0.1 = 0.01 → 1칸", mode: "p2" as Mode, note: "실패가 서로 독립이면 경로 2의 실패 10%는 경로 1과 상관없이 맨 오른쪽 한 열로 놓입니다. 둘이 함께 실패하는 칸은 줄과 열이 만나는 1칸뿐입니다." },
  { label: "최소 한 경로가 응답", summary: "1 − 0.01 = 0.99 → 99칸", mode: "result" as Mode, note: "둘 다 실패한 1칸을 빼면 99칸에서는 최소 한 경로가 verified bytes를 줍니다. 이것이 독립 가정 아래의 모델 확률 99%입니다." },
  { label: "같은 원인을 공유하면", summary: "(가정) 극단 예 → 90칸", mode: "shared" as Mode, note: "(가정) 두 경로가 같은 gateway·IDC에 묶여 늘 함께 실패하는 극단이라면 경로 2의 실패 10칸이 경로 1의 실패 10칸에 그대로 겹칩니다. 그러면 응답 확률은 0.9에 그칩니다. 공통 원인이 있으면 99%는 과대평가입니다." },
] as const;

const FILL = {
  ok: "#e2e8f0",
  okStrong: "#16a34a",
  one: "#f59e0b",
  both: "#dc2626",
} as const;

function cellFill(index: number, mode: Mode) {
  const row = Math.floor(index / N);
  const col = index % N;
  const p1Fail = row === N - 1;
  const p2Fail = mode === "shared" ? p1Fail : col === N - 1;
  if (mode === "p1") return p1Fail ? FILL.one : FILL.ok;
  if (p1Fail && p2Fail) return FILL.both;
  if (mode === "p2") return p1Fail || p2Fail ? FILL.one : FILL.ok;
  return FILL.okStrong;
}

const SIZE = 16;
const GAP = 2;
const GRID = N * SIZE + (N - 1) * GAP;

export default function ReachabilityGridViz() {
  return (
    <SceneShell
      eyebrow="0.9 두 개가 0.99가 되는 이유"
      title="두 경로가 함께 실패하는 칸만 남깁니다"
      description="한 칸이 관찰 window의 1%입니다. 아래 줄은 경로 1의 실패, 오른쪽 열은 경로 2의 실패입니다. 0.9는 본문 예제 값입니다."
      ariaLabel="10 곱하기 10 칸에서 두 경로의 실패가 겹치는 칸으로 최소 한 경로 응답 확률을 구하는 장면"
      scenes={SCENES}
      render={(active) => {
        const mode = SCENES[active].mode;
        return (
          <div className="flex min-w-0 flex-col items-center gap-3 sm:flex-row sm:items-start sm:justify-center sm:gap-6">
            <svg viewBox={`-4 -4 ${GRID + 8} ${GRID + 8}`} className="h-auto w-full max-w-[220px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              {CELLS.map((index) => {
                const cx = (index % N) * (SIZE + GAP);
                const cy = Math.floor(index / N) * (SIZE + GAP);
                const fill = cellFill(index, mode);
                return (
                  <g key={index}>
                    <rect x={cx} y={cy} width={SIZE} height={SIZE} rx={2} fill={fill} />
                    {/* 색만으로 구분하지 않도록 두 경로 모두 실패한 칸에 ✗, 한 경로만 실패한 칸에 / 표시 */}
                    {fill === FILL.both && (
                      <path d={`M${cx + 4} ${cy + 4}L${cx + SIZE - 4} ${cy + SIZE - 4}M${cx + SIZE - 4} ${cy + 4}L${cx + 4} ${cy + SIZE - 4}`} stroke="#ffffff" strokeWidth={1.25} />
                    )}
                    {fill === FILL.one && (
                      <path d={`M${cx + SIZE - 4} ${cy + 4}L${cx + 4} ${cy + SIZE - 4}`} stroke="#ffffff" strokeWidth={1.25} />
                    )}
                  </g>
                );
              })}
            </svg>
            <ul className="w-full max-w-[16rem] space-y-1.5 text-xs leading-5">
              <li className="flex items-center gap-2">
                <span className="inline-block size-3 shrink-0 rounded-sm" style={{ backgroundColor: mode === "p1" || mode === "p2" ? FILL.ok : FILL.okStrong }} />
                {mode === "p1" || mode === "p2" ? "아직 실패 없음" : "최소 한 경로 응답"}
              </li>
              <li className={`flex items-center gap-2 ${mode === "p1" || mode === "p2" ? "" : "opacity-35"}`}>
                <span className="inline-grid size-3 shrink-0 place-items-center rounded-sm text-[9px] font-bold leading-none text-white" style={{ backgroundColor: FILL.one }} aria-hidden>/</span>
                한 경로만 실패 (/)
              </li>
              <li className={`flex items-center gap-2 ${mode === "p1" ? "opacity-35" : ""}`}>
                <span className="inline-grid size-3 shrink-0 place-items-center rounded-sm text-[9px] font-bold leading-none text-white" style={{ backgroundColor: FILL.both }} aria-hidden>✗</span>
                두 경로 모두 실패 (✗)
              </li>
              <li className="pt-1 font-mono font-semibold">
                {mode === "p1" && "경로 1 실패 10칸"}
                {mode === "p2" && "함께 실패 1칸"}
                {mode === "result" && "응답 99칸 / 100"}
                {mode === "shared" && "응답 90칸 / 100"}
              </li>
            </ul>
          </div>
        );
      }}
    />
  );
}
