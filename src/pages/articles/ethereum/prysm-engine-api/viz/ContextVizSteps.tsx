import { motion } from 'framer-motion';
import { ActionBox, AlertBox, ModuleBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: The Merge 이후 구조 */
export function Step0() {
  return (<g>
    <ModuleBox x={30} y={25} w={120} h={48} label="CL (Prysm)" sub="합의 + 포크 선택" color={C.cl} />
    <motion.line x1={155} y1={49} x2={235} y2={49} stroke={C.ok} strokeWidth={1.2}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
    <motion.text x={195} y={43} textAnchor="middle" fontSize={10} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      Engine API
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <ModuleBox x={240} y={25} w={120} h={48} label="EL (Geth)" sub="TX 실행" color={C.el} />
    </motion.g>
    <text x={210} y={100} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
      CL이 EL을 구동 — EL은 실행만 담당
    </text>
  </g>);
}

/* Step 1: CL-EL 동기화 */
export function Step1() {
  return (<g>
    <ActionBox x={30} y={25} w={110} h={40} label="CL 헤드" sub="slot N" color={C.cl} />
    <AlertBox x={230} y={25} w={130} h={40} label="EL 헤드" sub="block N-2 ???" color={C.err} />
    <motion.text x={185} y={50} fontSize={14} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      {'!='}
    </motion.text>
    <motion.text x={210} y={95} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      CL-EL 어긋남 → 체인 진행 중단
    </motion.text>
  </g>);
}

/* Step 2: 인증 없이 통신 위험 */
export function Step2() {
  return (<g>
    <AlertBox x={110} y={18} w={200} h={55}
      label="Engine API 노출" sub="가짜 페이로드 주입 위험" color={C.err} />
    <motion.text x={210} y={100} textAnchor="middle" fontSize={11} fill={C.build}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      JWT 공유 시크릿으로 상호 검증 필수
    </motion.text>
  </g>);
}

/* Step 3: Engine API 3대 메서드 */
export function Step3() {
  const mods = [
    { label: 'NewPayload', sub: '실행 요청', color: C.ok },
    { label: 'FCU', sub: '헤드 갱신', color: C.cl },
    { label: 'GetPayload', sub: '빌드 요청', color: C.build },
  ];
  return (<g>
    {mods.map((m, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.12 }}>
        <ModuleBox x={15 + i * 138} y={20} w={118} h={48} label={m.label} sub={m.sub} color={m.color} />
      </motion.g>
    ))}
    <motion.text x={210} y={95} textAnchor="middle" fontSize={11} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      JWT 인증 + 3대 메서드로 CL-EL 연동
    </motion.text>
  </g>);
}

/* Step 4: JWT 인증 + 재시도 전략 */
export function Step4() {
  return (<g>
    <ActionBox x={25} y={15} w={140} h={44} label="JWT HS256" sub="jwt.hex (32B 시크릿)" color={C.build} />
    <motion.circle r={3.5} fill={C.ok}
      initial={{ cx: 170, cy: 37, opacity: 1 }}
      animate={{ cx: 220, cy: 37, opacity: 0 }}
      transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }} />
    <motion.text x={195} y={30} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      iat + 5초 exp
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <ActionBox x={225} y={15} w={155} h={44} label="EL 검증" sub="서명 확인 + exp 체크" color={C.el} />
    </motion.g>
    <motion.text x={210} y={85} textAnchor="middle" fontSize={10} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      타임아웃 시 재시도 + 지수 백오프 — 연결 안정성 보장
    </motion.text>
  </g>);
}
