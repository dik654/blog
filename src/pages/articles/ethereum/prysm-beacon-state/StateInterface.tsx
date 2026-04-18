import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import COWDetailViz from './viz/COWDetailViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function StateInterface({ onCodeRef }: Props) {
  return (
    <section id="state-interface" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">상태 인터페이스 & Copy-on-Write</h2>
      <div className="not-prose mb-8"><COWDetailViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('state-copy', codeRefs['state-copy'])} />
          <span className="text-[10px] text-muted-foreground self-center">NewBeaconState()</span>
        </div>

        {/* ── COW 동작 원리 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Copy-on-Write — 참조 카운트 기반</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2"><code>BeaconState</code> 구조체</p>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li><code>state *ethpb.BeaconState</code> &mdash; raw struct</li>
              <li><code>tries map[FieldIndex]*FieldTrie</code> &mdash; 각 필드별 merkle 캐시</li>
              <li><code>sharedFieldReferences map[FieldIndex]*Reference</code> &mdash; COW 참조 카운트</li>
              <li><code>dirtyFields map[FieldIndex]bool</code> &mdash; 변경된 필드 추적</li>
              <li><code>dirtyIndices map[FieldIndex][]uint64</code> &mdash; 변경된 인덱스 추적</li>
            </ul>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-green-500/30 p-4">
              <p className="font-semibold text-sm text-green-400 mb-2"><code>Copy()</code> &mdash; O(1) 복사</p>
              <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
                <li>포인터만 복사 (struct deep copy 아님)</li>
                <li>tries, sharedFieldReferences 공유</li>
                <li>각 필드의 reference count 증가</li>
              </ol>
            </div>
            <div className="rounded-lg border border-amber-500/30 p-4">
              <p className="font-semibold text-sm text-amber-400 mb-2"><code>SetValidators()</code> &mdash; 쓰기 시 복사</p>
              <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
                <li><code>ref.Refs() &gt; 1</code>? &rarr; deep copy 실행</li>
                <li>새 <code>Reference(count: 1)</code> 생성</li>
                <li>실제 값 변경 + <code>dirtyFields</code> 마킹</li>
              </ol>
            </div>
          </div>
        </div>
        <p className="leading-7">
          COW는 <strong>참조 카운트로 공유 여부 판단</strong>.<br />
          Copy()는 참조 카운터만 증가 → O(1) 연산.<br />
          Setter 호출 + ref count &gt; 1 시점에만 실제 deep copy.
        </p>

        {/* ── 메모리 효과 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">메모리 효과 — fork choice 분기 시나리오</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">10개 state 유지 시나리오</p>
            <div className="grid grid-cols-2 gap-3 text-sm text-center">
              <div className="bg-red-500/10 rounded p-2">
                <p className="text-muted-foreground">naive 복사</p>
                <p className="font-mono">10 x 250 MB = <strong>2.5 GB</strong></p>
              </div>
              <div className="bg-green-500/10 rounded p-2">
                <p className="text-muted-foreground">COW 복사</p>
                <p className="font-mono">250 MB + ~50 MB = <strong>~300 MB</strong></p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Copy 직후 포인터만 공유 &rarr; Setter 호출 시 변경 필드만 복사 (~수 MB)
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-green-500/30 p-4">
              <p className="font-semibold text-sm text-green-400 mb-2">장점</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>메모리 효율 (10배 절감)</li>
                <li>Copy 비용 O(1)</li>
                <li>GC 부담 최소</li>
              </ul>
            </div>
            <div className="rounded-lg border border-red-500/30 p-4">
              <p className="font-semibold text-sm text-red-400 mb-2">트레이드오프</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>참조 카운트 관리 overhead (mutex lock)</li>
                <li>race condition 가능성 (정밀한 동기화 필요)</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="leading-7">
          COW로 <strong>fork choice 메모리 사용 10배 절감</strong>.<br />
          10개 state 유지: naive 2.5GB vs COW 300MB.<br />
          구조 공유 + 변경 필드만 개별 복사 → GC 부담 최소.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 참조 카운트 기반 COW</strong> — Setter 호출 시 참조 카운트가 1보다 크면 해당 필드만 깊은 복사.<br />
          포크 선택 시 다수의 상태 분기를 메모리 효율적으로 관리.<br />
          Go의 슬라이스 특성을 활용해 내부 배열 공유.
        </p>
      </div>
    </section>
  );
}
