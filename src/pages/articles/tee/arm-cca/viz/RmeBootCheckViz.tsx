import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, ModuleBox } from '@/components/viz/boxes';

const STEPS = [
  {
    label: 'mrs x0, ID_AA64PFR0_EL1',
    body: 'CPU 처리 기능 레지스터에서 RME 필드(bit[55:52]) 읽기.',
  },
  {
    label: 'ubfx x0, x0, #52, #4',
    body: '4비트 RME 필드 추출. 값 0 = unsupported, 1 = RMEv1.',
  },
  {
    label: 'cmp + b.lt no_cca_panic',
    body: '값이 1 미만이면 CCA 미지원 → 패닉 또는 fallback.',
  },
  {
    label: 'msr GPCCR_EL3 + GPTBR_EL3',
    body: 'TF-A가 GPT Config Register와 base 주소 설정 후 isb. 이후 GPT walk 활성.',
  },
];

export default function RmeBootCheckViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full h-auto" style={{ maxWidth: 680 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
            fill="var(--foreground)">CPU 부팅 시 RME 활성화 시퀀스 (EL3)</text>

          <ModuleBox x={20} y={35} w={130} h={45}
            label="ID_AA64PFR0_EL1" sub="CPU feature reg" color="#3b82f6" />
          <ModuleBox x={335} y={35} w={130} h={45}
            label="GPCCR/GPTBR_EL3" sub="GPT 활성" color="#10b981" />

          {STEPS.map((s, i) => {
            const y = 100 + i * 28;
            const active = i <= step;
            const colors = ['#3b82f6', '#06b6d4', '#f59e0b', '#10b981'];
            const color = colors[i];
            return (
              <motion.g key={i}
                animate={{ opacity: active ? 1 : 0.3 }}
                transition={{ duration: 0.3 }}>
                <rect x={25} y={y} width={26} height={22} rx={3}
                  fill={color} fillOpacity={0.25} stroke={color} strokeWidth={0.6} />
                <text x={38} y={y + 15} textAnchor="middle" fontSize={9}
                  fontWeight={700} fill={color}>{i + 1}</text>
                <rect x={60} y={y} width={395} height={22} rx={3}
                  fill={color} fillOpacity={active ? 0.1 : 0.04}
                  stroke={color} strokeWidth={active ? 0.6 : 0.3} />
                <text x={70} y={y + 14} fontSize={7.5} fontFamily="monospace"
                  fontWeight={600} fill={color}>{s.label}</text>
              </motion.g>
            );
          })}

          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ActionBox x={170} y={215} w={140} h={20}
                label="GPT walk 가동" color="#10b981" />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
