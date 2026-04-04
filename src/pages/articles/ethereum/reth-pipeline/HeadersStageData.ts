export interface HeaderStep {
  title: string;
  desc: string;
}

export const HEADER_STEPS: HeaderStep[] = [
  {
    title: '범위 결정',
    desc: 'checkpoint+1부터 CL tip까지. 예를 들어 checkpoint=#18,399,000이면 #18,399,001부터 다운로드를 시작한다.',
  },
  {
    title: '병렬 스트림 수신',
    desc: 'devp2p/eth 프로토콜로 여러 피어에 GetBlockHeaders를 동시 요청한다. 가장 빠른 응답부터 스트림으로 수신한다.',
  },
  {
    title: '헤더 검증',
    desc: 'parent_hash가 이전 블록 해시와 일치하는지, 블록 번호가 연속인지, 타임스탬프가 부모보다 큰지 검사한다.',
  },
  {
    title: '배치 DB 삽입',
    desc: 'commit_threshold(기본 10,000)개 단위로 MDBX 트랜잭션 한 번에 삽입. 크래시 시 체크포인트부터 이어서 다운로드한다.',
  },
];
