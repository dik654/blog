export const C = { restore: '#6366f1', proof: '#10b981', check: '#f59e0b' };

export const STEPS = [
  {
    label: "w1' = UseHint(h, A*z - c*t, 2*gamma2)",
    body: '검증자는 서명에 포함된 힌트(h)를 사용하여 w1의 상위 비트를 복원합니다.\nA*z - c*t를 계산하고, 힌트가 올바른 라운딩 방향을 알려줍니다.',
  },
  {
    label: "대수적 증명: A*z - c*t = A*y - c*s2",
    body: 'z = y + c*s1, t = A*s1 + s2를 대입하면:\nA*(y+c*s1) - c*(A*s1+s2) = A*y + Ac*s1 - cA*s1 - c*s2 = A*y - c*s2\nc*s2가 작으므로 HighBits(A*y - c*s2) = HighBits(A*y) = w1.',
  },
  {
    label: "c_tilde' = H(mu || w1') → c_tilde' == c_tilde?",
    body: '복원된 w1\'으로 도전 해시를 재계산합니다.\n서명 시 사용한 c_tilde와 일치하면 서명이 유효합니다.',
  },
];
