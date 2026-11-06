import SceneShell from "./SceneShell";

/**
 * 본문 대응: #why, #rounding-trace — 중간 합만 더 촘촘한 FP32에서 보관하면 1+δ와 1+2δ를 지키고, FP32에도 경계가 있다.
 * δ=2⁻¹¹은 FP32 간격 2⁻²³의 4096배(산술). FP32의 반 칸은 2⁻²⁴(본문의 u=2⁻ᵖ, p=24)입니다.
 */
const BLUE = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const GRAY = "#64748b";
const W = 340;
const H = 176;
const CW = 62;
const cx = (i: number) => 6 + i * 84;
const CY = 66;

type Chip = readonly [value: string, format: string];

function Chain({ chips, final }: { chips: readonly Chip[]; final: string }) {
  return (
    <g>
      {chips.map(([value, format], index) => (
        <g key={index}>
          <text x={cx(index) + CW / 2} y={CY - 10} textAnchor="middle" fontSize={11} fontWeight={700} fill={format === "FP32" ? AMBER : GRAY}>{format}</text>
          <rect x={cx(index)} y={CY} width={CW} height={36} rx={4} fill="none" stroke={format === "FP32" ? AMBER : BLUE} strokeWidth={1.25} />
          <text x={cx(index) + CW / 2} y={CY + 23} textAnchor="middle" fontSize={13} fontWeight={700} fill={format === "FP32" ? AMBER : BLUE}>{value}</text>
          {index < chips.length - 1 && (
            <g>
              <path d={`M ${cx(index) + CW + 2} ${CY + 18} H ${cx(index + 1) - 2}`} fill="none" stroke={GRAY} strokeWidth={1} />
              <text x={cx(index) + CW + 11} y={CY + 12} textAnchor="middle" fontSize={11} fontWeight={700} fill={GRAY}>{index === chips.length - 2 && chips.length === 4 ? "" : "+δ"}</text>
            </g>
          )}
        </g>
      ))}
      <text x={W / 2} y={CY + 72} textAnchor="middle" fontSize={13} fontWeight={700} fill={final.includes("잃음") ? RED : BLUE}>{final}</text>
    </g>
  );
}

function Ruler({ ticks, topName, leftName, rightName, stored }: { ticks: number; topName: string; leftName: string; rightName: string; stored: boolean }) {
  const X0 = 40;
  const X1 = 300;
  const mid = (X0 + X1) / 2;
  const Y = 110;
  return (
    <g>
      <line x1={X0 - 16} x2={X1 + 16} y1={Y} y2={Y} stroke="#94a3b8" strokeWidth={1} />
      {Array.from({ length: ticks + 1 }, (_, i) => {
        const tx = X0 + (i / ticks) * (X1 - X0);
        return <line key={i} x1={tx} x2={tx} y1={Y - (ticks > 1 ? 5 : 10)} y2={Y + (ticks > 1 ? 5 : 10)} stroke={ticks > 1 ? AMBER : BLUE} strokeWidth={1} />;
      })}
      {ticks > 1 && [X0, X1].map((tx) => <line key={tx} x1={tx} x2={tx} y1={Y - 12} y2={Y + 12} stroke={BLUE} strokeWidth={1.25} />)}
      <text x={X0} y={Y + 30} textAnchor="middle" fontSize={12} fontWeight={700} fill={BLUE}>{leftName}</text>
      <text x={X1} y={Y + 30} textAnchor="middle" fontSize={12} fontWeight={700} fill={BLUE}>{rightName}</text>
      <circle cx={mid} cy={Y - 42} r={5} fill="var(--background)" stroke={stored ? AMBER : RED} strokeWidth={1.25} />
      <text x={mid} y={Y - 54} textAnchor="middle" fontSize={13} fontWeight={700} fill={stored ? AMBER : RED}>{topName}</text>
      {stored ? (
        <path d={`M ${mid} ${Y - 37} V ${Y - 6}`} fill="none" stroke={AMBER} strokeWidth={1.25} />
      ) : (
        <path d={`M ${mid - 4} ${Y - 38} L ${X0 + 4} ${Y - 5}`} fill="none" stroke={RED} strokeWidth={1.25} />
      )}
    </g>
  );
}

const SCENES = [
  { label: "매번 FP16에 저장", summary: "1 → 1 → 1", note: "입력과 중간 합을 모두 FP16으로 저장하면 1+δ가 1이 되어 다음 덧셈도 1에서 출발합니다." },
  { label: "중간 합만 FP32", summary: "1+δ → 1+2δ → 저장 1+2δ", note: "입력 저장 방식은 그대로 두고 중간 합만 FP32에 둡니다. 1+δ가 살아 있어 1+2δ에 도착하고, 마지막 FP16 저장도 그 값을 남깁니다." },
  { label: "왜 지켜지나", summary: "δ = FP32 4096칸", note: "1 위쪽 FP16 한 칸은 2δ인데 FP32 간격은 2⁻²³으로 δ가 4096칸입니다. 1+δ는 FP32에서는 자리와 겹칩니다. 칸은 줄여 그렸습니다." },
  { label: "FP32에도 경계", summary: "1+2⁻²⁴ → 1", note: "같은 일이 더 작은 항에서 되풀이됩니다. FP32의 한 칸이 2⁻²³이므로 2⁻²⁴은 가운데이고 짝수 자리 1로 돌아옵니다. 모든 덧셈이 정확해지는 것은 아닙니다." },
] as const;

export default function AccumulatorFormatViz() {
  return (
    <SceneShell
      eyebrow="중간 합을 두는 자리"
      title="입력은 같아도 중간 합의 형식이 결과를 바꿉니다"
      description="FP16은 16 bit, FP32는 32 bit로 저장하는 형식이고 FP32의 자리가 더 촘촘합니다. 칸 위의 글자가 그 값을 보관하는 형식입니다."
      note="앞의 장면은 저장 변환의 사례이고 2⁻²⁴은 간격에서 계산한 값입니다. 특정 장치의 누산 방식을 측정한 것이 아닙니다."
      ariaLabel="중간 합을 FP16과 FP32에 보관할 때의 차이"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 && <Chain chips={[["1", "FP16"], ["1", "FP16"], ["1", "FP16"]]} final="1+δ가 저장 때 사라져 2δ를 잃음" />}
          {active === 1 && <Chain chips={[["1", "FP16"], ["1+δ", "FP32"], ["1+2δ", "FP32"], ["1+2δ", "FP16"]]} final="마지막 저장 뒤에도 1+2δ" />}
          {active === 2 && <Ruler ticks={32} topName="1+δ" leftName="1" rightName="1+2δ" stored />}
          {active === 3 && <Ruler ticks={1} topName="1+2⁻²⁴" leftName="1" rightName="1+2⁻²³" stored={false} />}
        </svg>
      )}
    />
  );
}
