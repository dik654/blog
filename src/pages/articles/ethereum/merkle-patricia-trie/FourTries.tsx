import FourTriesViz from './viz/FourTriesViz';

export default function FourTries() {
  return (
    <section id="four-tries" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">이더리움의 4가지 트라이</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          이더리움은 MPT를 네 곳에서 사용. 블록 헤더에 각 트라이의 루트 해시가 기록됨
        </p>
      </div>
      <div className="not-prose"><FourTriesViz /></div>
    </section>
  );
}
