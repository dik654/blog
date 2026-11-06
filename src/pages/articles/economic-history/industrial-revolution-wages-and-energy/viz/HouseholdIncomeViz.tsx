import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 그리핀(2018): 1830~40년대 농업 가구 주당 소득 11실링 6펜스, 광업 가구 29실링, 산업 지역 아동 소득 약 40%.
 * 칸 하나 = 1실링(12펜스). 6펜스는 반 칸입니다.
 * 산수: 29 ÷ 11.5 ≈ 2.5. 40%는 산업 지역 비중이라 29실링에 곱하지 않습니다.
 */
const SCENES = [
  { label: "주당 소득을 칸으로", summary: "11실링 6펜스 vs 29실링", note: "칸 하나가 1실링입니다. 1실링은 12펜스이므로 6펜스는 반 칸이고, 농업 가구는 11칸 반입니다." },
  { label: "몇 배인가", summary: "29 ÷ 11.5 ≈ 2.5배", note: "농업 가구 소득을 광업 가구 줄에 대어 보면 두 번 들어가고 절반쯤 남습니다. 평균 하나로는 이 차이가 보이지 않습니다." },
  { label: "높은 소득의 일부", summary: "산업 지역 아동 소득 약 40%", note: "산업 지역의 높은 가구소득 일부는 어린 자녀의 노동에서 왔습니다. 그래서 평균 상승을 모두의 같은 개선으로 읽을 수 없습니다." },
] as const;

const W = 320;
const H = 136;
const CELL = 10;
const GAP = 1;
const STEP = CELL + GAP;
const X = 1;
const CELL_H = 26;
const FARM = "#d97706";
const MINE = "#64748b";
const BLUE = "#2563eb";
const CHILD = "#dc2626";

function Cells({ y, count, color }: { y: number; count: number; color: string }) {
  const whole = Math.floor(count);
  return (
    <>
      {Array.from({ length: whole }, (_, i) => (
        <rect key={i} x={X + i * STEP} y={y} width={CELL} height={CELL_H} rx={1} fill={color} />
      ))}
      {count > whole && <rect x={X + whole * STEP} y={y} width={CELL / 2} height={CELL_H} rx={1} fill={color} />}
    </>
  );
}

function Compare({ index }: { index: number }) {
  return (
    <>
      <text x={X} y={13} fontSize={13} fontWeight={700} fill={FARM}>농업 가구 · 11실링 6펜스</text>
      <Cells y={20} count={11.5} color={FARM} />
      <text x={X} y={73} fontSize={13} fontWeight={700} fill={MINE}>광업 가구 · 29실링</text>
      <Cells y={80} count={29} color={MINE} />
      {index === 1 &&
        [0, 1].map((turn) => {
          const start = X + turn * 11.5 * STEP;
          const end = X + (turn + 1) * 11.5 * STEP - 1;
          return (
            <g key={turn}>
              <path d={`M${start} 111 v5 H${end} v-5`} fill="none" stroke={FARM} strokeWidth={1.25} />
              <text x={(start + end) / 2} y={131} textAnchor="middle" fontSize={12} fontWeight={700} fill={FARM}>11.5</text>
            </g>
          );
        })}
      {index === 1 && <text x={W - 2} y={131} textAnchor="end" fontSize={12} fontWeight={700} fill={BLUE}>남은 6칸</text>}
    </>
  );
}

function Share() {
  const cell = 30;
  return (
    <>
      <text x={X} y={18} fontSize={13} fontWeight={700} fill={MINE}>산업 지역 가구소득 전체 (10칸 = 100%)</text>
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} x={X + i * (cell + 2)} y={30} width={cell} height={44} rx={2} fill={i < 4 ? CHILD : MINE} fillOpacity={i < 4 ? 1 : 0.35} />
      ))}
      <path d={`M${X} 82 v5 H${X + 4 * (cell + 2) - 2} v-5`} fill="none" stroke={CHILD} strokeWidth={1.25} />
      <text x={X} y={104} fontSize={13} fontWeight={700} fill={CHILD}>아동 소득 약 40%</text>
      <text x={W - 2} y={104} textAnchor="end" fontSize={13} fill={MINE}>그 밖의 소득</text>
    </>
  );
}

export default function HouseholdIncomeViz() {
  return (
    <SceneShell
      eyebrow="가구의 소득"
      title="같은 시기의 두 가구가 2.5배 벌어지고 산업 지역 소득의 일부는 아동의 몫입니다"
      description="평균 실질임금 뒤에 어떤 가구들이 있을까요? 1830~1840년대 영국의 주당 소득을 실링 칸으로 셉니다."
      note="그리핀(2018)의 값입니다. 약 40%는 산업 지역에 대한 비중이므로 광업 가구 29실링에 그대로 곱하지 않았습니다."
      ariaLabel="농업 가구와 광업 가구의 주당 소득 칸과 산업 지역 아동 소득 비중"
      scenes={SCENES}
      render={(index) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[index].label}: ${SCENES[index].summary}`}>
          {index === 2 ? <Share /> : <Compare index={index} />}
        </svg>
      )}
    />
  );
}
