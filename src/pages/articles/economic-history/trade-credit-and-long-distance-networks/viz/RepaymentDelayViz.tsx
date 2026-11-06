import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 첫 상환이 늦어지면 귀환 대금과 다음 대상이 막히고, 실패는 동업자와 다음 거래로 번질 수 있다.
 * 금액 크기는 2미나 외에 글에 없으므로 칸 크기를 금액에 맞추지 않는다.
 */
type Status = "ok" | "stuck" | "maybe" | "wait";

const STATUS: Record<Status, { word: string; color: string; dashed: boolean }> = {
  ok: { word: "진행", color: "#2563eb", dashed: false },
  stuck: { word: "차질", color: "#dc2626", dashed: false },
  maybe: { word: "번질 수 있음", color: "#d97706", dashed: true },
  wait: { word: "대기", color: "#94a3b8", dashed: true },
};

const ACTORS = ["채무자", "상인", "투자자", "동업자·다음 거래"];

const SCENES: readonly { label: string; summary: string; note: string; rows: readonly (readonly [Status, string])[] }[] = [
  {
    label: "약속대로",
    summary: "2미나가 먼저 들어옴",
    note: "다음 수확에서 2미나가 들어오고, 남은 4미나는 뒤 거래나 수확에서 결제됩니다. 들어온 은이 다음 일정으로 이어지는 순서입니다.",
    rows: [["ok", "다음 수확에 2미나 상환"], ["ok", "귀환 대금 마련"], ["ok", "다음 대상 꾸리기"], ["ok", "다음 거래로 이어짐"]],
  },
  {
    label: "첫 상환이 늦어지면",
    summary: "2미나 지연 → 뒤 단계 차례로",
    note: "첫 상환이 늦어지면 상인은 귀환 대금을 마련하지 못하고 투자자도 다음 대상을 꾸리기 어렵습니다. 그래서 수익률만큼 상환 순서와 현금 시점이 중요합니다.",
    rows: [["stuck", "2미나가 늦어짐"], ["stuck", "귀환 대금 마련 못 함"], ["stuck", "다음 대상 꾸리기 어려움"], ["wait", "다음 장면에서 봅니다"]],
  },
  {
    label: "실패가 번지면",
    summary: "한 채무자 → 동업자·다음 거래",
    note: "한 채무자의 실패가 동업자와 다음 거래로 번질 수 있습니다. 반드시 번진다는 뜻은 아니어서 점선으로 그렸습니다.",
    rows: [["stuck", "한 채무자의 실패"], ["stuck", "귀환 대금 마련 못 함"], ["stuck", "다음 대상 꾸리기 어려움"], ["maybe", "실패가 넘어올 수 있음"]],
  },
];

export default function RepaymentDelayViz() {
  return (
    <SceneShell
      eyebrow="상환 순서"
      title="첫 2미나가 늦으면 귀환 대금과 다음 대상이 함께 흔들립니다"
      description="위에서 아래로 돈이 이어지는 순서입니다. 칸 크기는 금액을 뜻하지 않습니다. 대상은 짐을 싣고 함께 다니는 상인 무리, 귀환 대금은 상인이 돌아갈 때 가져갈 대금입니다."
      ariaLabel="채무자, 상인, 투자자, 동업자와 다음 거래로 이어지는 상환 사슬의 세 경우"
      scenes={SCENES}
      render={(active) => (
        <ol className="min-w-0">
          {SCENES[active].rows.map(([status, text], index) => {
            const style = STATUS[status];
            return (
              <li key={ACTORS[index]}>
                {index > 0 && (
                  <svg width={10} height={18} viewBox="0 0 10 18" aria-hidden className="ml-5 block">
                    <path d="M5 0 V12" stroke={style.color} strokeWidth={1} strokeDasharray={style.dashed ? "3 3" : undefined} />
                    <path d="M0 11 L5 18 L10 11 Z" fill={style.color} />
                  </svg>
                )}
                <div className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-xs leading-5 sm:text-sm" style={{ borderColor: style.color, borderStyle: style.dashed ? "dashed" : "solid" }}>
                  <span className="min-w-0">
                    <span className="block font-bold">{ACTORS[index]}</span>
                    <span className="block">{text}</span>
                  </span>
                  <span className="shrink-0 text-right font-semibold" style={{ color: style.color }}>{style.word}</span>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    />
  );
}
