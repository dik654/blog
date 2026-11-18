import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 만기 줄의 지급을 앞 시간 줄로 한 줄씩 퍼뜨린다.
 * 6절 식의 갱신: 새 값 = λ×아래칸 + (1−2λ)×가운데 + λ×위칸, λ=0.5×0.2²×S²×0.01÷10².
 * (가정) 창은 주가 70~130, 창 가장자리 70은 0·130은 30을 유지, 금리 0.
 * 1칸 앞: 0·0·0·0.2·10·20·30, 2칸 앞: 0·0·0.003·0.392·10.005·20·30 (S=70→130).
 */
const PRICES = [130, 120, 110, 100, 90, 80, 70] as const;
const EDGE = new Set<number>([130, 70]);

// 열 순서: [2칸 앞, 1칸 앞, 만기]. 값은 PRICES 순서(130 → 70).
const MATURITY = ["30", "20", "10", "0", "0", "0", "0"] as const;
const ONE_BACK = ["30", "20", "10", "0.2", "0", "0", "0"] as const;
const TWO_BACK = ["30", "20", "10.005", "0.392", "0.003", "0", "0"] as const;
const BLANK = ["", "", "", "", "", "", ""] as const;

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  columns: readonly [readonly string[], readonly string[], readonly string[]];
  target: { col: number; price: number } | null;
  stencil: boolean;
}[] = [
  {
    label: "만기 줄",
    summary: "주가−100, 음수면 0",
    note: "오른쪽 끝 줄이 만기입니다. 행사가 100 콜의 지급을 주가마다 적습니다. 가장자리 칸에는 경계의 계약값을 정해 둡니다. 여기서는 70을 0, 130을 30으로 둔 가정입니다.",
    columns: [BLANK, BLANK, MATURITY],
    target: null,
    stencil: false,
  },
  {
    label: "한 칸 앞 100",
    summary: "오른쪽 세 칸 0·0·10 → 0.2",
    note: "앞 줄의 한 칸은 바로 오른쪽 줄의 같은 주가와 위·아래 이웃 세 칸으로 만듭니다. 주가 100 칸은 90·100·110의 0·0·10에서 3절처럼 0.2가 됩니다.",
    columns: [BLANK, ["", "", "", "0.2", "", "", ""], MATURITY],
    target: { col: 1, price: 100 },
    stencil: true,
  },
  {
    label: "한 줄 전체",
    summary: "0.2만 새로 생깁니다",
    note: "같은 계산을 모든 칸에 합니다. 세 칸이 한 직선 위에 있으면(0·0·0이나 0·10·20) 굽음이 0이라 값이 그대로입니다. 꺾인 자리 100에만 0.2가 생깁니다.",
    columns: [BLANK, ONE_BACK, MATURITY],
    target: null,
    stencil: false,
  },
  {
    label: "두 줄 앞",
    summary: "0.2가 위·아래로 번집니다",
    note: "이제 주가 90 칸의 오른쪽 이웃에 0.2가 있어 0.003이 생기고, 110 칸은 10.005, 100 칸은 0.392가 됩니다. 한 줄 갈 때마다 꺾임의 영향이 한 칸씩 옆으로 번지고, 이를 오늘까지 반복하면 표 전체가 채워집니다.",
    columns: [TWO_BACK, ONE_BACK, MATURITY],
    target: { col: 0, price: 90 },
    stencil: true,
  },
  {
    label: "미국형 비교",
    summary: "max(계속 보유값, 즉시 행사가치)",
    note: "미국형이면 각 칸에서 계산한 계속 보유값과 그 주가의 즉시 행사가치를 비교해 큰 값을 남깁니다. 주가 110 칸은 10.005와 10 가운데 10.005를 남깁니다. 이 창의 숫자에서는 모든 칸에서 보유값이 행사가치보다 작지 않아 표가 바뀌지 않습니다.",
    columns: [TWO_BACK, ONE_BACK, MATURITY],
    target: { col: 0, price: 110 },
    stencil: false,
  },
];

const HEADERS: readonly string[] = ["2칸 앞", "1칸 앞", "만기"];

function isNeighbor(target: { col: number; price: number } | null, col: number, price: number) {
  if (!target) return false;
  return col === target.col + 1 && Math.abs(price - target.price) <= 10;
}

export default function GridSpreadViz() {
  return (
    <SceneShell
      eyebrow="격자 역진"
      title="만기 줄의 0·0·10이 앞줄로 번집니다"
      description="가로는 시간(오른쪽이 만기, 한 열이 0.01년), 세로는 주가(한 행이 10)입니다. 칸 숫자는 그 시각·주가의 콜 값이며, 연 흔들림 20%·금리 0과 6절 식의 갱신 규칙으로 계산했습니다. 파란 테두리는 지금 계산하는 칸, 주황 테두리는 그 계산에 쓰는 세 칸이며, 주가 70~130만 잘라 보인 창과 점선 가장자리 칸의 값은 가정입니다."
      ariaLabel="시간과 주가 격자에서 만기 지급이 한 줄씩 앞으로 퍼지는 명시적 유한차분 계산"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="mx-auto min-w-0 max-w-[420px]">
            <div className="grid grid-cols-[3.25rem_repeat(3,minmax(0,1fr))] gap-1 text-center text-xs">
              <span className="py-1 text-muted-foreground">주가</span>
              {HEADERS.map((header) => (
                <span key={header} className="py-1 font-semibold text-muted-foreground">{header}</span>
              ))}
              {PRICES.map((price, row) => (
                <div key={price} className="contents">
                  <span className="flex items-center justify-center font-mono text-muted-foreground">{price}</span>
                  {scene.columns.map((column, col) => {
                    const value = column[row];
                    const isTarget = scene.target?.col === col && scene.target.price === price;
                    const neighbor = scene.stencil && isNeighbor(scene.target, col, price);
                    const edge = EDGE.has(price);
                    const border = isTarget ? "border-[#2563eb]" : neighbor ? "border-[#d97706]" : "border-border";
                    return (
                      <span
                        key={HEADERS[col]}
                        className={`flex h-7 items-center justify-center rounded-md border font-mono ${border} ${edge ? "border-dashed" : ""} ${value === "" ? "text-muted-foreground/40" : isTarget ? "font-bold text-[#2563eb]" : ""}`}
                      >
                        {value === "" ? "·" : value}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
