import { motion } from 'framer-motion';
import { ModuleBox, ActionBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 3: jsonrpsee + 매크로 */
export function StepMacro() {
  return (<g>
    <ActionBox x={30} y={20} w={160} h={42} label='#[rpc(namespace = "eth")]'
      sub="컴파일 타임 라우팅 생성" color={C.ok} />
    <motion.line x1={195} y1={41} x2={240} y2={41} stroke={C.ok} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ModuleBox x={245} y={18} w={130} h={46} label="jsonrpsee"
        sub="자동 라우팅 + 타입 검증" color={C.rpc} />
    </motion.g>
    <motion.text x={210} y={95} textAnchor="middle" fontSize={11} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      잘못된 타입 → 컴파일 에러
    </motion.text>
  </g>);
}

/* Step 4: tower 미들웨어 스택 */
export function StepMiddleware() {
  const layers = [
    { label: 'JWT 인증', color: C.mw },
    { label: 'CORS', color: C.rpc },
    { label: 'Rate Limit', color: C.engine },
    { label: 'Logging', color: '#6b7280' },
  ];
  return (<g>
    {layers.map((l, i) => (
      <motion.g key={l.label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.12 }}>
        <rect x={80} y={10 + i * 26} width={120} height={20} rx={4}
          fill={`${l.color}12`} stroke={l.color} strokeWidth={0.8} />
        <text x={140} y={24 + i * 26} textAnchor="middle" fontSize={11} fontWeight={600} fill={l.color}>
          {l.label}
        </text>
      </motion.g>
    ))}
    <motion.text x={290} y={55} fontSize={11} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      tower 미들웨어 패턴
    </motion.text>
    <motion.text x={290} y={70} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      hyper, axum과 동일 표준
    </motion.text>
  </g>);
}
