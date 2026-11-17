import SceneShell from "./SceneShell";

/**
 * 본문 대응: #cutmix — patch가 canvas 경계에서 잘리면 처음 뽑은 크기와 실제 visible pixel 수가 달라진다.
 * 8×8 canvas(64칸, 가정)에 4×4 patch(16칸, 가정)를 오른쪽 경계에 걸쳐 붙인다.
 * 안에 남는 j 칸 = 2열×4행 = 8 → ΣM = 64 − 8 = 56 → λ_area = 56/64 = 0.875.
 * 처음 λ = (64 − 16)/64 = 0.75 와 비교한다.
 */
const N = 8;
const CELL = 20;
const OX = 16;
const OY = 16;
const PATCH_ROWS = [2, 3, 4, 5] as const;
const PATCH_COLS = [6, 7, 8, 9] as const;
const TOTAL = N * N;
const NOMINAL_PATCH = PATCH_ROWS.length * PATCH_COLS.length;
const VISIBLE_PATCH = PATCH_ROWS.length * PATCH_COLS.filter((col) => col < N).length;
const NOMINAL_I = (TOTAL - NOMINAL_PATCH) / TOTAL;
const AREA_I = (TOTAL - VISIBLE_PATCH) / TOTAL;

const I_COLOR = "#93c5fd";
const J_COLOR = "#f59e0b";

const SCENES = [
  {
    label: "처음 뽑은 patch",
    summary: `16칸 patch · 처음 λ = ${NOMINAL_I}`,
    note: "처음 뽑은 λ = 0.75가 sample j patch의 크기를 64칸 중 16칸(25%)으로 정했다고 둡니다(가정). patch 위치는 오른쪽 경계에 걸치게 골랐습니다.",
  },
  {
    label: "경계에서 잘림",
    summary: `canvas 안에 남은 j 칸 ${VISIBLE_PATCH}개`,
    note: "patch의 오른쪽 두 열은 canvas 밖이라 잘려 나갑니다. 실제로 보이는 j pixel은 16칸이 아니라 8칸입니다.",
  },
  {
    label: "M을 셉니다",
    summary: `ΣM = ${TOTAL - VISIBLE_PATCH}, HW = ${TOTAL} → λ_area = ${AREA_I}`,
    note: "최종 mask에서 1(sample i의 pixel이 남음)인 칸은 56개입니다. 이를 전체 64칸으로 나누면 λ_area = 0.875입니다.",
  },
  {
    label: "target은 λ_area로",
    summary: `ỹ = ${AREA_I}·y_i + ${1 - AREA_I}·y_j`,
    note: "처음 λ를 그대로 쓰면 화면의 12.5%만 차지하는 j에 target 25%를 줍니다. clip 뒤 면적으로 다시 세면 input과 target 비율이 맞습니다. 이 면적 target은 classification에서의 근사입니다.",
  },
] as const;

function Split({ label, iShare, show, strong }: { label: string; iShare: number; show: boolean; strong: boolean }) {
  return (
    <div className="grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)_3.5rem] items-center gap-2 text-xs sm:text-sm">
      <span className={strong ? "font-bold" : "text-muted-foreground"}>{label}</span>
      <div className="flex h-6 min-w-0 overflow-hidden rounded-sm border border-border font-mono text-[11px]">
        {show ? (
          <>
            <div className="flex items-center pl-1 text-[#0f172a]" style={{ width: `${iShare * 100}%`, backgroundColor: I_COLOR }}>
              i {iShare}
            </div>
            <div style={{ width: `${(1 - iShare) * 100}%`, backgroundColor: J_COLOR }} />
          </>
        ) : (
          <span className="flex items-center pl-1 text-muted-foreground">아직 세지 않음</span>
        )}
      </div>
      <span className={`text-right font-mono ${show ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground/50"}`}>{show ? `j ${1 - iShare}` : "−"}</span>
    </div>
  );
}

export default function CutMixClipViz() {
  return (
    <SceneShell
      eyebrow="CutMix clip"
      title="잘린 patch는 처음 뽑은 크기보다 적은 칸을 차지합니다"
      description="한 칸을 pixel 묶음 하나로 본 8×8 canvas입니다(크기·위치는 가정). 파란 칸은 sample i의 pixel, 주황 칸은 sample j patch입니다. mask M은 칸마다 i가 남으면 1, j로 바뀌면 0입니다."
      ariaLabel="CutMix patch가 경계에서 잘린 뒤 실제 면적으로 target 비율을 다시 계산하는 과정"
      scenes={SCENES}
      render={(active) => {
        const clipped = active >= 1;
        const counting = active >= 2;
        return (
          <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:items-center sm:gap-6">
            <svg viewBox="0 0 236 196" role="img" aria-label={SCENES[active].label} className="mx-auto block h-auto w-full max-w-[15rem]">
              {Array.from({ length: N * N }, (_, index) => {
                const row = Math.floor(index / N);
                const col = index % N;
                const inPatch = (PATCH_ROWS as readonly number[]).includes(row) && (PATCH_COLS as readonly number[]).includes(col);
                return (
                  <g key={index}>
                    <rect x={OX + col * CELL} y={OY + row * CELL} width={CELL} height={CELL} fill={inPatch ? J_COLOR : I_COLOR} stroke="#ffffff" strokeWidth="1" />
                    {counting && (
                      <text x={OX + col * CELL + CELL / 2} y={OY + row * CELL + 14} textAnchor="middle" fontSize="10" fill="#0f172a">
                        {inPatch ? 0 : 1}
                      </text>
                    )}
                  </g>
                );
              })}
              {PATCH_ROWS.flatMap((row) =>
                PATCH_COLS.filter((col) => col >= N).map((col) => (
                  <rect
                    key={`${row}-${col}`}
                    x={OX + col * CELL}
                    y={OY + row * CELL}
                    width={CELL}
                    height={CELL}
                    fill={clipped ? "none" : J_COLOR}
                    fillOpacity={clipped ? 0 : 0.45}
                    stroke={J_COLOR}
                    strokeWidth="1"
                    strokeDasharray="3 2"
                  />
                )),
              )}
              <rect x={OX} y={OY} width={N * CELL} height={N * CELL} fill="none" stroke="#475569" strokeWidth="1.25" />
              <rect x={OX + PATCH_COLS[0] * CELL} y={OY + PATCH_ROWS[0] * CELL} width={PATCH_COLS.length * CELL} height={PATCH_ROWS.length * CELL} fill="none" stroke="#b45309" strokeWidth="1.25" strokeDasharray={clipped ? "4 3" : undefined} />
              <text x={OX + (N * CELL) / 2} y={OY + N * CELL + 14} textAnchor="middle" fontSize="10" fill="#64748b">
                canvas 8×8 = 64칸
              </text>
              <text x={OX + N * CELL + CELL} y={OY + PATCH_ROWS[0] * CELL - 6} textAnchor="middle" fontSize="9" fill="#b45309">
                {clipped ? "잘림" : "밖"}
              </text>
            </svg>
            <div className="min-w-0 space-y-2">
              <Split label="처음 λ를 그대로 쓴 target" iShare={NOMINAL_I} show strong={active < 2} />
              <Split label="clip 뒤 λ_area target" iShare={AREA_I} show={counting} strong={active >= 2} />
            </div>
          </div>
        );
      }}
    />
  );
}
