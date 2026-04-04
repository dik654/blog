export interface BodyVerifyItem {
  label: string;
  desc: string;
}

export const BODY_VERIFY_ITEMS: BodyVerifyItem[] = [
  {
    label: 'tx_root 대조',
    desc: '바디의 TX 목록으로 머클 루트를 직접 계산한다. 헤더의 transactions_root와 불일치하면 위조 TX로 판단, 즉시 차단한다.',
  },
  {
    label: 'ommers_hash 대조',
    desc: '바디의 ommer 헤더로 해시를 계산하고 헤더의 ommers_hash와 비교한다. Merge 이후는 빈 목록이 정답이다.',
  },
  {
    label: 'withdrawals_root 대조',
    desc: 'Shanghai 이후 CL 인출 목록의 머클 루트를 헤더와 대조한다. 인출 누락/위조를 방지한다.',
  },
];
