export const C = {
  user: '#6366f1', waku: '#f59e0b', broadcaster: '#10b981', chain: '#ef4444',
};

export const STEPS = [
  {
    label: '사용자: TX 생성 (오프체인)',
    body: 'ZK proof 생성 완료\ntransact(proof, nullifiers, commitments) TX 데이터 조립\n아직 블록체인에 제출하지 않는다 — 직접 보내면 msg.sender 노출.',
  },
  {
    label: 'AES-256-GCM 암호화 → Waku publish',
    body: 'plaintext = serialized TX\nkey = broadcaster 공개키로 ECDH 공유 비밀 생성\nciphertext = AES-256-GCM(plaintext, sharedSecret)\nWaku.publish(topic="railgun-tx", ciphertext)',
  },
  {
    label: 'Broadcaster: 수신 → 복호화 → 가스 확인',
    body: 'Waku.subscribe("railgun-tx")\nciphertext 복호화 → TX 데이터 획득\ngasPrice 확인: 수수료 ≥ 최소 보상\nfee가 충분하면 → 온체인 제출 결정',
  },
  {
    label: 'eth_sendRawTransaction — 발신자 분리',
    body: 'Broadcaster가 자신의 EOA로 TX 서명 & 제출\nmsg.sender = 0xBroadcaster ≠ 0xUser\n온체인에는 Broadcaster 주소만 기록 → 실제 사용자 프라이버시 보호.',
  },
];
