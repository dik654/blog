import VizFrame from "@/components/viz/VizFrame";

const steps = [
  ["01", "Scope", "한 server가 소유할 domain responsibility"],
  ["02", "Contract", "Schema · result · error · effect · retry"],
  ["03", "Enforce", "Consent · token · ACL · tenant boundary"],
  ["04", "Transport", "Revision · header · timeout · cancel"],
  ["05", "Verify", "Contract test · fault injection · trace replay"],
] as const;

export default function ImplementationViz() {
  return (
    <VizFrame
      eyebrow="Production path"
      title="Handler code보다 contract와 enforcement를 먼저 고정합니다"
      description="각 단계의 산출물이 다음 단계의 입력이 되므로 transport부터 만들면 effect와 error 의미가 뒤늦게 흔들립니다."
    >
      <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {steps.map(([number, title, body]) => (
          <li key={number} className="min-w-0 border-t border-border/80 pt-4">
            <span className="font-mono text-[11px] text-muted-foreground">{number}</span>
            <h4 className="mt-2 text-sm font-bold">{title}</h4>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p>
          </li>
        ))}
      </ol>
    </VizFrame>
  );
}
