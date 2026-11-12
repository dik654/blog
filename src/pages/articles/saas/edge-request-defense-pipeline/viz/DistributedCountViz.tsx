import SceneShell from "./SceneShell";

/**
 * 본문 대응: #request-layer 셋째 문단 — 여러 지점에 분산된 구조에서 지점마다 따로 세면 합계가 한도를
 * 넘고, 한곳에 모아 세면 지연이 늘어납니다.
 * 가정: 한 출처의 한도 분당 100건, 지점 3곳, 그 출처가 1분에 지점마다 100건씩 총 300건을 보냄.
 * 따로 셈: 지점마다 100건까지 통과 → 300건 통과(한도의 3배). 모아 셈: 100건 통과, 200건 차단.
 * 지연 크기는 본문에 수치가 없어 그리지 않습니다.
 */
const LIMIT = 100;
const SITES = 3;
const PER_SITE = 100;
const SENT = SITES * PER_SITE;

const SCENES = [
  { label: "한도 하나", summary: `한 출처 · 분당 ${LIMIT}건 (가정)`, note: `같은 출처가 1분에 지점 세 곳으로 ${PER_SITE}건씩, 모두 ${SENT}건을 보냅니다(가정). 원하는 결과는 ${LIMIT}건까지만 통과입니다.` },
  { label: "지점마다 따로 셈", summary: `${PER_SITE} + ${PER_SITE} + ${PER_SITE} = ${SENT}건 통과`, note: `각 지점은 자기 카운터만 봅니다. 어느 지점도 ${LIMIT}건을 넘지 않았으니 모두 통과시키고, 합계는 한도의 ${SENT / LIMIT}배가 됩니다. 대신 판단은 지점 안에서 바로 끝납니다.` },
  { label: "한곳에 모아 셈", summary: `${LIMIT}건 통과 · ${SENT - LIMIT}건 차단`, note: `모든 지점이 중앙 카운터 하나에 물어보면 합계가 정확히 ${LIMIT}건에서 멈춥니다. 대신 요청마다 중앙까지 다녀오는 시간이 붙습니다.` },
] as const;

const PASS = "#2563eb";
const OVER = "#dc2626";
const BLOCK = "#94a3b8";

function Bar({ label, passed, blocked, over }: { label: string; passed: number; blocked: number; over: number }) {
  const pct = (v: number) => `${(v / SENT) * 100}%`;
  return (
    <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-2 text-xs">
      <span className="font-semibold">{label}</span>
      <div className="relative h-4 w-full rounded-sm bg-muted/40">
        <div className="absolute inset-y-0 left-0" style={{ width: pct(passed), backgroundColor: PASS }} />
        <div className="absolute inset-y-0" style={{ left: pct(passed), width: pct(over), backgroundColor: OVER }} />
        <div className="absolute inset-y-0" style={{ left: pct(passed + over), width: pct(blocked), backgroundColor: BLOCK }} />
        <div className="absolute -inset-y-1 border-l border-dashed border-slate-500" style={{ left: pct(LIMIT) }} />
      </div>
    </div>
  );
}

export default function DistributedCountViz() {
  return (
    <SceneShell
      eyebrow="분산 카운터"
      title="지점마다 세면 한도가 최대 지점 수만큼 불어납니다"
      description={`지점 3곳, 한도 분당 ${LIMIT}건, 보낸 요청 ${SENT}건, 지점마다 같은 한도 ${LIMIT}건을 그대로 적용한다는 것은 설명용 가정입니다. 막대 전체 폭이 ${SENT}건이고, 세로 점선이 한도 ${LIMIT}건입니다.`}
      ariaLabel="레이트 리밋을 지점마다 셀 때와 한곳에 모아 셀 때의 통과 건수 비교"
      scenes={SCENES}
      render={(active) => {
        const central = active === 2;
        const split = active === 1;
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: SITES }, (_, i) => (
                <div key={i} className="rounded-lg border border-border px-2 py-2 text-center text-xs">
                  <span className="block font-bold">지점 {i + 1}</span>
                  <span className="block text-muted-foreground">도착 {PER_SITE}건</span>
                  <span className={`block font-mono ${split ? "font-semibold text-blue-700 dark:text-blue-300" : "text-muted-foreground/50"}`}>
                    {split ? `자기 카운터 ${PER_SITE}/${LIMIT}` : central ? "중앙에 물어봄 ↓" : "카운터 ?"}
                  </span>
                </div>
              ))}
            </div>
            <div className={`rounded-lg border px-3 py-2 text-center text-xs ${central ? "border-blue-600" : "border-dashed border-border/40 text-muted-foreground/50"}`}>
              <span className="font-bold">중앙 카운터</span>{" "}
              <span className="font-mono">{central ? `합계 ${LIMIT}/${LIMIT} · 요청마다 왕복 지연` : "사용 안 함"}</span>
            </div>
            <div className="space-y-2">
              <Bar label={`보낸 ${SENT}건`} passed={active === 0 ? 0 : LIMIT} over={split ? SENT - LIMIT : 0} blocked={central ? SENT - LIMIT : 0} />
              <div className="flex flex-wrap gap-x-4 gap-y-1 pl-[5rem] text-[11px] text-muted-foreground">
                <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ backgroundColor: PASS }} />한도 안 통과</span>
                <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ backgroundColor: OVER }} />한도를 넘어 통과</span>
                <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ backgroundColor: BLOCK }} />차단</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
