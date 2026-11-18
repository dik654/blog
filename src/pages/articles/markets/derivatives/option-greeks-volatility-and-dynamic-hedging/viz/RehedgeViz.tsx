import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 콜 한 단위 매도(델타 −0.50) + 주식 0.50주 → 합 0.
 * 주가 +2, 감마 0.04 → 콜 델타 약 0.58 → 주식 0.08주 추가 매수.
 * (가정) 주가가 100으로 돌아오고 감마가 그대로면 콜 델타 0.50 → 0.08주 매도.
 * 재조정한 0.08주: 102에 사서 100에 팖 → 0.08 × (100 − 102) = −0.16(수수료·호가 차이 제외).
 */
const SCENES = [
  { label: "시작: 주가 100", step: 0, callDelta: 0.5, sharesBefore: 0, trade: 0.5, summary: "콜 −0.50 → 주식 0.50주 매수 → 합계 0", note: "콜을 한 단위 팔면 포지션 델타가 −0.50입니다. 주식 0.50주를 사면 시작 순간의 작은 가격 변화에는 손익이 거의 움직이지 않는 델타 중립이 됩니다." },
  { label: "주가 102", step: 1, callDelta: 0.58, sharesBefore: 0.5, trade: 0.08, summary: "콜 −0.58 + 주식 0.50 = −0.08 → 0.08주 매수", note: "주가가 2 오르면 감마 0.04 때문에 콜 델타가 약 0.58로 커집니다. 처음 산 0.50주로는 모자라 오른 가격에 0.08주를 더 삽니다." },
  { label: "주가 다시 100(가정)", step: 2, callDelta: 0.5, sharesBefore: 0.58, trade: -0.08, summary: "콜 −0.50 + 주식 0.58 = +0.08 → 0.08주 매도", note: "주가가 100으로 돌아오고 감마가 그대로라고 가정하면 콜 델타는 다시 0.50입니다. 이번에는 주식이 남아 내린 가격에 0.08주를 팝니다." },
  { label: "재조정한 0.08주", step: 3, callDelta: 0.5, sharesBefore: 0.5, trade: 0, summary: "102에 사서 100에 팖 → 0.08 × (−2) = −0.16", note: "오를 때 사고 내릴 때 판 0.08주에서만 0.16을 잃었습니다. 매수·매도 차이와 수수료를 넣으면 더 커집니다. 이 값은 재조정 거래 한 조각이며 옵션과 주식을 합친 전체 손익이 아닙니다. 처음 받은 프리미엄은 이런 비용과 함께 봐야 합니다." },
] as const;

const PATH: readonly number[] = [100, 102, 100];
const W = 350;
const H = 104;
const px = (i: number) => 75 + i * 100;
const py = (price: number) => (price === 102 ? 34 : 74);

function signed(value: number) {
  if (value === 0) return "0";
  return `${value > 0 ? "+" : "−"}${Math.abs(value).toFixed(2)}`;
}

export default function RehedgeViz() {
  return (
    <SceneShell
      eyebrow="동적 헤지"
      title="주가가 움직이면 델타가 바뀌어 주식 수량을 다시 맞춥니다"
      description="옵션 한 단위(계약 승수 없음)를 판 사람의 하루입니다. 델타 0.50, 감마 0.04는 3절의 설명용 값이고, 주가가 100으로 되돌아오는 경로는 가정입니다."
      ariaLabel="콜 매도 후 주가가 100에서 102로 오르고 다시 100으로 내릴 때 주식 헤지 수량을 고치는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const shown = Math.min(scene.step, 2);
        const net = scene.sharesBefore - scene.callDelta;
        const after = scene.sharesBefore + scene.trade;
        return (
          <div className="min-w-0 space-y-3">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[420px]" role="img" aria-label={`주가 경로 100, 102, 100 중 ${scene.label}`}>
              <polyline points={PATH.map((price, i) => `${px(i)},${py(price)}`).join(" ")} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
              {PATH.map((price, i) => {
                const on = scene.step === 3 ? i >= 1 : i <= shown;
                const current = scene.step === 3 ? i >= 1 : i === shown;
                const tag = i === 1 ? "0.08주 매수" : i === 2 ? "0.08주 매도" : "0.50주 매수";
                const color = i === 2 ? "#16a34a" : "#d97706";
                return (
                  <g key={i} opacity={on ? 1 : 0.3}>
                    <circle cx={px(i)} cy={py(price)} r={current ? 5 : 3.5} fill={current ? "#2563eb" : "#94a3b8"} />
                    <text x={px(i)} y={py(price) + (price === 102 ? -12 : 20)} textAnchor="middle" fontSize={12} fontWeight={700} fill="#475569">{price}</text>
                    {current && (
                      <text x={px(i)} y={price === 102 ? py(price) + 22 : py(price) + 4} textAnchor={i === 0 ? "end" : i === 2 ? "start" : "middle"} dx={i === 0 ? -9 : i === 2 ? 9 : 0} fontSize={11} fontWeight={700} fill={color}>{tag}</text>
                    )}
                  </g>
                );
              })}
            </svg>
            {scene.step === 3 ? (
              <div className="grid grid-cols-4 gap-1 text-center font-mono text-xs sm:text-sm">
                <span className="text-[11px] text-muted-foreground">산 가격</span>
                <span className="text-[11px] text-muted-foreground">판 가격</span>
                <span className="text-[11px] text-muted-foreground">수량</span>
                <span className="text-[11px] text-muted-foreground">재조정 손익</span>
                <span>102</span>
                <span>100</span>
                <span>0.08주</span>
                <span className="font-bold text-red-700 dark:text-red-400">−0.16</span>
              </div>
            ) : (
            <div className="grid grid-cols-4 gap-1 text-center font-mono text-xs sm:text-sm">
              <span className="text-[11px] text-muted-foreground">콜 매도 델타</span>
              <span className="text-[11px] text-muted-foreground">주식(거래 전)</span>
              <span className="text-[11px] text-muted-foreground">거래 전 합계</span>
              <span className="text-[11px] text-muted-foreground">거래 → 보유</span>
              <span>−{scene.callDelta.toFixed(2)}</span>
              <span>{scene.sharesBefore.toFixed(2)}</span>
              <span className="font-bold text-amber-700 dark:text-amber-400">{signed(Number(net.toFixed(2)))}</span>
              <span>{signed(scene.trade)} → {after.toFixed(2)}</span>
            </div>
            )}
          </div>
        );
      }}
    />
  );
}
