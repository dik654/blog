import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const C = {
  root: '#ef4444',
  cluster: '#f59e0b',
  app: '#10b981',
  inst: '#0ea5e9',
  sess: '#8b5cf6',
};
const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.45 };

const STEPS = [
  { label: 'Level 0: Root Key — KMS TEE 내부에만 존재 (HUK 기반)' },
  { label: 'Level 1: Cluster Key — 동일 deployment cluster 공유' },
  { label: 'Level 2: App Key — 같은 image+manifest = 결정적 키' },
  { label: 'Level 3: Instance Key — 각 VM마다 새 nonce' },
  { label: 'Level 4: Session Key — 일회용 (TLS 등)' },
  { label: '계층의 장점 — 결정적 복구 + 격리 + 협력 모두 만족' },
];

interface Level {
  id: string; label: string; sub: string; formula: string; color: string; y: number;
}

const LEVELS: Level[] = [
  { id: 'root', label: 'Root Key', sub: 'KMS TEE 내부, never exposed', formula: 'random | HKDF(HUK)', color: C.root, y: 38 },
  { id: 'cluster', label: 'Cluster Key', sub: '동일 cluster 공유', formula: 'HKDF(root_key, "cluster:" + cluster_id)', color: C.cluster, y: 70 },
  { id: 'app', label: 'App Key', sub: '같은 app image + manifest', formula: 'HKDF(cluster_key, "app:" + app_id)', color: C.app, y: 102 },
  { id: 'inst', label: 'Instance Key', sub: '각 VM 고유 (nonce)', formula: 'HKDF(app_key, "instance:" + instance_nonce)', color: C.inst, y: 134 },
  { id: 'sess', label: 'Session Key', sub: '일회용 (TLS, RPC)', formula: 'HKDF(instance_key, "session:" + session_id)', color: C.sess, y: 166 },
];

export default function KeyHierarchyDstackViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
            dstack KMS — 5-level 키 계층 (HKDF-SHA256)
          </text>
          {step < 5 && LEVELS.map((l, i) => {
            const active = i === step;
            const visited = i < step;
            return (
              <motion.g key={l.id} animate={{ opacity: active ? 1 : visited ? 0.55 : 0.15 }} transition={sp}>
                <rect x={20} y={l.y - 8} width={130} height={20} rx={4}
                  fill={`${l.color}20`} stroke={`${l.color}80`} strokeWidth={active ? 1.2 : 0.6} />
                <text x={85} y={l.y + 6} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={l.color}>L{i}: {l.label}</text>
                <rect x={155} y={l.y - 6} width={300} height={16} rx={3}
                  fill={`${l.color}08`} stroke={`${l.color}30`} strokeWidth={0.5} />
                <text x={165} y={l.y + 6} fontSize={8} fontFamily="monospace" fill={l.color} fontWeight={600}>{l.formula}</text>
                {i < LEVELS.length - 1 && (
                  <line x1={85} y1={l.y + 12} x2={85} y2={l.y + 24} stroke={`${l.color}80`} strokeWidth={0.8} markerEnd="url(#arr-kh)" />
                )}
              </motion.g>
            );
          })}
          {step === 5 && (
            <g>
              <text x={240} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.app}>
                계층 구조의 4가지 장점
              </text>
              {[
                { c: C.app, t: 'App 재시작 후 동일 key 복구 (deterministic recovery)' },
                { c: C.inst, t: 'Instance 간 격리 (같은 app이라도 다른 VM은 다른 instance key)' },
                { c: C.cluster, t: 'Cluster 멤버 간 협력 — multi-VM service에서 공통 키' },
                { c: C.root, t: 'Minimal root key exposure — KMS만 root 보유' },
              ].map((l, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
                  <rect x={30} y={56 + i * 28} width={420} height={24} rx={5}
                    fill={`${l.c}10`} stroke={`${l.c}45`} strokeWidth={0.7} />
                  <rect x={30} y={56 + i * 28} width={3.5} height={24} fill={l.c} />
                  <text x={45} y={73 + i * 28} fontSize={9} fontWeight={600} fill={l.c}>{l.t}</text>
                </motion.g>
              ))}
              <ModuleBox x={140} y={180} w={200} h={20} label="HKDF = HMAC-based Key Derivation" color={C.app} />
            </g>
          )}
          {step < 5 && (
            <motion.g key={`sub-${step}`} initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.3 }}>
              <rect x={155} y={LEVELS[step].y + 12} width={300} height={16} rx={3} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={305} y={LEVELS[step].y + 24} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                {LEVELS[step].sub}
              </text>
            </motion.g>
          )}
          <defs>
            <marker id="arr-kh" viewBox="0 0 8 8" refX={7} refY={4} markerWidth={5} markerHeight={5} orient="auto">
              <path d="M0,0 L8,4 L0,8 z" fill={C.app} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
