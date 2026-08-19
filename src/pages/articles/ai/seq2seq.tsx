import Overview from "./seq2seq/Overview";
import Encoder from "./seq2seq/Encoder";
import Decoder from "./seq2seq/Decoder";
import Training from "./seq2seq/Training";
import Limitations from "./seq2seq/Limitations";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./seq2seq/codeRefs";
import { seq2seqTree } from "./seq2seq/fileTree";

export default function Seq2SeqArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview />
      <Encoder onCodeRef={sidebar.open} />
      <Decoder onCodeRef={sidebar.open} />
      <Training onCodeRef={sidebar.open} />
      <Limitations />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ "pytorch-tutorials": seq2seqTree }}
        projectMetas={{
          "pytorch-tutorials": {
            id: "pytorch-tutorials",
            label: "PyTorch tutorials · Python",
            badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
          },
        }}
      />
    </>
  );
}
