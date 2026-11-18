import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 2·4·9절에 흩어진 시점을 한 줄에 놓는다.
 * 유럽 지배 전 항구국가·상인망(2·4절) → 1830~70 자바 강제재배제도, 1870~1900 자유주의 시기(2절, 가와고에 연표)
 * → 1855 보링 조약, 관세 3% 고정(4절) → 1869 수에즈 운하(9절) → 1897 고무 345에이커, 1910 고무 가격 정점,
 * 1922 230만 에이커(4절, 230만 ÷ 345 ≈ 6,667배) → 독립 뒤 수입대체·수출 제조(나라마다 다른 시점, 4절) → 1997 외환위기.
 * 1820~1930만 연도 눈금이 실제 간격이고, 그 앞뒤 구간은 눈금 없이 순서만 보인다.
 */
const ON = "#2563eb";
const PAST = "#64748b";

interface Scene {
  label: string;
  summary: string;
  note: string;
}

const SCENES: readonly Scene[] = [
  { label: "유럽 지배 전: 항구국가와 상인망", summary: "연도 눈금 밖, 오래전부터", note: "유럽 지배 전에도 말라카 해협과 군도·메콩의 항구국가와 상인망은 중국·인도·서아시아와 물품·은·신용·종교를 교환했습니다. 글이 시작 연도를 정하지 않아 눈금 밖 '이전' 칸에 두었습니다." },
  { label: "1830~70 자바 강제재배제도", summary: "설탕·커피·쪽의 의무 재배", note: "세계은행 간행본의 인도네시아 장 연표는 자바의 강제재배제도를 1830~70년으로 적습니다. 설탕·커피·쪽(인디고) 같은 작물을 의무 재배로 밀어붙인 제도였습니다." },
  { label: "1855 보링 조약(태국)", summary: "수출입 관세 3%로 고정", note: "태국(시암)은 공식 식민지가 아니었지만 1855년 영국과 보링 조약을 맺었습니다. 하야미에 따르면 수출입 관세가 가격의 3%로 일률 고정됐고, 국내 세금도 왕국 혼자서는 바꿀 수 없게 됐습니다." },
  { label: "1869 수에즈 운하 · 1870~1900 자유주의 시기", summary: "운송비 하락과 민간 자본", note: "1869년 수에즈 운하와 증기선은 유럽까지의 운송비를 낮췄습니다(9절). 자바에서는 강제재배제도 폐지 뒤 1870~1900년이 유럽 민간 자본이 늘어난 '자유주의 시기'로 이어졌습니다." },
  { label: "1897~1922 말라야 고무", summary: "345 → 230만 에이커(약 6,667배)", note: "말라야의 고무 재배 면적은 1897년 345에이커에서 1922년 230만 에이커로 늘었습니다. 230만 ÷ 345 ≈ 6,667배입니다. 드래블은 이 확장이 1910년에 정점을 찍은 고무 가격 상승, 곧 미국 자동차 산업의 타이어 수요에서 나왔다고 씁니다." },
  { label: "독립 뒤: 수입대체에서 수출 제조로", summary: "나라마다 다른 시점", note: "독립 뒤 여러 국가는 수입대체와 국영기업을 택했다가 서로 다른 시점에 외국인투자·수출가공·전자·의류 생산으로 옮겼습니다. 시점이 나라마다 달라 연도 눈금 없이 점선 칸으로만 그렸습니다." },
  { label: "1997 외환위기", summary: "단기 외화차입·환율·은행·부동산", note: "1997년 외환위기는 단기 외화차입·환율·은행·부동산이 연결된 위험을 드러냈습니다. 위기 뒤에도 나라별 산업과 사회보호는 달랐습니다." },
];

const X0 = 60;
const X1 = 290;
const yearX = (year: number) => X0 + ((year - 1820) * (X1 - X0)) / 110;
const AXIS_Y = 70;

function Mark({ year, end, label, state, row }: { year: number; end?: number; label: string; state: "on" | "past" | "off"; row: number }) {
  if (state === "off") return null;
  const color = state === "on" ? ON : PAST;
  const y = AXIS_Y - 14 - row * 22;
  const x = yearX(year);
  return (
    <g opacity={state === "on" ? 1 : 0.55}>
      {end === undefined ? (
        <circle cx={x} cy={y} r={4.5} fill={color} fillOpacity={0.25} stroke={color} strokeWidth={1} />
      ) : (
        <rect x={x} y={y - 4.5} width={yearX(end) - x} height={9} rx={3} fill={color} fillOpacity={0.25} stroke={color} strokeWidth={1} />
      )}
      <line x1={x} y1={y + 5} x2={x} y2={AXIS_Y} stroke={color} strokeWidth={1} strokeDasharray="2 2" />
      {state === "on" && (
        <text x={x} y={AXIS_Y + 42} textAnchor="middle" fontSize={16} fontWeight={700} fill={ON}>{label}</text>
      )}
    </g>
  );
}

