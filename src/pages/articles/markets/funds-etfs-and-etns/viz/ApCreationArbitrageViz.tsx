import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #mechanism — AP가 바스켓을 사서 새 좌수로 바꿔 파는 경로.
 * 금액은 본문의 설명용 가정입니다. 남는 돈 = 1만100 − 1만 − 비용, 비용 130원이면 −30원입니다.
 */
const SCENES = [
  { label: "같은 한 좌, 두 숫자", summary: "차이 100원", note: "펀드 장부의 한 좌는 NAV 1만 원이고 거래 화면에서는 1만100원에 체결됩니다. 이 100원이 괴리입니다.", ledger: ["", "", "", ""] },
  { label: "바스켓 조달", summary: "현금 → 바스켓", note: "AP가 기초시장에서 한 좌분 자산 바스켓을 1만 원에 삽니다.", ledger: ["−1만", "", "", ""] },
  { label: "설정", summary: "바스켓 → 새 좌수", note: "바스켓을 펀드에 넣고 새 ETF 한 좌를 받습니다. 이 교환이 설정입니다.", ledger: ["−1만", "", "", ""] },
  { label: "거래 화면에서 매도", summary: "좌당 +40원", note: "1만100원에 팝니다. 설정·매도 비용 60원을 빼도 40원이 남아 새 ETF 매도가 늘고 괴리를 줄이는 힘이 생깁니다.", ledger: ["−1만", "−60", "+1만100", "+40"] },
  { label: "비용이 130원이면", summary: "좌당 −30원", note: "경로는 같아도 100원의 차이로 비용 130원을 메우지 못합니다. 이 거래는 성립하지 않습니다.", ledger: ["−1만", "−130", "+1만100", "−30"] },
  { label: "기초시장이 휴장이면", summary: "경로 끊김", note: "바스켓을 살 수 없어 첫 단계에서 멈춥니다. AP가 있어도 언제나 NAV에 팔 수 있다는 보증은 아닙니다.", ledger: ["불가", "", "", ""] },
] as const;

const LEDGER_NAMES = ["바스켓", "비용", "매도", "남는 돈"];

const ACCENT = "#2563eb";
const DONE = "#94a3b8";
const WARN = "#dc2626";

type NodeBox = { x: number; y: number; w: number; h: number; name: string; sub: string };
const MARKET: NodeBox = { x: 4, y: 8, w: 104, h: 50, name: "기초시장", sub: "바스켓 1만 원" };
const FUND: NodeBox = { x: 232, y: 8, w: 104, h: 50, name: "펀드", sub: "NAV 1만 원" };
const AP: NodeBox = { x: 120, y: 92, w: 100, h: 46, name: "AP", sub: "지정참가자" };
const SCREEN: NodeBox = { x: 106, y: 170, w: 128, h: 50, name: "거래 화면", sub: "체결 1만100원" };

function Node({ box, tone, dashed = false }: { box: NodeBox; tone: string; dashed?: boolean }) {
  return (
    <g>
      <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={8} fill="none" stroke={tone} strokeWidth={1} strokeDasharray={dashed ? "4 3" : undefined} />
      <text x={box.x + box.w / 2} y={box.y + 20} textAnchor="middle" fontSize={13} fontWeight={700} fill="currentColor">{box.name}</text>
      <text x={box.x + box.w / 2} y={box.y + 38} textAnchor="middle" fontSize={12} fill="#64748b">{box.sub}</text>
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, tone, label, lx, ly, anchor, broken = false }: { x1: number; y1: number; x2: number; y2: number; tone: string; label: string; lx: number; ly: number; anchor: "start" | "end"; broken?: boolean }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const size = 7;
  const a = `${x2 - size * Math.cos(angle - 0.45)},${y2 - size * Math.sin(angle - 0.45)}`;
  const b = `${x2 - size * Math.cos(angle + 0.45)},${y2 - size * Math.sin(angle + 0.45)}`;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={tone} strokeWidth={1} strokeDasharray={broken ? "3 3" : undefined} />
      <polygon points={`${x2},${y2} ${a} ${b}`} fill={tone} />
      <text x={lx} y={ly} textAnchor={anchor} fontSize={12} fontWeight={tone === DONE ? 400 : 700} fill={tone === DONE ? "#64748b" : tone}>{label}</text>
    </g>
  );
}

