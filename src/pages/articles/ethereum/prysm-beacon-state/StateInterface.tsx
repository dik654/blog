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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Prysm의 BeaconState는 COW로 메모리 효율화
// 여러 state snapshot이 같은 filed를 공유, 변경 시에만 복사

type BeaconState struct {
    state *ethpb.BeaconState  // raw struct
    lock sync.RWMutex

    // 각 필드별 FieldTrie (위 아티클 참고)
    tries map[types.FieldIndex]*stateutil.FieldTrie

    // COW 관리용
    sharedFieldReferences map[types.FieldIndex]*stateutil.Reference
    dirtyFields map[types.FieldIndex]bool
    dirtyIndices map[types.FieldIndex][]uint64

    valMapHandler *stateValidators.ValidatorsMapHandler
}

// Copy() 동작:
func (b *BeaconState) Copy() *BeaconState {
    newState := &BeaconState{
        state: b.state,  // struct 복사 아님, 포인터만
        tries: b.tries,  // map 공유
        sharedFieldReferences: b.sharedFieldReferences,
    }

    // 각 필드의 reference count 증가
    for field := range b.sharedFieldReferences {
        b.sharedFieldReferences[field].AddRef()
    }
    return newState  // O(1) 복사!
}

// SetXxx 호출 시 deep copy:
func (b *BeaconState) SetValidators(vals []*Validator) {
    ref := b.sharedFieldReferences[types.Validators]
    if ref.Refs() > 1 {
        // 다른 state와 공유 중 → deep copy 필요
        newVals := make([]*Validator, len(b.state.Validators))
        copy(newVals, b.state.Validators)
        b.state.Validators = newVals
        ref.MinusRef()

        // 새 reference 생성 (ref=1)
        b.sharedFieldReferences[types.Validators] = &Reference{count: 1}
    }
    // 실제 변경
    b.state.Validators = vals
    b.dirtyFields[types.Validators] = true
}`}
        </pre>
        <p className="leading-7">
          COW는 <strong>참조 카운트로 공유 여부 판단</strong>.<br />
          Copy()는 참조 카운터만 증가 → O(1) 연산.<br />
          Setter 호출 + ref count &gt; 1 시점에만 실제 deep copy.
        </p>

        {/* ── 메모리 효과 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">메모리 효과 — fork choice 분기 시나리오</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Prysm은 fork choice 중 다수 state snapshot 유지
// canonical chain + 여러 fork 후보

// naive 복사:
// 10개 state 유지 × 250 MB = 2.5 GB
// 메모리 부담 + GC 압박

// COW 복사:
// state copy 직후: 여전히 250 MB (구조만 공유)
// setter 호출 시: 변경된 필드만 복사 (~수 MB)
// 10개 state 유지: ~250 MB + ~50 MB (변경 필드) = ~300 MB

// 예: validators 필드만 변경
// - 공유: pubkey, credentials (99% 불변)
// - 복사: balance, participation (매 슬롯 변경)
// → 전체의 ~10%만 복사

// Fork choice 중 state 관리:
// 매 slot 업데이트 → 10개 state 전부 Copy() → Setter 호출
// naive: 10 × 250 MB = 2.5 GB 매번 할당
// COW: 변경분만 ~50 MB 할당 → GC 부담 최소

// trade-off:
// + 메모리 효율
// + Copy 비용 O(1)
// - 참조 카운트 관리 overhead (mutex lock)
// - race condition 가능성 (정밀한 동기화 필요)`}
        </pre>
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
