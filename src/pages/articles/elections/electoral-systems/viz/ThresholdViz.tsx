import SceneShell from "./SceneShell";
import { MUTED_COLOR, PARTY_COLORS, WARN_COLOR } from "./parties";

/**
 * 본문 대응: #district-magnitude — 봉쇄조항이 표를 옮기지 않고 분모만 줄인다.
 * 1000표 440·410·130·20과 문턱 3%는 설명용(가정). 남은 표 980 → 44.9·41.8·13.3%.
 */
const PARTIES: readonly { name: string; votes: number; color: string }[] = [
  { name: "가당", votes: 440, color: PARTY_COLORS[0] },
  { name: "나당", votes: 410, color: PARTY_COLORS[1] },
  { name: "다당", votes: 130, color: PARTY_COLORS[2] },
  { name: "라당", votes: 20, color: MUTED_COLOR },
];
const TOTAL = PARTIES.reduce<number>((sum, p) => sum + p.votes, 0);
const REMAINING = TOTAL - 20;

const SCENES = [
  {
    label: "모든 표를 놓고 보면",
    summary: `전체 ${TOTAL}표`,
    note: "봉쇄조항은 의석 배분에 참여하려면 넘어야 하는 최소 득표율이나 최소 지역구 의석 수입니다. 이 예는 득표율 3퍼센트 문턱을 씁니다(가정).",
  },
  {
    label: "문턱에서 먼저 가린다",
    summary: "라당 2% < 3%",
    note: "의석을 계산하기 전에 문턱을 넘지 못한 정당을 배분 대상에서 뺍니다. 라당의 20표는 의석 계산에 쓰이지 않습니다.",
  },
  {
    label: "표는 옮겨 가지 않는다",
    summary: `분모 ${TOTAL} → ${REMAINING}`,
    note: "가당·나당·다당의 표는 한 표도 늘지 않았습니다. 라당의 20표를 빼고 남은 정당끼리 나누므로 분모가 줄어 상대 몫만 커집니다.",
  },
] as const;

function Stack({ title, included }: { title: string; included: boolean }) {
  const parts = included ? PARTIES : PARTIES.slice(0, 3);
  const total = included ? TOTAL : REMAINING;
  return (
    <div>
      <p className="text-xs font-bold text-muted-foreground">{title}</p>
      <div className="mt-1 flex h-6 w-full overflow-hidden rounded-sm border border-border">
        {parts.map((p) => (
          <div key={p.name} style={{ width: `${(p.votes / total) * 100}%`, backgroundColor: `${p.color}66` }} />
        ))}
      </div>
    </div>
  );
}

export default function ThresholdViz() {
  return (
    <SceneShell
      eyebrow="봉쇄조항"
      title="문턱 아래 표는 옮겨 가지 않고 계산에서 빠집니다"
      description="막대 전체는 그 계산에 들어간 표입니다. 득표와 문턱은 설명을 위한 예입니다(가정)."
      ariaLabel="봉쇄조항이 적용되기 전과 후의 상대 몫 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-3">
          <Stack title={`전체 ${TOTAL}표 기준`} included />
          <div className={active === 2 ? "" : "invisible"} aria-hidden={active !== 2}>
            <Stack title={`남은 ${REMAINING}표 기준`} included={false} />
          </div>
          <div className="grid grid-cols-[3rem_4rem_3.5rem_minmax(0,1fr)] items-center gap-x-2 gap-y-1 text-xs sm:text-sm">
            <span className="font-bold text-muted-foreground">정당</span>
            <span className="text-right font-bold text-muted-foreground">표</span>
            <span className="text-right font-bold text-muted-foreground">득표율</span>
            <span className="text-right font-bold text-muted-foreground">{active === 0 ? "" : active === 1 ? "3% 문턱" : "남은 표 안의 몫"}</span>
            {PARTIES.map((p) => {
              const out = p.name === "라당";
              const share = (p.votes / TOTAL) * 100;
              return [
                <span key={`${p.name}-n`} className="font-bold" style={{ color: p.color }}>{p.name}</span>,
                <span key={`${p.name}-v`} className={`text-right font-mono ${out && active >= 1 ? "line-through" : ""}`}>{p.votes}</span>,
                <span key={`${p.name}-s`} className="text-right font-mono">{share.toFixed(0)}%</span>,
                <span key={`${p.name}-r`} className="text-right font-mono font-bold" style={out && active >= 1 ? { color: WARN_COLOR } : undefined}>
                  {active === 0 ? "" : active === 1 ? (out ? "미달 · 제외" : "통과") : out ? "계산에서 빠짐" : `${((p.votes / REMAINING) * 100).toFixed(1)}%`}
                </span>,
              ];
            })}
          </div>
        </div>
      )}
    />
  );
}
