import type { ReactNode } from "react";

export interface HardwareTeachCase {
  incidentTitle: string;
  incident: readonly [string, string];
  pathTitle: string;
  path: readonly [string, string];
  numberTitle: string;
  numbers: readonly [string, string];
  steps: readonly [
    { role: string; result: string },
    { role: string; result: string },
    { role: string; result: string },
  ];
  whyParts: readonly [string, string];
  terms: readonly [
    { role: string; name: string; boundary: string },
    { role: string; name: string; boundary: string },
    { role: string; name: string; boundary: string },
  ];
  next: string;
}

/**
 * 레거시 HW 글이 사양표나 약어에서 시작하지 않도록 실제 사건→이름 없는 경로→작은 수치까지
 * 먼저 여는 수업 본문입니다. 뒤의 기존 본문은 이 사례에 표준 이름과 구현을 붙입니다.
 */
export default function HardwareTeachOpening({ data }: { data: HardwareTeachCase }) {
  return (
    <div className="mb-16 space-y-14">
      <section data-teach-level="S" className="scroll-mt-20" aria-labelledby="case-first-incident">
        <p className="text-sm font-semibold text-primary">먼저 실제로 실패한 장면을 봅니다</p>
        <h2 id="case-first-incident" className="mt-2 text-3xl font-bold tracking-tight">
          {data.incidentTitle}
        </h2>
        <div className="prose prose-neutral mt-6 max-w-none dark:prose-invert">
          {data.incident.map((paragraph) => <p key={paragraph} className="leading-8">{paragraph}</p>)}
        </div>
      </section>

      <section data-teach-level="B" className="scroll-mt-20" aria-labelledby="case-first-path">
        <p className="text-sm font-semibold text-primary">아직 부품 이름을 붙이지 않습니다</p>
        <h2 id="case-first-path" className="mt-2 text-2xl font-bold tracking-tight">
          {data.pathTitle}
        </h2>
        <div className="prose prose-neutral mt-5 max-w-none dark:prose-invert">
          {data.path.map((paragraph) => <p key={paragraph} className="leading-8">{paragraph}</p>)}
        </div>
      </section>

      <section data-teach-level="0" className="scroll-mt-20" aria-labelledby="case-first-number">
        <p className="text-sm font-semibold text-primary">같은 사건에 숫자를 넣습니다</p>
        <h2 id="case-first-number" className="mt-2 text-2xl font-bold tracking-tight">
          {data.numberTitle}
        </h2>
        <div className="prose prose-neutral mt-5 max-w-none dark:prose-invert">
          {data.numbers.map((paragraph) => <p key={paragraph} className="leading-8">{paragraph}</p>)}
        </div>
        <p className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">{data.next}</p>
      </section>

      <section data-teach-level="1" className="scroll-mt-20" aria-labelledby="case-first-picture">
        <p className="text-sm font-semibold text-primary">이름 없는 경로를 한 번 더 그립니다</p>
        <h2 id="case-first-picture" className="mt-2 text-2xl font-bold tracking-tight">
          한 작업이 세 관문을 차례로 통과합니다
        </h2>
        <figure className="not-prose mt-6 border-y border-border py-5" data-viz="hardware-teach-path">
          <ol className="grid gap-4 lg:grid-cols-3">
            {data.steps.map((step, index) => (
              <li key={step.role} className="min-w-0 border-l border-border pl-4">
                <p className="text-xs font-bold text-primary">관문 {index + 1}</p>
                <p className="mt-1 font-semibold text-foreground">{step.role}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.result}</p>
              </li>
            ))}
          </ol>
        </figure>
      </section>

      <section data-teach-level="2" className="scroll-mt-20" aria-labelledby="case-first-why">
        <p className="text-sm font-semibold text-primary">왜 세 관문을 따로 두는지 확인합니다</p>
        <h2 id="case-first-why" className="mt-2 text-2xl font-bold tracking-tight">
          앞 관문의 성공이 뒤 관문의 성공을 보장하지 않습니다
        </h2>
        <div className="prose prose-neutral mt-5 max-w-none dark:prose-invert">
          {data.whyParts.map((paragraph) => <p key={paragraph} className="leading-8">{paragraph}</p>)}
        </div>
      </section>

      <section data-teach-level="3" className="scroll-mt-20" aria-labelledby="case-first-names">
        <p className="text-sm font-semibold text-primary">이제 앞에서 본 역할에 이름을 붙입니다</p>
        <h2 id="case-first-names" className="mt-2 text-2xl font-bold tracking-tight">
          역할 하나와 표준 이름 하나를 짝지어 읽습니다
        </h2>
        <dl className="not-prose mt-6 divide-y divide-border border-y border-border">
          {data.terms.map((term) => (
            <div key={term.name} className="py-5">
              <dt className="font-semibold text-foreground">{term.role} — {term.name}</dt>
              <dd className="mt-2 text-sm leading-7 text-muted-foreground">{term.boundary}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}

export function HardwareTeachMechanism({
  data,
  children,
}: {
  data: HardwareTeachCase;
  children: ReactNode;
}) {
  return (
    <section data-teach-level="4" className="min-w-0 space-y-10" aria-labelledby="case-first-mechanism">
      <header className="border-t border-border pt-10">
        <p className="text-sm font-semibold text-primary">04 · 이제 내부를 엽니다</p>
        <h2 id="case-first-mechanism" className="mt-2 text-2xl font-bold tracking-tight">
          앞에서 본 세 관문이 실제 부품과 소프트웨어에서 어떻게 움직이는지 따라갑니다
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
          {data.next} 아래 본문에서는 새 사례를 시작하지 않고, 같은 판단을 내부 구조·계산·구성으로 한 층씩 내려갑니다.
        </p>
      </header>
      {children}
    </section>
  );
}
