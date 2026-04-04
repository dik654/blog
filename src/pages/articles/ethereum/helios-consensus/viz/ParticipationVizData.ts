export const C = {
  bit: '#6366f1', active: '#10b981', inactive: '#94a3b8',
};

export const STEPS = [
  {
    label: 'Line 13~14: Bitvector<512> 순회',
    body: 'pks.iter().zip(bits.iter())\n512개 공개키와 512비트를 동시 순회한다.',
  },
  {
    label: 'Line 15~17: bit == 1인 공개키만 필터링',
    body: '.filter(|(_, bit)| *bit)\n참여하지 않은 위원은 제외. 보통 400~500명 참여.',
  },
];
