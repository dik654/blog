import SceneShell from "./SceneShell";

/**
 * 본문 대응: #degraded-release — timeout은 "결과 없음"과 다르고, retry해도 첫 attempt의 effect 가능성은 남는다.
 * retry는 새 request identity를 쓰고 늦게 온 old response와 구분해야 한다. write tool은 operation key·status lookup·effect receipt가 필요하다.
 * 가로축은 순서만 나타내며 시간 눈금은 없다. retry의 id 4는 설명용 가정이다.
 */
const W = 340;
const H = 168;
const CLAW_Y = 40;
const SERVER_Y = 128;
const X0 = 62;

const SCENES = [
  { label: "첫 attempt timeout", summary: "id 3 → 응답 없이 timeout", note: "id 3 request를 보냈지만 deadline 안에 response가 오지 않았습니다. 이 상태는 “검색 결과 없음”과 다릅니다." },
  { label: "Server 쪽은 모름", summary: "effect를 냈을 수도 있음", note: "Client가 timeout을 냈다고 server가 아무 일도 안 했다는 뜻은 아닙니다. Reset이나 retry를 해도 첫 attempt가 effect를 냈을 가능성은 지워지지 않습니다." },
  { label: "새 identity로 retry", summary: "id 4 (가정) · id 3은 늦게 도착", note: "Retry에는 새 request identity를 씁니다(여기서는 id 4로 가정). 그 뒤 id 3의 response가 늦게 와도 ID가 달라 retry 결과와 구분할 수 있습니다. Request ID·attempt를 잃으면 이 둘을 혼동합니다." },
  { label: "Write tool이라면", summary: "effect가 두 번 생길 수 있음", note: "아래 두 칸의 물음표는 effect가 생겼는지 client가 모른다는 뜻입니다. Read-only search와 write tool은 같은 retry policy를 쓰면 안 됩니다. Write는 두 attempt가 모두 effect를 낼 수 있으므로 operation key·status lookup·effect receipt가 필요하고, release gate에서 duplicate effect가 0이어야 합니다." },
] as const;

const LEGEND = [
  { mark: "1", text: "id 3 request", from: 0 },
  { mark: "2", text: "timeout", from: 0 },
  { mark: "3", text: "id 4 retry (가정)", from: 2 },
  { mark: "4", text: "id 3 늦은 response", from: 2 },
] as const;

function Badge({ x, y, mark, on }: { x: number; y: number; mark: string; on: boolean }) {
  return (
    <g opacity={on ? 1 : 0.15}>
      <circle cx={x} cy={y} r={8} fill="#ffffff" stroke="#64748b" strokeWidth={1} />
      <text x={x} y={y + 3.5} textAnchor="middle" fontSize={10} fontWeight={700} fill="#64748b">{mark}</text>
    </g>
  );
}

export default function RetryTimelineViz() {
  return (
    <SceneShell
      eyebrow="Timeout과 retry"
      title="Timeout 뒤에도 첫 요청은 server에서 효과를 냈을 수 있습니다"
      description="위 줄은 Claw manager, 아래 줄은 docs server입니다. 가로는 일이 일어난 순서만 뜻하며 시간 눈금은 없습니다."
      ariaLabel="첫 attempt timeout, server 쪽 불확실성, 새 ID로 retry와 늦은 response, write tool의 중복 effect를 순서대로 보여 주는 장면"
      scenes={SCENES}
      render={(active) => {
        const retryOn = active >= 2;
        const unknownOn = active >= 1;
        const writeOn = active === 3;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <defs>
                <marker id={`retry-arrow-${active}`} viewBox="0 0 8 8" refX={7} refY={4} markerWidth={7} markerHeight={7} orient="auto">
                  <path d="M0,0 L8,4 L0,8 z" fill="#64748b" />
                </marker>
              </defs>
              <text x={8} y={CLAW_Y + 4} fontSize={11} fontWeight={700} fill="#64748b">Claw</text>
              <text x={8} y={SERVER_Y + 4} fontSize={11} fontWeight={700} fill="#64748b">server</text>
              <line x1={X0} x2={W - 8} y1={CLAW_Y} y2={CLAW_Y} stroke="#94a3b8" strokeWidth={1} />
              <line x1={X0} x2={W - 8} y1={SERVER_Y} y2={SERVER_Y} stroke="#94a3b8" strokeWidth={1} />

              {/* 1: id 3 request */}
              <line x1={78} y1={CLAW_Y} x2={112} y2={SERVER_Y - 2} stroke="#64748b" strokeWidth={1} markerEnd={`url(#retry-arrow-${active})`} />
              <Badge x={88} y={72} mark="1" on />
              {/* first attempt effect on server */}
              <rect x={112} y={SERVER_Y + 6} width={50} height={20} rx={4} fill="none" stroke={unknownOn ? "#d97706" : "#cbd5e1"} strokeWidth={1} strokeDasharray="3 3" />
              <text x={137} y={SERVER_Y + 20} textAnchor="middle" fontSize={10} fill={unknownOn ? "#b45309" : "#94a3b8"}>effect?</text>
              {/* 2: timeout */}
              <line x1={160} x2={160} y1={CLAW_Y - 12} y2={CLAW_Y + 12} stroke="#dc2626" strokeWidth={1.25} />
              <Badge x={160} y={CLAW_Y - 22} mark="2" on />

              {/* 3: retry id 4 */}
              <g opacity={retryOn ? 1 : 0.12}>
                <line x1={196} y1={CLAW_Y} x2={236} y2={SERVER_Y - 2} stroke="#2563eb" strokeWidth={1} markerEnd={`url(#retry-arrow-${active})`} />
              </g>
              <Badge x={200} y={84} mark="3" on={retryOn} />
              {/* 4: late response id 3 */}
              <g opacity={retryOn ? 1 : 0.12}>
                <line x1={252} y1={SERVER_Y} x2={286} y2={CLAW_Y + 2} stroke="#64748b" strokeWidth={1} strokeDasharray="4 3" markerEnd={`url(#retry-arrow-${active})`} />
              </g>
              <Badge x={278} y={84} mark="4" on={retryOn} />
              {/* second effect if write */}
              <rect x={236} y={SERVER_Y + 6} width={58} height={20} rx={4} fill="none" stroke={writeOn ? "#dc2626" : "#cbd5e1"} strokeWidth={1} strokeDasharray="3 3" opacity={retryOn ? 1 : 0.12} />
              <text x={265} y={SERVER_Y + 20} textAnchor="middle" fontSize={10} fill={writeOn ? "#b91c1c" : "#94a3b8"} opacity={retryOn ? 1 : 0.12}>
                {writeOn ? "effect 2?" : "attempt 2"}
              </text>
              <text x={W - 8} y={H - 4} textAnchor="end" fontSize={10} fill="#64748b">순서 →</text>
            </svg>
            <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-xs leading-5">
              {LEGEND.map((item) => (
                <li key={item.mark} className={active >= item.from ? "text-foreground" : "text-muted-foreground/50"}>
                  <span className="mr-1 font-mono font-bold">{item.mark}</span>
                  {item.text}
                </li>
              ))}
            </ul>
            <p className={`mt-2 rounded-md border px-3 py-2 text-xs leading-5 ${writeOn ? "border-red-600 text-red-700 dark:text-red-400" : "border-dashed border-border text-muted-foreground"}`}>
              Write tool에 필요한 것: operation key · status lookup · effect receipt
            </p>
          </div>
        );
      }}
    />
  );
}
