import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '1. 개인 에이전트 개발은 "문제 → 수정"의 끝없는 흐름',
    body: 'agent harness, tool system, routing, memory, prompt — 모든 계층에서 끊임없이 이슈가 발생한다.\n해결하고 나면 금방 잊힌다. 3주 뒤 같은 증상이 다시 나타나도 "어? 저번에 어떻게 고쳤지?"\ngit log에는 "fix" 라는 단어만 남고, 왜 그렇게 고쳤는지는 사라진다.\n개인 프로젝트라 PR 리뷰도 없고, 다른 사람의 기억에 분산해둘 수도 없다.',
  },
  {
    label: '2. git log는 "무엇을"만 기록한다',
    body: 'commit message는 "무엇이 바뀌었는가"를 적는다.\n커밋 단위가 너무 잘게 쪼개져 있거나, 너무 굵게 묶여 있으면 맥락이 사라진다.\n특히 "왜 이 접근을 고르고 다른 접근을 버렸는가"는 거의 안 남는다.\n대안을 탐색한 흔적, 실패한 시도, 뒤집은 결정은 git log에서 찾기 어렵다.',
  },
  {
    label: '3. 세 가지 다른 조회 질문이 있다',
    body: '시간 축 — "2주 전에 xx 이슈 있었던 것 같은데, 언제였지?"\n원칙 축 — "비슷한 상황에서 어느 접근을 택해야 하지?"\n결정 축 — "이 아키텍처를 왜 이렇게 짰지? 다시 바꿔도 되나?"\n한 파일이 이 셋을 모두 감당하려 하면 어느 쪽도 제대로 못 한다.',
  },
  {
    label: '4. 세 층으로 분리 — Changelog · ADR · Lessons',
    body: 'Changelog — 시간역순 단일 파일. "언제 무슨 일" 한 줄 요약.\nADR (Architecture Decision Record) — 결정마다 개별 파일. context / decision / consequences.\nLessons — 주제별 원칙 파일. "어느 상황에서 어느 판단을 해야 하는가".\n각 층이 다른 조회 질문을 담당한다.',
  },
  {
    label: '5. 조회 흐름 — 질문이 층을 지정한다',
    body: '"언제였지?" → Changelog 에서 시간 축 스캔 → 필요하면 엔트리 안 링크로 ADR / Lessons 로 점프.\n"왜 이렇게?" → ADR 에서 결정 번호 검색.\n"어떻게 판단?" → Lessons 에서 주제로 검색.\n세 층은 서로 링크로 연결돼 네트워크를 이룬다.',
  },
  {
    label: '6. 유지 비용 — 엔트리 한 개 3~5줄',
    body: 'Changelog: 매 작업 끝에 1분. 한 엔트리 = 3~5줄.\nADR: 중요 결정에만. 한 달에 1~3개. 각 파일 10~20줄.\nLessons: 교훈이 명확해졌을 때만. 주제 단위로 수렴.\n모두 "짧게 자주"가 원칙이다 — 길게 쓰려는 순간 유지가 깨진다.',
  },
  {
    label: '7. 이 글의 구성',
    body: '다음 4개 섹션에서 각 층을 하나씩 뜯어본다.\nChangelog 섹션 — 포맷, 엔트리 규칙, 시간역순 prepend 흐름.\nADR 섹션 — 템플릿, 언제 ADR 로 분리하는가, 번호 매기기.\nLessons 섹션 — 주제별 수렴, "원칙"과 "레시피"의 차이.\n마지막 섹션 — 세 층의 분담 + 월별 아카이브 + git hook 자동화.',
  },
];

export const LAYERS = [
  {
    id: 'changelog', name: 'Changelog', color: '#3b82f6',
    q: '언제 무슨 일?', struct: '시간역순 단일 파일', unit: '한 엔트리 3~5줄',
  },
  {
    id: 'adr', name: 'ADR', color: '#a855f7',
    q: '왜 이렇게?', struct: '결정마다 개별 파일', unit: 'context / decision / consequences',
  },
  {
    id: 'lessons', name: 'Lessons', color: '#10b981',
    q: '어떻게 판단?', struct: '주제별 원칙 파일', unit: '규칙 + 이유 + 적용',
  },
];

export const QUESTIONS = [
  { q: '2주 전에 그 버그 언제였지?', target: 'changelog' },
  { q: '이 구조 왜 이렇게 짰지?', target: 'adr' },
  { q: '비슷한 상황, 어느 쪽을 택해야?', target: 'lessons' },
  { q: '이 결정 뒤집어도 되나?', target: 'adr' },
  { q: '최근 3일 주요 변경?', target: 'changelog' },
  { q: 'LLM-as-judge 원칙?', target: 'lessons' },
];
