import MmapViz from './viz/MmapViz';

export default function MmapCopyOnWrite() {
  return (
    <section id="mmap-cow" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">mmap과 Copy-on-Write</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          mmap(memory-mapped file)은 파일을 프로세스의 가상 메모리 공간에 직접 매핑하는 기법입니다.<br />
          read() 시스콜 없이 포인터 역참조만으로 데이터에 접근할 수 있습니다(zero-copy)
        </p>
        <p className="leading-7">
          쓰기 트랜잭션이 페이지를 수정할 때는 Copy-on-Write(CoW) 방식을 사용합니다.<br />
          원본 페이지를 건드리지 않고 새 페이지에 복사 후 수정하므로,
          읽기 트랜잭션은 원본을 계속 안전하게 참조할 수 있습니다
        </p>
      </div>
      <div className="not-prose">
        <MmapViz />
      </div>
    </section>
  );
}
