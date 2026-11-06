import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-copy — swap_scratch.c 한 구간: 보조→scratch, 주→보조, scratch→주. 각 단계 뒤 boot_write_status.
 * 복사는 원본을 지우지 않으므로 다음 쓰기 전까지 사본이 함께 남는다. 코드 순서를 그린 것이며 전원 차단 실험 결과가 아니다.
 */
type Content = "v1" | "v2" | "불완전" | "";

const SCENES: readonly { label: string; summary: string; note: string; primary: Content; secondary: Content; scratch: Content; records: number; move: "toScratch" | "toSecondary" | "toPrimary" | null }[] = [
  { label: "처음", summary: "주=v1 · 보조=v2", primary: "v1", secondary: "v2", scratch: "", records: 0, move: null, note: "교체할 한 조각을 봅니다. 두 조각 모두 아직 제자리에 있습니다." },
  { label: "1. 새 조각 보관", summary: "보조 → scratch", primary: "v1", secondary: "v2", scratch: "v2", records: 1, move: "toScratch", note: "v2 조각을 scratch에 복사합니다. 이제 보조 자리를 지워도 새 조각이 남습니다. 복사 뒤 진행을 기록합니다." },
  { label: "2. 옛 조각 보존", summary: "주 → 보조", primary: "v1", secondary: "v1", scratch: "v2", records: 2, move: "toSecondary", note: "v1 조각을 보조 슬롯으로 복사합니다. 주 자리를 지우기 전에 돌아갈 조각을 남깁니다. 다시 진행을 기록합니다." },
  { label: "3. 새 조각 배치", summary: "scratch → 주", primary: "v2", secondary: "v1", scratch: "v2", records: 3, move: "toPrimary", note: "scratch의 v2 조각을 주 슬롯에 씁니다. 진행을 기록하고 다음 조각으로 넘어갑니다." },
  { label: "3번 쓰는 중 전원 차단", summary: "기록을 읽어 3번을 이어감", primary: "불완전", secondary: "v1", scratch: "v2", records: 2, move: "toPrimary", note: "RAM 변수는 사라져도 진행 기록은 남아 조각 번호와 단계를 복원합니다. 트레일러가 겹치는 마지막 구간과 기록 손상에는 별도 분기가 있고, 실제 전원 차단 시험은 따로 해야 합니다." },
];

const BOX_W = 96;
const BOX_H = 58;
const PRIMARY_X = 16;
const SECONDARY_X = 248;
const TOP_Y = 26;
const SCRATCH_X = 132;
const SCRATCH_Y = 112;
const GRAY = "#64748b";
const V1 = "#64748b";
const V2 = "#2563eb";
const RED = "#dc2626";
const AMBER = "#d97706";

function Box({ x, y, name, content }: { x: number; y: number; name: string; content: Content }) {
  const fill = content === "v1" ? V1 : content === "v2" ? V2 : "none";
  const broken = content === "불완전";
  const textFill = content === "v1" || content === "v2" ? "#ffffff" : broken ? RED : GRAY;
  return (
    <g>
      <text x={x + BOX_W / 2} y={y - 7} textAnchor="middle" fontSize={12} fontWeight={700} fill={GRAY}>{name}</text>
      <rect x={x} y={y} width={BOX_W} height={BOX_H} rx={6} fill={fill} stroke={broken ? RED : content ? fill : "#94a3b8"} strokeWidth={1} strokeDasharray={content === "" || broken ? "3 3" : undefined} />
      <text x={x + BOX_W / 2} y={y + 35} textAnchor="middle" fontSize={broken ? 13 : 16} fontWeight={700} fill={textFill}>{content || "비어 있음"}</text>
    </g>
  );
}

const ARROWS = {
  toScratch: { x1: SECONDARY_X + BOX_W / 2, y1: TOP_Y + BOX_H + 3, x2: SCRATCH_X + BOX_W + 3, y2: SCRATCH_Y + BOX_H / 2 },
  toSecondary: { x1: PRIMARY_X + BOX_W + 3, y1: TOP_Y + BOX_H / 2, x2: SECONDARY_X - 3, y2: TOP_Y + BOX_H / 2 },
  toPrimary: { x1: SCRATCH_X - 3, y1: SCRATCH_Y + BOX_H / 2, x2: PRIMARY_X + BOX_W / 2, y2: TOP_Y + BOX_H + 3 },
} as const;

export default function ChunkSwapViz() {
  return (
    <SceneShell
      eyebrow="조각 하나의 교체"
      title="세 번 복사하는 동안 이 조각의 v1과 v2는 어딘가에 남습니다"
      description="칸은 저장 위치, 글자는 그 안의 조각입니다. 아래 네모 세 개는 지금까지 남긴 진행 기록입니다. scratch는 조각을 잠깐 보관하는 별도 공간입니다."
      ariaLabel="보조 슬롯에서 scratch로, 주 슬롯에서 보조 슬롯으로, scratch에서 주 슬롯으로 조각을 복사하고 진행을 기록하는 순서"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const arrow = scene.move ? ARROWS[scene.move] : null;
        const angle = arrow ? Math.atan2(arrow.y2 - arrow.y1, arrow.x2 - arrow.x1) : 0;
        const head = (offset: number) => (arrow ? `${arrow.x2 - 8 * Math.cos(angle + offset)} ${arrow.y2 - 8 * Math.sin(angle + offset)}` : "");
        return (
          <svg viewBox="0 0 360 206" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <Box x={PRIMARY_X} y={TOP_Y} name="주 슬롯" content={scene.primary} />
            <Box x={SECONDARY_X} y={TOP_Y} name="보조 슬롯" content={scene.secondary} />
            <Box x={SCRATCH_X} y={SCRATCH_Y} name="scratch" content={scene.scratch} />
            {arrow && (
              <g>
                <line x1={arrow.x1} y1={arrow.y1} x2={arrow.x2} y2={arrow.y2} stroke={AMBER} strokeWidth={1.25} />
                <path d={`M${head(0.45)} L${arrow.x2} ${arrow.y2} L${head(-0.45)}`} fill="none" stroke={AMBER} strokeWidth={1.25} />
              </g>
            )}
            <text x={16} y={196} fontSize={12} fontWeight={700} fill={GRAY}>진행 기록</text>
            {[0, 1, 2].map((slot) => (
              <rect key={slot} x={78 + slot * 22} y={184} width={16} height={16} rx={2} fill={slot < scene.records ? AMBER : "none"} stroke={slot < scene.records ? AMBER : "#94a3b8"} strokeWidth={1} />
            ))}
            <text x={152} y={196} fontSize={12} fill={GRAY}>{scene.records}단계까지 기록됨</text>
          </svg>
        );
      }}
    />
  );
}
