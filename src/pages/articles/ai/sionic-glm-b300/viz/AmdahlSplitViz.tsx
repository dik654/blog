import SceneShell from "./SceneShell";

/**
 * 본문 대응: #runtime — f=0.4인 kernel을 4배 빠르게 하면 1/(0.6+0.1)≈1.43배.
 * 마지막 장면은 같은 식에서 kernel 몫을 0으로 보낸 산술값 1/0.6≈1.67배다.
 */
const X0 = 20;
const SCALE = 320;
const REST = 0.6;
const KERNEL = 0.4;

const SCENES = [
  {
    label: "원래 시간",
    summary: "0.6 + 0.4 = 1.0",
    kernel: KERNEL,
    note: "전체 forward 시간을 1로 놓으면 개선할 kernel이 0.4(f), 그대로 남는 launch·collective·sampling·동기화가 0.6입니다. 이 비율은 글의 계산 예입니다.",
  },
  {
    label: "kernel만 4배 빠르게",
    summary: "0.6 + 0.1 = 0.7 → 약 1.43배",
    kernel: KERNEL / 4,
    note: "kernel 몫 0.4가 4로 나뉘어 0.1이 됩니다. 전체는 0.7이라 speedup은 1 ÷ 0.7 ≈ 1.43배입니다. 이제 막대 대부분은 손대지 않은 0.6입니다.",
  },
  {
    label: "kernel이 0이 되어도",
    summary: "0.6만 남음 → 약 1.67배가 끝",
    kernel: 0,
    note: "같은 식에서 kernel을 아무리 빠르게 해도 0.6은 남아 1 ÷ 0.6 ≈ 1.67배를 넘지 못합니다(식에서 계산한 값). 개선 뒤에는 이 남은 구간이 새 병목으로 드러나므로 전체 trace를 다시 측정합니다.",
  },
] as const;

export default function AmdahlSplitViz() {
  return (
    <SceneShell
      eyebrow="부분 가속의 상한"
      title="kernel 몫만 줄어들고 나머지 0.6은 그대로 남습니다"
      description="막대 길이가 forward 한 번의 시간입니다. 점선 칸은 원래 길이 1.0입니다. 나머지 0.6이 그대로라는 것은 글의 가정이며, overlap과 추가 비용은 profile로 따로 확인합니다."
      ariaLabel="kernel 비율 0.4를 4배 가속했을 때와 0으로 만들었을 때 전체 시간과 speedup"
      scenes={SCENES}
      render={(active) => {
        const kernel = SCENES[active].kernel;
        const total = REST + kernel;
        return (
          <svg viewBox="0 0 360 132" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <rect x={X0} y={34} width={SCALE} height={40} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
            <rect x={X0} y={34} width={REST * SCALE} height={40} fill="#64748b" fillOpacity={0.28} stroke="#64748b" strokeWidth={1} />
            <text x={X0 + (REST * SCALE) / 2} y={58} textAnchor="middle" fontSize={11} fontWeight={700} fill="#64748b">나머지 0.6</text>
            {kernel > 0 && (
              <>
                <rect x={X0 + REST * SCALE} y={34} width={kernel * SCALE} height={40} fill="#2563eb" fillOpacity={0.28} stroke="#2563eb" strokeWidth={1} />
                <text x={X0 + REST * SCALE + (kernel * SCALE) / 2} y={26} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">{`kernel ${kernel.toFixed(1)}`}</text>
              </>
            )}
            <text x={X0 + SCALE} y={26} textAnchor="end" fontSize={11} fill="#94a3b8">{kernel === KERNEL ? "" : "원래 1.0"}</text>
            <line x1={X0} x2={X0 + total * SCALE} y1={92} y2={92} stroke="#2563eb" strokeWidth={1.25} />
            <line x1={X0 + total * SCALE} x2={X0 + total * SCALE} y1={86} y2={98} stroke="#2563eb" strokeWidth={1.25} />
            <text x={X0} y={114} fontSize={11} fill="#2563eb">{`전체 ${total.toFixed(1)} → speedup 1 ÷ ${total.toFixed(1)} ≈ ${(1 / total).toFixed(2)}배`}</text>
          </svg>
        );
      }}
    />
  );
}
