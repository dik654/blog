import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — RPO 15분·RTO 60분(가정)이 백업 주기와 복원 시간을 어떻게 제한하는가.
 * 시각은 numericCase(12:00 장애, 11:45 이후 손실 허용, 13:00 복구 마감)를 그대로 쓴다.
 * 하루 한 번 = 사본 간격 1,440분 = 15분의 96배. 복원 2시간을 장애 즉시 시작해도 12:00 + 120분 = 14:00, 마감보다 60분 늦다.
 */
const AXIS_START = 0; // 11:30
const AXIS_END = 165; // 14:15
const X0 = 20;
const X1 = 340;
const x = (minute: number) => X0 + ((minute - AXIS_START) / (AXIS_END - AXIS_START)) * (X1 - X0);

const T_1145 = 15;
const T_1200 = 30;
const T_1300 = 90;
const T_1400 = 150;

const TICKS = [
  { at: T_1145, label: "11:45" },
  { at: T_1200, label: "12:00" },
  { at: T_1300, label: "13:00" },
  { at: T_1400, label: "14:00" },
] as const;

const RPO_MIN = 15;
const DAILY_MIN = 24 * 60;
const BAR_MAX = DAILY_MIN;

const SCENES = [
  {
    label: "허용치를 시간축에 놓습니다",
    summary: "11:45 ← 12:00 장애 → 13:00",
    copyInterval: null,
    restore: false,
    note: "12시 장애에서 주문 데이터는 11:45 이후 최대 15분치까지 잃을 수 있고(RPO), 서비스는 13:00까지 돌아와야 합니다(RTO). 두 숫자는 이 글의 가정입니다.",
  },
  {
    label: "백업이 하루 한 번뿐이면",
    summary: "사본 간격 1,440분 = 15분의 96배",
    copyInterval: DAILY_MIN,
    restore: false,
    note: "사본 사이 간격이 24시간이면 장애 직전 사본이 언제였는지에 따라 15분보다 많은 주문을 잃을 수 있습니다. 하루 한 번 백업으로는 15분 손실 목표를 만족할 수 없습니다.",
  },
  {
    label: "복원에 두 시간이 걸리면",
    summary: "12:00 + 2시간 = 14:00, 마감 13:00",
    copyInterval: null,
    restore: true,
    note: "장애 즉시 복원을 시작해도 두 시간이 걸리면 14:00에야 끝납니다. 13:00 마감을 60분 넘기므로 중단 목표를 지키지 못합니다.",
  },
  {
    label: "15분마다 사본을 만들어도",
    summary: "간격은 맞지만 시험할 것이 남음",
    copyInterval: RPO_MIN,
    restore: false,
    note: "15분 간격은 손실 목표와 맞지만 그것만으로 충분하지 않습니다. 사본이 같은 계정 침해와 삭제 정책에 묶였는지, 복원이 몇 분 걸리는지, 애플리케이션 연결을 어디로 바꿀지까지 시험해야 13:00 안에 들어오는지 알 수 있습니다.",
  },
] as const satisfies readonly { label: string; summary: string; copyInterval: number | null; restore: boolean; note: string }[];

function MinuteBar({ label, minutes, color }: { label: string; minutes: number | null; color: string }) {
  const width = minutes === null ? 0 : Math.max((minutes / BAR_MAX) * 100, 0.8);
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)_4.5rem] items-center gap-2 text-xs sm:text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm" style={{ width: `${width}%`, backgroundColor: color }} />
      </div>
      <span className="text-right font-mono">{minutes === null ? "–" : `${minutes.toLocaleString("en-US")}분`}</span>
    </div>
  );
}

export default function RecoveryTargetTimelineViz() {
  return (
    <SceneShell
      eyebrow="복구 목표 두 개"
      title="15분 손실과 60분 중단을 같은 시간축에 놓으면"
      description="위는 11:30부터 14:15까지의 시간축이고, 아래 막대는 허용 손실과 사본 간격을 같은 축척(분)으로 비교합니다. RPO 15분·RTO 60분은 이 글의 가정입니다."
      ariaLabel="RPO 15분과 RTO 60분을 시간축에 놓고 백업 간격과 복원 시간을 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 360 132" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <rect x={x(T_1145)} y={34} width={x(T_1200) - x(T_1145)} height={30} fill="#2563eb" fillOpacity={0.18} stroke="#2563eb" strokeWidth={1} />
              <rect x={x(T_1200)} y={34} width={x(T_1300) - x(T_1200)} height={30} fill="#d97706" fillOpacity={0.14} stroke="#d97706" strokeWidth={1} />
              <text x={x(T_1145) + (x(T_1200) - x(T_1145)) / 2} y={26} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">RPO</text>
              <text x={x(T_1200) + (x(T_1300) - x(T_1200)) / 2} y={26} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b45309">RTO 60분</text>
              {scene.restore && (
                <g>
                  <rect x={x(T_1200)} y={72} width={x(T_1400) - x(T_1200)} height={14} rx={2} fill="#dc2626" fillOpacity={0.25} stroke="#dc2626" strokeWidth={1} />
                  <rect x={x(T_1300)} y={72} width={x(T_1400) - x(T_1300)} height={14} fill="#dc2626" fillOpacity={0.35} />
                  <text x={x(T_1300) + (x(T_1400) - x(T_1300)) / 2} y={98} textAnchor="middle" fontSize={10} fontWeight={700} fill="#dc2626">60분 초과</text>
                  <text x={x(T_1200) + 4} y={98} fontSize={10} fill="#dc2626">복원 2시간</text>
                </g>
              )}
              <line x1={X0} x2={X1} y1={64} y2={64} stroke="#94a3b8" strokeWidth={1} />
              <line x1={x(T_1200)} x2={x(T_1200)} y1={20} y2={110} stroke="#dc2626" strokeWidth={1.25} />
              <text x={x(T_1200)} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="#dc2626">장애</text>
              {TICKS.map((tick) => (
                <text key={tick.label} x={x(tick.at)} y={124} textAnchor="middle" fontSize={10} fill="#64748b">{tick.label}</text>
              ))}
            </svg>
            <div className="mt-3 space-y-2">
              <MinuteBar label="허용 손실(RPO)" minutes={RPO_MIN} color="#2563eb" />
              <MinuteBar label="사본 간격" minutes={scene.copyInterval} color={scene.copyInterval !== null && scene.copyInterval > RPO_MIN ? "#dc2626" : "#16a34a"} />
            </div>
          </div>
        );
      }}
    />
  );
}
