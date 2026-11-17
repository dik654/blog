import SceneShell from "./SceneShell";

/**
 * 본문 대응: #data-reduction — ExplainedFormula interpretation의 예시 숫자.
 * Tool loop: round 하나에 670 token, 세 round면 670 × 3 = 2,010.
 * Code Mode: discovery 100 + program 200 + final result 100 = 400.
 * 670을 P·S·R·D로 어떻게 나누는지는 본문에 없으므로 round 하나를 한 덩어리로만 그립니다.
 */
const ROUND = 670;
const CODE_PARTS = [
  { name: "discovery", value: 100, color: "#0891b2" },
  { name: "program 생성", value: 200, color: "#2563eb" },
  { name: "final result", value: 100, color: "#16a34a" },
] as const;
const CODE_TOTAL = CODE_PARTS.reduce<number>((sum, part) => sum + part.value, 0);
const SCALE = 2100;
const fmt = (value: number) => value.toLocaleString("en-US");

const SCENES = [
  {
    label: "Code Mode 장부",
    summary: `100 + 200 + 100 = ${fmt(CODE_TOTAL)}`,
    rounds: 0,
    note: "Code Mode에서 model 경계를 건너는 것은 후보 tool을 찾는 discovery, program 생성, 그리고 local에서 줄인 final result뿐입니다. 중간 rows는 runtime 안에 남아 이 장부에 들어오지 않습니다.",
  },
  {
    label: "Tool loop 1 round",
    summary: `${fmt(ROUND)} vs ${fmt(CODE_TOTAL)}`,
    rounds: 1,
    note: "Round 하나는 tool 전후로 model이 다시 추론하는 한 번입니다. 그때마다 prompt·schema·tool result·다음 판단이 다시 실립니다. 본문 예시에서는 이 한 번이 670 token입니다.",
  },
  {
    label: "Tool loop 2 rounds",
    summary: `670 × 2 = ${fmt(ROUND * 2)}`,
    rounds: 2,
    note: "다음 round도 같은 항목을 다시 실으므로 비용이 앞 round 위에 쌓입니다. Code Mode 쪽 400은 round 수와 관계없이 그대로입니다.",
  },
  {
    label: "Tool loop 3 rounds",
    summary: `${fmt(ROUND * 3)} vs ${fmt(CODE_TOTAL)} · 차이 ${fmt(ROUND * 3 - CODE_TOTAL)}`,
    rounds: 3,
    note: "세 round면 2,010 token으로, Code Mode 400보다 1,610 큽니다. 같은 task와 final quality를 만족한다는 가정의 token 이동 비교이며, latency·tool 요금·cache 같은 장부는 따로 측정해야 합니다.",
  },
] as const;

function Segment({ width, color, label }: { width: number; color: string; label?: string }) {
  return (
    <div
      className="flex h-full shrink-0 items-center justify-center overflow-hidden border-r border-white text-[10px] font-semibold text-white last:border-r-0 sm:text-[11px] dark:border-neutral-900"
      style={{ width: `${(width / SCALE) * 100}%`, backgroundColor: color }}
    >
      {label}
    </div>
  );
}

export default function TokenLedgerViz() {
  return (
    <SceneShell
      eyebrow="Token 장부"
      title="Round마다 쌓이는 loop 비용과 한 번 내는 Code Mode 비용"
      description="막대 길이는 model context를 오가는 token 수입니다. 본문 공식 아래 예시(round당 670, discovery 100·program 200·result 100)를 그대로 씁니다."
      ariaLabel="Tool loop가 round마다 670 token씩 쌓여 2,010이 되는 동안 Code Mode는 400에 머무는 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const loopTotal = ROUND * scene.rounds;
        return (
          <div className="min-w-0 space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between text-xs sm:text-sm">
                <span className="font-semibold">Tool loop</span>
                <span className="font-mono font-bold">{fmt(loopTotal)} token</span>
              </div>
              <div className="flex h-8 w-full min-w-0 overflow-hidden rounded-sm bg-muted/40">
                {Array.from({ length: scene.rounds }, (_, index) => (
                  <Segment key={index} width={ROUND} color="#e11d48" label={`round ${index + 1}`} />
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground sm:text-xs">
                {scene.rounds === 0 ? "아직 round 없음" : `칸 하나 = round 하나 = ${fmt(ROUND)} token`}
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between text-xs sm:text-sm">
                <span className="font-semibold">Code Mode</span>
                <span className="font-mono font-bold">{fmt(CODE_TOTAL)} token</span>
              </div>
              <div className="flex h-8 w-full min-w-0 overflow-hidden rounded-sm bg-muted/40">
                {CODE_PARTS.map((part) => (
                  <Segment key={part.name} width={part.value} color={part.color} />
                ))}
              </div>
              <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground sm:text-xs">
                {CODE_PARTS.map((part) => (
                  <li key={part.name} className="flex items-center gap-1.5">
                    <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: part.color }} />
                    {part.name} {fmt(part.value)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      }}
    />
  );
}
