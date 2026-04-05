import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function CheckpointSync({ onCodeRef: _ }: Props) {
  return (
    <section id="checkpoint-sync" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">체크포인트 싱크</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Checkpoint Sync는 Finalized된 상태를 신뢰할 수 있는 소스에서 직접 다운로드한다.<br />
          제네시스부터 재실행하지 않으므로 <strong>수 분</strong>이면 동기화가 완료된다.
        </p>

        {/* ── Checkpoint Sync 구현 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">CheckpointSync 구현 흐름</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// CLI 플래그:
// --checkpoint-sync-url=https://mainnet.checkpoint.sigp.io
// --genesis-beacon-api-url=https://mainnet.checkpoint.sigp.io

func (s *Service) doCheckpointSync(ctx context.Context) error {
    url := s.cfg.CheckpointSyncURL

    // 1. genesis 정보 다운로드
    genesisState, err := fetchGenesisState(url)
    if err != nil { return err }
    // 검증: genesis_validators_root와 config 일치

    // 2. finalized state 다운로드
    // GET /eth/v2/debug/beacon/states/finalized
    stateBytes, err := httpGet(url + "/eth/v2/debug/beacon/states/finalized", "application/octet-stream")
    if err != nil { return err }

    finalizedState := &BeaconState{}
    if err := finalizedState.UnmarshalSSZ(stateBytes); err != nil {
        return err
    }

    // 3. finalized state의 latest_block_header로 block root 계산
    blockRoot, err := finalizedState.LatestBlockHeader.HashTreeRoot()
    // 주의: latest_block_header.state_root는 이 시점 ZERO_HASH
    // 계산 전에 state_root를 기존 값으로 채워줘야 함
    if err != nil { return err }

    // 4. 해당 block 다운로드
    blockBytes, err := httpGet(
        url + "/eth/v2/beacon/blocks/" + hex(blockRoot),
        "application/octet-stream",
    )
    finalizedBlock := &SignedBeaconBlock{}
    finalizedBlock.UnmarshalSSZ(blockBytes)

    // 5. DB 초기화
    // - SaveGenesisState(genesisState)
    // - SaveState(finalizedState)
    // - SaveBlock(finalizedBlock)
    // - SetHead(blockRoot)
    // - SetFinalizedCheckpoint(...)

    // 6. P2P 시작 후 tip까지 regular sync 로 진전

    return nil
}

// 소요 시간:
// - state 다운로드 (~250 MB): 10~30초
// - genesis state: 1초
// - 검증: 5초
// - 총: 수 분 (네트워크 속도 따라)`}
        </pre>
        <p className="leading-7">
          Checkpoint Sync는 <strong>수 분 내 완료</strong>.<br />
          finalized state + block 2개 다운로드 → DB 초기화.<br />
          이후 regular sync로 tip까지 진전 (수 시간).
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">동작 과정</h3>
        <ul>
          <li><strong>체크포인트 URL 설정</strong> — <code>--checkpoint-sync-url</code> 플래그로 지정</li>
          <li><strong>Finalized State 다운로드</strong> — /eth/v2/debug/beacon/states/finalized</li>
          <li><strong>Finalized Block 다운로드</strong> — 해당 상태의 블록도 함께 받음</li>
          <li><strong>DB 초기화</strong> — 다운로드한 상태·블록으로 DB를 설정</li>
        </ul>

        {/* ── 신뢰 소스 비교 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">신뢰할 수 있는 체크포인트 소스</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 공개 checkpoint sync URLs (2025):
//
// Ethereum Mainnet:
// - https://mainnet.checkpoint.sigp.io (Sigma Prime/Lighthouse)
// - https://beaconstate.info (독립 운영)
// - https://sync.invis.tools (Invis)
// - https://checkpointz.pietjepuk.net (커뮤니티)
// - https://beaconstate.ethstaker.cc (EthStaker)
//
// Testnet (Holesky):
// - https://holesky.checkpoint.sigp.io
//
// OP Mainnet (Optimism):
// - https://op-sepolia.checkpoint.sigp.io

// 신뢰 검증:
// 1. 여러 소스에서 같은 checkpoint 가져오기
// 2. state_root / block_root 비교
// 3. 모두 일치하면 신뢰
// 4. 불일치 → 다른 소스 시도

// Weak subjectivity check:
// - checkpoint가 현재 finalized checkpoint의 최근 WS_PERIOD 내여야 함
// - 메인넷 WS_PERIOD ≈ 256 epochs (~27시간)
// - 너무 오래된 checkpoint는 거부

// 보안 고려사항:
// - TLS 필수 (MITM 방지)
// - HTTPS 검증된 CA 사용
// - Self-hosted checkpoint 운영 가능 (조직 내부)

// 자체 운영 시:
// Prysm beacon-chain에서:
// HTTP API endpoint /eth/v2/debug/beacon/states/finalized 제공
// 이를 다른 node가 checkpoint source로 사용 가능`}
        </pre>
        <p className="leading-7">
          <strong>Checkpoint URL</strong>은 신뢰 단일점 — 선택 중요.<br />
          여러 source 비교로 검증 → 조작 감지.<br />
          Weak subjectivity period 내에서만 안전.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 Weak Subjectivity 보안</strong> — 체크포인트 싱크는 Weak Subjectivity Period 내에서만 안전.<br />
          이 기간이 지나면 공격자가 가짜 상태를 주입할 수 있어 신뢰할 수 있는 소스(Infura, Lodestar 등) 선택이 보안의 핵심.
        </p>
      </div>
    </section>
  );
}
