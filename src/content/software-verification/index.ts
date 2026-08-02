import type { Category } from '../types';

const softwareVerification: Category = {
  slug: 'software-verification',
  name: 'Software Verification',
  description: 'FM, boundary slicing, invariant, counterexample 중심의 검증 방법론',
  group: 'practice',
  subcategories: [
    {
      slug: 'verified-boundary-slicing',
      name: 'Verified Boundary Slicing',
      description: '레거시 코드를 검증 가능한 경계 단위로 자르는 실천 프레임',
      icon: '◇',
    },
  ],
  articles: [
    {
      slug: 'fm-boundary-practice',
      title: 'FM 경계 절단 실천 노트: 레거시를 검증 단위로 축적하기',
      subcategory: 'verified-boundary-slicing',
      summary: '전체 재작성 전에 함수 경계를 자르고 전제·불변조건·최소 반례·회귀 증거를 한 단위씩 쌓는 실전 방법을 설명합니다.',
      level: '중급',
      estimatedMinutes: 24,
      prerequisites: ['함수의 입력과 출력', '단위 테스트의 pass/fail', '불변조건과 반례의 직관'],
      sections: [
        { id: 'problem', title: '문제 정의' },
        { id: 'frame', title: '판단 프레임' },
        { id: 'workflow', title: '반복 절차' },
        { id: 'cut-types', title: '경계 종류' },
        { id: 'artifacts', title: '산출물' },
        { id: 'implementation', title: '구현 아이디어' },
        { id: 'failure-modes', title: '실패 모드' },
        { id: 'next', title: '다음 단위' },
      ],
      component: () => import('@/pages/articles/blockchain/fm-boundary-practice'),
    },
  ],
};

export default softwareVerification;
