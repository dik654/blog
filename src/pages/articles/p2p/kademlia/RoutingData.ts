export const kBucketCode = `// 각 버킷: LRU 정렬 목록, 최대 k개 (go-ethereum: k=16, idBits=256)
struct KBucket {
    nodes: VecDeque<NodeInfo>, // 최대 k개, 가장 오래된 것이 front
    replacement_cache: Vec<NodeInfo>, // 버킷 꽉 찼을 때 대기
}

// 라우팅 테이블
struct RoutingTable {
    local_id: NodeId,
    buckets: Vec<KBucket>, // 버킷 i는 거리 [2^i, 2^(i+1)) 담당
}

// 버킷 인덱스 계산: 선행 0비트 수 (XOR의 최상위 비트 위치)
fn bucket_index(local: &NodeId, other: &NodeId) -> usize {
    let distance = local ^ other;
    distance.leading_zeros() as usize
    // distance가 클수록 (다를수록) → 인덱스가 작음 (먼 버킷)
    // distance가 0에 가까울수록 → 인덱스가 큼 (가까운 버킷)
}`;

export const kBucketAnnotations = [
  { lines: [1, 5] as [number, number], color: 'sky' as const, note: 'KBucket — LRU 리스트 + 대체 캐시' },
  { lines: [8, 11] as [number, number], color: 'emerald' as const, note: '라우팅 테이블 — 버킷 배열' },
  { lines: [14, 19] as [number, number], color: 'amber' as const, note: '선행 0비트로 버킷 인덱스 계산' },
];

export const bucketUpdateCode = `fn on_node_seen(&mut self, node: NodeInfo) {
    let idx = self.bucket_index(&node.id);
    let bucket = &mut self.buckets[idx];

    if let Some(pos) = bucket.nodes.iter().position(|n| n.id == node.id) {
        // 1. 이미 있으면 → 맨 뒤로 이동 (most-recently seen)
        let existing = bucket.nodes.remove(pos).unwrap();
        bucket.nodes.push_back(existing);
    } else if bucket.nodes.len() < K {
        // 2. 버킷에 공간이 있으면 → 맨 뒤에 추가
        bucket.nodes.push_back(node);
    } else {
        // 3. 버킷이 꽉 찼으면 → 맨 앞(가장 오래된) 노드 핑
        // 응답 없으면: 기존 노드 제거 + 새 노드 추가
        // 응답 있으면: 기존 노드 유지, 새 노드는 replacement_cache
        let oldest = bucket.nodes.front().unwrap();
        if self.ping(oldest).await.is_err() {
            bucket.nodes.pop_front();
            bucket.nodes.push_back(node);
        } else {
            bucket.replacement_cache.push(node);
        }
    }
}`;

export const bucketUpdateAnnotations = [
  { lines: [5, 8] as [number, number], color: 'sky' as const, note: '기존 노드 → 최근 사용 위치로 이동' },
  { lines: [9, 11] as [number, number], color: 'emerald' as const, note: '공간 있으면 추가' },
  { lines: [12, 22] as [number, number], color: 'amber' as const, note: '꽉 찬 경우 — 핑 후 교체 결정' },
];

export const bucketSplitCode = `// 거리별 버킷 → 가까운 노드일수록 더 세밀한 해상도
// 버킷 0: 노드 ID와 최상위 비트가 다른 노드들 (전체의 50%)
// 버킷 1: 최상위 비트 같고 다음 비트가 다른 노드들 (25%)
// 버킷 2: 상위 2비트 같고 다음이 다른 노드들 (12.5%)
// ...
// 버킷 159: 159비트까지 같고 마지막 비트가 다른 노드들

// 실제로는 가까운 버킷이 더 많이 채워짐 → 가까운 네트워크는 세밀하게 알고,
// 먼 네트워크는 대략적으로만 앎 (지수적으로 조잡해짐)`;

export const bucketSplitAnnotations = [
  { lines: [1, 6] as [number, number], color: 'sky' as const, note: '거리별 버킷 분포 — 지수적 분할' },
  { lines: [8, 9] as [number, number], color: 'emerald' as const, note: '가까울수록 세밀, 멀수록 조잡' },
];
