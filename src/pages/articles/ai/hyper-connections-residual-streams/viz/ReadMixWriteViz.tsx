import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mixing — Ĥ = Bᵀ T(Amᵀ H)ᵀ + Arᵀ H 를 n=2 stream, stream마다 숫자 하나(d=1)인 toy로 계산.
 * 모든 값은 설명용 가정: H=[2,4], Am=[0.5,0.5], T 출력 y=1, B=[1,0.5], Arᵀ=[[0.9,0.1],[0.1,0.9]].
 * read: 0.5×2+0.5×4=3 · write: [1, 0.5] · mix: [0.9×2+0.1×4, 0.1×2+0.9×4]=[2.2, 3.8] · 합 [3.2, 4.3].
 * 마지막 장면 n=1: Am=Ar=B=1 이면 Ĥ = h + T(h), 표준 residual.
 */
const H: readonly number[] = [2, 4];
const AM: readonly number[] = [0.5, 0.5];
const Y = 1;
const B: readonly number[] = [1, 0.5];
const AR_T: readonly (readonly number[])[] = [
  [0.9, 0.1],
  [0.1, 0.9],
];

const fmt = (value: number) => String(Math.round(value * 100) / 100);
const H0 = AM[0] * H[0] + AM[1] * H[1];
const WRITE = B.map((weight) => weight * Y);
const MIX = AR_T.map((row) => row[0] * H[0] + row[1] * H[1]);
const OUT = MIX.map((value, index) => value + WRITE[index]);

const SCENES = [
  { label: "stream 두 개", summary: `H = [${H[0]}, ${H[1]}]`, note: "n=2인 toy입니다(가정). 실제 stream은 d차원 벡터지만 여기서는 각 stream을 숫자 하나로 줄였습니다. 층 T는 이 두 값을 바로 받지 못하고 벡터 하나만 받습니다." },
  { label: "read · Am", summary: `h0 = 0.5×2 + 0.5×4 = ${fmt(H0)}`, note: "읽기 가중치 Am이 두 stream을 가중합해 층 입력 h0 하나를 만듭니다. 가중치 0.5, 0.5는 가정입니다." },
  { label: "층 T 통과", summary: `y = T(${fmt(H0)}) = ${Y} (가정)`, note: "attention이나 FFN은 원래 방식 그대로 한 번만 계산합니다. 출력값 1은 그림을 위한 가정입니다." },
  { label: "write · B", summary: `[1×1, 0.5×1] = [${WRITE.map(fmt).join(", ")}]`, note: "쓰기 가중치 B가 층 출력 하나를 두 stream에 나눠 줍니다. stream마다 받는 몫이 다를 수 있습니다(1과 0.5는 가정)." },
  { label: "mix · Ar", summary: `[${MIX.map(fmt).join(", ")}]`, note: "층 T를 거치지 않는 길입니다. Arᵀ가 기존 stream끼리 직접 섞어 위 stream은 0.9×2+0.1×4=2.2, 아래 stream은 0.1×2+0.9×4=3.8이 됩니다. 층 T를 거치지 않고 stream끼리 직접 섞는 길은 이것 하나입니다." },
  { label: "두 길을 더함", summary: `Ĥ = [${OUT.map(fmt).join(", ")}]`, note: "write로 받은 몫과 mix 결과를 stream마다 더합니다. 2.2+1=3.2, 3.8+0.5=4.3이 다음 층의 두 stream이 됩니다." },
  { label: "n = 1이면", summary: "Ĥ = h + T(h)", note: "stream이 하나면 Am, Ar, B가 모두 1이 되어 입력 h를 그대로 읽고, 그대로 남기고, 층 출력을 더합니다. 표준 residual connection과 같습니다." },
] as const;

const BLUE = "#2563eb";
const TEAL = "#0f766e";
const AMBER = "#d97706";
const INK = "#334155";
const MUTED = "#94a3b8";
const LINE = "#cbd5e1";

const LEFT_X = 40;
const RIGHT_X = 320;
const LANE_Y: readonly number[] = [140, 210];
const H0_X = 110;
const T_X = 150;
const T_W = 60;
const Y_X = 250;
const TOP_Y = 56;
const READ_LABEL: readonly (readonly number[])[] = [[76, 112], [76, 170]];
const WRITE_LABEL: readonly (readonly number[])[] = [[292, 92], [258, 150]];

function Node({ x, y, value, color, label, wide = false }: { x: number; y: number; value: string; color: string; label: string; wide?: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r={wide ? 24 : 17} fill="none" stroke={color} strokeWidth={1.25} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={wide ? 9 : 11} fontWeight={700} fill={color}>{value}</text>
      <text x={x} y={y - (wide ? 29 : 22)} textAnchor="middle" fontSize={10} fill={MUTED}>{label}</text>
    </g>
  );
}

