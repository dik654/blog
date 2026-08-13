import type { CodeRef } from "@/components/code/types";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function Multiproof(_props: Props) {
  return (
    <section id="multiproof" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Multiproof & Light Client</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {/* ── GeneralizedIndex ── */}
        <h3 className="text-xl font-semibold mt-2 mb-3">
          GeneralizedIndex — 머클 트리 노드 주소
        </h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">
              GeneralizedIndex &mdash; BFS 순서 노드 번호
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-sm text-muted-foreground">
                <p className="mb-1">
                  머클 트리 모든 노드의 고유 번호 (1부터 시작)
                </p>
                <ul className="space-y-0.5">
                  <li>
                    루트 = <strong>1</strong>
                  </li>
                  <li>
                    왼쪽 자식 = <strong>2i</strong>
                  </li>
                  <li>
                    오른쪽 자식 = <strong>2i + 1</strong>
                  </li>
                  <li>
                    부모 = <strong>i / 2</strong>
                  </li>
                  <li>
                    형제 = <strong>i XOR 1</strong>
                  </li>
                </ul>
              </div>
              <div className="text-sm font-mono text-muted-foreground text-center">
                <p>1 (root)</p>
                <p>2 &nbsp;&nbsp;&nbsp; 3</p>
                <p>4 &nbsp; 5 &nbsp; 6 &nbsp; 7</p>
                <p>8 9 ...</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">
              BeaconState 필드의 GeneralizedIndex
            </p>
            <p className="text-xs text-muted-foreground mb-2">
              30개 필드 &rarr; 5-depth 트리
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-center">
              <div className="bg-muted/50 rounded p-2">
                <p className="text-muted-foreground">slot (필드 0)</p>
                <p className="font-mono">index = 32</p>
              </div>
              <div className="bg-muted/50 rounded p-2">
                <p className="text-muted-foreground">fork (필드 1)</p>
                <p className="font-mono">index = 33</p>
              </div>
              <div className="bg-muted/50 rounded p-2">
                <p className="text-muted-foreground">validators (필드 11)</p>
                <p className="font-mono">index = 43</p>
              </div>
              <div className="bg-muted/50 rounded p-2">
                <p className="text-muted-foreground">balances (필드 12)</p>
                <p className="font-mono">index = 44</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">
              <code>GetGeneralizedIndex(schema, path...)</code>
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              경로 예시: <code>["validators", 5, "balance"]</code>
            </p>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>
                <code>"validators"</code> 필드 &rarr; state_root의 특정 자식
                (field index 기반)
              </li>
              <li>
                validators list 인덱스 5 &rarr; data subtree 진입 후 offset
              </li>
              <li>
                Validator struct의 <code>"balance"</code> 필드
              </li>
            </ol>
            <p className="text-xs text-muted-foreground mt-2">
              전체 경로를 하나의 정수 index로 인코딩
            </p>
          </div>
        </div>
        <p>
          <code>GeneralizedIndex</code>는 binary Merkle tree의 node 위치를 하나의 정수로 표현합니다. Root를 1로 두고 왼쪽 child에는 bit 0, 오른쪽 child에는 bit 1을 붙이는 방식이므로 binary representation 자체가 root에서 node까지의 path가 됩니다. Schema path와 collection index를 결합하면 특정 state field가 어느 generalized index에 놓이는지 계산할 수 있습니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          단일 필드 증명 — 형제 해시 목록
        </h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">
              <code>generateProof(tree, targetIndex)</code>
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              target의 GeneralizedIndex &rarr; 루트까지 경로 &rarr; 형제 해시
              목록 수집
            </p>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>
                형제 index = <code>targetIndex XOR 1</code> &rarr; 형제 해시를
                proof에 추가
              </li>
              <li>
                부모로 이동: <code>targetIndex / 2</code>
              </li>
              <li>루트(index=1)까지 반복</li>
            </ol>
            <p className="text-xs text-muted-foreground mt-2">
              깊이 20 트리에서 단일 증명 ={" "}
              <strong>20개 hash (640 bytes)</strong>
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">
              <code>verifyProof(leaf, targetIndex, proof, root)</code>
            </p>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>
                <code>computed = leaf</code>
              </li>
              <li>
                각 sibling과 함께 <code>sha256</code> &mdash; 홀/짝으로 좌우
                결정
              </li>
              <li>
                최종 <code>computed == root</code> 여부 반환
              </li>
            </ol>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">
              Light Client 사용 흐름
            </p>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>sync committee 서명으로 block root 신뢰</li>
              <li>Full node에 "validator[X].balance 증명 요청"</li>
              <li>Full node가 (balance, merkle proof) 반환</li>
              <li>proof 검증 &rarr; 신뢰 가능한 balance</li>
            </ol>
            <div className="grid grid-cols-2 gap-3 mt-3 text-sm text-center">
              <div className="bg-red-500/10 rounded p-2">
                <p className="text-muted-foreground">전체 state</p>
                <p className="font-mono">전체 SSZ bytes</p>
              </div>
              <div className="bg-green-500/10 rounded p-2">
                <p className="text-muted-foreground">단일 balance proof</p>
                <p className="font-mono">value + sibling hashes</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-1">
              실제 크기는 fork schema와 generalized index depth로 계산
            </p>
          </div>
        </div>
        <p>
          한 field의 Merkle proof는 해당 leaf에서 root로 올라가는 동안 만나는 sibling hash의 목록입니다. Verifier는 generalized index의 path bit에 따라 현재 hash와 sibling의 좌우 순서를 정해 root를 재구성하고, 신뢰하는 state root와 비교합니다. Balanced tree에서는 필요한 hash 수가 tree depth에 비례합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          Multiproof — 공유 경로 최적화
        </h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">
              <code>generateMultiproof(tree, targetIndices)</code>
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              여러 필드 동시 증명 시 공유 경로 중복 제거
            </p>
            <ol className="text-sm space-y-1.5 text-muted-foreground list-decimal list-inside">
              <li>
                필요한 모든 노드 수집 &mdash; target + 각 target의 조상 경로
              </li>
              <li>각 노드의 형제가 다른 target 경로에 포함되는지 확인</li>
              <li>포함되지 않은 형제만 proof에 추가 &rarr; 중복 제거</li>
            </ol>
            <div className="grid grid-cols-2 gap-3 mt-3 text-sm text-center">
              <div className="bg-red-500/10 rounded p-2">
                <p className="text-muted-foreground">개별 proof</p>
                <p className="font-mono">각 path의 sibling을 반복 전송</p>
              </div>
              <div className="bg-green-500/10 rounded p-2">
                <p className="text-muted-foreground">Multiproof</p>
                <p className="font-mono">공유 sibling을 한 번만 전송</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">
              메인넷 사용 사례
            </p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>
                <strong>Light client update</strong> &mdash; slot, state_root,
                sync_aggregate 동시 증명
              </li>
              <li>
                <strong>ERC-3668 CCIP-Read</strong> &mdash; state root 대상
                multi-field proof
              </li>
              <li>
                <strong>Portal Network</strong> &mdash; historical state proofs
              </li>
            </ul>
          </div>
        </div>
        <p>
          여러 field를 따로 증명하면 root에 가까운 sibling path가 반복됩니다. Multiproof는 target generalized index 집합을 함께 계산해 이미 target이나 다른 branch에서 복원할 수 있는 hash를 제외합니다. 절감률은 field가 tree에서 얼마나 가까운지에 따라 달라지며, light-client update처럼 연관된 여러 field를 함께 증명할 때 특히 유리합니다.
        </p>

        {/* ── Light Client use case ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Light Client Update — SSZ Multiproof 활용
        </h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">
              <code>LightClientUpdate</code> 구조
            </p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>
                <code>attested_header</code>: <code>BeaconBlockHeader</code>{" "}
                &mdash; 새 슬롯의 block header
              </li>
              <li>
                <code>next_sync_committee</code>: <code>SyncCommittee</code>{" "}
                (512 pubkeys) + <code>next_sync_committee_branch</code> (Merkle
                proof)
              </li>
              <li>
                <code>finalized_header</code>: <code>BeaconBlockHeader</code> +{" "}
                <code>finality_branch</code> (Merkle proof)
              </li>
              <li>
                <code>sync_aggregate</code>: <code>SyncAggregate</code> (512 bit
                flags + aggregate sig) + <code>signature_slot</code>
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">
              검증 절차
            </p>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>
                기존 <code>sync_committee</code>가 <code>attested_header</code>
                에 서명했는지 확인
              </li>
              <li>
                <code>attested_header.state_root</code>에서{" "}
                <code>next_sync_committee</code> merkle proof 검증
              </li>
              <li>
                <code>attested_header.state_root</code>에서{" "}
                <code>finalized_header</code> merkle proof 검증
              </li>
              <li>
                성공 시: next_sync_committee 채택 + finalized_header 업데이트
              </li>
            </ol>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">
              Update 크기 구성
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-center">
              <div>
                <p className="text-muted-foreground">SyncCommittee</p>
                <p className="font-mono">public keys·aggregate key</p>
              </div>
              <div>
                <p className="text-muted-foreground">Branches</p>
                <p className="font-mono">fork별 branch depth</p>
              </div>
              <div>
                <p className="text-muted-foreground">Header</p>
                <p className="font-mono">light-client header schema</p>
              </div>
              <div>
                <p className="text-muted-foreground font-semibold">총 update</p>
                <p className="font-mono font-semibold">SSZ 직렬화로 측정</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              전송량은 update 주기와 fork별 object, 압축·중복 제거 방식에 따라
              달라집니다.
            </p>
          </div>
        </div>
        <p>
          Ethereum light client는 sync committee signature로 header를 인증하고, Merkle branch로 그 header가 가리키는 state root 안의 next sync committee와 finalized checkpoint를 확인합니다. Full BeaconState를 내려받지 않아도 되므로 mobile과 browser처럼 bandwidth와 storage가 제한된 환경에서 사용할 수 있지만, update 크기와 전송 주기는 fork별 light-client object를 기준으로 측정해야 합니다.
        </p>

        <p className="mt-4 border-l-2 border-amber-500/50 pl-3 text-sm">
          <strong>💡 라이트 클라이언트 핵심</strong> — 싱크 위원회 서명으로 블록
          header를 인증한 뒤, generalized index가 지정한 field의 branch를 state root에 대조합니다. 다만 protocol light-client update가 기본으로 증명하는 field와 임의 validator balance 같은 application proof는 별개의 proof construction이 필요합니다.
        </p>
      </div>
    </section>
  );
}
