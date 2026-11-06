import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 외부 장부(조건 100 = 35 + 25 + 20 + 20, 60과 40)와 태도 장부.
 * 태도는 100의 칸이 아니라 수단을 고르는 다른 장부이므로 막대 폭을 바꾸지 않는다.
 * 숫자는 3절의 설명용 가정이다.
 */
const PARTS = [
  { name: "밭 준비", value: 35, color: "#2563eb" },
  { name: "현재 행위", value: 25, color: "#3b82f6" },
  { name: "날씨·토양", value: 20, color: "#64748b" },
  { name: "타인·시장", value: 20, color: "#94a3b8" },
] as const;

const SCENES = [
  { label: "외부 장부", summary: "35 + 25 = 60 · 20 + 20 = 40", note: "앞의 60을 성실히 수행하면 기대 수확은 달라질 수 있습니다. 뒤의 40은 자기 뜻대로 만들 수 없습니다. 네 숫자는 측정값이 아니라 설명용 가정입니다.", mode: "none" },
  { label: "40을 인정하면", summary: "미루거나 숨길 유인이 줄어듦", note: "불확실성 때문에 행동을 미루거나 실패를 숨길 유인이 줄어듭니다. 막대의 숫자가 바뀌는 것이 아니라 그 숫자를 대하는 태도가 바뀝니다.", mode: "accept" },
  { label: "성과 독점에 매이면", summary: "과도한 농약·수로 독점·기록 조작", note: "태도는 결과와 별개의 장식이 아닙니다. 성과 독점에 매이면 이런 수단을 택할 수 있습니다.", mode: "bound" },
  { label: "더 큰 질서에 놓으면", summary: "수단과 타인의 비용도 판단에 들어옴", note: "다만 이런 효과는 자동으로 보장되지 않아 행동과 피해를 따로 확인해야 합니다.", mode: "order" },
] as const;

function AttitudeRow({ on, name, items, tone }: { on: boolean; name: string; items: string; tone: string }) {
  return (
    <div className={`grid grid-cols-[5.5rem_minmax(0,1fr)] gap-2 rounded-lg border px-3 py-2 text-sm leading-6 ${on ? tone : "border-border/50 text-muted-foreground/60"}`}>
      <span className="font-bold">{on ? "▶ " : ""}{name}</span>
      <span>{items}</span>
    </div>
  );
}

export default function TwoLedgersViz() {
  return (
    <SceneShell
      eyebrow="두 장부"
      title="태도는 100의 한 칸이 아니라 다른 장부에 적힙니다"
      description="위 막대가 수확 조건 100이고(설명용 가정), 아래가 그 조건을 대하는 태도입니다. 막대는 조건을 나눈 가정이라 장면마다 그대로 두었고, 태도가 바꾸는 것은 아래의 선택입니다."
      ariaLabel="수확 조건 100의 60과 40, 그리고 태도에 따라 달라지는 선택"
      scenes={SCENES}
      render={(active) => {
        const { mode } = SCENES[active];
        const dimLeft = mode === "accept";
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[60fr_40fr] gap-1 text-center text-xs font-bold leading-5">
              <span className={`border-b border-blue-600 ${dimLeft ? "opacity-40" : ""}`}>크게 바꿀 수 있음 60</span>
              <span className="border-b border-slate-500">혼자 정하지 못함 40</span>
            </div>
            <div className="mt-1 flex h-12 w-full">
              {PARTS.map((part, index) => (
                <div
                  key={part.name}
                  className="flex items-center justify-center border border-background text-sm font-bold text-white"
                  style={{ width: `${part.value}%`, backgroundColor: part.color, opacity: dimLeft && index < 2 ? 0.4 : 1 }}
                >
                  {part.value}
                </div>
              ))}
            </div>
            <div className="mt-1 flex w-full text-center text-[11px] leading-4 text-muted-foreground sm:text-xs">
              {PARTS.map((part) => (
                <span key={part.name} className="min-w-0 px-0.5" style={{ width: `${part.value}%` }}>{part.name}</span>
              ))}
            </div>
            <p className="mt-4 text-xs font-bold leading-5 text-muted-foreground">태도 장부</p>
            <div className="mt-2 space-y-2">
              <AttitudeRow on={mode === "accept"} name="40을 인정" items="미루거나 숨길 유인 감소" tone="border-blue-600" />
              <AttitudeRow on={mode === "bound"} name="성과 독점" items="과도한 농약·수로 독점·기록 조작을 택할 수 있음" tone="border-red-600" />
              <AttitudeRow on={mode === "order"} name="더 큰 질서" items="수단과 타인의 비용도 판단에 들어옴" tone="border-green-600" />
            </div>
          </div>
        );
      }}
    />
  );
}
