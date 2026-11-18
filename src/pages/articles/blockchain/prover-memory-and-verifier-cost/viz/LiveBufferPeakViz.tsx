import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case·#picture·#mechanism — 순간마다 살아 있는 버퍼를 쌓고 가장 높은 순간을 고른다.
 * 원본 2²⁰행×64열×4B = 256MiB, 8배 평가표 2GiB, 변환 출력 2GiB,
 * 해시 자료 (2L−1)×32B, L = 8,388,608 → 536,870,880B(512MiB−32B).
 * 모두 유지: 256 → 2,304 → 4,352 → 4,864MiB(≈4.75GiB).
 * 입력표 먼저 해제: 마지막 순간 256+2,048+512 = 2,816MiB(≈2.75GiB).
 * 단위는 MiB, 해시는 512MiB로 반올림해 그린다.
 */
const ORIGINAL = 256;
const TABLE = 2048;
const HASH = 512;

type Part = "original" | "input" | "output" | "hash";

const COLORS: Record<Part, string> = {
  original: "#64748b",
  input: "#2563eb",
  output: "#d97706",
  hash: "#16a34a",
};

const LEGEND: readonly { part: Part; label: string }[] = [
  { part: "original", label: "원본 256MiB" },
  { part: "input", label: "평가표(입력) 2GiB" },
  { part: "output", label: "변환 출력 2GiB" },
  { part: "hash", label: "해시 자료 ≈512MiB" },
];

const KEEP: readonly (readonly Part[])[] = [
  ["original"],
  ["original", "input"],
  ["original", "input", "output"],
  ["original", "input", "output", "hash"],
];

const RELEASE: readonly (readonly Part[])[] = [
  ["original"],
  ["original", "input"],
  ["original", "input", "output"],
  ["original", "output", "hash"],
];

const SIZE: Record<Part, number> = { original: ORIGINAL, input: TABLE, output: TABLE, hash: HASH };

const MOMENTS = ["① 원본", "② 평가표", "③ 변환", "④ 해시"] as const;

const SCENES = [
  {
    label: "첫 순간: 원본만",
    summary: "2²⁰행 × 64열 × 4B = 256MiB",
    shown: 1,
    release: false,
    note: "실행표 1,048,576행에 행마다 64개 값, 값마다 4바이트를 곱하면 268,435,456바이트, 곧 256MiB입니다. 행·열·값 크기는 설명용 가정입니다.",
  },
  {
    label: "8배 위치에서 평가한 표",
    summary: "256MiB + 2GiB = 2.25GiB",
    shown: 2,
    release: false,
    note: "표를 8배 많은 위치에서 평가하면 256MiB × 8 = 2GiB입니다. 원본을 아직 들고 있으면 두 버퍼가 같은 순간에 남습니다.",
  },
  {
    label: "변환하는 동안 출력이 겹치면",
    summary: "256MiB + 2GiB + 2GiB = 4.25GiB",
    shown: 3,
    release: false,
    note: "변환 동안 출력용 2GiB가 추가될 수 있습니다. 입력과 출력, 원본을 함께 보관한다는 가정이면 이 순간 4.25GiB입니다.",
  },
  {
    label: "해시 자료까지 모두 남기면",
    summary: "최고점 ≈4.75GiB",
    shown: 4,
    release: false,
    note: "8배 표의 행 L=8,388,608개를 잎으로 둔 완전 이진트리는 노드 2L−1개 × 32바이트 = 536,870,880바이트입니다. 아무것도 해제하지 않으면 ④가 가장 높습니다.",
  },
  {
    label: "해시 전에 입력표를 해제하면",
    summary: "④ ≈2.75GiB · 가장 높은 막대는 ③ 4.25GiB",
    shown: 4,
    release: true,
    note: "④의 합은 256MiB + 2GiB + 512MiB ≈ 2.75GiB로 2GiB 줄지만, 입력·출력을 함께 둔 ③ 4.25GiB가 남아 이 가정의 최고점은 ③입니다. 변환이 제자리에서 덮어쓰면 ③도 달라집니다.",
  },
] as const;

