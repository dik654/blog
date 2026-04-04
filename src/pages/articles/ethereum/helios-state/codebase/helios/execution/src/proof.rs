use alloy_primitives::{Address, B256, U256};
use alloy_rlp::Decodable;
use eyre::Result;

/// 본문 대응: Account 구조체 — RLP 디코딩 결과의 4개 필드
/// nonce:        트랜잭션 카운터 (예: 42)
/// balance:      ETH 잔액 in wei (예: 1_500_000_000_000_000_000 = 1.5 ETH)
/// storage_root: 스토리지 트라이 루트 해시 (32바이트)
/// code_hash:    컨트랙트 코드 keccak256 해시 (EOA면 빈 해시)
pub struct Account {
    pub nonce: u64,
    pub balance: U256,
    pub storage_root: B256,
    pub code_hash: B256,
}

/// 본문 대응: MPT 노드 타입 3가지
/// - Branch: 16개 자식 슬롯 [0..f] + 선택적 값. nibble로 분기
/// - Extension: shared_nibbles + child_hash. 공통 경로 압축
/// - Leaf: remainder_path + value. 트라이 최종 노드
///
/// 검증 원리: hash(child_node) == parent_node[slot]
/// 루트부터 리프까지 해시 체인이 일치하면 데이터 무결성 확인

/// 본문 대응: MptTraversal 섹션 전체 — MPT 증명 검증 핵심 엔진
/// proof 배열을 순회하면서 root → leaf 까지 해시 체인을 검증
/// 각 노드의 RLP을 디코딩하고, 경로(nibble)에 따라 다음 노드를 선택
pub fn verify_proof(
    proof: &[Bytes],       // RPC 응답의 노드 배열 (root_node → ... → leaf_node)
    root: &B256,           // 검증 기준이 되는 루트 해시 (state_root 또는 storage_root)
    path: &B256,           // keccak256(key) → 64 nibble 경로
) -> Result<Vec<u8>> {
    // 본문 대응: MptTraversal Step 0 — 초기 상태
    let mut expected_hash = *root;   // 첫 번째 노드의 해시는 root와 일치해야 함
    let mut path_offset = 0_usize;   // 경로에서 현재 소비한 nibble 수 (0부터 시작)
    // path를 nibble 배열로 변환: 32바이트 → 64 nibble
    // 예: 0x5b → [5, b], 0x9e → [9, e], ...
    let nibbles = path_to_nibbles(path);

    // 본문 대응: MptTraversal Step 1 — 노드 순회 루프
    for node_rlp in proof.iter() {
        // ① 해시 검증: 이 노드의 keccak256 == 부모가 기대한 해시
        // 첫 노드: keccak256(node_rlp) == state_root
        // 이후:    keccak256(node_rlp) == parent.children[nibble]
        let node_hash = keccak256(node_rlp);
        if node_hash != expected_hash {
            return Err(eyre!("hash mismatch at offset {}", path_offset));
            // 본문 대응: 공격 감지 — RPC가 가짜 노드를 삽입한 경우
        }

        // ② RLP 디코딩 → 노드 타입 판별
        let items: Vec<Bytes> = rlp_decode_list(node_rlp);

        match items.len() {
            // 본문 대응: MptTraversal Step 2 — Branch 노드 (17개 항목)
            17 => {
                // Branch: children[0..15] + value[16]
                // nibble = nibbles[path_offset] → 다음 자식 선택
                let nibble = nibbles[path_offset] as usize;
                // 예: path_offset=0, nibble=5 → children[5]
                if items[nibble].is_empty() {
                    return Err(eyre!("empty branch slot at nibble {}", nibble));
                }
                // 자식 해시를 다음 expected_hash로 설정
                expected_hash = B256::from_slice(&items[nibble]);
                path_offset += 1; // nibble 1개 소비
            }

            // 본문 대응: MptTraversal Step 3 — Extension 또는 Leaf (2개 항목)
            2 => {
                // HP(Hex Prefix) 인코딩으로 Extension/Leaf 구분
                // 첫 nibble: 0 = Extension(짝수), 1 = Extension(홀수)
                //            2 = Leaf(짝수),      3 = Leaf(홀수)
                let (prefix, shared) = decode_hp(&items[0]);

                if prefix == 0 || prefix == 1 {
                    // Extension: shared_nibbles를 경로에서 소비하고 다음 노드로
                    // 예: shared = [1, a, 3, b] → 4 nibble을 한 번에 건너뜀
                    // 압축 효과: Branch 4개를 Extension 1개로 대체
                    if nibbles[path_offset..path_offset + shared.len()] != shared {
                        return Err(eyre!("extension path mismatch"));
                    }
                    expected_hash = B256::from_slice(&items[1]);
                    path_offset += shared.len(); // shared nibble만큼 소비
                } else {
                    // Leaf: 나머지 경로 확인 후 값 반환
                    // 여기가 탐색의 종착점 — value가 찾던 데이터
                    let remainder = &nibbles[path_offset..];
                    if remainder != &shared[..] {
                        return Err(eyre!("leaf path mismatch"));
                    }
                    // items[1] = RLP 인코딩된 계정 데이터 또는 스토리지 값
                    return Ok(items[1].to_vec());
                }
            }

            _ => return Err(eyre!("invalid node: {} items", items.len())),
        }
    }
    Err(eyre!("proof ended without reaching leaf"))
}

