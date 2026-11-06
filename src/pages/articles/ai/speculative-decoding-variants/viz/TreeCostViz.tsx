import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #tree-cost — 폭 3·2·2 → 3+6+12=21, root 포함 22. 한 줄 깊이 3 → 입력 4.
 * 조건부 포함률 .89·.85·.8 → .89, .7565, .6052, 평균 3.2517. 한 줄 iid .7 → .7, .49, .343, 평균 2.533.
 * 회차 비용 4.2, 1.7(가정) → .7742, 1.49.
 */
const SCENES = [
  { label: "입력 칸을 셉니다", summary: "22칸 vs 4칸", note: "폭 3·2·2의 후보는 3+6+12=21개, root를 더하면 입력 22개입니다. 깊이 3의 한 줄은 입력 4개입니다." },
  { label: "넓은 갈래의 평균 길이", summary: "1 + .89 + .7565 + .6052 = 3.2517", note: "앞 경로가 맞았다는 조건 아래의 포함률 .89, .85, .8을 차례로 곱합니다. 깊이 사이의 독립은 가정하지 않습니다." },
  { label: "한 줄의 평균 길이", summary: "1 + .7 + .49 + .343 = 2.533", note: "자리마다 같은 수락률 .7을 독립으로(iid) 가정한 평균입니다. 앞 장면과 조건이 다릅니다." },
  { label: "시간까지 넣으면 뒤집힙니다", summary: "갈래 .7742배 · 한 줄 1.49배", note: "회차 비용을 4.2와 1.7로 가정하면 3.2517/4.2=.7742, 2.533/1.7=1.49입니다. 더 많이 확정한 갈래가 오히려 느립니다." },
] as const;

const TREE_ROWS = [
  { label: "root", count: 1 },
  { label: "깊이 1", count: 3 },
  { label: "깊이 2", count: 6 },
  { label: "깊이 3", count: 12 },
] as const;
const TREE_REACH = [
  { label: "기본 출력", formula: "1", value: 1 },
  { label: "첫 자리까지", formula: ".89", value: 0.89 },
  { label: "둘째까지", formula: ".89 × .85", value: 0.7565 },
  { label: "셋째까지", formula: ".7565 × .8", value: 0.6052 },
] as const;
const CHAIN_REACH = [
  { label: "기본 출력", formula: "1", value: 1 },
  { label: "첫 자리까지", formula: ".7", value: 0.7 },
  { label: "둘째까지", formula: ".7 × .7", value: 0.49 },
  { label: "셋째까지", formula: ".49 × .7", value: 0.343 },
] as const;
const TIME_ROWS = [
  { label: "갈래 · 평균 확정", value: 3.2517, color: "#2563eb" },
  { label: "갈래 · 회차 시간", value: 4.2, color: "#d97706" },
  { label: "한 줄 · 평균 확정", value: 2.533, color: "#2563eb" },
  { label: "한 줄 · 회차 시간", value: 1.7, color: "#d97706" },
] as const;
const MAX_TIME = 4.2;

function Reach({ rows, color }: { rows: readonly { label: string; formula: string; value: number }[]; color: string }) {
  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div key={row.label} className="grid grid-cols-[5rem_minmax(0,1fr)_3.25rem] items-center gap-2 text-xs sm:text-sm">
          <span className="text-muted-foreground">{row.label}</span>
          <div className="relative h-6 min-w-0 rounded-sm bg-muted/40">
            <div className="h-full rounded-sm" style={{ width: `${row.value * 100}%`, backgroundColor: color, opacity: 0.3 }} />
            <span className="absolute inset-y-0 left-2 flex items-center whitespace-nowrap font-mono text-xs">{row.formula}</span>
          </div>
          <span className="text-right font-mono font-bold">{String(row.value).replace(/^0/, "")}</span>
        </div>
      ))}
    </div>
  );
}

export default function TreeCostViz() {
  return (
    <SceneShell
      eyebrow="넓이의 대가"
      title="입력을 다섯 배 넘게 늘려 평균 길이를 얼마나 얻는지 칸으로 봅니다"
      description="확률과 회차 비용은 측정값이 아닌 가정이며 한 글자 시간을 1로 둡니다. root는 이번 회차의 시작 토큰입니다."
      ariaLabel="후보 폭에 따른 입력 칸 수, 평균 확정 길이, 시간 개선 비"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={[
            <div key="count" className="space-y-2">
              <p className="text-xs font-bold text-foreground">폭 3·2·2 갈래 · 입력 22칸</p>
              {TREE_ROWS.map((row) => (
                <div key={row.label} className="grid grid-cols-[3.5rem_minmax(0,1fr)_2rem] items-center gap-2 text-xs">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="flex flex-wrap gap-[3px]">
                    {Array.from({ length: row.count }, (_, cell) => (
                      <span key={cell} className="size-3 rounded-[2px] border border-[#2563eb] bg-[#2563eb]/25" />
                    ))}
                  </span>
                  <span className="text-right font-mono font-bold">{row.count}</span>
                </div>
              ))}
              <p className="text-xs font-bold text-foreground">깊이 3 한 줄 · 입력 4칸</p>
              <div className="grid grid-cols-[3.5rem_minmax(0,1fr)_2rem] items-center gap-2 text-xs">
                <span className="text-muted-foreground">전체</span>
                <span className="flex gap-[3px]">
                  {[0, 1, 2, 3].map((cell) => (
                    <span key={cell} className="size-3 rounded-[2px] border border-[#64748b] bg-[#64748b]/25" />
                  ))}
                </span>
                <span className="text-right font-mono font-bold">4</span>
              </div>
            </div>,
            <Reach key="tree" rows={TREE_REACH} color="#2563eb" />,
            <Reach key="chain" rows={CHAIN_REACH} color="#64748b" />,
            <div key="time" className="space-y-2">
              {TIME_ROWS.map((row) => (
                <div key={row.label} className="grid grid-cols-[6.5rem_minmax(0,1fr)_3rem] items-center gap-2 text-xs sm:text-sm">
                  <span className="text-muted-foreground">{row.label}</span>
                  <div className="h-5 min-w-0 rounded-sm bg-muted/40">
                    <div className="h-full rounded-sm" style={{ width: `${(row.value / MAX_TIME) * 100}%`, backgroundColor: row.color }} />
                  </div>
                  <span className="text-right font-mono font-bold">{row.value}</span>
                </div>
              ))}
            </div>,
          ]}
        />
      )}
    />
  );
}
