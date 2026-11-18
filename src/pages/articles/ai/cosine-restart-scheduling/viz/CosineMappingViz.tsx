import SceneShell from "./SceneShell";

/**
 * 본문 대응: #cosine-progress — r = t/T, a = ½[1+cos(πr)], η = ηmin + (ηmax−ηmin)a.
 * 반원 위 점의 각도가 πr이고, 그 점을 아래로 내린 가로 위치가 cos(πr)입니다.
 * a와 η는 cos의 일차식이라 같은 가로 위치에 눈금만 다시 붙이면 됩니다.
 * ηmax=.1, ηmin=.001(본문). r=.25는 중간 모양을 보이려고 더한 예시 지점입니다(가정).
 * r=0 → a=1, η=.1 · r=.25 → a≈.854, η≈.0855 · r=.5 → a=.5, η=.0505 · r=1 → a=0, η=.001.
 */
const ETA_MAX = 0.1;
const ETA_MIN = 0.001;
const POINTS = [0, 0.25, 0.5, 1] as const;

const CX = 180;
const CY = 140;
const R = 130;
const AXIS_COS = 172;
const AXIS_A = 202;
const AXIS_ETA = 232;

const fmt = (value: number, digits: number) => {
  const text = value.toFixed(digits).replace(/0+$/, "").replace(/\.$/, "");
  return text.replace(/^(-?)0\./, "$1.").replace("-", "−");
};

const values = POINTS.map((r) => {
  const cos = Math.cos(Math.PI * r);
  const a = (1 + cos) / 2;
  const eta = ETA_MIN + (ETA_MAX - ETA_MIN) * a;
  return { r, cos, a, eta };
});

const SCENES = [
  {
    label: "시작 r=0",
    summary: "cos 0 = 1 → a=1 → η=.1",
    note: "각도 0이면 점은 오른쪽 끝입니다. cos=1, a=1, η=.001+.099×1=.1로 peak LR입니다.",
  },
  {
    label: "예시 r=.25 (가정)",
    summary: "a≈.854 → η≈.0855",
    note: "본문 밖 예시입니다. 진행률은 .25지만 a는 1에서 약 .146만 줄었습니다. η≈.001+.099×.854≈.0855.",
  },
  {
    label: "중간 r=.5",
    summary: "cos(π/2) = 0 → a=.5 → η=.0505",
    note: "점이 꼭대기면 cos=0, a=.5, η=.001+.099×.5=.0505로 본문의 중간값입니다.",
  },
  {
    label: "끝 r=1",
    summary: "cos π = −1 → a=0 → η=.001",
    note: "각도 π에서 cos=−1, a=0이라 η는 minimum LR .001입니다.",
  },
] as const;

function Axis({ y, name, left, right, hide }: { y: number; name: string; left: string; right: string; hide: "left" | "right" | null }) {
  return (
    <g>
      <line x1={CX - R} x2={CX + R} y1={y} y2={y} stroke="#94a3b8" strokeWidth={1} />
      <line x1={CX - R} x2={CX - R} y1={y - 3} y2={y + 3} stroke="#94a3b8" strokeWidth={1} />
      <line x1={CX + R} x2={CX + R} y1={y - 3} y2={y + 3} stroke="#94a3b8" strokeWidth={1} />
      <text x={CX - R - 10} y={y + 4} textAnchor="end" className="text-[15px] sm:text-[10px]" fill="#64748b">
        {name}
      </text>
      <text x={CX - R - 2} y={y + 15} textAnchor="start" opacity={hide === "left" ? 0 : 1} className="text-[14px] sm:text-[9px]" fill="#64748b">
        {left}
      </text>
      <text x={CX + R + 2} y={y + 15} textAnchor="end" opacity={hide === "right" ? 0 : 1} className="text-[14px] sm:text-[9px]" fill="#64748b">
        {right}
      </text>
    </g>
  );
}

export default function CosineMappingViz() {
  return (
    <SceneShell
      eyebrow="반 주기 cosine"
      title="반원 위의 각도가 learning rate로 내려오는 길"
      description="반원 위 점의 각도가 πr입니다. 점을 아래로 내린 가로 위치에 cos, a, η 세 눈금이 겹쳐 있어 한 위치에서 세 값을 읽습니다. ηmax=.1, ηmin=.001은 본문 값입니다."
      ariaLabel="cycle progress r을 반원 각도로 바꾸고 cosine 투영을 learning rate 눈금으로 읽는 과정"
      scenes={SCENES}
      render={(active) => {
        const point = values[active];
        const px = CX + R * point.cos;
        const py = CY - R * Math.sin(Math.PI * point.r);
        const hide = point.r === 0 ? ("right" as const) : point.r === 1 ? ("left" as const) : null;
        const arcEnd = { x: CX + 28 * point.cos, y: CY - 28 * Math.sin(Math.PI * point.r) };
        return (
          <svg
            viewBox="0 0 360 252"
            role="img"
            aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}
            className="mx-auto block h-auto w-full max-w-[540px] text-foreground"
          >
            <path d={`M${CX + R} ${CY} A${R} ${R} 0 0 0 ${CX - R} ${CY}`} fill="none" stroke="#cbd5e1" strokeWidth={1} />
            <line x1={CX - R} x2={CX + R} y1={CY} y2={CY} stroke="#cbd5e1" strokeWidth={1} />
            {point.r > 0 && (
              <path
                d={`M${CX + 28} ${CY} A28 28 0 0 0 ${arcEnd.x} ${arcEnd.y}`}
                fill="none"
                stroke="#d97706"
                strokeWidth={1.25}
              />
            )}
            <line x1={CX} y1={CY} x2={px} y2={py} stroke="#d97706" strokeWidth={1} />
            <text x={point.r > 0 ? CX - 32 : CX + 34} y={CY - 10} textAnchor={point.r > 0 ? "end" : "start"} className="text-[15px] sm:text-[10px]" fill="#b45309">
              {`각도 πr${point.r > 0 ? ` (r=${fmt(point.r, 2)})` : " = 0"}`}
            </text>
            <line x1={px} y1={py} x2={px} y2={AXIS_ETA} stroke="#2563eb" strokeWidth={1} strokeDasharray="3 3" />
            <circle cx={px} cy={py} r={5} fill="#2563eb" />
            <Axis y={AXIS_COS} name="cos" left="−1" right="1" hide={hide} />
            <Axis y={AXIS_A} name="a" left="0" right="1" hide={hide} />
            <Axis y={AXIS_ETA} name="η" left=".001" right=".1" hide={hide} />
            {[
              { y: AXIS_COS, text: fmt(point.cos, 3) },
              { y: AXIS_A, text: fmt(point.a, 3) },
              { y: AXIS_ETA, text: fmt(point.eta, 4) },
            ].map((mark) => (
              <g key={mark.y}>
                <circle cx={px} cy={mark.y} r={3.5} fill="#2563eb" />
                <text
                  x={px + (px > CX + R - 40 ? -7 : 7)}
                  y={mark.y - 5}
                  textAnchor={px > CX + R - 40 ? "end" : "start"}
                  className="text-[16px] sm:text-[11px]"
                  fontWeight={700}
                  fill="#2563eb"
                >
                  {mark.text}
                </text>
              </g>
            ))}
          </svg>
        );
      }}
    />
  );
}
