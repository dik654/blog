import SceneShell from "./SceneShell";

/**
 * 본문 대응: #load — 열린 부하는 서버 상태와 무관하게 보내고, 닫힌 부하는 요청이 끝나야 다음을 보내
 * 실제 도착률이 서버 속도에 묶인다. 에이전트 세션은 답을 받고 도구를 실행한 뒤에야 다음 요청을 보내며
 * 같은 앞부분이 턴마다 다시 들어간다.
 * 숫자는 모두 설명용 가정: 서버 1개, 요청 하나 처리 1.5 s, 열린 부하 1 req/s, 닫힌 부하 N = 2.
 * 열린 부하: 도착 0,1,…,9 s, 시작 1.5·i → t = 10 s 에 도착 10·완료 6·처리 중 1·대기 3.
 * 닫힌 부하: 처리가 끝나는 1.5 s 간격으로만 다음 요청 → t = 10 s 에 도착 8·완료 6·처리 중 1·대기 1.
 * 에이전트 세션: 같은 처리 1.5 s + 도구 실행 2 s(가정) → 요청은 0·3.5·7 s 에 나간다.
 */
const SERVICE = 1.5;
const T_END = 10;
const X0 = 88;
const X1 = 462;
const tx = (t: number) => X0 + (t / T_END) * (X1 - X0);

const OPEN_ARRIVALS: readonly number[] = Array.from({ length: 10 }, (_, i) => i);
const OPEN_STARTS: readonly number[] = OPEN_ARRIVALS.map((_, i) => i * SERVICE);
const CLOSED_ARRIVALS: readonly number[] = [0, 0, 1.5, 3, 4.5, 6, 7.5, 9];
const CLOSED_OWNER: readonly string[] = ["A", "B", "A", "B", "A", "B", "A", "B"];
const CLOSED_STARTS: readonly number[] = CLOSED_ARRIVALS.map((_, i) => i * SERVICE);

/** 각 사건 직후의 대기 요청 수(도착 − 시작)를 계단으로 돌려줍니다. */
function waitingSteps(arrivals: readonly number[], starts: readonly number[]) {
  const times = Array.from(new Set([...arrivals, ...starts])).filter((t) => t <= T_END).sort((a, b) => a - b);
  return times.map((t) => ({
    t,
    n: arrivals.filter((a) => a <= t).length - starts.filter((s) => s <= t).length,
  }));
}

const OPEN_WAIT = waitingSteps(OPEN_ARRIVALS, OPEN_STARTS);
const CLOSED_WAIT = waitingSteps(CLOSED_ARRIVALS, CLOSED_STARTS);
const WAIT_MAX = 4;

const AGENT_TURNS = [
  { send: 0, serve: [0, 1.5], tool: [1.5, 3.5] },
  { send: 3.5, serve: [3.5, 5], tool: [5, 7] },
  { send: 7, serve: [7, 8.5], tool: null },
] as const;

const SCENES = [
  {
    label: "열린 부하",
    summary: "10 s 동안 10개 도착 · 대기 3",
    note: "서버 상태와 무관하게 1초마다 하나씩 보냅니다(가정). 처리는 1.5초에 하나라 보낸 속도를 못 따라가고, 기다리는 요청이 0에서 3까지 쌓입니다. λ 가 처리 능력을 넘으면 대기열이 늘어 용량 경계가 보입니다.",
  },
  {
    label: "닫힌 부하 N = 2",
    summary: "10 s 동안 8개 도착 · 대기 ≤ 1",
    note: "두 클라이언트가 각자 앞 요청이 끝나야 다음을 보냅니다(가정). 그래서 첫 두 요청 뒤로는 처리가 끝나는 1.5초 간격으로만 도착이 생기고, 대기열은 1을 넘지 않습니다. 도착률이 서버 속도에 묶여 독립 변수가 아니게 됩니다.",
  },
  {
    label: "에이전트 세션",
    summary: "답 → 도구 실행 → 다음 요청",
    note: "한 세션은 답을 받아 도구를 실행한 뒤에야 다음 요청을 보내고, 매 요청에 같은 앞부분이 다시 들어갑니다. 그래서 독립 요청의 도착률 λ 대신, 실제 세션 기록을 순서와 대기 시간까지 재생해 약속을 지키며 동시에 돌릴 수 있는 에이전트 수로 결과를 냅니다.",
  },
] as const;

