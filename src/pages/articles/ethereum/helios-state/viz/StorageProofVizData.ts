export const C = {
  key: '#6366f1', proof: '#10b981', value: '#f59e0b',
};

export const STEPS = [
  {
    label: 'Line 30~31: keccak256(key) → 스토리지 경로',
    body: '스토리지 키를 해시해서 스토리지 트라이의 경로 생성.\n어카운트의 storageRoot가 이 트라이의 루트.',
  },
  {
    label: 'Line 32~35: verify_proof() — 중첩 트라이',
    body: '상태 트라이 안에 스토리지 트라이가 중첩.\nstorage_root를 기준으로 증명 검증.',
  },
  {
    label: 'Line 36~39: RLP → U256 디코딩',
    body: '검증된 바이트를 U256으로 디코딩.\n스마트 컨트랙트의 저장 슬롯 값.',
  },
];
