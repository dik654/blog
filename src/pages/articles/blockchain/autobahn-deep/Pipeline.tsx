import { motion } from 'framer-motion';
import { ModuleBox } from '@/components/viz/boxes';

const C = { pipe: '#f59e0b', ok: '#10b981' };

function PipelineViz() {
  const leaders = [
    { slot: 1, leader: 'L1', status: 'Commit' },
    { slot: 2, leader: 'L2', status: 'Vote' },
    { slot: 3, leader: 'L3', status: 'Propose' },
  ];
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">파이프라인: 여러 슬롯이 동시 진행</p>
      <svg viewBox="0 0 420 90" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        {leaders.map((l, i) => (
          <motion.g key={l.slot} initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15, type: 'spring' }}>
            <ModuleBox x={15 + i * 135} y={10} w={115} h={40}
              label={`Slot ${l.slot} (${l.leader})`} sub={l.status} color={i === 0 ? C.ok : C.pipe} />
          </motion.g>
        ))}
        <motion.text x={210} y={72} textAnchor="middle" fontSize={11}
          fill={C.pipe} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}>
          💡 앞 슬롯 커밋 대기 없이 다음 슬롯 제안 시작
        </motion.text>
      </svg>
    </div>
  );
}

export default function Pipeline() {
  return (
    <section id="pipeline" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">파이프라인 구조</h2>
      <PipelineViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Autobahn은 리더를 회전하며 여러 슬롯을 동시에 진행합니다.<br />
          슬롯 1이 커밋되기 전에 슬롯 2, 3이 이미 투표를 진행합니다.<br />
          💡 처리량 = 동시 슬롯 수 x 단일 슬롯 처리량
        </p>
      </div>
    </section>
  );
}