const W = 360;
const H = 210;
const LEFT = 44;
const RIGHT = 12;
const BASE_Y = 178;
const TOP_Y = 22;
const MAX_MIB = 5 * 1024;
const COL_W = 46;
const STEP = (W - LEFT - RIGHT) / MOMENTS.length;
const y = (mib: number) => BASE_Y - (mib / MAX_MIB) * (BASE_Y - TOP_Y);
const colX = (index: number) => LEFT + index * STEP + (STEP - COL_W) / 2;
const total = (parts: readonly Part[]) => parts.reduce<number>((sum, part) => sum + SIZE[part], 0);
const fmt = (mib: number) => (mib < 1024 ? `${mib}MiB` : `${Number((mib / 1024).toFixed(2))}GiB`);
/** 해시 자료가 512MiB보다 32바이트 작아서 해시가 들어간 합은 "≈"로 표시합니다. */
const hasHash = (parts: readonly Part[]) => parts.includes("hash");

export default function LiveBufferPeakViz() {
  return (
    <SceneShell
      eyebrow="동시 생존량"
      title="순간마다 남은 버퍼를 쌓고 가장 높은 막대를 고릅니다"
      description="막대 하나가 실행의 한 순간이고, 칸은 그 순간 아직 해제되지 않은 버퍼입니다. 3·7절의 크기(설명용 가정)를 그대로 쓰며 특정 증명기의 실측값이 아닙니다."
      ariaLabel="원본, 평가표, 변환 출력, 해시 자료가 순간별로 쌓이는 메모리 막대와 최고점"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const plan = scene.release ? RELEASE : KEEP;
        const totals = plan.map(total).slice(0, scene.shown);
        const peak = Math.max(...totals);
        const peakIndex = totals.indexOf(peak);
        return (
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              {LEGEND.map((item) => (
                <span key={item.part} className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: COLORS[item.part] }} />
                  {item.label}
                </span>
              ))}
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[400px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {[0, 1, 2, 3, 4, 5].map((gib) => (
                <g key={gib}>
                  <line x1={LEFT} x2={W - RIGHT} y1={y(gib * 1024)} y2={y(gib * 1024)} stroke="#cbd5e1" strokeWidth={gib === 0 ? 1 : 0.5} />
                  <text x={LEFT - 6} y={y(gib * 1024) + 4} textAnchor="end" fontSize={10} fill="#64748b">{gib}GiB</text>
                </g>
              ))}
              <line x1={LEFT} x2={W - RIGHT} y1={y(peak)} y2={y(peak)} stroke="#dc2626" strokeWidth={1} strokeDasharray="4 3" />
              {MOMENTS.map((moment, index) => {
                const visible = index < scene.shown;
                const parts = plan[index];
                const tops = parts.map((_, i) => total(parts.slice(0, i + 1)));
                const sum = total(parts);
                return (
                  <g key={moment}>
                    {visible ? (
                      parts.map((part, i) => (
                        <rect
                          key={part}
                          x={colX(index)}
                          y={y(tops[i])}
                          width={COL_W}
                          height={y(tops[i] - SIZE[part]) - y(tops[i])}
                          fill={COLORS[part]}
                          stroke="#ffffff"
                          strokeWidth={0.75}
                        />
                      ))
                    ) : (
                      <rect x={colX(index)} y={y(1024)} width={COL_W} height={y(0) - y(1024)} fill="none" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
                    )}
                    {visible && (
                      <text x={colX(index) + COL_W / 2} y={y(sum) - 5} textAnchor="middle" fontSize={11} fontWeight={700} fill={index === peakIndex ? "#dc2626" : "#334155"}>
                        {hasHash(parts) ? `≈${fmt(sum)}` : fmt(sum)}
                      </text>
                    )}
                    <text x={colX(index) + COL_W / 2} y={BASE_Y + 16} textAnchor="middle" fontSize={11} fill={visible ? "#334155" : "#94a3b8"}>{moment}</text>
                  </g>
                );
              })}
            </svg>
            <p className="mt-2 text-xs text-muted-foreground">
              <span className="font-bold text-red-700 dark:text-red-400">빨간 점선</span> = 지금까지 순간 중 가장 큰 합(최고점)
            </p>
          </div>
        );
      }}
    />
  );
}
