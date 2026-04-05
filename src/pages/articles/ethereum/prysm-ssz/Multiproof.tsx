import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Multiproof(_props: Props) {
  return (
    <section id="multiproof" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Multiproof & Light Client</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── GeneralizedIndex ── */}
        <h3 className="text-xl font-semibold mt-2 mb-3">GeneralizedIndex — 머클 트리 노드 주소</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// GeneralizedIndex: 머클 트리 모든 노드의 고유 번호
// BFS 순서로 할당, 1부터 시작

//                1 (root)
//               / \\
//              2   3
//             / \\ / \\
//            4  5 6  7
//           / \\
//          8   9 ...
//
// 규칙:
// - 루트 = 1
// - 왼쪽 자식 = 2i
// - 오른쪽 자식 = 2i + 1
// - 부모 = i / 2
// - 형제 = i XOR 1

// BeaconState 필드의 GeneralizedIndex (단순화):
// BeaconState에 30개 필드 → 5-depth 트리
//
// slot (필드 0) → path: 0,0,0,0,0 → index = 32
// fork (필드 1) → path: 0,0,0,0,1 → index = 33
// validators (필드 11) → path: 0,1,0,1,1 → index = 43
// balances (필드 12) → path: 0,1,1,0,0 → index = 44

// get_generalized_index(schema, ["validators", 5, "balance"]):
// 1. "validators" 필드 → state_root의 특정 자식
// 2. validators list 안의 인덱스 5
// 3. Validator struct 안의 "balance" 필드
// → 전체 경로를 index로 인코딩

func GetGeneralizedIndex(schema Type, path ...Any) GeneralizedIndex {
    root := GeneralizedIndex(1)
    for _, p := range path {
        if isField(p) {
            fieldIdx := getFieldIndex(schema, p)
            root = root * next_pow2(numFields(schema)) + fieldIdx
        } else if isListIndex(p) {
            // List: index * 2 + 0 (내부), index = length 위치
            root = root * 2  // entering data subtree
            root = root * next_pow2(maxLength(schema)) + p.Index
        }
        schema = advance_schema(schema, p)
    }
    return root
}`}
        </pre>
        <p className="leading-7">
          <strong>GeneralizedIndex</strong>가 SSZ 트리의 주소 시스템.<br />
          BFS 순서 번호로 모든 노드 식별 → path를 단일 정수로 인코딩.<br />
          "validators[5].balance" 같은 경로를 하나의 index 값으로 변환.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">단일 필드 증명 — 형제 해시 목록</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 특정 필드의 merkle proof 생성
//
// target의 GeneralizedIndex → 루트까지 경로 → 형제 해시 목록

func generateProof(
    tree MerkleTree,
    targetIndex GeneralizedIndex,
) []Hash {
    proof := []Hash{}

    for targetIndex > 1 {
        siblingIndex := targetIndex ^ 1  // 형제 index
        proof = append(proof, tree[siblingIndex])
        targetIndex = targetIndex / 2    // 부모로 이동
    }

    return proof
}

// 예시: 깊이 20 트리에서 특정 validator balance 증명
// → 20개 hash (640 bytes)

// 검증 (light client 측):
func verifyProof(
    leaf Hash,              // 증명할 값
    targetIndex GeneralizedIndex,
    proof []Hash,           // 형제 해시 목록
    root Hash,              // 신뢰하는 root
) bool {
    computed := leaf

    for _, sibling := range proof {
        if targetIndex % 2 == 0 {  // 왼쪽 자식
            computed = sha256(computed, sibling)
        } else {                    // 오른쪽 자식
            computed = sha256(sibling, computed)
        }
        targetIndex = targetIndex / 2
    }

    return computed == root
}

// Light client의 사용:
// 1. 검증자가 sync committee 서명으로 block root 신뢰
// 2. Full node에 "validator[X].balance 증명 요청"
// 3. Full node가 (balance, merkle proof) 반환
// 4. Light client가 proof 검증 → 신뢰 가능한 balance

// 효율:
// - 전체 state 다운로드: ~250MB
// - 단일 balance proof: ~640 bytes (depth 20)
// - 40만 배 절약`}
        </pre>
        <p className="leading-7">
          단일 필드 증명 = <strong>루트까지 경로의 형제 해시 목록</strong>.<br />
          검증자가 필드 값 + 형제 해시로 루트 재구성 → 일치 여부 확인.<br />
          O(log n) 해시로 특정 필드 존재 증명.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Multiproof — 공유 경로 최적화</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 여러 필드를 동시 증명할 때 공유 경로 중복 제거

