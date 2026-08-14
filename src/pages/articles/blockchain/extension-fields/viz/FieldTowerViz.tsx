import StepViz from "@/components/ui/step-viz";

const LAYERS = [
  { name: "Fp", basis: "1", relation: "mod p", dimension: 1 },
  { name: "Fp²", basis: "1, u", relation: "u² = β", dimension: 2 },
  { name: "Fp⁶", basis: "1, v, v² over Fp²", relation: "v³ = ξ", dimension: 6 },
  { name: "Fp¹²", basis: "1, w over Fp⁶", relation: "w² = v", dimension: 12 },
];

const STEPS = LAYERS.map((layer) => ({
  label: layer.name,
  body: `${layer.relation}을 적용해 높은 차수 항을 줄이고 Fp 기준 차원 ${layer.dimension}을 유지합니다.`,
}));

export default function FieldTowerViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="grid w-full min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {LAYERS.map((layer, index) => (
            <div key={layer.name} className={`min-w-0 rounded-lg border p-4 ${index === step ? "border-primary/60 bg-primary/5" : "border-border/70 bg-card"}`}>
              <p className="text-xs font-bold text-primary">{layer.name}</p>
              <p className="mt-2 break-words text-sm font-semibold">{layer.relation}</p>
              <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">basis: {layer.basis}</p>
              <p className="mt-3 border-t border-border/60 pt-3 text-xs tabular-nums text-muted-foreground">{layer.dimension} × Fp coordinate</p>
            </div>
          ))}
        </div>
      )}
    </StepViz>
  );
}
