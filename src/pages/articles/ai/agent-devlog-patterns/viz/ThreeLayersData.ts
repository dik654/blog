import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '1. 세 층은 링크로 네트워크를 이룬다',
    body: 'Changelog 엔트리가 ADR과 Lessons로 링크한다.\nADR이 관련 Lessons를 참조한다.\nLessons가 구체 사례로 Changelog를 가리킨다.\n질문이 진입점을 결정하고, 링크를 따라 다른 층으로 점프한다.',
  },
  {
    label: '2. 사건의 생애 — Changelog → Lessons → (ADR)',
    body: '사건 발생 → Changelog에 한 줄 prepend. (필수)\n원칙 추출 가능 → 기존 Lessons 파일 업데이트. (선택)\n구조 결정이 필요 → ADR 하나 생성. (드묾)\n사건의 99%는 Changelog에서 끝난다. 10%가 Lessons로 간다. 1%가 ADR로 승격된다.',
  },
  {
    label: '3. 조회 경로 — 질문이 층을 지정한다',
    body: '"최근 며칠 뭐 했지?" → Changelog 맨 위 스캔.\n"memory 설계 원칙?" → lessons/agent-routing/agent-memory-architecture.md 직접.\n"왜 multi-file로 바꿨지?" → lessons/decisions/005-memory-b-multifile.md 직접.\n각 층이 서로 링크하므로 한 번 들어가면 필요한 곳으로 점프 가능.',
  },
  {
    label: '4. 새 프로젝트 세팅 — 5분이면 끝',
    body: 'mkdir -p knowledge/lessons/decisions\ntouch knowledge/changelog.md\nchangelog.md에 "# Changelog" + "## YYYY-MM" 헤딩 하나.\n첫 ADR: 001-dev-journaling-pattern.md (이 구조 자체 기록).\n첫 Lessons 디렉토리: 프로젝트 핵심 주제 2~3개.\n그게 끝이다. 나머지는 쓰면서 유기적으로 자란다.',
  },
  {
    label: '5. 유지의 적 — 완벽주의와 과도한 구조화',
    body: '빈 파일 10개 만들어 놓고 "채워야 하는데" → 채우지 않아서 죄책감.\n구조가 복잡할수록 "어디에 써야 하지?" 고민 시간이 늘어남.\n3층이면 충분하다. 4층, 5층으로 나누지 말 것.\n빈 디렉토리는 만들지 않는다 — 필요한 시점에 만든다.',
  },
  {
    label: '6. 팀 vs 개인 — 다른 점 한 가지',
    body: '개인 프로젝트: 모든 기록의 독자는 "미래의 나" 하나뿐이다.\n팀: ADR과 Lessons에 "왜"를 더 상세히 써야 한다 — 맥락을 공유하지 않는 팀원이 읽는다.\nChangelog는 개인이든 팀이든 같은 형식 — 시간 축 인덱스는 보편.\n이 글의 예시는 개인 프로젝트(context-manager) 기준이다.',
  },
  {
    label: '7. 최종 정리 — 한 줄짜리 규칙 모음',
    body: '• Changelog: 매 작업 끝에 1분, 3~5줄 prepend.\n• ADR: "6개월 뒤에도 배경이 필요한가?" 만 승격.\n• Lessons: 두 번째 유사 사건은 새 파일 X, 기존 파일 업데이트.\n• 링크: 엔트리마다 관련 층 파일 경로를 명시.\n• 유지: "짧게 자주" — 길게 쓰려는 순간 유지가 깨진다.',
  },
];

export const LIFECYCLE = [
  { phase: '사건 발생', pct: 100, layers: ['changelog'], color: '#3b82f6' },
  { phase: '원칙 추출', pct: 12, layers: ['changelog', 'lessons'], color: '#a855f7' },
  { phase: '구조 결정', pct: 2, layers: ['changelog', 'lessons', 'adr'], color: '#ef4444' },
];

export const SETUP_STEPS = [
  { cmd: 'mkdir -p knowledge/lessons/decisions', desc: '디렉토리 생성' },
  { cmd: 'touch knowledge/changelog.md', desc: '빈 changelog' },
  { cmd: '## YYYY-MM 헤딩 추가', desc: '첫 월 섹션' },
  { cmd: '001-dev-journaling-pattern.md 작성', desc: '첫 ADR (이 구조 자체)' },
  { cmd: '핵심 주제 디렉토리 2~3개', desc: '프로젝트 메인 관심사만' },
];

export const RULES_SUMMARY = [
  { layer: 'Changelog', rule: '매 작업 끝 1분, 3~5줄 prepend', color: '#3b82f6' },
  { layer: 'ADR', rule: '"6개월 뒤에도 배경 필요?" 만 승격', color: '#a855f7' },
  { layer: 'Lessons', rule: '두 번째 유사 사건 → 기존 파일 업데이트', color: '#10b981' },
  { layer: '링크', rule: '엔트리마다 관련 층 파일 경로 명시', color: '#f59e0b' },
  { layer: '유지', rule: '"짧게 자주" — 길게 쓰려면 다른 층으로', color: '#ef4444' },
];
