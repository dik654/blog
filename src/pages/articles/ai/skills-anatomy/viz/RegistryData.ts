import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '중앙 레지스트리: 스킬 마켓플레이스',
    body: 'ClawHub 사례 — 13,729+ 커뮤니티 스킬 등록\nnpm registry처럼 검색·설치·버전 관리 가능\n에이전트가 필요한 스킬을 원격에서 가져와 즉시 사용',
  },
  {
    label: '버전 관리 & 의존성',
    body: '스킬도 semver(유의적 버전 관리) 적용\n의존성: 스킬 A가 스킬 B를 내부에서 호출 가능\n호환성: 에이전트 버전별 지원 스킬 명시',
  },
  {
    label: '커뮤니티 기여 → 검증 → 배포',
    body: '기여자가 SKILL.md 작성 후 PR 제출\n자동 검증: 문법 체크 + 파라미터 유효성 + 보안 스캔\n승인 후 레지스트리에 배포 → 전 세계 에이전트가 사용 가능',
  },
  {
    label: '스킬 조합: 체인으로 연결',
    body: '복잡한 작업 = 여러 스킬의 체인(chain)\n예: PR 리뷰 = 코드리뷰 → 테스트생성 → 커밋메시지\n각 스킬의 출력이 다음 스킬의 입력으로 연결\n→ 단순 스킬의 조합으로 복잡한 워크플로우 구성',
  },
];

export const REGISTRY_STATS = [
  { label: '등록 스킬', value: '13,729+', color: '#6366f1' },
  { label: '기여자', value: '2,400+', color: '#10b981' },
  { label: '주간 설치', value: '89K', color: '#f59e0b' },
];
