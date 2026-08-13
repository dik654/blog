import ExplainedFormula from "@/components/ui/explained-formula";
import CometBFTCoreViz, { EvidenceLedgerViz } from "../cometbft-core-viz";
export default function ValidatorSet() {
  return (
    <section id="validator-set" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">ValidatorSet은 검증 weight snapshot이고 proposer priority는 별도 scheduler state다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Validator는 address·public key·voting power와 proposer priority를 가집니다. Public key와 power는 vote를
          검증하고 quorum weight를 계산하는 합의 입력입니다. 반면 proposer priority는 다음 proposer를 고르는 누적
          scheduler 값이므로 block certificate의 의미와 혼동하면 안 됩니다.
        </p>
      </div>
      <CometBFTCoreViz mode="validators" />
      <ExplainedFormula
        question="Voting power가 큰 validator에게 비례적으로 proposal 기회를 주면서 연속 독점을 막으려면 어떻게 갱신할까요?"
        idea={<>각 round에 모든 priority에 자신의 power를 더하고 최고 priority를 선택한 뒤, 선택자에게 전체 power만큼 비용을 부과합니다. 여러 round를 보면 제안 횟수가 weight에 가까워집니다.</>}
        formula={String.raw`\begin{aligned}p_i&\gets p_i+w_i,\\ j&\gets\arg\max_i p_i,\\ p_j&\gets p_j-W\end{aligned}`}
        terms={[
          { symbol: "p_i", name: "Proposer priority", description: "Validator i의 round 시작 proposer priority입니다." },
          { symbol: "w_i", name: "Voting power", description: "Validator i의 voting power입니다." },
          { symbol: "W", name: "Total power", description: "Validator set의 total voting power입니다." },
          { symbol: "j", name: "Selected proposer", description: "갱신 뒤 priority가 가장 높은 validator입니다." },
        ]}
        assumptions={["동일 validator set snapshot과 deterministic tie-break를 사용합니다.", "실제 구현의 normalization·rescaling·set update는 v0.40.0 source를 함께 확인합니다.", "이 식은 proposer scheduling이며 consensus safety를 단독으로 증명하지 않습니다."]}
        interpretation="Power가 3:1이면 장기적으로 앞 validator가 더 자주 선택되지만, 선택할 때 W를 빼므로 매 round 같은 validator가 자동으로 독점하지 않습니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Validator update에는 높이 지연이 있습니다</h3>
        <p>
          Application이 FinalizeBlock에서 반환한 update가 어느 height의 block validation과 last-commit 정보에 반영되는지는
          protocol lifecycle에 의해 정해집니다. 운영 로그에는 “현재 set”, “다음 set”, “commit을 검증한 historical set”을
          구분하고 height와 hash를 함께 남겨야 합니다. 최신 set으로 과거 commit을 검증하면 정상 서명을 잘못 거부할 수 있습니다.
        </p>
        <p>
          작은 계산으로 power가 3과 1이고 priority가 둘 다 0이라고 하겠습니다. 첫 round에 power를 더하면 3과 1이므로
          첫 validator를 고르고 total power 4를 빼 priority는 -1과 1이 됩니다. 다음 round에 다시 power를 더하면 2와
          2가 되므로 pinned implementation의 deterministic tie-break가 proposer를 정합니다. 이 예는 scheduling 계산이지
          proposal validity나 commit certificate가 아닙니다.
        </p>
        <h3>Evidence는 signed conflict에서 application policy까지 이어지는 pipeline입니다</h3>
        <p>
          DuplicateVoteEvidence는 같은 validator·height·round·vote type인데 BlockID가 다른 두 signed vote를 묶습니다.
          하지만 두 bytes를 찾았다는 사실만으로 처벌이 끝나지는 않습니다. 당시 membership·power와 signature, chain ID,
          age, 이미 commit됐는지를 검증하고 block에 포함한 뒤 FinalizeBlock의 misbehavior 입력으로 application에 전달합니다.
        </p>
      </div>
      <EvidenceLedgerViz />
      <div id="paper-cometbft-evidence-v040" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 규격 읽기 · evidence accountability</p>
        <p className="mt-2 text-sm font-semibold">CometBFT Evidence Specification</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">문제는 Byzantine 행동을 객관적으로 검증·gossip·commit해 application에 전달하는 것입니다. 이 규격은 detection과 on-chain delivery를 설명하지만 경제적 penalty의 크기나 모든 공격의 예방까지 보장하지 않습니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://github.com/cometbft/cometbft/blob/v0.40.0/spec/consensus/evidence.md" target="_blank" rel="noreferrer">v0.40.0 evidence 규격 보기</a>
      </div>
    </section>
  );
}
