import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Multiproof(_props: Props) {
  return (
    <section id="multiproof" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Multiproof & Light Client</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── GeneralizedIndex ── */}
        <h3 className="text-xl font-semibold mt-2 mb-3">GeneralizedIndex — 머클 트리 노드 주소</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">GeneralizedIndex &mdash; BFS 순서 노드 번호</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-sm text-muted-foreground">
                <p className="mb-1">머클 트리 모든 노드의 고유 번호 (1부터 시작)</p>
                <ul className="space-y-0.5">
                  <li>루트 = <strong>1</strong></li>
                  <li>왼쪽 자식 = <strong>2i</strong></li>
                  <li>오른쪽 자식 = <strong>2i + 1</strong></li>
                  <li>부모 = <strong>i / 2</strong></li>
                  <li>형제 = <strong>i XOR 1</strong></li>
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
            <p className="font-semibold text-sm text-green-400 mb-2">BeaconState 필드의 GeneralizedIndex</p>
            <p className="text-xs text-muted-foreground mb-2">30개 필드 &rarr; 5-depth 트리</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-center">
              <div className="bg-muted/50 rounded p-2"><p className="text-muted-foreground">slot (필드 0)</p><p className="font-mono">index = 32</p></div>
              <div className="bg-muted/50 rounded p-2"><p className="text-muted-foreground">fork (필드 1)</p><p className="font-mono">index = 33</p></div>
              <div className="bg-muted/50 rounded p-2"><p className="text-muted-foreground">validators (필드 11)</p><p className="font-mono">index = 43</p></div>
              <div className="bg-muted/50 rounded p-2"><p className="text-muted-foreground">balances (필드 12)</p><p className="font-mono">index = 44</p></div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2"><code>GetGeneralizedIndex(schema, path...)</code></p>
            <p className="text-sm text-muted-foreground mb-2">경로 예시: <code>["validators", 5, "balance"]</code></p>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li><code>"validators"</code> 필드 &rarr; state_root의 특정 자식 (field index 기반)</li>
              <li>validators list 인덱스 5 &rarr; data subtree 진입 후 offset</li>
              <li>Validator struct의 <code>"balance"</code> 필드</li>
            </ol>
            <p className="text-xs text-muted-foreground mt-2">전체 경로를 하나의 정수 index로 인코딩</p>
          </div>
        </div>
        <p className="leading-7">
          <strong>GeneralizedIndex</strong>가 SSZ 트리의 주소 시스템.<br />
          BFS 순서 번호로 모든 노드 식별 → path를 단일 정수로 인코딩.<br />
          "validators[5].balance" 같은 경로를 하나의 index 값으로 변환.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">단일 필드 증명 — 형제 해시 목록</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2"><code>generateProof(tree, targetIndex)</code></p>
            <p className="text-sm text-muted-foreground mb-2">target의 GeneralizedIndex &rarr; 루트까지 경로 &rarr; 형제 해시 목록 수집</p>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>형제 index = <code>targetIndex XOR 1</code> &rarr; 형제 해시를 proof에 추가</li>
              <li>부모로 이동: <code>targetIndex / 2</code></li>
              <li>루트(index=1)까지 반복</li>
            </ol>
            <p className="text-xs text-muted-foreground mt-2">깊이 20 트리에서 단일 증명 = <strong>20개 hash (640 bytes)</strong></p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2"><code>verifyProof(leaf, targetIndex, proof, root)</code></p>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li><code>computed = leaf</code></li>
              <li>각 sibling과 함께 <code>sha256</code> &mdash; 홀/짝으로 좌우 결정</li>
              <li>최종 <code>computed == root</code> 여부 반환</li>
            </ol>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">Light Client 사용 흐름</p>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>sync committee 서명으로 block root 신뢰</li>
              <li>Full node에 "validator[X].balance 증명 요청"</li>
              <li>Full node가 (balance, merkle proof) 반환</li>
              <li>proof 검증 &rarr; 신뢰 가능한 balance</li>
            </ol>
            <div className="grid grid-cols-2 gap-3 mt-3 text-sm text-center">
              <div className="bg-red-500/10 rounded p-2"><p className="text-muted-foreground">전체 state</p><p className="font-mono">~250 MB</p></div>
              <div className="bg-green-500/10 rounded p-2"><p className="text-muted-foreground">단일 balance proof</p><p className="font-mono">~640 bytes</p></div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-1">40만 배 절약</p>
          </div>
        </div>
        <p className="leading-7">
          단일 필드 증명 = <strong>루트까지 경로의 형제 해시 목록</strong>.<br />
          검증자가 필드 값 + 형제 해시로 루트 재구성 → 일치 여부 확인.<br />
          O(log n) 해시로 특정 필드 존재 증명.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Multiproof — 공유 경로 최적화</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2"><code>generateMultiproof(tree, targetIndices)</code></p>
            <p className="text-sm text-muted-foreground mb-2">여러 필드 동시 증명 시 공유 경로 중복 제거</p>
            <ol className="text-sm space-y-1.5 text-muted-foreground list-decimal list-inside">
              <li>필요한 모든 노드 수집 &mdash; target + 각 target의 조상 경로</li>
              <li>각 노드의 형제가 다른 target 경로에 포함되는지 확인</li>
              <li>포함되지 않은 형제만 proof에 추가 &rarr; 중복 제거</li>
            </ol>
            <div className="grid grid-cols-2 gap-3 mt-3 text-sm text-center">
              <div className="bg-red-500/10 rounded p-2"><p className="text-muted-foreground">단일 증명 3개</p><p className="font-mono">20 x 3 = 60 hashes</p></div>
              <div className="bg-green-500/10 rounded p-2"><p className="text-muted-foreground">Multiproof</p><p className="font-mono">~25 hashes</p></div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">메인넷 사용 사례</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><strong>Light client update</strong> &mdash; slot, state_root, sync_aggregate 동시 증명</li>
              <li><strong>ERC-3668 CCIP-Read</strong> &mdash; state root 대상 multi-field proof</li>
              <li><strong>Portal Network</strong> &mdash; historical state proofs</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          <strong>Multiproof</strong>로 여러 필드 증명 시 공유 경로 중복 제거.<br />
          단일 증명 총합 대비 30~50% 절약 가능.<br />
          light client update, CCIP-Read 등에서 활용.
        </p>

        {/* ── Light Client use case ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Light Client Update — SSZ Multiproof 활용</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2"><code>LightClientUpdate</code> 구조</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code>attested_header</code>: <code>BeaconBlockHeader</code> &mdash; 새 슬롯의 block header</li>
              <li><code>next_sync_committee</code>: <code>SyncCommittee</code> (512 pubkeys) + <code>next_sync_committee_branch</code> (Merkle proof)</li>
              <li><code>finalized_header</code>: <code>BeaconBlockHeader</code> + <code>finality_branch</code> (Merkle proof)</li>
              <li><code>sync_aggregate</code>: <code>SyncAggregate</code> (512 bit flags + aggregate sig) + <code>signature_slot</code></li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">검증 절차</p>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>기존 <code>sync_committee</code>가 <code>attested_header</code>에 서명했는지 확인</li>
              <li><code>attested_header.state_root</code>에서 <code>next_sync_committee</code> merkle proof 검증</li>
              <li><code>attested_header.state_root</code>에서 <code>finalized_header</code> merkle proof 검증</li>
              <li>성공 시: next_sync_committee 채택 + finalized_header 업데이트</li>
            </ol>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">데이터 크기</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-center">
              <div><p className="text-muted-foreground">SyncCommittee</p><p className="font-mono">~25 KB</p></div>
              <div><p className="text-muted-foreground">Branches</p><p className="font-mono">~500 bytes</p></div>
              <div><p className="text-muted-foreground">Header</p><p className="font-mono">~100 bytes</p></div>
              <div><p className="text-muted-foreground font-semibold">총 update</p><p className="font-mono font-semibold">~26 KB/epoch</p></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">하루 ~5 MB (225 epochs) &mdash; 브라우저/모바일에서 실용적 (Helios, nimbus-light 등)</p>
          </div>
        </div>
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
