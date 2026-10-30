import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import CosmosCoreLocator, { CosmosCoreMapReturn } from "../CosmosCoreLocator";
import MempoolLifecycleViz from "./viz/MempoolLifecycleViz";
import { codeRefs } from "./codeRefs";
import { cometbftMempoolTree } from "./fileTrees";

const sourceCommit = "0880b4d378f347ab16e54ec677ff50d803f37d62";

export default function ModernCometBFTMempoolArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <article>
        <section id="overview" className="mb-16 scroll-mt-20">
          <CosmosCoreLocator
            currentSlug="cometbft-mempool"
            region="CheckTx admission부터 Commit 뒤 recheck까지"
            question="같은 transaction이 cache에는 있고 pool에는 없거나, CheckTx를 통과한 뒤 다시 제거되는 이유는 무엇일까요?"
          />
          <h2 className="mb-6 text-2xl font-bold">두 transaction으로 local 후보 집합의 한 세대를 추적합니다</h2>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="text-lg leading-8">
              Node N의 높이는 40이고 mempool에는 기존 transaction 900 bytes가 있다고 하겠습니다. 여기에 80-byte transaction 두 개가
              거의 동시에 도착합니다. <code>T1</code>은 <code>alice→bob 10</code>, <code>T2</code>는 <code>carol→dave 5</code>입니다.
              <code>MaxTxsBytes</code>는 1,000 bytes입니다.
            </p>
            <p className="text-lg leading-8">
              두 요청은 local gate와 application <code>CheckTx</code>를 통과해도 block에 들어간 것이 아닙니다. Cache, active pool,
              proposer가 읽은 snapshot과 committed application state는 서로 다른 owner가 가진 상태입니다.
            </p>
            <p>
              앞 글의 P2P Reactor가 remote node에 전달한 transaction은 여기서 처음 local application state를 기준으로 판정됩니다.
              Packet 전달 경로가 필요하면 <Link to="/cs/blockchain/cometbft-p2p#reactor">P2P 글의 CheckTx 경계</Link>부터 이어 읽으면 됩니다.
            </p>
          </div>
          <ContentBoundary article="cometbft-mempool" />
          <MempoolLifecycleViz />
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <h3>서로 다른 네 상태를 하나의 “mempool”로 부르면 안 됩니다</h3>
            <ul>
              <li><strong>Seen cache</strong>는 같은 bytes의 CheckTx 반복을 줄이는 duplicate 표식입니다.</li>
              <li><strong>Active pool</strong>은 이 node가 현재 proposal 후보로 보관한 ordered list입니다.</li>
              <li><strong>Reap 결과</strong>는 한 시점의 local list를 bytes·gas ceiling까지 읽은 snapshot입니다.</li>
              <li><strong>Committed state</strong>는 consensus가 정한 block을 application이 Commit한 뒤의 durable state입니다.</li>
            </ul>
            <p>
              CheckTx 성공은 active pool에 들어갈 자격을 얻었다는 local receipt입니다. 다른 node의 pool, proposer 선택, FinalizeBlock 결과와
              Commit은 아직 정해지지 않았습니다.
            </p>
            <h3>코드는 tag 이름보다 content commit을 기준으로 읽습니다</h3>
            <p>
              아래 제어 흐름은 CometBFT v0.40.0의 content commit <code>{sourceCommit}</code>에서 발췌했습니다.
              <code>mempool/clist_mempool.go</code>, <code>mempool/mempool.go</code>와 <code>state/execution.go</code>의 실제 구현을 기준으로 합니다.
            </p>
          </div>
        </section>

        <section id="checktx" className="mb-16 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">Admission은 두 번 관찰하지만 엄격한 byte ceiling은 아닙니다</h2>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              <code>CheckTx</code>는 Update write lock과 충돌하는 read lock을 잡습니다. 이어 pool count·raw bytes, 단건 최대 크기,
              optional <code>preCheck</code>, application connection과 TxKey cache를 차례로 확인합니다. 새 key면
              <code>CheckTxAsync</code>를 호출합니다.
            </p>
            <p>
              응답 callback은 application Code와 <code>postCheck</code>를 본 뒤 <code>isFull</code>을 다시 호출합니다. 그러나 이 두 번째
              검사와 <code>addTx</code>는 하나의 원자 연산이 아닙니다. 공식 코드의 주석도 “한도 초과 가능성을 줄인다”고만 말합니다.
            </p>
          </div>
          <div className="not-prose my-6 flex flex-wrap gap-3">
            <CodeViewButton label="CheckTx gate 원문" onClick={() => sidebar.open("checktx-gates", codeRefs["checktx-gates"])} />
            <CodeViewButton label="Callback admission 원문" onClick={() => sidebar.open("callback-admission", codeRefs["callback-admission"])} />
          </div>

          <ExplainedFormula
            question="900/1,000 bytes에서 80-byte callback 두 개가 동시에 끝나면 왜 1,060 bytes가 될 수 있습니까?"
            idea={<>각 callback은 같은 900-byte snapshot을 읽고 통과할 수 있습니다. 검사 결과와 counter 증가 사이가 원자적이지 않으므로 두 개의 개별 참이 전체 불변식을 보장하지 않습니다.</>}
            formula={String.raw`900+80=980\le1000\quad(\text{각 callback}),\qquad 900+80+80=1060>1000\quad(\text{최종})`}
            annotatedFormula={String.raw`\underbrace{900+80=980\le1000}_{T1과\ T2가\ 각각\ 관찰},\qquad\underbrace{900+80+80=1060>1000}_{두\ addTx\ 이후}`}
            operations={[
              { expression: String.raw`900+80=980`, annotation: ["T1 callback이 통과", "T2 callback도 같은 900을 보면 통과", "두 관찰은 서로의 삽입을 아직 모름"] },
              { expression: String.raw`900+80+80=1060`, annotation: ["두 callback이 addTx 실행", "txsBytes는 atomic add로 정확히 1060", "하지만 config ceiling 1000은 초과"] },
            ]}
            terms={[
              { symbol: "900", name: "관찰한 pool bytes", description: "두 callback이 isFull에서 읽을 수 있는 같은 시작값입니다." },
              { symbol: "80", name: "각 transaction 크기", description: "T1과 T2의 raw byte 길이입니다." },
              { symbol: "1000", name: "MaxTxsBytes", description: "이 node의 설정값이며 원자적 reservation counter가 아닙니다." },
            ]}
            assumptions={[
              "T1과 T2의 first-time CheckTx callback이 겹치고 둘 다 application Code·postCheck를 통과합니다.",
              "두 callback 모두 상대의 addTx보다 먼저 isFull에서 900을 읽습니다.",
              "txsBytes.Add는 counter를 안전하게 더하지만 검사와 삽입 전체를 직렬화하지 않습니다.",
              "이 예는 가능한 interleaving이며 매 실행마다 overshoot가 발생한다는 뜻은 아닙니다.",
            ]}
            interpretation="두 번째 capacity 검사는 유용한 방어지만 strict reservation이 아닙니다. 이 구현을 설명할 때 MaxTxsBytes를 절대 불변식으로 약속하면 안 됩니다."
          />

          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <h3>Cache와 active pool의 membership은 다릅니다</h3>
            <p>
              Cache는 application에 보내기 전에 key를 선점합니다. 그래서 callback을 기다리는 transaction도 cache에는 있지만 pool에는 없습니다.
              Callback이 capacity 때문에 거절되거나 invalid인데 <code>KeepInvalidTxsInCache=false</code>이면 key를 다시 뺍니다.
            </p>
            <p>
              반대로 block에 포함된 valid transaction은 active pool에서 제거되지만 cache에는 남을 수 있습니다. 이미 Commit한 bytes가 gossip을
              통해 즉시 돌아와 다시 CheckTx되는 일을 줄이기 위해서입니다. Cache hit를 현재 proposal 후보나 영구 invalid로 해석하면 안 됩니다.
            </p>
          </div>

          <div id="paper-cometbft-mempool-v040" className="scroll-mt-24">
            <CitationBlock source="CometBFT v0.40.0 · mempool/clist_mempool.go" citeKey={1} type="code" href={`https://github.com/cometbft/cometbft/blob/${sourceCommit}/mempool/clist_mempool.go`}>
              <p><strong>문제:</strong> Concurrent local admission, duplicate suppression과 proposal 후보 membership을 관리합니다.</p>
              <p><strong>기여:</strong> CheckTx gate, cache 선점, 비동기 callback, CList·TxKey map·byte counter 삽입을 구현합니다.</p>
              <p><strong>전제:</strong> v0.40.0 CList mempool과 compatible ABCI application을 사용합니다.</p>
              <p><strong>근거 범위:</strong> 한 node의 first-time admission과 in-memory candidate state입니다.</p>
              <p><strong>말하지 않는 것:</strong> Strict capacity ceiling, 다른 node의 membership, block 포함이나 Commit을 보장하지 않습니다.</p>
            </CitationBlock>
          </div>
        </section>

        <section id="clist" className="mb-16 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">Reap은 local list를 proposal 입력으로 읽는 순간의 snapshot입니다</h2>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              Accepted transaction은 <code>CList</code> 뒤에 붙고 TxKey map과 raw byte counter가 함께 갱신됩니다. 순서는 이 node의 도착과 callback
              완료 순서에 좌우됩니다. 다른 node는 다른 순서와 다른 membership을 가질 수 있습니다.
            </p>
            <p>
              <code>ReapMaxBytesMaxGas</code>는 앞에서부터 transaction을 읽습니다. Block data에 들어갈 protobuf encoded size와
              <code>GasWanted</code>를 각각 누적하고, 어느 ceiling을 넘긴 마지막 transaction은 반환 slice에서 뺍니다. Raw tx byte 합만
              세면 encoding overhead를 놓칩니다.
            </p>
            <p>
              <code>TxsAvailable</code>은 height마다 한 번만 울리는 capacity-1 signal입니다. “후보가 적어도 하나 있으니 다시 읽으라”는
              뜻이지 transaction 수가 아닙니다. Consumer는 깨어난 뒤 pool을 다시 조회해야 합니다.
            </p>
          </div>
          <div className="not-prose my-6 flex flex-wrap gap-3">
            <CodeViewButton label="Reap과 signal 원문" onClick={() => sidebar.open("reap-signal", codeRefs["reap-signal"])} />
          </div>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <h3>Reap 결과도 block inclusion 영수증이 아닙니다</h3>
            <p>
              Proposer는 reap 결과를 <code>PrepareProposal</code>에 넘기며 application이 목록을 바꿀 수 있습니다. 다른 validator는
              <code>ProcessProposal</code>로 proposal을 판정합니다. Mempool에 있었거나 한 번 reap됐다는 사실만으로 결정 block에 들어간다고
              약속할 수 없습니다.
            </p>
          </div>
        </section>

        <section id="recheck" className="mb-16 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">Commit과 Update가 끝날 때까지 old-state admission을 끼워 넣지 않습니다</h2>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              BlockExecutor는 mempool write lock을 잡고 pending application CheckTx callback을 <code>FlushAppConn</code>으로 끝냅니다. 그다음
              application <code>Commit</code>으로 X41을 영속화합니다. Mempool Update는 별도 goroutine에서 실행되지만 unlock 함수도 함께
              넘기므로 Update와 optional recheck가 끝날 때까지 새 CheckTx와 reap은 기다립니다.
            </p>
            <p>
              <code>Update(41)</code>는 새 pre/postCheck를 설치하고 B41에 포함된 T1을 active pool에서 제거합니다. Valid committed T1의
              key는 cache에 남깁니다. T2처럼 pool에 남은 transaction은 <code>CheckTxType_Recheck</code>로 X41에서 다시 검사합니다.
            </p>
          </div>
          <div className="not-prose my-6 flex flex-wrap gap-3">
            <CodeViewButton label="Commit과 Update lock 원문" onClick={() => sidebar.open("commit-update", codeRefs["commit-update"])} />
            <CodeViewButton label="Update와 recheck 원문" onClick={() => sidebar.open("update-recheck", codeRefs["update-recheck"])} />
          </div>

          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <h3>Recheck는 Commit 뒤 달라진 조건을 반영합니다</h3>
            <p>
              B41의 다른 transaction이 Carol의 잔액을 사용했다면 X40에서 통과한 T2가 X41에서는 실패할 수 있습니다. Recheck callback은
              시작할 때 잡은 cursor와 end 사이에서 응답 transaction을 찾고 invalid transaction을 pool에서 지웁니다.
            </p>
            <p>
              응답이 늦거나 빠지면 cursor는 순서대로 찾는 동안 일부 entry를 건너뛸 수 있습니다. <code>RecheckTimeout</code>이 지나면 state를
              done으로 바꾸며 늦게 온 응답은 버립니다. Timeout은 “남은 transaction이 모두 valid”라는 영수증이 아닙니다.
            </p>
            <h3>실패는 owner가 가진 상태에 따라 다르게 남습니다</h3>
            <ul>
              <li>Initial capacity·preCheck·cache 실패는 application CheckTx 전에 caller에게 error로 돌아갑니다.</li>
              <li>Application Code·postCheck 실패는 pool에 넣지 않으며 설정에 따라 cache key를 제거합니다.</li>
              <li>Concurrent callback은 설정 ceiling을 넘길 수 있으므로 observed bytes를 strict reservation처럼 쓰면 안 됩니다.</li>
              <li>FlushAppConn이나 application Commit이 실패하면 write lock을 풀고 BlockExecutor에 error를 반환합니다.</li>
              <li>Legacy async Update error는 panic하며, process restart 뒤 복구 방식은 이 함수가 보장하지 않습니다.</li>
              <li>Recheck timeout은 로그와 pending count를 남기고 진행하므로 잔류 candidate의 새-state 판정이 불완전할 수 있습니다.</li>
            </ul>
            <h3>이 글만으로 확인할 질문</h3>
            <ol>
              <li>Cache hit와 active pool membership이 다른 두 시점을 설명할 수 있습니까?</li>
              <li>두 callback이 각자 capacity를 통과하고도 전체 ceiling을 넘는 interleaving을 계산할 수 있습니까?</li>
              <li>Reap의 encoded bytes·GasWanted ceiling과 admission의 raw-byte ceiling을 구분할 수 있습니까?</li>
              <li>Mempool lock이 FlushAppConn·Commit·Update·Recheck 전체를 감싸는 이유를 설명할 수 있습니까?</li>
              <li>Recheck timeout을 validity 성공으로 해석하면 안 되는 이유를 말할 수 있습니까?</li>
            </ol>
          </div>

          <div id="paper-cometbft-mempool-interface-v040" className="scroll-mt-24">
            <CitationBlock source="CometBFT v0.40.0 · state/execution.go · mempool/mempool.go" citeKey={2} type="code" href={`https://github.com/cometbft/cometbft/blob/${sourceCommit}/state/execution.go`}>
              <p><strong>문제:</strong> Committed application state와 local candidate view가 서로 다른 세대를 보지 않게 합니다.</p>
              <p><strong>기여:</strong> Mempool write lock, pending CheckTx flush, Commit, asynchronous Update·recheck와 unlock 순서를 구현합니다.</p>
              <p><strong>전제:</strong> v0.40.0 BlockExecutor와 CListMempool interface를 함께 사용합니다.</p>
              <p><strong>근거 범위:</strong> 한 node의 application state와 mempool generation 전환입니다.</p>
              <p><strong>말하지 않는 것:</strong> 다른 node의 pool 순서, 모든 recheck 응답 완료, process crash 자동 복구나 external exactly-once를 보장하지 않습니다.</p>
            </CitationBlock>
          </div>
        </section>

        <CosmosCoreMapReturn
          currentSlug="cometbft-mempool"
          closure="CometBFT v0.40.0 mempool은 cache·active pool·reap snapshot·committed state를 분리합니다. CheckTx callback의 두 번째 capacity 관찰은 strict reservation이 아니며, Commit 뒤에는 같은 write-lock 구간의 Update와 recheck로 새 application state에 맞는 local 후보 집합을 다시 만듭니다."
        />
      </article>

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ cometbft: cometbftMempoolTree }}
        projectMetas={{
          cometbft: {
            id: "cometbft",
            label: "CometBFT v0.40.0 · Go",
            badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700",
          },
        }}
      />
    </>
  );
}
