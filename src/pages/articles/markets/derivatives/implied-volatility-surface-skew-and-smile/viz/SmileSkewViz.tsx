import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case (1·3·6절) — 주가 100, 한 달 만기. 90 풋 30%, 100 중앙 20%, 110 콜 24%.
 * 110 콜 24% − 90 풋 30% = −6%포인트(같은 만기·비슷한 절댓값의 델타라고 가정).
 * 세로 = 내재변동성(%), 가로 = 행사가. 세 점은 본문 숫자이고 점 사이 선은 모양을 보이려는 연결선입니다.
 */
const W = 360;
const H = 214;
const x = (strike: number) => 70 + (strike - 90) * 11;
const y = (vol: number) => 184 - (vol - 15) * 8;

const POINTS = [
  { strike: 90, vol: 30, name: "90 풋" },
  { strike: 100, vol: 20, name: "100 중앙" },
  { strike: 110, vol: 24, name: "110 콜" },
] as const;

const SCENES = [
  {
    label: "세 행사가, 세 변동성",
    summary: "30% · 20% · 24%",
    note: "주가 100에서 한 달 만기 옵션 세 개의 시장가격을 모형에 거꾸로 넣어 얻은 값입니다. 기초자산은 하나인데 점의 높이가 다릅니다. 시장이 가격 움직임을 한 개의 일정한 변동성으로 보지 않기 때문입니다(1절).",
  },
  {
    label: "두 날개의 차이",
    summary: "24% − 30% = −6%p",
    note: "상승 쪽 110 콜에서 하락 쪽 90 풋을 뺍니다. 델타(주가가 1 움직일 때 옵션가격이 움직이는 정도)의 절댓값이 두 옵션에서 비슷하다고 가정한 값입니다. 하락 보험이 더 비싸게 들어갔다는 뜻일 뿐 주가가 반드시 떨어진다는 예측은 아닙니다(3절).",
  },
  {
    label: "모양에 붙는 이름",
    summary: "양 날개 > 중앙 20%",
    note: "같은 만기에서 한쪽으로 비대칭으로 기운 모습을 스큐, 중앙보다 양쪽 날개가 높은 U자 모양을 미소라고 부릅니다(6절). 이 사례는 두 날개가 모두 중앙보다 높고, 하락 쪽이 6%포인트 더 높습니다.",
  },
] as const;

export default function SmileSkewViz() {
  return (
    <SceneShell
      eyebrow="한 달 만기의 세 점"
      title="같은 만기인데 행사가마다 변동성 높이가 다릅니다"
      description="가로는 행사가, 세로는 옵션가격에서 역산한 내재변동성(%)입니다. 세 점은 1절의 설명용 값이고, 점을 잇는 선은 모양을 보이려고 그은 것입니다."
      ariaLabel="행사가 90, 100, 110의 내재변동성 30, 20, 24퍼센트와 두 날개의 차이 마이너스 6퍼센트포인트"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <line x1={40} x2={W - 20} y1={190} y2={190} stroke="#94a3b8" strokeWidth={1} />
          {POINTS.map((p) => (
            <g key={p.strike}>
              <line x1={x(p.strike)} x2={x(p.strike)} y1={186} y2={190} stroke="#94a3b8" strokeWidth={1} />
              <text x={x(p.strike)} y={206} textAnchor="middle" fontSize={12} fill="#64748b">{`행사가 ${p.strike}`}</text>
            </g>
          ))}

          {active === 0 && (
            <g>
              <line x1={40} x2={W - 20} y1={y(20)} y2={y(20)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
              <text x={W - 20} y={y(20) + 18} textAnchor="end" fontSize={11} fill="#64748b">변동성이 하나라면 세 점이 한 높이(가정: 20%)</text>
            </g>
          )}

          {active === 2 && (
            <polyline
              points={`${x(90)},${y(30)} ${x(100)},${y(20)} ${x(110)},${y(24)}`}
              fill="none"
              stroke="#2563eb"
              strokeWidth={1.25}
            />
          )}

          {active === 1 && (
            <g>
              <line x1={x(90)} x2={x(110) + 34} y1={y(30)} y2={y(30)} stroke="#dc2626" strokeWidth={1} strokeDasharray="4 3" />
              <line x1={x(110) + 28} x2={x(110) + 28} y1={y(30)} y2={y(24)} stroke="#dc2626" strokeWidth={1.25} />
              <text x={x(110) + 33} y={(y(30) + y(24)) / 2 + 4} textAnchor="start" fontSize={13} fontWeight={700} fill="#dc2626">−6</text>
            </g>
          )}

          {POINTS.map((p) => {
            const dim = active === 1 && p.strike === 100;
            return (
              <g key={`pt-${p.strike}`} opacity={dim ? 0.35 : 1}>
                <circle cx={x(p.strike)} cy={y(p.vol)} r={5} fill="#2563eb" />
                <text x={x(p.strike)} y={y(p.vol) - 11} textAnchor="middle" fontSize={13} fontWeight={700} fill="#1e40af">{`${p.vol}%`}</text>
                <text x={x(p.strike)} y={y(p.vol) + 20} textAnchor="middle" fontSize={11} fill="#64748b">{p.name}</text>
              </g>
            );
          })}
        </svg>
      )}
    />
  );
}