function Axis() {
  return (
    <g>
      <line x1={X0} y1={186} x2={X1} y2={186} stroke="#94a3b8" strokeWidth={1} />
      {[0, 2, 4, 6, 8, 10].map((t) => (
        <g key={t}>
          <line x1={tx(t)} y1={186} x2={tx(t)} y2={190} stroke="#94a3b8" strokeWidth={1} />
          <text x={tx(t)} y={204} textAnchor="middle" fontSize={13} fill="#64748b">{t}</text>
        </g>
      ))}
      <text x={X1} y={222} textAnchor="end" fontSize={13} fill="#64748b">시간(초, 가정)</text>
    </g>
  );
}

function LaneLabel({ y, text }: { y: number; text: string }) {
  return <text x={2} y={y} fontSize={13} fontWeight={700} fill="#475569">{text}</text>;
}

function QueueChart({ steps }: { steps: readonly { t: number; n: number }[] }) {
  const base = 172;
  const unit = 11;
  const points = steps.flatMap((s, i) => {
    const next = i + 1 < steps.length ? steps[i + 1].t : T_END;
    return [`${tx(s.t)},${base - s.n * unit}`, `${tx(next)},${base - s.n * unit}`];
  });
  const last = steps[steps.length - 1];
  return (
    <g>
      <LaneLabel y={160} text="대기 수" />
      <line x1={X0} y1={base} x2={X1} y2={base} stroke="#cbd5e1" strokeWidth={1} />
      {Array.from({ length: WAIT_MAX }, (_, i) => i + 1).map((n) => (
        <text key={n} x={X0 - 6} y={base - n * unit + 4} textAnchor="end" fontSize={11} fill="#94a3b8">{n}</text>
      ))}
      <polyline points={points.join(" ")} fill="none" stroke="#dc2626" strokeWidth={1.25} />
      <text x={tx(T_END) - 2} y={base - last.n * unit - 5} textAnchor="end" fontSize={13} fontWeight={700} fill="#dc2626">{`대기 ${last.n}`}</text>
    </g>
  );
}

function LoadScene({ open }: { open: boolean }) {
  const arrivals = open ? OPEN_ARRIVALS : CLOSED_ARRIVALS;
  const starts = open ? OPEN_STARTS : CLOSED_STARTS;
  return (
    <g>
      <LaneLabel y={40} text={open ? "보냄" : "A·B 보냄"} />
      <line x1={X0} y1={44} x2={X1} y2={44} stroke="#e2e8f0" strokeWidth={1} />
      {arrivals.map((a, i) => {
        const dup = arrivals.slice(0, i).filter((b) => b === a).length;
        const y = 44 - dup * 16;
        return (
          <g key={i}>
            <line x1={tx(a)} y1={y} x2={tx(a)} y2={y - 12} stroke="#2563eb" strokeWidth={1.25} />
            <circle cx={tx(a)} cy={y - 12} r={2.5} fill="#2563eb" />
            {open ? null : <text x={tx(a) + 4} y={y - 4} fontSize={12} fill="#2563eb">{CLOSED_OWNER[i]}</text>}
          </g>
        );
      })}
      <LaneLabel y={90} text="서버" />
      {starts
        .filter((s) => s < T_END)
        .map((s, i) => (
          <g key={i}>
            <rect x={tx(s) + 1} y={74} width={Math.min(tx(s + SERVICE), X1) - tx(s) - 2} height={22} rx={3} fill="#dbeafe" stroke="#2563eb" strokeWidth={1} />
            <text x={(tx(s) + Math.min(tx(s + SERVICE), X1)) / 2} y={90} textAnchor="middle" fontSize={13} fill="#1e3a8a">{open ? i + 1 : CLOSED_OWNER[i]}</text>
          </g>
        ))}
      <text x={X1} y={114} textAnchor="end" fontSize={12} fill="#64748b">칸 하나 = 요청 하나 처리 1.5 s (가정)</text>
      <QueueChart steps={open ? OPEN_WAIT : CLOSED_WAIT} />
    </g>
  );
}

