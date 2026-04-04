// consensus/src/consensus.rs — Inner::sync()
// ※ 본문 "fetch_checkpoint() 내부 추적" 섹션의 "HTTP 요청 구성" 부분에 대응

use eyre::Result;
use ssz_rs::prelude::*;

/// ──────────────────────────────────────────────
/// 1단계: 체크포인트 결정 + HTTP 요청
/// ──────────────────────────────────────────────
/// 본문 대응: "HTTP 요청 구성" 코드 블록
pub async fn fetch_bootstrap(
    checkpoint: &str,   // 체크포인트 블록 루트 (32바이트 hex)
                        // 예: "0x85e6151a246e8fdba36db12f8..."
                        // 소스: config.checkpoint 또는 하드코딩 기본값
    rpc: &str,          // Beacon API 엔드포인트
                        // 예: "https://www.lightclientdata.org"
) -> Result<Bootstrap> {
    // URL 구성 — Beacon API 표준 경로
    // 본문 대응: "Beacon API /eth/v1/beacon/light_client/bootstrap/{block_root}"
    let url = format!(
        "{}/eth/v1/beacon/light_client/bootstrap/{}",
        rpc, checkpoint
    );
    // → GET https://www.lightclientdata.org/eth/v1/beacon/light_client/bootstrap/0x85e6...

    // HTTP GET 요청 + JSON 디코딩
    // 본문 대응: "JSON 응답 포맷" 코드 블록
    // 응답 구조:
    //   header: { slot: "8000000", state_root: "0xab12..3e4f", ... }
    //   current_sync_committee: { pubkeys: ["0x8a3f...", ...], aggregate_pubkey: "0x6d2e..." }
    //   current_sync_committee_branch: ["0x1234...", "0x2345...", "0x3456...", "0x4567...", "0x5678..."]
    let resp = reqwest::get(&url).await?;
    let boot: Bootstrap = resp.json().await?;
    // serde가 JSON → Rust 구조체로 변환:
    //   slot: String "8000000" → u64 8000000
    //   pubkeys: hex String → [u8; 48] (BLS12-381 G1 점)
    //   branch: hex String → B256 (32바이트 해시)

    Ok(boot)
}

/// ──────────────────────────────────────────────
/// 2단계: committee_branch Merkle 검증 + Store 초기화
/// ──────────────────────────────────────────────
/// 본문 대응: "committee_branch 검증" + "Store 초기화" 코드 블록
pub fn init_store(
    boot: &Bootstrap,
) -> Result<LightClientStore> {
    // ── committee_branch Merkle 검증 ──
    // 본문 대응: "이 검증이 부트스트랩에서 가장 중요"
    //
    // committee의 SSZ hash tree root를 계산하고,
    // branch(5개 형제 해시)로 state_root까지 복원해서 일치하는지 확인
    //
    // generalized_index = 54 = 2^5 + 22
    //   → BeaconState SSZ tree의 depth=5, 22번째 필드가 current_sync_committee
    //
    // 검증 과정 (본문 Viz Step 2에 대응):
    //   level 0: hash(committee_root || branch[0])
    //   level 1: hash(result || branch[1])
    //   level 2: hash(branch[2] || result)  ← index 비트에 따라 좌우 결정
    //   level 3: hash(result || branch[3])
    //   level 4: hash(branch[4] || result)
    //   = computed_root → state_root와 비교
    let committee_root = boot.current_sync_committee
        .tree_hash_root();  // ssz_hash_tree_root(512개 pubkey)
    let valid = is_valid_merkle_branch(
        &committee_root,                        // 리프: 위원회 해시
        &boot.current_sync_committee_branch,    // 5개 형제 해시
        5,                                      // depth = 5
        22,                                     // index = 22 (CURRENT_SYNC_COMMITTEE)
        &boot.header.state_root,                // 목표 루트
    );
    if !valid {
        // 본문 대응: "에러 케이스" — InvalidCommitteeBranch
        // 원인: 체크포인트 서버가 가짜 위원회를 보냈거나,
        //       branch 데이터가 손상됨
        return Err(eyre!("invalid committee branch"));
    }

    // ── LightClientStore 초기화 ──
    // 본문 대응: "Store 초기화 (각 필드의 의미)" + Viz Step 3
    Ok(LightClientStore {
        // 확정된 헤더 — 이후 모든 검증의 기준점
        // Reth 대비: Reth는 Pipeline 전체 실행 후 최신 블록에 도달
        //            Helios는 이 헤더 하나로 시작
        finalized_header: boot.header.clone(),
        // slot=8000000, state_root=0xab12..

        // 현재 위원회 — 이후 BLS 서명 검증에 사용
        // 256에폭(~27시간)마다 교체 → helios-consensus 아티클
        current_sync_committee: boot.current_sync_committee.clone(),
        // 512개 G1 공개키 (각 48B) + aggregate_pubkey

        // 다음 위원회 — 아직 없음, 첫 update에서 받음
        // next_sync_committee: None,  (필드가 Option<SyncCommittee>)

        // 낙관적 헤더 — finalized와 동일하게 시작
        // optimistic은 아직 finalized 안 된 최신 헤더를 추적
        optimistic_header: boot.header.clone(),

        // 최대 참여자 수 추적 — 0으로 시작
        // sync committee 참여율이 너무 낮으면 update 거부하는 데 사용
        previous_max_participants: 0,

        // best_valid_update — 아직 없음
        // 여러 update 중 가장 좋은 것을 선택하는 데 사용
        best_valid_update: None,
    })
    // 이 시점부터 sync loop 시작 가능
    // → Beacon API에서 light_client/updates 폴링 시작
}
