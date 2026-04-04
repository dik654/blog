import { motion } from 'framer-motion';

const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

const F = (x: number, y: number, w: number, h: number, c: string, t: string) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={4} fill="var(--card)" />
    <rect x={x} y={y} width={w} height={h} rx={4} fill={`${c}10`} stroke={c} strokeWidth={0.7} />
    <text x={x + w / 2} y={y + h / 2 + 3} textAnchor="middle" fontSize={10} fill={c}>{t}</text>
  </g>
);

const Chain = ({ items, gap = 28 }: { items: { t: string; c: string }[]; gap?: number }) => (
  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    {items.map((s, i) => (
      <g key={i}>
        {F(80, 10 + i * gap, 300, gap - 6, s.c, s.t)}
        {i < items.length - 1 && (
          <line x1={230} y1={10 + i * gap + gap - 6} x2={230} y2={10 + (i + 1) * gap}
            stroke="var(--border)" strokeWidth={0.4} />
        )}
      </g>
    ))}
  </motion.g>
);

export function ProposeStep() {
  return <Chain items={[
    { t: 'find_parent(view)', c: CV },
    { t: 'should_propose() <- Round', c: CE },
    { t: 'automaton.propose(context)', c: CA },
    { t: 'Proposal::new(round, parent, payload)', c: CV },
    { t: 'relay.broadcast(payload, Plan::Propose)', c: CE },
  ]} />;
}

export function NotarizeStep() {
  return <Chain gap={32} items={[
    { t: 'round.construct_notarize()', c: CV },
    { t: 'Notarize::sign(scheme, proposal)', c: CE },
    { t: 'batcher.constructed(Vote::Notarize)', c: CA },
    { t: 'broadcast_vote -> Recipients::All', c: CV },
  ]} />;
}

export function NotarizationStep() {
  return <Chain gap={26} items={[
    { t: '2f+1 Notarize 투표 수집 (batcher)', c: CV },
    { t: 'scheme.assemble::<_, N3f1>()', c: CE },
    { t: 'Notarization { proposal, certificate }', c: CA },
    { t: 'resolver.updated + handle + sync', c: CV },
    { t: 'broadcast Certificate::Notarization', c: CE },
  ]} />;
}

export function CertifyStep() {
  return <Chain gap={32} items={[
    { t: 'automaton.certify(round, payload)', c: CV },
    { t: 'Ok(true) -> state.certified(view, true)', c: CE },
    { t: 'round.clear_deadlines() + enter_view(next)', c: CA },
    { t: 'Finalize::sign -> broadcast Vote::Finalize', c: CV },
  ]} />;
}

export function FinalizeStep() {
  return <Chain gap={26} items={[
    { t: '2f+1 Finalize -> Finalization 인증서', c: CV },
    { t: 'last_finalized = view', c: CE },
    { t: 'certification_candidates.retain(>view)', c: CA },
    { t: 'enter_view(view.next())', c: CE },
    { t: 'set_leader(next, Some(&cert))', c: CV },
  ]} />;
}
