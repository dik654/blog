import SceneShell from "./SceneShell";

/**
 * 본문 대응: #detect-enforce-observe 둘째 문단 — SIEM은 firewall·WAF·IDS/IPS·VPN·identity·application log를
 * common identity·asset·request/session ID·clock으로 연결한다. 수집 성공 ≠ detection rule 동작,
 * parsing failure·late arrival·duplicate를 관측하고 raw event→alert→case→response action provenance를 재생한다.
 * 40분 지연은 release 표의 "SIEM collector backlog로 40분 지연" 행이다. 시각·ID·각 event 내용은 예(가정)이다.
 */
type Row = { source: string; time: string; event: string; state: "ok" | "late" | "parse" | "dup"; key?: string };

/** 모든 줄이 함께 가진 공통 키(가정). 해석에 실패한 줄은 이 키가 비어 묶이지 않는다. */
const KEY = "u-3/h-9/req-17";

const BASE: readonly Row[] = [
  { source: "VPN", time: "09:00:00", event: "session 시작", state: "ok" },
  { source: "Identity", time: "09:00:01", event: "인증 성공", state: "ok" },
  { source: "Firewall", time: "09:00:02", event: "flow 허용", state: "ok" },
  { source: "WAF", time: "09:00:02", event: "request 검사", state: "ok" },
  { source: "IDS/IPS", time: "09:00:03", event: "signal", state: "ok" },
  { source: "Application", time: "09:00:03", event: "403 응답", state: "ok" },
];

const LATE: readonly Row[] = BASE.map((row): Row => (row.source === "IDS/IPS" ? { ...row, state: "late" } : row));

const BROKEN: readonly Row[] = [
  ...BASE.map((row): Row => (row.source === "WAF" ? { ...row, event: "필드 해석 실패", state: "parse", key: "비어 있음" } : row)),
  { source: "Firewall", time: "09:00:02", event: "flow 허용 (같은 event)", state: "dup" },
];

const SCENES = [
  {
    label: "공통 키로 한 사건에 묶습니다",
    summary: "identity · asset · request/session ID · clock",
    note: "여섯 곳의 log는 저마다 다른 장비가 따로 남깁니다. SIEM은 같은 사용자·자산·request/session ID와 시각을 공통 키로 삼아 이 줄들을 한 사건으로 잇습니다. 시각과 ID는 예입니다(가정).",
  },
  {
    label: "한 줄이 40분 늦게 들어오면",
    summary: "collector backlog → detection 지연",
    note: "Collector에 backlog가 쌓여 IDS/IPS의 signal이 40분 뒤에 도착하면, 그 줄에 기대는 detection도 그만큼 늦어질 수 있습니다. 그래서 detection latency·queue depth·data loss와 on-call 전달을 따로 측정합니다.",
  },
  {
    label: "들어왔다고 쓸 수 있는 것은 아닙니다",
    summary: "수집 성공 ≠ detection rule 동작",
    note: "WAF 줄은 수집됐지만 필드를 해석하지 못해 키가 비었고, firewall 줄은 같은 event가 두 번 들어왔습니다. Log가 도착했다는 사실과 detection rule이 그 log로 제대로 동작했다는 사실을 나눠서 봅니다.",
  },
  {
    label: "결론에서 원본까지 거슬러 갑니다",
    summary: "raw event → alert → case → response",
    note: "Dashboard의 숫자보다, 어떤 raw event가 어떤 alert를 만들었고 그 alert가 어떤 case와 response action으로 이어졌는지를 다시 따라갈 수 있어야 합니다. 이 연결 기록이 provenance입니다.",
  },
] as const;

const STATE_TEXT: Record<Row["state"], string> = {
  ok: "연결됨",
  late: "40분 늦음",
  parse: "키 없음",
  dup: "중복",
};

