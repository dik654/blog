import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b', CH = '#ef4444';

const STEPS = [
  { label: 'BFT 프로토콜 진화', body: 'PBFT → Tendermint → HotStuff → Simplex. 라운드 수 동일(2-3), 메시지 복잡도 O(n), 하지만 구현 난이도·timeout·리더 대기가 크게 개선.' },
  { label: 'Simplex 프로토콜 흐름 (정상 경로)', body: 'Leader: Propose(k, x, Cert) → 검증자: Vote(k, x) → n-f Vote 수집 → Cert 형성 → Finalize(k, x) + Cert 전송 → 즉시 view k+1' },
  { label: 'Finalize & Decide', body: 'n-f개 Finalize 수신 → Decide x, Forward, Terminate. 모든 정직한 노드가 동일한 값 x를 결정.' },
  { label: 'Timeout 경로 (3Δ)', body: 'View k에서 3Δ 경과 시 View-change(k) 전송. n-f개 View-change 수집 → view k+1로 이동. 새 리더가 대기 없이 즉시 제안.' },
];

const protos = [
  { name: 'PBFT', year: '1999', rounds: '3', vc: '복잡', wait: '2Δ', msg: 'O(n²)', c: '#94a3b8' },
  { name: 'Tendermint', year: '2014', rounds: '3', vc: '6Δ', wait: '2Δ', msg: 'O(n)', c: '#94a3b8' },
  { name: 'HotStuff', year: '2018', rounds: '3', vc: '가변', wait: '2Δ', msg: 'O(n)', c: C1 },
  { name: 'Simplex', year: '2023', rounds: '2-3', vc: '3Δ', wait: '없음', msg: 'O(n)', c: C2 },
];

export default function SimplexViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {['', '라운드', 'VC Timeout', '리더 대기', '메시지'].map((h, i) => (
                <text key={i} x={[40, 130, 210, 300, 380][i]} y={20} textAnchor="middle"
                  fontSize={10} fontWeight={600} fill="var(--foreground)">{h}</text>
              ))}
              <line x1={10} y1={26} x2={430} y2={26} stroke="var(--border)" strokeWidth={0.5} />
              {protos.map((p, i) => {
                const y = 38 + i * 32;
                const isSimplex = i === 3;
                return (
                  <g key={i}>
                    <rect x={8} y={y - 4} width={60} height={22} rx={4}
                      fill={`${p.c}12`} stroke={p.c} strokeWidth={isSimplex ? 1.2 : 0.5} />
                    <text x={38} y={y + 10} textAnchor="middle" fontSize={10} fontWeight={600} fill={p.c}>
                      {p.name}
                    </text>
                    <text x={130} y={y + 10} textAnchor="middle" fontSize={10} fill="var(--foreground)">{p.rounds}</text>
                    <text x={210} y={y + 10} textAnchor="middle" fontSize={10}
                      fill={isSimplex ? C2 : 'var(--foreground)'}>{p.vc}</text>
                    <text x={300} y={y + 10} textAnchor="middle" fontSize={10} fontWeight={isSimplex ? 600 : 400}
                      fill={isSimplex ? CH : 'var(--foreground)'}>{p.wait}</text>
                    <text x={380} y={y + 10} textAnchor="middle" fontSize={10} fill="var(--foreground)">{p.msg}</text>
                  </g>
                );
              })}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {['Leader', 'Validator'].map((r, i) => (
                <g key={i}>
                  <rect x={20 + i * 220} y={10} width={90} height={24} rx={4}
                    fill={`${[C1, C2][i]}10`} stroke={[C1, C2][i]} strokeWidth={0.8} />
                  <text x={65 + i * 220} y={26} textAnchor="middle" fontSize={10} fontWeight={500}
                    fill={[C1, C2][i]}>{r}</text>
                </g>
              ))}
              {[
                { y: 50, label: 'Propose(k, x, Cert)', from: 65, to: 285, c: C1 },
                { y: 80, label: 'Vote(k, x)', from: 285, to: 65, c: C2 },
                { y: 110, label: 'n-f Vote → Cert(k,x) 형성', from: 65, to: 65, c: C3 },
                { y: 140, label: 'Finalize(k, x) + Cert', from: 65, to: 285, c: C2 },
                { y: 170, label: '즉시 view k+1 이동!', from: 65, to: 65, c: CH },
              ].map((m, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}>
                  {m.from !== m.to && (
                    <line x1={m.from} y1={m.y} x2={m.to} y2={m.y}
                      stroke={m.c} strokeWidth={0.8} markerEnd="url(#sxArr)" />
                  )}
                  <rect x={m.from === m.to ? 10 : Math.min(m.from, m.to) + 20} y={m.y - 10}
                    width={m.label.length * 7.5} height={16} rx={3} fill="var(--card)" />
                  <text x={m.from === m.to ? 16 : Math.min(m.from, m.to) + 24} y={m.y + 1}
                    fontSize={10} fill={m.c}>{m.label}</text>
                </motion.g>
              ))}
              <defs><marker id="sxArr" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={5} markerHeight={5} orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="var(--muted-foreground)" /></marker></defs>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[
                { label: 'n-f Finalize 수신', y: 30, c: C1 },
                { label: 'Decide x', y: 70, c: C2 },
                { label: 'Forward n-f Finalize', y: 110, c: C3 },
                { label: 'Terminate', y: 150, c: CH },
              ].map((s, i) => (
                <g key={i}>
                  <rect x={120} y={s.y} width={200} height={28} rx={5} fill="var(--card)" />
                  <rect x={120} y={s.y} width={200} height={28} rx={5}
                    fill={`${s.c}10`} stroke={s.c} strokeWidth={0.8} />
                  <text x={220} y={s.y + 18} textAnchor="middle" fontSize={10} fontWeight={500} fill={s.c}>{s.label}</text>
                  {i < 3 && <line x1={220} y1={s.y + 28} x2={220} y2={s.y + 42} stroke="var(--border)" strokeWidth={0.6} />}
                </g>
              ))}
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[
                { label: 'Timer T = 3Δ 만료', y: 20, c: CH },
                { label: 'Send View-change(k)', y: 60, c: C3 },
                { label: 'n-f View-change 수집', y: 100, c: C1 },
                { label: 'Enter view k+1', y: 140, c: C2 },
                { label: '새 리더 즉시 Propose (대기 없음)', y: 170, c: C2 },
              ].map((s, i) => (
                <g key={i}>
                  <rect x={90} y={s.y} width={260} height={26} rx={5} fill="var(--card)" />
                  <rect x={90} y={s.y} width={260} height={26} rx={5}
                    fill={`${s.c}10`} stroke={s.c} strokeWidth={0.8} />
                  <text x={220} y={s.y + 17} textAnchor="middle" fontSize={10} fontWeight={500} fill={s.c}>{s.label}</text>
                  {i < 4 && <line x1={220} y1={s.y + 26} x2={220} y2={s.y + 40}
                    stroke="var(--border)" strokeWidth={0.6} />}
                </g>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
