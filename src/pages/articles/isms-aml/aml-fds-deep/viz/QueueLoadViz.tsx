import FdsSceneShell from "./FdsSceneShell";

/**
 * 본문 대응: #rules-model-chain 둘째 문단과 아래 Q 식 — 하루 alert 수 × 건당 검토 분을 analyst 가용 분과 비교한다.
 * 글의 숫자: 600건 × 12분 = 7,200분, 6명 × 360분 = 2,160분, Q = 7,200 / 2,160 ≈ 3.33.
 * 산술: 하루 처리 가능 2,160 / 12 = 180건, 남는 600 − 180 = 420건.
 * 매일 같은 유입과 처리라고 가정하면 남는 건이 420, 840, 1,260, 1,680, 2,100건으로 쌓인다.
 */
const ALERTS = 600;
const MINUTES = 12;
const ANALYSTS = 6;
const ANALYST_MINUTES = 360;
const DEMAND = ALERTS * MINUTES;
const SUPPLY = ANALYSTS * ANALYST_MINUTES;
const DONE_PER_DAY = SUPPLY / MINUTES;
const LEFT_PER_DAY = ALERTS - DONE_PER_DAY;
const DAYS = [1, 2, 3, 4, 5] as const;
const BACKLOG = DAYS.map((day) => day * LEFT_PER_DAY);
const MAX_BACKLOG = BACKLOG[BACKLOG.length - 1];

const fmt = (value: number) => value.toLocaleString("ko-KR");

const SCENES = [
  { label: "하루 alert가 먹는 시간", summary: `${ALERTS} × ${MINUTES}분 = ${fmt(DEMAND)}분`, note: "새로 배포하려는 detector(candidate)가 하루 alert 600건을 열고 한 건을 품질을 지키며 검토하는 데 평균 12분이 든다고 두면, 하루에 필요한 검토시간은 7,200분입니다." },
  { label: "analyst가 쓸 수 있는 시간", summary: `Q = ${fmt(DEMAND)} / ${fmt(SUPPLY)} ≈ ${(DEMAND / SUPPLY).toFixed(2)}`, note: "회의·교육·휴식을 뺀 가용시간은 6명 × 360분 = 2,160분입니다. 필요한 시간을 이 가용시간으로 나눈 값이 Q이고, 7,200 ÷ 2,160 ≈ 3.33입니다. 필요한 시간이 쓸 수 있는 시간의 3배를 넘습니다." },
  { label: "오늘 처리하지 못한 alert", summary: `${DONE_PER_DAY}건 처리 · ${LEFT_PER_DAY}건 남음`, note: "2,160분으로는 12분짜리 검토를 180건만 끝낼 수 있습니다. 600건 중 420건은 다음 날로 넘어갑니다." },
  { label: "매일 같은 양이라면", summary: `5일 뒤 ${fmt(MAX_BACKLOG)}건 대기`, note: "유입과 처리량이 매일 같다고 가정하면 남는 420건이 날마다 더해져 검토 대기열(queue)이 계속 길어집니다. Q가 1을 넘는다는 말이 이 모양입니다. Q는 운영 부하이지 법적 의심 기준이나 STR 제출 조건이 아닙니다." },
] as const;

function Bar({ label, value, max, color, strong = false, caption }: { label: string; value: number; max: number; color: string; strong?: boolean; caption: string }) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-2 text-xs sm:grid-cols-[7rem_minmax(0,1fr)] sm:text-sm">
      <span className={strong ? "font-bold" : "text-muted-foreground"}>{label}</span>
      <div className="min-w-0">
        <div className="h-4 rounded-sm bg-muted/40">
          <div className="h-full rounded-sm" style={{ width: `${(value / max) * 100}%`, backgroundColor: color }} />
        </div>
        <span className="mt-0.5 block font-mono text-[11px] text-muted-foreground">{caption}</span>
      </div>
    </div>
  );
}

export default function QueueLoadViz() {
  return (
    <FdsSceneShell
      eyebrow="Analyst 처리용량"
      title="하루 alert가 analyst 시간보다 많으면 남은 건이 날마다 쌓입니다"
      description="막대는 분 단위 검토시간 또는 대기 건수입니다. 하루 600건, 건당 12분, analyst 6명 × 360분은 아래 Q 식의 예시 숫자이고, 매일 같은 양이 들어온다는 것은 그림을 위한 가정입니다."
      ariaLabel="하루 검토 수요와 analyst 가용시간, 그리고 쌓이는 대기 alert"
      scenes={SCENES}
      render={(active) => {
        if (active < 3) {
          return (
            <div className="space-y-3">
              <Bar label="필요한 시간" value={DEMAND} max={DEMAND} color="#d97706" caption={`${ALERTS}건 × ${MINUTES}분 = ${fmt(DEMAND)}분`} />
              <Bar label="가용 시간" value={active >= 1 ? SUPPLY : 0} max={DEMAND} color="#2563eb" caption={active >= 1 ? `${ANALYSTS}명 × ${ANALYST_MINUTES}분 = ${fmt(SUPPLY)}분` : "—"} />
              <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-2 text-xs sm:grid-cols-[7rem_minmax(0,1fr)] sm:text-sm">
                <span className="text-muted-foreground">alert {ALERTS}건</span>
                <div className="min-w-0">
                  <div className="flex h-4 overflow-hidden rounded-sm bg-muted/40">
                    <div className="h-full" style={{ width: active === 2 ? `${(DONE_PER_DAY / ALERTS) * 100}%` : "0%", backgroundColor: "#2563eb" }} />
                    <div className="h-full" style={{ width: active === 2 ? `${(LEFT_PER_DAY / ALERTS) * 100}%` : "0%", backgroundColor: "#dc2626", opacity: 0.75 }} />
                  </div>
                  <span className="mt-0.5 block font-mono text-[11px] text-muted-foreground">
                    {active === 2 ? `처리 ${DONE_PER_DAY}건 (${fmt(SUPPLY)} ÷ ${MINUTES}) · 남음 ${LEFT_PER_DAY}건` : "—"}
                  </span>
                </div>
              </div>
            </div>
          );
        }
        return (
          <div className="space-y-2">
            {DAYS.map((day, index) => (
              <Bar key={day} label={`${day}일째 끝`} value={BACKLOG[index]} max={MAX_BACKLOG} color="#dc2626" caption={`대기 ${fmt(BACKLOG[index])}건`} />
            ))}
          </div>
        );
      }}
    />
  );
}
