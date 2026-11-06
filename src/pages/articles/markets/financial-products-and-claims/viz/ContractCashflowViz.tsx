import SceneShell from "./SceneShell";
import { Arrow } from "./SvgParts";

/**
 * 본문 대응: #case — 같은 1000만 원의 네 계약. 위로 가는 화살표는 내가 받는 돈, 아래는 내가 내는 돈입니다.
 * 예금 +1040, 대출 −1060, 운용 결과 900(예), 사건 지급은 사고가 생겨야 지급. 세금·수수료·월별 날짜는 뺐습니다.
 */
type Flow = { amount: number | null; dir: 1 | -1; text: string; dashed?: boolean };

const SCENES: readonly { label: string; summary: string; note: string; start: Flow; end: Flow; extra: string }[] = [
  { label: "맡긴 경우", summary: "−1000 → +1040만 원", note: "연 4%로 1년 맡기면 약속대로 지급될 때 1040만 원을 받습니다. 받을 금액이 처음부터 정해져 있습니다.", start: { amount: 1000, dir: -1, text: "1000 냄" }, end: { amount: 1040, dir: 1, text: "1040 받음" }, extra: "이자 +40" },
  { label: "빌린 경우", summary: "+1000 → −1060만 원", note: "같은 1000만 원이라도 화살표가 뒤집힙니다. 연 6%로 1년 빌려 끝에 한 번에 갚으면 1060만 원을 냅니다.", start: { amount: 1000, dir: 1, text: "1000 받음" }, end: { amount: 1060, dir: -1, text: "1060 냄" }, extra: "이자 −60" },
  { label: "자산에 맡긴 경우", summary: "−1000 → +900만 원", note: "1000만 원으로 산 자산이 900만 원이 되면 그 결과를 고객이 받습니다. 끝의 화살표 길이가 미리 정해져 있지 않습니다.", start: { amount: 1000, dir: -1, text: "1000 냄" }, end: { amount: 900, dir: 1, text: "900 받음(예)" }, extra: "결과에 따라 달라짐" },
  { label: "사건에 걸린 경우", summary: "사고가 생겨야 지급", note: "마지막 계약은 정해진 사고가 생겨야 지급합니다. 시간이 흐른다고 돈이 돌아오지 않습니다. 지급액은 본문에 정해 두지 않아 길이로 그리지 않았고, 시점도 정해져 있지 않아 1년 눈금을 지웠습니다.", start: { amount: 1000, dir: -1, text: "1000 냄" }, end: { amount: null, dir: 1, text: "사고 때만 지급", dashed: true }, extra: "사고 없으면 지급 없음" },
];

const ACCENT = "#2563eb";
const AMBER = "#d97706";
const GRAY = "#64748b";
const MUTED = "#94a3b8";
const AXIS = 96;
const SCALE = 66 / 1060;
const X_START = 96;
const X_END = 244;
const X_EVENT = 210;

function FlowArrow({ x, flow }: { x: number; flow: Flow }) {
  const length = flow.amount === null ? 54 : flow.amount * SCALE;
  const tip = AXIS - flow.dir * length;
  const tone = flow.dir > 0 ? ACCENT : AMBER;
  return (
    <g>
      <Arrow x1={x} y1={AXIS} x2={x} y2={tip} tone={tone} dashed={flow.dashed} />
      <text x={x} y={flow.dir > 0 ? tip - 7 : tip + 16} textAnchor="middle" fontSize={13} fontWeight={700} fill={tone}>{flow.text}</text>
    </g>
  );
}

export default function ContractCashflowViz() {
  return (
    <SceneShell
      eyebrow="돈의 방향"
      title="같은 1000만 원이 네 계약에서 어떻게 오가는지 봅니다"
      description="가로는 시간입니다. 선 위로 가는 화살표는 내가 받는 돈, 아래로 가는 화살표는 내가 내는 돈이고 단위는 만 원입니다."
      note="설명용 가정입니다. 세금·수수료·월별 날짜 차이는 생략했습니다."
      ariaLabel="예금, 대출, 운용 결과, 사건 지급 계약의 시작과 끝 현금 흐름"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const eventDriven = scene.end.amount === null;
        return (
          <svg viewBox="0 0 340 184" className="mx-auto h-auto w-full max-w-[520px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={40} x2={320} y1={AXIS} y2={AXIS} stroke={MUTED} strokeWidth={1} />
            <text x={36} y={AXIS + 4} textAnchor="end" fontSize={11} fill={GRAY}>시간</text>
            <text x={X_START + 8} y={AXIS + 14} fontSize={11} fill={GRAY}>시작</text>
            {eventDriven ? (
              <text x={X_EVENT} y={AXIS + 16} textAnchor="middle" fontSize={11} fill={GRAY}>언제일지 모름</text>
            ) : (
              <text x={X_END + 8} y={AXIS + 14} fontSize={11} fill={GRAY}>1년 뒤</text>
            )}
            <FlowArrow x={X_START} flow={scene.start} />
            <FlowArrow x={eventDriven ? X_EVENT : X_END} flow={scene.end} />
            <text x={eventDriven ? X_EVENT : 170} y={eventDriven ? AXIS + 36 : 62} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">{scene.extra}</text>
          </svg>
        );
      }}
    />
  );
}
