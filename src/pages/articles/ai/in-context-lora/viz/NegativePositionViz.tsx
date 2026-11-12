import SceneShell from "./SceneShell";

/**
 * 본문 대응: #training "Reference를 '과거'로 명시하는 negative position".
 * p'_ref = p_ref − duration_ref − Δt. 그림은 reference·target 각 4 frame(가정), 단위 Δt.
 * p_ref = 0,1,2,3 → duration_ref = 3(마지막 위치) → −3..0 → −Δt 더 빼면 −4..−1.
 */
const FRAMES = 4;
const DURATION = FRAMES - 1;
const MIN_P = -4;
const MAX_P = 3;

const SCENES = [
  {
    label: "보통 위치로만 매기면",
    summary: "p_ref = 0, 1, 2, 3",
    shift: 0,
    note: "Reference에도 target과 같은 함수를 쓰면 두 구간이 모두 0부터 매겨져 같은 칸에 겹칩니다. 위치만 보아서는 어느 쪽이 먼저인지 드러나지 않습니다.",
  },
  {
    label: "구간 길이만큼 빼면",
    summary: `− duration_ref (= ${DURATION}Δt)`,
    shift: DURATION,
    note: "duration_ref는 reference 구간의 마지막 위치입니다. 이만큼 빼면 reference 전체가 앞으로 밀리지만 마지막 frame이 0에 닿아 target의 첫 frame과 같은 자리에 섭니다.",
  },
  {
    label: "Δt를 하나 더 빼면",
    summary: `p'_ref = −${DURATION + 1}, …, −1`,
    shift: DURATION + 1,
    note: "한 frame 간격 Δt를 더 빼야 reference의 마지막 frame이 −1에 놓이고 0에서 시작하는 target과 최소 한 칸 떨어집니다. Reference block 전체가 확실히 이전 시점으로 읽힙니다.",
  },
] as const;

const X0 = 24;
const STEP = 41;
const CELL = 34;
const px = (p: number) => X0 + (p - MIN_P) * STEP;
const TICKS = Array.from({ length: MAX_P - MIN_P + 1 }, (_, i) => MIN_P + i);
const SLOTS = Array.from({ length: FRAMES }, (_, i) => i);

const REF = "#059669";
const TGT = "#7c3aed";
const MUTED = "#94a3b8";
const WARN = "#dc2626";

export default function NegativePositionViz() {
  return (
    <SceneShell
      eyebrow="시간축 위치"
      title="Reference block을 통째로 target 앞으로 옮깁니다"
      description="가로축은 RoPE(위치를 회전 각도로 넣는 position embedding)가 읽는 시간 위치이고 한 칸이 한 latent frame 간격(Δt)입니다. 두 구간을 각각 4 frame으로 줄여 그렸습니다(가정)."
      note="RoPE는 위치를 상대 회전으로 encode하므로 음수 위치도 유효한 상대 관계가 된다는 것이 글의 가정입니다."
      ariaLabel="reference 위치에서 구간 길이와 한 frame 간격을 빼 target보다 앞으로 옮기는 세 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const lastRef = DURATION - scene.shift;
        const collide = lastRef >= 0;
        return (
          <div className="w-full min-w-0">
            <svg viewBox="0 0 340 160" role="img" aria-label={scene.label} className="h-auto w-full max-w-xl">
              <text x={px(MIN_P) - CELL / 2} y={16} fontSize={12} fontWeight={700} fill={REF}>
                reference (clean)
              </text>
              <text x={px(MIN_P) - CELL / 2} y={76} fontSize={12} fontWeight={700} fill={TGT}>
                target (noised)
              </text>
              {SLOTS.map((i) => {
                const p = i - scene.shift;
                const hit = collide && p >= 0;
                return (
                  <g key={`r${i}`}>
                    <rect x={px(p) - CELL / 2} y={24} width={CELL} height={28} rx={4} fill={REF} fillOpacity={0.14} stroke={hit ? WARN : REF} strokeWidth={hit ? 1.25 : 1} />
                    <text x={px(p)} y={43} textAnchor="middle" fontSize={12} fontWeight={700} fill={REF}>
                      r{i + 1}
                    </text>
                  </g>
                );
              })}
              {SLOTS.map((i) => {
                const hit = collide && i <= lastRef;
                return (
                  <g key={`t${i}`}>
                    <rect x={px(i) - CELL / 2} y={84} width={CELL} height={28} rx={4} fill={TGT} fillOpacity={0.14} stroke={hit ? WARN : TGT} strokeWidth={hit ? 1.25 : 1} />
                    <text x={px(i)} y={103} textAnchor="middle" fontSize={12} fontWeight={700} fill={TGT}>
                      g{i + 1}
                    </text>
                  </g>
                );
              })}
              <line x1={px(MIN_P) - CELL / 2} y1={130} x2={px(MAX_P) + CELL / 2} y2={130} stroke={MUTED} strokeWidth={1} />
              {TICKS.map((p) => (
                <g key={p}>
                  <line x1={px(p)} y1={126} x2={px(p)} y2={134} stroke={p === 0 ? "#334155" : MUTED} strokeWidth={1} />
                  <text x={px(p)} y={150} textAnchor="middle" fontSize={11} fontWeight={p === 0 ? 700 : 400} fill={p === 0 ? "#334155" : MUTED}>
                    {p === 0 ? "0" : p < 0 ? `−${-p}Δt` : `${p}Δt`}
                  </text>
                </g>
              ))}
              <line x1={px(-0.5)} y1={20} x2={px(-0.5)} y2={120} stroke={MUTED} strokeWidth={1} strokeDasharray="3 3" />
            </svg>
            <p className={`mt-2 text-right text-sm font-semibold ${collide ? "text-red-700 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400"}`}>
              {collide ? `target과 겹치는 칸 ${lastRef + 1}개` : "겹치는 칸 0개 · 경계에 한 칸 간격"}
            </p>
          </div>
        );
      }}
    />
  );
}
