import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 계산 전에 보장 사건인지 확인합니다. 300·20·230·70은 4절의 가정 수치입니다.
 * 홍수 쪽은 미국 NFIP 안내(2026-10-04 확인)이며 "지급하지 않을 수 있습니다"의 조건을 유지합니다.
 */
const SCENES = [
  { label: "먼저 계약 안의 사고인지 봅니다", summary: "손실 300만 원(가정)", note: "지급자가 사고의 종류와 계약 기간, 손실 자료를 확인합니다. 그 전에는 어느 갈래로 갈지 정해지지 않습니다." },
  { label: "보장되는 사건이면", summary: "지급 230 · 가입자 70만 원", note: "4절의 가정 계약이라면 자기부담금 20만 원과 지급 한도 230만 원을 적용합니다. 지급은 230만 원, 남은 손실은 70만 원입니다." },
  { label: "면책된 홍수라면", summary: "한도 계산 전에 멈춤", note: "미국 NFIP 안내는 일반적인 주택보험 대부분이 홍수 피해를 보장하지 않는다고 설명합니다(2026-10-04 확인). 다른 나라 약관에 그대로 쓸 수 없습니다." },
] as const;

function Lane({ on, title, steps, end }: { on: boolean; title: string; steps: readonly string[]; end: string }) {
  return (
    <div className={`rounded-lg border p-2.5 text-xs leading-5 sm:p-3 sm:text-sm sm:leading-6 ${on ? "border-primary" : "border-border/50 opacity-45"}`}>
      <p className="font-bold">{title}</p>
      <ol className="mt-1 text-muted-foreground">
        {steps.map((step) => (
          <li key={step}>↓ {step}</li>
        ))}
      </ol>
      <p className="mt-1 font-bold">{end}</p>
    </div>
  );
}

export default function CoveredBranchViz() {
  return (
    <SceneShell
      eyebrow="계산 앞의 갈림길"
      title="같은 손실도 계약 안의 사건인지에 따라 다른 길로 갑니다"
      description="면책은 계약이 지급하지 않는 사고나 조건입니다. 금액은 가정이며 실제 상품 조건이 아닙니다."
      ariaLabel="손실 300만 원이 보장 사건이면 계산으로, 면책 사건이면 계산 전에 멈추는 갈림길"
      scenes={SCENES}
      render={(scene) => (
        <div className="space-y-3">
          <div className={`rounded-lg border p-3 text-sm leading-6 ${scene === 0 ? "border-primary" : "border-border/70"}`}>
            <p className="font-bold">확인: 이 계약이 약속한 사건인가요?</p>
            <p className="text-muted-foreground">사고 종류 · 유효한 계약 기간 · 손실 자료</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <Lane on={scene === 1} title="예 → 보장되는 사건" steps={["자기부담금 20만 원", "지급 한도 230만 원"]} end="지급 230만 · 남은 손실 70만 원" />
            <Lane on={scene === 2} title="아니요 → 면책" steps={["계산 전에 멈춤", "지급 안 할 수 있음"]} end="지급이 없으면 남은 손실 300만 원" />
          </div>
        </div>
      )}
    />
  );
}
