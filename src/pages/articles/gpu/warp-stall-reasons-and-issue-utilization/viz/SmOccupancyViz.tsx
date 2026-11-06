import SceneShell from "./SceneShell";

/**
 * 본문 대응: #sm-utilization — SM 132개, block 66개면 66개가 빈다. 배수가 아니면 tail.
 * SM 하나에 block 하나(가정). tail 의 block 198개와 wave 길이가 같다는 조건은 가정: (132 + 66) / (132 × 2) = 75%.
 */
const TOTAL = 132;
const COLS = 12;
const CELL = 12;
const FILLED = "#2563eb";

const SCENES = [
  { label: "Block 66개", summary: "66 / 132 = 50%", note: "SM 하나에 block 하나를 얹는다고 하면(가정) 절반의 SM 은 처음부터 끝까지 비어 있습니다. SM utilization 은 50%를 넘지 못하고, 이 낮음의 원인은 stall 이 아닙니다." },
  { label: "배수가 아닌 block", summary: "block 198개 (가정) → tail", note: "Wave 는 한 번에 함께 SM 에 올라가는 block 묶음입니다. Block 198개는 132의 배수가 아니라 마지막 wave 에서 66개만 일하는 tail 이 생기고, 두 wave 길이가 같다면(가정) 평균은 75%입니다." },
  { label: "높은 issue active 의 함정", summary: "빈 SM 은 분모에 없음", note: "Issue active 는 warp 가 있던 active clock 안에서만 셉니다. 일하는 66개의 값이 높게 나와도 나머지 66개는 비어 있으니, issue active 가 높아도 chip 은 놀고 있을 수 있습니다." },
] as const;

function SmGrid({ x, y, filled, tint = FILLED }: { x: number; y: number; filled: number; tint?: string }) {
  return (
    <g>
      {Array.from({ length: TOTAL }, (_, index) => {
        const on = index < filled;
        return (
          <rect
            key={index}
            x={x + (index % COLS) * CELL}
            y={y + Math.floor(index / COLS) * CELL}
            width={CELL - 2}
            height={CELL - 2}
            fill={on ? tint : "none"}
            fillOpacity={on ? 0.55 : 1}
            stroke={on ? tint : "#94a3b8"}
            strokeOpacity={on ? 1 : 0.55}
            strokeWidth={1}
            strokeDasharray={on ? undefined : "2 2"}
          />
        );
      })}
    </g>
  );
}

export default function SmOccupancyViz() {
  return (
    <SceneShell
      eyebrow="SM 지도"
      title="SM 132개에 block 66개를 띄우면 절반은 처음부터 비어 있습니다"
      description="네모 하나가 SM 하나입니다. 채운 칸은 warp 가 있는 SM, 점선 칸은 빈 SM 입니다. SM 132개와 block 66개는 글의 가정값입니다."
      ariaLabel="SM 132개 위의 block 배치, tail, 빈 SM 과 issue active 의 관계"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 172" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 1 ? (
            <g>
              <text x={0} y={14} fontSize={12} fontWeight={700} fill="currentColor">wave 1 · 132개</text>
              <SmGrid x={0} y={24} filled={132} />
              <text x={200} y={14} fontSize={12} fontWeight={700} fill="currentColor">wave 2 · 66개 (tail)</text>
              <SmGrid x={200} y={24} filled={66} />
              <text x={162} y={90} textAnchor="middle" fontSize={15} fill="currentColor">→</text>
            </g>
          ) : (
            <g>
              <SmGrid x={0} y={24} filled={66} />
              <text x={0} y={14} fontSize={12} fontWeight={700} fill="currentColor">SM 132개</text>
              {active === 0 ? (
                <g fontSize={13} fill="currentColor">
                  <text x={170} y={52}>일하는 SM 66개</text>
                  <text x={170} y={76}>빈 SM 66개</text>
                  <text x={170} y={110} fontWeight={700}>SM utilization</text>
                  <text x={170} y={130} fontWeight={700}>상한 50%</text>
                </g>
              ) : (
                <g fontSize={13} fill="currentColor">
                  <text x={170} y={52} fontWeight={700}>issue active 의 분모</text>
                  <text x={170} y={72}>= 채운 66개의 clock</text>
                  <text x={170} y={110} fontWeight={700}>점선 66개</text>
                  <text x={170} y={130}>= SM utilization 만 낮춤</text>
                </g>
              )}
            </g>
          )}
        </svg>
      )}
    />
  );
}
