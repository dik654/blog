import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 같은 상관에 맞는 두 화살표 모형이 개입 앞에서 다른 예측을 낸다.
 * 모형 1: 판매 → 사고. 모형 2: 비 → 판매, 비 → 시야·노면 → 사고.
 */
const ACCENT = "#2563eb";
const RED = "#dc2626";
const AMBER = "#d97706";
const IDLE = "#94a3b8";

type Box = { x: number; y: number; w: number; label: string };

const SALE1: Box = { x: 70, y: 66, w: 72, label: "우산 판매" };
const CRASH1: Box = { x: 250, y: 66, w: 60, label: "사고" };
const RAIN: Box = { x: 34, y: 66, w: 44, label: "비" };
const SALE2: Box = { x: 148, y: 24, w: 72, label: "우산 판매" };
const ROAD: Box = { x: 148, y: 108, w: 72, label: "시야·노면" };
const CRASH2: Box = { x: 278, y: 108, w: 60, label: "사고" };
const BOX_H = 28;

function Node({ box, color, crossed = false }: { box: Box; color: string; crossed?: boolean }) {
  const left = box.x - box.w / 2;
  const top = box.y - BOX_H / 2;
  return (
    <g>
      <rect x={left} y={top} width={box.w} height={BOX_H} rx={6} fill="none" stroke={color} strokeWidth={1} strokeDasharray={crossed ? "4 3" : undefined} />
      <text x={box.x} y={box.y + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={color}>{box.label}</text>
    </g>
  );
}

function Edge({ x1, y1, x2, y2, color, dashed = false, head = true }: { x1: number; y1: number; x2: number; y2: number; color: string; dashed?: boolean; head?: boolean }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const size = 7;
  const a = `${x2 - size * Math.cos(angle - 0.45)},${y2 - size * Math.sin(angle - 0.45)}`;
  const b = `${x2 - size * Math.cos(angle + 0.45)},${y2 - size * Math.sin(angle + 0.45)}`;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} strokeDasharray={dashed ? "4 3" : undefined} />
      {head && <polygon points={`${x2},${y2} ${a} ${b}`} fill={color} />}
    </g>
  );
}

function Cross({ x, y, color }: { x: number; y: number; color: string }) {
  return <path d={`M${x - 6} ${y - 6} L${x + 6} ${y + 6} M${x + 6} ${y - 6} L${x - 6} ${y + 6}`} stroke={color} strokeWidth={1.25} fill="none" />;
}

const SCENES = [
  { label: "모형 1", summary: "우산 판매 → 사고", note: "첫 모형은 판매가 곧바로 사고로 이어진다고 그립니다. 판매가 많은 날 사고가 많다는 기록과 맞을 수 있습니다.", one: "관측된 상관과 맞을 수 있음", two: "다음 장면에서 봅니다" },
  { label: "모형 2", summary: "비가 두 값의 공통 원인", note: "둘째 모형에는 판매에서 사고로 가는 화살표가 없습니다. 비가 양쪽을 함께 움직인다면 판매와 사고는 원인 관계 없이도 상관을 보일 수 있습니다.", one: "관측된 상관과 맞을 수 있음", two: "역시 관측된 상관과 맞을 수 있음" },
  { label: "개입: 우산 가게를 닫으면", summary: "두 모형의 예측이 갈림", note: "모형 2에서는 비 오는 날 우산 가게를 닫아도 사고 원인에 거의 손대지 못합니다. 같은 자료에 맞는 두 모형이 이 질문에서 갈라집니다.", one: "화살표를 끊었으니 사고가 줄어든다고 예측", two: "비 → 시야·노면 → 사고 경로가 그대로 남음" },
  { label: "개입: 배수·조명·제한 속도", summary: "원인 후보 경로를 건드림", note: "배수, 조명, 제한 속도를 바꾸는 개입은 모형 2의 원인 후보 경로를 직접 건드립니다. 화살표의 방향은 숫자 표만 보고 자동으로 정해지지 않으므로 시간 순서와 배경 지식, 실험이 필요합니다.", one: "이 모형에는 건드릴 경로가 없음", two: "비 → 시야·노면 → 사고 경로를 직접 건드림" },
] as const;

