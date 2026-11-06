import SceneShell from "./SceneShell";

/** 본문 대응: #need — 외국 돈 수요·공급의 차이가 어느 통로로 조정되는가. 본문의 '할 수 있다'를 그대로 둔다. */
const ROUTES = [
  { title: "환율을 움직이게 둠", sub: "차이가 가격에 나타남" },
  { title: "외국 돈을 직접 내놓음", sub: "일정한 비율을 지키려 할 때 · 할 수 있음" },
  { title: "국내 돈의 양 · 금리 조건 조정", sub: "일정한 비율을 지키려 할 때 · 할 수 있음" },
  { title: "돈의 국경 이동을 제한", sub: "급한 유출을 늦출 수 있음 · 거래 자유 줄어듦" },
] as const;

const SCENES = [
  { label: "움직이게 두면", summary: "차이 → 가격", note: "돈의 교환 비율을 시장에 맡기면 외국 돈을 원하는 사람과 공급하는 사람의 차이가 환율이라는 가격에 나타납니다." },
  { label: "붙잡으려면 ①", summary: "차이 → 외국 돈을 내놓음", note: "일정한 비율을 지키려면 차이를 가격이 아닌 다른 곳에서 받아야 할 수 있습니다. 그 하나가 외국 돈을 직접 내놓는 것입니다." },
  { label: "붙잡으려면 ②", summary: "차이 → 국내 돈 · 금리", note: "또 하나는 국내 돈의 양과 금리 조건을 조정하는 것입니다. 일정한 비율을 지키려면 이렇게 해야 할 수도 있습니다." },
  { label: "이동을 막으면", summary: "차이 → 거래 제한", note: "돈의 국경 이동을 제한하는 제도는 급한 유출을 늦출 수 있지만 기업과 투자자의 거래 자유도 함께 줄입니다." },
  { label: "어느 통로에 맡길지", summary: "비용 없는 버튼은 없음", note: "조정은 사라지지 않고 어딘가에 나타납니다. 정책은 그 조정을 어느 통로에 맡길지 정하는 선택입니다." },
] as const;

const BOX_X = 112;
const BOX_W = 242;
const BOX_H = 46;
const rowY = (i: number) => 4 + i * 52;

export default function AdjustmentChannelViz() {
  return (
    <SceneShell
      eyebrow="조정의 통로"
      title="외국 돈의 수요와 공급 차이는 어느 통로로 나타날까요"
      description="왼쪽의 차이는 같고 오른쪽이 정책이 고를 수 있는 통로입니다. 통로의 크기나 효과는 비교하지 않았습니다."
      ariaLabel="외국 돈 수요와 공급의 차이가 환율, 외국 돈 공급, 국내 돈과 금리, 이동 제한으로 갈라지는 분기"
      scenes={SCENES}
      render={(active) => {
        const isLit = (i: number) => active === 4 || active === i;
        return (
          <svg viewBox="0 0 360 214" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <rect x={6} y={72} width={84} height={66} rx={6} fill="#64748b" fillOpacity={0.12} stroke="#64748b" strokeWidth={1} />
            <text x={48} y={94} textAnchor="middle" fontSize={10.5} fontWeight={700} className="fill-foreground">원하는 쪽과</text>
            <text x={48} y={109} textAnchor="middle" fontSize={10.5} fontWeight={700} className="fill-foreground">공급 쪽의</text>
            <text x={48} y={124} textAnchor="middle" fontSize={10.5} fontWeight={700} className="fill-foreground">차이</text>
            {ROUTES.map((route, i) => {
              const lit = isLit(i);
              const y = rowY(i);
              return (
                <g key={route.title} opacity={lit ? 1 : 0.3} className="transition-opacity duration-300 motion-reduce:transition-none">
                  <path d={`M90,105 C100,105 98,${y + BOX_H / 2} ${BOX_X - 5},${y + BOX_H / 2}`} fill="none" stroke={lit ? "#2563eb" : "#94a3b8"} strokeWidth={1} />
                  <path d={`M${BOX_X - 6},${y + BOX_H / 2 - 3.5} L${BOX_X},${y + BOX_H / 2} L${BOX_X - 6},${y + BOX_H / 2 + 3.5} Z`} fill={lit ? "#2563eb" : "#94a3b8"} />
                  <rect x={BOX_X} y={y} width={BOX_W} height={BOX_H} rx={6} fill={lit ? "#2563eb" : "none"} fillOpacity={lit ? 0.1 : 0} stroke={lit ? "#2563eb" : "#94a3b8"} strokeWidth={1} />
                  <text x={BOX_X + 10} y={y + 19} fontSize={11} fontWeight={700} className="fill-foreground">{route.title}</text>
                  <text x={BOX_X + 10} y={y + 36} fontSize={9.5} fill="#64748b">{route.sub}</text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
