import { Link } from "react-router-dom";

export default function Applications() {
  return (
    <section id="applications" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Tokenizer는 이 text contract 위에서 vocabulary ID를 선택한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          이제 “한글 한 글자가 여러 token이다”라는 현상을 언어 이름만으로 설명하지 않아도 됩니다. grapheme→code point→UTF-8 byte→subword merge의
          어느 단계에서 길이가 생겼는지 추적할 수 있습니다. Normalizer가 text를 바꿨다면 byte 수와 offset도 그 뒤에 다시 계산해야 합니다.
        </p>
        <p>
          다음 <Link to="/ai/tokenizer">Tokenizer 글</Link>에서는 이 text를 normalization·pre-tokenization·subword model·post-processing 단계로 넘기고, BPE·WordPiece·Unigram이 vocabulary와 segmentation을 만드는 방법을 비교합니다.
        </p>
      </div>
    </section>
  );
}
