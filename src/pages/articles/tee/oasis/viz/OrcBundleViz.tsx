import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '.orc 디렉토리 구조', body: 'manifest.json + components/ronl/ + components/rofl/.\nronl: Runtime-On-Native-Layer (default).\nrofl: Runtime OFfchain Logic (선택).' },
  { label: 'manifest.json — id·version·components', body: '런타임 ID + SemVer + components 배열.\n각 component 가 executable + sgx{executable, signature} 보유.' },
  { label: '노드의 번들 검증 단계', body: '1) 매니페스트 서명 검증 → 2) MRENCLAVE 를 Registry 등록값과 대조 → 3) 버전이 Governance 허용값인지 → 4) SGX/네이티브 로더로 로딩.' },
];

const FILES = [
  { name: 'manifest.json',     y: 30,  color: '#6366f1' },
  { name: 'components/ronl/',  y: 65,  color: '#10b981', dir: true },
  { name: '  ├ runtime',       y: 95,  color: '#10b981' },
  { name: '  ├ runtime.sgxs',  y: 117, color: '#f59e0b' },
  { name: '  └ runtime.sig',   y: 139, color: '#f59e0b' },
  { name: 'components/rofl/',  y: 169, color: '#a855f7', dir: true, optional: true },
];

export default function OrcBundleViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* tree on left for steps 0-1 */}
          {(step === 0 || step === 1) && (
            <>
              <text x={20} y={20} fontSize={10} fill="var(--foreground)" fontWeight={600}>
                sapphire-paratime.orc/
              </text>
              {FILES.map((f, i) => {
                const highlight = step === 1 && i === 0;
                return (
                  <motion.g key={f.name}
                    initial={{ opacity: 0, x: -5 }} animate={{ opacity: f.optional ? 0.5 : 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}>
                    <text x={20} y={f.y + 12} fontSize={10}
                      fill={highlight ? f.color : 'var(--foreground)'}
                      fontFamily="monospace" fontWeight={highlight ? 700 : 400}>
                      {f.name}
                    </text>
                    <DataBox x={170} y={f.y} w={70} h={20}
                      label={
                        i === 0 ? 'meta'
                        : i === 1 ? 'dir'
                        : i === 2 ? 'native'
                        : i === 3 ? 'enclave'
                        : i === 4 ? 'SIGSTRUCT'
                        : 'optional'
                      } color={f.color} outlined={highlight} />
                  </motion.g>
                );
              })}
            </>
          )}

          {/* manifest.json detail (step 1) */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={260} y={30} w={200} h={150}
                label="manifest.json" color="#6366f1" />
              <text x={275} y={70} fontSize={10} fontFamily="monospace" fill="var(--foreground)">
                id: 0000...
              </text>
              <text x={275} y={88} fontSize={10} fontFamily="monospace" fill="var(--foreground)">
                version: 1.0.0
              </text>
              <text x={275} y={106} fontSize={10} fontFamily="monospace" fill="var(--foreground)">
                components: [
              </text>
              <text x={275} y={124} fontSize={10} fontFamily="monospace" fill="#10b981">
                  kind: ronl
              </text>
              <text x={275} y={142} fontSize={10} fontFamily="monospace" fill="#10b981">
                  executable
              </text>
              <text x={275} y={160} fontSize={10} fontFamily="monospace" fill="#f59e0b">
                  sgx: {'{ ... }'}
              </text>
              <text x={275} y={172} fontSize={10} fontFamily="monospace" fill="var(--foreground)">]</text>
            </motion.g>
          )}

          {/* validation pipeline (step 2) */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[
                { name: '1. verify\nmanifest sig', x: 25,  color: '#6366f1' },
                { name: '2. MRENCLAVE\nin Registry', x: 135, color: '#10b981' },
                { name: '3. Governance\nallowed ver',  x: 245, color: '#f59e0b' },
                { name: '4. spawn loader',              x: 360, color: '#a855f7' },
              ].map((p, i) => (
                <motion.g key={p.name}
                  initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}>
                  <ActionBox x={p.x} y={50} w={100} h={56} label={p.name.split('\n')[0]}
                    sub={p.name.split('\n')[1]} color={p.color} />
                  {i < 3 && (
                    <line x1={p.x + 100} y1={78} x2={p.x + 110} y2={78}
                      stroke={p.color} strokeWidth={1.2} />
                  )}
                </motion.g>
              ))}
              <text x={240} y={150} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                bundle 수신 시 4단계 검증 — 어느 한 단계라도 실패 시 거부
              </text>
              <DataBox x={150} y={170} w={180} h={28}
                label="Registry: approved MRENCLAVE list" color="#10b981" outlined />
            </motion.g>
          )}

          <text x={240} y={228} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            Oasis Runtime Container — manifest 기반 번들 형식
          </text>
        </svg>
      )}
    </StepViz>
  );
}
