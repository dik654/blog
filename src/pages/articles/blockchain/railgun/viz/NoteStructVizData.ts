export const C = {
  npk: '#6366f1', token: '#0ea5e9', value: '#10b981', random: '#f59e0b',
};

export const STEPS = [
  {
    label: 'Note 구조체 — 4개 필드',
    body: 'Note = { npk, token, value, random }\n이 4개 필드가 RAILGUN 프라이버시의 핵심 단위다.',
  },
  {
    label: 'npk = poseidon(spendingKey)',
    body: 'spendingKey는 사용자 비밀키. npk는 그 공개키 역할.\nnpk만 공개되므로 spendingKey 없이는 Note를 소비할 수 없다.',
  },
  {
    label: 'token = ERC-20 주소',
    body: 'token = 0xA0b8...USDC — 어떤 토큰인지 지정.\ncommitment 해시 안에 숨어서 외부에서 토큰 종류를 알 수 없다.',
  },
  {
    label: 'value = 토큰 수량',
    body: 'value = 1000 (USDC 단위). 실제 전송 금액.\n해시에 포함되어 외부에서 금액을 알 수 없다.',
  },
  {
    label: 'random = 블라인딩 팩터',
    body: '같은 (npk, token, value)라도 random이 다르면 다른 commitment.\n동일 금액 반복 전송 시 패턴 분석을 방지한다.',
  },
];
