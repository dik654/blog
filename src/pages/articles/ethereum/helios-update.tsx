import Overview from "./helios-update/Overview";
import UpdateTrace from "./helios-update/UpdateTrace";
import ForkChoice from "./helios-update/ForkChoice";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./helios-update/codeRefs";
import { heliosTree } from "./helios-update/fileTrees";
import HeliosLocator, { HeliosMapReturn } from "./helios/HeliosLocator";

export default function HeliosUpdateArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <HeliosLocator current="helios-update" />
      <Overview onCodeRef={sidebar.open} />
      <UpdateTrace
        title="Store field가 바뀌는 순서"
        onCodeRef={sidebar.open}
      />
      <ForkChoice
        title="후보 선택과 정체 시 예외"
        onCodeRef={sidebar.open}
      />
      <HeliosMapReturn current="helios-update" />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ helios: heliosTree }}
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
