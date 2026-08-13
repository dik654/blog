import { codeRefs } from "./codeRefs";
import RecheckViz from "./viz/RecheckViz";
import type { CodeRef } from "@/components/code/types";

export default function Recheck({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="recheck" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-2">Recheck & block 반영</h2>
      <p className="text-sm text-muted-foreground mb-6">
        아래 구현 세부는 legacy CList/flood mempool snapshot이다. 현재 mode마다
        저장 구조와 recheck 지원 범위가 다르지만, 새 head를 기준으로 pending
        set을 다시 맞춘다는 lifecycle은 공통이다.
      </p>
      <div className="not-prose mb-8">
        <RecheckViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {/* ── Update 메서드 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">
          Mempool.Update — 블록 커밋 후 정리
        </h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4 sm:col-span-2">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
              Update() 3단계 흐름
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                <strong>1. PreCheck/PostCheck 갱신</strong> — 새 높이에 맞춘
                필터 함수 교체
              </p>
              <p>
                <strong>2. 블록 TX 제거</strong> — 성공 TX → cache 유지 (중복
                방지) / 실패 TX → cache 제거 / 모두{" "}
                <code className="text-xs">removeTx(tx)</code>
              </p>
              <p>
                <strong>3. Recheck</strong> —{" "}
                <code className="text-xs">config.Recheck</code> true면{" "}
                <code className="text-xs">recheckTxs()</code> 호출
              </p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">
              recheckTxs() 동작
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                mempool 전체 TX 순회 (
                <code className="text-xs">txs.Front()</code> →{" "}
                <code className="text-xs">Next()</code>)
              </p>
              <p>
                각 TX에{" "}
                <code className="text-xs">CheckTxAsync(Type_Recheck)</code> 호출
              </p>
              <p>실패 시 callback에서 자동 제거</p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">
              Recheck가 필요한 경우
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>블록 N: TX(A→B, 10 ETH) 실행 → A 잔고 100→90</p>
              <p>mempool의 TX(A→C, 95 ETH) — 이전엔 유효, 지금은 잔고 부족</p>
              <p>
                재검증하지 않으면 proposer가 stale transaction을 후보에 남겨
                application 검증 비용과 block 공간을 낭비할 수 있음
              </p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <strong>Recheck</strong>는 block 반영 뒤 남은 transaction을 새
          application state와 다시 맞추는 선택적 전략이다.
          지원 mode에서는 무효 transaction을 일찍 제거해 다음 proposal 후보
          품질을 높이지만,
          다른 mode는 별도의 재검증·선택 정책을 쓸 수 있다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 경계</strong> — block commit으로 nonce와 잔고가 바뀌면
          이전에 유효했던 transaction도 stale해질 수 있다. 다만 recheck가 모든
          mempool mode의 필수 절차이거나, 누락 시
          consensus가 곧바로 실패한다는 뜻은 아니다.
        </p>
      </div>
    </section>
  );
}
