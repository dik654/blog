import Overview from "./helios-config/Overview";
import NetworkConfig from "./helios-config/NetworkConfig";
import Persistence from "./helios-config/Persistence";
import ClientInit from "./helios-config/ClientInit";
import Decision from "./helios-config/Decision";
import SelfCheck from "./helios-config/SelfCheck";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefsReal } from "./helios-config/codeRefsReal";
import { heliosConfigRealTree } from "./helios-config/fileTreeReal";
import HeliosLocator, { HeliosMapReturn } from "./helios/HeliosLocator";

export default function HeliosConfig() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <HeliosLocator current="helios-config" />
      <Overview onCodeRef={sidebar.open} />
      <NetworkConfig title="입력과 소유권" onCodeRef={sidebar.open} />
      <ClientInit
        title="Socket과 readiness"
        onCodeRef={sidebar.open}
      />
      <Persistence
        title="Checkpoint와 복구"
        onCodeRef={sidebar.open}
      />
      <Decision />
      <SelfCheck />
      <HeliosMapReturn current="helios-config" />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefsReal}
        fileTrees={{ helios: heliosConfigRealTree }}
        projectMetas={{
          helios: {
            id: "helios",
            label: "a16z/helios · v0.12.0 · Rust",
            badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
          },
        }}
      />
    </>
  );
}
