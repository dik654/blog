import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box — 대상을 고르고 재고 비교한 뒤 주장을 만든다.
 * 앞 단계에서 생긴 문제는 뒤로 실려 가고, 계산식이 맞아도 지워지지 않는다.
 */
const SCENES = [
  { label: "네 단계", summary: "대상 → 재기 → 비교 → 주장", note: "현실의 집과 행동을 관찰해 수치로 적고, 비교할 집과 기간을 정해 차이를 계산한 뒤, 마지막에 원인과 적용 범위를 판단합니다." },
  { label: "대상에서 생긴 문제", summary: "특정 집만 모임", note: "대상을 고르는 단계에서 특정 집만 모이면 처음부터 범위가 좁아집니다. 이 좁음은 뒤의 세 단계에 그대로 실립니다." },
  { label: "재기에서 생긴 문제", summary: "재는 방법이 달라짐", note: "재는 방법이 달라져도 숫자에 차이가 생깁니다. 이 차이는 비교할 값 안에 들어가 있어 계산 단계에서 따로 보이지 않습니다." },
  { label: "계산은 맞을 때", summary: "식이 맞아도 문제는 남음", note: "비교·계산 칸의 식이 맞다는 것은 그 칸만의 판정입니다. 앞에서 실려 온 두 줄은 주장까지 이어집니다." },
] as const;

const W = 340;
const H = 190;
const BOX_W = 76;
const BOX_H = 50;
const GAP = 10;
const col = (index: number) => 2 + index * (BOX_W + GAP);
const STAGES = [["대상", "고르기"], ["재기"], ["비교", "계산"], ["주장"]] as const;

const INK = "#64748b";
const FAULT = "#d97706";
const OK = "#16a34a";

function Track({ from, y, label, dashed = false }: { from: number; y: number; label: string; dashed?: boolean }) {
  const start = col(from) + BOX_W / 2;
  return (
    <g>
      <line x1={start} x2={start} y1={6 + BOX_H} y2={y} stroke={FAULT} strokeWidth={1} strokeDasharray={dashed ? "4 3" : undefined} />
      <line x1={start} x2={W - 8} y1={y} y2={y} stroke={FAULT} strokeWidth={1.25} strokeDasharray={dashed ? "4 3" : undefined} />
      <path d={`M${W - 2} ${y} l-7 -4 v8 z`} fill={FAULT} />
      <text x={start + 6} y={y - 6} fontSize={15} fontWeight={700} fill={FAULT}>{label}</text>
    </g>
  );
}

export default function PipelineFaultViz() {
  return (
    <SceneShell
      eyebrow="측정에서 주장까지"
      title="앞 단계의 문제는 맞는 계산을 지나 주장까지 갑니다"
      description="왼쪽에서 오른쪽으로 일이 진행됩니다. 아래의 줄은 그 칸에서 생긴 문제가 어디까지 실려 가는지를 뜻합니다."
      ariaLabel="대상, 재기, 비교, 주장 네 단계에서 앞 단계의 문제가 뒤로 이어지는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {STAGES.map((lines, index) => {
            const highlighted = (active === 1 && index === 0) || (active === 2 && index === 1);
            const color = highlighted ? FAULT : active === 3 && index === 2 ? OK : INK;
            return (
              <g key={lines.join("")}>
                <rect x={col(index)} y={6} width={BOX_W} height={BOX_H} rx={8} fill="none" stroke={color} strokeWidth={highlighted ? 1.25 : 1} />
                {lines.map((line, row) => (
                  <text key={line} x={col(index) + BOX_W / 2} y={36 + (row - (lines.length - 1) / 2) * 18} textAnchor="middle" fontSize={15} fontWeight={600} fill={color}>{line}</text>
                ))}
                {index < 3 && <path d={`M${col(index) + BOX_W + GAP - 1} 31 l-6 -4 v8 z`} fill={INK} />}
              </g>
            );
          })}
          {(active === 1 || active === 3) && <Track from={0} y={92} label="범위가 좁음" />}
          {(active === 2 || active === 3) && <Track from={1} y={132} label="값에 방법 차이가 섞임" dashed />}
          {active === 3 && (
            <g>
              <text x={W - 2} y={172} textAnchor="end" fontSize={15} fontWeight={700} fill={OK}>비교·계산 칸의 식은 맞음</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
