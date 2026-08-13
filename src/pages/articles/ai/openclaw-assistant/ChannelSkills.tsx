import SubAgentSandbox from "./SubAgentSandbox";
import CodeStructure from "./CodeStructure";
import type { CodeRef } from "@/components/code/types";
import ChannelFlowViz from "./viz/ChannelFlowViz";

export default function ChannelSkills({
  onCodeRef,
}: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="security-reply" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        실행 전에는 policy를, 실행 후에는 reply route를 다시 확인합니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          이제 두 요청의 agent, session, model, runtime이 정해졌습니다. 남은 핵심은
          model에게 어떤 지침과 tool을 보일지, tool을 어디서 실행할지, 결과를
          어느 channel로 돌려보낼지입니다. 이 셋을 한 덩어리로 취급하면 skill이
          권한을 만든다거나 sandbox가 routing을 결정한다는 잘못된 설계로
          이어집니다.
        </p>
      </div>
      <div className="not-prose my-8 min-w-0">
        <ChannelFlowViz />
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <SubAgentSandbox onCodeRef={onCodeRef} />
        <CodeStructure onCodeRef={onCodeRef} />
      </div>
    </section>
  );
}
