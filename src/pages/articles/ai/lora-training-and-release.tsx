import { CodeSidebar, useCodeSidebar } from "@/components/code";
import DomainAdaptationPathLocator, {
  DomainAdaptationMapReturn,
} from "./domain-finetuning/DomainAdaptationPathLocator";
import Data from "./lora-finetuning/Data";
import OperationsOverview from "./lora-finetuning/OperationsOverview";
import Practice from "./lora-finetuning/Practice";
import { codeRefs } from "./lora-finetuning/codeRefs";
import { unslothTree } from "./lora-finetuning/fileTree";

export default function LoraTrainingAndReleaseArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <div className="space-y-12">
        <DomainAdaptationPathLocator current="lora-operations" />
        <OperationsOverview />
        <Data onCodeRef={sidebar.open} />
        <Practice />
        <DomainAdaptationMapReturn current="lora-operations" />
      </div>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ unsloth: unslothTree }}
        projectMetas={{
          unsloth: {
            id: "unsloth",
            label: "unsloth · Python",
            badgeClass: "bg-yellow-500/10 border-yellow-500 text-yellow-700",
          },
        }}
      />
    </>
  );
}
