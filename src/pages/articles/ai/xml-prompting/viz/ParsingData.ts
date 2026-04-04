import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '단일 태그 추출',
    body: 'LLM에게 <answer> 태그 안에 답변 작성 지시\n정규식 /<answer>(.*?)<\\/answer>/s 로 추출\n→ 후처리 파이프라인에 바로 연결 가능',
  },
  {
    label: '멀티 필드 추출',
    body: '<summary>, <confidence>, <sources> 각각 태그로 요청\n하나의 응답에서 여러 필드를 동시에 파싱\n→ 구조화된 데이터로 변환',
  },
  {
    label: '리스트 파싱',
    body: '<item> 태그 반복으로 리스트 데이터 추출\n정규식으로 모든 <item>...</item> 매칭\n→ 배열로 변환하여 순회 처리',
  },
  {
    label: '에러 핸들링 & 재시도',
    body: '태그 누락 — 재시도 프롬프트에 "반드시 태그로 감싸라" 강조\n태그 불일치 — 가장 가까운 매칭 시도 (fuzzy)\nmax_retries 설정 — 보통 2~3회 재시도로 해결',
  },
];
