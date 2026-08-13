import VizFrame from "@/components/viz/VizFrame";

const checks = [
  ["Registry", "config · weight revision · license"],
  ["Input", "resolution · interpolation · normalization"],
  ["Token", "patch/grid · special tokens · position resize"],
  ["Parity", "eval logits · dtype · ε tolerance"],
  ["Artifact", "preprocess + model + class map + receipt"],
];

export default function PracticeViz() {
  return (
    <VizFrame eyebrow="Checkpoint handoff" title="한 batch의 logit parity를 통과한 뒤에만 fine-tuning과 export를 시작합니다" description="Weight load success는 호환성 검사의 첫 줄일 뿐입니다.">
      <ol className="border-y border-border">
        {checks.map(([name, detail], i) => <li key={name} className="grid min-w-0 grid-cols-[2rem_minmax(0,1fr)] gap-3 border-b border-border py-4 text-sm last:border-b-0 sm:grid-cols-[2rem_7rem_minmax(0,1fr)] sm:gap-5"><span className="font-mono text-xs text-amber-700 dark:text-amber-300">0{i+1}</span><strong>{name}</strong><span className="col-start-2 break-words text-muted-foreground sm:col-start-auto">{detail}</span></li>)}
      </ol>
      <p className="mt-6 border-l border-amber-500 pl-4 text-sm leading-6 text-muted-foreground">Reference logits와 exported logits의 max error, class order, preprocessing digest를 release receipt로 저장합니다.</p>
    </VizFrame>
  );
}