function Table({ rows }: { rows: readonly Row[] }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-lg border border-border/70 text-xs leading-5 sm:text-sm">
      <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_4.75rem] gap-2 bg-muted/40 px-3 py-1.5 font-semibold sm:grid-cols-[6.5rem_5.5rem_minmax(0,1fr)_8.5rem_4.5rem]">
        <span>log 출처</span>
        <span className="hidden sm:block">시각</span>
        <span>
          event<span className="sm:hidden"> · 키</span>
        </span>
        <span className="hidden sm:block">공통 키</span>
        <span className="text-right">상태</span>
      </div>
      {rows.map((row, index) => {
        const bad = row.state !== "ok";
        return (
          <div
            key={`${row.source}-${index}`}
            className={`grid grid-cols-[5.5rem_minmax(0,1fr)_4.75rem] gap-2 border-t border-border/60 px-3 py-1 sm:grid-cols-[6.5rem_5.5rem_minmax(0,1fr)_8.5rem_4.5rem] ${bad ? "bg-red-500/10" : ""}`}
          >
            <span className="font-medium">{row.source}</span>
            <span className="hidden font-mono text-muted-foreground sm:block">{row.time}</span>
            <span className="min-w-0 break-keep text-muted-foreground">
              {row.event}
              {row.state === "late" && (
                <>
                  <span className="sm:hidden"> · 09:00:03 발생, 09:40:03 도착</span>
                  <span className="hidden sm:inline"> · 09:40:03에 도착</span>
                </>
              )}
              <span className={`block whitespace-nowrap text-[11px] sm:hidden ${row.key ? "text-red-700 dark:text-red-400" : ""}`}>{row.key ?? KEY}</span>
            </span>
            <span className={`hidden whitespace-nowrap font-mono text-xs sm:block ${row.key ? "text-red-700 dark:text-red-400" : "text-muted-foreground"}`}>{row.key ?? KEY}</span>
            <span className={`text-right font-semibold ${bad ? "text-red-700 dark:text-red-400" : "text-blue-700 dark:text-blue-400"}`}>{STATE_TEXT[row.state]}</span>
          </div>
        );
      })}
    </div>
  );
}

const CHAIN = ["raw event", "alert", "case", "response action"] as const;

export default function SiemJoinViz() {
  return (
    <SceneShell
      eyebrow="SIEM 상관"
      title="흩어진 log를 같은 키로 묶어야 한 사건이 됩니다"
      description="한 사용자의 급여 조회 한 건이 여섯 곳에 남긴 log입니다. 공통 키 u-3/h-9/req-17은 사용자·자산·request ID입니다(모두 가정)."
      note="40분 지연은 이 글 release 표의 ‘SIEM collector backlog로 40분 지연’ 행에서 왔고, 나머지 시각과 event 내용은 예(가정)입니다."
      ariaLabel="SIEM이 여러 log를 공통 키로 묶는 과정과 지연, 해석 실패, 중복, provenance"
      scenes={SCENES}
      render={(active) => {
        if (active === 3) {
          return (
            <div className="min-w-0">
              <ol className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-stretch sm:gap-0">
                {CHAIN.map((step, index) => (
                  <li key={step} className="flex min-w-0 flex-col items-stretch sm:flex-1 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1 rounded-lg border border-border/70 px-3 py-2.5 text-center">
                      <p className="text-[11px] font-bold text-primary">{String(index + 1).padStart(2, "0")}</p>
                      <p className="mt-0.5 text-sm font-semibold">{step}</p>
                    </div>
                    {index < CHAIN.length - 1 && (
                      <span className="py-0.5 text-center text-xs text-muted-foreground sm:w-6 sm:py-0" aria-hidden>
                        <span className="sm:hidden">↓</span>
                        <span className="hidden sm:inline">→</span>
                      </span>
                    )}
                  </li>
                ))}
              </ol>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">거꾸로 response action에서 raw event까지 되짚을 수 있어야 합니다.</p>
            </div>
          );
        }
        return <Table rows={active === 0 ? BASE : active === 1 ? LATE : BROKEN} />;
      }}
    />
  );
}
