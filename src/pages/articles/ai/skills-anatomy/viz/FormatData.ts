import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'SKILL.md = YAML 프론트매터 + 마크다운 바디',
    body: 'YAML 프론트매터(메타데이터) + 마크다운 바디(시스템 프롬프트) 구조다.',
  },
  {
    label: 'YAML 프론트매터 구조',
    body: 'name, description, parameters, triggers 네 필드로 스킬을 정의한다.',
  },
  {
    label: '파라미터 바인딩: {{param}} 템플릿',
    body: '{{param}} 플레이스홀더를 런타임에 치환해 하나의 스킬을 재사용한다.',
  },
  {
    label: '실제 SKILL.md 예시',
    body: '코드 리뷰, 커밋 메시지, 번역 등 각각 하나의 .md 파일로 정의된다.',
  },
];

export const FRONTMATTER_FIELDS = [
  { key: 'name', value: 'code-review', color: '#6366f1' },
  { key: 'description', value: '코드 리뷰 수행', color: '#6366f1' },
  { key: 'parameters', value: 'language, file_path', color: '#10b981' },
  { key: 'triggers', value: '/review', color: '#f59e0b' },
];
