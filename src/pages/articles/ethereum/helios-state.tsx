import Overview from "./helios-state/Overview";
import ProofTrace from "./helios-state/ProofTrace";
import MptTraversal from "./helios-state/MptTraversal";
import ProofDB from "./helios-state/ProofDB";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./helios-state/codeRefs";
import { heliosTree } from "./helios-state/fileTrees";
import HeliosLocator, { HeliosMapReturn } from "./helios/HeliosLocator";

export default function HeliosStateArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <HeliosLocator current="helios-state" />
      <Overview onCodeRef={sidebar.open} />
      <ProofTrace
        title="RPC 응답이 검증된 Account가 되는 순서"
        onCodeRef={sidebar.open}
      />
      <MptTraversal
        title="MPT proof가 root·key·value를 묶는 방법"
        onCodeRef={sidebar.open}
      />
      <ProofDB title="검증 결과의 유효 범위와 실패 경계" onCodeRef={sidebar.open} />
      <HeliosMapReturn current="helios-state" />
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
