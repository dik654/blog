import Variants from "./lstm/Variants";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./gru/codeRefs";
import { gruTree } from "./gru/fileTree";
import { RnnTrackLocator } from "./rnn/shared/RnnSeriesLocator";

export default function GRUArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <RnnTrackLocator current="gates" question="cell state를 따로 두지 않고 reset과 update 두 gate로 하나의 hidden state를 어떻게 갱신할까요?" fixture="hprev=(2,−1)에 reset mask (0,.5)를 적용해 candidate용 history를 만든 뒤, z=.25일 때 기존 state와 candidate를 보간합니다." parentHref="/cs/ai/rnn#overview" parentLabel="현재 입력과 직전 hidden을 합치는 recurrent transition" secondaryHref="/cs/ai/lstm" secondaryLabel="cell state와 세 gate로 경로를 나눈 LSTM" />
      <section id="overview" className="scroll-mt-20 space-y-4">
        <p className="text-sm font-semibold text-primary">One gate at a time</p>
        <h2 className="text-3xl font-bold tracking-tight">
          Reset으로 candidate를 만들고 update로 기존 state와 섞는다
        </h2>
        <p className="text-lg leading-8 text-foreground/90">
          네 줄짜리 GRU 식을 한 번에 제시하지 않습니다. reset gate가 과거를 거르는
          위치, candidate의 형태, update gate가 두 state를 보간하는 이유를 각각 본 뒤
          마지막에 하나의 recurrent transition으로 조합합니다.
        </p>
      </section>
      <Variants onCodeRef={sidebar.open} codeRefs={codeRefs} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ torch: gruTree }}
        projectMetas={{
          torch: {
            id: "torch",
            label: "PyTorch · Python",
            badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
          },
        }}
      />
    </article>
  );
}
