import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture 첫 문단(+2절 보간) — 행사가를 가로, 만기를 세로로 놓은 지도.
 * 숫자가 있는 칸: 한 달 90·100·110 = 30·20·24(1절), 중앙 100의 한 달·세 달·여섯 달 = 20·22·24(4절).
 * 세 달·여섯 달의 90·110 칸은 글에 숫자가 없어 "?"로 둡니다.
 */
const STRIKES: readonly number[] = [90, 100, 110];
const ROWS: readonly { label: string; values: readonly (number | null)[] }[] = [
  { label: "한 달", values: [30, 20, 24] },
  { label: "세 달", values: [null, 22, null] },
  { label: "여섯 달", values: [null, 24, null] },
];

const SCENES = [
  {
    label: "한 만기 = 가로 한 줄",
    summary: "한 달: 30 · 20 · 24%",
    note: "한 만기의 여러 행사가를 가로로 놓으면 곡선 하나가 됩니다(2절). 3절의 −6은 이 줄의 양 끝 두 칸만 쓴 숫자입니다.",
  },
  {
    label: "만기를 세로로 쌓기",
    summary: "중앙 20 → 22 → 24%",
    note: "중앙 변동성이 한 달 20%, 세 달 22%, 여섯 달 24%라면 먼 만기로 갈수록 높아지는 시간 구조입니다(4절). 줄을 여러 만기로 쌓은 것이 표면입니다.",
  },
  {
    label: "숫자가 없는 칸",
    summary: "\"?\" 4칸 = 이 글에 값 없음",
    note: "세 달·여섯 달 안에서도 행사가마다 높이가 다르다고 했지만(4절) 그 값은 이 글에 없습니다. 이 4칸이 실제로 거래가 드물다는 뜻은 아니고, 보간이 하는 일을 보이려고 비워 둔 자리입니다. 실제 표면에서 거래가 드문 칸은 주변 호가에서 보간하는데, 잘못 이으면 서로 모순되는 가격이나 차익거래 가능성을 만들 수 있습니다(2절).",
  },
] as const;

function isLit(active: number, row: number, col: number, value: number | null) {
  if (active === 0) return row === 0;
  if (active === 1) return col === 1;
  return value === null;
}

export default function SurfaceGridViz() {
  return (
    <SceneShell
      eyebrow="행사가 × 만기"
      title="곡선을 만기별로 쌓으면 빈 칸이 있는 지도가 됩니다"
      description="가로는 행사가, 세로는 만기, 칸 안의 숫자는 내재변동성(%)입니다. 숫자는 1·4절의 설명용 값이고, ?는 이 글에 값이 없는 칸입니다."
      ariaLabel="행사가와 만기 격자에 내재변동성을 놓은 지도와 값이 없는 칸"
      scenes={SCENES}
      render={(active) => (
        <div className="mx-auto w-full max-w-[460px]">
          <div className="grid grid-cols-[4.25rem_repeat(3,minmax(0,1fr))] gap-2 text-center text-sm">
            <span className="text-xs text-muted-foreground">만기 \ 행사가</span>
            {STRIKES.map((strike) => (
              <span key={strike} className="font-mono text-xs font-semibold text-muted-foreground">{strike}</span>
            ))}
            {ROWS.map((row, r) => (
              <div key={row.label} className="contents">
                <span className="self-center text-xs font-semibold">{row.label}</span>
                {row.values.map((value, c) => {
                  const lit = isLit(active, r, c, value);
                  return (
                    <div
                      key={`${row.label}-${STRIKES[c]}`}
                      className={`flex h-12 items-center justify-center rounded-lg border font-mono transition-opacity duration-300 motion-reduce:transition-none ${
                        value === null ? "border-dashed" : ""
                      } ${lit ? "opacity-100" : "opacity-35"}`}
                      style={{
                        borderColor: lit ? (value === null ? "#d97706" : "#2563eb") : "#94a3b8",
                        backgroundColor: value === null ? "transparent" : lit ? "#2563eb22" : "#94a3b81a",
                      }}
                    >
                      <span className={`text-base font-bold ${value === null ? "text-amber-700 dark:text-amber-400" : ""}`}>{value === null ? "?" : `${value}%`}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            {active === 1 ? "중앙 열: 아래로 갈수록(먼 만기) 높아집니다" : active === 2 ? "점선 칸 = 값이 없는 자리(호가가 드문 칸은 주변 칸에서 메웁니다)" : "한 줄 = 한 만기의 곡선"}
          </p>
        </div>
      )}
    />
  );
}
