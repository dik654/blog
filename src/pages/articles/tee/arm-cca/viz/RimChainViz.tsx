import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  {
    label: '1. REALM_CREATE 파라미터로 초기화',
    body: 'rim_extend(rd, &create_params, sizeof(create_params))\ns2sz, algorithm, feat_flag 가 RIM에 들어감.',
  },
  {
    label: '2. DATA_CREATE 호출마다 누적',
    body: 'descriptor("DATA" + ipa + flags) + 4KB content 를 SHA-512.\nRealm 코드/데이터 페이지 전부 측정 대상.',
  },
  {
    label: '3. REC_CREATE 호출 측정',
    body: 'rim_extend(rd, &rec_params, sizeof(rec_params))\nvCPU 초기 레지스터 값까지 RIM에 포함.',
  },
  {
    label: '4. ACTIVATE 시 RIM 확정',
    body: '이후 어떤 호출도 RIM 변경 불가.\n측정값이 Realm 정체성으로 고정 → Attestation의 anchor.',
  },
];

const ITEMS = [
  { x: 30, label: 'create_params', color: '#3b82f6' },
  { x: 130, label: 'DATA × N', color: '#06b6d4' },
  { x: 230, label: 'REC × M', color: '#8b5cf6' },
  { x: 330, label: 'ACTIVATE', color: '#10b981' },
];

export default function RimChainViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 230" className="w-full h-auto" style={{ maxWidth: 680 }}>
          <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700}
            fill="var(--foreground)">RIM 해시 체인 — SHA-512 누적</text>

          <defs>
            <marker id="rim-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M0,0 L4,2.5 L0,5" fill="#8b5cf6" />
            </marker>
          </defs>

          {ITEMS.map((it, i) => {
            const active = i <= step;
            return (
              <motion.g key={i}
                animate={{ opacity: active ? 1 : 0.3 }}
                transition={{ duration: 0.3 }}>
                <DataBox x={it.x} y={50} w={90} h={36}
                  label={it.label} color={it.color} outlined={active} />
                {i < ITEMS.length - 1 && (
                  <line x1={it.x + 90} y1={68} x2={it.x + 130} y2={68}
                    stroke={i < step ? '#8b5cf6' : '#cbd5e1'} strokeWidth={1.2}
                    markerEnd="url(#rim-arr)" />
                )}
              </motion.g>
            );
          })}

          <text x={240} y={120} textAnchor="middle" fontSize={8} fontWeight={600}
            fill="var(--muted-foreground)">
            buffer = rim ‖ data → SHA-512(buffer) → new rim
          </text>

          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 3 ? 1 : 0.4 }}>
            <ActionBox x={120} y={150} w={240} h={56}
              label={step >= 3 ? 'RIM 확정 — Realm 정체성' : 'RIM 누적 중'}
              sub="rd->rim[64] (SHA-512)"
              color={step >= 3 ? '#10b981' : '#94a3b8'} />
            <text x={240} y={224} textAnchor="middle" fontSize={6.5} fontStyle="italic"
              fill="var(--muted-foreground)">
              호출 순서까지 측정 → replay 방어
            </text>
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
