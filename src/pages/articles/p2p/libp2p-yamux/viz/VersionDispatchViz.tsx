import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, ModuleBox, AlertBox } from '@/components/viz/boxes';

const C = {
  v12: '#06b6d4',
  v13: '#8b5cf6',
  ok: '#10b981',
  err: '#ef4444',
  warn: '#f59e0b',
  text: 'var(--foreground)',
  muted: 'var(--muted-foreground)',
};

const STEPS = [
  {
    label: '버전 협상 — multistream-select',
    body: 'A가 /yamux/0.13.0 제안 → B가 거절 → A가 /yamux/0.12.0 폴백 → 양측 동의.',
  },
  {
    label: '동시 다버전 지원의 3가지 이유',
    body: 'Gradual rollout · Backwards compat · Bug fix rollout.',
  },
  {
    label: 'Either<L, R> — enum dispatch',
    body: 'enum Either { Left(A), Right(B) } — 각 메서드를 match로 분기.',
  },
  {
    label: 'Either vs Trait Object vs Generic — 3가지 대안',
    body: 'dyn은 vtable 비용 · Generic은 컴파일별 분리 · Either는 한 binary·약간의 런타임.',
  },
  {
    label: 'Yamux 버전 history — 0.10 → 0.13',
    body: 'libp2p는 0.12와 0.13 동시 지원. Deprecation 시 Either 제거.',
  },
];

function NegotiationView() {
  return (
    <g>
      <text x={120} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.v13}>A (new)</text>
      <text x={360} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.v12}>B (old)</text>
      <line x1={120} y1={20} x2={120} y2={170} stroke={C.v13} strokeWidth={0.6} opacity={0.4} />
      <line x1={360} y1={20} x2={360} y2={170} stroke={C.v12} strokeWidth={0.6} opacity={0.4} />
      {[
        { y: 38, text: '/yamux/0.13.0', dir: 1, c: C.v13 },
        { y: 62, text: 'na', dir: -1, c: C.err },
        { y: 86, text: '/yamux/0.12.0', dir: 1, c: C.warn },
        { y: 110, text: '/yamux/0.12.0 (accept)', dir: -1, c: C.ok },
      ].map((m, i) => (
        <motion.g key={i}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.18 }}>
          <line x1={m.dir > 0 ? 130 : 350} y1={m.y} x2={m.dir > 0 ? 350 : 130} y2={m.y}
            stroke={m.c} strokeWidth={0.8}
            markerEnd={m.dir > 0 ? 'url(#vR)' : 'url(#vL)'} />
          <text x={240} y={m.y - 3} textAnchor="middle" fontSize={8} fill={m.c} fontWeight={600}>
            {m.text}
          </text>
        </motion.g>
      ))}
      <defs>
        <marker id="vR" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={5} markerHeight={5} orient="auto">
          <path d="M0,0 L6,3 L0,6 z" fill={C.text} />
        </marker>
        <marker id="vL" viewBox="0 0 6 6" refX={1} refY={3} markerWidth={5} markerHeight={5} orient="auto">
          <path d="M6,0 L0,3 L6,6 z" fill={C.text} />
        </marker>
      </defs>
      <text x={240} y={158} textAnchor="middle" fontSize={8} fill={C.ok} fontWeight={700}>
        → use yamux 0.12 (구버전과도 호환)
      </text>
    </g>
  );
}

function ReasonsView() {
  const reasons = [
    { num: 1, title: 'Gradual rollout', desc: '네트워크 동시 업그레이드 불가 — 일부는 구버전', c: C.v13 },
    { num: 2, title: 'Backwards compat', desc: '기존 peer 연결 유지 + 신기능 활용', c: C.warn },
    { num: 3, title: 'Bug fix rollout', desc: 'Security patch 빠른 배포', c: C.ok },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.muted}>
        왜 다버전 동시 지원인가?
      </text>
      {reasons.map((r, i) => (
        <motion.g key={r.num}
          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15 }}>
          <rect x={20} y={32 + i * 42} width={440} height={36} rx={5}
            fill={r.c + '08'} stroke={r.c + '50'} strokeWidth={0.6} />
          <circle cx={42} cy={50 + i * 42} r={11}
            fill={r.c + '20'} stroke={r.c} strokeWidth={0.7} />
          <text x={42} y={54 + i * 42} textAnchor="middle" fontSize={11} fontWeight={700} fill={r.c}>
            {r.num}
          </text>
          <text x={64} y={48 + i * 42} fontSize={10} fontWeight={700} fill={r.c}>
            {r.title}
          </text>
          <text x={64} y={62 + i * 42} fontSize={8} fill={C.text}>
            {r.desc}
          </text>
        </motion.g>
      ))}
    </g>
  );
}

