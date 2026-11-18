import SceneShell from "./SceneShell";

/**
 * 본문 대응: #bits·#finalization-pruning — 0001을 한 칸 옮겨 0010, 64/96 판정으로 bit 0을 켜 0011,
 * mask 0011과 old current epoch 10 + 1 = 11을 확인해 epoch 10을 finalized로 기록한다.
 * bit k는 transition 시점 current epoch − k를 가리킨다(갱신 전 epoch 10 기준, 갱신 뒤 epoch 11 기준).
 */
type Panel = readonly [string, string, string];

interface BitScene {
  label: string;
  summary: string;
  note: string;
  bits: string;
  base: number;
  arrows: boolean;
  mask: "" | "pass" | "fail";
  fresh: boolean;
  panel: readonly [Panel, Panel, Panel];
  written: boolean;
}

const BEFORE: readonly [Panel, Panel, Panel] = [
  ["previous justified", "기존 값", "아직 기록 전"],
  ["current justified", "epoch 10", "갱신 전 값"],
  ["finalized", "기존 값", "아직 기록 전"],
];

const SCENES: readonly BitScene[] = [
  {
    label: "갱신 전",
    summary: "0001 · bit 0 = epoch 10",
    note: "네 칸은 최근 justification 기록이고 오른쪽 끝이 bit 0입니다. 갱신 전에는 bit 0이 epoch 10을 가리키며 1이므로 epoch 10 checkpoint가 justified 상태입니다. 칸 아래 epoch 번호는 bit 위치로 계산한 값입니다.",
    bits: "0001",
    base: 10,
    arrows: false,
    mask: "",
    fresh: false,
    panel: BEFORE,
    written: false,
  },
  {
    label: "한 칸 이동",
    summary: "0001 → 0010",
    note: "Epoch 11 transition은 먼저 기록 전체를 왼쪽으로 한 칸 옮깁니다. Epoch 10의 1은 bit 1로 가고 왼쪽 끝 값은 밀려납니다. 새 bit 0은 epoch 11 자리이며 판정 전이라 0입니다.",
    bits: "0010",
    base: 11,
    arrows: true,
    mask: "",
    fresh: true,
    panel: BEFORE,
    written: false,
  },
  {
    label: "bit 0 판정",
    summary: "3×64 = 192 ≥ 2×96 = 192",
    note: "Epoch 11 target을 맞힌 unique unslashed effective balance 64를 정수 비교에 넣습니다. 192 ≥ 192이므로 bit 0을 켜 0011이 됩니다. BeaconState의 checkpoint는 아직 그대로입니다.",
    bits: "0011",
    base: 11,
    arrows: false,
    mask: "",
    fresh: true,
    panel: BEFORE,
    written: false,
  },
  {
    label: "pattern 확인",
    summary: "0011 & 0011 = 0011 · 10 + 1 = 11",
    note: "이 사례의 조건은 bit 0과 bit 1이 모두 1이고, 갱신 전 current justified epoch 10에 1을 더하면 current epoch 11이 되는 것입니다. 둘 다 맞으므로 finalized 후보는 새 epoch 11이 아니라 보존해 둔 epoch 10입니다. Spec의 나머지 세 pattern은 그리지 않았습니다.",
    bits: "0011",
    base: 11,
    arrows: false,
    mask: "pass",
    fresh: true,
    panel: [
      ["previous justified", "기록 전", "old current를 보존"],
      ["current justified", "10 → 11 후보", "새 bit 0이 가리키는 경계"],
      ["finalized", "→ 10 후보", "old current를 선택"],
    ],
    written: false,
  },
  {
    label: "state 기록",
    summary: "J = 11 · F = 10",
    note: "계산이 끝난 뒤 previous justified, current justified, bits, finalized 순서로 기록합니다. Previous justified에는 갱신 전 current인 epoch 10, current justified에는 epoch 11, finalized에는 epoch 10이 들어갑니다.",
    bits: "0011",
    base: 11,
    arrows: false,
    mask: "",
    fresh: true,
    panel: [
      ["previous justified", "epoch 10", "old current"],
      ["current justified", "epoch 11", "새 justified"],
      ["finalized", "epoch 10", "새 finalized"],
    ],
    written: true,
  },
  {
    label: "63 / 96이면",
    summary: "3×63 = 189 < 192 · 0010",
    note: "같은 이동 뒤 3×63 = 189는 192보다 작아 bit 0이 꺼진 채 남습니다. 0010 & 0011은 0011이 아니므로 이 사례의 pattern을 통과하지 못하고 새 finality가 생기지 않습니다. 기존 checkpoint는 유지됩니다.",
    bits: "0010",
    base: 11,
    arrows: false,
    mask: "fail",
    fresh: true,
    panel: [
      ["previous justified", "epoch 10", "old current"],
      ["current justified", "epoch 10", "기존 값 유지"],
      ["finalized", "기존 값", "새 finality 없음"],
    ],
    written: true,
  },
];

