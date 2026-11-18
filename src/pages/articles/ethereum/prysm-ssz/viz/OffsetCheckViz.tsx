import SceneShell from "./SceneShell";

/**
 * 본문 대응: #encode-decode — fixed part 16 B(slot 8 · offset 4 · epoch 4) 뒤 variable part 16 B, 전체 32 B.
 * Decoder 검사: offset이 16보다 작지 않고 32를 넘지 않는가 → slice 길이가 8의 배수인가 → 원소 수 ≤ limit 4.
 * 본문의 거부 예: offset 12(fixed part 침범), offset 40(payload 범위 초과), 길이 10 slice(정렬 실패).
 * 길이 10 장면은 payload 끝을 26 B로 둔 가정이다: 26 − 16 = 10, 10 mod 8 = 2.
 */
const W = 340;
const H = 132;
const PAD = 12;
const COUNT = 42;
const CELL = (W - 2 * PAD) / COUNT;
const ROW_Y = 64;
const ROW_H = 22;
const cx = (byte: number) => PAD + byte * CELL;

interface OffsetScene {
  label: string;
  summary: string;
  note: string;
  offset: number;
  end: number;
  verdict: "ok" | "bad";
  checks: readonly [string, string, string];
}

const SCENES: readonly OffsetScene[] = [
  {
    label: "Offset 16이 가리키는 곳",
    summary: "fixed 0–15 · variable 16–31",
    note: "Bytes 8–11에 적힌 offset 16은 길이가 아니라 위치입니다. Container 첫 byte에서 16칸 떨어진 곳부터 validators 내용이 시작합니다.",
    offset: 16,
    end: 32,
    verdict: "ok",
    checks: ["16 ≥ 16 ✓", "16 ≤ 32 ✓", "아직 확인 전"],
  },
  {
    label: "길이와 원소 수",
    summary: "32 − 16 = 16 B → 16 ÷ 8 = 2개",
    note: "Slice 길이는 payload 끝 32에서 offset 16을 뺀 16 bytes입니다. 16은 uint64 폭 8의 배수이고 원소 수 2는 limit 4 이하라서 이때 [10, 20]을 할당합니다.",
    offset: 16,
    end: 32,
    verdict: "ok",
    checks: ["16 ≥ 16 ✓", "16 ≤ 32 ✓", "16 mod 8 = 0 · 2 ≤ 4 ✓"],
  },
  {
    label: "Offset 12",
    summary: "12 < 16 → 거부",
    note: "Offset 12는 epoch가 들어 있는 fixed part 안쪽을 가리킵니다. Variable 내용이 fixed part를 침범하므로 할당 전에 거부합니다.",
    offset: 12,
    end: 32,
    verdict: "bad",
    checks: ["12 < 16 ✗", "검사 안 함", "검사 안 함"],
  },
  {
    label: "Offset 40",
    summary: "40 > 32 → 거부",
    note: "Payload는 32 bytes에서 끝나는데 offset 40은 그 밖을 가리킵니다. 읽을 bytes가 없으므로 범위 초과로 거부합니다.",
    offset: 40,
    end: 32,
    verdict: "bad",
    checks: ["40 ≥ 16 ✓", "40 > 32 ✗", "검사 안 함"],
  },
  {
    label: "(가정) 길이 10 slice",
    summary: "10 mod 8 = 2 → 거부",
    note: "가정으로 payload가 26 bytes에서 끝난다고 하면 slice는 26 − 16 = 10 bytes입니다. 8 bytes씩 나누면 2 bytes가 남아 uint64 원소로 맞아떨어지지 않으므로 정렬 실패로 거부합니다.",
    offset: 16,
    end: 26,
    verdict: "bad",
    checks: ["16 ≥ 16 ✓", "16 ≤ 26 ✓", "10 mod 8 = 2 ✗"],
  },
];

const FIELDS = [
  { name: "slot", from: 0, to: 8, color: "#94a3b8" },
  { name: "offset", from: 8, to: 12, color: "#d97706" },
  { name: "epoch", from: 12, to: 16, color: "#94a3b8" },
  { name: "10", from: 16, to: 24, color: "#2563eb" },
  { name: "20", from: 24, to: 32, color: "#60a5fa" },
] as const;

const CHECK_NAMES = ["① offset ≥ fixed 16", "② offset ≤ payload 끝", "③ 8의 배수 · ≤ limit 4"] as const;

