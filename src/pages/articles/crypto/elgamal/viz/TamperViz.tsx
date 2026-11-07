import SceneShell from "./SceneShell";

/**
 * 본문 대응: #malleability — 모든 계산은 mod 23.
 * (17,5) → 10. (17,10) → 10×2 = 20. (17,5)×(10,1) = (9,5); 9⁶ → 3, 역원 8, 5×8=40 → 17 = 10×4의 나머지.
 */
const SCENES = [
  { label: "원래 암호문", summary: "(17,5) → 10", note: "Bob의 복호는 받은 두 값으로 계산만 합니다. 첫 값으로 가리개를 재현하고 그 역원을 둘째 값에 곱합니다." },
  { label: "둘째 값을 두 배로", summary: "(17,10) → 20", note: "첫 값이 그대로라 가리개 12와 역원 2도 그대로입니다. 복호 결과만 10×2 mod 23=20으로 두 배가 되고, 기본 복호 절차는 오류를 내지 않습니다." },
  { label: "두 암호문을 곱하면", summary: "(9,5) → 17 = 10×4 mod 23", note: "메시지 4를 지수 3으로 가린 (10,1)과 성분별로 곱하면 (9,5)입니다. 복호값 17은 10×4 mod 23으로, 정수 곱 40 전체가 아니라 나머지입니다. 이 성질을 곱셈 준동형이라고 부릅니다." },
] as const;

const ACTS = ["공격자가 손대지 않음", "공격자: 5 → 10", "성분별 곱: (17×10, 5×1) → (9, 5)"] as const;
const FLOWS = [
  [{ k: "받은 암호문", v: "(17, 5)" }, { k: "가리개 재현", v: "17⁶ → 12" }, { k: "역원", v: "12 → 2" }, { k: "복호 결과", v: "5×2 = 10" }],
  [{ k: "받은 암호문", v: "(17, 10)" }, { k: "가리개 재현", v: "17⁶ → 12" }, { k: "역원", v: "12 → 2" }, { k: "복호 결과", v: "10×2 = 20" }],
  [{ k: "받은 암호문", v: "(9, 5)" }, { k: "가리개 재현", v: "9⁶ → 3" }, { k: "역원", v: "3 → 8" }, { k: "복호 결과", v: "5×8=40 → 17" }],
] as const;

export default function TamperViz() {
  return (
    <SceneShell
      eyebrow="암호문 변형"
      title="Bob의 복호 절차는 값이 바뀌어도 그대로 끝까지 계산합니다"
      description="왼쪽에서 오른쪽으로 Bob의 복호 순서입니다. 역원은 곱해서 1이 되는 수이며 계산은 23으로 나눈 나머지입니다."
      ariaLabel="원본, 둘째 값 변조, 두 암호문의 곱이 Bob의 복호 절차를 지나 각각 10, 20, 17이 되는 흐름"
      scenes={SCENES}
      render={(active) => (
        <div>
          <p className={`rounded-lg border px-3 py-2 text-center font-mono text-sm font-bold ${active === 1 ? "border-dashed border-red-600 text-red-700 dark:text-red-400" : "border-border text-muted-foreground"}`}>{ACTS[active]}</p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {FLOWS[active].map((step, index) => {
              const changed = active > 0 && (index === 0 || index === 3 || active === 2);
              return (
                <div key={step.k} className={`rounded-lg border p-2 text-center ${changed ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
                  <p className="text-xs text-muted-foreground"><span aria-hidden>{index + 1}. </span>{step.k}</p>
                  <p className="mt-1 font-mono text-sm font-bold">{step.v}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    />
  );
}
