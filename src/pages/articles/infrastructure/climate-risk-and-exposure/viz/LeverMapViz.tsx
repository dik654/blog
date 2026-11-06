import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 개발 제한·방재·보험·경보가 각각 어느 칸을 바꾸는가.
 * 네 칸: 그곳의 자산 × 손상 비율 = 직접 자산 손실 → 나누기, 그리고 식 밖의 인명 보호.
 * 조치의 효과는 금액으로 정하지 않고 본문의 "수 있습니다"를 유지한다.
 */
const SLOTS = [
  { key: "asset", name: "그곳의 자산", value: "300 (가정)", op: "" },
  { key: "rate", name: "손상 비율", value: "20% (가정)", op: "×" },
  { key: "loss", name: "직접 자산 손실", value: "60 (가정)", op: "=" },
  { key: "share", name: "사고 뒤 돈 나누기", value: "다른 지급자와", op: "→" },
] as const;

type SlotKey = (typeof SLOTS)[number]["key"] | "life";

const SCENES: readonly { label: string; summary: string; on: readonly SlotKey[]; tag: string; note: string }[] = [
  { label: "개발 제한", summary: "그곳의 자산을 바꿉니다", on: ["asset"], tag: "줄일 수 있음", note: "위험한 곳에 새 건물을 짓지 않으면 그곳에 놓이는 자산을 줄일 수 있습니다. 손실도 그 곱만큼 달라지지만, 비용과 주민이 이동할 때의 부담은 남습니다." },
  { label: "배수·건물 보강", summary: "손상 비율을 바꿉니다", on: ["rate"], tag: "낮출 수 있음", note: "배수와 건물 보강은 같은 사건에서 손상될 비율을 낮출 수 있습니다. 자산은 그 자리에 그대로 있고, 공사의 비용도 남습니다." },
  { label: "보험", summary: "사고 뒤의 돈을 나눕니다", on: ["share"], tag: "바뀌는 칸", note: "보험금은 사고 뒤 복구에 쓸 돈을 나눠 주지만 사고 당시 건물이 손상되는 비율을 직접 낮추지는 않습니다. 손상 비율 칸은 그대로입니다." },
  { label: "경보와 대피", summary: "이 식 밖의 가치입니다", on: ["life"], tag: "식 밖", note: "경보와 대피는 인명 보호에 도움이 됩니다. 위 네 칸은 자산 손실과 그 배분만 세므로, 네 칸이 움직이지 않는다고 경보의 가치가 없다고 평가할 수 없습니다." },
];

export default function LeverMapViz() {
  return (
    <SceneShell
      eyebrow="보호 수단의 자리"
      title="네 가지 수단이 건드리는 칸은 서로 다릅니다"
      description="위 네 칸은 앞 절의 지역 B 계산에 사고 뒤 돈 나누기를 붙인 것입니다(가정). 진한 테두리가 그 수단이 닿는 칸입니다."
      ariaLabel="개발 제한, 방재, 보험, 경보가 바꾸는 항목"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        const lit = (key: SlotKey) => s.on.includes(key);
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {SLOTS.map((slot) => (
                <div key={slot.key} className={`flex min-h-[6.25rem] flex-col rounded-lg border px-2.5 py-2 ${lit(slot.key) ? "border-primary bg-primary/10" : "border-border/70"}`}>
                  <span className="text-xs leading-5 text-muted-foreground">
                    {slot.op && <span className="mr-1 font-mono font-bold">{slot.op}</span>}
                    {slot.name}
                  </span>
                  <span className={`mt-1 text-sm font-bold leading-5 ${lit(slot.key) ? "" : "text-muted-foreground"}`}>{slot.value}</span>
                  <span className={`mt-auto pt-1 text-xs font-bold leading-5 text-primary ${lit(slot.key) ? "" : "invisible"}`}>{s.tag}</span>
                </div>
              ))}
            </div>
            <div className={`mt-2 flex flex-wrap items-baseline justify-between gap-x-3 rounded-lg border border-dashed px-2.5 py-2 ${lit("life") ? "border-primary bg-primary/10" : "border-border/70"}`}>
              <span className={`text-sm leading-5 ${lit("life") ? "font-bold" : "text-muted-foreground"}`}>인명 보호 · 자산 손실 계산에 안 들어감</span>
              <span className={`text-xs font-bold leading-5 text-primary ${lit("life") ? "" : "invisible"}`}>{s.tag}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
