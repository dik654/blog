import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #picture — 물건 인도, 공간 사용 약속, 영업 조건이 모여야 잔금 3천만 원이 나간다.
 * 3천만 원은 본문의 3천300만 − 300만이고, 실패 분기는 "실패 시 반환 조건"을 그린 것입니다.
 */
const W = 340;
const H = 262;

type Status = "wait" | "ok" | "fail";

const SOURCES = [
  { who: "기존 점주", what: "물건 인도", x: 6 },
  { who: "공간 소유자", what: "공간 사용 약속", x: 117 },
  { who: "허가 기관 등", what: "영업 조건", x: 228 },
] as const;
const BOX_W = 106;

const ACCENT = "#2563eb";
const DIM = "#94a3b8";
const TEXT = "#64748b";
const FAIL = "#dc2626";

const SCENES: readonly { label: string; summary: string; note: string; status: readonly [Status, Status, Status] }[] = [
  { label: "처음 합의", summary: "지급 300만 / 3,300만", note: "시설·재고·남은 약속의 목록과 실패 시 반환 조건을 정한 뒤 300만 원을 먼저 냅니다. 잔금은 아직 나가지 않습니다.", status: ["wait", "wait", "wait"] },
  { label: "물건만 왔을 때", summary: "조건 1 / 3", note: "시설과 재고가 모두 와도 공간을 계속 쓸 수 없거나 영업을 이어갈 조건이 없으면 대금을 전부 지급할 근거가 부족합니다.", status: ["ok", "wait", "wait"] },
  { label: "세 약속이 모임", summary: "잔금 3,000만 지급", note: "시설 상태, 장소 사용 계약, 필요한 영업 절차와 책임 분담을 확인합니다. 재고가 약정한 300만 원이면 3,300만 − 300만 = 3,000만 원을 지급합니다.", status: ["ok", "ok", "ok"] },
  { label: "약속 하나가 빠짐", summary: "잔금 없음, 300만 반환", note: "예로 공간 사용 약속이 갖춰지지 않았다고 둡니다. 잔금은 나가지 않고, 먼저 낸 300만 원은 처음 정한 조건에 따라 누가 언제 돌려줄지가 결정됩니다.", status: ["ok", "fail", "ok"] },
];

const GATE = { x: 110, y: 96, w: 120, h: 36 };
const LOW_Y = 172;
const LOW_H = 74;
const PARTY_W = 68;
const BALANCE_Y = 196;
const DEPOSIT_Y = 234;

function statusColor(status: Status) {
  if (status === "ok") return ACCENT;
  if (status === "fail") return FAIL;
  return DIM;
}

function ArrowRight({ x1, x2, y, color, dashed }: { x1: number; x2: number; y: number; color: string; dashed?: boolean }) {
  return (
    <g>
      <line x1={x1} x2={x2 - 6} y1={y} y2={y} stroke={color} strokeWidth={1.25} strokeDasharray={dashed ? "3 3" : undefined} />
      <path d={`M ${x2} ${y} L ${x2 - 7} ${y - 4} L ${x2 - 7} ${y + 4} Z`} fill={color} />
    </g>
  );
}

function ArrowLeft({ x1, x2, y, color }: { x1: number; x2: number; y: number; color: string }) {
  return (
    <g>
      <line x1={x1} x2={x2 + 6} y1={y} y2={y} stroke={color} strokeWidth={1.25} />
      <path d={`M ${x2} ${y} L ${x2 + 7} ${y - 4} L ${x2 + 7} ${y + 4} Z`} fill={color} />
    </g>
  );
}

