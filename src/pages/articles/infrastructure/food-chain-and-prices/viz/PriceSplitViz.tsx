import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 100 + 30 + 20 + 50 = 200(가정), 농가 몫 100 ÷ 200 = 50%.
 * 추가 금액 안의 비용과 이익은 글에 크기가 없어 칸을 나누지 않습니다.
 */
const X0 = 15;
const UNIT = 330 / 200;
const PARTS = [
  { label: "농가 출하", amount: 100, fill: "#16a34a" },
  { label: "선별·저장", amount: 30, fill: "#2563eb" },
  { label: "운송", amount: 20, fill: "#64748b" },
  { label: "소매", amount: 50, fill: "#d97706" },
] as const;
const STARTS = PARTS.map((_, index) => PARTS.slice(0, index).reduce<number>((sum, part) => sum + part.amount, 0));
const LIMIT = [1, 3, 4, 4] as const;

const SCENES = [
  { label: "농가에서 나올 때", summary: "100원", note: "같은 품질의 식품 한 단위가 모두 판매된다고 놓습니다(가정). 농가 출하액은 100원입니다. 막대 전체 칸은 소비자가 내는 200원입니다." },
  { label: "중간 두 단계가 더합니다", summary: "100 + 30 + 20 = 150원", note: "선별·저장 단계 30원과 운송 단계 20원이 더해집니다. 칸 안의 금액에는 각 단계의 비용과 이익이 함께 들어 있습니다." },
  { label: "가게가 더합니다", summary: "150 + 50 = 200원", note: "소매 단계 50원이 더해져 소비자가 200원을 냅니다. 세금은 생략했습니다." },
  { label: "반으로 갈라 읽기", summary: "농가 몫 100 ÷ 200 = 50%", note: "나머지 50%가 유통업자의 순이익은 아닙니다. 추가 금액에서 노동과 전기, 임차료 같은 비용을 빼야 각 사업자의 이익이 남습니다. 비용과 이익의 크기는 사례에 없어 칸을 나누지 않았습니다." },
] as const;

export default function PriceSplitViz() {
  return (
    <SceneShell
      eyebrow="한 단위의 가격"
      title="소비자의 200원을 네 칸으로 나눕니다"
      description="막대 폭은 금액에 비례합니다. 숫자는 모두 가정이며 세금은 뺐습니다."
      ariaLabel="농가 100원, 선별 저장 30원, 운송 20원, 소매 50원이 쌓여 200원이 되는 막대"
      scenes={SCENES}
      render={(scene) => (
        <svg viewBox="0 0 360 150" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[scene].label}: ${SCENES[scene].summary}`}>
          <rect x={X0 + 0.5} y={28.5} width={329} height={35} rx={2} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
          {PARTS.slice(0, LIMIT[scene]).map((part, index) => (
            <g key={part.label}>
              <rect x={X0 + STARTS[index] * UNIT} y={28} width={part.amount * UNIT} height={36} fill={part.fill} stroke="#ffffff" strokeWidth={1} />
              <text x={X0 + (STARTS[index] + part.amount / 2) * UNIT} y={51} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">{part.amount}</text>
              <text x={X0 + (STARTS[index] + part.amount / 2) * UNIT} y={20} textAnchor="middle" fontSize={13} fontWeight={700} fill={part.fill}>{part.label}</text>
            </g>
          ))}
          {scene === 3 && (
            <>
              <path d={`M${X0 + 1} 72v8H${X0 + 164}v-8`} fill="none" stroke="#16a34a" strokeWidth={1} />
              <path d={`M${X0 + 166} 72v8H${X0 + 329}v-8`} fill="none" stroke="#d97706" strokeWidth={1} />
              <text x={X0 + 82} y={98} textAnchor="middle" fontSize={13} fontWeight={700} fill="#16a34a">농가 몫 50%</text>
              <text x={X0 + 248} y={98} textAnchor="middle" fontSize={13} fontWeight={700} fill="#d97706">추가 금액 50%</text>
              <text x={X0 + 248} y={118} textAnchor="middle" fontSize={13} fontWeight={700} fill="#d97706">= 비용 + 이익</text>
              <text x={X0 + 248} y={138} textAnchor="middle" fontSize={13} fill="#64748b">순이익과 같지 않음</text>
            </>
          )}
        </svg>
      )}
    />
  );
}
