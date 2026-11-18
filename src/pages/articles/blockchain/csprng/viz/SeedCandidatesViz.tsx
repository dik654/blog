import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 시작값 0~7(균등, 가정) 중 3. 출력은 32바이트지만 첫 출력 후보는 많아야 8개.
 * 3의 첫 출력 323e…afe5, 두 번째 dbf1…ea03. 다른 후보의 출력은 본문이 값을 주지 않아 표시하지 않음.
 */
const SEEDS = [0, 1, 2, 3, 4, 5, 6, 7] as const;
const CHOSEN = 3;

const SCENES = [
  { label: "서버가 하나를 고릅니다", summary: "후보 8개 · 출력 256비트", step: 0, note: "서버는 0~7 중 3을 골랐지만 공격자는 무엇을 골랐는지 모릅니다. 대신 후보가 이 여덟 칸뿐이라는 시작 규칙은 압니다(가정). 공개된 것은 32바이트 첫 출력 하나입니다." },
  { label: "여덟 후보를 모두 실행", summary: "8번 계산 = 첫 출력 후보 8개", step: 1, note: "같은 알고리즘에 0부터 7까지 넣으면 첫 출력 후보가 여덟 개 나옵니다. 출력이 32바이트여도 후보는 여덟 개보다 많아지지 않습니다. 9절의 실행에서 여덟 출력은 모두 달랐습니다." },
  { label: "관찰값과 맞춰 봅니다", summary: "323e… = 후보 3", step: 2, note: "공개된 첫 출력 323e…afe5와 같은 후보는 3 하나입니다. 다른 일곱 후보는 여기서 빠집니다." },
  { label: "다음 출력도 계산합니다", summary: "후보 3 → dbf1…ea03", step: 3, note: "시작값을 알아냈으니 같은 순서로 두 번째 출력 dbf1…ea03도 미리 계산할 수 있습니다. 복잡해 보이는 모양은 예측을 막지 못했습니다." },
] as const;

export default function SeedCandidatesViz() {
  return (
    <SceneShell
      eyebrow="여덟 후보 열거"
      title="32바이트 출력도 후보 여덟 개를 넘지 못합니다"
      description="칸 하나가 공격자가 시험할 시작값 하나입니다. 0~7을 같은 확률로 고르는 잘못된 서버는 본문의 가정입니다. 다른 후보의 출력값은 본문에 없어서 적지 않았습니다."
      ariaLabel="시작값 후보 여덟 개를 모두 실행해 관찰한 출력과 맞추는 과정"
      scenes={SCENES}
      render={(active) => {
        const { step } = SCENES[active];
        return (
          <div className="min-w-0 space-y-4">
            <div className="grid grid-cols-8 gap-1 sm:gap-2">
              {SEEDS.map((seed) => {
                const isChosen = seed === CHOSEN;
                const eliminated = step >= 2 && !isChosen;
                const found = step >= 2 && isChosen;
                const border = found ? "#2563eb" : eliminated ? "#cbd5e1" : step >= 1 ? "#64748b" : "#94a3b8";
                return (
                  <div
                    key={seed}
                    className="rounded-md border px-0 py-1.5 text-center sm:py-2"
                    style={{ borderColor: border, borderStyle: eliminated ? "dashed" : "solid", backgroundColor: found ? "#2563eb1f" : "transparent" }}
                  >
                    <span className={`block font-mono text-base font-bold ${eliminated ? "text-muted-foreground/50" : ""}`}>{seed}</span>
                    <span className={`block whitespace-nowrap text-[10px] leading-4 sm:text-[11px] ${found ? "font-bold text-[#2563eb]" : "text-muted-foreground"}`}>
                      {step === 0 ? "?" : found ? "323e…" : eliminated ? "불일치" : "계산함"}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p className="rounded-md border border-border bg-background px-3 py-2">
                <span className="block text-xs text-muted-foreground">공개된 첫 출력 (32바이트)</span>
                <span className="font-mono font-semibold">323e…afe5</span>
              </p>
              <p className="rounded-md border px-3 py-2" style={{ borderColor: step === 3 ? "#2563eb" : "#cbd5e1", borderStyle: step === 3 ? "solid" : "dashed" }}>
                <span className="block text-xs text-muted-foreground">{step === 3 ? "두 번째 출력 (예측)" : "두 번째 출력"}</span>
                <span className={`font-mono font-semibold ${step === 3 ? "text-[#2563eb]" : "text-muted-foreground/60"}`}>{step === 3 ? "dbf1…ea03" : "아직 모름"}</span>
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}
