import FrobSceneShell from "./FrobSceneShell";

/**
 * 본문 대응: #in-final-exp, #large-case — E=(p¹²−1)/r=(p⁶−1)(p²+1)H, H=(p⁴−p²+1)/r.
 * a=φ⁶(x)x⁻¹ (켤레와 역원 한 번) → 노름 1, b=φ²(a)a, 마지막 b^H는 따로 거듭제곱(BN254에서 H는 761비트).
 */
const FACTORS = [
  { text: "p⁶−1", scene: 1 },
  { text: "p²+1", scene: 2 },
  { text: "H = (p⁴−p²+1)/r", scene: 3 },
] as const;

const STEPS = [
  { from: "x", expr: "a = φ⁶(x) · x⁻¹", how: "켤레 + 역원 한 번", tag: "Frobenius" },
  { from: "a", expr: "b = φ²(a) · a", how: "p²제곱 + 곱 한 번", tag: "Frobenius" },
  { from: "b", expr: "b^H", how: "남은 지수를 따로 거듭제곱", tag: "hard part" },
] as const;

const SCENES = [
  { label: "지수를 쪼갭니다", summary: "p¹²−1 = (p⁶−1)(p⁶+1)", note: "차의 제곱으로 p¹²−1을 두 인수로 나누고, p⁶+1을 다시 (p²+1)(p⁴−p²+1)로 나눕니다. r이 마지막 인수를 나누는 구성이라 H는 정수입니다." },
  { label: "첫 인수 p⁶−1", summary: "a = φ⁶(x)/x", note: "x는 0 아닌 Miller 결과입니다. φ⁶는 이 이차 위층의 켤레이므로 x의 p⁶−1제곱은 켤레 φ⁶(x)에 역원 x⁻¹을 한 번 곱해 얻습니다. 이렇게 만든 a는 12절의 y처럼 노름 1입니다." },
  { label: "둘째 인수 p²+1", summary: "b = φ²(a) · a", note: "p²제곱은 Frobenius 두 번으로, +1은 곱 한 번으로 처리합니다. 14절의 BN254 검증 입력 M에서도 b는 M을 직접 (p⁶−1)(p²+1)제곱한 값과 같았습니다." },
  { label: "남은 인수 H", summary: "b^H · H는 761비트", note: "Frobenius가 앞의 두 인수를 빠르게 처리해도 H는 남습니다. 같은 M의 실행에서 b^H는 M의 전체 E제곱과 같았고 r제곱하면 1이었습니다. 페어링 함수를 실행한 실험은 아닙니다." },
] as const;

function Picture({ scene }: { scene: number }) {
  return (
    <div className="min-w-0 space-y-4">
      <div className="rounded-lg border border-border bg-background p-3">
        <p className="text-xs text-muted-foreground">마지막 지수 E = (p¹²−1)/r</p>
        <div className="mt-2 flex flex-wrap items-center gap-2 font-mono text-sm">
          {FACTORS.map((factor, index) => (
            <span key={factor.text} className="flex items-center gap-2">
              {index > 0 && <span className="text-muted-foreground">×</span>}
              <span
                className={`rounded-md border px-2 py-1 ${scene === 0 || scene === factor.scene ? "border-[#2563eb] bg-[#dbeafe] font-bold text-[#1e3a8a]" : scene > factor.scene ? "border-border text-muted-foreground line-through" : "border-border"}`}
              >
                {factor.text}
              </span>
            </span>
          ))}
        </div>
        <p className="mt-2 font-mono text-xs leading-5 text-muted-foreground">p⁶+1 = (p²+1)(p⁴−p²+1)</p>
      </div>
      <ol className="space-y-2">
        {STEPS.map((step, index) => {
          const current = scene === index + 1;
          const done = scene > index + 1;
          const hard = step.tag === "hard part";
          return (
            <li
              key={step.expr}
              className={`grid grid-cols-[2rem_minmax(0,1fr)] items-start gap-3 rounded-lg border p-3 ${current ? (hard ? "border-[#d97706] bg-[#fef3c7]/60" : "border-[#2563eb] bg-[#dbeafe]/50") : "border-border"} ${scene === 0 || (!current && !done) ? "opacity-50" : ""}`}
            >
              <span className="font-mono text-sm text-muted-foreground">{step.from} →</span>
              <span className="min-w-0">
                <span className="block font-mono text-sm font-bold">{step.expr}</span>
                <span className="mt-1 flex flex-wrap gap-x-2 text-xs text-muted-foreground">
                  <span>{step.how}</span>
                  <span className={hard ? "text-[#b45309]" : "text-[#1d4ed8]"}>· {step.tag}</span>
                  {index === 0 && done && <span>· a는 노름 1</span>}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function FinalExpStepsViz() {
  return (
    <FrobSceneShell
      eyebrow="마지막 지수의 세 인수"
      title="두 인수는 Frobenius로 처리하고 H만 따로 거듭제곱합니다"
      description="위 칸은 지수의 세 인수이고 아래 줄은 그 인수를 하나씩 처리하는 순서입니다. 처리한 인수는 줄을 그어 표시했습니다. 입력과 표가 같은 BN254 구성이라는 전제를 씁니다."
      ariaLabel="마지막 지수를 세 인수로 나누고 x에서 a, b, b의 H제곱으로 가는 순서"
      scenes={SCENES}
      render={(index) => <Picture scene={index} />}
    />
  );
}
