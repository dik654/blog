const comparison = [
  ["model state", true, true],
  ["preprocess·config", true, true],
  ["optimizer·scheduler", false, true],
  ["AMP scaler", false, true],
  ["update·accumulation cursor", false, true],
  ["sampler·RNG", false, true],
];

export default function CheckpointViz() {
  return (
    <figure data-viz className="overflow-hidden rounded-xl border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-300">State inventory</p>
        <h3 className="mt-1 text-base font-semibold sm:text-lg">배포에 필요한 state와 같은 trajectory를 이어갈 state를 구분합니다</h3>
      </figcaption>
      <div className="px-4 py-5 sm:px-6">
        <div className="grid grid-cols-[minmax(0,1fr)_5rem_5rem] border-y border-border text-sm sm:grid-cols-[minmax(0,1fr)_8rem_8rem]">
          <div className="px-2 py-3 text-muted-foreground sm:px-3">저장 항목</div>
          <div className="border-l border-border px-2 py-3 text-center font-semibold">best</div>
          <div className="border-l border-border px-2 py-3 text-center font-semibold">last</div>
          {comparison.flatMap(([label, best, last]) => [
            <div key={`${label}-label`} className="break-words border-t border-border px-2 py-3 sm:px-3">{label}</div>,
            <div key={`${label}-best`} className="border-l border-t border-border px-2 py-3 text-center">{best ? "필수" : "—"}</div>,
            <div key={`${label}-last`} className="border-l border-t border-border px-2 py-3 text-center text-amber-800 dark:text-amber-200">{last ? "필수" : "—"}</div>,
          ])}
        </div>
        <div className="mt-5 grid gap-3 text-sm sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
          <p><span className="font-semibold">temporary write</span><br /><span className="text-muted-foreground">완전한 파일 생성</span></p>
          <span className="hidden sm:block">→</span>
          <p><span className="font-semibold">checksum·rename</span><br /><span className="text-muted-foreground">부분 파일 비공개</span></p>
          <span className="hidden sm:block">→</span>
          <p><span className="font-semibold">new-process test</span><br /><span className="text-muted-foreground">trajectory 비교</span></p>
        </div>
      </div>
    </figure>
  );
}
