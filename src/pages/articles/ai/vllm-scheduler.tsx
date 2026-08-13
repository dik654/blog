import Overview from "./vllm-scheduler/Overview";
import ScheduleMethod from "./vllm-scheduler/ScheduleMethod";
import PrefillDecode from "./vllm-scheduler/PrefillDecode";
import Preemption from "./vllm-scheduler/Preemption";

export default function VLLMSchedulerArticle() {
  return (
    <>
      <Overview />
      <ScheduleMethod />
      <PrefillDecode />
      <Preemption />
    </>
  );
}
