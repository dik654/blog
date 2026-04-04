export interface GenesisStep {
  title: string;
  desc: string;
}

export const GENESIS_STEPS: GenesisStep[] = [
  {
    title: 'include_str!("mainnet.json") -- 컴파일 타임 임베딩',
    desc: 'genesis.json을 바이너리에 포함시킨다. 런타임 파일 I/O가 필요 없으므로 ' +
      '바이너리 하나로 메인넷을 실행할 수 있다. Geth는 런타임에 JSON을 읽는다.',
  },
  {
    title: 'alloc 파싱 -- 초기 계정 잔액',
    desc: 'Genesis.alloc 필드에 프리마인 계정과 잔액이 정의된다. ' +
      '메인넷은 ICO 참여자 ~8,893개 계정의 ETH 잔액이 포함되어 있다.',
  },
  {
    title: 'state_root 계산 -- MPT 구성',
    desc: 'alloc의 모든 계정으로 Merkle Patricia Trie를 구성하고 루트 해시를 계산한다. ' +
      '이 값이 genesis_header.state_root가 된다.',
  },
  {
    title: '제네시스 해시 검증 -- MAINNET_GENESIS_HASH',
    desc: '헤더를 RLP 인코딩하여 해시를 계산하고, 하드코딩된 상수와 비교한다. ' +
      '불일치하면 잘못된 체인 설정이므로 노드 시작을 거부한다.',
  },
];
