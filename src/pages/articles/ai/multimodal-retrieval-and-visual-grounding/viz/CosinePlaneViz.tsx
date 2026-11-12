import SceneShell from "./SceneShell";

/**
 * 본문 대응: #similarity — q=(1,0), A=(0.8,0.6), B=(0,1), C=(−0.6,0.8)은 모두 길이 1(본문 가정).
 * 길이가 1이면 cosine = 내적이고, q=(1,0)이므로 내적은 후보의 첫 좌표, 즉 q 방향으로 떨어뜨린 그림자 길이입니다.
 * A 0.8 · B 0 · C −0.6 → A가 top-1.
 */
const ACCENT = "#2563eb";
const OTHER = "#64748b";
const AXIS = "#94a3b8";
const SHADOW = "#d97706";

const VECTORS = [
  { name: "A", x: 0.8, y: 0.6, angle: "약 37°", main: { dx: -8, dy: -8, anchor: "end" }, sub: { dx: 8, dy: 12, anchor: "start" } },
  { name: "B", x: 0, y: 1, angle: "90°", main: { dx: 8, dy: -22, anchor: "start" }, sub: { dx: 8, dy: -7, anchor: "start" } },
  { name: "C", x: -0.6, y: 0.8, angle: "약 127°", main: { dx: -10, dy: -4, anchor: "end" }, sub: { dx: -10, dy: 12, anchor: "end" } },
] as const;

const SCENES = [
  { label: "길이 1인 네 벡터", summary: "q · A · B · C 모두 원 위", note: "네 벡터의 길이를 모두 1로 맞췄으므로 끝점이 같은 원 위에 있습니다. 이제 남은 차이는 방향뿐이고, cosine similarity는 두 벡터 사이 각도의 cos 값으로 그 방향 차이를 잽니다." },
  { label: "q 방향 그림자", summary: "A 0.8 · B 0 · C −0.6", note: "q=(1,0)이므로 내적 q·A는 A의 첫 좌표 0.8입니다. 그림에서는 각 끝점을 q 축으로 수직으로 떨어뜨린 그림자의 위치와 같습니다. B는 q와 직각이라 0, C는 반대쪽으로 넘어가 −0.6입니다." },
  { label: "q 쪽으로 가장 먼 A", summary: "top-1 = A (0.8)", note: "그림자가 q 쪽으로 가장 멀리 나온 A가 세 후보 중 query와 방향이 가장 가깝습니다. Retrieval은 A를 고르지만, 이것은 A라는 이미지 한 장을 고른 것이지 A 안에서 컵이 어디 있는지 알려 주지 않습니다." },
] as const;

const W = 360;
const H = 210;
const CX = 170;
const CY = 180;
const R = 120;
const px = (x: number) => CX + x * R;
const py = (y: number) => CY - y * R;

export default function CosinePlaneViz() {
  return (
    <SceneShell
      eyebrow="Cosine similarity를 그림으로"
      title="길이가 같으면 남는 차이는 방향이고, 점수는 q 쪽 그림자입니다"
      description="본문의 2차원 교육용 벡터를 그대로 그렸습니다. 파란 화살표가 ‘빨간 컵’ query q, 회색 화살표가 후보 이미지 A·B·C의 embedding입니다."
      note="실제 retrieval embedding은 보통 수백 차원 이상이라 이렇게 평면에 그릴 수 없습니다. 2차원은 계산을 눈으로 확인하기 위한 가정입니다."
      ariaLabel="길이 1인 query와 후보 벡터 세 개, 그리고 q 방향 그림자로 읽는 cosine similarity"
      scenes={SCENES}
      render={(active) => {
        const showShadow = active >= 1;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <path d={`M${px(-1)} ${CY} A${R} ${R} 0 0 1 ${px(1)} ${CY}`} fill="none" stroke={AXIS} strokeWidth={1} strokeDasharray="3 3" />
            <line x1={px(-1) - 8} x2={px(1) + 8} y1={CY} y2={CY} stroke={AXIS} strokeWidth={1} />
            {[-1, -0.6, 0, 0.8, 1].map((t) => (
              <g key={t}>
                <line x1={px(t)} x2={px(t)} y1={CY - 3} y2={CY + 3} stroke={AXIS} strokeWidth={1} />
                {(t === -1 || t === 0 || t === 1 || showShadow) && (
                  <text x={px(t)} y={CY + 17} textAnchor="middle" fontSize={12} fontWeight={showShadow && t !== -1 && t !== 1 ? 700 : 400} fill={showShadow && t !== -1 && t !== 1 ? SHADOW : OTHER}>
                    {t === -0.6 ? "−0.6" : t === -1 ? "−1" : String(t)}
                  </text>
                )}
              </g>
            ))}
            {VECTORS.map((v) => {
              const top = active === 2 && v.name === "A";
              const color = top ? ACCENT : OTHER;
              return (
                <g key={v.name}>
                  {showShadow && v.x !== 0 && (
                    <line x1={px(v.x)} x2={px(v.x)} y1={py(v.y)} y2={CY} stroke={SHADOW} strokeWidth={1} strokeDasharray="3 3" />
                  )}
                  {showShadow && (
                    <line x1={CX} x2={px(v.x)} y1={CY + 6} y2={CY + 6} stroke={SHADOW} strokeWidth={1.25} opacity={v.x === 0 ? 0 : 0.9} />
                  )}
                  <line x1={CX} y1={CY} x2={px(v.x)} y2={py(v.y)} stroke={color} strokeWidth={top ? 1.25 : 1} />
                  <circle cx={px(v.x)} cy={py(v.y)} r={4} fill={color} />
                  <text x={px(v.x) + v.main.dx} y={py(v.y) + v.main.dy} textAnchor={v.main.anchor} fontSize={12} fontWeight={700} fill={color}>
                    {v.name} ({v.x === -0.6 ? "−0.6" : v.x}, {v.y})
                  </text>
                  <text x={px(v.x) + v.sub.dx} y={py(v.y) + v.sub.dy} textAnchor={v.sub.anchor} fontSize={11.5} fontWeight={showShadow ? 700 : 400} fill={top ? ACCENT : showShadow ? SHADOW : OTHER}>
                    {showShadow ? `q·${v.name} = ${v.x === -0.6 ? "−0.6" : v.x}` : `q와 ${v.angle}`}
                  </text>
                  {top && (
                    <text x={px(v.x) + v.sub.dx} y={py(v.y) + v.sub.dy + 16} textAnchor={v.sub.anchor} fontSize={11.5} fontWeight={700} fill={ACCENT}>
                      top-1
                    </text>
                  )}
                </g>
              );
            })}
            <line x1={CX} y1={CY} x2={px(1)} y2={CY} stroke={ACCENT} strokeWidth={1.25} />
            <circle cx={px(1)} cy={CY} r={4} fill={ACCENT} />
            <text x={px(1) + 10} y={CY + 4} fontSize={12} fontWeight={700} fill={ACCENT}>
              q (1, 0)
            </text>
            <text x={12} y={18} fontSize={11.5} fill={OTHER}>
              점선 반원 = 길이 1인 벡터의 끝점이 놓이는 자리
            </text>
          </svg>
        );
      }}
    />
  );
}
