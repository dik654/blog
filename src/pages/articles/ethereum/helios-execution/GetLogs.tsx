import GetLogsViz from './viz/GetLogsViz';

export default function GetLogs() {
  return (
    <section id="get-logs" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        eth_getLogs: Bloom Filter 필터링
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Reth: MDBX Receipts 테이블에서 블록 범위의
          receipt를 읽고 address/topics로 필터링한다.<br />
          Helios: RPC에서 로그를 받되,
          receipt_root 기반 Bloom Filter로 포함 여부를 검증한다.
        </p>
        <p className="leading-7">
          Bloom Filter(2048비트, logsBloom):
          각 로그의 address와 topic을 keccak256으로 해싱하고
          3개 비트 위치를 설정한다.<br />
          블록 헤더의 logsBloom과 대조하여
          RPC가 로그를 누락했는지 감지한다.
        </p>
        <p className="leading-7">
          한계: Bloom은 false positive가 있어
          "포함되지 않음"만 확실히 판단할 수 있다.<br />
          그래서 receipt 전체를 받아
          개별 로그도 추가 검증한다.
        </p>
      </div>
      <div className="not-prose"><GetLogsViz /></div>
    </section>
  );
}
