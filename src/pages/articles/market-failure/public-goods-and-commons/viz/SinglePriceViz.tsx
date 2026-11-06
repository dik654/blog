import SceneShell from "./SceneShell";

/**
 * 본문 대응: #excluding — 가로등 두 개의 총가치 11, 7, 4(합 22)와 드는 값 18.
 * 한 값 4 → 12, 7 → 14, 11 → 11로 18을 못 채우고, 사람마다 받으면 22. 드는 값 14·요금 7이면 다가 빠진다.
 */
const AXIS_MAX = 24;
const WHO = [
  { name: "가", value: 11 },
  { name: "나", value: 7 },
  { name: "다", value: 4 },
] as const;
const WHOLE = 22;
const SEGMENT = ["#2563eb", "#60a5fa", "#93c5fd"] as const;
const SEGMENT_TEXT = ["#ffffff", "#0f172a", "#0f172a"] as const;
const pct = (value: number) => `${(value / AXIS_MAX) * 100}%`;

type Scene = {
  label: string;
  summary: string;
  price: number | null;
  goal: number;
  pays: readonly number[];
  verdict: string;
  note: string;
};

const SCENES: readonly Scene[] = [
  { label: "요금 4", summary: "4 × 3명 = 12 < 18", price: 4, goal: 18, pays: [4, 4, 4], verdict: "셋이 다 내도 18을 못 채웁니다", note: "값이 낮아 셋이 다 내지만 한 명당 받는 것이 적어 12뿐입니다." },
  { label: "요금 7", summary: "7 × 2명 = 14 < 18", price: 7, goal: 18, pays: [7, 7, 0], verdict: "다가 빠지고 18을 못 채웁니다", note: "값을 올리니 4로 치는 다가 빠집니다. 한 명당 더 받아도 둘이 내어 14입니다." },
  { label: "요금 11", summary: "11 × 1명 = 11 < 18", price: 11, goal: 18, pays: [11, 0, 0], verdict: "한 명만 남아 18을 못 채웁니다", note: "더 올리면 가만 남아 11입니다. 합치면 22가 있는데도 어느 한 값으로도 18에 닿지 않습니다." },
  { label: "사람마다 다르게", summary: "11 + 7 + 4 = 22 ≥ 18", price: null, goal: 18, pays: [11, 7, 4], verdict: "채워지지만 각자의 값을 알아야 합니다", note: "가에게 11, 나에게 7, 다에게 4를 받으면 22가 걷힙니다. 그런데 그 숫자를 알려면 물어봐야 하고, 물어보면 앞 절의 문제가 돌아옵니다." },
  { label: "드는 값 14 · 요금 7", summary: "7 × 2명 = 14 = 14", price: 7, goal: 14, pays: [7, 7, 0], verdict: "세워지지만 다가 빠집니다 · 다를 들이는 데 드는 값 0", note: "드는 값이 14라고 해 보겠습니다. 요금 7로 겨우 채워져 세워지는데 다는 빠집니다. 이미 켜진 불이니 다를 들이는 데 드는 값은 0인데 요금이 내보냅니다." },
];

export default function SinglePriceViz() {
  return (
    <SceneShell
      eyebrow="한 값의 한계"
      title="값을 올리면 내는 사람이 줄고 내리면 한 명당 받는 것이 줍니다"
      description="가로등 두 개를 통째로 치는 값(총가치)이 가 11, 나 7, 다 4입니다. 네모 칸이 총가치, 채운 부분이 실제로 낸 돈이고 아래 막대가 걷힌 합입니다. 모두 같은 눈금입니다."
      note="요금보다 낮게 치는 사람은 내지 않고 빠진다고 둔 본문의 계산입니다."
      ariaLabel="요금에 따라 내는 사람과 걷힌 합이 드는 값에 닿는지 비교"
      scenes={SCENES}
      render={(scene) => {
        const item = SCENES[scene];
        const collected = item.pays.reduce((total, value) => total + value, 0);
        return (
          <div key={scene} className="min-w-0 space-y-2">
            <div className="grid grid-cols-[2rem_minmax(0,1fr)_3.25rem] items-center gap-x-2 gap-y-1.5 text-xs sm:text-sm">
              <span />
              <div className="relative h-5 font-bold text-primary">
                {item.price !== null && (
                  <span className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: pct(item.price) }}>요금 {item.price}</span>
                )}
              </div>
              <span className="text-right text-muted-foreground">낸 돈</span>
              {WHO.map((person, index) => {
                const paid = item.pays[index];
                return (
                  <div key={person.name} className="contents">
                    <span className="font-bold">{person.name}</span>
                    <div className="relative h-6 min-w-0">
                      <div className="absolute inset-y-0 left-0 rounded-sm border border-border bg-background" style={{ width: pct(person.value) }} />
                      <div className="absolute inset-y-0 left-0 flex items-center justify-center rounded-sm font-mono text-xs font-bold" style={{ width: pct(paid), backgroundColor: SEGMENT[index], color: SEGMENT_TEXT[index] }}>
                        {paid > 0 ? paid : ""}
                      </div>
                      {item.price !== null && <div className="absolute -inset-y-1 w-px" style={{ left: pct(item.price), backgroundColor: "#2563eb" }} />}
                    </div>
                    <span className={`text-right font-mono font-bold ${paid === 0 ? "text-red-700 dark:text-red-400" : ""}`}>{paid === 0 ? "빠짐" : paid}</span>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-[2rem_minmax(0,1fr)_3.25rem] items-center gap-x-2 pt-2 text-xs sm:text-sm">
              <span />
              <div className="relative h-5 font-bold text-red-700 dark:text-red-400">
                <span className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: pct(item.goal) }}>드는 값 {item.goal}</span>
              </div>
              <span />
              <span className="font-bold">합</span>
              <div className="relative h-7 min-w-0 rounded-sm bg-muted/40">
                <div className="flex h-full">
                  {item.pays.map((paid, index) => (
                    <span
                      key={WHO[index].name}
                      className="flex h-full items-center justify-center border-r border-background font-mono text-xs font-bold"
                      style={{ width: pct(paid), backgroundColor: SEGMENT[index], color: SEGMENT_TEXT[index] }}
                    >
                      {paid > 0 ? paid : ""}
                    </span>
                  ))}
                </div>
                <div className="absolute -inset-y-1 w-px" style={{ left: pct(item.goal), backgroundColor: "#dc2626" }} />
                <div className="absolute -inset-y-1 w-px" style={{ left: pct(WHOLE), backgroundColor: "#64748b" }} />
              </div>
              <span className="text-right font-mono text-sm font-bold">{collected}</span>
              <span />
              <div className="relative h-5 text-muted-foreground">
                <span className="absolute -translate-x-1/2 whitespace-nowrap pt-1" style={{ left: pct(WHOLE) }}>합치면 {WHOLE}</span>
              </div>
              <span />
            </div>

            <p className={`rounded-lg border px-3 py-2 text-sm font-bold leading-6 ${collected >= item.goal ? "border-primary text-primary" : "border-dashed border-red-600 text-red-700 dark:text-red-400"}`}>
              {item.verdict}
            </p>
          </div>
        );
      }}
    />
  );
}
