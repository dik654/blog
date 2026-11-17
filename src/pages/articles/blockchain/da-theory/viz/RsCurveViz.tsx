import SceneShell from "./SceneShell";

/**
 * 본문 대응: #erasure-code — D0~D3 네 값을 지나는 3차 이하 다항식을 정하고 다른 네 지점의 값 P4~P7을 더 계산하는 (8,4) 코드.
 * 실제 계산은 유한체 위에서 하지만 모양을 보이려고 실수 평면에 그린 설명용 곡선(가정):
 * p(x) = 4 + 0.05(x−1)(x−3.5)(x−6), 가로 위치 0~7도 설명용이다.
 * 누락 사례는 #overview와 같은 D1·P4·P6·P7 수신.
 */
const p = (x: number) => 4 + 0.05 * (x - 1) * (x - 3.5) * (x - 6);
const NAMES = ["D0", "D1", "D2", "D3", "P4", "P5", "P6", "P7"] as const;
const KEPT: readonly number[] = [1, 4, 6, 7];

const W = 360;
const H = 160;
const LEFT = 26;
const RIGHT = 344;
const TOP = 16;
const BOTTOM = 128;
const Y_MIN = 2.4;
const Y_MAX = 5.6;
const sx = (x: number) => LEFT + (x / 7) * (RIGHT - LEFT);
const sy = (y: number) => BOTTOM - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * (BOTTOM - TOP);
const CURVE = Array.from({ length: 71 }, (_, index) => index / 10)
  .map((x, index) => `${index === 0 ? "M" : "L"}${sx(x).toFixed(1)},${sy(p(x)).toFixed(1)}`)
  .join(" ");

const SCENES = [
  { label: "원본 네 값", summary: "D0~D3 = 점 4개", note: "원본 조각 네 개를 위치 0~3의 높이로 놓습니다. 실제 계산은 유한체(원소 수가 유한하고 사칙연산이 닫힌 수 체계)에서 합니다." },
  { label: "네 점을 지나는 곡선", summary: "3차 이하 다항식 하나", note: "서로 다른 위치의 네 점을 모두 지나는 3차 이하 다항식은 하나로 정해집니다. 원본 네 값이 곧 이 곡선을 정합니다." },
  { label: "다른 네 지점의 값", summary: "P4~P7 = 추가 평가값", note: "같은 곡선을 위치 4~7에서 읽은 값이 P4~P7입니다. 원본의 복사본이 아니라 같은 다항식의 다른 지점 값이며, 여덟 값 중 넷이 원본이라 code rate는 4÷8 = 1/2입니다." },
  { label: "네 조각이 빠져도", summary: "D1·P4·P6·P7 → 같은 곡선", note: "D0·D2·D3·P5가 빠졌지만 빈 자리를 압니다(누락, erasure). 남은 서로 다른 네 점이 같은 곡선을 정하므로 위치 0·2·3의 원본 값을 다시 읽을 수 있습니다." },
] as const;

export default function RsCurveViz() {
  return (
    <SceneShell
      eyebrow="Reed–Solomon (8,4)"
      title="여분 조각은 복사본이 아니라 같은 곡선의 다른 점입니다"
      description="가로는 평가 위치, 세로는 그 위치의 값입니다. 진한 점은 원본, 빈 점은 복원용 조각입니다. 곡선 모양과 위치 번호는 설명용이고 실제 값은 유한체 원소입니다(가정)."
      note="이 그림은 위치를 아는 누락만 다룹니다. 잘못된 값의 위치도 모르는 오류(error)라면 같은 여분으로 고칠 수 있는 수가 줄어듭니다."
      ariaLabel="네 원본 값을 지나는 3차 이하 곡선에서 복원용 값 네 개를 읽고, 네 조각만으로 원본을 되찾는 네 장면"
      scenes={SCENES}
      render={(active) => {
        const showCurve = active >= 1;
        const showParity = active >= 2;
        const lossScene = active === 3;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={LEFT} x2={RIGHT} y1={BOTTOM} y2={BOTTOM} stroke="#94a3b8" strokeWidth={1} />
            <line x1={(sx(3) + sx(4)) / 2} x2={(sx(3) + sx(4)) / 2} y1={TOP} y2={BOTTOM} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
            <text x={sx(1.5)} y={TOP - 4} textAnchor="middle" fontSize={10} fill="#64748b">원본</text>
            <text x={sx(5.5)} y={TOP - 4} textAnchor="middle" fontSize={10} fill="#64748b">복원용</text>
            {showCurve && <path d={CURVE} fill="none" stroke={lossScene ? "#16a34a" : "#2563eb"} strokeWidth={1.25} strokeDasharray={lossScene ? "5 3" : undefined} />}
            {NAMES.map((name, index) => {
              const isParity = index >= 4;
              const visible = !isParity || showParity;
              const lost = lossScene && !KEPT.includes(index);
              const kept = lossScene && KEPT.includes(index);
              const cx = sx(index);
              const cy = sy(p(index));
              const color = kept ? "#16a34a" : isParity ? "#2563eb" : "#64748b";
              return (
                <g key={name}>
                  <line x1={cx} x2={cx} y1={BOTTOM} y2={BOTTOM + 4} stroke="#94a3b8" strokeWidth={1} />
                  <text x={cx} y={BOTTOM + 16} textAnchor="middle" fontSize={10} fill="#64748b">{index}</text>
                  {visible && (
                    lost ? (
                      <>
                        <circle cx={cx} cy={cy} r={5} fill="none" stroke="#dc2626" strokeWidth={1} strokeDasharray="2 2" />
                        <text x={cx} y={BOTTOM + 28} textAnchor="middle" fontSize={10} fontWeight={700} fill="#b91c1c">{name} 빠짐</text>
                      </>
                    ) : (
                      <>
                        <circle cx={cx} cy={cy} r={5} fill={isParity ? "#ffffff" : color} stroke={color} strokeWidth={1.25} />
                        <text x={cx} y={BOTTOM + 28} textAnchor="middle" fontSize={10} fontWeight={700} fill={color}>{name}</text>
                      </>
                    )
                  )}
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
