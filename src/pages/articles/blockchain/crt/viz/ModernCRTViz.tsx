const residues = [
  { modulus: 3, residue: 2, values: "2, 5, 8, 11, 14, 17, 20, 23" },
  { modulus: 5, residue: 3, values: "3, 8, 13, 18, 23" },
  { modulus: 7, residue: 2, values: "2, 9, 16, 23" },
] as const;

export default function ModernCRTViz() {
  return (
    <figure
      data-viz="crt-residue-intersection"
      data-viz-canvas
      className="not-prose my-8 min-w-0 rounded-xl border border-border/70 bg-card p-4 sm:p-6"
    >
      <figcaption className="mb-5">
        <p className="text-sm font-semibold text-foreground">
          세 나머지 조건이 하나의 위치에서 만난다
        </p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          각 행은 같은 나머지를 갖는 정수의 줄입니다. 23은 세 줄에 동시에
          나타나며, 다음 교점은 3·5·7=105만큼 뒤에 있습니다.
        </p>
      </figcaption>
      <div className="space-y-3">
        {residues.map((row) => (
          <div
            key={row.modulus}
            className="grid min-w-0 gap-2 rounded-lg border border-border bg-background p-3 sm:grid-cols-[116px_1fr] sm:items-center"
          >
            <div className="text-xs font-semibold text-primary">
              mod {row.modulus} → {row.residue}
            </div>
            <div className="min-w-0 break-words font-mono text-xs leading-5 text-muted-foreground">
              {row.values}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-xs font-semibold text-foreground">세 조건의 교점</p>
          <p className="mt-1 font-mono text-sm text-primary">x = 23</p>
        </div>
        <span aria-hidden className="text-center text-sm text-muted-foreground">
          →
        </span>
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
          <p className="text-xs font-semibold text-foreground">모든 해</p>
          <p className="mt-1 font-mono text-sm text-primary">x = 23 + 105k</p>
        </div>
      </div>
    </figure>
  );
}
