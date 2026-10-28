import Overview from "./helios-execution/Overview";
import ExecutionTrace from "./helios-execution/ExecutionTrace";
import RpcMethods from "./helios-execution/RpcMethods";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./helios-execution/codeRefs";
import HeliosLocator, { HeliosMapReturn } from "./helios/HeliosLocator";

export default function HeliosExecution() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <HeliosLocator current="helios-execution" />
      <Overview />
      <ExecutionTrace onCodeRef={sidebar.open} />
      <RpcMethods onCodeRef={sidebar.open} />
      <HeliosMapReturn current="helios-execution" />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{}}
        projectMetas={{
          helios: {
            id: "helios",
            label: "Helios · Rust",
            badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700",
          },
        }}
      />
    </>
  );
}
