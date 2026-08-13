const rows = [
  ["Module mode", "model.train()", "model.eval()"],
  ["Autograd", "backward graph 생성", "inference_mode / no_grad"],
  ["Random transform", "허용·seed 기록", "고정 transform"],
  ["Mutable state", "weight·optimizer·scheduler", "없음"],
  ["Output", "update receipt", "metric numerator·denominator"],
];

export default function LoopViz() {
  return (
    <figure data-viz className="overflow-hidden rounded-xl border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-purple-700 dark:text-purple-300">Phase contract</p>
        <h3 className="mt-1 text-base font-semibold sm:text-lg">Train은 state를 바꾸고 validation은 같은 state를 읽기만 합니다</h3>
      </figcaption>
      <div className="px-4 py-5 sm:px-6">
        <div className="grid grid-cols-[6.5rem_minmax(0,1fr)_minmax(0,1fr)] border-y border-border text-sm sm:grid-cols-[9rem_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="px-2 py-3 text-muted-foreground sm:px-3">경계</div>
          <div className="border-l border-border px-2 py-3 font-semibold text-purple-800 dark:text-purple-200 sm:px-3">Train</div>
          <div className="border-l border-border px-2 py-3 font-semibold text-sky-800 dark:text-sky-200 sm:px-3">Validation</div>
          {rows.flatMap(([label, train, validation]) => [
            <div key={`${label}-l`} className="border-t border-border px-2 py-3 font-medium sm:px-3">{label}</div>,
            <div key={`${label}-t`} className="break-words border-l border-t border-border px-2 py-3 text-muted-foreground sm:px-3">{train}</div>,
            <div key={`${label}-v`} className="break-words border-l border-t border-border px-2 py-3 text-muted-foreground sm:px-3">{validation}</div>,
          ])}
        </div>
        <div className="mt-5 border-l border-purple-500 pl-4 text-sm">
          <p className="font-semibold">Micro-batch 1 … A</p>
          <p className="mt-1 text-muted-foreground">Backward를 A번 수행해도 optimizer·scheduler clock은 update 한 번만 진행합니다.</p>
        </div>
      </div>
    </figure>
  );
}
