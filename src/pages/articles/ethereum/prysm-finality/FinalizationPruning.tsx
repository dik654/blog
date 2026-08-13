import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";

export default function FinalizationPruning({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="finalization-pruning" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Finalization은 accountable safety를 만들고 prune의 하한을 제공한다</h2>

      <ExplainedFormula
        question="충돌하는 두 checkpoint가 각각 2/3 vote를 받았다면 최소 얼마의 stake가 양쪽에 겹칠까요?"
        idea="전체 stake W 안에 크기가 각각 최소 2W/3인 두 voter 집합을 넣으면, 포함-배제 원리에 따라 교집합은 최소 W/3입니다. 충돌 vote에 모두 들어간 validator는 slashing evidence를 남깁니다."
        formula={String.raw`|Q_1\cap Q_2|\;\ge\;|Q_1|+|Q_2|-W\;\ge\;\frac{W}{3}`}
        terms={[
          { symbol: "W", name: "전체 활성 잔액", description: "전체 active effective balance(Gwei)" },
          { symbol: "Q_1,Q_2", name: "충돌 쿼럼", description: "충돌하는 checkpoint link 각각을 지지한 balance 집합" },
          { symbol: "Q_1\\cap Q_2", name: "쿼럼 교집합", description: "양쪽 vote에 모두 참여해 slashable evidence를 만든 최소 겹침" },
        ]}
        assumptions={[
          "두 link가 실제로 conflicting finality를 만들고 Casper slashing condition이 적용됩니다.",
          "Validator identity와 effective balance를 같은 relevant validator set에서 비교합니다.",
          "Slashing evidence가 존재한다는 것과 공격자가 즉시 적발·처벌되거나 chain data가 available하다는 것은 별개입니다.",
        ]}
        interpretation="전체가 96 ETH이면 각 quorum은 최소 64 ETH이고 두 quorum의 겹침은 최소 32 ETH입니다. 이것이 accountable safety의 수량적 핵심이지만 1/3 이상이 Byzantine일 때 conflicting finality가 절대 불가능하다는 뜻은 아닙니다."
      />

      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef("fc-store", codeRefs["fc-store"])} />
        <span className="self-center text-xs text-muted-foreground">분석한 snapshot의 finalized checkpoint 반영 확인</span>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Finalization pattern은 연속된 justification history를 검사합니다</h3>
        <p>
          Consensus state는 recent justification을 bit window로 유지하고 old previous/current justified checkpoint의 epoch와
          현재 epoch 차이를 대조합니다. 인접 epoch가 연속 justified되는 경우와 한 epoch gap을 허용하는 규격 pattern이 따로
          있으므로 단일 counter가 threshold를 두 번 넘었다는 정보만으로는 같은 결과를 재현할 수 없습니다. Fork별 spec
          function을 oracle로 두고 fixture마다 bits와 checkpoint tuple을 저장합니다.
        </p>

        <h3>Prune은 finality 결정 뒤의 storage lifecycle입니다</h3>
        <p>
          Finalized checkpoint와 충돌하는 branch는 fork-choice 후보에서 제거할 수 있고, finalized root 이전의 transient node와
          weight cache도 수명 정책에 따라 정리할 수 있습니다. 다만 block archive, slashing evidence, historical state와 API
          retention은 별도 owner를 갖습니다. Fork-choice tree에서 prune했다고 디스크의 모든 역사 데이터를 지워도 된다는 뜻은
          아닙니다.
        </p>
        <p>
          Crash-safe prune은 새 finalized checkpoint와 prune intent를 기록하고, child relink·cache 삭제·persisted index 갱신을
          idempotent 단계로 수행한 뒤 완료 marker를 남깁니다. 중간에 재시작하면 marker와 generation을 보고 계속하거나 이전
          snapshot으로 복구합니다. 먼저 node를 지우고 finalized pointer 쓰기에 실패하면 parent 없는 retained node가 남는 반례가
          생깁니다.
        </p>

        <h3>Release gate</h3>
        <p>
          Base와 candidate에 동일 checkpoint vote fixture를 주고 exact-threshold 63/96·64/96, duplicate validator,
          slashable overlap, skipped epoch, competing roots, reorg와 prune crash를 재생합니다. Justified/finalized tuple,
          justification bits, retained tree, restart head와 evidence availability가 모두 같아야 하며 그 뒤 prune time·memory·DB
          size를 비교합니다.
        </p>
      </div>
    </section>
  );
}
