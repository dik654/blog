import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 다음 주소가 직전 값에 의존하면 통로를 채우지 못할 수 있습니다.
 * 격자 전체가 가정입니다. 통로 8줄(또는 16줄), 시간 12칸, 요청에서 값까지 3칸.
 * 앞서 주소를 아는 경우: t=3~11의 9칸 × 8줄 = 72개. 의존하는 경우: t=3, 6, 9의 3개.
 */
const COLS = 12;
const LANES = 16;
const LATENCY = 3;
const CHASE_TIMES = [3, 6, 9] as readonly number[];
const SCENES = [
  { label: "주소를 미리 아는 요청", summary: "8줄 × 9칸 = 72개(가정)", lanes: 8, chase: false, note: "주소를 값과 상관없이 미리 안다면 앞 요청의 답을 기다리지 않고 다음 요청을 보낼 수 있습니다. 첫 값이 올 때까지의 3칸은 그대로지만 그 뒤로 통로가 찹니다." },
  { label: "다음 주소가 직전 값에 달린 요청", summary: "1줄에서 3개(가정)", lanes: 8, chase: true, note: "pointer chasing은 읽은 값이 다음 주소가 되는 작업입니다. 값이 와야 다음 요청을 보낼 수 있으니, 그동안 나머지 칸은 비어 있을 수 있습니다." },
  { label: "통로를 두 배로 넓혀도", summary: "여전히 3개(가정)", lanes: 16, chase: true, note: "폭을 16줄로 넓혀도 한 번에 값 하나만 기다리는 이 작업에는 칸이 더 비어 있을 뿐입니다. 이런 작업은 넓은 통로보다 지연에 묶일 수 있습니다." },
] as const;

const X0 = 34;
const Y0 = 24;
const CELL_W = 26;
const CELL_H = 8;
const TIMES = Array.from({ length: COLS }, (_, index) => index);
const LANE_IDS = Array.from({ length: LANES }, (_, index) => index);

export default function PointerChaseViz() {
  return (
    <SceneShell
      eyebrow="폭이 못 푸는 기다림"
      title="한 번에 값 하나만 기다리면 넓은 통로가 비어 있을 수 있습니다"
      description="가로줄 하나가 통로 한 줄, 칸 하나가 시간 한 칸입니다. 줄 수와 칸 수, 요청에서 값까지 3칸은 모두 그림의 가정입니다."
      ariaLabel="주소를 미리 아는 요청과 직전 값에 의존하는 요청이 통로를 채우는 정도 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const filled = (lane: number, time: number) => {
          if (lane >= scene.lanes) return false;
          if (scene.chase) return lane === 0 && CHASE_TIMES.includes(time);
          return time >= LATENCY;
        };
        return (
          <svg viewBox="0 0 360 196" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={X0} y={15} fontSize={12} fontWeight={700} fill="#64748b">시간 →</text>
            <text x={X0 - 6} y={Y0 + 7} textAnchor="end" fontSize={12} fill="#64748b">통로</text>
            {LANE_IDS.map((lane) => TIMES.map((time) => {
              const exists = lane < scene.lanes;
              const on = filled(lane, time);
              return (
                <rect
                  key={`${lane}-${time}`}
                  x={X0 + time * CELL_W}
                  y={Y0 + lane * CELL_H}
                  width={CELL_W - 2}
                  height={CELL_H - 1.5}
                  fill={on ? "#2563eb" : exists ? "#94a3b8" : "none"}
                  fillOpacity={on ? 0.85 : exists ? 0.2 : 0}
                  stroke={exists ? "none" : "#94a3b8"}
                  strokeOpacity={0.35}
                  strokeWidth={0.5}
                />
              );
            }))}
                        <text x={X0} y={Y0 + LANES * CELL_H + 18} fontSize={12} fill="#64748b">진한 칸 = 돌아온 값 · 요청 → 값 = 3칸(가정)</text>
            {scene.lanes === 8 && <text x={X0} y={Y0 + LANES * CELL_H + 36} fontSize={12} fill="#64748b">테두리만 있는 줄 = 아직 없는 통로</text>}
          </svg>
        );
      }}
    />
  );
}
