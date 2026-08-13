interface PrimerPoint {
  label: string;
  detail: string;
}

export default function TopicPrimer({
  title,
  question,
  thesis,
  points,
  readingHint,
}: {
  title: string;
  question: string;
  thesis: string;
  points: readonly PrimerPoint[];
  readingHint: string;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold">{title}</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg font-semibold leading-8 text-foreground">
          {question}
        </p>
        <p className="leading-7">{thesis}</p>
      </div>

      <div className="not-prose my-6 grid gap-3">
        {points.map((point, index) => (
          <div
            key={point.label}
            className="grid min-w-0 gap-3 rounded-2xl border border-border/70 bg-card p-4 sm:grid-cols-[5.5rem_minmax(0,1fr)]"
          >
            <span className="w-fit rounded-md bg-primary/10 px-2 py-1 text-[11px] font-black tracking-wide text-primary">
              기준 {String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold leading-5 text-foreground">
                {point.label}
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {point.detail}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="not-prose rounded-xl border border-amber-500/25 bg-amber-500/5 px-4 py-3 text-xs leading-5 text-foreground/75">
        <strong className="text-amber-700 dark:text-amber-300">읽는 법:</strong>{" "}
        {readingHint}
      </p>
    </section>
  );
}
