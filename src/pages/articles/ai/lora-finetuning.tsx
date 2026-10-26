import Overview from "./lora-finetuning/Overview";
import LoRA from "./lora-finetuning/LoRA";
import QLoRA from "./lora-finetuning/QLoRA";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./lora-finetuning/codeRefs";
import { unslothTree } from "./lora-finetuning/fileTree";
import DomainAdaptationPathLocator, {
  DomainAdaptationMapReturn,
} from "./domain-finetuning/DomainAdaptationPathLocator";

export default function LoraFinetuningArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <div className="space-y-12">
        <DomainAdaptationPathLocator current="lora-mechanism" />
        <Overview />
        <LoRA onCodeRef={sidebar.open} />
        <QLoRA />
        <DomainAdaptationMapReturn current="lora-mechanism" />
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
