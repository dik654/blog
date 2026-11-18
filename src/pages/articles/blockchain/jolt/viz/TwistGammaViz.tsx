import SceneShell from "./SceneShell";

/**
 * 본문 대응: #lookup-sumcheck, #artifact — rd+γ·rs1+γ²·rs2를 γ=2(가정)로 계산.
 * 왼쪽: 7·1 + 3·2 + 4·4 = 7+6+16 = 29.
 * 오른쪽: 목적 위치 3의 이전 값 0 + 변화량 7 = 7, 위치 1 선택이 고른 3 ×2 = 6, 위치 2 선택이 고른 4 ×4 = 16 → 29.
 */
const GAMMA = 2;
const ROWS = [
  { name: "rd (목적 결과)", value: 7, power: 0, right: "위치 3: 이전 값 0 + 변화량 7", rightValue: 7 },
  { name: "rs1 (첫 읽기)", value: 3, power: 1, right: "위치 1 선택 [0,1,0,0] → 3", rightValue: 3 },
  { name: "rs2 (둘째 읽기)", value: 4, power: 2, right: "위치 2 선택 [0,0,1,0] → 4", rightValue: 4 },
] as const;
const MULT: readonly string[] = ["×1", "×2", "×4"];

const LEFT_TOTAL = ROWS.reduce<number>((sum, row) => sum + row.value * GAMMA ** row.power, 0);
const RIGHT_TOTAL = ROWS.reduce<number>((sum, row) => sum + row.rightValue * GAMMA ** row.power, 0);

const SCENES = [
  {
    label: "세 값",
    summary: "rd 7 · rs1 3 · rs2 4",
    note: "ADD 한 번이 남기는 값은 셋입니다. 위치 3에 쓴 결과 7, 위치 1에서 읽은 3, 위치 2에서 읽은 4입니다. Twist 검사는 이 읽기·쓰기 주장들을 γ의 거듭제곱으로 하나로 묶습니다.",
  },
  {
    label: "γ의 거듭제곱을 곱함",
    summary: "7×1 · 3×2 · 4×4",
    note: "γ는 여러 주장을 하나로 묶을 때 쓰는 질문 값이고, 여기서는 작은 가정 γ=2를 씁니다. 세 값에 차례로 1, γ, γ²를 곱합니다.",
  },
  {
    label: "한쪽의 합 29",
    summary: `7 + 6 + 16 = ${LEFT_TOTAL}`,
    note: "곱한 결과를 더하면 7+6+16=29입니다. 이 값이 고정한 소스의 rd+γ·rs1+γ²·rs2가 만드는 쪽입니다.",
  },
  {
    label: "다른 쪽도 29",
    summary: `7 + 6 + 16 = ${RIGHT_TOTAL} ✓`,
    note: "다른 쪽은 목적 위치의 이전 값과 변화량, 두 읽기 주소가 메모리 [0,3,4,0]에서 고른 값으로 만듭니다. 같은 γ를 곱하면 역시 29이고 두 쪽이 같아야 합니다. 본문은 실제 식에 시간 선택도 함께 들어간다고 적습니다.",
  },
] as const;

function Slot({ shown, text, strong = false }: { shown: boolean; text: string; strong?: boolean }) {
  return (
    <span className={`text-right font-mono ${shown ? (strong ? "font-bold text-amber-700 dark:text-amber-400" : "font-semibold") : "text-muted-foreground/40"}`}>
      {shown ? text : "·"}
    </span>
  );
}

export default function TwistGammaViz() {
  return (
    <SceneShell
      eyebrow="읽기·쓰기 묶기"
      title="세 값을 γ로 묶은 29가 메모리 쪽에서 다시 계산한 29와 맞아야 합니다"
      description="'기록된 값 쪽'은 기록된 세 값, '주소 선택·이전 값·변화량 쪽'은 주소 선택과 이전 값·변화량으로 다시 만든 값입니다. 3+4=7, 축약 메모리 [0,3,4,0], γ=2는 본문의 설명용 가정입니다."
      ariaLabel="rd, rs1, rs2를 감마 2의 거듭제곱으로 묶어 29를 만들고 메모리 쪽 계산 29와 비교하는 장면"
      scenes={SCENES}
      render={(active) => (
        <div className="grid min-w-0 gap-3 sm:grid-cols-2">
          <div className="min-w-0 rounded-lg border border-border p-3">
            <p className="text-xs font-bold text-muted-foreground">기록된 값 쪽</p>
            <div className="mt-2 space-y-1.5 text-xs sm:text-sm">
              {ROWS.map((row, i) => (
                <div key={row.name} className="grid grid-cols-[minmax(0,1fr)_3rem_4rem_2.5rem] items-center gap-1">
                  <span className="min-w-0">{row.name}</span>
                  <span className="text-right font-mono font-bold">{row.value}</span>
                  <Slot shown={active >= 1} text={MULT[i]} />
                  <Slot shown={active >= 1} text={String(row.value * GAMMA ** row.power)} strong />
                </div>
              ))}
              <div className="grid grid-cols-[minmax(0,1fr)_auto] border-t border-border pt-1.5">
                <span className="font-semibold">합</span>
                <Slot shown={active >= 2} text={String(LEFT_TOTAL)} strong />
              </div>
            </div>
          </div>
          <div className={`min-w-0 rounded-lg border p-3 ${active >= 3 ? "border-teal-600" : "border-dashed border-border"}`}>
            <p className="text-xs font-bold text-muted-foreground">주소 선택·이전 값·변화량 쪽</p>
            <div className="mt-2 space-y-1.5 text-xs sm:text-sm">
              {ROWS.map((row, i) => (
                <div key={row.right} className="grid grid-cols-[minmax(0,1fr)_2rem_3rem_2.5rem] items-center gap-1">
                  <span className={`min-w-0 leading-5 ${active >= 3 ? "" : "text-muted-foreground/50"}`}>{row.right}</span>
                  <Slot shown={active >= 3} text={String(row.rightValue)} />
                  <Slot shown={active >= 3} text={MULT[i]} />
                  <Slot shown={active >= 3} text={String(row.rightValue * GAMMA ** row.power)} strong />
                </div>
              ))}
              <div className="grid grid-cols-[minmax(0,1fr)_auto] border-t border-border pt-1.5">
                <span className="font-semibold">합</span>
                <Slot shown={active >= 3} text={`${RIGHT_TOTAL} = ${LEFT_TOTAL} ✓`} strong />
              </div>
            </div>
          </div>
          <p className="text-center font-mono text-xs text-muted-foreground sm:col-span-2">
            γ⁰=1 · γ¹=2 · γ²=4 (γ=2 가정)
          </p>
        </div>
      )}
    />
  );
}
