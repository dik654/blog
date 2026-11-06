import SceneShell from "./SceneShell";

/**
 * 본문 대응: #adaptive — 기준 atol+rtol×max(|y0|,|y1|)=.001+.01×1=.011. 오차 .022→비율 2, .0055→비율 .5.
 * rk_common.py: 비율 ≤1이면 수락, max_step·min_step 분기가 덮어쓴다.
 */
const SCALE = 0.025;
const pct = (value: number) => `${(value / SCALE) * 100}%`;

const SCENES = [
  { label: "허용 기준", summary: "0.001 + 0.01×1 = 0.011", err: null, verdict: null, note: "성분마다 절대 허용오차 atol에 상대 허용오차 rtol×max(|y0|,|y1|)를 더합니다. y0=1, y1=0.5이면 큰 쪽 1을 써서 기준은 0.011입니다." },
  { label: "기준을 넘는 시도", summary: "0.022 ÷ 0.011 = 2", err: 0.022, verdict: "reject", note: "오차 추정을 기준으로 나눈 비율이 2입니다. 1을 넘으면 기본 판정은 거절이고 더 작은 간격으로 다시 계산할 수 있습니다. 안전 계수와 변화 배율의 상하한이 있어 항상 정확히 절반 간격이 되는 것은 아닙니다." },
  { label: "기준 안의 시도", summary: "0.0055 ÷ 0.011 = 0.5", err: 0.0055, verdict: "accept", note: "비율이 1 이하이면 기본 판정은 수락입니다. 충분히 작으면 다음 간격을 키울 수 있습니다." },
  { label: "분기가 덮어쓸 때", summary: "비율 2여도 수락될 수 있음", err: 0.022, verdict: "forced", note: "max_step과 min_step의 별도 분기가 기본 판정을 덮어씁니다. 설정한 최소 간격에 닿으면 비율과 상관없이 수락을 강제할 수 있으므로, 수락되었다고 오차가 기준 안이었다고 단정하지 않습니다." },
] as const;

function Decision({ title, sub, on, tone }: { title: string; sub: string; on: boolean; tone: "red" | "green" }) {
  const onClass = tone === "red" ? "border-red-600 bg-red-600/10" : "border-green-600 bg-green-600/10";
  return (
    <div className={`min-w-0 rounded-lg border px-3 py-2 ${on ? onClass : "border-border/60"}`}>
      <p className={`text-sm font-bold ${on ? "" : "text-muted-foreground/60"}`}>{on ? "▶ " : ""}{title}</p>
      <p className={`mt-1 text-xs leading-5 ${on ? "text-muted-foreground" : "text-muted-foreground/50"}`}>{sub}</p>
    </div>
  );
}

export default function AdaptiveRatioViz() {
  return (
    <SceneShell
      eyebrow="수락과 거절"
      title="오차 추정을 허용 기준으로 나눈 비율이 기본 판정을 정합니다"
      description="한 성분에서 y0=1, y1=0.5, atol=0.001, rtol=0.01로 둔 계산이고 오차 추정 0.022와 0.0055도 예로 고른 값입니다(가정). 두 막대는 같은 눈금입니다."
      ariaLabel="허용 기준과 오차 추정 비교로 시도를 수락하거나 거절하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const v = scene.verdict as string | null;
        return (
          <div className="min-w-0">
            <div className="relative space-y-3">
              <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_3.25rem] items-center gap-2 text-xs sm:text-sm">
                <span className="font-semibold">허용 기준</span>
                <div className="flex h-5 min-w-0 rounded-sm bg-muted/40">
                  <div style={{ width: pct(0.001), backgroundColor: "#d97706" }} className="h-full" />
                  <div style={{ width: pct(0.01), backgroundColor: "#64748b" }} className="h-full" />
                </div>
                <span className="text-right font-mono font-bold">0.011</span>
              </div>
              <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_3.25rem] items-center gap-2 text-xs sm:text-sm">
                <span className="font-semibold">오차 추정</span>
                <div className="relative h-5 min-w-0 rounded-sm bg-muted/40">
                  {scene.err !== null && <div style={{ width: pct(scene.err), backgroundColor: "#2563eb" }} className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none" />}
                  <div aria-hidden="true" style={{ left: pct(0.011) }} className="absolute -top-8 bottom-0 border-l border-dashed border-foreground/60" />
                </div>
                <span className="text-right font-mono font-bold">{scene.err ?? "−"}</span>
              </div>
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">주황 = atol 0.001, 회색 = rtol 몫 0.01, 점선 = 기준 0.011 (비율 1)</p>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Decision title="거절" sub="더 작은 간격으로 다시 계산할 수 있음" on={v === "reject"} tone="red" />
              <Decision title={v === "forced" ? "수락 (최소 간격 예외)" : "수락"} sub={v === "forced" ? "다음 단계로 진행, 오차가 기준 안이었다는 뜻은 아님" : "다음 단계로 진행, 다음 간격을 키울 수 있음"} on={v === "accept" || v === "forced"} tone="green" />
            </div>
          </div>
        );
      }}
    />
  );
}
