import SceneShell from "./SceneShell";

/**
 * 본문 대응: #airflow-direction — 찬 통로·더운 통로 배치, 방향이 맞지 않는 장비 하나,
 * 확인할 세 가지(흡기·배기 방향, 흡기 허용 온도 등급, 앞뒤 여유 공간).
 * 위에서 내려다본 평면도이며 랙 수는 그림을 위한 가정입니다.
 */
const SCENES = [
  {
    label: "방향이 맞을 때",
    summary: "앞으로 마시고 뒤로 내보냄",
    note: "두 줄의 랙이 앞면끼리 찬 통로를 마주 봅니다. 모든 장비가 찬 통로에서 공기를 마시고 뒤쪽 더운 통로로 내보냅니다.",
  },
  {
    label: "반대 방향 장비 하나",
    summary: "더운 공기를 마시고 찬 통로로 배기",
    note: "방향이 반대인 장비는 더운 통로의 공기를 마시고, 더운 공기를 찬 통로 쪽으로 내보냅니다. 그 결과 주변 장비의 흡기 온도까지 올라갑니다.",
  },
  {
    label: "확인할 세 가지",
    summary: "방향 · 흡기 온도 등급 · 앞뒤 여유",
    note: "흡기와 배기 방향, 흡기 허용 온도 등급, 앞뒤 여유 공간을 확인합니다. 여유 공간은 케이블과 문 때문에 도면보다 좁아지는 경우가 많아 실측합니다.",
  },
] as const;

const RACK = "#6366f1";
const COLD = "#2563eb";
const HOT = "#dc2626";
const WARM = "#d97706";
const CHECK = "#0f766e";
const MUTED = "#94a3b8";

const RACKS = [0, 1, 2, 3, 4].map((i) => 26 + i * 64);
const RACK_W = 52;
const TOP_ROW = { y: 46, h: 40 } as const;
const BOTTOM_ROW = { y: 134, h: 40 } as const;
const REVERSED = 2;

function Arrow({ x, from, to, color, dashed = false }: { x: number; from: number; to: number; color: string; dashed?: boolean }) {
  const dir = to > from ? 1 : -1;
  return (
    <g>
      <line x1={x} x2={x} y1={from} y2={to - dir * 4} stroke={color} strokeWidth={1.25} strokeDasharray={dashed ? "3 2" : undefined} />
      <polygon points={`${x - 3.5},${to - dir * 6} ${x + 3.5},${to - dir * 6} ${x},${to}`} fill={color} />
    </g>
  );
}

