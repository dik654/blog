import { motion } from 'framer-motion';
import { roadmapSteps } from '../overviewData';

const STATUS = {
  done: { bg: '#10b98122', border: '#10b981', badge: 'bg-emerald-600', text: '완료' },
  active: { bg: '#f59e0b22', border: '#f59e0b', badge: 'bg-amber-600', text: '진행중' },
  planned: { bg: '#6366f122', border: '#6366f1', badge: 'bg-indigo-600', text: '계획' },
} as const;

export default function RoadmapViz() {
  return (
    <div className="not-prose flex flex-col gap-3 my-6">
      {roadmapSteps.map((s, i) => {
        const st = STATUS[s.status];
        return (
          <motion.div key={i}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className="rounded-lg border p-4 flex items-start gap-4"
            style={{ borderColor: st.border, background: st.bg }}>
            <div className="flex flex-col items-center gap-1 min-w-[60px]">
              <span className={`text-[10px] text-white px-2 py-0.5 rounded-full ${st.badge}`}>
                {st.text}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold">{s.label}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.desc}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
