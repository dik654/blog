export const COMPARE = [
  { model: 'TLS (X.509)', auth: 'CA 인증서 체인', fit: 'Server-Client', color: '#64748b' },
  { model: 'Noise XX', auth: '공개키 기반 PeerId', fit: 'P2P (양방향 대등)', color: '#8b5cf6' },
];

export const REASONS = [
  { label: 'CA 불필요', desc: '중앙 인증기관 없이 공개키만으로 신원 증명', color: '#10b981' },
  { label: 'PeerId = 공개키 해시', desc: 'Ed25519 공개키에서 PeerId를 도출. 별도 등록 불필요', color: '#6366f1' },
  { label: 'XX 패턴', desc: '양쪽 모두 상대를 모르는 상태에서 시작. 대칭적 인증', color: '#f59e0b' },
  { label: 'Forward Secrecy', desc: '임시 DH 키로 세션마다 새 공유 비밀 생성', color: '#ef4444' },
];
