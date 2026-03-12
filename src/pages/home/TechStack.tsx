import { motion } from 'framer-motion';

const stacks = [
  {
    label: 'Frontend',
    items: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
  },
  {
    label: 'Interactive',
    items: ['Framer Motion', 'Mafs', 'Recharts', 'Rough Notation'],
  },
  {
    label: 'Infra',
    items: ['Cloudflare Pages', 'SPA Routing', 'Lazy Loading'],
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function TechStack() {
  return (
    <section className="mb-14">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 pb-2 border-b">
        구현
      </h2>
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        각 개념의 핵심 동작을 직접 구현한 인터랙티브 데모를 포함합니다.
        단순 정리가 아닌, 코드 레벨의 이해를 목표로 합니다.
      </p>
      <motion.div
        className="grid gap-4 sm:grid-cols-3"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
      >
        {stacks.map((stack) => (
          <motion.div
            key={stack.label}
            variants={item}
            className="rounded-lg border p-4"
          >
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {stack.label}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {stack.items.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md bg-accent px-2 py-0.5 text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
