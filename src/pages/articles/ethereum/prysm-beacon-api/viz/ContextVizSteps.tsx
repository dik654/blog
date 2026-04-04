import { motion } from 'framer-motion';
import { ActionBox, AlertBox, ModuleBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: 외부 통신 요구 */
export function Step0() {
  const clients = ['Validator', 'Dashboard', 'Explorer'];
  return (<g>
    {clients.map((c, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1 }}>
        <rect x={20} y={18 + i * 28} width={95} height={20} rx={10}
          fill={`${C.val}12`} stroke={C.val} strokeWidth={0.7} />
        <text x={67} y={32 + i * 28} textAnchor="middle" fontSize={11} fill={C.val}>{c}</text>
      </motion.g>
    ))}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={180} y={25} w={120} h={42} label="Beacon Node" sub="상태·블록·검증" color={C.grpc} />
    </motion.g>
  </g>);
}

/* Step 1: 두 인터페이스 */
export function Step1() {
  return (<g>
    <ActionBox x={30} y={25} w={130} h={40} label="gRPC" sub="내부, 고성능" color={C.grpc} />
    <motion.text x={188} y={50} fontSize={12} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      +
    </motion.text>
    <ActionBox x={220} y={25} w={130} h={40} label="REST" sub="외부, 표준 API" color={C.rest} />
    <motion.text x={210} y={95} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      로직 중복 구현 → 유지보수 비용 2배
    </motion.text>
  </g>);
}

/* Step 2: 보안 + 성능 — 슬롯당 요청 수와 인증 필요성 */
export function Step2() {
  return (<g>
    <AlertBox x={30} y={18} w={155} h={50} label="인증 없음" sub="DoS·가짜 요청 노출" color={C.err} />
    <AlertBox x={235} y={18} w={155} h={50} label="슬롯당 수십 건" sub="duties+attest+sync/12초" color={C.err} />
    <motion.text x={210} y={95} textAnchor="middle" fontSize={10} fill={C.val}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      gRPC 인터셉터(로깅+인증) + 스트리밍으로 해결
    </motion.text>
  </g>);
}

/* Step 3: gRPC + gateway */
export function Step3() {
  const mods = [
    { label: 'gRPC 서버', sub: '로직 일원화', color: C.grpc },
    { label: 'gRPC-gateway', sub: 'REST 자동 변환', color: C.rest },
    { label: '인터셉터', sub: '로깅·인증·메트릭', color: C.val },
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
      로직 1벌 작성 → gRPC + REST 모두 지원
    </motion.text>
  </g>);
}

/* Step 4: 이벤트 스트리밍 + SSE */
export function Step4() {
  return (<g>
    <ModuleBox x={30} y={15} w={120} h={48} label="gRPC Stream" sub="실시간 푸시" color={C.grpc} />
    <motion.line x1={155} y1={39} x2={225} y2={39} stroke={C.ok} strokeWidth={1.2}
      strokeDasharray="4 2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ duration: 0.5 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <ModuleBox x={230} y={15} w={120} h={48} label="SSE (REST)" sub="폴링 불필요" color={C.rest} />
    </motion.g>
    <motion.text x={210} y={90} textAnchor="middle" fontSize={11} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      블록·어테스테이션 이벤트를 실시간 수신 — 지연 최소화
    </motion.text>
  </g>);
}
