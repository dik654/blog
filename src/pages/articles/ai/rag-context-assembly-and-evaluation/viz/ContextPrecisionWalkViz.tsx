import SceneShell from "./SceneShell";

/**
 * 본문 대응: #metrics — context precision 계산.
 * 원 후보 [d-22, d-17, d-31, d-04], v=[0,1,0,1] → P@2=1/2, P@4=2/4 → CP@4=(0.5+0.5)/2=0.5.
 * 최종 문맥 [d-17, d-04], v=[1,1] → P@1=1, P@2=1 → 1.0.
 */
type Slot = { id: string; rel: 0 | 1 };

const ORIGINAL: readonly Slot[] = [
  { id: "d-22", rel: 0 },
  { id: "d-17", rel: 1 },
  { id: "d-31", rel: 0 },
  { id: "d-04", rel: 1 },
];
const FINAL: readonly Slot[] = [
  { id: "d-17", rel: 1 },
  { id: "d-04", rel: 1 },
];

/** k번째까지의 관련 개수 / k */
function precisionAt(slots: readonly Slot[], k: number) {
  const hits = slots.slice(0, k).reduce<number>((sum, slot) => sum + slot.rel, 0);
  return { hits, k };
}

const SCENES = [
  {
    label: "원 후보 순위에 관련 여부를 붙입니다",
    summary: "v = [0, 1, 0, 1]",
    note: "v_k는 k번째 결과가 관련 있으면 1, 아니면 0입니다. 사후 판정상 q-732에는 d-17·d-04만 관련이 있어 2위와 4위가 1입니다.",
  },
  {
    label: "칸마다 k번째까지의 precision을 적습니다",
    summary: "0/1 · 1/2 · 1/3 · 2/4",
    note: "P@k는 1위부터 k위까지 중 관련 결과의 비율입니다. 앞에서부터 한 칸씩 늘리며 다시 셉니다.",
  },
  {
    label: "관련 칸의 값만 골라 평균합니다",
    summary: "(0.5 + 0.5) / 2 = 0.5",
    note: "v_k가 1인 2위·4위의 P@k만 더하고, top 4 안의 관련 항목 수 2로 나눕니다. 관련 근거가 뒤로 밀릴수록 이 평균이 작아집니다.",
  },
  {
    label: "최종 문맥에는 관련 근거만 남았습니다",
    summary: "(1 + 1) / 2 = 1.0",
    note: "선택 뒤 [d-17, d-04]는 v=[1,1]이라 1.0입니다. 이 값만으로 답변이 옳다는 사실까지 보장하지는 않습니다.",
  },
] as const;

function Row({ slots, showP, highlightRel }: { slots: readonly Slot[]; showP: boolean; highlightRel: boolean }) {
  return (
    <ol className="grid grid-cols-4 gap-2">
      {slots.map((slot, index) => {
        const { hits, k } = precisionAt(slots, index + 1);
        const counted = highlightRel && slot.rel === 1;
        return (
          <li
            key={slot.id}
            className={`flex min-w-0 flex-col items-center gap-1 rounded-lg border px-1 py-2 text-center ${
              counted ? "border-primary" : "border-border"
            }`}
          >
            <span className="font-mono text-[11px] text-muted-foreground">{index + 1}위</span>
            <span className="font-mono text-sm font-bold">{slot.id}</span>
            <span className={`text-[11px] ${slot.rel ? "font-bold text-primary" : "text-muted-foreground"}`}>
              {slot.rel ? "관련 · v=1" : "무관 · v=0"}
            </span>
            <span className={`font-mono text-xs ${showP ? "" : "invisible"} ${counted ? "font-bold text-primary" : highlightRel ? "text-muted-foreground/50" : ""}`}>
              P@{k} = {hits}/{k}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export default function ContextPrecisionWalkViz() {
  return (
    <SceneShell
      eyebrow="Context precision 계산"
      title="관련 근거가 나온 자리의 precision만 평균합니다"
      description="칸 하나가 검색 결과 한 건이고 왼쪽이 1위입니다. 관련 여부는 본문의 사후 판정(d-17·d-04만 관련)을 그대로 씁니다."
      ariaLabel="원 후보 순위에서 context precision 0.5, 최종 문맥에서 1.0을 계산"
      scenes={SCENES}
      render={(active) => {
        const final = active === 3;
        return (
          <div className="min-h-[11rem]">
            <p className="mb-2 text-xs text-muted-foreground">{final ? "최종 문맥 순서" : "원 후보 순서"}</p>
            <Row slots={final ? FINAL : ORIGINAL} showP={active >= 1} highlightRel={active >= 2} />
            <p className="mt-4 font-mono text-sm">
              {active === 0 && "관련 항목 수 = 2"}
              {active === 1 && "P@k = (k위까지 관련 수) / k"}
              {active === 2 && "CP@4 = (1/2 + 2/4) / 2 = 0.5"}
              {active === 3 && "CP@2 = (1/1 + 2/2) / 2 = 1.0"}
            </p>
          </div>
        );
      }}
    />
  );
}