export default function ReadMixWriteViz() {
  return (
    <SceneShell
      eyebrow="read · write · mix"
      title="층 하나는 두 stream을 읽어 합치고, 출력을 다시 나눠 쓰고, 따로 섞습니다"
      description="stream 2개짜리 toy입니다(가정). Am은 읽기 가중치, B는 쓰기 가중치, Ar은 stream끼리 섞는 행렬입니다. 숫자는 모두 설명을 위해 고른 값이며 학습된 실제 값이 아닙니다."
      ariaLabel="두 residual stream에서 read, 층 통과, write, mix, 합산을 차례로 계산"
      scenes={SCENES}
      render={(active) => {
        const single = active === 6;
        const readOn = active >= 1 && !single;
        const tOn = active >= 2 && !single;
        const writeOn = active >= 3 && !single;
        const mixOn = active >= 4 && !single;
        const lanes = single ? [0] : [0, 1];
        const inValue = (index: number) => (single ? "h" : String(H[index]));
        const outValue = (index: number) => {
          if (single) return "h+T(h)";
          if (active >= 5) return fmt(OUT[index]);
          if (active === 4) return fmt(MIX[index]);
          return "?";
        };
        const readColor = single || readOn ? BLUE : LINE;
        const tColor = single || tOn ? INK : LINE;
        const writeColor = single || writeOn ? AMBER : LINE;
        const mixColor = single || mixOn ? TEAL : LINE;
        return (
          <svg viewBox="0 0 360 240" className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {lanes.map((index) => (
              <g key={`read-${index}`}>
                <line x1={LEFT_X + 12} y1={LANE_Y[index] - 12} x2={H0_X - 12} y2={TOP_Y + 12} stroke={readColor} strokeWidth={1.25} />
                <text x={READ_LABEL[index][0]} y={READ_LABEL[index][1]} fontSize={11} fontWeight={700} fill={readColor}>{single ? "1" : `×${AM[index]}`}</text>
              </g>
            ))}
            <line x1={H0_X + 17} y1={TOP_Y} x2={T_X} y2={TOP_Y} stroke={tColor} strokeWidth={1.25} />
            <rect x={T_X} y={TOP_Y - 18} width={T_W} height={36} rx={8} fill="none" stroke={tColor} strokeWidth={1.25} />
            <text x={T_X + T_W / 2} y={TOP_Y + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={tColor}>층 T</text>
            <line x1={T_X + T_W} y1={TOP_Y} x2={Y_X - 17} y2={TOP_Y} stroke={tColor} strokeWidth={1.25} />
            <Node x={H0_X} y={TOP_Y} value={single ? "h" : readOn ? fmt(H0) : "?"} color={readColor} label="h0" />
            <Node x={Y_X} y={TOP_Y} value={single ? "T(h)" : tOn ? String(Y) : "?"} color={tColor} label="y" />
            {lanes.map((index) => (
              <g key={`write-${index}`}>
                <line x1={Y_X + 12} y1={TOP_Y + 12} x2={RIGHT_X - (single ? 16 : 12)} y2={LANE_Y[index] - (single ? 18 : 12)} stroke={writeColor} strokeWidth={1.25} strokeDasharray="4 3" />
                <text x={WRITE_LABEL[index][0]} y={WRITE_LABEL[index][1]} fontSize={11} fontWeight={700} fill={writeColor}>{single ? "1" : `×${B[index]}`}</text>
              </g>
            ))}
            {lanes.map((index) => (
              <g key={`mix-${index}`}>
                <line x1={LEFT_X + 17} y1={LANE_Y[index]} x2={RIGHT_X - (single ? 24 : 17)} y2={LANE_Y[index]} stroke={mixColor} strokeWidth={1.25} />
                <text x={84} y={LANE_Y[index] - 6} fontSize={11} fontWeight={700} fill={mixColor}>{single ? "×1" : `×${AR_T[index][index]}`}</text>
              </g>
            ))}
            {!single && (
              <g>
                <line x1={130} y1={LANE_Y[0]} x2={190} y2={LANE_Y[1]} stroke={mixColor} strokeWidth={1} />
                <line x1={130} y1={LANE_Y[1]} x2={190} y2={LANE_Y[0]} stroke={mixColor} strokeWidth={1} />
                <text x={160} y={(LANE_Y[0] + LANE_Y[1]) / 2 + 18} textAnchor="middle" fontSize={11} fontWeight={700} fill={mixColor}>×0.1</text>
              </g>
            )}
            {lanes.map((index) => (
              <g key={`nodes-${index}`}>
                <Node x={LEFT_X} y={LANE_Y[index]} value={inValue(index)} color={INK} label={single ? "h" : `H${index + 1}`} />
                <Node x={RIGHT_X} y={LANE_Y[index]} value={outValue(index)} color={active >= 5 || single ? INK : mixOn ? TEAL : MUTED} label={single ? "Ĥ" : `Ĥ${index + 1}`} wide={single} />
              </g>
            ))}
            <text x={8} y={14} fontSize={11} fill={MUTED}>파랑 read · 회색 층 · 주황 점선 write · 초록 mix</text>
          </svg>
        );
      }}
    />
  );
}