export default function TradeTimelineViz() {
  return (
    <SceneShell
      eyebrow="시점 잇기"
      title="항구 교역에서 1997년 위기까지, 시점을 한 줄에 놓습니다"
      description="2·4·9절에 흩어진 연도를 한 줄에 모았습니다. 1820~1930년 구간만 실제 연도 간격이고, 그 앞의 '이전'과 뒤의 '독립 뒤' 칸은 순서만 보입니다. 흐린 표시는 앞 장면에서 본 시점입니다."
      ariaLabel="항구국가 교역, 자바 강제재배제도, 보링 조약, 수에즈 운하, 말라야 고무 확장, 독립 뒤 산업 전환, 1997년 외환위기의 순서"
      scenes={SCENES}
      render={(active) => {
        const state = (index: number) => (index === active ? "on" : index < active ? "past" : "off") as "on" | "past" | "off";
        const preOn = active === 0;
        const indepOn = active === 5;
        const crisisOn = active === 6;
        return (
          <svg viewBox="0 0 410 122" className="mx-auto h-auto w-full max-w-[620px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={X0} y1={AXIS_Y} x2={X1} y2={AXIS_Y} stroke="currentColor" strokeOpacity={0.6} strokeWidth={1} />
            {[1850, 1900].map((year) => (
              <g key={year}>
                <line x1={yearX(year)} y1={AXIS_Y - 4} x2={yearX(year)} y2={AXIS_Y + 4} stroke="currentColor" strokeOpacity={0.6} strokeWidth={1} />
                <text x={yearX(year)} y={AXIS_Y + 22} textAnchor="middle" fontSize={15} fill="currentColor" fillOpacity={0.7}>{year}</text>
              </g>
            ))}

            <rect x={6.5} y={AXIS_Y - 10.5} width={44} height={21} rx={4} fill={preOn ? ON : "none"} fillOpacity={0.15} stroke={preOn ? ON : PAST} strokeWidth={1} strokeDasharray="3 2" />
            <text x={28.5} y={AXIS_Y + 4.5} textAnchor="middle" fontSize={15} fontWeight={preOn ? 700 : 500} fill={preOn ? ON : "currentColor"}>이전</text>

            <Mark year={1830} end={1870} label="1830~70" state={state(1)} row={0} />
            <Mark year={1855} label="1855" state={state(2)} row={1} />
            <Mark year={1869} label="1869" state={state(3)} row={2} />
            {state(3) !== "off" && (
              <rect x={yearX(1870)} y={AXIS_Y - 14 - 4.5} width={yearX(1900) - yearX(1870)} height={9} rx={3} fill={active === 3 ? ON : PAST} fillOpacity={0.25} stroke={active === 3 ? ON : PAST} strokeWidth={1} opacity={active === 3 ? 1 : 0.55} />
            )}
            <Mark year={1897} end={1922} label="1897~1922" state={state(4)} row={1} />
            {state(4) !== "off" && (
              <line x1={yearX(1910)} y1={AXIS_Y - 50} x2={yearX(1910)} y2={AXIS_Y - 30} stroke={active === 4 ? ON : PAST} strokeWidth={1.25} opacity={active === 4 ? 1 : 0.55} />
            )}

            <g stroke="currentColor" strokeOpacity={0.6} strokeWidth={1}>
              <line x1={294} y1={AXIS_Y + 5} x2={300} y2={AXIS_Y - 5} />
              <line x1={300} y1={AXIS_Y + 5} x2={306} y2={AXIS_Y - 5} />
            </g>
            <rect x={310.5} y={AXIS_Y - 10.5} width={58} height={21} rx={4} fill={indepOn ? ON : "none"} fillOpacity={0.15} stroke={indepOn ? ON : PAST} strokeWidth={1} strokeDasharray="3 2" opacity={active >= 5 ? 1 : 0.35} />
            <text x={339.5} y={AXIS_Y + 4.5} textAnchor="middle" fontSize={14} fontWeight={indepOn ? 700 : 500} fill={indepOn ? ON : "currentColor"} opacity={active >= 5 ? 1 : 0.35}>독립 뒤</text>
            <circle cx={390} cy={AXIS_Y} r={5} fill={crisisOn ? ON : "none"} fillOpacity={0.3} stroke={crisisOn ? ON : PAST} strokeWidth={1} opacity={active >= 6 ? 1 : 0.35} />
            <text x={390} y={AXIS_Y + 22} textAnchor="middle" fontSize={15} fontWeight={crisisOn ? 700 : 500} fill={crisisOn ? ON : "currentColor"} opacity={active >= 6 ? 1 : 0.35}>1997</text>
            {active === 4 && (
              <text x={yearX(1910)} y={AXIS_Y - 54} textAnchor="middle" fontSize={13} fill={ON}>1910 가격 정점</text>
            )}
          </svg>
        );
      }}
    />
  );
}
