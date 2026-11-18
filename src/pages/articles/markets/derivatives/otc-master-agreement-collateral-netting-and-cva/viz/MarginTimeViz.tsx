import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 현재 순가치 0에서도 내일 받을 금액이 생길 수 있고, 부도부터 대체까지 가격이 더 움직인다.
 * 변동증거금은 이미 생긴 현재가치, 개시증거금은 청산기간의 잠재 변화를 겨냥한다.
 * 본문에 금액이 없어 세로축 눈금을 두지 않는다. 경로 모양과 높이는 모두 설명용 가정이다.
 */
const W = 360;
const H = 210;
const ZERO_Y = 160;
const TODAY_X = 34;
const DEFAULT_X = 186;
const REPLACE_X = 326;
const NOW_Y = 100;
const IM_TOP = 48;

const PAST_PATH = "M34 160 L64 151 L94 156 L124 133 L154 121 L186 100";
const FAN = [
  "M186 100 L220 86 L256 74 L290 62 L326 52",
  "M186 100 L220 96 L256 84 L290 86 L326 76",
  "M186 100 L220 104 L256 98 L290 104 L326 98",
  "M186 100 L220 110 L256 116 L290 112 L326 120",
  "M186 100 L220 118 L256 128 L290 136 L326 142",
] as const;
const NEXT_STEPS = ["M34 160 L74 140", "M34 160 L74 160", "M34 160 L74 178"] as const;

const SCENES = [
  { label: "오늘 순가치는 0", summary: "그래도 내일은 움직임", note: "현재 순가치가 0이어도 내일 금리나 환율이 움직이면 A가 받을 금액이 생길 수 있습니다. 가로선이 0이고, 위로 갈수록 A가 상대에게서 받을 가치(상대가 부도나면 잃을 수 있는 가치)가 큽니다." },
  { label: "이미 생긴 가치에는 변동증거금", summary: "변동증거금 = 현재가치를 옮김", note: "시간이 지나 받을 가치가 생기면 변동증거금이 그 이미 생긴 현재가치만큼을 옮깁니다. 파란 막대가 지금까지 옮긴 몫입니다." },
  { label: "부도 뒤에도 가격은 움직입니다", summary: "부도 → 대체까지의 기간", note: "상대방이 부도나면 거래를 끝내고 다른 상대와 대체하기까지 시간이 걸리고, 그동안 가격이 더 움직입니다. 이 부도부터 대체까지의 기간을 청산기간이라고 부릅니다. 오른쪽 여러 선은 그 사이에 가능한 경로의 예시입니다(가정)." },
  { label: "그 잠재 변화에는 개시증거금", summary: "개시증거금 = 청산기간의 변화 담보", note: "개시증거금은 이 청산기간(부도부터 대체까지)의 잠재 변화를 겨냥합니다. 노란 점선 칸이 그 구간이며, 높이는 본문에 없어 설명용으로 그렸습니다(가정)." },
  { label: "담보 가치가 같이 떨어지면", summary: "헤어컷 · 추가 위험", note: "담보 통화가 노출 통화와 다르거나 담보 가치가 상대방과 함께 떨어지면, 받아 둔 담보가 노출을 덜 덮습니다. 파란 막대 위 점선 빈칸이 덜 덮인 몫입니다. 그래서 헤어컷(담보를 시가보다 낮게 쳐 주는 할인)과 추가 위험 관리가 필요합니다." },
] as const;

export default function MarginTimeViz() {
  return (
    <SceneShell
      eyebrow="두 증거금의 시간"
      title="변동증거금은 지금까지, 개시증거금은 부도 뒤 대체까지를 봅니다"
      description="가로는 시간, 세로는 A가 상대에게서 받을 가치입니다. 본문에 금액이 없어 세로 눈금은 두지 않았고 선의 모양은 설명용 가정입니다."
      ariaLabel="현재 순가치 0에서 출발해 생긴 가치는 변동증거금이 옮기고, 부도부터 대체까지의 잠재 변화는 개시증거금이 겨냥하며, 담보 가치가 떨어지면 헤어컷이 필요한 모습"
      scenes={SCENES}
      render={(active) => {
        const showPast = active >= 1;
        const showFan = active >= 2;
        const showIm = active >= 3;
        const haircut = active === 4;
        const vmTop = haircut ? NOW_Y + 18 : NOW_Y;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={TODAY_X - 6} x2={REPLACE_X + 6} y1={ZERO_Y} y2={ZERO_Y} stroke="#94a3b8" strokeWidth={1} />
            <text x={TODAY_X} y={ZERO_Y + 16} textAnchor="middle" fontSize={11} fill="#64748b">오늘</text>
            {showIm && (
              <>
                <rect x={DEFAULT_X + 2} y={IM_TOP} width={REPLACE_X - DEFAULT_X - 2} height={NOW_Y - IM_TOP} rx={3} fill="#f59e0b" fillOpacity={0.12} stroke="#d97706" strokeWidth={1} strokeDasharray="4 3" />
                <text x={(DEFAULT_X + REPLACE_X) / 2} y={IM_TOP - 6} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b45309">개시증거금이 겨냥 (가정)</text>
              </>
            )}
            {!showPast &&
              NEXT_STEPS.map((d) => <path key={d} d={d} fill="none" stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" />)}
            {!showPast && <text x={80} y={138} fontSize={11} fill="#64748b">내일 금리·환율 변화</text>}
            <circle cx={TODAY_X} cy={ZERO_Y} r={3.5} fill="#64748b" />
            {showPast && <path d={PAST_PATH} fill="none" stroke="#475569" strokeWidth={1.25} />}
            {showPast && (
              <>
                {haircut && <rect x={DEFAULT_X - 14} y={NOW_Y} width={12} height={ZERO_Y - NOW_Y} rx={2} fill="none" stroke="#2563eb" strokeWidth={1} strokeDasharray="3 2" />}
                <rect x={DEFAULT_X - 14} y={vmTop} width={12} height={ZERO_Y - vmTop} rx={2} fill="#2563eb" fillOpacity={0.8} />
                <text x={DEFAULT_X - 16} y={ZERO_Y + 16} textAnchor="end" fontSize={11} fontWeight={700} fill="#2563eb">변동증거금</text>
                {haircut && <text x={DEFAULT_X - 20} y={NOW_Y - 6} textAnchor="end" fontSize={11} fontWeight={700} fill="#dc2626">담보 가치 하락</text>}
              </>
            )}
            {showFan && (
              <>
                {FAN.map((d) => <path key={d} d={d} fill="none" stroke="#64748b" strokeWidth={1} strokeDasharray="4 2" />)}
                <line x1={DEFAULT_X} x2={DEFAULT_X} y1={30} y2={ZERO_Y + 4} stroke="#dc2626" strokeWidth={1} />
                <line x1={REPLACE_X} x2={REPLACE_X} y1={30} y2={ZERO_Y + 4} stroke="#94a3b8" strokeWidth={1} />
                <text x={DEFAULT_X} y={ZERO_Y + 16} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626">부도</text>
                <text x={REPLACE_X} y={ZERO_Y + 16} textAnchor="end" fontSize={11} fill="#64748b">거래 대체</text>
                <text x={(DEFAULT_X + REPLACE_X) / 2} y={ZERO_Y + 32} textAnchor="middle" fontSize={11} fill="#64748b">← 청산기간 →</text>
              </>
            )}
            {showPast && <circle cx={DEFAULT_X} cy={NOW_Y} r={3.5} fill="#475569" />}
          </svg>
        );
      }}
    />
  );
}
