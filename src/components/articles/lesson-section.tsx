import type { ReactNode } from "react";

interface LessonSectionProps {
  id: string;
  level: "S" | "B" | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7";
  title: string;
  bridge: string;
  children: ReactNode;
}

/** Teach-system의 한 층을 같은 호흡으로 보여 주되 실제 설명은 각 글이 소유합니다. */
export default function LessonSection({ id, level, title, bridge, children }: LessonSectionProps) {
  return (
    <section id={id} data-teach-level={level} className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">{title}</h2>
      {children}
      <p data-stage-bridge={id} className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
        {bridge}
      </p>
    </section>
  );
}
