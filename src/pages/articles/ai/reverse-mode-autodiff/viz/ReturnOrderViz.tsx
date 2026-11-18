import SceneShell from "./SceneShell";

/**
 * 본문 대응: 11절 — 원문 backward 반환 순서는 (input, weight, bias).
 * 손계산 w=3(weight), x=2(input), b=0(bias): dL/dw=26, dL/dx=39, dL/db=13.
 * 196행 grad_input=13×3=39, 198행 grad_weight=13×2=26, 200행 grad_bias=13.
 */
const SLOTS = [
  { slot: "grad_input", owner: "input = x = 2", right: "39", rightFrom: "dL/dx = 13×3", wrong: "26" },
  { slot: "grad_weight", owner: "weight = w = 3", right: "26", rightFrom: "dL/dw = 13×2", wrong: "39" },
  { slot: "grad_bias", owner: "bias = b = 0", right: "13", rightFrom: "dL/db = 13×1", wrong: "13" },
] as const;

const SCENES = [
  { label: "손계산은 w부터 적었습니다", summary: "(dL/dw, dL/dx, dL/db) = (26, 39, 13)", note: "8절의 손계산은 w, x, b 순서로 26, 39, 13을 적었습니다. 원문 이름으로는 w가 weight, x가 input입니다." },
  { label: "원문은 input부터 반환합니다", summary: "return (39, 26, 13)", note: "202행은 input, weight, bias 순서로 돌려줍니다. 각 칸에 그 입력의 미분을 넣으면 39, 26, 13입니다." },
  { label: "손계산 순서를 그대로 넣으면", summary: "(26, 39, 13) → 앞 두 칸이 뒤바뀜", note: "26을 grad_input 자리에 넣으면 input은 weight의 미분을, weight는 input의 미분을 받습니다. 숫자 세 개는 모두 맞아 보여도 어느 입력에 돌려주었는지가 틀립니다." },
] as const;

export default function ReturnOrderViz() {
  return (
    <SceneShell
      eyebrow="반환 순서"
      title="같은 세 숫자라도 어느 입력의 자리에 넣었는지까지 맞아야 합니다"
      description="칸 하나가 backward가 돌려주는 자리 하나입니다. 왼쪽부터 원문 202행의 반환 순서입니다."
      ariaLabel="손계산 순서와 원문 backward 반환 순서의 대응"
      scenes={SCENES}
      render={(active) => (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
            {SLOTS.map((slot) => {
              const value = active === 0 ? null : active === 1 ? slot.right : slot.wrong;
              const bad = active === 2 && slot.wrong !== slot.right;
              return (
                <div key={slot.slot} className={`flex min-w-0 flex-col items-center rounded-lg border px-1 py-3 text-center ${bad ? "border-dashed border-[#dc2626]" : value ? "border-[#2563eb]" : "border-border"} bg-background`}>
                  <span className="break-all font-mono text-[11px] font-semibold sm:text-xs">{slot.slot}</span>
                  <span className="mt-1 text-[11px] text-muted-foreground sm:text-xs">{slot.owner}</span>
                  <span className={`mt-2 font-mono text-xl font-bold ${bad ? "text-[#dc2626]" : value ? "text-[#2563eb]" : "text-muted-foreground/50"}`}>{value ?? "?"}</span>
                  <span className="mt-1 min-h-5 text-[11px] sm:text-xs">{active === 1 ? slot.rightFrom : bad ? "다른 입력의 미분" : ""}</span>
                </div>
              );
            })}
          </div>
          <p className="rounded-md border border-border bg-background px-3 py-2 font-mono text-xs sm:text-sm">
            {active === 0 ? "손계산: dL/dw=26 · dL/dx=39 · dL/db=13" : active === 1 ? "return grad_input, grad_weight, grad_bias" : "잘못된 반환: 26, 39, 13"}
          </p>
        </div>
      )}
    />
  );
}
