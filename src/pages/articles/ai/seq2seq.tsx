import Overview from "./seq2seq/Overview";
import Encoder from "./seq2seq/Encoder";
import Decoder from "./seq2seq/Decoder";
import Training from "./seq2seq/Training";
import Limitations from "./seq2seq/Limitations";
import { CodeSidebar, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./seq2seq/codeRefs";
import { seq2seqTree } from "./seq2seq/fileTree";
import { RnnTrackLocator } from "./rnn/shared/RnnSeriesLocator";

export default function Seq2SeqArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <RnnTrackLocator current="seq2seq" question="길이가 다른 source sequence를 조건으로 target sequence를 어떻게 한 token씩 생성할까요?" fixture="source를 encoder state로 압축하고, decoder가 BOS에서 시작해 이전 정답 또는 이전 예측을 입력으로 받는 한 번의 번역 흐름을 끝까지 추적합니다." parentHref="/cs/ai/rnn-language-model#language-model" parentLabel="recurrent state에서 다음 token distribution을 만드는 언어 모델" secondaryHref="/cs/ai/lstm" secondaryLabel="encoder와 decoder가 넘겨받는 LSTM state" />
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
