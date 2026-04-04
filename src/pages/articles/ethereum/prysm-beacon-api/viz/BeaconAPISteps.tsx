import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { C } from './BeaconAPIVizData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });

export function Step0() {
  return (<g>
    <ModuleBox x={30} y={10} w={120} h={44} label="gRPC" sub="내부 통신" color={C.grpc} />
    <ModuleBox x={230} y={10} w={120} h={44} label="REST" sub="외부 API" color={C.gateway} />
    <motion.g {...fade(0.4)}>
      <motion.line x1={150} y1={32} x2={230} y2={32} stroke="var(--muted-foreground)" strokeWidth={0.8} strokeDasharray="4 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 }} />
      <DataBox x={120} y={65} w={140} h={26} label="이중 경로 → 생태계 표준 충족" color={C.why} />
    </motion.g>
  </g>);
}

export function Step1() {
  const items = ['TCP 리스너', 'gRPC 서버', '인터셉터', 'Serve()'];
  return (<g>
    {items.map((s, i) => (
      <motion.g key={i} {...fade(0.2 + i * 0.15)}>
        {i > 0 && <motion.line x1={30 + (i - 1) * 95 + 80} y1={30} x2={30 + i * 95} y2={30}
          stroke={C.grpc} strokeWidth={0.7}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 + i * 0.15 }} />}
        <ActionBox x={30 + i * 95} y={12} w={80} h={36} label={s} color={C.grpc} />
      </motion.g>
    ))}
    <motion.text x={200} y={70} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)" {...fade(0.8)}>
      순차 초기화 → gRPC 서버 가동
    </motion.text>
  </g>);
}

export function Step2() {
  const svcs = ['BeaconChain', 'Validator', 'Node'];
  const colors = [C.spec, C.validator, C.grpc];
  return (<g>
    <ModuleBox x={10} y={20} w={100} h={42} label="gRPC 서버" sub="서비스 등록" color={C.grpc} />
    {svcs.map((s, i) => (
      <motion.g key={i} {...fade(0.3 + i * 0.15)}>
        <motion.line x1={110} y1={41} x2={150} y2={16 + i * 26}
          stroke={colors[i]} strokeWidth={0.6}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 + i * 0.15 }} />
        <ModuleBox x={155} y={5 + i * 26} w={110} h={22} label={s} color={colors[i]} />
      </motion.g>
    ))}
  </g>);
}
