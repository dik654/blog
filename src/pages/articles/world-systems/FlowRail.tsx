interface FlowRailProps {
  title: string;
  steps: readonly { actor: string; movement: string; receives: string }[];
}

/** 한 거래에서 돈·권리·위험이 이동하는 순서를 작은 화면에서도 읽을 수 있게 놓는다. */
export default function FlowRail({ title, steps }: FlowRailProps) {
  return (
    <figure data-viz="world-flow" className="my-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-700 dark:bg-neutral-900">
      <figcaption className="mb-4 text-sm font-semibold text-neutral-700 dark:text-neutral-200">{title}</figcaption>
      <ol className="grid gap-5 md:grid-cols-3">
        {steps.map((step, index) => (
          <li key={`${step.actor}-${index}`} className="relative min-w-0 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-950">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">{String(index + 1).padStart(2, "0")}</span>
            <div className="mt-1 font-semibold">{step.actor}</div>
            <p className="mt-2 text-sm leading-6 text-neutral-700 [overflow-wrap:anywhere] dark:text-neutral-300">{step.movement}</p>
            <p className="mt-2 border-t border-neutral-200 pt-2 text-sm leading-6 dark:border-neutral-700">받는 것: {step.receives}</p>
            {index < steps.length - 1 && (
              <span aria-hidden="true" className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-lg font-bold text-amber-700 md:-right-4 md:bottom-auto md:left-auto md:top-1/2 md:translate-x-0 md:-translate-y-1/2 dark:text-amber-400">
                <span className="md:hidden">↓</span>
                <span className="hidden md:inline">→</span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </figure>
  );
}
