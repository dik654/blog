import CometBFTCoreViz from "../cometbft-core-viz";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function ABCIClient({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="abci-client" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">ABCI client는 transport adapter이면서 연결별 state ordering의 경계다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Application이 같은 process의 local client인지, socket·gRPC transport 뒤에 있는지는 배포 선택입니다. 그보다는
          consensus·mempool·query·snapshot 요청이 저마다 다른 logical connection과 state view를 쓴다는 점이 중요합니다. Transport가
          빨라도 호출 순서·determinism·durability까지 보장되지는 않습니다. Remote transport에는 serialization, deadline,
          reconnect, duplicated request와 partial failure가 더 붙습니다.
        </p>
      </div>
      <div className="not-prose my-4 flex flex-wrap gap-3">
        <CodeViewButton
          label="AppConns · 4개 연결"
          onClick={() => onCodeRef("app-conns", codeRefs["app-conns"])}
        />
        <CodeViewButton
          label="Application 인터페이스"
          onClick={() =>
            onCodeRef("application-interface", codeRefs["application-interface"])
          }
        />
        <CodeViewButton
          label="localClient"
          onClick={() => onCodeRef("local-client", codeRefs["local-client"])}
        />
      </div>
      <CometBFTCoreViz mode="connections" />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Consensus connection이 authoritative transition을 소유합니다</h3>
        <p>
          PrepareProposal·ProcessProposal의 candidate state는 FinalizeBlock의 execute state와 분리합니다. Commit이 반환되면
          그 높이를 committed state로 승격합니다. Mempool connection의 CheckTx는 이 committed view를 기준으로 transaction을
          검사합니다. Commit 전후의 flush·recheck ordering도 그대로 따라야 합니다. Query는 명시한 committed height를 읽고 snapshot
          restore는 trusted AppHash와 restored state를 대조합니다.
        </p>
        <h3>Remote client에는 stable request identity가 필요합니다</h3>
        <p>
          Timeout 뒤 client가 request를 다시 보낼 수 있습니다. 그래서 method·height·round·block hash를 request identity에 묶고
          application은 authoritative call의 재실행을 안전하게 처리해야 합니다. Deadline expired는 server가 실행하지 않았다는 증거가 아닙니다.
          연결 오류만 보고 candidate state를 commit하거나 external effect를 다시 수행해서는 안 됩니다.
        </p>
      </div>
    </section>
  );
}
