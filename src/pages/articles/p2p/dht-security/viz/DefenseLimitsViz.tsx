import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { AlertBox, ActionBox, DataBox } from '@/components/viz/boxes';

const LIM = '#ef4444';
const RES = '#6366f1';
const NEU = '#94a3b8';

const STEPS = [
  { label: 'IP Quota 우회', body: 'cloud provider · IPv6 · 100개 /24 subnet 동원 시 같은 테이블에 1000+ 노드 진입 가능.' },
  { label: 'Bucket Fill 타이밍', body: '신규 버킷은 천천히 채워짐. 공격자가 새 노드 부팅 직후를 노려 자기 노드를 먼저 주입.' },
  { label: 'Botnet-scale Sybils', body: '10K+ 감염 디바이스(예: Meris 2021)는 다양한 IP로 자연스럽게 분산 — quota 회피.' },
  { label: '연구된 보강 방어', body: 'PoW on node creation, deposit 기반 stake, 사회 그래프(SybilGuard), ML 이상 탐지 등.' },
  { label: '실증된 학술 공격', body: 'USENIX 2018 Eclipse, NDSS 2020 Low-Resource Eclipse, FC 2020 TxProbe.' },
  { label: '결론: 완전 방어 불가', body: '현 방어는 mainnet scale에서 충분히 비싸게 만들 뿐. 활발한 연구 영역.' },
];

const LIMITS = [
  { label: 'IP Quota 우회', sub: 'cloud · IPv6 · 다수 /24' },
  { label: 'Bucket Fill 타이밍', sub: 'fresh node 취약 구간' },
  { label: 'Botnet Sybils', sub: 'Meris 등 10K+ 디바이스' },
];
const RESEARCH = [
  { label: 'PoW on creation', sub: '노드 생성 비용' },
  { label: 'Crypto stake', sub: 'deposit / slashing' },
  { label: 'Trust graph', sub: 'SybilGuard / Limit' },
  { label: 'ML anomaly', sub: '행동 기반 탐지' },
];
const PAPERS = ['USENIX 2018', 'NDSS 2020', 'FC 2020 TxProbe'];

export default function DefenseLimitsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 230" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Limits column */}
          <text x={100} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={LIM}>
            현재 방어의 한계
          </text>
          {LIMITS.map((l, i) => {
            const idx = i;
            const active = step === idx;
            return (
              <motion.g key={l.label}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: step >= idx ? (active ? 1 : 0.45) : 0.15, x: 0 }}
                transition={{ delay: i * 0.05 }}>
                <AlertBox x={20} y={28 + i * 50} w={160} h={42}
                  label={l.label} sub={l.sub} color={LIM} />
              </motion.g>
            );
          })}

          {/* Research column */}
          <text x={290} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={RES}>
            연구된 보강 방어
          </text>
          {RESEARCH.map((r, i) => {
            const idx = 3;
            const active = step === idx;
            return (
              <motion.g key={r.label}
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: step >= idx ? (active ? 1 : 0.55) : 0.15, x: 0 }}
                transition={{ delay: i * 0.05 }}>
                <ActionBox x={210} y={28 + i * 38} w={160} h={32}
                  label={r.label} sub={r.sub} color={RES} />
              </motion.g>
            );
          })}

          {/* Papers row */}
          <text x={420} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={NEU}>
            학술 공격
          </text>
          {PAPERS.map((p, i) => {
            const idx = 4;
            return (
              <motion.g key={p}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: step >= idx ? 1 : 0.15, y: 0 }}
                transition={{ delay: i * 0.06 }}>
                <DataBox x={385} y={28 + i * 32} w={75} h={26}
                  label={p} color={NEU} outlined />
              </motion.g>
            );
          })}

          {/* Conclusion bar */}
          {step >= 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={20} y={195} width={440} height={22} rx={6}
                fill={`${LIM}10`} stroke={LIM} strokeWidth={0.8} strokeDasharray="4 3" />
              <text x={240} y={210} textAnchor="middle" fontSize={10} fontWeight={700} fill={LIM}>
                완전한 DHT 방어는 불가능 — mainnet scale에서 비용을 비싸게 만들 뿐
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
