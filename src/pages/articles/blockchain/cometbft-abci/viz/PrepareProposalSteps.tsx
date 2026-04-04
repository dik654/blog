import { motion } from 'framer-motion';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';
import { C } from './PrepareProposalData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const W = 480, MX = 16;

export function Step0() {
  return (<g>
    <ModuleBox x={MX} y={20} w={100} h={44} label="BlockExecutor" sub="제안자 전용" color={C.exec} />
    <motion.line x1={120} y1={42} x2={170} y2={42} stroke={C.exec} strokeWidth={1} {...fade(0.2)} />
    <motion.g {...fade(0.3)}>
      <ActionBox x={175} y={22} w={100} h={40} label="ReapMaxBytes" sub="TX 수집" color={C.exec} />
    </motion.g>
    <motion.line x1={280} y1={42} x2={320} y2={42} stroke={C.exec} strokeWidth={1} {...fade(0.4)} />
    <motion.g {...fade(0.5)}>
      <DataBox x={325} y={24} w={130} h={36} label="txs [][]byte" sub="크기 제한 내 TX 목록" color={C.exec} />
    </motion.g>
    <text x={W / 2} y={90} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      mempool에서 maxDataBytes/maxGas 범위 내 TX를 가져옴
    </text>
  </g>);
}

export function Step1() {
  return (<g>
    <ModuleBox x={MX} y={20} w={100} h={44} label="BlockExecutor" sub="CreateProposal" color={C.exec} />
    <motion.line x1={120} y1={42} x2={150} y2={42} stroke={C.proxy} strokeWidth={1} {...fade(0.2)} />
    <motion.g {...fade(0.3)}>
      <ModuleBox x={155} y={20} w={120} h={44} label="AppConnConsensus" sub="프록시 계층" color={C.proxy} />
    </motion.g>
    <motion.line x1={280} y1={42} x2={310} y2={42} stroke={C.local} strokeWidth={1} {...fade(0.4)} />
    <motion.g {...fade(0.5)}>
      <ModuleBox x={315} y={20} w={100} h={44} label="localClient" sub="ABCI Client" color={C.local} />
    </motion.g>
    <text x={W / 2} y={90} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      프록시 계층이 전송 모드를 추상화 — local이면 직접 호출
    </text>
  </g>);
}

export function Step2() {
  return (<g>
    <ModuleBox x={MX} y={10} w={90} h={40} label="localClient" sub="Mutex 보호" color={C.local} />
    <motion.g {...fade(0.2)}>
      <ActionBox x={MX + 5} y={56} w={80} h={30} label="Lock()" sub="" color={C.local} />
    </motion.g>
    <motion.line x1={110} y1={38} x2={180} y2={38} stroke={C.app} strokeWidth={1} {...fade(0.3)} />
    <motion.g {...fade(0.4)}>
      <ModuleBox x={185} y={10} w={130} h={40} label="app.PrepareProposal" sub="Cosmos SDK BaseApp" color={C.app} />
    </motion.g>
    <motion.g {...fade(0.6)}>
      <ActionBox x={MX + 5} y={56} w={80} h={30} label="Unlock()" sub="" color={C.local} />
    </motion.g>
    <text x={W / 2} y={100} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      Mutex로 직렬화 — 네트워크/protobuf 오버헤드 없음
    </text>
  </g>);
}

export function Step3() {
  const records = ['ADDED', 'REMOVED', 'UNMODIFIED'];
  const colors = [C.app, '#ef4444', C.exec];
  return (<g>
    <ModuleBox x={MX} y={15} w={100} h={40} label="app 응답" sub="TxRecords" color={C.app} />
    {records.map((r, i) => (
      <motion.g key={r} {...fade(0.2 + i * 0.15)}>
        <DataBox x={130 + i * 110} y={18} w={100} h={32} label={r} sub={
          i === 0 ? '앱이 추가한 TX' : i === 1 ? '앱이 제거한 TX' : '원본 유지'
        } color={colors[i]} />
      </motion.g>
    ))}
    <motion.text x={W / 2} y={76} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.app} {...fade(0.6)}>
      block.Txs = txRecordsToTxs(rpp.TxRecords)
    </motion.text>
    <text x={W / 2} y={100} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      앱이 최종 TX 순서·구성 결정 — MEV 보호, 번들링 가능
    </text>
  </g>);
}
