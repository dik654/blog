import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import COWDetailViz from "./viz/COWDetailViz";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function StateInterface({ onCodeRef }: Props) {
  return (
    <section id="state-interface" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        상태 인터페이스 & Copy-on-Write
      </h2>
      <div className="not-prose mb-8">
        <COWDetailViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() => onCodeRef("state-copy", codeRefs["state-copy"])}
          />
          <span className="text-xs text-muted-foreground self-center">
            NewBeaconState()
          </span>
        </div>

        {/* ── COW 동작 원리 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Copy-on-Write — 참조 카운트 기반
        </h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">
              <code>BeaconState</code> 구조체
            </p>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li>
                <code>state *ethpb.BeaconState</code> &mdash; raw struct
              </li>
              <li>
                <code>tries map[FieldIndex]*FieldTrie</code> &mdash; 각 필드별
                merkle 캐시
              </li>
              <li>
                <code>sharedFieldReferences map[FieldIndex]*Reference</code>{" "}
                &mdash; COW 참조 카운트
              </li>
              <li>
                <code>dirtyFields map[FieldIndex]bool</code> &mdash; 변경된 필드
                추적
              </li>
              <li>
                <code>dirtyIndices map[FieldIndex][]uint64</code> &mdash; 변경된
                인덱스 추적
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-green-500/30 p-4">
              <p className="font-semibold text-sm text-green-400 mb-2">
                <code>Copy()</code> &mdash; O(1) 복사
              </p>
              <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
                <li>포인터만 복사 (struct deep copy 아님)</li>
                <li>tries, sharedFieldReferences 공유</li>
                <li>각 필드의 reference count 증가</li>
              </ol>
            </div>
            <div className="rounded-lg border border-amber-500/30 p-4">
              <p className="font-semibold text-sm text-amber-400 mb-2">
                <code>SetValidators()</code> &mdash; 쓰기 시 복사
              </p>
              <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
                <li>
                  <code>ref.Refs() &gt; 1</code>? &rarr; deep copy 실행
                </li>
                <li>
                  새 <code>Reference(count: 1)</code> 생성
                </li>
                <li>
                  실제 값 변경 + <code>dirtyFields</code> 마킹
                </li>
              </ol>
            </div>
          </div>
        </div>
        <p>
          Copy-on-Write state는 ref count로 backing field가 다른 state view와 공유되는지 추적합니다. <code>Copy()</code>는 공유 가능한 field의 reference를 늘려 초기 clone 비용을 작게 만들고, setter가 shared field를 바꾸려 할 때만 해당 backing data를 분리합니다. 모든 field와 metadata가 같은 방식으로 O(1) copy된다고 단정하지 말고 current implementation의 exception을 확인해야 합니다.
        </p>

        {/* ── 메모리 효과 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          메모리 효과 — fork choice 분기 시나리오
        </h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">
              여러 fork state 유지 시나리오
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm text-center">
              <div className="bg-red-500/10 rounded p-2">
                <p className="text-muted-foreground">naive 복사</p>
                <p className="font-mono">
                  <strong>state 수 × 전체 backing data</strong>
                </p>
              </div>
              <div className="bg-green-500/10 rounded p-2">
                <p className="text-muted-foreground">COW 복사</p>
                <p className="font-mono">
                  <strong>공유 backing + dirty field copy</strong>
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Copy 직후 공유 가능한 backing을 참조하고 setter가 변경하는 field만
              분리
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-green-500/30 p-4">
              <p className="font-semibold text-sm text-green-400 mb-2">장점</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>중복 allocation 감소</li>
                <li>초기 copy 범위 축소</li>
                <li>fork 수가 늘 때 GC pressure 완화</li>
              </ul>
            </div>
            <div className="rounded-lg border border-red-500/30 p-4">
              <p className="font-semibold text-sm text-red-400 mb-2">
                트레이드오프
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>참조 카운트 관리 overhead (mutex lock)</li>
                <li>race condition 가능성 (정밀한 동기화 필요)</li>
              </ul>
            </div>
          </div>
        </div>
        <p>
          Fork choice가 인접한 여러 block state를 보관할 때 대부분의 large field는 동일하므로 COW는 duplicate allocation을 크게 줄일 수 있습니다. 절감률은 fork 수, dirty field와 validator-set size에 따라 달라지므로 고정된 10배 수치보다 heap profile에서 shared backing data, copied byte와 GC pause를 비교해야 합니다.
        </p>

        <p className="mt-4 border-l-2 border-amber-500/50 pl-3 text-sm">
          <strong>💡 참조 카운트 기반 COW</strong> — Setter 호출 시 참조
          count가 1보다 크면 mutation 대상 field의 backing data를 분리합니다. Go slice의 shared backing array를 활용하므로 setter가 이 guard를 우회하면 state branch가 서로 오염될 수 있어 mutation API boundary가 중요합니다.
        </p>
      </div>
    </section>
  );
}