export default function OffsetCheckViz() {
  return (
    <SceneShell
      eyebrow="Bounded decode"
      title="Offset이 가리키는 자리를 먼저 검사한 뒤 읽습니다"
      description="칸 하나가 1 byte입니다. 회색은 fixed part의 slot·epoch, 주황은 4-byte offset, 파랑은 validators 내용입니다. 점선 칸은 payload 밖입니다."
      ariaLabel="SSZ decoder가 offset 범위, slice 길이와 원소 수를 검사하는 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const bad = scene.verdict === "bad";
        const pointer = scene.offset;
        const fromX = cx(10);
        const toX = cx(pointer) + 0.5;
        const ticks = [0, 8, 12, 16, 24, 32, 40].concat(scene.end === 26 ? [26] : []);
        return (
          <div className="min-w-0 space-y-3">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {Array.from({ length: COUNT }, (_, byte) => {
                const field = FIELDS.find((item) => byte >= item.from && byte < item.to);
                const inside = byte < scene.end;
                const sliceBad = bad && scene.end === 26 && byte >= 16 && byte < 26;
                if (!inside || !field) {
                  return <rect key={byte} x={cx(byte) + 0.5} y={ROW_Y} width={CELL - 1} height={ROW_H} fill="none" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="2 2" />;
                }
                const color = sliceBad ? "#dc2626" : scene.end === 26 && byte >= 16 ? "#94a3b8" : field.color;
                return <rect key={byte} x={cx(byte) + 0.5} y={ROW_Y} width={CELL - 1} height={ROW_H} fill={color} opacity={0.75} />;
              })}

              {FIELDS.filter((field) => field.from < scene.end).map((field) => (
                <text key={field.name} x={(cx(field.from) + cx(Math.min(field.to, scene.end))) / 2} y={ROW_Y - 6} textAnchor="middle" fontSize={9} fill="#64748b">
                  {scene.end === 26 && field.from >= 16 ? "" : field.name}
                </text>
              ))}
              {scene.end === 26 && (
                <text x={(cx(16) + cx(26)) / 2} y={ROW_Y - 6} textAnchor="middle" fontSize={9} fontWeight={700} fill="#dc2626">slice 10 B</text>
              )}

              <path d={`M ${fromX} ${ROW_Y - 16} Q ${(fromX + toX) / 2} ${ROW_Y - 58} ${toX} ${ROW_Y - 2}`} fill="none" stroke={bad && scene.end === 32 ? "#dc2626" : "#d97706"} strokeWidth={1.25} />
              <path d={`M ${toX - 4} ${ROW_Y - 9} L ${toX} ${ROW_Y - 2} L ${toX + 4} ${ROW_Y - 9}`} fill="none" stroke={bad && scene.end === 32 ? "#dc2626" : "#d97706"} strokeWidth={1.25} />
              <text x={(fromX + toX) / 2} y={ROW_Y - 40} textAnchor="middle" fontSize={10} fontWeight={700} fill={bad && scene.end === 32 ? "#dc2626" : "#b45309"}>offset {pointer}</text>

              <line x1={cx(16)} x2={cx(16)} y1={ROW_Y - 2} y2={ROW_Y + ROW_H + 2} stroke="#475569" strokeWidth={1} strokeDasharray="3 2" />
              <line x1={cx(16)} x2={cx(16)} y1={ROW_Y + ROW_H + 17} y2={ROW_Y + ROW_H + 33} stroke="#475569" strokeWidth={1} strokeDasharray="3 2" />
              <text x={cx(16) - 3} y={ROW_Y + ROW_H + 30} textAnchor="end" fontSize={9} fill="#64748b">fixed part</text>
              <text x={cx(16) + 3} y={ROW_Y + ROW_H + 30} textAnchor="start" fontSize={9} fill="#64748b">variable part</text>

              {ticks.map((tick) => (
                <text key={tick} x={cx(tick)} y={ROW_Y + ROW_H + 12} textAnchor="middle" fontSize={9} fontWeight={tick === scene.end ? 700 : 400} fill={tick === scene.end ? "#475569" : "#94a3b8"}>
                  {tick}
                </text>
              ))}
            </svg>
            <div className="grid grid-cols-3 gap-1.5">
              {CHECK_NAMES.map((name, index) => {
                const result = (scene.checks as readonly string[])[index];
                const tone = result.includes("✗") ? "border-red-600 text-red-700 dark:text-red-400" : result.includes("✓") ? "border-green-600 text-green-700 dark:text-green-400" : "border-border text-muted-foreground";
                return (
                  <div key={name} className={`min-h-[3.75rem] min-w-0 rounded-md border px-1.5 py-1.5 text-[10px] leading-4 sm:text-xs ${tone}`}>
                    <span className="block text-muted-foreground">{name}</span>
                    <strong className="block font-mono">{result}</strong>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
