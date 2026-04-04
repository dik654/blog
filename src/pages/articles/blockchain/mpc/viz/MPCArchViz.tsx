import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const P = '#6366f1', S = '#10b981', A = '#f59e0b';

const NODES = [
  { id: 'p1', label: 'P\u2081', color: P, x: 30, y: 30 },
  { id: 'p2', label: 'P\u2082', color: P, x: 100, y: 30 },
  { id: 'p3', label: 'P\u2083', color: P, x: 170, y: 30 },
  { id: 'shamir', label: 'Shamir 분산', color: S, x: 100, y: 90 },
  { id: 'channel', label: '보안 채널', color: S, x: 50, y: 145 },
  { id: 'paillier', label: 'Paillier 동형', color: A, x: 170, y: 145 },
  { id: 'dkg', label: 'DKG', color: A, x: 260, y: 90 },
  { id: 'threshold', label: '임계값 서명', color: P, x: 310, y: 145 },
  { id: 'result', label: '최종 결과', color: S, x: 360, y: 90 },
];

const EDGES = [
  { s: 'p1', t: 'shamir' }, { s: 'p2', t: 'shamir' }, { s: 'p3', t: 'shamir' },
  { s: 'shamir', t: 'channel' }, { s: 'channel', t: 'paillier' },
  { s: 'paillier', t: 'dkg' }, { s: 'dkg', t: 'threshold' }, { s: 'threshold', t: 'result' },
];

const ACTIVE: string[][] = [
  ['p1', 'p2', 'p3', 'shamir', 'channel', 'paillier', 'dkg', 'threshold', 'result'],
  ['p1', 'p2', 'p3', 'shamir'], ['shamir', 'channel', 'paillier'],
  ['paillier', 'dkg'], ['dkg', 'threshold', 'result'],
];

const STEPS = [
  { label: 'MPC 전체 아키텍처', body: '참가자들이 비밀을 공개하지 않고 협력하여 계산하는 전체 흐름' },
  { label: '비밀 입력 분산', body: '각 참가자가 Shamir 비밀 분산으로 자신의 입력을 n개 공유로 나눕니다' },
  { label: '보안 채널 통신', body: '공유를 암호화된 P2P 채널로 교환. Paillier 동형 암호로 연산합니다' },
  { label: '분산 키 생성', body: 'DKG로 신뢰할 수 있는 딜러 없이 Paillier 키 쌍을 생성합니다' },
  { label: '임계값 서명 & 결과', body: 't+1명이 협력하여 서명. 개인키 복원 없이 유효한 서명 생성' },
];

function find(id: string) { return NODES.find(n => n.id === id)!; }

export default function MPCArchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const active = ACTIVE[step];
        return (
          <svg viewBox="0 0 540 190" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <defs>
              <marker id="mpc-ah" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" opacity={0.4} />
              </marker>
            </defs>
            {EDGES.map((e, i) => {
              const s = find(e.s), t = find(e.t);
              const on = active.includes(e.s) && active.includes(e.t);
              return (
                <motion.line key={i} x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                  stroke="var(--muted-foreground)" strokeWidth={1}
                  markerEnd="url(#mpc-ah)" animate={{ opacity: on ? 0.5 : 0.1 }}
                  transition={{ duration: 0.3 }} />
              );
            })}
            {NODES.map(n => {
              const on = active.includes(n.id);
              return (
                <motion.g key={n.id} animate={{ opacity: on ? 1 : 0.2 }} transition={{ duration: 0.3 }}>
                  <circle cx={n.x} cy={n.y} r={18} fill={on ? n.color + '12' : '#ffffff08'}
                    stroke={n.color} strokeWidth={on ? 1.5 : 1} />
                  <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={9} fontWeight={500}
                    fill={n.color}>{n.label}</text>
                </motion.g>
              );
            })}
        </svg>
        );
      }}
    </StepViz>
  );
}
