import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, StatusBox } from '@/components/viz/boxes';

const C = {
  cloud: '#6366f1',
  hw: '#0ea5e9',
  asid: '#10b981',
  kernel: '#f59e0b',
};

const STEPS = [
  { label: '주요 클라우드 — SEV-SNP 채택', body: 'AWS, Azure, GCP, Oracle 모두 production 제공' },
  { label: 'EPYC 세대별 SEV 진화', body: 'Rome → Milan → Genoa → Turin: 각 세대마다 기능 추가' },
  { label: '동시 ASID 한계 — 호스트 용량', body: 'Genoa부터 1006으로 2배 증가, 동시 SEV VM 개수 결정' },
  { label: 'Linux 커널 성숙 시점', body: '5.11 host → 5.19 guest → 6.5 production' },
];

const CLOUDS = [
  { x: 10, y: 24, label: 'AWS EC2', sub: 'M6a/C6a SNP' },
  { x: 125, y: 24, label: 'Azure', sub: 'DC/EC SNP' },
  { x: 240, y: 24, label: 'GCP', sub: 'N2D/C2D SNP' },
  { x: 355, y: 24, label: 'Oracle', sub: 'E5/E6' },
];

const HW = [
  { x: 10, label: 'Rome', sub: '2nd gen', feat: 'SEV / SEV-ES' },
  { x: 125, label: 'Milan', sub: '3rd gen', feat: '+ SEV-SNP' },
  { x: 240, label: 'Genoa', sub: '4th gen', feat: '+ 개선' },
  { x: 355, label: 'Turin', sub: '5th gen', feat: '+ Cipher Hide' },
];

const ASIDS = [
  { gen: 'Rome', n: 509, p: 0.5 },
  { gen: 'Milan', n: 509, p: 0.5 },
  { gen: 'Genoa', n: 1006, p: 1.0 },
  { gen: 'Turin', n: 1006, p: 1.0 },
];

const KERNEL = [
  { ver: '5.11', sub: 'KVM SNP host' },
  { ver: '5.19', sub: 'SNP guest' },
  { ver: '6.5+', sub: 'Production ready' },
];

export default function DeploymentMatrixViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={10} y={14} fontSize={9} fontWeight={700} fill={C.cloud}>클라우드 채택</text>
          {CLOUDS.map((c, i) => (
            <motion.g key={c.label}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: step === 0 ? 1 : 0.2, y: 0 }}
              transition={{ delay: step === 0 ? i * 0.06 : 0 }}>
              <ModuleBox x={c.x} y={c.y} w={105} h={42} label={c.label} sub={c.sub} color={C.cloud} />
            </motion.g>
          ))}

          {step === 1 && (
            <>
              <text x={10} y={86} fontSize={9} fontWeight={700} fill={C.hw}>EPYC 세대별</text>
              {HW.map((h, i) => (
                <motion.g key={h.label}
                  initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}>
                  <DataBox x={h.x} y={92} w={105} h={32} label={`${h.label} (${h.sub})`} color={C.hw} outlined />
                  <text x={h.x + 52} y={138} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{h.feat}</text>
                </motion.g>
              ))}
            </>
          )}

          {step === 2 && (
            <>
              <text x={10} y={86} fontSize={9} fontWeight={700} fill={C.asid}>동시 ASID (concurrent VMs)</text>
              {ASIDS.map((a, i) => (
                <motion.g key={a.gen}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
                  <StatusBox x={10 + i * 115} y={92} w={105} h={48}
                    label={a.gen} sub={`${a.n} ASIDs`} color={C.asid} progress={a.p} />
                </motion.g>
              ))}
              <text x={240} y={172} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Genoa+: 2배 증가 → 호스트당 더 많은 confidential VM 수용
              </text>
            </>
          )}

          {step === 3 && (
            <>
              <text x={10} y={86} fontSize={9} fontWeight={700} fill={C.kernel}>Linux 커널 마일스톤</text>
              {KERNEL.map((k, i) => (
                <motion.g key={k.ver}
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}>
                  <ModuleBox x={10 + i * 155} y={92} w={145} h={48} label={`Linux ${k.ver}`} sub={k.sub} color={C.kernel} />
                </motion.g>
              ))}
              <motion.line x1={84} y1={140} x2={394} y2={140} stroke={C.kernel} strokeWidth={1} strokeDasharray="3 2"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.2 }} />
              <text x={240} y={172} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                주요 배포판: Ubuntu 22.04+, RHEL 9+ 기본 지원
              </text>
            </>
          )}
        </svg>
      )}
    </StepViz>
  );
}
