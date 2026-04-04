export const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export const STEPS = [
  {
    label: 'Sponge 초기화: state = [0, left, right]',
    body: 'capacity=0(내부), rate₀=left, rate₁=right — width 3으로 2-to-1 해시',
  },
  {
    label: 'AddRoundConstants (ARK): 대칭성 파괴',
    body: 'state[i] += round_constants로 대칭성 파괴 — 0-입력에도 비자명 출력',
  },
  {
    label: 'S-box: x → x⁵ (비선형 변환)',
    body: 'x⁵ = x²·x²·x로 Fp 곱셈 3회 — gcd(5, r-1)=1이라 역함수 보장',
  },
  {
    label: 'MDS 행렬 곱: 최대 확산(diffusion)',
    body: 'MDS 행렬 곱으로 한 원소의 변화가 전체에 전파 — avalanche 효과',
  },
  {
    label: 'Full round vs Partial round',
    body: 'Full은 S-box 3개(제약 9), Partial은 1개(제약 3) — 총 65라운드 ~250 제약',
  },
];

export const STEP_REFS = ['poseidon-hash', 'poseidon-params', 'poseidon-sbox', 'poseidon-sbox', 'poseidon-permutation'];
export const STEP_LABELS = ['poseidon.rs — poseidon_hash', 'poseidon.rs — round_constants', 'poseidon.rs — sbox + mds_mix', 'poseidon.rs — mds_mix', 'poseidon.rs — poseidon_permutation'];
