export const KZG_THEORY_STEPS = [
  {
    title: 'Trusted Setup: SRS 생성',
    desc: '비밀값 τ를 선택하고, τ^i · G₁ 포인트를 4096개 미리 계산한다. τ 자체는 삭제하되, 참여자 중 1명만 삭제하면 안전하다(1-of-N 모델). 이더리움 KZG ceremony에 14만 명이 참여했다.',
    codeKey: 'kzg-types',
  },
  {
    title: '다항식 커밋먼트: C = Σ aᵢ · [τⁱ]₁',
    desc: 'Blob의 4096개 필드 원소를 다항식 p(x)의 계수 a₀, a₁, ..., a₄₀₉₅로 해석한다. SRS 포인트 [τⁱ]₁과 각 계수의 스칼라 곱의 합이 커밋먼트 C(G₁ 점, 48바이트)다.',
    codeKey: 'kzg-commit-verify',
  },
  {
    title: '증명 생성: 몫 다항식 Q(x)',
    desc: '평가점 z에서 v = p(z)를 계산한다. p(x) - v는 (x - z)로 나누어떨어지므로, 몫 다항식 Q(x) = (p(x) - v) / (x - z)의 커밋먼트 π = [Q(τ)]₁이 증명이다.',
    codeKey: 'kzg-commit-verify',
  },
  {
    title: '페어링 검증: e(π, [τ-z]₂) = e(C - [v]₁, G₂)',
    desc: '검증자는 원본 데이터 없이 커밋먼트 C(48B)와 증명 π(48B)만으로 O(1)에 검증한다. 페어링 e: G₁×G₂→Gₜ는 쌍선형 사상이라 등식이 성립하면 p(z)=v가 보장된다.',
    codeKey: 'kzg-commit-verify',
  },
];

export const BLS_CURVE_POINTS = [
  'BLS12-381은 페어링 친화적(pairing-friendly) 곡선이다. 임베딩 차수 12, 필드 크기 381비트.',
  'G₁(48B)과 G₂(96B) 두 군이 있고, 페어링으로 Gₜ(384B) 타겟 군에 매핑된다.',
  '128비트 보안 수준을 제공한다. 이더리움 BLS 서명 집계와 KZG 커밋먼트 모두에 사용된다.',
];
