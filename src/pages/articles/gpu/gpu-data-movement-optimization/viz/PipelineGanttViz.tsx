import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overlap — load 1.2, compute 0.8. 순서대로 T×2.0, 2-stage는 1.2 + (T−1)×1.2 + 0.8.
 * T=4(가정): 8.0 vs 5.6. T=100(본문): 200 vs 120.8.
 */
const L = 1.2;
const C = 0.8;
const T = 4;
const X0 = 54;
const PX = 34;
const LANE_H = 24;

const SCENES = [
  { label: "순서대로", summary: "4 × 2.0 = 8.0 µs", note: "Load가 끝나야 계산하고 계산이 끝나야 다음 load를 냅니다. 그림을 읽기 쉽도록 tile을 4개만 놓았습니다(가정)." },
  { label: "2-stage로 겹치면", summary: "4 tile = 5.6 µs", note: "Load 줄은 쉬지 않고, 계산은 자기 tile이 도착하자마자 시작합니다. 계산은 tile마다 0.4 µs 비지만 전체 시간은 load 줄의 박자로 갑니다." },
  { label: "세 토막으로 셉니다", summary: "1.2 + 3 × 1.2 + 0.8 = 5.6 µs", note: "첫 load는 겹칠 계산이 없고 마지막 계산은 겹칠 load가 없습니다. 그 사이 T−1개 구간만 max(1.2, 0.8) = 1.2 µs로 흐릅니다." },
  { label: "100 tile로 늘리면", summary: "200 µs → 120.8 µs", note: "같은 세 토막에 T = 100을 넣으면 1.2 + 99 × 1.2 + 0.8 = 120.8 µs입니다. 이상적인 조건의 산수이고, 시작과 끝은 숨길 수 없으며 정상 구간의 남은 병목은 load입니다." },
] as const;

function Block({ start, length, y, kind, label }: { start: number; length: number; y: number; kind: "load" | "compute"; label: string }) {
  const color = kind === "load" ? "#d97706" : "#2563eb";
  return (
    <g>
      <rect x={X0 + start * PX + 0.5} y={y} width={length * PX - 1} height={LANE_H - 4} rx={2} fill={color} fillOpacity={kind === "load" ? 0.3 : 0.9} stroke={color} strokeWidth={1} strokeDasharray={kind === "load" ? "4 2" : undefined} />
      <text x={X0 + (start + length / 2) * PX} y={y + 14} textAnchor="middle" fontSize={10} fontWeight={700} fill={kind === "load" ? "currentColor" : "#ffffff"}>{label}</text>
    </g>
  );
}

function Span({ start, end, y, label }: { start: number; end: number; y: number; label: string }) {
  const x1 = X0 + start * PX + 1;
  const x2 = X0 + end * PX - 1;
  return (
    <g>
      <polyline points={`${x1},${y - 5} ${x1},${y} ${x2},${y} ${x2},${y - 5}`} fill="none" stroke="#64748b" strokeWidth={1} />
      <text x={(x1 + x2) / 2} y={y + 14} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">{label}</text>
    </g>
  );
}

export default function PipelineGanttViz() {
  return (
    <SceneShell
      eyebrow="겹침의 시간표"
      title="100 tile이 120.8 µs가 되는 세 토막"
      description="가로축이 시간입니다. 점선 상자는 load, 진한 상자는 계산이고 번호는 tile 번호입니다. Load 1.2 µs와 계산 0.8 µs는 본문의 예시 값이고, 2-stage는 tile을 받는 shared memory 칸을 두 벌 둔 pipeline입니다."
      ariaLabel="load와 계산을 순서대로 할 때와 겹칠 때의 시간표"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 340 136" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 && (
            <g>
              <text x={X0 - 6} y={36} textAnchor="end" fontSize={11} fill="#64748b">한 줄</text>
              {Array.from({ length: T }, (_, k) => (
                <g key={k}>
                  <Block start={k * (L + C)} length={L} y={22} kind="load" label={`L${k}`} />
                  <Block start={k * (L + C) + L} length={C} y={22} kind="compute" label={`C${k}`} />
                </g>
              ))}
            </g>
          )}
          {(active === 1 || active === 2) && (
            <g>
              <text x={X0 - 6} y={24} textAnchor="end" fontSize={11} fill="#64748b">load</text>
              <text x={X0 - 6} y={50} textAnchor="end" fontSize={11} fill="#64748b">계산</text>
              {Array.from({ length: T }, (_, k) => (
                <g key={k}>
                  <Block start={k * L} length={L} y={10} kind="load" label={`L${k}`} />
                  <Block start={(k + 1) * L} length={C} y={36} kind="compute" label={`C${k}`} />
                </g>
              ))}
              {active === 2 && (
                <g>
                  <Span start={0} end={L} y={68} label="1.2" />
                  <Span start={L} end={T * L} y={68} label="3구간 × 1.2" />
                  <Span start={T * L} end={T * L + C} y={68} label="0.8" />
                </g>
              )}
            </g>
          )}
          {active === 3 && (
            <g>
              <text x={8} y={18} fontSize={11} fontWeight={700} fill="currentColor">순서대로 · 100 × 2.0</text>
              <rect x={8} y={24} width={300} height={18} rx={2} fill="#64748b" />
              <text x={332} y={38} textAnchor="end" fontSize={11} fontWeight={700} fill="currentColor">200</text>
              <text x={8} y={68} fontSize={11} fontWeight={700} fill="currentColor">겹침 · 1.2 + 99 × 1.2 + 0.8</text>
              <rect x={8} y={74} width={120.8 * 1.5} height={18} rx={2} fill="#2563eb" />
              <text x={8 + 120.8 * 1.5 + 6} y={88} fontSize={11} fontWeight={700} fill="currentColor">120.8</text>
            </g>
          )}
          {active !== 3 && (
            <g>
              {[0, 2, 4, 6, 8].map((tick) => (
                <g key={tick}>
                  <line x1={X0 + tick * PX} x2={X0 + tick * PX} y1={100} y2={105} stroke="#94a3b8" strokeWidth={1} />
                  <text x={X0 + tick * PX} y={119} textAnchor={tick === 8 ? "end" : "middle"} fontSize={11} fill="#64748b">{tick}</text>
                </g>
              ))}
              <line x1={X0} x2={X0 + 8 * PX} y1={100} y2={100} stroke="#94a3b8" strokeWidth={1} />
              <text x={X0} y={133} fontSize={11} fill="#64748b">µs</text>
            </g>
          )}
          {active === 3 && <text x={8} y={118} fontSize={11} fill="#64748b">단위 µs · 막대 길이는 같은 축</text>}
        </svg>
      )}
    />
  );
}
