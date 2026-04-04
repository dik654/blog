export interface SenderFact {
  label: string;
  value: string;
  desc: string;
}

export const SENDER_FACTS: SenderFact[] = [
  {
    label: 'TX sender 필드',
    value: '없음',
    desc: '이더리움 TX 스펙에 sender 필드는 존재하지 않는다. 서명(v,r,s)에서 역산해야 한다.',
  },
  {
    label: 'ecrecover 비용',
    value: '~3,000 가스 등가',
    desc: 'secp256k1 곡선 연산이 필요하다. 프리컴파일 컨트랙트에서도 3,000 가스를 소비하는 CPU 집약적 작업이다.',
  },
  {
    label: '병렬화 방식',
    value: 'rayon par_iter',
    desc: 'Reth는 rayon의 par_iter로 멀티코어를 활용한다. 10만 TX를 16코어에서 처리하면 순차 대비 10배 이상 빠르다.',
  },
  {
    label: '저장 위치',
    value: 'TxSenders 테이블',
    desc: 'ExecutionStage가 msg.sender를 조회할 때 이 테이블에서 읽는다. 실행 시 매번 ecrecover를 반복하지 않는다.',
  },
];
