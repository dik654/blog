import SceneShell from "./SceneShell";

/**
 * 본문 대응: #effects — E_retry = E_plan \ (K ∪ U).
 * #101·#102 committed(K), #103 timeout으로 unknown(U), #104·#105 미시작 → 즉시 retry 후보는 #104·#105.
 * #103은 provider receipt를 먼저 조회하고, 필요하면 compensation이나 human approval로 보낸다.
 */
const ISSUES = ["#101", "#102", "#103", "#104", "#105"] as const;

/** 각 effect가 들어갈 칸(0 = 제외, 1 = 먼저 조회, 2 = retry 후보)과 그 칸으로 옮겨지는 장면 번호 */
const LANE: readonly number[] = [0, 0, 1, 2, 2];
const MOVE_AT: readonly number[] = [1, 1, 2, 3, 3];

const LANES = [
  { title: "K · committed", sub: "다시 실행하지 않음", color: "#16a34a" },
  { title: "U · unknown", sub: "receipt부터 조회", color: "#dc2626" },
  { title: "E_retry", sub: "즉시 retry 후보", color: "#2563eb" },
] as const;

const SCENES = [
  {
    label: "Plan 전체",
    summary: "E_plan = #101 … #105",
    note: "Program이 계획한 외부 write 다섯 개입니다. #103 timeout 뒤 이 다섯을 처음부터 다시 돌리면 이미 끝난 write까지 다시 보내게 됩니다.",
  },
  {
    label: "완료 receipt를 뺍니다",
    summary: "K = {#101, #102}",
    note: "#101·#102는 committed receipt(완료를 증명하는 기록)가 있습니다. 이 둘은 blind retry(결과 확인 없는 재실행)에서 빼서 중복 실행을 막습니다.",
  },
  {
    label: "미확정은 따로 둡니다",
    summary: "U = {#103}",
    note: "#103은 timeout이라 성공 여부를 아직 모릅니다. 실패로 간주해 바로 다시 실행하지 않고, 즉시 retry 대상에서도 뺍니다.",
  },
  {
    label: "남은 것만 retry 후보",
    summary: "E_retry = {#104, #105}",
    note: "전체 plan에서 K와 U를 빼면 시작하지 않은 #104·#105만 남습니다. 이 둘만 즉시 retry 후보입니다.",
  },
  {
    label: "#103은 조회 뒤에 정합니다",
    summary: "조회 → resume · 필요하면 보상·승인",
    note: "#103은 provider receipt를 먼저 조회해 조정한 뒤 resume합니다. 필요하면 compensation(되돌리는 동작)이나 human approval로 보냅니다.",
  },
] as const;

function Chip({ label, color, faded }: { label: string; color: string; faded: boolean }) {
  return (
    <span
      className={`flex h-9 items-center justify-center rounded-md border font-mono text-xs font-bold transition-opacity sm:text-sm ${faded ? "opacity-25" : "opacity-100"}`}
      style={{ borderColor: color, color }}
    >
      {label}
    </span>
  );
}

export default function RetrySetViz() {
  return (
    <SceneShell
      eyebrow="Retry 전에 집합 나누기"
      title="다섯 write를 세 칸으로 나누면 즉시 다시 보낼 것은 두 개뿐입니다"
      description="#101·#102 성공, #103 timeout, #104·#105 미시작인 서론의 예를 그대로 씁니다. 각 effect에 조회 가능한 receipt와 idempotency key(같은 요청을 다시 보내도 한 번만 반영되게 하는 key)가 있다고 둡니다."
      ariaLabel="계획한 다섯 write를 완료, 미확정, 재시도 후보로 나누는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-4">
          <div>
            <p className="text-xs font-bold text-muted-foreground">E_plan</p>
            <div className="mt-1 grid grid-cols-5 gap-1">
              {ISSUES.map((issue, index) => (
                <Chip key={issue} label={issue} color="#64748b" faded={active >= MOVE_AT[index]} />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {LANES.map((lane, laneIndex) => {
              const members = ISSUES.filter((_, index) => LANE[index] === laneIndex);
              return (
                <div key={lane.title} className="min-w-0 rounded-lg border border-border bg-background p-2">
                  <p className="font-mono text-[11px] font-bold sm:text-xs" style={{ color: lane.color }}>{lane.title}</p>
                  <p className="text-[10px] leading-4 text-muted-foreground sm:text-[11px]">{lane.sub}</p>
                  <div className="mt-2 grid gap-1">
                    {[0, 1].map((slot) => {
                      const shown = slot < members.length && active >= MOVE_AT[ISSUES.indexOf(members[slot])];
                      return shown ? (
                        <Chip key={slot} label={members[slot]} color={lane.color} faded={false} />
                      ) : (
                        <span key={slot} className="h-9 rounded-md border border-dashed border-border/40" />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <p
            className={`rounded-md border px-3 py-2 text-center text-[11px] leading-5 transition-opacity sm:text-xs ${
              active === 4 ? "border-red-600 opacity-100" : "border-border opacity-25"
            }`}
          >
            #103 → provider receipt 조회 → 조정 후 resume · 필요하면 compensation / human approval
          </p>
        </div>
      )}
    />
  );
}
