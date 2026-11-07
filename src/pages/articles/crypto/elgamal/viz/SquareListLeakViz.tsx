import SceneShell from "./SceneShell";

/**
 * 본문 대응: #security — 제곱으로 만들 수 있는 11개와 나머지 11개.
 * 8의 거듭제곱인 가리개 11개는 모두 위 줄. 10×가리개는 모두 아래 줄(10×12→5), 4×가리개는 모두 위 줄(4×12→2).
 */
const IN = [1, 2, 3, 4, 6, 8, 9, 12, 13, 16, 18] as const;
const OUT = [5, 7, 10, 11, 14, 15, 17, 19, 20, 21, 22] as const;
const TOP = "#2563eb";
const LOW = "#b45309";
const INK = "#64748b";
const CELL = 30;
const X0 = 15;
const TOP_Y = 44;
const LOW_Y = 122;

const SCENES = [
  { label: "값을 두 줄로 나눕니다", summary: "위 11개 · 아래 11개", note: "mod 23에서 어떤 수를 제곱해 만들 수 있는 0 아닌 값이 위 줄, 그럴 수 없는 값이 아래 줄입니다. 위 줄은 곱하거나 역원을 취해도 벗어나지 않습니다." },
  { label: "가리개는 위 줄에 갇힙니다", summary: "8의 거듭제곱 → 위 줄", note: "공개키 8은 위 줄에 있고 8을 몇 번 곱해도 위 줄입니다. 8을 1번부터 11번까지 곱하면 위 줄 11개가 한 번씩 나옵니다. 가리개 12도 그중 하나입니다." },
  { label: "메시지 10을 가리면", summary: "10×12 → 5 (아래 → 아래)", note: "메시지 10은 아래 줄입니다. 가리개 11개 중 무엇을 곱해도 결과는 아래 줄에 머물고, 12를 곱한 둘째 값은 5입니다." },
  { label: "메시지 4를 가리면", summary: "4×12 → 2 (위 → 위)", note: "메시지 4는 위 줄입니다. 가리개 11개 중 무엇을 곱해도 결과는 위 줄에 머물고, 같은 12를 곱한 둘째 값은 2입니다." },
  { label: "관찰자는 줄만 봅니다", summary: "5는 아래 → 10, 2는 위 → 4", note: "관찰자는 개인키를 찾지 않고 둘째 값이 어느 줄인지 확인해 10과 4 중 어느 쪽을 가렸는지 구별합니다. 지수만 크게 쓰는 것으로 이런 메시지 공간의 문제를 고칠 수는 없습니다." },
] as const;

function Row({ values, y, color, title, filled, ring }: { values: readonly number[]; y: number; color: string; title: string; filled: boolean; ring: readonly number[] }) {
  return (
    <g>
      <text x={X0} y={y - 8} fontSize={12} fontWeight={700} fill={color}>{title}</text>
      {values.map((value, index) => {
        const marked = ring.includes(value);
        return (
          <g key={value}>
            <rect x={X0 + index * CELL} y={y} width={CELL - 3} height={28} rx={4} fill={color} fillOpacity={marked ? 1 : filled ? 0.28 : 0.08} stroke={color} strokeWidth={1} />
            <text x={X0 + index * CELL + (CELL - 3) / 2} y={y + 18.5} textAnchor="middle" fontSize={12} fontWeight={marked ? 700 : 500} fill={marked ? "#ffffff" : INK}>{value}</text>
          </g>
        );
      })}
    </g>
  );
}

const cellX = (values: readonly number[], value: number) => X0 + values.indexOf(value) * CELL + (CELL - 3) / 2;

export default function SquareListLeakViz() {
  return (
    <SceneShell
      eyebrow="메시지의 한 성질"
      title="가리개가 위 줄에 갇히면 메시지가 어느 줄인지 드러납니다"
      description="1부터 22까지를 제곱으로 만들 수 있는 값과 없는 값으로 나눴습니다. 진한 칸이 그 장면의 값입니다. 작은 mod 23 사례에 한정한 그림입니다."
      ariaLabel="제곱으로 만들 수 있는 값 11개와 나머지 11개, 메시지 10과 4의 둘째 값이 어느 줄에 있는지"
      scenes={SCENES}
      render={(active) => {
        const topFilled = active === 1 || active === 3;
        const lowFilled = active === 2;
        const topMark = active === 1 ? [8, 12] : active === 3 ? [4, 2] : active === 4 ? [2] : [];
        const lowMark = active === 2 ? [10, 5] : active === 4 ? [5] : [];
        return (
          <svg viewBox="0 0 360 190" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Row values={IN} y={TOP_Y} color={TOP} title="위 줄: 제곱으로 만들 수 있음" filled={topFilled} ring={topMark} />
            <Row values={OUT} y={LOW_Y} color={LOW} title="아래 줄: 제곱으로 만들 수 없음" filled={lowFilled} ring={lowMark} />
            {active === 3 && (
              <>
                <path d={`M${cellX(IN, 4)} ${TOP_Y + 32} C${cellX(IN, 4)} ${TOP_Y + 44} ${cellX(IN, 2)} ${TOP_Y + 44} ${cellX(IN, 2)} ${TOP_Y + 32}`} fill="none" stroke={TOP} strokeWidth={1.25} />
                <polygon points={`${cellX(IN, 2)},${TOP_Y + 29} ${cellX(IN, 2) - 4},${TOP_Y + 36} ${cellX(IN, 2) + 4},${TOP_Y + 36}`} fill={TOP} />
                <text x={(cellX(IN, 4) + cellX(IN, 2)) / 2 + 26} y={TOP_Y + 46} fontSize={11} fontWeight={700} fill={TOP}>×12</text>
              </>
            )}
            {active === 2 && (
              <>
                <path d={`M${cellX(OUT, 10)} ${LOW_Y + 32} C${cellX(OUT, 10)} ${LOW_Y + 48} ${cellX(OUT, 5)} ${LOW_Y + 48} ${cellX(OUT, 5)} ${LOW_Y + 32}`} fill="none" stroke={LOW} strokeWidth={1.25} />
                <polygon points={`${cellX(OUT, 5)},${LOW_Y + 29} ${cellX(OUT, 5) - 4},${LOW_Y + 36} ${cellX(OUT, 5) + 4},${LOW_Y + 36}`} fill={LOW} />
                <text x={(cellX(OUT, 10) + cellX(OUT, 5)) / 2 + 40} y={LOW_Y + 48} fontSize={11} fontWeight={700} fill={LOW}>×12</text>
              </>
            )}
            {active === 4 && (
              <>
                <text x={345} y={TOP_Y - 8} textAnchor="end" fontSize={12} fontWeight={700} fill={TOP}>둘째 값 2 → 메시지 4</text>
                <text x={345} y={LOW_Y - 8} textAnchor="end" fontSize={12} fontWeight={700} fill={LOW}>둘째 값 5 → 메시지 10</text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
