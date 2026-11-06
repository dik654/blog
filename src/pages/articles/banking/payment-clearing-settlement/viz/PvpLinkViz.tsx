import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #cross-currency·#pvp — A가 14억 원을 주고 100만 달러를 받는 교환(설명용 환율 1달러 1,400원).
 * 14억 ÷ 1,400 = 100만. 연결이 없으면 원금이 노출되고, 연결하면 한쪽만 확정되는 결과를 허용하지 않는다.
 */
type LegState = "final" | "miss" | "hold";

interface PvpScene extends ShellScene {
  won: LegState;
  usd: LegState;
  link: string;
  linked: boolean;
  result: string;
}

const SCENES: readonly PvpScene[] = [
  { label: "연결이 없을 때", summary: "원화만 확정", won: "final", usd: "miss", link: "두 지급 사이 연결 없음", linked: false, result: "A: 보낸 14억 원의 회수 문제", note: "14억 원이 위험에 노출됐다는 말이 14억 원 손실이 확정됐다는 말은 아닙니다. 회수할 재산이나 담보, 법적 청구의 결과에 따라 실제 손실은 달라집니다." },
  { label: "연결하고 둘 다 될 때", summary: "둘 다 최종 이전", won: "final", usd: "final", link: "한쪽 최종 이전 ⇔ 다른 쪽 최종 이전", linked: true, result: "A: 14억 원을 내고 100만 달러를 받음", note: "이것이 외환동시결제, PvP의 핵심입니다. 메시지가 정확히 같은 물리적 순간에 도착해야 한다는 뜻은 아닙니다." },
  { label: "연결했는데 상대가 못 낼 때", summary: "교환 전체 보류", won: "hold", usd: "hold", link: "한쪽 최종 이전 ⇔ 다른 쪽 최종 이전", linked: true, result: "남는 문제: 달러를 제때 못 얻음·재거래 가격·자금 조달·운영 장애", note: "원금 하나만 잃는 상황은 막아도 예정된 통화를 제때 얻지 못할 수 있습니다. PvP를 썼다는 이유만으로 환율이나 유동성 위험까지 0이 되지는 않습니다." },
];

const STATE_TEXT: Record<LegState, string> = { final: "최종 이전", miss: "오지 않음", hold: "보류" };
const STATE_CLASS: Record<LegState, string> = {
  final: "border-primary bg-primary/5 text-primary",
  miss: "border-red-600 text-red-700 dark:text-red-400",
  hold: "border-dashed border-border text-muted-foreground",
};

function Leg({ route, amount, state }: { route: string; amount: string; state: LegState }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_5.25rem] items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{route}</p>
        <p className="font-mono text-base font-bold">{amount}</p>
      </div>
      <span className={`rounded border px-1 py-1 text-center text-xs font-semibold ${STATE_CLASS[state]}`}>{STATE_TEXT[state]}</span>
    </div>
  );
}

export default function PvpLinkViz() {
  return (
    <SceneShell
      eyebrow="두 통화의 교환"
      title="두 지급을 연결하면 한쪽만 끝나는 칸이 사라집니다"
      description="PvP는 한 통화의 최종 지급을 다른 통화의 최종 지급에 연결하는 조건입니다. 금액은 14억 원과 100만 달러, 환율은 1달러당 1,400원이라는 설명용 가정입니다."
      ariaLabel="연결 없는 교환과 PvP로 연결된 교환의 결과 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <Leg route="A → 상대 (원화)" amount="14억 원" state={scene.won} />
            <p className={`my-1 text-center text-xs font-semibold ${scene.linked ? "text-primary" : "text-muted-foreground"}`}>
              <span aria-hidden="true">{scene.linked ? "┃ " : "┆ "}</span>
              {scene.link}
              <span aria-hidden="true">{scene.linked ? " ┃" : " ┆"}</span>
            </p>
            <Leg route="상대 → A (달러)" amount="100만 달러" state={scene.usd} />
            <p className="mt-3 min-h-11 text-sm font-semibold leading-6">{scene.result}</p>
          </div>
        );
      }}
    />
  );
}
