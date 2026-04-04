export const mkvsCode = `// MKVS (Merklized Key-Value Store)
// Merkle Tree 기반 검증 가능한 키-값 저장소

// Internal Node: 트리 분기점
type InternalNode struct {
  Hash     hash.Hash   // 자식 노드 해시 결합
  Label    Key         // 엣지 레이블 (경로 압축)
  Left     *Pointer    // 왼쪽 자식
  Right    *Pointer    // 오른쪽 자식
}

// Leaf Node: 실제 데이터
type LeafNode struct {
  Hash   hash.Hash     // H(key || value)
  Key    Key           // 키
  Value  []byte        // 값
}

// 핵심 특성:
// - 검증 가능성: 루트 해시로 전체 상태 무결성 검증
// - 효율적 동기화: 차이점만 전송 (diff sync)
// - 경로 압축: 단일 자식 노드를 레이블로 압축`;

export const mkvsAnnotations = [
  { lines: [4, 10] as [number, number], color: 'sky' as const, note: 'Internal Node: 트리 분기' },
  { lines: [12, 17] as [number, number], color: 'emerald' as const, note: 'Leaf Node: 실제 데이터' },
  { lines: [19, 23] as [number, number], color: 'amber' as const, note: 'Merkle Tree 핵심 특성' },
];
