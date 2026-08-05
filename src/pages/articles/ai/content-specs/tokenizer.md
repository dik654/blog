# Tokenizer 재구성 명세

## 소유 질문

문자열을 어떤 ID sequence로 바꾸어야 정보 손실, vocabulary 파라미터, sequence 계산량을 함께 통제할 수 있는가?

## 경로 계약

- 이전 입력: 딥러닝 학습 루프의 embedding lookup과 cross-entropy.
- 이 글의 출력: 정규화 정책, token boundary, vocabulary, special-token contract가 고정된 ID sequence.
- 다음 글: 같은 ID가 어떤 context와 함께 등장하는지 세는 분포 의미론.
- 최소 역사선: Unicode normalization·grapheme과 subword 학습. 형태소 분석 전체 역사는 기본 경로 밖에 둔다.

## 비공개 전이 문제

한국어·전각 문자·ZWJ emoji·C++ code가 섞인 입력을 처리하는 32k와 128k tokenizer 후보가 있다. Hidden size는 4096, bf16이고 input/output embedding은 tied 또는 untied다. 교육용 평가 문자열은 공백 기준 4개 단어·UTF-8 42 byte이며, subword 후보는 이를 14 token으로 만든다.

본문만으로 다음을 판단할 수 있어야 한다.

1. NFC와 NFKC가 각각 보존하거나 바꾸는 정보의 경계를 설명한다.
2. Code point, grapheme cluster, UTF-8 byte와 model token 수가 왜 다른지 검산한다.
3. 32k→128k에서 tied vocabulary matrix가 0.25 GiB→1.00 GiB가 되는지 계산한다.
4. 42/14의 sequence 증가가 full-attention score matrix를 9배로 키울 수 있음을 계산하되 전체 LLM 비용과 같다고 오해하지 않는다.
5. BPE training과 learned merge 적용, WordPiece의 공개 runtime과 추정 training recipe, Unigram의 segmentation likelihood를 구분한다.
6. Input byte round-trip과 임의 token generation의 UTF-8 validity가 다른 문제임을 안다.

## 섹션과 Viz

### 1. 계산 단위와 vocabulary budget

- Text→boundary/vocabulary→ID flow.
- Vocabulary 32k/64k/128k와 tied/untied를 바꾸는 interactive budget.
- `P_vocab=|V|d+1_untied|V|d`, bf16 bytes를 표시한다.

### 2. Unicode와 byte fallback

- 같은 입력에서 normalization, grapheme, code point, byte를 동시에 표시한다.
- Subword 표시는 학습된 실제 tokenizer가 아닌 경계 교육용 heuristic임을 화면에 고정한다.
- 정규화 뒤 round-trip은 원문이 아니라 명시된 정규화 결과를 기준으로 한다.

### 3. BPE

- Corpus에서 merge rank를 학습하는 단계와 새 문자열에 rank를 적용하는 단계를 분리한다.
- `argmax count(a,b)`는 학습 시 한 단계의 선택임을 표시한다.

### 4. WordPiece·Unigram·SentencePiece

- WordPiece runtime longest-match-first는 근거가 명확하다.
- Google의 원 training implementation은 공개되지 않았으므로 pair score는 공개 문헌에 기반한 재구성으로 표기한다.
- Unigram은 가능한 segmentation 경로의 log probability를 합해 고른다.
- SentencePiece는 BPE와 경쟁하는 목적 함수가 아니라 raw-text trainer/runtime다.

### 5. 평가

- Fertility, unknown, normalized round-trip, code·language slice를 분리한다.
- 같은 문자열의 14→42 token이 full attention에서 만드는 상대 score-cell 수를 계산한다.
- Tokenizer와 model weight, special-token policy를 하나의 versioned artifact로 다룬다.

## 출처 경계

- Unicode UAX #15: normalization.
- Unicode UAX #29: extended grapheme cluster.
- Sennrich et al. 2016: NMT subword BPE.
- SentencePiece paper/repository: raw sentence와 BPE·Unigram.
- Fast WordPiece 및 Hugging Face 공개 설명: runtime longest match와 training reconstruction caveat.
- OpenAI tiktoken repository: byte BPE round-trip과 decode validity 경계.

## 검증

- 390·1440px에서 formula scale 0.8 이상, inner scroll·clipping 없음.
- 입력, normalization, mode, vocabulary, tying, evaluation strategy를 실제로 전환한다.
- Raw LaTeX와 비한글 FormulaNote가 없다.
