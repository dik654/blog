import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism 마지막 문단 — 주당 10을 아껴도 초기 구입비와 학습비가 크면 회수 기간이 길어진다.
 * 가로 = 주, 세로 = 쌓인 절감액. 기울기는 본문의 주당 10이고, 두 수평선의 높이는 크기 비교용 그림입니다.
 */
const SCENES = [
  { label: "주당 10씩 쌓임", summary: "10주 100 · 20주 200", note: "주당 10을 아끼면 절감액은 10주에 100, 20주에 200, 30주에 300으로 곧게 쌓입니다." },
  { label: "초기 비용이 작을 때", summary: "선을 일찍 넘음", note: "쌓인 절감액이 초기 구입비와 학습비를 넘는 지점까지가 회수 기간입니다." },
  { label: "초기 비용이 클 때", summary: "같은 기울기 · 더 늦게 넘음", note: "매주 10은 같아도 넘을 높이가 커지면 회수 기간이 길어집니다. 특허, 기술 인력, 신용, 시장이 이 시간과 위험을 바꿉니다." },
] as const;

const W = 320;
const H = 196;
const LEFT = 14;
const RIGHT = 8;
const TOP = 10;
const BOTTOM = 26;
const WEEK_MAX = 35;
const VALUE_MAX = 350;
const px = (week: number) => LEFT + (week / WEEK_MAX) * (W - LEFT - RIGHT);
const py = (value: number) => TOP + ((VALUE_MAX - value) / VALUE_MAX) * (H - TOP - BOTTOM);
const SMALL = 110;
const LARGE = 270;
const BLUE = "#2563eb";
const AMBER = "#d97706";
const MUTED = "#64748b";
const IDLE = "#94a3b8";

function Level({ value, text, on }: { value: number; text: string; on: boolean }) {
  const week = value / 10;
  const color = on ? AMBER : IDLE;
  return (
    <g>
      <line x1={LEFT} x2={W - RIGHT} y1={py(value)} y2={py(value)} stroke={color} strokeWidth={on ? 1.25 : 1} strokeDasharray={on ? undefined : "3 3"} />
      <text x={LEFT + 4} y={py(value) - 5} fontSize={12} fontWeight={on ? 700 : 400} fill={on ? AMBER : MUTED}>{text}</text>
      {on && (
        <>
          <line x1={px(week)} x2={px(week)} y1={py(value)} y2={py(0)} stroke={AMBER} strokeWidth={1} strokeDasharray="3 3" />
          <circle cx={px(week)} cy={py(value)} r={3.5} fill={AMBER} />
          <path d={`M${LEFT} ${py(0) + 7} H${px(week)}`} stroke={AMBER} strokeWidth={1.25} fill="none" />
          <text x={(LEFT + px(week)) / 2} y={py(0) + 21} textAnchor="middle" fontSize={12} fontWeight={700} fill={AMBER}>회수 기간</text>
        </>
      )}
    </g>
  );
}

export default function PaybackViz() {
  return (
    <SceneShell
      eyebrow="회수 기간"
      title="매주 아끼는 10이 초기 비용을 넘어야 회수가 끝납니다"
      description="주당 10을 아끼는 기계는 언제 본전을 찾을까요? 파란 선이 쌓인 절감액이고 수평선이 넘어야 할 초기 비용입니다."
      note="주당 10은 설명용 가정입니다. 본문에 초기 비용 숫자가 없어 수평선 높이는 값이 아니라 크기 비교용입니다."
      ariaLabel="주당 10씩 쌓이는 절감액이 초기 비용을 넘는 시점"
      scenes={SCENES}
      render={(index) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[index].label}: ${SCENES[index].summary}`}>
          <line x1={LEFT} x2={LEFT} y1={TOP} y2={py(0)} stroke={IDLE} strokeWidth={1} />
          <line x1={LEFT} x2={W - RIGHT} y1={py(0)} y2={py(0)} stroke={IDLE} strokeWidth={1} />
          <text x={W - RIGHT} y={py(0) - 5} textAnchor="end" fontSize={12} fill={MUTED}>주</text>
          {index >= 1 && <Level value={SMALL} text="초기 비용이 작을 때" on={index === 1} />}
          {index === 2 && <Level value={LARGE} text="초기 비용이 클 때" on />}
          <line x1={px(0)} x2={px(WEEK_MAX)} y1={py(0)} y2={py(350)} stroke={BLUE} strokeWidth={1.25} />
          {index === 0 && [10, 20, 30].map((week) => (
            <g key={week}>
              <circle cx={px(week)} cy={py(week * 10)} r={3.5} fill={BLUE} />
              <text x={px(week) - 7} y={py(week * 10) - 6} textAnchor="end" fontSize={12} fontWeight={700} fill={BLUE}>{week}주 {week * 10}</text>
            </g>
          ))}
        </svg>
      )}
    />
  );
}
