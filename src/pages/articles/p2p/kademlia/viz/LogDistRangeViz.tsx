import SceneShell from "./SceneShell";

/**
 * 본문 대응: #routing — "가까운 구간 하나는 좁은 ID 범위를, 먼 구간 하나는 넓은 ID 범위를 대표합니다."
 * 8-bit toy network, S=10110100₂=180. LogDist k 구간 = XOR 값이 2^(k−1) 이상 2^k 미만인 ID.
 * S 기준으로 계산하면 LD8 0–127(128), LD7 192–255(64), LD6 128–159(32), LD5 160–175(16),
 * LD4 184–191(8), LD3 176–179(4), LD2 182–183(2), LD1 181(1). 합계 255 + 자기 자신 1 = 256.
 */
const REGIONS = [
  { ld: 8, start: 0, end: 127 },
  { ld: 7, start: 192, end: 255 },
  { ld: 6, start: 128, end: 159 },
  { ld: 5, start: 160, end: 175 },
  { ld: 4, start: 184, end: 191 },
  { ld: 3, start: 176, end: 179 },
  { ld: 2, start: 182, end: 183 },
  { ld: 1, start: 181, end: 181 },
] as const;

const PEERS: Record<number, string> = { 182: "P2", 185: "P1", 188: "N188", 189: "N189", 190: "N190" };

const SCENES = [
  {
    label: "먼 절반은 구간 하나",
    summary: "LD8 · 0–127 · 128개",
    show: [8],
    note: "S=10110100과 첫 bit부터 다른 ID는 XOR의 가장 높은 1이 위치 7이라 모두 LogDist 8입니다. ID 256개의 절반인 128개가 구간 하나로 묶이고, P3(52)도 여기 있습니다.",
  },
  {
    label: "가까워질수록 절반씩 좁아짐",
    summary: "LD7 64개 · LD6 32개 · LD5 16개",
    show: [7, 6, 5],
    note: "S와 같은 앞자리가 한 bit 길어질 때마다 구간의 ID 수가 절반이 됩니다. LD7은 192–255(P4 포함), LD6은 128–159, LD5는 160–175입니다.",
  },
  {
    label: "S 바로 옆은 아주 좁은 구간",
    summary: "LD4 8 · LD3 4 · LD2 2 · LD1 1개",
    show: [4, 3, 2, 1],
    note: "아래 줄은 176–191 확대입니다. P1·N188·N189·N190은 모두 LD4(184–191), P2(182)는 LD2이고 181은 혼자 LD1입니다.",
  },
  {
    label: "구간 8개가 ID 255개를 나눔",
    summary: "1+2+4+…+128 = 255",
    show: [8, 7, 6, 5, 4, 3, 2, 1],
    note: "LogDist k 구간은 XOR 값이 2ᵏ⁻¹ 이상 2ᵏ 미만이라 ID 2ᵏ⁻¹개를 덮습니다. 구간마다 연락처 몇 개만 보관하므로 가까운 방향은 좁게, 먼 방향은 넓게 묶인 표본이 남습니다.",
  },
] as const;

const ON = "#2563eb";
const OFF = "#94a3b8";
const SELF = "#dc2626";
const INK = "#64748b";

const L = 8;
const SPAN = 284;
const tx = (id: number) => L + (id * SPAN) / 256;
const TOP_Y = 46;
const TOP_H = 30;
const Z0 = 176;
const CELL = SPAN / 16;
const zx = (id: number) => L + (id - Z0) * CELL;
const Z_Y = 124;
const Z_H = 24;
/** 확대 줄 아래 이름표의 높이 단: 이웃한 N188·N189·N190이 겹치지 않게 번갈아 둡니다. */
const PEER_TIER: Record<number, number> = { 182: 0, 185: 0, 188: 0, 189: 1, 190: 0 };

const ldOf = (id: number) => REGIONS.find((r) => id >= r.start && id <= r.end)?.ld ?? 0;

