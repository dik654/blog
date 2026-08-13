import ContextViz from "./viz/ContextViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ABCI++는 합의 엔진과 애플리케이션의 상태 전이를 분리한다</h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          ABCI(Application BlockChain Interface)는 합의 엔진과 앱 로직을
          분리하는 경계입니다. 이 아티클에서는 연결 역할, Application
          interface, localClient의
          코드를 추적합니다.
        </p>

        {/* ── ABCI 메서드 전체 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          ABCI 2.0 전체 메서드 목록
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          cometbft/abci/types/application.go — <code>Application</code>{" "}
          interface
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
              Info / Query (read-only)
            </p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>
                <code className="text-xs">Info()</code> — 앱 메타데이터 반환
              </li>
              <li>
                <code className="text-xs">Query()</code> — key-value 조회
              </li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">
              Mempool (TX 검증)
            </p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>
                <code className="text-xs">CheckTx()</code> — TX 유효성 사전 검증
              </li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">
              Consensus (상태 전이 — 핵심)
            </p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>
                <code className="text-xs">InitChain()</code> — 제네시스 초기화
              </li>
              <li>
                <code className="text-xs">PrepareProposal()</code> — proposer가
                블록 내용 결정
              </li>
              <li>
                <code className="text-xs">ProcessProposal()</code> — validator가
                제안 검증
              </li>
              <li>
                <code className="text-xs">FinalizeBlock()</code> — 확정 블록
                실행
              </li>
              <li>
                <code className="text-xs">Commit()</code> — 상태 디스크 저장
              </li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">
              Vote Extension (ABCI 2.0+)
            </p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>
                <code className="text-xs">ExtendVote()</code> — precommit에 앱
                데이터 부착
              </li>
              <li>
                <code className="text-xs">VerifyVoteExtension()</code> — 부착
                데이터 검증
              </li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4 sm:col-span-2">
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 mb-2">
              Snapshot (state sync)
            </p>
            <ul className="text-sm space-y-1 text-muted-foreground grid grid-cols-2 gap-1">
              <li>
                <code className="text-xs">ListSnapshots()</code> — 사용 가능
                스냅샷 목록
              </li>
              <li>
                <code className="text-xs">OfferSnapshot()</code> — 스냅샷 수락
                여부
              </li>
              <li>
                <code className="text-xs">LoadSnapshotChunk()</code> — 스냅샷
                청크 로드
              </li>
              <li>
                <code className="text-xs">ApplySnapshotChunk()</code> — 청크
                적용
              </li>
            </ul>
          </div>
        </div>

        <p className="text-sm border-l-2 border-sky-500/50 pl-3 mb-4">
          <strong>Cosmos SDK 구현</strong> — <code>baseapp.BaseApp</code>가{" "}
          <code>Application</code> interface를 구현하고 module manager가 각
          method를 module로 위임한다. 따라서 chain 개발자는 ABCI transport보다
          module lifecycle과 handler 구현에 집중한다.
        </p>

        <p className="leading-7">
          ABCI method는 Info·Query, mempool 검증, consensus lifecycle, vote
          extension, snapshot처럼 책임별로 나뉜다. 정확한 method 수는 protocol
          버전에 따라 바뀔 수 있으므로 고정 숫자보다 각 호출이 consensus 전후
          어디에서 실행되는지를 기준으로 읽는 편이 안전하다.
        </p>
      </div>
    </section>
  );
}
