import { codeRefs } from "./codeRefs";
import BlockStoreViz from "./viz/BlockStoreViz";
import type { CodeRef } from "@/components/code/types";

export default function BlockStoreSection({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="blockstore" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BlockStore 추적</h2>
      <div className="not-prose mb-8">
        <BlockStoreViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {/* ── BlockStore struct ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">
          BlockStore — Part 단위 저장
        </h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
              BlockStore 필드
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>
                <code className="text-xs">db dbm.DB</code>
              </li>
              <li>
                <code className="text-xs">mtx cmtsync.RWMutex</code>
              </li>
              <li>
                <code className="text-xs">base, height int64</code> — oldest,
                newest heights
              </li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">
              Key 레이아웃 (goleveldb)
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>
                <code className="text-xs">BH:{"{height}"}</code> → BlockMeta
                (블록 요약)
              </li>
              <li>
                <code className="text-xs">
                  P:{"{height}"}:{"{partIndex}"}
                </code>{" "}
                → block part
              </li>
              <li>
                <code className="text-xs">SC:{"{height}"}</code> → seenCommit
              </li>
              <li>
                <code className="text-xs">C:{"{height}"}</code> → extendedCommit
                (validator 서명)
              </li>
            </ul>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">
              SaveBlock 흐름
            </div>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>
                BlockMeta 저장 (<code className="text-xs">NewBlockMeta</code>)
              </li>
              <li>각 Part 저장 (65KB 단위)</li>
              <li>
                Commits 저장 (<code className="text-xs">LastCommit</code> +{" "}
                <code className="text-xs">seenCommit</code>)
              </li>
              <li>Batch commit (atomic)</li>
            </ol>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-2">
              Part 분할 이유
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Block 크기 수 KB ~ 수 MB (variable)</li>
              <li>DB write: 작은 단위가 효율적</li>
              <li>P2P gossip: Part 단위로 전파</li>
              <li>네트워크/저장 동일 구조 → unified model</li>
            </ul>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">
              LoadBlock 흐름
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>BlockMeta 조회 → Part 수 확인</p>
              <p>각 Part 로드 + 재조립</p>
              <p>Block 구조체 복원</p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4 sm:col-span-2">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
              용량 추정에 필요한 관측값
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>height당 실제 block·commit bytes</li>
              <li>평균 block interval과 empty block 비율</li>
              <li>index·DB overhead와 pruning retain height</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          BlockStore는 block을 P2P 전파와 같은 PartSet 구조로 나누어 저장하고,
          BlockMeta와 commit을 함께 조회할 수 있게 한다. Part 크기와 저장
          transaction의 세부 경계는 해당 version의 구현과 설정을 기준으로
          확인해야 한다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 파트 분할 저장</strong> — 블록이 수 MB까지 커질 수 있어 한
          frame으로 다루기보다 part로 나누면 전파·재요청·조립을 점진적으로
          수행할 수 있다. 저장소도 같은 part index를 사용해 network와 storage의
          block 표현을 연결한다.
        </p>
      </div>
    </section>
  );
}
