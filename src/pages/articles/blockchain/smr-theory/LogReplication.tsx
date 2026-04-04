import LogReplicationViz from './viz/LogReplicationViz';

export default function LogReplication() {
  return (
    <section id="log-replication" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">로그 복제: Raft 기초</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Raft(2014) — 리더 기반 합의. 리더 선출, 로그 복제, 안전성 세 문제로 분해.
        </p>
      </div>
      <div className="not-prose"><LogReplicationViz /></div>
    </section>
  );
}