function ModelOne({ active }: { active: number }) {
  const on = active !== 1;
  const main = on ? ACCENT : IDLE;
  const cut = active === 2;
  return (
    <svg viewBox="0 0 320 130" className="h-auto w-full" role="img" aria-label={`모형 1: ${SCENES[active].one}`}>
      <text x={0} y={14} fontSize={12} fontWeight={700} fill="#64748b">모형 1</text>
      <Node box={SALE1} color={cut ? RED : main} crossed={cut} />
      <Edge x1={SALE1.x + SALE1.w / 2} y1={SALE1.y} x2={CRASH1.x - CRASH1.w / 2} y2={CRASH1.y} color={cut ? RED : main} dashed={cut} />
      {cut && <Cross x={(SALE1.x + SALE1.w / 2 + CRASH1.x - CRASH1.w / 2) / 2} y={SALE1.y} color={RED} />}
      <Node box={CRASH1} color={main} />
    </svg>
  );
}

function ModelTwo({ active }: { active: number }) {
  const on = active !== 0;
  const main = on ? ACCENT : IDLE;
  const closed = active === 2;
  const drain = active === 3;
  return (
    <svg viewBox="0 0 320 130" className="h-auto w-full" role="img" aria-label={`모형 2: ${SCENES[active].two}`}>
      <text x={0} y={14} fontSize={12} fontWeight={700} fill="#64748b">모형 2</text>
      <Node box={RAIN} color={main} />
      <Node box={SALE2} color={closed ? RED : main} crossed={closed} />
      <Node box={ROAD} color={drain ? AMBER : main} />
      <Node box={CRASH2} color={main} />
      <Edge x1={RAIN.x + 16} y1={RAIN.y - BOX_H / 2} x2={SALE2.x - SALE2.w / 2} y2={SALE2.y + 4} color={closed ? RED : main} dashed={closed} />
      <Edge x1={RAIN.x + 16} y1={RAIN.y + BOX_H / 2} x2={ROAD.x - ROAD.w / 2} y2={ROAD.y - 4} color={drain ? AMBER : main} />
      <Edge x1={ROAD.x + ROAD.w / 2} y1={ROAD.y} x2={CRASH2.x - CRASH2.w / 2} y2={CRASH2.y} color={drain ? AMBER : main} />
      {drain && <text x={ROAD.x} y={ROAD.y + BOX_H / 2 - 34} textAnchor="middle" fontSize={12} fontWeight={700} fill={AMBER}>개입</text>}
      <line x1={SALE2.x + SALE2.w / 2 + 4} y1={SALE2.y + 8} x2={CRASH2.x - 4} y2={CRASH2.y - BOX_H / 2 - 4} stroke={IDLE} strokeWidth={1} strokeDasharray="2 4" />
      <text x={258} y={50} textAnchor="middle" fontSize={12} fill="#64748b">상관만</text>
    </svg>
  );
}

export default function TwoModelsViz() {
  return (
    <SceneShell
      eyebrow="같은 상관, 다른 화살표"
      title="두 모형은 판매를 줄였을 때의 예측에서 갈라집니다"
      description="화살표는 원인에서 결과로의 방향입니다. 점선 '상관만'은 두 값이 함께 움직이지만 화살표는 없다는 표시입니다. 칸 크기는 효과 크기를 뜻하지 않습니다."
      ariaLabel="우산 판매 모형과 비 공통 원인 모형이 두 가지 개입에서 내는 예측 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="grid min-w-0 gap-4 sm:grid-cols-2 sm:gap-6">
          <div className="min-w-0">
            <ModelOne active={active} />
            <StableSceneStack
              active={active}
              className="mt-2"
              scenes={SCENES.map((scene) => <p key={scene.label} className="text-xs leading-5 text-muted-foreground sm:text-sm">{scene.one}</p>)}
            />
          </div>
          <div className="min-w-0">
            <ModelTwo active={active} />
            <StableSceneStack
              active={active}
              className="mt-2"
              scenes={SCENES.map((scene) => <p key={scene.label} className="text-xs leading-5 text-muted-foreground sm:text-sm">{scene.two}</p>)}
            />
          </div>
        </div>
      )}
    />
  );
}