export default function BalanceConditionsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const active = scenes.active;
  const scene = SCENES[active];
  const okCount = scene.status.filter((s) => s === "ok").length;
  const open = okCount === 3;
  const failed = scene.status.includes("fail");
  const gateColor = open ? ACCENT : failed ? FAIL : DIM;
  const midX = W / 2;

  return (
    <VizFrame
      eyebrow="잔금 조건"
      title="세 약속이 모여야 잔금 3천만 원이 나갑니다"
      description="위쪽 세 칸이 약속, 가운데가 잔금 조건, 아래가 두 점주 사이의 돈입니다. 잔금은 먼저 낸 돈을 뺀 나머지 대금이며, 금액과 지급 비율은 설명용 (가정)입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="세 가지 약속이 모일 때 잔금이 지급되고 하나가 빠지면 먼저 낸 돈을 돌려주는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={active}
          scenes={SCENES.map((item) => (
            <div key={item.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{item.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{item.summary}</span>
            </div>
          ))}
        />
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-3 h-auto w-full max-w-[500px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
          {SOURCES.map((source, index) => {
            const status = scene.status[index];
            const color = statusColor(status);
            const cx = source.x + BOX_W / 2;
            const gateX = GATE.x + 20 + index * 40;
            return (
              <g key={source.who}>
                <rect x={source.x} y={8} width={BOX_W} height={52} rx={8} fill="none" stroke={color} strokeWidth={status === "wait" ? 1 : 1.25} strokeDasharray={status === "wait" ? "3 3" : undefined} />
                <text x={cx} y={29} textAnchor="middle" fontSize={13} fontWeight={700} fill={status === "wait" ? TEXT : color}>{source.who}</text>
                <text x={cx} y={47} textAnchor="middle" fontSize={13} fill={status === "wait" ? TEXT : color}>
                  {status === "fail" ? "✕ " : status === "ok" ? "✓ " : ""}{source.what}
                </text>
                <line x1={cx} y1={60} x2={gateX} y2={GATE.y - 6} stroke={color} strokeWidth={status === "wait" ? 1 : 1.25} strokeDasharray={status === "ok" ? undefined : "3 3"} />
                <path d={`M ${gateX} ${GATE.y} L ${gateX - 4} ${GATE.y - 7} L ${gateX + 4} ${GATE.y - 7} Z`} fill={color} />
              </g>
            );
          })}

          {/* 잔금 조건 */}
          <rect x={GATE.x} y={GATE.y} width={GATE.w} height={GATE.h} rx={4} fill="none" stroke={gateColor} strokeWidth={1.25} />
          <text x={midX} y={GATE.y + 23} textAnchor="middle" fontSize={13} fontWeight={700} fill={open ? ACCENT : failed ? FAIL : TEXT}>
            잔금 조건 {okCount} / 3
          </text>
          <line x1={midX} y1={GATE.y + GATE.h} x2={midX} y2={LOW_Y} stroke={gateColor} strokeWidth={open ? 1.25 : 1} strokeDasharray={open ? undefined : "3 3"} />

          {/* 두 점주 */}
          <rect x={6} y={LOW_Y} width={PARTY_W} height={LOW_H} rx={8} fill="none" stroke={TEXT} strokeWidth={1} />
          <text x={6 + PARTY_W / 2} y={LOW_Y + 41} textAnchor="middle" fontSize={13} fontWeight={700} fill={TEXT}>새 점주</text>
          <rect x={W - 6 - PARTY_W} y={LOW_Y} width={PARTY_W} height={LOW_H} rx={8} fill="none" stroke={TEXT} strokeWidth={1} />
          <text x={W - 6 - PARTY_W / 2} y={LOW_Y + 41} textAnchor="middle" fontSize={13} fontWeight={700} fill={TEXT}>기존 점주</text>

          {/* 잔금 */}
          <text x={midX} y={BALANCE_Y - 7} textAnchor="middle" fontSize={13} fontWeight={700} fill={open ? ACCENT : TEXT}>잔금 3,000만</text>
          <ArrowRight x1={6 + PARTY_W} x2={W - 6 - PARTY_W} y={BALANCE_Y} color={open ? ACCENT : DIM} dashed={!open} />

          {/* 먼저 낸 300만 */}
          <text x={midX} y={DEPOSIT_Y - 7} textAnchor="middle" fontSize={13} fontWeight={700} fill={failed ? FAIL : ACCENT}>
            {failed ? "조건대로 300만 반환" : "먼저 300만"}
          </text>
          {failed ? (
            <ArrowLeft x1={W - 6 - PARTY_W} x2={6 + PARTY_W} y={DEPOSIT_Y} color={FAIL} />
          ) : (
            <ArrowRight x1={6 + PARTY_W} x2={W - 6 - PARTY_W} y={DEPOSIT_Y} color={ACCENT} />
          )}
        </svg>
        <StableSceneStack
          active={active}
          className="mt-2"
          scenes={SCENES.map((item) => (
            <p key={item.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {item.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={SCENES.map((item) => item.label)} />
        <StaticSceneList labels={SCENES.map((item) => item.label)} notes={SCENES.map((item) => item.note)} />
      </div>
    </VizFrame>
  );
}
