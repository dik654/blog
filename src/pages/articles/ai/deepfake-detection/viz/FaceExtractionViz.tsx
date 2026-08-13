import VizFrame from "@/components/viz/VizFrame";

const rows = [
  ["Decode", "timestamp · frame status", "decode failure"],
  ["Detect", "box · landmark · confidence", "small/occluded miss"],
  ["Track", "identity · continuity", "switch · duplicate"],
  ["Align / crop", "transform · margin · interpolation", "jitter · new artifact"],
  ["Model input", "crop + mask + coverage", "abstain when insufficient"],
];

export default function FaceExtractionViz() {
  return <VizFrame eyebrow="Preprocessing lineage" title="성공한 crop뿐 아니라 실패 상태도 다음 단계로 전달합니다" description="각 stage의 output을 저장하면 detector error와 face-pipeline error를 분리해 볼 수 있습니다.">
    <div className="border-y border-border">
      <div className="hidden grid-cols-[7rem_minmax(0,1fr)_minmax(0,1fr)] gap-6 border-b border-border py-3 text-xs font-semibold text-muted-foreground sm:grid"><span>Stage</span><span>artifact</span><span>failure state</span></div>
      {rows.map(([stage, artifact, failure]) => <div key={stage} className="grid gap-2 border-b border-border py-4 text-sm last:border-b-0 sm:grid-cols-[7rem_minmax(0,1fr)_minmax(0,1fr)] sm:gap-6"><strong>{stage}</strong><span className="text-muted-foreground">{artifact}</span><span className="text-sky-800 dark:text-sky-200">{failure}</span></div>)}
    </div>
  </VizFrame>;
}
