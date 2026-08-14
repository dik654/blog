import StepViz from "@/components/ui/step-viz";

const STEPS = [
  { label: "Domain", body: "장난감 F₂₃*, generator g=5와 encoding/order를 양쪽이 합의합니다." },
  { label: "Ephemeral", body: "Alice a=6→A=8, Bob b=15→B=19를 계산합니다." },
  { label: "Exchange", body: "A와 B는 공개되며 실제 protocol은 이 값과 role을 인증 transcript에 넣습니다." },
  { label: "Shared", body: "Alice Bᵃ=2, Bob Aᵇ=2로 같은 raw DH output에 도달합니다." },
  { label: "Derive", body: "Public-key validation 뒤 transcript-bound KDF로 용도별 key를 만들고 ephemeral secret을 지웁니다." },
];

function Party({ name, secret, publicValue, active }: { name: string; secret: string; publicValue: string; active: boolean }) {
  return (
    <div className={`min-w-0 rounded-lg border p-4 ${active ? "border-primary/60 bg-primary/5" : "border-border/70 bg-card"}`}>
      <p className="text-xs font-bold text-primary">{name}</p>
      <dl className="mt-3 grid grid-cols-[4.5rem_minmax(0,1fr)] gap-2 text-xs leading-5">
        <dt className="text-muted-foreground">secret</dt><dd className="break-all font-mono">{secret}</dd>
        <dt className="text-muted-foreground">public</dt><dd className="break-all font-mono">{publicValue}</dd>
      </dl>
    </div>
  );
}

export default function DHFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full min-w-0 space-y-3">
          <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
            <Party name="Alice" secret="a=6" publicValue="A=5⁶ mod23=8" active={step === 1 || step === 3} />
            <div className="rounded-lg border border-border/70 bg-background px-3 py-2 text-center text-xs font-semibold text-muted-foreground">A ⇄ B</div>
            <Party name="Bob" secret="b=15" publicValue="B=5¹⁵ mod23=19" active={step === 1 || step === 3} />
          </div>
          <div className={`rounded-lg border p-4 text-center ${step >= 3 ? "border-emerald-500/50 bg-emerald-500/5" : "border-border/70 bg-card"}`}>
            <p className="font-mono text-sm font-bold">Bᵃ = 19⁶ = 2 = 8¹⁵ = Aᵇ (mod 23)</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{step === 4 ? "Z=2는 바로 cipher key가 아니라 authenticated transcript를 포함한 KDF 입력입니다." : "같은 값은 계산했지만 아직 peer identity와 key purpose는 정해지지 않았습니다."}</p>
          </div>
        </div>
      )}
    </StepViz>
  );
}
