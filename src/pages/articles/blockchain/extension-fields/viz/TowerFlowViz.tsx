import StepViz from "@/components/ui/step-viz";

const STEPS = [
  { label: "Parameter", body: "p, tower polynomials, non-residues와 coefficient order를 version receipt로 고정합니다." },
  { label: "Represent", body: "각 layer를 바로 아래 field의 고정 길이 coefficient tuple로 표현합니다." },
  { label: "Multiply", body: "전개한 뒤 Karatsuba로 cross term을 공유하고 defining relation으로 reduction합니다." },
  { label: "Automorphism", body: "Pinned Frobenius coefficient table로 p-power action을 계산합니다." },
  { label: "Verify", body: "Independent field/pairing vector와 round-trip parity 뒤 비용을 측정합니다." },
];

export default function TowerFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full min-w-0">
          <div className="grid gap-3 md:grid-cols-5">
            {STEPS.map((item, index) => (
              <div key={item.label} className={`min-w-0 rounded-lg border p-3 ${index === step ? "border-primary/60 bg-primary/5" : "border-border/70 bg-card"}`}>
                <p className="text-[10px] font-bold tabular-nums text-primary">{String(index + 1).padStart(2, "0")}</p>
                <p className="mt-2 break-words text-xs font-semibold">{item.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">parameter identity → tuple layout → reduction schedule → Frobenius table → parity receipt</p>
        </div>
      )}
    </StepViz>
  );
}
