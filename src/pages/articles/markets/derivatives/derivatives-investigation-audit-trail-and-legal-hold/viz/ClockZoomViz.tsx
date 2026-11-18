import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 1절의 다섯 시각(가정)을 세 배율로 본다.
 * 09:59:50 대화를 0초로 두면 주문 10.100, 수정 10.350, 취소 10.600, 경보(10:05:00) 310초.
 * 입력→수정 0.250, 수정→취소 0.250, 합 0.500. 대화→주문 10.100. 취소→경보 299.4초 = 4분59.4초.
 */
const EVENTS = { chat: 0, order: 10.1, modify: 10.35, cancel: 10.6, alert: 310 } as const;

const W = 360;
const H = 150;
const PAD = 24;
const AXIS_Y = 92;
const ACCENT = "#2563eb";
const MUTED = "#64748b";

const fmt = (value: number) => value.toFixed(3);

const SCENES = [
  { label: "0.5초 창", summary: ".100 → .350 → .600", from: 10.0, to: 10.7, ticks: ["10:00:00.000", "10:00:00.700"], note: "입력에서 수정까지 0.250초, 수정에서 취소까지 다시 0.250초로 모두 0.500초입니다. 이 배율에서는 세 사건이 또렷이 떨어져 있습니다." },
  { label: "10초 창으로 넓히기", summary: "대화는 주문보다 10.100초 앞", from: -1, to: 12, ticks: ["09:59:49", "10:00:02"], note: "같은 세 사건이 이 배율에서는 거의 한 점으로 모입니다. 그 왼쪽 10.100초 앞에 09시59분50초의 대화가 있습니다." },
  { label: "5분 창으로 넓히기", summary: "경보는 취소 4분59.4초 뒤", from: -5, to: 315, ticks: ["09:59:45", "10:05:05"], note: "이제는 대화와 주문 0.5초까지 왼쪽 끝에서 겹쳐 보입니다. 10시05분 경보는 취소(.600초)에서 299.4초, 약 4분59.4초 뒤에 생긴 분석 결과입니다." },
] as const;

function Dot({ x, label, above, color, anchor = "middle" }: { x: number; label: string; above: boolean; color: string; anchor?: "middle" | "end" }) {
  return (
    <g>
      <line x1={x} x2={x} y1={AXIS_Y - 8} y2={AXIS_Y + 8} stroke={color} strokeWidth={1.25} />
      <circle cx={x} cy={AXIS_Y} r={3.5} fill={color} />
      <text x={x} y={above ? AXIS_Y - 14 : AXIS_Y + 22} textAnchor={anchor} fontSize={12} fontWeight={700} fill={color}>{label}</text>
    </g>
  );
}

function Gap({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) {
  return (
    <g>
      <line x1={x1} x2={x2} y1={y} y2={y} stroke={MUTED} strokeWidth={1} />
      <line x1={x1} x2={x1} y1={y - 4} y2={y + 4} stroke={MUTED} strokeWidth={1} />
      <line x1={x2} x2={x2} y1={y - 4} y2={y + 4} stroke={MUTED} strokeWidth={1} />
      <text x={(x1 + x2) / 2} y={y - 6} textAnchor="middle" fontSize={12} fill={MUTED}>{label}</text>
    </g>
  );
}

function Frame({ index }: { index: number }) {
  const scene = SCENES[index];
  const x = (t: number) => PAD + ((t - scene.from) / (scene.to - scene.from)) * (W - 2 * PAD);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
      <line x1={PAD} x2={W - PAD} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
      <text x={PAD} y={H - 8} fontSize={11} fill={MUTED}>{scene.ticks[0]}</text>
      <text x={W - PAD} y={H - 8} textAnchor="end" fontSize={11} fill={MUTED}>{scene.ticks[1]}</text>
      {index === 0 && (
        <>
          <Dot x={x(EVENTS.order)} label="입력 .100" above color={ACCENT} />
          <Dot x={x(EVENTS.modify)} label="수정 .350" above color={ACCENT} />
          <Dot x={x(EVENTS.cancel)} label="취소 .600" above color={ACCENT} />
          <Gap x1={x(EVENTS.order)} x2={x(EVENTS.modify)} y={AXIS_Y + 30} label={`${fmt(EVENTS.modify - EVENTS.order)}초`} />
          <Gap x1={x(EVENTS.modify)} x2={x(EVENTS.cancel)} y={AXIS_Y + 30} label={`${fmt(EVENTS.cancel - EVENTS.modify)}초`} />
          <Gap x1={x(EVENTS.order)} x2={x(EVENTS.cancel)} y={30} label={`합 ${fmt(EVENTS.cancel - EVENTS.order)}초`} />
        </>
      )}
      {index === 1 && (
        <>
          <Dot x={x(EVENTS.chat)} label="대화 09:59:50" above color={MUTED} />
          <rect x={x(EVENTS.order)} y={AXIS_Y - 6} width={x(EVENTS.cancel) - x(EVENTS.order)} height={12} fill={ACCENT} opacity={0.85} />
          <text x={x(EVENTS.cancel)} y={AXIS_Y - 14} textAnchor="end" fontSize={12} fontWeight={700} fill={ACCENT}>주문 0.5초</text>
          <Gap x1={x(EVENTS.chat)} x2={x(EVENTS.order)} y={AXIS_Y + 30} label={`${fmt(EVENTS.order - EVENTS.chat)}초`} />
        </>
      )}
      {index === 2 && (
        <>
          <circle cx={x(EVENTS.chat)} cy={AXIS_Y} r={3.5} fill={MUTED} />
          <rect x={x(EVENTS.order)} y={AXIS_Y - 6} width={Math.max(2, x(EVENTS.cancel) - x(EVENTS.order))} height={12} fill={ACCENT} />
          <text x={x(EVENTS.chat)} y={AXIS_Y - 14} fontSize={12} fontWeight={700} fill={ACCENT}>대화 + 주문 0.5초</text>
          <Dot x={x(EVENTS.alert)} label="경보 10:05:00" above color="#b45309" anchor="end" />
          <Gap x1={x(EVENTS.cancel)} x2={x(EVENTS.alert)} y={AXIS_Y + 30} label={`취소 → 경보 ${fmt(EVENTS.alert - EVENTS.cancel).replace(/0+$/, "").replace(/\.$/, "")}초 = 4분59.4초`} />
        </>
      )}
    </svg>
  );
}

export default function ClockZoomViz() {
  return (
    <SceneShell
      eyebrow="같은 시계, 세 배율"
      title="0.5초, 10초, 5분이 한 사건 안에 들어 있습니다"
      description="1절의 다섯 시각(가정)을 한 축 위에 놓고 배율만 넓혀 갑니다. 축의 양 끝 시각이 장면마다 바뀝니다. 한 축에 놓은 것은 모든 시스템 시계가 같은 기준에 맞았다는 가정이며, 실제 조사에서는 이것부터 확인합니다."
      ariaLabel="주문 입력, 수정, 취소의 0.5초와 10초 전 대화, 약 5분 뒤 경보를 세 배율로 비교"
      scenes={SCENES}
      render={(active) => <Frame index={active} />}
    />
  );
}