/// Hex Prefix 디코딩 — Extension/Leaf 구분 + shared nibble 추출
/// 본문 대응: MptTraversal Step 3 인라인 설명
/// HP 인코딩: 첫 바이트의 상위 nibble이 플래그
///   0x00 = Extension, 짝수 nibble
///   0x01 = Extension, 홀수 nibble
///   0x02 = Leaf, 짝수 nibble
///   0x03 = Leaf, 홀수 nibble
fn decode_hp(encoded: &[u8]) -> (u8, Vec<u8>) {
    let prefix = encoded[0] >> 4;       // 상위 nibble = 타입 플래그
    let odd = prefix & 1 == 1;          // 홀수 여부
    let mut nibbles = vec![];
    if odd {
        nibbles.push(encoded[0] & 0x0f); // 홀수면 첫 바이트 하위 nibble 포함
    }
    for byte in &encoded[1..] {
        nibbles.push(byte >> 4);         // 상위 nibble
        nibbles.push(byte & 0x0f);       // 하위 nibble
    }
    (prefix, nibbles)
}

/// EIP-1186 Account Proof 검증
/// 본문 대응: ProofTrace 섹션 — 3단계 (keccak → MPT verify → RLP decode)
pub fn verify_account_proof(
    proof: &EIP1186Proof,
    state_root: &B256,     // BLS 검증된 finalized_header의 상태 루트
    address: &Address,     // 예: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
) -> Result<Account> {
    // 본문 대응 — 단계 1: 주소 해시 → 트라이 경로
    let path = keccak256(address);

    // 본문 대응 — 단계 2: verify_proof()로 MPT 순회
    let encoded = verify_proof(
        &proof.account_proof,
        state_root,
        &path,
    )?;

    // 본문 대응 — 단계 3: RLP 디코딩 → Account
    let account = Account::decode(&mut &encoded[..])?;
    Ok(account)
}

/// Storage Proof 검증 (중첩 트라이)
/// 본문 대응: ProofTrace — "트라이 안의 트라이"
pub fn verify_storage_proof(
    proof: &StorageProof,
    storage_root: &B256,   // verify_account_proof()에서 획득
    key: &B256,            // 스토리지 슬롯 키
) -> Result<U256> {
    let path = keccak256(key);
    let encoded = verify_proof(
        &proof.proof,
        storage_root,
        &path,
    )?;
    let value = U256::decode(&mut &encoded[..])?;
    Ok(value)
}

/// 본문 대응: Reth 비교
/// Reth는 StateProvider → MDBX 직접 읽기 (~0.1ms, 증명 불필요)
/// Helios: verify_proof()로 MPT 순회 (~0.5ms, 디스크 0)
