import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'CometBFT는 단일 ABCI만 인식', body: 'mux 가 여러 Oasis 모듈(Staking·Registry·Roothash 등)을 하나의 Application 으로 합쳐 노출.' },
  { label: 'CheckTx — mempool 진입 전 검증', body: 'Tx[0] 의 1바이트 tag 로 담당 Application 선택 → 해당 app.CheckTx 위임.' },
  { label: 'DeliverTx — 블록에 포함된 Tx 실행', body: 'Tx[0] tag → app.ExecuteTx(ctx, Tx[1:]).\nApplication 별 상태 업데이트는 ApplicationState 가 추적.' },
  { label: 'Tag 기반 라우팅 — 충돌 없음', body: 'appsByTxTag 맵으로 O(1) 분기.\n각 모듈은 자기 prefix(0x00~0x06) 를 미리 등록.' },
];

export default function AbciMuxViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* CometBFT */}
          <ModuleBox x={20} y={30} w={110} h={50}
            label="CometBFT" sub="single ABCI" color="#6366f1" />

          {/* Tx flowing in */}
          {(step === 1 || step === 2) && (
            <motion.g
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              <DataBox x={140} y={42} w={50} h={26}
                label={step === 1 ? 'CheckTx' : 'DeliverTx'} color="#3b82f6" outlined />
              <text x={165} y={86} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">
                Tx[0] = tag
              </text>
            </motion.g>
          )}

          {/* mux */}
          <motion.g animate={{ opacity: step >= 0 ? 1 : 0.3 }}>
            <ModuleBox x={205} y={30} w={90} h={50}
              label="abciMux" sub="appsByTxTag" color="#10b981" />
          </motion.g>

          {/* Connector */}
          <motion.line x1={130} y1={55} x2={205} y2={55}
            stroke={step >= 1 ? '#3b82f6' : 'var(--border)'} strokeWidth={1.5}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />

          {/* Apps */}
          {[
            { x: 320, y: 10,  tag: '0x00', name: 'Beacon',     color: '#f59e0b' },
            { x: 320, y: 50,  tag: '0x01', name: 'Registry',   color: '#a855f7' },
            { x: 320, y: 90,  tag: '0x02', name: 'Roothash',   color: '#10b981' },
            { x: 320, y: 130, tag: '0x03', name: 'Scheduler',  color: '#3b82f6' },
            { x: 320, y: 170, tag: '0x04', name: 'KeyManager', color: '#ec4899' },
            { x: 320, y: 210, tag: '0x05', name: 'Staking',    color: '#6366f1' },
          ].map((a, i) => {
            const highlight = step === 3;
            return (
              <motion.g key={a.name}
                initial={{ opacity: 0 }} animate={{ opacity: highlight ? 1 : 0.55 }}
                transition={{ delay: highlight ? i * 0.05 : 0, duration: 0.3 }}>
                <ActionBox x={a.x} y={a.y} w={130} h={28} label={a.name} sub={a.tag} color={a.color} />
                {/* fanout line */}
                <motion.line x1={295} y1={55} x2={a.x} y2={a.y + 14}
                  stroke={highlight ? a.color : 'var(--border)'} strokeWidth={0.7}
                  strokeDasharray="3,2"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }} />
              </motion.g>
            );
          })}

          <text x={240} y={228} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            mux.appsByTxTag[Tx[0]] → app.ExecuteTx
          </text>
        </svg>
      )}
    </StepViz>
  );
}
