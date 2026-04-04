import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 TEE가 필요한가</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          클라우드에서 코드를 실행하면 호스트(OS, 하이퍼바이저)가 메모리를 읽을 수 있습니다.<br />
          TEE(Trusted Execution Environment)는 CPU 하드웨어가 메모리를 암호화하고 격리합니다.<br />
          호스트가 침해되어도 TEE 내부 데이터는 보호됩니다.
        </p>
      </div>
    </section>
  );
}
