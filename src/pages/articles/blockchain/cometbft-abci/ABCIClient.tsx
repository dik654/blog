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
      <h2 className="mb-6 text-2xl font-bold">네 연결은 같은 application을 보지만 맡은 상태가 다릅니다</h2>
      <div className="not-prose mb-6 grid gap-px bg-border p-px sm:grid-cols-4" aria-label="ABCI의 네 논리 연결과 담당 상태">
        {[
          ["CONSENSUS", "후보·결정 실행·Commit", "ExecuteTxState"],
          ["MEMPOOL", "CheckTx·recheck", "CheckTxState"],
          ["QUERY", "Info·Query", "committed view"],
          ["SNAPSHOT", "state sync", "snapshot working state"],
        ].map(([name, methods, state]) => (
          <div key={name} className="min-w-0 bg-background p-4">
            <span className="text-[9px] font-black text-primary">{name}</span>
            <strong className="mt-2 block break-keep text-sm leading-6">{methods}</strong>
            <span className="mt-2 block text-xs leading-5 text-muted-foreground">{state}</span>
          </div>
        ))}
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          <code>AppConns</code>는 consensus·mempool·query·snapshot에 각각 다른 ABCI client를 만듭니다. Application은 연결마다
          working state를 따로 둘 수 있고 Commit에서 committed state에 맞춰 동기화합니다.
        </p>
        <p>
          이 분리는 책임을 나누지만 곧바로 병렬 실행을 뜻하지는 않습니다. 공식 규격상 연결은 논리적으로 동시에 동작할 수 있으나 기본
          in-process client와 기본 Go socket server는 global mutex로 ABCI call을 하나씩 처리합니다.
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
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Transport 선택과 state authority는 다른 문제입니다</h3>
        <p>
          같은 process의 local client는 함수 호출로 전달하고, 외부 application은 socket 또는 gRPC transport를 사용할 수 있습니다.
          Remote transport에는 직렬화·연결 단절·deadline이 추가되지만, local이라고 호출 의미가 단순해지는 것은 아닙니다.
        </p>
        <p>
          어느 방식이든 Prepare·Process의 candidate는 FinalizeBlock의 ExecuteTxState와 분리하고, durable state는 Commit만 갱신해야
          합니다.
        </p>
        <h3>Commit은 네 state view가 다시 만나는 장벽입니다</h3>
        <p>
          CometBFT는 Commit 전에 mempool을 잠그고 mempool connection의 pending request를 flush합니다. Commit이 application state를
          h41로 영속화한 뒤 남아 있는 transaction을 새 state로 recheck합니다.
        </p>
        <p>
          Query는 committed height를 읽고 snapshot restore는 신뢰한 AppHash와 복원한 state를 대조합니다. 따라서 연결 수보다 중요한
          것은 각 view가 어느 barrier에서 같은 높이로 맞춰지는지입니다.
        </p>
        <h3>Timeout은 method가 실행되지 않았다는 증거가 아닙니다</h3>
        <p>
          Remote call의 응답을 못 받았어도 server가 이미 method를 실행했을 수 있습니다. Height·block hash·method를 함께 로그에 남기고,
          replay되는 FinalizeBlock과 Commit을 안전하게 처리해야 합니다. Candidate path에서 payment·webhook 같은 외부 side effect를 실행하면
          어느 proposal이 결정될지 모르는 상태에서 중복 효과를 만들 수 있습니다.
        </p>
      </div>
    </section>
  );
}