function AgentScene() {
  const blocks: readonly (readonly string[])[] = [["앞부분", "질문"], ["앞부분", "이전 턴", "새 입력"], ["앞부분", "이전 턴", "새 입력"]];
  return (
    <g>
      <LaneLabel y={40} text="도구 실행" />
      {AGENT_TURNS.map((turn, i) =>
        turn.tool ? (
          <g key={i}>
            <rect x={tx(turn.tool[0]) + 1} y={26} width={tx(turn.tool[1]) - tx(turn.tool[0]) - 2} height={20} rx={3} fill="#fef3c7" stroke="#d97706" strokeWidth={1} />
            <text x={(tx(turn.tool[0]) + tx(turn.tool[1])) / 2} y={41} textAnchor="middle" fontSize={13} fill="#92400e">도구</text>
          </g>
        ) : null,
      )}
      <LaneLabel y={90} text="서버" />
      {AGENT_TURNS.map((turn, i) => (
        <g key={i}>
          <rect x={tx(turn.serve[0]) + 1} y={74} width={tx(turn.serve[1]) - tx(turn.serve[0]) - 2} height={22} rx={3} fill="#dbeafe" stroke="#2563eb" strokeWidth={1} />
          <text x={(tx(turn.serve[0]) + tx(turn.serve[1])) / 2} y={90} textAnchor="middle" fontSize={13} fill="#1e3a8a">{`요청 ${i + 1}`}</text>
          {i > 0 ? <line x1={tx(turn.send)} y1={46} x2={tx(turn.send)} y2={74} stroke="#d97706" strokeWidth={1} strokeDasharray="3 2" /> : null}
        </g>
      ))}
      <LaneLabel y={130} text="요청 입력" />
      {AGENT_TURNS.map((turn, i) => {
        const parts = blocks[i];
        const width = tx(turn.serve[1]) - tx(turn.serve[0]) - 4;
        return (
          <g key={i}>
            {parts.map((part, j) => (
              <g key={part}>
                <rect
                  x={tx(turn.serve[0]) + 2}
                  y={116 + j * 21}
                  width={width}
                  height={19}
                  rx={2}
                  fill={j === 0 ? "#e2e8f0" : "#f1f5f9"}
                  stroke={j === 0 ? "#475569" : "#94a3b8"}
                  strokeWidth={1}
                />
                <text x={tx(turn.serve[0]) + 5} y={130 + j * 21} fontSize={12} fill="#334155">{part}</text>
              </g>
            ))}
          </g>
        );
      })}
    </g>
  );
}

export default function LoadLoopViz() {
  return (
    <SceneShell
      eyebrow="부하를 거는 방식"
      title="닫힌 부하에서는 도착이 서버 속도를 따라갑니다"
      description="같은 서버(요청 하나 처리 1.5초, 가정)에 세 방식으로 요청을 보냅니다. 파란 점은 요청을 보낸 시각, 파란 칸은 서버가 그 요청을 처리한 시간, 빨간 선은 서버 앞에서 기다리는 요청 수입니다."
      note="서버 1개, 처리 1.5초, 1초 간격, 클라이언트 2개, 도구 실행 2초는 모두 설명용 가정입니다. 실제 LLM 서버는 batch 로 여러 요청을 함께 처리합니다. 마지막 장면의 칸 너비는 token 길이를 나타내지 않습니다."
      ariaLabel="열린 부하, 닫힌 부하, 에이전트 세션에서 요청을 보내는 시각과 대기열"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 480 228" className="h-auto w-full" role="img" aria-label={SCENES[active].label}>
          {active === 2 ? <AgentScene /> : <LoadScene open={active === 0} />}
          <Axis />
        </svg>
      )}
    />
  );
}
