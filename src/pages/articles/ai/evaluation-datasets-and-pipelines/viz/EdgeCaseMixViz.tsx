import SceneShell from "./SceneShell";

/**
 * 본문 대응: #edge-case — golden set 200개 중 평범한 180개 실패율 6%, edge·adversarial 20개 실패율 40%(가정).
 * 폭 = example 수, 높이 = 실패율, 넓이 = 실패 건수. 10.8 + 8 = 18.8건, 18.8 ÷ 200 = 9.4%.
 * 30%로 올린 장면: 140 × 6% + 60 × 40% = 32.4건, 16.2%.
 */
const TOTAL = 200;
const NORMAL_RATE = 6;
const EDGE_RATE = 40;

const SCENES = [
  { label: "평범한 example 만 보면", summary: "180 × 6% = 10.8건 → 6%", edge: 20, showEdge: false, note: "평범한 180개만 채점하면 실패율은 6%입니다. 오른쪽 20개를 채우지 않으면 그 칸의 실패는 이 숫자에 들어오지 않습니다." },
  { label: "경계·공격 사례 20개를 채우면", summary: "(10.8 + 8) ÷ 200 = 9.4%", edge: 20, showEdge: true, note: "전체의 10%인 20개가 실패 18.8건 가운데 8건, 약 43%를 차지합니다. 10.8건처럼 소수가 나오는 것은 비율로 계산한 평균이기 때문입니다." },
  { label: "비율을 30%로 올리면 (가정)", summary: "(8.4 + 24) ÷ 200 = 16.2%", edge: 60, showEdge: true, note: "두 묶음의 실패율은 그대로 두고 구성만 바꿔도 전체 값이 9.4%에서 16.2%로 움직입니다. 비율을 너무 올리면 이 숫자가 실제 트래픽과 멀어지므로 글은 10% 안팎을 목표로 듭니다." },
] as const;

const W = 360;
const H = 204;
const X0 = 36;
const X1 = 350;
const BASE = 164;
const TOP = 24;
const xAt = (count: number) => X0 + ((X1 - X0) * count) / TOTAL;
const yAt = (rate: number) => BASE - ((BASE - TOP) * rate) / 50;

export default function EdgeCaseMixViz() {
  return (
    <SceneShell
      eyebrow="golden set 구성"
      title="적은 경계 사례가 실패의 큰 몫을 드러냅니다"
      description="가로 폭은 example 개수, 세로 높이는 실패율이고 직사각형 넓이가 실패 건수입니다. 200개·20개·6%·40%는 본문의 가정입니다."
      ariaLabel="평범한 example과 edge case의 개수, 실패율, 실패 건수 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const normal = TOTAL - scene.edge;
        const normalFail = (normal * NORMAL_RATE) / 100;
        const edgeFail = (scene.edge * EDGE_RATE) / 100;
        const average = ((normalFail + edgeFail) / TOTAL) * 100;
        const split = xAt(normal);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {[0, 20, 40].map((rate) => (
              <g key={rate}>
                <line x1={X0} x2={X1} y1={yAt(rate)} y2={yAt(rate)} stroke="#94a3b8" strokeWidth={rate === 0 ? 1 : 0.5} />
                <text x={X0 - 5} y={yAt(rate) + 4} textAnchor="end" fontSize={10} fill="#64748b">{rate}%</text>
              </g>
            ))}
            <rect x={X0} y={yAt(NORMAL_RATE)} width={split - X0} height={BASE - yAt(NORMAL_RATE)} fill="#2563eb" fillOpacity={0.35} stroke="#2563eb" strokeWidth={1} />
            <text x={(X0 + split) / 2} y={BASE - 5} textAnchor="middle" fontSize={11} fontWeight={700} className="fill-foreground">실패율 6%</text>
            {scene.showEdge ? (
              <>
                <rect x={split} y={yAt(EDGE_RATE)} width={X1 - split} height={BASE - yAt(EDGE_RATE)} fill="#dc2626" fillOpacity={0.3} stroke="#dc2626" strokeWidth={1} />
                <text x={X1} y={yAt(EDGE_RATE) - 5} textAnchor="end" fontSize={11} fontWeight={700} fill="#dc2626">실패율 40%</text>
                <line x1={X0} x2={X1} y1={yAt(average)} y2={yAt(average)} stroke="#64748b" strokeWidth={1} strokeDasharray="4 3" />
                <text x={X0 + 3} y={yAt(average) - 4} fontSize={11} fontWeight={700} className="fill-foreground">전체 실패율 {average.toFixed(1)}%</text>
              </>
            ) : (
              <>
                <rect x={split} y={TOP} width={X1 - split} height={BASE - TOP} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
                <text x={X1} y={TOP - 5} textAnchor="end" fontSize={11} fill="#64748b">20개: 채우지 않음</text>
              </>
            )}
            <text x={X0} y={BASE + 15} fontSize={10.5} fill="#64748b">평범한 {normal}개 · 실패 {normalFail}건</text>
            <text x={X1} y={BASE + 31} textAnchor="end" fontSize={10.5} fill="#64748b">edge·adversarial {scene.edge}개{scene.showEdge ? ` · 실패 ${edgeFail}건` : ""}</text>
          </svg>
        );
      }}
    />
  );
}
