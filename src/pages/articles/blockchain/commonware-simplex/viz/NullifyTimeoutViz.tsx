import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';

const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b', CH = '#ef4444';

const STEPS = [
  { label: 'Timeout 경로: leader_timeout 만료', body: 'leader_deadline 도달 → construct_nullify(view) → Nullify::sign() → 전체 브로드캐스트' },
  { label: 'Nullification 인증서: 2f+1 Nullify', body: '쿼럼 도달 → Nullification 조립 → enter_view(next) 없이 뷰 skip 증명 완료' },
  { label: 'retry + entry cert 브로드캐스트', body: 'timeout_retry 간격으로 nullify 재전송. 재시도 시 이전 뷰의 best cert도 동봉해 동기화 지원.' },
];

const STEP_REFS: Record<number, string> = {
  0: 'construct-nullify', 1: 'broadcast-nullification', 2: 'construct-nullify',
};
const STEP_LABELS: Record<number, string> = {
  0: 'state.rs — construct_nullify()', 1: 'state.rs — broadcast_nullification()',
  2: 'actor.rs — timeout() retry',
};

export default function NullifyTimeoutViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
          <svg viewBox="0 0 480 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {step === 0 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {[
                  { t: 'leader_deadline 만료 (sleep_until)', c: CH },
                  { t: 'construct_nullify(current_view)', c: CV },
                  { t: 'broadcast_finalize? → None (이미 확정 중)', c: '#94a3b8' },
                  { t: 'Nullify::sign(scheme, round)', c: CE },
                  { t: 'broadcast Vote::Nullify → Recipients::All', c: CA },
                ].map((s, i) => (
                  <g key={i}>
                    <rect x={60} y={6 + i * 26} width={340} height={20} rx={4} fill="var(--card)" />
                    <rect x={60} y={6 + i * 26} width={340} height={20} rx={4}
                      fill={`${s.c}08`} stroke={s.c} strokeWidth={0.6} />
                    <text x={230} y={20 + i * 26} textAnchor="middle" fontSize={10} fill={s.c}>{s.t}</text>
                  </g>
                ))}
              </motion.g>
            )}
            {step === 1 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {[
                  { t: '2f+1 Nullify 투표 수집 (batcher)', c: CV },
                  { t: 'Nullification 인증서 조립', c: CE },
                  { t: 'resolver.updated + broadcast Certificate', c: CA },
                  { t: '다른 노드: Nullification 수신 → 해당 뷰 skip 증명', c: CV },
                ].map((s, i) => (
                  <g key={i}>
                    <rect x={60} y={15 + i * 28} width={340} height={22} rx={4} fill="var(--card)" />
                    <rect x={60} y={15 + i * 28} width={340} height={22} rx={4}
                      fill={`${s.c}10`} stroke={s.c} strokeWidth={0.6} />
                    <text x={230} y={30 + i * 28} textAnchor="middle" fontSize={10} fill={s.c}>{s.t}</text>
                  </g>
                ))}
              </motion.g>
            )}
            {step === 2 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {[
                  { t: 'is_retry=true → timeout_retry 간격으로 재전송', c: CH },
                  { t: 'get_best_certificate(prev_view)', c: CV },
                  { t: 'Finalization > Nullification > Notarization 우선', c: CE },
                  { t: 'broadcast entry cert → 동기화 지원', c: CA },
                ].map((s, i) => (
                  <g key={i}>
                    <rect x={60} y={15 + i * 28} width={340} height={22} rx={4} fill="var(--card)" />
                    <rect x={60} y={15 + i * 28} width={340} height={22} rx={4}
                      fill={`${s.c}08`} stroke={s.c} strokeWidth={0.6} />
                    <text x={230} y={30 + i * 28} textAnchor="middle" fontSize={10} fill={s.c}>{s.t}</text>
                  </g>
                ))}
              </motion.g>
            )}
          </svg>
          {onOpenCode && (
            <div className="flex items-center gap-2 mt-3 justify-end">
              <CodeViewButton onClick={() => onOpenCode(STEP_REFS[step])} />
              <span className="text-[10px] text-muted-foreground">{STEP_LABELS[step]}</span>
            </div>
          )}
        </div>
      )}
    </StepViz>
  );
}
