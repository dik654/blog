import Overview from "./transformer-architecture/Overview";
import DataPrep from "./transformer-architecture/DataPrep";
import InputEmbedding from "./transformer-architecture/InputEmbedding";
import QKVComputation from "./transformer-architecture/QKVComputation";
import FeedForward from "./transformer-architecture/FeedForward";
import LinearSoftmax from "./transformer-architecture/LinearSoftmax";
import Training from "./transformer-architecture/Training";
import ScalingLaws from "./transformer-architecture/ScalingLaws";
import Summary from "./transformer-architecture/Summary";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./transformer-architecture/codeRefs";
import { transformerArchitectureTree } from "./transformer-architecture/fileTree";

export default function TransformerArchitecture() {
  const sidebar = useCodeSidebar();

  return (
    <div className="space-y-12">
      <Overview />
      <DataPrep />
      <InputEmbedding />
      <QKVComputation onCodeRef={sidebar.open} />
      <FeedForward />
      <LinearSoftmax />
      <Training />
      <ScalingLaws />
      <Summary onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ torch: transformerArchitectureTree }}
        projectMetas={{
          torch: {
            id: "torch",
            label: "PyTorch · Python",
            badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
          },
        }}
      />
    </div>
  );
}
