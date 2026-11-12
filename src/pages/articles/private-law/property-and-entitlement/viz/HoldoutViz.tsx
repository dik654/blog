import SceneShell from "./SceneShell";

/**
 * 본문 대응: #forced-transfer — 필지를 모아 도로를 놓을 때 한 사람이 버티면 전체가 멈추고,
 * 그 사람은 자기 땅이 아니라 사업 전체의 값을 요구할 수 있다(본문 둘째 문단).
 * 값을 매겨 가져갈 길이 열려 있으면 요구 상한이 그 값으로 눌린다(판정 절차 마지막 단계).
 * 글의 예는 200필지이고 그림은 10칸으로 줄였다. 버티는 칸의 위치는 가정.
 */
const PARCELS = 10;
const HOLDOUT = 6;
const CELLS = Array.from({ length: PARCELS }, (_, i) => i);

const SCENES = [
  {
    label: "길은 한 줄로 이어져야 납니다",
    summary: "필지 전부가 필요",
    note: "도로나 철도는 필요한 필지가 하나도 빠짐없이 이어져야 놓입니다. 글의 예는 200필지이고 그림은 10칸으로 줄였습니다.",
  },
  {
    label: "한 사람만 버텨도",
    summary: "9칸 동의 · 1칸 버팀 → 전체 멈춤",
    note: "나머지가 모두 동의해도 한 칸이 빠지면 길은 놓이지 않습니다. 필요한 필지가 많을수록 이렇게 한 사람이 전체를 멈출 수 있는 자리가 늘어납니다.",
  },
  {
    label: "버티는 사람이 부를 수 있는 값",
    summary: "자기 땅 값이 아니라 사업 전체의 값",
    note: "그 한 칸이 없으면 전체가 무산되므로, 버티는 사람은 자기 땅의 가치가 아니라 사업 전체의 가치를 요구할 수 있게 됩니다. 협상 비용이 뛰는 것은 인원수 자체보다 이 구조 때문입니다.",
  },
  {
    label: "값을 매겨 가져갈 길이 열리면",
    summary: "요구 상한이 매긴 값으로 눌림",
    note: "언제든 값을 매겨 가져갈 수 있다면 보유자가 요구할 수 있는 상한이 그 값으로 눌립니다. 동의는 면제되어도 그 값을 물어 주는 것은 따라붙습니다.",
  },
] as const;

const MUTED = "#94a3b8";
const OK = "#059669";
const WARN = "#dc2626";
const ACCENT = "#4f46e5";

const CW = 40;
const X0 = 14;
const cx = (i: number) => X0 + i * CW;
const RIGHT = cx(PARCELS);

export default function HoldoutViz() {
  return (
    <SceneShell
      eyebrow="버티는 한 사람"
      title="한 칸이 빠지면 길 전체가 멈춥니다"
      description="칸 하나가 길에 필요한 필지 하나입니다. 200필지를 10칸으로 줄였고, 버티는 칸의 위치는 가정입니다. 위쪽 괄호는 크기가 아니라 무엇의 값인지를 가리킵니다."
      note="금액은 적지 않았습니다. 본문은 버티는 사람이 요구할 수 있는 값과 매긴 값의 크기를 정하지 않습니다."
      ariaLabel="필지를 모아 길을 놓을 때 한 사람이 버티는 효과와 값을 매겨 가져갈 길이 그 요구를 누르는 네 장면"
      scenes={SCENES}
      render={(active) => {
        const asked = active >= 1;
        const blocked = active >= 1;
        const demand = active === 2;
        const capped = active === 3;
        return (
          <div className="w-full min-w-0">
            <svg viewBox={`0 0 ${RIGHT + X0} 120`} role="img" aria-label={SCENES[active].label} className="h-auto w-full max-w-xl">
              {demand && (
                <g>
                  <line x1={cx(0)} y1={22} x2={RIGHT} y2={22} stroke={WARN} strokeWidth={1.25} />
                  <line x1={cx(0)} y1={22} x2={cx(0)} y2={32} stroke={WARN} strokeWidth={1.25} />
                  <line x1={RIGHT} y1={22} x2={RIGHT} y2={32} stroke={WARN} strokeWidth={1.25} />
                  <text x={(cx(0) + RIGHT) / 2} y={14} textAnchor="middle" fontSize={14} fontWeight={700} fill={WARN}>
                    요구: 사업 전체의 값
                  </text>
                </g>
              )}
              {capped && (
                <g>
                  <line x1={cx(HOLDOUT)} y1={22} x2={cx(HOLDOUT + 1)} y2={22} stroke={ACCENT} strokeWidth={1.25} />
                  <line x1={cx(HOLDOUT)} y1={22} x2={cx(HOLDOUT)} y2={32} stroke={ACCENT} strokeWidth={1.25} />
                  <line x1={cx(HOLDOUT + 1)} y1={22} x2={cx(HOLDOUT + 1)} y2={32} stroke={ACCENT} strokeWidth={1.25} />
                  <text x={cx(HOLDOUT) + CW / 2} y={14} textAnchor="middle" fontSize={14} fontWeight={700} fill={ACCENT}>
                    상한: 바깥에서 매긴 값
                  </text>
                </g>
              )}
              {CELLS.map((i) => {
                const hold = i === HOLDOUT;
                const color = !asked ? MUTED : hold ? (capped ? ACCENT : WARN) : OK;
                return (
                  <g key={i}>
                    <rect x={cx(i) + 2} y={38} width={CW - 4} height={52} rx={4} fill={color} fillOpacity={0.14} stroke={color} strokeWidth={hold && asked ? 1.25 : 1} />
                    <text x={cx(i) + CW / 2} y={70} textAnchor="middle" fontSize={13} fontWeight={700} fill={color}>
                      {!asked ? i + 1 : hold ? (capped ? "₩" : "✕") : "✓"}
                    </text>
                  </g>
                );
              })}
              <line x1={cx(0)} y1={110} x2={RIGHT} y2={110} stroke={blocked && !capped ? WARN : MUTED} strokeWidth={1.25} strokeDasharray={blocked ? "5 4" : undefined} />
            </svg>
            <p className={`mt-1 text-sm font-semibold ${!asked ? "text-muted-foreground" : capped ? "text-indigo-700 dark:text-indigo-300" : "text-red-700 dark:text-red-400"}`}>
              {!asked ? "놓일 길" : capped ? "동의 없이 옮길 길 · 그 칸에는 값을 물어 줌" : "길 전체가 멈춤"}
            </p>
            <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>✓ 동의</span>
              <span>✕ 버팀</span>
              <span>₩ 값을 매겨 옮기고 물어 줌</span>
            </p>
          </div>
        );
      }}
    />
  );
}
