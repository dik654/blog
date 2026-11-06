import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 채권을 팔면 현금과 상환 약속이 같이 늘고, 대금을 치르면 현금이 도로로 바뀐다.
 * 금액 20은 #case의 차입 20·도로 20을 가져온 가정. 순자산 변화 = 현금 + 도로 − 부채.
 */
const SCENES = [
  { label: "채권을 팔았을 때", summary: "현금 +20 · 부채 +20", cash: 20, road: 0, debt: 20, debtName: "상환 약속", note: "현금이 20 늘었지만 같은 크기의 상환 약속도 생겼습니다. 그만큼 부유해진 것이 아닙니다." },
  { label: "도로 대금을 치렀을 때", summary: "현금 −20 · 도로 +20", cash: 0, road: 20, debt: 20, debtName: "상환 약속", note: "현금 20이 도로 20으로 바뀌었습니다. 돈을 써서 무엇이 남았는지는 자산과 부채 장부가 보여 줍니다." },
  { label: "채권을 못 팔았다면", summary: "도로 +20인데 현금 0", cash: 0, road: 20, debt: 20, debtName: "미지급 대금", note: "순자산 변화는 앞 장면과 똑같이 0입니다. 그래도 공사 대금을 낼 현금이 없으면 지급 문제가 생깁니다. 현금 장부만 답할 수 있는 질문입니다." },
] as const;

const MAX = 24;

function Row({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="grid grid-cols-[6.25rem_minmax(0,1fr)_3.25rem] items-center gap-2 text-xs sm:text-sm">
      <span className="font-semibold">{label}</span>
      <div className="h-6 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${(value / MAX) * 100}%`, backgroundColor: color }} />
      </div>
      <span className="text-right font-mono font-bold">{value > 0 ? `+${value}` : "0"}</span>
    </div>
  );
}

export default function CashVsNetWorthViz() {
  return (
    <SceneShell
      eyebrow="두 장부 (가정)"
      title="현금과 순자산은 같은 거래에서 다르게 움직입니다"
      description="막대는 이 거래들 전과 비교한 변화량입니다. 금액 20은 앞 절 사례의 차입 20·도로 20을 그대로 쓴 가정입니다."
      ariaLabel="채권 판매, 대금 지급, 채권을 못 판 경우의 현금, 도로, 부채와 순자산 변화"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <p className="mb-2 text-xs font-bold text-muted-foreground">자산</p>
            <div className="space-y-2">
              <Row label="현금" value={scene.cash} color="#2563eb" />
              <Row label="도로" value={scene.road} color="#16a34a" />
            </div>
            <p className="mb-2 mt-4 text-xs font-bold text-muted-foreground">갚을 의무</p>
            <Row label={scene.debtName} value={scene.debt} color="#d97706" />
            <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-t border-border pt-3 text-sm">
              <span className="font-semibold">순자산 변화</span>
              <span className="font-mono font-bold">{scene.cash} + {scene.road} − {scene.debt} = {scene.cash + scene.road - scene.debt}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
