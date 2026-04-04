export const C = { ssz: '#8b5cf6', merkle: '#3b82f6', err: '#ef4444', ok: '#10b981', proof: '#f59e0b' };

export const STEPS = [
  {
    label: 'CL의 직렬화 요구',
    body: '비콘 체인의 모든 데이터가 SSZ로 직렬화되며 일관된 규격이 전제입니다.',
  },
  {
    label: '문제: RLP는 머클 증명 불가',
    body: 'EL의 RLP는 비결정적 인코딩이 가능하여 머클 증명과 라이트 클라이언트에 부적합합니다.',
  },
  {
    label: '문제: 결정적 해시 필요',
    body: '모든 노드가 동일 데이터에 동일 해시를 생성해야 하므로 바이트 수준 결정성이 필수입니다.',
  },
  {
    label: '해결: SSZ + HashTreeRoot',
    body: '고정/가변 분리 + 32B 청크 패킹으로 바이너리 머클 트리를 구성하여 결정적 루트 해시를 생성합니다.',
  },
  {
    label: '해결: GeneralizedIndex 증명',
    body: 'BFS 인덱스로 특정 필드의 증명 경로를 지정하여 라이트 클라이언트가 부분 검증 가능합니다.',
  },
];
