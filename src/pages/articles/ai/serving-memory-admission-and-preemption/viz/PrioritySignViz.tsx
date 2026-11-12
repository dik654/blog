import SceneShell from "./SceneShell";

/**
 * 본문 대응: #long-context-isolation의 priority 문단.
 * vLLM priority 정책: block 할당 실패 시 running 중 (priority, 도착 시각)이 가장 큰 요청을 뺀다. 작을수록 먼저 처리.
 * llm-d InferenceObjective: 클수록 중요, 음수는 버려도 되는 요청.
 * 대화형 0·일괄 10(vLLM, 본문 예) / 대화형 10·일괄 0(llm-d, 가정) → 그대로 넘기면 대화형이, 부호를 뒤집으면(−10, 0) 일괄이 빠진다.
 */
type Req = { name: string; arrival: string; value: number };

const SCENES = [
  {
    label: "vLLM: 값이 큰 쪽을 먼저 뺍니다",
    summary: "(10, 먼저) > (0, 나중) → 일괄",
    axis: "vllm",
    reqs: [
      { name: "대화형", arrival: "나중 도착", value: 0 },
      { name: "일괄 요약", arrival: "먼저 도착", value: 10 },
    ],
    note: "priority 정책을 켠 vLLM은 block 할당이 실패하면 running 목록에서 (priority, 도착 시각)이 가장 큰 요청을 뺍니다. 값이 작을수록 먼저 처리하므로 대화형 0·일괄 10이면 일찍 온 일괄 작업이 먼저 빠집니다.",
  },
  {
    label: "llm-d: 값이 클수록 중요합니다",
    summary: "대화형 10 · 일괄 0 (가정)",
    axis: "llmd",
    reqs: [
      { name: "대화형", arrival: "나중 도착", value: 10 },
      { name: "일괄 요약", arrival: "먼저 도착", value: 0 },
    ],
    note: "앞단 llm-d의 InferenceObjective는 반대로 값이 클수록 중요한 요청이고 음수를 버려도 되는 요청으로 봅니다. 그래서 대화형에 10, 일괄 작업에 0을 줬다고 합시다. 이 두 값은 설명용 가정입니다.",
  },
  {
    label: "그대로 넘기면",
    summary: "vLLM이 본 값 10 > 0 → 대화형",
    axis: "vllm",
    reqs: [
      { name: "대화형", arrival: "나중 도착", value: 10 },
      { name: "일괄 요약", arrival: "먼저 도착", value: 0 },
    ],
    note: "앞단의 10과 0을 그대로 vLLM에 넘기면 vLLM은 10을 덜 급한 요청으로 읽습니다. 공간이 모자랄 때 가장 중요한 대화형 요청부터 뺍니다.",
  },
  {
    label: "부호를 뒤집어 넘기면",
    summary: "0 > −10 → 일괄",
    axis: "vllm",
    reqs: [
      { name: "대화형", arrival: "나중 도착", value: -10 },
      { name: "일괄 요약", arrival: "먼저 도착", value: 0 },
    ],
    note: "넘기기 전에 부호를 뒤집으면 대화형은 −10, 일괄은 0이 됩니다. vLLM 기준으로 일괄 쪽 값이 더 크므로 일괄 작업이 먼저 빠지고, 두 층의 의도가 맞습니다.",
  },
] as const;

const MIN = -10;
const MAX = 10;
const X0 = 44;
const X1 = 316;
const AXIS_Y = 70;
const xOf = (v: number) => X0 + ((v - MIN) / (MAX - MIN)) * (X1 - X0);
const TICKS = [-10, -5, 0, 5, 10] as const;
const COLORS = ["#2563eb", "#d97706"] as const;

export default function PrioritySignViz() {
  return (
    <SceneShell
      eyebrow="priority의 방향"
      title="같은 priority 숫자를 두 층이 반대로 읽습니다"
      description="가로축은 priority 값입니다. 점 두 개는 대화형 요청과 일괄 요약 작업이고, 빨간 테두리가 공간이 모자랄 때 vLLM이 먼저 빼는(선점하는) 요청입니다."
      note="vLLM 쪽 0·10은 본문의 예이고, llm-d 쪽 10·0은 설명용 가정입니다. 두 층을 이어 쓰는 설정에서만 생기는 문제입니다."
      ariaLabel="vLLM과 llm-d의 priority 방향 차이와 부호를 뒤집어 넘길 때의 선점 대상"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const reqs: readonly Req[] = scene.reqs;
        const isVllm = scene.axis === "vllm";
        const victim = isVllm ? reqs.reduce<number>((best, r, i) => (r.value > reqs[best].value ? i : best), 0) : -1;
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 360 154" role="img" aria-label={`${scene.label}: ${scene.summary}`} className="h-auto w-full max-w-xl">
              <text x={X0} y={18} fontSize={11.5} fontWeight={700} fill={isVllm ? "#dc2626" : "#16a34a"}>
                {isVllm ? "vLLM이 읽는 방향 · 오른쪽일수록 먼저 빠짐" : "llm-d가 읽는 방향 · 오른쪽일수록 중요"}
              </text>
              <line x1={X0} y1={AXIS_Y} x2={X1} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
              <path d={`M ${X1} ${AXIS_Y} l -6 -3 l 0 6 z`} fill="#94a3b8" />
              {TICKS.map((t) => (
                <g key={t}>
                  <line x1={xOf(t)} y1={AXIS_Y - 3} x2={xOf(t)} y2={AXIS_Y + 3} stroke="#94a3b8" strokeWidth={1} />
                  <text x={xOf(t)} y={AXIS_Y + 16} fontSize={10.5} textAnchor="middle" fill="#64748b">
                    {t}
                  </text>
                </g>
              ))}
              {reqs.map((r, i) => {
                const x = xOf(r.value);
                const above = i === 0;
                const isVictim = i === victim;
                return (
                  <g key={r.name}>
                    <circle cx={x} cy={AXIS_Y} r={7} fill={COLORS[i]} stroke={isVictim ? "#dc2626" : "#ffffff"} strokeWidth={isVictim ? 1.25 : 1} />
                    {isVictim && <circle cx={x} cy={AXIS_Y} r={11} fill="none" stroke="#dc2626" strokeWidth={1.25} />}
                    <text x={x} y={above ? AXIS_Y - 31 : AXIS_Y + 38} fontSize={12.5} fontWeight={700} textAnchor="middle" fill={COLORS[i]}>
                      {r.name} {r.value}
                    </text>
                    <text x={x} y={above ? AXIS_Y - 18 : AXIS_Y + 51} fontSize={10.5} textAnchor="middle" fill="#64748b">
                      {r.arrival}
                    </text>
                  </g>
                );
              })}
              <text x={X0} y={146} fontSize={12} fontWeight={700} fill={isVllm ? "#dc2626" : "#64748b"}>
                {isVllm ? `먼저 빠지는 요청: ${reqs[victim]?.name ?? ""}` : "여기서는 아직 vLLM에 넘기지 않았습니다"}
              </text>
            </svg>
          </div>
        );
      }}
    />
  );
}
