import { motion } from 'framer-motion';
import { C } from './ContextVizData';

const f = (d: number) => ({ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace' };

export function StepPrimeProbe() {
  const lines = [
    { line: '// Prime: 캐시 셋 채우기', c: C.cache, y: 38 },
    { line: 'for (i in eviction_set) load(evict[i])', c: C.cache, y: 58 },
    { line: '// TEE 실행 → 일부 캐시 라인 교체됨', c: C.ok, y: 82 },
    { line: '// Probe: 각 라인 시간 측정', c: C.attack, y: 102 },
    { line: 'if (RDTSC(evict[i]) > threshold) → 교체됨', c: C.attack, y: 122 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.cache}>Prime+Probe: 캐시 셋 공격</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={15} y={l.y - 13} width={395} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={25} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepDefense() {
  const lines = [
    { line: 'LFENCE          // 투기적 실행 직렬화', c: C.ok, y: 38 },
    { line: 'CMOV cond, a, b  // 분기 제거 (constant-time)', c: C.ok, y: 58 },
    { line: 'IA32_L3_QOS_MASK[COS] = 0x0F  // CAT 4-way 격리', c: C.cache, y: 82 },
    { line: 'IA32_PQR_ASSOC.COS = 2  // TEE 전용 캐시 웨이', c: C.cache, y: 102 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ok}>방어: LFENCE + CAT 파티셔닝</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.12)}>
        <rect x={15} y={l.y - 13} width={410} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={25} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}
