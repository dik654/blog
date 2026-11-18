import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — CME 2020년 8월 설명서의 청산 스왑션 평가 순서.
 * ① 미리 정한 만기·tenor·moneyness 지점마다 회원의 외가격 가격·normal 내재변동성을 매일 받아 섞는다.
 * ② 섞은 변동성 + CME 장 마감 곡선의 ATM 선도금리로 가격을 만든다.
 * ③ 그 가격에 MSABR 매개변수를 보정해 모든 지점의 표면을 채운다.
 * ④ 매개변수와 할인곡선(전환 전 EFFR, 2020-10-16 뒤 SOFR)으로 평가한다.
 * moneyness = ATM 선도 − 행사가 → 4.00% − 4.10% = −10bp.
 * 미리 정한 지점의 개수·간격, 다른 만기×tenor 줄은 그림용(가정)이고 축에 숫자 눈금을 두지 않는다.
 */
const ROWS = ["3개월×10년", "다른 줄 (가정)", "다른 줄 (가정)"] as const;
const PRESET = [-3, -2, -1, 1, 2, 3] as const; // ATM 양옆의 외가격 지점(가정)
const AX0 = 104;
const AX1 = 344;
const MID = (AX0 + AX1) / 2;
const SLOT = (AX1 - AX0) / 7;
const sx = (slot: number) => MID + slot * SLOT;
const OUR_X = MID - SLOT * 0.4; // −10bp: ATM 바로 왼쪽(간격은 그림용)
const ROW_Y0 = 50;
const ROW_H = 36;
const ry = (row: number) => ROW_Y0 + row * ROW_H;

const BLUE = "#2563eb";
const GRAY = "#64748b";
const LINE = "#94a3b8";
const AMBER = "#d97706";

const SCENES = [
  { label: "회원 호가 섞기", summary: "지점마다 매일 · 외가격 · normal 변동성", step: 0, note: "미리 정한 만기·tenor(스왑 기간)·moneyness 지점마다 청산회원의 외가격 스왑션 가격과 normal 내재변동성을 매일 받아 회원 사이에서 섞습니다." },
  { label: "ATM 선도로 가격 만들기", summary: "섞은 변동성 + 장 마감 곡선", step: 1, note: "섞은 변동성과 CME 장 마감 곡선의 ATM 선도금리로 각 지점의 스왑션 가격을 만듭니다. 가운데 세로선이 ATM입니다." },
  { label: "MSABR로 빈 곳 채우기", summary: "−10bp 지점도 표면에서 읽음", step: 2, note: "그 가격에 MSABR(CME 수정 SABR) 매개변수를 보정해 모든 지점을 채웁니다. 4.00% − 4.10% = −10bp이고, 미리 정한 지점인지는 글에 없어 사이에 그렸습니다(가정)." },
  { label: "할인곡선으로 평가", summary: "EFFR → 2020-10-16 → SOFR", step: 3, note: "MSABR 매개변수와 할인곡선으로 청산된 스왑션을 평가합니다. 할인곡선은 전환 전 EFFR, 2020-10-16 뒤 SOFR입니다(2020년 문서 기준)." },
] as const;

export default function CmeSurfaceViz() {
  return (
    <SceneShell
      eyebrow="청산 평가 순서"
      title="띄엄띄엄 받은 호가가 전체 표면이 되기까지"
      description="줄 하나가 옵션 만기×기초 스왑 tenor 한 쌍이고, 가로축은 CME 표기의 moneyness(ATM 선도 − 행사가)입니다. 점의 개수와 간격, 다른 줄은 그림용(가정)입니다."
      ariaLabel="회원 호가 섞기, ATM 선도로 가격 만들기, MSABR 보정으로 표면 채우기, 할인곡선으로 평가하는 네 단계"
      scenes={SCENES}
      render={(active) => {
        const step = SCENES[active].step;
        return (
          <svg viewBox="0 0 360 236" className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={MID} y={16} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={GRAY}>moneyness = ATM 선도 − 행사가</text>
            <text x={AX0} y={32} fontSize={10.5} fill={GRAY}>← 행사가가 선도보다 높음</text>
            <text x={AX1} y={32} textAnchor="end" fontSize={10.5} fill={GRAY}>낮음 →</text>
            {ROWS.map((name, row) => (
              <g key={`${name}-${row}`}>
                <text x={AX0 - 8} y={ry(row) + 4} textAnchor="end" fontSize={11} fontWeight={row === 0 ? 700 : 400} fill={row === 0 ? BLUE : GRAY}>{name}</text>
                {step >= 2 ? (
                  <rect x={AX0} y={ry(row) - 9} width={AX1 - AX0} height={18} rx={4} fill={BLUE} opacity={0.18} />
                ) : (
                  <line x1={AX0} x2={AX1} y1={ry(row)} y2={ry(row)} stroke={LINE} strokeWidth={1} />
                )}
                {PRESET.map((slot) => (
                  <g key={slot}>
                    {step === 0 && [-6, 0, 6].map((dx) => (
                      <line key={dx} x1={sx(slot) + dx} x2={sx(slot) + dx * 0.3} y1={ry(row) - 14} y2={ry(row) - 6} stroke={GRAY} strokeWidth={1} />
                    ))}
                    <circle cx={sx(slot)} cy={ry(row)} r={4.5} fill={step >= 1 ? BLUE : "#ffffff"} stroke={step >= 1 ? BLUE : GRAY} strokeWidth={1.25} />
                  </g>
                ))}
              </g>
            ))}
            <line x1={MID} x2={MID} y1={ROW_Y0 - 16} y2={ry(ROWS.length - 1) + 14} stroke={step >= 1 ? AMBER : LINE} strokeWidth={step >= 1 ? 1.25 : 1} strokeDasharray={step >= 1 ? undefined : "2 2"} />
            <text x={MID} y={ry(ROWS.length - 1) + 27} textAnchor="middle" fontSize={11} fontWeight={700} fill={step >= 1 ? AMBER : GRAY}>ATM (0)</text>
            {step >= 2 && (
              <g>
                <rect x={OUR_X - 5} y={ry(0) - 5} width={10} height={10} fill={AMBER} stroke="#ffffff" strokeWidth={1} transform={`rotate(45 ${OUR_X} ${ry(0)})`} />
                <text x={OUR_X} y={ry(0) + 21} textAnchor="middle" fontSize={11} fontWeight={700} fill={AMBER}>−10bp</text>
              </g>
            )}
            <g opacity={step === 3 ? 1 : 0.25}>
              <text x={20} y={190} fontSize={11.5} fontWeight={700} fill={GRAY}>할인곡선</text>
              <rect x={20} y={200} width={130} height={22} rx={4} fill="none" stroke={LINE} strokeWidth={1} />
              <text x={85} y={215} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={GRAY}>전환 전 EFFR</text>
              <line x1={156} x2={196} y1={211} y2={211} stroke={LINE} strokeWidth={1} />
              <text x={176} y={232} textAnchor="middle" fontSize={10.5} fill={GRAY}>2020-10-16</text>
              <rect x={202} y={200} width={138} height={22} rx={4} fill="none" stroke={step === 3 ? BLUE : LINE} strokeWidth={step === 3 ? 1.25 : 1} />
              <text x={271} y={215} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={step === 3 ? BLUE : GRAY}>전환 뒤 SOFR</text>
            </g>
          </svg>
        );
      }}
    />
  );
}
