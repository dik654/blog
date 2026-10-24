import Overview from "./vllm-scheduler/Overview";
import QueueBatching from "./vllm-scheduler/QueueBatching";
import ScheduleMethod from "./vllm-scheduler/ScheduleMethod";
import PrefillDecode from "./vllm-scheduler/PrefillDecode";
import Preemption from "./vllm-scheduler/Preemption";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./vllm-scheduler/codeRefs";
import { vllmSchedulerTree } from "./vllm-scheduler/fileTree";
import {
  ServingEngineMapReturn,
  ServingEngineSeriesLocator,
} from "./shared/ServingEngineSeriesLocator";

export default function VLLMSchedulerArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <ServingEngineSeriesLocator current="scheduler" />
      <Overview />
      <QueueBatching onCodeRef={sidebar.open} />
      <ScheduleMethod onCodeRef={sidebar.open} />
      <PrefillDecode onCodeRef={sidebar.open} />
      <Preemption onCodeRef={sidebar.open} />
      <ServingEngineMapReturn current="scheduler" />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ vllm: vllmSchedulerTree }}
        projectMetas={{
          vllm: {
            id: "vllm",
            label: "vLLM · Python",
            badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700",
          },
        }}
      />
    </>
  );
}
