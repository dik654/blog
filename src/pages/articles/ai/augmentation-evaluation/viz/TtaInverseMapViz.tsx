import SceneShell from "./SceneShell";

/**
 * 본문 대응: #tta — spatial output은 Tₖ⁻¹로 원래 좌표에 되돌린 뒤 같은 위치끼리 평균한다.
 * 가정: 8칸 한 줄 이미지, 물체는 칸 2–3, view 2개(원본 + 좌우 flip), model은 각 view에서 정확히 맞힘.
 * 바로 평균: 칸 2·3·6·7이 0.5 → 물체가 두 군데로 흐려짐. 되돌린 뒤 평균: 칸 2·3만 1.0.
 */
const CELLS = 8;
const OBJECT: readonly number[] = [1, 2];
const flipIndex = (i: number) => CELLS - 1 - i;

const baseMask = Array.from({ length: CELLS }, (_, i) => (OBJECT.includes(i) ? 1 : 0));
const flippedMask = Array.from({ length: CELLS }, (_, i) => baseMask[flipIndex(i)]);
const naiveAvg = baseMask.map((v, i) => (v + flippedMask[i]) / 2);
const restored = Array.from({ length: CELLS }, (_, i) => flippedMask[flipIndex(i)]);
const alignedAvg = baseMask.map((v, i) => (v + restored[i]) / 2);

const ACCENT = "#2563eb";
const FLIP = "#d97706";
const WRONG = "#dc2626";
const MUTED = "#64748b";

interface Strip {
  name: string;
  values: readonly number[];
  color: string;
}

const SCENES = [
  {
    label: "원본 view",
    summary: "물체 칸 2–3 → mask 칸 2–3",
    note: "첫 view는 원본 그대로입니다. Model이 낸 mask(물체 칸을 1로 칠한 output)는 원래 칸 2–3에 있습니다.",
  },
  {
    label: "좌우 flip view",
    summary: "같은 물체가 칸 6–7에 보임",
    note: "둘째 view는 좌우로 뒤집은 이미지라 model의 mask도 이 view 좌표인 칸 6–7에 찍힙니다. 맞는 답이지만 원본 좌표가 아닙니다.",
  },
  {
    label: "그대로 평균하면",
    summary: "(1+0)/2 = 0.5가 네 칸에",
    note: "칸 번호끼리 바로 평균하면 칸 2–3과 6–7이 모두 0.5입니다. 물체 하나가 두 군데에 반쯤 있는 output이 됩니다.",
  },
  {
    label: "T⁻¹로 되돌린 뒤 평균",
    summary: "(1+1)/2 = 1.0이 칸 2–3에만",
    note: "flip view의 mask를 다시 뒤집어(inverse map) 원래 좌표로 옮긴 뒤 평균하면 칸 2–3만 1.0입니다. 좌표가 없는 classification probability는 역변환이 없을 수 있습니다.",
  },
] as const;

function stripsFor(active: number): readonly Strip[] {
  const view1: Strip = { name: "view 1 mask", values: baseMask, color: ACCENT };
  const view2: Strip = { name: "view 2 mask", values: flippedMask, color: FLIP };
  if (active === 0) return [view1];
  if (active === 1) return [view1, view2];
  if (active === 2) return [view1, view2, { name: "바로 평균", values: naiveAvg, color: WRONG }];
  return [view1, { name: "view 2 → T⁻¹", values: restored, color: FLIP }, { name: "정렬 후 평균", values: alignedAvg, color: ACCENT }];
}

const W = 360;
const LEFT = 92;
const CELL = (W - LEFT - 8) / CELLS;
const ROW = 40;
const TOP = 22;
const SVG_H = TOP + 3 * ROW + 6;

export default function TtaInverseMapViz() {
  return (
    <SceneShell
      eyebrow="TTA output 정렬"
      title="flip view의 mask는 원래 칸으로 되돌린 뒤 더합니다"
      description="한 줄 8칸짜리 이미지와 원본·좌우 flip 두 view를 가정한 그림입니다(본문 사례는 네 view). 칸 숫자는 mask 값이며, model이 두 view에서 모두 정확하다고 가정했습니다."
      ariaLabel="원본과 flip view의 segmentation mask를 그대로 평균할 때와 역변환 후 평균할 때 비교"
      scenes={SCENES}
      render={(active) => {
        const strips = stripsFor(active);
        return (
          <svg
            viewBox={`0 0 ${W} ${SVG_H}`}
            className="mx-auto h-auto w-full max-w-[560px]"
            role="img"
            aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}
          >
            {Array.from({ length: CELLS }, (_, i) => (
              <text key={i} x={LEFT + i * CELL + CELL / 2} y={TOP - 8} textAnchor="middle" fontSize={10} fill={MUTED}>
                칸{i + 1}
              </text>
            ))}
            {[0, 1, 2].map((slot) => {
              const strip = strips[slot];
              const y = TOP + slot * ROW;
              if (!strip) {
                return (
                  <rect key={slot} x={LEFT} y={y} width={CELL * CELLS} height={ROW - 10} fill="none" stroke={MUTED} strokeWidth={0.5} strokeDasharray="3 3" opacity={0.4} />
                );
              }
              return (
                <g key={slot}>
                  <text x={8} y={y + (ROW - 10) / 2 + 4} fontSize={11} fontWeight={700} fill={strip.color}>
                    {strip.name}
                  </text>
                  {strip.values.map((v, i) => (
                    <g key={i}>
                      <rect
                        x={LEFT + i * CELL + 1}
                        y={y}
                        width={CELL - 2}
                        height={ROW - 10}
                        rx={3}
                        fill={strip.color}
                        fillOpacity={v * 0.85 + 0.04}
                        stroke={strip.color}
                        strokeWidth={0.75}
                        strokeOpacity={0.5}
                      />
                      <text
                        x={LEFT + i * CELL + CELL / 2}
                        y={y + (ROW - 10) / 2 + 4}
                        textAnchor="middle"
                        fontSize={11}
                        fontWeight={700}
                        fill={v >= 0.75 ? "#ffffff" : MUTED}
                      >
                        {v === 0 ? "0" : v === 1 ? "1" : v.toFixed(1)}
                      </text>
                    </g>
                  ))}
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
