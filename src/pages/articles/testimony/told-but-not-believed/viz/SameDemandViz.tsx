import SceneShell from "./SceneShell";

/**
 * 본문 대응: three-accounts 절 — 첫째·둘째 설명의 사건 순서.
 * 두 설명 모두 "지휘권 요구"에 이르지만 그 앞에 놓인 사건이 달라 요구의 뜻이 갈린다.
 * 사건과 순서는 본문(헤로도토스 7권 148~152절을 옮긴 서술)에 적힌 것만 쓴다.
 * 두 줄을 같은 행 높이로 맞춰 "지휘권 요구" 칸이 나란히 놓이게 한다.
 */
const LANES = [
  {
    key: "a",
    tag: "첫째 · 아르고스인이 말한다",
    lead: 1,
    color: "#0ea5e9",
    steps: ["바르바로이가 움직인다는 소식을 먼저 앎", "델포이의 답: 창을 거두어 잘 지켜라", "그리스 사절이 옴"],
    demand: "30년 화평 + 지휘권 절반을 요구",
    after: "스파르타: 왕이 둘이라 양보 못 함 → 아르고스가 사절에게 떠나라고 통고",
    reading: "요구 = 조건 · 책임은 스파르타 쪽",
  },
  {
    key: "b",
    tag: "둘째 · 헬라스에 돌던 이야기",
    lead: 0,
    color: "#f59e0b",
    steps: ["원정 전 크세르크세스의 사자: 혈연을 들어 가만히 있으라", "크게 여김 → 처음엔 돕지도, 몫을 달라지도 않음", "그리스 쪽이 끌어들이려 함 · 스파르타가 거절하리라 앎"],
    demand: "지휘권을 요구",
    after: "가만히 있을 구실을 얻음",
    reading: "요구 = 구실 · 책임이 아르고스로",
  },
] as const;

const SCENES = [
  {
    label: "첫째 설명의 순서",
    summary: "신탁 → 사절 → 조건 → 거절",
    note: "아르고스인의 말대로라면 신탁을 받은 뒤 사절이 왔고, 아르고스는 30년 화평과 지휘권 절반을 조건으로 걸었습니다. 스파르타가 왕이 둘이라 양보할 수 없다고 하자 사절을 돌려보냈습니다. 이 순서에서 지휘권 요구는 맞지 않은 조건입니다.",
  },
  {
    label: "둘째 설명의 순서",
    summary: "페르시아의 사자 → 침묵 → 구실",
    note: "헬라스에 돌던 이야기에서는 요구보다 앞에 크세르크세스의 사자가 있습니다. 아르고스는 그 말을 크게 여겨 처음엔 가만히 있었고, 끌어들이려 하자 스파르타가 거절하리라는 것을 알고 지휘권을 요구했습니다. 이 순서에서 같은 요구는 가만히 있을 구실입니다.",
  },
  {
    label: "같은 행동, 다른 앞 단계",
    summary: "요구만 보면 둘을 가릴 수 없음",
    note: "두 줄 모두 지휘권 요구라는 같은 칸을 지납니다. 갈리는 것은 그 앞에 무엇이 놓였느냐이고, 요구 자체만 보아서는 어느 줄이 맞는지 가릴 수 없습니다. 저자도 어느 쪽이 맞는지 확실히 말할 수 없다고 적습니다.",
  },
] as const;

const DASH = "#cbd5e1";
const DEMAND = "#64748b";

export default function SameDemandViz() {
  return (
    <SceneShell
      eyebrow="같은 요구, 두 순서"
      title="지휘권 요구는 그 앞에 놓인 사건에 따라 조건도 되고 구실도 됩니다"
      description="왼쪽 줄과 오른쪽 줄이 각 설명이 전하는 사건 순서입니다. 굵은 테두리 칸이 두 설명에 똑같이 나오는 행동, 지휘권 요구입니다. 마지막 장면에서 색 테두리로 바뀌는 칸이 두 설명이 요구 앞에 놓는 사건입니다."
      note="사건과 순서는 헤로도토스 『역사』 7권 148~152절을 옮긴 본문의 것입니다. 셋째 설명(페르시아를 불러들였다는 이야기)은 지휘권 요구를 다루지 않아 이 그림에서 뺐습니다."
      ariaLabel="첫째 설명과 둘째 설명이 같은 지휘권 요구에 이르는 서로 다른 사건 순서"
      scenes={SCENES}
      render={(active) => {
        const lit = (lane: number) => active === 2 || active === lane;
        const cell = (lane: number) =>
          `min-w-0 rounded-md border px-1.5 py-1 text-[11px] leading-4 sm:px-2 sm:text-xs sm:leading-5 transition-opacity duration-300 motion-reduce:transition-none ${lit(lane) ? "opacity-100" : "opacity-30"}`;
        return (
          <div className="grid min-w-0 grid-cols-2 gap-x-2 gap-y-1.5 sm:gap-x-4">
            {LANES.map((lane, i) => (
              <p key={`${lane.key}-tag`} className={`${cell(i)} font-bold`} style={{ color: lane.color, borderColor: "transparent" }}>
                {lane.tag}
              </p>
            ))}
            {[0, 1, 2].map((step) =>
              LANES.map((lane, i) => {
                const lead = active === 2 && step === lane.lead;
                return (
                  <p
                    key={`${lane.key}-${step}`}
                    className={cell(i)}
                    style={{ borderColor: lead ? lane.color : DASH, borderStyle: lead ? "solid" : "dashed", fontWeight: lead ? 700 : 400 }}
                  >
                    {step + 1}. {lane.steps[step]}
                  </p>
                );
              }),
            )}
            {LANES.map((lane, i) => (
              <p key={`${lane.key}-demand`} className={`${cell(i)} font-bold`} style={{ borderColor: DEMAND, borderWidth: 2 }}>
                4. {lane.demand}
              </p>
            ))}
            {LANES.map((lane, i) => (
              <p key={`${lane.key}-after`} className={cell(i)} style={{ borderColor: DASH, borderStyle: "dashed" }}>
                5. {lane.after}
              </p>
            ))}
            {LANES.map((lane, i) => (
              <p key={`${lane.key}-reading`} className={`${cell(i)} font-bold`} style={{ color: lane.color, borderColor: "transparent" }}>
                {lane.reading}
              </p>
            ))}
          </div>
        );
      }}
    />
  );
}
