import SceneShell from "./SceneShell";

/**
 * 본문 대응: #alternatives(10절) — 같은 단면에서 옆 확산·접촉 창 폭·정렬을 바꿔 한쪽 거리를 다시 계산한다.
 * 가로축만 실제 비율(µm), 깊이는 그림용. 가운데를 0으로 둔다.
 * 기준 104/80 → 12·12, 옆 확산 5 → 110/80 → 15·15, 창 100 → 104/100 → 2·2,
 * 오른쪽 3 µm 치우침 → 창 −47~+53, p ±52 → 왼쪽 5, 오른쪽 −1.
 */
const SCENES = [
  { label: "기준 단면", summary: "(104 − 80) ÷ 2 = 12 µm", pWidth: 104, cWidth: 80, shift: 0, note: "9절의 좌표 그대로입니다. p형 표면은 가운데에서 좌우 52 µm, 전극 창은 좌우 40 µm까지라 각 끝에 52 − 40 = 12 µm가 남고 그 위에 막이 남습니다. 특허가 보증한 안전 거리가 아닙니다." },
  { label: "옆 확산 5 µm (가정)", summary: "110 − 80 → 한쪽 15 µm", pWidth: 110, cWidth: 80, shift: 0, note: "같은 100 µm 첫 창에서 한쪽 5 µm씩 퍼진다고 새로 가정하면 p형 표면 폭은 110 µm, 한쪽 거리는 15 µm입니다. p형 영역 자체도 넓어지므로 옆 소자와의 간격까지 자동으로 좋아지는 것은 아닙니다." },
  { label: "접촉 창 100 µm", summary: "(104 − 100) ÷ 2 = 2 µm", pWidth: 104, cWidth: 100, shift: 0, note: "p형 폭을 104 µm로 되돌리고 접촉 창만 100 µm로 넓히면 가운데 정렬이어도 한쪽에 2 µm밖에 남지 않습니다." },
  { label: "오른쪽 3 µm 치우침 (가정)", summary: "오른쪽 2 − 3 = −1 µm", pWidth: 104, cWidth: 100, shift: 3, note: "100 µm 창이 오른쪽으로 3 µm 치우치면 창은 −47~+53 µm입니다. 왼쪽은 5 µm로 늘지만 오른쪽은 −1 µm, 창이 경계를 1 µm 넘어갑니다. 평균 폭과 가장 가까운 접합의 덮임은 다른 검사입니다." },
] as const;

const W = 360;
const H = 244;
const MAIN_CENTER = 180;
const MAIN_SCALE = 320 / 120;
const mx = (um: number) => MAIN_CENTER + um * MAIN_SCALE;
const INSET_FROM = 34;
const INSET_SCALE = 12.5;
const ix = (um: number) => 30 + (um - INSET_FROM) * INSET_SCALE;

const COLOR = {
  oxide: "#64748b",
  contact: "#ca8a04",
  pRegion: "#fcd34d",
  nRegion: "#bfdbfe",
  edge: "#92400e",
  ok: "#1d4ed8",
  bad: "#dc2626",
  text: "#334155",
  muted: "#64748b",
};

const fmt = (value: number) => (value < 0 ? `−${Math.abs(value)}` : `${value}`);

function Margin({ from, to, y, value, x, side = false }: { from: number; to: number; y: number; value: number; x: (um: number) => number; side?: boolean }) {
  const color = value < 0 ? COLOR.bad : COLOR.ok;
  const a = x(Math.min(from, to));
  const b = x(Math.max(from, to));
  return (
    <g>
      <line x1={a} x2={b} y1={y} y2={y} stroke={color} strokeWidth={1.25} />
      <line x1={a} x2={a} y1={y - 4} y2={y + 4} stroke={color} strokeWidth={1} />
      <line x1={b} x2={b} y1={y - 4} y2={y + 4} stroke={color} strokeWidth={1} />
      <text x={side ? a - 6 : (a + b) / 2} y={side ? y + 4 : y - 7} textAnchor={side ? "end" : "middle"} fontSize={11} fontWeight={700} fill={color}>
        {fmt(value)} µm
      </text>
    </g>
  );
}

