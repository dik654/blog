import Overview from './tee-tcb/Overview';
import TcbCompare from './tee-tcb/TcbCompare';
import MeasuredBoot from './tee-tcb/MeasuredBoot';
import TpmPcr from './tee-tcb/TpmPcr';
import CodeMeasurement from './tee-tcb/CodeMeasurement';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './tee-tcb/codeRefs';
import { tcbFileTree } from './tee-tcb/fileTrees';

export default function TeeTcbArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview />
      <TcbCompare />
      <MeasuredBoot />
      <TpmPcr />
      <CodeMeasurement onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ sgx: tcbFileTree }}
        projectMetas={{
          sgx: { id: 'sgx', label: 'SGX · C', badgeClass: 'bg-[#e0f2fe] border-[#0ea5e9] text-[#0369a1]' },
        }}
      />
    </>
  );
}
