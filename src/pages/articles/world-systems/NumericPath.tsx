interface NumericPathProps {
  title: string;
  steps: readonly { label: string; value: string; detail?: string }[];
}

/** 하나의 입력이 계산이나 선택을 거쳐 결과로 바뀌는 과정을 읽는다. */
export default function NumericPath({ title, steps }: NumericPathProps) {
  return (
    <figure data-viz="numeric-path" className="my-8 border-y border-neutral-200 py-6 dark:border-neutral-700">
      <figcaption className="mb-5 text-sm font-semibold text-neutral-700 dark:text-neutral-200">{title}</figcaption>
      <ol className="flex flex-col items-stretch gap-4 md:flex-row md:items-center">
        {steps.map((step, index) => (
          <li key={`${step.label}-${index}`} className="flex min-w-0 flex-1 flex-col items-center gap-4 md:flex-row">
            {index > 0 && (
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 shrink-0 rotate-90 text-sky-700 md:rotate-0 dark:text-sky-400" fill="none" stroke="currentColor" strokeWidth="1.25">
                <path d="M2 12h19M15 6l6 6-6 6" />
              </svg>
            )}
            <div className={`w-full min-w-0 border border-neutral-300 px-4 py-4 text-center dark:border-neutral-600 ${index === 0 ? "rounded-full" : "rounded-lg"} ${index === steps.length - 1 ? "bg-sky-50 dark:bg-sky-950/30" : ""}`}>
              <div className="text-sm leading-6">{step.label}</div>
              <div className="mt-1 text-xl font-semibold tabular-nums">{step.value}</div>
              {step.detail && <div className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">{step.detail}</div>}
            </div>
          </li>
        ))}
      </ol>
    </figure>
  );
}
