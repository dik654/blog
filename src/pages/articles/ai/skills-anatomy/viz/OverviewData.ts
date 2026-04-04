import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'Skill = 재사용 가능한 능력 단위',
    body: '함수(function)가 코드의 재사용 단위이듯\nSkill은 에이전트의 재사용 가능한 능력 단위\n프롬프트 + 메타데이터를 하나로 패키징한 것',
  },
  {
    label: 'Skill의 4가지 구성요소',
    body: '① 이름(name) — 호출 식별자\n② 설명(description) — 언제 사용할지 판단 기준\n③ 파라미터(parameters) — 런타임 입력값\n④ 프롬프트(body) — 실행 로직이 담긴 시스템 프롬프트',
  },
  {
    label: '코드 라이브러리 ↔ 에이전트 Skills',
    body: 'npm install → 라이브러리 추가 → import해서 사용\nskill install → 스킬 추가 → 에이전트가 자동 호출\n코드의 라이브러리 생태계처럼, 스킬도 공유·검색·설치 가능',
  },
  {
    label: '왜 Skill이 필요한가',
    body: '매번 같은 프롬프트를 복붙하지 않아도 됨\n팀 전체가 동일한 품질의 작업 수행 가능\n검증된 프롬프트를 커뮤니티가 공유하는 생태계 형성',
  },
];
