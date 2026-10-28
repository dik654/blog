import Overview from "./helios-types/Overview";
import CoreTypes from "./helios-types/CoreTypes";
import Encoding from "./helios-types/Encoding";
import SszInternal from "./helios-types/SszInternal";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefsReal } from "./helios-types/codeRefsReal";
import { heliosTypesRealTree } from "./helios-types/fileTreeReal";
import HeliosLocator, { HeliosMapReturn } from "./helios/HeliosLocator";

export default function HeliosTypes() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <HeliosLocator current="helios-types" />
      <Overview onCodeRef={sidebar.open} />
      <CoreTypes title="Header · Aggregate · Update · Store" onCodeRef={sidebar.open} />
      <Encoding title="SSZ · Fork · Domain signing context" onCodeRef={sidebar.open} />
      <SszInternal
        title="SSZ proof — object root · generalized index"
        onCodeRef={sidebar.open}
      />
      <HeliosMapReturn current="helios-types" />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefsReal}
        fileTrees={{ helios: heliosTypesRealTree }}
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
