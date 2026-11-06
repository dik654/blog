import ArrowHead from "./ArrowHead";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 20MWh 작업을 밤으로 옮기거나 가까운 저장 설비에 미리 채운다(가정).
 * 세로 1.1px = 1MWh. 저장 설비를 채우는 양과 시점은 글이 정하지 않으므로 막대로 그리지 않는다.
 */
const BASE = 182;
const SCALE = 1.1;
const y = (value: number) => BASE - value * SCALE;

const SCENES = [
  { label: "오후에 한도를 넘습니다", summary: "원함 100 > 한도 80", note: "길을 넓히지 않으면 오후 한 시간에 20MWh가 한도 위에 남습니다." },
  { label: "작업을 밤으로 옮기면", summary: "오후 80 + 밤 20", note: "공장이 20MWh의 작업을 밤으로 옮기면 같은 길을 더 넓히지 않고도 일을 마칠 수 있습니다(가정). 대신 교대 인력과 납품 일정의 비용이 생깁니다." },
  { label: "가까운 저장 설비를 쓰면", summary: "오후 80 + 저장에서 20", note: "넘는 20을 저장에서 댄다고 놓았습니다(가정). 가까운 저장 설비에 미리 채워 두어도 충전 손실과 설치비를 부담합니다. 한 시간에 얼마나 내보낼 수 있는지는 7절에서 따로 봅니다." },
];

export default function ShiftToNightViz() {
  return (
    <SceneShell
      eyebrow="시간 옮기기"
      title="길을 넓히지 않고 20을 푸는 두 방법과 그 대가"
      description="세로 높이가 그 시간대의 MWh이고 점선이 길의 한도입니다. 사례의 숫자는 가정이며, 밤에도 같은 한도를 둡니다(가정)."
      ariaLabel="오후 100이 한도 80을 넘고, 20을 밤으로 옮기거나 저장 설비로 메우는 그림"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 206" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <rect x={130} y={y(80)} width={80} height={80 * SCALE} rx={2} fill="#2563eb" fillOpacity={0.3} stroke="#2563eb" strokeWidth={1} />
          <text x={170} y={y(40)} textAnchor="middle" fontSize={14} fontWeight={700} fill="#2563eb">80</text>
          {active === 0 && (
            <>
              <rect x={130} y={y(100)} width={80} height={20 * SCALE} rx={2} fill="#dc2626" fillOpacity={0.1} stroke="#dc2626" strokeWidth={1} strokeDasharray="4 3" />
              <text x={170} y={y(100) + 16} textAnchor="middle" fontSize={12} fontWeight={700} fill="#dc2626">넘는 20</text>
            </>
          )}
          {active === 1 && (
            <>
              <rect x={130} y={y(100)} width={80} height={20 * SCALE} rx={2} fill="none" stroke="#d97706" strokeWidth={1} strokeDasharray="4 3" />
              <text x={170} y={y(100) + 16} textAnchor="middle" fontSize={12} fontWeight={700} fill="#b45309">옮기는 20</text>
              <path d={`M 210 ${y(90)} H 270 V ${y(20) - 8}`} fill="none" stroke="#d97706" strokeWidth={1.25} />
              <ArrowHead x={270} y={y(20) - 1} angle={90} color="#d97706" />
              <rect x={230} y={y(20)} width={80} height={20 * SCALE} rx={2} fill="#d97706" fillOpacity={0.3} stroke="#d97706" strokeWidth={1} />
              <text x={270} y={y(20) + 16} textAnchor="middle" fontSize={12} fontWeight={700} fill="#b45309">20</text>
              <text x={180} y={24} textAnchor="middle" fontSize={12} fontWeight={700} fill="#b45309">대가: 교대 인력·납품 일정 비용</text>
            </>
          )}
          {active === 2 && (
            <>
              <rect x={130} y={y(100)} width={80} height={20 * SCALE} rx={2} fill="#16a34a" fillOpacity={0.25} stroke="#16a34a" strokeWidth={1} />
              <text x={170} y={y(100) + 16} textAnchor="middle" fontSize={12} fontWeight={700} fill="#15803d">저장에서 20</text>
              <g textAnchor="middle" fontSize={11} fontWeight={700} fill="#15803d">
                <text x={65} y={122}>저장 설비를</text>
                <text x={65} y={138}>미리 채움</text>
                <text x={65} y={154} fontWeight={400}>(양은 정하지 않음)</text>
              </g>
              <path d={`M 65 112 V ${y(90)} H 122`} fill="none" stroke="#16a34a" strokeWidth={1} />
              <ArrowHead x={130} y={y(90)} color="#16a34a" />
              <text x={180} y={24} textAnchor="middle" fontSize={12} fontWeight={700} fill="#15803d">대가: 충전 손실·설치비</text>
            </>
          )}
          <line x1={20} x2={340} y1={y(80)} y2={y(80)} stroke="#475569" strokeWidth={1} strokeDasharray="5 4" />
          <text x={346} y={y(80) + 15} textAnchor="end" fontSize={11} fontWeight={700} fill="#64748b">길의 한도 80</text>
          <line x1={20} x2={340} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
          <g textAnchor="middle" fontSize={12} fill="#64748b">
            <text x={65} y={BASE + 18}>{active === 2 ? "미리" : ""}</text>
            <text x={170} y={BASE + 18} fontWeight={700} fill="currentColor">오후 한 시간</text>
            <text x={270} y={BASE + 18}>밤</text>
          </g>
        </svg>
      )}
    />
  );
}
