import SceneShell from "./SceneShell";

/**
 * 본문 대응: #concentration 첫 문단 — 0·1 좌표의 점은 정육면체의 꼭짓점이고, 다른 칸 수 H가 제곱거리다.
 * 본문의 D=4와 D=1000은 그대로 그릴 수 없어 설명용으로 D=3만 그렸습니다. 1/√3은 본문의 1/√D에 D=3을 넣은 산술입니다.
 * 답이 층별 개수 1·3·3·1이라, 정육면체를 H별 세로 줄로 펴서 층을 곧바로 셉니다. 선은 한 칸만 다른 쌍(모서리)입니다.
 */
const BLUE = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const FAINT = "#94a3b8";
const GRAY = "#64748b";
const SLATE = "#475569";
const W = 340;
const H = 232;

type Bits = readonly [number, number, number];
const CORNERS: readonly Bits[] = [
  [0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 0], [1, 0, 1], [0, 1, 1], [1, 1, 1],
];
const hamming = ([a, b, c]: Bits) => a + b + c;
const differs = (a: Bits, b: Bits) => a.filter((value, index) => value !== b[index]).length;
const layerX = (layer: number) => 50 + layer * 80;

const LAYER_COLOR = [SLATE, BLUE, AMBER, RED] as const;
const COUNTS = [1, 3, 3, 1] as const;
const SHOW: readonly (readonly number[])[] = [[0, 2], [0, 1], [0, 1, 2], [0, 1, 2, 3]];

const SCENES = [
  { label: "점 하나가 꼭짓점", summary: "다른 칸 2개 → H=2", note: "칸이 셋이면 0·1 좌표의 점은 정육면체 꼭짓점입니다. 다른 칸마다 모서리 하나를 지나고, 그 수 H가 제곱거리입니다. 곧은 거리는 √2입니다." },
  { label: "한 칸 다른 곳", summary: "H=1인 점 3개", note: "기준점에서 모서리 하나로 닿는 꼭짓점이 셋입니다. 바꿀 칸을 고르는 방법이 세 가지이기 때문입니다." },
  { label: "두 칸 다른 곳", summary: "H=2인 점 3개", note: "두 칸을 바꾸는 방법도 세 가지입니다. 가운데 두 층에 꼭짓점 여섯 개가 몰립니다." },
  { label: "반대편까지", summary: "1·3·3·1 · 약 57.7%", note: "평균 1.5에 표준편차 약 0.866이라 평균에 견준 폭은 1/√3입니다. 칸이 늘면 D=4에서 50%, D=1000에서 약 3.162%로 좁아집니다." },
] as const;

const position = (corner: Bits) => {
  const layer = hamming(corner);
  const peers = CORNERS.filter((item) => hamming(item) === layer);
  return { x: layerX(layer), y: 92 + (peers.findIndex((item) => item.join() === corner.join()) - (peers.length - 1) / 2) * 52, layer };
};

const PATH_FIRST: readonly [Bits, Bits] = [[0, 0, 0], [1, 0, 0]];
const PATH_THIRD: readonly [Bits, Bits] = [[1, 0, 0], [1, 0, 1]];

function Layers({ active }: { active: number }) {
  const halo = { className: "stroke-background", strokeWidth: 3, style: { paintOrder: "stroke" as const } };
  const pathLine = ([a, b]: readonly [Bits, Bits], color: string) => {
    const from = position(a);
    const to = position(b);
    return <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={color} strokeWidth={1.25} />;
  };
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      {CORNERS.flatMap((a) =>
        CORNERS.filter((b) => hamming(a) < hamming(b) && differs(a, b) === 1).map((b) => {
          const from = position(a);
          const to = position(b);
          const reach = active === 1 && hamming(a) === 0;
          return <line key={`${a.join()}-${b.join()}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={reach ? BLUE : FAINT} strokeWidth={reach ? 1.25 : 0.75} />;
        }),
      )}
      {active === 0 && (
        <g>
          {pathLine(PATH_FIRST, BLUE)}
          {pathLine(PATH_THIRD, AMBER)}
          <text x={78} y={58} textAnchor="middle" fontSize={12} fontWeight={700} fill={BLUE} {...halo}>첫 칸</text>
          <text x={190} y={64} textAnchor="middle" fontSize={12} fontWeight={700} fill={AMBER} {...halo}>셋째 칸</text>
        </g>
      )}
      {CORNERS.map((corner) => {
        const { x, y, layer } = position(corner);
        const on = active === 0 ? corner.join() === "0,0,0" || corner.join() === "1,0,1" : SHOW[active].includes(layer);
        const color = on ? LAYER_COLOR[layer] : GRAY;
        return (
          <g key={corner.join()}>
            <circle cx={x} cy={y} r={on ? 8 : 5} fill={on ? LAYER_COLOR[layer] : "#cbd5e1"} />
            <text x={x} y={y - 12} textAnchor="middle" fontSize={12} fontWeight={on ? 700 : 400} fill={color} {...halo}>{`(${corner.join(",")})`}</text>
          </g>
        );
      })}
      <text x={layerX(0)} y={92 + 24} textAnchor="middle" fontSize={12} fontWeight={700} fill={SLATE}>기준점</text>
      {COUNTS.map((count, layer) => {
        const counted = active !== 0 && SHOW[active].includes(layer);
        return (
          <g key={layer}>
            <text x={layerX(layer)} y={180} textAnchor="middle" fontSize={12} fill={GRAY}>{`H=${layer}`}</text>
            {counted && <text x={layerX(layer)} y={197} textAnchor="middle" fontSize={13} fontWeight={700} fill={LAYER_COLOR[layer]}>{`${count}개`}</text>}
          </g>
        );
      })}
      {active >= 2 && (
        <g>
          <path d={`M ${layerX(1) - 22} 204 v 5 H ${layerX(2) + 22} v -5`} fill="none" stroke={GRAY} strokeWidth={1} />
          <text x={(layerX(1) + layerX(2)) / 2} y={226} textAnchor="middle" fontSize={12} fontWeight={700} fill={GRAY}>{active === 2 ? "가운데 두 층 6개" : "8개 중 6개가 가운데"}</text>
        </g>
      )}
    </svg>
  );
}

export default function HammingCubeViz() {
  return (
    <SceneShell
      eyebrow="0과 1로 된 좌표"
      title="꼭짓점을 세어 보면 가운데 거리에 점이 몰립니다"
      description="점 하나가 정육면체 꼭짓점 하나, 곧 0·1 좌표의 점 하나입니다. 세로 줄은 기준점과 다른 칸 수가 같은 점들이고, 선은 정육면체의 모서리입니다."
      note="D=4와 D=1000은 그대로 그릴 수 없어 설명용으로 칸 셋만 그렸습니다(가정)."
      ariaLabel="정육면체 꼭짓점을 다른 칸 수별로 줄 세운 그림과 제곱거리"
      scenes={SCENES}
      render={(active) => <Layers active={active} />}
    />
  );
}
