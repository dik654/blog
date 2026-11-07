import SceneShell from "./SceneShell";

/**
 * 본문 대응: #register-file — 96 registers/thread는 warp당 3,072칸이다.
 * 전체를 한 번에 나누면 21, 구역(16,384칸)마다 내림하면 5×4=20, 256-thread block(8 warps)으로 묶으면 16.
 * 네 줄이 네 구역이고 칸 길이는 칸 수에 비례한다.
 */
const PER_WARP = 96 * 32;
const ZONE = 16384;
const ZONES = 4;
const PER_ZONE = Math.floor(ZONE / PER_WARP);
const LEFTOVER = ZONE - PER_ZONE * PER_WARP;
const NAIVE = Math.floor((ZONES * ZONE) / PER_WARP);
const CAPACITY = PER_ZONE * ZONES;
const BLOCK_WARPS = 8;
const BLOCKS = Math.floor(CAPACITY / BLOCK_WARPS);
const PLACED = BLOCKS * BLOCK_WARPS;

const LEFT = 48;
const BAR = 300;
const SCALE = BAR / ZONE;
const ROW_H = 24;
const ROW_GAP = 10;
const TOP = 6;
const rowY = (row: number) => TOP + row * (ROW_H + ROW_GAP);
const LEGEND_Y = rowY(ZONES) + 12;

const SCENES = [
  { label: "전체를 한 번에 나누면", summary: "65,536÷3,072=21.33 → 21", note: "칸을 이어 붙여 세면 warp 21개입니다. 하지만 6번과 11번(빨간 점선)은 구역 경계에 걸칩니다. 구역을 무시하고 나눈 이 21을 실제 배치 수로 쓰면 안 됩니다." },
  { label: "구역마다 내림하면", summary: `${PER_ZONE}개 × ${ZONES}구역 = ${CAPACITY}개`, note: `16,384÷3,072=5.33이라 구역마다 5개입니다. 각 구역 끝에 ${LEFTOVER.toLocaleString("en-US")}칸씩 남고 합치면 ${(LEFTOVER * ZONES).toLocaleString("en-US")}칸이지만, 식은 구역별로 내림하므로 이 나머지로 warp를 더 세지 않습니다.` },
  { label: "8 warps씩 묶으면", summary: `${BLOCKS} blocks · ${PLACED}/64 = 25%`, note: "256-thread block은 8 warps입니다. 20자리에서 두 묶음 A·B를 놓으면 4자리는 묶음이 못 들어가 비어 있습니다. A·B가 어느 구역의 칸을 쓰는지는 설명용입니다(가정)." },
] as const;

function Part({ row, from, to, stroke, fill, dashed, label }: { row: number; from: number; to: number; stroke: string; fill: string; dashed?: boolean; label?: string }) {
  const x = LEFT + from * SCALE;
  const width = (to - from) * SCALE;
  return (
    <g>
      <rect x={x} y={rowY(row)} width={width} height={ROW_H} fill={fill} stroke={stroke} strokeWidth={1} strokeDasharray={dashed ? "3 3" : undefined} />
      {label && <text x={x + width / 2} y={rowY(row) + 16} fontSize={11} textAnchor="middle" fill="#475569">{label}</text>}
    </g>
  );
}

function flowingWarps() {
  return Array.from({ length: NAIVE }, (_, warp) => {
    const start = warp * PER_WARP;
    const end = start + PER_WARP;
    const startRow = Math.floor(start / ZONE);
    const endRow = Math.floor((end - 1) / ZONE);
    const straddles = startRow !== endRow;
    const color = straddles ? "#dc2626" : "#2563eb";
    const fill = straddles ? "#fee2e2" : "#dbeafe";
    if (!straddles) {
      return <Part key={warp} row={startRow} from={start - startRow * ZONE} to={end - startRow * ZONE} stroke={color} fill={fill} label={String(warp + 1)} />;
    }
    const firstLen = (startRow + 1) * ZONE - start;
    const secondLen = end - endRow * ZONE;
    return (
      <g key={warp}>
        <Part row={startRow} from={ZONE - firstLen} to={ZONE} stroke={color} fill={fill} dashed />
        <Part row={endRow} from={0} to={secondLen} stroke={color} fill={fill} dashed label={String(warp + 1)} />
      </g>
    );
  });
}

function zoneWarps(block: boolean) {
  return Array.from({ length: CAPACITY }, (_, warp) => {
    const row = Math.floor(warp / PER_ZONE);
    const slot = warp % PER_ZONE;
    const blockIndex = slot < PLACED / ZONES ? Math.floor((row * (PLACED / ZONES)) / BLOCK_WARPS) : null;
    const stroke = !block ? "#2563eb" : blockIndex === 0 ? "#2563eb" : blockIndex === 1 ? "#d97706" : "#94a3b8";
    const fill = !block ? "#dbeafe" : blockIndex === 0 ? "#dbeafe" : blockIndex === 1 ? "#fef3c7" : "none";
    const label = !block ? String(warp + 1) : blockIndex === 0 ? "A" : blockIndex === 1 ? "B" : "빔";
    return <Part key={warp} row={row} from={slot * PER_WARP} to={(slot + 1) * PER_WARP} stroke={stroke} fill={fill} dashed={block && blockIndex === null} label={label} />;
  });
}

export default function ZoneRemainderViz() {
  return (
    <SceneShell
      eyebrow="96 registers/thread"
      title="21이라는 계산이 20을 거쳐 16 warps로 줄어듭니다"
      description="네 줄이 안쪽의 네 구역(각 16,384칸)이고, 네모 하나가 warp 하나의 예약량 3,072칸입니다. 길이는 칸 수에 비례합니다."
      note="CC 7.0의 네 구역·256칸 배정 단위를 쓰는 설명 모형입니다. 다른 자원 한도는 따로 계산합니다."
      ariaLabel="96 registers per thread에서 21, 20, 16 warps로 줄어드는 계산"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 360 ${LEGEND_Y + 6}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {Array.from({ length: ZONES }, (_, row) => (
            <g key={row}>
              <text x={LEFT - 8} y={rowY(row) + 16} fontSize={11} textAnchor="end" fill="#64748b">구역 {row + 1}</text>
              <rect x={LEFT} y={rowY(row)} width={BAR} height={ROW_H} fill="none" stroke="#94a3b8" strokeWidth={1} />
            </g>
          ))}
          {active === 0 ? flowingWarps() : zoneWarps(active === 2)}
          <text x={LEFT} y={LEGEND_Y} fontSize={11} fill="#64748b">
            {active === 0 ? "줄 끝에서 다음 줄로 이어 셈 · 빨간 점선 = 경계에 걸침" : active === 1 ? `줄 끝 빈칸 = 구역마다 ${LEFTOVER.toLocaleString("en-US")}칸 남음` : "A·B = block 두 개 · 빔 = 묶음이 못 들어간 자리"}
          </text>
        </svg>
      )}
    />
  );
}
