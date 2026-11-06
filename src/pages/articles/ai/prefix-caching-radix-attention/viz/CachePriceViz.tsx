import SceneShell from "./SceneShell";

/**
 * 본문 대응: #cache-pricing — 앞 2,000 + 꼬리 200 요청 10개. 재사용 없음 22,000, 새 계산 위치 4,000(18%),
 * Anthropic 5분 기준 가격 2,700 + 3,600 = 6,300(29%). 쓰기 1.25배·읽기 0.1배. 입력 token만 센다.
 */
const SLATE = "#64748b";
const AMBER = "#b45309";
const GREEN = "#15803d";
const RED = "#dc2626";
const X0 = 28;
const MAX = 2700;
const UNIT = 300 / MAX;

interface Part {
  size: number;
  fill: string;
  hollow?: boolean;
}

const rowsFor = (scene: number): readonly (readonly Part[])[] =>
  Array.from({ length: 10 }, (_, r): readonly Part[] => {
    if (scene === 0) return [{ size: 2000, fill: SLATE }, { size: 200, fill: AMBER }];
    if (scene === 1) return r === 0 ? [{ size: 2000, fill: SLATE }, { size: 200, fill: AMBER }] : [{ size: 2000, fill: GREEN, hollow: true }, { size: 200, fill: AMBER }];
    return r === 0 ? [{ size: 2500, fill: RED }, { size: 200, fill: AMBER }] : [{ size: 200, fill: GREEN }, { size: 200, fill: AMBER }];
  });

const SCENES = [
  { label: "재사용 없음", summary: "10 × 2,200 = 22,000", note: "줄 하나가 요청 하나입니다. 회색이 같은 앞 2,000, 주황이 요청마다 다른 꼬리 200입니다. 재사용이 없으면 모두 기본 단가로 계산합니다. 2,000·200·10개는 설명용 가정입니다." },
  { label: "계산 위치로 세면", summary: "2,000 + 10 × 200 = 4,000 · 18%", note: "둘째 요청부터 앞 2,000은 저장된 기록을 hit합니다. 빈 칸은 건너뛴 계산입니다. 새로 계산하는 위치는 22,000 중 4,000입니다." },
  { label: "가격으로 세면", summary: "2,700 + 3,600 = 6,300 · 29%", note: "첫 줄은 쓰기 할증으로 2,000 × 1.25 = 2,500이 됩니다. 나머지 아홉 줄의 앞부분은 읽기 단가 0.1배인 200을 냅니다. Anthropic 5분 cache 배수이며 입력 token만 셉니다." },
  { label: "두 비율이 다른 이유", summary: "18% 대 29%", note: "읽기가 0이 아니고 쓰기가 할증되기 때문에 가격 비율이 계산 비율보다 높습니다. TTL 안에 cache가 남는지와 모델별 예외는 이 산수에 넣지 않았습니다." },
];

function Rows({ scene }: { scene: number }) {
  return (
    <>
      {rowsFor(scene).map((parts, r) => {
        const y = 22 + r * 13;
        return (
          <g key={r}>
            <text x={X0 - 6} y={y + 9} textAnchor="end" fontSize={9} fill={SLATE}>{r + 1}</text>
            {parts.map((part, i) => {
              const before = parts.slice(0, i).reduce<number>((sum, item) => sum + item.size, 0);
              return (
                <rect
                  key={i}
                  x={X0 + before * UNIT}
                  y={y}
                  width={part.size * UNIT}
                  height={10}
                  fill={part.hollow ? "none" : part.fill}
                  stroke={part.hollow ? part.fill : "none"}
                  strokeWidth={1}
                  strokeDasharray={part.hollow ? "3 2" : undefined}
                />
              );
            })}
          </g>
        );
      })}
    </>
  );
}

function Ratio({ y, name, value, percent, color }: { y: number; name: string; value: number; percent: string; color: string }) {
  const width = (value / 22000) * 300;
  return (
    <g>
      <text x={X0} y={y - 5} fontSize={12} fontWeight={700} fill="currentColor">{name}</text>
      <rect x={X0} y={y} width={300} height={22} fill="none" stroke="#94a3b8" strokeWidth={1} />
      <rect x={X0} y={y} width={width} height={22} fill={color} />
      <text x={X0 + width + 6} y={y + 15} fontSize={12} fontWeight={700} fill={color}>{percent}</text>
    </g>
  );
}

export default function CachePriceViz() {
  return (
    <SceneShell
      eyebrow="(가정) 요청 10개의 입력"
      title="계산은 18%로 줄어도 가격은 29%로 줄어듭니다"
      description="막대 길이는 기본 입력 단가로 환산한 양입니다. 점선 세로선이 재사용 없는 요청 하나의 양 2,200입니다."
      ariaLabel="재사용 없는 입력, 새 계산 위치, cache 단가를 적용한 가격 비교"
      scenes={SCENES}
      render={(index) => (
        <svg viewBox="0 0 340 170" className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label={`${SCENES[index].label}: ${SCENES[index].summary}`}>
          {index < 3 ? (
            <>
              <text x={X0} y={13} fontSize={11} fontWeight={700} fill="currentColor">
                {index === 2 ? "1번: 쓰기 2,500 + 꼬리 200 · 2~10번: 읽기 200 + 꼬리 200" : index === 1 ? "1번만 앞부분 계산 · 2~10번은 꼬리만" : "요청마다 앞부분부터 전부"}
              </text>
              <line x1={X0 + 2200 * UNIT} x2={X0 + 2200 * UNIT} y1={18} y2={156} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
              <Rows scene={index} />
            </>
          ) : (
            <>
              <Ratio y={26} name="재사용 없음 = 22,000" value={22000} percent="" color={SLATE} />
              <Ratio y={78} name="새 계산 위치 4,000" value={4000} percent="18%" color={AMBER} />
              <Ratio y={130} name="가격 단위 6,300" value={6300} percent="29%" color={GREEN} />
            </>
          )}
        </svg>
      )}
    />
  );
}
