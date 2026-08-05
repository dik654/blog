import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '1. CBOR encoder 초기화', body: 'rec->attest_buf에 MAX_TOKEN_SIZE 만큼 출력 영역 확보.' },
  { label: '2. Realm claims 수집', body: 'challenge / RIM / REM[0..3] / RPV / hash_algo 를 RD에서 복사.' },
  { label: '3. CBOR 직렬화', body: 'realm_claims 구조체를 CBOR 인코딩.' },
  { label: '4. Inner COSE_Sign1', body: 'Realm Attestation Key(RAK)로 realm token 서명.' },
  { label: '5. Platform Token 삽입', body: 'EL3에 요청 → IAK 서명된 platform 토큰 획득 후 삽입.' },
  { label: '6. Outer COSE_Sign1', body: 'CCA Token 전체를 외측 COSE 래핑 → 단일 페이로드 완성.' },
];

const COLORS = ['#3b82f6', '#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444'];

export default function RmmTokenBuildViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 230" className="w-full h-auto" style={{ maxWidth: 680 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
            fill="var(--foreground)">handle_rsi_attest_token_init — 6 Phase</text>

          <ModuleBox x={20} y={32} w={110} h={42}
            label="rec->attest_buf" sub="CBOR 출력" color={COLORS[0]} />

          {STEPS.map((s, i) => {
            const x = 20 + (i % 3) * 150;
            const y = 90 + Math.floor(i / 3) * 65;
            const active = i <= step;
            const color = COLORS[i];
            return (
              <motion.g key={i}
                initial={{ opacity: 0.3, scale: 0.95 }}
                animate={{ opacity: active ? 1 : 0.3, scale: active ? 1 : 0.95 }}
                transition={{ duration: 0.3, delay: active ? 0.05 : 0 }}>
                <rect x={x} y={y} width={140} height={52} rx={6}
                  fill={color} fillOpacity={active ? 0.15 : 0.05}
                  stroke={color} strokeWidth={active ? 1.2 : 0.5}
                  strokeDasharray={active ? '0' : '3 2'} />
                <text x={x + 10} y={y + 16} fontSize={9} fontWeight={700}
                  fill={color}>{i + 1}</text>
                <text x={x + 22} y={y + 16} fontSize={7.5} fontWeight={600}
                  fill="var(--foreground)">{s.label.replace(/^\d+\.\s*/, '')}</text>
                <text x={x + 10} y={y + 32} fontSize={7}
                  fill="var(--muted-foreground)">phase {i + 1}</text>
                <text x={x + 10} y={y + 44} fontSize={6.5} fontFamily="monospace"
                  fill="var(--muted-foreground)">
                  {['cbor_init', 'memcpy claims', 'cbor_encode',
                    'cose_sign1(RAK)', 'el3_get_token', 'cose_sign1(outer)'][i]}
                </text>
              </motion.g>
            );
          })}

          {step >= 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={155} y={32} w={170} h={42}
                label="CCA Attestation Token" sub="COSE_Sign1 nested"
                color="#10b981" outlined />
              <ActionBox x={350} y={32} w={110} h={42}
                label="rec->attest_size" sub="bytes_needed" color="#06b6d4" />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
