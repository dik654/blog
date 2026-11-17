import SceneShell from "./SceneShell";

/**
 * 본문 대응: #ice — P_pair = 2^32·min(G,D) + 2·max(G,D) + [G>D].
 * Pair X: G=100, D=80 → 343,597,383,680 + 200 + 1 = 343,597,383,881 (본문 숫자).
 * Pair X′: G=80, D=100 → 343,597,383,880 (본문: 정확히 1 작음).
 * Pair Y (가정): G=90, D=90 → 386,547,056,640 + 180 + 0 = 386,547,056,820.
 * 2^32 = 4,294,967,296.
 */
const POW32 = 4294967296;

interface Pair {
  name: string;
  g: number;
  d: number;
  assumed: boolean;
}

const PAIRS: readonly Pair[] = [
  { name: "Pair X", g: 100, d: 80, assumed: false },
  { name: "Pair X′", g: 80, d: 100, assumed: false },
  { name: "Pair Y", g: 90, d: 90, assumed: true },
];

const value = (pair: Pair) => POW32 * Math.min(pair.g, pair.d) + 2 * Math.max(pair.g, pair.d) + (pair.g > pair.d ? 1 : 0);
const fmt = (n: number) => n.toLocaleString("en-US");

const SCENES = [
  {
    label: "세 자리로 나눠 담습니다",
    summary: "min · max · role 순",
    shown: 1,
    note: "G=100, D=80이면 낮은 쪽 80이 맨 앞 자리(2³²배)에, 높은 쪽 100이 둘째 자리(2배)에, G>D라서 마지막 bit에 1이 들어갑니다. 합은 343,597,383,881입니다.",
  },
  {
    label: "역할만 뒤집으면 1 차이",
    summary: "…881 → …880",
    shown: 2,
    note: "G=80, D=100으로 뒤집어도 min과 max는 그대로라 앞의 두 자리가 같습니다. 마지막 role bit만 0이 되어 정확히 1 작습니다.",
  },
  {
    label: "약한 쪽이 더 센 pair가 먼저",
    summary: "min 90 > min 80",
    shown: 3,
    note: "Pair Y(G=90, D=90, 가정)는 높은 쪽 90이 100보다 작지만 낮은 쪽 90이 80보다 커서 맨 앞 자리에서 이미 앞섭니다. 이 순서는 검사 순서일 뿐이며, 실제로 쓸지는 STUN check와 nomination이 정합니다.",
  },
] as const;

function Slot({ label, digit, wide, strong }: { label: string; digit: string; wide: boolean; strong: boolean }) {
  return (
    <div className={`flex min-w-0 items-baseline justify-center gap-1.5 rounded-md border px-1.5 py-1 ${wide ? "flex-[3]" : "flex-[2]"} ${strong ? "border-[#2563eb] bg-[#2563eb]/10" : "border-border bg-background"}`}>
      <span className="truncate text-[11px] text-muted-foreground">{label}</span>
      <span className={`font-mono text-sm font-bold ${strong ? "text-[#2563eb] dark:text-[#93c5fd]" : ""}`}>{digit}</span>
    </div>
  );
}

export default function PairPriorityOrderViz() {
  return (
    <SceneShell
      eyebrow="Pair priority"
      title="자리가 큰 칸부터 비교해 검사 순서를 정합니다"
      description="한 줄이 candidate pair 하나입니다. G는 controlling agent 쪽, D는 controlled agent 쪽 candidate priority이고 값은 위 계산 상자의 설명용 축소 숫자 G=100, D=80이며, Pair Y의 90·90도 비교를 위한 가정입니다."
      ariaLabel="pair priority를 min, max, role bit 세 자리로 나눠 비교하는 그림"
      scenes={SCENES}
      render={(active) => {
        const shown = SCENES[active].shown;
        const visible = PAIRS.slice(0, shown);
        const ranked = [...visible].sort((a, b) => value(b) - value(a));
        return (
          <div className="min-w-0 space-y-2">
            <div className="flex gap-2 px-1 text-[11px] font-semibold text-muted-foreground">
              <span className="flex-[3]">① 2³² × min</span>
              <span className="flex-[2]">② 2 × max</span>
              <span className="flex-[2]">③ role bit</span>
            </div>
            {PAIRS.map((pair, index) => {
              const on = index < shown;
              const rank = ranked.indexOf(pair) + 1;
              const decided = active === 2 ? 0 : active === 1 ? 2 : -1;
              return (
                <div key={pair.name} className={`rounded-lg border border-border/70 px-2.5 py-2 transition-opacity motion-reduce:transition-none ${on ? "opacity-100" : "opacity-25"}`}>
                  <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-2 text-xs">
                    <span className="font-bold">
                      {on && active === 2 ? `${rank}번째 · ` : ""}
                      {pair.name}
                      {pair.assumed ? " (가정)" : ""}
                    </span>
                    <span className="font-mono text-muted-foreground">G={pair.g} · D={pair.d}</span>
                  </div>
                  <div className="flex gap-2">
                    <Slot label="min" digit={String(Math.min(pair.g, pair.d))} wide strong={on && decided === 0} />
                    <Slot label="max" digit={String(Math.max(pair.g, pair.d))} wide={false} strong={false} />
                    <Slot label={pair.g > pair.d ? "G>D" : "G≤D"} digit={pair.g > pair.d ? "1" : "0"} wide={false} strong={on && decided === 2} />
                  </div>
                  <p className="mt-1.5 text-right font-mono text-xs font-bold sm:text-sm">= {fmt(value(pair))}</p>
                </div>
              );
            })}
          </div>
        );
      }}
    />
  );
}
