import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Solidity 컨트랙트가 ROFL.call() 호출', body: 'Sapphire.rofl().call(rofl_app_id, query).\nprecompile 0x01...09 (subcall) 로 dispatch.' },
  { label: 'Runtime → ROFL app (TEE 외부 격리)', body: 'ROFL app 도 TEE 안에서 실행.\nHTTP/외부 API 호출 가능.' },
  { label: 'ROFL app 이 외부 API 요청', body: 'reqwest::get(api.coingecko.com).\nTEE 안에서 직접 → Host 가 요청 관측 불가.' },
  { label: '응답 → Runtime → 컨트랙트', body: 'price 받아 cbor 인코딩 후 반환.\nfront-running 방어 (oracle 가격이 TEE 내부에서 검증).' },
];

export default function RoflFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Components */}
          <ModuleBox x={20}  y={70} w={110} h={50}
            label="Solidity" sub="OracleCaller" color="#6366f1" />
          <ModuleBox x={150} y={70} w={120} h={50}
            label="Sapphire EVM" sub="(SGX)" color="#10b981" />
          <ModuleBox x={290} y={70} w={120} h={50}
            label="ROFL app" sub="(SGX)" color="#a855f7" />
          <ModuleBox x={430} y={70} w={40} h={50}
            label="API" sub="" color="#3b82f6" />

          {/* Step 0: contract → ROFL */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.line x1={130} y1={95} x2={150} y2={95}
                stroke="#6366f1" strokeWidth={1.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <text x={140} y={88} textAnchor="middle" fontSize={9} fill="#6366f1" fontWeight={600}>
                .call()
              </text>
              <DataBox x={150} y={140} w={120} h={28}
                label="precompile 0x09" color="#6366f1" outlined />
              <text x={210} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Sapphire.rofl().call(app_id, query)
              </text>
            </motion.g>
          )}

          {/* Step 1: routed to ROFL */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.line x1={270} y1={95} x2={290} y2={95}
                stroke="#10b981" strokeWidth={1.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <DataBox x={210} y={140} w={150} h={28} label="query (cbor)" color="#10b981" outlined />
              <text x={285} y={195} textAnchor="middle" fontSize={9} fill="#a855f7" fontWeight={600}>
                ROFL handle_query (TEE)
              </text>
            </motion.g>
          )}

          {/* Step 2: external HTTP */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.line x1={410} y1={95} x2={430} y2={95}
                stroke="#a855f7" strokeWidth={1.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <ActionBox x={290} y={135} w={120} h={36}
                label="reqwest::get" sub="api/price" color="#a855f7" />
              <text x={350} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Host 는 요청/응답 관측 불가
              </text>
              <text x={350} y={210} textAnchor="middle" fontSize={9} fill="#a855f7" fontWeight={600}>
                inside TEE
              </text>
            </motion.g>
          )}

          {/* Step 3: response back */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.line x1={430} y1={108} x2={130} y2={108}
                stroke="#10b981" strokeWidth={1.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <DataBox x={150} y={140} w={150} h={28}
                label="price (u256)" color="#10b981" outlined />
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="#10b981" fontWeight={600}>
                front-run 방어 — oracle 가 TEE 안에서 검증
              </text>
            </motion.g>
          )}

          <text x={240} y={228} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            ROFL = Runtime OFfchain Logic
          </text>
        </svg>
      )}
    </StepViz>
  );
}
