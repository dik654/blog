import ResponsiveVizTable from "@/components/viz/ResponsiveVizTable";

const rows = [
  ["Full fine-tuning", "Base 전체", "Base 전체", "Task별 full checkpoint", "가장 넓은 update freedom"],
  ["LoRA", "A·B + 선택 module", "Base+adapter 경로", "작은 adapter", "Base forward/activation은 남음"],
  ["QLoRA", "A·B + 선택 module", "Quantized base 복원+adapter", "Adapter+quant config", "Base storage memory 절감"],
] as const;

export default function PeftCompareViz() {
  return (
    <figure data-viz className="rounded-xl border border-border bg-background p-4 sm:p-5">
      <figcaption><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Adaptation boundary</p><p className="mt-1 font-semibold">무엇을 학습하고 저장하며 실행하는지 분리합니다</p></figcaption>
      <ResponsiveVizTable columns={["방법", "Trainable", "Forward", "Task artifact", "주의할 경계"]} rows={rows} desktopMinWidthClassName="min-w-[44rem]" />
    </figure>
  );
}
