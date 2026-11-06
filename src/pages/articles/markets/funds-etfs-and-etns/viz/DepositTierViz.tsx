import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 시행세칙 제111조의3의 기본예탁금 단계.
 * 1단계 1천만 미만(면제 포함), 2단계 1천만, 3단계 1천만 초과 3천만 이하, 단일종목 3천만 이상(현금만).
 * 첫 계좌는 2단계나 3단계이므로 최소 1천만 원입니다.
 */
const SCENES = [
  { label: "세 단계", summary: "1천만 미만 · 1천만 · 3천만 이하", note: "속이 빈 점은 그 금액을 포함하지 않고 찬 점은 포함합니다. 1단계에는 면제도 들어갑니다." },
  { label: "처음 여는 계좌", summary: "1단계 제외 → 최소 1천만 원", note: "개인이 이 상품의 거래 계좌를 처음 열 때는 2단계나 3단계를 적용합니다. 그래서 첫 계좌는 최소 1천만 원입니다." },
  { label: "단일종목 레버리지", summary: "3천만 원 이상 · 현금만", note: "2026년에 허용된 단일종목 레버리지 ETF·ETN은 3천만 원 이상을 현금으로만 받습니다." },
] as const;

const ACCENT = "#2563eb";
const GRAY = "#64748b";
const MUTED = "#94a3b8";
const RED = "#dc2626";
const X = (tenMillions: number) => 72 + (tenMillions / 3) * 210;
const AXIS_END = 332;
const ROWS = [32, 66, 100, 134];

function Dot({ x, y, tone, open = false }: { x: number; y: number; tone: string; open?: boolean }) {
  return <circle cx={x} cy={y} r={4} className={open ? "fill-background" : undefined} fill={open ? undefined : tone} stroke={tone} strokeWidth={1.25} />;
}

export default function DepositTierViz() {
  return (
    <SceneShell
      eyebrow="기본예탁금의 문턱"
      title="레버리지 상품을 사기 전에 맡길 금액을 축 위에 놓습니다"
      description="기본예탁금은 증권사가 매매 주문을 받기 전에 계좌에 맡겨 두도록 요구하는 최소 금액입니다. 가로축이 금액입니다."
      note="한국거래소 유가증권시장 업무규정 시행세칙 기준이며 2026-10-09 현재 조문입니다. 개인이 매수할 때의 요건입니다."
      ariaLabel="기본예탁금 단계별 금액 구간과 첫 계좌, 단일종목 상품의 하한"
      scenes={SCENES}
      render={(active) => {
        const first = active === 1;
        const single = active === 2;
        const tierTone = (name: string) => (first ? (name === "1" ? MUTED : ACCENT) : single ? MUTED : ACCENT);
        return (
          <svg viewBox="0 0 340 186" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {[0, 1, 3].map((value) => (
              <line key={value} x1={X(value)} x2={X(value)} y1={20} y2={158} stroke={MUTED} strokeWidth={0.5} strokeDasharray="2 3" />
            ))}
            <text x={0} y={ROWS[0] + 4} fontSize={12} fontWeight={700} fill={first ? MUTED : "currentColor"}>1단계</text>
            <line x1={X(0)} x2={X(1)} y1={ROWS[0]} y2={ROWS[0]} stroke={tierTone("1")} strokeWidth={1.25} strokeDasharray={first ? "3 3" : undefined} />
            <Dot x={X(0)} y={ROWS[0]} tone={tierTone("1")} />
            <Dot x={X(1)} y={ROWS[0]} tone={tierTone("1")} open />
            <text x={X(0) + 4} y={ROWS[0] - 9} fontSize={11} fill={GRAY}>면제 포함</text>
            {first && <text x={X(1) + 10} y={ROWS[0] + 4} fontSize={12} fontWeight={700} fill={RED}>첫 계좌에는 적용 불가</text>}

            <text x={0} y={ROWS[1] + 4} fontSize={12} fontWeight={700} fill="currentColor">2단계</text>
            <Dot x={X(1)} y={ROWS[1]} tone={tierTone("2")} />
            {first && <text x={X(1) + 10} y={ROWS[1] + 4} fontSize={12} fontWeight={700} fill={ACCENT}>첫 계좌의 최소 금액</text>}

            <text x={0} y={ROWS[2] + 4} fontSize={12} fontWeight={700} fill="currentColor">3단계</text>
            <line x1={X(1)} x2={X(3)} y1={ROWS[2]} y2={ROWS[2]} stroke={tierTone("3")} strokeWidth={1.25} />
            <Dot x={X(1)} y={ROWS[2]} tone={tierTone("3")} open />
            <Dot x={X(3)} y={ROWS[2]} tone={tierTone("3")} />

            <text x={0} y={ROWS[3] + 4} fontSize={12} fontWeight={700} fill={single ? RED : MUTED}>단일종목</text>
            <line x1={X(3)} x2={AXIS_END} y1={ROWS[3]} y2={ROWS[3]} stroke={single ? RED : MUTED} strokeWidth={1.25} />
            <polygon points={`${AXIS_END + 6},${ROWS[3]} ${AXIS_END - 2},${ROWS[3] - 4} ${AXIS_END - 2},${ROWS[3] + 4}`} fill={single ? RED : MUTED} />
            <Dot x={X(3)} y={ROWS[3]} tone={single ? RED : MUTED} />
            {single && <text x={X(3) - 8} y={ROWS[3] + 4} textAnchor="end" fontSize={12} fontWeight={700} fill={RED}>현금으로만</text>}

            <line x1={X(0)} x2={AXIS_END} y1={158} y2={158} stroke={GRAY} strokeWidth={1} />
            <text x={X(0)} y={176} textAnchor="middle" fontSize={11} fill={GRAY}>0</text>
            <text x={X(1)} y={176} textAnchor="middle" fontSize={11} fontWeight={700} fill={GRAY}>1천만</text>
            <text x={X(3)} y={176} textAnchor="middle" fontSize={11} fontWeight={700} fill={GRAY}>3천만</text>
          </svg>
        );
      }}
    />
  );
}
