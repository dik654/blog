import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — p−1−a = 23−1−6 = 16. 17⁶ → 12, 17¹⁶ → 2, 17²² → 1, δ=5에 2를 곱해 10.
 */
const A = "#2563eb";
const B = "#b45309";
const INK = "#64748b";
const CELL = 15.2;
const X0 = 13;
const SIX = 6;
const TOTAL = 22;

const SCENES = [
  { label: "22제곱은 1입니다", summary: "17²² → 1", note: "0이 아닌 값을 22제곱하면 mod 23에서 1입니다. 칸 하나는 γ=17을 한 번 곱한 것이고, 칸 22개를 모두 곱하면 처음의 1로 돌아옵니다." },
  { label: "앞 6칸은 가리개", summary: "17⁶ → 12", note: "개인키 a=6만큼 곱하면 Alice가 쓴 가리개 12입니다. 이 값의 효과를 없애는 수가 필요합니다." },
  { label: "남은 16칸이 역원", summary: "23−1−6 = 16, 17¹⁶ → 2", note: "22칸에서 앞의 6칸을 뺀 나머지 16칸이 원문의 p−1−a입니다. 17¹⁶의 나머지 2는 따로 계산한 값입니다." },
  { label: "둘을 곱하면 1, δ에 곱하면 메시지", summary: "12×2 → 1, 5×2 = 10", note: "12×2=24의 나머지는 1이고 이는 22칸 전체와 같습니다. 그래서 17¹⁶을 δ=5에 곱하면 가리개가 사라지고 같은 메시지 10이 나옵니다." },
] as const;

export default function InverseSplitViz() {
  return (
    <SceneShell
      eyebrow="원문의 복호 단계"
      title="p−1−a 제곱은 22칸에서 비밀 a칸을 뺀 나머지입니다"
      description="원문의 γ·δ·a에 우리 사례의 17·5·6을 넣었습니다. 역원은 곱해서 1이 되는 수입니다. 계산은 23으로 나눈 나머지입니다."
      ariaLabel="17을 곱하는 22칸을 앞 6칸과 뒤 16칸으로 나누어 곱하면 1이 되는 그림"
      scenes={SCENES}
      render={(active) => {
        const firstOn = active === 1 || active === 3;
        const restOn = active >= 2;
        const midX = X0 + SIX * CELL;
        const endX = X0 + TOTAL * CELL;
        return (
          <svg viewBox="0 0 360 150" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <g opacity={firstOn ? 1 : 0.2}>
              <text x={(X0 + midX) / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700} fill={A}>6칸 → 12</text>
              <path d={`M${X0} 34 V29 H${midX - 2} V34`} fill="none" stroke={A} strokeWidth={1} />
            </g>
            <g opacity={restOn ? 1 : 0.2}>
              <text x={(midX + endX) / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700} fill={B}>16칸 → 2</text>
              <path d={`M${midX} 34 V29 H${endX - 2} V34`} fill="none" stroke={B} strokeWidth={1} />
            </g>
            {Array.from({ length: TOTAL }, (_, index) => {
              const first = index < SIX;
              const on = active === 0 || (first ? firstOn : restOn);
              return <rect key={index} x={X0 + index * CELL} y={40} width={CELL - 2} height={26} rx={2} fill={first ? A : B} fillOpacity={on ? 0.8 : 0.15} />;
            })}
            <g opacity={active === 0 || active === 3 ? 1 : 0.2}>
              <path d={`M${X0} 72 V77 H${endX - 2} V72`} fill="none" stroke={INK} strokeWidth={1} />
              <text x={(X0 + endX) / 2} y={95} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK}>22칸 → 1</text>
            </g>
            <text x={(X0 + endX) / 2} y={132} textAnchor="middle" fontSize={14} fontWeight={700} fill={active === 3 ? "#047857" : "#94a3b8"} opacity={active === 3 ? 1 : 0}>δ × 2 = 5 × 2 = 메시지 10</text>
          </svg>
        );
      }}
    />
  );
}
