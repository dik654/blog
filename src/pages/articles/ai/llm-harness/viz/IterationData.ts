import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '① 로그 수집 — 실패부터 잡기',
    body: '모든 요청/응답 쌍을 저장하고 실패 케이스를 정량화한다.',
  },
  {
    label: '② 실패 분류 → 프롬프트 조정',
    body: '실패 유형별 원인을 분석해 프롬프트를 조정한다.',
  },
  {
    label: '③ A/B 테스트 + 버전 관리',
    body: '프롬프트 v1 vs v2를 골든 셋으로 비교해 개선을 숫자로 확인한다.',
  },
  {
    label: '④ 비용-품질 트레이드오프',
    body: '의도 분류 라우팅으로 모델을 분기해 비용과 품질을 균형 잡는다.',
  },
];

export const LOOP_NODES = [
  { label: '로그 수집', color: '#6366f1' },
  { label: '실패 분류', color: '#f59e0b' },
  { label: '프롬프트\n조정', color: '#10b981' },
  { label: '재평가', color: '#6366f1' },
];
