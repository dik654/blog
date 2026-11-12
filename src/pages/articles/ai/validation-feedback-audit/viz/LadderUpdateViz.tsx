import SceneShell from "./SceneShell";

/**
 * 본문 대응: #paper-validation-feedback — Ladder 알고리즘 1의 갱신 조건 Rₛ(fₜ) < Rₜ₋₁ − η (가정 숫자).
 * 점수를 정확도로 가정해 loss = 1 − score, η = 0.01.
 * B 공개 0.74 → loss 0.26. A 0.24 < 0.25 → 갱신. C 0.25 ≥ 0.23 → 공개 값 0.24 유지.
 * 값은 0.01 단위 정수(백분의 일)로 들고 다닌다.
 */
const ETA = 1;
const AXIS_MIN = 22;
const AXIS_MAX = 27;

const SCENES = [
  { label: "출발: B의 공개 값", summary: "1 − 0.74 = loss 0.26", shown: 26, submit: null, name: "B", next: 26, note: "점수를 정확도로 가정하면 loss는 1 − 점수입니다. B의 공개 점수 0.74는 loss 0.26입니다. 이 값이 지금 공개된 값이고, 다음 제출이 갱신되려면 0.26 − 0.01 = 0.25보다 작아야 합니다." },
  { label: "A 제출", summary: "0.24 < 0.25 → 갱신", shown: 26, submit: 24, name: "A", next: 24, note: "A의 loss 0.24는 문턱 0.25보다 작습니다. 충분히 개선됐으므로 공개 값이 0.24로 바뀌고, 문턱도 0.24 − 0.01 = 0.23으로 내려갑니다." },
  { label: "C 제출", summary: "0.25 ≥ 0.23 → 유지", shown: 24, submit: 25, name: "C", next: 24, note: "C의 loss 0.25는 문턱 0.23보다 작지 않습니다. 공개 값은 0.24에 머뭅니다. 이 규칙은 평가자가 공개 값을 갱신하는 방식이며 참가자의 점검표만으로 같은 효과가 생기지는 않습니다." },
] as const;

const W = 360;
const H = 140;
const L = 28;
const R = W - 28;
const AXIS_Y = 88;
const x = (hundredths: number) => L + ((hundredths - AXIS_MIN) / (AXIS_MAX - AXIS_MIN)) * (R - L);
const ticks = Array.from({ length: AXIS_MAX - AXIS_MIN + 1 }, (_, i) => AXIS_MIN + i);

export default function LadderUpdateViz() {
  return (
    <SceneShell
      eyebrow="공개 값 갱신 규칙"
      title="문턱보다 낮은 loss만 공개 값을 바꿉니다"
      description="가로축은 loss(1 − 점수, 작을수록 좋음)입니다. 파란 점이 지금 공개된 값, 점선이 그 값에서 η = 0.01을 뺀 문턱입니다. 정확도라는 해석과 η는 이 글의 가정입니다."
      ariaLabel="Ladder 규칙에서 B, A, C 순서로 제출할 때 공개 값이 0.26에서 0.24로 바뀌고 C에서는 유지되는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const threshold = scene.shown - ETA;
        const updated = scene.submit !== null && scene.submit < threshold;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <text x={L} y={AXIS_Y + 40} fontSize={13} fill="#64748b">← 더 좋음</text>
              <text x={R} y={AXIS_Y + 40} textAnchor="end" fontSize={13} fill="#64748b">더 나쁨 →</text>
              <line x1={L} x2={R} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
              {ticks.map((t) => (
                <g key={t}>
                  <line x1={x(t)} x2={x(t)} y1={AXIS_Y - 4} y2={AXIS_Y + 4} stroke="#94a3b8" strokeWidth={1} />
                  <text x={x(t)} y={AXIS_Y + 20} textAnchor="middle" fontSize={13} fill="#64748b">{(t / 100).toFixed(2)}</text>
                </g>
              ))}
              <rect x={L} y={AXIS_Y - 58} width={x(threshold) - L} height={50} rx={4} fill="#16a34a" opacity={0.08} />
              <line x1={x(threshold)} x2={x(threshold)} y1={AXIS_Y - 62} y2={AXIS_Y} stroke="#16a34a" strokeWidth={1.25} strokeDasharray="4 3" />
              <text x={x(threshold)} y={AXIS_Y - 66} textAnchor="middle" fontSize={13} fontWeight={700} fill="#16a34a">문턱 {(threshold / 100).toFixed(2)}</text>
              <circle cx={x(scene.shown)} cy={AXIS_Y} r={6} fill="#2563eb" />
              <text x={x(scene.shown)} y={AXIS_Y - 14} textAnchor="middle" fontSize={13} fontWeight={700} fill="#2563eb">공개</text>
              {scene.submit !== null && (
                <g>
                  <circle cx={x(scene.submit)} cy={AXIS_Y - 34} r={9} fill="none" stroke={updated ? "#16a34a" : "#d97706"} strokeWidth={1.25} />
                  <text x={x(scene.submit)} y={AXIS_Y - 30} textAnchor="middle" fontSize={11} fontWeight={700} fill={updated ? "#16a34a" : "#d97706"}>{scene.name}</text>
                  <line x1={x(scene.submit)} x2={x(scene.submit)} y1={AXIS_Y - 24} y2={AXIS_Y - 6} stroke={updated ? "#16a34a" : "#d97706"} strokeWidth={1} strokeDasharray="2 2" />
                </g>
              )}
            </svg>
            <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-lg border border-border bg-background px-2 py-2">
                <span className="block text-muted-foreground">제출</span>
                <span className="font-mono text-sm font-bold">{scene.submit === null ? `${scene.name} 0.26` : `${scene.name} ${(scene.submit / 100).toFixed(2)}`}</span>
              </div>
              <div className="rounded-lg border border-border bg-background px-2 py-2">
                <span className="block text-muted-foreground">문턱보다 작은가</span>
                <span className={`text-xs font-bold sm:text-sm ${scene.submit === null ? "" : updated ? "text-[#16a34a]" : "text-[#d97706]"}`}>{scene.submit === null ? "출발점" : updated ? "예, 갱신" : "아니요, 유지"}</span>
              </div>
              <div className="rounded-lg border border-border bg-background px-2 py-2">
                <span className="block text-muted-foreground">이후 공개 값</span>
                <span className="font-mono text-sm font-bold">{(scene.next / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
