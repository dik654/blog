import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 제10조의 요구 기간(종료 6개월 전부터 1개월 전까지)과 처음 기간을 포함한 총 10년 한도.
 * 3년 계약 = 36개월이므로 요구 기간은 30~35개월. 10 − 3 = 7년. 갱신 한 번의 길이는 본문에 없어 칸을 나누지 않습니다.
 */
const W = 340;
const H = 216;
const LEFT = 14;
const RIGHT = 14;
const BIG_Y = 40;
const BAR = 16;
const ZOOM_Y = 134;

const yx = (year: number) => LEFT + (year / 10) * (W - LEFT - RIGHT);
const mx = (month: number) => LEFT + ((month - 24) / 12) * (W - LEFT - RIGHT);

const TEXT = "#64748b";
const AXIS = "#94a3b8";
const FIRST = "#2563eb";
const WINDOW = "#16a34a";
const REST = "#d97706";

const SCENES = [
  { label: "요구하는 기간", summary: "30개월 ~ 35개월", note: "3년 계약이면 끝나는 때는 36개월입니다. 종료 6개월 전부터 1개월 전까지이므로 30개월째부터 35개월째까지가 요구 기간입니다. 초록 칸입니다." },
  { label: "기간의 바깥", summary: "초록 칸 양옆", note: "제10조가 정한 요구 기간은 초록 칸입니다. 그래서 언제 갱신을 요구했는지를 거절 사유와 함께 봅니다." },
  { label: "총 10년 한도", summary: "처음 3년 포함 → 10 − 3 = 7년", note: "10년은 갱신으로 더 쓰는 기간이 아니라 처음 기간까지 합친 길이입니다. 3년 계약이면 갱신으로 더해질 수 있는 부분은 7년까지입니다." },
  { label: "자동 보장이 아님", summary: "요구와 예외가 먼저", note: "모든 계약이 자동으로 10년 보장된다는 뜻은 아닙니다. 차임 연체 등 예외가 있어 주황 칸은 점선으로 남겨 둡니다." },
] as const;

export default function RenewalWindowViz() {
  return (
    <SceneShell
      eyebrow="갱신 달력"
      title="3년 계약에서 갱신은 언제 요구하고 어디까지 이어질까요"
      description="위 막대는 10년 전체이고, 아래 막대는 그중 3년 차(24~36개월)를 크게 늘린 것입니다."
      note="한국 상가건물 임대차보호법 제10조를 3년 사례에 대입한 그림입니다(2026-10-04 확인). 갱신 한 번의 길이는 그리지 않았고, 잉글랜드·웨일스 등 다른 관할에는 옮겨 쓸 수 없습니다."
      ariaLabel="10년 한도 막대와 3년 차 요구 기간을 확대한 막대"
      scenes={SCENES}
      render={(active) => {
        const big = active >= 2;
        const zoomOpacity = big ? 0.45 : 1;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <g opacity={big ? 1 : 0.6}>
              <rect x={yx(0)} y={BIG_Y} width={yx(3) - yx(0)} height={BAR} fill={FIRST} opacity={0.3} stroke={FIRST} strokeWidth={1} />
              <rect x={yx(3)} y={BIG_Y} width={yx(10) - yx(3)} height={BAR} fill={active === 2 ? REST : "none"} fillOpacity={0.18} stroke={REST} strokeWidth={1} strokeDasharray={active === 3 ? "4 3" : undefined} />
              <text x={yx(0)} y={BIG_Y - 7} fontSize={12} fontWeight={700} fill={FIRST}>처음 3년</text>
              <text x={(yx(3) + yx(10)) / 2} y={BIG_Y - 7} textAnchor="middle" fontSize={12} fontWeight={700} fill={REST}>{active === 3 ? "요구·예외에 따라 최대 7년" : "최대 7년"}</text>
              {[0, 3, 10].map((year) => (
                <text key={year} x={yx(year)} y={BIG_Y + BAR + 15} textAnchor={year === 0 ? "start" : year === 10 ? "end" : "middle"} fontSize={12} fill={TEXT}>{year}년</text>
              ))}
            </g>
            <g stroke={AXIS} strokeWidth={0.5} strokeDasharray="2 3" opacity={zoomOpacity}>
              <line x1={yx(2)} x2={mx(24)} y1={BIG_Y + BAR} y2={ZOOM_Y} />
              <line x1={yx(3)} x2={mx(36)} y1={BIG_Y + BAR} y2={ZOOM_Y} />
            </g>
            <g opacity={zoomOpacity}>
              <rect x={mx(24)} y={ZOOM_Y} width={mx(30) - mx(24)} height={BAR + 4} fill="none" stroke={active === 1 ? "#dc2626" : AXIS} strokeWidth={1} strokeDasharray="4 3" />
              <rect x={mx(30)} y={ZOOM_Y} width={mx(35) - mx(30)} height={BAR + 4} fill={WINDOW} opacity={0.28} stroke={WINDOW} strokeWidth={1} />
              <rect x={mx(35)} y={ZOOM_Y} width={mx(36) - mx(35)} height={BAR + 4} fill="none" stroke={active === 1 ? "#dc2626" : AXIS} strokeWidth={1} strokeDasharray="4 3" />
              <text x={(mx(30) + mx(35)) / 2} y={ZOOM_Y - 6} textAnchor="middle" fontSize={13} fontWeight={700} fill={WINDOW}>요구 기간</text>
              {active === 1 && <text x={(mx(24) + mx(30)) / 2} y={ZOOM_Y - 6} textAnchor="middle" fontSize={12} fontWeight={700} fill="#dc2626">6개월 전보다 앞</text>}
              {[24, 30, 35, 36].map((month) => (
                <g key={month}>
                  <line x1={mx(month)} x2={mx(month)} y1={ZOOM_Y + BAR + 4} y2={ZOOM_Y + BAR + 9} stroke={AXIS} strokeWidth={1} />
                  <text x={mx(month)} y={ZOOM_Y + BAR + 23} textAnchor={month === 24 ? "start" : month === 36 ? "end" : "middle"} fontSize={12} fill={TEXT}>{month}</text>
                </g>
              ))}
              <text x={W / 2} y={H - 3} textAnchor="middle" fontSize={12} fill={TEXT}>계약 시작부터 개월 (36 = 종료)</text>
            </g>
          </svg>
        );
      }}
    />
  );
}
