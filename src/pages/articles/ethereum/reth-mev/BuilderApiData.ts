export interface BuildStep {
  id: string;
  step: number;
  title: string;
  desc: string;
  color: string;
}

export const BUILD_STEPS: BuildStep[] = [
  {
    id: 'local',
    step: 1,
    title: '로컬 블록 빌드',
    desc: 'PayloadBuilder가 txpool에서 TX를 수집하고 revm으로 실행하여 로컬 블록을 먼저 완성한다. 이 블록이 fallback으로 사용되므로, 외부 빌더 장애 시에도 블록 제안이 가능.',
    color: '#6366f1',
  },
  {
    id: 'external',
    step: 2,
    title: '외부 입찰 요청',
    desc: 'RelayClient가 get_header()로 릴레이에 최적 빌더 입찰을 요청한다. 응답에는 SignedBuilderBid(블록 헤더 + 가치)가 포함. 복수 릴레이에 동시 요청하여 최적 입찰을 선택.',
    color: '#0ea5e9',
  },
  {
    id: 'compare',
    step: 3,
    title: '가치 비교',
    desc: '로컬 블록의 blockValue와 외부 입찰의 bid.value를 비교한다. 외부가 더 높으면 외부 블록 채택, 같거나 낮으면 로컬 블록 사용.',
    color: '#10b981',
  },
  {
    id: 'fallback',
    step: 4,
    title: '로컬 폴백',
    desc: '외부 릴레이가 다운되거나 응답이 늦으면 자동으로 로컬 블록을 사용한다. 네트워크 liveness에 영향을 주지 않는 안전한 설계. 타임아웃은 설정 가능(기본 1초).',
    color: '#f59e0b',
  },
];
