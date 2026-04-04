import CodePanel from '@/components/ui/code-panel';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function BucketOps({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="bucket-ops" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">버킷 연산: 추가, 교체, 삭제</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          K-버킷은 단순 배열이 아니다. 노드 추가/삭제마다 <strong>IP 쿼터, 교체 목록, 활성도 검증</strong>을
          확인한다. go-ethereum <code>table.go</code>의 핵심 로직을 코드 레벨로 추적한다.
        </p>

        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('geth-table-struct', codeRefs['geth-table-struct'])} />
            <span className="text-[10px] text-muted-foreground self-center">table.go — handleAddNode</span>
          </div>
        )}

        <h3>노드 추가: handleAddNode</h3>
        <p>
          FIND_NODE 응답으로 새 노드를 발견하면 <code>addFoundNode</code> → 채널 → <code>handleAddNode</code>로 처리.
          <br />
          동기적으로 한 번에 하나씩 처리하여 경합을 방지한다.
        </p>
        <CodePanel title="handleAddNode 핵심 흐름" lang="go" code={`func (tab *Table) handleAddNode(req addNodeOp) bool {
    d := enode.LogDist(tab.self().ID(), req.node.ID())
    b := tab.bucketAtDistance(d)

    // IP 쿼터 확인: /24 서브넷당 버킷 2개, 테이블 전체 10개
    if !tab.checkIPLimitAndAdd(b, req.node) {
        return false
    }

    // 버킷에 공간 있으면 삽입
    if len(b.entries) < bucketSize {
        tab.addToLiveBucket(b, req.node, req.forceSetLive)
        return true
    }

    // 공간 없으면 → 교체 목록(replacement list)에 추가
    tab.addReplacement(b, req.node)
    return false
}`} annotations={[
          { lines: [2, 3], color: 'sky', note: 'LogDist로 버킷 인덱스 결정' },
          { lines: [5, 8], color: 'amber', note: 'IP 쿼터: 같은 /24에서 최대 2개' },
          { lines: [10, 13], color: 'emerald', note: '빈 자리 있으면 즉시 삽입' },
          { lines: [15, 17], color: 'rose', note: '꽉 차면 교체 대기열로' },
        ]} />

        <h3>교체 목록 (Replacement List)</h3>
        <p>
          버킷이 가득 찼을 때 새 노드를 바로 버리지 않고 <strong>교체 목록</strong>(최대 10개)에 보관한다.
          <br />
          기존 노드가 재검증에서 실패하면, 교체 목록의 가장 최근 노드가 승격된다.
          <br />
          이 구조 덕분에 죽은 노드가 빠지면 즉시 대체 노드로 채울 수 있다.
        </p>

        <h3>노드 삭제: deleteInBucket</h3>
        <p>
          재검증 실패 시 호출. 버킷에서 제거한 뒤, 교체 목록이 비어있지 않으면
          가장 최근 교체 후보를 버킷으로 <strong>승격</strong>시킨다.
        </p>
        <CodePanel title="deleteInBucket" lang="go" code={`func (tab *Table) deleteInBucket(b *bucket, id enode.ID) *tableNode {
    // 버킷에서 노드 제거
    n := b.removeNode(id)
    if n == nil { return nil }

    tab.removeIP(b, n.IP())
    tab.revalidation.nodeRemoved(n)

    // 교체 목록에서 승격
    if len(b.replacements) > 0 {
        rep := b.replacements[len(b.replacements)-1]
        b.replacements = b.replacements[:len(b.replacements)-1]
        tab.addToLiveBucket(b, rep, false)
    }
    return n
}`} annotations={[
          { lines: [2, 4], color: 'sky', note: '버킷에서 노드 제거' },
          { lines: [6, 7], color: 'amber', note: 'IP 해제 + 재검증 큐에서 제거' },
          { lines: [9, 14], color: 'emerald', note: '교체 목록 마지막(가장 최근) → 버킷으로 승격' },
        ]} />

        <h3>상수 정리</h3>
        <div className="not-prose grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
          {[
            { name: 'bucketSize', value: '16', desc: '버킷당 최대 노드' },
            { name: 'maxReplacements', value: '10', desc: '교체 목록 크기' },
            { name: 'bucketIPLimit', value: '2', desc: '/24당 버킷 최대' },
            { name: 'tableIPLimit', value: '10', desc: '/24당 전체 최대' },
            { name: 'alpha', value: '3', desc: '동시 질의 수' },
            { name: 'hashBits', value: '256', desc: 'ID 비트 수' },
          ].map(c => (
            <div key={c.name} className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3">
              <p className="font-mono text-sm font-bold text-indigo-400">{c.name} = {c.value}</p>
              <p className="text-xs text-foreground/60 mt-1">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
