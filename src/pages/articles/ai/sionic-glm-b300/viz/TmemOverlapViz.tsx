import SceneShell from "./SceneShell";

/**
 * 본문 대응: #kernel 2절 — accumulator를 TMEM에 두면 load·MMA·epilogue를 겹칠 여지가 생기지만,
 * barrier와 stage 설계가 자동으로 해결되지는 않는다(TmemSource: 발행 ≠ 완료, commit → barrier 대기).
 * 세 단계의 칸 길이가 모두 같다는 것과 tile 3개는 모양을 보이려는 가정이다.
 */
const LANES = ["load", "MMA", "epilogue"] as const;
const LANE_Y = [44, 88, 132] as const;
const laneY: readonly number[] = LANE_Y;
const X0 = 78;
const U = 28;
const BH = 26;
const TILE_COLORS = ["#2563eb", "#16a34a", "#d97706"] as const;
const tileColor: readonly string[] = TILE_COLORS;

// [tile, lane, 시작 칸]
const SERIAL = [0, 1, 2].flatMap((tile) => [0, 1, 2].map((lane) => [tile, lane, tile * 3 + lane] as const));
const OVERLAP = [0, 1, 2].flatMap((tile) => [0, 1, 2].map((lane) => [tile, lane, tile + lane] as const));

const SCENES = [
  {
    label: "차례로만 돌면",
    summary: "tile 3개 = 9칸",
    note: "tile 하나의 load(입력 가져오기)·MMA(행렬곱 누산)·epilogue(누산 결과를 꺼내 저장하는 마무리)가 모두 끝나야 다음 tile이 시작합니다. 세 단계의 길이는 같다고 가정했습니다.",
  },
  {
    label: "단계를 겹치면",
    summary: "tile 3개 = 5칸 (가정한 길이)",
    note: "tcgen05 MMA는 accumulator(누산 결과를 모아 두는 칸)를 TMEM에 둡니다. register 부담이 줄면 서로 다른 tile의 load·MMA·epilogue를 겹칠 여지가 생깁니다. tile 하나가 거치는 세 칸은 그대로이고, 같은 세 tile이 9칸 대신 5칸에 끝나는 것은 칸 길이를 같게 둔 가정에서의 계산입니다.",
  },
  {
    label: "겹침은 자동이 아닙니다",
    summary: "MMA 발행 → commit → barrier 확인 → 읽기",
    note: "MMA 발행은 완료가 아닙니다. commit으로 완료 알림을 barrier(앞 작업이 끝났다는 동기화 표지)에 잇고 그 완료를 확인해야 epilogue가 TMEM을 읽습니다. barrier와 stage 설계는 자동으로 해결되지 않습니다.",
  },
] as const;

export default function TmemOverlapViz() {
  return (
    <SceneShell
      eyebrow="tcgen05·TMEM pipeline"
      title="세 단계를 겹치면 같은 tile 묶음이 더 짧은 시간에 끝납니다"
      description="가로는 시간, 세 줄은 load·MMA·epilogue 단계입니다. 칸의 숫자는 tile 번호이고, 칸 길이가 모두 같다는 것은 가정입니다."
      ariaLabel="load, MMA, epilogue를 차례로 돌릴 때와 겹칠 때의 시간표와 barrier 확인 지점"
      scenes={SCENES}
      render={(active) => {
        const plan = active === 0 ? SERIAL : OVERLAP;
        const end = active === 0 ? 9 : 5;
        return (
          <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {LANES.map((lane, index) => (
              <g key={lane}>
                <text x={X0 - 8} y={laneY[index] + 17} textAnchor="end" fontSize={11} fontWeight={700} fill="#64748b">{lane}</text>
                <line x1={X0} x2={X0 + 9 * U} y1={laneY[index] + BH + 4} y2={laneY[index] + BH + 4} stroke="#94a3b8" strokeWidth={1} strokeOpacity={0.4} />
              </g>
            ))}
            {plan.map(([tile, lane, slot]) => (
              <g key={`${tile}-${lane}`}>
                <rect x={X0 + slot * U + 1} y={laneY[lane]} width={U - 2} height={BH} rx={3} fill={tileColor[tile]} fillOpacity={0.22} stroke={tileColor[tile]} strokeWidth={1} />
                <text x={X0 + slot * U + U / 2} y={laneY[lane] + 17} textAnchor="middle" fontSize={11} fontWeight={700} fill={tileColor[tile]}>{tile + 1}</text>
              </g>
            ))}
            {active === 2 &&
              [0, 1, 2].map((tile) => {
                const x = X0 + (tile + 2) * U;
                return (
                  <g key={`b-${tile}`}>
                    <line x1={x} x2={x} y1={laneY[1] - 4} y2={laneY[2] + BH + 2} stroke="#dc2626" strokeWidth={1.25} strokeDasharray="3 2" />
                    <text x={x} y={laneY[1] - 8} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="#dc2626">B</text>
                  </g>
                );
              })}
            <line x1={X0} x2={X0 + end * U} y1={174} y2={174} stroke="#2563eb" strokeWidth={1.25} />
            <line x1={X0 + end * U} x2={X0 + end * U} y1={168} y2={180} stroke="#2563eb" strokeWidth={1.25} />
            <text x={X0} y={192} fontSize={11} fill="#2563eb">{`끝나는 시점: ${end}칸`}</text>
            <text x={X0 + 9 * U} y={192} textAnchor="end" fontSize={11} fill="#64748b">시간 →</text>
            {active === 2 && <text x={X0 + 9 * U} y={30} textAnchor="end" fontSize={10.5} fill="#dc2626">B = barrier 완료 확인 후 epilogue</text>}
          </svg>
        );
      }}
    />
  );
}
