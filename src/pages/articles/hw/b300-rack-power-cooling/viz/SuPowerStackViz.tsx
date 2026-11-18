import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case 둘째 문단 — NVIDIA guide의 64-node SU 전력표.
 * 평균/피크 kVA: B300 rack 16개 820/1228, network·management·storage rack 8개 104/105,
 * CDU 2대 24/70, RDHx 24대 27/47 → 합계 975/1450. 냉각 장치만 24+27=51, 70+47=117.
 */
const SCALE_MAX = 1500;

const PARTS = [
  { label: "B300 rack 16개", avg: 820, peak: 1228, color: "#2563eb", from: 0 },
  { label: "network·management·storage rack 8개", avg: 104, peak: 105, color: "#64748b", from: 1 },
  { label: "CDU 2대", avg: 24, peak: 70, color: "#0f766e", from: 2 },
  { label: "RDHx 24대", avg: 27, peak: 47, color: "#d97706", from: 2 },
] as const;

const SCENES = [
  {
    label: "서버 rack만 더하면",
    summary: "평균 820 · 피크 1228kVA",
    note: "64-node SU 표의 B300 rack 16개만 보면 평균 820kVA, 피크 1228kVA입니다. 3절의 232kW·304kW처럼 서버만 센 숫자와 같은 종류의 합입니다.",
  },
  {
    label: "network·management·storage rack을 더하면",
    summary: "평균 924 · 피크 1333kVA",
    note: "rack 8개가 평균 104kVA, 피크 105kVA를 더합니다. 820+104=924, 1228+105=1333입니다.",
  },
  {
    label: "냉각 장치까지 더하면",
    summary: "합계 975 · 1450kVA",
    note: "CDU 2대(24/70kVA)와 RDHx 24대(27/47kVA)를 더하면 냉각 장치만 평균 51kVA, 피크 117kVA입니다. 이만큼이 서버 합에 들어 있지 않으므로 cooling auxiliary 전력을 별도 행으로 잡습니다.",
  },
] as const;

function Stack({ kind, active }: { kind: "avg" | "peak"; active: number }) {
  const shown = PARTS.filter((part) => part.from <= active);
  const total = shown.reduce<number>((sum, part) => sum + part[kind], 0);
  const cooling = active >= 2 ? PARTS.slice(2).reduce<number>((sum, part) => sum + part[kind], 0) : null;
  return (
    <div className="grid grid-cols-[2.75rem_minmax(0,1fr)_4.5rem] items-center gap-2 text-xs sm:text-sm">
      <span className="font-semibold">{kind === "avg" ? "평균" : "피크"}</span>
      <div className="flex h-7 min-w-0 overflow-hidden rounded-sm bg-muted/40">
        {PARTS.map((part) => (
          <div
            key={part.label}
            className="h-full border-r border-background transition-[width] duration-300 motion-reduce:transition-none"
            style={{ width: part.from <= active ? `${(part[kind] / SCALE_MAX) * 100}%` : "0%", backgroundColor: part.color }}
          />
        ))}
      </div>
      <span className="text-right font-mono font-bold">
        {total.toLocaleString("en-US")}
        <span className="block text-[10px] font-normal text-muted-foreground">{cooling === null ? "kVA" : `냉각 ${cooling}`}</span>
      </span>
    </div>
  );
}

export default function SuPowerStackViz() {
  return (
    <SceneShell
      eyebrow="서버 합에서 빠진 몫"
      title="64-node SU 전력표에서 서버 밖의 부하를 하나씩 쌓습니다"
      description="막대 길이는 kVA이고 왼쪽부터 쌓입니다. 같은 NVIDIA guide의 64-node SU(서버 64대 묶음) 표이므로 이 글의 16대 사례와 규모가 다릅니다. 비율을 16대에 그대로 옮기지 않고, 어떤 행이 빠지는지만 봅니다."
      ariaLabel="64노드 SU에서 B300 rack, 네트워크 관리 스토리지 rack, CDU, RDHx 전력을 평균과 피크로 쌓은 막대"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-3">
          <Stack kind="avg" active={active} />
          <Stack kind="peak" active={active} />
          <ul className="grid gap-1.5 pt-1 text-xs sm:grid-cols-2">
            {PARTS.map((part) => {
              const shown = part.from <= active;
              return (
                <li key={part.label} className={`flex items-start gap-2 transition-opacity duration-300 motion-reduce:transition-none ${shown ? "" : "opacity-30"}`}>
                  <span className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: part.color }} />
                  <span className="min-w-0">
                    {part.label} <span className="font-mono text-muted-foreground">{part.avg}/{part.peak}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    />
  );
}
