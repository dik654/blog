import VizFrame from "@/components/viz/VizFrame";

const fields = ["dataset", "source clip", "person", "generator", "codec", "consent · license"];
const rows = [
  ["Train", "known A · B", "raw · JPEG", "train identities"],
  ["Selection", "known A · B", "held-out codec", "held-out identities"],
  ["OOD test", "unseen C", "re-encode", "independent identities"],
];

export default function ExternalDataViz() {
  return <VizFrame eyebrow="Provenance manifest" title="외부 dataset을 합치기 전에 source 독립성과 사용 권리를 한 행으로 만듭니다" description={`필수 필드 · ${fields.join(" · ")}`}>
    <div className="border-y border-border">
      {rows.map(([split, generator, codec, identity]) => <div key={split} className="grid gap-2 border-b border-border py-5 text-sm last:border-b-0 sm:grid-cols-[7rem_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] sm:gap-5"><strong>{split}</strong><span>{generator}</span><span className="text-muted-foreground">{codec}</span><span className="text-amber-800 dark:text-amber-200">{identity}</span></div>)}
    </div>
    <p className="mt-6 border-l border-amber-500 pl-4 text-sm leading-6 text-muted-foreground">OOD test의 source·identity·generator가 training에 파생 형태로 다시 들어오면 unseen-manipulation 질문이 사라집니다.</p>
  </VizFrame>;
}
