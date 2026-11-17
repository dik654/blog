import SceneShell from "./SceneShell";

/**
 * 본문 대응: #output-reconstruction — 첫 channel norm이 10배 크면 같은 weight error도
 * output을 더 크게 바꾼다. 예시(가정): calibration 행 하나 x = [10, 1], weight 오차 0.04 한 칸.
 * output 오차 = |x_j| × 0.04 → channel 2: 0.04, channel 1: 0.4.
 * 제곱 기준: 0.0016 vs 0.16 → 100배.
 */
const X = [10, 1] as const;
const ERR = 0.04;
const MAX = 0.4;

const SCENES = [
  {
    label: "두 input channel",
    summary: "x₁ = 10, x₂ = 1",
    channel: -1,
    note: "Calibration activation X는 layer에 실제로 들어온 입력입니다. 여기서는 입력 행 하나에 channel 두 개만 두고, 첫 channel 값이 둘째의 10배라고 하겠습니다(가정). 입력 행이 하나면 channel norm은 그 값의 크기와 같습니다.",
  },
  {
    label: "오차가 channel 2 weight에",
    summary: "1 × 0.04 = 0.04",
    channel: 1,
    note: "Channel 2에 곱해지는 weight가 0.04만큼 틀렸습니다. Output은 입력 × weight의 합이므로 output 오차는 1 × 0.04 = 0.04입니다.",
  },
  {
    label: "같은 오차가 channel 1 weight에",
    summary: "10 × 0.04 = 0.4",
    channel: 0,
    note: "Weight 차이는 똑같이 0.04인데 output 오차는 10 × 0.04 = 0.4로 10배입니다. 제곱해서 비교하는 ‖XE‖²에서는 0.16 대 0.0016으로 100배 차이가 나므로, weight 차이만 보는 ‖W−Ŵ‖는 두 경우를 같게 보고 output 기준은 다르게 봅니다.",
  },
] as const;

function Bar({ label, value, color, on }: { label: string; value: number | null; color: string; on: boolean }) {
  return (
    <div
      className={`grid grid-cols-[8.5rem_minmax(0,1fr)_3rem] items-center gap-2 text-xs transition-opacity duration-200 motion-reduce:transition-none sm:grid-cols-[10rem_minmax(0,1fr)_3.5rem] sm:text-sm ${on ? "opacity-100" : "opacity-35"}`}
    >
      <span className="text-muted-foreground">{label}</span>
      <div className="h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm" style={{ width: `${value === null ? 0 : (value / MAX) * 100}%`, backgroundColor: color }} />
      </div>
      <span className="text-right font-mono">{value === null ? "−" : value}</span>
    </div>
  );
}

export default function OutputErrorViz() {
  return (
    <SceneShell
      eyebrow="같은 weight 오차"
      title="큰 입력 channel의 오차가 output에 더 크게 나옵니다"
      description="위 칸은 두 input channel의 calibration 입력값, 아래 막대는 weight 차이와 그것이 output에 만든 차이입니다. 막대 전체 폭은 0.4입니다. 숫자는 본문의 ‘첫 channel 10배’를 그리려고 고른 예시입니다(가정)."
      ariaLabel="같은 weight 오차 0.04가 입력 1인 channel에서는 output 오차 0.04, 입력 10인 channel에서는 0.4가 됨"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const errChannel = scene.channel;
        const inputs: readonly number[] = X;
        const outErr = errChannel < 0 ? null : Math.round(inputs[errChannel] * ERR * 100) / 100;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-2 gap-3">
              {X.map((x, index) => {
                const hit = index === errChannel;
                return (
                  <div
                    key={index}
                    className={`rounded-lg border px-3 py-2 text-center text-xs leading-5 sm:text-sm ${hit ? "border-[#dc2626]" : "border-border"}`}
                  >
                    <span className="block font-semibold">channel {index + 1}</span>
                    <span className="block font-mono">x = {x}</span>
                    <span className={`block ${hit ? "font-bold text-[#dc2626]" : "text-muted-foreground/60"}`}>
                      {hit ? "weight 오차 0.04" : "weight 오차 0"}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 space-y-2">
              <Bar label="weight 차이 ‖W−Ŵ‖" value={errChannel < 0 ? null : ERR} color="#64748b" on={errChannel >= 0} />
              <Bar label="output 차이 ‖XW−XŴ‖" value={outErr} color="#dc2626" on={errChannel >= 0} />
            </div>
          </div>
        );
      }}
    />
  );
}
