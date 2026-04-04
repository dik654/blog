import { motion } from 'framer-motion';
import { C } from './ContextVizData';

const f = (d: number) => ({ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace' };

export function StepPattern() {
  const lines = [
    { line: '// Flush+Reload 공격 (x86)', c: C.attack, y: 38 },
    { line: 'CLFLUSH(target_addr)    // 캐시 라인 무효화', c: C.attack, y: 58 },
    { line: '// ... TEE 실행 (target_addr 접근?) ...', c: C.ok, y: 78 },
    { line: 't0 = RDTSC; load(target_addr); t1 = RDTSC', c: C.cache, y: 100 },
    { line: 'if (t1-t0 < 80) → CACHE HIT = TEE가 접근함', c: C.attack, y: 120 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.attack}>Flush+Reload 타이밍 공격</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={15} y={l.y - 13} width={400} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={25} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function StepSpectre() {
  const lines = [
    { line: '// Spectre v1: Bounds Check Bypass', c: C.spec, y: 38 },
    { line: 'if (x < array1_size)  // 분기 예측: taken', c: C.spec, y: 58 },
    { line: '  val = array1[x]    // 투기적 실행: 범위 밖 로드', c: C.attack, y: 78 },
    { line: '  tmp = array2[val * 256]  // 캐시에 흔적', c: C.attack, y: 98 },
    { line: '// 롤백되어도 array2 캐시 상태 = 유출', c: C.attack, y: 120 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.spec}>Spectre v1: 투기적 실행</text>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.1)}>
        <rect x={15} y={l.y - 13} width={400} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={25} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}
