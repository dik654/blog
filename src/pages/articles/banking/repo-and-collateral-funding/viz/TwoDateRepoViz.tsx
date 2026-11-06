import SceneShell from "./SceneShell";
import TwoPartyFlow from "./TwoPartyFlow";

/**
 * 본문 대응: #case — 시장가치 100억 국채, 5% 공제, 연 3.65%, 하루(모두 가정).
 * 100 × 0.95 = 95억, 95억 × 0.0365 ÷ 365 = 95만, 만기 95억95만.
 */
const W = 372;
const BAR_X = 2;
const BAR_W = W - 4;
const CASH_W = BAR_W * 0.95;
const BLUE = "#2563eb";
const GREEN = "#16a34a";
const LEFT_NAME = "자금이 필요한 곳";
const RIGHT_NAME = "현금을 가진 곳";

const SCENES = [
  { label: "거래 전 · 5%를 뗍니다", summary: "100억 − 5억 = 95억", note: "증권값 전부를 빌려주지 않습니다. 시장가치의 5%를 공제하면 현금은 95억 원이고, 뗀 5억 원이 처음의 가치 여유입니다." },
  { label: "오늘 · 서로 반대로 움직입니다", summary: "증권 → · ← 95억", note: "자금이 필요한 곳은 국채를 넘기고 95억 원을 받습니다. 증권과 돈이 같은 날 서로 반대 방향으로 움직입니다." },
  { label: "하루 · 이자가 붙습니다", summary: "95억 × 0.0365 ÷ 365 = 95만", note: "이자는 100억 원이 아니라 실제로 받은 95억 원에 붙습니다. 1년을 365일로 계산하므로 하루 이자는 95만 원입니다." },
  { label: "다음 날 · 방향이 뒤집힙니다", summary: "95억 + 95만 = 95억95만", note: "오늘 받은 돈에 하루 이자를 더한 95억95만 원을 내고 증권을 돌려받습니다. 화살표 방향이 오늘과 정반대입니다." },
] as const;

export default function TwoDateRepoViz() {
  return (
    <SceneShell
      eyebrow="두 날짜의 교환"
      title="증권과 돈은 오늘 엇갈리고 다음 날 되돌아갑니다"
      description="위 막대는 국채의 시장가치 100억 원, 아래 두 칸은 거래 당사자입니다. 금액과 요율은 모두 설명을 위한 가정입니다."
      ariaLabel="증권과 현금이 오늘과 다음 날 반대 방향으로 이동하는 과정"
      scenes={SCENES}
      render={(active) => {
        const flows =
          active === 1
            ? [
                { label: "국채 100억", toRight: true, color: BLUE },
                { label: "현금 95억", toRight: false, color: GREEN },
              ]
            : active === 3
              ? [
                  { label: "동등한 증권", toRight: false, color: BLUE },
                  { label: "95억95만 원", toRight: true, color: GREEN },
                ]
              : [];
        const left = [["국채 100억"], ["현금 95억"], ["현금 95억", "갚을 돈", "95억95만 원"], ["동등한 증권"]][active];
        const right = [["현금"], ["국채 100억"], ["국채 100억"], ["95억95만 원"]][active];
        return (
          <svg viewBox={`0 0 ${W} 170`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={BAR_X} y={12} fontSize={13} className="fill-muted-foreground">국채 시장가치 100억</text>
            <text x={BAR_X + BAR_W} y={12} textAnchor="end" fontSize={13} fontWeight={700} fill="#d97706">공제 5억</text>
            <rect x={BAR_X} y={18} width={CASH_W} height={24} rx={3} fill={GREEN} opacity={0.85} />
            <rect x={BAR_X + CASH_W} y={18} width={BAR_W - CASH_W} height={24} rx={3} fill="#d97706" opacity={0.85} />
            <text x={BAR_X + CASH_W / 2} y={34} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">현금으로 내주는 95억</text>
            <TwoPartyFlow
              y={64}
              width={W}
              left={{ name: LEFT_NAME, lines: left }}
              right={{ name: RIGHT_NAME, lines: right }}
              flows={flows}
              center={active === 0 ? ["교환 전"] : active === 2 ? ["하루 이자", "95만 원"] : undefined}
            />
          </svg>
        );
      }}
    />
  );
}
