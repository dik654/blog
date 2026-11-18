import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #comparison 2문단 — OECD 『한눈에 보는 연금 2025』의 노년부양비(20~64세 100명당 65세 이상).
 * OECD 전체 2024 32.6 → 2054 55.2 → 2084 67.7. 한국 2024 29.3 → 2084 122.0(2054 값은 글에 없음).
 * 세로축 0~130, 점선 100 = 65세 이상 인구가 20~64세 인구와 같은 수.
 */
const YEARS = [
  { year: "2024", oecd: 32.6, korea: 29.3 },
  { year: "2054", oecd: 55.2, korea: null },
  { year: "2084", oecd: 67.7, korea: 122.0 },
] as const;

const MAX = 130;
const BASE_Y = 186;
const TOP_Y = 40;
const AXIS_X = 38;
const BAR_W = 30;
const y = (value: number) => BASE_Y - (value / MAX) * (BASE_Y - TOP_Y);
const OECD_COLOR = "#64748b";
const KOREA_COLOR = "#2563eb";

export default function DependencyRatioViz() {
  return (
    <VizFrame
      eyebrow="노년부양비 전망"
      title="한국은 2084년에 일할 나이 100명당 노인이 122명으로 전망됩니다"
      description="노년부양비는 20~64세 100명당 65세 이상 인구입니다. 막대 높이가 그 수이고, 점선 100은 노인 수와 일할 나이 인구가 같아지는 선입니다. 값은 OECD 『한눈에 보는 연금 2025』의 전망을 9절에서 옮겼습니다."
      note="한국의 2054년 값은 글에 없어 막대를 그리지 않았습니다(높이 없음, '값 없음' 표시). 2024년과 2084년 사이를 직선으로 이어 읽지 마세요. 글은 이 비율을 연금의 수급자 대비 가입자 비율을 움직이는 인구 쪽 숫자로 소개합니다."
    >
      <svg viewBox="0 0 360 220" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label="OECD 전체 노년부양비 2024년 32.6, 2054년 55.2, 2084년 67.7. 한국 2024년 29.3, 2084년 122.0.">
        <rect x={AXIS_X + 4} y={10} width={10} height={10} rx={2} fill={OECD_COLOR} />
        <text x={AXIS_X + 19} y={19} fontSize={11} fill="#475569">OECD 전체</text>
        <rect x={AXIS_X + 100} y={10} width={10} height={10} rx={2} fill={KOREA_COLOR} />
        <text x={AXIS_X + 115} y={19} fontSize={11} fill="#475569">한국</text>
        {[0, 50, 100].map((tick) => (
          <text key={tick} x={AXIS_X - 6} y={y(tick) + 4} textAnchor="end" fontSize={10} fill="#64748b">{tick}</text>
        ))}
        <line x1={AXIS_X} x2={352} y1={y(100)} y2={y(100)} stroke="#dc2626" strokeWidth={1} strokeDasharray="4 3" />
        <text x={AXIS_X + 4} y={y(100) - 5} fontSize={10} fill="#dc2626">100: 노인 = 일할 나이 인구</text>
        {YEARS.map((item, index) => {
          const center = AXIS_X + 55 + index * 105;
          const oecdX = center - BAR_W - 2;
          const koreaX = center + 2;
          return (
            <g key={item.year}>
              <rect x={oecdX} y={y(item.oecd)} width={BAR_W} height={BASE_Y - y(item.oecd)} rx={2} fill={OECD_COLOR} />
              <text x={oecdX + BAR_W / 2} y={y(item.oecd) - 5} textAnchor="middle" fontSize={11} fontWeight={700} fill={OECD_COLOR}>{item.oecd.toFixed(1)}</text>
              {item.korea === null ? (
                <>
                  <line x1={koreaX} x2={koreaX + BAR_W} y1={BASE_Y} y2={BASE_Y} stroke={KOREA_COLOR} strokeWidth={1} strokeDasharray="3 3" />
                  <text x={koreaX + BAR_W / 2} y={BASE_Y - 18} textAnchor="middle" fontSize={9} fill={KOREA_COLOR}>값</text>
                  <text x={koreaX + BAR_W / 2} y={BASE_Y - 6} textAnchor="middle" fontSize={9} fill={KOREA_COLOR}>없음</text>
                </>
              ) : (
                <>
                  <rect x={koreaX} y={y(item.korea)} width={BAR_W} height={BASE_Y - y(item.korea)} rx={2} fill={KOREA_COLOR} />
                  <text x={koreaX + BAR_W / 2} y={y(item.korea) - 5} textAnchor="middle" fontSize={11} fontWeight={700} fill={KOREA_COLOR}>{item.korea.toFixed(1)}</text>
                </>
              )}
              <text x={center} y={BASE_Y + 18} textAnchor="middle" fontSize={11} fill="#475569">{item.year}년</text>
            </g>
          );
        })}
        <line x1={AXIS_X} x2={352} y1={BASE_Y} y2={BASE_Y} stroke="#94a3b8" strokeWidth={1} />
      </svg>
    </VizFrame>
  );
}
