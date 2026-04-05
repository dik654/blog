import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Topics({ onCodeRef }: Props) {
  return (
    <section id="topics" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">토픽 & 포크 다이제스트</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Prysm은 토픽 이름에 <strong>포크 다이제스트</strong>를 프리픽스로 붙인다.<br />
          포크 다이제스트 = SHA256(제네시스 검증자 루트 + 포크 버전)[:4]
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('message-handler', codeRefs['message-handler'])} />
          <span className="text-[10px] text-muted-foreground self-center">subscribe()</span>
        </div>

        {/* ── 전체 토픽 목록 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Ethereum 2.0 토픽 전체 목록</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 토픽 이름 형식:
// /eth2/{fork_digest}/{name}/ssz_snappy

// fork_digest 계산:
// fork_digest = SHA256(current_fork_version || genesis_validators_root)[:4]
// 예: "6a95a1a9" (Deneb, mainnet)

// 글로벌 토픽 (모든 노드 구독 필수):
// - beacon_block                          // 블록 전파
// - beacon_aggregate_and_proof            // 집계된 attestation
// - voluntary_exit                         // validator 종료
// - proposer_slashing                      // proposer 슬래싱 증거
// - attester_slashing                      // attester 슬래싱 증거
// - bls_to_execution_change                // withdrawal credential 변경 (Capella+)
// - blob_sidecar_{0-5}                     // blob sidecar (Deneb+, 6 subnets)
// - sync_committee_contribution_and_proof  // sync aggregate

// 서브넷 토픽 (validator가 선택 구독):
// - beacon_attestation_{0-63}              // 64 attestation subnets
// - sync_committee_{0-3}                   // 4 sync committee subnets

// 구독 전략:
// 1. 모든 노드: 글로벌 토픽 전부 + 할당된 attestation subnet
// 2. validator: + 자기 committee의 subnet
// 3. aggregator: + 메인넷 가능한 많은 subnet (집계용)

// 총 활성 토픽 수 (일반 노드): ~10개
// 총 활성 토픽 수 (active validator): ~13개
// 총 활성 토픽 수 (aggregator): ~40개+`}
        </pre>
        <p className="leading-7">
          Ethereum 2.0은 <strong>글로벌 + 서브넷</strong> 이중 토픽 구조.<br />
          subnet 분산으로 attestation 대역폭 분산 → 한 노드가 모든 서명 전파 불필요.<br />
          validator만 해당 subnet 구독 → 네트워크 자원 절약.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">주요 토픽</h3>
        <ul>
          <li><code>/eth2/{'{digest}'}/beacon_block/ssz_snappy</code> — 블록 전파</li>
          <li><code>/eth2/{'{digest}'}/beacon_attestation_{'{subnet}'}/ssz_snappy</code> — 어테스테이션</li>
          <li><code>/eth2/{'{digest}'}/sync_committee_{'{subnet}'}/ssz_snappy</code> — 싱크 커미티</li>
        </ul>

        {/* ── 포크 다이제스트 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">포크 다이제스트 — 네트워크 자동 격리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 포크 다이제스트 계산
func computeForkDigest(
    forkVersion [4]byte,
    genesisValidatorsRoot [32]byte,
) [4]byte {
    // SSZ container 해시
    data := ForkData{
        CurrentVersion: forkVersion,
        GenesisValidatorsRoot: genesisValidatorsRoot,
    }
    root := HashTreeRoot(data)
    return [4]byte{root[0], root[1], root[2], root[3]}
}

// 메인넷 fork_digest 연대기:
// Phase0 (2020-12):   b5303f2a
// Altair (2021-10):   afcaaba0
// Bellatrix (2022-09): 4a26c58b (The Merge)
// Capella (2023-04):  bba4da96
// Deneb (2024-03):    6a95a1a9
// Electra (2025 예정): TBD

// 하드포크 전환:
// 1. 포크 epoch N 설정
// 2. epoch N-1까지: old fork_digest 사용
// 3. epoch N부터: new fork_digest 사용
// 4. 일정 시간 overlap (이전 버전 이해)

// 자동 격리 효과:
// 업그레이드 안 한 노드 → 이전 fork_digest 사용
// → 새 fork_digest 토픽 수신 불가 → 자연 disconnect
// → 수동 버전 체크 없이 네트워크 분리 보장

// 크로스-포크 호환:
// - subscribe old + new digest during transition (~4 epochs overlap)
// - 노드는 gradually 이전 digest 구독 해제`}
        </pre>
        <p className="leading-7">
          <strong>fork_digest</strong>가 포크별 네트워크를 암호학적으로 분리.<br />
          업그레이드 안 한 노드는 새 토픽 모름 → 자동 isolate.<br />
          과거 6번의 포크 전환이 모두 이 메커니즘으로 smooth 진행.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 포크 자동 격리</strong> — 하드포크 시 포크 다이제스트가 변경되어 이전 포크 토픽의 메시지가 자연스럽게 무시됨.<br />
          수동 버전 체크 없이 네트워크 분리가 보장되는 설계.
        </p>
      </div>
    </section>
  );
}
