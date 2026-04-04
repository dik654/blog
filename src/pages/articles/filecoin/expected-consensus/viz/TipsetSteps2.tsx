import { motion } from 'framer-motion';
import { C } from './TipsetVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

export function StepHeaviest() {
  const chains = [
    { blocks: 3, w: 378, y: 15, active: true },
    { blocks: 1, w: 120, y: 70, active: false },
  ];
  return (
    <g>
      {chains.map((ch, ci) => (
        <motion.g key={ci} animate={{ opacity: ch.active ? 1 : 0.3 }} transition={sp}>
          {Array.from({ length: ch.blocks }).map((_, bi) => (
            <rect key={bi} x={30 + bi * 80} y={ch.y} width={68} height={30} rx={6}
              fill={ch.active ? `${C.block}20` : `${C.block}08`}
              stroke={C.block} strokeWidth={ch.active ? 1.5 : 0.6} />
          ))}
          <text x={310} y={ch.y + 20} fontSize={10} fontWeight={600}
            fill={ch.active ? C.weight : 'var(--muted-foreground)'}>
            w={ch.w} {ch.active ? '← 선택' : ''}
          </text>
        </motion.g>
      ))}
      <motion.text x={210} y={120} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.4 }}>
        블록이 많은 Tipset → 높은 가중치 → 정규 체인
      </motion.text>
    </g>
  );
}

export function StepECvsF3() {
  const items = [
    { name: 'EC (기존)', time: '~7.5시간', ep: '900 에폭', c: C.ec, x: 40 },
    { name: 'F3 (신규)', time: '수 분', ep: '~10 에폭', c: C.f3, x: 230 },
  ];
  return (
    <g>
      {items.map((f, i) => (
        <motion.g key={f.name} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ delay: i * 0.15, ...sp }}>
          <rect x={f.x} y={15} width={150} height={75} rx={10}
            fill={`${f.c}12`} stroke={f.c} strokeWidth={1.5} />
          <text x={f.x + 75} y={42} textAnchor="middle" fontSize={11}
            fontWeight={600} fill={f.c}>{f.name}</text>
          <text x={f.x + 75} y={62} textAnchor="middle" fontSize={14}
            fontWeight={700} fill={f.c}>{f.time}</text>
          <text x={f.x + 75} y={80} textAnchor="middle" fontSize={10}
            fill={f.c} fillOpacity={0.5}>{f.ep}</text>
        </motion.g>
      ))}
      <motion.text x={210} y={118} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.5 }}>
        EC = 블록 생산 / F3 = 빠른 확정 — 역할 분리
      </motion.text>
    </g>
  );
}
