import Overview from "./helios-config/Overview";
import NetworkConfig from "./helios-config/NetworkConfig";
import Persistence from "./helios-config/Persistence";
import ClientInit from "./helios-config/ClientInit";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefsReal } from "./helios-config/codeRefsReal";
import { heliosConfigRealTree } from "./helios-config/fileTreeReal";

export default function HeliosConfig() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <NetworkConfig title="네트워크 + 합의 스펙 + RPC" onCodeRef={sidebar.open} />
      <ClientInit
        title="Builder 조립에서 verified readiness까지"
        onCodeRef={sidebar.open}
      />
      <Persistence
        title="Checkpoint cache · age policy · fallback"
        onCodeRef={sidebar.open}
      />
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
            label: "a16z/helios · Rust",
            badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
          },
        }}
      />
    </>
  );
}
