import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '1. ADR 란 — "결정"을 1등 시민으로',
    body: 'Architecture Decision Record.\n특정 시점에 "어느 길로 갈지"를 선택한 결정을 그 자체로 기록한다.\ncontext(왜 결정이 필요했는가) / decision(무엇을 골랐는가) / consequences(얻은 것·잃은 것).\nCode의 diff로는 못 남는 "탐색한 대안"이 여기에 들어간다.',
  },
  {
    label: '2. 언제 ADR로 승격시키는가 — 높은 문턱',
    body: '모든 결정을 ADR로 만들면 30개가 넘어가면서 오히려 못 찾게 된다.\n승격 기준: "6개월 뒤의 내가 이 결정의 배경을 이해할 수 있을까?"\n뒤집기 어려운 구조적 결정만 올린다 — "memory를 단일 JSON에서 multi-file로" 같은.\nbug fix나 prompt tuning은 Changelog에 남긴다.',
  },
  {
    label: '3. 파일 구조 — 번호 + 짧은 slug',
    body: 'lessons/decisions/NNN-short-slug.md 형식.\n001부터 순차 번호. 한번 매긴 번호는 재사용하지 않는다 — 결정이 폐기돼도 번호는 "superseded"로 남는다.\nslug는 제목의 핵심만. "001-dev-journaling-pattern.md", "002-memory-sandwich.md".\n번호로 정렬하면 결정의 연대기가 자연스럽게 나온다.',
  },
  {
    label: '4. 템플릿 — frontmatter + 4섹션',
    body: 'YAML frontmatter: id / title / status / date.\n본문 4섹션: Context / Alternatives Considered / Decision / Consequences.\nConsequences는 Pro / Con / Mitigations로 더 쪼갠다 — trade-off를 명시하는 게 핵심.\n마지막에 Rule — "이 결정에서 파생되는 반복 가능한 규칙" 한두 줄.',
  },
  {
    label: '5. 실제 예시 — 001-dev-journaling-pattern.md',
    body: 'context-manager 프로젝트의 ADR #001 은 이 글의 3층 구조 자체를 기록한다.\n"git log만으로 부족하다 → changelog + lessons + decisions 3층".\n대안: Keep-a-Changelog 단일 파일, ADR 만, Devlog 프리폼.\n각 대안의 한계와 왜 3층인지 결정 근거를 명시.',
  },
  {
    label: '6. 결정을 뒤집을 때 — superseded',
    body: '시간이 지나면 결정이 틀렸을 수 있다. 이때 원본 파일을 지우지 않는다.\nstatus: accepted → superseded by 005 로 바꾼다.\n새 결정에는 "supersedes 001"을 명시.\n두 결정이 파일로 공존하므로 "언제 왜 생각이 바뀌었는가"가 보존된다.',
  },
  {
    label: '7. ADR vs Lessons — 분리 기준',
    body: 'ADR: 특정 시점의 선택. "지금 이걸 고른다."\nLessons: 반복 가능한 원칙. "이런 상황에서는 이렇게 판단한다."\n같은 주제라도 ADR은 unique(한 번만), Lessons는 주제에 수렴(계속 업데이트).\nMemory B wipeout → 이 개별 사건은 changelog. 원인-대응 일반화는 lessons/agent-routing/*.md. 구조 선택이 필요했으면 ADR 하나 추가.',
  },
];

export const ADR_FIELDS = [
  { name: 'id', desc: '001, 002, ... 순차 번호', color: '#3b82f6' },
  { name: 'title', desc: '한 문장 결정 요약', color: '#3b82f6' },
  { name: 'status', desc: 'proposed / accepted / superseded', color: '#a855f7' },
  { name: 'date', desc: '결정 확정 시점', color: '#a855f7' },
];

export const ADR_SECTIONS = [
  { name: 'Context', desc: '결정이 필요해진 배경과 제약' },
  { name: 'Alternatives', desc: '검토한 대안들과 각각의 한계' },
  { name: 'Decision', desc: '선택한 접근과 명확한 이유' },
  { name: 'Consequences', desc: 'Pro / Con / Mitigations 분해' },
  { name: 'Rule', desc: '이 결정에서 파생되는 반복 규칙' },
];

export const ADR_VS_OTHER = [
  { item: 'Bug fix', target: 'Changelog', color: '#3b82f6' },
  { item: 'Prompt tuning', target: 'Changelog', color: '#3b82f6' },
  { item: '단일 JSON → multi-file', target: 'ADR', color: '#a855f7' },
  { item: 'Gateway vs direct API', target: 'ADR', color: '#a855f7' },
  { item: '언제 LLM-as-judge?', target: 'Lessons', color: '#10b981' },
  { item: 'negative few-shot 규칙', target: 'Lessons', color: '#10b981' },
];
