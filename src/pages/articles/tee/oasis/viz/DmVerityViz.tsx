import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '번들 안의 dm-verity 자료', body: 'rootfs.img (ext4) + rootfs.verity (해시 트리) + rootfs.roothash.\n매니페스트에 roothash 가 기록됨.' },
  { label: '1) 매니페스트에서 roothash 로드', body: '런타임 시작 시 manifest 검증된 roothash 사용.\n신뢰의 출발점.' },
  { label: '2) dm-verity 장치 생성', body: 'dmsetup create rootfs-verity --table "0 N verity ...".\n읽기마다 hash tree 와 대조.' },
  { label: '3) 변조 즉시 탐지', body: 'Host 가 라이브러리·설정 파일 변조 시 hash 불일치.\n읽기 실패 → enclave 거부.' },
];

export default function DmVerityViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Bundle structure */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={20} y={25} fontSize={10} fontWeight={600} fill="var(--foreground)">bundle/</text>
              <DataBox x={30}  y={40}  w={170} h={28} label="rootfs.img (ext4)" color="#6366f1" outlined />
              <DataBox x={30}  y={75}  w={170} h={28} label="rootfs.verity" color="#10b981" outlined />
              <DataBox x={30}  y={110} w={170} h={28} label="rootfs.roothash" color="#f59e0b" outlined />
              <rect x={250} y={45} width={210} height={100} rx={8}
                fill="var(--card)" stroke="#a855f7" strokeWidth={0.9} />
              <text x={355} y={66} textAnchor="middle" fontSize={10} fontWeight={700} fill="#a855f7">
                manifest
              </text>
              <text x={355} y={95} textAnchor="middle" fontSize={9} fill="#f59e0b" fontWeight={600}>
                roothash 기록
              </text>
              <text x={355} y={120} textAnchor="middle" fontSize={9} fill="#a855f7" fontWeight={600}>
                signed
              </text>
            </motion.g>
          )}

          {/* Step 1 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={20}  y={50} w={150} h={50} label="manifest" color="#a855f7" />
              <ActionBox x={200} y={56} w={130} h={42}
                label="load roothash" color="#f59e0b" />
              <DataBox x={350} y={64} w={110} h={28}
                label="0xa3f...c2" color="#f59e0b" outlined />
              <text x={240} y={140} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                trust anchor — 이후 모든 검증의 출발점
              </text>
            </motion.g>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ActionBox x={20} y={50} w={170} h={42}
                label="dmsetup create" sub="rootfs-verity" color="#10b981" />
              <ModuleBox x={210} y={50} w={250} h={150}
                label="dm-verity device" color="#3b82f6" />
              <DataBox x={230} y={95} w={210} h={26}
                label="root hash 검증" color="#f59e0b" outlined />
              <DataBox x={230} y={130} w={210} h={26}
                label="hash tree (sparse)" color="#10b981" outlined />
              <DataBox x={230} y={165} w={210} h={26}
                label="data block" color="#6366f1" outlined />
              <text x={240} y={225} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                read 시마다 block → hash → root 연쇄 검증
              </text>
            </motion.g>
          )}

          {/* Step 3 — tampering */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={20} y={50} w={130} h={50}
                label="Host" sub="adversary" color="#ef4444" />
              <ActionBox x={170} y={56} w={140} h={42}
                label="tamper file" color="#ef4444" />
              <ModuleBox x={330} y={50} w={130} h={50}
                label="dm-verity" color="#10b981" />
              <motion.line x1={150} y1={75} x2={170} y2={75}
                stroke="#ef4444" strokeWidth={1.2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <motion.line x1={310} y1={75} x2={330} y2={75}
                stroke="#ef4444" strokeWidth={1.2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
              <AlertBox x={140} y={130} w={200} h={40}
                label="hash mismatch" sub="enclave 읽기 거부" color="#ef4444" />
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="#ef4444" fontWeight={700}>
                즉시 탐지 — Host 변조로 enclave 침투 차단
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
