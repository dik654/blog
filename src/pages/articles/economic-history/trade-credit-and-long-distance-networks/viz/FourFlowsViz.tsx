import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box — 한 거래 안의 물건·대금·정보·위험은 길과 시점이 서로 다르다.
 * 줄의 길이는 속도나 기간을 뜻하지 않는다. 글에 구체적인 기간이 없기 때문이다.
 */
const ACCENT = "#2563eb";
const IDLE = "#94a3b8";

const SCENES = [
  { label: "물건", summary: "출발지 → 먼 시장", note: "주석과 직물은 대상과 배를 타고 먼 시장으로 움직입니다. 대상은 짐을 싣고 함께 다니는 상인 무리입니다." },
  { label: "대금", summary: "먼 시장 → 출발지", note: "은과 금은 물건의 반대편으로 돌아옵니다. 돌아오는 대신 다른 거래의 대금으로 쓰이기도 합니다." },
  { label: "정보", summary: "편지와 소문, 늦게 도착", note: "가격·분쟁·통행 상황은 편지와 소문으로 늦게 전달됩니다. 방향과 걸린 시간은 글에 정해져 있지 않아 양쪽 화살표 점선으로만 그렸습니다." },
  { label: "위험", summary: "길이 아니라 나눠 지는 몫", note: "도난·질병·전쟁·환율 변화로 생긴 손실은 투자자, 운송인, 상인 사이에 나뉩니다. 몫의 크기는 글에 없어 칸 크기를 같게 두었습니다." },
  { label: "시점이 어긋납니다", summary: "즉시 맞바꾸기만으로는 어려움", note: "네 흐름의 시점이 다르기 때문에 현금으로 즉시 맞바꾸는 거래만으로는 긴 거리를 버티기 어렵습니다." },
] as const;

function Head({ color, flip = false }: { color: string; flip?: boolean }) {
  return (
    <svg width={8} height={10} viewBox="0 0 8 10" aria-hidden className="shrink-0" style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M0 0 L8 5 L0 10 Z" fill={color} />
    </svg>
  );
}

function Arrow({ dir, color, dashed = false }: { dir: "right" | "left" | "both"; color: string; dashed?: boolean }) {
  return (
    <div className="flex items-center">
      {dir !== "right" && <Head color={color} flip />}
      <div className="min-w-0 flex-1 border-t" style={{ borderColor: color, borderTopStyle: dashed ? "dashed" : "solid" }} />
      {dir !== "left" && <Head color={color} />}
    </div>
  );
}

function Lane({ on, name, what, children }: { on: boolean; name: string; what: string; children: React.ReactNode }) {
  return (
    <div className={`transition-opacity duration-300 motion-reduce:transition-none ${on ? "" : "opacity-40"}`}>
      <div className="flex flex-wrap items-baseline gap-x-2 text-sm">
        <span className="font-bold">{name}</span>
        <span className="text-xs text-muted-foreground">{what}</span>
      </div>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

export default function FourFlowsViz() {
  return (
    <SceneShell
      eyebrow="한 거래, 네 흐름"
      title="같은 거래 안에서 네 흐름이 다른 길로 움직입니다"
      description="왼쪽이 출발지, 오른쪽이 먼 시장입니다. 줄의 길이는 속도나 기간을 뜻하지 않습니다."
      ariaLabel="물건, 대금, 정보, 위험이 각각 다른 방향과 방식으로 움직이는 네 줄"
      scenes={SCENES}
      render={(active) => {
        const all = active === 4;
        const on = (lane: number) => all || active === lane;
        const color = (lane: number) => (on(lane) ? ACCENT : IDLE);
        return (
          <div className="min-w-0">
            <div className="flex justify-between text-xs font-semibold text-muted-foreground">
              <span>출발지</span>
              <span>먼 시장</span>
            </div>
            <div className="mt-3 space-y-4">
              <Lane on={on(0)} name="물건" what="주석·직물 · 대상과 배">
                <Arrow dir="right" color={color(0)} />
              </Lane>
              <Lane on={on(1)} name="대금" what="은·금 · 돌아오거나 다른 거래로">
                <Arrow dir="left" color={color(1)} />
              </Lane>
              <Lane on={on(2)} name="정보" what="가격·분쟁·통행 · 편지와 소문">
                <Arrow dir="both" dashed color={color(2)} />
              </Lane>
              <Lane on={on(3)} name="위험" what="도난·질병·전쟁·환율 변화의 손실">
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  {["투자자", "운송인", "상인"].map((who) => (
                    <span key={who} className="rounded-md border px-1 py-1.5" style={{ borderColor: color(3) }}>{who}</span>
                  ))}
                </div>
              </Lane>
            </div>
            <div className={`mt-4 rounded-lg border border-border px-3 py-2 text-xs leading-5 ${all ? "visible" : "invisible"}`}>
              <span className="font-bold">그래서 필요해지는 것: </span>
              먼저 넘기고 나중에 갚는 신용 · 다른 도시에서 대신 행동하는 대리인 · 무게와 순도를 비교하는 표준
            </div>
          </div>
        );
      }}
    />
  );
}
