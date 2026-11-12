import SceneShell from "./SceneShell";

/**
 * 본문 대응: #not-a-cause 의 절차 마지막 줄 — 손 바뀜 배수 = 값 배수 × 물량 배수 ÷ 돈 배수.
 * 세 나라(가정) 모두 값 ×2, 물량 ×1 로 셌고 가진 돈만 ×2·×1·×4 로 다르다.
 * 역산한 손 바뀜은 1·2·0.5 이고, 어느 경우든 돈 × 손 바뀜 = 값 × 물량 = 2 로 식이 맞는다.
 */
const CASES = [
  { name: "가 나라", money: 2 },
  { name: "나 나라", money: 1 },
  { name: "다 나라", money: 4 },
] as const;
const PRICE = 2;
const QTY = 1;

const SCENES = [
  {
    label: "셋을 세고 하나를 역산합니다",
    summary: "2 × 1 ÷ 2 = 손 바뀜 ×1",
    note: "가 나라에서 값 ×2, 물량 ×1, 가진 돈 ×2를 셌습니다(가정). 손 바뀜은 직접 세지 않고 값 배수 × 물량 배수 ÷ 돈 배수로 구합니다. 그러면 돈 × 손 바뀜 = 2, 값 × 물량 = 2로 식이 맞습니다.",
  },
  {
    label: "돈을 다르게 세어도 맞습니다",
    summary: "2 × 1 ÷ 1 = 손 바뀜 ×2",
    note: "나 나라는 가진 돈이 그대로였습니다(가정). 역산한 손 바뀜이 2로 바뀌어 빈자리를 채우므로 식은 이번에도 맞습니다.",
  },
  {
    label: "돈이 네 배여도 맞습니다",
    summary: "2 × 1 ÷ 4 = 손 바뀜 ×0.5",
    note: "다 나라는 가진 돈이 네 배였습니다(가정). 손 바뀜이 0.5로 나오고 식은 또 맞습니다.",
  },
  {
    label: "맞았다는 것으로 걸러지는 경우가 없습니다",
    summary: "세 나라 모두 2 = 2",
    note: "세 나라의 사정은 서로 다른데 셋 다 식이 맞습니다. 손 바뀜이 관찰이 아니라 식을 맞추는 나머지이기 때문입니다. 틀릴 수 없는 식은 틀릴 수 없다는 이유로 아무것도 반증하지 못합니다.",
  },
] as const;

const fmt = (n: number) => `×${Number(n.toFixed(2))}`;

export default function ResidualVelocityViz() {
  return (
    <SceneShell
      eyebrow="역산한 자리"
      title="손 바뀜을 역산하면 식은 어떤 경우에도 맞습니다"
      description="세 나라의 숫자는 그림을 위한 가정입니다. 실선 칸은 세어 본 배수, 점선 칸은 나머지 셋에서 역산한 배수, 맨 아래 줄은 돈 × 손 바뀜과 값 × 물량입니다."
      ariaLabel="세 나라에서 손 바뀜을 역산하면 교환방정식이 늘 맞는 모습"
      scenes={SCENES}
      render={(active) => {
        const shown = (i: number) => (active === 3 ? true : i === active);
        const rowLabel = "flex items-center text-xs font-bold text-muted-foreground sm:text-sm";
        const cell = (on: boolean, dashed = false) =>
          `flex min-h-8 items-center justify-center rounded-md border px-1 text-center font-mono text-xs sm:text-sm ${
            dashed ? "border-dashed" : ""
          } ${on ? "border-primary/60 bg-primary/5 font-bold text-foreground" : "border-border text-muted-foreground/50"}`;
        return (
          <div className="grid grid-cols-[4.75rem_repeat(3,minmax(0,1fr))] gap-1.5 sm:grid-cols-[6rem_repeat(3,minmax(0,1fr))] sm:gap-2">
            <div />
            {CASES.map((c, i) => (
              <div key={c.name} className={`text-center text-xs font-bold sm:text-sm ${shown(i) ? "text-foreground" : "text-muted-foreground/50"}`}>
                {c.name}
              </div>
            ))}
            <div className={rowLabel}>값</div>
            {CASES.map((c, i) => (
              <div key={`p-${c.name}`} className={cell(shown(i))}>{shown(i) ? fmt(PRICE) : "—"}</div>
            ))}
            <div className={rowLabel}>물량</div>
            {CASES.map((c, i) => (
              <div key={`q-${c.name}`} className={cell(shown(i))}>{shown(i) ? fmt(QTY) : "—"}</div>
            ))}
            <div className={rowLabel}>가진 돈</div>
            {CASES.map((c, i) => (
              <div key={`m-${c.name}`} className={cell(shown(i))}>{shown(i) ? fmt(c.money) : "—"}</div>
            ))}
            <div className={rowLabel}>손 바뀜 (역산)</div>
            {CASES.map((c, i) => (
              <div key={`v-${c.name}`} className={cell(shown(i), true)}>{shown(i) ? fmt((PRICE * QTY) / c.money) : "—"}</div>
            ))}
            <div className={`${rowLabel} border-t border-border pt-2`}>양쪽 곱</div>
            {CASES.map((c, i) => (
              <div key={`eq-${c.name}`} className={`border-t border-border pt-2 ${shown(i) ? "" : "opacity-40"}`}>
                <div className={cell(shown(i))}>
                  {shown(i) ? `${Number((c.money * ((PRICE * QTY) / c.money)).toFixed(2))} = ${PRICE * QTY}` : "—"}
                </div>
              </div>
            ))}
          </div>
        );
      }}
    />
  );
}
