import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '1. 단일 파일, 시간역순 prepend',
    body: 'knowledge/changelog.md 한 파일.\n새 엔트리는 항상 파일 맨 위에 prepend — 최신이 먼저 보인다.\n오래된 엔트리는 자연스럽게 아래로 밀린다.\n조회 시 "최근 며칠"을 즉시 볼 수 있고, 아래로 스크롤하며 과거로 탐색한다.',
  },
  {
    label: '2. 월별 섹션으로 시간 앵커',
    body: '## 2026-04 같은 월별 헤딩으로 큰 앵커를 잡는다.\n"2주 전" 같은 상대 시간을 월 섹션으로 변환하면 scanning이 쉽다.\n월별 섹션 안에서만 날짜 세부는 ## 2026-04-15 sub-heading.\n엔트리는 그 아래 ### 제목으로.',
  },
  {
    label: '3. 엔트리 포맷 — 제목 + 요약 + 링크',
    body: '한 엔트리는 3~5줄이 목표.\n### 제목 — 무엇이 변했는가 한 문장\n본문 1~2 문장 — 왜 바꿨는가 / 무엇을 배웠는가\n- 링크: ADR, Lessons, 커밋, 관련 이슈\n본문이 3줄을 넘으면 ADR 또는 Lessons로 내용을 빼낸다.',
  },
  {
    label: '4. 좋은 엔트리 vs 나쁜 엔트리',
    body: '나쁨: "routing 수정" (무엇을 왜 고쳤는지 없음)\n좋음: "Router fallback 순서 뒤집음 — primary 실패 시 Haiku보다 Qwen이 먼저"\n이유 한 문장 + 대안 / 제약 / 링크로 맥락을 고정한다.\n"왜"는 남기고, "어떻게"는 커밋 diff에 맡긴다.',
  },
  {
    label: '5. 작업 완료 직후 1분 루틴',
    body: '코드 변경 완료 → 커밋 → 브라우저에서 changelog.md 열고 1분 타이머.\n제목 1줄 + 요약 1~2문장 + 링크 prepend.\n1분 안에 안 끝나면 본문 내용이 너무 길다는 신호 → 링크로 빼낸다.\n"다음에 써야지"는 "안 쓴다"의 동의어 — 그 순간이 유일한 유지 타이밍이다.',
  },
  {
    label: '6. git hook으로 강제 리마인더',
    body: 'post-commit hook에서 마지막 changelog.md 수정일과 오늘을 비교.\n커밋은 있는데 changelog 업데이트 없으면 터미널에 경고.\n강제는 아님 — 점진적 습관화가 목표.\n또는 커밋 메시지에 [log] 태그가 있으면 changelog 자동 prepend.',
  },
  {
    label: '7. 월별 아카이브 split — 6개월 후',
    body: '6개월이 지나면 changelog.md가 수백 줄로 부푼다.\n이전 월을 archive/changelog-2026-04.md 로 분리한다.\n메인 파일은 현재 월 + 이전 1~2개월만 유지.\nsplit 시점을 월 1회 수동 작업으로 고정 — 자동화하려다 오히려 깨진다.',
  },
  {
    label: '8. 유지 실패의 전형 — 그리고 회복',
    body: '가장 흔한 실패: 2주 쌓였다가 한 번에 쓰려고 하면 기억이 흐려져 포기.\n회복 전략: "지금부터만" — 과거를 메꾸려 하지 말고 오늘부터 새로 시작.\n빠진 기간은 과거일 뿐, 다시 쌓이면 된다.\n완벽주의가 changelog의 가장 큰 적이다.',
  },
];

export const GOOD_VS_BAD = [
  {
    bad: 'routing 수정',
    good: 'Router fallback 순서 뒤집음 — primary 실패 시 Haiku보다 Qwen이 먼저',
    why: '무엇/왜/대상이 한 문장에 있는가',
  },
  {
    bad: 'fix',
    good: 'memory sandwich에서 ops 재적용 시 순서 보존 — idempotent 보장',
    why: '구체 대상과 보장이 명시',
  },
  {
    bad: 'prompt tuning',
    good: 'Analyst prompt에 few-shot 2개 추가 — JSON schema 위반률 30%→5%',
    why: '수치 지표로 효과 기록',
  },
];

export const FILE_STRUCTURE = [
  { line: '# Changelog', kind: 'title' },
  { line: '', kind: 'blank' },
  { line: '## 2026-04', kind: 'month' },
  { line: '', kind: 'blank' },
  { line: '### 2026-04-16', kind: 'date' },
  { line: '', kind: 'blank' },
  { line: '#### Router fallback 순서 뒤집음', kind: 'entry' },
  { line: 'Primary 실패 시 Haiku보다 Qwen이 먼저 호출되도록...', kind: 'body' },
  { line: '- 결정: [adr/004-router-fallback.md]', kind: 'link' },
  { line: '', kind: 'blank' },
  { line: '### 2026-04-15', kind: 'date' },
  { line: '...', kind: 'body' },
];
