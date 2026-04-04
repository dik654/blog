export const findNodeCode = `async fn find_node(target: NodeId) -> Vec<NodeInfo> {
    const ALPHA: usize = 3; // 동시 질의 수 (병렬도)
    const K: usize = 20;    // 반환할 최대 노드 수

    // 1. 초기 후보: 라우팅 테이블에서 target에 가장 가까운 k개
    let mut closest = routing_table.closest_nodes(&target, K);
    let mut queried = HashSet::new();
    let mut best_distance = xor_distance(&closest[0].id, &target);

    loop {
        // 2. 아직 질의 안 한 노드 중 가장 가까운 α개 선택
        let to_query: Vec<_> = closest.iter()
            .filter(|n| !queried.contains(&n.id))
            .take(ALPHA)
            .cloned()
            .collect();

        if to_query.is_empty() { break; }

        // 3. α개에 동시 질의
        let responses = join_all(
            to_query.iter().map(|n| {
                queried.insert(n.id.clone());
                rpc::find_node(n, &target)
            })
        ).await;

        // 4. 받은 노드들을 closest에 병합 & 정렬
        for nodes in responses.into_iter().flatten() {
            for node in nodes {
                if !queried.contains(&node.id) {
                    closest.push(node);
                }
            }
        }
        closest.sort_by_key(|n| xor_distance(&n.id, &target));
        closest.dedup_by_key(|n| n.id.clone());
        closest.truncate(K);

        // 5. 수렴 체크: 가장 가까운 노드가 더 이상 가까워지지 않으면 종료
        let new_best = xor_distance(&closest[0].id, &target);
        if new_best >= best_distance { break; }
        best_distance = new_best;
    }

    closest
}`;

export const findValueCode = `async fn find_value(key: Key) -> Option<Value> {
    // FIND_NODE와 동일하지만:
    // - 각 노드에 find_value RPC 전송
    // - 응답이 Value면 즉시 반환
    // - 응답이 NodeList면 FIND_NODE와 동일하게 계속 진행
    for node in to_query {
        match rpc::find_value(node, &key).await {
            FindValueResponse::Value(v) => return Some(v),
            FindValueResponse::Nodes(nodes) => { /* closest 업데이트 */ }
        }
    }
    None
}

// STORE: 목표 키와 가장 가까운 k개 노드에 저장
async fn store(key: Key, value: Value) {
    let nodes = find_node(key_as_node_id(&key)).await;
    for node in nodes.iter().take(K) {
        rpc::store(node, key.clone(), value.clone()).await.ok();
    }
}`;

export const rpcMessages = [
  { name: 'PING', desc: '노드 생존 확인' },
  { name: 'STORE', desc: '키-값 저장 요청' },
  { name: 'FIND_NODE', desc: '가장 가까운 k개 노드 반환' },
  { name: 'FIND_VALUE', desc: 'FIND_NODE + 값 있으면 즉시 반환' },
];
