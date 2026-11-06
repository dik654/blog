import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — FAO의 네 기능에 사례 금액을 배치합니다. 생산 100, 집하 30, 가공 없음, 유통 50,
 * 운송 20은 지원 서비스. 100 + 30 + 50 + 20 = 200.
 */
const SLOTS = [
  { name: "생산", hint: "농업·어업 등", value: "100원", detail: "농가 출하" },
  { name: "집하", hint: "aggregation", value: "30원", detail: "선별·저장" },
  { name: "가공", hint: "processing", value: "없음", detail: "" },
  { name: "유통", hint: "도매·소매", value: "50원", detail: "소매" },
] as const;

const SCENES = [
  { label: "FAO의 네 기능", summary: "생산 · 집하 · 가공 · 유통", note: "FAO는 가치사슬의 행위자가 이 네 기능을 맡는다고 설명합니다. 집하는 모으는 일입니다. 한 회사가 여러 기능을 맡을 수도 있습니다." },
  { label: "사례 금액을 칸에 넣습니다", summary: "100 · 30 · 없음 · 50원", note: "농가 출하 100원은 생산, 선별·저장 30원은 집하, 소매 50원은 유통입니다. 이 사례에는 가공 단계가 없어 그 칸이 비고 운송 20원이 아직 남아 있습니다." },
  { label: "운송은 네 칸 밖에 놓습니다", summary: "100 + 30 + 50 + 20 = 200원", note: "운송 20원은 네 기능 가운데 하나가 아니라 FAO 그림 3의 지원 서비스 제공자(support providers)에 가깝습니다. 이렇게 놓아도 합은 200원으로 맞습니다." },
] as const;

export default function FunctionMapViz() {
  return (
    <SceneShell
      eyebrow="공식 분류에 대응"
      title="200원의 조각을 FAO의 네 칸과 그 바깥에 놓습니다"
      description="금액은 이 글의 가정이고, 칸의 이름만 FAO의 설명에서 왔습니다. 금액이 칸의 크기를 정하지는 않습니다."
      ariaLabel="생산, 집하, 가공, 유통 네 기능과 지원 서비스에 사례 금액을 배치"
      scenes={SCENES}
      render={(scene) => (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {SLOTS.map((slot) => {
              const empty = slot.value === "없음";
              return (
                <div key={slot.name} className={`min-w-0 rounded-lg border px-2 py-2 text-center ${empty && scene > 0 ? "border-dashed border-border" : "border-border"}`}>
                  <p className="text-sm font-bold leading-5">{slot.name} <span className="text-xs font-normal text-muted-foreground">{slot.hint}</span></p>
                  <p className={`mt-1 text-xs leading-5 ${scene === 0 ? "invisible" : "text-muted-foreground"}`}>
                    <span className={`font-mono text-sm font-bold ${empty ? "" : "text-primary"}`}>{slot.value}</span> {slot.detail}
                  </p>
                </div>
              );
            })}
          </div>
          <div className={`rounded-lg border px-2 py-2 text-center ${scene === 2 ? "border-primary" : "border-dashed border-border/60"}`}>
            <p className="text-sm font-bold">지원 서비스 제공자 (support providers)</p>
            <p className={`font-mono text-sm font-bold text-primary ${scene === 2 ? "" : "invisible"}`}>운송 20원</p>
          </div>
        </div>
      )}
    />
  );
}