export default function AisleAirflowViz() {
  return (
    <SceneShell
      eyebrow="통로 배치"
      title="방향이 반대인 장비 하나가 찬 통로를 데웁니다"
      description="위에서 내려다본 전산실 평면입니다. 찬 통로는 랙 앞면끼리 마주 보며 찬 공기를 받는 통로, 더운 통로는 랙 뒷면에서 배기가 모이는 통로입니다. 파란 화살표는 찬 공기, 빨간 화살표는 더운 공기, 주황 점선 화살표는 데워진 흡기입니다."
      note="랙 수와 위치는 그림을 위한 가정입니다. 랙 단위의 기류 설계와 경보 기준은 전력과 냉각 글에서 다룹니다."
      ariaLabel="찬 통로와 더운 통로 평면도에서 정상 기류, 방향이 반대인 장비, 확인 항목 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 224" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <rect x={0} y={4} width={360} height={38} fill={HOT} fillOpacity={0.06} />
          <rect x={0} y={90} width={360} height={40} fill={COLD} fillOpacity={0.06} />
          <rect x={0} y={178} width={360} height={38} fill={HOT} fillOpacity={0.06} />
          <text x={4} y={16} fontSize={10} fontWeight={700} fill={HOT}>더운 통로</text>
          <text x={4} y={102} fontSize={10} fontWeight={700} fill={COLD}>찬 통로</text>
          <text x={4} y={212} fontSize={10} fontWeight={700} fill={HOT}>더운 통로</text>

          {RACKS.map((x, index) => {
            const reversed = active === 1 && index === REVERSED;
            const warmed = active === 1 && (index === REVERSED - 1 || index === REVERSED + 1);
            const cx = x + RACK_W / 2;
            return (
              <g key={`top-${x}`}>
                <rect x={x} y={TOP_ROW.y} width={RACK_W} height={TOP_ROW.h} rx={3} fill={RACK} fillOpacity={reversed ? 0.04 : 0.12} stroke={reversed ? HOT : RACK} strokeWidth={reversed ? 1.25 : 1} />
                <text x={cx} y={TOP_ROW.y + TOP_ROW.h - 5} textAnchor="middle" fontSize={9} fill={MUTED}>앞</text>
                {reversed ? (
                  <>
                    <Arrow x={cx} from={26} to={TOP_ROW.y} color={HOT} />
                    <Arrow x={cx} from={TOP_ROW.y + TOP_ROW.h} to={118} color={HOT} />
                    <text x={cx} y={TOP_ROW.y + 18} textAnchor="middle" fontSize={9} fontWeight={700} fill={HOT}>반대</text>
                  </>
                ) : active === 2 ? null : (
                  <>
                    <Arrow x={cx} from={108} to={TOP_ROW.y + TOP_ROW.h} color={warmed ? WARM : COLD} dashed={warmed} />
                    <Arrow x={cx} from={TOP_ROW.y} to={24} color={HOT} />
                  </>
                )}
              </g>
            );
          })}

          {RACKS.map((x, index) => {
            const cx = x + RACK_W / 2;
            const warmed = active === 1 && index === REVERSED;
            const measured = active === 2 && index === 3;
            return (
              <g key={`bottom-${x}`}>
                <rect x={x} y={BOTTOM_ROW.y} width={RACK_W} height={BOTTOM_ROW.h} rx={3} fill={RACK} fillOpacity={0.12} stroke={measured ? CHECK : RACK} strokeWidth={measured ? 1.25 : 1} />
                <text x={cx} y={BOTTOM_ROW.y + 12} textAnchor="middle" fontSize={9} fill={MUTED}>앞</text>
                {(active !== 2 || measured) && <Arrow x={cx} from={112} to={BOTTOM_ROW.y} color={warmed ? WARM : COLD} dashed={warmed} />}
                {(active !== 2 || measured) && <Arrow x={cx} from={BOTTOM_ROW.y + BOTTOM_ROW.h} to={198} color={HOT} />}
              </g>
            );
          })}

          {active === 1 && (
            <text x={356} y={104} textAnchor="end" fontSize={9} fontWeight={700} fill={WARM}>
              <tspan x={356}>주변 흡기</tspan>
              <tspan x={356} dy={11}>온도 ↑</tspan>
            </text>
          )}

          {active === 2 && (
            <g>
              <line x1={RACKS[3] - 4} x2={RACKS[3] - 4} y1={BOTTOM_ROW.y - 30} y2={BOTTOM_ROW.y} stroke={CHECK} strokeWidth={1.25} />
              <line x1={RACKS[3] - 8} x2={RACKS[3]} y1={BOTTOM_ROW.y - 30} y2={BOTTOM_ROW.y - 30} stroke={CHECK} strokeWidth={1} />
              <line x1={RACKS[3] - 4} x2={RACKS[3] - 4} y1={BOTTOM_ROW.y + BOTTOM_ROW.h} y2={BOTTOM_ROW.y + BOTTOM_ROW.h + 30} stroke={CHECK} strokeWidth={1.25} />
              <line x1={RACKS[3] - 8} x2={RACKS[3]} y1={BOTTOM_ROW.y + BOTTOM_ROW.h + 30} y2={BOTTOM_ROW.y + BOTTOM_ROW.h + 30} stroke={CHECK} strokeWidth={1} />
              <text x={356} y={104} textAnchor="end" fontSize={9} fontWeight={700} fill={CHECK}>흡기 방향 · 허용 온도 등급</text>
              <text x={RACKS[3] + RACK_W / 2 + 6} y={196} fontSize={9} fontWeight={700} fill={CHECK}>배기 방향</text>
              <text x={RACKS[3] - 10} y={BOTTOM_ROW.y - 18} textAnchor="end" fontSize={9} fontWeight={700} fill={CHECK}>앞 여유 · 실측</text>
              <text x={RACKS[3] - 10} y={BOTTOM_ROW.y + BOTTOM_ROW.h + 22} textAnchor="end" fontSize={9} fontWeight={700} fill={CHECK}>뒤 여유 · 실측</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
