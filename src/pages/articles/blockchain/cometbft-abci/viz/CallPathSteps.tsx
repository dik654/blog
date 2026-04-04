import { motion } from 'framer-motion';
import { ModuleBox, DataBox } from '@/components/viz/boxes';
import { C } from './CallPathData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });

export function Step0() {
  const conns = [
    { label: 'Consensus', sub: 'Finalize, Commit', color: C.app },
    { label: 'Mempool', sub: 'CheckTx', color: C.proxy },
    { label: 'Query', sub: 'Info, Query', color: C.exec },
    { label: 'Snapshot', sub: '상태 동기화', color: C.local },
  ];
  return (<g>
    <ModuleBox x={16} y={10} w={90} h={40} label="AppConns" sub="4개 연결" color={C.exec} />
    {conns.map((c, i) => (
      <motion.g key={i} {...fade(0.15 + i * 0.1)}>
        <motion.line x1={110} y1={30} x2={125} y2={18 + i * 22}
          stroke={c.color} strokeWidth={0.8} {...fade(0.1 + i * 0.1)} />
        <DataBox x={130} y={4 + i * 22} w={110} h={24} label={c.label} sub={c.sub} color={c.color} />
      </motion.g>
    ))}
    <motion.g {...fade(0.6)}>
      <ModuleBox x={270} y={22} w={100} h={44} label="ABCI Client" sub="전송 모드 선택" color={C.local} />
    </motion.g>
    <motion.line x1={245} y1={42} x2={268} y2={44} stroke={C.local} strokeWidth={0.8} {...fade(0.5)} />
  </g>);
}

export function Step1() {
  return (<g>
    <ModuleBox x={16} y={15} w={100} h={44} label="localClient" sub="같은 프로세스" color={C.local} />
    <motion.g {...fade(0.2)}>
      <DataBox x={135} y={10} w={80} h={28} label="Mutex" sub="동시 접근 방지" color={C.local} />
    </motion.g>
    <motion.g {...fade(0.35)}>
      <DataBox x={135} y={44} w={80} h={28} label="Application" sub="임베딩" color={C.app} />
    </motion.g>
    <motion.line x1={220} y1={37} x2={255} y2={37} stroke={C.app} strokeWidth={1} {...fade(0.5)} />
    <motion.g {...fade(0.55)}>
      <ModuleBox x={260} y={15} w={120} h={44} label="app.Method()" sub="직접 호출 (직렬화 없음)" color={C.app} />
    </motion.g>
    <text x={240} y={90} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      Lock → app.Method(ctx, req) → Unlock — 가장 빠른 모드
    </text>
  </g>);
}

export function Step2() {
  const layers = [
    { label: 'BlockExecutor', color: C.exec, x: 10, w: 95 },
    { label: 'AppConnConsensus', color: C.proxy, x: 125, w: 120 },
    { label: 'localClient', color: C.local, x: 265, w: 85 },
    { label: 'Application', color: C.app, x: 370, w: 95 },
  ];
  return (<g>
    {layers.map((l, i) => (
      <motion.g key={i} {...fade(i * 0.12)}>
        <ModuleBox x={l.x} y={20} w={l.w} h={40} label={l.label} sub="" color={l.color} />
        {i < 3 && (
          <motion.line x1={l.x + l.w + 2} y1={40} x2={layers[i + 1].x - 2} y2={40}
            stroke={layers[i + 1].color} strokeWidth={1} {...fade(i * 0.12 + 0.06)} />
        )}
      </motion.g>
    ))}
    <text x={240} y={82} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      프록시 계층이 전송 모드를 추상화 — local이면 오버헤드 0
    </text>
  </g>);
}
