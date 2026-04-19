import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const C = {
  page: '#0ea5e9',
  hash: '#8b5cf6',
  digest: '#10b981',
  finish: '#f59e0b',
};

const STEPS = [
  { label: '초기 launch_digest = 0', body: 'LAUNCH_START 시점의 빈 상태' },
  { label: '각 LAUNCH_UPDATE_DATA — page_info 구성', body: 'PAGE_TYPE, GPA, perms, SHA-384(page_data)를 묶음' },
  { label: 'digest = SHA-384(prev_digest || page_info)', body: '체인 형태로 누적 — 순서·내용·메타 모두 영향' },
  { label: 'LAUNCH_FINISH — digest 확정 (frozen)', body: '이후 변경 불가, attestation report에 반영' },
  { label: 'Owner 검증 — 동일 이미지로 재계산 + 비교', body: 'Report.measurement vs 기대값 일치 → 의도한 VM' },
];

const PAGE_TYPES = [
  { t: 'NORMAL', sub: 'code/data', color: '#0ea5e9' },
  { t: 'VMSA', sub: 'vCPU init', color: '#8b5cf6' },
  { t: 'ZERO', sub: '0-fill', color: '#888' },
  { t: 'CPUID', sub: 'CPUID table', color: '#10b981' },
  { t: 'SECRETS', sub: 'VMPL secrets', color: '#f59e0b' },
];

export default function MeasurementAccumViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Initial digest */}
          <motion.g animate={{ opacity: step >= 0 ? 1 : 0.2 }}>
            <DataBox x={20} y={26} w={120} h={36} label="digest = 0" color="#888" outlined />
          </motion.g>

          {/* Page chain */}
          {[0, 1, 2].map(i => {
            const x = 160 + i * 100;
            const visible = step >= 1;
            return (
              <motion.g key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: visible ? 1 : 0.15 }}
                transition={{ delay: visible ? i * 0.1 : 0 }}>
                <ModuleBox x={x} y={26} w={90} h={36} label={`page ${i + 1}`} sub="UPDATE_DATA" color={C.page} />
                {visible && (
                  <motion.line x1={x - 20} y1={44} x2={x} y2={44}
                    stroke={C.page} strokeWidth={1} markerEnd="url(#mc1)"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.05 + i * 0.1 }} />
                )}
              </motion.g>
            );
          })}

          {/* page_info construction */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <text x={20} y={84} fontSize={9} fontWeight={700} fill={C.hash}>page_info 구성</text>
              <DataBox x={20} y={92} w={100} h={26} label="LEN=0x30" color={C.hash} outlined />
              <DataBox x={130} y={92} w={100} h={26} label="PAGE_TYPE" color={C.hash} outlined />
              <DataBox x={240} y={92} w={100} h={26} label="GPA" color={C.hash} outlined />
              <DataBox x={350} y={92} w={110} h={26} label="SHA-384(data)" color={C.hash} outlined />
            </motion.g>
          )}

          {/* SHA-384 chain step */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <ActionBox x={20} y={130} w={440} h={42} label="digest = SHA-384(digest || page_info)" sub="순서 의존 누적 체인" color={C.hash} />
            </motion.g>
          )}

          {/* Page type chips */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={20} y={186} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">PAGE_TYPE</text>
              {PAGE_TYPES.map((pt, i) => (
                <motion.g key={pt.t}
                  initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                  <DataBox x={70 + i * 82} y={194} w={78} h={28} label={pt.t} sub={pt.sub} color={pt.color} outlined />
                </motion.g>
              ))}
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <ActionBox x={130} y={184} w={220} h={44} label="LAUNCH_FINISH" sub="launch_digest 확정 → frozen" color={C.finish} />
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <ModuleBox x={20} y={184} w={210} h={44} label="Owner 재계산" sub="동일 이미지로 SHA-384" color={C.digest} />
              <DataBox x={250} y={184} w={210} h={44} label="Report.measurement 비교" color={C.digest} outlined />
              <text x={240} y={236} textAnchor="middle" fontSize={9} fill={C.digest}>일치 → "의도한 VM"</text>
            </motion.g>
          )}

          <defs>
            <marker id="mc1" markerWidth={5} markerHeight={5} refX={4} refY={2.5} orient="auto">
              <polygon points="0 0, 5 2.5, 0 5" fill={C.page} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
