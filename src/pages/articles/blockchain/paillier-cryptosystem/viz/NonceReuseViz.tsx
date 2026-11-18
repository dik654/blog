import SceneShell from "./SceneShell";

/**
 * 본문 대응: #randomness — 같은 난수 r=2를 4와 3에 다시 쓴다(n=15, n²=225, g=16).
 * 173 = 61 × 143 (16⁴ mod 225 = 61, 2¹⁵ mod 225 = 143), 53 = 46 × 143 (16³ mod 225 = 46).
 * 173 × 53⁻¹ mod 225 = 16 (16 × 53 = 848 ≡ 173). 16 = 1 + 15 × (4 − 3) → L(16) = 1.
 */
const ROWS = [
  { name: "4를 r=2로", msg: "61", msgNote: "16⁴ mod 225", rnd: "143", out: "173" },
  { name: "3을 r=2로", msg: "46", msgNote: "16³ mod 225", rnd: "143", out: "53" },
] as const;

const SCENES = [
  { label: "두 암호문의 성분", summary: "173 = 61×143 · 53 = 46×143", note: "암호문은 메시지 성분과 난수 성분의 곱입니다. 4와 3에 같은 난수 2를 쓰면 두 암호문 모두 같은 난수 성분 143을 갖습니다(225로 나눈 나머지 기준)." },
  { label: "나누면 143이 지워짐", summary: "173 × 53⁻¹ mod 225 = 16", note: "53의 mod 225 역원을 곱하는 것이 이 계산의 나눗셈입니다. 위아래의 같은 143이 서로 지워지고 메시지 성분끼리의 비율 16만 남습니다. 비밀키는 쓰지 않았습니다." },
  { label: "16에서 차이를 읽음", summary: "16 = 1 + 15×1 → L(16) = 1", note: "g=n+1이므로 남은 비율은 1+15×(4−3)입니다. 누구나 1을 빼고 15로 나눠 두 평문의 차이 1 mod 15를 얻습니다. 하나를 알면 다른 하나의 나머지도 알 수 있습니다." },
] as const;

export default function NonceReuseViz() {
  return (
    <SceneShell
      eyebrow="난수 재사용"
      title="같은 난수 성분은 나눗셈에서 지워지고 평문의 차이가 남습니다"
      description="칸 하나가 225로 나눈 나머지에서 곱하는 한 성분입니다. 61과 143은 8절에서 계산한 값이고, 이번에는 3에도 같은 난수 2를 썼다고 가정합니다."
      ariaLabel="같은 난수로 만든 두 암호문 173과 53을 나누어 평문 차이를 읽는 세 장면"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-3">
          {ROWS.map((row) => (
            <div key={row.name} className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_2.5rem] items-center gap-1.5 text-sm sm:grid-cols-[5rem_minmax(0,1fr)_auto_minmax(0,1fr)_auto_3rem]">
              <span className="col-span-5 text-xs text-muted-foreground sm:col-span-1">{row.name}</span>
              <span className="rounded-md border border-blue-600 px-1.5 py-1.5 text-center">
                <span className="block font-mono font-bold text-blue-700 dark:text-blue-400">{row.msg}</span>
                <span className="block text-[11px] leading-4 text-muted-foreground">{row.msgNote}</span>
              </span>
              <span className="text-muted-foreground">×</span>
              <span className={`relative rounded-md border px-1.5 py-1.5 text-center ${active >= 1 ? "border-dashed border-slate-400" : "border-slate-600"}`}>
                <span className={`block font-mono font-bold ${active >= 1 ? "text-muted-foreground/60 line-through" : ""}`}>{row.rnd}</span>
                <span className="block text-[11px] leading-4 text-muted-foreground">2¹⁵ mod 225</span>
              </span>
              <span className="text-muted-foreground">=</span>
              <span className="text-right font-mono font-bold">{row.out}</span>
            </div>
          ))}
          <div className="border-t border-border pt-3">
            <div className="grid gap-2 text-sm sm:grid-cols-2 sm:gap-3">
              <div className={`rounded-md border px-2 py-2 ${active >= 1 ? "border-amber-600" : "border-border/60"}`}>
                <span className="block text-xs text-muted-foreground">173 ÷ 53 (mod 225)</span>
                <span className={`block font-mono font-bold ${active >= 1 ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground/50"}`}>
                  {active >= 1 ? "= 61 ÷ 46 = 16" : "?"}
                </span>
              </div>
              <div className={`rounded-md border px-2 py-2 ${active >= 2 ? "border-amber-600" : "border-border/60"}`}>
                <span className="block text-xs text-muted-foreground">L(16) = (16 − 1) / 15</span>
                <span className={`block font-mono font-bold ${active >= 2 ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground/50"}`}>
                  {active >= 2 ? "= 1 = 4 − 3" : "?"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    />
  );
}
