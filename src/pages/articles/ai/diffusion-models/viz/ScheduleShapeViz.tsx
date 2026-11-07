import SceneShell from "./SceneShell";

/**
 * 본문 대응: #schedule — linear vs cosine의 누적 signal 곡선.
 * 본문은 β 값을 주지 않으므로 곡선은 그림용 가정: T=1000, linear β 0.0001→0.02, cosine offset 0.008.
 */
const T = 1000;
const LINEAR = Array.from({ length: T }, (_, i) => 0.0001 + ((0.02 - 0.0001) * i) / (T - 1)).reduce<number[]>(
  (acc, beta) => {
    acc.push((acc.length ? acc[acc.length - 1] : 1) * (1 - beta));
    return acc;
  },
  [],
);
const rawCos = (t: number) => Math.cos((((t / T + 0.008) / 1.008) * Math.PI) / 2) ** 2;
const cosineAt = (t: number) => rawCos(t) / rawCos(0);
const linearAt = (t: number) => (t === 0 ? 1 : LINEAR[t - 1]);

const X0 = 44;
const X1 = 340;
const Y0 = 172;
const Y1 = 22;
const px = (t: number) => X0 + (t / T) * (X1 - X0);
const py = (v: number) => Y0 - v * (Y0 - Y1);
const STEPS = Array.from({ length: 51 }, (_, i) => i * 20);
const pathOf = (fn: (t: number) => number) => STEPS.map((t, i) => `${i ? "L" : "M"}${px(t).toFixed(1)} ${py(fn(t)).toFixed(1)}`).join(" ");
const LINEAR_PATH = pathOf(linearAt);
const COSINE_PATH = pathOf(cosineAt);

const AT20_L = linearAt(200).toFixed(2);
const AT20_C = cosineAt(200).toFixed(2);

const SCENES = [
  { label: "linear", summary: "βₜ가 t에 비례해 증가", note: "β를 균등하게 늘려도 누적 signal은 곧게 줄지 않습니다. 이 예시에서는 T에 닿기 전에 0 가까이 내려갑니다." },
  { label: "cosine", summary: "누적 signal이 cos² 곡선", note: "cosine은 누적 signal이 cos² 곡선을 따라 앞뒤 구간에서 더 완만하게 줄어듭니다. 작은 offset은 t가 0 근처일 때 βₜ가 0에 너무 붙지 않게 합니다." },
  { label: "T의 20% 지점", summary: `linear ${AT20_L} · cosine ${AT20_C}`, note: "같은 지점에서 linear의 누적 signal이 이미 더 많이 떨어져 있습니다. 숫자는 가정한 곡선에서 계산한 값입니다." },
  { label: "끝 구간", summary: "linear는 이미 거의 0", note: "linear는 이 구간에 signal이 거의 남지 않아 학습 신호를 낭비합니다. Improved DDPM의 실험 결과이며 모든 데이터·해상도에 최적이라는 보장은 아닙니다." },
];

export default function ScheduleShapeViz() {
  return (
    <SceneShell
      eyebrow="schedule 모양"
      title="같은 T라도 누적 signal이 줄어드는 길이 다릅니다"
      description="가로축은 전체 T 중 지나온 비율, 세로축은 누적 signal ᾱₜ입니다."
      note="본문은 β의 구체 값을 주지 않습니다. 곡선은 T=1000, linear β 0.0001→0.02, cosine offset 0.008로 그린 예시입니다(가정)."
      ariaLabel="linear와 cosine schedule의 누적 signal 곡선 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 206" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 3 && <rect x={px(800)} y={Y1} width={px(1000) - px(800)} height={Y0 - Y1} fill="#94a3b8" fillOpacity={0.16} />}
          {[0, 0.5, 1].map((v) => (
            <g key={v}>
              <line x1={X0} x2={X1} y1={py(v)} y2={py(v)} stroke="#94a3b8" strokeWidth={1} strokeOpacity={v === 0 ? 1 : 0.35} />
              <text x={X0 - 6} y={py(v) + 4} textAnchor="end" fontSize={12} fill="currentColor">{v}</text>
            </g>
          ))}
          {[0, 200, 500, 800, 1000].map((t) => (
            <text key={t} x={px(t)} y={Y0 + 16} textAnchor="middle" fontSize={12} fill="currentColor">{t / T}</text>
          ))}
          <text x={(X0 + X1) / 2} y={Y0 + 32} textAnchor="middle" fontSize={12} fill="#64748b">t / T</text>
          <text x={X0} y={13} fontSize={12} fill="#64748b">ᾱₜ</text>
          <path d={LINEAR_PATH} fill="none" stroke="#b45309" strokeWidth={1.25} opacity={active === 1 ? 0.3 : 1} />
          {active > 0 && <path d={COSINE_PATH} fill="none" stroke="#2563eb" strokeWidth={1.25} />}
          <text x={px(70)} y={py(0.3)} fontSize={13} fontWeight={700} fill="#b45309" opacity={active === 1 ? 0.3 : 1}>linear</text>
          {active > 0 && <text x={px(560) + 8} y={py(cosineAt(560)) - 4} fontSize={13} fontWeight={700} fill="#2563eb">cosine</text>}
          {active === 2 && (
            <g>
              <line x1={px(200)} x2={px(200)} y1={Y1} y2={Y0} stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" />
              <circle cx={px(200)} cy={py(linearAt(200))} r={4} fill="#b45309" />
              <circle cx={px(200)} cy={py(cosineAt(200))} r={4} fill="#2563eb" />
              <text x={px(200) + 8} y={py(cosineAt(200)) - 4} fontSize={12} fontWeight={700} fill="#2563eb">{AT20_C}</text>
              <text x={px(200) + 8} y={py(linearAt(200)) + 14} fontSize={12} fontWeight={700} fill="#b45309">{AT20_L}</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