export default function LogDistRangeViz() {
  return (
    <SceneShell
      eyebrow="거리 구간의 폭"
      title="LogDist 구간은 S에서 멀어질수록 두 배씩 넓어집니다"
      description="8-bit toy network의 ID 0–255를 한 줄로 놓고 S=180 기준 LogDist 구간을 칠했습니다. 칸 폭은 XOR 거리 식에서 계산한 ID 개수이며, 구간마다 보관하는 연락처 수 k와는 다른 값입니다."
      ariaLabel="S=180 기준 LogDist 1부터 8까지 구간이 덮는 ID 범위"
      scenes={SCENES}
      render={(active) => {
        const shown = new Set<number>(SCENES[active].show);
        const color = (ld: number) => (shown.has(ld) ? ON : OFF);
        return (
          <svg viewBox="0 0 300 206" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={L} y={14} fontSize={10} fontWeight={700} fill={INK}>
              ID 공간 0–255 전체
            </text>
            {REGIONS.map((r) => {
              const x = tx(r.start);
              const w = tx(r.end + 1) - x;
              const labeled = r.ld >= 5;
              return (
                <g key={r.ld}>
                  <rect x={x} y={TOP_Y} width={w} height={TOP_H} fill={color(r.ld)} fillOpacity={shown.has(r.ld) ? 0.22 : 0.08} stroke={color(r.ld)} strokeWidth={1} />
                  {labeled && (
                    <>
                      <text x={x + w / 2} y={TOP_Y + 13} textAnchor="middle" fontSize={r.ld === 5 ? 8 : 9.5} fontWeight={700} fill={color(r.ld)}>
                        LD{r.ld}
                      </text>
                      <text x={x + w / 2} y={TOP_Y + 25} textAnchor="middle" fontSize={r.ld === 5 ? 8 : 9} fill={color(r.ld)}>
                        {r.end - r.start + 1}
                        {r.ld >= 6 ? "개" : ""}
                      </text>
                    </>
                  )}
                </g>
              );
            })}
            <rect x={tx(180)} y={TOP_Y} width={tx(181) - tx(180)} height={TOP_H} fill={SELF} />
            {[
              { id: 52, name: "P3" },
              { id: 180, name: "S" },
              { id: 244, name: "P4" },
            ].map((p) => (
              <g key={p.name}>
                <line x1={tx(p.id) + 0.55} x2={tx(p.id) + 0.55} y1={TOP_Y - 8} y2={TOP_Y} stroke={p.name === "S" ? SELF : INK} strokeWidth={1} />
                <text x={tx(p.id) + 0.55} y={TOP_Y - 11} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={p.name === "S" ? SELF : INK}>
                  {p.name}
                </text>
              </g>
            ))}
            <text x={L} y={TOP_Y + TOP_H + 12} fontSize={9} fill={INK}>
              0
            </text>
            <text x={L + SPAN} y={TOP_Y + TOP_H + 12} textAnchor="end" fontSize={9} fill={INK}>
              255
            </text>

            <line x1={tx(Z0)} y1={TOP_Y + TOP_H} x2={L} y2={Z_Y - 2} stroke={OFF} strokeWidth={1} strokeDasharray="3 3" />
            <line x1={tx(192)} y1={TOP_Y + TOP_H} x2={L + SPAN} y2={Z_Y - 2} stroke={OFF} strokeWidth={1} strokeDasharray="3 3" />
            <text x={110} y={Z_Y - 8} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={INK}>
              176–191 확대
            </text>

            {Array.from({ length: 16 }, (_, i) => Z0 + i).map((id) => {
              const ld = ldOf(id);
              const self = id === 180;
              const c = self ? SELF : color(ld);
              const peer = PEERS[id];
              return (
                <g key={id}>
                  <rect x={zx(id)} y={Z_Y} width={CELL} height={Z_H} fill={c} fillOpacity={self ? 0.25 : shown.has(ld) ? 0.2 : 0.06} stroke={c} strokeWidth={1} />
                  <text x={zx(id) + CELL / 2} y={Z_Y + 15.5} textAnchor="middle" fontSize={self ? 10 : 7.5} fontWeight={self ? 700 : 400} fill={self ? SELF : INK}>
                    {self ? "S" : id}
                  </text>
                  {peer && !self && (
                    <text x={zx(id) + CELL / 2} y={Z_Y + Z_H + 11 + (PEER_TIER[id] ?? 0) * 10} textAnchor="middle" fontSize={9} fontWeight={700} fill={c}>
                      {peer}
                    </text>
                  )}
                </g>
              );
            })}
            {REGIONS.filter((r) => r.ld <= 4).map((r) => {
              const x = zx(r.start);
              const w = zx(r.end + 1) - x;
              return (
                <g key={`z${r.ld}`}>
                  <text x={x + w / 2} y={Z_Y + Z_H + 38} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={color(r.ld)}>
                    LD{r.ld}
                  </text>
                  <text x={x + w / 2} y={Z_Y + Z_H + 50} textAnchor="middle" fontSize={9} fill={color(r.ld)}>
                    {r.end - r.start + 1}개
                  </text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
