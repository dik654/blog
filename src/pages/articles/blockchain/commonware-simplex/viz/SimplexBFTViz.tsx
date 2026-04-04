import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', CH = '#ef4444';

const STEPS = [
  { label: 'BFT 프로토콜 진화', body: 'PBFT(O(n²) 메시지) → Tendermint(O(n), 6Δ timeout) → HotStuff(O(n), 파이프라인) → Simplex(O(n), 3Δ, 리더 대기 없음, 구현 단순)' },
  { label: 'Simplex 정상 경로 (2 라운드)', body: 'Round 1: Propose(k, x, Cert) → Vote(k, x). Round 2: Finalize(k, x, Cert) → Decide. 즉시 view k+1 이동.' },
  { label: 'Timeout 경로 (3Δ)', body: '타이머 만료 → View-change(k) 브로드캐스트. n-f 수집 → view k+1. 새 리더 즉시 제안 (대기 없음).' },
];

export default function SimplexBFTViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[
                { name: 'PBFT', y: '99', rounds: '3', vc: '복잡', wait: '2Δ', msg: 'O(n²)', impl: '높음' },
                { name: 'Tendermint', y: '14', rounds: '3', vc: '6Δ', wait: '2Δ', msg: 'O(n)', impl: '중간' },
                { name: 'HotStuff', y: '18', rounds: '3', vc: '가변', wait: '2Δ', msg: 'O(n)', impl: '중간' },
                { name: 'Simplex', y: '23', rounds: '2-3', vc: '3Δ', wait: '없음', msg: 'O(n)', impl: '낮음' },
              ].map((p, i) => {
                const isSx = i === 3;
                return (
                  <g key={i}>
                    <rect x={14} y={26 + i * 36} width={66} height={26} rx={4}
                      fill={`${isSx ? C2 : C1}${isSx ? '15' : '08'}`}
                      stroke={isSx ? C2 : C1} strokeWidth={isSx ? 1.2 : 0.5} />
                    <text x={47} y={43 + i * 36} textAnchor="middle" fontSize={10} fontWeight={600}
                      fill={isSx ? C2 : C1}>{p.name}</text>
                    {[p.rounds, p.vc, p.wait, p.msg, p.impl].map((v, j) => (
                      <text key={j} x={120 + j * 65} y={43 + i * 36} textAnchor="middle" fontSize={10}
                        fontWeight={isSx && (j === 1 || j === 2) ? 600 : 400}
                        fill={isSx && j === 2 ? CH : 'var(--foreground)'}>{v}</text>
                    ))}
                  </g>
                );
              })}
              {['라운드', 'VC', '대기', '메시지', '난이도'].map((h, i) => (
                <text key={i} x={120 + i * 65} y={18} textAnchor="middle" fontSize={10}
                  fontWeight={600} fill="var(--foreground)">{h}</text>
              ))}
              <line x1={10} y1={22} x2={440} y2={22} stroke="var(--border)" strokeWidth={0.5} />
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[
                { label: 'Propose(k, x, Cert(k\'))', y: 20, c: C1 },
                { label: 'Vote(k, x)', y: 50, c: C2 },
                { label: 'n-f Vote → Cert(k,x) 형성', y: 80, c: '#f59e0b' },
                { label: 'Finalize(k, x) + Cert 전송', y: 110, c: C1 },
                { label: 'n-f Finalize → Decide x', y: 140, c: C2 },
                { label: '즉시 view k+1 이동!', y: 162, c: CH },
              ].map((s, i) => (
                <g key={i}>
                  <rect x={80} y={s.y} width={300} height={22} rx={4} fill="var(--card)" />
                  <rect x={80} y={s.y} width={300} height={22} rx={4}
                    fill={`${s.c}10`} stroke={s.c} strokeWidth={0.7} />
                  <text x={230} y={s.y + 15} textAnchor="middle" fontSize={10} fill={s.c}>{s.label}</text>
                  {i < 5 && <line x1={230} y1={s.y + 22} x2={230} y2={s.y + 30} stroke="var(--border)" strokeWidth={0.4} />}
                </g>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[
                { label: 'Timer T = 3Δ 만료', c: CH },
                { label: 'Send View-change(k)', c: '#f59e0b' },
                { label: 'n-f View-change 수집', c: C1 },
                { label: 'Forward + Enter view k+1', c: C2 },
                { label: '새 리더 즉시 Propose (0Δ 대기)', c: C2 },
              ].map((s, i) => (
                <g key={i}>
                  <rect x={80} y={18 + i * 30} width={280} height={22} rx={4} fill="var(--card)" />
                  <rect x={80} y={18 + i * 30} width={280} height={22} rx={4}
                    fill={`${s.c}10`} stroke={s.c} strokeWidth={0.7} />
                  <text x={220} y={33 + i * 30} textAnchor="middle" fontSize={10} fill={s.c}>{s.label}</text>
                  {i < 4 && <line x1={220} y1={40 + i * 30} x2={220} y2={48 + i * 30} stroke="var(--border)" strokeWidth={0.4} />}
                </g>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
