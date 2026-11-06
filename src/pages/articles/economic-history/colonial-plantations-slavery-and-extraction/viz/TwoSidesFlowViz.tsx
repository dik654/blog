import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 3절의 가정 판매액 100이 나뉘는 길과, 금액으로 잡히지 않는 반대편.
 * 띠 두께는 금액에 비례합니다(1단위 = 1.8). 반대편 네 항목은 글이 크기를 정하지 않아 점선 칸으로만 둡니다.
 */
const UNIT = 1.8;
const FLOWS = [
  { value: 35, color: "#64748b", lines: ["운송·보험·정제를", "맡은 조직의 수입"], y: 0 },
  { value: 10, color: "#a8a29e", lines: ["도구·최소한의 식량"], y: 77 },
  { value: 10, color: "#0f766e", lines: ["제국 재정의 세금"], y: 109 },
  { value: 45, color: "#d97706", lines: ["소유주 잔여", "다시 투자할 수 있음"], y: 141 },
] as const;

const OTHER_SIDE = ["무임금 노동", "인구 손실", "토지 집중", "한두 수출품 의존"];

const SCENES = [
  { label: "판매액이 갈라집니다", summary: "35 + 10 + 10 + 45 = 100", note: "띠 두께가 금액입니다. 3절의 가정 장부를 그대로 씁니다. 실제 역사 평균이 아닙니다." },
  { label: "여러 곳에 쌓일 수 있습니다", summary: "35 · 10 · 45", note: "35는 운송·보험·정제 조직의 수입, 10은 제국 재정의 세금이 되고 소유주는 45를 다시 투자할 수 있습니다. 같은 거래가 여러 지역의 자본 축적을 잇습니다. 7절은 도구·식량 10의 행선지를 따로 적지 않아 흐리게 두었습니다." },
  { label: "반대편에 남는 것", summary: "합계에서 빠지지 않음", note: "무임금 노동, 인구 손실, 토지 집중, 한두 수출품 의존은 판매액 합계에서 자동으로 빠지지 않습니다. 글이 크기를 정하지 않아 점선 칸으로 둡니다. 누가 자산과 기술을 쌓았고 누가 위험과 단일 작물 의존을 떠안았는지 따로 추적해야 합니다." },
  { label: "두 단정을 함께 막습니다", summary: "어느 쪽도 단정 못 함", note: "한 상품의 이익이 산업화 전체를 혼자 일으켰다고 말하려면 규모와 대체 경로를 계산해야 합니다. 그렇다고 강제 노동에서 나온 부가 특정 지역의 제조·부동산·금융으로 들어간 경로를 지운 채 순수한 국내 혁신으로만 설명할 수도 없습니다." },
] as const;

function flowOn(index: number, active: number) {
  if (active === 0) return true;
  if (active === 1) return index !== 1;
  return false;
}

export default function TwoSidesFlowViz() {
  const ribbons = FLOWS.map((flow, index) => {
    const h = flow.value * UNIT;
    const y0 = 21 + FLOWS.slice(0, index).reduce((sum, item) => sum + item.value * UNIT, 0);
    return { ...flow, h, y0 };
  });
  return (
    <SceneShell
      eyebrow="같은 100, 다른 결과"
      title="판매액이 쌓이는 길과 장부에 잡히지 않고 남는 것"
      description="왼쪽 막대가 3절의 가정 판매액 100입니다. 수가 적힌 띠는 금액에 비례하고, 점선 칸은 크기를 정하지 않은 항목입니다."
      ariaLabel="판매액 100이 네 갈래로 나뉘는 흐름과 금액 없이 남는 네 가지 결과"
      scenes={SCENES}
      render={(active) => active === 3 ? (
        <div className="min-w-0 space-y-3" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <p className="text-center text-sm font-semibold">판매액이 들어간 경로와 산업화의 관계</p>
          <div className="grid gap-3 text-sm leading-6 sm:grid-cols-2">
            <div className="rounded-lg border border-border px-3 py-3">
              <b className="block">"한 상품의 이익이 혼자 일으켰다"</b>
              <span className="mt-1 block text-muted-foreground">↓ 말하려면</span>
              <span className="block font-semibold">규모와 대체 경로를 계산해야 함</span>
            </div>
            <div className="rounded-lg border border-border px-3 py-3">
              <b className="block">"순수한 국내 혁신일 뿐이다"</b>
              <span className="mt-1 block text-muted-foreground">↓ 이렇게만 말하면</span>
              <span className="block font-semibold">부가 들어간 경로를 지운 설명</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-w-0 space-y-4">
          <svg viewBox="0 0 360 226" className="mx-auto block h-auto w-full max-w-[420px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={8} y={14} fontSize={12} fontWeight={700} fill="#64748b">판매액 100</text>
            {ribbons.map((flow, index) => {
              const on = flowOn(index, active);
              const r0 = flow.y;
              const r1 = flow.y + flow.h;
              const y1 = flow.y0 + flow.h;
              return (
                <g key={flow.lines[0]} opacity={on ? 1 : 0.25}>
                  <rect x={8} y={flow.y0} width={14} height={flow.h} fill={flow.color} />
                  <path d={`M22 ${flow.y0} C66 ${flow.y0} 66 ${r0} 106 ${r0} L106 ${r1} C66 ${r1} 66 ${y1} 22 ${y1} Z`} fill={flow.color} opacity={0.35} />
                  <rect x={106} y={r0} width={6} height={flow.h} fill={flow.color} />
                  <text x={118} y={r0 + flow.h / 2 + (flow.lines.length === 1 ? 4 : -3)} fontSize={12} fontWeight={700} fill="#64748b">
                    <tspan fill={flow.color === "#a8a29e" ? "#78716c" : flow.color}>{flow.value} </tspan>{flow.lines[0]}
                  </text>
                  {flow.lines[1] && (
                    <text x={118} y={r0 + flow.h / 2 + 13} fontSize={12} fill="#64748b">{flow.lines[1]}</text>
                  )}
                </g>
              );
            })}
          </svg>
          <div className={active === 2 ? "" : "opacity-40"}>
            <p className="mb-1.5 text-xs font-bold text-muted-foreground">반대편 · 크기를 정하지 않음</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {OTHER_SIDE.map((item) => (
                <span key={item} className={`rounded-lg border border-dashed px-2 py-2 text-center text-xs leading-5 ${active === 2 ? "border-red-600 font-semibold" : "border-border"}`}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    />
  );
}