export default function MarginShiftViz() {
  return (
    <SceneShell
      eyebrow="가상 단면 · 한쪽 거리 검산"
      title="창 폭과 정렬이 바뀌면 남는 거리가 바뀝니다"
      description="위는 단면 전체, 아래는 오른쪽 끝을 크게 키운 그림입니다. 가로 위치만 µm 비율에 맞췄고 깊이는 그림용입니다. 모든 치수는 이 글의 가정입니다."
      note="파란 구간은 전극 창 끝에서 p형 표면 끝(p-n 접합이 표면에 닿는 곳)까지 남는 거리이고, 빨간 구간은 창이 그 끝을 넘어간 길이입니다. 실제 확산 편차와 접촉 손상은 넣지 않은 단순 기하입니다."
      ariaLabel="p형 표면 폭과 전극 창의 폭·정렬을 바꿀 때 양쪽에 남는 거리"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const pHalf = scene.pWidth / 2;
        const cLeft = scene.shift - scene.cWidth / 2;
        const cRight = scene.shift + scene.cWidth / 2;
        const leftMargin = cLeft + pHalf;
        const rightMargin = pHalf - cRight;
        const pL = mx(-pHalf);
        const pR = mx(pHalf);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${scene.label}: 왼쪽 ${fmt(leftMargin)} µm, 오른쪽 ${fmt(rightMargin)} µm`}>
            {/* 전체 단면 */}
            <Margin from={-pHalf} to={cLeft} y={26} value={leftMargin} x={mx} />
            <Margin from={cRight} to={pHalf} y={26} value={rightMargin} x={mx} />
            <text x={mx(scene.shift)} y={40} textAnchor="middle" fontSize={11} fontWeight={700} fill={COLOR.contact}>
              전극 창 {scene.cWidth} µm
            </text>
            <rect x={mx(-60)} y={58} width={120 * MAIN_SCALE} height={58} fill={COLOR.nRegion} />
            <path d={`M ${pL} 58 L ${pL} 86 Q ${pL} 98 ${pL + 12} 98 L ${pR - 12} 98 Q ${pR} 98 ${pR} 86 L ${pR} 58 Z`} fill={COLOR.pRegion} stroke={COLOR.edge} strokeWidth={1} />
            <rect x={mx(-60)} y={52} width={120 * MAIN_SCALE} height={6} fill={COLOR.oxide} />
            <rect x={mx(cLeft)} y={46} width={scene.cWidth * MAIN_SCALE} height={12} fill={COLOR.contact} />
            <line x1={pL} x2={pL} y1={30} y2={58} stroke={COLOR.edge} strokeWidth={1} strokeDasharray="2 2" />
            <line x1={pR} x2={pR} y1={30} y2={58} stroke={COLOR.edge} strokeWidth={1} strokeDasharray="2 2" />
            <text x={MAIN_CENTER} y={80} textAnchor="middle" fontSize={11} fontWeight={700} fill={COLOR.edge}>
              p형 표면 폭 {scene.pWidth} µm
            </text>
            <text x={mx(-58)} y={111} fontSize={10} fill={COLOR.text}>
              n형 실리콘
            </text>
            <line x1={mx(48)} x2={mx(58)} y1={124} y2={124} stroke={COLOR.muted} strokeWidth={1} />
            <text x={mx(58)} y={136} textAnchor="end" fontSize={10} fill={COLOR.muted}>
              10 µm
            </text>
            <text x={mx(-60)} y={136} fontSize={10} fill={COLOR.muted}>
              가운데 0 · 좌우 ±60 µm
            </text>

            {/* 오른쪽 끝 확대 */}
            <line x1={10} x2={W - 10} y1={144} y2={144} stroke="#cbd5e1" strokeWidth={1} />
            <text x={10} y={158} fontSize={10} fontWeight={700} fill={COLOR.muted}>
              오른쪽 끝 확대 · 34–58 µm
            </text>
            <text x={ix(cRight)} y={170} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLOR.contact}>
              창 끝 +{cRight}
            </text>
            <rect x={ix(INSET_FROM)} y={188} width={24 * INSET_SCALE} height={36} fill={COLOR.nRegion} />
            <rect x={ix(INSET_FROM)} y={188} width={(pHalf - INSET_FROM) * INSET_SCALE} height={26} fill={COLOR.pRegion} />
            <line x1={ix(pHalf)} x2={ix(pHalf)} y1={188} y2={228} stroke={COLOR.edge} strokeWidth={1.25} />
            <rect x={ix(INSET_FROM)} y={182} width={24 * INSET_SCALE} height={6} fill={COLOR.oxide} />
            <rect x={ix(INSET_FROM)} y={174} width={(cRight - INSET_FROM) * INSET_SCALE} height={14} fill={COLOR.contact} />
            <Margin from={cRight} to={pHalf} y={204} value={rightMargin} x={ix} side />
            <text x={ix(pHalf)} y={240} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLOR.edge}>
              p 끝 +{pHalf}
            </text>
          </svg>
        );
      }}
    />
  );
}
