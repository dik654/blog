import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #verification ExplainedFormula —
 * F = D + v[a] + v²[b] + ⋯ (약정 결합), E = r₀ + v·a(ζ) + v²·b(ζ) + ⋯ (평가값 결합, 같은 순서),
 * 두 opening을 u로 결합해 e(−(W_ζ+uW_ζω),[τ]₂)·e(ζW_ζ+uζωW_ζω+F−E,[1]₂)=1 이면 Ok(()).
 * 세 번째 이후 항은 본문처럼 ⋯로 둔다.
 */
const TERMS = [
  { coef: "1", commit: "D", value: "r₀" },
  { coef: "v", commit: "[a]", value: "a(ζ)" },
  { coef: "v²", commit: "[b]", value: "b(ζ)" },
  { coef: "⋯", commit: "⋯", value: "⋯" },
] as const;

const SCENES = [
  { label: "F: 약정을 결합", summary: "F = D + v[a] + v²[b] + ⋯", mode: 0, note: "Verifier key와 proof에 있는 commitments를 batch 계수 1, v, v², …로 곱해 더한 점이 F입니다. v는 transcript에서 재생한 challenge입니다." },
  { label: "E: 평가값을 같은 순서로", summary: "E = r₀ + v·a(ζ) + v²·b(ζ) + ⋯", mode: 1, note: "Proof가 제공한 ζ에서의 평가값을 F와 같은 계수, 같은 순서로 결합해 E를 만듭니다. 예를 들어 [a]와 a(ζ)는 같은 wire polynomial a의 약정과 값이며 둘 다 v를 받습니다." },
  { label: "두 opening을 u로 결합", summary: "W_ζ + u·W_ζω", mode: 2, note: "ζ와 ζω 두 점의 opening commitment를 challenge u로 하나로 묶습니다. F−E는 같은 결합의 두 번째 pairing 입력에 들어갑니다." },
  { label: "Pairing 판정", summary: "e(…, [τ]₂) · e(…, [1]₂) = 1 → Ok(())", mode: 3, note: "두 pairing의 곱이 1이면 두 KZG opening이 같은 committed polynomials의 값이라는 뜻이므로 Ok(())를 반환합니다. 재현 실행에서 정상 proof에 공개 입력 11을 넣었을 때 verifier는 ProofVerificationError를 반환했습니다." },
] as const;

function Scene({ mode }: { mode: number }) {
  const fOn = mode === 0 || mode >= 2;
  const eOn = mode >= 1;
  return (
    <div className="min-w-0">
      <div className="grid grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)] gap-px overflow-hidden rounded-lg border border-border bg-border text-center font-mono text-xs leading-5">
        <span className={`bg-background px-2 py-1.5 font-sans font-bold ${fOn ? "text-primary" : "text-muted-foreground/50"}`}>약정 (점)</span>
        <span className="bg-background px-1 py-1.5 font-sans font-bold text-muted-foreground">계수</span>
        <span className={`bg-background px-2 py-1.5 font-sans font-bold ${eOn ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground/50"}`}>평가값</span>
        {TERMS.map((term) => (
          <div key={term.coef} className="contents">
            <span className={`bg-background px-2 py-1.5 ${fOn ? "" : "text-muted-foreground/40"}`}>{term.commit}</span>
            <span className="bg-background px-1 py-1.5 font-bold">× {term.coef}</span>
            <span className={`bg-background px-2 py-1.5 ${eOn ? "" : "text-muted-foreground/40"}`}>{term.value}</span>
          </div>
        ))}
        <span className={`bg-background px-2 py-1.5 font-bold ${fOn ? "text-primary" : "text-muted-foreground/40"}`}>Σ → F</span>
        <span className="bg-background px-1 py-1.5" />
        <span className={`bg-background px-2 py-1.5 font-bold ${eOn ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground/40"}`}>Σ → E</span>
      </div>
      <div className={`mt-3 grid gap-2 sm:grid-cols-2 ${mode >= 2 ? "" : "opacity-30"}`}>
        <div className="min-w-0 rounded-lg border border-border bg-background px-3 py-2 text-xs leading-5">
          <p className="font-sans text-muted-foreground">첫 pairing 입력</p>
          <p className="break-words font-mono font-bold">−(W_ζ + u·W_ζω) , [τ]₂</p>
        </div>
        <div className="min-w-0 rounded-lg border border-border bg-background px-3 py-2 text-xs leading-5">
          <p className="font-sans text-muted-foreground">둘째 pairing 입력</p>
          <p className="break-words font-mono font-bold">ζW_ζ + uζω·W_ζω + F − E , [1]₂</p>
        </div>
      </div>
      <p className={`mt-3 rounded-md border px-3 py-2 text-center text-xs font-bold leading-5 ${mode === 3 ? "border-green-600 text-green-700 dark:text-green-400" : "border-dashed border-border text-muted-foreground/50"}`}>
        두 pairing의 곱 = 1 → Ok(()) · 아니면 오류
      </p>
    </div>
  );
}

export default function BatchOpeningViz() {
  return (
    <SceneShell
      eyebrow="마지막 pairing의 재료"
      title="약정과 평가값을 같은 계수·같은 순서로 묶어 한 번의 pairing 식에 넣습니다"
      description="왼쪽 열은 약정(곡선 위 점), 오른쪽 열은 proof가 준 평가값 쪽 항이며, 같은 줄의 두 항은 같은 계수를 받습니다. D는 linearization 약정, W_ζ·W_ζω는 ζ와 ζω에서의 opening 약정이고, v와 u는 verifier가 transcript에서 재생한 challenge입니다."
      ariaLabel="verifier가 F와 E를 만들고 두 KZG opening을 하나의 pairing 식으로 검사하는 순서"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack active={active} scenes={SCENES.map((scene) => <Scene key={scene.label} mode={scene.mode} />)} />
      )}
    />
  );
}
