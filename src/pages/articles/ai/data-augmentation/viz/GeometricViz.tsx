const stages = [
  ["01", "Parameter 1회 sampling", "angle=−8° · scale=0.92 · dx=12px"],
  ["02", "Image 좌표 변환", "Interpolation·padding rule 적용"],
  ["03", "Annotation 동기화", "Box corner·mask·keypoint에 같은 map"],
  ["04", "Validity 검사", "Visible area·boundary·object count 확인"],
];

export default function GeometricViz() {
  return (
    <figure data-viz="geometric-transform-contract" className="min-w-0 rounded-xl border border-border/75 bg-card p-4 sm:p-6">
      <figcaption className="mb-5 text-sm font-semibold">같은 random transform을 target까지 전달하는 경로</figcaption>
      <div className="grid gap-4 md:grid-cols-4">
        {stages.map(([number, title, detail]) => (
          <div key={title} className="min-w-0 border-t border-sky-500/45 pt-4">
            <p className="text-xs font-bold text-sky-700 dark:text-sky-300">{number}</p>
            <p className="mt-2 font-semibold">{title}</p>
            <p className="mt-2 break-words font-mono text-xs leading-5 text-muted-foreground">{detail}</p>
          </div>
        ))}
      </div>
      <p className="mt-5 border-l border-rose-500/45 pl-4 text-sm leading-6 text-muted-foreground">Image와 annotation이 서로 다른 parameter를 뽑으면 label corruption입니다.</p>
    </figure>
  );
}
