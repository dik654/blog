import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, AlertBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '1. Host OS 버그로 Realm PA 접근 시도', body: 'Non-secure 컨텍스트에서 Realm 소유 페이지 read.' },
  { label: '2. GPT walk → PAS mismatch', body: '하드웨어가 자동 GPT 조회. 접근 PAS(NS) ≠ 소유 PAS(Realm).' },
  { label: '3. GPF 발생 → EL3 진입', body: 'ESR_EL3.EC = 0x1E (GPC), ISS.GPF = 1, FAR/HPFAR 채워짐.' },
  { label: '4. TF-A가 fault 분석', body: 'PAS, IPA, fault 주소 검사 후 어느 World로 라우팅할지 결정.' },
  { label: '5. Host로 abort exception 반환', body: 'Host kernel이 일반 segfault로 처리 → 프로세스 SIGSEGV.' },
];

export default function GpfFaultViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 230" className="w-full h-auto" style={{ maxWidth: 680 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
            fill="var(--foreground)">GPF (Granule Protection Fault) 처리 흐름</text>

          {STEPS.map((s, i) => {
            const y = 35 + i * 32;
            const active = i <= step;
            const colors = ['#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#10b981'];
            const color = colors[i];
            return (
              <motion.g key={i}
                animate={{ opacity: active ? 1 : 0.3 }}
                transition={{ duration: 0.3 }}>
                <rect x={25} y={y} width={26} height={24} rx={3}
                  fill={color} fillOpacity={0.25} stroke={color} strokeWidth={0.6} />
                <text x={38} y={y + 16} textAnchor="middle" fontSize={9}
                  fontWeight={700} fill={color}>{i + 1}</text>
                <rect x={60} y={y} width={400} height={24} rx={3}
                  fill={color} fillOpacity={active ? 0.1 : 0.04}
                  stroke={color} strokeWidth={active ? 0.6 : 0.3} />
                <text x={70} y={y + 13} fontSize={7.5} fontWeight={600}
                  fill="var(--foreground)">{s.label.split('. ')[1]}</text>
                <text x={70} y={y + 21} fontSize={6.5}
                  fill="var(--muted-foreground)">{s.body.split(' ').slice(0, 7).join(' ')}…</text>
              </motion.g>
            );
          })}

          {step >= 2 && (
            <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
              <DataBox x={20} y={205} w={210} h={20}
                label="ESR_EL3.EC=0x1E · ISS.GPF=1"
                color="#ef4444" outlined />
              <AlertBox x={250} y={205} w={210} h={20}
                label="FAR_EL3 / HPFAR_EL3 채움" color="#f59e0b" />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