const CELL_X = [64, 142, 220, 298] as const;
const CELL_W = 64;
const CELL_Y = 40;
const CELL_H = 46;
const ACCENT = "#2563eb";
const MUTED = "#64748b";
const LINE = "#94a3b8";
const OK = "#16a34a";
const BAD = "#dc2626";

function Register({ scene }: { scene: BitScene }) {
  const cells = (CELL_X as readonly number[]).map((x, i) => ({ x, bit: 3 - i, value: scene.bits[i] === "1", epoch: scene.base - (3 - i) }));
  return (
    <svg viewBox="0 0 400 184" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
      {scene.arrows &&
        cells.map((cell) => (
          <g key={`arrow-${cell.bit}`}>
            <path
              d={`M ${cell.x + CELL_W / 2 - 6} 14 L ${cell.x + CELL_W / 2 - 66} 14`}
              stroke={ACCENT}
              strokeWidth={1.25}
              fill="none"
            />
            <path d={`M ${cell.x + CELL_W / 2 - 66} 14 l 6 -4 l 0 8 z`} fill={ACCENT} />
          </g>
        ))}
      {scene.arrows && (
        <text x={4} y={34} fontSize={12} fill={MUTED}>
          밀려남
        </text>
      )}
      <text x={4} y={68} fontSize={13} fontWeight={700} fill={MUTED}>
        bits
      </text>
      {cells.map((cell) => {
        const isNew = scene.fresh && cell.bit === 0;
        return (
          <g key={cell.bit}>
            <text x={cell.x + CELL_W / 2} y={33} textAnchor="middle" fontSize={13} fill={MUTED}>
              bit {cell.bit}
            </text>
            <rect
              x={cell.x}
              y={CELL_Y}
              width={CELL_W}
              height={CELL_H}
              rx={6}
              fill={cell.value ? ACCENT : "none"}
              fillOpacity={cell.value ? 0.16 : 0}
              stroke={cell.value ? ACCENT : LINE}
              strokeWidth={isNew ? 1.25 : 1}
              strokeDasharray={isNew && !cell.value ? "4 3" : undefined}
            />
            <text x={cell.x + CELL_W / 2} y={CELL_Y + 30} textAnchor="middle" fontSize={22} fontWeight={700} fill={cell.value ? ACCENT : MUTED}>
              {cell.value ? "1" : "0"}
            </text>
            <text x={cell.x + CELL_W / 2} y={CELL_Y + CELL_H + 17} textAnchor="middle" fontSize={13} fill={isNew ? ACCENT : MUTED} fontWeight={isNew ? 700 : 400}>
              epoch {cell.epoch}
            </text>
          </g>
        );
      })}
      {scene.mask !== "" && (
        <g>
          <text x={4} y={141} fontSize={13} fontWeight={700} fill={MUTED}>
            & mask
          </text>
          {cells.map((cell) => (
            <g key={`mask-${cell.bit}`}>
              <rect x={cell.x} y={122} width={CELL_W} height={28} rx={6} fill="none" stroke={cell.bit <= 1 ? ACCENT : LINE} strokeWidth={1} />
              <text x={cell.x + CELL_W / 2} y={141} textAnchor="middle" fontSize={14} fontWeight={700} fill={cell.bit <= 1 ? ACCENT : MUTED}>
                {cell.bit <= 1 ? "1" : "0"}
              </text>
            </g>
          ))}
          <text x={64} y={176} fontSize={13} fontWeight={700} fill={scene.mask === "pass" ? OK : BAD}>
            {scene.mask === "pass" ? "= 0011 일치" : "= 0010 불일치"}
          </text>
          {scene.mask === "pass" && (
            <text x={362} y={176} textAnchor="end" fontSize={13} fill={MUTED}>
              갱신 전 current 10 + 1 = 11
            </text>
          )}
        </g>
      )}
    </svg>
  );
}

export default function JustificationBitsViz() {
  return (
    <SceneShell
      eyebrow="Justification bits"
      title="0001이 한 칸 밀려 0011이 되고, 그때 epoch 10이 finalized됩니다"
      description="칸 하나가 한 epoch의 justification 기록이며 오른쪽 끝이 bit 0입니다. 파란 칸은 1, 점선 칸은 이번 transition이 새로 판정하는 자리입니다. 아래 세 칸은 BeaconState의 checkpoint이고, 숫자는 본문의 설명용 입력입니다."
      ariaLabel="네 bit 기록을 옮기고 bit 0을 판정한 뒤 finalization pattern을 확인하는 여섯 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <Register scene={scene} />
            <div className="mt-3 grid grid-cols-3 gap-px bg-border p-px" aria-label="BeaconState checkpoint">
              {scene.panel.map(([label, value, detail]) => (
                <div key={label} className="min-w-0 bg-background p-2.5 sm:p-3">
                  <span className="block break-keep text-[10px] font-bold text-muted-foreground sm:text-[11px]">{label}</span>
                  <strong className={`mt-1 block break-keep text-xs sm:text-sm ${scene.written ? "text-primary" : ""}`}>{value}</strong>
                  <span className="mt-1 block break-keep text-[10px] leading-4 text-muted-foreground sm:text-[11px]">{detail}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
