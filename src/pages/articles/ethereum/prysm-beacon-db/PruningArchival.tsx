import ExplainedFormula from "@/components/ui/explained-formula";
import type { CodeRef } from "@/components/code/types";

export default function PruningArchival({
  onCodeRef: _,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="pruning-archival" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Pruning은 finality fence와 복구 가능성을 확인한 뒤 primary와 index를
        함께 지운다
      </h2>
      <ExplainedFormula
        question="State snapshot 간격 R이 커질 때 최악의 replay 길이는 어떻게 바뀔까요?"
        idea={
          <>
            가장 가까운 보존 state에서 요청 slot까지 block/empty-slot
            transition을 재생합니다. 균등 간격 R이면 snapshot 사이 요청의 최대
            replay step은 R−1입니다.
          </>
        }
        formula={String.raw`N_{\rm replay,max}=R-1`}
        terms={[
          {
            symbol: "R",
            name: "Retention interval",
            description: "직접 보존한 state snapshot 사이 slot 간격입니다.",
          },
          {
            symbol: "N_{\rm replay,max}",
            name: "Maximum replay steps",
            description:
              "균등 간격 안에서 요청 state를 복원할 최대 transition 수입니다.",
          },
        ]}
        assumptions={[
          "중간 block·fork rule과 시작 snapshot이 모두 가용합니다.",
          "Finality·weak-subjectivity·API retention의 최소 요구를 먼저 만족합니다.",
          "Transition별 비용이 동일하다는 뜻은 아니며 epoch/fork boundary는 더 비쌀 수 있습니다.",
        ]}
        interpretation="R=32이면 단순 최악은 31 step입니다. Disk 절감과 query latency를 이 숫자 하나로 결정하지 않고 p95 replay time·backup restore·availability를 함께 측정합니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Logical delete와 file shrink는 다릅니다</h3>
        <p>
          Pruner는 finalized ancestry·reader lease·backup watermark보다 오래된
          non-canonical object를 고르고 primary와 모든 reverse/slot index를 한
          transaction에서 제거합니다. bbolt에서 삭제 page가 free list로 돌아가도
          파일 크기가 즉시 줄지 않을 수 있으므로 live bytes, free/reusable
          pages와 filesystem bytes를 분리해 봅니다.
        </p>
        <h3>Compaction은 별도 migration입니다</h3>
        <p>
          Compaction은 큰 I/O와 temporary capacity를 요구하며
          crash·disk-full에서 원본을 보존해야 합니다. Snapshot/backup을 검증하고
          reader·writer quiescence 또는 지원되는 online contract를 지킨 뒤
          temporary artifact를 완성하고 atomic switch합니다. Delete 직후 파일
          크기가 그대로라고 다시 위험하게 삭제하지 않습니다.
        </p>
        <h3>Archive와 serving contract</h3>
        <p>
          Validator node, historical RPC와 분석 indexer는 필요한 조회 범위가
          다릅니다. Retention horizon, reconstructable base, backup RPO/RTO,
          API의 oldest available slot을 명시하고 pruning 전에 restore drill을
          수행합니다. Consensus DB 하나에 무기한 분석 책임을 떠넘기지 않습니다.
        </p>
        <h3>Release gate</h3>
        <p>
          Duplicate save, competing blocks at one slot, transaction crash
          points, stale cache, dangling index, finalized/non-finalized fork,
          prune interruption, disk-full, migration과 compaction restart를
          base/candidate에 주입합니다. Bytes/root/index/checkpoint parity와
          restore 성공을 통과한 뒤 write p95, fsync, read amplification, DB
          growth와 reclaim을 비교합니다.
        </p>
      </div>
    </section>
  );
}
