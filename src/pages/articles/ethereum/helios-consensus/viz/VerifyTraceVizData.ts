/** VerifyTrace Viz — 색상 상수 + step 정의 */

export const C = {
  filter: '#6366f1',   // 비트맵 필터링 (인디고)
  quorum: '#10b981',   // 정족수 (에메랄드)
  aggpk: '#8b5cf6',    // 집계 공개키 (보라)
  root: '#f59e0b',     // signing_root (앰버)
  pairing: '#06b6d4',  // 페어링 (시안)
  pipeline: '#ec4899', // 파이프라인 (핑크)
};

export const STEPS = [
  {
    label: '단계 1: 비트맵 필터링 — 512명 중 참여자 추출',
    body: 'bits: Bitvector<512>에서 bit=1인 공개키만 필터링한다.\n보통 480~510명(95%+)이 참여. 미참여는 네트워크 지연, 다운타임 등.',
  },
  {
    label: '단계 2: 정족수 확인 — 2/3 임계값',
    body: 'participants * 3 < 512 * 2 이면 거부.\n최소 342명(66.8%) 이상 참여해야 유효. Casper FFG와 동일한 BFT 임계값.',
  },
  {
    label: '단계 3: 집계 공개키 합산 — G1 점 덧셈',
    body: '참여자의 G1 점을 모두 더해 단일 agg_pk를 만든다.\nBLS 선형성: 개별 검증 480회 = 집계 검증 1회.',
  },
  {
    label: '단계 4: signing_root 계산 — 도메인 분리',
    body: 'header → object_root, DOMAIN_SYNC_COMMITTEE + fork_version → domain.\n결합하여 signing_root를 생성. 도메인 분리로 서명 재사용을 방지한다.',
  },
  {
    label: '단계 5: 페어링 비교 — 쌍선형성 증명',
    body: 'e(agg_pk, H(m)) == e(G, sig) 비교.\n쌍선형성: e(a·G, B) = e(G, a·B) → 서명자가 공개키 소유자임을 증명.',
  },
  {
    label: '전체 파이프라인 — 5단계 요약',
    body: 'bits(512) → filter → pk합산(48B) → signing_root(32B) → pairing → 결과.\n전체 ~3ms. Reth의 블록 실행(수 초) 대비 1000배 빠르다.',
  },
];
