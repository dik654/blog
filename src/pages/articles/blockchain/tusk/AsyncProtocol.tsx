import { motion } from 'framer-motion';
import { ModuleBox, ActionBox } from '@/components/viz/boxes';

const C = { wave: '#6366f1', coin: '#10b981', node: '#0ea5e9' };

function WaveViz() {
  const waves = ['Wave 1', 'Wave 2', 'Wave 3'];
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">Tusk 웨이브 구조: 3라운드 = 1 웨이브</p>
      <svg viewBox="0 0 420 100" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        {waves.map((w, i) => (
          <motion.g key={w} initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
            <ModuleBox x={10 + i * 140} y={10} w={120} h={38}
              label={w} sub="3 라운드" color={C.wave} />
          </motion.g>
        ))}
        {[0, 1].map(i => (
          <motion.line key={i} x1={130 + i * 140} y1={29} x2={150 + i * 140} y2={29}
            stroke={C.wave} strokeWidth={1}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 0.4 + i * 0.15 }} />
        ))}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}>
          <ActionBox x={130} y={60} w={160} h={30}
            label="Common Coin" sub="웨이브마다 리더 선택" color={C.coin} />
        </motion.g>
      </svg>
      <p className="text-xs text-center text-foreground/75 mt-2">
        💡 각 웨이브 끝에서 랜덤 코인으로 리더를 선택 → 리더의 vertex 기준으로 커밋
      </p>
    </div>
  );
}

export default function AsyncProtocol() {
  return (
    <section id="async-protocol" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">비동기 프로토콜 구조</h2>
      <WaveViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>3라운드 웨이브</h3>
        <p className="leading-7">
          Tusk는 3라운드를 하나의 웨이브로 묶습니다.<br />
          1라운드: 리더 vertex 제안. 2-3라운드: 투표 역할.<br />
          💡 웨이브 끝에서 랜덤 코인이 리더를 공개하면, 2/3+ 참조가 있으면 커밋
        </p>
        <h3>활성 보장 (Liveness)</h3>
        <p className="leading-7">
          코인이 정직한 리더를 선택할 확률은 {'≥'} 2/3입니다.<br />
          충분한 웨이브가 지나면 확률적으로 커밋이 보장됩니다.<br />
          💡 비동기에서도 O(1) 기대 지연으로 합의 완료
        </p>
      </div>
    </section>
  );
}
