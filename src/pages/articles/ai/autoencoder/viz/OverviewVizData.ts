export const STEPS = [
  {
    label: '① 인코더: 고차원 입력을 저차원으로 압축',
    body: '200쪽 책 → 3쪽 요약. 입력의 핵심 특징만 추출하여 잠재 벡터로 변환.',
  },
  {
    label: '② 잠재 공간: 정보의 병목(Bottleneck)',
    body: '가장 좁은 지점. 차원이 작으므로 노이즈는 탈락하고 핵심 패턴만 남는다.',
  },
  {
    label: '③ 디코더: 잠재 벡터에서 원본 복원',
    body: '3쪽 요약에서 다시 200쪽 책을 복원. 완벽하지 않지만 구조는 보존.',
  },
];

export const C = {
  enc: '#6366f1',
  lat: '#f59e0b',
  dec: '#10b981',
  muted: 'var(--muted-foreground)',
};
