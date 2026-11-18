import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box — 위험값·가상 손익·실제 손익·모형 손익이 각각 어떤 재료로 만들어지는지.
 * 위험값 = 어제 장부로 계산한 다음 날 손실 문턱.
 * 가상 손익 = 어제 포지션 고정 + 오늘 시장가격.
 * 실제 손익 = 위에 장중 거래·수수료·기타 수익을 포함할 수 있음.
 * 모형 손익 = 어제 장부 + 위험모형에 들어간 위험요인만.
 */
type Use = "on" | "maybe" | "off";

const SCENES = [
  { label: "위험값", summary: "어제 장부 → 다음 날 손실 문턱", book: "on", market: "off", factors: "off", trades: "off", fees: "off", result: "어제 계산한 손실 문턱", note: "위험값은 오늘 결과가 나오기 전에 어제 장부로 계산한 다음 날 손실 문턱입니다. 1절의 사례에서는 5입니다. 가상 손익과 실제 손익은 이 문턱과 비교하고, 모형 손익은 문턱이 아니라 가상 손익과 비교합니다." },
  { label: "가상 손익", summary: "어제 포지션 고정 + 오늘 가격", book: "on", market: "on", factors: "on", trades: "off", fees: "off", result: "어제 장부를 오늘 가격으로", note: "어제 포지션을 그대로 뒀다고 가정하고 오늘 시장가격만 반영합니다. 오늘 새로 한 거래는 넣지 않으므로 어제 장부의 위험을 모형이 잡았는지 따로 볼 수 있습니다." },
  { label: "실제 손익", summary: "+ 장중 거래 · 수수료 · 기타 수익", book: "on", market: "on", factors: "on", trades: "on", fees: "maybe", result: "장부에 실제로 남은 결과", note: "실제 손익은 장중 거래, 수수료와 기타 수익을 포함할 수 있습니다. 그래서 같은 날의 가상 손익과 숫자가 달라질 수 있습니다(4절)." },
  { label: "모형 손익", summary: "어제 장부 + 모형의 위험요인만", book: "on", market: "off", factors: "on", trades: "off", fees: "off", result: "위험모형이 설명한 몫", note: "위험모형에 들어간 위험요인만으로 어제 장부를 다시 가격 냅니다(6절에서는 위험이론 손익이라고 부릅니다). 가상 손익과 크게 다르면 위험모형이 가격 장부의 중요한 요인이나 평가 방식을 놓쳤을 수 있습니다." },
] as const;

function tone(use: Use) {
  if (use === "on") return "border-[#2563eb] bg-[#2563eb]/10 text-foreground";
  if (use === "maybe") return "border-dashed border-[#2563eb] text-foreground";
  return "border-dashed border-border/60 text-muted-foreground/60";
}

function Chip({ use, title, sub }: { use: Use; title: string; sub: string }) {
  return (
    <div className={`rounded-lg border px-3 py-2 text-xs leading-5 ${tone(use)}`}>
      <span className="block font-semibold">{title}</span>
      <span className="block">{use === "maybe" ? `${sub} · 포함할 수 있음` : sub}</span>
    </div>
  );
}

export default function PnlLayersViz() {
  return (
    <SceneShell
      eyebrow="네 숫자의 재료"
      title="이름이 비슷한 네 숫자는 서로 다른 재료로 만듭니다"
      description="'어제 장 마감' 묶음은 어제 들고 있던 장부, '오늘 하루' 묶음은 오늘 하루 동안 생긴 일입니다. 파란 칸이 그 숫자에 들어가는 재료이고, 점선 파란 칸은 들어갈 수 있는 재료입니다."
      ariaLabel="위험값, 가상 손익, 실제 손익, 모형 손익이 쓰는 재료 비교"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid gap-3 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
              <div className="space-y-2">
                <p className="text-[11px] font-semibold text-muted-foreground">어제 장 마감</p>
                <Chip use={scene.book} title="어제 장부" sub="그때 들고 있던 포지션" />
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-semibold text-muted-foreground">오늘 하루</p>
                <div className={`rounded-lg border px-3 py-2 text-xs leading-5 ${tone(scene.market)}`}>
                  <span className="block font-semibold">오늘 시장가격 변화 (모든 요인)</span>
                  <div className={`mt-2 rounded-md border px-2 py-1.5 ${tone(scene.factors)}`}>
                    <span className="block font-semibold">그 가운데 위험모형에 들어간 위험요인만</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Chip use={scene.trades} title="장중 거래" sub="오늘 새로 한 거래" />
                  <Chip use={scene.fees} title="수수료·기타 수익" sub="가격 변화 밖의 돈" />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-t border-border pt-3 text-sm">
              <span className="font-bold">{scene.label}</span>
              <span className="text-muted-foreground">= {scene.result}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
