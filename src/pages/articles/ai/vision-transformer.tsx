import Overview from "./vision-transformer/Overview";
import PatchEmbedding from "./vision-transformer/PatchEmbedding";
import Architecture from "./vision-transformer/Architecture";
import Tradeoff from "./vision-transformer/Tradeoff";
import Practice from "./vision-transformer/Practice";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./vision-transformer/codeRefs";
import { visionTransformerTree } from "./vision-transformer/fileTree";

export default function VisionTransformerArticle() {
  const sidebar = useCodeSidebar();

  return (
    <div className="space-y-12">
      <Overview />
      <PatchEmbedding onCodeRef={sidebar.open} />
      <Architecture />
      <Tradeoff />
      <Practice />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ torchvision: visionTransformerTree }}
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