function EitherView() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.muted}>
        enum Either&lt;L, R&gt; — 두 버전을 감싸는 합타입
      </text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <ModuleBox x={170} y={28} w={140} h={40}
          label="Either<L, R>" sub="enum dispatch" color={C.warn} />
      </motion.g>
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
        <ActionBox x={40} y={92} w={170} h={36}
          label="Left(yamux 0.12)" sub="구버전" color={C.v12} />
      </motion.g>
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
        <ActionBox x={270} y={92} w={170} h={36}
          label="Right(yamux 0.13)" sub="신버전" color={C.v13} />
      </motion.g>
      <line x1={240} y1={68} x2={125} y2={92} stroke={C.muted} strokeWidth={0.5} opacity={0.5} />
      <line x1={240} y1={68} x2={355} y2={92} stroke={C.muted} strokeWidth={0.5} opacity={0.5} />
      <text x={240} y={154} textAnchor="middle" fontSize={8} fill={C.muted}>
        match self &#123; Left(m) =&gt; m.poll(...), Right(m) =&gt; m.poll(...) &#125;
      </text>
    </g>
  );
}

function AlternativesView() {
  const alts = [
    { name: 'Box<dyn StreamMuxer>', cost: 'vtable lookup', binary: 'flexible', c: C.err, picked: false },
    { name: 'Generic Swarm<TMuxer>', cost: 'zero', binary: '버전별 분리', c: C.warn, picked: false },
    { name: 'Either<A, B>', cost: 'enum branch (~ns)', binary: '한 binary', c: C.ok, picked: true },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.muted}>
        세 가지 대안 — Either 채택 이유
      </text>
      {alts.map((a, i) => (
        <motion.g key={a.name}
          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15 }}>
          <rect x={20} y={32 + i * 38} width={440} height={32} rx={5}
            fill={a.c + '08'}
            stroke={a.c + (a.picked ? '90' : '40')}
            strokeWidth={a.picked ? 1.2 : 0.6} />
          <text x={32} y={50 + i * 38} fontSize={9} fontWeight={700} fill={a.c}>
            {a.name}
          </text>
          <text x={210} y={50 + i * 38} fontSize={8} fill={C.text}>
            cost: {a.cost}
          </text>
          <text x={340} y={50 + i * 38} fontSize={8} fill={C.muted}>
            binary: {a.binary}
          </text>
          {a.picked && (
            <text x={448} y={50 + i * 38} textAnchor="end" fontSize={8} fontWeight={700} fill={a.c}>
              ✓ chosen
            </text>
          )}
        </motion.g>
      ))}
    </g>
  );
}

function HistoryView() {
  const versions = [
    { ver: '0.10', desc: 'initial libp2p support', c: C.muted, supported: false },
    { ver: '0.11', desc: 'API improvements', c: C.muted, supported: false },
    { ver: '0.12', desc: 'buffer fixes · current stable', c: C.v12, supported: true },
    { ver: '0.13', desc: 'async 개선 · new API', c: C.v13, supported: true },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.muted}>
        Yamux versioning — libp2p는 0.12 + 0.13
      </text>
      {versions.map((v, i) => (
        <motion.g key={v.ver}
          initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.12 }}>
          <rect x={30} y={32 + i * 30} width={420} height={24} rx={4}
            fill={(v.c === C.muted ? '#64748b' : v.c) + (v.supported ? '15' : '06')}
            stroke={(v.c === C.muted ? '#64748b' : v.c) + (v.supported ? '70' : '30')}
            strokeWidth={v.supported ? 1 : 0.5}
            strokeDasharray={v.supported ? undefined : '3 2'} />
          <text x={48} y={49 + i * 30} fontSize={10} fontWeight={700}
            fill={v.c === C.muted ? '#64748b' : v.c}>
            {v.ver}
          </text>
          <text x={120} y={49 + i * 30} fontSize={8.5} fill={C.text}>
            {v.desc}
          </text>
          {v.supported && (
            <text x={440} y={49 + i * 30} textAnchor="end" fontSize={8} fontWeight={700} fill={v.c}>
              ✓ active
            </text>
          )}
        </motion.g>
      ))}
      <text x={240} y={166} textAnchor="middle" fontSize={8} fill={C.muted}>
        Deprecation 시 Either 제거 → 코드 단순화
      </text>
    </g>
  );
}

const VIEWS = [NegotiationView, ReasonsView, EitherView, AlternativesView, HistoryView];

export default function VersionDispatchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const View = VIEWS[step];
        return (
          <svg viewBox="0 0 480 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <View />
          </svg>
        );
      }}
    </StepViz>
  );
}
