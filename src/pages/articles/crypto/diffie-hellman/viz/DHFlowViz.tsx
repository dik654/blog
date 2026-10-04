import StepViz from "@/components/ui/step-viz";

const STEPS = [
  { label: "공개 설정", body: "양쪽이 5를 반복해서 곱하고 23으로 나눈 나머지를 쓰기로 합니다. 작은 교육용 설정입니다." },
  { label: "각자 준비", body: "Alice는 비밀 6으로 공개값 8, Bob은 비밀 15로 공개값 19를 만듭니다." },
  { label: "공개값 교환", body: "8과 19는 관찰자도 봅니다. 실제 통신에서는 이 값과 양쪽 역할을 인증할 기록에 포함합니다." },
  { label: "같은 결과", body: "Alice는 19⁶, Bob은 8¹⁵을 계산해 나머지 2를 얻습니다." },
  { label: "열쇠 생성", body: "상대의 입력과 신원을 확인한 뒤 용도별 열쇠를 만듭니다. 필요가 끝난 임시 비밀은 지웁니다." },
];

function Party({ name, secret, publicValue, active }: { name: string; secret: string; publicValue: string; active: boolean }) {
  return (
    <div className={`min-w-0 rounded-lg border p-4 ${active ? "border-primary/60 bg-primary/5" : "border-border/70 bg-card"}`}>
      <p className="text-xs font-bold text-primary">{name}</p>
      <dl className="mt-3 grid grid-cols-[4.5rem_minmax(0,1fr)] gap-2 text-xs leading-5">
        <dt className="text-muted-foreground">비밀</dt><dd className="break-all font-mono">{secret}</dd>
        <dt className="text-muted-foreground">공개값</dt><dd className="break-all font-mono">{publicValue}</dd>
      </dl>
    </div>
  );
}

export default function DHFlowViz() {
  return (
    <StepViz steps={STEPS.map(({ label, body }) => ({ label, body: <span className="block min-h-[68px] sm:min-h-[45px]">{body}</span> }))}>
      {(step) => (
        <div className="w-full min-w-0 space-y-3">
          <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
            <Party name="Alice" secret="a=6" publicValue="A=5⁶ mod23=8" active={step === 1 || step === 3} />
            <div className="rounded-lg border border-border/70 bg-background px-3 py-2 text-center text-xs font-semibold text-muted-foreground">A ⇄ B</div>
            <Party name="Bob" secret="b=15" publicValue="B=5¹⁵ mod23=19" active={step === 1 || step === 3} />
          </div>
          <div className={`rounded-lg border p-4 text-center ${step >= 3 ? "border-emerald-500/50 bg-emerald-500/5" : "border-border/70 bg-card"}`}>
            <p className="font-mono text-sm font-bold">Bᵃ = 19⁶ = 2 = 8¹⁵ = Aᵇ (mod 23)</p>
            <p className="mt-2 min-h-[68px] text-xs leading-5 text-muted-foreground sm:min-h-[45px]">{step === 4 ? "공유값 2는 인증한 대화 기록과 함께 KDF에 넣을 재료입니다. 작은 2 자체에는 실제 보안이 없습니다." : "양쪽 결과는 같지만 상대의 신원과 열쇠의 용도는 아직 확인하지 않았습니다."}</p>
          </div>
        </div>
      )}
    </StepViz>
  );
}
