import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function FinalizationPruning({ onCodeRef }: Props) {
  return (
    <section id="finalization-pruning" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Finalization & Prune</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef("prune-finalized", codeRefs["prune-finalized"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            Prune()
          </span>
        </div>

        {/* ── Prune 메커니즘 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Fork Choice Tree Pruning — finalized 기반
        </h3>
        <div className="grid grid-cols-1 gap-3 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              Prune 처리 흐름
            </div>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>
                <code>s.nodes[finalized]</code>로 finalized 노드 조회
              </li>
              <li>
                <code>finalNode.Parent = nil</code> — 새 tree root 지정
              </li>
              <li>
                전체 <code>s.nodes</code> 순회 →{" "}
                <code>isDescendantOf(node, finalNode)</code> 아닌 노드 수집
              </li>
              <li>
                non-canonical branches 일괄 <code>delete(s.nodes, root)</code>
              </li>
              <li>
                <code>s.root = finalNode</code> — root 업데이트
              </li>
            </ol>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              isDescendantOf — 후손 확인
            </div>
            <p className="text-sm">
              <code>node</code>에서 <code>cur.Parent</code> 방향으로 순회 →{" "}
              <code>ancestor</code>와 일치하면 true. 포인터 기반이므로 O(depth).
            </p>
          </div>
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
            <div className="text-xs font-semibold text-blue-400 mb-2">
              Pruning 효과 & 빈도
            </div>
            <ul className="text-sm space-y-1">
              <li>
                fork choice tree 크기 유지 — finalized 이전 forks 완전 제거
              </li>
              <li>epoch 경계에서 justification/finalization 규칙을 평가</li>
              <li>
                삭제 노드 수는 실제 fork 수와 구현의 prune threshold에 따라
                달라짐
              </li>
            </ul>
          </div>
        </div>
        <p>
          Finalized checkpoint가 전진하면 fork-choice tree는 그 root의 ancestor와 경쟁 branch를 더 이상 head candidate로 유지할 필요가 없습니다. Pruning은 finalized node를 새 logical root로 만들고 unreachable node와 index를 정리하며, 실제 제거 범위와 비용은 현재 tree shape에 따라 달라집니다.
        </p>

        {/* ── Finality의 불가역성 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Finality의 경제적 불가역성
        </h3>
        <div className="grid grid-cols-1 gap-3 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              Casper FFG 안전성 속성
            </div>
            <p className="text-sm">
              2개 conflicting finalized checkpoints 존재 시 → 전체 stake의 &ge;
              1/3이 slashing 당함.
            </p>
            <p className="text-sm mt-1 text-muted-foreground">
              증명: 각각 &gt;2/3가 서명 → 합집합 &gt;4/3 → 중복 &gt;1/3이 양쪽
              모두 서명 → slashable.
            </p>
          </div>
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
            <div className="text-xs font-semibold text-red-400 mb-2">
              비용을 계산하는 기준
            </div>
            <div className="text-sm grid grid-cols-2 gap-2">
              <div>현재 total active effective balance</div>
              <div>상충 vote를 한 validator의 balance</div>
              <div>최소 &ge;1/3의 slashable overlap</div>
              <div>실제 손실: fork별 slashing 규칙·시장 조건</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border bg-card p-4">
              <div className="text-xs font-semibold text-muted-foreground mb-2">
                PoW 51% 공격
              </div>
              <p className="text-sm">
                외부 연산 자원과 지속 비용으로 체인 선택 경쟁
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-xs font-semibold text-muted-foreground mb-2">
                PoS Casper 공격
              </div>
              <p className="text-sm">
                상충 finality는 최소 1/3 가중치의 slashable 증거를 남김
              </p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              유일한 예외 & 결론
            </div>
            <p className="text-sm">
              예외: social consensus hard fork (2016 DAO fork) 같은 수동 개입 —
              매우 드문 긴급 상황.
            </p>
            <p className="text-sm mt-1">
              finalized block은 신뢰 가능 → exchange/bridge의 출금 확정 기준점.
            </p>
          </div>
        </div>
        <p>
          <strong>상충하는 finality는 최소 1/3 지분의 slashable 위반</strong>을
          뜻합니다. Economic loss는 현재 active balance, correlation penalty와 asset price에 따라 달라지는 값이지 고정 달러 금액이 아닙니다. Exchange와 bridge는 이 finality boundary를 withdrawal confirmation의 중요한 input으로 사용하되 application-specific risk window도 함께 적용합니다.
        </p>

        <p className="mt-4 border-l-2 border-amber-500/50 pl-3 text-sm">
          <strong>💡 트리 프루닝</strong> — finalized 체크포인트가 갱신되면 그
          밖의 old branch를 제거하고 finalized node를 새 tree root로 삼습니다. Conflicting finalized checkpoint가 관찰되면 단순 reorg가 아니라 최소 3분의 1 weight의 slashable behavior와 social recovery가 필요한 safety failure로 다뤄야 합니다.
        </p>
      </div>
    </section>
  );
}
