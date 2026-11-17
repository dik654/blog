import SceneShell from "./SceneShell";

/**
 * 본문 대응: #gap interpretation — Train .18·validation .31이면 G=.13.
 * Train .80·validation .82는 G=.02로 더 작지만, 두 loss가 모두 높아 underfitting일 수 있습니다.
 * 막대는 같은 loss 눈금(0~1.0)에 둡니다.
 */
const CASES = [
  { key: "A", name: "사례 A", train: 0.18, val: 0.31 },
  { key: "B", name: "사례 B", train: 0.8, val: 0.82 },
] as const;

const fmt = (value: number) => value.toFixed(2).replace(/^0/, "");
const gapOf = (item: { train: number; val: number }) => Math.round((item.val - item.train) * 100) / 100;

const SCENES = [
  { label: "사례 A", summary: `${fmt(CASES[0].val)} − ${fmt(CASES[0].train)} = ${fmt(gapOf(CASES[0]))}`, note: "같은 checkpoint를 같은 loss로 잰 두 평균입니다. 두 막대 끝의 차이, 곧 빨간 칸이 관측 gap G=.13입니다.", show: [true, false] },
  { label: "사례 B", summary: `${fmt(CASES[1].val)} − ${fmt(CASES[1].train)} = ${fmt(gapOf(CASES[1]))}`, note: "Gap은 .02로 사례 A보다 훨씬 작습니다. 하지만 train loss .80부터 이미 높습니다.", show: [false, true] },
  { label: "같은 눈금에 놓기", summary: "작은 gap ≠ 좋은 일반화", note: "Gap만 보면 B가 나아 보이지만, B는 train data조차 충분히 맞추지 못한 상태일 수 있습니다. 이런 상태를 underfitting이라 부르며, gap과 함께 두 loss의 절대 높이도 봐야 하는 이유입니다.", show: [true, true] },
] as const;

function LossBar({ label, value, color, visible }: { label: string; value: number; color: string; visible: boolean }) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_2.5rem] items-center gap-2 text-xs sm:text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="relative h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm" style={{ width: visible ? `${value * 100}%` : "0%", backgroundColor: color }} />
      </div>
      <span className="text-right font-mono">{visible ? fmt(value) : "−"}</span>
    </div>
  );
}

function GapStrip({ train, val, visible }: { train: number; val: number; visible: boolean }) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_2.5rem] items-center gap-2 text-xs sm:text-sm">
      <span className="font-bold">gap G</span>
      <div className="relative h-4 min-w-0">
        {visible && (
          <div
            className="absolute inset-y-0 rounded-sm border border-[#dc2626]"
            style={{ left: `${train * 100}%`, width: `max(2px, ${(val - train) * 100}%)`, backgroundColor: "#fee2e2" }}
          />
        )}
      </div>
      <span className="text-right font-mono font-bold text-[#b91c1c] dark:text-[#f87171]">{visible ? fmt(gapOf({ train, val })) : "−"}</span>
    </div>
  );
}

export default function GapScaleViz() {
  return (
    <SceneShell
      eyebrow="같은 loss 눈금 · 0 ~ 1.0"
      title="Gap이 작다고 일반화가 좋다는 뜻은 아닙니다"
      description="막대 길이는 같은 checkpoint의 평균 loss이고, 낮을수록 좋습니다. 빨간 칸이 validation에서 train을 뺀 관측 gap입니다."
      note="두 사례의 숫자는 본문 해석의 예시값입니다."
      ariaLabel="train과 validation loss의 두 사례에서 gap의 크기와 두 loss의 절대 높이 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="space-y-5">
          {CASES.map((item, index) => {
            const shown: readonly boolean[] = SCENES[active].show;
            const visible = shown[index];
            return (
              <div key={item.key} className={`space-y-1.5 ${visible ? "" : "opacity-40"}`}>
                <p className="text-xs font-bold text-muted-foreground">{item.name}</p>
                <LossBar label="Train" value={item.train} color="#64748b" visible={visible} />
                <LossBar label="Validation" value={item.val} color="#2563eb" visible={visible} />
                <GapStrip train={item.train} val={item.val} visible={visible} />
              </div>
            );
          })}
          <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_2.5rem] gap-2 text-[11px] text-muted-foreground">
            <span />
            <div className="flex justify-between font-mono"><span>0</span><span>.5</span><span>1.0</span></div>
            <span />
          </div>
        </div>
      )}
    />
  );
}
