import UpdateTypesViz from './viz/UpdateTypesViz';

export default function UpdateTypes({ title }: { title: string }) {
  return (
    <section id="update-types" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Helios는 두 종류의 Update를 수신한다.
          <br />
          OptimisticUpdate(빠름, reorg 가능)와 FinalityUpdate(느림, 확정).
        </p>
      </div>
      <div className="not-prose"><UpdateTypesViz /></div>
    </section>
  );
}
