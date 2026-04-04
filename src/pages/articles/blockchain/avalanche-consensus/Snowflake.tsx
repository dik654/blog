import { motion } from 'framer-motion';
import { ActionBox } from '@/components/viz/boxes';

const C = { snow: '#0ea5e9', yes: '#10b981', no: '#ef4444' };

function SnowflakeViz() {
  const rounds = [
    { label: 'R1: 질의', result: '14/20 Blue', color: C.yes },
    { label: 'R2: 질의', result: '16/20 Blue', color: C.yes },
    { label: 'R3: 질의', result: '15/20 Blue', color: C.yes },
  ];
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">Snowflake: 연속 α번 동일 응답 시 결정</p>
      <svg viewBox="0 0 420 80" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        {rounds.map((r, i) => (
          <motion.g key={r.label} initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
            <ActionBox x={15 + i * 135} y={8} w={115} h={32}
              label={r.label} sub={r.result} color={r.color} />
            {i < 2 && (
              <motion.line x1={130 + i * 135} y1={24} x2={150 + i * 135} y2={24}
                stroke={C.snow} strokeWidth={1}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: i * 0.15 + 0.2 }} />
            )}
          </motion.g>
        ))}
        <motion.text x={210} y={62} textAnchor="middle" fontSize={11}
          fill={C.yes} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}>
          💡 3연속 {'≥'} α → Blue로 결정!
        </motion.text>
      </svg>
    </div>
  );
}

export default function Snowflake() {
  return (
    <section id="snowflake" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Snowflake: 이진 합의</h2>
      <SnowflakeViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Snowflake는 가장 단순한 형태입니다.<br />
          매 라운드 k개 노드를 샘플링해 질의합니다. {'≥'} α개가 같은 값이면 해당 값으로 선호를 전환합니다.<br />
          연속 β번 같은 값이 선호되면 결정합니다.<br />
          💡 문제: 선호가 쉽게 흔들릴 수 있음 → Snowball이 해결
        </p>
      </div>
    </section>
  );
}
