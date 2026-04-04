import Overview from './vllm-scheduler/Overview';
import ScheduleMethod from './vllm-scheduler/ScheduleMethod';
import PrefillDecode from './vllm-scheduler/PrefillDecode';
import Preemption from './vllm-scheduler/Preemption';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { schedulerCodeRefs } from './vllm-serving/codeRefsScheduler';
import { sharedCodeRefs } from './vllm-serving/sharedCodeRefs';
import { vllmTree } from './vllm-serving/fileTrees';

const allRefs = { ...sharedCodeRefs, ...schedulerCodeRefs };

export default function VLLMSchedulerArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <ScheduleMethod onCodeRef={sidebar.open} />
      <PrefillDecode onCodeRef={sidebar.open} />
      <Preemption onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={allRefs}
        fileTrees={{ vllm: vllmTree }}
        projectMetas={{
          vllm: { id: 'vllm', label: 'vLLM · Python', badgeClass: 'bg-[#fef3c7] border-[#f59e0b] text-[#92400e]' },
        }}
      />
    </>
  );
}
