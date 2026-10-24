import Overview from "./tokenizer/Overview";
import BPE from "./tokenizer/BPE";
import WordPiece from "./tokenizer/WordPiece";
import SentencePiece from "./tokenizer/SentencePiece";
import Comparison from "./tokenizer/Comparison";
import { NlpFoundationLocator, NlpMapReturn } from "./shared/NlpFoundationLocator";

export default function TokenizerArticle() {
  return (
    <div>
      <NlpFoundationLocator
        current="tokenizer"
        question="화면의 문자열이 어떤 규칙을 거쳐 model이 읽는 ID가 되고, 그 ID는 왜 checkpoint와 함께 움직여야 할까요?"
        fixture="‘Ａ각!’을 NFKC → 구두점 분리 → vocabulary lookup → BOS·EOS 순서로 바꾸어 [1,10,20,30,2]까지 추적합니다."
        parentHref="/cs/ai/text-unicode-encoding"
        parentLabel="문자·Unicode·UTF-8의 서로 다른 좌표"
        secondaryHref="/cs/ai/neural-network"
        secondaryLabel="벡터를 층 계산에 넣는 신경망 기초"
      />
      <Overview />
      <BPE />
      <WordPiece />
      <SentencePiece />
      <Comparison />
      <NlpMapReturn
        title="Tokenizer는 문자열 분할기 하나가 아니라, 정규화부터 embedding row까지 이어지는 versioned input contract입니다."
        detail="이제 고정된 token sequence를 corpus에서 함께 나타난 횟수로 세면 분포 의미론으로, sequence 계산에 넣으면 RNN과 Transformer로 이어집니다."
        nextHref="/cs/ai/distributional-semantics"
        nextLabel="분포 의미론으로 이어가기"
      />
    </div>
  );
}
