import Overview from "./vae/Overview";
import AEvsVAE from "./vae/AEvsVAE";
import ReparamTrick from "./vae/ReparamTrick";
import VAELoss from "./vae/VAELoss";
import Training from "./vae/Training";
import Applications from "./vae/Applications";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./vae/codeRefs";
import { vaeTree } from "./vae/fileTree";

export default function VAEArticle() {
  const sidebar = useCodeSidebar();

  return (
    <div className="space-y-12">
      <Overview />
      <AEvsVAE />
      <ReparamTrick />
      <VAELoss />
      <Training onCodeRef={sidebar.open} />
      <Applications />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ "pytorch-examples": vaeTree }}
        projectMetas={{
          "pytorch-examples": {
            id: "pytorch-examples",
            label: "PyTorch examples · Python",
            badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
          },
        }}
      />
    </div>
  );
}
