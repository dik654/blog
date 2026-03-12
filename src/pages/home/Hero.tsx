import { motion } from 'framer-motion';
import { categories } from '@/content';

const stats = [
  { label: '분야', getValue: () => categories.length },
  { label: '주제', getValue: () => categories.reduce((s, c) => s + c.subcategories.length, 0) },
  { label: '아티클', getValue: () => categories.reduce((s, c) => s + c.articles.length, 0) },
];

export default function Hero() {
  return (
    <section className="mb-16">
      <motion.p
        className="text-sm font-medium text-muted-foreground mb-3 font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        ~/study-archive
      </motion.p>

      <motion.h1
        className="text-4xl sm:text-5xl font-bold tracking-tight mb-5 leading-[1.15]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        개념을 코드로,{' '}
        <br className="sm:hidden" />
        코드를 시각화로
      </motion.h1>

      <motion.p
        className="text-base text-muted-foreground leading-relaxed max-w-xl mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        논문과 문서를 읽는 것에 그치지 않고,
        핵심 알고리즘을 직접 구현하고 인터랙티브하게 시각화하며
        깊이 있게 이해한 과정을 기록합니다.
      </motion.p>

      <motion.div
        className="flex gap-8 mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {stats.map((stat, i) => (
          <div key={stat.label} className="flex items-center gap-8">
            <div>
              <p className="text-2xl font-bold">{stat.getValue()}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
            {i < stats.length - 1 && <div className="w-px h-8 bg-border" />}
          </div>
        ))}
      </motion.div>
    </section>
  );
}
