import SceneShell from "./SceneShell";

/**
 * 본문 대응: #live-range — x=7, a=x+1=8, y=2a=16. x를 다시 안 쓰면 칸 하나를 이어 쓰고,
 * 마지막에 a+x=15가 필요하면 x와 a를 끝까지 보존한다. y는 뒤에서 쓴다고 놓는다(가정).
 * 위 막대 = live range, 아래 칸 = 설명용 값 배치.
 */
type Range = readonly [name: string, start: number, end: number];

const REUSE: readonly Range[] = [["x", 0, 1], ["a", 1, 2], ["y", 2, 9]];
const KEEP: readonly Range[] = [["x", 0, 3], ["a", 1, 3], ["y", 2, 9], ["a+x", 3, 9]];
const ROW_NAMES = ["x", "a", "y", "a+x"];

const SCENES = [
  { label: "x를 다시 쓰지 않을 때 · x=7", summary: "칸 1개 사용", ranges: REUSE, step: 0, slots: ["x=7", "", ""], note: "막대는 값을 만든 뒤 마지막으로 읽을 때까지의 구간(live range)입니다. x를 칸 1에 둡니다." },
  { label: "x를 다시 쓰지 않을 때 · a=x+1", summary: "x의 칸을 a에 줌", ranges: REUSE, step: 1, slots: ["a=8", "", ""], note: "이 계산이 x의 마지막 사용이라 x의 막대가 여기서 끝납니다. 설명용 값 배치에서는 같은 칸을 a에 줄 수 있습니다." },
  { label: "x를 다시 쓰지 않을 때 · y=2a", summary: "값 3개, 칸 1개", ranges: REUSE, step: 2, slots: ["y=16", "", ""], note: "a도 여기서 마지막으로 읽히므로 같은 칸을 y에 줍니다. 막대가 겹치지 않아 칸 하나로 충분합니다." },
  { label: "마지막에 a+x가 필요할 때 · a=x+1", summary: "칸 2개 사용", ranges: KEEP, step: 1, slots: ["x=7", "a=8", ""], note: "같은 계산이지만 x를 나중에 또 읽어야 합니다. x의 칸을 a에 줄 수 없어 칸을 하나 더 씁니다." },
  { label: "마지막에 a+x가 필요할 때 · y=2a", summary: "x·a·y 동시 보존: 칸 3개", ranges: KEEP, step: 2, slots: ["x=7", "a=8", "y=16"], note: "x와 a를 아직 읽어야 하는데 y가 생깁니다. y를 뒤에서 쓴다고 놓으면(가정) 세 막대가 겹쳐 칸 3개가 필요합니다." },
  { label: "마지막에 a+x가 필요할 때 · a+x", summary: "최대 3칸 ↔ 앞의 경우 1칸", ranges: KEEP, step: 3, slots: ["", "a+x=15", "y=16"], note: "a+x=8+7=15를 구하면 x와 a의 막대가 끝나 칸이 풀립니다. 필요한 칸 수를 정한 것은 막대가 겹치는 정도입니다. 실제 배정 수는 대상 컴파일 결과로 확인합니다." },
] as const;

const COL = 78;
const cx = (step: number) => 72 + step * COL;
const ROW_Y = (row: number) => 34 + row * 22;
const SLOT_Y = 134;
const SLOT_W = 104;

export default function ValueReuseViz() {
  return (
    <SceneShell
      eyebrow="Live range와 칸"
      title="값을 언제까지 읽느냐가 필요한 칸 수를 바꿉니다"
      description="위 막대는 각 값이 보존되는 구간, 아래 네모는 그 순간의 칸입니다. 칸 배치는 본문의 x=7 예를 위한 설명용입니다."
      ariaLabel="x, a, y의 live range와 레지스터 칸 재사용 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const hasFourth = scene.ranges === KEEP;
        const steps = ["x=7", "a=x+1", "y=2a", hasFourth ? "a+x" : "a+x 없음"];
        const slots: readonly string[] = scene.slots;
        return (
          <svg viewBox="0 0 360 180" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {steps.map((text, step) => (
              <text key={step} x={cx(step)} y={16} fontSize={12} fontWeight={step === scene.step ? 700 : 400} textAnchor="middle" fill={step === scene.step ? "#2563eb" : "#64748b"}>{text}</text>
            ))}
            <line x1={cx(scene.step)} x2={cx(scene.step)} y1={22} y2={120} stroke="#2563eb" strokeWidth={1} strokeDasharray="3 3" />
            {ROW_NAMES.map((name, row) => {
              const range = scene.ranges.find(([rangeName]) => rangeName === name);
              return (
                <g key={name}>
                  <text x={8} y={ROW_Y(row) + 12} fontSize={12} fill="#64748b">{name}</text>
                  <line x1={40} x2={352} y1={ROW_Y(row) + 8} y2={ROW_Y(row) + 8} stroke="#94a3b8" strokeWidth={1} opacity={0.4} />
                  {range && range[1] <= scene.step && (
                    <rect
                      x={cx(range[1])}
                      y={ROW_Y(row) + 1}
                      width={Math.max(cx(Math.min(range[2], scene.step)) - cx(range[1]) + (range[2] > scene.step ? 10 : 0), 4)}
                      height={14}
                      rx={2}
                      fill="#2563eb"
                      opacity={0.45}
                    />
                  )}
                </g>
              );
            })}
            {slots.map((value, slot) => {
              const x = 12 + slot * (SLOT_W + 12);
              return (
                <g key={slot}>
                  <rect x={x} y={SLOT_Y} width={SLOT_W} height={38} rx={4} fill={value ? "#dbeafe" : "none"} stroke={value ? "#2563eb" : "#94a3b8"} strokeWidth={1} strokeDasharray={value ? undefined : "3 3"} />
                  <text x={x + SLOT_W / 2} y={SLOT_Y + 15} fontSize={10} textAnchor="middle" fill="#64748b">칸 {slot + 1}</text>
                  <text x={x + SLOT_W / 2} y={SLOT_Y + 30} fontSize={12} fontWeight={700} textAnchor="middle" fill={value ? "#1e3a8a" : "#94a3b8"}>{value || "비어 있음"}</text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
