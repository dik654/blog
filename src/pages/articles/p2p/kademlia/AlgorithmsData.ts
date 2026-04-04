export const rpcItems = [
  { name: 'PING', desc: '노드 활성 여부 확인. 응답이 없으면 k-버킷에서 제거 후보.' },
  { name: 'STORE', desc: '키-값 쌍을 저장하도록 요청. 만료 시간 포함.' },
  { name: 'FIND_NODE', desc: '대상 ID에 가장 가까운 k개 노드 목록을 요청.' },
  { name: 'FIND_VALUE', desc: '값이 있으면 반환, 없으면 FIND_NODE처럼 가까운 노드 반환.' },
];

export const iterativeFindCode = `async fn find_closest_nodes(target: &NodeId) -> Vec<NodeInfo> {
    const ALPHA: usize = 3; // 동시 요청 수 (동시성 파라미터)
    const K: usize = 20;    // 목표 응답 노드 수

    // 1. 초기 후보: 로컬 라우팅 테이블에서 가장 가까운 k개
    let mut closest = routing_table.find_closest(target, K);
    let mut queried = HashSet::new();

    loop {
        // 2. 아직 질의하지 않은 가장 가까운 alpha개 선택
        let to_query: Vec<_> = closest.iter()
            .filter(|n| !queried.contains(&n.id))
            .take(ALPHA)
            .cloned()
            .collect();

        if to_query.is_empty() { break; } // 더 이상 질의할 노드 없음

        // 3. alpha개에게 동시 FIND_NODE RPC
        let results = join_all(to_query.iter().map(|n| {
            queried.insert(n.id.clone());
            rpc.find_node(n, target)
        })).await;

        // 4. 응답으로 받은 노드들을 closest에 병합
        let prev_closest = closest[0].id.clone();
        for nodes in results.flatten() {
            for node in nodes {
                if !queried.contains(&node.id) {
                    insert_sorted(&mut closest, node, target);
                }
            }
        }
        closest.truncate(K);

        // 5. 가장 가까운 노드가 변하지 않으면 종료
        if closest[0].id == prev_closest {
            // 아직 질의 안 한 노드들에게 한 번 더 요청 후 종료
            query_remaining_unqueried(&closest, &queried, target).await;
            break;
        }
    }

    closest
}`;

export const storeGetCode = `// 저장: key에 가장 가까운 k개 노드에 STORE 요청
async fn put_value(key: &Key, value: &Value) {
    let nodes = find_closest_nodes(key).await;
    join_all(nodes.iter().map(|n| rpc.store(n, key, value))).await;
}

// 조회: FIND_VALUE를 반복 사용
async fn get_value(key: &Key) -> Option<Value> {
    // find_closest_nodes와 동일하지만 FIND_VALUE RPC 사용
    // 중간에 값을 가진 노드를 만나면 즉시 반환
    // 값을 찾으면 "가장 가까운 노드 중 값 없는 노드"에 캐싱 (선택적)
    iterative_find_value(key).await
}`;

export const maintenanceCode = `// 1시간마다 실행
async fn maintenance() {
    // 각 버킷에 랜덤 ID로 FIND_NODE → 버킷 새로고침
    for bucket in buckets.iter_mut() {
        if bucket.last_lookup.elapsed() > Duration::from_secs(3600) {
            let random_id = random_id_in_bucket_range(bucket);
            find_closest_nodes(&random_id).await;
        }
    }

    // 저장한 값들 재발행 (만료 방지)
    for (key, value) in stored_values.iter() {
        put_value(key, value).await;
    }
}`;
