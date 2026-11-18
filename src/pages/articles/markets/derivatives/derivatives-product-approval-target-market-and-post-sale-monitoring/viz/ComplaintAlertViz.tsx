import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism 둘째 문단 + #limits — 200명 판매, 민원 예상 2명, 실제 8명.
 * 2÷200=1%, 8÷200=4%, 8÷2=4배, 8−2=6명 초과.
 * 원인 후보와 비교 자료는 10절, 행동 선택지는 7절 문장을 그대로 쓴다.
 */
const SOLD = 200;
const EXPECTED = 2;
const ACTUAL = 8;
const COLS = 20;
const ROWS = SOLD / COLS;

const SCENES = [
  { label: "예상: 200명 중 2명", summary: `${EXPECTED} ÷ ${SOLD} = 1%`, note: "출시 전에는 같은 조건을 잘못 이해해 민원을 낼 고객을 200명 중 2명으로 예상했다고 놓습니다. 칸 하나가 고객 한 명입니다." },
  { label: "실제: 8명", summary: `${ACTUAL} ÷ ${SOLD} = 4% · 예상의 ${ACTUAL / EXPECTED}배`, note: "실제 민원은 8명으로 예상보다 6명 많습니다. 이 차이가 원인 조사를 시작하게 합니다." },
  { label: "8건은 경보입니다", summary: "원인 후보를 비교 자료로 가립니다", note: "민원 증가는 설명 실패, 잘못된 대상 판매, 시장 급변이나 단순 문의 증가에서도 생길 수 있습니다. 판매량, 고객 유형, 손실 원인과 이전 기간을 함께 비교합니다." },
  { label: "행동은 자료에 맞춰", summary: "자동으로 하나를 고르지 않음", note: "설명 수정, 채널 제한, 신규 판매 중단과 기존 고객 안내 가운데 무엇을 할지는 조사 자료에 맞춰 결정합니다. 민원 8건이 상품 결함의 자동 판정은 아닙니다." },
] as const;

const CAUSES = ["설명 실패", "잘못된 대상 판매", "시장 급변", "단순 문의 증가"] as const;
const COMPARE = ["판매량", "고객 유형", "손실 원인", "이전 기간"] as const;
const ACTIONS = ["설명 수정", "채널 제한", "신규 판매 중단", "기존 고객 안내"] as const;

const CELL = 15;
const GAP = 2;
const W = COLS * (CELL + GAP) - GAP;
const H = ROWS * (CELL + GAP) - GAP;
/** 민원 칸 위치(가정): 실제 고객 순서를 뜻하지 않고 흩어 놓기만 했습니다. */
const MARKED: readonly number[] = [23, 57, 88, 104, 131, 146, 172, 195];

export default function ComplaintAlertViz() {
  return (
    <SceneShell
      eyebrow="사후 검토"
      title="민원 2명 예상이 8명이 되면 조사가 시작됩니다"
      description="사후 검토는 실제 판매·손실·민원 자료가 승인 때의 가정에서 벗어났는지 확인하고 행동하는 절차입니다. 칸 하나가 판매된 고객 한 명이며, 민원 칸의 위치는 흩어 놓은 예시입니다(가정)."
      ariaLabel="판매 200명 중 민원 예상 2명과 실제 8명, 원인 후보와 행동 선택지"
      scenes={SCENES}
      render={(active) => {
        const shown = active === 0 ? EXPECTED : ACTUAL;
        const marked = new Set(MARKED.slice(0, shown));
        /** 예상했던 2칸은 계속 주황, 실제로 더 나온 6칸만 빨강으로 칠해 8−2=6을 셀 수 있게 합니다. */
        const expectedCells = new Set(MARKED.slice(0, EXPECTED));
        const colorOf = (cell: number) => (expectedCells.has(cell) ? "#d97706" : "#dc2626");
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[420px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              {Array.from({ length: SOLD }, (_, cell) => (
                <rect
                  key={cell}
                  x={(cell % COLS) * (CELL + GAP)}
                  y={Math.floor(cell / COLS) * (CELL + GAP)}
                  width={CELL}
                  height={CELL}
                  rx={2}
                  fill={marked.has(cell) ? colorOf(cell) : "#94a3b8"}
                  opacity={marked.has(cell) ? 1 : 0.25}
                />
              ))}
            </svg>
            <p className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs leading-5 text-muted-foreground">
              <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ background: "#d97706" }} />예상 민원 {EXPECTED}명</span>
              <span className={active === 0 ? "opacity-40" : ""}><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ background: "#dc2626" }} />예상보다 더 나온 {ACTUAL - EXPECTED}명</span>
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <div className={`rounded-lg border px-3 py-2 text-xs leading-5 ${active === 2 ? "border-primary/60 bg-background" : "border-border/50 text-muted-foreground/70"}`}>
                <span className="block font-semibold">원인 후보 (10절)</span>
                <span className="block">{CAUSES.join(" · ")}</span>
                <span className="mt-1 block text-muted-foreground">비교: {COMPARE.join(" · ")}</span>
              </div>
              <div className={`rounded-lg border px-3 py-2 text-xs leading-5 ${active === 3 ? "border-primary/60 bg-background" : "border-border/50 text-muted-foreground/70"}`}>
                <span className="block font-semibold">행동 선택지 (7절)</span>
                <span className="block">{ACTIONS.join(" · ")}</span>
                <span className="mt-1 block text-muted-foreground">자료에 맞춰 고릅니다</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
