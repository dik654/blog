export const C = {
  bpe: '#0ea5e9',
  wp: '#10b981',
  pmi: '#6366f1',
  hash: '#f59e0b',
  bert: '#8b5cf6',
  muted: 'var(--muted-foreground)',
};

export const SCORE_STEPS = [
  {
    label: '① BPE 방식 -- 단순 빈도 기준',
    body: 'BPE: score(a, b) = freq(ab). 가장 많이 등장하는 쌍 우선 병합.\n"the"=10000, "of"=5000, "the of"=500 => BPE score = 500.\n"Hello"=100, "World"=100, "Hello World"=80 => BPE score = 80.\n빈도만 보면 "the of"가 우선 -- 흔하지만 의미 없는 조합.\n고빈도 기능어가 불필요하게 먼저 병합되는 문제.',
  },
  {
    label: '② WordPiece 방식 -- 우도(likelihood) 비율',
    body: 'WordPiece: score(a, b) = freq(ab) / (freq(a) * freq(b)).\n개별 빈도 대비 동시 출현이 높은 쌍을 우선 병합.\nPMI(Pointwise Mutual Information)와 수학적으로 동일한 구조.\n독립이면 0, 함께 자주 나오면 양수 -- 정보 이득이 큰 쌍 선택.\n결과: 의미 단위에 가까운 토큰을 우선 형성.',
  },
  {
    label: '③ 수치 비교 -- 같은 데이터, 다른 결과',
    body: 'BPE  score("the","of")     = 500 => 우선 병합.\nBPE  score("Hello","World") = 80  => 후순위.\nWP   score("the","of")     = 500/(10000*5000) = 1e-5 => 후순위.\nWP   score("Hello","World") = 80/(100*100)   = 8e-3 => 우선 병합.\n800배 차이: "Hello World"의 정보 밀도가 훨씬 높음.',
  },
];

export const HASH_STEPS = [
  {
    label: '① ## 접두사 규칙 -- 단어 경계 표시',
    body: '단어의 첫 토큰: 접두사 없음. 이후 조각: "##" 접두사 부착.\n"unhappiness" → ["un", "##happy", "##ness"]\n"transformer" → ["transform", "##er"]\n이 규칙으로 디코딩 시 원래 단어 경계를 정확히 복원.\nBPE의 </w>(단어 끝 표시)와 반대 방향 -- 정보는 동일.',
  },
  {
    label: '② 디코딩 알고리즘 -- ## 제거로 원문 복원',
    body: '##로 시작하면 앞 토큰에 직접 붙임 (공백 없이).\n## 없으면 공백 추가 후 붙임 => 단어 경계 자동 결정.\n"un" + "##happy" + "##ness" → "unhappiness"\n"transform" + "##er" → "transformer"\n역변환이 정확하므로 NER, 분류 등 위치 민감 태스크에 유리.',
  },
  {
    label: '③ BERT 어휘 크기와 모델 계보',
    body: 'bert-base-uncased: 30,522 (영어 단일).\nbert-base-multilingual: 119,547 (다국어).\nKoBERT: 8,002 (한국어 특화, 작은 vocab으로 효율적).\nDistilBERT, ALBERT, ELECTRA: WordPiece 유지.\nRoBERTa: byte-level BPE로 전환 -- GPT 방식 채택.',
  },
];
