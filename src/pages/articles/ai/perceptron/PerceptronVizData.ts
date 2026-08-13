export const C = {
  input: "#6366f1",
  sum: "#10b981",
  output: "#ef4444",
  muted: "#64748b",
};

export const STEPS = [
  {
    label: "뉴런 비유와 계산의 대응",
    body: "입력 수집·합산·발화라는 아이디어를 단순한 수학 모델로 옮깁니다. 실제 생물학적 뉴런을 재현한 것은 아닙니다.",
  },
  {
    label: "입력 → score → threshold",
    body: "입력에 weight를 곱해 score를 만들고 bias로 경계 위치를 옮긴 뒤, step function으로 class를 정합니다.",
  },
  {
    label: "x=(1,0) → 출력 0",
    body: "w₁=0.5, w₂=0.5, b=−0.7일 때, z = 0.5×1 + 0.5×0 − 0.7 = −0.2. 0보다 작으므로 출력 0.",
  },
  {
    label: "x=(1,1) → 출력 1",
    body: "z = 0.5×1 + 0.5×1 − 0.7 = 0.3. 0보다 크므로 출력 1.",
  },
];
