import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — CBOT Chapter 10의 3등급 황색 옥수수 할인과 지역 가산표 두 벌.
 * 품질: 두 조건 중 하나만 3등급 범위 → 2센트, 둘 다 → 4센트.
 * 지역: 2027년 12월물까지 / 2028년 3월물부터. Ottawa-Chillicothe 6.25 → 6.25, St. Louis-East St. Louis·Alton 16.25 → 24.
 * 두 조건 모두 3등급 범위가 아닌 경우는 본문이 다루지 않아 장면에 넣지 않는다.
 */
const CONDITIONS = ["깨진 낟알·이물질", "총손상"] as const;
const RANGES = ["3.1~4%", "5.1~7%"] as const;
const REGIONS = ["Ottawa-Chillicothe", "St. Louis-East St. Louis·Alton"] as const;
const TABLES = [
  { label: "2027년 12월물까지", cents: [6.25, 16.25] },
  { label: "2028년 3월물부터", cents: [6.25, 24] },
] as const;
const TABLE_LIST: readonly { label: string; cents: readonly number[] }[] = TABLES;

const SCENES = [
  { label: "한 조건만", hits: [true, false], table: -1, summary: "−2¢/bu", note: "깨진 낟알·이물질 비율만 3등급 범위(3.1~4%)에 들면 부셸당 2센트를 뺍니다." },
  { label: "다른 한 조건만", hits: [false, true], table: -1, summary: "−2¢/bu", note: "총손상 비율만 3등급 범위(5.1~7%)에 들어도 2센트입니다. 어느 쪽인지보다 몇 개가 걸렸는지가 할인을 정합니다." },
  { label: "두 조건 모두", hits: [true, true], table: -1, summary: "−4¢/bu(본문 사례)", note: "두 조건이 모두 들면 4센트입니다. 본문의 4센트는 손상 하나가 아니라 두 조건이 겹친 경우의 값입니다." },
  { label: "2027년 12월물까지", hits: [true, true], table: 0, summary: "Ottawa +6.25¢", note: "지역 가산은 월물마다 표가 다릅니다. 이 표에서 Ottawa-Chillicothe는 6.25센트, St. Louis 쪽은 16.25센트입니다." },
  { label: "2028년 3월물부터", hits: [true, true], table: 1, summary: "St. Louis 24¢", note: "Ottawa-Chillicothe는 6.25센트 그대로지만 St. Louis 쪽은 24센트로 오릅니다. 월물과 장소를 빼고 숫자만 옮기면 안 됩니다." },
] as const;

export default function RuleLookupViz() {
  return (
    <SceneShell
      eyebrow="규정표 읽는 순서"
      title="4센트와 6.25센트는 어떤 조건에서 나오는가"
      description="위는 3등급 황색 옥수수의 품질 할인, 아래는 월물별 지역 가산표입니다. 숫자는 본문이 인용한 CBOT Chapter 10(2026년 10월 확인)에서 왔습니다."
      ariaLabel="두 품질 조건의 충족 개수에 따른 2센트·4센트 할인과 월물별 지역 가산표"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const count = scene.hits.filter(Boolean).length;
        const gradeFocus = scene.table < 0;
        return (
          <div className="min-w-0 space-y-2.5 text-sm">
            <div className={`rounded-lg border p-2.5 transition-opacity sm:p-3 ${gradeFocus ? "border-primary/60" : "border-border opacity-50"}`}>
              <p className="mb-2 text-xs font-bold text-muted-foreground">품질 할인 · 3등급 황색 옥수수 조건</p>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <ul className="space-y-1 text-xs sm:text-sm">
                  {CONDITIONS.map((condition, index) => (
                    <li key={condition} className="flex items-center gap-2">
                      <span className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs font-bold ${scene.hits[index] ? "border-amber-600 bg-amber-600 text-white" : "border-border text-muted-foreground"}`}>
                        {scene.hits[index] ? "✓" : ""}
                      </span>
                      <span className={scene.hits[index] ? "font-semibold" : "text-muted-foreground"}>
                        {condition} {RANGES[index]}
                        <span className="ml-1 text-xs font-normal">{scene.hits[index] ? "3등급 범위 안" : "범위 밖"}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <span className="font-mono text-lg font-bold text-amber-700 dark:text-amber-400" aria-label={`${count}개 해당, ${count * 2}센트 할인`}>−{count * 2}¢</span>
              </div>
            </div>
            <div className={`rounded-lg border p-2.5 transition-opacity sm:p-3 ${gradeFocus ? "border-border opacity-50" : "border-primary/60"}`}>
              <p className="mb-2 text-xs font-bold text-muted-foreground">지역 가산 · 월물로 표를 먼저 고릅니다</p>
              <div className="mb-2 grid grid-cols-2 gap-2">
                {TABLE_LIST.map((table, index) => (
                  <span key={table.label} className={`rounded-md border px-2 py-1 text-center text-xs ${scene.table === index ? "border-primary font-bold text-primary" : "border-border text-muted-foreground"}`}>
                    {table.label}
                  </span>
                ))}
              </div>
              <ul className="space-y-1">
                {REGIONS.map((region, index) => {
                  const table = scene.table < 0 ? null : TABLE_LIST[scene.table];
                  const before = TABLE_LIST[0].cents[index];
                  const changed = scene.table === 1 && before !== TABLE_LIST[1].cents[index];
                  return (
                    <li key={region} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                      <span className="min-w-0 break-words text-xs sm:text-sm">{region}</span>
                      <span className={`font-mono font-bold ${changed ? "text-red-700 dark:text-red-400" : "text-primary"}`}>
                        {table ? `+${table.cents[index]}¢${changed ? ` ← ${before}` : ""}` : "표 고르기 전"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        );
      }}
    />
  );
}
