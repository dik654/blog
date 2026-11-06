import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 그릇 하나(GAR)가 하루 배급이고 N1의 1/30이며, 30개가 1N1 GAR 곡물 = 한 달이다(Englund).
 * 24 × 30 = 720일, 720 × 1/30 = 24 N1, 0.8L × 30 = 24L, 0.5L × 30 = 15L, 1L × 30 = 30L.
 */
const W = 360;
const COLS = 10;
const CELL = 26;
const GAP = 7;
const GRID_W = COLS * CELL + (COLS - 1) * GAP;
const GX = (W - GRID_W) / 2;
const GY = 28;

const AX0 = 30;
const AX1 = 330;
const AXIS_Y = 150;
const lx = (liters: number) => AX0 + (liters / 35) * (AX1 - AX0);

const SCENES = [
  { label: "그릇 하나가 하루 배급", summary: "GAR 1개 = 하루 · 평균 약 0.8L", note: "비스듬한 테두리 그릇이 그림 문자 GAR의 모델이며, 대체로 노동자 한 사람의 하루 곡물 배급을 나타냈다고 잉글런드는 봅니다." },
  { label: "24개월 장부에서 나누어 봅니다", summary: "24 × 30 = 720일 → 하루 N1의 1/30", note: "근거는 점토판 MSVO 4, 27입니다. 큰 칸 하나가 30일이고 24칸이 720일입니다. 적힌 양을 720으로 나눠 하루 N1의 1/30이 나왔다면, (계산) 적힌 양은 720 × 1/30 = 24 N1입니다." },
  { label: "30개가 모이면 N1 하나", summary: "1N1 GAR 곡물 = 30일 = 한 달", note: "하루가 N1의 1/30이므로 하루치 30개가 N1 하나, 곧 한 달 배급입니다. 그래서 N1이 한 달 배급을 나타낸다고 읽습니다." },
  { label: "한 달을 리터로 옮깁니다", summary: "0.8L × 30일 = 약 24L", note: "그릇 크기가 0.5~1리터로 흩어져 있으므로 같은 계산으로 15~30리터 폭이 나옵니다(계산). 24리터는 대략치로만 읽습니다." },
] as const;

export default function RationUnitsViz() {
  return (
    <SceneShell
      eyebrow="단위 맞추기"
      title="그릇 하나에서 한 달 배급 24리터까지"
      description="잉글런드의 해석(1998)을 따라 달을 30일로 셉니다. 리터 값은 대략의 계산입니다."
      ariaLabel="GAR 그릇 하나, 24개월 720일 계산, 30개가 N1 하나, 한 달 약 24리터의 단위 변환"
      scenes={SCENES}
      render={(active) => {
        const showAxis = active === 3;
        return (
          <svg viewBox={`0 0 ${W} 186`} className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {active === 1 ? (
              <>
                <text x={W / 2} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">24개월 = 큰 칸 24개, 큰 칸 하나 = 30일</text>
                {Array.from({ length: 24 }, (_, index) => {
                  const col = index % 8;
                  const row = Math.floor(index / 8);
                  const x = 24 + col * 41;
                  const y = 28 + row * 34;
                  return <rect key={index} x={x} y={y} width={35} height={28} rx={3} fill="#2563eb" fillOpacity={0.18} stroke="#2563eb" />;
                })}
                <text x={W / 2} y={158} textAnchor="middle" fontSize={13} fontWeight={700} fill="#2563eb">24 × 30 = 720일</text>
                <text x={W / 2} y={177} textAnchor="middle" fontSize={12} fill="#64748b">적힌 양 ÷ 720일 = 하루 N1의 1/30</text>
              </>
            ) : (
              <>
                <text x={W / 2} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">{active === 0 ? "칸 하나 = 그릇 하나 = 하루 배급" : "칸 하나 = 그릇 하나 = 하루 · 전체 30칸 = N1 하나"}</text>
                {Array.from({ length: 30 }, (_, index) => {
                  const col = index % COLS;
                  const row = Math.floor(index / COLS);
                  const on = active === 0 ? index === 0 : true;
                  return (
                    <rect
                      key={index}
                      x={GX + col * (CELL + GAP)}
                      y={GY + row * 28}
                      width={CELL}
                      height={22}
                      rx={4}
                      fill={on ? "#d97706" : "none"}
                      fillOpacity={on ? 0.45 : 0}
                      stroke={on ? "#d97706" : "#94a3b8"}
                      strokeDasharray={on ? undefined : "2 2"}
                    />
                  );
                })}
                {showAxis ? (
                  <>
                    <line x1={AX0} x2={AX1} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
                    <rect x={lx(15)} y={AXIS_Y - 6} width={lx(30) - lx(15)} height={12} fill="#2563eb" fillOpacity={0.2} stroke="#2563eb" />
                    <line x1={lx(24)} x2={lx(24)} y1={AXIS_Y - 12} y2={AXIS_Y + 12} stroke="#d97706" strokeWidth={1.25} />
                    <text x={lx(24)} y={AXIS_Y - 16} textAnchor="middle" fontSize={12} fontWeight={700} fill="#d97706">약 24L</text>
                    {[15, 30].map((value) => (
                      <text key={value} x={lx(value)} y={AXIS_Y + 24} textAnchor="middle" fontSize={12} fill="#2563eb">{value}L</text>
                    ))}
                    <text x={AX0} y={AXIS_Y + 24} fontSize={12} fill="#64748b">0</text>
                  </>
                ) : (
                  <text x={W / 2} y={146} textAnchor="middle" fontSize={13} fontWeight={700} fill="#d97706">{active === 0 ? "채운 칸 하나 = 그릇 하나 = 평균 약 0.8L" : "30칸을 다 채우면 1N1 = 한 달"}</text>
                )}
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
