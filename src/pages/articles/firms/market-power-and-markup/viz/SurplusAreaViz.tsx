import SceneShell from "./SceneShell";

/**
 * 본문 대응: #what-is-lost — p=13−q, MC 7. 가격 7·수량 6에서 소비자 잉여 6×6÷2=18, 생산자 0.
 * 가격 10·수량 3에서 소비자 3×3÷2=4.5, 생산자 3×3=9, 일어나지 않은 거래의 몫 3×3÷2=4.5.
 * 18 = 4.5 + 9 + 4.5, 소비자 감소 13.5 = 9 + 4.5.
 */
const SCENES = [
  { label: "가격 7 · 수량 6", summary: "소비자 18 · 생산자 0", note: "수요선과 가격선 사이의 삼각형이 소비자 잉여입니다. 밑변 6, 높이 6이라 넓이는 18입니다. 생산자 잉여는 가격과 비용의 차이를 모은 값인데, 가격과 비용이 같고 고정비가 없어 0입니다." },
  { label: "가격 10 · 수량 3", summary: "소비자 3 × 3 ÷ 2 = 4.5", note: "가격을 10으로 올리면 수량은 3으로 줄고, 소비자 잉여의 삼각형은 밑변 3, 높이 3으로 작아집니다." },
  { label: "생산자에게 이전된 몫", summary: "(10 − 7) × 3 = 9", note: "실제로 거래되는 3개에서 하나당 가격 차이 3씩을 생산자가 받습니다. 소비자에게서 생산자로 옮겨 간 몫이라 전체 합계를 줄이지는 않습니다." },
  { label: "어디에도 생기지 않은 몫", summary: "3 × 3 ÷ 2 = 4.5", note: "수량 3부터 6까지는 고객이 지불하려는 값이 비용보다 높은데도 거래가 일어나지 않습니다. 이 삼각형은 양쪽 어디에도 생기지 않은 잉여입니다." },
  { label: "합쳐 보기", summary: "4.5 + 9 + 4.5 = 18", note: "기준의 18이 세 조각으로 나뉩니다. 소비자 잉여는 13.5 줄었고 그중 9는 이전, 4.5는 손실입니다. 가격 10에서 남는 잉여는 4.5 + 9 = 13.5로 기준보다 4.5 작습니다." },
] as const;

const W = 360;
const H = 230;
const L = 30;
const R = 14;
const T = 10;
const B = 30;
const px = (q: number) => L + (q / 13) * (W - L - R);
const py = (p: number) => T + ((14 - p) / 14) * (H - T - B);
const poly = (points: readonly (readonly [number, number])[]) => points.map(([q, p]) => `${px(q)},${py(p)}`).join(" ");

export default function SurplusAreaViz() {
  return (
    <SceneShell
      eyebrow="넓이로 읽는 잉여"
      title="기준의 잉여 18이 세 조각으로 갈라집니다"
      description="수요선의 높이는 고객이 지불하려는 값, 소비자 잉여는 그 값과 실제 가격의 차이를 모은 넓이입니다. 수요·비용·고정비 0은 (가정)입니다."
      note="같은 비용·수요를 유지한 한 시점의 비교로, 외부 피해·미래 투자·품질·소득 분배의 가치 판단은 포함하지 않습니다."
      ariaLabel="수요선과 가격선으로 나뉜 소비자 잉여, 생산자 이전, 일어나지 않은 거래의 넓이"
      scenes={SCENES}
      render={(active) => {
        const base = active === 0;
        const raised = active >= 1;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {base && <polygon points={poly([[0, 13], [0, 7], [6, 7]])} fill="#2563eb" fillOpacity={0.22} stroke="#2563eb" strokeWidth={1} />}
            {raised && <polygon points={poly([[0, 13], [0, 10], [3, 10]])} fill="#2563eb" fillOpacity={0.22} stroke="#2563eb" strokeWidth={1} />}
            {active >= 2 && <rect x={px(0)} y={py(10)} width={px(3) - px(0)} height={py(7) - py(10)} fill="#16a34a" fillOpacity={0.22} stroke="#16a34a" strokeWidth={1} />}
            {active >= 3 && <polygon points={poly([[3, 10], [3, 7], [6, 7]])} fill="#d97706" fillOpacity={0.28} stroke="#d97706" strokeWidth={1} />}

            <line x1={L} x2={W - R} y1={py(0)} y2={py(0)} stroke="#94a3b8" strokeWidth={1} />
            <line x1={L} x2={L} y1={T} y2={py(0)} stroke="#94a3b8" strokeWidth={1} />
            <line x1={px(0)} y1={py(13)} x2={px(13)} y2={py(0)} stroke="#64748b" strokeWidth={1.25} />
            <line x1={L} x2={W - R} y1={py(7)} y2={py(7)} stroke="#64748b" strokeWidth={1} strokeDasharray="5 3" />
            <text x={W - R} y={py(7) - 5} textAnchor="end" fontSize={12} fill="#64748b">한계비용 7</text>
            <text x={px(9.4)} y={py(4.6) - 8} fontSize={12} fill="#64748b">수요 p = 13 − q</text>

            {raised && <line x1={L} x2={px(3)} y1={py(10)} y2={py(10)} stroke="#2563eb" strokeWidth={1} />}
            {raised && <line x1={px(3)} x2={px(3)} y1={py(10)} y2={py(0)} stroke="#94a3b8" strokeWidth={0.5} strokeDasharray="2 3" />}
            <line x1={px(6)} x2={px(6)} y1={py(7)} y2={py(0)} stroke="#94a3b8" strokeWidth={0.5} strokeDasharray="2 3" />

            {[7, 10, 13].map((tick) => <text key={tick} x={L - 5} y={py(tick) + 4} textAnchor="end" fontSize={11} fill="#64748b">{tick}</text>)}
            {[0, 3, 6, 13].map((tick) => <text key={tick} x={px(tick)} y={py(0) + 15} textAnchor="middle" fontSize={11} fill="#64748b">{tick}</text>)}
            <text x={L + 5} y={T + 8} fontSize={11} fill="#64748b" dx={18}>가격</text>
            <text x={px(9.8)} y={py(0) + 15} textAnchor="middle" fontSize={11} fill="#64748b">수량</text>

            {base && <text x={px(0.3)} y={py(8)} fontSize={12} fontWeight={700} fill="#2563eb">소비자 잉여 18</text>}
            {base && <circle cx={px(6)} cy={py(7)} r={4} fill="#64748b" />}
            {raised && <text x={px(3.6)} y={py(11.6)} fontSize={12} fontWeight={700} fill="#2563eb">소비자 잉여 4.5</text>}
            {raised && <circle cx={px(3)} cy={py(10)} r={4} fill="#64748b" />}
            {active >= 2 && <text x={px(1.5)} y={py(8.5) + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#16a34a">이전 9</text>}
            {active >= 3 && <text x={px(6.5)} y={py(9) } fontSize={12} fontWeight={700} fill="#d97706">생기지 않은 잉여 4.5</text>}
          </svg>
        );
      }}
    />
  );
}
