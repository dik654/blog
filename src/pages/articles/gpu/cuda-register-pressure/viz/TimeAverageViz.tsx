import SceneShell from "./SceneShell";

/**
 * 본문 대응: #occupancy-wave — 같은 시간의 두 회차 25%와 6.25%, 전체 경과 시간 평균 15.625%.
 * 가로 = 시간(회차 길이가 같다고 가정), 세로 = 하드웨어 256 warps 대비 비율.
 */
const FIRST = (64 / 256) * 100;
const SECOND = (16 / 256) * 100;
const AVERAGE = (FIRST + SECOND) / 2;
const BASE = 150;
const PER_PERCENT = 4.4;
const X0 = 44;
const SLICE = 150;
const h = (percent: number) => percent * PER_PERCENT;

const SCENES = [
  { label: "첫 회차", summary: "64/256 = 25%", note: "SM 4개의 분모는 4×64=256 warps입니다. block 8개, warp 64개가 놓이면 25%입니다." },
  { label: "다음 회차", summary: "16/256 = 6.25%", note: "남은 block 2개, warp 16개입니다. 분모는 그대로 256이라 막대가 낮아집니다. 두 회차의 시간은 같다고 놓았습니다(가정)." },
  { label: "전체 시간으로 평균", summary: "(25+6.25)/2 = 15.625%", note: "모든 SM을 전체 경과 시간으로 평균 낸 값입니다. 점선 높이로 두 칸을 채운 넓이가 두 막대의 넓이 합과 같습니다. 특정 Nsight metric의 출력값이 아니며, SM이 활동한 cycle만 분모로 삼으면 비어 있는 시간의 취급이 달라집니다." },
] as const;

function Slice({ x, percent, text, name }: { x: number; percent: number; text: string; name: string }) {
  return (
    <g>
      <rect x={x + 4} y={BASE - h(percent)} width={SLICE - 8} height={h(percent)} fill="#2563eb" opacity={0.3} stroke="#2563eb" strokeWidth={1} />
      <text x={x + SLICE / 2} y={BASE - h(percent) - 6} fontSize={12} fontWeight={700} textAnchor="middle" fill="#2563eb">{text}</text>
      <text x={x + SLICE / 2} y={BASE + 16} fontSize={12} textAnchor="middle" fill="#64748b">{name}</text>
    </g>
  );
}

export default function TimeAverageViz() {
  return (
    <SceneShell
      eyebrow="시간 평균"
      title="두 회차를 시간으로 평균하면 15.625%가 됩니다"
      description="96 registers/thread·256-thread block을 SM 4개에 적용하고 block 10개가 같은 시간 동안 일한다고 가정한 계산입니다. 가로는 시간, 세로는 하드웨어 최대 warp 대비 비율입니다."
      ariaLabel="두 회차의 비율과 전체 시간 평균"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 176" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {[0, 25].map((tick) => (
            <g key={tick}>
              <line x1={X0} x2={X0 + 2 * SLICE} y1={BASE - h(tick)} y2={BASE - h(tick)} stroke="#94a3b8" strokeWidth={1} opacity={0.5} />
              <text x={X0 - 6} y={BASE - h(tick) + 4} fontSize={11} textAnchor="end" fill="#64748b">{tick}%</text>
            </g>
          ))}
          <Slice x={X0} percent={FIRST} text="25%" name="첫 회차" />
          {active >= 1 ? (
            <Slice x={X0 + SLICE} percent={SECOND} text="6.25%" name="다음 회차" />
          ) : (
            <text x={X0 + SLICE * 1.5} y={BASE + 16} fontSize={12} textAnchor="middle" fill="#94a3b8">다음 회차</text>
          )}
          {active === 2 && (
            <>
              <line x1={X0} x2={X0 + 2 * SLICE} y1={BASE - h(AVERAGE)} y2={BASE - h(AVERAGE)} stroke="#d97706" strokeWidth={1.25} strokeDasharray="4 3" />
              <text x={X0 + 2 * SLICE} y={BASE - h(AVERAGE) - 6} fontSize={12} fontWeight={700} textAnchor="end" fill="#d97706">평균 15.625%</text>
            </>
          )}
        </svg>
      )}
    />
  );
}
