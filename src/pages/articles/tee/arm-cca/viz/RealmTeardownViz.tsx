import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, AlertBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'rmi_rec_destroy(rec) × N', body: 'vCPU 컨텍스트(REC) 모두 해제. ACTIVE 상태 Realm은 이걸 먼저 해야 REALM_DESTROY 가능.' },
  { label: 'rmi_data_destroy(ipa) × N', body: '메모리 페이지 zeroize 후 매핑 제거. 정보 유출 방지.' },
  { label: 'rmi_rtt_destroy(rtt) × N', body: 'Stage 2 페이지 테이블 granule 정리.' },
  { label: 'rmi_realm_destroy(rd)', body: 'RD granule 해제 — Realm 메타데이터 사라짐.' },
  { label: 'rmi_granule_undelegate(...)', body: 'Realm PAS → NS PAS 복귀. Monitor가 자동 zeroize + cache flush.' },
];

const COLORS = ['#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#3b82f6'];

export default function RealmTeardownViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 230" className="w-full h-auto" style={{ maxWidth: 680 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
            fill="var(--foreground)">Granule 회수 순서 — Realm Teardown</text>

          {STEPS.map((s, i) => {
            const y = 35 + i * 32;
            const active = i <= step;
            const color = COLORS[i];
            return (
              <motion.g key={i}
                animate={{ opacity: active ? 1 : 0.35, x: active ? 0 : -4 }}
                transition={{ duration: 0.25 }}>
                <rect x={25} y={y} width={28} height={24} rx={4}
                  fill={color} fillOpacity={0.25}
                  stroke={color} strokeWidth={active ? 1 : 0.5} />
                <text x={39} y={y + 16} textAnchor="middle" fontSize={9}
                  fontWeight={700} fill={color}>{i + 1}</text>

                <rect x={60} y={y} width={395} height={24} rx={4}
                  fill={color} fillOpacity={active ? 0.1 : 0.04}
                  stroke={color} strokeWidth={active ? 0.7 : 0.3}
                  strokeDasharray={active ? '0' : '3 2'} />
                <text x={70} y={y + 11} fontSize={7.5} fontWeight={700}
                  fontFamily="monospace" fill={color}>
                  {s.label.split(' ')[0]}
                </text>
                <text x={70} y={y + 21} fontSize={6.5}
                  fill="var(--muted-foreground)">
                  {s.label.split(' ').slice(1).join(' ')}
                </text>
              </motion.g>
            );
          })}

          {step >= 4 && (
            <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
              <AlertBox x={120} y={200} w={240} h={22}
                label="zeroize 핵심 — 이전 Realm 데이터 누출 차단"
                color="#ef4444" />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
