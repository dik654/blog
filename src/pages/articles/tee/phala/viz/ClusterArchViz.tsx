import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Cluster 구성 — N개 워커가 같은 MRENCLAVE 공유, master key 분산' },
  { label: 'Cluster 생성 — 거버넌스/admin이 초기 워커 + Gatekeeper master key' },
  { label: 'Worker join flow — attestation 검증 → key fragment 전송 (RA-TLS)' },
  { label: 'Cluster 독립성 — A의 key는 B 워커가 못 얻음, MRENCLAVE 변경 시 새 cluster' },
];

const WORKERS = [
  { name: 'Worker 1', sub: 'pRuntime', color: '#6366f1', x: 50 },
  { name: 'Worker 2', sub: 'pRuntime', color: '#10b981', x: 200 },
  { name: 'Worker 3', sub: 'pRuntime', color: '#f59e0b', x: 350 },
];

const CREATE_STEPS = [
  { idx: '1', label: '거버넌스/admin 생성', sub: 'Cluster ID 발급', c: '#6366f1' },
  { idx: '2', label: '초기 worker 집합 지정', sub: 'allow-list', c: '#10b981' },
  { idx: '3', label: 'Gatekeeper master key 생성', sub: 'MPC 분산 시작', c: '#f59e0b' },
];

const JOIN_STEPS = [
  { idx: '1', label: 'Worker가 cluster join 요청', c: '#6366f1' },
  { idx: '2', label: '기존 워커가 attestation 검증', c: '#10b981' },
  { idx: '3', label: 'Master key fragment 전송 (RA-TLS)', c: '#f59e0b' },
  { idx: '4', label: 'Worker가 full cluster key 복원', c: '#0ea5e9' },
  { idx: '5', label: '기존 contract state 동기화', c: '#ef4444' },
];

export default function ClusterArchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">
              Cluster (e.g. 0x0001)
            </text>
            <rect x={20} y={32} width={480} height={170} rx={10}
              fill="none" stroke="#6366f180" strokeWidth={1.2} strokeDasharray="6 4" />
            {WORKERS.map((w, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}>
                <ModuleBox x={w.x} y={50} w={120} h={56}
                  label={w.name} sub={w.sub} color={w.color} />
              </motion.g>
            ))}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <DataBox x={50} y={130} w={170} h={44}
                label="Cluster Master Key" sub="3-of-N MPC threshold" color="#10b981" outlined />
              <DataBox x={250} y={130} w={220} h={44}
                label="Deployed Phat Contracts" sub="모든 워커가 동일 state" color="#f59e0b" outlined />
            </motion.g>
          </g>)}
          {step === 1 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
              Cluster 생성 절차
            </text>
            {CREATE_STEPS.map((s, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}>
                <rect x={50} y={50 + i * 50} width={420} height={36} rx={5}
                  fill={`${s.c}10`} stroke={`${s.c}50`} strokeWidth={0.8} />
                <circle cx={75} cy={68 + i * 50} r={11} fill={s.c} />
                <text x={75} y={72 + i * 50} textAnchor="middle"
                  fontSize={11} fontWeight={700} fill="#fff">{s.idx}</text>
                <text x={100} y={66 + i * 50} fontSize={11} fontWeight={600} fill={s.c}>{s.label}</text>
                <text x={100} y={80 + i * 50} fontSize={9.5} fill="var(--muted-foreground)">{s.sub}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 2 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0ea5e9">
              Worker Join Flow
            </text>
            {JOIN_STEPS.map((s, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12 }}>
                <rect x={40} y={42 + i * 32} width={440} height={26} rx={4}
                  fill={`${s.c}10`} stroke={`${s.c}40`} strokeWidth={0.8} />
                <circle cx={62} cy={55 + i * 32} r={9} fill={s.c} />
                <text x={62} y={59 + i * 32} textAnchor="middle"
                  fontSize={10} fontWeight={700} fill="#fff">{s.idx}</text>
                <text x={82} y={59 + i * 32} fontSize={10} fontWeight={600} fill="var(--foreground)">{s.label}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 3 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">
              Cluster 독립성 — security boundary
            </text>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={30} y={50} width={210} height={130} rx={10}
                fill="none" stroke="#6366f180" strokeWidth={1} strokeDasharray="5 4" />
              <text x={135} y={70} textAnchor="middle"
                fontSize={11} fontWeight={700} fill="#6366f1">Cluster A</text>
              <DataBox x={50} y={90} w={170} h={32}
                label="Master Key A" color="#6366f1" outlined />
              <text x={135} y={150} textAnchor="middle"
                fontSize={9.5} fill="var(--muted-foreground)">workers A1, A2, A3</text>

              <rect x={280} y={50} width={210} height={130} rx={10}
                fill="none" stroke="#10b98180" strokeWidth={1} strokeDasharray="5 4" />
              <text x={385} y={70} textAnchor="middle"
                fontSize={11} fontWeight={700} fill="#10b981">Cluster B</text>
              <DataBox x={300} y={90} w={170} h={32}
                label="Master Key B" color="#10b981" outlined />
              <text x={385} y={150} textAnchor="middle"
                fontSize={9.5} fill="var(--muted-foreground)">workers B1, B2</text>
            </motion.g>
            <text x={260} y={205} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              MRENCLAVE 업그레이드 = 새 cluster 생성 + 마이그레이션
            </text>
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
