export const VK_ITEMS = [
  { label: 'domain', desc: 'EvaluationDomain<C::ScalarExt> — NTT 도메인, 2k 루트' },
  { label: 'cs', desc: 'ConstraintSystemMidPhase — 고정 열·게이트·퍼뮤테이션 메타' },
  { label: 'fixed_commitments', desc: '각 고정 열의 KZG 커밋 (벡터)' },
  { label: 'permutation.commitments', desc: '퍼뮤테이션 σ 다항식 커밋 (열 순열 인코딩)' },
  { label: 'selector_assignments', desc: '선택자 압축 후 합쳐진 고정 열 할당' },
];

export const PK_EXTRAS = [
  { label: 'l0', desc: 'l0(X) — 첫 행 선택 다항식 (1 at ω⁰, 0 elsewhere). 퍼뮤테이션 초기화 제약.' },
  { label: 'l_blind', desc: 'l_blind(X) — 블라인딩 행 지시자. 어드바이스 열 끝 행들을 랜덤으로.' },
  { label: 'l_last', desc: 'l_last(X) — 마지막 유효 행 선택. l_last(X) · (Z(X)² - Z(X)) = 0 제약.' },
  { label: 'ev', desc: 'Evaluator — 게이트 다항식 구조를 coset 위에서 빠르게 평가하는 캐시.' },
  { label: 'fixed_values/polys/cosets', desc: '고정 열의 Lagrange값·계수·coset 확장 (3가지 형태 모두 보관).' },
];

export const PIPELINE = [
  { id: 'circuit', label: 'Circuit::configure()', color: '#6366f1' },
  { id: 'compress', label: '선택자 압축 (OR 결합)', color: '#0ea5e9' },
  { id: 'fixed', label: '고정 열 값 계산 (NTT)', color: '#10b981' },
  { id: 'commit', label: 'KZG 커밋 (params)', color: '#f59e0b' },
  { id: 'vk', label: 'VerifyingKey 완성', color: '#a855f7', output: true },
  { id: 'pk', label: 'ProvingKey 완성 (+ l0/blind/last)', color: '#ec4899', output: true },
];
