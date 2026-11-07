import SceneShell from "./SceneShell";

/**
 * 본문 대응: #prompt-sensitivity — 표현 두 개의 성공률 92%, 71%는 글의 예. 나머지 두 표현 85%, 80%는 가정.
 * 네 값의 평균 (92+71+85+80)/4 = 82, 최저 71. 다수결 예의 답 X·X·Y·X도 가정.
 */
const VARIANTS = [
  { label: "“표를 만들어라”", rate: 92 },
  { label: "“표 형식으로 정리해라”", rate: 71 },
  { label: "다른 표현 (가정)", rate: 85 },
  { label: "또 다른 표현 (가정)", rate: 80 },
] as const;

const RATES: readonly number[] = VARIANTS.map((item) => item.rate);
const MEAN = RATES.reduce<number>((sum, rate) => sum + rate, 0) / RATES.length;
const MIN = Math.min(...RATES);

const SCENES = [
  { label: "한 표현만 재면", summary: "92%", shown: 1, note: "한 표현에서만 잘 나온 결과를 그 prompt의 성능으로 보고하면 robustness(표현을 바꿔도 덜 흔들리는 성질)를 검증한 것이 아닙니다." },
  { label: "표현을 바꾸면", summary: "92% → 71%일 수 있음", shown: 2, note: "뜻이 같고 model도 같아도 표현만 바꾸면 성공률이 이렇게 갈릴 수 있습니다. 이것이 prompt sensitivity입니다." },
  { label: "서너 표현을 함께", summary: `평균 ${MEAN}% · 최저 ${MIN}%`, shown: 4, note: "표현만 바꾼 문장 서너 개를 평가 묶음으로 삼아 평균과 최저를 함께 보고합니다. (92+71+85+80)÷4=82입니다." },
  { label: "실제 ensemble", summary: "답 X · X · Y · X → X", shown: 4, note: "다른 방식도 있습니다. 여러 표현의 출력을 실제로 모아 다수결로 답을 고릅니다. 네 표현의 답은 가정입니다." },
] as const;

const BAR = "#2563eb";

export default function PhrasingRobustnessViz() {
  return (
    <SceneShell
      eyebrow="표현과 성공률"
      title="한 표현의 성공률은 그 prompt의 성능이 아닙니다"
      description="막대 하나가 같은 요청을 다른 문장으로 쓴 표현 하나의 성공률입니다. 92%와 71%는 글의 예이고 측정값이 아닙니다."
      ariaLabel="표현별 성공률과 평균, 최저, 다수결을 비교하는 네 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const ensemble = active === 3;
        const summary = active === 2;
        return (
          <div className="min-w-0">
            <div className="space-y-1.5">
              {VARIANTS.map((item, index) => {
                const visible = index < scene.shown;
                const lowest = summary && item.rate === MIN;
                return (
                  <div key={item.label} className={visible ? "" : "opacity-30"}>
                    <div className="flex justify-between gap-2 text-xs leading-5 sm:text-sm">
                      <span className="min-w-0 break-keep">{visible ? item.label : "(아직 안 잼)"}</span>
                      <strong className="font-mono">{visible ? `${item.rate}%` : "−"}</strong>
                    </div>
                    <div className="relative h-3.5 rounded-sm bg-muted/40">
                      <div className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none" style={{ width: visible ? `${item.rate}%` : "0%", backgroundColor: lowest ? "#d97706" : BAR }} />
                      {summary && <div className="absolute inset-y-[-2px] w-px bg-[#475569]" style={{ left: `${MEAN}%` }} />}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 grid min-h-[3.75rem] items-center rounded-lg border border-border px-3 py-2 text-xs leading-5 sm:text-sm">
              {summary && <span>세로선 = 평균 <strong className="font-mono">{MEAN}%</strong> · 주황 막대 = 최저 <strong className="font-mono">{MIN}%</strong></span>}
              {ensemble && <span>표현 1 · 2 · 4 → 답 X · 표현 3 → 답 Y <strong className="block">다수결 → X</strong></span>}
              {!summary && !ensemble && <span className="text-muted-foreground">0%부터 100%까지의 같은 눈금입니다</span>}
            </div>
          </div>
        );
      }}
    />
  );
}
