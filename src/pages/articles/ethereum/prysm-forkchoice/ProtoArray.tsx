import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function ProtoArray({ onCodeRef }: Props) {
  return (
    <section id="protoarray" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">doubly-linked-tree</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('fc-store', codeRefs['fc-store'])} />
          <span className="text-[10px] text-muted-foreground self-center">ForkChoiceStore 구조체</span>
        </div>

        {/* ── proto-array vs doubly-linked-tree ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">proto-array → doubly-linked-tree 전환</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Prysm의 fork choice 자료구조 진화:
//
// Phase 1: proto-array (2021~2023)
// - 단일 배열 + index 기반 tree
// - 삽입: O(1) (배열 끝에 추가)
// - 삭제: O(N) (prune 시 전체 재배열)
// - 메모리 연속 → 캐시 효율 좋음
// - 단점: finality 후 old nodes 삭제가 느림

// Phase 2: doubly-linked-tree (2023~)
// - 명시적 포인터 기반 tree
// - 삽입: O(1)
// - 삭제: O(1) (포인터만 조정)
// - 메모리 분산 → 캐시 효율 낮음
// - finality 후 빠른 pruning

// proto-array 구조:
type ProtoArray struct {
    nodes []ProtoNode        // 순차 배열
    indices map[Root]int     // root → array index
}
type ProtoNode struct {
    Root Root
    ParentIndex int          // 배열 인덱스 참조
    Weight uint64
    BestChildIndex int
    BestDescendantIndex int
}

// doubly-linked-tree 구조:
type Store struct {
    nodesLock sync.RWMutex
    nodes map[Root]*Node     // root → Node pointer
    root *Node               // tree root
}
type Node struct {
    Root Root
    Parent *Node             // 부모 포인터
    Children []*Node         // 자식 포인터 slice
    BestChild *Node
    BestDescendant *Node
    Weight uint64
    Slot Slot
    ...
}

// 전환 이유:
// 1. finality 후 pruning 성능 (대부분 이유)
//    proto-array: 전체 배열 재구성 → O(N)
//    doubly-linked-tree: parent 포인터만 끊으면 됨 → O(1)
//
// 2. 구현 단순성 (포인터가 더 직관적)
//
// 3. 메모리 단편화 문제
//    Go GC가 포인터 기반 구조체 잘 처리`}
        </pre>
        <p className="leading-7">
          Prysm은 <strong>proto-array → doubly-linked-tree 전환</strong>.<br />
          pruning 성능 개선 (O(N) → O(1)) → finality 후 메모리 관리 효율.<br />
          포인터 기반 구조로 코드 단순화 + Go GC 친화적.
        </p>

        {/* ── bestDescendant 캐싱 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">bestDescendant 캐싱 — O(depth) head 계산</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 각 노드가 자기 서브트리에서 가장 "무거운" descendant 캐싱
// head 계산 시 서브트리 전체 탐색 불필요

type Node struct {
    Root Root
    Weight uint64              // 자기 weight
    Parent *Node
    Children []*Node
    BestChild *Node            // 가장 무거운 자식
    BestDescendant *Node       // 가장 무거운 descendant (리프 방향)
}

// GetHead(root) 단순화:
func GetHead() Root {
    // root에서 bestDescendant로 직접 점프
    node := s.root
    for node.BestDescendant != nil {
        node = node.BestDescendant
    }
    return node.Root
}

// BestDescendant 업데이트 (bottom-up):
// 노드 weight 변경 시 (attestation 추가) 부모 방향으로 전파

func (s *Store) updateBestDescendant(node *Node) {
    for node.Parent != nil {
        parent := node.Parent

        // 부모의 best child 재선정
        var bestChild *Node
        var maxWeight uint64
        for _, child := range parent.Children {
            if child.Weight > maxWeight ||
               (child.Weight == maxWeight && isLexSmaller(child.Root, bestChild.Root)) {
                bestChild = child
                maxWeight = child.Weight
            }
        }

        if parent.BestChild != bestChild {
            parent.BestChild = bestChild
            parent.BestDescendant = bestChild.BestDescendant
            // or bestChild if it's a leaf
        }

        node = parent  // 상위로 전파
    }
}

// 결과:
// - head 쿼리: O(1) (캐시된 BestDescendant)
// - attestation 추가: O(depth) (부모 방향 업데이트)
// - 메인넷 depth ~10-15 → 실용적`}
        </pre>
        <p className="leading-7">
          <strong>BestDescendant 캐싱</strong>으로 head 계산 O(1).<br />
          attestation 추가 시 부모 방향으로만 업데이트 → O(depth).<br />
          매 슬롯 수만 attestation 처리하는 메인넷 부하에 대응.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 배열 → 트리 전환</strong> — proto-array(배열)에서 doubly-linked-tree로 교체.<br />
          삽입 O(1), 삭제 O(1) — 포인터 변경만으로 finality 후 프루닝.<br />
          bestDescendant 캐싱으로 computeHead 시 서브트리 재탐색 불필요.
        </p>
      </div>
    </section>
  );
}
