import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits (및 #overview·#need·#comparison의 연도) — 1955 반둥, 1970·80년대 충격,
 * 1991 소련 해체, 1994 마라케시, 1995 WTO. 양극 구조는 1991에 끝나지만 군사 동맹·핵무기·지역 전쟁·국경은 남는다.
 * 본문이 연도를 주지 않은 항목(중국의 성장 등)과 세계화 요소의 속도는 시간축에 올리지 않는다.
 */
const X0 = 14;
const X1 = 346;
const FROM = 1945;
const TO = 2000;
const x = (year: number) => X0 + ((year - FROM) / (TO - FROM)) * (X1 - X0);

const SCENES = [
  { label: "연도가 있는 사건들", summary: "1955 → 1970·80년대 → 1991 → 1994·95", note: "이 글이 연도를 준 사건만 올렸습니다. 순서가 있다고 해서 한 방향으로 수렴했다는 뜻은 아닙니다.", step: 0 },
  { label: "1991년에 끝난 것과 남은 것", summary: "양극 구조 끝 · 나머지는 남음", note: "소련 해체로 멈춘 막대는 양극 구조 하나입니다. 군사 동맹·핵무기·지역 전쟁과 냉전기에 만들어진 국경은 선을 넘어 이어집니다.", step: 1 },
  { label: "축에 올리지 않은 변화", summary: "시기·속도가 글에 없음", note: "아래 항목은 글에 시작 연도나 속도 수치가 없어 시간축에 놓지 않았습니다.", step: 2 },
] as const;

function Lane({ y, from, to, label, color, arrow = false, labelEnd = false }: { y: number; from: number; to: number; label: string; color: string; arrow?: boolean; labelEnd?: boolean }) {
  return (
    <g>
      <text x={labelEnd ? x(to) : x(from)} y={y - 6} textAnchor={labelEnd ? "end" : "start"} fontSize={13} fontWeight={700} fill={color}>{label}</text>
      <rect x={x(from)} y={y} width={x(to) - x(from)} height={9} fill={color} />
      {arrow && <path d={`M${x(to)} ${y - 3} L${x(to) + 9} ${y + 4.5} L${x(to)} ${y + 12} Z`} fill={color} />}
    </g>
  );
}

function Dot({ year, y, color }: { year: number; y: number; color: string }) {
  return <circle cx={x(year)} cy={y} r={4.5} fill={color} />;
}

export default function AfterBipolarTimelineViz() {
  return (
    <SceneShell
      eyebrow="한 직선이 아닙니다"
      title="1991년에 무엇이 끝나고 무엇이 이어졌을까요"
      description="가로축은 연도입니다. 막대 왼쪽 끝은 글의 ‘2차 세계대전 뒤’를 1945에 맞춘 표시이며, 개별 동맹이나 전쟁의 시작 연도가 아닙니다. 1970·80년대 막대는 ‘몇 년대’라는 범위만 뜻합니다."
      ariaLabel="1945년부터 1990년대까지의 사건 순서와 1991년 뒤에도 이어진 구조"
      scenes={SCENES}
      render={(active) => {
        const { step } = SCENES[active];
        const eventsDim = step === 1;
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 360 208" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <line x1={x(1991)} x2={x(1991)} y1={4} y2={184} stroke="#dc2626" strokeWidth={step === 1 ? 1.25 : 1} strokeDasharray="3 3" />
              <text x={x(1991) - 5} y={13} textAnchor="end" fontSize={12} fontWeight={700} fill="#dc2626">1991 소련 해체</text>
              <Lane y={26} from={FROM} to={1991} label="양극 구조" color="#2563eb" />
              <Lane y={62} from={FROM} to={1998} label="군사 동맹·핵무기·지역 전쟁·국경" color="#64748b" arrow />
              <g opacity={eventsDim ? 0.35 : 1}>
                <Lane y={98} from={1970} to={1980} label="1970년대 석유 충격" color="currentColor" />
                <Lane y={134} from={1980} to={1990} label="1980년대 부채 위기" color="currentColor" labelEnd />
                <Dot year={1955} y={168} color="currentColor" />
                <text x={x(1955) + 8} y={172} fontSize={12} fontWeight={700} fill="currentColor">1955 반둥</text>
                <text x={x(1991) - 5} y={172} textAnchor="end" fontSize={12} fontWeight={700} fill="currentColor">1994 마라케시·95 WTO →</text>
                <Dot year={1994} y={168} color="currentColor" />
                <Dot year={1995} y={168} color="currentColor" />
              </g>
              <line x1={X0} x2={X1} y1={186} y2={186} stroke="#94a3b8" strokeWidth={1} />
              {[1945, 1955, 1970, 1980, 1991].map((year) => (
                <g key={year}>
                  <line x1={x(year)} x2={x(year)} y1={186} y2={190} stroke="#94a3b8" strokeWidth={1} />
                  <text x={x(year)} y={203} textAnchor={year === 1945 ? "start" : "middle"} fontSize={12} fontWeight={year === 1991 ? 700 : 400} fill={year === 1991 ? "#dc2626" : "#64748b"}>{year}</text>
                </g>
              ))}
            </svg>
            <div className={`mt-3 border-t border-border/70 pt-3 text-sm leading-6 ${step === 2 ? "" : "invisible"}`}>
              <p><span className="font-bold">권력·의존을 바꾼 것:</span> 중국의 성장, 유럽 통합, 지역 기구, 세계 생산망</p>
              <p className="mt-1"><span className="font-bold">다른 속도의 세계화:</span> 컨테이너, 통신, 금융 자유화, 이주 통제, 지식재산 규칙</p>
            </div>
          </div>
        );
      }}
    />
  );
}
