import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'CBOR Decode', body: 'tokenBytes 파싱 → PlatformClaims + RealmClaims 분리.', color: '#06b6d4' },
  { label: 'Platform Token 검증', body: 'token.Verify(iakPubKey) → SiP CA 체인까지 확인.', color: '#f59e0b' },
  { label: 'RAK 결박 확인', body: 'sha256(rakPubKey) == platformClaims.Challenge → IAK가 RAK 보증.', color: '#8b5cf6' },
  { label: 'Realm Token 서명 확인', body: 'verifyCose(realmClaims, rakPubKey) → 위변조 검증.', color: '#10b981' },
  { label: '정책 적용', body: 'allowedRIMs.Contains? + nonce 일치? → 통과 시 신뢰.', color: '#3b82f6' },
];

export default function VerifierFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full h-auto" style={{ maxWidth: 680 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
            fill="var(--foreground)">Veraison ccatoken 검증 5단계</text>

          {STEPS.map((s, i) => {
            const x = 20 + (i % 5) * 90;
            const y = 50;
            const active = i <= step;
            return (
              <motion.g key={i}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: active ? 1 : 0.35 }}
                transition={{ duration: 0.25 }}>
                <rect x={x} y={y} width={80} height={70} rx={6}
                  fill={s.color} fillOpacity={active ? 0.18 : 0.05}
                  stroke={s.color} strokeWidth={active ? 1.3 : 0.5} />
                <text x={x + 40} y={y + 18} textAnchor="middle" fontSize={9}
                  fontWeight={700} fill={s.color}>{i + 1}</text>
                <text x={x + 40} y={y + 36} textAnchor="middle" fontSize={7.5}
                  fontWeight={600} fill="var(--foreground)">
                  {s.label.split(' ').slice(0, 2).join(' ')}
                </text>
                {s.label.split(' ').length > 2 && (
                  <text x={x + 40} y={y + 47} textAnchor="middle" fontSize={7}
                    fill="var(--foreground)">
                    {s.label.split(' ').slice(2).join(' ')}
                  </text>
                )}
                <text x={x + 40} y={y + 60} textAnchor="middle" fontSize={6}
                  fill={active ? s.color : 'var(--muted-foreground)'}>
                  {active && i < step ? '✓' : active ? '…' : ''}
                </text>
                {i < 4 && active && (
                  <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    x1={x + 80} y1={y + 35} x2={x + 90} y2={y + 35}
                    stroke="#94a3b8" strokeWidth={1} />
                )}
              </motion.g>
            );
          })}

          {step >= 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={20} y={140} w={210} h={50}
                label="신뢰 결과" sub="all 5 steps pass"
                color="#10b981" outlined />
              <AlertBox x={250} y={140} w={210} h={50}
                label="실패 시 reject" sub="unknown realm image / nonce mismatch"
                color="#ef4444" />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
