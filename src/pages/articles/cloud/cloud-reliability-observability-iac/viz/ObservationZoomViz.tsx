import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture 첫 문단 — 지표는 집계된 숫자, 추적은 요청 하나의 구간, 로그는 한 사건의 문맥.
 * 순서는 #mechanism 알고리즘의 "지표 → 추적 → 로그"(넓은 증상에서 한 요청의 문맥으로)를 따른다.
 * 요청 20개 중 4개 실패, 서비스 세 개와 구간 길이, 로그 필드는 모두 설명용 가정이다. 4 / 20 = 20%.
 */
const REQUESTS = 20;
const FAILED = new Set([5, 11, 14, 18]);
const PICKED = 11;
const RATE = Math.round((FAILED.size / REQUESTS) * 100);

const SPANS = [
  { name: "서비스 1", start: 0, length: 10 },
  { name: "서비스 2", start: 10, length: 12 },
  { name: "서비스 3", start: 22, length: 66 },
] as const;
const SPAN_TOTAL = 88;
const SLOW = 2;

const SCENES = [
  {
    label: "지표 · 많은 요청을 숫자 하나로",
    summary: `5분 오류율 ${RATE}% (가정)`,
    note: "지표는 오류율·지연·용량처럼 시간에 따라 집계된 숫자입니다. 5분 동안의 요청 20개 중 4개가 실패했다면 오류율 하나로 이상을 빨리 알 수 있지만, 어느 서비스에서 실패했는지는 이 숫자에 없습니다.",
  },
  {
    label: "추적 · 요청 하나가 지난 구간",
    summary: "실패한 요청 하나를 구간별로",
    note: "분산 추적은 요청 하나가 여러 서비스를 지날 때 각 구간을 연결합니다. 막대 길이는 설명용 가정이며, 가장 긴 구간이 어디서 느려졌는지 가리킵니다.",
  },
  {
    label: "로그 · 그 구간에서 일어난 한 사건",
    summary: "같은 요청 ID로 문맥을 찾음",
    note: "로그는 한 사건의 문맥을 남깁니다. 추적에서 좁힌 구간과 같은 요청 ID(상관관계 ID)로 그 시점의 기록을 찾아 원인을 읽습니다. 필드 이름과 값은 설명용 가정입니다.",
  },
] as const;

function MetricPanel({ dim }: { dim: boolean }) {
  return (
    <div className={dim ? "opacity-40" : ""}>
      <p className="text-xs font-semibold text-muted-foreground">요청 20개 (가정) · 칸 하나가 요청 하나</p>
      <div className="mt-2 grid grid-cols-10 gap-1">
        {Array.from({ length: REQUESTS }, (_, index) => {
          const failed = FAILED.has(index);
          const picked = dim && index === PICKED;
          return (
            <span
              key={index}
              className={`flex h-6 items-center justify-center rounded-sm border text-[11px] font-bold ${
                failed ? "border-[#dc2626] bg-[#dc2626]/15 text-[#b91c1c] dark:text-[#f87171]" : "border-border bg-background text-transparent"
              } ${picked ? "outline outline-1 outline-offset-1 outline-[#2563eb]" : ""}`}
            >
              {failed ? "✕" : "·"}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function TracePanel({ dim }: { dim: boolean }) {
  return (
    <div className={dim ? "opacity-40" : ""}>
      <p className="text-xs font-semibold text-muted-foreground">✕ 요청 하나의 구간 · 막대 길이는 가정</p>
      <div className="mt-2 space-y-1.5">
        {SPANS.map((span, index) => (
          <div key={span.name} className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-2 text-xs">
            <span className={index === SLOW ? "font-bold text-foreground" : "text-muted-foreground"}>{span.name}</span>
            <div className="relative h-3.5 min-w-0 rounded-sm bg-muted/30">
              <div
                className="absolute inset-y-0 rounded-sm"
                style={{
                  left: `${(span.start / SPAN_TOTAL) * 100}%`,
                  width: `${(span.length / SPAN_TOTAL) * 100}%`,
                  backgroundColor: index === SLOW ? "#d97706" : "#94a3b8",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LogPanel({ dim }: { dim: boolean }) {
  return (
    <div className={dim ? "opacity-40" : ""}>
      <p className="text-xs font-semibold text-muted-foreground">서비스 3의 로그 한 줄 (가정)</p>
      <pre className="mt-2 max-w-full overflow-hidden whitespace-pre-wrap break-words rounded-md border border-border bg-muted/20 p-2 font-mono text-[11px] leading-5 text-foreground">
        {"요청 ID=같은 값  서비스=서비스 3\n이벤트=오류 내용  문맥=그때의 입력·상태"}
      </pre>
    </div>
  );
}

export default function ObservationZoomViz() {
  return (
    <SceneShell
      eyebrow="세 관측 자료"
      title="넓은 숫자에서 요청 하나, 사건 하나로 내려갑니다"
      description="지표 → 추적 → 로그 순으로 범위가 좁아집니다. 요청 수, 서비스 이름, 구간 길이, 로그 내용은 모두 설명용 가정입니다."
      ariaLabel="지표, 분산 추적, 로그가 각각 답하는 질문의 범위"
      scenes={SCENES}
      render={(active) => (
        <div className="grid min-w-0 gap-4">
          <MetricPanel dim={active !== 0} />
          <TracePanel dim={active !== 1} />
          <LogPanel dim={active !== 2} />
        </div>
      )}
    />
  );
}
