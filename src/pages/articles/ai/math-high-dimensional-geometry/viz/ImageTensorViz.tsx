import SceneShell from "./SceneShell";

/**
 * 본문 대응: #intrinsic-dimension — 세로 224칸 × 가로 224칸 × 칸마다 색 channel 3개 = 150,528.
 * 224칸은 8칸으로 줄여 그렸고 칸 수는 본문의 값입니다. 50,176은 224×224의 산술입니다.
 * channel은 공간의 위치가 아니라 색의 구분이라 판을 나란히 놓은 2D로 그립니다.
 */
const BLUE = "#2563eb";
const AMBER = "#d97706";
const GRAY = "#64748b";
const FAINT = "#94a3b8";
const W = 340;
const H = 206;
const SIDE = 88;
const STEPS = 8;
const CELL = SIDE / STEPS;
const Y0 = 28;
const XS = [28, 130, 232] as const;

const SCENES = [
  { label: "한 판", summary: "224 × 224 = 50,176", note: "세로 224칸, 가로 224칸인 판 하나에 50,176칸이 있습니다. 칸마다 색 값 하나가 들어갑니다." },
  { label: "세 판", summary: "50,176 × 3 = 150,528", note: "칸마다 색 channel이 3개라 같은 크기의 판이 세 장입니다. 그래서 한 image를 적는 색상 좌표는 150,528개입니다." },
  { label: "칸 하나가 좌표 하나", summary: "이미지 한 장 = 점 하나", note: "칸 하나가 좌표 하나이므로 이미지 한 장은 150,528칸 공간의 점 하나입니다. 이 값은 주변 차원입니다." },
] as const;

function Plate({ x, active, name }: { x: number; active: boolean; name: string }) {
  return (
    <g>
      <text x={x + SIDE / 2} y={Y0 - 8} textAnchor="middle" fontSize={12} fontWeight={700} fill={active ? BLUE : FAINT}>{name}</text>
      <rect x={x} y={Y0} width={SIDE} height={SIDE} fill={active ? BLUE : "none"} fillOpacity={0.1} stroke={active ? BLUE : FAINT} strokeWidth={1} strokeDasharray={active ? undefined : "3 3"} />
      {active && Array.from({ length: STEPS - 1 }, (_, index) => {
        const t = (index + 1) * CELL;
        return (
          <g key={index}>
            <line x1={x + t} x2={x + t} y1={Y0} y2={Y0 + SIDE} stroke={BLUE} strokeWidth={1} opacity={0.35} />
            <line x1={x} x2={x + SIDE} y1={Y0 + t} y2={Y0 + t} stroke={BLUE} strokeWidth={1} opacity={0.35} />
          </g>
        );
      })}
    </g>
  );
}

export default function ImageTensorViz() {
  return (
    <SceneShell
      eyebrow="칸 수의 곱셈"
      title="224 × 224 × 3은 같은 크기의 판 세 장에 든 칸 수입니다"
      description="판 하나가 색 channel 하나이고 작은 칸 하나가 숫자 하나입니다."
      note="224칸을 8칸으로 줄여 그렸습니다. 칸 수는 본문의 값입니다."
      ariaLabel="이미지 한 장의 칸을 판 세 장으로 나누어 센 그림"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {XS.map((x, index) => (
            <Plate key={x} x={x} active={active > 0 || index === 0} name={`channel ${index + 1}`} />
          ))}
          <text transform={`translate(18 ${Y0 + SIDE / 2}) rotate(-90)`} textAnchor="middle" fontSize={12} fill={GRAY}>세로 224칸</text>
          <text x={XS[0] + SIDE / 2} y={Y0 + SIDE + 18} textAnchor="middle" fontSize={12} fill={GRAY}>가로 224칸</text>
          {active === 0 && <text x={W / 2} y={176} textAnchor="middle" fontSize={14} fontWeight={700} fill={BLUE}>판 하나 50,176칸</text>}
          {active === 1 && (
            <g>
              <path d={`M ${XS[0]} ${Y0 + SIDE + 26} v 6 H ${XS[2] + SIDE} v -6`} fill="none" stroke={GRAY} strokeWidth={1} />
              <text x={W / 2} y={176} textAnchor="middle" fontSize={14} fontWeight={700} fill={BLUE}>세 판을 합쳐 150,528칸</text>
            </g>
          )}
          {active === 2 && (
            <g>
              <rect x={XS[2] + CELL * 5} y={Y0 + CELL} width={CELL} height={CELL} fill={AMBER} stroke={AMBER} strokeWidth={1} />
              <text x={XS[2] + SIDE / 2} y={Y0 + SIDE + 18} textAnchor="middle" fontSize={12} fontWeight={700} fill={AMBER}>주황 칸 = 좌표 1개</text>
              <circle cx={40} cy={172} r={5} fill={BLUE} />
              <text x={54} y={177} fontSize={13} fontWeight={700} fill={BLUE}>한 장 전체가 150,528칸 공간의 점 하나</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