// 예: validators[5], validators[6], validators[10] 동시 증명
// 단일 증명: 20 × 3 = 60 hashes
// Multiproof: 공유 경로 제거 → ~25 hashes

func generateMultiproof(
    tree MerkleTree,
    targetIndices []GeneralizedIndex,
) Multiproof {
    // 1. 필요한 모든 노드 수집
    needed := make(map[GeneralizedIndex]bool)
    for _, idx := range targetIndices {
        // target 자신 필요
        needed[idx] = true
        // target의 조상 경로 필요
        for p := idx/2; p > 0; p /= 2 {
            needed[p] = true
        }
    }

    // 2. 실제 알려진 것 수집 (target + 조상 제외)
    proof := []Hash{}
    indices := []GeneralizedIndex{}
    for idx := range needed {
        sibling := idx ^ 1
        if !needed[sibling] {
            // 형제가 다른 target의 경로에 없으면 proof 필요
            proof = append(proof, tree[sibling])
            indices = append(indices, sibling)
        }
    }

    return Multiproof{
        Leaves: targetIndices,
        Hashes: proof,
        Indices: indices,
    }
}

// 메인넷 사용 사례:
// - Light client update: block header + sync committee proof
//   → 여러 필드(slot, state_root, sync_aggregate) 동시 증명
// - ERC-3668 CCIP-Read: state root 대상 multi-field proof
// - Portal Network: historical state proofs`}
        </pre>
        <p className="leading-7">
          <strong>Multiproof</strong>로 여러 필드 증명 시 공유 경로 중복 제거.<br />
          단일 증명 총합 대비 30~50% 절약 가능.<br />
          light client update, CCIP-Read 등에서 활용.
        </p>

        {/* ── Light Client use case ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Light Client Update — SSZ Multiproof 활용</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Altair 포크 이후 light client sync protocol
// EIP-4444 이전의 public 명세

struct LightClientUpdate {
    // 새 슬롯의 block header
    attested_header: BeaconBlockHeader,

    // next sync committee (현재 싱크 위원회의 증명 필요)
    next_sync_committee: SyncCommittee,  // 512 pubkeys
    next_sync_committee_branch: Vec<Bytes32>,  // Merkle proof (~5 hashes)

    // finalized block
    finalized_header: BeaconBlockHeader,
    finality_branch: Vec<Bytes32>,  // Merkle proof

    // 현재 sync committee 서명
    sync_aggregate: SyncAggregate,  // 512 bit flags + aggregate sig
    signature_slot: Slot,
}

// Light client 검증:
// 1. 기존 sync_committee가 attested_header에 서명했는지 확인
// 2. attested_header.state_root에서 next_sync_committee merkle proof 검증
//    → next_sync_committee_branch로
// 3. attested_header.state_root에서 finalized_header merkle proof 검증
//    → finality_branch로
// 4. 성공 시: next_sync_committee 채택 + finalized_header 업데이트

// 데이터 크기:
// - SyncCommittee: 512 × 48 bytes + 48 bytes = ~25 KB
// - Branches: ~15 hashes × 32 bytes = ~500 bytes
// - BeaconBlockHeader: ~100 bytes
// - Total update: ~26 KB per epoch

// 브라우저/모바일 light client:
// - epoch당 26KB 다운로드
// - 하루 ~5 MB (225 epochs)
// - 모든 validator 관리 불필요 → sync committee만 추적
// - Helios, nimbus-light 등 구현`}
        </pre>
        <p className="leading-7">
          <strong>Light client</strong>가 SSZ multiproof의 대표 사용처.<br />
          sync committee + merkle proof로 full state 없이 상태 검증.<br />
          epoch당 26KB → 모바일/브라우저 환경에서 실용적.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 라이트 클라이언트 핵심</strong> — 싱크 위원회 서명으로 블록 헤더의 상태 루트를 신뢰.<br />
          GeneralizedIndex로 특정 필드(잔고, 슬래싱 등) 증명 요청.<br />
          전체 상태 없이 O(log n) 해시만으로 검증 — 모바일·브라우저에서 가능.
        </p>
      </div>
    </section>
  );
}
