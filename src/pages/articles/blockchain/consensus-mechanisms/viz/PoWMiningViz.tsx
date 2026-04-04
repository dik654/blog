import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const TRIES = [
  { nonce: 1, hash: 'f8a3...e2', h: 82, ok: false },
  { nonce: 2, hash: 'c91b...47', h: 66, ok: false },
  { nonce: 3, hash: 'b205...d1', h: 58, ok: false },
  { nonce: 1049, hash: '0002...9f', h: 12, ok: true },
];
const TARGET_Y = 28, BAR_BASE = 90, BAR_W = 28;

const STEPS = [
  { label: '블록 데이터 + Nonce 준비', body: '블록 헤더(이전 해시, 트랜잭션 루트, 타임스탬프)와 Nonce를 입력으로 준비합니다.' },
  { label: 'Nonce=1: 해시가 Target 초과', body: 'SHA256(header + nonce=1) 결과가 target 난이도보다 높아 실패합니다.' },
  { label: 'Nonce=2: 여전히 초과', body: 'nonce를 증가시켜 재시도하지만 해시값이 아직 target 아래로 떨어지지 않습니다.' },
  { label: 'Nonce=1049: Target 이하 성공!', body: '수많은 시도 끝에 hash < target 조건 충족. 블록 채굴 완료!' },
];

export default function PoWMiningViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* target difficulty line */}
          <line x1={40} y1={TARGET_Y} x2={300} y2={TARGET_Y}
            stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 3" />
          <text x={305} y={TARGET_Y + 3} fontSize={10} fill="#ef4444">Target</text>
          {/* hash pipeline at step 0 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={60} y={42} width={65} height={22} rx={4} fill="#f59e0b0c" stroke="#f59e0b" strokeWidth={1.2} />
              <text x={92} y={55} textAnchor="middle" fontSize={10} fill="#f59e0b" fontWeight={600}>Block Header</text>
              <text x={140} y={55} fontSize={10} fill="var(--muted-foreground)">+</text>
              <rect x={155} y={42} width={40} height={22} rx={4} fill="#6366f10c" stroke="#6366f1" strokeWidth={1.2} />
              <text x={175} y={55} textAnchor="middle" fontSize={10} fill="#6366f1" fontWeight={600}>Nonce</text>
              <text x={207} y={55} fontSize={10} fill="var(--muted-foreground)">→</text>
              <rect x={218} y={42} width={55} height={22} rx={4} fill="#10b9810c" stroke="#10b981" strokeWidth={1.2} />
              <text x={246} y={55} textAnchor="middle" fontSize={10} fill="#10b981" fontWeight={600}>SHA256</text>
            </motion.g>
          )}
          {/* nonce bars for steps 1-3 */}
          {step > 0 && TRIES.map((t, i) => {
            const visible = i < step;
            const cx = 80 + i * 60;
            const barH = t.h * 0.7;
            const barY = BAR_BASE - barH;
            return visible ? (
              <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
                <motion.rect x={cx - BAR_W / 2} y={barY} width={BAR_W} height={barH} rx={3}
                  animate={{ fill: t.ok ? '#10b98140' : '#f59e0b25' }}
                  stroke={t.ok ? '#10b981' : '#f59e0b'} strokeWidth={t.ok ? 2 : 1} />
                <text x={cx} y={BAR_BASE + 10} textAnchor="middle" fontSize={10}
                  fill={t.ok ? '#10b981' : '#f59e0b'} fontWeight={600}>N={t.nonce}</text>
                <text x={cx} y={barY - 4} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)">{t.hash}</text>
                {t.ok && (
                  <motion.text x={cx} y={barY - 12} textAnchor="middle" fontSize={10} fill="#10b981"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} fontWeight={600}>OK</motion.text>
                )}
              </motion.g>
            ) : null;
          })}
        </svg>
      )}
    </StepViz>
  );
}
