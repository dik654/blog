import WordPieceViz from "./viz/WordPieceViz";

export default function WordPiece() {
  return (
    <section id="wordpiece" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        WordPiece는 학습법보다 encoding 계약을 먼저 확인한다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          WordPiece는 speech recognition에서 출발했고 BERT tokenizer로 널리
          알려졌습니다. BERT-style encoding은 먼저 공백·구두점 규칙으로 word의
          탐색 범위를 정한 뒤, 현재 cursor에서 시작하는 vocabulary 조각 가운데
          가장 긴 것을 고릅니다. 선택한 조각 뒤로 cursor를 옮기고 같은 과정을
          반복하기 때문에 이 절차를 longest-match-first 또는 maximum matching이라
          부릅니다.
        </p>
        <p>
          <code>##</code> prefix는 형태소 label이 아니라 “현재 word의 시작이
          아니다”라는 vocabulary 관례입니다. 예를 들어 <code>unhappiness</code>가
          <code>un · ##happy · ##ness</code>로 나뉘었다고 해서 세 조각이 언제나
          언어학적 형태소라는 뜻은 아닙니다. Vocabulary와 pre-tokenizer가 달라지면
          같은 문자열의 결과도 달라집니다.
        </p>
      </div>

      <WordPieceViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Greedy match가 실패했을 때의 정책도 model 입력의 일부다</h3>
        <p>
          남은 substring을 완전히 덮는 조각을 찾지 못하면 전통적인 BERT
          WordPiece는 word 전체를 <code>[UNK]</code>로 바꿀 수 있습니다. 앞부분에서
          찾은 조각만 남기고 뒤를 버리는 방식이 아닙니다. 따라서 byte fallback을
          가진 tokenizer와 coverage 성질이 다르며, vocabulary에 없는 글자·emoji·
          오타·혼합 script를 실제로 넣어 확인해야 합니다.
        </p>
        <h3>Vocabulary training과 빠른 encoding은 서로 다른 문제다</h3>
        <p>
          WordPiece vocabulary의 원 학습 절차는 현대 BPE의 merge file처럼 하나의
          공개 규격으로 완전히 고정되어 있지 않습니다. 자주 소개되는
          <code>count(ab)/(count(a)·count(b))</code> score는 pair의 결합 정도를
          설명하는 직관에는 유용하지만 모든 trainer가 따라야 하는 공식은
          아닙니다. 반면 이미 만들어진 vocabulary를 longest-match-first로 읽는
          절차는 trie와 failure link를 사용해 입력 길이에 선형인 탐색으로 구현할
          수 있습니다. 재현할 때에는 알고리즘 이름만 적지 말고 trainer와 library
          version, normalizer, pre-tokenizer, vocabulary artifact를 함께 남겨야 합니다.
        </p>
      </div>

      <div
        id="paper-fast-wordpiece"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">논문 읽기 · Encoding algorithm</p>
        <p className="mt-2 text-sm font-semibold">Fast WordPiece Tokenization</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          이 논문의 핵심은 WordPiece vocabulary를 새로 학습하는 score가 아니라,
          이미 주어진 vocabulary로 maximum matching을 수행하는 비용을 trie와
          Aho–Corasick식 failure link로 선형화한 것입니다. 따라서 논문의 속도
          결론을 WordPiece training recipe의 표준화로 확대해 읽으면 안 됩니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
          href="https://aclanthology.org/2021.emnlp-main.160/"
          target="_blank"
          rel="noreferrer"
        >
          논문의 문제 정의와 complexity 비교 보기
        </a>
      </div>
    </section>
  );
}
