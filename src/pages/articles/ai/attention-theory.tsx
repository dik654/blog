import Overview from "./attention-theory/Overview";
import Additive from "./attention-theory/Additive";
import Multiplicative from "./attention-theory/Multiplicative";
import SelfAttention from "./attention-theory/SelfAttention";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./attention-theory/codeRefs";
import { attentionTheoryTree } from "./attention-theory/fileTree";
import { RnnTrackLocator } from "./rnn/shared/RnnSeriesLocator";

export default function AttentionTheoryArticle() {
  const sidebar = useCodeSidebar();

  return (
    <div>
      <RnnTrackLocator current="attention" question="decoder가 고정된 마지막 state 하나 대신, 지금 필요한 source 위치를 매 시점 다시 고를 수 있을까요?" fixture="한 decoder query가 세 encoder state를 채점하고 softmax weight를 만든 뒤 weighted sum context를 구성하는 과정을 추적합니다." parentHref="/cs/ai/seq2seq#limitations" parentLabel="source 전체를 마지막 state 하나에 담는 Seq2Seq 병목" secondaryHref="/cs/ai/softmax" secondaryLabel="score를 합이 1인 weight로 바꾸는 softmax" />
      <Overview />
      <Additive />
      <Multiplicative />
      <SelfAttention onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ torch: attentionTheoryTree }}
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
