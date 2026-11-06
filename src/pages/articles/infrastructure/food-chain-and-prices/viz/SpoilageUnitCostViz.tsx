import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 10개 묶음 1,500원(출하 1,000 + 선별·저장 300 + 운송 200).
 * 1,500÷10=150, 1,500÷8=187.5. 소매 500 더해 2,000: 2,000÷10=200, 2,000÷8=250, 500÷8=62.5.
 * 막대 폭은 개수, 높이는 개당 금액이라 넓이가 총액입니다. 버린 2개는 맡는 금액이 없어 막대 없이 X만 둡니다.
 */
const COL_W = 30;
const STEP = 32;
const X0 = 20;
const BASE = 172;
const SCALE = 0.5;
const SPOILED = [8, 9] as const;
const SCENES = [
  { label: "모두 팔리면", summary: "1,500 ÷ 10 = 개당 150원", note: "출하 1,000원, 선별·저장 300원, 운송 200원이 들어 가게에 들어오기까지 1,500원입니다(가정). 10개가 나눠 내면 개당 150원입니다." },
  { label: "2개를 버리면", summary: "1,500 ÷ 8 = 개당 187.5원", note: "버린 2개의 원가가 사라지지 않고 남은 8개로 옮겨 갑니다. 점선이 원래의 150원입니다." },
  { label: "소매 500원까지 회수하려면", summary: "2,000 ÷ 8 = 개당 250원", note: "소매 단계가 총 500원을 추가로 회수해야 한다면 전체 필요액은 2,000원입니다. 위쪽 칸이 소매 몫으로 개당 62.5원(500÷8)이고, 187.5 + 62.5 = 250원입니다." },
  { label: "넓이는 그대로입니다", summary: "10 × 200 = 8 × 250 = 2,000원", note: "폭이 줄어든 만큼 높이가 올랐을 뿐 넓이인 총액은 2,000원으로 같습니다. 200원에서 250원으로 올라도 이 가정에서는 총이익이 늘었다고 볼 수 없습니다." },
] as const;

export default function SpoilageUnitCostViz() {
  return (
    <SceneShell
      eyebrow="폐기와 단가"
      title="두 개가 상하면 같은 총액을 여덟 개가 나눕니다"
      description="막대 하나가 식품 1개, 높이는 그 1개가 맡는 금액입니다. 막대의 넓이를 모두 합치면 총액입니다. 숫자는 모두 가정입니다."
      ariaLabel="10개와 8개가 같은 총액을 나눌 때 개당 금액이 150원에서 187.5원, 250원으로 오르는 막대"
      scenes={SCENES}
      render={(scene) => {
        const count = scene === 0 ? 10 : 8;
        const cost = 1500 / count;
        const retail = scene >= 2 ? 500 / count : 0;
        const top = BASE - (cost + retail) * SCALE;
        const headline = scene === 0 ? "개당 150원" : scene === 1 ? "개당 187.5원" : "개당 250원";
        return (
          <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[scene].label}: ${SCENES[scene].summary}`}>
            {Array.from({ length: count }, (_, index) => (
              <g key={index}>
                <rect x={X0 + index * STEP} y={BASE - cost * SCALE} width={COL_W} height={cost * SCALE} rx={1} fill="#64748b" />
                {retail > 0 && <rect x={X0 + index * STEP} y={top} width={COL_W} height={retail * SCALE - 1} rx={1} fill="#d97706" />}
              </g>
            ))}
            {count === 8 && SPOILED.map((index) => (
              <g key={index}>
                <path d={`M${X0 + index * STEP + 8} ${BASE - 19}l14 14m0 -14l-14 14`} stroke="#dc2626" strokeWidth={1} fill="none" />
              </g>
            ))}
            {scene === 1 && <line x1={X0} x2={X0 + 10 * STEP - 2} y1={BASE - 150 * SCALE} y2={BASE - 150 * SCALE} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />}
            {scene === 3 && <rect x={X0 + 0.5} y={BASE - 200 * SCALE + 0.5} width={10 * STEP - 3} height={200 * SCALE - 0.5} fill="none" stroke="#2563eb" strokeWidth={1.25} strokeDasharray="5 3" />}
            <line x1={X0 - 5} x2={X0 + 10 * STEP + 3} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
            <text x={X0} y={top - 7} fontSize={13} fontWeight={700} fill="#2563eb">{headline}</text>
            {scene === 3 && <text x={X0 + 8 * STEP + 3} y={BASE - 200 * SCALE - 7} fontSize={13} fontWeight={700} fill="#2563eb">10개×200원</text>}
            <text x={X0 + (count * STEP) / 2} y={BASE + 18} textAnchor="middle" fontSize={13} fill="#64748b">판매 {count}개</text>
            {count === 8 && <text x={X0 + 9 * STEP - 1} y={BASE + 18} textAnchor="middle" fontSize={13} fontWeight={700} fill="#dc2626">버림 2개</text>}
          </svg>
        );
      }}
    />
  );
}
