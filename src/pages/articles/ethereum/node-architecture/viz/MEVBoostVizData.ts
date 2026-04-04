export const CP = '#6366f1';
export const CR = '#0ea5e9';
export const CB = '#10b981';

export const STEPS = [
  { label: 'MEV-Boost 도입 배경: 검증자 직접 빌드의 한계', body: '로컬 빌드 평균 0.005 ETH vs 외부 빌더 평균 0.03 ETH — 전문 빌더가 6배 높은 BlockValue를 제안합니다.' },
  { label: 'getHeader: 빌더들이 relay로 최고가 bid를 전송합니다', body: 'Builder 1: 0.0284 ETH, Builder 2: 0.0312 ETH, Builder 3: 0.0198 ETH — relay가 최고가(0.0312)를 선택.' },
  { label: '로컬 0.0052 ETH vs 외부 0.0312 ETH → 외부 선택', body: '로컬 빌드 0.0052 ETH vs 최고가 외부 bid 0.0312 ETH — 약 6배 차이로 외부 빌더를 채택합니다.' },
  { label: 'BlindedBeaconBlock 서명: 돌이킬 수 없는 선택', body: '헤더(state_root=0xa3f1…)만 포함한 BlindedBeaconBlock에 BLS 서명 — 비가역적 커밋입니다.' },
  { label: 'Unblind & 전파: 154개 트랜잭션 페이로드 공개', body: 'relay가 154 txs + 3 blobs 포함된 완전한 ExecutionPayload를 공개하여 gossipsub으로 전파합니다.' },
];

// Vertical layout (top -> bottom): Proposer -> MEV-Boost -> Relays -> Builders
export const P  = { x: 190, y: 44 };
export const M  = { x: 190, y: 134 };
export const R  = [{ x: 108, y: 220 }, { x: 272, y: 220 }];
export const B  = [{ x: 50,  y: 300 }, { x: 150, y: 300 }, { x: 296, y: 300 }];

// BID arrivals: stagger x so B[0] and B[1] (both going to R[0]) don't overlap
export const BID = [
  { b: 0, r: 0, dx: 88,  dy: 238, delay: 0 },
  { b: 1, r: 0, dx: 128, dy: 238, delay: 0.14 },
  { b: 2, r: 1, dx: 272, dy: 238, delay: 0.07 },
];
// TOP arrivals: offset x at M so R[0] and R[1] packets don't overlap
export const TOP = [
  { r: 0, dx: 170, dy: 152, delay: 0.45 },
  { r: 1, dx: 210, dy: 152, delay: 0.57 },
];
