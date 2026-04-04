import { motion } from 'framer-motion';
import { ModuleBox, AlertBox, DataBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

export function StepLightClient() {
  const clients = ['모바일 지갑', '브릿지', 'DApp'];
  return (<g>
    {clients.map((c, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.12 }}>
        <DataBox x={30 + i * 135} y={30} w={100} h={28} label={c} color={C.sync} />
      </motion.g>
    ))}
    <text x={210} y={80} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      풀 노드 없이 체인 검증 필요 → 경량 증명
    </text>
  </g>);
}

export function StepFullVerification() {
  return (<g>
    <AlertBox x={110} y={18} w={200} h={50} label="58만 검증자 투표"
      sub="전부 다운로드 → 라이트가 아님" color={C.err} />
    <motion.text x={210} y={92} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      소수의 대표 서명으로 증명해야 함
    </motion.text>
  </g>);
}

export function StepCollusion() {
  return (<g>
    <AlertBox x={40} y={18} w={150} h={50} label="소수 공모 위험" sub="거짓 증명 가능" color={C.err} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ModuleBox x={230} y={18} w={150} h={50} label="정기적 교체" sub="충분한 수 필요" color={C.ok} />
    </motion.g>
  </g>);
}

export function StepCommittee512() {
  return (<g>
    <ModuleBox x={25} y={18} w={130} h={45} label="512명 위원회" sub="256 에폭 = ~27시간" color={C.sync} />
    <motion.line x1={160} y1={40} x2={210} y2={40} stroke={C.sync} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ModuleBox x={215} y={18} w={150} h={45} label="매 슬롯(12초) 서명" sub="HeadBlockRoot에 BLS" color={C.sign} />
    </motion.g>
    <motion.text x={210} y={85} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      라이트 클라이언트는 512개 공개키(48B x 512 = 24KB)만 추적
    </motion.text>
  </g>);
}

export function StepIncentive() {
  return (<g>
    <DataBox x={30} y={25} w={110} h={28} label="+보상" sub="참여 시" color={C.ok} />
    <DataBox x={280} y={25} w={110} h={28} label="-패널티" sub="불참 시" color={C.err} />
    <motion.text x={210} y={48} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      vs
    </motion.text>
    <motion.text x={210} y={78} textAnchor="middle" fontSize={11} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      높은 참여율 → 경량 증명 신뢰성 확보
    </motion.text>
  </g>);
}
