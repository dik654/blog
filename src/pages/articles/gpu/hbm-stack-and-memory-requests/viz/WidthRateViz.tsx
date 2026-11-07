import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — 16×64 = 32×32 = 1024비트, 1024 × 8Gb/s = 8192Gb/s,
 * ÷8 = 1024GB/s = 1.024TB/s, 8개 스택 = 8.192TB/s. 속도 8Gb/s는 글의 계산 가정입니다.
 * 넓이 그림: 가로 = 선 수, 세로 = 선당 속도, 넓이 = 스택의 이론상 상한.
 */
const SCENES = [
  { label: "16개 × 64비트", summary: "16 × 64 = 1,024비트", note: "HBM3 PHY 설명의 첫 표현입니다. 칸 하나가 64비트 channel 하나이고, 전체 폭은 데이터 선 1,024개입니다." },
  { label: "32개 × 32비트", summary: "32 × 32 = 1,024비트", note: "같은 폭을 32비트 pseudo-channel 32개로 나눈 표현입니다. 칸만 잘게 나뉠 뿐 전체 폭은 그대로입니다." },
  { label: "선마다 8Gb/s를 곱합니다", summary: "1,024 × 8 = 8,192Gb/s", note: "가로 띠 한 줄이 선당 1Gb/s입니다. 8줄은 글이 놓은 계산 가정이며, 넓이가 곧 스택 하나가 초당 보내는 비트 수의 상한입니다." },
  { label: "비트를 바이트로", summary: "8,192 ÷ 8 = 1,024GB/s", note: "1바이트가 8비트이므로 8줄을 한 묶음으로 세면 1,024GB/s, 곧 1.024TB/s입니다. 넓이는 같고 단위만 바뀝니다." },
  { label: "스택 8개", summary: "1.024 × 8 = 8.192TB/s", note: "8개 스택을 같은 조건으로 동시에 쓴 값입니다. 신호 데이터 폭으로 구한 상한이며 refresh·명령 대기·읽기 쓰기 전환·접근 불균형을 차감한 측정값이 아닙니다." },
] as const;

const X0 = 38;
const BAR_W = 312;
const Y0 = 44;
const ROW_H = 13;
const LAYERS = Array.from({ length: 8 }, (_, index) => index);
const STACKS = Array.from({ length: 8 }, (_, index) => index);

function Segments({ count }: { count: number }) {
  const width = BAR_W / count;
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <rect key={index} x={X0 + index * width} y={Y0} width={width} height={ROW_H * 2} fill={index % 2 === 0 ? "#2563eb" : "#60a5fa"} fillOpacity={0.75} stroke="#ffffff" strokeWidth={0.75} />
      ))}
    </>
  );
}

export default function WidthRateViz() {
  return (
    <SceneShell
      eyebrow="폭 × 속도"
      title="선 수와 선당 속도를 곱한 넓이가 스택의 이론상 상한입니다"
      description="가로는 데이터 선 수, 세로는 선당 속도입니다. 선당 8Gb/s는 계산 가정입니다."
      ariaLabel="HBM3 폭 1024비트에 가정 속도 8기가비트를 곱해 대역폭 상한을 구하는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 168" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active < 4 && <text x={X0 + BAR_W / 2} y={18} textAnchor="middle" fontSize={13} fontWeight={700} fill="#64748b">폭 = 데이터 선 1,024개</text>}
          {active < 4 && <line x1={X0} x2={X0 + BAR_W} y1={28} y2={28} stroke="#94a3b8" strokeWidth={1} />}
          {active === 0 && <Segments count={16} />}
          {active === 1 && <Segments count={32} />}
          {active < 2 && <text x={X0 + BAR_W / 2} y={Y0 + 46} textAnchor="middle" fontSize={13} fontWeight={700} fill="#2563eb">{active === 0 ? "channel 16칸, 칸마다 64비트" : "pseudo-channel 32칸, 칸마다 32비트"}</text>}
          {active === 2 && LAYERS.map((layer) => (
            <rect key={layer} x={X0} y={Y0 + layer * ROW_H} width={BAR_W} height={ROW_H} fill="#2563eb" stroke="#ffffff" strokeWidth={0.75} />
          ))}
          {active === 3 && <rect x={X0} y={Y0} width={BAR_W} height={ROW_H * 8} fill="#2563eb" />}
          {(active === 2 || active === 3) && (
            <>
              <text x={X0 - 6} y={Y0 + 50} textAnchor="end" fontSize={13} fontWeight={700} fill="#64748b">{active === 2 ? "8" : "1"}</text>
              <text x={X0 - 6} y={Y0 + 66} textAnchor="end" fontSize={12} fill="#64748b">{active === 2 ? "Gb/s" : "GB/s"}</text>
              <text x={X0 + BAR_W / 2} y={Y0 + 62} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">{active === 2 ? "8,192Gb/s" : "1,024GB/s"}</text>
              <text x={X0 + BAR_W / 2} y={Y0 + 122} textAnchor="middle" fontSize={12} fill="#64748b">{active === 2 ? "띠 한 줄 = 선당 1Gb/s (8줄은 가정)" : "8비트 = 1바이트, 넓이는 그대로"}</text>
            </>
          )}
          {active === 4 && STACKS.map((stack) => (
            <g key={stack}>
              <rect x={8 + (stack % 4) * 87} y={12 + Math.floor(stack / 4) * 72} width={82} height={62} fill="#2563eb" />
              <text x={49 + (stack % 4) * 87} y={38 + Math.floor(stack / 4) * 72} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">스택 {stack + 1}</text>
              <text x={49 + (stack % 4) * 87} y={55 + Math.floor(stack / 4) * 72} textAnchor="middle" fontSize={12} fill="#ffffff">1.024TB/s</text>
            </g>
          ))}
        </svg>
      )}
    />
  );
}
