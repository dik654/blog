export const PARALLEL_STRATEGY = [
  {
    title: 'Storage trie 독립성',
    desc: '각 계정의 storage trie는 완전히 별도의 서브트리다. 계정 A의 스토리지 변경은 계정 B의 storage trie에 영향을 주지 않는다. 데이터 의존성이 없으므로 병렬화가 가능하다.',
    color: '#8b5cf6',
  },
  {
    title: 'rayon 병렬 계산',
    desc: '변경된 계정의 storage trie를 rayon(Rust의 데이터 병렬 라이브러리)으로 동시에 계산한다. 코어 수에 비례하여 처리량이 증가한다. 8코어에서 대규모 블록 처리 시 약 3~5배 빨라진다.',
    color: '#6366f1',
  },
  {
    title: 'Account trie 순차 합산',
    desc: 'storage root가 모두 준비되면 account trie를 순차적으로 갱신한다. account trie는 단일 트리이므로 병렬화할 수 없다. 하지만 storage trie 계산이 전체 시간의 대부분을 차지하므로 영향이 작다.',
    color: '#10b981',
  },
];

export const PARALLEL_BENEFIT = {
  sequential: '블록 내 변경된 N개 계정의 storage trie를 하나씩 계산',
  parallel: 'N개 storage trie를 동시에 계산 → account trie에 합산',
  bottleneck: 'account trie 갱신은 순차적이지만, 전체 시간의 10~20%에 불과',
};
