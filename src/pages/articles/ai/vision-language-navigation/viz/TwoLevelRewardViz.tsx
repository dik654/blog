import SceneShell from "./SceneShell";

/**
 * 본문 대응: #two-level-alignment 첫 문단 — reward 하나로 뭉치면
 * "목적지는 맞았지만 경로가 비효율적"과 "경로는 효율적이지만 목적지가 틀림"을 구분할 수 없다.
 * Episode A·B·C와 step별 채점 표시는 모두 가정이다.
 */
type Mark = "ok" | "detour" | "wrong";

const EPISODES = [
  { id: "A", steps: ["ok", "ok", "ok", "ok"] as readonly Mark[], arrived: true, verdict: "계획·제어 모두 지시대로" },
  { id: "B", steps: ["ok", "detour", "detour", "detour", "ok", "ok", "ok"] as readonly Mark[], arrived: true, verdict: "목적지는 맞고 경로가 비효율" },
  { id: "C", steps: ["ok", "ok", "ok", "wrong"] as readonly Mark[], arrived: false, verdict: "경로는 효율적이지만 목적지가 틀림" },
] as const;

const MAX_STEPS = 7;
const SLOTS = Array.from({ length: MAX_STEPS }, (_, index) => index);

const MARK_STYLE: Record<Mark, { fill: string; text: string; label: string }> = {
  ok: { fill: "#16a34a", text: "#ffffff", label: "✓" },
  detour: { fill: "#d97706", text: "#ffffff", label: "우회" },
  wrong: { fill: "#dc2626", text: "#ffffff", label: "✗" },
};

const SCENES = [
  {
    label: "Outcome reward만 볼 때",
    summary: "A = 1, B = 1, C = 0",
    note: "Outcome reward는 episode가 끝났을 때 목적지 도달 여부만 한 번 채점합니다. A와 B는 둘 다 1이라 B가 세 step을 돌아갔다는 사실이 신호에 남지 않습니다.",
  },
  {
    label: "Process reward를 step마다",
    summary: "B의 우회 3 step · C의 마지막 step",
    note: "Process reward는 각 step의 waypoint 선택과 이동이 지시문에 비춰 타당했는지 중간중간 채점합니다. B의 우회 step과 C가 다른 방으로 꺾은 step이 따로 드러납니다(표시는 가정).",
  },
  {
    label: "두 신호를 따로 읽기",
    summary: "어느 층이 틀렸는지 갈라짐",
    note: "두 신호를 나눠 두면 B는 경로 쪽, C는 목적지 쪽 실패로 구분됩니다. 다만 무엇을 '타당한 step'으로 볼지는 process reward 정의에 달려 있어 그 기준 자체가 설계 대상입니다.",
  },
] as const;

export default function TwoLevelRewardViz() {
  return (
    <SceneShell
      eyebrow="Outcome과 process를 나누는 이유"
      title="목적지 점수 하나로는 우회한 episode를 가려낼 수 없습니다"
      description="한 줄이 episode 하나이고 칸 하나가 step 하나입니다. 오른쪽은 episode 끝의 목적지 도달 여부입니다. A·B·C와 칸 표시는 가정입니다."
      ariaLabel="세 episode를 outcome reward와 process reward로 채점해 경로 문제와 목적지 문제를 구분하는 장면"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-2">
          {EPISODES.map((episode) => (
            <div key={episode.id} className="rounded-lg border border-border px-2 py-2 sm:px-3">
              <div className="grid grid-cols-[1.25rem_minmax(0,1fr)_3.25rem] items-center gap-2">
                <span className="font-mono text-sm font-bold">{episode.id}</span>
                <div className="grid min-w-0 gap-0.5" style={{ gridTemplateColumns: `repeat(${MAX_STEPS}, minmax(0, 1fr))` }}>
                  {SLOTS.map((slot) => {
                    const mark = episode.steps[slot];
                    if (!mark) return <span key={slot} />;
                    const scored = active >= 1;
                    const style = MARK_STYLE[mark];
                    return (
                      <span
                        key={slot}
                        className="grid h-6 place-items-center rounded-sm border text-[10px] font-bold"
                        style={
                          scored
                            ? { backgroundColor: style.fill, borderColor: style.fill, color: style.text }
                            : { borderColor: "#cbd5e1", color: "#94a3b8" }
                        }
                      >
                        {scored ? style.label : slot + 1}
                      </span>
                    );
                  })}
                </div>
                <span
                  className="grid h-6 place-items-center rounded-sm border font-mono text-xs font-bold"
                  style={{ borderColor: episode.arrived ? "#16a34a" : "#dc2626", color: episode.arrived ? "#16a34a" : "#dc2626" }}
                >
                  {episode.arrived ? "도착 1" : "실패 0"}
                </span>
              </div>
              <p className={`mt-1 pl-[1.75rem] text-[11px] leading-5 ${active === 2 ? "font-semibold text-foreground" : "text-transparent"}`} aria-hidden={active !== 2}>
                {episode.verdict}
              </p>
            </div>
          ))}
          <p className="min-h-[2.5rem] text-[11px] leading-5 text-muted-foreground">
            {active === 0 ? "칸 안 숫자 = step 번호 (아직 채점 안 함)" : "✓ 지시에 맞는 step · 우회 = 돌아간 step · ✗ 지시와 다른 방향"}
          </p>
        </div>
      )}
    />
  );
}