export default function ApCreationArbitrageViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const active = scenes.active;
  const closed = active === 5;
  const tone = (step: number) => {
    if (active === 4) return step === 3 ? WARN : DONE;
    if (closed) return step === 1 ? WARN : DONE;
    return active === step ? ACCENT : DONE;
  };
  const showStep = (step: number) => (closed ? step === 1 : active >= step);

  return (
    <VizFrame
      eyebrow="설정과 차익거래"
      title="AP가 100원의 괴리를 줄이는 경로를 따라갑니다"
      description="AP는 펀드와 직접 설정·환매를 하는 계약 상대입니다. 금액은 한 좌 기준 설명용 가정입니다."
      note="이 경로는 미국식 설명입니다. 한국 상장 상품의 괴리 규정은 아래 본문에서 따로 봅니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="AP가 바스켓을 사서 새 ETF 좌수로 바꿔 파는 과정과 거래가 성립하지 않는 두 조건"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{scene.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{scene.summary}</span>
            </div>
          ))}
        />
        <svg viewBox="0 0 340 222" className="mx-auto mt-2 h-auto w-full max-w-[400px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <Node box={MARKET} tone={closed ? WARN : "#94a3b8"} dashed={closed} />
          <Node box={FUND} tone={active === 0 ? ACCENT : "#94a3b8"} />
          <Node box={AP} tone="#94a3b8" />
          <Node box={SCREEN} tone={active === 0 ? ACCENT : "#94a3b8"} />
          {active === 0 && (
            <g>
              <line x1={284} y1={58} x2={234} y2={186} stroke={ACCENT} strokeWidth={1} strokeDasharray="4 3" />
              <text x={268} y={130} fontSize={13} fontWeight={700} fill={ACCENT}>차이 100원</text>
            </g>
          )}
          {closed && (
            <text x={170} y={38} textAnchor="middle" fontSize={13} fontWeight={700} fill={WARN}>휴장: 못 삼</text>
          )}
          {active === 4 && (
            <text x={170} y={38} textAnchor="middle" fontSize={13} fontWeight={700} fill={WARN}>비용 130 &gt; 100</text>
          )}
          {showStep(1) && (
            <g>
              <Arrow x1={128} y1={92} x2={62} y2={58} tone={tone(1)} label="현금 1만 원" lx={84} ly={84} anchor="end" broken={closed} />
              <Arrow x1={86} y1={58} x2={150} y2={92} tone={tone(1)} label="바스켓" lx={126} ly={68} anchor="start" broken={closed} />
            </g>
          )}
          {showStep(2) && (
            <g>
              <Arrow x1={190} y1={92} x2={254} y2={58} tone={tone(2)} label="바스켓" lx={214} ly={68} anchor="end" />
              <Arrow x1={278} y1={58} x2={212} y2={92} tone={tone(2)} label="새 ETF 1좌" lx={256} ly={84} anchor="start" />
            </g>
          )}
          {showStep(3) && (
            <g>
              <Arrow x1={152} y1={138} x2={152} y2={170} tone={tone(3)} label="새 ETF 1좌" lx={146} ly={158} anchor="end" />
              <Arrow x1={188} y1={170} x2={188} y2={138} tone={tone(3)} label="1만100원" lx={194} ly={158} anchor="start" />
            </g>
          )}
        </svg>
        <StableSceneStack
          active={active}
          className="mt-2"
          scenes={SCENES.map((scene) => (
            <dl key={scene.label} className="grid grid-cols-4 gap-1.5 text-center">
              {LEDGER_NAMES.map((name, index) => (
                <div key={name} className="rounded-lg border border-border/70 px-0.5 py-1">
                  <dt className="text-xs text-muted-foreground">{name}</dt>
                  <dd className={`min-h-5 whitespace-nowrap font-mono text-[13px] font-bold ${scene.ledger[index].startsWith("+4") ? "text-primary" : ""} ${scene.ledger[index] === "−30" || scene.ledger[index] === "불가" ? "text-red-600 dark:text-red-400" : ""}`}>
                    {scene.ledger[index] || "·"}
                  </dd>
                </div>
              ))}
            </dl>
          ))}
        />
        <StableSceneStack
          active={active}
          className="mt-2"
          scenes={SCENES.map((scene) => (
            <p key={scene.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {scene.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={SCENES.map((scene) => scene.label)} />
        <StaticSceneList labels={SCENES.map((scene) => scene.label)} notes={SCENES.map((scene) => scene.note)} />
      </div>
    </VizFrame>
  );
}
