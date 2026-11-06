import LinePlot from "./LinePlot";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-filter — 논문 유지율 min(1,√r), 원본 비교값 R=√r+r (r=t/f).
 * saw: r=0.01 → 0.1 / 0.11. 나머지 단어: r=0.16 → 0.4 / 0.56. R=1은 √r=(√5−1)/2, r≈0.382에서 넘는다.
 */
const POINTS = Array.from({ length: 121 }, (_, i) => 10 ** (-3 + i * 0.03));
const lg = (r: number) => Math.log10(r);
const PAPER = POINTS.map((r) => [lg(r), Math.min(1, Math.sqrt(r))] as const);
const CODE = POINTS.map((r) => [lg(r), Math.sqrt(r) + r] as const);
const CROSS = ((Math.sqrt(5) - 1) / 2) ** 2;
const X_TICKS = [
  { at: -3, text: "0.001" },
  { at: -2, text: "0.01" },
  { at: -1, text: "0.1" },
  { at: 0, text: "1" },
];
const Y_TICKS = [0, 0.5, 1].map((at) => ({ at, text: String(at) }));

const SCENES = [
  { label: "saw", summary: "t/f=0.01 → 0.1 대 0.11", note: "f=0.8, t=0.008이면 논문 식의 유지율은 0.1이고 원본 C가 난수와 비교하는 값은 0.1+0.01=0.11입니다." },
  { label: "나머지 단어", summary: "t/f=0.16 → 0.4 대 0.56", note: "f=0.05이면 제곱근 항이 0.4이고 t/f가 0.16이라 원본의 비교값은 0.56입니다. t/f가 커질수록 더해지는 항도 커져 두 값의 차이가 벌어집니다." },
  { label: "1을 넘는 자리", summary: "비교값 ≥ 1 → 모두 남음", note: "0 이상 1 미만인 난수는 1을 넘는 비교값을 넘을 수 없어 모두 남습니다. 원본 곡선은 t/f가 약 0.382일 때 1에 닿고 논문 식은 t/f=1에서 닿습니다. 원본 비교값을 그 자체로 확률이라고 부르지 않는 이유입니다." },
] as const;

export default function KeepCompareViz() {
  return (
    <SceneShell
      eyebrow="논문 식과 원본 C"
      title="원본의 비교값은 논문 유지율에 t/f를 더 얹습니다"
      description="가로는 t/f(칸마다 10배)이고 세로는 유지 쪽 값입니다. 파란 실선이 논문 식, 주황 점선이 원본 C의 비교값입니다. 기준 0.008과 빈도표는 본문의 가정입니다."
      ariaLabel="t 나누기 f에 따른 논문 유지율과 원본 비교값 곡선"
      scenes={SCENES}
      render={(active) => (
        <LinePlot
          domain={[-3, 0.5]}
          range={[0, 1.3]}
          xTicks={X_TICKS}
          yTicks={Y_TICKS}
          xLabel="t/f"
          yLabel="유지 쪽 값"
          ariaLabel={`${SCENES[active].label}: ${SCENES[active].summary}`}
          series={[
            { points: PAPER, color: "#2563eb" },
            { points: CODE, color: "#d97706", dash: "5 3" },
          ]}
          guides={[{ y: 1, color: "#94a3b8" }]}
          markers={
            active === 0
              ? [
                  { x: lg(0.01), y: 0.1, color: "#2563eb", label: "0.1", dx: 8, dy: 14 },
                  { x: lg(0.01), y: 0.11, color: "#d97706", label: "0.11", dx: -6, dy: -8, anchor: "end" as const },
                ]
              : active === 1
                ? [
                    { x: lg(0.16), y: 0.4, color: "#2563eb", label: "0.4", dx: 8, dy: 14 },
                    { x: lg(0.16), y: 0.56, color: "#d97706", label: "0.56", dx: -6, dy: -8, anchor: "end" as const },
                  ]
                : [
                    { x: lg(CROSS), y: 1, color: "#d97706", label: "약 0.382", dx: -6, dy: -8, anchor: "end" as const },
                    { x: 0, y: 1, color: "#2563eb", label: "1", dx: 0, dy: 16, anchor: "middle" as const },
                  ]
          }
        />
      )}
    />
  );
}
