export const R = '#ef4444', B = '#3b82f6', G = '#10b981', Y = '#f59e0b';

export const STEPS = [
  { label: '핵심 아이디어: "선택 함수"를 만들자',
    body: 'ℓᵢ(x)가 xᵢ에서만 1, 나머지 0이면 가중합으로 다항식 완성.' },
  { label: '(x − xⱼ)가 "0을 만드는 장치"',
    body: 'x=xⱼ 대입 시 0. 자기 점 외 모든 xⱼ를 곱해 정규화.' },
  { label: 'ℓ₀(x) 구성: x=0에서만 1',
    body: '(x-1)(x-2) / (0-1)(0-2). x=0 대입 → 2/2 = 1.' },
  { label: 'ℓ₁(x) 구성: x=1에서만 1',
    body: 'x(x-2) / (1·(-1)). x=1 대입 → -1/-1 = 1.' },
  { label: 'ℓ₂(x) 구성: x=2에서만 1',
    body: 'x(x-1) / (2·1). x=2 대입 → 2/2 = 1.' },
  { label: '가중합으로 조립 → L(x) = 1 + 2x + x²',
    body: '각 yᵢ × ℓᵢ 합산 → 3개 점 모두 지나는 유일한 2차 다항식.' },
];

export const BASIS = [
  { color: R,
    formula: `\\textcolor{${R}}{\\ell_0(x)} = \\frac{\\textcolor{${R}}{(x-1)(x-2)}}{(0-1)(0-2)} = \\frac{(x-1)(x-2)}{2}`,
    checks: `\\textcolor{${R}}{\\ell_0(0)=1} \\quad \\ell_0(1)=0 \\quad \\ell_0(2)=0` },
  { color: B,
    formula: `\\textcolor{${B}}{\\ell_1(x)} = \\frac{\\textcolor{${B}}{(x-0)(x-2)}}{(1-0)(1-2)} = \\frac{x(x-2)}{-1}`,
    checks: `\\ell_1(0)=0 \\quad \\textcolor{${B}}{\\ell_1(1)=1} \\quad \\ell_1(2)=0` },
  { color: G,
    formula: `\\textcolor{${G}}{\\ell_2(x)} = \\frac{\\textcolor{${G}}{(x-0)(x-1)}}{(2-0)(2-1)} = \\frac{x(x-1)}{2}`,
    checks: `\\ell_2(0)=0 \\quad \\ell_2(1)=0 \\quad \\textcolor{${G}}{\\ell_2(2)=1}` },
];

export const SELECTOR_ROWS = [
  { label: 'ℓ₀', color: R, vals: [1, 0, 0] },
  { label: 'ℓ₁', color: B, vals: [0, 1, 0] },
  { label: 'ℓ₂', color: G, vals: [0, 0, 1] },
];
