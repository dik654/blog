import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #compounding — 연 5%, 100만 원, 3년. 단리 115만 원과 복리 115만 7,625원의 차이 7,625원이
 * 어느 돈에서 나오는지. 1년차 5만, 2년차 5만+2,500, 3년차 5만+2,500+2,500+125 → 합계 15만+7,625.
 * 마지막 장면은 같은 연 5%를 12로 나눠 매달 붙이면 1,051,162원, 곧 연 5.116%.
 */
interface Seed {
  from: string;
  gain: string;
  extra: boolean;
}

const ROWS: readonly { year: string; seeds: readonly Seed[] }[] = [
  { year: "1년차", seeds: [{ from: "원금 100만", gain: "+5만", extra: false }] },
  {
    year: "2년차",
    seeds: [
      { from: "원금 100만", gain: "+5만", extra: false },
      { from: "1년차 이자 5만", gain: "+2,500", extra: true },
    ],
  },
  {
    year: "3년차",
    seeds: [
      { from: "원금 100만", gain: "+5만", extra: false },
      { from: "1년차 이자 5만", gain: "+2,500", extra: true },
      { from: "2년차 이자 중 5만", gain: "+2,500", extra: true },
      { from: "2년차 이자 중 2,500", gain: "+125", extra: true },
    ],
  },
];

/** 장면별 누적 이자(원). 단리는 원금 몫만, 복리는 이자의 이자까지 더한다. */
const TOTALS = [
  { simple: 50000, compound: 50000 },
  { simple: 100000, compound: 102500 },
  { simple: 150000, compound: 157625 },
] as const;
const MAX = 157625;

const SCENES = [
  { label: "1년차", summary: "단리와 복리가 같음", note: "첫해에는 이자를 낳을 돈이 원금뿐입니다. 어느 방식이든 5만 원이 붙습니다." },
  { label: "2년차", summary: "복리에 2,500원이 더 붙음", note: "복리에서는 1년차 이자 5만 원도 5%인 2,500원을 낳습니다. 단리는 원금 몫 5만 원만 또 붙습니다." },
  { label: "3년차", summary: "차이 2,500 + 5,125 = 7,625원", note: "이자를 낳는 돈이 네 덩어리입니다. 이자가 낳은 2,500원마저 125원을 낳아 차이가 해마다 커집니다." },
  { label: "1년에 12번 붙이면", summary: "연 5.116%와 같음", note: "이 장면만 100만 원을 1년 맡깁니다. 연 5%를 12로 나눠 매달 곱했습니다(가정). 1,162원이 더 붙으므로 금리를 비교할 때는 주기를 함께 봐야 합니다." },
] as const;

function Amount({ label, value, color, strong = false }: { label: string; value: number; color: string; strong?: boolean }) {
  return (
    <div className="grid grid-cols-[2.5rem_minmax(0,1fr)_5.25rem] items-center gap-2 text-xs sm:text-sm">
      <span className={strong ? "font-bold" : "text-muted-foreground"}>{label}</span>
      <div className="h-3 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${(value / MAX) * 100}%`, backgroundColor: color }} />
      </div>
      <span className={`text-right font-mono ${strong ? "font-bold" : ""}`}>{value.toLocaleString("en-US")}</span>
    </div>
  );
}

function YearView({ active }: { active: number }) {
  const shown = TOTALS[Math.min(active, 2)];
  return (
    <div className="min-w-0">
      <div className="space-y-1.5">
        {ROWS.map((row, index) => (
          <div key={row.year} className={`grid grid-cols-[2.75rem_minmax(0,1fr)] items-start gap-2 ${index <= active ? "" : "opacity-0"}`}>
            <span className="pt-1 text-xs font-bold">{row.year}</span>
            <div className="grid min-w-0 grid-cols-2 gap-1.5 sm:grid-cols-4">
              {row.seeds.map((seed) => (
                <div key={seed.from} className={`min-w-0 rounded-md border px-2 py-1 text-[11px] leading-4 ${seed.extra ? "border-amber-600 bg-amber-500/10" : "border-border bg-background"}`}>
                  <span className="block text-muted-foreground">{seed.from}</span>
                  <span className="block font-mono font-bold">{seed.gain}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">지금까지 붙은 이자(원)</p>
      <div className="mt-1 space-y-1.5">
        <Amount label="단리" value={shown.simple} color="#94a3b8" />
        <Amount label="복리" value={shown.compound} color="#d97706" strong />
      </div>
    </div>
  );
}

function MonthlyView() {
  return (
    <div className="min-w-0 space-y-4">
      <div>
        <p className="text-xs font-bold">1년에 한 번 붙이면</p>
        <div className="mt-1.5 grid h-7 grid-cols-1 rounded-sm border border-border bg-background text-center text-[11px] leading-[1.625rem]">×1.05</div>
        <p className="mt-1 text-right font-mono text-sm">1,050,000원</p>
      </div>
      <div>
        <p className="text-xs font-bold">매달 붙이면</p>
        <div className="mt-1.5 grid h-7 grid-cols-12 overflow-hidden rounded-sm border border-border bg-background">
          {Array.from({ length: 12 }, (_, month) => (
            <div key={month} className={month > 0 ? "border-l border-border" : ""} />
          ))}
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">칸 하나마다 ×(1 + 0.05/12)를 곱해 12번</p>
        <p className="mt-1 text-right font-mono text-sm font-bold">1,051,162원</p>
      </div>
    </div>
  );
}

export default function CompoundSeedsViz() {
  return (
    <SceneShell
      eyebrow="이자가 이자를 낳는 자리"
      title="7,625원은 어느 돈에서 나왔을까요"
      description="단리는 원금에만, 복리는 붙은 이자에도 이자를 매깁니다. 연 5%로 100만 원을 3년 맡길 때입니다. 노란 칸이 복리에서만 생기는 돈입니다."
      ariaLabel="단리와 복리의 해마다 이자 분해"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack active={active === 3 ? 1 : 0} scenes={[<YearView key="y" active={active} />, <MonthlyView key="m" />]} />
      )}
    />
  );
}
