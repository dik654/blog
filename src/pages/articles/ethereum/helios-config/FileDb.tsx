import FileDbViz from './viz/FileDbViz';

export default function FileDb() {
  return (
    <section id="file-db" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        FileDB 체크포인트 영속성
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Reth: MDBX에 수백 GB의 체인 데이터를 저장한다.
          재시작 시 디스크에서 상태를 복원하고 이어서 동기화.<br />
          Helios: FileDB로 체크포인트 하나만 저장한다.
          data_dir/checkpoint.ssz — 수십 바이트 수준.
        </p>
        <p className="leading-7">
          재시작 시나리오:<br />
          1) checkpoint.ssz 파일 존재 + Weak Subjectivity 기간 내
          → 즉시 사용. O(초) 복원.<br />
          2) 파일 없거나 만료 → 하드코딩된 체크포인트 또는
          Beacon API에서 최신 finalized 체크포인트 요청.
        </p>
        <p className="leading-7">
          Weak Subjectivity 기간: ~2주.
          이 기간이 지나면 체크포인트가 안전하지 않다.
          공격자가 과거 위원회를 장악했을 가능성이 생기기 때문.
        </p>
      </div>
      <div className="not-prose"><FileDbViz /></div>
    </section>
  );
}
