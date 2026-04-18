export const C = {
  init: '#0ea5e9',
  freq: '#10b981',
  merge: '#f59e0b',
  byte: '#6366f1',
  gpt: '#8b5cf6',
  muted: 'var(--muted-foreground)',
};

export const TRAIN_STEPS = [
  {
    label: '① 초기화 -- 단어를 문자 시퀀스로 분해',
    body: '코퍼스의 모든 단어를 문자(또는 byte) 단위로 분해.\n"low" → ["l", "o", "w", "</w>"]. </w>는 단어 종료 표시.\n초기 어휘 = byte 단위 256개 + 종료 기호.\n이 상태에서 출발하여 반복 병합으로 어휘를 확장.\nword_freq: "low</w>"=5, "lower</w>"=2, ...',
  },
  {
    label: '② 인접 쌍 빈도 계산 -- 가장 빈번한 쌍 탐색',
    body: '전체 코퍼스에서 모든 인접 토큰 쌍의 출현 빈도를 카운트.\npair_freq: ("l","o")=7, ("o","w")=7, ("w","</w>")=5, ("e","r")=2.\n가장 높은 빈도를 가진 쌍을 병합 후보로 선택.\nargmax(pair_freq) = ("l","o") 또는 ("o","w") -- 빈도 동률 시 임의.\nBPE의 핵심: 단순 빈도 기반이라 구현이 간단.',
  },
  {
    label: '③ 병합 + 코퍼스 업데이트 -- 반복 수렴',
    body: '선택된 쌍을 하나의 토큰으로 합치고 어휘에 추가.\nmerges: [("l","o")] → vocab: {..., "lo"}\n코퍼스 전체에서 해당 쌍을 새 토큰으로 교체.\n["l","o","w","</w>"] → ["lo","w","</w>"]\nlen(vocab) == target_size가 될 때까지 2~3단계 반복.',
  },
  {
    label: '④ 추론(인코딩) -- merges 순서대로 적용',
    body: '새 단어가 들어오면 문자로 분해 후 학습된 merges 순서대로 적용.\n"lower" → ["l","o","w","e","r"] → ["lo","w","er"] → ["low","er"]\n더 이상 병합할 쌍이 없으면 종료, 결과를 vocab ID로 변환.\nNaive: O(|corpus| x vocab_size). Tiktoken: Rust 최적화.\nHugging Face tokenizers도 O(|unique pairs| log ...) 최적화.',
  },
];

export const BYTE_STEPS = [
  {
    label: '① 문제 인식 -- 유니코드 OOV와 복잡성',
    body: '문자 기반 BPE는 유니코드 처리가 복잡.\n이모지, 특수 문자, 신규 언어에서 OOV 발생.\n예: 아랍어, 태국어 등 비라틴 문자는 어휘에 없으면 [UNK].\nGPT-2(2019)가 이를 해결: 모든 텍스트를 UTF-8 바이트로 변환.\n초기 어휘 = 256개 바이트 + 병합 규칙.',
  },
  {
    label: '② Byte-level BPE -- UTF-8 바이트 기반 토큰화',
    body: '"안녕" → UTF-8: [0xEC, 0x95, 0x88, 0xEB, 0x85, 0x95] (6바이트)\n6개 바이트 토큰에서 시작해 BPE 병합으로 "안녕" 서브워드 학습.\n장점: OOV 완전 해결 (모든 바이트 표현 가능), 언어 독립적.\n이모지, 수식, 코드 등 어떤 문자열이든 분해 가능.\n단점: 비영어권은 바이트 단위 분할로 토큰 수 증가.',
  },
  {
    label: '③ GPT 시리즈 어휘 진화 -- 50K → 200K',
    body: 'GPT-2: ~50K vocab (byte-level BPE 최초 도입).\nGPT-3: ~50K (동일 토크나이저).\nGPT-4 (cl100k_base): ~100K vocab (다국어 확장).\nGPT-4o (o200k_base): ~200K vocab (한국어 토큰 수 ~40% 감소).\n어휘 확대 = 다국어 효율 개선, 비영어 비용 절감.',
  },
];
