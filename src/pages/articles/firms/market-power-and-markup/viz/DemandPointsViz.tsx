import SceneShell from "./SceneShell";

/**
 * 본문 대응: #elasticity-comparison — p=13−q와 p=19−2q는 (6, 7)을 지나고,
 * MC 7에서 최적점은 (3,10)과 (3,13), MC 9로 바꾸면 기본 수요에서 (2,11)입니다.
 * 마크업 3/10=30%, 6/13≈46.15%, 2/11≈18.18%. 탄력성 절댓값 10/3, 13/6, 11/2.
 */
const SCENES = [
  { label: "기본 수요 · 비용 7", q: 3, p: 10, mc: 7, gap: 3, summary: "(10 − 7) ÷ 10 = 30%", note: "기본 수요에서 이익이 가장 큰 점은 수량 3, 가격 10입니다. 탄력성 절댓값은 10/3이고 그 역수가 마크업 30%입니다." },
  { label: "다른 수요 · 비용 7", q: 3, p: 13, mc: 7, gap: 6, summary: "(13 − 7) ÷ 13 ≈ 46.15%", note: "두 선은 수량 6·가격 7에서 만나지만 다른 수요입니다. 이번 숫자에서 최적 수량은 3으로 같고 가격은 13입니다. 탄력성 절댓값은 13/6입니다. 두 수요를 골라 만든 비교입니다." },
  { label: "기본 수요 · 비용 9", q: 2, p: 11, mc: 9, gap: 2, summary: "(11 − 9) ÷ 11 ≈ 18.18%", note: "같은 수요에서 비용만 9로 올리면 읽는 점이 수량 2, 가격 11로 옮겨 갑니다. 탄력성 절댓값은 11/2입니다. 비용이 바뀌면 같은 수요에서도 읽는 점과 마크업이 달라집니다." },
] as const;

const W = 360;
const H = 270;
const L = 30;
const R = 14;
const T = 10;
const B = 30;
const px = (q: number) => L + (q / 13) * (W - L - R);
const py = (p: number) => T + ((20 - p) / 20) * (H - T - B);

export default function DemandPointsViz() {
  return (
    <SceneShell
      eyebrow="수요선 위의 점"
      title="마크업은 최적점이 수요선 어디에 놓이는지에 따라 달라집니다"
      description="가로는 수량, 세로는 가격입니다. 주황 세로선이 그 점의 가격과 한계비용의 차이입니다. 두 수요와 비용은 이 글의 (가정)입니다."
      ariaLabel="두 수요선과 한계비용 선 위의 최적점과 마크업 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const secondOn = active === 1;
        const baseOn = !secondOn;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[430px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={L} x2={W - R} y1={py(0)} y2={py(0)} stroke="#94a3b8" strokeWidth={1} />
            <line x1={L} x2={L} y1={T} y2={py(0)} stroke="#94a3b8" strokeWidth={1} />
            {[0, 7, 9, 13, 19].map((tick) => <text key={tick} x={L - 5} y={py(tick) + 4} textAnchor="end" fontSize={11} fill="#64748b">{tick}</text>)}
            {[0, 2, 3, 6, 13].map((tick) => <text key={tick} x={px(tick)} y={py(0) + 15} textAnchor="middle" fontSize={11} fill="#64748b">{tick}</text>)}
            <text x={W - R} y={py(0) + 15} textAnchor="end" fontSize={11} fill="#64748b" dx={-22}>수량</text>
            <text x={L + 5} y={T + 8} fontSize={11} fill="#64748b">가격</text>

            <line x1={px(0)} y1={py(13)} x2={px(13)} y2={py(0)} stroke="#2563eb" strokeWidth={baseOn ? 1.25 : 1} opacity={baseOn ? 1 : 0.35} />
            <line x1={px(0)} y1={py(19)} x2={px(9.5)} y2={py(0)} stroke="#16a34a" strokeWidth={secondOn ? 1.25 : 1} opacity={secondOn ? 1 : 0.35} strokeDasharray="6 3" />
            <text x={px(9.6)} y={py(3.4) - 6} fontSize={12} fontWeight={baseOn ? 700 : 400} fill="#2563eb" opacity={baseOn ? 1 : 0.5}>p = 13 − q</text>
            <text x={px(2.3)} y={py(16.6)} fontSize={12} fontWeight={secondOn ? 700 : 400} fill="#16a34a" opacity={secondOn ? 1 : 0.5}>p = 19 − 2q</text>

            <line x1={L} x2={W - R} y1={py(7)} y2={py(7)} stroke="#64748b" strokeWidth={scene.mc === 7 ? 1.25 : 1} opacity={scene.mc === 7 ? 1 : 0.35} />
            <text x={W - R} y={py(7) - 5} textAnchor="end" fontSize={12} fontWeight={scene.mc === 7 ? 700 : 400} fill="#64748b" opacity={scene.mc === 7 ? 1 : 0.5}>한계비용 7</text>
            {active === 2 && <line x1={L} x2={W - R} y1={py(9)} y2={py(9)} stroke="#64748b" strokeWidth={1.25} />}
            {active === 2 && <text x={W - R} y={py(9) - 5} textAnchor="end" fontSize={12} fontWeight={700} fill="#64748b">한계비용 9</text>}

            <circle cx={px(6)} cy={py(7)} r={3} fill="none" stroke="#64748b" strokeWidth={1} />
            {active === 1 && <text x={px(6) - 4} y={py(7) + 15} textAnchor="end" fontSize={11} fill="#64748b">수량 6 · 가격 7</text>}

            <line x1={px(scene.q)} x2={px(scene.q)} y1={py(scene.p)} y2={py(scene.mc)} stroke="#d97706" strokeWidth={1.25} />
            <circle cx={px(scene.q)} cy={py(scene.p)} r={4.5} fill="#d97706" />
            <text x={px(scene.q) + 8} y={py(scene.p) - 6} fontSize={12} fontWeight={700} fill="#d97706">수량 {scene.q} · 가격 {scene.p}</text>
            <text x={px(scene.q) - 6} y={(py(scene.p) + py(scene.mc)) / 2 + 4} textAnchor="end" fontSize={12} fontWeight={700} fill="#d97706">{scene.gap}</text>
          </svg>
        );
      }}
    />
  );
}
