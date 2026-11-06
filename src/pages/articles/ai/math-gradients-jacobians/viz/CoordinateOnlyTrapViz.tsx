import SceneShell from "./SceneShell";

/**
 * 본문 대응: #boundaries — r(x,y)=xy/(x²+y²), 원점 값은 0(가정).
 * 축 위: 분자가 0이라 값 0. x=y=t≠0: t²/(2t²)=1/2.
 */
const SCENES = [
  { label: "두 좌표축 위", summary: "값 항상 0", path: "axes", note: "x축이나 y축 위에서는 분자 xy가 0이라 값이 늘 0입니다. 좌표 하나만 움직이는 비교로는 원점의 두 편미분이 0으로 나옵니다." },
  { label: "대각선 x = y = t", summary: "t²/(2t²) = 1/2", path: "diagonal", note: "대각선으로 접근하면 t를 아무리 줄여도 값이 1/2입니다. t=0.1이면 0.01/0.02, t=0.01이면 0.0001/0.0002로 그대로입니다." },
  { label: "원점에서 끊김", summary: "접근값 1/2 ↔ 원점 0", path: "both", note: "원점의 값 0으로 뛰므로 원점에서 연속조차 아닙니다. 두 편미분 0으로 만드는 선형식은 어디서나 0을 예측해 대각선의 1/2을 설명하지 못합니다." },
] as const;

const AXIS = "#2563eb";
const DIAG = "#d97706";

function PlaneMap({ path }: { path: string }) {
  const axes = path !== "diagonal";
  const diagonal = path !== "axes";
  return (
    <svg viewBox="0 0 180 180" className="mx-auto h-auto w-full max-w-[220px]" role="img" aria-label="입력 평면의 접근 경로">
      <path d="M15 90H165M90 15V165" fill="none" stroke={axes ? AXIS : "#94a3b8"} strokeWidth={axes ? "1.25" : "1"} />
      {diagonal ? <path d="M30 150L150 30" fill="none" stroke={DIAG} strokeWidth="1.25" /> : null}
      <circle cx="90" cy="90" r="4" fill="currentColor" />
      <text x="168" y="85" textAnchor="end" fontSize="15" fill="currentColor">x</text>
      <text x="98" y="24" fontSize="15" fill="currentColor">y</text>
      <text x="96" y="107" fontSize="14" fill="currentColor">원점</text>
      {diagonal ? <text x="168" y="62" textAnchor="end" fontSize="14" fontWeight="700" fill="#b45309">x = y</text> : null}
    </svg>
  );
}

function ValueGraph({ path }: { path: string }) {
  const x = (t: number) => 34 + ((t + 1) / 2) * 190;
  const y = (v: number) => 150 - (v / 0.6) * 120;
  const axes = path !== "diagonal";
  const diagonal = path !== "axes";
  return (
    <svg viewBox="0 0 240 180" className="mx-auto h-auto w-full max-w-[300px]" role="img" aria-label="경로를 따라 읽은 함수값">
      <path d={`M34 ${y(0.6)}V${y(0)}H224`} fill="none" stroke="#94a3b8" strokeWidth="1" />
      <text x="28" y={y(0) + 4} textAnchor="end" fontSize="14" fill="currentColor">0</text>
      <text x="28" y={y(0.5) + 4} textAnchor="end" fontSize="14" fill="currentColor">1/2</text>
      <text x={x(0)} y={y(0) + 16} textAnchor="middle" fontSize="14" fill="currentColor">t = 0</text>
      <text x="224" y={y(0) + 16} textAnchor="end" fontSize="14" fill="currentColor">t</text>
      <text x="42" y="22" fontSize="14" fill="currentColor">r의 값</text>
      {axes ? <path d={`M${x(-1)} ${y(0)}H${x(1)}`} fill="none" stroke={AXIS} strokeWidth="1.25" /> : null}
      {diagonal ? <path d={`M${x(-1)} ${y(0.5)}H${x(0) - 4}M${x(0) + 4} ${y(0.5)}H${x(1)}`} fill="none" stroke={DIAG} strokeWidth="1.25" /> : null}
      {diagonal ? <circle cx={x(0)} cy={y(0.5)} r="4" fill="none" stroke={DIAG} strokeWidth="1.25" /> : null}
      <circle cx={x(0)} cy={y(0)} r="4" fill="currentColor" />
      {path === "both" ? <path d={`M${x(0)} ${y(0.5) + 6}V${y(0) - 6}`} fill="none" stroke="#dc2626" strokeWidth="1" strokeDasharray="3 3" /> : null}
      {path === "both" ? <text x={x(0) + 8} y={y(0.25) + 4} fontSize="14" fontWeight="700" fill="#dc2626">1/2 차이</text> : null}
    </svg>
  );
}

export default function CoordinateOnlyTrapViz() {
  return (
    <SceneShell
      eyebrow="편미분의 한계"
      title="축에서는 0인데 대각선에서는 1/2입니다"
      description="가정 r(x,y)=xy/(x²+y²)이고 원점의 값만 0으로 정합니다. 왼쪽은 입력 평면의 접근 경로, 오른쪽은 그 경로의 값입니다. 찬 점은 정한 원점 값, 빈 원은 대각선 경로의 값이 끊기는 자리입니다."
      ariaLabel="좌표축과 대각선을 따라 원점에 접근할 때의 함수값 비교"
      scenes={SCENES}
      render={(index) => (
        <div className="grid min-w-0 grid-cols-2 items-center gap-2 sm:gap-3">
          <PlaneMap path={SCENES[index].path} />
          <ValueGraph path={SCENES[index].path} />
        </div>
      )}
    />
  );
}
