import SceneShell from "./SceneShell";

/**
 * 본문 대응: #architecture "layer depth와 time depth는 다른 축이다".
 * h_t^(l)은 아래 layer의 같은 시점 h_t^(l-1)과 같은 layer의 직전 state h_{t-1}^(l)을 함께 기다린다.
 * layer 2개 · 시점 4개는 그림용 가정. h_4^(2)에서 h_1^(1)까지는 시간 방향 3칸 + layer 방향 1칸.
 */
const T = 4;
const L = 2;
const W = 360;
const H = 236;
const COL_X = (t: number) => 92 + (t - 1) * 78;
const ROW_Y = (l: number) => (l === 0 ? 200 : l === 1 ? 138 : 64);
const BOX_W = 52;
const BOX_H = 32;

const SUB = ["", "₁", "₂", "₃", "₄"];
const SUP = ["⁽⁰⁾", "⁽¹⁾", "⁽²⁾"];

/** 마지막 장면에서 강조하는 역방향 경로의 cell들. [t, l] */
const PATH: readonly (readonly [number, number])[] = [[1, 1], [2, 1], [3, 1], [4, 1], [4, 2]];

const SCENES = [
  { label: "layer 하나는 시간축 한 줄", summary: "h₁⁽¹⁾ → h₂⁽¹⁾ → h₃⁽¹⁾ → h₄⁽¹⁾", note: "앞에서 펼친 그림이 이 한 줄입니다. 위첨자 (1)은 첫 번째 recurrent layer라는 뜻이고, 같은 cell을 시점마다 호출해 오른쪽으로 state를 넘깁니다." },
  { label: "layer를 쌓으면 위로 한 줄 더", summary: "h_t⁽¹⁾이 위 layer의 입력", note: "Stacked RNN에서는 한 시점 안에서도 여러 recurrent layer를 통과합니다. 아래 layer가 만든 같은 시점의 state가 위 layer의 입력이 됩니다. layer 2개와 시점 4개는 그림을 위한 가정입니다." },
  { label: "한 cell이 기다리는 두 값", summary: "h₃⁽²⁾ ← h₃⁽¹⁾(아래) + h₂⁽²⁾(왼쪽)", note: "h₃⁽²⁾는 아래 layer의 같은 시점 state와 같은 layer의 직전 state가 모두 준비돼야 계산됩니다. 본문이 말하는 두 dependency가 이 위쪽 화살표와 오른쪽 화살표입니다." },
  { label: "두 축 모두 경로를 늘립니다", summary: "h₄⁽²⁾ → h₁⁽¹⁾: 시간 3칸 + layer 1칸", note: "h₄⁽²⁾에서 h₁⁽¹⁾까지 거꾸로 가는 길은 어느 경로든 시간 방향 3칸과 layer 방향 1칸을 지납니다. sequence를 늘리면 앞의 수가, layer를 쌓으면 뒤의 수가 커지므로 backprop에서는 둘 다 긴 경로를 만들 수 있습니다." },
] as const;

const onPath = (t: number, l: number) => PATH.some(([pt, pl]) => pt === t && pl === l);

function Arrow({ x1, y1, x2, y2, color, width }: { x1: number; y1: number; x2: number; y2: number; color: string; width: number }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const a1 = angle + Math.PI * 0.85;
  const a2 = angle - Math.PI * 0.85;
  const head = `${x2},${y2} ${x2 + 6 * Math.cos(a1)},${y2 + 6 * Math.sin(a1)} ${x2 + 6 * Math.cos(a2)},${y2 + 6 * Math.sin(a2)}`;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} />
      <polygon points={head} fill={color} />
    </g>
  );
}

