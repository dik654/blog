import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 변경 전 100−25+20=95, 변경 뒤 120−35−10=75(공동 이용 20 소멸).
 * 한 줄은 0에서 시작해 생산을 임대료·울타리·배수·가구 몫으로 나누고, 공동 이용 가치는 생산 끝에 이어 붙인다.
 * 산술: 밭에서 가구에 남는 몫은 100−25=75, 120−35−10=75로 같다. 늘어난 20은 임대료 +10, 울타리·배수 +10.
 * 가구 몫 95→75의 차이 20은 공동 이용 가치 20과 같다. 축: 0~140.
 */
const MAX = 140;

const ROWS = [
  { label: "변경 전", production: 100, rent: 25, fence: 0, commons: 20 },
  { label: "변경 뒤", production: 120, rent: 35, fence: 10, commons: 0 },
] as const;

const SCENES = [
  { label: "변경 전: 생활 몫 95", summary: "100 − 25 + 20 = 95", show: 1, delta: false, note: "생산 100 가운데 임대료 25를 내면 밭에서 75가 남고, 밭 밖의 공동 목초지에서 얻는 땔감·방목 가치 20이 더해져 95입니다. 모두 설명용 가정이며 실제 역사 통계가 아닙니다." },
  { label: "변경 뒤: 생활 몫 75", summary: "120 − 35 − 10 = 75", show: 2, delta: false, note: "밭을 합치고 울타리를 친 뒤 생산은 120으로 길어졌지만 임대료 35와 울타리·배수 부담 10이 앞에서 빠지고, 공동 이용 가치 20이 들어갈 자리는 비었습니다." },
  { label: "늘어난 20은 어디로 갔나", summary: "가구 몫 95 → 75", show: 2, delta: true, note: "두 줄을 맞대면 밭에서 가구에 남는 몫은 75로 같습니다. 늘어난 생산 20은 임대료 +10과 울타리·배수 +10으로 나가고, 가구 장부에서 줄어든 20은 사라진 공동 이용 가치 20입니다(본문 숫자의 산술)." },
] as const;

const pct = (value: number) => (value / MAX) * 100;

function Segment({ from, to, color, label, dashed = false, light = false }: { from: number; to: number; color: string; label: string; dashed?: boolean; light?: boolean }) {
  return (
    <div
      className="absolute inset-y-0 flex items-center justify-center overflow-hidden border font-mono text-[10px] font-bold sm:text-xs"
      style={{
        left: `${pct(from)}%`,
        width: `${pct(to - from)}%`,
        backgroundColor: dashed ? "transparent" : light ? "#bbf7d0" : color,
        borderColor: color,
        borderStyle: dashed ? "dashed" : "solid",
        color: dashed || light ? "#166534" : "#ffffff",
      }}
    >
      {label}
    </div>
  );
}

export default function HouseholdShareSplitViz() {
  return (
    <SceneShell
      eyebrow="한 가구의 장부"
      title="생산이 20 늘어도 가구 몫이 20 줄어드는 장부"
      description="한 줄이 한 시점입니다. 왼쪽부터 생산을 임대료·울타리·배수 부담·가구에 남는 몫으로 나누고, 생산 끝에 공동 이용 가치(소유하지 않은 공동지에서 얻던 땔감·방목의 가치)를 이어 붙였습니다. 숫자는 모두 3절의 설명용 가정입니다."
      ariaLabel="울타리 전후 생산 100과 120을 임대료, 울타리·배수 부담, 가구 몫, 공동 이용 가치로 나눈 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            {ROWS.map((row, index) => {
              const shown = index < scene.show;
              const keep = row.production - row.rent - row.fence;
              const total = keep + row.commons;
              return (
                <div key={row.label} className={`transition-opacity duration-300 motion-reduce:transition-none ${shown ? "" : "opacity-20"}`} aria-hidden={!shown}>
                  <div className="mb-1 flex items-baseline justify-between gap-2 text-xs sm:text-sm">
                    <span className="font-semibold">{row.label} · 생산 {row.production}</span>
                    <span className="font-mono font-bold text-green-700 dark:text-green-400">가구 몫 {shown ? total : "?"}</span>
                  </div>
                  <div className="relative h-7 min-w-0 rounded-sm bg-muted/30">
                    <Segment from={0} to={row.rent} color="#d97706" label={`${row.rent}`} />
                    {row.fence > 0 ? <Segment from={row.rent} to={row.rent + row.fence} color="#7c3aed" label={`${row.fence}`} /> : null}
                    <Segment from={row.rent + row.fence} to={row.production} color="#16a34a" label={`${keep}`} />
                    {row.commons > 0 ? (
                      <Segment from={row.production} to={row.production + row.commons} color="#16a34a" label={`+${row.commons}`} light />
                    ) : (
                      <Segment from={row.production} to={row.production + 20} color="#16a34a" label="0" dashed />
                    )}
                    <div className="absolute inset-y-[-4px] w-px bg-foreground/70" style={{ left: `${pct(row.production)}%` }} />
                  </div>
                </div>
              );
            })}
            <div className="relative h-4 text-[11px] text-muted-foreground">
              {[0, 50, 100, 120].map((tick) => (
                <span key={tick} className="absolute -translate-x-1/2 font-mono" style={{ left: `${pct(tick)}%` }}>{tick}</span>
              ))}
            </div>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <li><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ backgroundColor: "#d97706" }} />임대료</li>
              <li><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ backgroundColor: "#7c3aed" }} />울타리·배수 부담</li>
              <li><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ backgroundColor: "#16a34a" }} />밭에서 가구에 남는 몫</li>
              <li><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm border align-middle" style={{ backgroundColor: "#bbf7d0", borderColor: "#16a34a" }} />공동 이용 가치</li>
              <li><span className="mr-1 inline-block h-3 w-px align-middle bg-foreground/70" />생산 끝</li>
            </ul>
            <dl className={`grid grid-cols-2 gap-2 text-xs sm:grid-cols-4 ${scene.delta ? "" : "invisible"}`} aria-hidden={!scene.delta}>
              {[
                { name: "임대료", value: "25 → 35 (+10)" },
                { name: "울타리·배수", value: "0 → 10 (+10)" },
                { name: "밭에서 남는 몫", value: "75 → 75 (그대로)" },
                { name: "공동 이용 가치", value: "20 → 0 (−20)" },
              ].map((item) => (
                <div key={item.name} className="rounded-lg border border-border px-2 py-1.5 leading-5">
                  <dt className="text-muted-foreground">{item.name}</dt>
                  <dd className="font-mono font-semibold">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        );
      }}
    />
  );
}
