import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox, ModuleBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '1. 의존성 설치', body: 'apt install gcc-aarch64-linux-gnu cmake ninja-build python3' },
  { label: '2. cmake configure', body: 'cmake -DRMM_CONFIG=fvp_defcfg -S . -B build' },
  { label: '3. cmake build', body: 'cmake --build build  → rmm.elf / rmm.bin / rmm.dump' },
  { label: '4. FVP(Fast Models) 실행', body: 'fvp-rme.sh --bl31 --bl32=rmm.bin --bl33 --image --realm' },
  { label: '5. UART 디버그 로그', body: 'CONFIG_DEBUG=ON 빌드 시 verbose 출력' },
];

const ARTIFACTS = [
  { name: 'rmm.elf', desc: 'EL2 Realm 이미지', color: '#10b981' },
  { name: 'rmm.bin', desc: 'raw binary', color: '#06b6d4' },
  { name: 'rmm.dump', desc: '심볼 덤프', color: '#8b5cf6' },
];

const BL = [
  { name: 'BL31', who: 'TF-A (EL3 Monitor)', color: '#ef4444' },
  { name: 'BL32', who: 'RMM (EL2 Realm)', color: '#10b981' },
  { name: 'BL33', who: 'Host bootloader', color: '#3b82f6' },
];

export default function TfRmmBuildViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 250" className="w-full h-auto" style={{ maxWidth: 680 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
            fill="var(--foreground)">TF-RMM 빌드 + FVP 실행</text>

          {STEPS.map((s, i) => {
            const y = 30 + i * 24;
            const active = i <= step;
            const colors = ['#94a3b8', '#3b82f6', '#06b6d4', '#10b981', '#8b5cf6'];
            const color = colors[i];
            return (
              <motion.g key={i}
                animate={{ opacity: active ? 1 : 0.3 }}
                transition={{ duration: 0.3 }}>
                <rect x={25} y={y} width={22} height={18} rx={3}
                  fill={color} fillOpacity={0.25} stroke={color} strokeWidth={0.5} />
                <text x={36} y={y + 12} textAnchor="middle" fontSize={8}
                  fontWeight={700} fill={color}>{i + 1}</text>
                <text x={55} y={y + 13} fontSize={7.5} fontFamily="monospace"
                  fontWeight={500} fill="var(--foreground)">
                  {s.body.length > 70 ? s.body.slice(0, 67) + '…' : s.body}
                </text>
              </motion.g>
            );
          })}

          {step >= 2 && (
            <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
              <text x={75} y={170} textAnchor="middle" fontSize={8} fontWeight={700}
                fill="var(--foreground)">build/Debug</text>
              {ARTIFACTS.map((a, i) => (
                <DataBox key={a.name} x={20 + i * 110} y={180} w={100} h={26}
                  label={a.name} color={a.color} outlined />
              ))}
            </motion.g>
          )}

          {step >= 3 && (
            <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
              <text x={400} y={170} textAnchor="middle" fontSize={8} fontWeight={700}
                fill="var(--foreground)">FVP boot stages</text>
              {BL.map((b, i) => (
                <ActionBox key={b.name} x={345} y={180 + i * 22} w={120} h={20}
                  label={`${b.name}: ${b.who.split(' ')[0]}`} color={b.color} />
              ))}
            </motion.g>
          )}

          {step >= 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={20} y={222} w={310} h={24}
                label="UART 로그 (debug verbose)"
                sub="RMM이 출력" color="#f59e0b" />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
