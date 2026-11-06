import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 매번 저장하면 1에서 다시 출발해 −2δ·−4δ가 남고, 항을 먼저 모으면 2δ·4δ가 그대로 남는다.
 * 세로는 1에서 더 간 양(δ 단위), 가로는 덧셈의 차례입니다. 가로 선이 FP16 자리입니다.
 */
const BLUE = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const GRAY = "#64748b";
const W = 340;
const H = 204;
const x = (step: number) => 66 + step * 52;
const y = (value: number) => 160 - value * 30;
const SLOTS = [
  { value: 0, name: "1" },
  { value: 2, name: "1+2δ" },
  { value: 4, name: "1+4δ" },
] as const;

const SCENES = [
  { label: "두 번 매번 저장", summary: "최종 1 · 오차 −2δ", steps: 2, grouped: false, note: "빈 점 1+δ는 두 자리의 가운데라 1로 돌아옵니다. 다음 덧셈도 저장된 1에서 출발하므로 앞에서 잃은 δ가 돌아오지 않고 −2δ가 끝까지 남습니다." },
  { label: "두 항을 먼저 모으기", summary: "최종 1+2δ · 오차 0", steps: 2, grouped: true, note: "δ+δ=2δ를 먼저 만들면 1+δ라는 중간 합을 거치지 않습니다. 1+2δ는 자리와 정확히 겹쳐 그대로 남습니다." },
  { label: "네 번 매번 저장", summary: "최종 1 · 오차 −4δ", steps: 4, grouped: false, note: "네 번 더해도 매번 같은 1에서 다시 출발합니다. 점선인 정확한 합만 위로 올라가고 차이는 −4δ로 벌어집니다." },
  { label: "네 항을 먼저 모으기", summary: "최종 1+4δ · 오차 0", steps: 4, grouped: true, note: "작은 항 넷을 모은 4δ는 두 칸을 이동합니다. 각각 작아도 합은 읽어야 할 차이가 될 수 있습니다." },
] as const;

export default function AccumulationPathViz() {
  return (
    <SceneShell
      eyebrow="덧셈의 경로"
      title="저장한 값에서 다시 출발하면 잃은 양이 쌓입니다"
      description="가로 선이 저장 자리, 빈 점이 저장 직전 값, 채운 점이 저장값, 점선이 정확한 합입니다."
      note="δ=1/2048과 입력 1, δ는 본문의 가정 사례입니다."
      ariaLabel="작은 항을 매번 저장할 때와 먼저 모을 때의 값 경로"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const end = scene.steps;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {SLOTS.map((slot) => (
              <g key={slot.value}>
                <line x1={58} x2={W - 12} y1={y(slot.value)} y2={y(slot.value)} stroke="#cbd5e1" strokeWidth={1} />
                <text x={52} y={y(slot.value) + 4} textAnchor="end" fontSize={12} fontWeight={700} fill={GRAY}>{slot.name}</text>
              </g>
            ))}
            {[1, 2, 3, 4].map((step) => (
              step <= end && !scene.grouped ? <text key={step} x={x(step)} y={182} textAnchor="middle" fontSize={12} fill={GRAY}>{`${step}번째`}</text> : null
            ))}
            <line x1={x(0)} y1={y(0)} x2={x(end)} y2={y(end)} stroke={GRAY} strokeWidth={1} strokeDasharray="3 3" />
            <circle cx={x(0)} cy={y(0)} r={5} fill={BLUE} />
            {!scene.grouped && Array.from({ length: end }, (_, index) => (
              <g key={index}>
                <line x1={x(index)} y1={y(0)} x2={x(index + 1)} y2={y(1)} stroke={AMBER} strokeWidth={1.25} />
                <line x1={x(index + 1)} y1={y(1) + 5} x2={x(index + 1)} y2={y(0) - 5} stroke={BLUE} strokeWidth={1.25} />
                <circle cx={x(index + 1)} cy={y(1)} r={5} fill="var(--background)" stroke={AMBER} strokeWidth={1.25} />
                <circle cx={x(index + 1)} cy={y(0)} r={5} fill={BLUE} />
              </g>
            ))}
            {!scene.grouped && (
              <g>
                <path d={`M ${x(end) + 12} ${y(end)} H ${x(end) + 18} V ${y(0)} H ${x(end) + 12}`} fill="none" stroke={RED} strokeWidth={1.25} />
                <text x={x(end) + 22} y={(y(end) + y(0)) / 2 + 4} fontSize={13} fontWeight={700} fill={RED}>{`−${end}δ`}</text>
              </g>
            )}
            {scene.grouped && (
              <g>
                <line x1={x(0)} y1={y(0)} x2={x(end)} y2={y(end)} stroke={BLUE} strokeWidth={1.25} />
                <circle cx={x(end)} cy={y(end)} r={6} fill={BLUE} />
                <text x={x(end)} y={y(end) - 12} textAnchor="end" fontSize={13} fontWeight={700} fill={BLUE}>그대로 남음</text>
                <text x={x(end / 2)} y={182} textAnchor="middle" fontSize={12} fill={GRAY}>{`δ를 ${end}개 모아 ${end}δ를 한 번에 더함`}</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
