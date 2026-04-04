import { motion } from 'framer-motion';
import { ModuleBox } from '@/components/viz/boxes';

const C = { blue: '#0ea5e9', red: '#ef4444' };

function SnowballViz() {
  const counters = [
    { label: 'Blue 신뢰도', value: 7, max: 10, color: C.blue },
    { label: 'Red 신뢰도', value: 3, max: 10, color: C.red },
  ];
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">Snowball: 누적 신뢰도 카운터</p>
      <svg viewBox="0 0 420 80" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        {counters.map((c, i) => (
          <motion.g key={c.label} initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} transition={{ delay: i * 0.2 }}>
            <text x={30} y={25 + i * 35} fontSize={10} fontWeight={600} fill={c.color}>{c.label}</text>
            <rect x={140} y={13 + i * 35} width={200} height={16} rx={4}
              fill="var(--border)" opacity={0.3} />
            <motion.rect x={140} y={13 + i * 35} width={0} height={16} rx={4}
              fill={`${c.color}40`} stroke={c.color} strokeWidth={1}
              animate={{ width: (c.value / c.max) * 200 }}
              transition={{ delay: i * 0.2, duration: 0.5 }} />
            <motion.text x={145 + (c.value / c.max) * 200} y={25 + i * 35}
              fontSize={10} fill={c.color}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: i * 0.2 + 0.5 }}>
              {c.value}
            </motion.text>
          </motion.g>
        ))}
        <motion.text x={210} y={72} textAnchor="middle" fontSize={11}
          fill={C.blue} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}>
          💡 Blue(7) {'>'} Red(3) → Blue가 최종 선택
        </motion.text>
      </svg>
    </div>
  );
}

export default function Snowball() {
  return (
    <section id="snowball" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Snowball: 신뢰도 카운터</h2>
      <SnowballViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Snowball은 Snowflake에 누적 신뢰도 카운터를 추가합니다.<br />
          매 라운드 α+ 응답을 받으면 해당 값의 카운터를 증가시킵니다.<br />
          일시적으로 선호가 바뀌어도 누적 카운터는 유지됩니다.<br />
          💡 결과: 네트워크 변동에 강한 안정적 수렴
        </p>
      </div>
    </section>
  );
}
