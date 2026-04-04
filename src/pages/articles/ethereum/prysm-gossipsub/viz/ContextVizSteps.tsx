import { motion } from 'framer-motion';
import { ActionBox, AlertBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: 12초 안에 전체 전파 */
export function Step0() {
  return (<g>
    <ActionBox x={30} y={25} w={100} h={40} label="블록 제안" sub="슬롯 시작" color={C.ok} />
    <motion.circle r={4} fill={C.mesh}
      initial={{ cx: 135, cy: 45 }} animate={{ cx: 280, cy: 45 }}
      transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      {[280, 320, 360].map((x, i) => (
        <circle key={i} cx={x} cy={30 + i * 15} r={10} fill="var(--card)"
          stroke={C.mesh} strokeWidth={0.8} />
      ))}
      <text x={320} y={88} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        수만 검증자
      </text>
    </motion.g>
    <text x={210} y={105} textAnchor="middle" fontSize={11} fill={C.mesh}>
      12초 내 도달 필수
    </text>
  </g>);
}

/* Step 1: 브로드캐스트 = 대역폭 폭발 — 오각형 배치로 all-to-all 시각화 */
export function Step1() {
  const cx = 200, cy = 42, r = 32;
  const pts = Array.from({ length: 5 }, (_, i) => {
    const a = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });
  return (<g>
    {/* 먼저 all-to-all 간선 (10개) */}
    {pts.map((p1, i) => pts.slice(i + 1).map((p2, j) => (
      <motion.line key={`${i}-${j}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
        stroke={C.err} strokeWidth={0.5} opacity={0.5}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }} />
    )))}
    {pts.map((p, i) => (
      <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.06 }}>
        <circle cx={p.x} cy={p.y} r={10} fill="var(--card)" stroke={C.err} strokeWidth={0.8} />
        <text x={p.x} y={p.y + 3.5} textAnchor="middle" fontSize={8} fill={C.err}>N{i}</text>
      </motion.g>
    ))}
    <motion.text x={340} y={45} fontSize={11} fontWeight={600} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      10 링크 / 5 노드
    </motion.text>
    <motion.text x={210} y={95} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      O(N²) — 모든 노드가 모든 노드에 전송
    </motion.text>
  </g>);
}

/* Step 2: 스팸 메시지 전파 */
export function Step2() {
  return (<g>
    <AlertBox x={40} y={20} w={120} h={50} label="악의적 피어" sub="무효 블록 전파" color={C.err} />
    <motion.circle r={4} fill={C.err}
      initial={{ cx: 165, cy: 45, opacity: 1 }} animate={{ cx: 300, cy: 45, opacity: 0.3 }}
      transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.8 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <AlertBox x={260} y={20} w={130} h={50} label="전체 네트워크" sub="무효 메시지로 오염" color={C.err} />
    </motion.g>
  </g>);
}

