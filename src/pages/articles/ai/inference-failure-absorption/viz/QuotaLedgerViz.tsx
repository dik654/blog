import SceneShell from "./SceneShell";

/**
 * 본문 대응: #state-authority — 잔액을 낡은 값으로 받으면 합계가 잔액을 넘고, 미리 배정하면 넘지 않는다.
 * (가정) 잔액 100, 리전 셋. 낡은 값: 60 + 50 + 40 = 150, 초과 50. 배정 40·30·30, 차감 40·12·20 = 72, 미사용 18 + 10 = 28.
 */
interface Region {
  limit: number | null;
  spent: number | null;
  status: string;
}

interface Scene {
  label: string;
  summary: string;
  note: string;
  link: string;
  limitName: string;
  regions: readonly [Region, Region, Region];
}

const SCENES: readonly Scene[] = [
  {
    label: "낡은 값으로 계속 받으면",
    summary: "60 + 50 + 40 = 150 > 100",
    link: "단절",
    limitName: "각자 본 잔액",
    regions: [
      { limit: 100, spent: 60, status: "받음" },
      { limit: 100, spent: 50, status: "받음" },
      { limit: 100, spent: 40, status: "받음" },
    ],
    note: "(가정) 단절 전에 본 잔액 100을 세 리전이 각자 믿고 받습니다. 합이 150이라 50은 쓴 만큼 못 받게 됩니다. 그래서 여기는 보수적으로 제한하는 쪽으로 기울입니다.",
  },
  {
    label: "글로벌 원장을 요청 경로에 넣으면",
    summary: "모든 요청 + 리전 간 쓰기 지연",
    link: "연결",
    limitName: "",
    regions: [
      { limit: null, spent: null, status: "요청마다 쓰기" },
      { limit: null, spent: null, status: "요청마다 쓰기" },
      { limit: null, spent: null, status: "요청마다 쓰기" },
    ],
    note: "낡은 값을 피하려면 원장을 요청 경로에 넣어야 할 것 같지만 그러면 리전 간 쓰기 지연이 모든 요청에 붙습니다. 지연의 크기는 글이 정하지 않았으므로 숫자로 그리지 않았습니다.",
  },
  {
    label: "리전마다 미리 배정합니다",
    summary: "40 + 30 + 30 = 100",
    link: "연결",
    limitName: "배정액",
    regions: [
      { limit: 40, spent: 0, status: "배정받음" },
      { limit: 30, spent: 0, status: "배정받음" },
      { limit: 30, spent: 0, status: "배정받음" },
    ],
    note: "(가정) 트랜잭션이 되는 원장이 권위이고 잔액 100을 세 리전에 나눠 둡니다. 배정 합계가 잔액을 넘지 않습니다.",
  },
  {
    label: "단절 중에는 배정액 안에서 차감합니다",
    summary: "40 + 12 + 20 = 72 ≤ 100",
    link: "단절",
    limitName: "배정액",
    regions: [
      { limit: 40, spent: 40, status: "소진 → 차단" },
      { limit: 30, spent: 12, status: "차감 중" },
      { limit: 30, spent: 20, status: "차감 중" },
    ],
    note: "(가정) 리전 1이 40을 다 쓰면 차단합니다. 각 리전이 자기 배정액을 넘지 못하므로 단절 중에도 합계가 잔액을 넘지 않습니다.",
  },
  {
    label: "치르는 대가",
    summary: "18 + 10 = 28이 남아도 못 씀",
    link: "단절",
    limitName: "배정액",
    regions: [
      { limit: 40, spent: 40, status: "차단 유지" },
      { limit: 30, spent: 12, status: "18 남음" },
      { limit: 30, spent: 20, status: "10 남음" },
    ],
    note: "(가정) 리전 1은 막혔는데 다른 두 리전에 28이 남아 있습니다. 보수적으로 제한하는 쪽이라 다른 리전의 배정액을 당장 쓰지 못합니다.",
  },
];

const SCALE = 150;
const BALANCE = 100;
const pct = (value: number) => `${(value / SCALE) * 100}%`;
const SPENT_TONES = ["#2563eb", "#0891b2", "#7c3aed"] as const;

function Row({ name, region, tone, limitName }: { name: string; region: Region; tone: string; limitName: string }) {
  return (
    <div className="grid min-h-8 grid-cols-[3.25rem_minmax(0,1fr)_5.5rem] items-center gap-2 text-xs sm:grid-cols-[4rem_minmax(0,1fr)_7rem]">
      <span className="font-bold">{name}</span>
      <div className="relative h-5 min-w-0 rounded-sm bg-muted/40">
        {region.spent !== null && <div className="absolute inset-y-0 left-0 rounded-sm" style={{ width: pct(region.spent), backgroundColor: tone }} />}
        {region.limit !== null && <div className="absolute inset-y-0 left-0 rounded-sm border border-foreground/60" style={{ width: pct(region.limit) }} title={limitName} />}
      </div>
      <span className="text-right font-mono leading-4">
        {region.limit !== null && <span className="block">{region.spent} / {region.limit}</span>}
        <span className="block text-[11px] text-muted-foreground">{region.status}</span>
      </span>
    </div>
  );
}

export default function QuotaLedgerViz() {
  return (
    <SceneShell
      eyebrow="잔액과 한도"
      title="낡은 잔액을 믿으면 합계가 넘고, 미리 나눠 두면 넘지 못합니다"
      description="잔액 100과 리전 셋, 각 금액은 설명용 가정입니다(가정). 색 막대는 쓴 몫, 테두리는 그 리전이 믿는 한도입니다. 아래 줄은 세 리전의 합계이고 점선이 잔액 100입니다."
      ariaLabel="낡은 잔액, 글로벌 원장, 리전별 사전 배정의 지출 합계 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const spentValues = scene.regions.map((region) => region.spent ?? 0);
        const total = spentValues.reduce<number>((sum, value) => sum + value, 0);
        const counted = scene.regions.some((region) => region.spent !== null);
        return (
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs">
              <span className="font-bold">원장 잔액 {BALANCE}</span>
              <span className={`rounded-sm border px-2 py-0.5 font-bold ${scene.link === "단절" ? "border-dashed border-red-600 text-red-700 dark:text-red-400" : "border-border text-muted-foreground"}`}>
                원장 ↔ 리전: {scene.link}
              </span>
            </div>
            <div className="space-y-2">
              {scene.regions.map((region, index) => (
                <Row key={index} name={`리전 ${index + 1}`} region={region} tone={SPENT_TONES[index]} limitName={scene.limitName} />
              ))}
            </div>
            <div className="mt-4 grid grid-cols-[3.25rem_minmax(0,1fr)_5.5rem] items-center gap-2 border-t border-border pt-3 text-xs sm:grid-cols-[4rem_minmax(0,1fr)_7rem]">
              <span className="font-bold">합계</span>
              <div className="relative flex h-5 min-w-0 rounded-sm bg-muted/40">
                {spentValues.map((value, index) => (
                  <div key={index} className="h-full" style={{ width: pct(value), backgroundColor: SPENT_TONES[index] }} />
                ))}
                <div className="absolute -inset-y-1 border-l border-dashed border-foreground" style={{ left: pct(BALANCE) }} />
              </div>
              <span className={`text-right font-mono font-bold ${total > BALANCE ? "text-red-700 dark:text-red-400" : ""}`}>
                {counted ? `${total} / ${BALANCE}` : `− / ${BALANCE}`}
              </span>
            </div>
          </div>
        );
      }}
    />
  );
}
