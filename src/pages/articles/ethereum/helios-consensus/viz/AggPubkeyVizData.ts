export const C = {
  pk: '#6366f1', agg: '#10b981',
};

export const STEPS = [
  {
    label: 'Line 25~27: G1 점 합산',
    body: 'participants.iter().fold(G1::identity(), |acc, pk| acc + pk)\n참여 공개키를 하나씩 더해서 aggregate_pubkey 생성.',
  },
  {
    label: '왜 합산이 가능한가',
    body: 'BLS의 핵심 성질: pk1 + pk2 + ... 의 합산 서명 검증 =\n각각 개별 검증한 것과 동일한 결과. O(n) → O(1).',
  },
];
