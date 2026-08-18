import Overview from "./resnet/Overview";
import SkipConnection from "./resnet/SkipConnection";
import Architecture from "./resnet/Architecture";
import Impact from "./resnet/Impact";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./resnet/codeRefs";
import { resnetTree } from "./resnet/fileTree";

export default function ResNetArticle() {
  const sidebar = useCodeSidebar();

  return (
    <div className="space-y-12">
      <Overview />
      <SkipConnection />
      <Architecture onCodeRef={sidebar.open} />
      <Impact />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ torchvision: resnetTree }}
        projectMetas={{
          torchvision: {
            id: "torchvision",
            label: "torchvision · Python",
            badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
          },
        }}
      />
    </div>
  );
}
