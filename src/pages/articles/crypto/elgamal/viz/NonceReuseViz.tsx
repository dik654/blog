import SceneShell from "./SceneShell";

/**
 * 본문 대응: #malleability 마지막 문단 — 지수 7 재사용. 10×12→5, 4×12→2.
 * 2÷5: 5의 역원 14, 2×14=28→5. 4÷10: 10의 역원 7, 4×7=28→5. 10×5=50→4.
 */
const SCENES = [
  { label: "첫 값이 같습니다", summary: "(17,5) · (17,2)", note: "지수 7을 재사용하면 첫 값이 17로 같고, 두 메시지에 같은 가리개가 곱해집니다. 점선 칸은 관찰자에게 보이지 않는 값입니다." },
  { label: "둘째 값끼리 나눕니다", summary: "2÷5 mod 23 = 5", note: "나누기는 역원을 곱하는 연산입니다. 5의 역원 14를 2에 곱하면 28의 나머지 5입니다. 관찰자는 공개된 값만으로 이 계산을 합니다." },
  { label: "가리개가 사라집니다", summary: "4÷10 mod 23 = 5", note: "두 둘째 값에 같은 12가 들어 있어 나누면 12가 지워지고 메시지끼리의 비율만 남습니다. 10의 역원 7을 4에 곱해도 28의 나머지 5로 같습니다." },
  { label: "한 메시지를 알면", summary: "10×5 mod 23 = 4", note: "첫 메시지 10을 이미 안다면 비율 5를 곱해 둘째 메시지 4를 복원합니다. 난수 상태가 복제된 서버나 재시작 뒤의 반복도 같은 위험을 만듭니다." },
] as const;

const CIPHERS = [
  { message: "10", second: "5" },
  { message: "4", second: "2" },
] as const;
const CHAIN = [
  { at: 1, label: "둘째 값의 비율", value: "2÷5 → 5" },
  { at: 2, label: "메시지의 비율", value: "4÷10 → 5" },
  { at: 3, label: "10을 알 때 둘째 메시지", value: "10×5 → 4" },
] as const;

export default function NonceReuseViz() {
  return (
    <SceneShell
      eyebrow="비밀 지수 재사용"
      title="같은 가리개를 두 번 쓰면 나눗셈 한 번에 지워집니다"
      description="실선 칸은 관찰자가 보는 값, 점선 칸은 보지 못하는 값입니다. 가리개 12와 메시지는 관찰자에게 숨겨져 있습니다. 계산은 23으로 나눈 나머지입니다."
      ariaLabel="같은 지수로 만든 두 암호문의 둘째 값을 나누어 가리개를 지우고 메시지를 복원하는 과정"
      scenes={SCENES}
      render={(active) => {
        const struck = active >= 2;
        return (
          <div>
            <div className="space-y-2">
              {CIPHERS.map((cipher) => (
                <div key={cipher.message} className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)_minmax(0,1fr)] items-center gap-1.5 text-center font-mono text-sm">
                  <span className="rounded-lg border border-dashed border-border px-1 py-1.5">{cipher.message}</span>
                  <span aria-hidden>×</span>
                  <span className={`rounded-lg border border-dashed px-1 py-1.5 ${struck ? "border-border text-muted-foreground line-through" : "border-border"}`}>12</span>
                  <span aria-hidden>→</span>
                  <span className={`rounded-lg border px-1 py-1.5 font-bold ${active === 1 ? "border-primary bg-primary/10" : "border-border bg-background"}`}>{cipher.second}</span>
                  <span className={`rounded-lg border px-1 py-1.5 font-bold ${active === 0 ? "border-primary bg-primary/10" : "border-border bg-background"}`}>첫 값 17</span>
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {CHAIN.map((step) => (
                <div key={step.label} className={`rounded-lg border p-1.5 text-center ${step.at <= active ? "" : "invisible"} ${step.at === active ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
                  <p className="text-xs text-muted-foreground">{step.label}</p>
                  <p className="mt-1 font-mono text-sm font-bold">{step.value}</p>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
