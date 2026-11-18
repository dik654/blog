import SceneShell from "./SceneShell";

/**
 * 본문 대응: #range-proof — 3-bit little-endian, 자릿값 1·2·4.
 * w=4 → (0,0,1), 합 4. 모든 칸이 1이면 7이 최댓값.
 * booleanity가 없으면 (0,0,2)가 8을 만든다(가정한 위조 예). w=9의 하위 3 bits는 (1,0,0)=1이라 9와 다르다.
 */
const WEIGHTS: readonly number[] = [1, 2, 4];

type Scene = {
  label: string;
  summary: string;
  note: string;
  w: number;
  bits: readonly number[];
  dropped: number | null;
};

const SCENES: readonly Scene[] = [
  {
    label: "w=4를 3칸에 나누기",
    summary: "0·1 + 0·2 + 1·4 = 4",
    w: 4,
    bits: [0, 0, 1],
    dropped: null,
    note: "첫 칸이 가장 낮은 자리 1이고, 다음이 2, 4입니다(little-endian). 4는 (0,0,1)이 되고, 세 칸 모두 0 또는 1이며 자릿값을 곱해 더하면 다시 4가 됩니다.",
  },
  {
    label: "세 칸이 낼 수 있는 끝",
    summary: "1·1 + 1·2 + 1·4 = 7",
    w: 7,
    bits: [1, 1, 1],
    dropped: null,
    note: "세 칸을 모두 1로 채워도 7입니다. 각 칸이 0 또는 1뿐이라면 이 세 칸이 만드는 값은 0부터 7까지이므로, 합 검사를 통과한 w는 0≤w<8 안에 있습니다.",
  },
  {
    label: "0·1 검사가 빠지면",
    summary: "0·1 + 0·2 + 2·4 = 8 — 합은 맞음",
    w: 8,
    bits: [0, 0, 2],
    dropped: null,
    note: "셋째 칸에 2를 넣으면(가정한 위조 예) 자릿값 합만으로는 범위 밖 8을 만들 수 있습니다. 2·(2−1)=2는 0이 아니므로 booleanity 검사가 이 칸을 거절합니다. 두 조건이 함께 있어야 하는 이유입니다.",
  },
  {
    label: "w=9를 3칸에 자르면",
    summary: "하위 3칸 (1,0,0) → 1 ≠ 9",
    w: 9,
    bits: [1, 0, 0],
    dropped: 1,
    note: "9는 1+8이라 8의 자리가 필요하지만 3-bit profile에는 그 칸이 없습니다. 남은 세 칸만 쓰면 1이 되어 9 mod 8의 다른 값을 증명하게 되므로, 같은 w와의 합 검사에서 거절해야 합니다.",
  },
];

const LINE_W = 300;
const LINE_H = 64;
const PAD = 18;
const STEP = (LINE_W - 2 * PAD) / 9;
const nx = (value: number) => PAD + value * STEP;

export default function BitRangeViz() {
  return (
    <SceneShell
      eyebrow="3-bit range · 자릿값 1·2·4"
      title="세 칸의 bit가 0부터 7까지만 만들 수 있는 이유"
      description="칸 하나가 secret bit aᵢ 하나입니다. 칸 아래 첫 검사 상자는 각 칸이 0 또는 1인지(aᵢ(aᵢ−1)=0, booleanity), 둘째 상자는 자릿값을 곱해 더한 값이 commitment의 w와 같은지 봅니다."
      note="Field 원소를 integer로 옮기는 canonical encoding과 3-bit unsigned profile을 고정했다는 본문의 가정을 따릅니다."
      ariaLabel="세 bit 칸과 자릿값 1, 2, 4로 w를 복원하는 range 검사"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const sum = scene.bits.reduce<number>((acc, bit, index) => acc + bit * WEIGHTS[index], 0);
        const boolOk = scene.bits.every((bit) => bit * (bit - 1) === 0);
        const sumOk = sum === scene.w;
        return (
          <div className="min-w-0 space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {WEIGHTS.map((weight, index) => {
                const bit = scene.bits[index];
                const bad = bit * (bit - 1) !== 0;
                return (
                  <div
                    key={weight}
                    className={`min-w-0 rounded-lg border px-1 py-2 text-center ${bad ? "border-red-600" : "border-border"} bg-background`}
                  >
                    <p className="text-[11px] text-muted-foreground">자릿값 {weight}</p>
                    <p className={`mt-1 font-mono text-2xl font-bold ${bad ? "text-red-700 dark:text-red-400" : ""}`}>{bit}</p>
                    <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                      {bit}·{weight} = {bit * weight}
                    </p>
                  </div>
                );
              })}
              <div
                className={`min-w-0 rounded-lg border border-dashed px-1 py-2 text-center ${
                  scene.dropped === null ? "border-border/50 text-muted-foreground/50" : "border-amber-600 text-amber-700 dark:text-amber-400"
                }`}
              >
                <p className="text-[11px]">자릿값 8</p>
                <p className="mt-1 font-mono text-2xl font-bold">{scene.dropped === null ? "−" : scene.dropped}</p>
                <p className="mt-1 text-[11px] leading-4">3-bit에 없는 칸</p>
              </div>
            </div>

            <div className="grid gap-2 text-xs sm:grid-cols-2 sm:text-sm">
              <div className={`rounded-lg border px-3 py-2 ${boolOk ? "border-border" : "border-red-600"}`}>
                <span className="text-muted-foreground">각 칸 0 또는 1? </span>
                <span className={`font-bold ${boolOk ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
                  {boolOk ? "통과" : "거절 (2·1=2≠0)"}
                </span>
              </div>
              <div className={`rounded-lg border px-3 py-2 ${sumOk ? "border-border" : "border-red-600"}`}>
                <span className="text-muted-foreground">자릿값 합 {sum} = w {scene.w}? </span>
                <span className={`font-bold ${sumOk ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
                  {sumOk ? "같음" : "다름 → 거절"}
                </span>
              </div>
            </div>

            <svg viewBox={`0 0 ${LINE_W} ${LINE_H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`수직선 위 w=${scene.w}와 허용 범위 0부터 7`}>
              <rect x={nx(0) - 6} y={20} width={nx(7) - nx(0) + 12} height={14} rx={3} fill="#2563eb" opacity={0.14} />
              <text x={nx(0) - 6} y={13} fontSize={10} fill="#2563eb" fontWeight={700}>세 칸이 만드는 범위 0–7</text>
              <line x1={PAD - 6} x2={LINE_W - PAD + 6} y1={27} y2={27} stroke="#94a3b8" strokeWidth={1} />
              {Array.from({ length: 10 }, (_, value) => (
                <g key={value}>
                  <line x1={nx(value)} x2={nx(value)} y1={23} y2={31} stroke="#94a3b8" strokeWidth={1} />
                  <text x={nx(value)} y={48} textAnchor="middle" fontSize={10} fill={value > 7 ? "#b45309" : "#64748b"}>
                    {value}
                  </text>
                </g>
              ))}
              <circle cx={nx(scene.w)} cy={27} r={6} fill={scene.w > 7 ? "#dc2626" : "#2563eb"} />
              <text x={nx(scene.w)} y={62} textAnchor="middle" fontSize={10} fontWeight={700} fill={scene.w > 7 ? "#dc2626" : "#2563eb"}>
                w={scene.w}
              </text>
            </svg>
          </div>
        );
      }}
    />
  );
}