export default function StackedRnnGridViz() {
  return (
    <SceneShell
      eyebrow="Layer 축과 time 축"
      title="Stacked RNN의 cell은 아래와 왼쪽, 두 방향에서 값을 받습니다"
      description="가로는 시점 t, 세로는 layer l입니다. 칸 하나가 hₜ⁽ˡ⁾ 하나이며, 맨 아래 줄은 각 시점의 입력 xₜ입니다."
      ariaLabel="layer 2개와 시점 4개로 펼친 stacked RNN에서 한 cell의 두 dependency와 역방향 경로"
      scenes={SCENES}
      render={(active) => {
        const layersShown = active === 0 ? 1 : L;
        const focus: readonly [number, number] = [3, 2];
        const edgeColor = (from: readonly [number, number], to: readonly [number, number]) => {
          if (active === 2 && to[0] === focus[0] && to[1] === focus[1]) return "#d97706";
          if (active === 3 && onPath(...from) && onPath(...to)) return "#dc2626";
          return "#94a3b8";
        };
        const edgeWidth = (color: string) => (color === "#94a3b8" ? 1 : 1.25);
        const cells = Array.from({ length: T }, (_, i) => i + 1).flatMap((t) =>
          Array.from({ length: L + 1 }, (_, l) => [t, l] as const),
        );
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={10} y={ROW_Y(0) + 4} fontSize={10} fill="#64748b">입력</text>
            <text x={10} y={ROW_Y(1) + 4} fontSize={10} fill="#64748b">layer 1</text>
            <text x={10} y={ROW_Y(2) + 4} fontSize={10} fill={layersShown >= 2 ? "#64748b" : "#cbd5e1"}>layer 2</text>
            {Array.from({ length: T }, (_, i) => (
              <text key={i} x={COL_X(i + 1)} y={20} textAnchor="middle" fontSize={10} fill="#64748b">t={i + 1}</text>
            ))}

            {cells.map(([t, l]) => {
              const visible = l <= layersShown;
              if (!visible) return null;
              const edges: { from: readonly [number, number]; to: readonly [number, number] }[] = [];
              if (l >= 1) edges.push({ from: [t, l - 1], to: [t, l] });
              if (l >= 1 && t >= 2) edges.push({ from: [t - 1, l], to: [t, l] });
              return edges.map(({ from, to }) => {
                const color = edgeColor(from, to);
                const vertical = from[0] === to[0];
                const x1 = vertical ? COL_X(from[0]) : COL_X(from[0]) + BOX_W / 2;
                const y1 = vertical ? ROW_Y(from[1]) - BOX_H / 2 : ROW_Y(from[1]);
                const x2 = vertical ? COL_X(to[0]) : COL_X(to[0]) - BOX_W / 2 - 1;
                const y2 = vertical ? ROW_Y(to[1]) + BOX_H / 2 + 1 : ROW_Y(to[1]);
                return <Arrow key={`${from.join("-")}>${to.join("-")}`} x1={x1} y1={y1} x2={x2} y2={y2} color={color} width={edgeWidth(color)} />;
              });
            })}

            {cells.map(([t, l]) => {
              if (l > layersShown) {
                return <rect key={`${t}-${l}`} x={COL_X(t) - BOX_W / 2} y={ROW_Y(l) - BOX_H / 2} width={BOX_W} height={BOX_H} rx={6} fill="none" stroke="#e2e8f0" strokeWidth={1} strokeDasharray="3 3" />;
              }
              const isFocus = active === 2 && t === focus[0] && l === focus[1];
              const isSource = active === 2 && ((t === 3 && l === 1) || (t === 2 && l === 2));
              const isPath = active === 3 && onPath(t, l);
              const stroke = isFocus ? "#2563eb" : isSource ? "#d97706" : isPath ? "#dc2626" : l === 0 ? "#94a3b8" : "#475569";
              const label = l === 0 ? `x${SUB[t]}` : `h${SUB[t]}${SUP[l]}`;
              return (
                <g key={`${t}-${l}`}>
                  <rect x={COL_X(t) - BOX_W / 2} y={ROW_Y(l) - BOX_H / 2} width={BOX_W} height={BOX_H} rx={6} fill={isFocus ? "#eff6ff" : "#ffffff"} stroke={stroke} strokeWidth={isFocus || isSource || isPath ? 1.25 : 1} />
                  <text x={COL_X(t)} y={ROW_Y(l) + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#1e293b">{label}</text>
                </g>
              );
            })}

            {active === 3 && (
              <text x={W / 2} y={H - 6} textAnchor="middle" fontSize={10} fontWeight={700} fill="#dc2626">빨간 길: 시간 방향 3칸 + layer 방향 1칸 (다른 길도 같은 수)</text>
            )}
            {active === 2 && (
              <text x={W / 2} y={H - 6} textAnchor="middle" fontSize={10} fontWeight={700} fill="#d97706">주황 두 칸이 모두 준비돼야 h₃⁽²⁾ 계산</text>
            )}
          </svg>
        );
      }}
    />
  );
}
