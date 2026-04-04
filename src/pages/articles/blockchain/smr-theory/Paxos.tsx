import PaxosViz from './viz/PaxosViz';

export default function Paxos() {
  return (
    <section id="paxos" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Paxos 프로토콜</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Lamport(1998) — Prepare-Accept 2단계 합의. Multi-Paxos로 SMR 구현.
        </p>
      </div>
      <div className="not-prose"><PaxosViz /></div>
    </section>
  );
}
