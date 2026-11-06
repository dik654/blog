import SceneShell from "./SceneShell";

/**
 * 본문 대응: #nyquist-boundary — f_s=8000에서 cos(2π·7000n/8000)=cos(2π·1000n/8000), sin(πn)=0.
 * 가로축은 표본 9개(n=0…8), 1 ms 구간입니다. 곡선은 식을 그대로 계산했습니다.
 */
const W = 360;
const H = 170;
const LEFT = 16;
const RIGHT = W - 16;
const MID = 76;
const AMP = 58;
const px = (ms: number) => LEFT + ms * (RIGHT - LEFT);
const py = (value: number) => MID - value * AMP;
const curve = (fn: (ms: number) => number) =>
  Array.from({ length: 401 }, (_, i) => {
    const ms = i / 400;
    return `${i === 0 ? "M" : "L"}${px(ms).toFixed(1)} ${py(fn(ms)).toFixed(1)}`;
  }).join(" ");

const COS_1K = curve((ms) => Math.cos(2 * Math.PI * ms));
const COS_7K = curve((ms) => Math.cos(2 * Math.PI * 7 * ms));
const SIN_4K = curve((ms) => Math.sin(2 * Math.PI * 4 * ms));
const SAMPLE_MS = Array.from({ length: 9 }, (_, n) => n / 8);

const SCENES: { label: string; summary: string; note: string; show: ("low" | "high" | "half")[] }[] = [
  { label: "1 kHz", summary: "표본률 8000에서 1 ms에 표본 8칸", show: ["low"], note: "1 ms에 한 번 도는 코사인을 8000 Hz로 기록하면 한 번 도는 동안 점이 8칸 찍힙니다." },
  { label: "7 kHz", summary: "1 ms에 일곱 번 돌아도 같은 점", show: ["high"], note: "7 kHz 곡선은 표본 사이에서 훨씬 빠르게 오르내립니다. 그런데 표본 시각에만 보면 파란 점의 높이가 앞 장면과 하나도 다르지 않습니다." },
  { label: "표본만 남으면", summary: "1 kHz와 7 kHz를 구별 못 함", show: ["low", "high"], note: "서로 다른 진동이 같은 표본으로 겹치는 현상이 alias입니다. 이미 겹친 뒤에는 FFT를 더 정확히 계산해도 두 진동을 구별하지 못합니다." },
  { label: "표본률의 절반", summary: "4 kHz 사인 → 표본 모두 0", show: ["half"], note: "정확히 표본률의 절반인 사인파는 이 위상에서 표본이 모두 0입니다. 경계를 포함해 언제나 복원된다는 주장이 성립하지 않는 이유입니다." },
];

export default function AliasSamplesViz() {
  return (
    <SceneShell
      eyebrow="표본과 진동"
      title="곡선이 달라도 표본 점이 같으면 구별할 수 없습니다"
      description="파란 점이 실제로 기록된 값입니다. 곡선은 점 사이에 있었을 수 있는 진동이며, 기록에는 남지 않습니다. 표본률 8000 Hz의 식을 계산해 그렸습니다."
      ariaLabel="같은 표본을 지나는 1 kilohertz와 7 kilohertz 곡선, 그리고 표본률 절반의 사인파"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const half = scene.show.includes("half");
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={LEFT} x2={RIGHT} y1={MID} y2={MID} stroke="#94a3b8" strokeWidth={1} />
            {scene.show.includes("low") && <path d={COS_1K} fill="none" stroke="#64748b" strokeWidth={1.25} />}
            {scene.show.includes("high") && <path d={COS_7K} fill="none" stroke="#d97706" strokeWidth={1} />}
            {half && <path d={SIN_4K} fill="none" stroke="#d97706" strokeWidth={1} />}
            {SAMPLE_MS.map((ms) => (
              <circle key={ms} cx={px(ms)} cy={py(half ? 0 : Math.cos(2 * Math.PI * ms))} r={3.5} fill="#2563eb" />
            ))}
            <text x={LEFT} y={H - 12} fontSize={11} fill="#64748b">0 ms</text>
            <text x={RIGHT} y={H - 12} textAnchor="end" fontSize={11} fill="#64748b">1 ms</text>
            <text x={W / 2} y={H - 12} textAnchor="middle" fontSize={11} fontWeight={700} fill="#64748b">
              {half ? "주황: 4 kHz 사인" : scene.show.length === 2 ? "회색: 1 kHz · 주황: 7 kHz" : scene.show[0] === "low" ? "회색: 1 kHz" : "주황: 7 kHz"}
            </text>
          </svg>
        );
      }}
    />
  );
}
