import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const STEPS = [
  { label: '결정론적 시뮬레이션', body: '동일 시드 → 동일 결과. 네트워크 파티션, 비잔틴 장애, 링크 손실을 시뮬레이션. 디버거에서 단계별 실행·재현 가능.' },
  { label: 'Alto: 미니멀 블록체인', body: 'threshold_simplex + authenticated P2P + MMR + BLS12-381. 블록 ~200ms, Finality ~300ms, CPU 65% 절감.' },
  { label: '채택 현황 & 로드맵', body: 'Tempo(테스트넷), Alto(벤치마크). 향후: QMDB 통합, 추가 프리미티브, MCP 서버, 문서화.' },
];

export default function RuntimeAltoViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={130} y={10} width={160} height={28} rx={5} fill={`${C1}10`} stroke={C1} strokeWidth={0.8} />
              <text x={210} y={28} textAnchor="middle" fontSize={10} fontWeight={600} fill={C1}>모든 커밋</text>
              <line x1={210} y1={38} x2={210} y2={52} stroke="var(--border)" strokeWidth={0.5} />
              {[
                { label: '네트워크 파티션', c: '#ef4444' },
                { label: '비잔틴 장애', c: '#ef4444' },
                { label: '느린/손실 링크', c: C3 },
                { label: '비정상 종료', c: C3 },
              ].map((s, i) => {
                const x = 30 + i * 105;
                return (
                  <g key={i}>
                    <line x1={210} y1={52} x2={x + 40} y2={65} stroke="var(--border)" strokeWidth={0.4} />
                    <rect x={x} y={55} width={80} height={22} rx={4} fill={`${s.c}08`} stroke={s.c} strokeWidth={0.5} />
                    <text x={x + 40} y={70} textAnchor="middle" fontSize={10} fill={s.c}>{s.label}</text>
                  </g>
                );
              })}
              <line x1={210} y1={77} x2={210} y2={95} stroke="var(--border)" strokeWidth={0.5} />
              <rect x={110} y={95} width={200} height={26} rx={5} fill={`${C2}10`} stroke={C2} strokeWidth={0.8} />
              <text x={210} y={112} textAnchor="middle" fontSize={10} fontWeight={500} fill={C2}>
                동일 시드 → 동일 결과 (완전 재현)
              </text>
              <rect x={140} y={135} width={140} height={22} rx={4} fill={`${C2}15`} stroke={C2} strokeWidth={1} />
              <text x={210} y={150} textAnchor="middle" fontSize={10} fontWeight={600} fill={C2}>90%+ 커버리지</text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={220} y={20} textAnchor="middle" fontSize={10} fontWeight={600} fill={C1}>Alto 아키텍처</text>
              {[
                { label: 'threshold_simplex', sub: '합의', c: C1 },
                { label: 'p2p::authenticated', sub: '네트워킹', c: '#8b5cf6' },
                { label: 'storage::mmr', sub: '저장', c: C2 },
                { label: 'crypto::bls12381', sub: '암호화', c: C3 },
              ].map((p, i) => {
                const x = 20 + i * 108;
                return (
                  <g key={i}>
                    <rect x={x} y={34} width={96} height={40} rx={5} fill="var(--card)" />
                    <rect x={x} y={34} width={96} height={40} rx={5}
                      fill={`${p.c}10`} stroke={p.c} strokeWidth={0.8} />
                    <text x={x + 48} y={52} textAnchor="middle" fontSize={10} fontWeight={600}
                      fill={p.c} fontFamily="monospace">{p.label}</text>
                    <text x={x + 48} y={66} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{p.sub}</text>
                  </g>
                );
              })}
              {[
                { metric: '블록 타임', value: '~200ms' },
                { metric: 'Finality', value: '~300ms' },
                { metric: 'CPU 절감', value: '65%' },
              ].map((m, i) => (
                <g key={i}>
                  <rect x={60 + i * 130} y={100} width={110} height={36} rx={5}
                    fill={`${C2}08`} stroke={C2} strokeWidth={0.6} />
                  <text x={115 + i * 130} y={116} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{m.metric}</text>
                  <text x={115 + i * 130} y={130} textAnchor="middle" fontSize={10} fontWeight={600} fill={C2}>{m.value}</text>
                </g>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={220} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">채택 현황</text>
              {[
                { proj: 'Tempo', prims: 'simplex, broadcast, storage', status: '테스트넷', c: C1 },
                { proj: 'Alto', prims: 'threshold_simplex, p2p, mmr', status: '벤치마크', c: C2 },
              ].map((p, i) => (
                <g key={i}>
                  <rect x={30} y={28 + i * 34} width={80} height={26} rx={4}
                    fill={`${p.c}12`} stroke={p.c} strokeWidth={0.8} />
                  <text x={70} y={45 + i * 34} textAnchor="middle" fontSize={10} fontWeight={600} fill={p.c}>{p.proj}</text>
                  <text x={170} y={45 + i * 34} fontSize={10} fill="var(--muted-foreground)">{p.prims}</text>
                  <text x={380} y={45 + i * 34} fontSize={10} fontWeight={500} fill={p.c}>{p.status}</text>
                </g>
              ))}
              <text x={220} y={112} textAnchor="middle" fontSize={10} fontWeight={600} fill={C3}>향후 로드맵</text>
              {[
                { label: 'QMDB 통합', sub: 'LayerZero 협력' },
                { label: '추가 프리미티브', sub: '합의, 저장, 암호화' },
                { label: 'MCP 서버', sub: 'LLM 개발자 경험' },
                { label: '문서화', sub: '가이드 & 예제' },
              ].map((r, i) => {
                const x = 20 + i * 108;
                return (
                  <g key={i}>
                    <rect x={x} y={122} width={96} height={36} rx={4} fill={`${C3}08`} stroke={C3} strokeWidth={0.5} />
                    <text x={x + 48} y={138} textAnchor="middle" fontSize={10} fontWeight={500} fill={C3}>{r.label}</text>
                    <text x={x + 48} y={150} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{r.sub}</text>
                  </g>
                );
              })}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
