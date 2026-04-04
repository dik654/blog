export const packetCode = `// UDP 패킷 (최대 1280바이트)
// hash(32) || sig(65) || packet_type(1) || RLP(data)

enum PacketType {
    Ping = 1,    // 노드 활성 확인 (ENR sequence number 포함)
    Pong = 2,    // Ping 응답 (핑 패킷 해시 포함)
    FindNode = 3, // 가장 가까운 노드 요청 (target 공개키)
    Neighbors = 4, // FindNode 응답 (최대 16개 노드)
    ENRRequest = 5,   // ENR(Ethereum Node Record) 요청
    ENRResponse = 6,  // ENR 응답
}

// Ping 패킷
struct Ping {
    version: u32,    // 4
    from: Endpoint,  // 발신자 IP:port
    to: Endpoint,    // 수신자 IP:port
    expiry: u64,     // Unix 타임스탬프 (유효 기간)
    enr_seq: u64,    // 현재 ENR 시퀀스 번호
}`;

export const enrCode = `// ENR 구조 (RLP 인코딩)
[signature, seq, k1, v1, k2, v2, ...]

// 필수 키
"id"  → "v4"           // 신원 체계
"secp256k1" → pubkey   // 33바이트 압축 공개키
"ip"  → [0,0,0,0]     // IPv4 주소
"tcp" → 30303          // TCP 포트 (RLPx)
"udp" → 30303          // UDP 포트 (discv4)

// Node ID = keccak256(pubkey) — 라우팅 테이블의 키

// 텍스트 표현
enr:-IS4QHCYrYZbAKWCBRlAy5zzaDZXJBGkcnh4MHcBFZntXNFrdvJjX04jRzjzCBOonrkTfj499SZuOh8R33Ls8RRcy
  5MBgmlkgnY0gmlwhH8AAAGJc2VjcDI1NmsxoQPKY0yuDUmstAHYpMa2_oxVtw0RW_QAdpzBQA8yWM0xOIN1ZHCCdl8`;

export const lookupCode = `// discv4 lookup 흐름
async fn lookup(target: &PublicKey) -> Vec<NodeRecord> {
    let target_id = keccak256(target); // Node ID

    // 1. 로컬 테이블에서 가장 가까운 16개로 시작
    let mut result = table.closest(&target_id, 16);
    let mut asked = HashSet::new();

    loop {
        // 2. 아직 질의 안 한 가장 가까운 3개에게 동시 FIND_NODE
        let pending: Vec<_> = result.iter()
            .filter(|n| !asked.contains(&n.id))
            .take(3).collect();

        if pending.is_empty() { break; }

        for node in &pending {
            asked.insert(node.id);
            // FIND_NODE 패킷 전송 (목표 공개키 포함)
            send_find_node(node, target).await;
        }

        // 3. Neighbors 응답 수집 (최대 16개 per 응답)
        let responses = collect_neighbors(pending, timeout=2000ms).await;
        for neighbor in responses.flatten() {
            // 유효성 검증 후 result에 삽입 (거리순 정렬)
            if verify_enr(&neighbor) {
                insert_if_closer(&mut result, neighbor, &target_id);
            }
        }
    }

    result
}`;

export const discvComparison = [
  { label: 'discv4', items: ['ECDSA secp256k1 서명 (비암호화 UDP)', '본딩: Ping → Pong 교환', 'FindNode: 압축 공개키 대상'] },
  { label: 'discv5', items: ['AES-128-GCM 암호화 (모든 패킷)', 'ECDH Handshake 개선 (Session)', 'Topic Discovery (서비스 광고)'] },
];
