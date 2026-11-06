import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 수입 80 − 비용(40+30+10) 80 = 순운영수지 0, 0 − 도로 20 = 순융자·순차입 −20,
 * 새 채무 20으로 조달 → 현금 맞음·부채 200→220. 현금 지출 100을 전부 비용으로 쓰면 −20(다른 지표).
 * 발생과 지급이 그해에 일치하고 감가상각·자산 매각을 생략한 가정.
 */
const SCENES = [
  { label: "수입에서 비용을 뺍니다", summary: "80 − 80 = 순운영수지 0", note: "수입은 세금 80뿐입니다. 차입 20은 수입이 아니고 도로 20은 이 비용에 넣지 않습니다. 의료 40·교육 30·이자 10이 비용 80입니다." },
  { label: "도로 취득을 뺍니다", summary: "0 − 20 = 순융자·순차입 −20", note: "도로의 비금융자산 순취득 20을 빼면 −20입니다. 음수인 만큼 자금을 조달해야 하고, 이 사례에서는 새 채무로 메웁니다." },
  { label: "새 채무로 메웁니다", summary: "−20 + 20 → 현금이 맞습니다", note: "새 채무 20으로 조달해 현금은 맞고, 부채는 200에서 220으로 늘어납니다." },
  { label: "전부 비용이라고 쓰면", summary: "80 − 100 = −20 · 다른 지표", note: "현금 지출 100을 전부 비용이라고 쓰면 순운영수지가 −20이 됩니다. 숫자가 앞 장면의 순차입과 같아 보여도 이것은 이 사례의 순운영수지 0과 다른 지표입니다." },
] as const;

const UNIT = 1.25;
const ZERO_Y = 132;
const COL_W = 42;
const PITCH = 56;
const LEFT = 18;
const yOf = (value: number) => ZERO_Y - value * UNIT;
const colX = (col: number) => LEFT + col * PITCH;
const BLUE = "#2563eb";
const GRAY = "#64748b";
const GREEN = "#16a34a";
const AMBER = "#d97706";
const RED = "#dc2626";

function Span({ col, from, to, fill, label }: { col: number; from: number; to: number; fill: string; label?: string }) {
  const top = yOf(Math.max(from, to));
  const height = Math.abs(from - to) * UNIT;
  return (
    <g>
      <rect x={colX(col)} y={top} width={COL_W} height={height} fill={fill} rx={1.5} />
      {label && (
        <text x={colX(col) + COL_W / 2} y={top + height / 2 + 3.5} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ffffff">{label}</text>
      )}
    </g>
  );
}

function Name({ col, lines }: { col: number; lines: readonly string[] }) {
  return (
    <text x={colX(col) + COL_W / 2} y={186} textAnchor="middle" fontSize={10.5} fill={GRAY}>
      {lines.map((line, index) => (
        <tspan key={line} x={colX(col) + COL_W / 2} dy={index === 0 ? 0 : 13}>{line}</tspan>
      ))}
    </text>
  );
}

function Marker({ col, value, color, text }: { col: number; value: number; color: string; text: string }) {
  return (
    <g>
      <line x1={colX(col)} x2={colX(col) + COL_W} y1={yOf(value)} y2={yOf(value)} stroke={color} strokeWidth={1.25} />
      <text x={colX(col) + COL_W / 2} y={value < 0 ? yOf(value) + 13 : yOf(value) - 6} textAnchor="middle" fontSize={12} fontWeight={700} fill={color}>{text}</text>
    </g>
  );
}

export default function BalanceWaterfallViz() {
  return (
    <SceneShell
      eyebrow="같은 예산의 분류 (가정)"
      title="차입과 도로를 빼고 계산하면 0과 −20이 함께 나옵니다"
      description="세로 눈금은 모든 막대가 같습니다. 가로선이 0이고 아래로 내려가면 음수입니다. 발생과 지급이 그해에 일치하고 감가상각과 자산 매각을 생략한 가정입니다."
      ariaLabel="수입과 비용에서 순운영수지, 도로를 뺀 순융자 순차입, 새 채무 조달로 이어지는 계단 그림"
      scenes={SCENES}
      render={(active) => {
        const wrong = active === 3;
        return (
          <svg viewBox="0 0 360 214" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={6} x2={354} y1={ZERO_Y} y2={ZERO_Y} stroke="#94a3b8" strokeWidth={1} />
            <text x={6} y={ZERO_Y - 4} fontSize={10} fill={GRAY}>0</text>

            <Span col={0} from={0} to={80} fill={BLUE} label="80" />
            <Name col={0} lines={["수입", "세금"]} />

            {wrong ? (
              <>
                <Span col={1} from={80} to={0} fill={GRAY} label="80" />
                <rect x={colX(1)} y={ZERO_Y} width={COL_W} height={20 * UNIT} fill="none" stroke={RED} strokeWidth={1.25} strokeDasharray="3 3" />
                <text x={colX(1) + COL_W / 2} y={ZERO_Y + 16} textAnchor="middle" fontSize={10} fontWeight={700} fill={RED}>도로 20</text>
                <Name col={1} lines={["현금 지출", "100"]} />
                <Marker col={2} value={-20} color={RED} text="−20" />
                <Name col={2} lines={["다른", "지표"]} />
                <text x={colX(3)} y={70} fontSize={11.5} fontWeight={700} fill={RED}>도로를 비용에 넣으면</text>
                <text x={colX(3)} y={88} fontSize={11.5} fill={GRAY}>이 사례의 순운영수지 0과</text>
                <text x={colX(3)} y={104} fontSize={11.5} fill={GRAY}>달라집니다</text>
              </>
            ) : (
              <>
                <Span col={1} from={80} to={40} fill={GRAY} label="의료40" />
                <Span col={1} from={40} to={10} fill="#7c8aa0" label="교육30" />
                <Span col={1} from={10} to={0} fill={GRAY} label="이자10" />
                <Name col={1} lines={["비용", "80"]} />
                <Marker col={2} value={0} color={BLUE} text="0" />
                <Name col={2} lines={["순운영", "수지"]} />
                {active >= 1 && (
                  <>
                    <Span col={3} from={0} to={-20} fill={GREEN} label="20" />
                    <Name col={3} lines={["도로", "취득"]} />
                    <Marker col={4} value={-20} color={AMBER} text="−20" />
                    <Name col={4} lines={["순융자", "순차입"]} />
                  </>
                )}
                {active >= 2 && (
                  <>
                    <Span col={5} from={-20} to={0} fill={AMBER} label="+20" />
                    <Name col={5} lines={["새 채무", "조달"]} />
                    <text x={colX(3)} y={70} fontSize={12} fontWeight={700} fill={AMBER}>부채 200 → 220</text>
                  </>
                )}
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
