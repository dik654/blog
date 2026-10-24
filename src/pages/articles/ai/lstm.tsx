import Overview from "./lstm/Overview";
import Gates from "./lstm/Gates";
import CellState from "./lstm/CellState";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./lstm/codeRefs";
import { lstmTree } from "./lstm/fileTree";
import { RnnTrackLocator } from "./rnn/shared/RnnSeriesLocator";

export default function LSTMArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <RnnTrackLocator current="gates" question="반복 곱으로 약해지는 기억 경로를 gate가 어떻게 보존·기록·공개 경로로 나눌까요?" fixture="Cprev=2, f=.5, i=.75, g=.5, o=.5인 한 channel에서 C=1.375와 h≈.44를 계산하고 forget gate 누적이 gradient에 남는 범위를 확인합니다." parentHref="/cs/ai/bptt#bptt" parentLabel="시간축 Jacobian product가 학습 신호를 바꾸는 BPTT" secondaryHref="/cs/ai/rnn#overview" secondaryLabel="하나의 hidden state를 반복 갱신하는 vanilla RNN" />
      <Overview />
      <Gates onCodeRef={sidebar.open} />
      <CellState />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ torch: lstmTree }}
        projectMetas={{
          torch: {
            id: "torch",
            label: "PyTorch · Python",
            badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
          },
        }}
      />
    </>
  );
}
