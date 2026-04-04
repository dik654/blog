import StoreViz from './viz/StoreViz';

export default function Store() {
  return (
    <section id="store" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        LightClientStore 상태 관리
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Reth는 MDBX에 수백 GB의 상태를 저장한다.
          Account, Storage, Bytecodes 등 수십 개 테이블.<br />
          Helios Store는 메모리에 6개 필드만 유지한다.
          전체 상태를 저장하지 않고 "검증 기준점"만 보유.
        </p>
        <p className="leading-7">
          finalized_header: 가장 확실한 기준점.
          2/3 이상 서명 + finality_branch 검증 통과한 헤더.<br />
          optimistic_header: 최신이지만 최종 확정 전.
          1슬롯 지연으로 더 빠른 응답을 제공한다.
        </p>
        <p className="leading-7">
          current/next_sync_committee: 256 에폭(~27시간) 주기로 교체.
          previous/current_max_active: 업데이트 품질 비교 기준.
        </p>
      </div>
      <div className="not-prose"><StoreViz /></div>
    </section>
  );
}
