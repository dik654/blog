import PiSDKStructure from "./PiSDKStructure";
import EmbeddedAgent from "./EmbeddedAgent";
import MultiProvider from "./MultiProvider";
import CustomTools from "./CustomTools";
import ChannelArchitecture from "./ChannelArchitecture";
import SkillSystem from "./SkillSystem";
import PiSDKLayerViz from "./viz/PiSDKLayerViz";
import ChannelMessageFlowViz from "./viz/ChannelMessageFlowViz";
import type { CodeRef } from "@/components/code/types";

export default function PiIntegration({
  onCodeRef,
}: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="routing-sessions" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        binding이 정해진 뒤에야 session·model·runtime을 해석합니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          인증을 통과한 Telegram 사용자 A와 Slack 사용자 B는 먼저 deterministic binding으로 agent에 연결됩니다. 그 다음 session key로 각자의
          대화 상태를 찾고 이번 turn에 쓸 provider·model과 agent runtime을 해석합니다. 이 순서를 뒤집으면 model 이름이 identity나 session을
          결정하는 것처럼 오해하기 쉽습니다.
        </p>
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <ChannelArchitecture onCodeRef={onCodeRef} />
        <div className="not-prose my-8 min-w-0">
          <ChannelMessageFlowViz />
        </div>
        <EmbeddedAgent onCodeRef={onCodeRef} />
        <div id="runtime-resources" className="scroll-mt-20">
          <div className="not-prose my-8 min-w-0">
            <PiSDKLayerViz />
          </div>
          <PiSDKStructure onCodeRef={onCodeRef} />
          <MultiProvider onCodeRef={onCodeRef} />
          <CustomTools />
          <SkillSystem onCodeRef={onCodeRef} />
        </div>
      </div>
    </section>
  );
}
