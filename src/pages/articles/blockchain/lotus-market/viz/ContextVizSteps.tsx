import { motion } from 'framer-motion';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

export function StepMarket() {
  return (<g>
    <ModuleBox x={30} y={25} w={120} h={42} label="Client" sub="데이터 저장 요청" color={C.deal} />
    <motion.circle r={3} fill={C.data}
      initial={{ cx: 155, cy: 46, opacity: 1 }}
      animate={{ cx: 230, cy: 46, opacity: 0 }}
      transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1.2 }} />
    <ModuleBox x={240} y={25} w={130} h={42}
      label="Storage Provider" sub="봉인 + 증명" color={C.data} />
    <text x={210} y={95} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
      Filecoin이 매칭 + 검증 + 결제를 자동화
    </text>
  </g>);
}

export function StepDeal() {
  const steps = ['제안', '수락', '전송', '봉인', '온체인'];
  return (<g>
    {steps.map((s, i) => (
      <motion.g key={s} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}>
        <rect x={8 + i * 82} y={35} width={68} height={26} rx={4}
          fill={`${C.deal}12`} stroke={C.deal} strokeWidth={0.8} />
        <text x={42 + i * 82} y={52} textAnchor="middle" fontSize={10}
          fontWeight={600} fill={C.deal}>{s}</text>
        {i < 4 && <text x={76 + i * 82} y={52} fontSize={10} fill="var(--border)">→</text>}
      </motion.g>
    ))}
    <text x={210} y={85} textAnchor="middle" fontSize={11} fill={C.chain}>
      PublishStorageDeals → 매 에폭 비용 정산
    </text>
  </g>);
}

export function StepRetrieval() {
  return (<g>
    <ActionBox x={20} y={25} w={100} h={38}
      label="쿼리" sub="PayloadCID" color={C.ret} />
    <motion.line x1={125} y1={44} x2={165} y2={44} stroke={C.ret} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
    <ActionBox x={170} y={25} w={100} h={38}
      label="가격 협상" sub="바이트당 가격" color={C.chain} />
    <motion.line x1={275} y1={44} x2={315} y2={44} stroke={C.data} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <DataBox x={320} y={28} w={85} h={32} label="Data" sub="+ PayCh" color={C.data} />
    </motion.g>
  </g>);
}

export function StepBoost() {
  return (<g>
    <ModuleBox x={30} y={18} w={140} h={42}
      label="lotus-miner" sub="기존 내장 마켓" color={C.deal} />
    <motion.text x={210} y={42} fontSize={12} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>→</motion.text>
    <motion.g initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}>
      <ModuleBox x={240} y={18} w={140} h={42}
        label="Boost" sub="독립 마켓 데몬" color={C.data} />
    </motion.g>
    <motion.text x={210} y={90} textAnchor="middle" fontSize={11} fill={C.data}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      HTTP/GraphSync + 인덱싱 + 리트리벌 통합
    </motion.text>
  </g>);
}
